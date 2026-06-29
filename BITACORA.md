# BITACORA_ENCUESTA_MIPYMES_FAEDPYME_2026

## 2026-06-16 08:20

### Proyecto

* Nombre: Encuesta MIPYMES - FAEDPYME 2026
* Cliente o institución: investigapyrm / MID
* Ruta local: `/Users/diegobernardomezabogado/Library/CloudStorage/GoogleDrive-investigapyrm@gmail.com/Mi unidad/encuestaMIPYMES_repo`
* Repositorio: `https://github.com/investigapyrm/encuestaMIPYMES.git`
* URL pública: pendiente de GitHub Pages
* Responsable: Codex
* Versión: 0.1.0

### Objetivo de la intervención

* Preparar app web publicable para reproducir fielmente la encuesta del PDF `encuestaMIPYMES.pdf`.
* Mantener formato institucional y estructura compatible con Google Apps Script + Google Sheets + GitHub Pages.

### Diagnóstico inicial

* El repositorio GitHub estaba vacío.
* El primer intento tomó una hoja alternativa `encuestadigitalizacionMIPYMES` como referencia, pero el usuario corrigió que la fuente maestra es el PDF local.
* `encuestaMIPYMES.gsheet` apunta al spreadsheet `1lfasg9YkGM_4jAuP6LDoZd-0aFxePBUksZB_1lJDKtQ`.
* El PDF local tiene 2 páginas y 19 preguntas.
* `clasp` está autenticado como `monitorimpactosocial@gmail.com`; no hay credenciales guardadas para `investigapyrm`.
* El usuario informó posible `scriptId` asociado: `1LlCl53ftjUPkWHV13GBInR9S-WTSFu83qf8ukXFihzlGIwMgqSrqwCBW`.

### Acciones realizadas

* Se extrajo texto y vista visual del PDF con Python (`pypdf`, `pdfplumber`, `fitz`).
* Se creó esquema `data/survey-schema.json` desde el PDF maestro.
* Se creó frontend estático con login, formulario, registros, indicadores, administración y sincronización offline.
* Se creó backend Apps Script modular en `gas/`.
* Se agregó documentación técnica, manual de usuario y diccionario de datos.
* Se configuró PWA con `manifest.json` y `service-worker.js`.

### Archivos modificados

* `index.html`
* `styles.css`
* `app.js`
* `config.js`
* `manifest.json`
* `service-worker.js`
* `data/survey-schema.json`
* `gas/*.gs`
* `gas/appsscript.json`
* `docs/*.md`
* `README.md`
* `BITACORA.md`

### Comandos o scripts ejecutados

* `file encuestaMIPYMES.pdf encuestaMIPYMES.gsheet`
* `python3` para extracción PDF con `pypdf`, `pdfplumber` y `fitz`
* `clasp show-authorized-user`
* `clasp --user investigapyrm show-authorized-user`

### Resultados verificados

* PDF maestro leído correctamente.
* Se confirmó que el instrumento fuente contiene 19 preguntas.
* Se confirmó bloqueo de extracción GAS por autenticación de `clasp`.
* Se creó commit local `e8cb486` con la app inicial.
* Push a GitHub falló por permisos: GitHub respondió `Permission to investigapyrm/encuestaMIPYMES.git denied to diegomezapy`.
* Reintento con `scriptId` `1LlCl53ftjUPkWHV13GBInR9S-WTSFu83qf8ukXFihzlGIwMgqSrqwCBW`: `clasp clone`, `clasp deployments` y `clasp versions` devolvieron `The caller does not have permission`.

### Pruebas realizadas

* Servidor local HTTP en puerto 4173 respondió `index.html`, `manifest.json`, `service-worker.js` y `data/survey-schema.json`.
* Validación JSON correcta de `data/survey-schema.json`.
* Validación de sintaxis con `node --check` para `app.js`, `config.js` y `service-worker.js`.
* `clasp show-authorized-user` confirmó sesión activa como `monitorimpactosocial@gmail.com`.
* Pendiente de prueba con Apps Script real.
* Pendiente de verificación pública GitHub Pages.

### Errores o incidentes

* Se generó inicialmente un esquema desde una fuente no final; fue reemplazado por esquema derivado del PDF maestro.
* Se detectó un `.clasp.json` accidental en la carpeta raíz apuntando a un proyecto temporal PARACEL, no al proyecto MIPYMES.

### Soluciones aplicadas

* Se corrigió la fuente de verdad al PDF local.
* Se documentó el bloqueo de acceso a GAS.
* Se dejó backend equivalente listo para vincular con `investigapyrm`.

### Pendientes

* Autenticar `clasp` como `investigapyrm@gmail.com`.
* Compartir explícitamente el proyecto Apps Script `1LlCl53ftjUPkWHV13GBInR9S-WTSFu83qf8ukXFihzlGIwMgqSrqwCBW` con `monitorimpactosocial@gmail.com`, o extraerlo desde la cuenta propietaria.
* Extraer o comparar el GAS asociado real al libro cuando el permiso de Apps Script API esté disponible.
* Configurar `gasExecUrl` en `config.js`.
* Subir commit local `e8cb486` a GitHub usando una cuenta o token con permiso sobre `investigapyrm/encuestaMIPYMES.git`.
* Publicar GitHub Pages.
* Probar login real y guardado en Google Sheets.

### Riesgos

* No se debe considerar operativo hasta validar la URL pública, el endpoint GAS y guardado real.
* El modo demo local no es autenticación productiva.
* La contraseña inicial del backend debe cambiarse antes de producción.

### Recomendaciones

* Usar deployment Apps Script `@HEAD` con acceso "Cualquier persona" para evitar 403 recurrentes.
* No versionar `_fuentes/` porque puede contener datos de trabajo o respuestas.
* Mantener `survey-schema.json` como diccionario técnico del instrumento.

## 2026-06-16 10:29

### Proyecto

* Nombre: Encuesta MIPYMES - FAEDPYME 2026
* Cliente o institución: investigapyrm / MID
* Ruta local: `/Users/diegobernardomezabogado/Library/CloudStorage/GoogleDrive-investigapyrm@gmail.com/Mi unidad/encuestaMIPYMES_repo`
* Repositorio: `https://github.com/investigapyrm/encuestaMIPYMES.git`
* URL pública: pendiente de GitHub Pages
* Responsable: Codex
* Versión: 0.1.0

### Objetivo de la intervención

* Reintentar acceso al Apps Script real después de que `monitorimpactosocial@gmail.com` fue agregado como editor.
* Ajustar el backend para apuntar a la hoja correcta y conservar compatibilidad con el formato del proyecto base.

### Diagnóstico inicial

* `clasp clone` ya permite acceder al `scriptId` `1LlCl53ftjUPkWHV13GBInR9S-WTSFu83qf8ukXFihzlGIwMgqSrqwCBW`.
* El GAS original clonado contenía `Código.js`, `Index.html`, `Index_v6sep2025.html` y `appsscript.json`.
* El GAS original apuntaba a `SPREADSHEET_ID = 14yHdE3nZUBTXgY2I6UKFMmJ4KIj9gDinGVmt6e764ew`, distinto de la hoja indicada por el usuario: `1lfasg9YkGM_4jAuP6LDoZd-0aFxePBUksZB_1lJDKtQ`.
* El formulario original tenía otra encuesta de 9 bloques; no reproducía fielmente el PDF `encuestaMIPYMES.pdf`.

### Acciones realizadas

* Se preservó copia del GAS original en `gas_original/`.
* Se agregó `.clasp.json` con el `scriptId` real y `rootDir: gas`.
* Se añadió compatibilidad de guardado en `Respuestas_Ancho` y `Respuestas_Largo`.
* Se mantuvo la hoja operativa `RESPUESTAS` para auditoría y lectura normalizada.
* Se agregó acción `saveResponse` para compatibilidad con el contrato histórico `header`/`wide`/`long`.
* Se subió el backend adaptado con `clasp push -f`.
* Se crearon versiones y deployments GAS.

### Archivos modificados

* `.clasp.json`
* `app.js`
* `gas/Code.gs`
* `gas/Config.gs`
* `gas/Datos.gs`
* `gas/Utils.gs`
* `gas/appsscript.json`
* `gas_original/*`
* `README.md`
* `docs/manual_tecnico.md`
* `docs/diccionario_datos.md`
* `BITACORA.md`

### Comandos o scripts ejecutados

* `clasp deployments 1LlCl53ftjUPkWHV13GBInR9S-WTSFu83qf8ukXFihzlGIwMgqSrqwCBW`
* `clasp push -f`
* `clasp version "Encuesta MIPYMES FAEDPYME 2026 backend"`
* `clasp deploy -V 2 -d "Encuesta MIPYMES FAEDPYME 2026 - web app publico"`
* `curl -L -X POST ... /exec` para probar `initWorkbook`
* `node --check app.js config.js service-worker.js`
* `python3 -m json.tool data/survey-schema.json`
* `python3 -m json.tool gas/appsscript.json`
* `python3 -m json.tool .clasp.json`

### Resultados verificados

* `clasp push -f` subió 7 archivos al Apps Script real.
* Se creó deployment `AKfycbzR2BL7Z0JfqAxbkLCO-AK9FucNl7ab-dLtoZgie2qk8VhsqBlFVvQc6_KHtJ0xiLKxFA @1`.
* Se creó deployment `AKfycbxYh3Z-6FI0xl1eaOxluFUXqyPPkBtAxqDHTFkf6yANKch26DwQIGrbckZXuJ8qan_nzg @2`.
* La prueba anónima contra `/exec` devolvió página de acceso denegado de Google.
* `clasp run initWorkbook` no pudo ejecutarse porque el proyecto no está habilitado como API executable.
* Commit local consolidado en `HEAD` de la rama `main`.
* Reintento de `git push -u origin main` falló con 403: la cuenta local `diegomezapy` no tiene permiso sobre `investigapyrm/encuestaMIPYMES.git`.
* Conector GitHub consultado para `investigapyrm/encuestaMIPYMES`: repositorio público, rama default `main`, permisos `pull: true`, `push: false`.

### Pruebas realizadas

* Validación de sintaxis JavaScript correcta.
* Validación JSON correcta para esquema, manifest y `.clasp.json`.
* Verificación de deployments mediante `clasp deployments`.
* Prueba HTTP real al endpoint Apps Script, con resultado no operativo por acceso denegado.

### Errores o incidentes

* El deployment GAS creado por `clasp` no quedó accesible anónimamente, aunque el manifest declara `webapp.access = ANYONE_ANONYMOUS`.
* El push a GitHub sigue bloqueado tanto por credenciales locales como por el conector GitHub disponible, que no tiene permiso de escritura.

### Soluciones aplicadas

* Se dejó `config.js` con `gasExecUrl` vacío para evitar que la app publicada intente usar un endpoint que todavía responde acceso denegado.
* Se documentó el deployment creado y el ajuste pendiente de publicación web app.
* Se conservó respaldo del GAS original antes de reemplazar el backend.

### Pendientes

* En Apps Script, revisar deployment y configurar acceso del web app como público o "cualquier persona".
* Ejecutar `initWorkbook` una vez cuando el endpoint esté accesible o desde el editor Apps Script.
* Verificar usuarios iniciales `admin / 123456` y `diego.meza / 123456` antes de producción.
* Configurar `MIPYMES_PASSWORD_SALT` en Script Properties.
* Activar `gasExecUrl` en `config.js` cuando `/exec` responda JSON.
* Publicar el repo en GitHub con una credencial o GitHub App que tenga permiso `push` sobre `investigapyrm/encuestaMIPYMES`.
* Activar y verificar GitHub Pages.

