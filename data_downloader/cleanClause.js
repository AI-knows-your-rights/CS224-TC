const fs = require('fs');
const path = require('path');
const extractClauses = require('./extractClause');
const { parseArgs } = require('node:util');
const { promisify } = require('util');

// Convert callback-based functions to promise-based
const readdir = promisify(fs.readdir);
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

// Define command-line options
const options = {
    folder: {
        type: 'string',
        short: 'f',
        description: 'The path to the target folder',
        required: true,
    },
};

// Process a single folder
async function processFolder(subfolderPath) {
    const htmlFilePath = path.join(subfolderPath, 'service.html');

    // Check if service.html exists in the subfolder
    if (!fs.existsSync(htmlFilePath)) {
        console.warn(`No "service.html" found in "${subfolderPath}". Skipping...`);
        return;
    }

    try {
        // Read the HTML content
        const htmlContent = await readFile(htmlFilePath, 'utf-8');

        // Extract clauses and generate JSON data
        const jsonData = await extractClauses(htmlContent);

        // Define the path for the output JSON file
        const jsonFilePath = path.join(subfolderPath, 'clauses.json');

        // Save the JSON data to clauses.json
        await writeFile(jsonFilePath, JSON.stringify(jsonData, null, 4), 'utf-8');
        console.log(`JSON file generated successfully at "${jsonFilePath}"`);
    } catch (err) {
        console.error(`Error processing folder "${subfolderPath}":`, err);
    }
}

// Main function to process all folders
async function main() {
    try {
        // Parse command-line arguments
        const args = parseArgs({ options });
        const targetFolder = args.values.folder;

        // Check if the target folder exists
        if (!fs.existsSync(targetFolder)) {
            console.error(`The folder "${targetFolder}" does not exist.`);
            process.exit(1);
        }

        // Read the contents of the target folder
        const entries = await readdir(targetFolder, { withFileTypes: true });

        // Filter for directories only
        const subfolders = entries.filter(entry => entry.isDirectory());

        // Process folders sequentially
        console.log(`Starting to process ${subfolders.length} folders...`);
        for (const subfolder of subfolders) {
            const subfolderPath = path.join(targetFolder, subfolder.name);
            console.log(`Processing folder: ${subfolder.name}`);
            await processFolder(subfolderPath);
        }
        
        console.log('All folders have been processed.');
    } catch (err) {
        console.error('Error in main process:', err);
        process.exit(1);
    }
}

// Run the main function
main().catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
});