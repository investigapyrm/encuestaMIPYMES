function audit(action, user, entity, entityId, payload) {
  var sh = getSheet(SHEETS.AUDITORIA, AUDIT_HEADERS);
  sh.appendRow([nowIso(), action, user || '', entity || '', entityId || '', JSON.stringify(payload || {})]);
}

function logError(action, user, err, payload) {
  try {
    var sh = getSheet(SHEETS.ERRORES, ERROR_HEADERS);
    sh.appendRow([nowIso(), action || '', user || '', err.message || String(err), err.stack || '', String(payload || '')]);
  } catch (ignored) {}
}