### Riesgos

* Código GAS subido no equivale a endpoint operativo hasta resolver acceso del deployment.
* Si se configura `gasExecUrl` antes de resolver el acceso, el login real fallará.
* No registrar datos reales hasta validar escritura en `RESPUESTAS`, `Respuestas_Ancho` y `Respuestas_Largo`.

### Recomendaciones

* Ajustar el deployment desde la interfaz de Apps Script si `clasp` no logra aplicar acceso público.
* Confirmar con una prueba de escritura controlada antes de iniciar trabajo de campo.
* Mantener `gas_original/` como evidencia de migración y no modificarlo.

## 2026-06-16 13:45

### Proyecto

* Nombre: Encuesta MIPYMES - FAEDPYME 2026
* Cliente o institución: investigapyrm / MID
* Ruta local: `/Users/diegobernardomezabogado/Library/CloudStorage/GoogleDrive-investigapyrm@gmail.com/Mi unidad/encuestaMIPYMES_repo`
* Repositorio: `https://github.com/investigapyrm/encuestaMIPYMES.git`
* URL pública: pendiente de GitHub Pages
* Responsable: Codex
* Versión: 0.1.0

### Objetivo de la intervención

* Reintentar publicación en GitHub después de aviso del usuario indicando que el permiso ya estaba listo.

### Diagnóstico inicial

* El repositorio remoto seguía sin ramas (`origin/main [gone]`).
* El commit local listo seguía en `main`: `53ec9e0 Initial FAEDPYME MIPYMES web app`.
* Git local usa `credential.helper = osxkeychain`.
* La identidad de autor Git es `monitorimpactosocial@gmail.com`, pero la credencial HTTPS efectiva ante GitHub sigue resolviendo como `diegomezapy`.

### Acciones realizadas

* Se reintentó `git push -u origin main`.
* Se consultaron permisos del conector GitHub para `investigapyrm/encuestaMIPYMES`.

### Archivos modificados

* `BITACORA.md`

### Comandos o scripts ejecutados

* `git status --short --branch`
* `git log --oneline --decorate --max-count=3`
* `git push -u origin main`
* Consulta del repositorio mediante conector GitHub.
* `git config --get credential.helper`
* `git config --get user.name`
* `git config --get user.email`

### Resultados verificados

* `git push` volvió a fallar con 403: `Permission to investigapyrm/encuestaMIPYMES.git denied to diegomezapy`.
* El conector GitHub sigue con permisos `pull: true`, `push: false`.

### Pruebas realizadas

* Prueba de publicación directa al remoto GitHub.
* Verificación de permisos por conector GitHub.

### Errores o incidentes

* La autorización de escritura aún no está disponible para la credencial GitHub local ni para el conector.

### Soluciones aplicadas

* Se documentó el bloqueo exacto y la credencial efectiva que GitHub está rechazando.

### Pendientes

* Agregar permiso `Write` en GitHub al usuario `diegomezapy`, o reemplazar la credencial guardada en `osxkeychain` por una cuenta/token con permiso sobre `investigapyrm/encuestaMIPYMES`.
* Alternativamente, autorizar el GitHub App/conector con permiso de escritura sobre el repositorio.
* Reintentar `git push -u origin main`.

### Riesgos

* Mientras no exista permiso `push`, el repo público seguirá vacío aunque el código local esté listo.

### Recomendaciones

* Verificar en GitHub: Settings > Collaborators and teams, o en la organización/cuenta `investigapyrm`, que el usuario autenticado tenga rol `Write`.

## 2026-06-16 15:30

### Proyecto

* Nombre: Encuesta MIPYMES - FAEDPYME 2026
* Cliente o institución: investigapyrm / MID
* Ruta local: `/Users/diegobernardomezabogado/Library/CloudStorage/GoogleDrive-investigapyrm@gmail.com/Mi unidad/encuestaMIPYMES_repo`
* Repositorio: `https://github.com/investigapyrm/encuestaMIPYMES.git`
* URL pública: pendiente de GitHub Pages
* Responsable: Codex
* Versión: 0.1.0

### Objetivo de la intervención

* Reintentar publicación luego de que el usuario informó que `diegomezapy` aceptó la invitación.

### Diagnóstico inicial

* Rama local `main` con commit listo.
* Repositorio remoto aún sin rama publicada.
* Credencial HTTPS local no disponible después de limpiar o cambiar credenciales en Keychain.

### Acciones realizadas

* Se reintentó `git push -u origin main`.
* Se verificó permiso del conector GitHub.
* Se intentó crear archivo por GitHub Contents API.
* Se intentó crear blob por GitHub Git Database API.
* Se revisó disponibilidad de SSH hacia GitHub.

### Archivos modificados

* `BITACORA.md`

### Comandos o scripts ejecutados

* `git push -u origin main`
* `ssh -T -o BatchMode=yes -o StrictHostKeyChecking=accept-new git@github.com`
* Consulta de permisos del repo por conector GitHub.
* Intento de escritura por GitHub Contents API.
* Intento de escritura por GitHub Git Database API.

### Resultados verificados

* `git push` ya no devuelve denegación explícita a `diegomezapy`; ahora falla por falta de credencial interactiva: `could not read Username for 'https://github.com': Device not configured`.
* El conector GitHub muestra `push: true`, pero la escritura por API devuelve `Resource not accessible by integration`.
* No hay llave SSH configurada para GitHub; `ssh -T git@github.com` devuelve `Permission denied (publickey)`.

### Pruebas realizadas

* Prueba de push HTTPS.
* Prueba de escritura GitHub API por contents y blobs.
* Prueba de autenticación SSH.

### Errores o incidentes

* La invitación aceptada no basta mientras esta máquina no tenga credencial HTTPS válida cargada para GitHub.
* El conector tiene permiso visible de push, pero no scope efectivo para escribir contenidos.

### Soluciones aplicadas

* Se determinó que el bloqueo actual es autenticación local, no estado del código.

### Pendientes

* Reautenticar GitHub localmente con una cuenta/token que tenga permiso sobre `investigapyrm/encuestaMIPYMES`.
* Reintentar `git push -u origin main`.

### Riesgos

* El repositorio remoto seguirá vacío hasta que se complete la autenticación local o se habilite una vía de API con scope real de contents write.

### Recomendaciones

* Usar `gh auth login` con una cuenta autorizada, o configurar un PAT con scope `repo`/contents write para HTTPS.

## 2026-06-16 15:32

### Proyecto

* Nombre: Encuesta MIPYMES - FAEDPYME 2026
* Cliente o institución: investigapyrm / MID
* Ruta local: `/Users/diegobernardomezabogado/Library/CloudStorage/GoogleDrive-investigapyrm@gmail.com/Mi unidad/encuestaMIPYMES_repo`
* Repositorio: `https://github.com/investigapyrm/encuestaMIPYMES.git`
* URL pública: pendiente de GitHub Pages
* Responsable: Codex
* Versión: 0.1.0

### Objetivo de la intervención

* Publicar el commit local en GitHub usando token autorizado disponible en el portapapeles del usuario.

### Diagnóstico inicial

* La rama `main` local estaba lista y sin publicar.
* La autenticación HTTPS previa no tenía credencial usable.
* El usuario indicó que el token estaba generado y disponible en el portapapeles.

### Acciones realizadas

* Se tomó el token desde el portapapeles sin imprimirlo.
* Se guardó credencial HTTPS para `github.com` en `git credential-osxkeychain`.
* Se ejecutó `git push -u origin main`.
* Se verificó que `origin/main` existe y apunta al commit publicado.

### Archivos modificados

* `BITACORA.md`

### Comandos o scripts ejecutados

* `git credential-osxkeychain store` con token tomado desde `pbpaste`.
* `git push -u origin main`.
* `git ls-remote --heads origin`.
* `git status --short --branch`.

### Resultados verificados

* Push exitoso a `https://github.com/investigapyrm/encuestaMIPYMES.git`.
* Rama remota creada: `main`.
* Commit publicado: `60c33352f34e62a40a56625843d75b599d57ad79`.
* Tracking configurado: `main -> origin/main`.

### Pruebas realizadas

* Verificación de referencia remota con `git ls-remote --heads origin`.
* Verificación de estado local con `git status --short --branch`.

### Errores o incidentes

* No se imprimió ni registró el token en bitácora ni documentación.

### Soluciones aplicadas

* Se resolvió el bloqueo de publicación mediante credencial HTTPS válida almacenada en Keychain.

### Pendientes

* Activar GitHub Pages desde la rama `main`.
* Verificar URL pública.
* Resolver acceso público del endpoint Apps Script `/exec`.

### Riesgos

* El repositorio ya está publicado, pero la app no debe considerarse completamente operativa hasta validar GitHub Pages y el backend GAS público.

### Recomendaciones

* Mantener el token fuera de archivos y rotarlo si fue expuesto accidentalmente en otro medio.

## 2026-06-16 15:42

### Proyecto

* Nombre: Encuesta MIPYMES - FAEDPYME 2026
* Cliente o institución: investigapyrm / MID
* Ruta local: `/Users/diegobernardomezabogado/Library/CloudStorage/GoogleDrive-investigapyrm@gmail.com/Mi unidad/encuestaMIPYMES_repo`
* Repositorio: `https://github.com/investigapyrm/encuestaMIPYMES.git`
* URL pública: pendiente de GitHub Pages
* Responsable: Codex
* Versión: 0.1.1

### Objetivo de la intervención

* Eliminar logo ajeno al cuestionario.
* Corregir credenciales iniciales para acceso local y backend.

### Diagnóstico inicial

* `index.html`, `styles.css` y `service-worker.js` referenciaban `assets/logoMID.jpg`.
* El modo local aceptaba únicamente `demo / demo2026`, causando el error `Backend no configurado o credenciales locales incorrectas`.
* El backend GAS creaba solo `admin` con contraseña temporal anterior.

### Acciones realizadas

* Se eliminó el logo visual del login y de la barra superior.
* Se reemplazó por marca textual neutra `F26`.
* Se eliminó `assets/logoMID.jpg` del repositorio.
* Se regeneraron `assets/icon-192.png` y `assets/icon-512.png` como PNG neutros del cuestionario.
* Se configuró login local para `admin / 123456` y `diego.meza / 123456`.
* Se actualizó `initWorkbook` para crear o actualizar ambos usuarios por defecto en `USUARIOS`.
* Se actualizó caché PWA a `encuesta-mipymes-v20260616-2`.
* Se subió GAS con `clasp push -f`.
* Se creó deployment GAS versión 4.

### Archivos modificados

* `index.html`
* `styles.css`
* `config.js`
* `app.js`
* `service-worker.js`
* `assets/icon-192.png`
* `assets/icon-512.png`
* `assets/logoMID.jpg`
* `gas/Config.gs`
* `gas/Utils.gs`
* `README.md`
* `docs/manual_usuario.md`
* `docs/manual_tecnico.md`
* `BITACORA.md`

### Comandos o scripts ejecutados

* `rm assets/logoMID.jpg`
* Script Python local para regenerar íconos PNG.
* `node --check app.js`
* `node --check config.js`
* `node --check service-worker.js`
* `python3 -m json.tool manifest.json`
* `python3 -m json.tool gas/appsscript.json`
* `clasp push -f`
* `clasp version "Credenciales iniciales y retiro de logo ajeno"`
* `clasp deploy -V 4 -d "Encuesta MIPYMES credenciales iniciales"`
* `python3 -m http.server 4173`
* `curl` para verificar `index.html` e íconos.

### Resultados verificados

