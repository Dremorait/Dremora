import sys

eduro_html = '''  <!-- ======= EDURO PROJECT ======= -->
  <section class="section" style="border-bottom:1px solid var(--border);">
    <div class="container">
      <div style="max-width:960px;margin-inline:auto;">
        
        <!-- Project Mockup with Hover Effects -->
        <a href="https://eduro-phi.vercel.app/" target="_blank" rel="noopener" class="portfolio-card-link eduro-link reveal" style="display:block; text-decoration:none; color:inherit; perspective:1200px; margin-bottom:var(--space-10);">
          <div class="browser-mockup" style="background:rgba(10,10,10,0.8); border:1px solid rgba(255,255,255,0.08); border-radius:16px; overflow:hidden; box-shadow:0 30px 60px rgba(0,0,0,0.4); backdrop-filter:blur(12px); transform-style:preserve-3d; transition:transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.5s ease, border-color 0.5s ease;">
            
            <!-- Browser Header -->
            <div style="display:flex; align-items:center; padding:14px 20px; background:rgba(20,20,20,0.9); border-bottom:1px solid rgba(255,255,255,0.05); position:relative; z-index:10;">
              <div style="display:flex; gap:8px; align-items:center;">
                <div style="width:12px; height:12px; border-radius:50%; background:#FF5F56; border:1px solid rgba(0,0,0,0.2);"></div>
                <div style="width:12px; height:12px; border-radius:50%; background:#FFBD2E; border:1px solid rgba(0,0,0,0.2);"></div>
                <div style="width:12px; height:12px; border-radius:50%; background:#27C93F; border:1px solid rgba(0,0,0,0.2);"></div>
              </div>
              <div style="flex:1; display:flex; justify-content:center;">
                <div style="background:rgba(0,0,0,0.4); border:1px solid rgba(255,255,255,0.08); border-radius:8px; padding:6px 32px; font-size:12px; color:var(--text-muted); display:flex; align-items:center; gap:8px; font-weight:500;">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="opacity:0.7"><path stroke-linecap="round" stroke-linejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
                  eduro-phi.vercel.app
                </div>
              </div>
              <div style="display:flex; align-items:center; gap:6px; font-size:11px; color:#4ADE80; font-weight:600; letter-spacing:1px;">
                <span class="live-indicator" style="width:6px; height:6px; border-radius:50%; background:currentColor; display:inline-block; box-shadow:0 0 8px currentColor;"></span>
                LIVE
              </div>
            </div>

            <!-- Miniature Hero Content -->
            <div class="hero-preview" style="position:relative; width:100%; aspect-ratio:16/9; background:#050505; overflow:hidden;">
              
              <!-- Glassmorphism Orbs & Grid -->
              <div style="position:absolute; inset:0; background-image:linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px); background-size:2vw 2vw;"></div>
              <div style="position:absolute; top:-20%; left:-10%; width:60%; height:60%; background:radial-gradient(circle, rgba(139,92,246,0.15) 0%, rgba(0,0,0,0) 70%); border-radius:50%; filter:blur(2vw);"></div>
              <div style="position:absolute; bottom:-20%; right:-10%; width:60%; height:60%; background:radial-gradient(circle, rgba(14,165,233,0.15) 0%, rgba(0,0,0,0) 70%); border-radius:50%; filter:blur(2vw);"></div>

              <div class="hero-inner" style="position:relative; z-index:2; padding:3% 5%; height:100%; display:flex; flex-direction:column; justify-content:center; align-items:center; text-align:center; transition:transform 0.4s ease;">
                
                <!-- Navbar Mockup -->
                <div style="position:absolute; top:3%; left:5%; right:5%; display:flex; justify-content:space-between; align-items:center;">
                  <div style="color:#fff; font-size:1.2vw; font-weight:800; font-family:var(--font-sans); display:flex; align-items:center; gap:0.5vw;">
                    <div style="width:1.5vw; height:1.5vw; background:linear-gradient(135deg, #8b5cf6, #0ea5e9); border-radius:0.4vw;"></div>
                    EDURO
                  </div>
                  <div style="display:flex; gap:2vw; font-size:0.7vw; color:#a1a1aa; font-weight:500;">
                    <span style="color:#fff;">Home</span>
                    <span>Programs</span>
                    <span>Admissions</span>
                    <span>Faculty</span>
                    <span>Contact</span>
                  </div>
                  <div style="background:rgba(255,255,255,0.1); border:1px solid rgba(255,255,255,0.2); color:#fff; font-size:0.7vw; padding:0.6vw 1.2vw; border-radius:4vw; font-weight:600;">Student Portal</div>
                </div>

                <!-- Hero Content -->
                <div style="display:inline-flex; align-items:center; gap:0.5vw; padding:0.4vw 0.8vw; background:rgba(139,92,246,0.1); border:1px solid rgba(139,92,246,0.3); border-radius:4vw; margin-bottom:1.5vw;">
                  <span style="width:0.5vw; height:0.5vw; background:#8b5cf6; border-radius:50%;"></span>
                  <span style="color:#c4b5fd; font-size:0.6vw; font-weight:600; letter-spacing:1px; text-transform:uppercase;">Next-Gen Coaching Platform</span>
                </div>
                
                <h1 style="font-family:var(--font-sans); color:#fff; font-size:3.5vw; line-height:1.2; font-weight:800; margin-bottom:1.5vw; letter-spacing:-0.03em; max-width:80%;">
                  Empowering the Next Generation of <span style="background:linear-gradient(to right, #8b5cf6, #38bdf8); -webkit-background-clip:text; -webkit-text-fill-color:transparent;">Achievers</span>
                </h1>
                
                <p style="color:#a1a1aa; font-size:0.9vw; line-height:1.6; margin-bottom:2.5vw; max-width:60%; font-weight:400;">
                  Enterprise-grade platform featuring AI-ready architecture, admissions CRM, and cinematic UI designed for premier institutions.
                </p>
                
                <div style="display:flex; gap:1vw;">
                  <div style="background:#fff; color:#09090b; font-size:0.75vw; padding:0.8vw 1.5vw; border-radius:0.4vw; font-weight:600; display:flex; align-items:center; gap:0.5vw;">Explore Platform <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg></div>
                  <div style="background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.1); color:#fff; font-size:0.75vw; padding:0.8vw 1.5vw; border-radius:0.4vw; font-weight:600; display:flex; align-items:center; gap:0.5vw;">Book Demo</div>
                </div>

              </div>
            </div>
          </div>
        </a>

        <!-- Project Details -->
        <div class="reveal" style="text-align:center; max-width:760px; margin-inline:auto;">
          <div style="display:flex; justify-content:center; gap:var(--space-3); margin-bottom:var(--space-5); flex-wrap:wrap;">
            <span class="badge" style="background:var(--accent); color:#fff; border-color:var(--accent); box-shadow:0 0 15px rgba(23, 99, 235, 0.3);">NEW</span>
            <span class="badge badge-gray">EdTech</span>
            <span class="badge badge-gray">Enterprise Platform</span>
            <span class="badge badge-gray">ERP / CRM</span>
            <span class="badge badge-gray">AI-Ready</span>
          </div>
          <h2 class="project-title" style="font-size:clamp(2rem, 5vw, 3.5rem); margin-bottom:var(--space-4); display:inline-block; position:relative; background:linear-gradient(to right, #8b5cf6, #38bdf8); -webkit-background-clip:text; -webkit-text-fill-color:transparent;">EDURO – Premium Coaching Platform</h2>
          <p style="color:var(--text-secondary); font-size:var(--text-lg); line-height:var(--leading-relaxed); margin-bottom:var(--space-6);">
            A premium enterprise-grade digital platform for a coaching institute featuring a cinematic UI, AI-ready architecture, admissions CRM, student & parent portals, faculty management, analytics dashboards, and production-grade performance optimization.
          </p>
          
          <div style="display:flex; flex-wrap:wrap; justify-content:center; gap:var(--space-2); margin-bottom:var(--space-6);">
            <span class="tech-tag">Next.js 15</span>
            <span class="tech-tag">React 19</span>
            <span class="tech-tag">TypeScript</span>
            <span class="tech-tag">Tailwind CSS</span>
            <span class="tech-tag">Framer Motion</span>
            <span class="tech-tag">GSAP</span>
            <span class="tech-tag">Prisma</span>
            <span class="tech-tag">PostgreSQL</span>
            <span class="tech-tag">Auth.js</span>
            <span class="tech-tag">Zod</span>
            <span class="tech-tag">Vercel</span>
          </div>

          <div style="display:flex; justify-content:center; gap:var(--space-4);">
            <a href="https://eduro-phi.vercel.app/" target="_blank" rel="noopener" class="btn btn-primary" style="display:inline-flex; align-items:center; gap:8px;">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
              Live Demo
            </a>
          </div>
        </div>

      </div>
    </div>
  </section>

  <!-- ======= PROTOTYPE CAFE PROJECT ======= -->'''

with open('projects.html', 'r', encoding='utf-8') as f:
    content = f.read()

if '<!-- ======= EDURO PROJECT ======= -->' not in content:
    content = content.replace('<!-- ======= PROTOTYPE CAFE PROJECT ======= -->', eduro_html)
    with open('projects.html', 'w', encoding='utf-8') as f:
        f.write(content)
    print('Inserted EDURO project into projects.html')
else:
    print('EDURO project already exists in projects.html')
