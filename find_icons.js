const fs = require('fs');
const path = require('path');

const dir = __dirname;
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html') || f.endsWith('.js'));
const icons = new Set();

files.forEach(file => {
  const content = fs.readFileSync(path.join(dir, file), 'utf8');
  // Match fa-something
  const matches = content.match(/fa-[a-z0-9-]+/g);
  if (matches) {
    matches.forEach(m => icons.add(m));
  }
});

console.log(Array.from(icons).sort());
