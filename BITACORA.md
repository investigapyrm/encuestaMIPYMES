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
