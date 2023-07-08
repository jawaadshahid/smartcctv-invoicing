import type { LoaderArgs } from "@remix-run/node";
import { logout } from "~/utils/session";

export const loader = async ({ request }: LoaderArgs) => {
  return logout(request);
};