* No quedan referencias activas a `logoMID`, `brand-logo` ni `top-logo`.
* Credenciales locales verificadas: `admin / 123456` y `diego.meza / 123456`.
* `index.html` responde por HTTP local con `200 OK`.
* `index.html` referencia `config.js?v=20260616-2` y `app.js?v=20260616-2`.
* `assets/icon-192.png` responde por HTTP local con `200 OK` y tipo `image/png`.
* GAS subido correctamente.
* Deployment GAS creado: `AKfycbzxIuNXItP7J3UYuiTSY0l2z0qiNV5S-uDmHpxI3A4Cpm-pB6Clmgo_rmcFNSAPpEZQBQ @4`.

### Pruebas realizadas

* Validación de sintaxis JavaScript.
* Validación JSON.
* Verificación HTTP local.
* Verificación de credenciales locales por lectura de `config.js`.
* Push GAS con `clasp`.

### Errores o incidentes

* `apply_patch` no pudo eliminar el JPG binario por secuencia no UTF-8; se eliminó con `rm` porque era el archivo solicitado para retiro.

### Soluciones aplicadas

* Se retiró el logo ajeno de la interfaz y caché.
* Se estandarizaron credenciales iniciales conforme a instrucción del usuario.

### Pendientes

* Publicar estos cambios en GitHub.
* Activar GitHub Pages si aún no está activo.
* Resolver acceso público del endpoint GAS `/exec`.

### Riesgos

* Si un navegador ya instaló la PWA anterior, puede requerir recarga fuerte o reinstalación para limpiar caché antigua.

### Recomendaciones

* Mantener `admin / 123456` y `diego.meza / 123456` como estándar inicial solo para arranque; si se usa en producción abierta, definir política de cambio posterior controlado.

## 2026-06-16 15:55

### Proyecto

* Nombre: Encuesta MIPYMES - FAEDPYME 2026
* Cliente o institución: investigapyrm / MID
* Ruta local: `/Users/diegobernardomezabogado/Library/CloudStorage/GoogleDrive-investigapyrm@gmail.com/Mi unidad/encuestaMIPYMES_repo`
* Repositorio: `https://github.com/investigapyrm/encuestaMIPYMES.git`
* URL pública: pendiente de GitHub Pages
* Responsable: Codex
* Versión: 0.1.2

### Objetivo de la intervención

* Corregir login que quedaba detenido en `Validando acceso...`.
* Agregar controles de administración de usuarios conforme al manual maestro.

### Diagnóstico inicial

* `handleLogin` no tenía timeout para llamadas a Apps Script.
* La app no tenía botones para registrar usuario ni cambiar contraseña.
* El manual maestro exige login, roles, administración de usuarios, recuperación/cambio de contraseña, auditoría y mensajes claros si GAS devuelve HTML o errores de permisos.

### Acciones realizadas

* Se agregó timeout de 12 segundos a llamadas `fetch` contra GAS.
* Se agregó rehabilitación del botón de ingreso en todos los casos (`finally`).
* Se agregó fallback local cuando GAS falla y las credenciales locales son válidas.
* Se reemplazaron credenciales visibles por hashes SHA-256 en `config.js`.
* Se agregó panel `Registrar usuario` en Administración.
* Se agregó panel `Cambiar mi contraseña`.
* Se agregó tabla local de usuarios.
* Se agregaron endpoints GAS `createUser` y `changePassword`.
* Se ajustó `initWorkbook` para no resetear contraseñas modificadas por usuarios.
* Se actualizó caché PWA a `encuesta-mipymes-v20260616-3`.

### Archivos modificados

* `app.js`
* `config.js`
* `index.html`
* `styles.css`
* `service-worker.js`
* `gas/Code.gs`
* `gas/Usuarios.gs`
* `gas/Utils.gs`
* `README.md`
* `docs/manual_usuario.md`
* `docs/manual_tecnico.md`
* `BITACORA.md`

### Comandos o scripts ejecutados

* `node --check app.js`
* `node --check config.js`
* `node --check service-worker.js`
* `python3 -m json.tool manifest.json`
* `python3 -m json.tool gas/appsscript.json`
* `python3 -m http.server 4173`
* `curl` para verificar HTML, JS y config locales.
* Script Node para verificar hashes de `admin / 123456` y `diego.meza / 123456`.
* `clasp push -f`
* `clasp version "Gestion de usuarios y login robusto"`
* `clasp deploy -V 5 -d "Encuesta MIPYMES gestion usuarios"`

### Resultados verificados

* `index.html` contiene `user-create-form` y `password-change-form`.
* `app.js` contiene timeout, `createUser`, `changePassword` y `findLocalUser`.
* `config.js` contiene hashes SHA-256 para usuarios por defecto, no contraseñas visibles.
* Credenciales locales verificadas por hash: `admin / 123456` y `diego.meza / 123456`.
* GAS subido correctamente.
* Deployment GAS creado: `AKfycbzEwPE0IGN4zxmzAp4zne0FwqqNTvMoEt7DJgjxLkYUm-rhGdR6wg8OLAMi9CbXI2YDCw @5`.

### Pruebas realizadas

* Validación de sintaxis JavaScript.
* Validación JSON.
* Verificación HTTP local.
* Verificación lógica de credenciales locales por Node.
* Push y deployment GAS.

### Errores o incidentes

* Playwright no está instalado en este entorno, por lo que no se ejecutó prueba visual automatizada de navegador real.

### Soluciones aplicadas

* El login ya no debe quedar colgado indefinidamente.
* La Administración ahora incluye alta de usuarios y cambio de contraseña.
* El backend valida permisos de admin para crear usuarios.

### Pendientes

* Publicar cambios en GitHub.
* Activar/verificar GitHub Pages.
* Resolver acceso público definitivo del endpoint GAS `/exec`.
* Probar login real contra GAS cuando `/exec` responda JSON público.

### Riesgos

* En modo local, los usuarios se almacenan en el navegador; si se borra almacenamiento local, se reinicializan usuarios por defecto.
* El backend GAS sigue pendiente de prueba pública porque el acceso `/exec` estaba bloqueado por permisos de despliegue.

### Recomendaciones

* Usar el modo local solo como continuidad operativa de captura y sincronizar cuando GAS quede público.
* Mantener roles y altas definitivas en la hoja `USUARIOS` cuando el backend esté operativo.

## 2026-06-16 16:11

### Proyecto

* Nombre: Encuesta MIPYMES - FAEDPYME 2026
* Cliente o institución: investigapyrm / MID
* Ruta local: `/Users/diegobernardomezabogado/Library/CloudStorage/GoogleDrive-investigapyrm@gmail.com/Mi unidad/encuestaMIPYMES_repo`
* Repositorio: `https://github.com/investigapyrm/encuestaMIPYMES.git`
* URL pública: pendiente de GitHub Pages
* Responsable: Codex
* Versión: 0.1.3

### Objetivo de la intervención

* Corregir bloqueo de acceso reportado por el usuario.
* Asegurar cumplimiento de buenas prácticas del Manual Maestro para login, usuarios, roles y mensajes claros.

### Diagnóstico inicial

* El manual maestro exige validar usuario activo, contraseña, sesión local, roles, mensajes claros y manejo de respuestas no JSON.
* Si el navegador tenía usuarios locales viejos o corruptos, `admin / 123456` podía no recuperarse.
* Si el navegador no exponía `crypto.subtle`, el hash local podía no coincidir.
* Los botones de registro/restablecimiento debían estar visibles también antes del login.

### Acciones realizadas

* Se agregó migración/saneamiento de usuarios locales por defecto.
* Se agregó recuperación controlada para `admin / 123456` y `diego.meza / 123456` aun con almacenamiento local previo dañado.
* Se agregó formulario visible de registro local en la pantalla de login.
* Se agregó formulario visible para solicitud de restablecimiento de contraseña.
* Se actualizó cache busting a `20260616-4`.
* Se incrementó versión a `0.1.3`.

### Archivos modificados

* `app.js`
* `config.js`
* `index.html`
* `styles.css`
* `service-worker.js`
* `BITACORA.md`

### Comandos o scripts ejecutados

* Consulta de secciones relevantes del Manual Maestro.
* `node --check app.js`
* `node --check config.js`
* `node --check service-worker.js`
* `python3 -m json.tool manifest.json`
* `python3 -m http.server 4173`
* `curl` para verificar HTML y JS locales.
* Script Node para verificar configuración de recuperación de login.

### Resultados verificados

* `index.html` contiene `public-register-form` y `password-help-form`.
* `app.js` contiene recuperación de usuarios por defecto, registro público local y solicitud de restablecimiento.
* `config.js` conserva hashes SHA-256 de usuarios por defecto.
* Verificación HTTP local correcta.
* Validaciones de sintaxis correctas.

### Pruebas realizadas

* Validación estática JavaScript.
* Validación JSON.
* Verificación HTTP local.
* Verificación lógica de recuperación de login por Node.

### Errores o incidentes

* No se ejecutó Playwright porque no está instalado en el entorno.

### Soluciones aplicadas

* La app debe permitir acceso local con credenciales institucionales por defecto aunque exista cache/almacenamiento viejo.
* Se agregaron acciones visibles de usuario en pantalla de login y Administración.

### Pendientes

* Publicar cambios en GitHub.
* Verificar URL pública de GitHub Pages.
* Resolver endpoint GAS público y ejecutar prueba real de login contra GAS.

### Riesgos

* Si el navegador conserva un service worker antiguo, puede requerir recarga fuerte o limpieza de datos del sitio.

### Recomendaciones

* Para usuarios que ya abrieron una versión anterior, indicar recarga fuerte o limpieza de datos del sitio.

## 2026-06-16 16:15

### Proyecto

* Nombre: Encuesta MIPYMES - FAEDPYME 2026
* Cliente o institución: investigapyrm / MID
* Ruta local: `/Users/diegobernardomezabogado/Library/CloudStorage/GoogleDrive-investigapyrm@gmail.com/Mi unidad/encuestaMIPYMES_repo`
* Repositorio: `https://github.com/investigapyrm/encuestaMIPYMES.git`
* URL pública: pendiente de GitHub Pages
* Responsable: Codex
* Versión: 0.1.3

### Objetivo de la intervención

* Corregir comportamiento donde el panel de login quedaba visible después del acceso.

### Diagnóstico inicial

* `showApp()` marcaba `#login-view.hidden = true`.
* `.login-shell` definía `display: grid`.
* La regla de clase podía pisar el comportamiento esperado del atributo HTML `hidden`, manteniendo visible el login.

### Acciones realizadas

* Se agregó regla CSS global `[hidden] { display: none !important; }`.
* Se actualizó cache busting de `styles.css` a `20260616-5`.
* Se actualizó cache PWA a `encuesta-mipymes-v20260616-5`.

### Archivos modificados

* `index.html`
* `styles.css`
* `service-worker.js`
* `BITACORA.md`

### Comandos o scripts ejecutados

* `node --check app.js`
* `node --check config.js`
* `node --check service-worker.js`
* `python3 -m http.server 4173`
* `curl` para verificar `index.html` y `styles.css`.

### Resultados verificados

* `index.html` carga `styles.css?v=20260616-5`.
* `styles.css` contiene `[hidden] { display: none !important; }`.
* `service-worker.js` usa cache `encuesta-mipymes-v20260616-5`.
* Verificación HTTP local correcta.

### Pruebas realizadas

* Validación sintáctica JavaScript.
* Verificación HTTP local de HTML y CSS.

### Errores o incidentes

* Un primer `curl` sin comillas falló por interpretación del carácter `?` en zsh; se repitió con URL entre comillas correctamente.

