// Import necessary modules
require("dotenv").config();

const extractClause = require("extractClause")
const fs = require("fs");
const path = require("path");
const axios = require("axios");
const cheerio = require("cheerio");
// const { pipeline } = require('@huggingface/transformers');
const { HfInference } = require("@huggingface/inference");

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
    const response = await axios.get(url, { responseType: "stream" });
    response.data.pipe(fs.createWriteStream(filePath));
    return new Promise((resolve, reject) => {
      response.data.on("end", () => resolve());
      response.data.on("error", (err) => reject(err));
    });
  } catch (error) {
    if (error.response && error.response.status === 404) {
      console.error(`Error: Resource not found at ${url}`);
    } else {
      console.error(`Error downloading file from ${url}:`, error.message);
    }
  }
}

// Function to extract plain text from HTML
function extractTextFromHTML(htmlContent) {
  const $ = cheerio.load(htmlContent);

  // Remove scripts, styles, and irrelevant elements
  $("script, style, noscript, iframe, link, meta, svg").remove();

  const mainContent = $(
    'body'
  );
  // Extract the text from relevant sections
  const text = mainContent
    .text()
    .replace(/\s+/g, " ") // Normalize spaces
    .replace(/\n\s*\n/g, '\n\n') // 去除多余空行
    .trim(); // 去除首尾空格

  return text;
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
      console.log("Status: Acceptable");
      return {
        status: "Acceptable",
        labels: result.labels,
      };
    } else {
      console.log("Status: Warning - Unrecognized Content");
      return {
        status: "Warning",
        labels: result.labels,
        message: "Unrecognized Content - Manual Review Recommended",
      };
    }
  } catch (error) {
    console.error("Error during classification:", error.message);
    if (error.response) {
      console.error("Response data:", error.response.data);
    }
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
    const prefix = containsTC ? 'TC' : 'Review';
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
  //    const services = readJSONFile('services-details.json');
  const services = readJSONFile("db.jan20.json");
  console.log(services.length + " services found");
  const limit = all ? services.length : 5;
  console.log(limit + " services will be downloaded");
  console.log("--------------------------------");
  shuffleArray(services);
  
  for (let i = 0; i < limit; i++) {
    const service = services[i]; // ["services"][0];

    console.log(JSON.stringify(service, null, 2));

    // Debugging: Check if service has a name
    if (!service.name) {
      console.error(`Service at index ${i} is missing a name.`);
      continue; // Skip this service
    }

    const dataDirName = all ? `data_all_${timestamp}` : `data_trial_${timestamp}`;
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

    // Extract plain text from HTML and save as .txt file
    const htmlContent = fs.readFileSync(htmlFilePath, "utf8");
    const serviceText = extractTextFromHTML(htmlContent);
    const textFilePath = path.join(serviceDir, "service.txt");
    fs.writeFileSync(textFilePath, serviceText);

    // Analyze HTML and download documents
    const $ = cheerio.load(htmlContent);
    const documentLinks = $(".service-documents a")
      .map((_, el) => $(el).attr("href"))
      .get();

    const documentsDir = path.join(serviceDir, "documents");
    createDirectory(documentsDir);

    for (const link of documentLinks) {
      const fileName = path.basename(link);
      const filePath = path.join(documentsDir, `${fileName}.html`);
      
      try {
        await downloadFile(link, filePath);

        // Read and analyze the downloaded document
        const documentContent = fs.readFileSync(filePath, "utf8");
        const documentText = extractTextFromHTML(documentContent);
        fs.writeFileSync(`${filePath}.txt`, documentText);

        // Check if the document text contains T&C
        const containsTC = await checkForTermsAndConditions(documentText);
        if (containsTC) {
          console.log(
            `The document ${fileName} for service ${service.name} contains T&C.`
          );
        } else {
          console.log(
            `The document ${fileName} for service ${service.name} does not contain T&C.`
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
}

// Parse command line arguments
const args = process.argv.slice(2);
const all = args.includes("--all");
const timestamp = new Date()
.toISOString()
.replace(/[-:T.]/g, "")
.slice(0, 15);

// Run the script
downloadData(all)
  .then(() => {
    console.log("Download completed.");
  })
  .catch((err) => {
    console.error("Error downloading data:", err);
  });
