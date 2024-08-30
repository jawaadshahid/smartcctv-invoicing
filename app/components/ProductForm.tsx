import type {
  Prisma,
  product_brands,
  product_models,
  product_types,
} from "@prisma/client";
import { Form } from "@remix-run/react";
import type { Navigation } from "@remix-run/router";
import cn from "classnames";
import { useEffect, useState } from "react";
import { formClass, inputClass, selectClass } from "~/utils/styleClasses";
import FormBtn from "./FormBtn";

const TaxonomyField = ({
  taxoName,
  taxoItems,
  inputError,
  selectedValue,
}: {
  taxoName: string;
  taxoItems: any;
  inputError: any;
  selectedValue?: number;
}) => {
  const hasItems = taxoItems?.length > 0;
  const [isNewTaxoItem, setIsNewTaxoItem] = useState(!hasItems);
  const [taxoSelectValue, setTaxoSelectValue] = useState(
    selectedValue ? selectedValue : ""
  );

  const taxoInputClass = cn({
    [inputClass]: true,
    "mt-2": isNewTaxoItem,
    hidden: !isNewTaxoItem,
  });

  useEffect(() => {
    setIsNewTaxoItem(taxoSelectValue === "-1");
  }, [taxoSelectValue]);

  return (
    <div className="mb-2">
      <label
        className="label"
        htmlFor={isNewTaxoItem ? `new${taxoName}` : taxoName}
      >
        <span className="label-text">Product {taxoName}</span>
      </label>
      <select
        className={selectClass}
        name={taxoName}
        id={taxoName}
        value={taxoSelectValue}
        onChange={(e) => {
          setTaxoSelectValue(e.target.value);
        }}
      >
        <option disabled value="">
          Select a {taxoName}...
        </option>
        <option value="-1">Add new {taxoName} +</option>
        {hasItems &&
          taxoItems.map((taxoItem: any) => {
            return (
              <option
                key={taxoItem[`${taxoName}_id`]}
                value={taxoItem[`${taxoName}_id`]}
              >
                {taxoItem[`${taxoName}_name`]}
              </option>
            );
          })}
      </select>
      <input
        disabled={!isNewTaxoItem}
        className={taxoInputClass}
        id={`new${taxoName}`}
        name={`new${taxoName}`}
        type="text"
        placeholder={`Defined new ${taxoName} here...`}
      />
      {inputError && inputError[taxoName] && (
        <label className="label">
          <span className="label-text-alt text-error">
            {inputError[taxoName]}
          </span>
        </label>
      )}
    </div>
  );
};

const ProductForm = ({
  selectData,
  navigation,
  formErrors,
  onCancel,
  actionName,
  existingData,
}: {
  selectData: {
    brands: product_brands[];
    models: product_models[];
    types: product_types[];
  };
  navigation: Navigation;
  formErrors?: any;
  onCancel: Function;
  actionName: string;
  existingData?: {
    product_id: number;
    price: Prisma.Decimal;
    brand_id: number;
    model_id: number;
    type_id: number;
  };
}) => {
  // if existingData, then edit, else new
  const isNew = !existingData;
  const { brands, models, types } = selectData;
  const isSubmitting = navigation.state === "submitting";
  const [price, setPrice] = useState(
    !isNew ? existingData.price.toString() : "0"
  );
  return (
    <Form replace method="post" className={formClass}>
      {formErrors && formErrors.info && (
        <label className="label">
          <span className="label-text-alt text-error">{formErrors.info}</span>
        </label>
      )}
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
          taxoItems={brands}
          inputError={formErrors}
          selectedValue={!isNew ? existingData.brand_id : undefined}
        />
        <TaxonomyField
          taxoName="type"
          taxoItems={types}
          inputError={formErrors}
          selectedValue={!isNew ? existingData.type_id : undefined}
        />
        <TaxonomyField
          taxoName="model"
          taxoItems={models}
          inputError={formErrors}
          selectedValue={!isNew ? existingData.model_id : undefined}
        />
        <div className="mb-2">
          <label className="label" htmlFor="price">
            <span className="label-text">Product price</span>
          </label>
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
              if (!pennies || (pennies && pennies.length <= 2))
                setPrice(val);
            }}
            onBlur={(e) => {
              const val = Number(e.target.value);
              if (isNaN(val) || val <= 0) {
                setPrice("0");
              }
            }}
          />
          {formErrors && formErrors.price && (
            <label className="label">
              <span className="label-text-alt text-error">
                {formErrors.price}
              </span>
            </label>
          )}
        </div>
        <div className="flex justify-end mt-4 mb-2">
          <FormBtn
            type="submit"
            name="_action"
            value={actionName}
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

export default ProductForm;
