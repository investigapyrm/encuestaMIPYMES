(function () {
  'use strict';

  const cfg = window.APP_CONFIG || {};
  const storageKey = 'encuesta_mipymes_records_v1';
  const sessionKey = 'encuesta_mipymes_session_v1';

  const state = {
    schema: null,
    session: null,
    records: [],
    currentView: 'inicio'
  };

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

  document.addEventListener('DOMContentLoaded', init);

  async function init() {
    bindGlobalEvents();
    await loadSchema();
    loadSession();
    loadRecords();
    updateConnection();
    renderAdmin();
    if (state.session) {
      showApp();
    }
    window.addEventListener('online', updateConnection);
    window.addEventListener('offline', updateConnection);
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('service-worker.js').catch(() => {});
    }
  }

  function bindGlobalEvents() {
    $('#login-form').addEventListener('submit', handleLogin);
    $('#logout-btn').addEventListener('click', logout);
    $$('.tab').forEach((btn) => btn.addEventListener('click', () => switchView(btn.dataset.view)));
    $$('[data-go]').forEach((btn) => btn.addEventListener('click', () => switchView(btn.dataset.go)));
    $('#sync-btn').addEventListener('click', syncPending);
    $('#export-csv-btn').addEventListener('click', exportCsv);
    $('#search-records').addEventListener('input', renderRecords);
    $('#status-filter').addEventListener('change', renderRecords);
  }

  async function loadSchema() {
    const res = await fetch(cfg.dataSchemaUrl || 'data/survey-schema.json', { cache: 'no-store' });
    state.schema = await res.json();
    $('#kpi-fields').textContent = String(state.schema.fields.length);
    renderSurveyForm();
  }

  function loadSession() {
    try {
      state.session = JSON.parse(localStorage.getItem(sessionKey) || 'null');
    } catch (err) {
      state.session = null;
    }
  }

  function saveSession() {
    localStorage.setItem(sessionKey, JSON.stringify(state.session));
  }

  function loadRecords() {
    try {
      state.records = JSON.parse(localStorage.getItem(storageKey) || '[]');
    } catch (err) {
      state.records = [];
    }
    refreshAll();
  }

  function persistRecords() {
    localStorage.setItem(storageKey, JSON.stringify(state.records));
    refreshAll();
  }

  async function handleLogin(event) {
    event.preventDefault();
    const user = $('#login-user').value.trim();
    const password = $('#login-password').value;
    const status = $('#login-status');
    status.textContent = 'Validando acceso...';
    status.classList.remove('error');

    try {
      let result;
      if (cfg.gasExecUrl) {
        result = await apiCall('login', { user, password });
      } else if (cfg.allowLocalDemoLogin) {
        const localUser = findLocalUser(user, password);
        if (!localUser) throw new Error('Backend no configurado o credenciales locales incorrectas.');
        result = { success: true, token: `local-${Date.now()}`, user: localUser };
      } else {
        throw new Error('Backend no configurado o credenciales locales incorrectas.');
      }
      if (!result.success) throw new Error(result.message || 'No se pudo iniciar sesión.');
      state.session = {
        token: result.token,
        user: result.user || { username: user, name: user, role: 'cargador' },
        createdAt: new Date().toISOString()
      };
      saveSession();
      showApp();
    } catch (err) {
      status.textContent = err.message;
      status.classList.add('error');
    }
  }

  function findLocalUser(user, password) {
    const users = Array.isArray(cfg.localDemoUsers) ? cfg.localDemoUsers : [];
    const found = users.find((item) => item.username.toLowerCase() === user.toLowerCase() && item.password === password);
    if (!found) return null;
    return {
      username: found.username,
      name: found.name || found.username,
      role: found.role || 'cargador'
    };
  }

  function showApp() {
    $('#login-view').hidden = true;
    $('#app-view').hidden = false;
    $('#session-user').textContent = `${state.session.user.name || state.session.user.username} · ${state.session.user.role || 'usuario'}`;
    refreshAll();
  }

  function logout() {
    state.session = null;
    localStorage.removeItem(sessionKey);
    $('#app-view').hidden = true;
    $('#login-view').hidden = false;
    $('#login-password').value = '';
  }

  function switchView(view) {
    state.currentView = view;
    $$('.tab').forEach((btn) => btn.classList.toggle('active', btn.dataset.view === view));
    $$('.view').forEach((node) => node.classList.toggle('active-view', node.id === `view-${view}`));
    if (view === 'dashboard') renderDashboard();
    if (view === 'registros') renderRecords();
    if (view === 'sync') renderQueue();
  }

  function renderSurveyForm() {
    const form = $('#survey-form');
    form.innerHTML = '';
    const byBlock = new Map(state.schema.blocks.map((block) => [block.id, { ...block, fields: [] }]));
    state.schema.fields.forEach((field) => {
      if (!byBlock.has(field.block)) byBlock.set(field.block, { id: field.block, title: field.block, fields: [] });
      byBlock.get(field.block).fields.push(field);
    });

    byBlock.forEach((block) => {
      const section = document.createElement('section');
      section.className = 'form-block';
      section.innerHTML = `<h3>${escapeHtml(block.title)}</h3>${block.description ? `<p class="form-block-description">${escapeHtml(block.description)}</p>` : ''}`;
      block.fields.forEach((field) => section.appendChild(renderField(field)));
      form.appendChild(section);
    });

    const actions = document.createElement('div');
    actions.className = 'form-actions';
    actions.innerHTML = `
      <button class="secondary-btn" type="button" id="save-draft-btn">Guardar borrador local</button>
      <button class="primary-btn" type="submit">Guardar encuesta</button>
    `;
    form.appendChild(actions);
    form.addEventListener('input', () => {
      applyConditions();
      updateProgress();
    });
    form.addEventListener('change', () => {
      applyConditions();
      updateProgress();
    });
    form.addEventListener('submit', saveSurvey);
    $('#save-draft-btn').addEventListener('click', () => saveSurvey(null, true));
    applyConditions();
    updateProgress();
  }

  function renderField(field) {
    const tpl = $('#field-template').content.firstElementChild.cloneNode(true);
    tpl.dataset.code = field.code;
    const label = $('label', tpl);
    const control = $('.field-control', tpl);
    const hint = $('.field-hint', tpl);
    label.textContent = field.required ? `${field.label} *` : field.label;
    hint.textContent = field.hint || '';

    if (field.type === 'radio') {
      control.appendChild(renderRadio(field, resolveOptions(field)));
    } else if (field.type === 'likert') {
      control.appendChild(renderLikert(field));
    } else if (field.type === 'textarea') {
      const input = document.createElement('textarea');
      input.name = field.code;
      input.required = !!field.required;
      control.appendChild(input);
    } else {
      const input = document.createElement('input');
      input.name = field.code;
      input.type = field.type === 'email' ? 'email' : field.type === 'number' ? 'number' : 'text';
      input.required = !!field.required;
      if (field.min !== undefined) input.min = field.min;
      if (field.max !== undefined) input.max = field.max;
      if (field.step !== undefined) input.step = field.step;
      control.appendChild(input);
      if (field.suffix) hint.textContent = `${hint.textContent ? `${hint.textContent} ` : ''}Unidad: ${field.suffix}`;
    }
    return tpl;
  }

  function resolveOptions(field) {
    if (field.options) return field.options;
    const scale = state.schema.scales[field.scale];
    return scale ? scale.options : [];
  }

  function renderRadio(field, options) {
    const wrap = document.createElement('div');
    wrap.className = 'radio-grid';
    options.forEach((opt) => {
      const label = document.createElement('label');
      label.className = 'option-tile';
      label.innerHTML = `<input type="radio" name="${field.code}" value="${escapeAttr(opt.value)}" ${field.required ? 'required' : ''}> <span>${escapeHtml(opt.label)}</span>`;
      wrap.appendChild(label);
    });
    return wrap;
  }

  function renderLikert(field) {
    const scale = state.schema.scales[field.scale] || { min: 1, max: 5, labels: {} };
    const wrap = document.createElement('div');
    wrap.className = 'likert-grid';
    for (let value = scale.min; value <= scale.max; value += 1) {
      const label = document.createElement('label');
      label.className = 'likert-option';
      label.title = scale.labels[String(value)] || '';
      label.innerHTML = `<input type="radio" name="${field.code}" value="${value}" ${field.required ? 'required' : ''}> <span>${value}</span>`;
      wrap.appendChild(label);
    }
    return wrap;
  }

  function applyConditions() {
    const values = getFormValues();
    state.schema.fields.forEach((field) => {
      const row = $(`[data-code="${cssEscape(field.code)}"]`);
      if (!row) return;
      const visible = !field.condition || evaluateCondition(field.condition, values);
      row.classList.toggle('hidden', !visible);
      $$('input, textarea, select', row).forEach((input) => {
        input.disabled = !visible;
        if (!visible) input.required = false;
        else input.required = !!field.required;
      });
    });
  }

  function evaluateCondition(condition, values) {
    const left = values[condition.field];
    if (condition.operator === '>') return Number(left || 0) > Number(condition.value);
    if (condition.operator === '=') return String(left) === String(condition.value);
    return true;
  }

  function updateProgress() {
    const visibleRequired = state.schema.fields.filter((field) => {
      const row = $(`[data-code="${cssEscape(field.code)}"]`);
      return field.required && row && !row.classList.contains('hidden');
    });
    const values = getFormValues();
    const done = visibleRequired.filter((field) => values[field.code] !== undefined && values[field.code] !== '').length;
    const pct = visibleRequired.length ? Math.round((done / visibleRequired.length) * 100) : 0;
    $('#progress-label').textContent = `${pct}%`;
    $('#progress-bar').style.width = `${pct}%`;
  }

  function getFormValues() {
    const data = {};
    const formData = new FormData($('#survey-form'));
    for (const [key, value] of formData.entries()) data[key] = value;
    return data;
  }

  async function saveSurvey(event, draftOnly) {
    if (event) event.preventDefault();
    applyConditions();
    const form = $('#survey-form');
    if (!draftOnly && !form.reportValidity()) return;
    const data = getFormValues();
    const record = {
      id: data.__local_id || `local-${Date.now()}`,
      submissionId: `SUB-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: draftOnly ? 'pendiente' : 'pendiente',
      attempts: 0,
      lastError: '',
      user: state.session?.user?.username || 'local',
      data
    };
    state.records.unshift(record);
    persistRecords();
    form.reset();
    applyConditions();
    updateProgress();
    switchView('registros');
  }

  async function syncPending() {
    const pending = state.records.filter((record) => record.status !== 'sincronizado');
    if (!pending.length) {
      $('#sync-status').textContent = 'No hay registros pendientes.';
      return;
    }
    if (!cfg.gasExecUrl) {
      $('#sync-status').textContent = 'Backend GAS no configurado. Los registros quedan guardados localmente como pendientes.';
      renderQueue();
      return;
    }
    $('#sync-status').textContent = 'Sincronizando pendientes...';
    for (const record of pending) {
      try {
        const result = await apiCall('saveSurvey', { token: state.session.token, record, legacy: buildLegacyPayload(record) });
        if (!result.success) throw new Error(result.message || 'No se confirmó el guardado.');
        record.status = 'sincronizado';
        record.remoteId = result.remoteId || record.submissionId;
        record.syncedAt = new Date().toISOString();
        record.lastError = '';
      } catch (err) {
        record.status = 'error';
        record.attempts = (record.attempts || 0) + 1;
        record.lastError = err.message;
        record.lastAttemptAt = new Date().toISOString();
      }
    }
    localStorage.setItem('encuesta_mipymes_last_sync_v1', new Date().toISOString());
    persistRecords();
    $('#sync-status').textContent = 'Proceso de sincronización finalizado.';
  }

  function buildLegacyPayload(record) {
    const blockById = new Map(state.schema.blocks.map((block) => [block.id, block]));
    const header = state.schema.fields.map((field) => field.code);
    const wide = {};
    const long = state.schema.fields.map((field) => {
      const block = blockById.get(field.block);
      const value = record.data[field.code] ?? '';
      wide[field.code] = value;
      return ['', '', block?.title || field.block || '', field.code, field.label || field.code, value];
    });
    return {
      submissionId: record.submissionId,
      header,
      wide,
      long
    };
  }

  async function apiCall(action, payload) {
    const body = JSON.stringify({ action, payload });
    const res = await fetch(cfg.gasExecUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body
    });
    const text = await res.text();
    try {
      return JSON.parse(text);
    } catch (err) {
      if (/Sign in|accounts.google|Forbidden|403/i.test(text)) {
        throw new Error('El backend de Google Apps Script no está público o requiere autorización.');
      }
      throw new Error('El backend no devolvió JSON válido.');
    }
  }

  function refreshAll() {
    updateKpis();
    renderRecords();
    renderDashboard();
    renderQueue();
    renderAdmin();
  }

  function updateKpis() {
    $('#kpi-local').textContent = String(state.records.length);
    $('#kpi-pending').textContent = String(state.records.filter((r) => r.status !== 'sincronizado').length);
    $('#kpi-synced').textContent = String(state.records.filter((r) => r.status === 'sincronizado').length);
  }

  function renderRecords() {
    const tbody = $('#records-body');
    if (!tbody) return;
    const query = ($('#search-records')?.value || '').toLowerCase();
    const status = $('#status-filter')?.value || '';
    tbody.innerHTML = '';
    state.records
      .filter((record) => !status || record.status === status)
      .filter((record) => {
        const sector = sectorLabel(record.data.q01_sector);
        const haystack = `${record.data.empresa || ''} ${sector} ${record.status}`.toLowerCase();
        return !query || haystack.includes(query);
      })
      .forEach((record) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${formatDate(record.createdAt)}</td>
          <td>${escapeHtml(record.data.empresa || 'Sin empresa')}</td>
          <td>${escapeHtml(sectorLabel(record.data.q01_sector))}</td>
          <td><span class="badge ${record.status === 'pendiente' ? 'pending' : record.status === 'error' ? 'error' : ''}">${escapeHtml(record.status)}</span></td>
          <td><button class="ghost-btn" type="button" data-delete="${escapeAttr(record.id)}">Eliminar local</button></td>
        `;
        tbody.appendChild(tr);
      });
    $$('[data-delete]').forEach((btn) => btn.addEventListener('click', () => {
      state.records = state.records.filter((record) => record.id !== btn.dataset.delete);
      persistRecords();
    }));
  }

  function renderDashboard() {
    const grid = $('#dashboard-grid');
    if (!grid) return;
    const sectors = countBy(state.records, (record) => sectorLabel(record.data.q01_sector) || 'Sin sector');
    const status = countBy(state.records, (record) => record.status || 'pendiente');
    const sizes = countBy(state.records, (record) => sizeLabel(record.data.q03a_tamano_empresa) || 'Sin tamaño');
    grid.innerHTML = '';
    grid.appendChild(chartCard('Sector de actividad', sectors));
    grid.appendChild(chartCard('Estado de sincronización', status));
    grid.appendChild(chartCard('Tamaño de empresa', sizes));
    grid.appendChild(summaryCard());
  }

  function chartCard(title, data) {
    const card = document.createElement('article');
    card.className = 'chart-card';
    const total = Object.values(data).reduce((a, b) => a + b, 0) || 1;
    const rows = Object.entries(data).map(([label, value]) => {
      const pct = Math.round((value / total) * 100);
      return `<div class="bar-row"><span>${escapeHtml(label)}</span><div class="bar-track"><span style="width:${pct}%"></span></div><strong>${value}</strong></div>`;
    }).join('') || '<p class="status-text">Sin datos locales.</p>';
    card.innerHTML = `<h3>${escapeHtml(title)}</h3>${rows}`;
    return card;
  }

  function summaryCard() {
    const card = document.createElement('article');
    card.className = 'chart-card';
    const avgEmployees = average(state.records.map((record) => Number(record.data.q03b_numero_medio_empleados)).filter(Number.isFinite));
    card.innerHTML = `
      <h3>Lectura operativa</h3>
      <p class="status-text">Registros en este dispositivo: ${state.records.length}</p>
      <p class="status-text">Promedio de empleados informado: ${avgEmployees ? avgEmployees.toFixed(1) : 'Sin datos'}</p>
      <p class="status-text">Fuente del instrumento: encuestaMIPYMES.pdf</p>
    `;
    return card;
  }

  function renderQueue() {
    const list = $('#queue-list');
    if (!list) return;
    const pending = state.records.filter((record) => record.status !== 'sincronizado');
    list.innerHTML = pending.map((record) => `
      <article class="queue-item">
        <strong>${escapeHtml(record.data.empresa || record.submissionId)}</strong>
        <p class="status-text">${escapeHtml(record.status)} · intentos: ${record.attempts || 0}</p>
        ${record.lastError ? `<p class="status-text error">${escapeHtml(record.lastError)}</p>` : ''}
      </article>
    `).join('') || '<p class="notice">No hay pendientes en la cola local.</p>';
  }

  function renderAdmin() {
    const lastSync = localStorage.getItem('encuesta_mipymes_last_sync_v1');
    if ($('#admin-gas')) $('#admin-gas').textContent = cfg.gasExecUrl || 'No configurado';
    if ($('#admin-sheet')) $('#admin-sheet').textContent = cfg.spreadsheetId || 'No informado';
    if ($('#admin-version')) $('#admin-version').textContent = `${cfg.appVersion || 'sin versión'} · ${cfg.buildDate || ''}`;
    if ($('#admin-last-sync')) $('#admin-last-sync').textContent = lastSync ? formatDate(lastSync) : 'Sin sincronización';
  }

  function updateConnection() {
    const pill = $('#connection-pill');
    if (!pill) return;
    const online = navigator.onLine;
    pill.textContent = online ? 'Online' : 'Sin conexión';
    pill.classList.toggle('offline', !online);
  }

  function exportCsv() {
    const columns = ['submissionId', 'createdAt', 'status', ...state.schema.fields.map((field) => field.code)];
    const lines = [columns.join(',')];
    state.records.forEach((record) => {
      lines.push(columns.map((column) => csvEscape(record[column] || record.data[column] || '')).join(','));
    });
    const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `encuesta_mipymes_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function countBy(items, fn) {
    return items.reduce((acc, item) => {
      const key = fn(item);
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});
  }

  function average(values) {
    return values.length ? values.reduce((a, b) => a + b, 0) / values.length : 0;
  }

  function sectorLabel(value) {
    return ({ '1': 'Industria', '2': 'Construcción', '3': 'Comercio', '4': 'Servicios' })[String(value || '')] || '';
  }

  function sizeLabel(value) {
    return ({ '1': '6 a 9', '2': '10 a 49', '3': '50 a 249' })[String(value || '')] || '';
  }

  function formatDate(value) {
    if (!value) return '';
    return new Intl.DateTimeFormat('es-PY', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(value));
  }

  function csvEscape(value) {
    const text = String(value).replace(/"/g, '""');
    return `"${text}"`;
  }

  function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
  }

  function escapeAttr(value) {
    return escapeHtml(value);
  }

  function cssEscape(value) {
    return window.CSS && CSS.escape ? CSS.escape(value) : String(value).replace(/[^a-zA-Z0-9_-]/g, '\\$&');
  }
})();
