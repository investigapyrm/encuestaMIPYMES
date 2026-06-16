# Diccionario de datos

Fuente del instrumento: `encuestaMIPYMES.pdf`.

## Metadatos

| Campo | Descripción |
| --- | --- |
| `submissionId` | Identificador de envío. |
| `createdAt` | Fecha/hora de captura local. |
| `syncedAt` | Fecha/hora de confirmación del backend. |
| `source` | Origen del registro. |
| `user` | Usuario que sincronizó. |
| `status` | Estado operativo. |
| `raw_json` | Copia completa del registro. |

## Estructuras de salida

| Hoja | Uso |
| --- | --- |
| `RESPUESTAS` | Registro operativo con metadatos, usuario, estado y JSON completo. |
| `Respuestas_Ancho` | Una fila por encuesta, compatible con el Apps Script original. |
| `Respuestas_Largo` | Una fila por pregunta y encuesta: `SubmissionID`, `Timestamp`, `Bloque`, `Codigo`, `Pregunta`, `Valor`. |

## Instrumento

El esquema completo está en `data/survey-schema.json`. Las escalas usadas son:

| Escala | Codificación |
| --- | --- |
| Sí/No | Sí = `1`, No = `0`. |
| Sector | Industria = `1`, Construcción = `2`, Comercio = `3`, Servicios = `4`. |
| Tamaño | 6 a 9 = `1`, 10 a 49 = `2`, 50 a 249 = `3`. |
| Evolución último año | Ha disminuido = `1`, Sigue igual = `2`, Ha aumentado = `3`. |
| Expectativa año actual | Disminuirá = `1`, Seguirá igual = `2`, Aumentará = `3`. |
| Likert 1-5 | `1` valor bajo/nada, `5` valor alto/mucho. |
