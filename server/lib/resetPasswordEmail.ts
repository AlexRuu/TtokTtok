import nodemailer from "nodemailer";
import { google } from "googleapis";
import SMTPTransport from "nodemailer/lib/smtp-transport";
import path from "path";

export const SendResetPasswordEmail = async (email: string, token: string) => {
  try {
    const resetPasswordURL = `${process.env.CLIENT_URL}/reset-password?token=${token}`;

    const oAuth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      "https://developers.google.com/oauthplayground"
    );

    oAuth2Client.setCredentials({
      refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
    });

    const accessToken = await oAuth2Client.getAccessToken();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: process.env.GMAIL_EMAIL,
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
        accessToken: accessToken.token,
      },
    } as SMTPTransport.Options);

    const mailOptions = {
      from: process.env.GMAIL_EMAIL,
      to: email,
      subject: "Reset your password for TtokTtok",
      attachments: [
        {
          filename: "tteok.png",
          path: path.resolve("public/tteok.png"),
          cid: "ttokttoklogo",
        },
      ],
      html: `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap');

        body {
          background-color: #fff9f5;
          font-family: 'Inter', 'Noto Sans KR', sans-serif;
          margin: 0;
          padding: 0;
          color: #3a3a3a;
        }

        .container {
          max-width: 540px;
          margin: 48px auto;
          background-color: #ffffff;
          border-radius: 20px;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05);
          padding: 40px 32px;
          border: 1px solid #f5dfe3;
        }

        .logo {
          text-align: center;
          margin-bottom: 24px;
        }

        .logo img {
          width: 64px;
          height: auto;
          max-height: 64px;
          border-radius: 12px;
        }

        h1 {
          text-align: center;
          color: #b88acf;
          font-size: 22px;
          margin-bottom: 12px;
        }

        p {
          font-size: 16px;
          line-height: 1.6;
          text-align: center;
          margin-bottom: 24px;
        }

        .reset-button {
          display: inline-block;
          padding: 12px 24px;
          background-color: #cbe4ff;
          color: #1d3557;
          text-decoration: none;
          border-radius: 12px;
          font-weight: 600;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.06);
          transition: background-color 0.3s ease;
        }

        .reset-button:hover {
          background-color: #b6d8f9;
        }

        .footer {
          font-size: 12px;
          color: #888;
          margin-top: 32px;
          text-align: center;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="logo">
          <img src="cid:ttokttoklogo" alt="TtokTtok Logo" />
        </div>
        <h1>Reset Your Password</h1>
        <p>We received a request to reset your password. Click the button below to proceed:</p>
        <p>
          <a class="reset-button" href="${resetPasswordURL}" target="_blank">Reset Password</a>
        </p>
        <p>If you didn’t request this, you can safely ignore this email.</p>
        <div class="footer">
          &copy; ${new Date().getFullYear()} TtokTtok. Learn, Teach, Repeat.
        </div>
      </div>
    </body>
  </html>
  `,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Failed to send reset password email.", error);
  }
};
