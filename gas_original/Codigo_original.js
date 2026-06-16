/***** Instrumento PYMES CONACYT — Backend (Google Apps Script)
 * Requisitos:
 * - Publicar como aplicación web (cualquiera con el enlace / o tu dominio).
 * - Autorización para escribir en la hoja de cálculo destino.
 *****/

const SPREADSHEET_ID = '14yHdE3nZUBTXgY2I6UKFMmJ4KIj9gDinGVmt6e764ew';
const SHEET_WIDE = 'Respuestas_Ancho';
const SHEET_LONG = 'Respuestas_Largo';

function doGet() {
  return HtmlService
    .createHtmlOutputFromFile('Index')
    .setTitle('Instrumento PYMES CONACYT');
}

/**
 * Guarda un envío en dos hojas:
 *  - Respuestas_Ancho: 1 fila con todas las columnas (wide).
 *  - Respuestas_Largo: 1 fila por ítem (long).
 * payload = {
 *   submissionId: string,
 *   header: string[],             // orden de columnas (códigos)
 *   wide: Object<string, any>,    // code -> value
 *   long: Array<[submissionId, timestampISO, bloque, code, qtext, value]>
 * }
 */
function saveResponse(payload) {
  const lock = LockService.getDocumentLock();
  lock.waitLock(30000); // 30s

  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    _ensureSheets(ss);

    const ts = new Date();
    const timestampISO = Utilities.formatDate(ts, Session.getScriptTimeZone(), "yyyy-MM-dd'T'HH:mm:ssXXX");

    // -------- WIDE ----------
    const shWide = ss.getSheetByName(SHEET_WIDE);
    const existingHeaders = _getHeaderRow(shWide);
    let headers = existingHeaders;

    // Crear cabecera si está vacía
    if (headers.length === 0) {
      headers = ['SubmissionID', 'Timestamp'].concat(payload.header);
      shWide.getRange(1, 1, 1, headers.length).setValues([headers]);
    } else {
      // Si aparecen nuevas variables (por cambios futuros) agrégalas al final
      const need = [];
      const incoming = payload.header || [];
      const setExisting = new Set(headers);
      for (const h of incoming) if (!setExisting.has(h)) need.push(h);
      if (need.length > 0) {
        shWide.insertColumnsAfter(headers.length, need.length);
        const newHeaders = headers.concat(need);
        shWide.getRange(1, 1, 1, newHeaders.length).setValues([newHeaders]);
        headers = newHeaders;
      }
    }

    // Construir fila en el orden de headers
    const row = new Array(headers.length).fill('');
    const idxSub = headers.indexOf('SubmissionID');
    const idxTs  = headers.indexOf('Timestamp');
    if (idxSub >= 0) row[idxSub] = payload.submissionId || ('SUB-' + Date.now());
    if (idxTs  >= 0) row[idxTs]  = timestampISO;

    // Cargar valores
    const dataWide = payload.wide || {};
    for (let c = 0; c < headers.length; c++) {
      const key = headers[c];
      if (key === 'SubmissionID' || key === 'Timestamp') continue;
      if (Object.prototype.hasOwnProperty.call(dataWide, key)) {
        row[c] = dataWide[key];
      }
    }

    // Append
    shWide.appendRow(row);

    // -------- LONG ----------
    const shLong = ss.getSheetByName(SHEET_LONG);
    const hasLongHeader = shLong.getLastRow() >= 1;
    if (!hasLongHeader || shLong.getLastRow() === 0) {
      shLong.getRange(1, 1, 1, 6)
        .setValues([['SubmissionID', 'Timestamp', 'Bloque', 'Codigo', 'Pregunta', 'Valor']]);
    }
    const submissionId = payload.submissionId || row[idxSub] || ('SUB-' + Date.now());
    const longRows = (payload.long || []).map(r => {
      // r: [submissionId, timestampISO, bloque, code, qtext, value]
      const out = r.slice();
      if (!out[0]) out[0] = submissionId;
      if (!out[1]) out[1] = timestampISO;
      return out;
    });
    if (longRows.length > 0) {
      shLong.getRange(shLong.getLastRow() + 1, 1, longRows.length, 6).setValues(longRows);
    }

    return { ok: true, submissionId: submissionId, savedAt: timestampISO };
  } catch (err) {
    return { ok: false, error: String(err && err.message ? err.message : err) };
  } finally {
    lock.releaseLock();
  }
}

function _ensureSheets(ss) {
  if (!ss.getSheetByName(SHEET_WIDE)) ss.insertSheet(SHEET_WIDE);
  if (!ss.getSheetByName(SHEET_LONG)) ss.insertSheet(SHEET_LONG);
}

function _getHeaderRow(sheet) {
  if (!sheet) return [];
  if (sheet.getLastRow() < 1) return [];
  const rng = sheet.getRange(1, 1, 1, sheet.getMaxColumns());
  const vals = rng.getValues()[0];
  const header = [];
  for (let i = 0; i < vals.length; i++) {
    const v = (vals[i] || '').toString().trim();
    if (v === '') break;
    header.push(v);
  }
  return header;
}
