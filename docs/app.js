// Idea-to-Demo Blueprints - App Logic
// Minimal JS, no framework needed

document.addEventListener('DOMContentLoaded', () => {
  // Highlight current TOC item on scroll
  const tocLinks = document.querySelectorAll('.toc a');
  const headings = document.querySelectorAll('.article h2[id]');

  if (tocLinks.length && headings.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          tocLinks.forEach(link => link.classList.remove('active'));
          const id = entry.target.getAttribute('id');
          const activeLink = document.querySelector(`.toc a[href="#${id}"]`);
          if (activeLink) activeLink.classList.add('active');
        }
      });
    }, { rootMargin: '-80px 0px -60% 0px' });

    headings.forEach(h => observer.observe(h));
  }

  // Copy code blocks
  document.querySelectorAll('.article pre').forEach(pre => {
    const btn = document.createElement('button');
    btn.textContent = '复制';
    btn.style.cssText = 'position:absolute; top:8px; right:8px; padding:4px 10px; font-size:0.75rem; background:var(--bg-tertiary); border:1px solid var(--border); border-radius:4px; cursor:pointer; color:var(--text-secondary);';
    pre.style.position = 'relative';
    btn.addEventListener('click', () => {
      navigator.clipboard.writeText(pre.textContent).then(() => {
        btn.textContent = '已复制';
        setTimeout(() => btn.textContent = '复制', 2000);
      });
    });
    pre.appendChild(btn);
  });

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
});
