import type { ActionArgs, V2_MetaFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Form, useActionData, useNavigation } from "@remix-run/react";
import bcrypt from "bcryptjs";
import { db, getUserByEmail } from "~/utils/db";
import { validateEmail, validateFname, validateLname, validatePassword } from "~/utils/validations";

export const meta: V2_MetaFunction = () => {
  return [{ title: "register" }];
};

export async function action({ request }: ActionArgs) {
  const formData = await request.formData();

  const fname = formData.get("firstname") as string;
  const lname = formData.get("lastname") as string;
  const email = formData.get("email") as string;
  const rpassword = formData.get("password") as string;

  const formErrors = {
    fname: validateFname(fname),
    lname: validateLname(lname),
    email: validateEmail(email),
    password: validatePassword(rpassword),
  };
  //if there are errors, we return the form errors
  if (Object.values(formErrors).some(Boolean)) return { formErrors };

  // existing user check
  const existingUser = await getUserByEmail(email);
  if (existingUser) {
    formErrors.email = "email already registered!";
    return { formErrors };
  }

  // generate enctypted password
  const password = await bcrypt.hash(rpassword, 10);

  const user = await db.users.create({
    data: {
      firstName: fname,
      lastName: lname,
      email: email,
      password: password,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });
  if (user) {
    console.log("create user:", user);
    return redirect("/users/login");
  } else {
    console.log("err:", "failed to create the user");
  }

  return {};
}

// Note the "action" export name, this will handle our form POST

export default function Register() {
  const navigation = useNavigation();
  const data = useActionData();

  return (
    <div className="grid place-items-center">
      <div className="w-full max-w-xs">
        <Form method="post" className="bg-base-300 px-4 py-2 rounded-lg">
          <fieldset disabled={navigation.state === "submitting"}>
            <div className="mb-4">
              <label className="label" htmlFor="firstname">
                <span className="label-text">First name</span>
              </label>
              <input
                className="input input-bordered w-full max-w-xs"
                id="firstname"
                name="firstname"
                type="text"
                placeholder="First name"
              />
              {data && data.formErrors && data.formErrors.fname && (
                <p className="text-error mt-1 text-xs">
                  {data.formErrors.fname}
                </p>
              )}
            </div>
            <div className="mb-4">
              <label className="label" htmlFor="lastname">
                <span className="label-text">Last name</span>
              </label>
              <input
                className="input input-bordered w-full max-w-xs"
                id="lastname"
                name="lastname"
                type="text"
                placeholder="Last name"
              />
              {data && data.formErrors && data.formErrors.lname && (
                <p className="text-error mt-1 text-xs">
                  {data.formErrors.lname}
                </p>
              )}
            </div>
            <div className="mb-4">
              <label className="label" htmlFor="email">
                <span className="label-text">Email</span>
              </label>
              <input
                className="input input-bordered w-full max-w-xs"
                id="email"
                name="email"
                type="text"
                placeholder="Email"
              />
              {data && data.formErrors && data.formErrors.email && (
                <p className="text-error mt-1 text-xs">
                  {data.formErrors.email}
                </p>
              )}
            </div>
            <div>
              <label className="label" htmlFor="password">
                <span className="label-text">Password</span>
              </label>
              <input
                className="input input-bordered w-full max-w-xs"
                id="password"
                name="password"
                type="password"
                placeholder="******************"
              />
              {data && data.formErrors && data.formErrors.password && (
                <p className="text-error mt-1 text-xs">
                  {data.formErrors.password}
                </p>
              )}
            </div>
            <div className="mt-6 mb-2">
              <button className="btn btn-neutral" type="submit">
                {navigation.state === "submitting" ? "Submitting..." : "Submit"}
              </button>
              <a href="/users/login" className="btn btn-neutral ml-3">
                Cancel
              </a>
            </div>
          </fieldset>
        </Form>
      </div>
    </div>
  );
}
