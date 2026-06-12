// Idea-to-Demo Blueprints - App Logic
// Minimal JS, no framework needed
// Supports data-driven rendering from data/blueprints.json with static fallback

document.addEventListener('DOMContentLoaded', () => {
  // --- 1. Render blueprint cards from JSON (data-driven) ---
  const grid = document.getElementById('blueprint-grid');
  if (grid) {
    fetch('data/blueprints.json')
      .then(r => r.json())
      .then(data => {
        if (!data.blueprints || !data.blueprints.length) return;
        grid.innerHTML = '';
        data.blueprints.forEach(bp => {
          const card = document.createElement('div');
          card.className = 'blueprint-card';
          card.style.display = 'block';
          card.style.textDecoration = 'none';
          card.style.color = 'inherit';
          
          const statusClass = bp.status === 'demo-ready' ? 'tag-green' : 
                             bp.status === 'draft' ? 'tag-yellow' : 'tag-blue';
          const statusText = bp.status === 'demo-ready' ? 'demo-ready' : bp.status;
          
          let links = '';
          if (bp.page_url) {
            links += `<a href="${bp.page_url}" class="btn" style="margin-right:8px;">查看方案</a>`;
          }
          if (bp.demo_url) {
            links += `<a href="${bp.demo_url}" class="btn btn-outline">查看 Demo</a>`;
          }
          
          card.innerHTML = `
            <div class="card-header">
              <div class="card-title">${bp.title}</div>
              <div class="card-summary">${bp.summary}</div>
            </div>
            <div class="card-meta">
              <span class="meta-tag">${bp.category}</span>
              <span class="meta-tag difficulty">${bp.difficulty}</span>
              <span class="meta-tag time">${bp.demo_time}</span>
              <span class="meta-tag ${statusClass}" style="font-weight:500;">${statusText}</span>
              ${(bp.audience || []).slice(0, 3).map(a => `<span class="meta-tag">${a}</span>`).join('')}
            </div>
            <div style="padding: 0 20px 20px;">
              ${links}
            </div>
          `;
          grid.appendChild(card);
        });
      })
      .catch(() => {
        // Fallback: keep static cards already in HTML
      });
  }

  // --- 2. Highlight current TOC item on scroll ---
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

  // --- 3. Copy code blocks ---
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

  // --- 4. Smooth scroll for anchor links ---
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
