import { mailer } from "~/entry.server";

export async function sendEmail(to: string[], attachmentBuffer:any) {
  let transporter = mailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT || "587"),
    secure: false, // upgrade later with STARTTLS
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
  return transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject: "Smart CCTV Quote",
    html: "Hi<br>Please find your quotation attached",
    attachments: [{
      filename: "quote.pdf",
      content: attachmentBuffer
    }]
  })
}
