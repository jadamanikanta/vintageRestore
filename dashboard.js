/* ===== dashboard.js ===== */

/* ---- DOM Refs ---- */
const sidebar       = document.getElementById('sidebar');
const sidebarOverlay= document.getElementById('sidebarOverlay');
const hamburgerBtn  = document.getElementById('hamburgerBtn');
const sidebarClose  = document.getElementById('sidebarClose');
const topbarThemeToggle = document.getElementById('topbarThemeToggle');
const dirToggleBtn  = document.getElementById('dirToggleBtn');
const notifBtn      = document.getElementById('notifBtn');
const notifDropdown = document.getElementById('notifDropdown');
const profileBtn    = document.getElementById('profileBtn');
const profileDropdown = document.getElementById('profileDropdown');
const logoutBtn     = document.getElementById('logoutBtn');
const profileLogout = document.getElementById('profileLogout');
const navLinks      = document.querySelectorAll('.nav-link');
const pages         = document.querySelectorAll('.page');
const scheduleForm  = document.getElementById('scheduleForm');
const formSuccess   = document.getElementById('formSuccess');
const sendMsgBtn    = document.getElementById('sendMsgBtn');
const chatInput     = document.getElementById('chatInput');
const settingsDarkMode = document.getElementById('settingsDarkMode');
const settingsLtr   = document.getElementById('settingsLtr');
const settingsRtl   = document.getElementById('settingsRtl');
const swatches      = document.querySelectorAll('.swatch');

/* ---- Sidebar toggle ---- */
function openSidebar() {
  sidebar.classList.add('open');
  sidebarOverlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}
function closeSidebar() {
  sidebar.classList.remove('open');
  sidebarOverlay.classList.remove('active');
  document.body.style.overflow = '';
}
hamburgerBtn.addEventListener('click', openSidebar);
sidebarClose.addEventListener('click', closeSidebar);
sidebarOverlay.addEventListener('click', closeSidebar);

/* ---- Page Navigation ---- */
function showPage(pageId) {
  pages.forEach(p => p.classList.remove('active'));
  navLinks.forEach(l => l.classList.remove('active'));
  const target = document.getElementById('page-' + pageId);
  if (target) target.classList.add('active');
  const link = document.querySelector(`.nav-link[data-page="${pageId}"]`);
  if (link) link.classList.add('active');
  if (window.innerWidth <= 1024) closeSidebar();
}
navLinks.forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    showPage(link.dataset.page);
  });
});

const themeToggle = document.getElementById("themeToggle");
const themeIcon = document.getElementById("themeIcon");

function setTheme(dark) {
  document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');

  // Change icon
  if (themeIcon) {
    themeIcon.classList.remove(dark ? "fa-moon" : "fa-sun");
    themeIcon.classList.add(dark ? "fa-sun" : "fa-moon");
  }

  localStorage.setItem('rg-theme', dark ? 'dark' : 'light');

  setTimeout(renderCharts, 50);
}

// Click event (instead of checkbox change)
if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const isDark = document.documentElement.getAttribute("data-theme") === "dark";
    setTheme(!isDark);
  });
}

/* ---- Direction Toggle ---- */
function setDir(dir) {
  document.documentElement.setAttribute('dir', dir);
  if (dirToggleBtn) {
    dirToggleBtn.textContent = dir === 'ltr' ? 'RTL' : 'LTR';
  }
  if (settingsLtr) settingsLtr.classList.toggle('active-dir', dir === 'ltr');
  if (settingsRtl) settingsRtl.classList.toggle('active-dir', dir === 'rtl');
  localStorage.setItem('rg-dir', dir);
}
if(dirToggleBtn) {
  dirToggleBtn.addEventListener('click', () => {
    const currentDir = document.documentElement.getAttribute('dir');
    setDir(currentDir === 'ltr' ? 'rtl' : 'ltr');
  });
}
if(settingsLtr) settingsLtr.addEventListener('click', () => setDir('ltr'));
if(settingsRtl) settingsRtl.addEventListener('click', () => setDir('rtl'));

