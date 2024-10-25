import { mailer } from "~/entry.server";
import {
  getCurrencyString,
  prettifyFilename,
  prettifyRefNum,
} from "./formatters";
import { validateEmail } from "./validations";

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

export const getAllEmails = async (values: {
  [key: string]: FormDataEntryValue;
}) => {
  const { customerEmail, userEmail, otherEmails } = values;
  if (!customerEmail && !userEmail && !otherEmails)
    return Promise.reject({
      code: 400,
      message: "Bad request: No recipient email selected or defined",
    });

  const othEmails = otherEmails
    ? otherEmails
        .toString()
        .split(",")
        .map((othEmail: string) => othEmail.trim())
    : [];

  const othEmailErrors = othEmails
    .map((oe) => validateEmail(oe))
    .filter((oee) => Boolean(oee));

  if (othEmailErrors.length > 0)
    return Promise.reject({
      code: 400,
      message: "Bad request: one or more email addresses are invalid",
    });

  return Promise.resolve([
    ...othEmails,
    ...(customerEmail ? [String(customerEmail)] : []),
    ...(userEmail ? [String(userEmail)] : []),
  ]);
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

export async function sendEmailPromise(
  to: string[],
  emailBodyData: emailBodyData,
  attachmentBuffer: any
) {
  try {
    const mailResponse = await sendEmail(to, emailBodyData, attachmentBuffer);
    if (mailResponse.accepted && mailResponse.accepted.length > 0) {
      if (process.env.NODE_ENV === "development") {
        console.log("message sent:", mailer.getTestMessageUrl(mailResponse));
      }
      return Promise.resolve({ code: 200, mailResponse });
    } else {
      return Promise.reject({
        code: 500,
        message: "Internal server error: the email has not been sent",
      });
    }
  } catch (error) {
    return Promise.reject({
      code: 500,
      message: "Internal server error: the email has not been sent",
    });
  }
}

const sendEmail = async (
  to: string[],
  emailBodyData: emailBodyData,
  attachmentBuffer: any
) => {
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
};
