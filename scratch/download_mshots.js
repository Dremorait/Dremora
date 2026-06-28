const https = require('https');
const fs = require('fs');
const path = require('path');

const images = [
    { name: 'restaurant_prototype.png', url: 'https://s.wordpress.com/mshots/v1/https%3A%2F%2Fprototyperestro.netlify.app?w=1200' },
    { name: 'healthcare_prototype.png', url: 'https://s.wordpress.com/mshots/v1/https%3A%2F%2Fdrmhealth.netlify.app?w=1200' },
    { name: 'ecommerce_prototype.png', url: 'https://s.wordpress.com/mshots/v1/https%3A%2F%2Fdrmcommerce.netlify.app?w=1200' }
];

const downloadImage = (url, filepath) => {
    return new Promise((resolve, reject) => {
        const req = https.get(url, (res) => {
            if (res.statusCode === 200 || res.statusCode === 301 || res.statusCode === 302) {
                if(res.statusCode !== 200) {
                   return downloadImage(res.headers.location, filepath).then(resolve).catch(reject);
                }
                res.pipe(fs.createWriteStream(filepath))
                   .on('error', reject)
                   .once('close', () => resolve(filepath));
            } else {
                reject(new Error(`Failed to download, status code: ${res.statusCode}`));
            }
        });
        req.on('error', reject);
    });
};

const dir = path.join(__dirname, '../assets/images');

Promise.all(images.map(img => downloadImage(img.url, path.join(dir, img.name))))
    .then(() => console.log('Successfully downloaded all screenshots via mshots'))
    .catch(err => console.error('Error downloading images:', err));
