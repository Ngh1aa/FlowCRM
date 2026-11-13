// FlowCRM - page shell: footer credit line and the hidden workspace tools.
// The tools panel appears only after opening any page with ?demo=1 (kept for the tab
// through sessionStorage); ?demo=0 turns it off again.
(function flowcrmShell() {
  const TOOLS_FLAG = 'flowcrm_demo_tools';

  function toolsEnabled() {
    const value = new URLSearchParams(window.location.search).get('demo');
    try {
      if (value === '1') sessionStorage.setItem(TOOLS_FLAG, '1');
      if (value === '0') sessionStorage.removeItem(TOOLS_FLAG);
      return sessionStorage.getItem(TOOLS_FLAG) === '1';
    } catch (error) {
      return value === '1';
    }
  }

  function addCredit() {
    if (document.querySelector('.product-credit')) return;
    const host = document.querySelector('main.main-content') || document.querySelector('main.auth-container') || document.body;
    const footer = document.createElement('footer');
    footer.className = 'product-credit';
    footer.innerHTML = '<p>Concept product designed by Đỗ Anh Nghĩa.</p>';
    if (host.matches('main.auth-container')) host.after(footer);
    else host.appendChild(footer);
  }

  function resetWorkspace() {
    try {
      Object.keys(localStorage)
        .filter(key => key.startsWith('flowcrm_'))
        .forEach(key => localStorage.removeItem(key));
    } catch (error) {
      // Storage unavailable: nothing to reset.
    }
    const page = window.location.pathname.split('/').pop();
    if (page === 'login.html' || page === 'register.html') window.location.href = 'index.html';
    else window.location.reload();
  }

  function addTools() {
    if (document.getElementById('demoTools')) return;
    const panel = document.createElement('details');
    panel.className = 'demo-tools';
    panel.id = 'demoTools';
    panel.innerHTML = `
      <summary>Demo tools</summary>
      <div class="demo-tools-body">
        <p>Restore the original deals, customers, tasks, team accounts and settings, then sign in as An Nguyen.</p>
        <button type="button" class="demo-tools-button" id="resetDemoData">Reset demo data</button>
      </div>`;
    document.body.appendChild(panel);
    panel.querySelector('#resetDemoData').addEventListener('click', resetWorkspace);
  }

  function init() {
    addCredit();
    if (toolsEnabled()) addTools();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
