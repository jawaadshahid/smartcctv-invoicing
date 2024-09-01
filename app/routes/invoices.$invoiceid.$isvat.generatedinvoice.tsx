// routes/pdf.tsx
import type { LoaderArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { getInvoiceBuffer } from "~/components/InvoicePDFDoc";
import { getUserById } from "~/controllers/users";
import { getUserId } from "~/utils/session";

export const loader = async ({ request, params, context }: LoaderArgs) => {
  const uid = await getUserId(request);
  if (!uid) return redirect("/login");
  const { invoiceid, isvat } = params;
  const user = await getUserById(uid);

  // and transform it to a Buffer to send in the Response
  let body: any = await getInvoiceBuffer(
    invoiceid,
    isvat === "1",
    user && user.address ? `${user.address}` : ""
  );

  // finally create the Response with the correct Content-Type header for
  // a PDF
  let headers = new Headers({ "Content-Type": "application/pdf" });
  return new Response(body, { status: 200, headers });
};
