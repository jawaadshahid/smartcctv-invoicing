import { Form } from "@remix-run/react";
import type { customers, users } from "@prisma/client";
import type { Navigation } from "@remix-run/router";
import { formClass, inputClass } from "~/utils/styleClasses";
import FormBtn from "./FormBtn";

const ShareQuoteForm = ({
  quoteid,
  navigation,
  customer,
  user,
  onCancel,
  formErrors,
}: {
  quoteid: number;
  navigation: Navigation;
  customer: customers;
  user: users;
  onCancel: Function;
  formErrors: any;
}) => {
  const isSubmitting = navigation.state === "submitting";
  return (
    <Form replace method="post" className={formClass}>
      <input type="hidden" value={quoteid} name="quoteid" id="quoteid" />
      <fieldset disabled={isSubmitting}>
        <div className="form-control">
          <label className="label cursor-pointer">
            <span className="label-text">
              {customer.name} ({customer.email})
            </span>
            <input
              type="checkbox"
              className="checkbox"
              name="customerEmail"
              id="customerEmail"
              value={customer.email}
            />
          </label>
        </div>
        <div className="form-control">
          <label className="label cursor-pointer">
            <span className="label-text">
              {user.firstName} ({user.email})
            </span>
            <input
              type="checkbox"
              className="checkbox"
              name="userEmail"
              id="userEmail"
              value={user.email}
            />
          </label>
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text">Other(s)</span>
          </label>
          <input
            type="text"
            name="otherEmails"
            id="otherEmails"
            placeholder="john@example.com,jill@example.com,etc"
            className={inputClass}
          />
          {formErrors?.msg && (
            <label className="label">
              <span className="label-text-alt text-error">
                {formErrors.msg}
              </span>
            </label>
          )}
        </div>
        <div className="flex justify-end mt-4 mb-2">
          <FormBtn
            type="submit"
            name="_action"
            value="share_quote"
            isSubmitting={isSubmitting}
          >
            Submit
          </FormBtn>
          <FormBtn
            className="ml-4"
            isSubmitting={isSubmitting}
            onClick={(e) => {
              e.preventDefault();
              onCancel();
            }}
          >
            Cancel
          </FormBtn>
        </div>
      </fieldset>
    </Form>
  );
};

export default ShareQuoteForm;
