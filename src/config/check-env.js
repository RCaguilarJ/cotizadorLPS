const required = [
  "SMTP_HOST",
  "SMTP_PORT",
  "SMTP_USER",
  "SMTP_PASS",
  "ADMIN_EMAIL",
];

const missing = required.filter((k) => !process.env[k]);
if (missing.length > 0) {
  console.error(
    "ERROR: Faltan variables de entorno requeridas:",
    missing.join(", ")
  );
  console.error(
    "Por favor configura estas en .env o en el entorno de despliegue antes de iniciar."
  );
  process.exit(1);
}
console.log("OK: Variables de entorno requeridas presentes.");
process.exit(0);
