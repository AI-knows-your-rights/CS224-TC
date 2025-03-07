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
const saveHtml = (content, pointId) => {
    const dir = path.join(process.cwd(), 'points_html');
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(path.join(dir, `point_${pointId}.html`), content);
};

// Function to extract point ID from edit link
const extractPointId = (editLink) => {
    const match = editLink.match(/\/points\/(\d+)/);
    return match ? match[1] : null;
};

// Function to process a single point
const processPoint = async (pointId, editPageUrl) => {
    const filePath = path.join(process.cwd(), 'points_html', `point_${pointId}.html`);
    
    // Check if file already exists and is valid
    if (isValidFile(filePath)) {
        return fs.readFileSync(filePath, 'utf8');
    }
    
    // Add delay to prevent overwhelming the server
    await delay(500); // 500ms delay between requests
    
    const editPageHtml = await fetchHtml(editPageUrl);
    saveHtml(editPageHtml, pointId);
    return editPageHtml;
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
        clause.edit_link = point.find('.edit-icon').attr('href') || null;

        // Fetch and process edit page if edit link exists
        if (clause.edit_link) {
            try {
                const pointId = extractPointId(clause.edit_link);
                if (pointId) {
                    const editPageUrl = `https://edit.tosdr.org/points/${pointId}`;
                    const editPageHtml = await processPoint(pointId, editPageUrl);
                    
                    // Extract approval status
                    const $edit = cheerio.load(editPageHtml);
                    const statusElement = $edit('body > div.container > div:nth-child(3) > div:nth-child(2) > span.label.label-success > span');
                    clause.approval_status = statusElement.text().trim() || null;
                }
            } catch (error) {
                console.error(`Error processing point "${clause.title}" (${clause.edit_link}):`, error.message);
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
