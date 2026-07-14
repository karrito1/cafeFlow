const brevo = require("@getbrevo/brevo");

let apiInstance = null;

function getClient() {
  if (!apiInstance && process.env.BREVO_API_KEY) {
    apiInstance = new brevo.TransactionalEmailsApi();
    apiInstance.setApiKey(brevo.TransactionalEmailsApi.ApiKeys.apiKey, process.env.BREVO_API_KEY);
  }
  return apiInstance;
}

async function sendResetEmail(email, token) {
  const baseUrl = process.env.FRONTEND_URL || "http://localhost:5173";
  const resetUrl = `${baseUrl}/reset-password/${token}`;

  console.log(`\n[DEV] Reset token for ${email}: ${token}`);
  console.log(`[DEV] Reset URL: ${resetUrl}\n`);

  const client = getClient();
  if (!client) {
    console.log("[DEV] BREVO_API_KEY not configured — email not sent (token logged above)");
    return;
  }

  const fromEmail = process.env.BREVO_FROM || "angeldavidagudelocuartas13@gmail.com";
  const fromName = "CafeFlow";

  try {
    const sendSmtpEmail = new brevo.SendSmtpEmail();
    sendSmtpEmail.sender = { email: fromEmail, name: fromName };
    sendSmtpEmail.to = [{ email }];
    sendSmtpEmail.subject = "Recuperación de contraseña - CafeFlow";
    sendSmtpEmail.htmlContent = `
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
    `;

    const data = await client.sendTransacEmail(sendSmtpEmail);
    console.log("[MAILER] Email enviado:", data?.messageId);
  } catch (err) {
    console.error("[MAILER] Error enviando correo:", err.message);
  }
}

module.exports = { sendResetEmail };