### Soluciones aplicadas

* Se corrigió la colisión entre atributo `hidden` y reglas CSS de display.

### Pendientes

* Publicar cambios en GitHub.
* Verificar remoto.

### Riesgos

* Navegadores con service worker anterior pueden requerir recarga fuerte para cargar `styles.css?v=20260616-5`.

### Recomendaciones

* Mantener siempre una regla global `[hidden] { display: none !important; }` en apps que alternan vistas con el atributo `hidden`.

## 2026-06-16 16:30

### Proyecto

* Nombre: Encuesta MIPYMES - FAEDPYME 2026
* Cliente o institución: investigapyrm / MID
* Ruta local: `/Users/diegobernardomezabogado/Library/CloudStorage/GoogleDrive-investigapyrm@gmail.com/Mi unidad/encuestaMIPYMES_repo`
* Repositorio: `https://github.com/investigapyrm/encuestaMIPYMES.git`
* URL pública: pendiente de GitHub Pages
* Responsable: Codex
* Versión: 0.1.4

### Objetivo de la intervención

* Incorporar botones globales obligatorios para instalar, actualizar, sincronizar y abrir hoja online.
* Limitar autorregistro a usuarios de campo `encuestador` o `censista`.
* Registrar la regla como estándar en el Manual Maestro institucional.

### Diagnóstico inicial

* La app tenía sincronización solo dentro de la pestaña `Sincronización`.
* No existían botones visibles para instalar ni actualizar PWA.
* No existía botón permanente para que `admin` abra la hoja online.
* El autorregistro local usaba rol genérico previo.

### Acciones realizadas

* Se agregó botón global `Instalar`.
* Se agregó botón global `Actualizar`, que actualiza service workers, limpia cachés `encuesta-mipymes-*` y recarga.
* Se agregó botón global `Sincronizar`.
* Se agregó botón global `Hoja online`, visible solo para rol `admin`.
* Se agregó `spreadsheetUrl` en `config.js`.
* Se restringió autorregistro a `encuestador` o `censista`.
* Se actualizó creación de usuarios admin para aceptar `encuestador`, `censista`, `supervisor` y `admin`.
* Se eliminó uso de rol `cargador`.
* Se actualizó caché PWA a `encuesta-mipymes-v20260616-6`.
* Se agregó nota operativa al Manual Maestro: acciones globales PWA, sincronización y usuarios de campo.
* Se subió GAS y se creó deployment versión 6.

### Archivos modificados

* `index.html`
* `styles.css`
* `app.js`
* `config.js`
* `service-worker.js`
* `gas/Config.gs`
* `gas/Usuarios.gs`
* `README.md`
* `docs/manual_usuario.md`
* `docs/manual_tecnico.md`
* `BITACORA.md`
* Manual Maestro: `Manual maestro para creación de appweb.txt`

### Comandos o scripts ejecutados

* `node --check app.js`
* `node --check config.js`
* `node --check service-worker.js`
* `python3 -m json.tool manifest.json`
* `python3 -m json.tool gas/appsscript.json`
* `clasp push -f`
* `clasp version "Acciones globales PWA y roles de campo"`
* `clasp deploy -V 6 -d "Encuesta MIPYMES acciones globales"`
* `python3 -m http.server 4173`
* `curl` para verificar HTML y JS locales.

### Resultados verificados

* `index.html` contiene `install-btn`, `update-app-btn`, `global-sync-btn` y `open-sheet-btn`.
* `app.js` contiene `installApp`, `updateApp` y `openSpreadsheet`.
* `config.js` contiene `spreadsheetUrl`.
* No quedan referencias al rol `cargador` en app, GAS, README ni docs vigentes.
* `service-worker.js` usa cache `encuesta-mipymes-v20260616-6`.
* GAS subido correctamente.
* Deployment GAS creado: `AKfycbwVP8kMSplPe2xAp8LrZX0QqipcZSY9xR1UipeOfIBN1bKhk2Nw072AH-hw_nvl2SLAYw @6`.
* Manual Maestro actualizado con la nota operativa 2026-06-16.

### Pruebas realizadas

* Validación de sintaxis JavaScript.
* Validación JSON.
* Verificación HTTP local.
* Verificación de referencias con `rg`.
* Push/deployment GAS con `clasp`.

### Errores o incidentes

* No se ejecutó prueba visual Playwright porque no está instalado en el entorno.

### Soluciones aplicadas

* Acciones críticas de operación quedan visibles sin depender de navegación a pestañas secundarias.
* Autorregistro queda limitado a perfiles de campo.
* Admin conserva acceso directo a la base online.

### Pendientes

* Publicar cambios en GitHub.
* Verificar cambios remotos.
* Activar/verificar GitHub Pages si aún no está activo.

### Riesgos

* El botón `Instalar` depende de soporte del navegador y criterios PWA; si no aparece prompt, la app muestra orientación.
* El botón `Hoja online` abre la hoja solo si el usuario del navegador tiene permiso Google sobre la planilla.

### Recomendaciones

* Mantener esta regla como estándar para todas las apps PWA/offline: instalar, actualizar, sincronizar y acceso admin a base online siempre visibles.

## 2026-06-16 16:36

### Proyecto

* Nombre: Encuesta MIPYMES - FAEDPYME 2026
* Cliente o institución: investigapyrm / MID
* Ruta local: `/Users/diegobernardomezabogado/Library/CloudStorage/GoogleDrive-investigapyrm@gmail.com/Mi unidad/encuestaMIPYMES_repo`
* Repositorio: `https://github.com/investigapyrm/encuestaMIPYMES.git`
* URL pública: pendiente de GitHub Pages
* Responsable: Codex
* Versión: 0.1.5

### Objetivo de la intervención

* Rediseñar la experiencia móvil del formulario por desorden visual y carga tediosa de opciones.

### Diagnóstico inicial

* La media query móvil convertía `likert-grid` en una sola columna.
* Las opciones se veían como tarjetas grandes apiladas, aumentando desplazamiento y fatiga.
* Las escalas repetidas de 1 a 5 eran especialmente lentas de completar.

### Acciones realizadas

* Se mantuvo Likert 1-5 como escala horizontal en móvil.
* Se agregó leyenda mínima/máxima para Likert.
* Se compactaron opciones Sí/No y radios cortos.
* Se dejaron opciones largas en una columna legible.
* Se ocultó radio nativo y se agregó selección visual de alto contraste.
* Se agregó clase `.selected` por JavaScript además de CSS `:has()`.
* Se agregó autoavance suave al siguiente campo visible tras seleccionar radio/Likert.
* Se dejó barra inferior fija de acciones de guardado en móvil.
* Se actualizó cache PWA a `encuesta-mipymes-v20260616-7`.
* Se agregó nota operativa al Manual Maestro sobre formularios móviles con opciones compactas.

### Archivos modificados

* `app.js`
* `styles.css`
* `config.js`
* `index.html`
* `service-worker.js`
* `README.md`
* `docs/manual_usuario.md`
* `docs/manual_tecnico.md`
* `BITACORA.md`
* Manual Maestro: `Manual maestro para creación de appweb.txt`

### Comandos o scripts ejecutados

* `node --check app.js`
* `node --check config.js`
* `node --check service-worker.js`
* `python3 -m json.tool manifest.json`
* `python3 -m http.server 4173`
* `curl` para verificar `index.html`, `styles.css` y `app.js`.
* `rg` para verificar referencias de versión y clases.

### Resultados verificados

* `index.html` carga `styles.css`, `config.js` y `app.js` con versión `20260616-7`.
* `service-worker.js` usa cache `encuesta-mipymes-v20260616-7`.
* `app.js` contiene `scheduleNextField`, `updateOptionStates`, `likert-wrap` y radios compactos.
* `styles.css` contiene `scale-legend`, `.selected`, `likert-grid` móvil horizontal y barra fija de acciones.
* Verificación HTTP local correcta.

### Pruebas realizadas

* Validación sintáctica JavaScript.
* Validación JSON.
* Verificación HTTP local.

### Errores o incidentes

* No se ejecutó prueba Playwright porque no está instalado en el entorno.

### Soluciones aplicadas

* Se redujo el desplazamiento vertical y se hizo más rápida la selección táctil de respuestas repetidas.

### Pendientes

* Publicar cambios en GitHub.
* Validar visualmente en teléfono real.
* Si el usuario confirma aún fricción, evaluar formularios por pasos o una pregunta por pantalla para bloques Likert extensos.

### Riesgos

* Autoavance puede sentirse rápido para algunos usuarios; se dejó con retardo corto y solo después de seleccionar radio/Likert.

### Recomendaciones

* Para encuestas largas, evitar apilar escalas de opción corta en móvil. Mantener controles compactos, selección evidente y acciones fijas.

## 2026-06-16 17:06

### Proyecto

* Nombre: Encuesta MIPYMES FAEDPYME 2026
* Cliente o institución: investigapyrm
* Ruta local: `/Users/diegobernardomezabogado/Library/CloudStorage/GoogleDrive-investigapyrm@gmail.com/Mi unidad/encuestaMIPYMES_repo`
* Repositorio: `https://github.com/investigapyrm/encuestaMIPYMES.git`
* URL pública: GitHub Pages pendiente de verificación final
* Responsable: Codex
* Versión: `0.1.6` / cache `20260616-8`

### Objetivo de la intervención

* Restringir usuarios no admin para que solo vean el cuestionario al ingresar.
* Dar más color y diferenciación visual a la app.
* Agregar panel de seguimiento de respuestas exclusivo para admin.

### Diagnóstico inicial

* Todas las pestañas quedaban visibles para cualquier rol autenticado.
* Después de guardar una encuesta, el usuario era enviado a `Registros`, incluso si era usuario de campo.
* La interfaz mantenía una paleta institucional correcta, pero demasiado plana para una encuesta larga.
* No existía un módulo admin específico para seguimiento operativo de respuestas.

### Acciones realizadas

* Se agregó control central de permisos con `isAdmin`, `canAccessView`, `defaultViewForRole` y `applyRoleAccess`.
* Se configuró ingreso de `encuestador` y `censista` directamente a `Formulario`.
* Se bloqueó cualquier vista distinta a `Formulario` para usuarios no admin.
* Se mantuvieron acciones globales operativas de instalar, actualizar, sincronizar y salir.
* Se agregó pestaña `Seguimiento` solo para admin.
* Se agregó tablero admin con total local, pendientes, errores, sincronizadas, carga por usuario y últimas respuestas.
* Se incorporaron acentos visuales multicolor en KPIs, tabs, progreso, bloques de formulario y selección de opciones.
* Se actualizó cache PWA a `encuesta-mipymes-v20260616-8`.
* Se agregó nota reutilizable al Manual Maestro sobre vistas por rol y seguimiento admin.

### Archivos modificados

* `index.html`
* `app.js`
* `styles.css`
* `config.js`
* `service-worker.js`
* `README.md`
* `docs/manual_usuario.md`
* `docs/manual_tecnico.md`
* `BITACORA.md`
* Manual Maestro: `Manual maestro para creación de appweb.txt`

### Comandos o scripts ejecutados

* `node --check app.js`
* `node --check config.js`
* `node --check service-worker.js`
* `python3 -m json.tool manifest.json`
* `python3 -m json.tool data/survey-schema.json`
* `python3 -m http.server 4173`
* `curl` para verificar `index.html`, `app.js`, `styles.css`, `config.js` y `service-worker.js`.
* `rg` para verificar versión `20260616-8`, permisos por rol, panel de seguimiento y clases visuales.
* `git commit -m "Restrict field users and add admin tracking"`
* `git push origin main`
* `curl` sobre `https://investigapyrm.github.io/encuestaMIPYMES/` para verificar publicación pública.

