const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'projects.html');
let content = fs.readFileSync(filePath, 'utf8');

// Remove filter section
const filterSectionRegex = /<!-- ======= FILTER & SEARCH BAR ======= -->[\s\S]*?(?=<div id="projectsContainer")/g;
content = content.replace(filterSectionRegex, '');

// Remove projectsContainer opening tag and empty state
const containerRegex = /<div id="projectsContainer"[^>]*>[\s\S]*?<!-- ======= EMPTY STATE ======= -->[\s\S]*?(?=<!-- ======= DREMORA HOUSE PROJECT ======= -->)/g;
content = content.replace(containerRegex, '');

// Remove projectsContainer closing tag
const closingRegex = /<\/div>\s*<!-- MORE PROJECTS NOTE -->/g;
content = content.replace(closingRegex, '<!-- MORE PROJECTS NOTE -->');

// Remove portfolio-filter.js script
const scriptRegex = /<script src="js\/portfolio-filter\.js" defer><\/script>\s*/g;
content = content.replace(scriptRegex, '');

fs.writeFileSync(filePath, content);
console.log("Successfully removed filter UI and script from projects.html");
