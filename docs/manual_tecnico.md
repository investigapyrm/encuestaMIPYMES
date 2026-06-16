# Manual técnico

## Componentes

- `index.html`: estructura principal de la app.
- `styles.css`: estilos institucionales.
- `app.js`: renderizado del formulario, login, cola local, registros, indicadores, permisos por rol y seguimiento admin.
- `config.js`: versión, ID de planilla y URL del backend.
- `data/survey-schema.json`: esquema del instrumento derivado del PDF.
- `gas/`: backend Apps Script.
- `gas_original/`: respaldo del Apps Script existente antes de la adaptación FAEDPYME 2026.

## Backend GAS

Funciones públicas:

- `doGet`: healthcheck.
- `doPost`: enrutador JSON.
- `login`: validación de usuarios.
- `createUser`: creación o actualización controlada de usuarios por rol `admin`.
- `changePassword`: cambio de contraseña del usuario conectado.
- `getBootstrap`: contexto operativo.
- `saveSurvey`: validación y guardado.
- `saveResponse`: compatibilidad con el contrato histórico `header`/`wide`/`long`.
- `listRecent`: lectura de registros recientes.
- `getDashboard`: resumen operativo.
- `initWorkbook`: inicialización de hojas.

Hojas esperadas:

- `RESPUESTAS`
- `Respuestas_Ancho`
- `Respuestas_Largo`
- `USUARIOS`
- `AUDITORIA`
- `ERRORES`
- `VERSIONES`

`RESPUESTAS` contiene la fila operativa con metadatos y `raw_json`. `Respuestas_Ancho` y `Respuestas_Largo` conservan el patrón del proyecto base para análisis tabular y trazabilidad por pregunta.

## Seguridad

El modo demo local no reemplaza el login real. Para producción:

- Definir `gasExecUrl`.
- Ejecutar `initWorkbook`.
- Verificar usuarios iniciales `admin` y `diego.meza`, ambos con contraseña institucional por defecto `123456`.
- Configurar `MIPYMES_PASSWORD_SALT` en Script Properties.
- Verificar permisos del deployment.

## Limitación actual

El proyecto GAS asociado fue clonado y respaldado. El backend adaptado fue subido con `clasp push -f` al `scriptId` `1LlCl53ftjUPkWHV13GBInR9S-WTSFu83qf8ukXFihzlGIwMgqSrqwCBW`.

Deployments creados:

- `AKfycbzR2BL7Z0JfqAxbkLCO-AK9FucNl7ab-dLtoZgie2qk8VhsqBlFVvQc6_KHtJ0xiLKxFA` versión 1.
- `AKfycbxYh3Z-6FI0xl1eaOxluFUXqyPPkBtAxqDHTFkf6yANKch26DwQIGrbckZXuJ8qan_nzg` versión 2.

La prueba anónima de `/exec` devolvió acceso denegado. Falta habilitar el web app con acceso público desde Apps Script o desde una cuenta con control completo de despliegue. Hasta entonces `config.js` conserva `gasExecUrl` vacío para no romper la app publicada.

## Manejo de login colgado

`app.js` aplica timeout de 12 segundos a llamadas `fetch` contra Apps Script. Si GAS devuelve HTML de Google, acceso denegado o no responde, el usuario recibe un mensaje claro y el botón de ingreso se rehabilita.

## Acciones globales obligatorias

La barra superior incluye controles operativos persistentes:

- `Instalar`: usa `beforeinstallprompt` si está disponible y muestra orientación si el navegador no expone el evento.
- `Actualizar`: actualiza service workers, elimina cachés `encuesta-mipymes-*` y recarga.
- `Sincronizar`: ejecuta la misma cola de pendientes que la pestaña `Sincronización`.
- `Hoja online`: visible solo para usuarios `admin`, abre `spreadsheetUrl`.

El autorregistro público queda limitado a roles `encuestador` y `censista`. Roles `supervisor` y `admin` solo deben asignarse desde sesión administradora.

## Permisos por rol en frontend

`app.js` centraliza permisos con `isAdmin`, `canAccessView`, `defaultViewForRole` y `applyRoleAccess`.

- `encuestador` y `censista`: solo pueden abrir `Formulario`.
- Usuarios auto registrados desde correo quedan como `encuestador` por defecto.
- `validateUsername` acepta correo electrónico o formato `nombre.apellido`.
- `admin`: puede abrir todos los módulos y la hoja online.
- Cualquier intento de cambiar a una vista no permitida se redirige a `Formulario`.

La pestaña `Seguimiento` es exclusiva para `admin` y se alimenta de `state.records` local. Presenta totales, pendientes, errores, sincronizadas, carga por usuario y últimas respuestas del dispositivo.

## Ayuda contextual

La interfaz usa ayudas `(i)` en login, autorregistro, bloques de formulario, preguntas y botones de guardado. En escritorio se muestran con hover; en móvil con foco/toque cuando el elemento es enfocable.

Para preguntas del esquema, `fieldHelpText` genera la ayuda según `hint`, tipo de campo, obligatoriedad y unidad. No debe reemplazar validaciones: solo reduce errores de interpretación.

## Formulario móvil

El formulario usa controles compactos para reducir fatiga de carga:

- Likert 1-5 horizontal, sin apilar en una columna.
- Sí/No como control binario compacto.
- Opciones cortas en segmentos compactos.
- Opciones largas en una columna legible.
- Autoavance suave al siguiente campo visible tras seleccionar radio/Likert.
- Barra inferior fija con acciones de guardado en móvil.
- Acentos de color por bloque para mejorar orientación visual en encuestas largas.
