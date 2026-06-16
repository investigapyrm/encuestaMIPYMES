function initWorkbook() {
  getSheet(SHEETS.RESPUESTAS, RESPONSE_HEADERS);
  getOrCreateSheet(SHEETS.RESPUESTAS_ANCHO);
  ensureHeaders(getOrCreateSheet(SHEETS.RESPUESTAS_LARGO), LEGACY_LONG_HEADERS);
  getSheet(SHEETS.USUARIOS, USER_HEADERS);
  getSheet(SHEETS.AUDITORIA, AUDIT_HEADERS);
  getSheet(SHEETS.ERRORES, ERROR_HEADERS);
  var versions = getSheet(SHEETS.VERSIONES, VERSION_HEADERS);
  if (versions.getLastRow() < 2) {
    versions.appendRow([nowIso(), APP_CONFIG.APP_VERSION, '2026-06-16.2', 'Inicialización de estructura operativa']);
  }
  ensureDefaultUsers();
  return { success: true };
}

function ensureDefaultUsers() {
  var sh = getSheet(SHEETS.USUARIOS, USER_HEADERS);
  upsertDefaultUser(sh, 'admin', 'Administrador');
  upsertDefaultUser(sh, 'diego.meza', 'Diego Meza');
}

function upsertDefaultUser(sh, username, name) {
  var passwordHash = hashPassword('123456');
  var values = sh.getDataRange().getValues();
  var headers = values[0];
  var userCol = headers.indexOf('usuario');
  var now = nowIso();
  var row = [
    username,
    passwordHash,
    name,
    '',
    'admin',
    'SI',
    now,
    '',
    'Usuario administrador inicial por defecto.'
  ];
  for (var i = 1; i < values.length; i++) {
    if (String(values[i][userCol] || '').toLowerCase() === username.toLowerCase()) {
      sh.getRange(i + 1, 1, 1, row.length).setValues([row]);
      return;
    }
  }
  sh.appendRow(row);
}

function getSpreadsheet() {
  return SpreadsheetApp.openById(APP_CONFIG.SPREADSHEET_ID);
}

function getOrCreateSheet(name) {
  var ss = getSpreadsheet();
  var sh = ss.getSheetByName(name);
  if (!sh) sh = ss.insertSheet(name);
  return sh;
}

function getSheet(name, headers) {
  var ss = getSpreadsheet();
  var sh = ss.getSheetByName(name);
  if (!sh) sh = ss.insertSheet(name);
  ensureHeaders(sh, headers);
  return sh;
}

function ensureHeaders(sh, headers) {
  if (sh.getLastRow() === 0) {
    sh.appendRow(headers);
    sh.setFrozenRows(1);
    return;
  }
  var current = sh.getRange(1, 1, 1, Math.max(headers.length, sh.getLastColumn())).getValues()[0];
  var changed = false;
  headers.forEach(function(header, i) {
    if (current[i] !== header) {
      sh.getRange(1, i + 1).setValue(header);
      changed = true;
    }
  });
  if (changed) sh.setFrozenRows(1);
}

function readRows(sheetName) {
  var sh = getSheet(sheetName, headersFor(sheetName));
  var values = sh.getDataRange().getValues();
  if (values.length < 2) return [];
  var headers = values[0];
  return values.slice(1).filter(function(row) {
    return row.some(function(value) { return value !== ''; });
  }).map(function(row) {
    var obj = {};
    headers.forEach(function(header, i) { obj[header] = row[i]; });
    return obj;
  });
}

function headersFor(sheetName) {
  if (sheetName === SHEETS.RESPUESTAS) return RESPONSE_HEADERS;
  if (sheetName === SHEETS.USUARIOS) return USER_HEADERS;
  if (sheetName === SHEETS.AUDITORIA) return AUDIT_HEADERS;
  if (sheetName === SHEETS.ERRORES) return ERROR_HEADERS;
  if (sheetName === SHEETS.VERSIONES) return VERSION_HEADERS;
  return [];
}

function parseRequest(e) {
  if (!e || !e.postData || !e.postData.contents) return { action: 'health', payload: {} };
  return JSON.parse(e.postData.contents);
}

function jsonOutput(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

function nowIso() {
  return Utilities.formatDate(new Date(), APP_CONFIG.TIMEZONE, "yyyy-MM-dd'T'HH:mm:ssXXX");
}
