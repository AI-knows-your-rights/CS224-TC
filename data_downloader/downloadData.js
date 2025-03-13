// Import necessary modules
require("dotenv").config();

const fs = require("fs");
const path = require("path");
const axios = require("axios");
const cheerio = require("cheerio");
// const { pipeline } = require('@huggingface/transformers');
const { HfInference } = require("@huggingface/inference");

const { promisify } = require('util');
const { analyzeFolder } = require('./analyzeFolder');

// Convert callback-based functions to promise-based
const readdir = promisify(fs.readdir);
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

const extractClauses = require('./extractClause');



// Function to read JSON file
function readJSONFile(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

// Function to shuffle an array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

// Function to create a directory if it doesn't exist
function createDirectory(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

// Function to download a file with error handling
async function downloadFile(url, filePath) {
  try {
    // Add headers to mimic a modern browser request
    const headers = {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
      'Accept-Language': 'en-US,en;q=0.9',
      'Accept-Encoding': 'gzip, deflate, br',
      'Connection': 'keep-alive',
      'Cache-Control': 'max-age=0',
      'Sec-Ch-Ua': '"Chromium";v="122", "Not(A:Brand";v="24", "Google Chrome";v="122"',
      'Sec-Ch-Ua-Mobile': '?0',
      'Sec-Ch-Ua-Platform': '"macOS"',
      'Sec-Fetch-Dest': 'document',
      'Sec-Fetch-Mode': 'navigate',
      'Sec-Fetch-Site': 'none',
      'Sec-Fetch-User': '?1',
      'Upgrade-Insecure-Requests': '1',
      'Referer': 'https://www.google.com/',
      'DNT': '1'
    };

    const response = await axios.get(url, { 
      responseType: "stream",
      headers: headers,
      timeout: 30000, // 30 second timeout
      maxRedirects: 5,
      validateStatus: function (status) {
        return status >= 200 && status < 500; // Accept all status codes less than 500
      },
      httpsAgent: new (require('https').Agent)({  
        rejectUnauthorized: false,
        keepAlive: true
      }),
      decompress: true, // Handle gzip responses
      withCredentials: true // Send cookies if any
    });

    // Ensure the directory exists before writing
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // Create write stream
    const writer = fs.createWriteStream(filePath);
    
    return new Promise((resolve, reject) => {
      response.data.pipe(writer);
      
      writer.on('finish', () => {
        writer.end();
        resolve();
      });
      
      writer.on('error', (err) => {
        fs.unlink(filePath, () => {}); // Clean up the file if there's an error
        reject(err);
      });
    });
  } catch (error) {
    if (error.response) {
      switch (error.response.status) {
        case 400:
          console.error(`Bad request (400) for ${url}. The server is rejecting the request.`);
          console.error(JSON.stringify(error.response.data, null, 2));
          break; 
        case 401:
          console.error(`Unauthorized (401) for ${url}. The server is rejecting the request.`);
          console.error(JSON.stringify(error.response.data, null, 2));
          break;
        case 403:
          console.error(`Access forbidden (403) for ${url}. The server is rejecting the request.`);
          console.error(JSON.stringify(error.response.data, null, 2));
          // Retry with a delay for 403 errors
          await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5 seconds
          return downloadFile(url, filePath); // Retry the download
        case 404:
          console.error(`Resource not found (404) at ${url}`);
          break;
        case 429:
          console.error(`Too many requests (429) for ${url}. Please wait before trying again.`);
          // Wait for a longer time before retrying
          await new Promise(resolve => setTimeout(resolve, 10000)); // Wait 10 seconds
          return downloadFile(url, filePath); // Retry the download
        default:
          console.error(`HTTP error ${error.response.status} for ${url}:`, error.message);
      }
    } else if (error.request) {
      console.error(`No response received for ${url}:`, error.message);
    } else {
      console.error(`Error setting up request for ${url}:`, error.message);
    }
    throw error; // Re-throw to handle in the calling function
  }
}

// Function to extract plain text from HTML
function extractTextFromHTML(htmlContent) {
  const $ = cheerio.load(htmlContent);

  // Remove scripts, styles, and irrelevant elements
  $("script, style, noscript, iframe, link, meta, svg, header, footer, nav").remove();

  // Get the main content
  const mainContent = $('body');

  // Process each element
  let processedText = '';
  
  // Process paragraphs and other block elements
  mainContent.find('p, div, section, article, h1, h2, h3, h4, h5, h6').each((_, element) => {
    const $element = $(element);
    const text = $element.text().trim();
    
    if (text) {
      // Add proper spacing between words
      const formattedText = text
        .replace(/\s+/g, ' ')  // Replace multiple spaces with single space
        .replace(/([.!?])\s*/g, '$1\n')  // Add newline after sentence endings
        .replace(/\n\s*\n/g, '\n\n')  // Remove extra newlines
        .trim();
      
      processedText += formattedText + '\n\n\n\n';
    }
  });

  // Process lists
  mainContent.find('ul, ol').each((_, element) => {
    const $element = $(element);
    $element.find('li').each((_, li) => {
      const text = $(li).text().trim();
      if (text) {
        processedText += `• ${text}\n`;
      }
    });
    processedText += '\n';
  });

  // console.log(`processedText: ${processedText}`);

  // Final cleanup removed \n\n
  final_cleaned_processedText = processedText
    .replace(/\n{3,}/g, '\n\n')  // Remove excessive newlines
    .replace(/\s+/g, ' ')  // Normalize spaces
    .trim()

  return processedText
}


const hf = new HfInference(process.env.HUGGINGFACE_API_TOKEN);
// Define the acceptable labels
const acceptableLabels = [
  "Terms and Conditions",
  "Privacy Policy",
  "User Agreement",
  "Legal Notice",
];
// Function to check for Terms and Conditions using Legal BERT model
async function checkForTermsAndConditions(text) {
  return {
    status: "Acceptable",
    message: "Classification Skipped",
  };
  try {
    const result = await hf.zeroShotClassification({
      model: "facebook/bart-large-mnli",
      inputs: text,
      parameters: {
        candidate_labels: [...acceptableLabels, 'Others'],
      },
    });

    // console.log(result[0].labels);
    const topLabel = result[0].labels[0];

    if ((acceptableLabels.includes(topLabel))) {
      console.log("Status: Acceptable T&C");
      return {
        status: "Acceptable",
        labels: result.labels,
      };
    } else {
      console.log("Status: Warning - Unrecognized T&C, manual review recommended");
      return {
        status: "Warning",
        labels: result.labels,
        message: "Unrecognized Content - Manual Review Recommended",
      };
    }
  } catch (error) {
    console.error("Error during classification:", error.message);
    return {
      status: "Error",
      message: "Classification failed",
    };
  }
}


// Function to check the next available filename
function getNextFileName(directory, prefix) {
    let index = 1;
    let fileName;

    do {
        fileName = `${prefix}_${String(index).padStart(2, '0')}.txt`;
        index++;
    } while (fs.existsSync(path.join(directory, fileName)));

    return fileName;
}

async function saveDocument(documentText, fileName, serviceName, containsTC, documentsDir) {
    // Set the directory for saving files
    const originalDir = documentsDir;
    // Determine the prefix and filename
    const prefix = containsTC.status === "Acceptable" ? 'TC' : 'Review';
    const newFileName = getNextFileName(originalDir, prefix);

    // Save the document
    const filePath = path.join(originalDir, newFileName);
    fs.writeFileSync(filePath, documentText, 'utf8');

    console.log(
        `The document ${fileName} for service ${serviceName} has been saved as ${newFileName}.`
    );
}




// Main function to download data
async function downloadData(all = false) {
  const timestamp = new Date()
    .toISOString()
    .replace(/[-:T.]/g, "")
    .slice(0, 15);
    
  const dataDirName = all ? `data_all_${timestamp}` : `data_trial_${timestamp}`;
  
  //    const services = readJSONFile('services-details.json');
  const services = readJSONFile("db.jan20.json");
  console.log(services.length + " services found");
  const limit = all ? services.length : 5;
  console.log(limit + " services will be downloaded");
  console.log("--------------------------------");
  shuffleArray(services);
  
  for (let i = 0; i < limit; i++) {
    const service = services[i];

    console.log(JSON.stringify(service, null, 2));

    // Debugging: Check if service has a name
    if (!service.name) {
      console.error(`Service at index ${i} is missing a name.`);
      continue; // Skip this service
    }

    const serviceDir = path.join(__dirname, `../${dataDirName}`, service.name);

    createDirectory(serviceDir);

    // Save service details
    fs.writeFileSync(
      path.join(serviceDir, "details.json"),
      JSON.stringify(service, null, 2)
    );

    // Download service page
    const serviceUrl = `https://tosdr.org/en/service/${service.id}`;
    const htmlFilePath = path.join(serviceDir, "service.html");
    await downloadFile(serviceUrl, htmlFilePath);

    const htmlContent = await readFile(htmlFilePath, 'utf-8');

    // Extract clauses and generate JSON data
    const jsonData = await extractClauses(htmlContent);

    // Define the path for the output JSON file
    const jsonFilePath = path.join(serviceDir, 'clauses.json');

    // Save the JSON data to clauses.json
    await writeFile(jsonFilePath, JSON.stringify(jsonData, null, 4), 'utf-8');
    console.log(`JSON file generated successfully at "${jsonFilePath}"`);

    // Extract plain text from HTML and save as .txt file
    const serviceText = extractTextFromHTML(htmlContent);
    const textFilePath = path.join(serviceDir, "service.txt");
    fs.writeFileSync(textFilePath, serviceText);

    // Analyze HTML and download documents
    const $ = cheerio.load(htmlContent);
    const documentLinks = $(".service-documents a")
      .map((_, el) => $(el).attr("href"))
      .get()
      // Remove %20 from URLs and get unique links
      .map(link => link.replace(/%20$/, ''))
      .filter((link, index, self) => self.indexOf(link) === index);

    const documentsDir = path.join(serviceDir, "documents");
    createDirectory(documentsDir);

    for (const link of documentLinks) {
      const fileName = path.basename(link).replace(/%20$/, '');
      const filePath = path.join(documentsDir, `${fileName}.html`);
      
      try {
        await downloadFile(link, filePath);

        // Read and analyze the downloaded document
        const documentContent = fs.readFileSync(filePath, "utf8");
        const documentText = extractTextFromHTML(documentContent);
        fs.writeFileSync(`${filePath}.txt`, documentText);

        // Check if the document text contains T&C
        const containsTC = await checkForTermsAndConditions(documentText);
        if (containsTC.status === "Acceptable") {
          console.log(
            `The document ${fileName} for service ${service.name} contains T&C.`
          );
        } else if (containsTC.status === "Warning") {
          console.log(
            `The document ${fileName} for service ${service.name} contains T&C.`
          );
        } else {
          console.log(
            `The document ${fileName} for service ${service.name} failed to classify.`
          );
        }

        await saveDocument(documentText, fileName, service.name, containsTC, documentsDir);
      } catch (error) {
        console.error(`Error processing document ${fileName} for service ${service.name}:`, error.message);
        // Optionally, you can continue to the next document or service
        continue;
      }
    }
  }
  return dataDirName;
}

// Parse command line arguments
const args = process.argv.slice(2);
const all = args.includes("--all");

// Run the script
downloadData(all)
  .then((dataDirName) => {
    console.log("Download completed for " + dataDirName);
    return dataDirName;
  })
  .catch((err) => {
    console.error("Error downloading data:", err);
    process.exit(1);
  })
  .then((dataDirName) => {
    if (!dataDirName) {
      throw new Error("No data directory name available for analysis");
    }
    console.log("Analyzing data...");
    return analyzeFolder(path.join(__dirname, '..', dataDirName));
  })
  .then(() => {
    console.log("Data analysis completed.");
  })
  .catch((err) => {
    console.error("Error analyzing data:", err);
    process.exit(1);
  });