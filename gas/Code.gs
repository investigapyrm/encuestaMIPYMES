function doGet() {
  return jsonOutput({
    success: true,
    app: APP_CONFIG.APP_NAME,
    version: APP_CONFIG.APP_VERSION,
    timestamp: nowIso()
  });
}

function doPost(e) {
  try {
    var request = parseRequest(e);
    var action = request.action;
    var payload = request.payload || {};
    var handlers = {
      login: login,
      getBootstrap: getBootstrap,
      saveSurvey: saveSurvey,
      saveResponse: saveResponse,
      listRecent: listRecent,
      getDashboard: getDashboard,
      initWorkbook: initWorkbook
    };
    if (!handlers[action]) throw new Error('Acción no soportada: ' + action);
    return jsonOutput(handlers[action](payload));
  } catch (err) {
    logError('doPost', '', err, e && e.postData ? e.postData.contents : '');
    return jsonOutput({ success: false, message: err.message || String(err) });
  }
}
