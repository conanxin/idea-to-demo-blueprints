// AgentOps Control Tower Demo - Dashboard Logic
// 静态数据驱动的多 Agent 项目管理面板

const STATUS_LABELS = {
  active: 'Active',
  blocked: 'Blocked',
  done: 'Done',
  'needs-review': 'Needs Review',
  planned: 'Planned'
};

const STATUS_COLORS = {
  active: '#10b981',
  blocked: '#ef4444',
  done: '#6366f1',
  'needs-review': '#f59e0b',
  planned: '#9ca3af'
};

const RISK_LABELS = {
  low: 'Low',
  medium: 'Medium',
  high: 'High'
};

const RISK_COLORS = {
  low: '#10b981',
  medium: '#f59e0b',
  high: '#ef4444'
};

let allProjects = [];
let currentFilter = 'all';
let currentRiskFilter = null;

function renderStats(data) {
  const meta = data.meta;
  document.getElementById('stat-total').textContent = meta.total_projects;
  document.getElementById('stat-active').textContent = meta.by_status.active;
  document.getElementById('stat-blocked').textContent = meta.by_status.blocked;
  document.getElementById('stat-done').textContent = meta.by_status.done;
  document.getElementById('stat-high-risk').textContent = meta.by_risk.high;
  document.getElementById('generated-at').textContent = meta.generated_at;
}

function renderCard(project) {
  const commitHtml = project.latest_commit && project.latest_commit.hash
    ? `<div class="card-field"><span class="field-label">最近 commit</span><span class="commit-hash">${project.latest_commit.hash.substring(0, 7)}</span><span class="commit-msg">${escapeHtml(project.latest_commit.message)}</span></div>`
    : `<div class="card-field"><span class="field-label">最近 commit</span><span class="muted">无</span></div>`;

  const reportHtml = project.latest_report
    ? `<div class="card-field"><span class="field-label">最近报告</span><span class="muted">${escapeHtml(project.latest_report)}</span></div>`
    : `<div class="card-field"><span class="field-label">最近报告</span><span class="muted">无</span></div>`;

  const blockerHtml = project.blocker
    ? `<div class="card-field blocker"><span class="field-label">阻塞事项</span><span class="text-danger">${escapeHtml(project.blocker)}</span></div>`
    : '';

  return `
    <div class="project-card" data-status="${project.status}" data-risk="${project.risk}">
      <div class="card-header">
        <div class="card-title">${escapeHtml(project.name)}</div>
        <div class="card-badges">
          <span class="status-badge" style="background:${STATUS_COLORS[project.status]}20;color:${STATUS_COLORS[project.status]};border:1px solid ${STATUS_COLORS[project.status]}">${STATUS_LABELS[project.status]}</span>
          <span class="risk-badge" style="background:${RISK_COLORS[project.risk]}20;color:${RISK_COLORS[project.risk]};border:1px solid ${RISK_COLORS[project.risk]}">${RISK_LABELS[project.risk]} Risk</span>
        </div>
      </div>
      <div class="card-body">
        <div class="card-field"><span class="field-label">Agent</span><span>${escapeHtml(project.agent)}</span></div>
        <div class="card-field"><span class="field-label">Machine</span><span>${escapeHtml(project.machine)}</span></div>
        <div class="card-field"><span class="field-label">Phase</span><span>${escapeHtml(project.phase)}</span></div>
        ${commitHtml}
        ${reportHtml}
        ${blockerHtml}
        <div class="card-field next-action"><span class="field-label">下一步</span><span>${escapeHtml(project.next_action)}</span></div>
      </div>
    </div>
  `;
}

function escapeHtml(s) {
  if (!s) return '';
  return String(s).replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]));
}

function renderProjects() {
  const grid = document.getElementById('project-grid');
  const empty = document.getElementById('empty-state');
  
  let filtered = allProjects;
  if (currentFilter !== 'all') {
    filtered = filtered.filter(p => p.status === currentFilter);
  }
  if (currentRiskFilter) {
    filtered = filtered.filter(p => p.risk === currentRiskFilter);
  }

  if (filtered.length === 0) {
    grid.innerHTML = '';
    empty.style.display = 'block';
  } else {
    empty.style.display = 'none';
    grid.innerHTML = filtered.map(renderCard).join('');
  }
  
  document.getElementById('visible-count').textContent = filtered.length;
  document.getElementById('total-count').textContent = allProjects.length;
}

function setupFilters() {
  document.querySelectorAll('[data-filter]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('[data-filter]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      
      if (filter === 'high-risk') {
        currentFilter = 'all';
        currentRiskFilter = 'high';
      } else {
        currentFilter = filter;
        currentRiskFilter = null;
      }
      
      renderProjects();
    });
  });
}

async function init() {
  try {
    const res = await fetch('data.json');
    const data = await res.json();
    allProjects = data.projects || [];
    renderStats(data);
    renderProjects();
    setupFilters();
  } catch (err) {
    document.getElementById('project-grid').innerHTML = '<div class="error">数据加载失败：' + err.message + '</div>';
  }
}

document.addEventListener('DOMContentLoaded', init);