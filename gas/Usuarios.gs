function login(payload) {
  initWorkbook();
  var user = String(payload.user || '').trim();
  var password = String(payload.password || '');
  if (!user || !password) return { success: false, message: 'Usuario y contraseña son obligatorios.' };

  var rows = readRows(SHEETS.USUARIOS);
  var found = rows.find(function(row) {
    return String(row.usuario || '').toLowerCase() === user.toLowerCase() && String(row.activo || '').toUpperCase() !== 'NO';
  });
  if (!found) {
    audit('login_failed', user, 'usuario', user, { reason: 'not_found' });
    return { success: false, message: 'Usuario o contraseña incorrectos.' };
  }
  if (found.password_hash !== hashPassword(password)) {
    audit('login_failed', user, 'usuario', user, { reason: 'invalid_password' });
    return { success: false, message: 'Usuario o contraseña incorrectos.' };
  }

  var token = Utilities.getUuid();
  var session = {
    username: found.usuario,
    name: found.nombre || found.usuario,
    role: found.rol || 'cargador',
    createdAt: nowIso(),
    expiresAt: new Date(Date.now() + APP_CONFIG.SESSION_TTL_SECONDS * 1000).toISOString()
  };
  PropertiesService.getScriptProperties().setProperty(APP_CONFIG.SESSION_PREFIX + token, JSON.stringify(session));
  updateUserAccess(found.usuario);
  audit('login_success', found.usuario, 'usuario', found.usuario, {});
  return { success: true, token: token, user: session };
}

function requireSession(token) {
  var raw = PropertiesService.getScriptProperties().getProperty(APP_CONFIG.SESSION_PREFIX + token);
  if (!raw) throw new Error('Sesión inválida o vencida.');
  var session = JSON.parse(raw);
  if (new Date(session.expiresAt).getTime() < Date.now()) {
    PropertiesService.getScriptProperties().deleteProperty(APP_CONFIG.SESSION_PREFIX + token);
    throw new Error('Sesión vencida.');
  }
  return session;
}

function updateUserAccess(username) {
  var sh = getSheet(SHEETS.USUARIOS, USER_HEADERS);
  var data = sh.getDataRange().getValues();
  var header = data[0];
  var userCol = header.indexOf('usuario');
  var lastCol = header.indexOf('ultimo_acceso');
  for (var i = 1; i < data.length; i++) {
    if (String(data[i][userCol]).toLowerCase() === String(username).toLowerCase()) {
      sh.getRange(i + 1, lastCol + 1).setValue(nowIso());
      return;
    }
  }
}

function hashPassword(password) {
  var salt = PropertiesService.getScriptProperties().getProperty(APP_CONFIG.PASSWORD_SALT_KEY) || 'CAMBIAR_SALT_EN_SCRIPT_PROPERTIES';
  var bytes = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, salt + ':' + password);
  return bytes.map(function(b) {
    var v = (b < 0 ? b + 256 : b).toString(16);
    return v.length === 1 ? '0' + v : v;
  }).join('');
}
