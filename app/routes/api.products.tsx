import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { db } from "~/utils/db";
import { authAPIReq } from "~/utils/session";

export const loader = async ({ request }: LoaderArgs) => {
  const isAuthentic = await authAPIReq(request);
  if (!isAuthentic)
    return json({ message: "Request is missing required authentication" });
  try {
    const products = await db.products.findMany({
      select: {
        product_id: true,
        brand_name: true,
        model_name: true,
        type_name: true,
      },
    });
    return json({ products });
  } catch (err) {
    console.error(err);
    return {};
  }
};