/* ---- Dropdowns ---- */
if(notifBtn) {
  notifBtn.addEventListener('click', e => {
    e.stopPropagation();
    notifDropdown.classList.toggle('open');
    if(profileDropdown) profileDropdown.classList.remove('open');
  });
}
if(profileBtn) {
  profileBtn.addEventListener('click', e => {
    e.stopPropagation();
    profileDropdown.classList.toggle('open');
    if(notifDropdown) notifDropdown.classList.remove('open');
  });
}
document.addEventListener('click', () => {
  if(notifDropdown) notifDropdown.classList.remove('open');
  if(profileDropdown) profileDropdown.classList.remove('open');
});

/* ---- Logout ---- */
function doLogout() {
  if (confirm('Are you sure you want to logout?')) {
    alert('You have been logged out.');
  }
}
if(logoutBtn) logoutBtn.addEventListener('click', doLogout);
if(profileLogout) profileLogout.addEventListener('click', e => { e.preventDefault(); doLogout(); });

/* ---- Colour Swatches ---- */
swatches.forEach(s => {
  s.addEventListener('click', () => {
    swatches.forEach(x => x.classList.remove('active'));
    s.classList.add('active');
    document.documentElement.style.setProperty('--primary', s.dataset.color);
    setTimeout(renderCharts, 50);
  });
});

/* ==============================
   CHARTS
   ============================== */
let pieChart, barChart, lineChart;

function chartColors() {
  const dark = document.documentElement.getAttribute('data-theme') === 'dark';
  const style = getComputedStyle(document.documentElement);
  const primaryColor = style.getPropertyValue('--primary').trim() || '#ff3b3b';
  
  return {
    text:  dark ? '#9ba0aa' : '#6b7280',
    grid:  dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)',
    primary: primaryColor,
  };
}

function renderCharts() {
  const c = chartColors();

  // Destroy previous
  [pieChart, barChart, lineChart].forEach(ch => ch && ch.destroy());

  /* PIE */
  const pieCtx = document.getElementById('pieChart');
  if (pieCtx) {
    pieChart = new Chart(pieCtx, {
      type: 'doughnut',
      data: {
        labels: ['In Progress', 'Completed', 'On Hold', 'Awaiting Parts'],
        datasets: [{
          data: [12, 48, 5, 9],
          backgroundColor: ['#00cfe8','#28c76f','#ff4d4d', c.primary],
          borderColor: 'transparent',
          hoverOffset: 8,
        }]
      },
      options: {
        responsive: true, maintainAspectRatio: false, cutout: '70%',
        plugins: {
          legend: { position: 'bottom', labels: { color: c.text, font: { family: 'Poppins', size: 12 }, padding: 16 } }
        }
      }
    });
  }

  /* BAR */
  const barCtx = document.getElementById('barChart');
  if (barCtx) {
    barChart = new Chart(barCtx, {
      type: 'bar',
      data: {
        labels: ['Jan','Feb','Mar','Apr','May','Jun'],
        datasets: [{
          label: 'Revenue ($K)',
          data: [38, 52, 45, 61, 55, 74],
          backgroundColor: c.primary,
          borderRadius: 6,
        }]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { ticks: { color: c.text }, grid: { color: c.grid, display: false } },
          y: { ticks: { color: c.text }, grid: { color: c.grid } }
        }
      }
    });
  }

  /* LINE */
  const lineCtx = document.getElementById('lineChart');
  if (lineCtx) {
    // Hex to RGBA for chart fill
    let rgb = "255, 59, 59"; // default
    if (c.primary.startsWith('#')) {
      const hex = c.primary.replace('#', '');
      const bigint = parseInt(hex, 16);
      const r = (bigint >> 16) & 255;
      const g = (bigint >> 8) & 255;
      const b = bigint & 255;
      rgb = `${r}, ${g}, ${b}`;
    }

    lineChart = new Chart(lineCtx, {
      type: 'line',
      data: {
        labels: ['Week 1','Week 2','Week 3','Week 4','Week 5','Week 6','Week 7','Week 8'],
        datasets: [
          {
            label: 'Projects Started',
            data: [4, 7, 5, 9, 8, 11, 10, 14],
            borderColor: c.primary, 
            backgroundColor: `rgba(${rgb}, 0.1)`,
            tension: 0.4, fill: true, pointBackgroundColor: c.primary,
            borderWidth: 2
          },
          {
            label: 'Projects Completed',
            data: [2, 5, 4, 7, 6, 9, 8, 12],
            borderColor: '#28c76f', 
            backgroundColor: 'rgba(40, 199, 111, 0.08)',
            tension: 0.4, fill: true, pointBackgroundColor: '#28c76f',
            borderWidth: 2
          }
        ]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { labels: { color: c.text, font: { family: 'Poppins', size: 12 } } } },
        scales: {
          x: { ticks: { color: c.text }, grid: { color: c.grid, display: false } },
          y: { ticks: { color: c.text }, grid: { color: c.grid } }
        }
      }
    });
  }
}

