(function () {
  const root = document.querySelector('[data-platform-experience]');
  if (!root) return;

  const content = document.getElementById('experience-content');
  const routeButtons = root.querySelectorAll('[data-route]');
  const defaultRoute = 'platforms';

  const pickerData = [
    { name: 'A. Vermeer', rate: 146, role: 'Pick to light' },
    { name: 'B. Janssen', rate: 131, role: 'Decanting' },
    { name: 'C. Visser', rate: 112, role: 'Replenishment truck' },
    { name: 'D. Bakker', rate: 98, role: 'Loading' },
    { name: 'E. Smit', rate: 124, role: 'Pick to light' },
    { name: 'F. de Jong', rate: 89, role: 'Decanting' },
    { name: 'G. Peters', rate: 138, role: 'Replenishment truck' },
    { name: 'H. Willems', rate: 116, role: 'Loading' },
  ];

  const templates = {
    platforms: () => `
      <h3>Three platforms, one operational command layer</h3>
      <p>Operis drives Direct Labour performance, Astra automates inventory intelligence, and SCS scales multidisciplinary transformation.</p>
      <div class="xp-grid platform-grid">
        <button class="xp-card platform-launch" data-open-route="operis"><h4>Operis</h4><p>All-round Direct Labour control tower with bars, lines, pies, station health and tactical staffing guidance.</p></button>
        <button class="xp-card platform-launch" data-open-route="astra"><h4>Astra</h4><p>Advanced drone mission control with pallet-face scan visualization, mismatch detection and task dispatch.</p></button>
        <button class="xp-card platform-launch" data-open-route="scs"><h4>SCS Consultancy</h4><p>Multidisciplinary team spanning operations, analytics, engineering and transformation governance.</p></button>
      </div>
    `,

    operis: () => `
      <h3>Operis | Direct Labour Command Center</h3>
      <p>Open full-screen dashboard for advanced productivity steering and staffing recommendations.</p>
      <button class="btn btn-primary" id="open-operis-dashboard">Open full-screen Operis dashboard</button>
      <div class="kpi-inline"><div class="kpi-tile"><small>Throughput</small><strong>+18%</strong></div><div class="kpi-tile"><small>Direct Labour control</small><strong>94%</strong></div><div class="kpi-tile"><small>Norm deviation</small><strong>-7%</strong></div></div>
      <div class="operis-overlay" id="operis-overlay" aria-hidden="true">
        <div class="operis-panel">
          <div class="operis-head"><h4>Operis Performance Dashboard</h4><button class="ui-dot" id="close-operis-dashboard" aria-label="Close dashboard">×</button></div>
          <div class="roi-controls">
            <label>Norm target UPH <span id="norm-target-value">118</span><input id="norm-target" type="range" min="90" max="160" value="118" /></label>
            <label>Shift pressure % <span id="shift-pressure-value">100</span><input id="shift-pressure" type="range" min="75" max="130" value="100" /></label>
            <label>Support interventions <span id="support-value">3</span><input id="support" type="range" min="0" max="12" value="3" /></label>
          </div>
          <div class="day-target"><strong id="day-target-status">Day target status: on track</strong><p id="day-target-actions">Action focus: keep current staffing balance and maintain replenishment cadence.</p></div>
          <div class="chart-grid">
            <section class="chart-card"><h5>Picker productivity bars</h5><div class="operis-chart" id="operis-bar-chart"></div></section>
            <section class="chart-card"><h5>Hourly trend line</h5><svg id="operis-line-chart" viewBox="0 0 360 170" class="line-chart"></svg></section>
            <section class="chart-card"><h5>Labour contribution pie</h5><div id="operis-pie-chart" class="pie-chart"></div><ul id="pie-legend" class="pie-legend"></ul></section>
          </div>
          <section class="chart-card"><h5>Station components</h5><div class="station-grid" id="station-grid"></div></section>
          <section class="chart-card"><h5>Picker table</h5><div class="picker-table-wrap"><table class="picker-table"><thead><tr><th>Picker</th><th>Process</th><th>UPH</th><th>Norm gap</th><th>Status</th></tr></thead><tbody id="picker-table-body"></tbody></table></div></section>
          <section class="chart-card chatbot"><h5>Operis Assistant</h5><div class="chat-log" id="chat-log"><div class="msg bot">Ask: "How can I increase output?"</div></div><div class="chat-input"><input id="chat-input" type="text" placeholder="Type your question..." /><button id="chat-send">Send</button></div></section>
        </div>
      </div>
    `,

    astra: () => `
      <h3>Astra | Advanced Drone Mission Control</h3>
      <p>Configure mission complexity, launch and inspect what the drone sees while counting box breaklines.</p>
      <div class="mission-controls">
        <button class="mission-btn active" data-mission="A">Count A</button>
        <button class="mission-btn" data-mission="B">Count B</button>
        <button class="mission-btn" data-mission="C">Count C</button>
        <button class="mission-btn" data-mission="ALL">Count ALL</button>
        <button class="mission-btn" data-speed="normal">Normal speed</button>
        <button class="mission-btn" data-speed="high">High speed</button>
        <button class="btn btn-primary" id="start-mission">Launch mission</button>
      </div>

      <div class="warehouse-sim" id="warehouse-sim">
        <div class="drone-vehicle" id="drone"><span class="drone-body"></span><span class="rotor r1"></span><span class="rotor r2"></span><span class="rotor r3"></span><span class="rotor r4"></span></div>
        ${Array.from({ length: 24 }).map((_, i) => `<div class="rack" data-rack="R${String(i + 1).padStart(2, '0')}"><div class="pallet-face"><div class="box-grid">${Array.from({ length: 6 }).map(() => '<span class="box"></span>').join('')}</div><div class="scan-lines"></div></div><small>R${String(i + 1).padStart(2, '0')}</small></div>`).join('')}
      </div>

      <div id="vision-toast" class="vision-toast">Drone vision: detecting box breaklines and carton edges...</div>
      <p id="mission-log">Mission idle. Awaiting command.</p>

      <div class="xp-kpis" id="astra-report">
        <div class="kpi-tile"><small>Locations scanned</small><strong id="loc-scanned">0</strong></div>
        <div class="kpi-tile"><small>Articles counted</small><strong id="sku-counted">0</strong></div>
        <div class="kpi-tile"><small>Boxes counted</small><strong id="boxes-counted">0</strong></div>
        <div class="kpi-tile"><small>Inventory accuracy</small><strong id="inv-accuracy">--</strong></div>
      </div>
      <div class="chart-card"><h5>Mission report</h5><ul id="mission-report-list" class="report-list"></ul><button class="btn btn-secondary" id="send-cycle-task">Send cycle count task</button></div>
    `,

    scs: () => `
      <h3>SCS Consultancy | Multidisciplinary Team</h3>
      <p>Our SCS bench combines strategy, warehousing, industrial engineering, analytics and transformation leadership.</p>
      <div class="chip-row"><button class="mission-btn active" data-team-filter="all">All</button><button class="mission-btn" data-team-filter="operations">Operations</button><button class="mission-btn" data-team-filter="data">Data</button><button class="mission-btn" data-team-filter="delivery">Delivery</button></div>
      <div class="xp-grid" id="team-grid"></div>
    `,
  };

  const team = [
    { name: 'Warehouse Excellence Lead', d: 'operations', text: 'Direct labour diagnostics and flow-control redesign.' },
    { name: 'Automation Program Architect', d: 'delivery', text: 'AS/RS integration, mission orchestration and rollout leadership.' },
    { name: 'Data & KPI Strategist', d: 'data', text: 'KPI model design, benchmark calibration and decision dashboards.' },
    { name: 'Change & Governance Principal', d: 'delivery', text: 'Steering rhythm, PMO controls and executive stakeholder cadence.' },
    { name: 'Inventory Accuracy Specialist', d: 'operations', text: 'Cycle count governance, root cause elimination and SOP uplift.' },
    { name: 'Applied Operations Analyst', d: 'data', text: 'Scenario simulation and continuous improvement scorecards.' },
  ];

  function getRoute() {
    const route = new URLSearchParams(location.search).get('xp');
    return templates[route] ? route : defaultRoute;
  }

  function setActive(route) { routeButtons.forEach((button) => button.classList.toggle('active', button.dataset.route === route)); }

  function render(route, push) {
    const safeRoute = templates[route] ? route : defaultRoute;
    content.innerHTML = templates[safeRoute]();
    setActive(safeRoute);
    if (push) {
      const url = new URL(location.href);
      url.searchParams.set('xp', safeRoute);
      history.pushState({ xp: safeRoute }, '', url);
    }
    if (safeRoute === 'platforms') initPlatforms();
    if (safeRoute === 'operis') initOperis();
    if (safeRoute === 'astra') initAstra();
    if (safeRoute === 'scs') initSCS();
  }

  function initPlatforms() { content.querySelectorAll('[data-open-route]').forEach((button) => button.addEventListener('click', () => render(button.dataset.openRoute, true))); }

  function initOperis() {
    const overlay = document.getElementById('operis-overlay');
    const open = document.getElementById('open-operis-dashboard');
    const close = document.getElementById('close-operis-dashboard');

    const norm = document.getElementById('norm-target');
    const shift = document.getElementById('shift-pressure');
    const support = document.getElementById('support');

    const normValue = document.getElementById('norm-target-value');
    const shiftValue = document.getElementById('shift-pressure-value');
    const supportValue = document.getElementById('support-value');

    const barChart = document.getElementById('operis-bar-chart');
    const lineChart = document.getElementById('operis-line-chart');
    const pieChart = document.getElementById('operis-pie-chart');
    const pieLegend = document.getElementById('pie-legend');
    const tableBody = document.getElementById('picker-table-body');
    const stationGrid = document.getElementById('station-grid');
    const targetStatus = document.getElementById('day-target-status');
    const targetActions = document.getElementById('day-target-actions');

    const draw = () => {
      const normTarget = Number(norm.value);
      const pressure = Number(shift.value) / 100;
      const supportBoost = Number(support.value) * 1.8;

      normValue.textContent = normTarget;
      shiftValue.textContent = shift.value;
      supportValue.textContent = support.value;

      barChart.innerHTML = '';
      tableBody.innerHTML = '';
      stationGrid.innerHTML = '';

      const adjustedValues = pickerData.map((picker) => {
        const adjusted = Math.max(70, Math.round((picker.rate * pressure) + supportBoost));
        const below = adjusted < normTarget;

        const row = document.createElement('div');
        row.className = `bar-row ${below ? 'below' : ''}`;
        row.innerHTML = `<span>${picker.name}</span><div><i style="width:${Math.min(100, adjusted / 1.7)}%"></i></div><strong>${adjusted} UPH</strong>`;
        barChart.appendChild(row);

        const tr = document.createElement('tr');
        const gap = adjusted - normTarget;
        tr.className = below ? 'below' : '';
        tr.innerHTML = `<td>${picker.name}</td><td>${picker.role}</td><td>${adjusted}</td><td>${gap >= 0 ? '+' : ''}${gap}</td><td>${below ? 'Below norm' : 'On target'}</td>`;
        tableBody.appendChild(tr);

        return adjusted;
      });

      drawLineChart(lineChart, adjustedValues);
      drawPie(pieChart, pieLegend, adjustedValues);
      drawStations(stationGrid, adjustedValues, normTarget);
      drawTargetState(targetStatus, targetActions, adjustedValues, normTarget);
    };

    [norm, shift, support].forEach((el) => el.addEventListener('input', draw));
    draw();

    open.addEventListener('click', () => overlay.classList.add('active'));
    close.addEventListener('click', () => overlay.classList.remove('active'));
    overlay.addEventListener('click', (event) => { if (event.target === overlay) overlay.classList.remove('active'); });

    initChatbot();
  }

  function drawLineChart(svg, values) {
    const hours = [6, 8, 10, 12, 14, 16, 18, 20];
    const points = values.map((v, i) => ({ x: 24 + (i * 44), y: 145 - (v - 70) * 0.82 }));
    const polyline = points.map((p) => `${p.x},${p.y}`).join(' ');
    svg.innerHTML = `<rect x="0" y="0" width="360" height="170" fill="rgba(255,255,255,.02)"/><polyline points="${polyline}" fill="none" stroke="#8fc0ff" stroke-width="3"/>${points.map((p) => `<circle cx="${p.x}" cy="${p.y}" r="4" fill="#e8c89a"/>`).join('')}${hours.map((h, i) => `<text x="${24 + i * 44}" y="165" fill="#d8cbb9" font-size="10">${h}:00</text>`).join('')}`;
  }

  function drawPie(node, legend, values) {
    const low = values.filter((v) => v < 110).length;
    const mid = values.filter((v) => v >= 110 && v < 130).length;
    const high = values.filter((v) => v >= 130).length;
    const total = values.length || 1;

    const a = Math.round((high / total) * 100);
    const b = Math.round((mid / total) * 100);
    const c = 100 - a - b;

    node.style.background = `conic-gradient(#77d49c 0 ${a}%, #d8b46a ${a}% ${a + b}%, #d47a7a ${a + b}% 100%)`;
    legend.innerHTML = `<li><span class="dot green"></span>Above target ${a}%</li><li><span class="dot amber"></span>At risk ${b}%</li><li><span class="dot red"></span>Below target ${c}%</li>`;
  }

  function drawStations(node, values, normTarget) {
    const components = ['Pick to Light', 'Decanting', 'Replenishment Truck', 'Loading'];
    components.forEach((component, i) => {
      const value = values[i * 2] || values[0];
      const status = value >= normTarget + 8 ? 'green' : value >= normTarget ? 'amber' : 'red';
      const station = document.createElement('button');
      station.className = `station ${status}`;
      station.innerHTML = `<strong>${component}</strong><small>${value} UPH equivalent</small>`;
      station.addEventListener('click', () => {
        const order = ['green', 'amber', 'red'];
        const current = station.classList.contains('green') ? 'green' : station.classList.contains('amber') ? 'amber' : 'red';
        station.classList.remove('green', 'amber', 'red');
        station.classList.add(order[(order.indexOf(current) + 1) % order.length]);
      });
      node.appendChild(station);
    });
  }

  function drawTargetState(statusNode, actionsNode, values, normTarget) {
    const avg = values.reduce((a, b) => a + b, 0) / values.length;
    const gap = Math.round(avg - normTarget);

    if (gap >= 0) {
      statusNode.textContent = `Day target status: achieved (+${gap} UPH)`;
      actionsNode.textContent = 'Recommended action: lock current staffing grid and shift one spare operator to quality assurance.';
    } else {
      statusNode.textContent = `Day target status: off-track (${gap} UPH)`;
      actionsNode.textContent = 'Recommended action: swap 1 low-performing loading operator with high-performing replenishment operator, add 2 interventions and rebalance decanting queue.';
    }
  }

  function initChatbot() {
    const input = document.getElementById('chat-input');
    const send = document.getElementById('chat-send');
    const log = document.getElementById('chat-log');
    if (!input || !send || !log) return;

    const answer = () => {
      const text = input.value.trim();
      if (!text) return;
      log.innerHTML += `<div class="msg user">${text}</div>`;
      log.innerHTML += `<div class="msg bot">Recommendation: Move D. Bakker from Loading to Decanting, move G. Peters from Replenishment to Loading, and assign B. Janssen to Pick-to-Light wave 3. Estimated efficiency gain: +11% throughput and +7% norm attainment this shift.</div>`;
      input.value = '';
      log.scrollTop = log.scrollHeight;
    };

    send.addEventListener('click', answer);
    input.addEventListener('keydown', (e) => { if (e.key === 'Enter') answer(); });
  }

  function initAstra() {
    const buttons = content.querySelectorAll('.mission-btn[data-mission]');
    const speedButtons = content.querySelectorAll('.mission-btn[data-speed]');
    const start = document.getElementById('start-mission');
    const drone = document.getElementById('drone');
    const racks = Array.from(content.querySelectorAll('.rack'));
    const log = document.getElementById('mission-log');
    const report = document.getElementById('mission-report-list');
    const toast = document.getElementById('vision-toast');
    const sendTask = document.getElementById('send-cycle-task');

    const loc = document.getElementById('loc-scanned');
    const sku = document.getElementById('sku-counted');
    const boxes = document.getElementById('boxes-counted');
    const acc = document.getElementById('inv-accuracy');

    let mission = 'A';
    let speed = 320;
    let mismatchRack = null;

    buttons.forEach((button) => button.addEventListener('click', () => {
      mission = button.dataset.mission;
      buttons.forEach((b) => b.classList.toggle('active', b === button));
    }));

    speedButtons.forEach((button) => button.addEventListener('click', () => {
      speed = button.dataset.speed === 'high' ? 180 : 320;
      speedButtons.forEach((b) => b.classList.toggle('active', b === button));
    }));

    function getTargets() {
      if (mission === 'A') return racks.slice(0, 8);
      if (mission === 'B') return racks.slice(8, 16);
      if (mission === 'C') return racks.slice(16);
      return racks;
    }

    start.addEventListener('click', async () => {
      const targets = getTargets();
      report.innerHTML = '';
      mismatchRack = null;
      racks.forEach((r) => r.classList.remove('scanned', 'mismatch'));

      let scanned = 0;
      log.textContent = `Mission ${mission} launched. Drone takeoff sequence engaged.`;

      for (const rack of targets) {
        const rackRect = rack.getBoundingClientRect();
        const simRect = rack.parentElement.getBoundingClientRect();
        const lines = rack.querySelector('.scan-lines');

        drone.style.left = `${rackRect.left - simRect.left + 16}px`;
        drone.style.top = `${rackRect.top - simRect.top + 10}px`;

        rack.classList.add('scanned');
        lines.classList.add('active');
        toast.classList.add('show');
        toast.textContent = `Drone vision @ ${rack.dataset.rack}: breakline segmentation and carton edge detection active.`;

        scanned += 1;
        loc.textContent = String(scanned);
        sku.textContent = String(scanned * 42);
        boxes.textContent = String(scanned * 24);

        await new Promise((resolve) => setTimeout(resolve, speed));

        lines.classList.remove('active');
        toast.classList.remove('show');

        if (scanned % 6 === 0) {
          const li = document.createElement('li');
          li.textContent = `Checkpoint ${scanned}: cycle count validated at ${rack.dataset.rack}.`;
          report.appendChild(li);
        }
      }

      mismatchRack = targets[Math.max(0, Math.floor(targets.length * 0.62) - 1)]?.dataset.rack || 'R11';
      const mismatchNode = targets.find((r) => r.dataset.rack === mismatchRack);
      if (mismatchNode) mismatchNode.classList.add('mismatch');

      acc.textContent = `${(99.1 - (mission === 'ALL' ? 0.9 : 0.5)).toFixed(1)}%`;
      log.textContent = `Mission complete. Inventory mismatch found at ${mismatchRack}.`;
      report.innerHTML += `<li>Final finding: ${mismatchRack} counted box quantity deviates from WMS snapshot.</li>`;
    });

    sendTask.addEventListener('click', () => {
      if (!mismatchRack) {
        report.innerHTML += '<li>No mismatch selected yet. Run a mission first.</li>';
      } else {
        report.innerHTML += `<li>Cycle count task sent for ${mismatchRack}. Supervisor queue updated.</li>`;
      }
    });
  }

  function initSCS() {
    const grid = document.getElementById('team-grid');
    const filters = content.querySelectorAll('[data-team-filter]');

    const draw = (filter) => {
      grid.innerHTML = '';
      team.filter((item) => filter === 'all' || item.d === filter).forEach((item) => {
        const card = document.createElement('article');
        card.className = 'xp-card';
        card.innerHTML = `<h4>${item.name}</h4><p>${item.text}</p><small>${item.d.toUpperCase()}</small>`;
        grid.appendChild(card);
      });
    };

    filters.forEach((button) => button.addEventListener('click', () => {
      filters.forEach((b) => b.classList.toggle('active', b === button));
      draw(button.dataset.teamFilter);
    }));

    draw('all');
  }

  routeButtons.forEach((button) => button.addEventListener('click', () => render(button.dataset.route, true)));
  window.addEventListener('popstate', () => render(getRoute(), false));
  render(getRoute(), false);

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      root.classList.toggle('in-view', entry.isIntersecting);
      document.body.classList.toggle('experience-active', entry.isIntersecting);
    });
  }, { threshold: .25 });

  observer.observe(root);
})();
