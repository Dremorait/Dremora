const fs = require('fs');

let html = fs.readFileSync('intern-dashboard.html', 'utf8');

// 1. Remove the portal hero section completely
html = html.replace(/<div class="portal-hero">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/, ''); 
// Wait, the portal-hero ends at a certain point. Let's just be specific.
html = html.replace(/<div class="portal-hero">[\s\S]*?<\/div>\s*<\/div>/, '');

// 2. Remove screen-search
html = html.replace(/<div id="screen-search" class="screen active">[\s\S]*?<!-- ── SCREEN: Loading ── -->/, '<!-- ── SCREEN: Loading ── -->');

// 3. Make screen-success display block and remove screen classes if needed? 
// No, showScreen('success') will handle it. But the default should probably be loading.
html = html.replace(/<div id="screen-loading" class="screen">/, '<div id="screen-loading" class="screen active">');

// 4. Update the entire script tag
const newScript = `
  <script>
    const SUPABASE_URL = process_env_supabase_url_placeholder;
    const STORAGE_BUCKET = 'intern-portal-uploads';

    function escHtml(str) {
      if (!str) return '';
      return String(str).replace(/[&<>'"]/g, tag => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
      }[tag] || tag));
    }

    function formatDate(d) {
      if (!d) return '—';
      try {
        return new Date(d).toLocaleDateString('en-IN', {
          day: 'numeric', month: 'long', year: 'numeric'
        });
      } catch { return d; }
    }

    function showScreen(id) {
      document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
      const el = document.getElementById('screen-' + id);
      if (el) el.classList.add('active');
    }

    async function loadDashboard() {
      showScreen('loading');
      try {
        const authRes = await fetch('/api/auth/me');
        if (!authRes.ok) {
          window.location.href = '/login.html';
          return;
        }
        const authData = await authRes.json();
        if (authData.user.role !== 'intern') {
          window.location.href = '/login.html';
          return;
        }

        const internId = authData.user.intern_id;
        const fullName = authData.user.full_name;

        // Fetch intern data via API or Supabase Client (if anon key is present).
        // For simplicity and security, we should ideally fetch via the backend, 
        // but since we don't have an intern fetch route yet, we'll fetch via Supabase anon if possible,
        // OR better yet, let's create a /api/auth/me that returns the intern data!
        // Actually, the current backend /api/auth/me only returns the JWT payload.
        // I will use the existing Supabase client in the frontend to fetch the data.
        
        const sb = supabase.createClient(SUPABASE_URL, 'sb_publishable_H3CvN9upPS-sZmDYqUuCsQ_7SV1HBgu');
        const { data, error } = await sb
          .from('interns')
          .select('*')
          .ilike('intern_id', internId)
          .ilike('full_name', fullName)
          .limit(1)
          .maybeSingle();

        if (error || !data) {
          showScreen('error');
          return;
        }

        renderDashboard(data);
        showScreen('success');
      } catch (err) {
        showScreen('error');
      }
    }

    function renderDashboard(intern) {
      document.getElementById('dashName').textContent = intern.full_name || '—';
      document.getElementById('dashDomain').textContent = intern.domain ? '· ' + intern.domain : '';
      document.getElementById('dashTimestamp').textContent = new Date().toLocaleString('en-IN');
      document.getElementById('dashCertNo').textContent = intern.certificate_number || '—';
      document.getElementById('dashProfileName').textContent = intern.full_name || '—';
      document.getElementById('dashInternId').textContent = intern.intern_id || '—';

      const avatarEl = document.getElementById('dashAvatar');
      if (intern.photo) {
        const resolvedPhoto = (intern.photo.startsWith('http') || intern.photo.startsWith('assets') || intern.photo.startsWith('/'))
          ? intern.photo
          : \`\${SUPABASE_URL}/storage/v1/object/public/\${STORAGE_BUCKET}/\${intern.photo}\`;
        avatarEl.innerHTML = \`<img loading="lazy" src="\${resolvedPhoto}" alt="\${escHtml(intern.full_name)}" onerror="this.parentElement.innerHTML='<svg class=\\'icon fa-user\\' aria-hidden=\\'true\\'><use href=\\'#fa-user\\'></use></svg>'">\`;
      }

      const details = [
        { icon: 'fa-id-card', label: 'Internship ID', value: intern.intern_id },
        { icon: 'fa-certificate', label: 'Certificate No.', value: intern.certificate_number },
        { icon: 'fa-code', label: 'Domain', value: intern.domain },
        { icon: 'fa-layer-group', label: 'Batch', value: intern.batch ? 'Class of ' + intern.batch : null },
        { icon: 'fa-calendar-plus', label: 'Start Date', value: formatDate(intern.start_date) },
        { icon: 'fa-calendar-check', label: 'End Date', value: formatDate(intern.end_date) },
        { icon: 'fa-envelope', label: 'Email', value: intern.email },
      ];

      const statusBadgeClass = intern.status === 'Active' ? 'status-active' : intern.status === 'Completed' ? 'status-completed' : '';

      let detailsHTML = details.filter(d => d.value && d.value !== '—').map(d => \`
        <div class="detail-row">
          <div class="detail-icon"><svg class="icon \${d.icon}" aria-hidden="true"><use href="#\${d.icon}"></use></svg></div>
          <div>
            <div class="detail-label">\${escHtml(d.label)}</div>
            <div class="detail-value">\${escHtml(String(d.value))}</div>
          </div>
        </div>
      \`).join('');

      detailsHTML += \`
        <div class="detail-row">
          <div class="detail-icon"><svg class="icon fa-circle-check" aria-hidden="true" ><use href="#fa-circle-check"></use></svg></div>
          <div>
            <div class="detail-label">Status</div>
            <div class="detail-value">
              <span class="status-badge \${statusBadgeClass}">\${escHtml(intern.status || 'Active')}</span>
            </div>
          </div>
        </div>
      \`;
      document.getElementById('dashDetails').innerHTML = detailsHTML;
      renderTimeline(intern);
      renderCertificate(intern);
      renderQR(intern.intern_id);
    }

    function renderTimeline(intern) {
      const isCompleted = intern.status === 'Completed';
      const steps = [
        { label: 'Application Received', desc: 'Your application was submitted and reviewed.', done: true },
        { label: 'Selected for Internship', desc: 'You were selected from the applicant pool.', done: true },
        { label: 'Internship Started', desc: formatDate(intern.start_date) || 'Internship commenced.', done: true },
        { label: isCompleted ? 'Internship Completed' : 'In Progress', desc: isCompleted ? \`Successfully completed on \${formatDate(intern.end_date)}.\` : 'Currently working on live commercial projects.', done: isCompleted, current: !isCompleted },
        { label: 'Certificate Issued', desc: 'Official certificate generated and signed.', done: isCompleted },
        { label: 'Digitally Verified', desc: 'Record verified via Dremora portal.', done: true, current: !isCompleted },
      ];
      document.getElementById('dashTimeline').innerHTML = steps.map(s => \`
        <div class="timeline-item">
          <div class="timeline-dot \${s.done ? 'done' : ''} \${s.current ? 'current' : ''}"></div>
          <div class="timeline-label">\${escHtml(s.label)}</div>
          <div class="timeline-desc">\${escHtml(s.desc)}</div>
        </div>
      \`).join('');
    }

    function renderCertificate(intern) {
      const certPlaceholder = document.getElementById('certPlaceholder');
      const certImg = document.getElementById('certImg');
      const certPdf = document.getElementById('certPdf');
      const certOverlay = document.getElementById('certOverlay');
      const certActions = document.getElementById('certActions');
      if (!intern.certificate_url) return;
      const certUrl = intern.certificate_url.startsWith('http') ? intern.certificate_url : \`\${SUPABASE_URL}/storage/v1/object/public/\${STORAGE_BUCKET}/\${intern.certificate_url}\`;
      const isPdf = certUrl.toLowerCase().endsWith('.pdf');
      certPlaceholder.style.display = 'none';
      certOverlay.style.display = '';
      certActions.style.display = '';
      if (isPdf) {
        certPdf.src = certUrl;
        certPdf.style.display = 'block';
        certImg.style.display = 'none';
      } else {
        certImg.src = certUrl;
        certImg.style.display = 'block';
        certPdf.style.display = 'none';
      }
      document.getElementById('btnViewCert').onclick = () => window.open(certUrl, '_blank');
      document.getElementById('btnDownloadCert').onclick = () => {
        const a = document.createElement('a');
        a.href = certUrl;
        a.download = \`\${intern.intern_id}_Certificate\`;
        a.click();
      };
    }

    function renderQR(id) {
      document.getElementById('qrCodeWrap').innerHTML = '';
      new QRCode(document.getElementById('qrCodeWrap'), {
        text: \`https://dremora-it.vercel.app/internship?id=\${id}\`,
        width: 140,
        height: 140,
        colorDark: "#ffffff",
        colorLight: "#161616",
        correctLevel: QRCode.CorrectLevel.H
      });
    }

    document.getElementById('verifyAnotherBtn').addEventListener('click', async () => {
      try {
        await fetch('/api/auth/logout', { method: 'POST' });
        window.location.href = '/login.html';
      } catch (err) {
        window.location.href = '/login.html';
      }
    });

    document.getElementById('tryAgainBtn').addEventListener('click', () => {
      window.location.href = '/login.html';
    });

    document.addEventListener('DOMContentLoaded', () => {
      // Re-inject Supabase URL from meta or just hardcode it since it's client side
      window.SUPABASE_URL = 'https://vtutbqzkegkgujrdkxmj.supabase.co';
      loadDashboard();
    });
  </script>
`;

html = html.replace(/<script>\s*\/\/\s*── DOM Elements[\s\S]*?<\/script>/, newScript);
html = html.replace(/process_env_supabase_url_placeholder/, "'https://vtutbqzkegkgujrdkxmj.supabase.co'");
fs.writeFileSync('intern-dashboard.html', html);
