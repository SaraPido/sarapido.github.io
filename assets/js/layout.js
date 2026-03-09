// Shared nav HTML
const NAV_HTML = `
<nav>
  <a href="index.html" class="nav-logo">Sara Pidò</a>
  <ul class="nav-links">
    <li><a href="index.html">Home</a></li>
    <li><a href="publications.html">Publications</a></li>
    <li><a href="activities.html">Activities</a></li>
    <li><a href="cv.html">CV</a></li>
    <li><a href="about.html">About Me</a></li>
  </ul>
  <button class="nav-hamburger" aria-label="Menu">
    <span></span><span></span><span></span>
  </button>
</nav>`;

const FOOTER_HTML = `
<footer>
  <div class="footer-content">
    <div>
      <p class="footer-name">Sara Pidò</p>
      <p style="font-size:0.85rem;color:#888;margin-bottom:0.75rem">AI Researcher · PostDoc @ SEL, Politecnico di Milano</p>
      <div class="footer-links">
        <a href="mailto:sarapido95@gmail.com">Email</a>
        <a href="https://linkedin.com/in/sara-pido" target="_blank">LinkedIn</a>
        <a href="https://scholar.google.com/citations?user=M_SrptEAAAAJ&hl=en" target="_blank">Scholar</a>
        <a href="https://github.com/SaraPido" target="_blank">GitHub</a>
      </div>
    </div>
    <div style="text-align:right">
      <p style="font-size:0.8rem;color:#666;margin-bottom:0.25rem">🏔️ Jump over the obstacles!</p>
      <p style="font-size:0.75rem;color:#555">SPACE or CLICK to jump</p>
    </div>
  </div>
  <div class="runner-stage">
    <canvas id="runnerCanvas"></canvas>
  </div>
  <p class="footer-copy">© 2025 Sara Pidò · Milan, Italy</p>
</footer>`;

document.addEventListener('DOMContentLoaded', () => {
  const navContainer = document.getElementById('nav-container');
  if (navContainer) navContainer.innerHTML = NAV_HTML;
  const footerContainer = document.getElementById('footer-container');
  if (footerContainer) footerContainer.innerHTML = FOOTER_HTML;
});
