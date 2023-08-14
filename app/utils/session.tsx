import { createCookieSessionStorage, redirect } from "@remix-run/node";
import { db } from "./db";

const sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret) {
  throw new Error("SESSION_SECRET must be set");
}
const storage = createCookieSessionStorage({
  cookie: {
    name: "user_session",
    secrets: [sessionSecret],
  },
});
export async function createUserSession(userId: number, redirectTo: string) {
  const session = await storage.getSession();
  session.set("userId", userId);

  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await storage.commitSession(session),
    },
  });
}
function getUserSession(request: Request) {
  return storage.getSession(request.headers.get("Cookie"));
}
export async function getUserId(request: Request) {
  const session = await getUserSession(request);
  const userId = session.get("userId");
  if (!userId || typeof userId !== "number") return null;
  return userId;
}
export async function logout(request: Request) {
  const session = await getUserSession(request);
  return redirect("/login", {
    headers: {
      "Set-Cookie": await storage.destroySession(session),
    },
  });
}
export async function authAPIReq(request: Request) {
  const key = request.headers.get("api_key") || "";
  try {
    const user = await db.users.findFirst({ where: { password: key } });
    if (user) return true;
    else return false;
  } catch (error) {
    console.log({ error });
    return false;
  }
}
