const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'css', 'style.css');
let content = fs.readFileSync(filePath, 'utf8');

// The marker for where my appended CSS started
const startMarker = '/* =========================================================\n   PORTFOLIO FILTER UI\n========================================================= */';

const startIndex = content.indexOf(startMarker);
if (startIndex !== -1) {
  content = content.substring(0, startIndex);
  fs.writeFileSync(filePath, content.trim() + '\n');
  console.log("Successfully removed portfolio filter CSS from style.css");
} else {
  console.log("Could not find start marker in style.css");
}