/* ==============================
   PROJECTS DATA
   ============================== */
const projectsData = [
  { car:'1967 Ford Mustang', client:'Robert Hayes', type:'Full Restoration', progress:85, status:'active', tags:['Engine','Bodywork','Interior'] },
  { car:'1955 Chevrolet Bel Air', client:'Sandra Moore', type:'Bodywork & Paint', progress:100, status:'done', tags:['Paint','Chrome'] },
  { car:'1970 Dodge Charger', client:'Marcus Bell', type:'Engine Rebuild', progress:42, status:'active', tags:['Engine','Fuel System'] },
  { car:'1963 Volkswagen Beetle', client:'Emily Park', type:'Interior Reupholstery', progress:67, status:'active', tags:['Interior','Electrical'] },
  { car:'1957 Cadillac Eldorado', client:'Charles King', type:'Full Restoration', progress:20, status:'hold', tags:['Engine','Paint','Interior'] },
  { car:'1969 Pontiac GTO', client:'Patricia Scott', type:'Electrical Overhaul', progress:100, status:'done', tags:['Electrical','Gauges'] },
];

function renderProjects() {
  const grid = document.getElementById('projectsGrid');
  if (!grid) return;
  grid.innerHTML = projectsData.map(p => {
    const statusClass = p.status === 'active' ? 'status-active' : p.status === 'done' ? 'status-done' : 'status-hold';
    const statusText  = p.status === 'active' ? 'In Progress' : p.status === 'done' ? 'Completed' : 'On Hold';
    const statusIcon  = p.status === 'active' ? 'fa-spinner' : p.status === 'done' ? 'fa-circle-check' : 'fa-pause';
    return `
      <div class="project-card">
        <div class="project-car">${p.car}</div>
        <div class="project-client"><i class="fa-solid fa-user"></i> ${p.client} &nbsp;·&nbsp; ${p.type}</div>
        <div class="project-meta">${p.tags.map(t=>`<span class="meta-tag">${t}</span>`).join('')}</div>
        <div class="progress-label"><span>Progress</span><span>${p.progress}%</span></div>
        <div class="progress-bar-wrap"><div class="progress-bar-fill" style="width:${p.progress}%"></div></div>
        <span class="project-status ${statusClass}"><i class="fa-solid ${statusIcon}"></i>${statusText}</span>
      </div>`;
  }).join('');
}

/* ==============================
   GALLERY DATA
   ============================== */
const galleryData = [
  { car:'1967 Ford Mustang', beforeImg:'mustang_before_dasboard.png', afterImg:'mustang_after_dashboard.png', beforeLabel:'Rusty shell – stripped frame', afterLabel:'Show-ready glossy black' },
  { car:'1955 Chevrolet Bel Air', beforeImg:'belair_before.png', afterImg:'belair_after.png', beforeLabel:'Faded two-tone paint, dents', afterLabel:'Turquoise & ivory perfection' },
  { car:'1970 Dodge Charger', beforeImg:'charger_before.png', afterImg:'charger_after.png', beforeLabel:'Seized engine, rot', afterLabel:'440 big-block roaring again' }
];

function renderGallery() {
  const grid = document.getElementById('galleryGrid');
  if (!grid) return;
  grid.innerHTML = galleryData.map((g, i) => `
    <div class="gallery-card" data-index="${i}">
      <div class="gallery-before" style="background-image: url('${g.beforeImg}')">
        <div class="gallery-overlay">
          <span style="letter-spacing:2px;color:#fff">BEFORE</span>
        </div>
      </div>
      <div class="gallery-after" style="background-image: url('${g.afterImg}')">
        <div class="gallery-overlay">
          <span style="letter-spacing:2px;color:var(--primary)">AFTER</span>
        </div>
      </div>
      <div class="gallery-label">
        <strong>${g.car}</strong><br/>
        <span class="gl-desc">${g.beforeLabel}</span>
      </div>
    </div>
  `).join('');

  // Update description on hover
  document.querySelectorAll('.gallery-card').forEach((card) => {
    const idx = card.dataset.index;
    const desc = card.querySelector('.gl-desc');
    card.addEventListener('mouseenter', () => { desc.textContent = galleryData[idx].afterLabel; });
    card.addEventListener('mouseleave', () => { desc.textContent = galleryData[idx].beforeLabel; });
  });
}

