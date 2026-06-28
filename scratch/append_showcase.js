const fs = require('fs');
const path = require('path');

const cssFile = path.join(__dirname, '../css/style.css');
const cssContent = `
/* ===================== PORTFOLIO SHOWCASE CARD ===================== */
.portfolio-showcase-wrapper {
  position: relative;
  z-index: 10;
}
.portfolio-showcase-card {
  background: rgba(14, 20, 36, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 28px;
  padding: 24px;
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5), inset 0 0 80px rgba(37, 99, 235, 0.15), 0 0 0 1px rgba(56, 189, 248, 0.1);
  display: flex;
  flex-direction: column;
  gap: 20px;
  overflow: hidden;
  position: relative;
  transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s ease;
}
.portfolio-showcase-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 30px 80px rgba(0, 0, 0, 0.6), inset 0 0 100px rgba(37, 99, 235, 0.25), 0 0 0 1px rgba(56, 189, 248, 0.3), 0 0 40px rgba(37, 99, 235, 0.3);
}
.showcase-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.showcase-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.85rem;
  font-weight: 700;
  color: #f1f5f9;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
.showcase-title svg {
  color: #60a5fa;
}
.showcase-live-badge {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.7rem;
  font-weight: 700;
  color: #22c55e;
  background: rgba(34, 197, 94, 0.1);
  padding: 4px 10px;
  border-radius: 12px;
  border: 1px solid rgba(34, 197, 94, 0.2);
  text-transform: uppercase;
  letter-spacing: 0.1em;
}
.live-dot {
  width: 6px;
  height: 6px;
  background-color: #22c55e;
  border-radius: 50%;
  box-shadow: 0 0 8px #22c55e;
  animation: drm-pulse-dot 2s infinite;
}
.featured-project {
  display: flex;
  flex-direction: column;
  gap: 16px;
  transition: opacity 0.4s ease, transform 0.4s ease;
}
.featured-project.fading {
  opacity: 0;
  transform: scale(0.98);
}
.featured-img-wrapper {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  border-radius: 16px;
  overflow: hidden;
  background: #000;
  border: 1px solid rgba(255, 255, 255, 0.08);
}
.featured-img-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.7s ease;
}
.portfolio-showcase-card:hover .featured-img-wrapper img {
  transform: scale(1.05);
}
.img-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0,0,0,0.4) 0%, transparent 60%);
  pointer-events: none;
}
.featured-content {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.featured-meta {
  display: flex;
  align-items: center;
  gap: 10px;
}
.featured-category {
  font-size: 0.7rem;
  font-weight: 600;
  color: #60a5fa;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}
.featured-title {
  font-size: 1.4rem;
  font-weight: 800;
  color: #fff;
  line-height: 1.2;
}
.featured-desc {
  font-size: 0.85rem;
  color: #94a3b8;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.featured-tech {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  margin-top: 4px;
}
.featured-tech .tech-tag {
  font-size: 0.65rem;
  padding: 4px 10px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #cbd5e1;
  border-radius: 9999px;
}
.showcase-slider-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 8px;
}
.slider-progress-bar {
  width: 100%;
  height: 3px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
  overflow: hidden;
}
.slider-progress-fill {
  height: 100%;
  width: 0%;
  background: #3b82f6;
  border-radius: 2px;
  transition: width 0.1s linear;
}
.showcase-slider {
  display: flex;
  gap: 12px;
  overflow-x: auto;
  padding-bottom: 8px;
  scrollbar-width: none;
  -ms-overflow-style: none;
}
.showcase-slider::-webkit-scrollbar {
  display: none;
}
.slider-card {
  min-width: 120px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  padding: 8px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}
.slider-card:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.2);
}
.slider-card.active {
  background: rgba(59, 130, 246, 0.15);
  border-color: rgba(59, 130, 246, 0.5);
  box-shadow: 0 0 15px rgba(59, 130, 246, 0.2);
}
.slider-card-img {
  width: 100%;
  aspect-ratio: 16 / 9;
  border-radius: 6px;
  object-fit: cover;
}
.slider-card-title {
  font-size: 0.7rem;
  font-weight: 600;
  color: #cbd5e1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.slider-card.active .slider-card-title {
  color: #fff;
}
.showcase-cta {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 14px;
  background: linear-gradient(90deg, #1d4ed8, #3b82f6);
  color: #fff;
  border-radius: 12px;
  font-size: 0.9rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(37, 99, 235, 0.3);
  text-decoration: none;
}
.showcase-cta:hover {
  background: linear-gradient(90deg, #2563eb, #60a5fa);
  box-shadow: 0 8px 25px rgba(37, 99, 235, 0.5);
  transform: translateY(-2px);
}
.showcase-cta:hover svg {
  transform: translateX(4px);
}
.showcase-cta svg {
  transition: transform 0.3s ease;
}

@media (max-width: 640px) {
  .portfolio-showcase-card {
    padding: 16px;
    gap: 16px;
  }
  .featured-title {
    font-size: 1.1rem;
  }
  .featured-desc {
    font-size: 0.75rem;
  }
  .slider-card {
    min-width: 100px;
    padding: 6px;
  }
}
`;

fs.appendFileSync(cssFile, cssContent);
console.log("CSS Appended successfully.");

