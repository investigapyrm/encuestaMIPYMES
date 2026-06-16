# Manual de usuario

## Ingreso

La app requiere usuario y contraseña. Si el backend todavía no está configurado, el modo local permite ingresar con:

- `admin` / `123456`
- `diego.meza` / `123456`

## Cargar encuesta

1. Entrar a `Formulario`.
2. Completar los datos de identificación.
3. Avanzar por los bloques del instrumento.
4. En la pregunta 10, si el porcentaje exportado es mayor que 0, completar cantidad de países.
5. En la pregunta 13, indicar primero si realizó la innovación. La importancia se habilita cuando corresponde.
6. Guardar encuesta.

## Registros

La pestaña `Registros` muestra lo guardado en el dispositivo. Los estados principales son:

- `pendiente`: guardado localmente, todavía no confirmado en Sheets.
- `sincronizado`: confirmado por Apps Script.
- `error`: hubo intento de envío, pero el backend rechazó o no respondió.

## Sincronización

Usar `Enviar pendientes` cuando haya conexión. La app no elimina registros locales hasta recibir confirmación del backend.

## Administración de usuarios

Desde `Administración`, un usuario `admin` puede registrar nuevos usuarios. El nombre de usuario debe tener formato `nombre.apellido` y la contraseña debe tener al menos 6 caracteres.

La misma pantalla permite cambiar la contraseña del usuario conectado. Si el backend GAS todavía no está configurado, estos cambios quedan en el almacenamiento local del navegador.
