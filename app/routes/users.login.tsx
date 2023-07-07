import type { ActionArgs, V2_MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, useActionData, useNavigation } from "@remix-run/react";
import bcrypt from "bcryptjs";
import { getUserByEmail } from "~/utils/db";
import { createUserSession } from "~/utils/session";

export const meta: V2_MetaFunction = () => {
  return [{ title: "login" }];
};

export async function action({ request }: ActionArgs) {
  const body = await request.formData();
  const email = body.get("email") as string;
  const password = body.get("password") as string;
  var mess = "";
  const user = await getUserByEmail(email)
  if (user) {
    const isCorrectPassword = await bcrypt.compare(
      password,
      `${user.password}`
    );
    if (!isCorrectPassword) mess = "Invalid password!";
    else {
      return await createUserSession(user.id, "/users");
    }
  } else {
    mess = "User not found";
  }

  return json({ message: mess });
}

export default function Login() {
  const navigation = useNavigation();
  const data = useActionData();

  return (
    <div className="grid place-items-center">
      <div className="w-full max-w-xs">
        <Form method="post" className="bg-neutral px-4 py-2 rounded-lg">
          <fieldset disabled={navigation.state === "submitting"}>
            <div className="mb-4">
              <label className="label" htmlFor="email">
                <span className="label-text">Email</span>
              </label>
              <input
                className="input input-bordered w-full max-w-xs"
                name="email"
                id="email"
                type="text"
                placeholder="john@example.com"
              />
            </div>
            <div>
              <label className="label" htmlFor="password">
                <span className="label-text">Password</span>
              </label>
              <input
                className="input input-bordered w-full max-w-xs"
                name="password"
                id="password"
                type="password"
                placeholder="******************"
              />
            </div>
            <div className="mt-6 mb-2">
              <button className="btn btn-accent" type="submit">
                {navigation.state === "submitting" ? "Validating..." : "Log In"}
              </button>
              <a
                href="/users/register"
                className="inline-block link link-accent px-2"
              >
                No account? create user
              </a>
              {data && data.message && (
                <p className="text-error mt-1 text-xs">{data.message}</p>
              )}
            </div>
          </fieldset>
        </Form>
      </div>
    </div>
  );
}
