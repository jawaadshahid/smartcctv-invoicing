import { json, type LinksFunction, type LoaderArgs } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import { createContext } from "react";
import stylesheet from "~/tailwind.css";
import NavBar from "./components/NavBar";
import { getUserById } from "./controllers/users";
import { getUserId } from "./utils/session";

export const SITE_TITLE = "Smart CCTV admin";

export const UserContext = createContext(null);

export const loader = async ({ request }: LoaderArgs) => {
  const uid = await getUserId(request);
  if (!uid) return {};
  try {
    const user = await getUserById(uid);
    return json({ user });
  } catch (err) {
    console.error(err);
    return {};
  }
};

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesheet },
];

export default function App() {
  const { user } = useLoaderData();
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <meta name="robots" content="noindex, nofollow" />
        <Meta />
        <Links />
      </head>
      <body>
        <UserContext.Provider value={user}>
          <NavBar />
          <Outlet />
        </UserContext.Provider>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
