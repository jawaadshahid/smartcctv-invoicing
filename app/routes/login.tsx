import type { ActionArgs, V2_MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, useActionData, useNavigation } from "@remix-run/react";
import bcrypt from "bcryptjs";
import { SITE_TITLE } from "~/root";
import { getUserByEmail } from "~/utils/db";
import { createUserSession } from "~/utils/session";
import { formClass, inputClass } from "~/utils/styleClasses";

export const meta: V2_MetaFunction = () => {
  return [{ title: `${SITE_TITLE} - Login` }];
};

export async function action({ request }: ActionArgs) {
  const body = await request.formData();
  const email = body.get("email") as string;
  const password = body.get("password") as string;
  var mess = "";
  const user = await getUserByEmail(email);
  if (user && user.isApproved) {
    const isCorrectPassword = await bcrypt.compare(
      password,
      `${user.password}`
    );
    if (!isCorrectPassword) mess = "Invalid password!";
    else {
      return await createUserSession(user.id, "/");
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
        <Form method="post" className={formClass}>
          <fieldset disabled={navigation.state === "submitting"}>
            <div className="mb-4">
              <label className="label" htmlFor="email">
                <span className="label-text">Email</span>
              </label>
              <input
                className={inputClass}
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
                className={inputClass}
                name="password"
                id="password"
                type="password"
                placeholder="******************"
              />
            </div>
            <div className="flex justify-between items-center mt-6 mb-2">
              <button className="btn" type="submit">
                {navigation.state === "submitting" ? "Validating..." : "Log In"}
              </button>
              <a
                href="/users/register"
                className="block link link-neutral-content"
              >
                Register
              </a>
              {data && data.message && (
                <label className="label">
                  <span className="label-text-alt text-error">
                    {data.message}
                  </span>
                </label>
              )}
            </div>
          </fieldset>
        </Form>
      </div>
    </div>
  );
}
