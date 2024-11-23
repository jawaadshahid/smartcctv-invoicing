// routes/pdf.tsx
import type { LoaderArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { getInvoiceBuffer } from "~/components/InvoicePDFDoc";
import { getQuoteBuffer } from "~/components/QuotePDFDoc";
import { getUserById } from "~/controllers/users";
import { getUserId } from "~/utils/session";

export const loader = async ({ request }: LoaderArgs) => {
  const uid = await getUserId(request);
  if (!uid) return redirect("/login");
  const url = new URL(request.url);
  const type = url.searchParams.get("type");
  const id = url.searchParams.get("id");
  const isvat = url.searchParams.get("isvat");
  const user = await getUserById(uid);

  if (!type || !id) return new Response(null, { status: 404 });

  let body: any;
  switch (type) {
    case "invoice":
      body = await getInvoiceBuffer(
        id,
        isvat === "true",
        user && user.email ? `${user.email}` : ""
      );
      break;
    case "quote":
      body = await getQuoteBuffer(id);
      break;
  }

  let headers = new Headers({ "Content-Type": "application/pdf" });
  return new Response(body, { status: 200, headers });
};
