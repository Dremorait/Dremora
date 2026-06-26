const fs = require('fs');
const content = fs.readFileSync('about.html', 'utf8');
const matches = content.match(/<i[^>]*class="[^"]*fa-[^"]*"[^>]*><\/i>/g);
console.log(matches);
