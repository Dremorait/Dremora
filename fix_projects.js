const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'projects.html');
let content = fs.readFileSync(filePath, 'utf8');

// The replacement content
const filterUI = `
  <!-- ======= FILTER & SEARCH BAR ======= -->
  <section class="section filter-section" style="border-bottom:1px solid var(--border); background:var(--bg-primary); position: sticky; top: var(--nav-height); z-index: 40; padding: var(--space-4) 0; backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);">
    <div class="container">
      <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:var(--space-4);">
        <div class="filter-pills" style="display:flex; gap:var(--space-2); flex-wrap:wrap; flex:1;">
          <button class="filter-pill active" data-filter="All">All</button>
          <button class="filter-pill" data-filter="Luxury">Luxury</button>
          <button class="filter-pill" data-filter="Hospitality">Hospitality</button>
          <button class="filter-pill" data-filter="AI Automation">AI Automation</button>
          <button class="filter-pill" data-filter="Enterprise Platform">Enterprise</button>
          <button class="filter-pill" data-filter="Web Design">Websites</button>
        </div>
        <div class="filter-controls" style="display:flex; gap:var(--space-3); align-items:center; flex-wrap:wrap;">
          <div class="search-wrapper" style="position:relative;">
            <svg style="position:absolute; left:12px; top:50%; transform:translateY(-50%); width:16px; height:16px; color:var(--text-muted);" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            <input type="text" id="portfolioSearch" placeholder="Search projects..." class="filter-input">
          </div>
          <select id="portfolioSort" class="filter-input">
            <option value="newest">Newest</option>
            <option value="featured">Featured</option>
            <option value="alphabetical">Alphabetical</option>
            <option value="industry">Industry</option>
          </select>
        </div>
      </div>
      <div style="margin-top:var(--space-3); font-size:var(--text-xs); color:var(--text-muted); font-weight:600; letter-spacing:0.05em;" id="projectCount">Projects (4)</div>
    </div>
  </section>

  <div id="projectsContainer" style="position: relative;">
    <!-- ======= EMPTY STATE ======= -->
    <div id="portfolioEmptyState" style="display:none; flex-direction:column; align-items:center; justify-content:center; padding:var(--space-16) var(--space-4); text-align:center; opacity:0; transition:opacity 0.3s ease;">
      <div style="width:80px; height:80px; background:var(--bg-secondary); border-radius:50%; display:flex; align-items:center; justify-content:center; margin-bottom:var(--space-4);">
        <svg style="color:var(--text-muted); width:32px; height:32px;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
      </div>
      <h3 style="font-size:var(--text-xl); margin-bottom:var(--space-2);">No projects found</h3>
      <p style="color:var(--text-muted); font-size:var(--text-sm);">Try adjusting your search or filters.</p>
    </div>

    <!-- ======= DREMORA HOUSE PROJECT ======= -->
    <section class="section portfolio-project" data-category="Luxury Hospitality Web Design" data-tags="next.js react framer motion tailwind" data-tech="Next.js React TypeScript Tailwind" data-industry="Hospitality" data-title="DREMORA HOUSE" data-description="Luxury hospitality website inspired by Aman resorts" data-featured="true" style="border-bottom:1px solid var(--border);">
      <div class="container">
        <div style="max-width:1060px;margin-inline:auto;">
          
          <a href="https://dremora-house.vercel.app/" target="_blank" rel="noopener" class="portfolio-card-link reveal luxury-hover" style="display:block; text-decoration:none; color:inherit; perspective:1200px; margin-bottom:var(--space-10);">
            <div class="browser-mockup luxury-card" style="background:rgba(15,15,15,0.9); border:1px solid rgba(255,255,255,0.1); border-radius:24px; overflow:hidden; box-shadow:0 40px 80px rgba(0,0,0,0.6); backdrop-filter:blur(20px); -webkit-backdrop-filter:blur(20px); transform-style:preserve-3d; transition:transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.6s ease, border-color 0.6s ease;">
              
              <div style="display:flex; align-items:center; padding:16px 24px; background:rgba(20,20,20,0.8); border-bottom:1px solid rgba(255,255,255,0.05); position:relative; z-index:10;">
                <div style="display:flex; gap:8px; align-items:center;">
                  <div style="width:12px; height:12px; border-radius:50%; background:#FF5F56; border:1px solid rgba(0,0,0,0.2);"></div>
                  <div style="width:12px; height:12px; border-radius:50%; background:#FFBD2E; border:1px solid rgba(0,0,0,0.2);"></div>
                  <div style="width:12px; height:12px; border-radius:50%; background:#27C93F; border:1px solid rgba(0,0,0,0.2);"></div>
                </div>
                <div style="flex:1; display:flex; justify-content:center;">
                  <div style="background:rgba(0,0,0,0.5); border:1px solid rgba(255,255,255,0.08); border-radius:12px; padding:8px 36px; font-size:12px; color:var(--text-muted); display:flex; align-items:center; gap:8px; font-weight:500; letter-spacing:0.5px;">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="opacity:0.7"><path stroke-linecap="round" stroke-linejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
                    dremora-house.vercel.app
                  </div>
                </div>
                <div style="display:flex; align-items:center; gap:6px; font-size:11px; color:#eab308; font-weight:600; letter-spacing:1px;">
                  <span class="live-indicator" style="width:6px; height:6px; border-radius:50%; background:currentColor; display:inline-block; box-shadow:0 0 8px currentColor;"></span>
                  LIVE
                </div>
              </div>
  
              <div class="hero-preview luxury-img-container" style="position:relative; width:100%; aspect-ratio:16/9; background:#000; overflow:hidden;">
                <!-- Dremora House Image Cover -->
                <img src="https://images.unsplash.com/photo-1454496522488-7a8e488e8606?q=80&w=2076&auto=format&fit=crop" alt="Dremora House Luxury Resort" style="width:100%; height:100%; object-fit:cover; opacity:0.8; transition: transform 1.2s cubic-bezier(0.16, 1, 0.3, 1);" class="luxury-img">
                <div style="position:absolute; inset:0; background:linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.1) 40%, rgba(0,0,0,0.6) 100%);"></div>
                
                <div style="position:absolute; top:8%; left:5%; right:5%; display:flex; justify-content:space-between; align-items:center; color:#fff; z-index:2;">
                  <div style="font-family:serif; font-size:1.5vw; font-weight:400; letter-spacing:0.1em;">DREMORA</div>
                  <div style="display:flex; gap:3vw; font-size:0.7vw; font-weight:600; letter-spacing:0.15em; text-transform:uppercase;">
                    <span>The Experience</span>
                    <span>Private Villas</span>
                    <span>Dining & Bar</span>
                  </div>
                  <div style="border:1px solid rgba(255,255,255,0.4); padding:0.8vw 2vw; border-radius:0; font-size:0.7vw; letter-spacing:0.1em; text-transform:uppercase; backdrop-filter:blur(4px); -webkit-backdrop-filter:blur(4px);">Reserve</div>
                </div>
  
                <div style="position:absolute; top:50%; left:50%; transform:translate(-50%, -50%); text-align:center; color:#fff; z-index:2; width:100%;">
                  <h1 style="font-family:serif; font-size:7vw; font-weight:400; letter-spacing:0.05em; margin:0; line-height:1; text-shadow:0 10px 30px rgba(0,0,0,0.3);">DREMORA</h1>
                  <p style="font-size:0.8vw; letter-spacing:0.4em; margin-top:2vw; text-transform:uppercase; opacity:0.9;">Above the fog. Beyond the noise.</p>
                </div>
              </div>
            </div>
          </a>
  
          <div class="reveal" style="text-align:center; max-width:860px; margin-inline:auto;">
            <div style="display:flex; justify-content:center; gap:var(--space-3); margin-bottom:var(--space-5); flex-wrap:wrap;">
              <span class="badge" style="background:linear-gradient(135deg, #eab308, #d97706); color:#fff; border:none; box-shadow:0 0 20px rgba(234, 179, 8, 0.4);">FLAGSHIP</span>
              <span class="badge badge-gray">Luxury Hospitality</span>
              <span class="badge badge-gray">Premium UI/UX</span>
            </div>
            <h2 class="project-title" style="font-size:clamp(2rem, 5vw, 3.5rem); margin-bottom:var(--space-4); display:inline-block; position:relative; background:linear-gradient(to right, #fde047, #f59e0b); -webkit-background-clip:text; -webkit-text-fill-color:transparent;">DREMORA HOUSE</h2>
            <p style="color:var(--text-secondary); font-size:var(--text-lg); line-height:var(--leading-relaxed); margin-bottom:var(--space-6);">
              An enterprise-grade luxury hospitality website inspired by world-class resorts such as Aman and Six Senses. Built as a cinematic digital experience combining editorial storytelling, immersive motion design, and a luxury-first user experience.
            </p>
            
            <div style="display:flex; flex-wrap:wrap; justify-content:center; gap:var(--space-2); margin-bottom:var(--space-6);">
              <span class="tech-tag">Next.js</span>
              <span class="tech-tag">React</span>
              <span class="tech-tag">TypeScript</span>
              <span class="tech-tag">Tailwind CSS</span>
              <span class="tech-tag">Framer Motion</span>
              <span class="tech-tag">Lenis</span>
              <span class="tech-tag">Prisma</span>
            </div>
  
            <div style="display:flex; justify-content:center; gap:var(--space-4);">
              <a href="https://dremora-house.vercel.app/" target="_blank" rel="noopener" class="btn btn-primary" style="display:inline-flex; align-items:center; gap:8px; background:linear-gradient(135deg, #1f2937, #000); border-color:#374151;">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                Live Demo
              </a>
              <button class="btn btn-outline" disabled style="display:inline-flex; align-items:center; gap:8px; opacity:0.6;">
                Case Study (Coming Soon)
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ======= EDURO PROJECT ======= -->`;

