# Encuesta MIPYMES - Investigación 2026

App web institucional para captura de la encuesta **Investigación 2026: Factores de continuidad (supervivencia) de la Mipyme en Paraguay**.

## Arquitectura

- Frontend: HTML, CSS y JavaScript estático para GitHub Pages.
- Backend: Google Apps Script en `gas/`.
- Base operativa: Google Sheets asociado a `encuestaMIPYMES.gsheet`.
- Captura offline: localStorage con cola de sincronización.
- Instrumento maestro final: `FACEN _Cuestionario 2026 Factores de continuidad de las mipymes.docx`.

## Estado actual

El formulario reproduce las 19 preguntas del DOCX final, organizadas en bloques:

- Identificación.
- Bloque General Anual.
- Gobierno Corporativo.
- Innovación y rendimiento.
- Entorno empresarial.
- Rendimiento frente a competidores.
- Innovaciones realizadas 2024-2025.
- Bloque Temático: Continuidad.
- Cierre y comentarios finales.

## Configuración

1. El proyecto GAS real está vinculado en `.clasp.json`:

```text
scriptId: 1LlCl53ftjUPkWHV13GBInR9S-WTSFu83qf8ukXFihzlGIwMgqSrqwCBW
rootDir: gas
```

2. Configurar el endpoint publicado de Apps Script en `config.js` solo cuando el web app responda públicamente:

```js
gasExecUrl: 'https://script.google.com/macros/s/DEPLOYMENT_ID/exec'
```

Deployment creado durante la intervención:

```text
https://script.google.com/macros/s/AKfycbxYh3Z-6FI0xl1eaOxluFUXqyPPkBtAxqDHTFkf6yANKch26DwQIGrbckZXuJ8qan_nzg/exec
```

Estado: creado, pero pendiente de habilitación pública. La prueba anónima devolvió página de acceso denegado.

3. Autenticar `clasp` con una cuenta editora del proyecto:

```bash
clasp login
```

4. Subir el backend:

```bash
clasp push -f
```

5. Crear una versión y deployment:

```bash
clasp version "Encuesta MIPYMES Investigacion 2026 backend"
clasp deploy -V VERSION -d "Encuesta MIPYMES Investigacion 2026 - web app publico"
```

6. En Apps Script, ejecutar `initWorkbook` una vez para crear hojas operativas.

## Compatibilidad con proyecto base

El backend guarda en:

- `RESPUESTAS`: tabla operativa normalizada con metadatos, auditoría y JSON completo.
- `Respuestas_Ancho`: formato ancho compatible con el GAS original.
- `Respuestas_Largo`: formato largo compatible con el GAS original.

El respaldo del Apps Script original clonado está en `gas_original/` para auditoría. Ese proyecto original apuntaba a la planilla `14yHdE3nZUBTXgY2I6UKFMmJ4KIj9gDinGVmt6e764ew`; el backend actual apunta a `1lfasg9YkGM_4jAuP6LDoZd-0aFxePBUksZB_1lJDKtQ`.

## Acceso público por correo

La versión `0.2.0` elimina el login para respondientes. El enlace público abre directamente el formulario para que los contactos lo completen desde sus computadoras.

El login local y la administración de usuarios ya no forman parte del flujo público. Si en el futuro se requiere un módulo administrativo, debe separarse del enlace enviado a respondientes.

## Control por rol

- Respondientes externos: acceden directamente al `Formulario`.
- No se solicita usuario ni contraseña al contacto que recibe el correo.
- La trazabilidad se conserva con fecha, navegador/dispositivo, empresa, correo electrónico/RUC si fueron informados y estado de sincronización.

## Seguimiento admin

La pestaña `Seguimiento` es exclusiva para `admin` y muestra:

- Total local, pendientes, errores y sincronizadas.
- Carga por usuario.
- Últimas respuestas guardadas en el dispositivo.

## Acciones operativas globales

La app incluye botones persistentes para:

- Instalar la app como PWA.
- Actualizar caché y recargar versión.
- Enviar pendientes.
- Abrir la hoja online del registro, visible solo para `admin`.

## Experiencia móvil

El formulario está optimizado para carga en campo: escalas Likert 1-5 horizontales, opciones cortas compactas, selección con contraste fuerte, autoavance al siguiente campo, bloques con acentos de color y acciones de guardado fijas en la parte inferior.

## Envío por correo

Para distribución por correo, usar el texto base en `docs/texto_correo_invitacion.md`. El flujo esperado es:

- Abrir el enlace.
- Completar el cuestionario.
- Pulsar `Guardar y enviar encuesta`.
- Los íconos `(i)` muestran ayuda contextual al pasar el cursor o tocar/enfocar el elemento.

## Validación mínima

- Abrir localmente por servidor HTTP, no con `file://`.
- Completar una encuesta.
- Confirmar que queda en registros locales.
- Confirmar cola pendiente si `gasExecUrl` está vacío.
- Probar `/exec` cuando Apps Script esté publicado.
- Probar guardado real contra Google Sheets sin login de respondiente.

## Publicación

El repositorio objetivo es:

```text
https://github.com/investigapyrm/encuestaMIPYMES.git
```

Para GitHub Pages, publicar desde la rama principal y verificar la URL pública real antes del cierre operativo.
