const state = {
  apps: [],
  query: '',
  category: 'Todas',
  theme: localStorage.getItem('profeFelipeHubTheme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
};

const $ = selector => document.querySelector(selector);
const $$ = selector => document.querySelectorAll(selector);

const normalize = value => String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

// --- Manejo del Tema Claro / Oscuro ---
function applyTheme(theme) {
  state.theme = theme;
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('profeFelipeHubTheme', theme);
  
  const themeBtn = $('#themeToggle');
  if (themeBtn) {
    themeBtn.textContent = theme === 'dark' ? '☀️' : '🌙';
    themeBtn.setAttribute('aria-label', theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro');
  }
}

function toggleTheme() {
  applyTheme(state.theme === 'dark' ? 'light' : 'dark');
}

// --- Carga de Aplicaciones desde JSON ---
async function loadApps() {
  try {
    const res = await fetch('./data/apps.json');
    if (!res.ok) throw new Error('No se pudo cargar data/apps.json');
    state.apps = await res.json();
    renderStats();
    renderFilters();
    renderApps();
  } catch (err) {
    console.error('Error al cargar catálogo:', err);
    $('#appsGrid').innerHTML = `
      <div class="empty-state">
        <h3>⚠️ Ocurrió un problema al cargar las aplicaciones</h3>
        <p>${err.message}</p>
      </div>
    `;
  }
}

// --- Renderizado de Métricas y Estadísticas Globales ---
function renderStats() {
  const activeApps = state.apps.filter(a => a.estado === 'Activa').length;
  $('#statActiveApps').textContent = `${activeApps}+`;
  $('#statTotalItems').textContent = '800+';
  $('#statUsers').textContent = '100%';
}

// --- Renderizado de Botones de Filtro ---
function renderFilters() {
  const categories = ['Todas', ...new Set(state.apps.map(a => a.categoria))];
  const container = $('#filtersContainer');
  if (!container) return;

  container.innerHTML = categories.map(cat => `
    <button type="button" class="filter-btn ${cat === state.category ? 'active' : ''}" data-category="${cat}">
      ${cat}
    </button>
  `).join('');

  container.onclick = event => {
    const btn = event.target.closest('.filter-btn');
    if (!btn) return;
    state.category = btn.dataset.category;
    $$('.filter-btn').forEach(b => b.classList.toggle('active', b === btn));
    renderApps();
  };
}

// --- Filtrado y Renderizado de Aplicaciones ---
function filteredApps() {
  const q = normalize(state.query);
  return state.apps.filter(app => {
    const haystack = normalize([
      app.nombre,
      app.descripcion,
      app.categoria,
      app.metricas,
      ...(app.etiquetas || [])
    ].join(' '));

    const matchesQuery = !q || haystack.includes(q);
    const matchesCategory = state.category === 'Todas' || app.categoria === state.category;

    return matchesQuery && matchesCategory;
  });
}

function renderApps() {
  const container = $('#appsGrid');
  if (!container) return;

  const items = filteredApps();
  container.innerHTML = '';

  if (!items.length) {
    container.innerHTML = `
      <div class="empty-state">
        <h3>🔍 No encontramos herramientas con esa búsqueda</h3>
        <p>Intenta buscando con términos como "juegos", "deportes", "salud" o limpia los filtros.</p>
      </div>
    `;
    return;
  }

  items.forEach(app => {
    const card = document.createElement('article');
    card.className = 'app-card';
    card.dataset.id = app.id;

    const isUpcoming = app.estado === 'Próximamente';

    card.innerHTML = `
      <div>
        <div class="card-top">
          <div class="app-icon-wrapper">${app.icono || '📱'}</div>
          <span class="status-badge ${app.badge_color || 'green'}">
            ${app.estado === 'Activa' ? '🟢' : '🚀'} ${app.estado}
          </span>
        </div>

        <span class="app-category">${app.categoria}</span>
        <h3 class="app-title">${app.nombre}</h3>
        <p class="app-description">${app.descripcion}</p>
        
        <div class="app-metrics">
          <span>⚡ ${app.metricas}</span>
        </div>

        <div class="app-tags">
          ${(app.etiquetas || []).map(t => `<span class="app-tag">${t}</span>`).join('')}
        </div>
      </div>

      <div class="card-actions">
        ${isUpcoming ? `
          <button type="button" class="btn-launch disabled">
            ⏳ En Desarrollo
          </button>
        ` : `
          <a href="${app.url}" class="btn-launch">
            Abrir Aplicación <b>→</b>
          </a>
        `}
      </div>
    `;

    // Efecto de brillo de mouse hover interactivo
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
      card.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
    });

    container.appendChild(card);
  });
}

// --- Event Listeners y Teclado ---
function bindEvents() {
  $('#themeToggle')?.addEventListener('click', toggleTheme);

  const searchInput = $('#searchInput');
  if (searchInput) {
    searchInput.addEventListener('input', e => {
      state.query = e.target.value;
      renderApps();
    });
  }

  // Atajo de teclado Cmd+K o Ctrl+K
  document.addEventListener('keydown', e => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      searchInput?.focus();
    }
  });

  // Modal de Sugerencias de Nuevas Apps
  const modal = $('#suggestionModal');
  $('#openSuggestionBtn')?.addEventListener('click', () => modal?.showModal());
  $('#closeSuggestionBtn')?.addEventListener('click', () => modal?.close());
  
  modal?.addEventListener('click', e => {
    if (e.target === modal) modal.close();
  });

  $('#suggestionForm')?.addEventListener('submit', e => {
    e.preventDefault();
    alert('¡Muchas gracias por tu sugerencia! La revisaremos para incorporarla al plan de desarrollo.');
    modal?.close();
    $('#suggestionForm').reset();
  });
}

// --- Inicialización ---
applyTheme(state.theme);
bindEvents();
loadApps();
