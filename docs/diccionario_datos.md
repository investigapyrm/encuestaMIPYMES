# Diccionario de datos

Fuente del instrumento: `FACEN _Cuestionario 2026 Factores de continuidad de las mipymes.docx`.
Fuente de ajustes finales de redacción: `Comentarios_Cuestionario_Mipymnes.docx`.

## Metadatos

| Campo | Descripción |
| --- | --- |
| `submissionId` | Identificador de envío. |
| `createdAt` | Fecha/hora de captura local. |
| `syncedAt` | Fecha/hora de confirmación del backend. |
| `source` | Origen del registro. |
| `user` | Identificador operativo del respondiente sin login: correo, RUC, empresa o `sin_login`, según disponibilidad. |
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
| Tamaño | Hasta 10 empleados = `1`, 11 a 30 empleados = `2`, 31 o más empleados = `3`. |
| Evolución último año | Ha disminuido = `1`, Sigue igual = `2`, Ha aumentado = `3`. |
| Expectativa año actual | Disminuirá = `1`, Seguirá igual = `2`, Aumentará = `3`. |
| Gobierno corporativo | `1` en ninguna medida, `5` en gran medida. |
| Entorno empresarial | `1` nada, `5` mucho. |
| Rendimiento frente a competidores | `1` peor, `3` igual, `5` mejor. |
| Importancia de innovaciones | `1` muy poca, `5` mucha. |
| Factores de abandono | `1` nada importante, `5` muy importante. |
| Causa principal de cierre | `quiebra`, `abandono`, `salida_estrategica`, `otra`. |

## Textos orientadores

Los textos orientadores incorporados en `data/survey-schema.json` mediante la propiedad `intro` no son variables de respuesta. Se muestran antes de grupos de afirmaciones para mejorar comprensión del informante y mantener las variables originales sin cambios.
