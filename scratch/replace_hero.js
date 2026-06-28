const fs = require('fs');
const path = require('path');

const indexFile = path.join(__dirname, '../index.html');
let content = fs.readFileSync(indexFile, 'utf8');

const startMarker = '<!-- Hero Visual — Full Orbital System (reference-matched) -->';

const startIndex = content.indexOf(startMarker);
if (startIndex === -1) {
    console.error("Start marker not found!");
    process.exit(1);
}

// Use a regex to match the end of the div
const regex = /            <\/div>\r?\n          <\/div>\r?\n        <\/div>/;
const match = content.substring(startIndex).match(regex);

if (!match) {
    console.error("End marker not found!");
    process.exit(1);
}

const endIndex = startIndex + match.index;
const finalEndIndex = endIndex + match[0].length;

const newHTML = `<!-- Portfolio Showcase Card -->
        <div class="portfolio-showcase-wrapper reveal-scale" style="flex:1;min-width:280px;max-width:540px;margin-inline:auto;width:100%;">
          <div class="portfolio-showcase-card">
            <!-- Header -->
            <div class="showcase-header">
              <div class="showcase-title">
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"/></svg>
                Portfolio Showcase
              </div>
              <div class="showcase-live-badge">
                <span class="live-dot"></span> Live
              </div>
            </div>
            
            <!-- Featured Project -->
            <div class="featured-project" id="featuredProject">
              <div class="featured-img-wrapper">
                <img src="assets/images/dashboard_mockup.png" alt="Featured Project" id="featuredImage" />
                <div class="img-overlay"></div>
              </div>
              <div class="featured-content">
                <div class="featured-meta">
                  <span class="featured-category" id="featuredCategory">Web Application</span>
                </div>
                <h3 class="featured-title" id="featuredTitle">Premium Dashboard</h3>
                <p class="featured-desc" id="featuredDesc">Modern responsive web application with elegant UI and robust features.</p>
                <div class="featured-tech" id="featuredTech">
                  <span class="tech-tag">React</span>
                  <span class="tech-tag">Node.js</span>
                  <span class="tech-tag">Tailwind</span>
                </div>
              </div>
            </div>

            <!-- Horizontal Slider -->
            <div class="showcase-slider-container">
              <div class="slider-progress-bar"><div class="slider-progress-fill" id="sliderProgress"></div></div>
              <div class="showcase-slider" id="showcaseSlider">
                <!-- Cards injected via JS -->
              </div>
            </div>

            <!-- Bottom CTA -->
            <a href="projects.html" class="showcase-cta">
              🚀 Explore Full Portfolio 
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
            </a>
          </div>
        </div>`;

const newContent = content.substring(0, startIndex) + newHTML + content.substring(finalEndIndex);
fs.writeFileSync(indexFile, newContent);
console.log("Replaced successfully.");
