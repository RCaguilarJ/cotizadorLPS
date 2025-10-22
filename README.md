# Cotizador LPS — Preparación rápida para el Project Manager

Objetivo: dejar el repo listo para que el project manager sólo agregue las credenciales SMTP y el correo del administrador (`ADMIN_EMAIL`) y luego haga git push / despliegue.

Archivos principales
- `server.js` — servicio Express que expone POST `/send-email` y reenvía PDFs por SMTP.
- `js/script.js` — frontend que genera 2 PDFs (detalle + resumen) y hace POST al endpoint.
- `.env.example` — plantilla de variables de entorno que debe rellenar.

Checklist mínimo para el PM
1. Crear un archivo `.env` en la raíz del proyecto basado en `.env.example` y completar:
   - SMTP_HOST
   - SMTP_PORT
   - SMTP_USER
   - SMTP_PASS
   - ADMIN_EMAIL
   (opcional) FROM_ADDRESS, CORS_ORIGINS, ENABLE_RATE_LIMIT

2. (Local) Probar el servicio antes de push/deploy:
```powershell
# instalar dependencias
npm install

# validar que las variables están presentes
npm run check-env

# arrancar en desarrollo
npm run dev

# health check
Invoke-WebRequest -Uri http://localhost:3000/
```

3. (Opcional) Comprobar envío con un POST de ejemplo (PowerShell):
```powershell
$body = @{ to='usuario@ejemplo.com'; subject='Prueba cotización'; message='Prueba'; attachments = @(@{ filename='prueba.pdf'; content_base64='JVBERi0xLjQKJ...'; contentType='application/pdf'}) } | ConvertTo-Json -Depth 4
Invoke-RestMethod -Uri http://localhost:3000/send-email -Method Post -Body $body -ContentType 'application/json'
```

Despliegue en staging/producción
- Use su plataforma preferida (Render, Railway, Heroku u otra). Configure las mismas variables de entorno en la plataforma (no subir .env al repo).
- El servicio escucha en `process.env.PORT` (por defecto 3000).

Notas de seguridad y producción
- No subir credenciales al repositorio.
- Para producción recomiende usar un proveedor de correo transaccional (SendGrid, Mailgun, Amazon SES, etc.) y configure SPF/DKIM.
- `server.js` incluye un fallback simple para CORS y rate-limiting; para carga real, usar middleware oficial o delegar a infraestructura.

Si quiere, preparo el PR con estos cambios y un pequeño mensaje listo para el commit.
# Cotizador LPS - Email service

Este repositorio contiene el frontend (estático) y un pequeño servicio Node.js que acepta PDFs en base64 y los envía por correo tanto al usuario como al admin/propietario.

Contenido relevante:

- `server.js` - servidor Express que expone POST `/send-email` y hace el envío mediante `nodemailer`.
- `package.json` - dependencias y scripts (`npm start`, `npm run dev`).
- `.env.example` - variables de entorno necesarias para SMTP y admin.

Requisitos previos

- Node.js 16+ instalado.
- Credenciales SMTP válidas (por ejemplo un usuario de un proveedor que permita envío desde aplicaciones).

Instalación y ejecución (PowerShell - Windows)

1. Copia el archivo de ejemplo a `.env` y abrelo para editar:

```powershell
# Cotizador LPS — Instrucciones rápidas

Esto contiene la UI (estática) y un microservicio Node.js que recibe PDFs (base64) y los envía por correo al usuario y al administrador.

Lo que hago aquí (breve):
- `server.js` expone POST `/send-email` y usa `nodemailer` para enviar correos.
- `js/script.js` genera 2 PDFs (detalle + resumen) y hace POST al endpoint.

Cómo probar rápido (local)
1) Copio `.env.example` a `.env` y completo las credenciales SMTP y `ADMIN_EMAIL`.
2) Instalo dependencias y arranco:
```powershell
npm install
npm start
```
3) Health-check:
```powershell
Invoke-WebRequest -Uri http://localhost:3000/
```
4) Test POST (PowerShell):
```powershell
$body = @{ to='usuario@ejemplo.com'; subject='Prueba'; message='Prueba'; attachments = @(@{ filename='prueba.pdf'; content_base64='JVBERi0xLjQKJ...'; contentType='application/pdf'}) } | ConvertTo-Json -Depth 4
Invoke-RestMethod -Uri http://localhost:3000/send-email -Method Post -Body $body -ContentType 'application/json'
```

Notas de despliegue
- No subas credenciales al repo. Uso `.env` local y variables en la platforma de hosting.
- En producción recomiendo HTTPS, registros SPF/DKIM y un proveedor de correo transaccional.
- `server.js` incluye un fallback para CORS y rate-limiting sin depender de librerías externas; útil para staging. Para producción a escala, instala `express-rate-limit` o delega a la infraestructura.

Si quieres, adapto el `SERVERLESS_ENDPOINT` en el cliente a la URL pública cuando me la indiques.
  to = 'usuario@ejemplo.com'

  subject = 'Prueba cotización'
