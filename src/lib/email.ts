import nodemailer from "nodemailer";

export interface SendResetEmailOptions {
  to: string;
  resetUrl: string;
  recipientName?: string;
}

export async function sendPasswordResetEmail({
  to,
  resetUrl,
  recipientName = "Dr. Abhishek Rajput",
}: SendResetEmailOptions): Promise<{ success: boolean; mode: "smtp" | "console"; error?: string }> {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const port = parseInt(process.env.SMTP_PORT || "465", 10);
  const secure = process.env.SMTP_SECURE === "true" || port === 465;
  const from = process.env.SMTP_FROM || `"Dr. Abhishek Rajput Academic Portal" <${user || "no-reply@iiti.ac.in"}>`;

  // Check if real SMTP credentials are provided
  const hasSmtp = Boolean(host && user && pass);

  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Password Reset Request</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; background-color: #0f172a; color: #334155; margin: 0; padding: 24px; }
    .card { max-width: 560px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.15); border: 1px solid #e2e8f0; }
    .header { background: linear-gradient(135deg, #064e3b 0%, #047857 100%); padding: 32px 32px; text-align: center; color: #ffffff; }
    .header h1 { margin: 0; font-size: 20px; font-weight: 700; letter-spacing: -0.02em; }
    .header p { margin: 6px 0 0; font-size: 13px; color: #a7f3d0; }
    .body { padding: 32px; font-size: 14px; line-height: 1.6; color: #334155; }
    .greeting { font-weight: 600; font-size: 15px; margin-bottom: 12px; color: #0f172a; }
    .button-container { text-align: center; margin: 28px 0; }
    .button { display: inline-block; background-color: #047857; color: #ffffff !important; text-decoration: none; padding: 13px 32px; border-radius: 8px; font-weight: 700; font-size: 14px; box-shadow: 0 4px 12px rgba(4, 120, 87, 0.25); }
    .button:hover { background-color: #065f46; }
    .meta-box { background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 14px 18px; margin: 20px 0; font-size: 12px; color: #64748b; }
    .url-fallback { word-break: break-all; font-family: monospace; font-size: 12px; color: #047857; }
    .footer { padding: 20px 32px; background-color: #f1f5f9; border-top: 1px solid #e2e8f0; font-size: 12px; color: #64748b; text-align: center; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <h1>Faculty CMS Security Notice</h1>
      <p>Academic Portfolio Administration • IIT Indore</p>
    </div>
    <div class="body">
      <div class="greeting">Hello ${recipientName},</div>
      <p>A request was received to reset the administrator password for your personal academic portfolio website.</p>
      <p>To choose a new password and regain access to the faculty dashboard, click the button below:</p>
      
      <div class="button-container">
        <a href="${resetUrl}" class="button" target="_blank">Reset Administrator Password</a>
      </div>

      <div class="meta-box">
        <strong>Security Notice:</strong>
        <ul style="margin: 6px 0 0; padding-left: 18px;">
          <li>This link is cryptographically signed and valid for <strong>15 minutes only</strong>.</li>
          <li>For security, this link can only be used <strong>once</strong>.</li>
          <li>If you did not make this request, you can safely disregard this email. Your password will remain unchanged.</li>
        </ul>
      </div>

      <p style="font-size: 12px; color: #64748b;">If the button above does not work, copy and paste this URL directly into your browser:</p>
      <p class="url-fallback">${resetUrl}</p>
    </div>
    <div class="footer">
      Department of Civil Engineering • Indian Institute of Technology Indore<br>
      Automated Security Notification • Please do not reply directly to this email.
    </div>
  </div>
</body>
</html>
  `;

  const textContent = `
Faculty CMS Security Notice - Password Reset
Academic Portfolio Administration • IIT Indore

Hello ${recipientName},

A request was received to reset the administrator password for your personal academic portfolio website.

To reset your password, visit the following URL within 15 minutes:
${resetUrl}

This link is valid for 15 minutes and can only be used once. If you did not request this change, please ignore this email.

Department of Civil Engineering • IIT Indore
  `.trim();

  if (hasSmtp) {
    try {
      const isGmail = (host && host.toLowerCase().includes("gmail")) || (user && user.toLowerCase().includes("gmail.com"));
      const transporter = isGmail
        ? nodemailer.createTransport({
            service: "gmail",
            auth: {
              user,
              pass,
            },
            connectionTimeout: 6000,
          })
        : nodemailer.createTransport({
            host,
            port,
            secure,
            auth: {
              user,
              pass,
            },
            connectionTimeout: 6000,
          });

      await transporter.sendMail({
        from,
        to,
        subject: "🔒 Password Reset Request - Faculty Admin CMS",
        text: textContent,
        html: htmlContent,
      });

      console.log(`✉️ Password reset email successfully dispatched to: ${to}`);
      return { success: true, mode: "smtp" };
    } catch (smtpError: any) {
      console.error("❌ SMTP transmission error:", smtpError?.message || smtpError);
      if (smtpError?.message?.includes("535") || smtpError?.message?.includes("BadCredentials")) {
        console.log("💡 TIP FOR GMAIL: Google requires a 16-character App Password (not your regular account password).");
        console.log("👉 Generate one in 30 seconds at: https://myaccount.google.com/apppasswords and update SMTP_PASS in .env");
      }
      // Fallback to console logging if SMTP server fails
      console.log("==================================================");
      console.log("🔒 [SMTP FALLBACK] PASSWORD RESET LINK FOR:", to);
      console.log("👉 Reset Link:", resetUrl);
      console.log("==================================================");
      return { success: true, mode: "console", error: smtpError?.message || "SMTP error" };
    }
  }

  // Development / Demo Mode without configured SMTP credentials
  console.log("==================================================");
  console.log("✉️ [EMAIL SERVICE] PASSWORD RESET LINK GENERATED");
  console.log("Recipient:", to);
  console.log("👉 Secure Reset URL (valid 15m):", resetUrl);
  console.log("==================================================");
  return { success: true, mode: "console" };
}
