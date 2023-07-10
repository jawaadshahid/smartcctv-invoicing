import type { ActionArgs, V2_MetaFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Form, useActionData, useNavigation } from "@remix-run/react";
import { SITE_TITLE } from "~/root";
import { db } from "~/utils/db";
import { validateEmail, validateName, validateTel } from "~/utils/validations";

export const meta: V2_MetaFunction = () => {
  return [{ title: `${SITE_TITLE} - Create customer` }];
};

export async function action({ request }: ActionArgs) {
  const formData = await request.formData();
  const name = formData.get("name") as string
  const tel = formData.get("tel") as string
  const email = formData.get("email") as string
  const address = formData.get("address") as string
  const formErrors: {
    name?: string;
    tel?: string;
    email?: string;
    address?: string;
    info?: string;
  } = {};

  formErrors.name = validateName(name)
  formErrors.tel = validateTel(tel)
  formErrors.email = validateEmail(email)
  if (!address)
    formErrors.address = "address is required!"

  if (Object.values(formErrors).some(Boolean)) return { formErrors };

  try {
    const createCustomer = await db.customers.create({
      data: {
        name,
        tel,
        email,
        address
      }
    })
    console.log({createCustomer})
    return redirect("/customers")
  } catch (err) {
    console.log(err)
    formErrors.info = "There was a problem creating the customer..."
    return  {formErrors} 
  }
}

export default function CustomersCreate() {
  const navigation = useNavigation();
  const data = useActionData();
  const inputClass = "input input-bordered w-full max-w-xs block";
  return (
    <div className="grid place-items-center">
      <div className="w-full max-w-xs">
        <h2 className="mb-4 text-center">Create a new customer</h2>
        <Form method="post" className="bg-base-300 px-4 py-2 rounded-lg">
          <fieldset disabled={navigation.state === "submitting"}>
            <div className="mb-4">
              <label className="label" htmlFor="name">
                <span className="label-text">Name</span>
              </label>
              <input 
                className={inputClass}
                id="name"
                name="name"
                type="text"
                placeholder="John Smith"
              />
              {data && data.formErrors && data.formErrors.name && (
                <p className="text-error mt-1 text-xs">
                  {data.formErrors.name}
                </p>
              )}
            </div>
            <div className="mb-4">
              <label className="label" htmlFor="tel">
                <span className="label-text">Tel</span>
              </label>
              <input 
                className={inputClass}
                id="tel"
                name="tel"
                type="text"
                placeholder="07123456789"
              />
              {data && data.formErrors && data.formErrors.tel && (
                <p className="text-error mt-1 text-xs">
                  {data.formErrors.tel}
                </p>
              )}
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
                placeholder="john@example.com"
              />
              {data && data.formErrors && data.formErrors.email && (
                <p className="text-error mt-1 text-xs">
                  {data.formErrors.email}
                </p>
              )}
            </div>
            <div className="mb-4">
              <label className="label" htmlFor="address">
                <span className="label-text">Address</span>
              </label>
              <textarea 
                className="textarea textarea-bordered w-full max-w-xs"
                id="address"
                name="address"
                placeholder="123 somewhere st, somehwere, S03 3EW"
              />
              {data && data.formErrors && data.formErrors.address && (
                <p className="text-error mt-1 text-xs">
                  {data.formErrors.address}
                </p>
              )}
            </div>
            <div className="mt-2 mb-2">
              <button className="btn btn-neutral" type="submit">
                {navigation.state === "submitting" ? "Submitting..." : "Submit"}
              </button>
              <a href="/customers" className="btn btn-neutral ml-3">
                Cancel
              </a>
              {data && data.formErrors && data.formErrors.info && (
                <p className="text-error mt-1 text-xs">
                  {data.formErrors.info}
                </p>
              )}
            </div>
          </fieldset>
        </Form>
      </div>
    </div>
  );
}