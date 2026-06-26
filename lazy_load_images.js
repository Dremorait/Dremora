const fs = require('fs');
const path = require('path');

const dir = __dirname;
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

files.forEach(file => {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Add loading="lazy" to all img tags that don't have it, and aren't the navbar logo
  // Find all <img ...> tags
  content = content.replace(/<img([^>]+)>/g, (match, p1) => {
    // If it's a logo or already has loading attribute, skip
    if (p1.includes('nav-logo') || p1.includes('loading=') || p1.includes('logo.png')) {
      return match;
    }
    return `<img loading="lazy"${p1}>`;
  });

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Updated images in ${file}`);
});
