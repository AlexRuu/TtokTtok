import nodemailer from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";

export const SendResetPasswordEmail = async (email: string, token: string) => {
  const resetPasswordURL = `${process.env.CLIENT_URL}/reset-password?token=${token}`;

  const transporter = nodemailer.createTransport({
    host: process.env.NODEMAILER_HOST,
    port: Number(process.env.GMAIL_SERVER_PORT),
    auth: {
      user: process.env.GMAIL_EMAIL,
      pass: process.env.GMAIL_NODEMAILER_PASS,
    },
  } as SMTPTransport.Options);

  const mailOptions = {
    from: process.env.GMAIL_EMAIL,
    to: email,
    subject: "Reset Your Password",
    html: `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <style>
          body {
            background-color: #fdfaf6;
            font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
            margin: 0;
            padding: 0;
            color: #3b3b3b;
          }
          .container {
            max-width: 600px;
            margin: 40px auto;
            background: white;
            border-radius: 16px;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
            padding: 40px;
            border: 1px solid #f8e0e6;
          }
          h1 {
            color: #a1c6ea;
            font-size: 24px;
            margin-bottom: 16px;
            text-align: center;
          }
          p {
            font-size: 16px;
            line-height: 1.6;
            margin-bottom: 24px;
            text-align: center;
          }
          .reset-button {
            display: inline-block;
            padding: 14px 24px;
            background-color: #c7dffc;
            color: #1c2c4c;
            font-weight: bold;
            text-decoration: none;
            border-radius: 10px;
            box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
            transition: background 0.3s ease;
          }
          .verify-button:hover {
            background-color: #b1d1f7;
          }
          .footer {
            margin-top: 40px;
            font-size: 13px;
            color: #888;
            text-align: center;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Reset Password</h1>
          <p>Please reset your password by clicking below:</p>
          <p style="text-align: center;">
            <a class="reset-button" href="${resetPasswordURL}" target="_blank">Reset Password</a>
          </p>
          <p>If you didn’t request this, you can ignore this email.</p>
          <div class="footer">
            &copy; ${new Date().getFullYear()} YourApp. All rights reserved.
          </div>
        </div>
      </body>
    </html>
  `,
  };

  await transporter.sendMail(mailOptions);
};
