const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');
const https = require('https');

// Function to add delay between requests
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Function to check if file exists and is valid
const isValidFile = (filePath) => {
    if (!fs.existsSync(filePath)) {
        return false;
    }
    const content = fs.readFileSync(filePath, 'utf8');
    return !content.includes('503 first byte timeout');
};

// Function to fetch HTML content from a URL with retries
const fetchHtml = async (url, retries = 3) => {
    for (let i = 0; i < retries; i++) {
        try {
            const response = await new Promise((resolve, reject) => {
                https.get(url, (res) => {
                    if (res.statusCode === 503) {
                        reject(new Error('503 Service Unavailable'));
                        return;
                    }
                    let data = '';
                    res.on('data', (chunk) => data += chunk);
                    res.on('end', () => resolve(data));
                }).on('error', reject);
            });
            
            if (response.includes('503 first byte timeout')) {
                throw new Error('503 first byte timeout in response');
            }
            
            return response;
        } catch (error) {
            if (i === retries - 1) throw error;
            await delay(1000 * (i + 1)); // Exponential backoff
        }
    }
};

// Function to save HTML content to a file
const savePointHtml = (content, pointId) => {
    const dir = path.join(process.cwd(), 'points_html');
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(path.join(dir, `point_${pointId}.html`), content);
};

const saveCaseHtml = (content, caseId) => {
    const dir = path.join(process.cwd(), 'cases_html');
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(path.join(dir, `case_${caseId}.html`), content);
};

// Function to extract point ID from edit link
const extractPointId = (editLink) => {
    const match = editLink.match(/\/points\/(\d+)/);
    return match ? match[1] : null;
};

// Function to process a single point
const processPoint = async (pointId, pointPageUrl) => {
    const filePath = path.join(process.cwd(), 'points_html', `point_${pointId}.html`);
    
    // Check if file already exists and is valid
    if (isValidFile(filePath)) {
        return fs.readFileSync(filePath, 'utf8');
    }
    
    // Add delay to prevent overwhelming the server
    await delay(500); // 500ms delay between requests
    
    const editPageHtml = await fetchHtml(pointPageUrl);
    savePointHtml(editPageHtml, pointId);
    return editPageHtml;
};


const extractCaseId = (caseUrl) => {
    const match = caseUrl.match(/\/cases\/(\d+)/);
    return match ? match[1] : null;
};

// Function to process a single case
const processCase = async (caseId, casePageUrl) => {
    const filePath = path.join(process.cwd(), 'cases_html', `case_${caseId}.html`);
    
    // Check if file already exists and is valid
    if (isValidFile(filePath)) {
        return fs.readFileSync(filePath, 'utf8');
    }
    
    // Add delay to prevent overwhelming the server
    await delay(500); // 500ms delay between requests
    
    const casePageHtml = await fetchHtml(casePageUrl);
    saveCaseHtml(casePageHtml, caseId);
    return casePageHtml;
};

