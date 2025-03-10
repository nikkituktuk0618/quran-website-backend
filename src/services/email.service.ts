import nodemailer from "nodemailer";
import { company_email, company_password } from "../config/constants";

export const sendEmail = async (to: string, subject: string, text: string) => {
  console.log(company_email);
  console.log(company_password);
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: company_email, // Your email
      pass: company_password, // Your email password
    },
  });

  await transporter.sendMail({
    from: company_email,
    to,
    subject,
    text,
  });
};
