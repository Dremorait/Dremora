const fs = require('fs');
const path = require('path');

const dir = __dirname;
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

files.forEach(file => {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Add theme-color if not present
  if (!content.includes('<meta name="theme-color"')) {
    content = content.replace('</title>', '</title>\n  <meta name="theme-color" content="#090909">');
  }

  // Preload Inter font if not present
  if (!content.includes('rel="preload" href="https://fonts.googleapis.com')) {
    content = content.replace('</title>', '</title>\n  <link rel="preconnect" href="https://fonts.googleapis.com">\n  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>');
  }

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Updated meta/fonts in ${file}`);
});