const extractClauses = async (htmlContent) => {
    const $ = cheerio.load(htmlContent);

    // Extract Meta Data
    const metaData = {
        title: $('title').text() || null,
        meta: {
            charset: $('meta[charset]').attr('charset') || null,
            viewport: $('meta[name="viewport"]').attr('content') || null
        }
    };

    // Extract Clauses
    const clauses = [];
    for (const elem of $('.service-points li').toArray()) {
        const point = $(elem);
        const clause = {};

        // Extract Title
        clause.title = point.find('.point-text h3').text().trim() || null;

        // Extract Rating
        if (point.hasClass('point-good')) {
            clause.rating = 'good';
        } else if (point.hasClass('point-blocker')) {
            clause.rating = 'blocker';
        } else if (point.hasClass('point-bad')) {
            clause.rating = 'bad';
        } else if (point.hasClass('point-neutral')) {
            clause.rating = 'neutral';
        } else {
            clause.rating = 'unknown';
        }

        // Extract Description
        clause.description = point.find('.point-description').text().trim() || null;

        // Extract Last Updated
        const lastUpdated = point.find('.updated-on').attr('title');
        clause.last_updated = lastUpdated ? lastUpdated.replace("Last updated: ", "") : null;

        // Extract Edit Link
        clause.point_link = point.find('.edit-icon').attr('href') || null;

        // Fetch and process edit page if edit link exists
        if (clause.point_link) {
            try {
                const pointId = extractPointId(clause.point_link);
                if (pointId) {
                    const pointPageUrl = `https://edit.tosdr.org/points/${pointId}`;
                    const pointPageHtml = await processPoint(pointId, pointPageUrl);
                    
                    // Extract approval status
                    const $point = cheerio.load(pointPageHtml);
                    const statusElement = $point('body > div.container > div:nth-child(3) > div:nth-child(2) > span.label.label-success > span');
                    clause.approval_status = statusElement.text().trim() || null;
                    // Extract clause text from the specified selector
                    // const clauseTextElement = $edit('body > div.container > div:nth-child(7) > div');
                    // document.querySelector("body > div.container > div:nth-child(7) > div")

                    // /html/body/div[2]/div[4]/div/text()
                    // const clauseText = $edit('html > body > div:nth-child(2) > div:nth-child(4) > div').text().trim() || null;

                    // clause.clause_text = clauseText; //clauseTextElement.text().trim() || null;
                    // console.log(clause.clause_text);
                    
                    // Debug: Log the entire HTML structure
                    console.info(`Processing point ${pointId}`);
                    
                    // Try multiple possible selectors for the clause text
                    const selectors = [
                       'div.container div:nth-child(7) div',
                       'div.container div:nth-child(6) div blockquote'
                    ];
                    // col-sm-10 col-sm-offset-1 p30 bgw
                    // document.querySelector("body > div.container > div:nth-child(7) > div")
                    // body > div.container > div:nth-child(7) > div

                    let clauseText = null;
                    for (const selector of selectors) {
                        const element = $point(selector);
                        if (element.length > 0) {
                            // Check if the element has a sub-element footer and remove it
                            element.find('footer').remove();
                            clauseText = element.text().trim();
                            console.info(`Found text using selector: ${selector}`);
                            break;
                        }
                    }
                    
                    clause.clause_text = clauseText;
                    
                    // If still null, log the relevant part of the HTML for debugging
                    if (!clauseText) {
                        console.log(`Could not find clause text for point ${pointId}, url: ${pointPageUrl} `);
                    }
                    
                    // Extract point source: the T&C document link
                    const sourceElement = $point('body > div.container > div:nth-child(3) > div:nth-child(5) > a');
                    clause.point_source =  sourceElement.attr('href') || null;

                    // // Extract additional point details
                    // clause.point_source = $edit('body > div.container > div:nth-child(3) > div:nth-child(5) > a').text().trim() || null;
                    // Extract point case
                    // clause.point_case = $edit('body > div.container > div:nth-child(3) > div:nth-child(3) > a').text().trim() || null;
                    // console.log(clause.point_case);

                    // Extract case details - get the text and href
                    const caseElement = $point('body > div.container > div:nth-child(3) > div:nth-child(3) > a');
                    const caseId = extractCaseId(caseElement.attr('href'));
                    const casePageUrl= `https://edit.tosdr.org${caseElement.attr('href')}` || null
                    clause.case = {
                        text: caseElement.text().trim() || null,
                        href: casePageUrl 
                    };

                    const casePageHtml = await processCase(caseId, casePageUrl);

                }
            } catch (error) {
                console.error(`Error processing point "${clause.title}" (${clause.point_link}):`, error.message);
                clause.approval_status = null;
            }
        }

        clauses.push(clause);
    }

    // Create the final JSON structure
    const jsonData = {
        meta_data: metaData,
        clauses: clauses
    };

    return jsonData;
};

// Export the function to use in other files
module.exports = extractClauses;
