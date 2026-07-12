const fs = require('fs');
const path = require('path');

const cssContent = `
/* =========================================================
   PORTFOLIO FILTER UI
========================================================= */

.filter-section {
  position: sticky;
  top: var(--nav-height);
  z-index: 40;
  background: rgba(9, 9, 9, 0.85); /* var(--bg-primary) with opacity */
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  padding: var(--space-4) 0;
  border-bottom: 1px solid var(--border);
}

.filter-pills {
  display: flex;
  gap: var(--space-2);
  flex-wrap: wrap;
}

.filter-pill {
  padding: 8px 16px;
  border-radius: var(--radius-full);
  background: var(--bg-secondary);
  border: 1px solid var(--border);
  color: var(--text-secondary);
  font-size: var(--text-sm);
  font-weight: 500;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); /* Spring animation */
  outline: none;
}

.filter-pill:hover {
  background: var(--bg-card-hover);
  color: var(--text-primary);
  transform: translateY(-2px);
}

.filter-pill.active {
  background: var(--accent);
  color: #fff;
  border-color: var(--accent);
  box-shadow: 0 4px 15px rgba(37, 99, 235, 0.4);
}

.filter-input {
  padding: 8px 12px;
  border-radius: var(--radius-full);
  border: 1px solid var(--border);
  background: var(--bg-secondary);
  color: var(--text-primary);
  font-size: var(--text-sm);
  outline: none;
  transition: all 0.3s ease;
}

input.filter-input {
  padding-left: 36px;
}

.filter-input:focus {
  border-color: var(--accent);
  background: var(--bg-card);
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

/* =========================================================
   PORTFOLIO ANIMATIONS (View Transitions Fallback)
========================================================= */

.portfolio-project {
  opacity: 0;
  transform: scale(0.95) translateY(20px);
  filter: blur(4px);
  transition: opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1), 
              transform 0.5s cubic-bezier(0.16, 1, 0.3, 1),
              filter 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}

.portfolio-project.is-visible {
  opacity: 1;
  transform: scale(1) translateY(0);
  filter: blur(0);
}

/* Native View Transitions (if supported) */
::view-transition-old(root),
::view-transition-new(root) {
  animation-duration: 0.5s;
  animation-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
}

/* =========================================================
   LUXURY CARD HOVER EFFECTS
========================================================= */
.luxury-hover:hover .luxury-card {
  transform: translateY(-10px) scale(1.02);
  box-shadow: 0 50px 100px rgba(0,0,0,0.8);
  border-color: rgba(255,255,255,0.2);
}

.luxury-hover:hover .luxury-img {
  transform: scale(1.05);
}
`;

const filePath = path.join(__dirname, 'css', 'style.css');
fs.appendFileSync(filePath, cssContent);
console.log("Appended CSS to style.css");
