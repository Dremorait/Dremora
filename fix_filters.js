const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'projects.html');
let content = fs.readFileSync(filePath, 'utf8');

// Update Filter Pills to broader categories
const oldPills = `<div class="filter-pills" style="display:flex; gap:var(--space-2); flex-wrap:wrap; flex:1;">
          <button class="filter-pill active" data-filter="All">All</button>
          <button class="filter-pill" data-filter="Luxury">Luxury</button>
          <button class="filter-pill" data-filter="Hospitality">Hospitality</button>
          <button class="filter-pill" data-filter="AI Automation">AI Automation</button>
          <button class="filter-pill" data-filter="Enterprise Platform">Enterprise</button>
          <button class="filter-pill" data-filter="Web Design">Websites</button>
        </div>`;

const newPills = `<div class="filter-pills" style="display:flex; gap:var(--space-2); flex-wrap:wrap; flex:1;">
          <button class="filter-pill active" data-filter="All">All Work</button>
          <button class="filter-pill" data-filter="Enterprise">Enterprise & SaaS</button>
          <button class="filter-pill" data-filter="Websites">Websites & E-Commerce</button>
          <button class="filter-pill" data-filter="UI/UX">UI/UX & Frontend</button>
          <button class="filter-pill" data-filter="Full Stack">Full Stack Platforms</button>
        </div>`;

content = content.replace(oldPills, newPills);

// Update Dremora House categories
content = content.replace(
  'data-category="Luxury Hospitality Web Design"',
  'data-category="Websites UI/UX Full Stack Luxury Hospitality Web Design"'
);

// Update EDURO categories
content = content.replace(
  'data-category="Enterprise Platform Education ERP"',
  'data-category="Enterprise Full Stack Education ERP"'
);

// Update DRE-CHAIN categories
content = content.replace(
  'data-category="AI Automation Enterprise Platform SaaS"',
  'data-category="Enterprise UI/UX Full Stack AI Automation SaaS"'
);

// Update Prototype Cafe categories
content = content.replace(
  'data-category="Web Design Frontend E-Commerce Websites"',
  'data-category="Websites UI/UX E-Commerce Frontend"'
);

fs.writeFileSync(filePath, content);
console.log("Successfully updated projects.html with broader filter categories.");
