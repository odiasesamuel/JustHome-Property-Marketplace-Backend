import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || "465", 10),
  secure: true, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export type EmailOptions = {
  to: string;
  subject: string;
  html: string;
};

export const sendEmail = async ({ to, subject, html }: EmailOptions) => {
  const mailOptions = {
    from: `"JustHome" <${process.env.SMTP_USER}>`,
    to,
    subject,
    html,
    headers: {
      Importance: "high", // Mark as important
      "X-Priority": "1", // Highest priority
      Priority: "urgent", // Urgent priority
    },
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Email error:", error);
    throw new Error("Failed to send email");
  }
};
