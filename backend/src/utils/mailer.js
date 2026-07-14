async function sendResetEmail(email, token) {
  const baseUrl = process.env.FRONTEND_URL || "http://localhost:5173";
  const resetUrl = `${baseUrl}/reset-password/${token}`;

  console.log(`\n[DEV] Reset token for ${email}: ${token}`);
  console.log(`[DEV] Reset URL: ${resetUrl}\n`);

  if (!process.env.BREVO_API_KEY) {
    console.log("[DEV] BREVO_API_KEY not configured — email not sent (token logged above)");
    return;
  }

  const fromEmail = process.env.BREVO_FROM || "angeldavidagudelocuartas13@gmail.com";

  try {
    const res = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "accept": "application/json",
        "content-type": "application/json",
        "api-key": process.env.BREVO_API_KEY,
      },
      body: JSON.stringify({
        sender: { email: fromEmail, name: "CafeFlow" },
        to: [{ email }],
        subject: "Recuperación de contraseña - CafeFlow",
        htmlContent: `
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
    });

    if (!res.ok) {
      const err = await res.json();
      console.error("[MAILER] Brevo error:", res.status, err.message);
    } else {
      const data = await res.json();
      console.log("[MAILER] Email enviado:", data?.messageId);
    }
  } catch (err) {
    console.error("[MAILER] Error enviando correo:", err.message);
  }
}

module.exports = { sendResetEmail };
