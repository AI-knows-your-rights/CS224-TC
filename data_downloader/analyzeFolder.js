const fs = require('fs').promises;
const path = require('path');
const yaml = require('js-yaml');

/**
 * Check if the HTML file is valid by looking for common error codes
 * @param {string} filePath - Path to the HTML file
 * @returns {Promise<boolean>} - Whether the file is valid
 */
async function isValidHtml(filePath) {
    try {
        const content = await fs.readFile(filePath, 'utf-8');
        return !content.includes('404') && !content.includes('503');
    } catch (error) {
        return false;
    }
}

/**
 * Check if the JSON file is valid by ensuring it is not empty
 * @param {string} filePath - Path to the JSON file
 * @returns {Promise<boolean>} - Whether the file is valid
 */
async function isValidJson(filePath) {
    try {
        const content = await fs.readFile(filePath, 'utf-8');
        const jsonContent = JSON.parse(content);
        return Object.keys(jsonContent).length > 0;
    } catch (error) {
        return false;
    }
}

/**
 * Count the number of words in a text file
 * @param {string} filePath - Path to the text file
 * @returns {Promise<number>} - Number of words in the file
 */
async function countWordsInFile(filePath) {
    try {
        const content = await fs.readFile(filePath, 'utf-8');
        return content.split(/\s+/).length;
    } catch (error) {
        return 0;
    }
}

/**
 * Analyze the documents folder for TXT files and their statistics
 * @param {string} documentsPath - Path to the documents folder
 * @returns {Promise<Object|null>} - Statistics about the documents
 */
async function analyzeDocumentsFolder(documentsPath) {
    try {
        await fs.access(documentsPath);
    } catch {
        return null;
    }

    const stats = {
        total_txt_files: 0,
        tc_files: 0,
        review_files: 0,
        file_stats: []
    };

    const files = await fs.readdir(documentsPath);
    
    for (const file of files) {
        if (file.endsWith('.txt')) {
            stats.total_txt_files++;
            const filePath = path.join(documentsPath, file);
            const fileStats = await fs.stat(filePath);
            const wordCount = await countWordsInFile(filePath);

            const fileStat = {
                name: file,
                size_bytes: fileStats.size,
                word_count: wordCount
            };

            if (file.startsWith('TC_')) {
                stats.tc_files++;
            } else if (file.startsWith('REVIEW_')) {
                stats.review_files++;
            }

            stats.file_stats.push(fileStat);
        }
    }

    return stats;
}

/**
 * Analyze subfolders and documents in the given directory
 * @param {string} dataDir - Directory to analyze
 * @returns {Promise<Object>} - Analysis results
 */
async function analyzeSubfolders(dataDir) {
    const analysis = {
        summary: {
            total_subfolders: 0,
            total_files: 0,
            total_documents: 0
        },
        folders: []
    };

    const entries = await fs.readdir(dataDir, { withFileTypes: true });
    const subfolders = entries.filter(entry => entry.isDirectory())
        .map(dir => path.join(dataDir, dir.name));
    
    analysis.summary.total_subfolders = subfolders.length;

    for (const subfolder of subfolders) {
        const folderInfo = {
            name: path.basename(subfolder),
            files: [],
            documents_folder: null
        };

        // Analyze documents folder if it exists
        const documentsPath = path.join(subfolder, 'documents');
        const analysisResult = await analyzeDocumentsFolder(documentsPath);
        
        if (analysisResult) {
            folderInfo.documents_folder = {
                total_files: analysisResult.total_txt_files,
                tc_files: analysisResult.tc_files,
                review_files: analysisResult.review_files,
                files: analysisResult.file_stats
            };
            analysis.summary.total_documents += analysisResult.total_txt_files;
        }

        // Analyze other files
        const files = await fs.readdir(subfolder);
        analysis.summary.total_files += files.length;

        for (const file of files) {
            const filePath = path.join(subfolder, file);
            const docInfo = { name: file };
            
            if (file.endsWith('.html')) {
                docInfo.valid = await isValidHtml(filePath);
            } else if (file.endsWith('.json')) {
                docInfo.valid = await isValidJson(filePath);
            } else {
                docInfo.valid = 'Unknown format';
            }
            
            folderInfo.files.push(docInfo);
        }

        analysis.folders.push(folderInfo);
    }

    return analysis;
}

/**
 * Create a YAML report of the analysis
 * @param {string} dataDir - Directory to analyze
 * @param {string} outputFile - Path to save the YAML report
 * @returns {Promise<void>}
 */
async function createYamlReport(dataDir, outputFile) {
    const analysis = await analyzeSubfolders(dataDir);
    const yamlContent = yaml.dump(analysis, {
        allowUnicode: true,
        noRefs: true,
        sortKeys: false,
        indent: 2
    });
    
    await fs.writeFile(outputFile, yamlContent, 'utf-8');
}

/**
 * Main function to analyze a folder and create a report
 * @param {string} dataDir - Directory to analyze
 * @param {string} outputFile - Output YAML file name
 * @returns {Promise<void>}
 */
async function analyzeFolder(dataDir, outputFile = 'folder_analysis.yaml') {
    try {
        await fs.access(dataDir);
        const outputPath = path.join(dataDir, outputFile);
        await createYamlReport(dataDir, outputPath);
        console.log(`Analysis complete. Report saved to ${outputPath}`);
    } catch (error) {
        console.error(`Error: Directory '${dataDir}' does not exist or cannot be accessed`);
        throw error;
    }
}

module.exports = {
    analyzeFolder,
    analyzeSubfolders,
    analyzeDocumentsFolder
}; 