/* ==============================
   INVOICES DATA
   ============================== */
const invoicesData = [
  { id:'INV-001', client:'Robert Hayes',   car:'1967 Ford Mustang',      amount:'$18,500', date:'2025-03-15', status:'paid' },
  { id:'INV-002', client:'Sandra Moore',   car:'1955 Chevrolet Bel Air', amount:'$9,200',  date:'2025-04-02', status:'paid' },
  { id:'INV-003', client:'Marcus Bell',    car:'1970 Dodge Charger',     amount:'$14,750', date:'2025-04-20', status:'pending' },
  { id:'INV-004', client:'Emily Park',     car:'1963 VW Beetle',         amount:'$6,300',  date:'2025-03-28', status:'overdue' },
  { id:'INV-005', client:'Charles King',   car:'1957 Cadillac Eldorado', amount:'$32,000', date:'2025-05-01', status:'pending' },
  { id:'INV-006', client:'Patricia Scott', car:'1969 Pontiac GTO',       amount:'$11,800', date:'2025-02-18', status:'paid' },
];

function renderInvoices() {
  const tbody = document.getElementById('invoiceTableBody');
  if (!tbody) return;
  tbody.innerHTML = invoicesData.map(inv => `
    <tr>
      <td><strong style="color:var(--primary)">${inv.id}</strong></td>
      <td>${inv.client}</td>
      <td>${inv.car}</td>
      <td><strong>${inv.amount}</strong></td>
      <td>${inv.date}</td>
      <td><span class="badge-${inv.status}">${inv.status.charAt(0).toUpperCase()+inv.status.slice(1)}</span></td>
    </tr>
  `).join('');
}

/* ==============================
   TIMELINE DATA
   ============================== */
const timelineData = [
  { date:'Jan 10, 2025', title:'Vehicle Intake & Assessment', desc:'Car received, full condition report documented, photography complete.', state:'done' },
  { date:'Jan 18, 2025', title:'Disassembly & Sandblasting', desc:'Full teardown of body panels, engine bay blasted to bare metal.', state:'done' },
  { date:'Feb 05, 2025', title:'Frame & Structural Repair', desc:'Chassis straightened, rusted floor pans replaced with new steel.', state:'done' },
  { date:'Feb 28, 2025', title:'Engine Rebuild', desc:'Block bored and balanced, new pistons, rings, bearings and cam installed.', state:'done' },
  { date:'Mar 15, 2025', title:'Bodywork & Panel Fitting', desc:'Body filler work, panel gaps dialled in, final bodywork blocking.', state:'active' },
  { date:'Apr 02, 2025', title:'Paint & Clear Coat', desc:'Three-stage paint application in original factory colour.', state:'pending' },
  { date:'Apr 20, 2025', title:'Interior Installation', desc:'New upholstery, carpets, headliner and dash restoration.', state:'pending' },
  { date:'May 08, 2025', title:'Final Assembly & QC', desc:'All components re-installed, full road test, detailing and delivery.', state:'pending' },
];

function renderTimeline() {
  const wrap = document.getElementById('timelineWrap');
  if (!wrap) return;
  wrap.innerHTML = timelineData.map(t => `
    <div class="tl-item">
      <div class="tl-dot ${t.state}"></div>
      <div class="tl-card">
        <div class="tl-date"><i class="fa-solid fa-calendar-days"></i> ${t.date}</div>
        <div class="tl-title">${t.title}</div>
        <div class="tl-desc">${t.desc}</div>
      </div>
    </div>
  `).join('');
}

/* ==============================
   MESSAGES DATA
   ============================== */
