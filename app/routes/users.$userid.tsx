import type { ActionArgs, LoaderArgs, V2_MetaFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Form, useActionData, useNavigation } from "@remix-run/react";
import bcrypt from "bcryptjs";
import { useContext } from "react";
import { SITE_TITLE, UserContext } from "~/root";
import { db, getUserByEmail } from "~/utils/db";
import { getUserId } from "~/utils/session";
import { validateEmail, validateFname, validateLname, validatePassword } from "~/utils/validations";

export const meta: V2_MetaFunction = () => {
  return [{ title: `${SITE_TITLE} - Change user details`}];
};

export const loader = async ({ request }: LoaderArgs) => {
  const uid = await getUserId(request);
  if (!uid) return redirect("/login");
  return {};
};

export async function action({ request, params }: ActionArgs) {
  const formData = await request.formData();

  const fname = formData.get("firstname") as string;
  const lname = formData.get("lastname") as string;
  const email = formData.get("email") as string;
  const ropassword = formData.get("opassword") as string;
  const rnpassword = formData.get("npassword") as string;

  const formErrors: {
    fname: string | undefined;
    lname: string | undefined;
    email: string | undefined;
    opassword: string | undefined;
    npassword: string | undefined;
  } = {
    fname: validateFname(fname),
    lname: validateLname(lname),
    email: validateEmail(email),
    opassword: validatePassword(ropassword),
    npassword: undefined,
  };

  //if there are errors, we return the form errors
  if (Object.values(formErrors).some(Boolean)) return { formErrors };

  // do I have to get user again? (cant use context here)
  const user = await getUserByEmail(email);
  // validate original password
  if (user) {
    const isCorrectPassword = await bcrypt.compare(
      ropassword,
      `${user.password}`
    );
    if (!isCorrectPassword) formErrors.opassword = "Invalid password!";
  } else {
    formErrors.opassword = "user not found, unable to verify password!";
  }

  //if there are errors, we return the form errors
  if (Object.values(formErrors).some(Boolean)) return { formErrors };

  let newpassword
  if (rnpassword && rnpassword.length) {
    formErrors.npassword = validatePassword(rnpassword);
  
    //if there are errors, we return the form errors
    if (Object.values(formErrors).some(Boolean)) return { formErrors };

    // generate enctypted password
    newpassword = await bcrypt.hash(rnpassword, 10);
  }

  const { userid } = params
  const id = userid as string
  const updateUser = await db.users.update({
    where: {
      id: parseInt(id)
    },
    data: {
      firstName: fname,
      lastName: lname,
      email: email,
      ...(newpassword && {password: newpassword}),
      updatedAt: new Date(),
    }
  })
  if (updateUser) {
    console.log("updated user:", updateUser);
    return redirect("/users");
  } else {
    console.log("err:", "failed to update the user");
  }
}

export default function UserId() {
  const user: any = useContext(UserContext);
  const navigation = useNavigation();
  const data = useActionData();

  return(
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
                placeholder={user.firstName}
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
                placeholder={user.lastName}
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
              <input type="hidden" name="email" value={user.email} />
              <input
                className="input input-bordered w-full max-w-xs"
                type="text"
                placeholder={user.email}
                disabled
              />
            </div>
            <div className="mb-4">
              <label className="label" htmlFor="opassword">
                <span className="label-text">Original password</span>
              </label>
              <input
                className="input input-bordered w-full max-w-xs"
                id="opassword"
                name="opassword"
                type="password"
                placeholder="******************"
              />
              {data && data.formErrors && data.formErrors.opassword && (
                <p className="text-error mt-1 text-xs">
                  {data.formErrors.opassword}
                </p>
              )}
            </div>
            <div>
              <label className="label" htmlFor="npassword">
                <span className="label-text">New password</span>
              </label>
              <input
                className="input input-bordered w-full max-w-xs"
                id="npassword"
                name="npassword"
                type="password"
                placeholder="******************"
              />
              {data && data.formErrors && data.formErrors.npassword && (
                <p className="text-error mt-1 text-xs">
                  {data.formErrors.npassword}
                </p>
              )}
            </div>
            <div className="mt-6 mb-2">
              <button className="btn btn-neutral" type="submit">
                {navigation.state === "submitting" ? "Submitting..." : "Submit"}
              </button>
              <a href="/users" className="btn btn-neutral ml-3">
                Cancel
              </a>
            </div>
          </fieldset>
        </Form>
      </div>
    </div>
  );
}
