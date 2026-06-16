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
    role: found.rol || 'encuestador',
    createdAt: nowIso(),
    expiresAt: new Date(Date.now() + APP_CONFIG.SESSION_TTL_SECONDS * 1000).toISOString()
  };
  PropertiesService.getScriptProperties().setProperty(APP_CONFIG.SESSION_PREFIX + token, JSON.stringify(session));
  updateUserAccess(found.usuario);
  audit('login_success', found.usuario, 'usuario', found.usuario, {});
  return { success: true, token: token, user: session };
}

function createUser(payload) {
  var session = requireSession(payload.token);
  requireAdminRole(session);
  var username = String(payload.username || '').trim();
  var name = String(payload.name || '').trim();
  var role = String(payload.role || 'encuestador').trim();
  var password = String(payload.password || '');
  validateUsername(username);
  if (!name) throw new Error('El nombre es obligatorio.');
  if (['admin', 'supervisor', 'encuestador', 'censista'].indexOf(role) < 0) throw new Error('Rol no soportado.');
  if (password.length < 6) throw new Error('La contraseña debe tener al menos 6 caracteres.');

  var sh = getSheet(SHEETS.USUARIOS, USER_HEADERS);
  upsertUserRow(sh, {
    username: username,
    passwordHash: hashPassword(password),
    name: name,
    correo: '',
    role: role,
    active: 'SI',
    observacion: 'Usuario creado desde panel de administración.'
  }, false);
  audit('create_user', session.username, 'usuario', username, { role: role });
  return { success: true, username: username };
}

function changePassword(payload) {
  var session = requireSession(payload.token);
  var currentPassword = String(payload.currentPassword || '');
  var newPassword = String(payload.newPassword || '');
  if (newPassword.length < 6) throw new Error('La nueva contraseña debe tener al menos 6 caracteres.');

  var sh = getSheet(SHEETS.USUARIOS, USER_HEADERS);
  var data = sh.getDataRange().getValues();
  var header = data[0];
  var userCol = header.indexOf('usuario');
  var passCol = header.indexOf('password_hash');
  var obsCol = header.indexOf('observacion');
  for (var i = 1; i < data.length; i++) {
    if (String(data[i][userCol]).toLowerCase() === String(session.username).toLowerCase()) {
      if (String(data[i][passCol]) !== hashPassword(currentPassword)) throw new Error('La contraseña actual no es correcta.');
      sh.getRange(i + 1, passCol + 1).setValue(hashPassword(newPassword));
      if (obsCol >= 0) sh.getRange(i + 1, obsCol + 1).setValue('Contraseña modificada por usuario.');
      audit('change_password', session.username, 'usuario', session.username, {});
      return { success: true };
    }
  }
  throw new Error('Usuario no encontrado.');
}

function requireAdminRole(session) {
  if (!session || session.role !== 'admin') throw new Error('Solo un usuario admin puede realizar esta acción.');
}

function validateUsername(username) {
  if (!/^[A-Za-z0-9]+([._-][A-Za-z0-9]+)+$/.test(username)) {
    throw new Error('El usuario debe tener formato nombre.apellido.');
  }
}

function upsertUserRow(sh, user, allowDefaultMigration) {
  var data = sh.getDataRange().getValues();
  var header = data[0];
  var userCol = header.indexOf('usuario');
  var obsCol = header.indexOf('observacion');
  var now = nowIso();
  var row = [
    user.username,
    user.passwordHash,
    user.name,
    user.correo || '',
    user.role || 'encuestador',
    user.active || 'SI',
    now,
    '',
    user.observacion || ''
  ];
  for (var i = 1; i < data.length; i++) {
    if (String(data[i][userCol] || '').toLowerCase() === user.username.toLowerCase()) {
      var obs = obsCol >= 0 ? String(data[i][obsCol] || '') : '';
      if (allowDefaultMigration && /Cambiar contraseña|Usuario inicial|administrador inicial/i.test(obs)) {
        sh.getRange(i + 1, 1, 1, row.length).setValues([row]);
      }
      return;
    }
  }
  sh.appendRow(row);
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