### Resultados verificados

* `index.html` carga `styles.css`, `config.js` y `app.js` con versión `20260616-8`.
* `service-worker.js` usa cache `encuesta-mipymes-v20260616-8`.
* `config.js` informa versión `0.1.6`.
* `app.js` contiene control central de permisos y render de seguimiento admin.
* `styles.css` contiene acentos multicolor, modo de usuario de campo y layout de seguimiento.
* Verificación HTTP local correcta.
* Commit `3ede211` publicado en `origin/main`.
* GitHub Pages sirve `index.html`, `app.js` y `service-worker.js` con versión/cache `20260616-8`.

### Pruebas realizadas

* Validación sintáctica JavaScript.
* Validación JSON.
* Verificación HTTP local.
* Verificación HTTP pública en GitHub Pages.

### Errores o incidentes

* Sin incidentes al momento de registrar los cambios.

### Soluciones aplicadas

* Permisos por rol centralizados para evitar filtraciones de módulos.
* Panel admin de seguimiento basado en registros locales para lectura operativa inmediata.
* Paleta visual ampliada sin cambiar la arquitectura base del proyecto.

### Pendientes

* Validar visualmente en URL pública y teléfono real.

### Riesgos

* El panel de seguimiento se alimenta de registros locales del dispositivo; para seguimiento consolidado multiusuario se requerirá endpoint GAS de lectura centralizada.

### Recomendaciones

* Mantener para futuros proyectos la regla: usuario de campo ve solo formulario; admin ve operación completa y seguimiento.

## 2026-06-16 17:22

### Proyecto

* Nombre: Encuesta MIPYMES FAEDPYME 2026
* Cliente o institución: investigapyrm
* Ruta local: `/Users/diegobernardomezabogado/Library/CloudStorage/GoogleDrive-investigapyrm@gmail.com/Mi unidad/encuestaMIPYMES_repo`
* Repositorio: `https://github.com/investigapyrm/encuestaMIPYMES.git`
* URL pública: `https://investigapyrm.github.io/encuestaMIPYMES/`
* Responsable: Codex
* Versión: `0.1.7` / cache `20260616-9`

### Objetivo de la intervención

* Preparar la app para envío por correo y autollenado por usuarios externos.
* Dejar instrucciones claras para crear acceso, logearse y usar la app sin asistencia.
* Agregar ayudas contextuales `(i)` en login, autorregistro, formulario y acciones de guardado.

### Diagnóstico inicial

* El login estaba pensado para usuarios internos y no explicaba el flujo de primera vez.
* El autorregistro hablaba de “usuario local” y exponía rol, lo cual podía confundir al respondiente.
* Solo se aceptaba `nombre.apellido`, poco natural para un enlace enviado por correo.
* Las preguntas no mostraban ayuda contextual emergente.

### Acciones realizadas

* Se agregó guía inicial “Cómo responder” en la pantalla de ingreso.
* Se renombró autorregistro a `Crear acceso`.
* El autorregistro queda con rol de campo por defecto y no expone selector de rol al respondiente.
* Se permite correo electrónico como usuario, además de `nombre.apellido`.
* Se agregaron tooltips `(i)` en usuario, contraseña, autorregistro, ayuda de contraseña, bloques, preguntas y botones de guardado.
* Se agregó guía breve dentro del formulario sobre guardar, sincronizar y privacidad.
* Se creó `docs/texto_correo_invitacion.md` con texto base para envío por correo.
* Se actualizó GAS para aceptar correo electrónico como usuario cuando el backend esté activo.
* Se actualizó cache PWA a `encuesta-mipymes-v20260616-9`.
* Se agregó nota reutilizable al Manual Maestro sobre encuestas enviadas por correo y ayuda contextual.

### Archivos modificados

* `index.html`
* `app.js`
* `styles.css`
* `config.js`
* `service-worker.js`
* `gas/Config.gs`
* `gas/Usuarios.gs`
* `README.md`
* `docs/manual_usuario.md`
* `docs/manual_tecnico.md`
* `docs/texto_correo_invitacion.md`
* `BITACORA.md`
* Manual Maestro: `Manual maestro para creación de appweb.txt`

### Comandos o scripts ejecutados

* `node --check app.js`
* `node --check config.js`
* `node --check service-worker.js`
* Validación sintáctica GAS copiando temporalmente `gas/*.gs` como `.js`.
* `python3 -m json.tool manifest.json`
* `python3 -m json.tool data/survey-schema.json`
* `clasp push -f`
* `clasp version "Encuesta MIPYMES 0.1.7 instrucciones correo"`
* `clasp deploy -d "Encuesta MIPYMES 0.1.7 - instrucciones correo"`
* `clasp deployments`
* `curl` sobre deployment GAS nuevo.
* `python3 -m http.server 4173`
* `curl` para verificar `index.html`, `app.js`, `styles.css` y `service-worker.js`.
* `rg` para verificar versión `20260616-9`, ayudas `(i)`, `Crear acceso` y texto de correo.
* `git commit -m "Clarify emailed survey access flow"`
* `git push origin main`
* `curl` sobre `https://investigapyrm.github.io/encuestaMIPYMES/` para verificar publicación pública.

### Resultados verificados

* `index.html` carga assets con versión `20260616-9`.
* `service-worker.js` usa cache `encuesta-mipymes-v20260616-9`.
* `config.js` informa versión `0.1.7`.
* La pantalla de ingreso contiene guía “Cómo responder”.
* El autorregistro usa `Crear acceso` y acepta correo o `nombre.apellido`.
* `app.js` contiene `fieldHelpText`, `infoTip` e `isValidUsername`.
* `docs/texto_correo_invitacion.md` contiene texto base para campaña por correo.
* GAS fue subido con `clasp push -f`.
* Deployment GAS creado: `AKfycbwOgnPfHcVQBAeRwpFZ8IHKnP9BbFyyPXT4BRo9PtdtNJEdXa8DJ4V7qMzvnGzaEt8h1Q @8`.
* Verificación HTTP local correcta.
* Commit `de5b0f8` publicado en `origin/main`.
* GitHub Pages sirve `index.html`, `app.js` y `service-worker.js` con versión/cache `20260616-9`.

### Pruebas realizadas

* Validación sintáctica JavaScript.
* Validación sintáctica GAS por copia temporal `.js`.
* Validación JSON.
* Verificación HTTP local.
* Prueba pública del deployment GAS.
* Verificación HTTP pública en GitHub Pages.

### Errores o incidentes

* `node --check gas/*.gs` no acepta extensión `.gs`; se repitió la validación copiando temporalmente como `.js`.
* El deployment GAS nuevo sigue devolviendo página Google “Necesitas acceso”; por eso no se activó `gasExecUrl` en `config.js`.

### Soluciones aplicadas

* Se transformó el ingreso en un flujo apto para encuestados invitados por correo.
* Se redujo la probabilidad de error con ayuda contextual y texto base de invitación.

### Pendientes

* Antes de envío masivo, probar guardado y sincronización real contra Google Sheets.

### Riesgos

* La app pública todavía requiere backend Apps Script correctamente publicado para que respuestas de usuarios externos lleguen a Google Sheets. Si `gasExecUrl` permanece vacío, las respuestas quedan locales en el dispositivo hasta que se configure sincronización.

### Recomendaciones

* No enviar campaña masiva por correo sin una prueba real de punta a punta: crear acceso, ingresar, guardar encuesta, sincronizar y verificar fila en Google Sheets.

## 2026-06-27 16:37

### Proyecto

* Nombre: Encuesta MIPYMES FAEDPYME 2026
* Cliente o institución: investigapyrm
* Ruta local: `/Users/diegobernardomezabogado/Library/CloudStorage/GoogleDrive-investigapyrm@gmail.com/Mi unidad/encuestaMIPYMES_repo`
* Repositorio: `https://github.com/investigapyrm/encuestaMIPYMES.git`
* URL pública: `https://investigapyrm.github.io/encuestaMIPYMES/`
* Responsable: Codex
* Versión revisada: `0.1.7` / cache `20260616-9`

### Objetivo de la intervención

* Reportar el estado real del proyecto diferenciando código local, publicación pública, backend Apps Script y operación efectiva.

### Diagnóstico inicial

* El repositorio local está en `main` sincronizado con `origin/main`, sin cambios pendientes al inicio de la revisión.
* La app pública responde por GitHub Pages.
* `config.js` conserva `gasExecUrl` vacío, por lo que la app publicada no envía respuestas al backend GAS desde GitHub Pages.
* La bitácora central existe en `MANUAL_MAESTRO_FORMATOS_FUNCIONES_APPWEB/BITACORAS_PROYECTOS`, pero la bitácora local contiene el hito más reciente de publicación y bloqueo GAS.

### Acciones realizadas

* Se revisó la memoria técnica previa del proyecto.
* Se consultó la carpeta maestra institucional montada en Google Drive.
* Se verificó estado Git, últimos commits, documentación, configuración, service worker, manual técnico y texto de correo.
* Se verificó la URL pública de GitHub Pages.
* Se verificó la configuración pública servida por Pages.
* Se consultaron deployments y versiones Apps Script con `clasp`.
* Se probó el deployment GAS más reciente documentado y el deployment `@HEAD`.

### Archivos modificados

* `BITACORA.md`.
* Copia central de bitácora en `MANUAL_MAESTRO_FORMATOS_FUNCIONES_APPWEB/BITACORAS_PROYECTOS/BITACORA_ENCUESTA_MIPYMES_FAEDPYME_2026.md`.

### Comandos o scripts ejecutados

* `git status --short --branch`
* `git log --oneline --decorate -n 8`
* `curl -sSIL https://investigapyrm.github.io/encuestaMIPYMES/`
* `curl -sSL https://investigapyrm.github.io/encuestaMIPYMES/config.js?v=20260616-9`
* `curl -sSL https://investigapyrm.github.io/encuestaMIPYMES/service-worker.js?v=20260616-9`
* `curl -sSL https://script.google.com/macros/s/.../exec`
* `clasp deployments`
* `clasp versions`
* `node --check app.js`
* `node --check config.js`
* `node --check service-worker.js`
* `python3 -m json.tool manifest.json`
* `python3 -m json.tool data/survey-schema.json`
* `python3 -m json.tool gas/appsscript.json`

### Resultados verificados

* GitHub Pages responde HTTP `200` en `https://investigapyrm.github.io/encuestaMIPYMES/`.
* La publicación pública sirve `config.js` con versión `0.1.7`, build `2026-06-16`, schema `20260616-9` y `gasExecUrl: ''`.
* La publicación pública sirve `service-worker.js` con cache `encuesta-mipymes-v20260616-9`.
* El frontend público conserva ayudas `(i)`, flujo `Crear acceso`, validación de usuario por correo o `nombre.apellido` y referencias a sincronización.
* `clasp deployments` muestra 7 deployments y el deployment de instrucciones por correo en versión `@8`.
* `clasp versions` muestra 8 versiones.
* El deployment GAS más reciente probado sigue devolviendo página Google de acceso restringido o flujo de inicio de sesión, no JSON operativo.
* Las validaciones sintácticas locales de JavaScript y JSON pasaron.

### Pruebas realizadas

* Verificación HTTP pública de GitHub Pages.
* Verificación HTTP pública de assets versionados.
* Verificación HTTP de Apps Script `/exec`.
* Validación sintáctica de frontend y manifiestos.
* Consulta de deployments y versiones Apps Script.

