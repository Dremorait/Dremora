import re

with open('projects.html', 'r', encoding='utf-8') as f:
    content = f.read()

new_hero_preview = '''            <!-- Miniature Hero Content -->
            <div class="hero-preview" style="position:relative; width:100%; aspect-ratio:16/9; background:#fafafa; overflow:hidden;">
              
              <!-- Subtle Background Gradient -->
              <div style="position:absolute; top:-20%; left:-10%; width:60%; height:60%; background:radial-gradient(circle, rgba(79,70,229,0.08) 0%, rgba(255,255,255,0) 70%); border-radius:50%;"></div>

              <div class="hero-inner" style="position:relative; z-index:2; padding:4% 5%; height:100%; display:flex; flex-direction:column; transition:transform 0.4s ease;">
                
                <!-- Navbar Mockup -->
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:auto;">
                  <div style="color:#0f172a; font-size:1.4vw; font-weight:900; font-family:var(--font-sans); display:flex; align-items:center; gap:0.5vw;">
                    <div style="width:1.8vw; height:1.8vw; background:#3b2ecc; border-radius:0.4vw; display:flex; justify-content:center; align-items:center; color:#fff; font-size:1vw; font-weight:bold;">E</div>
                    EDURO
                  </div>
                  <div style="display:flex; gap:1.8vw; font-size:0.75vw; color:#334155; font-weight:600;">
                    <span style="color:#0f172a;">Home</span>
                    <span>Courses</span>
                    <span>Faculty</span>
                    <span>Results</span>
                    <span>About Us</span>
                    <span>Student Login</span>
                  </div>
                  <div style="background:#3b2ecc; color:#fff; font-size:0.75vw; padding:0.6vw 1.2vw; border-radius:2vw; font-weight:600;">Apply Now</div>
                </div>

                <!-- Hero Content Split -->
                <div style="display:flex; height:100%; align-items:center;">
                  <!-- Left Side -->
                  <div style="flex:1; padding-right:2vw;">
                    <div style="display:inline-flex; align-items:center; gap:0.4vw; padding:0.4vw 0.8vw; background:#eff6ff; border:1px solid #bfdbfe; border-radius:4vw; margin-bottom:1.5vw;">
                      <span style="width:0.5vw; height:0.5vw; background:#2563eb; border-radius:50%;"></span>
                      <span style="color:#1d4ed8; font-size:0.6vw; font-weight:700;">Pune's Most Trusted Institute</span>
                    </div>
                    
                    <h1 style="font-family:var(--font-sans); color:#0f172a; font-size:3.5vw; line-height:1.1; font-weight:900; margin-bottom:1vw; letter-spacing:-0.02em;">
                      Crack JEE, NEET &amp;<br>UPSC with<br>
                      <span style="color:#6366f1;">Proven Excellence.</span>
                    </h1>
                    
                    <p style="color:#475569; font-size:0.9vw; line-height:1.5; margin-bottom:2vw; max-width:90%; font-weight:500;">
                      We engineer a mindset of absolute excellence through AI-powered learning, expert faculty, and an environment designed for rankers.
                    </p>
                    
                    <div style="display:flex; gap:1vw; margin-bottom:2vw;">
                      <div style="background:#2b3896; color:#fff; font-size:0.8vw; padding:0.8vw 1.5vw; border-radius:2vw; font-weight:600; display:flex; align-items:center; gap:0.5vw;">Start Your Journey &rarr;</div>
                      <div style="background:#fff; border:1px solid #e2e8f0; color:#0f172a; font-size:0.8vw; padding:0.8vw 1.5vw; border-radius:2vw; font-weight:600; display:flex; align-items:center; gap:0.5vw;">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#6366f1" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M5 3l14 9-14 9V3z"/></svg> Explore Courses
                      </div>
                    </div>

                    <!-- Stats -->
                    <div style="display:flex; gap:2vw; border-top:1px solid #e2e8f0; padding-top:1vw;">
                      <div>
                        <div style="color:#0f172a; font-size:1.5vw; font-weight:900;">15+</div>
                        <div style="color:#64748b; font-size:0.55vw; font-weight:700; letter-spacing:1px;">YEARS EXP</div>
                      </div>
                      <div>
                        <div style="color:#0f172a; font-size:1.5vw; font-weight:900;">10000+</div>
                        <div style="color:#64748b; font-size:0.55vw; font-weight:700; letter-spacing:1px;">SELECTIONS</div>
                      </div>
                      <div>
                        <div style="color:#0f172a; font-size:1.5vw; font-weight:900;">98%</div>
                        <div style="color:#64748b; font-size:0.55vw; font-weight:700; letter-spacing:1px;">SUCCESS RATE</div>
                      </div>
                      <div>
                        <div style="color:#0f172a; font-size:1.5vw; font-weight:900; display:flex; align-items:center; gap:4px;">4.9 <span style="color:#fbbf24;">&starf;</span></div>
                        <div style="color:#64748b; font-size:0.55vw; font-weight:700; letter-spacing:1px;">GOOGLE RATING</div>
                      </div>
                    </div>
                  </div>

                  <!-- Right Side -->
                  <div style="flex:1; position:relative; height:100%; display:flex; justify-content:center; align-items:center;">
                    <div style="width:80%; height:90%; background:url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&amp;w=1771&amp;auto=format&amp;fit=crop') center/cover; border-radius:1.5vw; position:relative;">
                      
                      <!-- Overlay Badge 1 -->
                      <div style="position:absolute; top:10%; left:-10%; background:#fff; padding:0.8vw; border-radius:1vw; box-shadow:0 4px 12px rgba(0,0,0,0.08); display:flex; align-items:center; gap:0.5vw;">
                        <div style="background:#e0e7ff; width:2vw; height:2vw; border-radius:50%; display:flex; justify-content:center; align-items:center;">
                           <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#4f46e5" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M8 21h8M12 17v4M7 4h10M5 4h14v4a7 7 0 01-14 0V4z"/></svg>
                        </div>
                        <div>
                          <div style="font-size:0.8vw; font-weight:800; color:#0f172a;">AIR 1</div>
                          <div style="font-size:0.55vw; color:#64748b;">JEE Advanced</div>
                        </div>
                      </div>

                      <!-- Overlay Badge 2 -->
                      <div style="position:absolute; bottom:20%; right:-10%; background:#fff; padding:0.8vw; border-radius:1vw; box-shadow:0 4px 12px rgba(0,0,0,0.08); display:flex; align-items:center; gap:0.5vw;">
                        <div style="background:#dcfce7; width:2vw; height:2vw; border-radius:50%; display:flex; justify-content:center; align-items:center;">
                           <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#16a34a" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                        </div>
                        <div>
                          <div style="font-size:0.75vw; font-weight:800; color:#0f172a;">100% Guaranteed</div>
                          <div style="font-size:0.55vw; color:#64748b;">Syllabus Completion</div>
                        </div>
                      </div>

                      <!-- Bottom dark area inside image -->
                      <div style="position:absolute; bottom:0; left:0; width:100%; height:30%; background:linear-gradient(to top, rgba(15,23,42,0.95), transparent); border-radius:0 0 1.5vw 1.5vw; padding:1vw; display:flex; flex-direction:column; justify-content:flex-end;">
                        <div style="color:#fff; font-size:0.6vw; font-weight:800; letter-spacing:1px; margin-bottom:0.5vw;">SELECT GOAL</div>
                        <div style="display:flex; gap:0.5vw;">
                          <div style="flex:1; background:rgba(255,255,255,0.1); border:1px solid rgba(255,255,255,0.2); border-radius:0.5vw; padding:0.5vw; display:flex; align-items:center; gap:0.5vw; backdrop-filter:blur(4px);">
                            <div style="width:1.5vw; height:1.5vw; border-radius:50%; background:rgba(255,255,255,0.1); display:flex; justify-content:center; align-items:center;">
                              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"/></svg>
                            </div>
                            <span style="color:#fff; font-size:0.7vw; font-weight:700;">JEE Main</span>
                          </div>
                          <div style="flex:1; background:rgba(255,255,255,0.1); border:1px solid rgba(255,255,255,0.2); border-radius:0.5vw; padding:0.5vw; display:flex; align-items:center; gap:0.5vw; backdrop-filter:blur(4px);">
                            <div style="width:1.5vw; height:1.5vw; border-radius:50%; background:rgba(255,255,255,0.1); display:flex; justify-content:center; align-items:center;">
                              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                            </div>
                            <span style="color:#fff; font-size:0.7vw; font-weight:700;">NEET</span>
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>
                </div>

              </div>
            </div>'''

parts = content.split('<!-- ======= EDURO PROJECT ======= -->')
if len(parts) > 1:
    eduro_section = parts[1].split('<!-- ======= PROTOTYPE CAFE PROJECT ======= -->')[0]
    
    new_eduro_section = re.sub(r'<!-- Miniature Hero Content -->.*?</a>\s*<!-- Project Details -->', 
                               new_hero_preview + '\n          </div>\n        </a>\n\n        <!-- Project Details -->', 
                               eduro_section, flags=re.DOTALL)
                               
    new_content = parts[0] + '<!-- ======= EDURO PROJECT ======= -->' + new_eduro_section + '<!-- ======= PROTOTYPE CAFE PROJECT ======= -->' + parts[1].split('<!-- ======= PROTOTYPE CAFE PROJECT ======= -->')[1]
    
    with open('projects.html', 'w', encoding='utf-8') as f:
        f.write(new_content)
    print("Updated projects.html inline hero preview")
else:
    print("Could not find EDURO section in projects.html")
