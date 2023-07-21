// routes/pdf.tsx
import { redirect } from "@remix-run/node";
// this is your PDF document component created with React PDF
import { getQuoteBuffer } from "~/components/QuotePDFDoc";
import { getUserId } from "~/utils/session";

export const loader = async ({ request, params }: any) => {
  const uid = await getUserId(request);
  if (!uid) return redirect("/login");
  const { quoteid } = params;

  // and transform it to a Buffer to send in the Response
  let body: any = await getQuoteBuffer(quoteid);

  // finally create the Response with the correct Content-Type header for
  // a PDF
  let headers = new Headers({ "Content-Type": "application/pdf" });
  return new Response(body, { status: 200, headers });
};
