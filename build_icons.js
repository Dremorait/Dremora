const fs = require('fs');
const path = require('path');

const dir = __dirname;
const htmlFiles = fs.readdirSync(dir).filter(f => f.endsWith('.html'));
const jsFiles = ['js/main.js', 'js/canvas-network.js', 'fix_all.js'].filter(f => fs.existsSync(path.join(dir, f)));

const allFiles = [...htmlFiles, ...jsFiles];

const faDir = path.join(dir, 'node_modules', '@fortawesome', 'fontawesome-free', 'svgs');

// We have 'solid', 'brands', 'regular'
const styles = ['solid', 'brands', 'regular'];

let allIcons = new Set();
let spriteSymbols = [];

// 1. Find all icons used
allFiles.forEach(file => {
  const content = fs.readFileSync(path.join(dir, file), 'utf8');
  // Match <i class="fa-solid fa-user"></i> or similar
  const matches = content.match(/<i[^>]*class="[^"]*fa-[^"]*"[^>]*><\/i>/g);
  if (matches) {
    matches.forEach(m => {
      const classMatches = m.match(/fa-([a-z0-9-]+)/g);
      if (classMatches) {
        classMatches.forEach(cls => {
          const name = cls.replace('fa-', '');
          if (name !== 'solid' && name !== 'brands' && name !== 'regular' && name !== 'fw') {
            allIcons.add(name);
          }
        });
      }
    });
  }
});

// A mapping of our findings to make replacing easier later
const iconMap = {}; // { 'user': 'solid' }

allIcons.forEach(iconName => {
  // Try to find the SVG file in one of the styles
  let found = false;
  for (const style of styles) {
    const svgPath = path.join(faDir, style, `${iconName}.svg`);
    if (fs.existsSync(svgPath)) {
      const svgContent = fs.readFileSync(svgPath, 'utf8');
      
      // Extract the viewBox
      const viewBoxMatch = svgContent.match(/viewBox="([^"]+)"/);
      const viewBox = viewBoxMatch ? viewBoxMatch[1] : '0 0 512 512';
      
      // Extract the inner content (paths, etc)
      const innerContent = svgContent
        .replace(/<svg[^>]*>/, '')
        .replace(/<\/svg>/, '');

      // Create a symbol
      const symbol = `<symbol id="fa-${iconName}" viewBox="${viewBox}">${innerContent}</symbol>`;
      spriteSymbols.push(symbol);
      
      iconMap[iconName] = style;
      found = true;
      break;
    }
  }
  if (!found) {
    // Ignore ones that aren't real icons (e.g., 'solid', 'brands', 'something')
    console.log(`Warning: SVG not found for fa-${iconName}`);
  }
});

// 2. Write the sprite file
const spriteContent = `<svg xmlns="http://www.w3.org/2000/svg" style="display: none;">\n  ${spriteSymbols.join('\n  ')}\n</svg>`;
const outDir = path.join(dir, 'assets');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir);
}
fs.writeFileSync(path.join(outDir, 'icons.svg'), spriteContent, 'utf8');
console.log(`Sprite generated at assets/icons.svg with ${spriteSymbols.length} icons.`);

// 3. Replace in HTML files
allFiles.forEach(file => {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Replace <i class="..."></i> with SVG
  content = content.replace(/<i([^>]*)class="([^"]*fa-[^"]*)"([^>]*)><\/i>/g, (match, before, classes, after) => {
    // Determine the icon name
    const matchClass = classes.match(/fa-([a-z0-9-]+)/);
    if (!matchClass) return match;
    const iconName = matchClass[1];
    
    if (iconName === 'solid' || iconName === 'brands' || iconName === 'regular') {
        // It's grabbing the style instead of the icon name, find the second fa-
        const parts = classes.split(' ');
        const actualIconClass = parts.find(p => p.startsWith('fa-') && p !== 'fa-solid' && p !== 'fa-brands' && p !== 'fa-regular');
        if (actualIconClass) {
            const actualName = actualIconClass.replace('fa-', '');
            if (iconMap[actualName]) {
                return `<svg class="icon ${classes.replace('fa-solid','').replace('fa-brands','').replace('fa-regular','')}" aria-hidden="true"${before}${after}><use href="assets/icons.svg#fa-${actualName}"></use></svg>`.replace(/  +/g, ' ');
            }
        }
    } else if (iconMap[iconName]) {
       return `<svg class="icon ${classes.replace('fa-solid','').replace('fa-brands','').replace('fa-regular','')}" aria-hidden="true"${before}${after}><use href="assets/icons.svg#fa-${iconName}"></use></svg>`.replace(/  +/g, ' ');
    }
    return match; // If not found in sprite, leave as is
  });

  // Remove the font-awesome CSS link
  content = content.replace(/<link rel="stylesheet" href="https:\/\/cdnjs.cloudflare.com\/ajax\/libs\/font-awesome[^>]+>/g, '');

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Updated icons in ${file}`);
});
