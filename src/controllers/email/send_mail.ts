import nodemailer from "nodemailer";
import EmailTemplate from "email-templates";
import path from "path";

import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.FROM_EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

interface User {
  name: string;
  email: string;
  teamName: string;
  storyName: string;
}

export function sendEmail(obj: nodemailer.SendMailOptions) {
  return transporter.sendMail(obj);
}

async function loadTemplate(
  templateName: string,
  allUsersdetails: User[]
): Promise<any[]> {
  const template = new EmailTemplate({
    message: {
      from: "PlanIt Poker",
    },
    preview: false,
    send: true,
    transport: transporter,
  });

  try {
    const results = await Promise.all(
      allUsersdetails.map(async (userDetails) => {
        try {
          const rendered = await template.renderAll(
            path.join(__dirname, "../../helper/emailTemplates", templateName),
            userDetails
          );
          return {
            email: {
              subject: rendered.subject,
              html: rendered.html,
              text: rendered.text,
            },
            userDetails,
          };
        } catch (err) {
          throw err;
        }
      })
    );

    return results;
  } catch (err) {
    throw err;
  }
}

export async function sendEmailNotification(
  templateName: string,
  userinfo: any
) {
  loadTemplate(templateName, userinfo)
    .then((results) => {
      return Promise.all(
        results.map((result) => {
          return sendEmail({
            to: result.userDetails.email,
            subject: result.email.subject,
            html: result.email.html,
            text: result.email.text,
          });
        })
      );
    })
    .then(() => {
      console.log("Email Sent Succesfully!");
    })
    .catch((err) => {
      console.error("Error:", err);
    });
}
