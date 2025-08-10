import nodemailer from "nodemailer";
import { google } from "googleapis";
import SMTPTransport from "nodemailer/lib/smtp-transport";
import path from "path";

export const sendVerificationEmail = async (email: string, token: string) => {
  try {
    const verificationURL = `${process.env.CLIENT_URL}/verify-email?token=${token}`;

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
      subject: "Verify your email for TtokTtok!",
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
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;600&display=swap');

        body {
          background-color: #fffaf7;
          font-family: 'Inter', 'Noto Sans KR', sans-serif;
          margin: 0;
          padding: 0;
          color: #333;
        }

        .container {
          max-width: 540px;
          margin: 48px auto;
          background-color: #ffffff;
          border-radius: 24px;
          border: 1px solid #f2dbe0;
          box-shadow: 0 6px 18px rgba(0, 0, 0, 0.04);
          padding: 40px 32px;
          text-align: center;
        }

        .logo {
          margin-bottom: 24px;
        }

        .logo img {
          width: 64px;
          height: 64px;
          border-radius: 16px;
        }

        h1 {
          font-size: 22px;
          color: #b88acf;
          margin-bottom: 8px;
        }

        .subtitle {
          font-size: 14px;
          color: #666;
          margin-bottom: 24px;
        }

        p {
          font-size: 16px;
          line-height: 1.6;
          margin-bottom: 24px;
        }

        .verify-button {
          display: inline-block;
          padding: 12px 24px;
          background-color: #d4eaff;
          color: #1d3557;
          text-decoration: none;
          border-radius: 12px;
          font-weight: 600;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.06);
          transition: background-color 0.3s ease;
        }

        .verify-button:hover {
          background-color: #bfe0f7;
        }

        .footer {
          font-size: 13px;
          color: #888;
          margin-top: 32px;
        }

        .footer small {
          display: block;
          margin-top: 8px;
          color: #aaa;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="logo">
          <img src="cid:ttokttoklogo" alt="TtokTtok Logo" style="width: 100%; max-width: 240px; height: auto; border-radius: 16px;" />
        </div>
        <h1>Welcome to TtokTtok!</h1>
        <div class="subtitle">환영합니다! 지금 바로 이메일을 인증해 주세요.</div>
        <p>
          Thanks for signing up! To begin learning Korean and tracking your progress, please verify your email:
        </p>
        <p>
          <a class="verify-button" href="${verificationURL}" target="_blank">Verify My Email</a>
        </p>
        <p>If you didn’t create an account, you can safely ignore this email.</p>
        <div class="footer">
          &copy; ${new Date().getFullYear()} TtokTtok. Learn, Teach, Repeat.
          <small>감사합니다 – Thank you for joining us!</small>
        </div>
      </div>
    </body>
  </html>
  `,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Failed to send verification email", error);
  }
};
