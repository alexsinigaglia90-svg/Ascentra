(function () {
  const root = document.querySelector('[data-platform-experience]');
  if (!root) return;

  const content = document.getElementById('experience-content');
  const routeButtons = root.querySelectorAll('[data-route]');
  const defaultRoute = 'overview';

  const templates = {
    overview: () => `
      <h3>Integrated Fulfilment, Planning & Control</h3>
      <p>Ascentra combines IFS, IPS and ICS into one orchestration layer. Leadership sees decisions, operations feel flow, and teams execute with confidence.</p>
      <div class="xp-grid">
        <article class="xp-card"><h4>IFS</h4><p>Integrated Fulfilment System balancing labour, machines and inventory in real-time.</p></article>
        <article class="xp-card"><h4>IPS</h4><p>Intelligent Planning System aligning wave planning, priorities, and downstream capacity.</p></article>
        <article class="xp-card"><h4>ICS</h4><p>Integrated Control Stack with alerts, escalation routes, and exception governance.</p></article>
      </div>
    `,
    modules: () => `
      <h3>Modules</h3>
      <p>Each module is deployable independently, but built to work as one composed platform.</p>
      <div class="xp-grid">
        <article class="xp-card"><h4>IFS Core</h4><p>Order decomposition, inventory sync and task generation with adaptive queue logic.</p></article>
        <article class="xp-card"><h4>IPS Orchestrator</h4><p>Shift-aware planning boards and predictive constraints for upstream/downstream balancing.</p></article>
        <article class="xp-card"><h4>ICS Tower</h4><p>Control-tower UI for SLA drift, live anomalies and guided response paths.</p></article>
      </div>
    `,
    'use-cases': () => `
      <h3>Warehouse Use Cases</h3>
      <div class="xp-grid">
        <article class="xp-card"><h4>Exception handling</h4><p>Automated triage for stock-out, pick-fail and carrier misses with operator playbooks.</p></article>
        <article class="xp-card"><h4>AS/RS buffers</h4><p>Dynamic buffer control to stabilize throughput and avoid starvation at critical stations.</p></article>
        <article class="xp-card"><h4>Mixed palletising</h4><p>Constraint-based pallet assembly balancing cube, fragility, route sequence and speed.</p></article>
      </div>
    `,
    roi: () => `
      <h3>ROI Simulator</h3>
      <p>Adjust assumptions and preview impact on productivity, lead-time and annual value capture.</p>
      <div class="roi-controls">
        <label>Daily Orders <span id="orders-value">12000</span>
          <input type="range" id="orders" min="3000" max="40000" step="500" value="12000" />
        </label>
        <label>Automation Coverage % <span id="automation-value">45</span>
          <input type="range" id="automation" min="10" max="95" step="1" value="45" />
        </label>
        <label>Error Reduction % <span id="errors-value">18</span>
          <input type="range" id="errors" min="5" max="50" step="1" value="18" />
        </label>
      </div>
      <div class="xp-kpis">
        <div class="kpi-tile"><small>Throughput uplift</small><strong id="kpi-throughput">+14%</strong></div>
        <div class="kpi-tile"><small>Lead-time reduction</small><strong id="kpi-lead">-11%</strong></div>
        <div class="kpi-tile"><small>Cost-to-serve</small><strong id="kpi-cost">-8%</strong></div>
        <div class="kpi-tile"><small>Annual impact</small><strong id="kpi-impact">€2.1M</strong></div>
      </div>
    `,
  };

  function getRoute() {
    const params = new URLSearchParams(location.search);
    const route = params.get('xp');
    return templates[route] ? route : defaultRoute;
  }

  function updateRoute(route, push = true) {
    if (!templates[route]) route = defaultRoute;
    content.innerHTML = templates[route]();
    routeButtons.forEach((btn) => btn.classList.toggle('active', btn.dataset.route === route));

    if (push) {
      const url = new URL(location.href);
      url.searchParams.set('xp', route);
      history.pushState({ xp: route }, '', url);
    }

    if (route === 'roi') {
      initRoi();
    }
  }

  function initRoi() {
    const orders = document.getElementById('orders');
    if (!orders) return;
    const automation = document.getElementById('automation');
    const errors = document.getElementById('errors');

    const output = {
      orders: document.getElementById('orders-value'),
      automation: document.getElementById('automation-value'),
      errors: document.getElementById('errors-value'),
      throughput: document.getElementById('kpi-throughput'),
      lead: document.getElementById('kpi-lead'),
      cost: document.getElementById('kpi-cost'),
      impact: document.getElementById('kpi-impact'),
    };

    const calculate = () => {
      const o = Number(orders.value);
      const a = Number(automation.value);
      const e = Number(errors.value);

      output.orders.textContent = o;
      output.automation.textContent = a;
      output.errors.textContent = e;

      const throughput = Math.round((a * 0.18) + (e * 0.22));
      const lead = Math.round((a * 0.09) + (e * 0.2));
      const cost = Math.round((a * 0.07) + (e * 0.13));
      const impact = ((o * (a / 100) * 0.42) + (e * 7200)) / 1000000;

      output.throughput.textContent = `+${throughput}%`;
      output.lead.textContent = `-${lead}%`;
      output.cost.textContent = `-${cost}%`;
      output.impact.textContent = `€${impact.toFixed(1)}M`;
    };

    [orders, automation, errors].forEach((el) => el.addEventListener('input', calculate));
    calculate();
  }

  routeButtons.forEach((button) => {
    button.addEventListener('click', () => updateRoute(button.dataset.route));
  });

  window.addEventListener('popstate', () => updateRoute(getRoute(), false));
  updateRoute(getRoute(), false);

  const enterLinks = document.querySelectorAll('[data-enter-platform]');
  enterLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
      if (!link.getAttribute('href')?.startsWith('#')) return;
      event.preventDefault();
      root.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      root.classList.toggle('in-view', entry.isIntersecting);
      document.body.classList.toggle('experience-active', entry.isIntersecting);
    });
  }, { threshold: 0.25 });

  observer.observe(root);
})();