### Errores o incidentes

* El endpoint Apps Script todavía no está accesible de forma pública/anónima para operación desde GitHub Pages.
* El backend existe y tiene deployments, pero no debe considerarse operativo hasta que `/exec` responda JSON y se confirme escritura real en Google Sheets.
* El README y la configuración todavía documentan/contienen usuarios demo iniciales; antes de producción conviene retirarlos de la superficie pública o rotarlos con un flujo seguro.

### Soluciones aplicadas

* No se modificó código funcional.
* Se registró el estado verificado en bitácora local y bitácora central.

### Pendientes

* Habilitar correctamente el Web App de Apps Script con acceso compatible con GitHub Pages.
* Ejecutar una prueba real de punta a punta: crear acceso, ingresar, guardar encuesta, sincronizar y verificar fila en Google Sheets.
* Activar `gasExecUrl` solo cuando `/exec` responda JSON operativo.
* Revisar y sanear usuarios/credenciales demo antes de campaña masiva.

### Riesgos

* Si se envía la campaña hoy, las respuestas pueden quedar solo locales en el dispositivo y no llegar a Google Sheets.
* El usuario puede creer que guardó definitivamente cuando en realidad queda pendiente de sincronización.
* Un cambio prematuro de `gasExecUrl` puede romper login/sincronización si el endpoint sigue devolviendo HTML de Google.

### Recomendaciones

* No lanzar envío masivo hasta cerrar el bloqueo GAS y verificar escritura real en la hoja.
* Mantener la distinción operativa: GitHub Pages publicado no equivale a backend operativo.
* Después de resolver GAS, actualizar `config.js`, subir commit, verificar Pages con cache-busting y repetir prueba completa en móvil.

## 2026-06-27 17:04

### Proyecto

* Nombre: Encuesta MIPYMES Investigación 2026
* Cliente o institución: investigapyrm
* Ruta local: `/Users/diegobernardomezabogado/Library/CloudStorage/GoogleDrive-investigapyrm@gmail.com/Mi unidad/encuestaMIPYMES_repo`
* Repositorio: `https://github.com/investigapyrm/encuestaMIPYMES.git`
* URL pública: `https://investigapyrm.github.io/encuestaMIPYMES/`
* Responsable: Codex
* Versión: `0.2.0` / cache `20260627-1`

### Objetivo de la intervención

* Ajustar la app web al cuestionario final recibido en DOCX.
* Cambiar el flujo para envío por correo sin login ni creación de acceso.
* Mantener trazabilidad, cola local y preparación para envío a Google Sheets cuando GAS quede habilitado.

### Diagnóstico inicial

* El archivo final de cuestionario está en `FACEN _Cuestionario 2026 Factores de continuidad de las mipymes.docx`.
* El esquema anterior venía del PDF y tenía `nif`, categorías antiguas de tamaño de empresa y no incluía causa principal en la pregunta 18.
* La app mostraba flujo de login/autorregistro, incompatible con el nuevo criterio operativo indicado por el usuario.
* El backend GAS seguía pendiente de permisos públicos; `gasExecUrl` continúa vacío para no prometer envío real todavía.

### Acciones realizadas

* Se extrajo el DOCX final con `python-docx`, incluyendo párrafos y tablas.
* Se actualizó `data/survey-schema.json` a `2026-06-27.1`.
* Se cambió `nif` por `ruc`.
* Se actualizaron categorías de tamaño: `Hasta 10`, `11 a 30`, `31 o más`.
* Se agregaron campos condicionales `q18_causa_principal` y `q18_causa_otra`.
* Se separaron escalas Likert por bloque según el DOCX: gobierno, entorno, rendimiento, importancia de innovaciones y factores de abandono.
* Se activó acceso público sin login con `requireLogin: false`.
* Se retiró el formulario de login/autorregistro de la superficie HTML pública.
* Se actualizó la app a `0.2.0` y cache PWA `encuesta-mipymes-v20260627-1`.
* Se preparó GAS para aceptar `saveSurvey` sin token cuando `APP_CONFIG.REQUIRE_LOGIN === false`.
* Se retiró la creación de usuarios administradores por defecto en `initWorkbook`.
* Se actualizaron README, manual de usuario, manual técnico, diccionario de datos y texto de correo.

### Archivos modificados

* `FACEN _Cuestionario 2026 Factores de continuidad de las mipymes.docx`
* `index.html`
* `app.js`
* `styles.css`
* `config.js`
* `service-worker.js`
* `manifest.json`
* `data/survey-schema.json`
* `gas/Config.gs`
* `gas/Datos.gs`
* `gas/Utils.gs`
* `README.md`
* `docs/manual_usuario.md`
* `docs/manual_tecnico.md`
* `docs/diccionario_datos.md`
* `docs/texto_correo_invitacion.md`
* `BITACORA.md`
* Copia central de bitácora en `MANUAL_MAESTRO_FORMATOS_FUNCIONES_APPWEB/BITACORAS_PROYECTOS/BITACORA_ENCUESTA_MIPYMES_FAEDPYME_2026.md`.

### Comandos o scripts ejecutados

* `python3` con `python-docx` para extracción del DOCX final.
* `python3` para actualización estructurada de `data/survey-schema.json`.
* `node --check app.js`
* `node --check config.js`
* `node --check service-worker.js`
* `python3 -m json.tool data/survey-schema.json`
* `python3 -m json.tool manifest.json`
* `python3 -m json.tool gas/appsscript.json`
* Validación sintáctica GAS copiando temporalmente `gas/*.gs` como `.js`.
* `python3 -m http.server 4173`
* `curl` contra `http://127.0.0.1:4173/` y `config.js?v=20260627-1`.
* Chrome headless para DOM y capturas desktop/móvil.

### Resultados verificados

* La app local abre directamente en `Formulario`, sin pantalla de login.
* `config.js` publica `requireLogin: false`, versión `0.2.0` y schema `20260627-1`.
* El formulario renderiza `RUC`.
* El formulario renderiza `q18_causa_principal` y `q18_causa_otra` como campos condicionales.
* El texto visible ya indica `Guardar y enviar encuesta` y `Enviar pendientes`.
* La captura desktop no muestra barra horizontal y presenta el formulario limpio.
* La captura móvil apila botones inferiores para evitar recortes.
* Validaciones JavaScript, JSON y GAS pasaron.

### Pruebas realizadas

* Validación sintáctica JavaScript.
* Validación JSON.
* Validación GAS por copia temporal `.js`.
* Smoke test HTTP local.
* Smoke test DOM con Chrome headless.
* Captura desktop y móvil.

### Errores o incidentes

* `npx -p playwright node` no expuso el módulo `playwright` para `require`; se usó Chrome headless directo.
* En la primera captura móvil se recortaba el botón de envío; se corrigió apilando acciones en pantallas angostas.
* El backend GAS sigue pendiente de habilitación pública; no se pudo validar escritura real en Google Sheets.

### Soluciones aplicadas

* Acceso directo sin login para respondientes por correo.
* Esquema actualizado desde el DOCX final.
* Backend preparado para guardado público sin token cuando el despliegue GAS esté habilitado.
* Cache busting actualizado para forzar nueva versión en GitHub Pages/PWA.

### Commit o versión generada

* Versión local generada: `0.2.0` / cache `20260627-1`.
* Commit de cierre: ver hash final de `Adapt survey for final questionnaire without login`.

### Pendientes

* Subir cambios a GitHub y verificar propagación en GitHub Pages.
* Ejecutar `clasp push -f` y crear deployment GAS nuevo cuando se vaya a activar backend.
* Habilitar el Web App Apps Script para que `/exec` responda JSON público.
* Configurar `gasExecUrl` solo después de que `/exec` responda JSON y probar guardado real en Google Sheets.

### Riesgos

* Si se envía la encuesta antes de habilitar GAS, las respuestas quedarán guardadas localmente en el navegador del respondiente y no llegarán a Google Sheets.
* Al no existir login, la identidad operativa depende de los campos informados en el formulario, especialmente empresa, correo y RUC.

### Recomendaciones

* No enviar campaña masiva hasta que la URL pública actualizada y el backend GAS estén verificados de punta a punta.
* En el correo, indicar que no se necesita usuario ni contraseña.
* Si se requiere administración, publicarla en un flujo separado del enlace enviado a respondientes.

## 2026-06-28 13:37

### Proyecto

* Nombre: Encuesta MIPYMES Investigacion 2026
* Cliente o institucion: investigapyrm
* Ruta local: `J:\Mi unidad\encuestaMIPYMES_repo`
* Repositorio: `https://github.com/investigapyrm/encuestaMIPYMES.git`
* URL publica: `https://investigapyrm.github.io/encuestaMIPYMES/`
* Responsable: Codex
* Version revisada: `0.2.0` / cache `20260627-1` / Pages commit `ff264c3f0a6a09b9f15f1a7ddbaa91c3a2c5c9c7`

### Objetivo de la intervencion

* Verificar la situacion real de GitHub Pages desde `settings/pages`, la URL publica y los proximos pasos operativos.

### Diagnostico inicial

* GitHub remoto existe, es publico y tiene rama default `main`.
* La carpeta local conserva los archivos del proyecto, pero la metadata Git local aparece como repositorio sin commits: `No commits yet on main...origin/main [gone]`.
* Hay un lock local antiguo en `.git/refs/remotes/origin/main.lock`, creado el 2026-06-27 16:07, que impide actualizar `origin/main`.
* El frontend publicado no tiene backend GAS activo porque `config.js` mantiene `gasExecUrl: ''`.

### Acciones realizadas

* Se reviso el protocolo institucional de appwebs, el manual maestro y la bitacora local.
* Se consulto la API de GitHub Pages para `investigapyrm/encuestaMIPYMES`.
* Se verifico la URL publica de GitHub Pages con cache-busting.
* Se verificaron `config.js`, `service-worker.js` y `data/survey-schema.json` publicados.
* Se consulto el ultimo build de GitHub Pages y el ultimo commit de `main`.
* Se compararon hashes de blobs del arbol remoto `main` contra archivos locales versionables.
* Se contrasto la carpeta local contra `FETCH_HEAD` y se detectaron cambios funcionales locales `0.2.1` no publicados.
* Se reviso `clasp`, deployments GAS conocidos y validaciones sintacticas locales.

### Archivos modificados

* `BITACORA.md`
* Copia central prevista/sincronizada: `G:\Mi unidad\MANUAL_MAESTRO_FORMATOS_FUNCIONES_APPWEB\BITACORAS_PROYECTOS\BITACORA_ENCUESTA_MIPYMES_FAEDPYME_2026.md`

### Comandos o scripts ejecutados

* `git status --branch --short`
* `git remote -v`
* `gh repo view investigapyrm/encuestaMIPYMES --json ...`
* `gh api repos/investigapyrm/encuestaMIPYMES/pages`
* `gh api repos/investigapyrm/encuestaMIPYMES/pages/builds/latest`
* `gh api repos/investigapyrm/encuestaMIPYMES/commits/main`
* `gh api repos/investigapyrm/encuestaMIPYMES/git/trees/main?recursive=1`
* `Invoke-WebRequest https://investigapyrm.github.io/encuestaMIPYMES/?v=20260628-check`
* `Invoke-WebRequest https://investigapyrm.github.io/encuestaMIPYMES/config.js?v=20260628-check`
* `Invoke-WebRequest https://investigapyrm.github.io/encuestaMIPYMES/service-worker.js?v=20260628-check`
* `Invoke-WebRequest https://investigapyrm.github.io/encuestaMIPYMES/data/survey-schema.json?v=20260628-check`
* `clasp show-authorized-user`
* `clasp deployments`
* `clasp versions`
* `node --check app.js`
* `node --check config.js`
* `node --check service-worker.js`
* `python -m json.tool data\survey-schema.json`
* `python -m json.tool manifest.json`
* `python -m json.tool gas\appsscript.json`

