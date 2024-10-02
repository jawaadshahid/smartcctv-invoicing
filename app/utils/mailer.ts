import { mailer } from "~/entry.server";
import {
  getCurrencyString,
  prettifyFilename,
  prettifyRefNum,
} from "./formatters";

export type emailBodyData = {
  documentid: FormDataEntryValue;
  subtotal: FormDataEntryValue;
  labour: FormDataEntryValue;
  discount: FormDataEntryValue;
  grandTotal: FormDataEntryValue;
  productCount: FormDataEntryValue;
  productData: { [key: string]: FormDataEntryValue };
  type: "quote" | "invoice";
};

const constructEmailBody = (emailBodyData: emailBodyData) => {
  const {
    subtotal,
    labour,
    discount,
    grandTotal,
    productCount,
    productData,
    type,
  } = emailBodyData;
  const pCount: number = parseInt(`${productCount}`);
  let htmlStr = `<p>Hi,<br>Please see your ${type} details below:</p>`;
  htmlStr += `<p>`;
  for (let ind = 0; ind < pCount; ind++) {
    const productValue: FormDataEntryValue = productData[`prod_${ind + 1}`];
    htmlStr += `${productValue}<br>`;
  }
  htmlStr += `Subtotal: ${getCurrencyString(`${subtotal}`)}<br>`;
  htmlStr += `Labour: ${getCurrencyString(`${labour}`)}<br>`;
  if (Number(`${discount}`) > 0)
    htmlStr += `Discount: -${getCurrencyString(`${discount}`)}<br>`;
  htmlStr += `Total: ${getCurrencyString(`${grandTotal}`)}`;
  htmlStr += `</p>`;
  htmlStr += `<p>A PDF of your ${type} is also attached for your records.</p>`;
  htmlStr += `<p>Kind Regards,<br>Smart CCTV</p>`;
  return htmlStr;
};

export async function sendEmail(
  to: string[],
  emailBodyData: emailBodyData,
  attachmentBuffer: any
) {
  const documentId = prettifyRefNum(parseInt(`${emailBodyData.documentid}`));
  const docType = emailBodyData.type;
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
    subject: `Smart CCTV UK ${docType} (ref: ${documentId})`,
    html: constructEmailBody(emailBodyData),
    attachments: [
      {
        filename: prettifyFilename(
          `scuk_${docType}`,
          parseInt(documentId),
          "pdf"
        ),
        content: attachmentBuffer,
      },
    ],
  });
}
