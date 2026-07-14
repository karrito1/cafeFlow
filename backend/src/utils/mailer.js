const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  requireTLS: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

async function sendResetEmail(email, token) {
  const baseUrl = process.env.FRONTEND_URL || "http://localhost:5173";
  const resetUrl = `${baseUrl}/reset-password/${token}`;

  console.log(`\n[DEV] Reset token for ${email}: ${token}`);
  console.log(`[DEV] Reset URL: ${resetUrl}\n`);

  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.log("[DEV] SMTP not configured — email not sent (token logged above)");
    return;
  }

  const from = process.env.SMTP_FROM
    ? `"CafeFlow" <${process.env.SMTP_FROM}>`
    : '"CafeFlow" <noreply@cafeflow.com>';

  try {
    await Promise.race([
      transporter.sendMail({
        from,
        to: email,
        subject: "Recuperación de contraseña - CafeFlow",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto;">
            <h2 style="color: #4a3028;">Recupera tu contraseña</h2>
            <p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p>
            <a href="${resetUrl}"
               style="display: inline-block; padding: 12px 24px; background: #4a3028; color: #fff; text-decoration: none; border-radius: 6px;">
              Restablecer contraseña
            </a>
            <p style="margin-top: 20px; color: #666; font-size: 13px;">
              Este enlace expira en 1 hora. Si no solicitaste este cambio, ignora este mensaje.
            </p>
          </div>
        `,
      }),
      new Promise((_, reject) => setTimeout(() => reject(new Error("SMTP timeout")), 10000)),
    ]);
  } catch (err) {
    console.error("[MAILER] Error enviando correo:", err.message);
  }
}

module.exports = { sendResetEmail };
