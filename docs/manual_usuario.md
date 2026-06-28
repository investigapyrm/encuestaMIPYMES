# Manual de usuario

## Acceso

La app pública no requiere usuario ni contraseña. Si recibió el enlace por correo:

1. Abra el enlace en su computadora.
2. Complete una respuesta por empresa.
3. Pulse `Guardar y enviar encuesta`.
4. Si aparece un aviso de pendiente, pulse `Enviar pendientes` cuando tenga conexión.

Los íconos `(i)` muestran notas de ayuda. En computadora aparecen al pasar el cursor; en celular o tablet puede tocarlos o enfocarlos.

La encuesta corresponde a la Investigación 2026 sobre factores de continuidad de la Mipyme en Paraguay, realizada por la FACEN desde el Departamento de Tecnología de Producción.

## Cargar encuesta

El enlace abre directamente el cuestionario. No hay pantalla de login para respondientes.

1. Entrar a `Formulario`.
2. Completar los datos de identificación.
3. Avanzar por los bloques del instrumento.
4. En la pregunta 10, si el porcentaje exportado es mayor que 0, completar cantidad de países.
5. En la pregunta 13, indicar primero si realizó la innovación. La importancia se habilita cuando corresponde.
6. En la pregunta 18, si respondió que tuvo experiencia previa de cierre, indicar la causa principal.
7. Guardar y enviar encuesta.

Algunos bloques muestran una pregunta orientadora antes de las afirmaciones. Ese texto ayuda a interpretar la escala, pero no reemplaza la selección de cada ítem obligatorio.

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
- `Enviar pendientes`: envía registros pendientes.
- `Hoja online`: visible solo para `admin`, abre el Google Sheet operativo.

## Seguimiento de respuestas

La pestaña `Seguimiento` solo está disponible para `admin`. Muestra avance local, pendientes, errores, sincronizadas, carga por usuario y últimas respuestas registradas en el dispositivo.

## Administración

La versión pública para correo no usa administración de usuarios. Cualquier tarea administrativa debe hacerse fuera del enlace enviado a los contactos.
