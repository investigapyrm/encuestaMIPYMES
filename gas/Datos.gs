function getBootstrap(payload) {
  var session = APP_CONFIG.REQUIRE_LOGIN === false ? publicSession({}) : requireSession(payload.token);
  audit('get_bootstrap', session.username, 'app', APP_CONFIG.APP_NAME, {});
  return {
    success: true,
    app: APP_CONFIG.APP_NAME,
    version: APP_CONFIG.APP_VERSION,
    user: session,
    sheets: SHEETS,
    responseHeaders: RESPONSE_HEADERS
  };
}

function saveSurvey(payload) {
  var record = payload.record || {};
  var data = record.data || {};
  var session = APP_CONFIG.REQUIRE_LOGIN === false ? publicSession(data, payload.respondent) : requireSession(payload.token);
  validateSurvey(data);
  var sh = getSheet(SHEETS.RESPUESTAS, RESPONSE_HEADERS);
  var row = RESPONSE_HEADERS.map(function(header) {
    if (header === 'submissionId') return record.submissionId || ('SUB-' + Date.now());
    if (header === 'createdAt') return record.createdAt || nowIso();
    if (header === 'syncedAt') return nowIso();
    if (header === 'source') return 'github_pages';
    if (header === 'user') return session.username;
    if (header === 'status') return 'sincronizado';
    if (header === 'raw_json') return JSON.stringify(data);
    return data[header] !== undefined ? data[header] : '';
  });
  sh.appendRow(row);
  var remoteId = row[0];
  if (payload.legacy) {
    appendLegacyResponse(payload.legacy);
  }
  audit('save_survey', session.username, SHEETS.RESPUESTAS, remoteId, { empresa: data.empresa || '' });
  return { success: true, remoteId: remoteId };
}

function publicSession(data, respondent) {
  var username = String(respondent || data.correo_electronico || data.ruc || data.empresa || 'sin_login').trim();
  if (!username) username = 'sin_login';
  if (username.length > 120) username = username.slice(0, 120);
  return {
    username: username,
    name: 'Respondiente sin login',
    role: 'respondiente',
    publicAccess: true
  };
}

function saveResponse(payload) {
  var saved = appendLegacyResponse(payload || {});
  audit('save_response', 'legacy', SHEETS.RESPUESTAS_ANCHO, saved.submissionId, {});
  return { success: true, ok: true, remoteId: saved.submissionId, submissionId: saved.submissionId, savedAt: saved.savedAt };
}

function appendLegacyResponse(payload) {
  var lock = LockService.getDocumentLock();
  lock.waitLock(30000);
  try {
    var timestampISO = nowIso();
    var submissionId = payload.submissionId || ('SUB-' + Date.now());
    var header = payload.header || [];
    var wide = payload.wide || {};
    var longRows = payload.long || [];

    var shWide = getOrCreateSheet(SHEETS.RESPUESTAS_ANCHO);
    var headers = getHeaderRow(shWide);
    if (headers.length === 0) {
      headers = ['SubmissionID', 'Timestamp'].concat(header);
      shWide.getRange(1, 1, 1, headers.length).setValues([headers]);
      shWide.setFrozenRows(1);
    } else {
      var missing = [];
      var existing = {};
      headers.forEach(function(h) { existing[h] = true; });
      header.forEach(function(h) {
        if (!existing[h]) missing.push(h);
      });
      if (missing.length) {
        headers = headers.concat(missing);
        shWide.getRange(1, 1, 1, headers.length).setValues([headers]);
        shWide.setFrozenRows(1);
      }
    }

    var row = headers.map(function(key) {
      if (key === 'SubmissionID') return submissionId;
      if (key === 'Timestamp') return timestampISO;
      return Object.prototype.hasOwnProperty.call(wide, key) ? wide[key] : '';
    });
    shWide.appendRow(row);

    var shLong = getOrCreateSheet(SHEETS.RESPUESTAS_LARGO);
    ensureHeaders(shLong, LEGACY_LONG_HEADERS);
    var normalizedLong = longRows.map(function(r) {
      var out = r.slice(0, 6);
      while (out.length < 6) out.push('');
      if (!out[0]) out[0] = submissionId;
      if (!out[1]) out[1] = timestampISO;
      return out;
    });
    if (normalizedLong.length) {
      shLong.getRange(shLong.getLastRow() + 1, 1, normalizedLong.length, LEGACY_LONG_HEADERS.length).setValues(normalizedLong);
    }

    return { submissionId: submissionId, savedAt: timestampISO };
  } finally {
    lock.releaseLock();
  }
}

function getHeaderRow(sheet) {
  if (!sheet || sheet.getLastRow() < 1) return [];
  var vals = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  var headers = [];
  for (var i = 0; i < vals.length; i++) {
    var value = String(vals[i] || '').trim();
    if (!value) break;
    headers.push(value);
  }
  return headers;
}

function listRecent(payload) {
  var session = requireSession(payload.token);
  var limit = Math.min(Number(payload.limit || 50), 200);
  var rows = readRows(SHEETS.RESPUESTAS);
  audit('list_recent', session.username, SHEETS.RESPUESTAS, '', { limit: limit });
  return { success: true, rows: rows.slice(Math.max(rows.length - limit, 0)).reverse() };
}

function getDashboard(payload) {
  var session = requireSession(payload.token);
  var rows = readRows(SHEETS.RESPUESTAS);
  var bySector = {};
  rows.forEach(function(row) {
    var sector = row.q01_sector || 'sin_sector';
    bySector[sector] = (bySector[sector] || 0) + 1;
  });
  audit('get_dashboard', session.username, SHEETS.RESPUESTAS, '', {});
  return { success: true, total: rows.length, bySector: bySector };
}

function validateSurvey(data) {
  var required = ['empresa', 'q01_sector', 'q02_anio_fundacion', 'q03a_tamano_empresa', 'q03b_numero_medio_empleados'];
  required.forEach(function(key) {
    if (data[key] === undefined || data[key] === '') throw new Error('Campo obligatorio faltante: ' + key);
  });
  var pct = Number(data.q10_exportaciones_pct || 0);
  if (pct < 0 || pct > 100) throw new Error('El porcentaje de exportaciones debe estar entre 0 y 100.');
  if (pct > 0 && (data.q10_paises_exportacion === undefined || data.q10_paises_exportacion === '')) {
    throw new Error('Debe informar cantidad de países cuando exportaciones es mayor que 0.');
  }
  if (String(data.q18_experiencia_cierre || '') === '1' && !data.q18_causa_principal) {
    throw new Error('Debe informar la causa principal cuando existió experiencia previa de cierre.');
  }
  if (String(data.q18_causa_principal || '') === 'otra' && !data.q18_causa_otra) {
    throw new Error('Debe especificar la causa cuando selecciona Otra.');
  }
}
