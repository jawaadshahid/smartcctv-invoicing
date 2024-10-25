import {
  ArrowDownTrayIcon,
  ArrowUturnLeftIcon,
} from "@heroicons/react/24/outline";
import { Form } from "@remix-run/react";
import type { Navigation } from "@remix-run/router";
import FormBtn from "./FormBtn";

const ProductCleanupForm = ({
  navigation,
  onCancel,
  actionName,
}: {
  navigation: Navigation;
  onCancel: Function;
  actionName: string;
}) => {
  const isSubmitting = navigation.state === "submitting";
  return (
    <Form replace method="post">
      <div className="form-control">
        <label className="label cursor-pointer">
          <span className="label-text">brands</span>
          <input
            type="checkbox"
            className="checkbox"
            name="brands"
            id="customerEmail"
            defaultChecked
          />
        </label>
      </div>
      <div className="form-control">
        <label className="label cursor-pointer">
          <span className="label-text">models</span>
          <input
            type="checkbox"
            className="checkbox"
            name="models"
            id="customerEmail"
            defaultChecked
          />
        </label>
      </div>
      <div className="form-control">
        <label className="label cursor-pointer">
          <span className="label-text">types</span>
          <input
            type="checkbox"
            className="checkbox"
            name="types"
            id="customerEmail"
            defaultChecked
          />
        </label>
      </div>
      <div className="flex justify-end mt-4">
        <FormBtn
          type="submit"
          name="_action"
          value={actionName}
          isSubmitting={isSubmitting}
        >
          <ArrowDownTrayIcon className="h-5 w-5 stroke-2" />
        </FormBtn>
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
      </div>
    </Form>
  );
};

export default ProductCleanupForm;
