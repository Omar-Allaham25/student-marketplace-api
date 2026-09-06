import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});
export const sendVerificationEmail = async (
  userEmail: string,
  verificationUrl: string,
) => {
  const info = await transporter.sendMail({
    from: `"Student Marketplace" <${process.env.EMAIL_FROM}>`,
    to: userEmail,
    subject: "Verify your email",
    html: `
  <div style="
    margin: 0;
    padding: 40px 20px;
    background-color: #f4f6f8;
    font-family: Arial, Helvetica, sans-serif;
  ">
    <div style="
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 12px;
      padding: 40px;
      text-align: center;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    ">
      
      <h1 style="
        margin: 0 0 20px;
        color: #1f2937;
        font-size: 28px;
      ">
        Verify Your Email
      </h1>

      <p style="
        margin: 0 0 30px;
        color: #6b7280;
        font-size: 16px;
        line-height: 1.6;
      ">
        Thanks for creating an account with Student Marketplace.
        Please verify your email address to activate your account.
      </p>

      <a 
        href="${verificationUrl}"
        style="
          display: inline-block;
          padding: 14px 28px;
          background-color: #2563eb;
          color: #ffffff;
          text-decoration: none;
          border-radius: 8px;
          font-size: 16px;
          font-weight: bold;
        "
      >
        Verify Email
      </a>
      <p style="
  margin-top: 25px;
  color: #6b7280;
  font-size: 13px;
">
  If the button doesn't work, copy and paste this link into your browser:
</p>

<p style="
  word-break: break-all;
  color: #2563eb;
  font-size: 12px;
">
  ${verificationUrl}
</p>
      <p style="
        margin: 30px 0 0;
        color: #9ca3af;
        font-size: 13px;
        line-height: 1.5;
      ">
        This verification link will expire in 24 hours.
        If you didn't create this account, you can safely ignore this email.
      </p>

    </div>
  </div>
`,
  });
  console.log("Preview URL:", nodemailer.getTestMessageUrl(info));
};
