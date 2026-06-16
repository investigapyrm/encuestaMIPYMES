# Manual de usuario

## Ingreso

La app requiere usuario y contraseña. Si el backend todavía no está configurado, el modo local permite ingresar con:

- `admin` / `123456`
- `diego.meza` / `123456`

Si recibió la encuesta por correo y es la primera vez que entra:

1. Pulse `Crear acceso`.
2. Use su correo electrónico o un usuario con formato `nombre.apellido`.
3. Escriba su nombre.
4. Cree una contraseña de al menos 6 caracteres.
5. Pulse `Crear acceso para responder`.
6. Vuelva a `Ingresar` con el mismo usuario o correo y su contraseña.

Los íconos `(i)` muestran notas de ayuda. En computadora aparecen al pasar el cursor; en celular o tablet puede tocarlos o enfocarlos.

## Cargar encuesta

Los usuarios `encuestador` y `censista` ingresan directamente al cuestionario. No ven módulos administrativos, registros ni tableros.

1. Entrar a `Formulario`.
2. Completar los datos de identificación.
3. Avanzar por los bloques del instrumento.
4. En la pregunta 10, si el porcentaje exportado es mayor que 0, completar cantidad de países.
5. En la pregunta 13, indicar primero si realizó la innovación. La importancia se habilita cuando corresponde.
6. Guardar encuesta.

En móvil, las escalas de 1 a 5 se muestran como botones horizontales compactos. Al tocar una opción, la app avanza suavemente hacia el siguiente campo visible para acelerar la carga.

Los bloques del cuestionario tienen acentos de color para separar visualmente secciones largas y reducir fatiga de lectura.

No escriba contraseñas, datos bancarios ni información sensible que no sea solicitada por la encuesta.

## Registros

La pestaña `Registros` muestra lo guardado en el dispositivo. Los estados principales son:

- `pendiente`: guardado localmente, todavía no confirmado en Sheets.
- `sincronizado`: confirmado por Apps Script.
- `error`: hubo intento de envío, pero el backend rechazó o no respondió.

## Sincronización

Usar `Enviar pendientes` cuando haya conexión. La app no elimina registros locales hasta recibir confirmación del backend.

También existen botones globales en la barra superior:

- `Instalar`: instala la app como PWA cuando el navegador lo permite.
- `Actualizar`: limpia caché local y recarga la app.
- `Sincronizar`: envía registros pendientes.
- `Hoja online`: visible solo para `admin`, abre el Google Sheet operativo.

## Seguimiento de respuestas

La pestaña `Seguimiento` solo está disponible para `admin`. Muestra avance local, pendientes, errores, sincronizadas, carga por usuario y últimas respuestas registradas en el dispositivo.

## Administración de usuarios

Desde `Administración`, un usuario `admin` puede registrar nuevos usuarios con correo electrónico o formato `nombre.apellido`. La contraseña debe tener al menos 6 caracteres.

También se admite correo electrónico como usuario, especialmente cuando la encuesta se distribuye por correo.

Los usuarios que se registran solos desde la pantalla de ingreso solo pueden ser `encuestador` o `censista`.

La misma pantalla permite cambiar la contraseña del usuario conectado. Si el backend GAS todavía no está configurado, estos cambios quedan en el almacenamiento local del navegador.
