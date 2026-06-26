const fs = require('fs');
const path = require('path');

const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));

files.forEach(file => {
  if (file === 'intern-dashboard.html' || file === 'admin-dashboard.html' || file === 'login.html') return;
  
  let content = fs.readFileSync(file, 'utf8');
  let replaced = content.replace(/"internship\.html"/g, '"login.html"');
  replaced = replaced.replace(/"\/internship\.html"/g, '"/login.html"');
  
  if (content !== replaced) {
    fs.writeFileSync(file, replaced);
    console.log(`Updated ${file}`);
  }
});
