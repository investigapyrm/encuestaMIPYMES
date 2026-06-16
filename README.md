# Encuesta MIPYMES - FAEDPYME 2026

App web institucional para captura de la encuesta **FAEDPYME 2026: Factores de continuidad de la Mipyme**.

## Arquitectura

- Frontend: HTML, CSS y JavaScript estático para GitHub Pages.
- Backend: Google Apps Script en `gas/`.
- Base operativa: Google Sheets asociado a `encuestaMIPYMES.gsheet`.
- Captura offline: localStorage con cola de sincronización.
- Instrumento maestro: `encuestaMIPYMES.pdf`.

## Estado actual

El formulario reproduce las 19 preguntas del PDF maestro, organizadas en bloques:

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
clasp version "Encuesta MIPYMES FAEDPYME 2026 backend"
clasp deploy -V VERSION -d "Encuesta MIPYMES FAEDPYME 2026 - web app publico"
```

6. En Apps Script, ejecutar `initWorkbook` una vez para crear hojas operativas.

## Compatibilidad con proyecto base

El backend guarda en:

- `RESPUESTAS`: tabla operativa normalizada con metadatos, auditoría y JSON completo.
- `Respuestas_Ancho`: formato ancho compatible con el GAS original.
- `Respuestas_Largo`: formato largo compatible con el GAS original.

El respaldo del Apps Script original clonado está en `gas_original/` para auditoría. Ese proyecto original apuntaba a la planilla `14yHdE3nZUBTXgY2I6UKFMmJ4KIj9gDinGVmt6e764ew`; el backend actual apunta a `1lfasg9YkGM_4jAuP6LDoZd-0aFxePBUksZB_1lJDKtQ`.

## Usuario inicial del backend

`initWorkbook` crea un usuario inicial:

- usuario: `admin`
- usuario: `diego.meza`
- contraseña por defecto para ambos: `123456`

Estas credenciales también funcionan en modo local cuando el backend GAS todavía no está configurado. No registrar credenciales nuevas, tokens ni contraseñas personales en la bitácora.

## Administración de usuarios

La vista `Administración` permite:

- Registrar nuevos usuarios con formato `nombre.apellido`.
- Registrar usuarios de campo como `encuestador` o `censista`.
- Asignar roles superiores `supervisor` o `admin` solo desde una sesión administradora.
- Cambiar la contraseña del usuario conectado.
- Operar en modo local si el backend GAS aún no está público.

El frontend corta cualquier intento de login contra GAS después de 12 segundos y muestra un mensaje claro. Si el backend no está configurado, el acceso se valida contra usuarios locales.

## Acciones operativas globales

La app incluye botones persistentes para:

- Instalar la app como PWA.
- Actualizar caché y recargar versión.
- Sincronizar pendientes.
- Abrir la hoja online del registro, visible solo para `admin`.

## Experiencia móvil

El formulario está optimizado para carga en campo: escalas Likert 1-5 horizontales, opciones cortas compactas, selección con contraste fuerte, autoavance al siguiente campo y acciones de guardado fijas en la parte inferior.

## Validación mínima

- Abrir localmente por servidor HTTP, no con `file://`.
- Iniciar sesión en modo demo local si no hay backend.
- Completar una encuesta.
- Confirmar que queda en registros locales.
- Confirmar cola pendiente si `gasExecUrl` está vacío.
- Probar `/exec` cuando Apps Script esté publicado.
- Probar login real y guardado contra Google Sheets.

## Publicación

El repositorio objetivo es:

```text
https://github.com/investigapyrm/encuestaMIPYMES.git
```

Para GitHub Pages, publicar desde la rama principal y verificar la URL pública real antes del cierre operativo.