if (!content.includes('id="projectsContainer"')) {
  // Regex to match the Eduro project comment and replace it, regardless of spacing/newlines
  content = content.replace(/<!--\s*=======\s*EDURO PROJECT\s*=======\s*-->/, filterUI);

  // Add attributes to Eduro (find first <section class="section"> after the Eduro comment)
  // Since we replaced the comment, the filterUI has the comment at the end.
  content = content.replace(
    /<!--\s*=======\s*EDURO PROJECT\s*=======\s*-->\s*<section class="section"/,
    '<!-- ======= EDURO PROJECT ======= -->\n  <section class="section portfolio-project" data-category="Enterprise Platform Education ERP" data-tech="Next.js React TypeScript Prisma PostgreSQL Auth.js" data-title="EDURO" data-industry="Education" data-featured="false"'
  );

  // Add attributes to DRE-CHAIN
  content = content.replace(
    /<!--\s*=======\s*DRE-CHAIN PROJECT\s*=======\s*-->\s*<section class="section"/,
    '<!-- ======= DRE-CHAIN PROJECT ======= -->\n  <section class="section portfolio-project" data-category="AI Automation Enterprise Platform SaaS" data-tech="Next.js React TypeScript Framer Motion Zustand React Flow" data-title="DRE-CHAIN" data-industry="Automation" data-featured="false"'
  );

  // Add attributes to Prototype Cafe
  content = content.replace(
    /<!--\s*=======\s*PROTOTYPE CAFE PROJECT\s*=======\s*-->\s*<section class="section"/,
    '<!-- ======= PROTOTYPE CAFE PROJECT ======= -->\n  <section class="section portfolio-project" data-category="Web Design Frontend E-Commerce Websites" data-tech="HTML CSS JS Next.js React" data-title="E-Commerce Website Prototype" data-industry="Retail" data-featured="true"'
  );

  // Close container before "MORE PROJECTS NOTE"
  content = content.replace(
    /<!--\s*MORE PROJECTS NOTE\s*-->/,
    '</div>\n\n  <!-- MORE PROJECTS NOTE -->'
  );

  // Add script
  if (!content.includes('portfolio-filter.js')) {
    content = content.replace(
      '<script src="js/sparkles.js" defer></script>',
      '<script src="js/sparkles.js" defer></script>\n  <script src="js/portfolio-filter.js" defer></script>'
    );
  }

  fs.writeFileSync(filePath, content);
  console.log("Successfully updated projects.html with robust regex.");
} else {
  console.log("Looks like it was already updated, but perhaps incorrectly.");
}
