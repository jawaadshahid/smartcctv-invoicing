import {
  ArrowDownTrayIcon,
  ArrowUturnLeftIcon,
} from "@heroicons/react/24/outline";
import type {
  Prisma,
  product_brands,
  product_models,
  product_types,
} from "@prisma/client";
import { Form } from "@remix-run/react";
import type { Navigation } from "@remix-run/router";
import { useState } from "react";
import { error } from "~/utils/errors";
import { formClass, inputClass } from "~/utils/styleClasses";
import FormBtn from "./FormBtn";
import TaxonomyField from "./TaxonomyField";

type ProductForm = {
  navigation: Navigation;
  onCancel: Function;
  setAlertData: React.Dispatch<React.SetStateAction<error | null>>;
  actionName: string;
  existingData?: {
    product_id: number;
    price: Prisma.Decimal;
    brand_id: number;
    model_id: number;
    type_id: number;
    brand_name: string;
    model_name: string;
    type_name: string;
  };
};

const ProductForm = ({
  navigation,
  onCancel,
  setAlertData,
  actionName,
  existingData,
}: ProductForm) => {
  // if existingData, then edit, else new
  const isNew = !existingData;
  const isSubmitting = navigation.state === "submitting";
  const [price, setPrice] = useState(
    !isNew ? existingData.price.toString() : "0"
  );
  return (
    <Form replace method="post" className={`${formClass} relative`}>
      {!isNew && (
        <input
          type="hidden"
          value={existingData.product_id}
          name="product_id"
        />
      )}

      <fieldset disabled={isSubmitting}>
        <TaxonomyField
          taxoName="brand"
          setAlertData={setAlertData}
          {...(existingData && {
            existingItem: {
              brand_id: existingData.brand_id,
              brand_name: existingData.brand_name,
            } as product_brands,
          })}
        />
        <TaxonomyField
          taxoName="type"
          setAlertData={setAlertData}
          {...(existingData && {
            existingItem: {
              type_id: existingData.type_id,
              type_name: existingData.type_name,
            } as product_types,
          })}
        />
        <TaxonomyField
          taxoName="model"
          setAlertData={setAlertData}
          {...(existingData && {
            existingItem: {
              model_id: existingData.model_id,
              model_name: existingData.model_name,
            } as product_models,
          })}
        />
        <div className="mb-2">
          <h4 className="label-text">Product price</h4>
          <input
            className={inputClass}
            id="price"
            name="price"
            type="number"
            min="0"
            step="any"
            value={price}
            onChange={(e) => {
              const val = e.target.value;
              const pennies = val.split(".")[1];
              if (!pennies || (pennies && pennies.length <= 2)) setPrice(val);
            }}
            onBlur={(e) => {
              const val = Number(e.target.value);
              if (isNaN(val) || val <= 0) {
                setPrice("0");
              }
            }}
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
      </fieldset>
    </Form>
  );
};

export default ProductForm;
