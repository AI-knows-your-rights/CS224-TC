const cheerio = require('cheerio');

const extractClauses = (htmlContent) => {
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
    $('.service-points li').each((_, elem) => {
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

        clauses.push(clause);
    });

    // Create the final JSON structure
    const jsonData = {
        meta_data: metaData,
        clauses: clauses
    };

    return jsonData;
};

// Export the function to use in other files
module.exports = extractClauses;
