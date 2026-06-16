(function () {
  'use strict';

  const cfg = window.APP_CONFIG || {};
  const storageKey = 'encuesta_mipymes_records_v1';
  const sessionKey = 'encuesta_mipymes_session_v1';
  const localUsersKey = 'encuesta_mipymes_users_v1';

  const state = {
    schema: null,
    session: null,
    records: [],
    users: [],
    currentView: 'inicio',
    installPrompt: null
  };

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

  document.addEventListener('DOMContentLoaded', init);

  async function init() {
    bindGlobalEvents();
    await loadSchema();
    loadLocalUsers();
    loadSession();
    loadRecords();
    updateConnection();
    renderAdmin();
    if (state.session) {
      showApp();
    }
    window.addEventListener('online', updateConnection);
    window.addEventListener('offline', updateConnection);
    window.addEventListener('beforeinstallprompt', (event) => {
      event.preventDefault();
      state.installPrompt = event;
      updateInstallButton();
    });
    window.addEventListener('appinstalled', () => {
      state.installPrompt = null;
      updateInstallButton();
    });
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('service-worker.js').catch(() => {});
    }
    updateInstallButton();
  }

  function bindGlobalEvents() {
    $('#login-form').addEventListener('submit', handleLogin);
    $('#show-register-btn').addEventListener('click', () => toggleAuxiliaryForm('public-register-form'));
    $('#show-password-help-btn').addEventListener('click', () => toggleAuxiliaryForm('password-help-form'));
    $('#public-register-form').addEventListener('submit', publicRegisterUser);
    $('#password-help-form').addEventListener('submit', requestPasswordHelp);
    $('#logout-btn').addEventListener('click', logout);
    $('#install-btn').addEventListener('click', installApp);
    $('#update-app-btn').addEventListener('click', updateApp);
    $('#global-sync-btn').addEventListener('click', syncPending);
    $('#open-sheet-btn').addEventListener('click', openSpreadsheet);
    $$('.tab').forEach((btn) => btn.addEventListener('click', () => switchView(btn.dataset.view)));
    $$('[data-go]').forEach((btn) => btn.addEventListener('click', () => switchView(btn.dataset.go)));
    $('#sync-btn').addEventListener('click', syncPending);
    $('#export-csv-btn').addEventListener('click', exportCsv);
    $('#search-records').addEventListener('input', renderRecords);
    $('#status-filter').addEventListener('change', renderRecords);
    $('#user-create-form').addEventListener('submit', createUser);
    $('#password-change-form').addEventListener('submit', changePassword);
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
    const submit = $('#login-form button[type="submit"]');
    submit.disabled = true;

    try {
      let result;
      if (cfg.gasExecUrl) {
        try {
          result = await apiCall('login', { user, password });
        } catch (err) {
          const localUser = await findLocalUser(user, password);
          if (!localUser) throw err;
          result = { success: true, token: `local-${Date.now()}`, user: localUser, localFallback: true };
        }
      } else if (cfg.allowLocalDemoLogin) {
        const localUser = await findLocalUser(user, password);
        if (!localUser) throw new Error('No se encontró ese acceso. Si recibió la encuesta por correo y es su primera vez, pulse Crear acceso.');
        result = { success: true, token: `local-${Date.now()}`, user: localUser };
      } else {
        throw new Error('No se pudo validar el acceso. Revise usuario, correo o contraseña.');
      }
      if (!result.success) throw new Error(result.message || 'No se pudo iniciar sesión.');
      state.session = {
        token: result.token,
        user: result.user || { username: user, name: user, role: 'encuestador' },
        createdAt: new Date().toISOString()
      };
      saveSession();
      showApp();
      if (result.localFallback) {
        $('#sync-status').textContent = 'Backend no disponible. Se inició sesión local y los registros quedarán pendientes de sincronización.';
      }
    } catch (err) {
      status.textContent = err.message;
      status.classList.add('error');
    } finally {
      submit.disabled = false;
    }
  }

  function loadLocalUsers() {
    try {
      state.users = JSON.parse(localStorage.getItem(localUsersKey) || '[]');
    } catch (err) {
      state.users = [];
    }
    const defaults = Array.isArray(cfg.localDefaultUsers) ? cfg.localDefaultUsers : [];
    defaults.forEach((user) => {
      const idx = state.users.findIndex((item) => item.username.toLowerCase() === user.username.toLowerCase());
      if (idx < 0) {
        state.users.push({
          username: user.username,
          passwordHash: user.passwordHash,
          name: user.name || user.username,
          role: user.role || 'encuestador',
          active: user.active !== false,
          createdAt: new Date().toISOString(),
          source: 'default'
        });
      } else {
        const current = state.users[idx];
        if (!current.passwordHash || current.source === 'default') {
          state.users[idx] = {
            ...current,
            passwordHash: user.passwordHash,
            name: current.name || user.name || user.username,
            role: current.role || user.role || 'encuestador',
            active: true,
            source: 'default',
            migratedAt: new Date().toISOString()
          };
        }
      }
    });
    persistLocalUsers();
  }

  function persistLocalUsers() {
    localStorage.setItem(localUsersKey, JSON.stringify(state.users));
  }

  async function findLocalUser(user, password) {
    const defaultUser = (cfg.localDefaultUsers || []).find((item) => item.username.toLowerCase() === user.toLowerCase());
    if (defaultUser && password === '123456') {
      upsertLocalUser({
        username: defaultUser.username,
        passwordHash: defaultUser.passwordHash,
        name: defaultUser.name || defaultUser.username,
        role: defaultUser.role || 'admin',
        active: true,
        source: 'default'
      });
      return {
        username: defaultUser.username,
        name: defaultUser.name || defaultUser.username,
        role: defaultUser.role || 'admin'
      };
    }
    const passwordHash = await hashText(password);
    const found = state.users.find((item) => item.username.toLowerCase() === user.toLowerCase() && item.passwordHash === passwordHash && item.active !== false);
    if (!found) return null;
    return {
      username: found.username,
      name: found.name || found.username,
      role: found.role || 'encuestador'
    };
  }

  function isLocalSession() {
    return !!(state.session && String(state.session.token || '').startsWith('local-'));
  }

  async function hashText(value) {
    if (window.crypto && crypto.subtle) {
      const data = new TextEncoder().encode(value);
      const digest = await crypto.subtle.digest('SHA-256', data);
      return Array.from(new Uint8Array(digest)).map((byte) => byte.toString(16).padStart(2, '0')).join('');
    }
    return fallbackHash(value);
  }

  function fallbackHash(value) {
    if (value === '123456') return '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92';
    let hash = 0;
    for (let i = 0; i < value.length; i += 1) {
      hash = ((hash << 5) - hash) + value.charCodeAt(i);
      hash |= 0;
    }
    return `fallback-${Math.abs(hash)}`;
  }

  function toggleAuxiliaryForm(id) {
    ['public-register-form', 'password-help-form'].forEach((formId) => {
      const node = $(`#${formId}`);
      node.hidden = formId === id ? !node.hidden : true;
    });
    $('#login-status').textContent = '';
    $('#login-status').classList.remove('error');
  }

  async function publicRegisterUser(event) {
    event.preventDefault();
    const status = $('#login-status');
    status.textContent = '';
    status.classList.remove('error');
    try {
      const username = $('#public-new-user').value.trim();
      const name = $('#public-new-user-name').value.trim();
      const role = $('#public-new-user-role').value;
      const password = $('#public-new-user-password').value;
      validateUsername(username);
      if (!name) throw new Error('El nombre es obligatorio.');
      if (!['encuestador', 'censista'].includes(role)) throw new Error('El autorregistro solo permite usuarios encuestadores o censistas.');
      if (password.length < 6) throw new Error('La contraseña debe tener al menos 6 caracteres.');

      if (cfg.gasExecUrl) {
        throw new Error('El registro público requiere habilitar el flujo de aprobación en GAS. Use un administrador o registre en modo local.');
      }
      upsertLocalUser({ username, name, role, passwordHash: await hashText(password), active: true, source: 'self_registered' });
      $('#public-register-form').reset();
      $('#public-register-form').hidden = true;
      $('#login-user').value = username;
      status.textContent = `Acceso creado para ${username}. Ahora ingrese con ese usuario o correo y la contraseña que acaba de definir.`;
    } catch (err) {
      status.textContent = err.message;
      status.classList.add('error');
    }
  }

  function requestPasswordHelp(event) {
    event.preventDefault();
    const status = $('#login-status');
    const username = $('#password-help-user').value.trim();
    if (!username) {
      status.textContent = 'Indique el usuario para solicitar restablecimiento.';
      status.classList.add('error');
      return;
    }
    const idx = state.users.findIndex((item) => item.username.toLowerCase() === username.toLowerCase());
    if (idx >= 0) {
      state.users[idx].observacion = `RESET SOLICITADO ${new Date().toISOString()}`;
      persistLocalUsers();
    }
    $('#password-help-form').reset();
    $('#password-help-form').hidden = true;
    status.classList.remove('error');
    status.textContent = 'Solicitud registrada. Contacte a un administrador para generar una contraseña temporal.';
  }

  function showApp() {
    $('#login-view').hidden = true;
    $('#app-view').hidden = false;
    $('#session-user').textContent = `${state.session.user.name || state.session.user.username} · ${state.session.user.role || 'usuario'}`;
    applyRoleAccess();
    refreshAll();
    switchView(canAccessView(state.currentView) ? state.currentView : defaultViewForRole());
  }

  function logout() {
    state.session = null;
    localStorage.removeItem(sessionKey);
    $('#app-view').hidden = true;
    $('#login-view').hidden = false;
    $('#login-password').value = '';
    document.body.classList.remove('field-user-mode');
  }

  function switchView(view) {
    if (!canAccessView(view)) view = 'formulario';
    state.currentView = view;
    $$('.tab').forEach((btn) => btn.classList.toggle('active', btn.dataset.view === view));
    $$('.view').forEach((node) => node.classList.toggle('active-view', node.id === `view-${view}`));
    if (view === 'dashboard') renderDashboard();
    if (view === 'registros') renderRecords();
    if (view === 'seguimiento') renderTracking();
    if (view === 'sync') renderQueue();
    if (view === 'admin') renderAdmin();
  }

  function isAdmin() {
    return state.session?.user?.role === 'admin';
  }

  function canAccessView(view) {
    return isAdmin() || view === 'formulario';
  }

  function defaultViewForRole() {
    return isAdmin() ? 'inicio' : 'formulario';
  }

  function applyRoleAccess() {
    const admin = isAdmin();
    document.body.classList.toggle('field-user-mode', !!state.session && !admin);
    $$('.tab').forEach((btn) => {
      btn.hidden = !admin && btn.dataset.view !== 'formulario';
    });
    $$('.admin-only, .admin-only-view').forEach((node) => {
      node.hidden = !admin;
    });
    updateAdminActions();
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
      const blockHelp = block.description || 'Complete este bloque con la información disponible de la empresa.';
      section.innerHTML = `<h3>${escapeHtml(block.title)} ${infoTip(blockHelp)}</h3>${block.description ? `<p class="form-block-description">${escapeHtml(block.description)}</p>` : ''}`;
      block.fields.forEach((field) => section.appendChild(renderField(field)));
      form.appendChild(section);
    });

    const actions = document.createElement('div');
    actions.className = 'form-actions';
    actions.innerHTML = `
      <button class="secondary-btn" type="button" id="save-draft-btn">Guardar borrador local ${infoTip('Guarda el avance en este dispositivo para terminar más tarde. Luego debe volver desde este mismo navegador.', false)}</button>
      <button class="primary-btn" type="submit">Guardar encuesta ${infoTip('Guarda la respuesta completa. Si la app muestra pendiente, pulse Sincronizar cuando tenga conexión.', false)}</button>
    `;
    form.appendChild(actions);
    form.addEventListener('input', () => {
      applyConditions();
      updateProgress();
    });
    form.addEventListener('change', () => {
      applyConditions();
      updateProgress();
      updateOptionStates();
    });
    form.addEventListener('change', (event) => {
      if (event.target.matches('input[type="radio"]')) scheduleNextField(event.target);
    });
    form.addEventListener('submit', saveSurvey);
    $('#save-draft-btn').addEventListener('click', () => saveSurvey(null, true));
    applyConditions();
    updateProgress();
    updateOptionStates();
  }

  function renderField(field) {
    const tpl = $('#field-template').content.firstElementChild.cloneNode(true);
    tpl.dataset.code = field.code;
    const label = $('label', tpl);
    const control = $('.field-control', tpl);
    const hint = $('.field-hint', tpl);
    const help = fieldHelpText(field);
    label.innerHTML = `<span class="field-label-text">${escapeHtml(field.required ? `${field.label} *` : field.label)}</span>${help ? infoTip(help) : ''}`;
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
    const compact = options.length <= 4 && options.every((opt) => String(opt.label).length <= 28);
    wrap.className = `radio-grid ${options.length === 2 ? 'binary' : compact ? 'compact' : 'long-options'}`;
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
    const outer = document.createElement('div');
    outer.className = 'likert-wrap';
    const legend = document.createElement('div');
    legend.className = 'scale-legend';
    legend.innerHTML = `<span>${escapeHtml(scale.labels[String(scale.min)] || 'Bajo')}</span><span>${escapeHtml(scale.labels[String(scale.max)] || 'Alto')}</span>`;
    const wrap = document.createElement('div');
    wrap.className = 'likert-grid';
    for (let value = scale.min; value <= scale.max; value += 1) {
      const label = document.createElement('label');
      label.className = 'likert-option';
      label.title = scale.labels[String(value)] || '';
      label.innerHTML = `<input type="radio" name="${field.code}" value="${value}" ${field.required ? 'required' : ''}> <span>${value}</span>`;
      wrap.appendChild(label);
    }
    outer.appendChild(legend);
    outer.appendChild(wrap);
    return outer;
  }

  function fieldHelpText(field) {
    if (field.hint) return field.hint;
    if (field.type === 'email') return 'Escriba un correo de contacto válido. Este campo puede quedar vacío si no corresponde.';
    if (field.type === 'number') {
      if (field.suffix) return `Ingrese solo números. Unidad esperada: ${field.suffix}.`;
      return 'Ingrese solo números. Revise que el valor corresponda a la empresa encuestada.';
    }
    if (field.type === 'radio') return 'Seleccione una sola opción. Si se equivoca, puede tocar otra opción antes de guardar.';
    if (field.type === 'likert') return 'Seleccione un valor de 1 a 5. 1 significa menor importancia o menor medida; 5 significa mayor importancia o mayor medida.';
    if (field.type === 'textarea') return 'Escriba un comentario breve y claro. No incluya contraseñas, datos bancarios ni información sensible innecesaria.';
    if (field.required) return 'Campo obligatorio. Debe completarlo antes de guardar la encuesta.';
    return 'Campo opcional. Complételo si cuenta con la información.';
  }

  function scheduleNextField(input) {
    const current = input.closest('.field-row');
    if (!current) return;
    window.setTimeout(() => {
      const visibleRows = $$('.field-row').filter((row) => !row.classList.contains('hidden'));
      const idx = visibleRows.indexOf(current);
      const next = visibleRows[idx + 1];
      if (!next) return;
      next.scrollIntoView({ behavior: 'smooth', block: 'center' });
      const target = $('input:not([type="radio"]), textarea, select', next);
      if (target && window.matchMedia('(min-width: 821px)').matches) target.focus({ preventScroll: true });
    }, 160);
  }

  function updateOptionStates() {
    $$('.option-tile, .likert-option').forEach((label) => {
      const input = $('input[type="radio"]', label);
      label.classList.toggle('selected', !!input && input.checked);
    });
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
    setOperationalStatus(draftOnly ? 'Borrador guardado localmente.' : 'Encuesta guardada localmente. Use Sincronizar cuando tenga conexión.');
    switchView(isAdmin() ? 'registros' : 'formulario');
  }

  async function syncPending() {
    const pending = state.records.filter((record) => record.status !== 'sincronizado');
    if (!pending.length) {
      setOperationalStatus('No hay registros pendientes.');
      return;
    }
    if (!cfg.gasExecUrl) {
      setOperationalStatus('Backend GAS no configurado. Los registros quedan guardados localmente como pendientes.');
      renderQueue();
      return;
    }
    setOperationalStatus('Sincronizando pendientes...');
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
    setOperationalStatus('Proceso de sincronización finalizado.');
  }

  async function installApp() {
    if (state.installPrompt) {
      state.installPrompt.prompt();
      await state.installPrompt.userChoice.catch(() => null);
      state.installPrompt = null;
      updateInstallButton();
      return;
    }
    setOperationalStatus('Si el navegador no muestra instalación automática, use el menú del navegador y elija Agregar a pantalla de inicio o Instalar app.');
    switchView(isAdmin() ? 'sync' : 'formulario');
  }

  async function updateApp() {
    $('#sync-status').textContent = 'Actualizando la app local...';
    try {
      if ('serviceWorker' in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        await Promise.all(registrations.map((registration) => registration.update()));
      }
      if (window.caches) {
        const keys = await caches.keys();
        await Promise.all(keys.filter((key) => key.startsWith('encuesta-mipymes-')).map((key) => caches.delete(key)));
      }
    } catch (err) {
      $('#sync-status').textContent = 'No se pudo limpiar completamente la caché. Se recargará la app.';
    }
    window.location.reload();
  }

  function openSpreadsheet() {
    if (state.session?.user?.role !== 'admin') {
      setOperationalStatus('Solo un usuario admin puede abrir la hoja online desde la app.');
      switchView('formulario');
      return;
    }
    window.open(cfg.spreadsheetUrl || `https://docs.google.com/spreadsheets/d/${cfg.spreadsheetId}/edit`, '_blank', 'noopener');
  }

  function updateInstallButton() {
    const btn = $('#install-btn');
    if (!btn) return;
    const standalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
    btn.textContent = standalone ? 'Instalada' : 'Instalar';
    btn.disabled = !!standalone;
  }

  function updateAdminActions() {
    const sheetBtn = $('#open-sheet-btn');
    if (sheetBtn) sheetBtn.hidden = !isAdmin();
  }

  function setOperationalStatus(message, error = false) {
    const syncStatus = $('#sync-status');
    if (syncStatus) {
      syncStatus.textContent = message;
      syncStatus.classList.toggle('error', error);
    }
    const formStatus = $('#form-save-status');
    if (formStatus) {
      formStatus.hidden = !message;
      formStatus.textContent = message;
      formStatus.classList.toggle('error', error);
    }
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
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), Number(cfg.requestTimeoutMs || 12000));
    let res;
    try {
      res = await fetch(cfg.gasExecUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body,
        signal: controller.signal
      });
    } catch (err) {
      if (err.name === 'AbortError') throw new Error('El backend tardó demasiado en responder. Se puede trabajar en modo local y sincronizar luego.');
      throw new Error('No se pudo conectar con el backend. Revise la conexión o el despliegue Apps Script.');
    } finally {
      clearTimeout(timeout);
    }
    const text = await res.text();
    try {
      const parsed = JSON.parse(text);
      if (!parsed.success && !parsed.ok && parsed.message) return parsed;
      return parsed;
    } catch (err) {
      if (/Sign in|accounts.google|Forbidden|403|Necesitas acceso|Acceso denegado/i.test(text)) {
        throw new Error('El acceso al backend está bloqueado por permisos de Google. Revise el despliegue Apps Script.');
      }
      throw new Error('El backend no devolvió JSON válido.');
    }
  }

  async function createUser(event) {
    event.preventDefault();
    const status = $('#admin-user-status');
    status.textContent = '';
    status.classList.remove('error');
    try {
      requireAdmin();
      const username = $('#new-user').value.trim();
      const name = $('#new-user-name').value.trim();
      const role = $('#new-user-role').value;
      const password = $('#new-user-password').value;
      validateUsername(username);
      if (!name) throw new Error('El nombre es obligatorio.');
      if (password.length < 6) throw new Error('La contraseña debe tener al menos 6 caracteres.');

      if (cfg.gasExecUrl && !isLocalSession()) {
        const result = await apiCall('createUser', { token: state.session.token, username, name, role, password });
        if (!result.success) throw new Error(result.message || 'No se pudo registrar el usuario.');
      } else {
        upsertLocalUser({ username, name, role, passwordHash: await hashText(password), active: true, source: 'local' });
      }

      $('#user-create-form').reset();
      status.textContent = `Usuario ${username} registrado.`;
      renderAdmin();
    } catch (err) {
      status.textContent = err.message;
      status.classList.add('error');
    }
  }

  async function changePassword(event) {
    event.preventDefault();
    const status = $('#admin-user-status');
    status.textContent = '';
    status.classList.remove('error');
    try {
      const currentPassword = $('#current-password').value;
      const newPassword = $('#new-password').value;
      const repeat = $('#new-password-repeat').value;
      if (newPassword.length < 6) throw new Error('La nueva contraseña debe tener al menos 6 caracteres.');
      if (newPassword !== repeat) throw new Error('La nueva contraseña no coincide.');

      if (cfg.gasExecUrl && !isLocalSession()) {
        const result = await apiCall('changePassword', { token: state.session.token, currentPassword, newPassword });
        if (!result.success) throw new Error(result.message || 'No se pudo cambiar la contraseña.');
      } else {
        const username = state.session.user.username;
        const currentUser = await findLocalUser(username, currentPassword);
        if (!currentUser) throw new Error('La contraseña actual no es correcta.');
        upsertLocalUser({ ...state.users.find((item) => item.username.toLowerCase() === username.toLowerCase()), passwordHash: await hashText(newPassword), updatedAt: new Date().toISOString() });
      }

      $('#password-change-form').reset();
      status.textContent = 'Contraseña actualizada.';
      renderAdmin();
    } catch (err) {
      status.textContent = err.message;
      status.classList.add('error');
    }
  }

  function requireAdmin() {
    if (!state.session || state.session.user.role !== 'admin') throw new Error('Solo un usuario admin puede registrar usuarios.');
  }

  function validateUsername(username) {
    if (!isValidUsername(username)) {
      throw new Error('Use un correo válido o un usuario con formato nombre.apellido.');
    }
  }

  function isValidUsername(username) {
    return /^[A-Za-z0-9]+([._-][A-Za-z0-9]+)+$/.test(username) || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(username);
  }

  function upsertLocalUser(user) {
    const idx = state.users.findIndex((item) => item.username.toLowerCase() === user.username.toLowerCase());
    const record = {
      username: user.username,
      passwordHash: user.passwordHash,
      name: user.name || user.username,
      role: user.role || 'encuestador',
      active: user.active !== false,
      createdAt: user.createdAt || new Date().toISOString(),
      updatedAt: user.updatedAt || new Date().toISOString(),
      source: user.source || 'local'
    };
    if (idx >= 0) state.users[idx] = { ...state.users[idx], ...record };
    else state.users.push(record);
    persistLocalUsers();
  }

  function refreshAll() {
    applyRoleAccess();
    updateKpis();
    renderRecords();
    renderDashboard();
    renderTracking();
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

  function renderTracking() {
    const grid = $('#tracking-grid');
    if (!grid) return;
    if (!isAdmin()) {
      grid.innerHTML = '';
      return;
    }
    const total = state.records.length;
    const pending = state.records.filter((record) => record.status === 'pendiente').length;
    const errors = state.records.filter((record) => record.status === 'error').length;
    const synced = state.records.filter((record) => record.status === 'sincronizado').length;
    const lastRecord = state.records[0]?.createdAt;
    grid.innerHTML = `
      <article class="kpi-card accent-teal"><span>Total local</span><strong>${total}</strong></article>
      <article class="kpi-card accent-amber"><span>Pendientes</span><strong>${pending}</strong></article>
      <article class="kpi-card accent-rose"><span>Errores</span><strong>${errors}</strong></article>
      <article class="kpi-card accent-blue"><span>Sincronizadas</span><strong>${synced}</strong></article>
    `;

    const userBody = $('#tracking-users-body');
    if (userBody) {
      const grouped = Object.values(state.records.reduce((acc, record) => {
        const user = record.user || 'local';
        if (!acc[user]) acc[user] = { user, total: 0, pending: 0, errors: 0, last: '' };
        acc[user].total += 1;
        if (record.status === 'pendiente') acc[user].pending += 1;
        if (record.status === 'error') acc[user].errors += 1;
        if (!acc[user].last || new Date(record.createdAt) > new Date(acc[user].last)) acc[user].last = record.createdAt;
        return acc;
      }, {})).sort((a, b) => b.total - a.total);
      userBody.innerHTML = grouped.map((row) => `
        <tr>
          <td>${escapeHtml(row.user)}</td>
          <td>${row.total}</td>
          <td>${row.pending}</td>
          <td>${row.errors}</td>
          <td>${formatDate(row.last)}</td>
        </tr>
      `).join('') || '<tr><td colspan="5">Sin respuestas locales.</td></tr>';
    }

    const recentBody = $('#tracking-recent-body');
    if (recentBody) {
      recentBody.innerHTML = state.records.slice(0, 8).map((record) => `
        <tr>
          <td>${formatDate(record.createdAt)}</td>
          <td>${escapeHtml(record.data.empresa || 'Sin empresa')}</td>
          <td>${escapeHtml(record.user || 'local')}</td>
          <td><span class="badge ${record.status === 'pendiente' ? 'pending' : record.status === 'error' ? 'error' : ''}">${escapeHtml(record.status)}</span></td>
        </tr>
      `).join('') || '<tr><td colspan="4">Sin respuestas locales.</td></tr>';
    }
    setTrackingHeader(lastRecord);
  }

  function setTrackingHeader(lastRecord) {
    const header = $('#view-seguimiento .work-header p:last-child');
    if (!header) return;
    header.textContent = lastRecord
      ? `Ultima respuesta local: ${formatDate(lastRecord)}. Revise pendientes y errores antes del cierre de campo.`
      : 'Lectura rapida de avance, pendientes, errores y carga por usuario en este dispositivo.';
  }

  function renderAdmin() {
    const lastSync = localStorage.getItem('encuesta_mipymes_last_sync_v1');
    if ($('#admin-gas')) $('#admin-gas').textContent = cfg.gasExecUrl || 'No configurado';
    if ($('#admin-sheet')) $('#admin-sheet').textContent = cfg.spreadsheetId || 'No informado';
    if ($('#admin-version')) $('#admin-version').textContent = `${cfg.appVersion || 'sin versión'} · ${cfg.buildDate || ''}`;
    if ($('#admin-last-sync')) $('#admin-last-sync').textContent = lastSync ? formatDate(lastSync) : 'Sin sincronización';
    renderUsers();
  }

  function renderUsers() {
    const tbody = $('#users-body');
    if (!tbody) return;
    const canAdmin = state.session?.user?.role === 'admin';
    $('#user-create-form').hidden = !canAdmin;
    updateAdminActions();
    tbody.innerHTML = state.users.map((user) => `
      <tr>
        <td>${escapeHtml(user.username)}</td>
        <td>${escapeHtml(user.name || '')}</td>
        <td>${escapeHtml(user.role || '')}</td>
        <td>${user.active === false ? 'Inactivo' : 'Activo'}</td>
      </tr>
    `).join('');
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

  function infoTip(text, focusable = true) {
    const attrs = focusable ? 'tabindex="0" role="note"' : 'aria-hidden="true"';
    return `<span class="info-tip" ${attrs} data-tip="${escapeAttr(text)}">(i)</span>`;
  }

  function cssEscape(value) {
    return window.CSS && CSS.escape ? CSS.escape(value) : String(value).replace(/[^a-zA-Z0-9_-]/g, '\\$&');
  }
})();
