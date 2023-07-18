import { Form } from "@remix-run/react";
import type { Navigation } from "@remix-run/router";

const formClass = "bg-base-300 px-4 py-2 rounded-lg";
const inputClass = "input input-bordered w-full";

const CreateCustomerForm = ({
  navigation,
  formErrors,
  onCancel,
  actionName,
}: {
  navigation: Navigation;
  formErrors?: any;
  onCancel: Function;
  actionName: string;
}) => {
  return (
    <Form replace method="post" className={formClass}>
      {formErrors && formErrors.info && (
        <label className="label">
          <span className="label-text-alt text-error">{formErrors.info}</span>
        </label>
      )}
      <fieldset disabled={navigation.state === "submitting"}>
        <div className="mb-2">
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
          {formErrors && formErrors.name && (
            <label className="label">
              <span className="label-text-alt text-error">
                {formErrors.name}
              </span>
            </label>
          )}
        </div>
        <div className="mb-2">
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
          {formErrors && formErrors.tel && (
            <label className="label">
              <span className="label-text-alt text-error">
                {formErrors.tel}
              </span>
            </label>
          )}
        </div>
        <div className="mb-2">
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
          {formErrors && formErrors.email && (
            <label className="label">
              <span className="label-text-alt text-error">
                {formErrors.email}
              </span>
            </label>
          )}
        </div>
        <div className="mb-2">
          <label className="label" htmlFor="address">
            <span className="label-text">Address</span>
          </label>
          <textarea
            className="textarea textarea-bordered w-full block bg-base-200"
            id="address"
            name="address"
            placeholder="123 somewhere st, somehwere, S03 3EW"
          />
          {formErrors && formErrors.address && (
            <label className="label">
              <span className="label-text-alt text-error">
                {formErrors.address}
              </span>
            </label>
          )}
        </div>
        <div className="flex justify-end mt-4 mb-2">
          <button
            className="btn btn-neutral"
            type="submit"
            name="_action"
            value={actionName}
          >
            {navigation.state === "submitting" ? "Submitting..." : "Submit"}
          </button>
          <button
            className="btn btn-neutral ml-4"
            onClick={(e) => {
              e.preventDefault();
              onCancel();
            }}
          >
            Cancel
          </button>
        </div>
      </fieldset>
    </Form>
  );
};

export default CreateCustomerForm;
