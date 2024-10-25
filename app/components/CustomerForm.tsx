import {
  ArrowDownTrayIcon,
  ArrowUturnLeftIcon,
} from "@heroicons/react/24/outline";
import type { customers } from "@prisma/client";
import { Form } from "@remix-run/react";
import type { Navigation } from "@remix-run/router";
import { useState } from "react";
import { formClass, inputClass } from "~/utils/styleClasses";
import FormBtn from "./FormBtn";

const CustomerForm = ({
  navigation,
  onCancel,
  actionName,
  existingData,
}: {
  navigation: Navigation;
  onCancel?: Function;
  actionName: string;
  existingData?: customers;
}) => {
  const isNew = !existingData;
  const [name, setName] = useState(!isNew ? existingData.name : "");
  const [tel, setTel] = useState(!isNew ? existingData.tel : "");
  const [email, setEmail] = useState(!isNew ? existingData.email : "");
  const [address, setAddress] = useState(!isNew ? existingData.address : "");
  const isSubmitting = navigation.state === "submitting";
  return (
    <Form replace method="post" className={formClass}>
      {!isNew && (
        <input
          type="hidden"
          value={existingData.customer_id}
          name="customer_id"
        />
      )}
      <fieldset disabled={isSubmitting}>
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
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
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
            value={tel}
            onChange={(e) => setTel(e.target.value)}
          />
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
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
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
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>
        <div className="flex justify-end mt-4 mb-2">
          <FormBtn
            type="submit"
            name="_action"
            value={actionName}
            isSubmitting={isSubmitting}
          >
            <ArrowDownTrayIcon className="h-5 w-5 stroke-2" />
          </FormBtn>
          {onCancel && (
            <FormBtn
              className="ml-4"
              isSubmitting={isSubmitting}
              onClick={(e) => {
                e.preventDefault();
                onCancel();
              }}
            >
              <ArrowUturnLeftIcon className="h-5 w-5 stroke-2" />
            </FormBtn>
          )}
        </div>
      </fieldset>
    </Form>
  );
};

export default CustomerForm;
