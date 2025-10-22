# Cotizador LPS — Preparación rápida para el Project Manager

Objetivo: Dejar el pyecto listo  sólo agregue las credenciales SMTP y el correo del administrador (`ADMIN_EMAIL`) y luego haga git push / despliegue.

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

