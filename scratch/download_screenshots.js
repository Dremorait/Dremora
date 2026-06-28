const https = require('https');
const fs = require('fs');
const path = require('path');

const images = [
    { name: 'restaurant_prototype.png', url: 'https://image.thum.io/get/width/1200/crop/800/https://prototyperestro.netlify.app' },
    { name: 'healthcare_prototype.png', url: 'https://image.thum.io/get/width/1200/crop/800/https://drmhealth.netlify.app' },
    { name: 'ecommerce_prototype.png', url: 'https://image.thum.io/get/width/1200/crop/800/https://drmcommerce.netlify.app' }
];

const downloadImage = (url, filepath) => {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            if (res.statusCode === 200) {
                res.pipe(fs.createWriteStream(filepath))
                   .on('error', reject)
                   .once('close', () => resolve(filepath));
            } else if (res.statusCode === 302 || res.statusCode === 301) {
                downloadImage(res.headers.location, filepath).then(resolve).catch(reject);
            } else {
                reject(new Error(`Failed to download, status code: ${res.statusCode}`));
            }
        }).on('error', reject);
    });
};

const dir = path.join(__dirname, '../assets/images');
if (!fs.existsSync(dir)){
    fs.mkdirSync(dir, { recursive: true });
}

Promise.all(images.map(img => downloadImage(img.url, path.join(dir, img.name))))
    .then(() => console.log('Successfully downloaded all screenshots'))
    .catch(err => console.error('Error downloading images:', err));
