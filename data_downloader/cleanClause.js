const fs = require('fs');
const path = require('path');
const extractClauses = require('./extractClauses');
const { parseArgs } = require('node:util');

// Define command-line options
const options = {
    folder: {
        type: 'string',
        short: 'f',
        description: 'The path to the target folder',
        required: true,
    },
};

// Parse command-line arguments
const args = parseArgs({ options });
const targetFolder = args.values.folder;

// Check if the target folder exists
if (!fs.existsSync(targetFolder)) {
    console.error(`The folder "${targetFolder}" does not exist.`);
    process.exit(1);
}

// Read the contents of the target folder
fs.readdir(targetFolder, { withFileTypes: true }, (err, entries) => {
    if (err) {
        console.error(`Error reading the folder "${targetFolder}":`, err);
        process.exit(1);
    }

    // Filter for directories only
    const subfolders = entries.filter(entry => entry.isDirectory());

    subfolders.forEach(subfolder => {
        const subfolderPath = path.join(targetFolder, subfolder.name);
        const htmlFilePath = path.join(subfolderPath, 'service.html');

        // Check if service.html exists in the subfolder
        if (fs.existsSync(htmlFilePath)) {
            // Read the HTML content
            fs.readFile(htmlFilePath, 'utf-8', (err, htmlContent) => {
                if (err) {
                    console.error(`Error reading the file "${htmlFilePath}":`, err);
                    return;
                }

                // Extract clauses and generate JSON data
                const jsonData = extractClauses(htmlContent);

                // Define the path for the output JSON file
                const jsonFilePath = path.join(subfolderPath, 'clauses.json');

                // Save the JSON data to clauses.json
                fs.writeFile(jsonFilePath, JSON.stringify(jsonData, null, 4), 'utf-8', err => {
                    if (err) {
                        console.error(`Error writing the file "${jsonFilePath}":`, err);
                    } else {
                        console.log(`JSON file generated successfully at "${jsonFilePath}"`);
                    }
                });
            });
        } else {
            console.warn(`No "service.html" found in "${subfolderPath}". Skipping...`);
        }
    });
});