// Now JS Logic
const jsContent = `
<!-- Portfolio Showcase Script -->
<script>
  document.addEventListener('DOMContentLoaded', () => {
    const projects = [
      {
        id: 0,
        title: "AI Automation System",
        category: "AI Dashboard",
        desc: "Intelligent workflows with real-time data visualization and AI-powered insights.",
        image: "assets/images/dashboard_mockup.png",
        tech: ["React", "Python", "TensorFlow"]
      },
      {
        id: 1,
        title: "Nagarseva Portal",
        category: "E-Governance",
        desc: "Comprehensive citizen services portal for municipal corporations.",
        image: "assets/images/nagarseva_dashboard.png",
        tech: ["Next.js", "Node", "PostgreSQL"]
      },
      {
        id: 2,
        title: "AgroTrack Platform",
        category: "AgriTech",
        desc: "Supply chain management for farmers and agribusinesses.",
        image: "assets/images/agrotrack_dashboard.png",
        tech: ["Vue", "Express", "MongoDB"]
      },
      {
        id: 3,
        title: "Smart Irrigation",
        category: "IoT Dashboard",
        desc: "Automated water management system using IoT sensors.",
        image: "assets/images/agro_smart_irrigation.png",
        tech: ["React", "IoT", "AWS"]
      },
      {
        id: 4,
        title: "Business Growth CRM",
        category: "Business CRM",
        desc: "Scalable customer relationship management for modern enterprises.",
        image: "assets/images/business_growth.png",
        tech: ["React", "Tailwind", "Supabase"]
      }
    ];

    let currentIndex = 0;
    const intervalTime = 4500; // 4.5 seconds
    let progressInterval;
    let switchTimeout;
    let progress = 0;
    let isHovered = false;
    let isTransitioning = false;

    const DOM = {
      card: document.querySelector('.portfolio-showcase-card'),
      project: document.getElementById('featuredProject'),
      image: document.getElementById('featuredImage'),
      category: document.getElementById('featuredCategory'),
      title: document.getElementById('featuredTitle'),
      desc: document.getElementById('featuredDesc'),
      tech: document.getElementById('featuredTech'),
      slider: document.getElementById('showcaseSlider'),
      progressFill: document.getElementById('sliderProgress')
    };

    if (!DOM.card) return; // Exit if component not on page

    // Initialize slider
    function initSlider() {
      DOM.slider.innerHTML = '';
      projects.forEach((proj, idx) => {
        const div = document.createElement('div');
        div.className = \`slider-card \${idx === currentIndex ? 'active' : ''}\`;
        div.innerHTML = \`
          <img src="\${proj.image}" alt="\${proj.title}" class="slider-card-img" />
          <span class="slider-card-title">\${proj.title}</span>
        \`;
        div.addEventListener('click', () => {
          if (idx !== currentIndex && !isTransitioning) {
            setProject(idx);
          }
        });
        DOM.slider.appendChild(div);
      });
    }

    function updateProjectDOM(project) {
      DOM.image.src = project.image;
      DOM.category.textContent = project.category;
      DOM.title.textContent = project.title;
      DOM.desc.textContent = project.desc;
      
      DOM.tech.innerHTML = '';
      project.tech.forEach(t => {
        const span = document.createElement('span');
        span.className = 'tech-tag';
        span.textContent = t;
        DOM.tech.appendChild(span);
      });

      // Update slider active state
      Array.from(DOM.slider.children).forEach((child, idx) => {
        if (idx === currentIndex) {
          child.classList.add('active');
          child.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        } else {
          child.classList.remove('active');
        }
      });
    }

    function setProject(index) {
      isTransitioning = true;
      currentIndex = index;
      
      // Reset progress
      progress = 0;
      DOM.progressFill.style.width = '0%';

      // Fade out
      DOM.project.classList.add('fading');
      
      setTimeout(() => {
        updateProjectDOM(projects[currentIndex]);
        
        // Fade in
        DOM.project.classList.remove('fading');
        setTimeout(() => {
          isTransitioning = false;
        }, 400); // Wait for fade in
      }, 400); // Matches CSS transition time
    }

    function nextProject() {
      const nextIdx = (currentIndex + 1) % projects.length;
      setProject(nextIdx);
    }

    function startTimer() {
      const tickRate = 50; // Update every 50ms
      const step = (tickRate / intervalTime) * 100;

      progressInterval = setInterval(() => {
        if (!isHovered && !isTransitioning) {
          progress += step;
          DOM.progressFill.style.width = \`\${progress}%\`;

          if (progress >= 100) {
            nextProject();
          }
        }
      }, tickRate);
    }

    // Hover events to pause
    DOM.card.addEventListener('mouseenter', () => isHovered = true);
    DOM.card.addEventListener('mouseleave', () => isHovered = false);

    // Initial setup
    initSlider();
    updateProjectDOM(projects[currentIndex]);
    startTimer();
  });
</script>
`;

const indexFile = path.join(__dirname, '../index.html');
let htmlContent = fs.readFileSync(indexFile, 'utf8');

// Find closing body tag
const bodyCloseIndex = htmlContent.lastIndexOf('</body>');
if (bodyCloseIndex !== -1) {
  htmlContent = htmlContent.substring(0, bodyCloseIndex) + jsContent + htmlContent.substring(bodyCloseIndex);
  fs.writeFileSync(indexFile, htmlContent);
  console.log("JS Appended successfully.");
} else {
  console.log("</body> not found!");
}