### Resultados verificados

* GitHub Pages esta configurado y construido: `status: built`, `public: true`, `https_enforced: true`, fuente `main` en ruta `/`.
* URL publica verificada con HTTP `200`: `https://investigapyrm.github.io/encuestaMIPYMES/`.
* Ultimo build Pages: `1067413999`, commit `ff264c3f0a6a09b9f15f1a7ddbaa91c3a2c5c9c7`, creado 2026-06-27 20:07:37 UTC, sin error.
* La publicacion sirve `index.html` con assets `styles.css`, `config.js` y `app.js` versionados como `20260627-1`.
* `config.js` publicado informa `appVersion: '0.2.0'`, `buildDate: '2026-06-27'`, `requireLogin: false`, `allowLocalDemoLogin: false` y `gasExecUrl: ''`.
* `service-worker.js` publicado usa cache `encuesta-mipymes-v20260627-1`.
* `data/survey-schema.json` publico responde HTTP `200`, con titulo del instrumento y 12 bloques.
* El arbol remoto publicado corresponde a `0.2.0`; la carpeta local contiene cambios funcionales `0.2.1` aun no publicados en `README.md`, `app.js`, `config.js`, `data/survey-schema.json`, `gas/Config.gs`, `gas/Utils.gs`, `index.html`, `service-worker.js` y `styles.css`, ademas de la actualizacion de `BITACORA.md`.
* Archivos locales no publicados: `_fuentes/encestaMID_base.xlsx`, `_fuentes/encuestadigitalizacionMIPYMES.xlsx`, `_fuentes/encuestaMIPYMES.pdf` y `Comentarios_Cuestionario_Mipymnes.docx`.
* `clasp` esta autenticado como `apoyomedicoips@gmail.com`; para este script devuelve `The caller does not have permission` en `deployments` y `versions`.
* Deployment GAS antiguo `AKfycbxYh3Z-6FI0xl1eaOxluFUXqyPPkBtAxqDHTFkf6yANKch26DwQIGrbckZXuJ8qan_nzg` responde JSON anonimo con version interna `0.1.0`.
* Deployment GAS mas reciente documentado `AKfycbwOgnPfHcVQBAeRwpFZ8IHKnP9BbFyyPXT4BRo9PtdtNJEdXa8DJ4V7qMzvnGzaEt8h1Q` devuelve HTTP `403`.
* Validaciones sintacticas locales JavaScript y JSON pasaron.

### Pruebas realizadas

* Verificacion de configuracion GitHub Pages por API.
* Verificacion HTTP publica de la URL, config, service worker y schema con cache-busting.
* Comparacion remoto/local por hash de blobs y posterior contraste con `git diff FETCH_HEAD`.
* Prueba de acceso anonimo a deployments GAS conocidos.
* Validacion sintactica local de frontend y manifiestos.

### Errores o incidentes

* GitHub Pages esta operativo, pero el sistema completo no esta operativo para recepcion centralizada porque el backend GAS activo no esta configurado en la app publicada.
* La metadata Git local esta inconsistente: rama local sin commits, `origin/main` no actualizable por lock y procesos Git vivos al momento de la revision.
* Hay cambios locales `0.2.1` preparados o pendientes que no estan en la URL publica; no deben confundirse con el estado publicado.
* La cuenta `clasp` activa no tiene permiso sobre el Apps Script del proyecto.
* El unico deployment GAS que responde anonimamente es antiguo (`0.1.0`) y no debe asumirse compatible con el frontend publicado `0.2.0` ni con los cambios locales `0.2.1` sin prueba de guardado.

### Soluciones aplicadas

* No se modifico codigo funcional.
* Se documento el estado verificado y se separo Pages publicado de backend operativo.

### Pendientes

* Recuperar la metadata Git local: cerrar procesos Git, verificar que no haya operacion activa, retirar el lock huerfano si corresponde y ejecutar `git fetch origin main --prune`.
* Decidir si los cambios locales `0.2.1` derivados de `Comentarios_Cuestionario_Mipymnes.docx` se publican ahora o se revisan antes de subirlos.
* Reautenticar `clasp` con una cuenta que tenga permiso sobre `scriptId 1LlCl53ftjUPkWHV13GBInR9S-WTSFu83qf8ukXFihzlGIwMgqSrqwCBW`.
* Subir/deployar el backend GAS que se decida publicar, preferentemente local `0.2.1` si se aprueban los ajustes de `Comentarios_Cuestionario_Mipymnes.docx`, con `REQUIRE_LOGIN: false`, y ejecutar `initWorkbook`.
* Verificar anonimamente que `/exec` del deployment actual responda JSON y acepte `saveSurvey`.
* Configurar `gasExecUrl` en `config.js` solo despues de la prueba anonima correcta.
* Commit/push de la configuracion final y nueva verificacion de GitHub Pages con cache-busting.
* Ejecutar prueba punta a punta: abrir URL publica, completar encuesta de prueba, guardar/enviar, confirmar fila en Google Sheets y revisar auditoria/errores.

### Riesgos

* Si se envia la encuesta ahora, las respuestas pueden quedar guardadas solo en el navegador del respondiente.
* Usar el deployment GAS antiguo puede generar incompatibilidad de esquema o guardado incompleto.
* Limpiar el lock Git sin cerrar procesos vivos puede dañar refs locales; hacerlo solo despues de confirmar que no hay operacion Git activa.

### Recomendaciones

* Considerar GitHub Pages como publicado y sano, pero no considerar la app completa como operativa hasta cerrar GAS + prueba de escritura real.
* Mantener `_fuentes/` fuera del repositorio publico salvo decision explicita.
* Antes de campana masiva, hacer una prueba real en navegador limpio o movil y guardar evidencia en bitacora.

## 2026-06-28 13:50

### Proyecto

* Nombre: Encuesta MIPYMES Investigacion 2026
* Cliente o institucion: investigapyrm / FACEN
* Ruta local: `/Users/diegobernardomezabogado/Library/CloudStorage/GoogleDrive-investigapyrm@gmail.com/Mi unidad/encuestaMIPYMES_repo`
* Repositorio: `https://github.com/investigapyrm/encuestaMIPYMES.git`
* URL publica: `https://investigapyrm.github.io/encuestaMIPYMES/`
* Responsable: Codex
* Version generada: `0.2.1` / schema `2026-06-28.1` / cache `20260628-1`

### Objetivo de la intervencion

* Resolver las solicitudes registradas en `Comentarios_Cuestionario_Mipymnes.docx` y ajustar la app web al cuestionario final sin login para respondientes por correo.

### Diagnostico inicial

* El DOCX de comentarios no contiene `comments.xml`; las solicitudes estan escritas como texto en el cuerpo del documento.
* Las observaciones solicitaban mención institucional FACEN / Departamento de Tecnología de Producción, textos orientadores en preguntas 8, 9, 11, 12, 13, 16, 17 y 19, titulo/descripción del bloque de continuidad, y refuerzo de la pregunta 10 condicional.
* La pregunta 10 ya tenia validacion frontend/backend para solicitar cantidad de paises cuando el porcentaje exportado es mayor que 0.
* El backend GAS sigue sin `gasExecUrl` activo en frontend; por tanto no se considera validado el guardado real en Google Sheets.

### Acciones realizadas

* Se extrajo el texto de `Comentarios_Cuestionario_Mipymnes.docx`.
* Se actualizo `data/survey-schema.json` a `2026-06-28.1`.
* Se agrego la propiedad `intro` para mostrar preguntas orientadoras antes de grupos de afirmaciones.
* Se ajusto `app.js` para renderizar `intro` y ocultarlo cuando el campo asociado es condicional y no corresponde.
* Se agrego estilo `.question-intro` en `styles.css`.
* Se incorporo mención visible a FACEN y al Departamento de Tecnología de Producción en `index.html`.
* Se actualizo versionado de assets y service worker a `20260628-1`.
* Se actualizo backend GAS a version `0.2.1` sin cambiar columnas.
* Se actualizaron README, manual de usuario, manual tecnico, diccionario de datos y texto de correo.

### Archivos modificados

* `Comentarios_Cuestionario_Mipymnes.docx`
* `data/survey-schema.json`
* `app.js`
* `styles.css`
* `index.html`
* `config.js`
* `service-worker.js`
* `gas/Config.gs`
* `gas/Utils.gs`
* `README.md`
* `docs/manual_usuario.md`
* `docs/manual_tecnico.md`
* `docs/diccionario_datos.md`
* `docs/texto_correo_invitacion.md`
* `BITACORA.md`

### Comandos o scripts ejecutados

* `python3` con `python-docx` para leer el DOCX de comentarios.
* `python3` para actualizacion estructurada de `survey-schema.json`.
* `node --check app.js`
* `node --check config.js`
* `node --check service-worker.js`
* `python3 -m json.tool data/survey-schema.json`
* `python3 -m json.tool manifest.json`
* `python3 -m json.tool gas/appsscript.json`
* Validacion sintactica GAS copiando temporalmente `gas/*.gs` como `.js`.
* `git diff --check`
* `python3 -m http.server 4173`
* Chrome headless via DevTools Protocol para DOM y capturas.

### Resultados verificados

* La app local abre directamente el formulario sin login.
* La cabecera y pantalla inicial mencionan FACEN y Departamento de Tecnología de Producción.
* Se renderizan los textos orientadores de las preguntas 8, 9, 11, 12, 13, 16 y 17.
* La pregunta 19 muestra la redaccion final solicitada.
* El titulo `CONTINUIDAD / SUPERVIVENCIA DE LA EMPRESA` aparece al iniciar el bloque de continuidad.
* La intro de la pregunta 10.2 queda oculta cuando el porcentaje exportado es 0 o vacio, y aparece al ingresar un valor mayor que 0.
* La version publicada localmente usa assets `20260628-1`.
* Capturas desktop y movil no muestran cortes criticos ni solapamientos del flujo principal.

### Pruebas realizadas

* Validacion JavaScript.
* Validacion JSON.
* Validacion GAS por copia temporal.
* Revision de diferencias sin espacios problematicos.
* Prueba DOM con Chrome/CDP:
  * `appVisible: true`
  * `loginHidden: true`
  * `facen: true`
  * `q10IntroHiddenBefore: true`
  * `q10IntroHiddenAfterPctFive: false`
* Capturas:
  * `/tmp/encuesta_mipymes_20260628_desktop.png`
  * `/tmp/encuesta_mipymes_20260628_mobile.png`

### Errores o incidentes

* `Comentarios_Cuestionario_Mipymnes.docx` no trae comentarios estructurados de Word; se resolvio extrayendo parrafos del cuerpo.
* `chrome --dump-dom` quedo colgado por procesos auxiliares de Chrome; se reemplazo por prueba controlada con DevTools Protocol.
* El backend GAS no fue desplegado ni activado en esta intervencion; `gasExecUrl` permanece vacio.

### Soluciones aplicadas

* Se agrego un mecanismo reutilizable de textos orientadores (`intro`) sin alterar los codigos de variables.
* Se mantuvo el flujo sin login solicitado para respuestas por correo.
* Se mantuvo separada la validacion frontend/Pages de la validacion backend/GAS.

### Pendientes

