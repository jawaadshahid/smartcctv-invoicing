import {
  ArrowDownTrayIcon,
  ArrowUturnLeftIcon,
} from "@heroicons/react/24/outline";
import type { ActionArgs, V2_MetaFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Form, useActionData, useNavigation } from "@remix-run/react";
import bcrypt from "bcryptjs";
import FormAnchorButton from "~/components/FormAnchorBtn";
import FormBtn from "~/components/FormBtn";
import { createUser, getUsers } from "~/controllers/users";
import { SITE_TITLE } from "~/root";
import { formClass, inputClass } from "~/utils/styleClasses";
import {
  validateEmail,
  validateFname,
  validateLname,
  validatePassword,
} from "~/utils/validations";

export const meta: V2_MetaFunction = () => {
  return [{ title: `${SITE_TITLE} - Register` }];
};

export async function action({ request }: ActionArgs) {
  const formData = await request.formData();
  const values = Object.fromEntries(formData);
  const { firstname, lastname, email, password: rpassword } = values;

  const formErrors = {
    fname: validateFname(`${firstname}`),
    lname: validateLname(`${lastname}`),
    email: validateEmail(`${email}`),
    opassword: validatePassword(`${rpassword}`),
  };

  if (Object.values(formErrors).some(Boolean)) return { formErrors };

  // generate enctypted password
  const password = await bcrypt.hash(`${rpassword}`, 10);

  const currUsers = await getUsers();
  const isFirst = currUsers.length === 0;

  try {
    await createUser(isFirst, { ...values, password });
    return redirect("/login");
  } catch (err: any) {
    if (err.code === "P2002") {
      formErrors.email = "email already registered!";
      return { formErrors };
    }
    console.error(err);
  }
}

export default function Register() {
  const navigation = useNavigation();
  const data = useActionData();
  const isSubmitting = navigation.state === "submitting";

  return (
    <div className="grid place-items-center">
      <div className="w-full max-w-xs">
        <Form method="post" className={formClass}>
          <fieldset disabled={isSubmitting}>
            <div className="mb-4">
              <label className="label" htmlFor="firstname">
                <span className="label-text">First name</span>
              </label>
              <input
                className={inputClass}
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
                className={inputClass}
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
              <label className="label" htmlFor="address">
                <span className="label-text">Address</span>
              </label>
              <input
                className={inputClass}
                id="address"
                name="address"
                type="text"
                placeholder="Address"
              />
            </div>
            <div className="mb-4">
              <label className="label" htmlFor="email">
                <span className="label-text">Email</span>
              </label>
              <input
                className={inputClass}
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
                className={inputClass}
                id="password"
                name="password"
                type="password"
                placeholder="***"
              />
              {data && data.formErrors && data.formErrors.password && (
                <p className="text-error mt-1 text-xs">
                  {data.formErrors.password}
                </p>
              )}
            </div>
            <div className="mt-6 mb-2">
              <FormBtn type="submit" isSubmitting={isSubmitting}>
                <ArrowDownTrayIcon className="h-5 w-5 stroke-2" />
              </FormBtn>
              <FormAnchorButton
                href="/login"
                className="ml-3"
                isSubmitting={isSubmitting}
              >
                <ArrowUturnLeftIcon className="h-5 w-5 stroke-2" />
              </FormAnchorButton>
            </div>
          </fieldset>
        </Form>
      </div>
    </div>
  );
}
