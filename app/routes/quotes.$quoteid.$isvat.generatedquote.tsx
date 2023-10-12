// routes/pdf.tsx
import type { LoaderArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
// this is your PDF document component created with React PDF
import { getQuoteBuffer } from "~/components/QuotePDFDoc";
import { getUserId } from "~/utils/session";

export const loader = async ({ request, params, context }: LoaderArgs) => {
  const uid = await getUserId(request);
  if (!uid) return redirect("/login");
  const { quoteid, isvat } = params;

  // and transform it to a Buffer to send in the Response
  let body: any = await getQuoteBuffer(quoteid, isvat === "1");

  // finally create the Response with the correct Content-Type header for
  // a PDF
  let headers = new Headers({ "Content-Type": "application/pdf" });
  return new Response(body, { status: 200, headers });
};
