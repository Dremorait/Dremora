import re

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Pattern for the featured project hardcoded HTML block
pattern = r'<div class="featured-img-wrapper">.*?<div class="featured-tech" id="featuredTech">.*?</div>\s*</div>'

eduro_html = '''<div class="featured-img-wrapper">
                <img src="assets/images/eduro.png" alt="EDURO - Premium Coaching Platform" id="featuredImage" />
                <div class="img-overlay"></div>
              </div>
              <div class="featured-content">
                <div class="featured-meta">
                  <span class="featured-category" id="featuredCategory">Enterprise Platform</span>
                </div>
                <h3 class="featured-title" id="featuredTitle">EDURO - Premium Coaching Platform</h3>
                <p class="featured-desc" id="featuredDesc">A premium enterprise-grade digital platform for a coaching institute featuring a cinematic UI, AI-ready architecture, admissions CRM, student & parent portals, and analytics.</p>
                <div class="featured-tech" id="featuredTech">
                  <span class="tech-tag">Next.js</span>
                  <span class="tech-tag">React</span>
                  <span class="tech-tag">Tailwind</span>
                  <span class="tech-tag">Prisma</span>
                </div>
              </div>'''

new_content = re.sub(pattern, eduro_html, content, flags=re.DOTALL)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(new_content)
print("Updated hardcoded featured project in index.html")
