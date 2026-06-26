const fs = require('fs');

const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));

files.forEach(file => {
  if (file === 'intern-dashboard.html' || file === 'admin-dashboard.html' || file === 'login.html') return;
  
  let content = fs.readFileSync(file, 'utf8');
  
  // Update desktop nav
  let replaced = content.replace(
    /<a href="contact\.html" class="nav-link">Contact<\/a>/g,
    '<a href="contact.html" class="nav-link">Contact</a>\n      <a href="login.html" class="nav-link" style="color: var(--accent-bright);"><svg class="icon fa-user" aria-hidden="true" style="margin-right:4px;"><use href="#fa-user"></use></svg>Login</a>'
  );
  
  // Update mobile nav
  replaced = replaced.replace(
    /<a href="contact\.html" class="nav-link">Contact<\/a>\s*<a href="contact\.html" class="btn btn-primary nav-cta"/g,
    '<a href="contact.html" class="nav-link">Contact</a>\n  <a href="login.html" class="nav-link" style="color: var(--accent-bright);">Login</a>\n  <a href="contact.html" class="btn btn-primary nav-cta"'
  );
  
  if (content !== replaced) {
    fs.writeFileSync(file, replaced);
    console.log(`Updated nav in ${file}`);
  }
});
