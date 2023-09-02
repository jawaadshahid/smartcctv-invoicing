import { Form } from "@remix-run/react";
import type { Navigation } from "@remix-run/router";
import FormBtn from "./FormBtn";

const ProductCleanupForm = ({
  navigation,
  formData,
  onCancel,
  actionName,
}: {
  navigation: Navigation;
  formData: any;
  onCancel: Function;
  actionName: string;
}) => {
  const isSubmitting = navigation.state === "submitting";
  return (
    <Form replace method="post">
      {formData && formData.info && (
        <label className="label">
          <span className="label-text-alt text-error">{formData.info}</span>
        </label>
      )}
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
          Confirm
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
    </Form>
  );
};

export default ProductCleanupForm;
