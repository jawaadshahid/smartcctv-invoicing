import {
  redirect,
  type LoaderArgs,
  type V2_MetaFunction,
} from "@remix-run/node";
import { SITE_TITLE } from "~/root";
import { getUserId } from "~/utils/session";
import { contentBodyClass } from "~/utils/styleClasses";
 
export const meta: V2_MetaFunction = () => {
  return [{ title: SITE_TITLE }];
};

export const loader = async ({ request }: LoaderArgs) => {
  const uid = await getUserId(request);
  if (!uid) return redirect("/login");
  return {};
};

export default function IndexRoute() {
  return (
    <div className={contentBodyClass}>
      <p>Welcome to Smart CCTV admin</p>
    </div>
  );
}
