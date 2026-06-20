const fs = require('fs');
const path = require('path');

const dir = 'C:\\xampp\\htdocs\\Dremora';

function processFiles(directory) {
  const files = fs.readdirSync(directory);
  for (const file of files) {
    const fullPath = path.join(directory, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processFiles(fullPath);
    } else if (fullPath.endsWith('.html') || fullPath.endsWith('.js') || fullPath.endsWith('.css') || fullPath.endsWith('.py')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      // Fix encoding artifacts
      let originalContent = content;
      content = content.replace(/–/g, '–');
      content = content.replace(/—/g, '—');
      content = content.replace(/₹/g, '₹');
      content = content.replace(/·/g, '·');
      content = content.replace(/—/g, '—');
      
      // Fix alignment in feature cards
      content = content.replace(/<span style="color:var\(--text-muted\);font-weight:500;">(Best for|Timeline|Tech Stack|Includes|Revisions|Pricing|Auth|AI Model|Integrations|Complexity)<\/span>/g, '<span style="color:var(--text-muted);font-weight:500;white-space:nowrap;">$1</span>');
      content = content.replace(/<span style="font-size:var\(--text-sm\);color:var\(--text-muted\);">(Best for|Timeline|Starting at|Tech Stack|Includes|Revisions|Pricing|Auth|AI Model|Integrations|Complexity)<\/span>/g, '<span style="font-size:var(--text-sm);color:var(--text-muted);white-space:nowrap;">$1</span>');
      
      content = content.replace(/<span style="color:var\(--text-secondary\);">/g, '<span style="color:var(--text-secondary);text-align:right;max-width:70%;">');
      content = content.replace(/<span style="font-size:var\(--text-sm\);font-weight:600;color:var\(--text-primary\);">/g, '<span style="font-size:var(--text-sm);font-weight:600;color:var(--text-primary);text-align:right;max-width:65%;">');
      
      if (content !== originalContent) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log('Fixed ' + fullPath);
      }
    }
  }
}

processFiles(dir);
console.log('Done');
