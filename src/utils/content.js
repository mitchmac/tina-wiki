const fs = require('fs');
const fg = require('fast-glob');

export async function getContentFiles(glob) {
    return fg(glob);
}

export function getSlug(filePath) {
    const base = filePath.split('content/')[1];
    return `/${base}`.replace(/ /g, '-').slice(0, -5).trim();
}

export async function readFile(filePath) {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, 'utf8', function(err, data) {
            if (err) {
                reject(err)
            }
            resolve(data)
        })
    })
}