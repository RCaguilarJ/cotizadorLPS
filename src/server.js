const express = require("express");
const path = require("path");
const app = express();
const port = process.env.PORT || 3000;
const nodemailer = require("nodemailer");

// Analizador de body con límite aumentado para adjuntos (configurable)
app.use(express.json({ limit: process.env.BODY_LIMIT || "25mb" }));

// Mensaje informativo al inicio (no detiene la ejecución). Se recomienda ejecutar `npm run check-env` antes de iniciar.
if (!process.env.SMTP_HOST || !process.env.ADMIN_EMAIL) {
  console.warn(
    "Aviso: SMTP_HOST o ADMIN_EMAIL no configurados en el entorno. Antes de desplegar, asegúrate de añadir SMTP_* y ADMIN_EMAIL. Ejecuta 'npm run check-env' para validar.'"
  );
}

// ----------------------------
// CORS restringido y limitador de peticiones (intenta usar librerías externas; si no, usa implementaciones internas)
// Configurar vía variables de entorno:
// - CORS_ORIGINS (lista separada por comas de orígenes permitidos). Si está vacío, CORS no se habilita.
// - ENABLE_RATE_LIMIT=1 para activar el limitador de peticiones
// - RATE_LIMIT_WINDOW_MS (milisegundos), por defecto 15 minutos
// - RATE_LIMIT_MAX (peticiones por ventana), por defecto 100
const allowedOrigins = (process.env.CORS_ORIGINS || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);
const enableRateLimit = String(process.env.ENABLE_RATE_LIMIT || "0") === "1";
const rateWindowMs = parseInt(
  process.env.RATE_LIMIT_WINDOW_MS || String(15 * 60 * 1000),
  10
);
const rateMax = parseInt(process.env.RATE_LIMIT_MAX || "100", 10);

let usingExternalCors = false;
let usingExternalRateLimit = false;
try {
  const cors = require("cors");
  const rateLimit = require("express-rate-limit");

  if (allowedOrigins.length > 0) {
    app.use(
      cors({
        origin: function (origin, callback) {
          if (!origin) return callback(null, true);
          if (allowedOrigins.indexOf(origin) !== -1)
            return callback(null, true);
          return callback(new Error("Origin not allowed by CORS"), false);
        },
      })
    );
    usingExternalCors = true;
    console.log("CORS enabled (external lib) for origins:", allowedOrigins);
  }

  if (enableRateLimit) {
    app.use(
      rateLimit({
        windowMs: rateWindowMs,
        max: rateMax,
        standardHeaders: true,
        legacyHeaders: false,
        message: "Too many requests from this IP, please try again later.",
      })
    );
    usingExternalRateLimit = true;
    console.log(
      `Rate limiting enabled (external lib): ${rateMax} reqs per ${rateWindowMs}ms`
    );
  }
} catch (e) {
  // Si las librerías externas no están disponibles, usar middlewares internos simples
  console.warn(
    "cors/express-rate-limit not installed — using built-in fallback implementations"
  );

  // Middleware CORS simple (interno)
  if (allowedOrigins.length > 0) {
    app.use((req, res, next) => {
      const origin = req.headers.origin;
      if (!origin) return next(); // solicitudes no provenientes de navegador
      if (allowedOrigins.indexOf(origin) !== -1) {
        res.setHeader("Access-Control-Allow-Origin", origin);
        res.setHeader(
          "Access-Control-Allow-Methods",
          "GET,POST,PUT,DELETE,OPTIONS"
        );
        res.setHeader(
          "Access-Control-Allow-Headers",
          "Content-Type,Authorization"
        );
        res.setHeader("Access-Control-Allow-Credentials", "true");
        if (req.method === "OPTIONS") return res.sendStatus(204);
      }
      return next();
    });
    console.log("CORS enabled (builtin) for origins:", allowedOrigins);
  }

  // Built-in simple in-memory rate limiter
  // Limitador de peticiones simple en memoria
  if (enableRateLimit) {
    const hits = new Map(); // ip -> { count, windowStart }
    app.use((req, res, next) => {
      try {
        const ip = req.ip || req.connection.remoteAddress || "unknown";
        const now = Date.now();
        const state = hits.get(ip) || { count: 0, windowStart: now };
        if (now - state.windowStart > rateWindowMs) {
          state.count = 1;
          state.windowStart = now;
        } else {
          state.count += 1;
        }
        hits.set(ip, state);
        if (state.count > rateMax) {
          res
            .status(429)
            .json({ error: "Demasiadas solicitudes, inténtalo más tarde." });
        } else {
          next();
        }
      } catch (err) {
        next();
      }
    });
    console.log(
      `Rate limiting enabled (builtin): ${rateMax} reqs per ${rateWindowMs}ms`
    );
  }
}
// ----------------------------

// Servir archivos estáticos desde /public (un nivel arriba porque server.js está en src/)
app.use(express.static(path.join(__dirname, "..", "public")));

// Health check básico
app.get("/health", (req, res) =>
  res.json({ ok: true, service: "CotizadorLPS email service" })
);

// Root: servir public/index.html si existe
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "index.html"));
});

// POST /send-email
// body: { to: string, cc?: string, subject: string, message: string, attachments: [{ filename, content_base64, contentType }] } (formato esperado)
app.post("/send-email", async (req, res) => {
  const { to, cc, subject, message, attachments } = req.body || {};

  if (!to || !subject)
    return res
      .status(400)
      .json({ error: "Missing required fields: to, subject" });

  // Configurar el transporter desde variables de entorno
  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = parseInt(process.env.SMTP_PORT || "587", 10);
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const fromAddress = process.env.FROM_ADDRESS || smtpUser;
  const adminEmail = process.env.ADMIN_EMAIL;

  if (!smtpHost || !smtpUser || !smtpPass || !adminEmail) {
    return res
      .status(500)
      .json({ error: "SMTP configuration or ADMIN_EMAIL missing on server" });
  }

  try {
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465, // true para 465, false para otros puertos
      auth: { user: smtpUser, pass: smtpPass },
    });

    // Preparar adjuntos: convertir contenido base64 a Buffer
    const mailAttachments = Array.isArray(attachments)
      ? attachments.map((a) => {
          return {
            filename: a.filename || "attachment.pdf",
            content: Buffer.from(a.content_base64, "base64"),
            contentType: a.contentType || "application/pdf",
          };
        })
      : [];

    // Enviar al usuario
    const mailOptionsUser = {
      from: fromAddress,
      to,
      cc: cc,
      subject: subject,
      text: message || "Adjunto encontrará su cotización",
      attachments: mailAttachments,
    };

    // Enviar también al administrador
    const mailOptionsAdmin = {
      from: fromAddress,
      to: adminEmail,
      subject: `[ADMIN] ${subject}`,
      text: `Copia automática de la cotización enviada a ${to}\n\n${
        message || ""
      }`,
      attachments: mailAttachments,
    };

    // Enviar ambos correos en paralelo
    const [resUser, resAdmin] = await Promise.all([
      transporter.sendMail(mailOptionsUser),
      transporter.sendMail(mailOptionsAdmin),
    ]);

    return res.json({
      ok: true,
      user: resUser && resUser.messageId,
      admin: resAdmin && resAdmin.messageId,
    });
  } catch (err) {
    console.error("Error sending email", err);
    return res
      .status(500)
      .json({ error: "Error sending email", details: err.message });
  }
});

app.listen(port, () => console.log(`Email service listening on port ${port}`));