* Commit y push de los ajustes `0.2.1`.
* Verificar propagacion en GitHub Pages con cache-busting.
* Reautenticar `clasp` con cuenta con permiso sobre el proyecto Apps Script.
* Publicar backend GAS actual, activar `/exec` publico y configurar `gasExecUrl` solo despues de verificar JSON anonimo.
* Probar guardado real en Google Sheets antes de enviar la encuesta masivamente.

### Riesgos

* Sin backend GAS operativo, las respuestas quedan pendientes localmente en el navegador del respondiente.
* La identidad sin login depende de empresa, correo y RUC informados por el respondiente.
* Si el navegador conserva cache previa, el usuario debe usar el boton `Actualizar` o abrir con cache-busting hasta que el service worker nuevo se instale.

### Recomendaciones

* Incorporar al manual maestro el patron `intro` para encuestas donde una pregunta orientadora debe preceder una matriz de afirmaciones sin crear una variable nueva.
* No enviar campana masiva hasta verificar una respuesta real guardada en Sheets.
* Mantener la administracion separada del enlace publico enviado por correo.

## 2026-06-28 13:54

### Proyecto

* Nombre: Encuesta MIPYMES Investigacion 2026
* Cliente o institucion: investigapyrm / FACEN
* Ruta local: `/Users/diegobernardomezabogado/Library/CloudStorage/GoogleDrive-investigapyrm@gmail.com/Mi unidad/encuestaMIPYMES_repo`
* Repositorio: `https://github.com/investigapyrm/encuestaMIPYMES.git`
* URL publica: `https://investigapyrm.github.io/encuestaMIPYMES/`
* Responsable: Codex
* Version publicada: `0.2.1` / cache `20260628-1`

### Objetivo de la intervencion

* Cerrar publicacion en GitHub Pages y verificar la version `0.2.1` posterior a los ajustes del DOCX de comentarios.

### Acciones realizadas

* Commit local de los ajustes finales.
* Push a `origin/main`.
* Verificacion de GitHub Pages con cache-busting.
* Verificacion DOM publica con Chrome headless via DevTools Protocol.

### Archivos modificados

* `BITACORA.md`

### Comandos o scripts ejecutados

* `git add ...`
* `git commit -m "Apply final questionnaire comment adjustments"`
* `git push origin main`
* `git ls-remote origin refs/heads/main`
* Verificacion HTTP publica de `index.html`, `config.js`, `service-worker.js` y `data/survey-schema.json`.
* Chrome/CDP contra `https://investigapyrm.github.io/encuestaMIPYMES/?v=20260628-public`.

### Resultados verificados

* Commit publicado: `e851302` (`Apply final questionnaire comment adjustments`).
* `origin/main` apunta a `e851302387d25eb7afd8eb9da2f140aba94adbdd`.
* GitHub Pages sirve assets `20260628-1`.
* `config.js` publico informa `appVersion: "0.2.1"`, `requireLogin: false` y schema `data/survey-schema.json?v=20260628-1`.
* `service-worker.js` publico usa cache `encuesta-mipymes-v20260628-1`.
* `survey-schema.json` publico informa `schema_version: "2026-06-28.1"` y `comments_document: "Comentarios_Cuestionario_Mipymnes.docx"`.
* DOM publico verificado:
  * `appVisible: true`
  * `loginHidden: true`
  * `version: 0.2.1`
  * `facen: true`
  * `q8Intro: true`
  * `q14Title: true`
  * `q19Text: true`
  * `q10IntroHiddenBefore: true`
  * `q10IntroHiddenAfterPctFive: false`

### Pruebas realizadas

* Verificacion de commit remoto.
* Verificacion HTTP publica con cache-busting.
* Verificacion DOM publica con navegador headless.

### Errores o incidentes

* GitHub Pages sirvio la version anterior en los dos primeros intentos; en el tercer intento ya sirvio `0.2.1`.
* El backend GAS sigue pendiente; no se probo escritura real en Google Sheets.

### Pendientes

* Publicar y validar Apps Script `/exec`.
* Configurar `gasExecUrl` solo despues de confirmar JSON anonimo y escritura real.
* Ejecutar prueba punta a punta con registro de prueba en Google Sheets antes de envio masivo.

### Riesgos

* La app visible esta publicada, pero el sistema completo aun no esta operativo para recepcion centralizada si `gasExecUrl` sigue vacio.

### Recomendaciones

* Compartir el enlace publico solo para revision del formulario hasta cerrar backend.
* Para campana masiva, exigir evidencia de fila en Google Sheets y auditoria sin login.

## 2026-06-28 21:37

### Proyecto

* Nombre: Encuesta MIPYMES Investigacion 2026
* Cliente o institucion: investigapyrm / FACEN
* Ruta local: `/Users/diegobernardomezabogado/Library/CloudStorage/GoogleDrive-investigapyrm@gmail.com/Mi unidad/encuestaMIPYMES_repo`
* Repositorio: `https://github.com/investigapyrm/encuestaMIPYMES.git`
* URL publica frontend: `https://investigapyrm.github.io/encuestaMIPYMES/`
* URL backend indicada: `https://script.google.com/macros/s/AKfycbwOgnPfHcVQBAeRwpFZ8IHKnP9BbFyyPXT4BRo9PtdtNJEdXa8DJ4V7qMzvnGzaEt8h1Q/exec`
* Responsable: Codex
* Version frontend publicada: `0.2.1` / cache `20260628-1`
* Version backend subida: `0.2.2` / Apps Script version `10`

### Objetivo de la intervencion

* Verificar la implementacion Apps Script indicada por el usuario, activar backend sin login si el `/exec` respondia JSON publico y conectar `gasExecUrl` solo con evidencia de escritura real.

### Diagnostico inicial

* La URL indicada respondia inicialmente como backend antiguo `0.1.7`.
* `GET /exec` devolvia JSON publico, pero con `app: FAEDPYME 2026 - Encuesta MIPYMES` y `version: 0.1.7`.
* `POST getBootstrap` devolvia `{"success":false,"message":"Sesión inválida o vencida."}`.
* `POST saveSurvey` con registro tecnico devolvia la misma falla de sesion.
* El clon remoto del Apps Script confirmo que el backend remoto aun usaba `nif`, no tenia `REQUIRE_LOGIN: false`, exigia `requireSession()` y no tenia campos `q18_causa_principal` ni `q18_causa_otra`.

### Acciones realizadas

* Se clono el Apps Script remoto en `/tmp/encuesta_mipymes_clasp_remote` para comparar sin pisar el repo.
* Se verifico que `clasp` esta autenticado como `monitorimpactosocial@gmail.com` y tiene acceso al proyecto.
* Se subio el backend local con `clasp push -f`.
* Se creo Apps Script version `10` con descripcion `Encuesta MIPYMES 0.2.2 backend publico sin login`.
* Se redeployo el deployment indicado por el usuario a `@10`.
* Se creo un deployment alternativo `AKfycbxGPhOWfpDJUaJ9k2XuJXuM4DAT911QJSaF6AHcAwlDrYCl0TQC0wzgFis72fxFUcUsdw @10`.
* Se mantuvo `config.js` con `gasExecUrl: ''` porque las pruebas anonimas devolvieron `403`.
* Se actualizaron `README.md` y `docs/manual_tecnico.md` para documentar el estado real.

### Archivos modificados

* `gas/Config.gs`
* `gas/Utils.gs`
* `README.md`
* `docs/manual_tecnico.md`
* `BITACORA.md`

### Comandos o scripts ejecutados

* `curl -L` contra `/exec`.
* `curl -L -H 'Content-Type: application/json' --data '{"action":"getBootstrap","payload":{}}'`.
* `python3` para `POST saveSurvey` tecnico `TEST-BACKEND-20260629-002`.
* `clasp show-authorized-user`
* `clasp deployments`
* `clasp versions`
* `clasp clone 1LlCl53ftjUPkWHV13GBInR9S-WTSFu83qf8ukXFihzlGIwMgqSrqwCBW`
* `clasp push -f`
* `clasp version "Encuesta MIPYMES 0.2.2 backend publico sin login"`
* `clasp deploy -i AKfycbwOgnPfHcVQBAeRwpFZ8IHKnP9BbFyyPXT4BRo9PtdtNJEdXa8DJ4V7qMzvnGzaEt8h1Q -V 10 -d "Encuesta MIPYMES 0.2.2 backend publico sin login"`
* `clasp deploy -V 10 -d "Encuesta MIPYMES 0.2.2 backend publico sin login - deployment alternativo"`
* `node --check app.js config.js service-worker.js`
* `python3 -m json.tool data/survey-schema.json manifest.json gas/appsscript.json`
* Validacion GAS copiando temporalmente `gas/*.gs` como `.js`.

### Resultados verificados

* Apps Script version `10` creada.
* Deployment indicado por el usuario quedo en `@10`.
* Deployment alternativo version `10` creado.
* El codigo remoto ya fue actualizado desde el backend local `0.2.2`.
* Ambos deployments version `10` devuelven `HTTP 403` con HTML `Acceso denegado` antes de ejecutar el codigo.
* El deployment `@HEAD` devuelve HTML indicando falta de permiso para acceder al documento solicitado.
* No se configuro `gasExecUrl` en el frontend publicado porque no existe respuesta JSON anonima valida.
* No se verifico escritura real en Google Sheets porque el POST queda bloqueado por permisos del Web App.

### Pruebas realizadas

* GET anonimo a `/exec`.
* POST anonimo `getBootstrap`.
* POST anonimo `saveSurvey` con payload tecnico.
* Comparacion de Apps Script remoto vs backend local.
* Validacion sintactica local JS/JSON/GAS.

### Errores o incidentes

* Antes de subir version 10, el deployment indicado respondia publicamente pero con backend viejo `0.1.7` y login obligatorio.
* Despues del redeploy a version 10, Google Apps Script devolvio `403 Acceso denegado`.
* Segun el manual maestro, `clasp redeploy` puede resetear permisos a `Solo yo`; debe corregirse desde la UI de Apps Script antes de activar `gasExecUrl`.
* `clasp run initWorkbook` devolvio `Script function not found. Please make sure script is deployed as API executable`; no se uso como prueba de produccion.

### Soluciones aplicadas

* Backend local actualizado y subido a Apps Script como version `0.2.2`.
* Frontend mantenido sin `gasExecUrl` para no romper el formulario publico.
* Documentacion actualizada con deployment, version y bloqueo real.

### Pendientes

* En Apps Script, ir a `Deploy > Manage deployments`, editar el deployment `AKfycbwOgnPfHcVQBAeRwpFZ8IHKnP9BbFyyPXT4BRo9PtdtNJEdXa8DJ4V7qMzvnGzaEt8h1Q`, confirmar version `10`, tipo `Web app`, ejecutar como cuenta propietaria/deploying user y acceso `Anyone / Cualquier persona`.
* Autorizar scopes si Apps Script lo solicita.
* Probar anonimamente que `/exec` devuelva JSON `success:true`, `version:"0.2.2"`.
* Probar `saveSurvey` anonimo y confirmar fila en Google Sheets.
* Recién despues configurar `gasExecUrl` en `config.js`, subir GitHub Pages y verificar punta a punta.

### Riesgos

* Si se activa `gasExecUrl` ahora, los respondientes verian errores de envio porque el backend devuelve 403.
* El deployment alternativo creado tambien esta bloqueado; no debe usarse hasta corregir permisos.

### Recomendaciones

* Usar la URL indicada por el usuario solo despues de corregir permisos y verificar JSON anonimo.
* Para evitar resets por `clasp redeploy`, configurar un deployment `@HEAD` con acceso `Cualquier persona` desde la UI y no redeployarlo desde CLI.
