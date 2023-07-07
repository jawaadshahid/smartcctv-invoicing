import {
    createCookieSessionStorage,
    redirect,
} from "@remix-run/node";

const sessionSecret = 'sessionYsecret';
if (!sessionSecret) {
    throw new Error("SESSION_SECRET must be set");
}
const storage = createCookieSessionStorage({
    cookie: {
        name: "user_session",
        // normally you want this to be `secure: true`
        // but that doesn't work on localhost for Safari
        // https://web.dev/when-to-use-local-https/
        secure: process.env.NODE_ENV === "production",
        secrets: [sessionSecret],
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 30,
        httpOnly: true,
    },
});
export async function createUserSession(
    userId: number,
    redirectTo: string
) {
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
    return redirect("/users/login", {
      headers: {
        "Set-Cookie": await storage.destroySession(session),
      },
    });
  }