const messagesData = [
  {
    id: 1, sender:'Robert Hayes', avatar:'RH', time:'10:32 AM', preview:'Any update on the Mustang?',
    chat: [
      { from:'them', text:'Hey James, any update on the Mustang? Getting excited!' },
      { from:'me',   text:"Robert! Great timing. We're finishing the bodywork this week." },
      { from:'them', text:'That is amazing news. Will the colour match be exact?' },
      { from:'me',   text:'Absolutely — original factory code, three-stage application.' },
    ]
  },
  {
    id: 2, sender:'Marcus Bell', avatar:'MB', time:'Yesterday', preview:'Parts arrived — which ones?',
    chat: [
      { from:'them', text:'Marcus here. The parts box arrived — which ones are inside?' },
      { from:'me',   text:'Carburettor rebuild kit, new timing chain, and the cam bearings.' },
      { from:'them', text:'Perfect. When does the engine go back in?' },
      { from:'me',   text:'Targeting next Thursday once machine-shop work is back.' },
    ]
  },
  {
    id: 3, sender:'Sandra Moore', avatar:'SM', time:'Mon', preview:'Invoice paid — receipt?',
    chat: [
      { from:'them', text:'Hi James, I just paid invoice #INV-002. Can you send a receipt?' },
      { from:'me',   text:'Of course Sandra! Receipt sent to your email just now.' },
      { from:'them', text:'Wonderful. The Bel Air looked absolutely incredible. Thank you!' },
    ]
  },
];

let activeMsgId = null;

function renderMsgList() {
  const list = document.getElementById('msgList');
  if (!list) return;
  list.innerHTML = messagesData.map(m => `
    <div class="msg-item ${activeMsgId === m.id ? 'active' : ''}" data-id="${m.id}">
      <div class="msg-item-top">
        <span class="msg-sender">${m.sender}</span>
        <span class="msg-time">${m.time}</span>
      </div>
      <div class="msg-preview">${m.preview}</div>
    </div>
  `).join('');
  list.querySelectorAll('.msg-item').forEach(item => {
    item.addEventListener('click', () => {
      activeMsgId = parseInt(item.dataset.id);
      openChat(activeMsgId);
      renderMsgList();
    });
  });
}

function openChat(id) {
  const convo = messagesData.find(m => m.id === id);
  if (!convo) return;
  const header = document.getElementById('chatHeader');
  if(header) header.innerHTML = `<i class="fa-solid fa-user-circle" style="color:var(--primary); font-size:1.2rem;"></i> ${convo.sender}`;
  const body = document.getElementById('chatBody');
  if(body) {
    body.innerHTML = convo.chat.map(c => `<div class="bubble ${c.from}">${c.text}</div>`).join('');
    body.scrollTop = body.scrollHeight;
  }
}

if(sendMsgBtn) sendMsgBtn.addEventListener('click', sendMessage);
if(chatInput) chatInput.addEventListener('keydown', e => { if (e.key === 'Enter') sendMessage(); });

function sendMessage() {
  if(!chatInput) return;
  const val = chatInput.value.trim();
  if (!val || !activeMsgId) return;
  const body = document.getElementById('chatBody');
  if(body) {
    body.insertAdjacentHTML('beforeend', `<div class="bubble me">${val}</div>`);
    body.scrollTop = body.scrollHeight;
  }
  chatInput.value = '';
  const convo = messagesData.find(m => m.id === activeMsgId);
  if (convo) convo.chat.push({ from:'me', text: val });
}

/* ==============================
   SCHEDULE FORM
   ============================== */
if(scheduleForm) {
  scheduleForm.addEventListener('submit', e => {
    e.preventDefault();
    scheduleForm.style.display = 'none';
    if(formSuccess) formSuccess.style.display = 'flex';
    setTimeout(() => {
      if(formSuccess) formSuccess.style.display = 'none';
      scheduleForm.reset();
      scheduleForm.style.display = 'block';
    }, 4000);
  });
}

/* ==============================
   INIT
   ============================== */
function init() {
  // Restore preferences
  const savedTheme = localStorage.getItem('rg-theme') || 'dark';
  const savedDir   = localStorage.getItem('rg-dir')   || 'ltr';
  setTheme(savedTheme === 'dark');
  setDir(savedDir);

  // Render all sections
  renderProjects();
  renderGallery();
  renderInvoices();
  renderTimeline();
  renderMsgList();
  
  // Default page
  showPage('dashboard');

  // Load Charts safely
  setTimeout(() => {
    if(typeof Chart !== 'undefined') {
       renderCharts();
    }
  }, 200);

  // Responsive sidebar check
  window.addEventListener('resize', () => {
    if (window.innerWidth > 1024) closeSidebar();
  });
}

document.addEventListener('DOMContentLoaded', init);
