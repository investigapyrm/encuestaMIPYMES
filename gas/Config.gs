const APP_CONFIG = {
  APP_NAME: 'FAEDPYME 2026 - Encuesta MIPYMES',
  APP_VERSION: '0.1.4',
  TIMEZONE: 'America/Asuncion',
  SPREADSHEET_ID: '1lfasg9YkGM_4jAuP6LDoZd-0aFxePBUksZB_1lJDKtQ',
  SESSION_TTL_SECONDS: 21600,
  SESSION_PREFIX: 'session:',
  PASSWORD_SALT_KEY: 'MIPYMES_PASSWORD_SALT'
};

const SHEETS = {
  RESPUESTAS: 'RESPUESTAS',
  RESPUESTAS_ANCHO: 'Respuestas_Ancho',
  RESPUESTAS_LARGO: 'Respuestas_Largo',
  USUARIOS: 'USUARIOS',
  AUDITORIA: 'AUDITORIA',
  ERRORES: 'ERRORES',
  VERSIONES: 'VERSIONES'
};

const RESPONSE_HEADERS = [
  'submissionId', 'createdAt', 'syncedAt', 'source', 'user', 'status',
  'empresa', 'correo_electronico', 'nif',
  'q01_sector', 'q02_anio_fundacion', 'q03a_tamano_empresa', 'q03b_numero_medio_empleados',
  'q04_empresa_familiar', 'q05a_genero_gerente', 'q05b_edad_gerente',
  'q06_mujeres_equipo_directivo_pct', 'q07_gerente_estudios_universitarios',
  'q08_socios_capital', 'q08_directivos_externos', 'q08_transmision_generacional',
  'q08_venta_empresa', 'q08_cierre_empresa',
  'q09_ventas_2025', 'q09_ventas_2026', 'q09_trabajadores_2025', 'q09_trabajadores_2026',
  'q09_inversiones_2025', 'q09_inversiones_2026', 'q10_exportaciones_pct', 'q10_paises_exportacion',
  'q11_situacion_economica', 'q11_infraestructuras', 'q11_burocracia',
  'q11_estabilidad_politica', 'q11_provision_recursos',
  'q12_calidad_productos', 'q12_eficiencia_procesos', 'q12_satisfaccion_clientes',
  'q12_adaptacion_cambios', 'q12_crecimiento_ventas', 'q12_rentabilidad', 'q12_satisfaccion_empleados',
  'q13_01_realizo', 'q13_01_importancia', 'q13_02_realizo', 'q13_02_importancia',
  'q13_03_realizo', 'q13_03_importancia', 'q13_04_realizo', 'q13_04_importancia',
  'q13_05_realizo', 'q13_05_importancia', 'q13_06_realizo', 'q13_06_importancia',
  'q13_07_realizo', 'q13_07_importancia', 'q13_08_realizo', 'q13_08_importancia',
  'q13_09_realizo', 'q13_09_importancia',
  'q14_ingresos', 'q14_costes', 'q14_liquidez', 'q14_rentabilidad', 'q14_endeudamiento',
  'q15_regulacion_burocracia', 'q15_presion_competitiva', 'q15_cambios_demanda',
  'q15_personal_cualificado', 'q15_inestabilidad_politica', 'q15_exigencias_tecnologicas',
  'q15_inseguridad', 'q15_sostenibilidad',
  'q16_carga_fiscal', 'q16_energia_materias', 'q16_costes_laborales', 'q16_financiacion', 'q16_morosidad',
  'q17_relevo_generacional', 'q17_conflictos_propiedad', 'q17_cansancio_gerencia',
  'q17_baja_respuesta_cambios', 'q17_conocimientos_profesionalizacion',
  'q17_baja_productividad', 'q17_oferta_compra',
  'q18_experiencia_cierre', 'q19_opinion_abandono',
  'raw_json'
];

const LEGACY_LONG_HEADERS = ['SubmissionID', 'Timestamp', 'Bloque', 'Codigo', 'Pregunta', 'Valor'];
const USER_HEADERS = ['usuario', 'password_hash', 'nombre', 'correo', 'rol', 'activo', 'fecha_creacion', 'ultimo_acceso', 'observacion'];
const AUDIT_HEADERS = ['timestamp', 'action', 'user', 'entity', 'entity_id', 'payload_json'];
const ERROR_HEADERS = ['timestamp', 'action', 'user', 'message', 'stack', 'payload_json'];
const VERSION_HEADERS = ['timestamp', 'app_version', 'schema_version', 'notes'];
