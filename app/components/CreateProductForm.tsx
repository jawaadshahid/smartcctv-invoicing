import type {
  product_brands,
  product_models,
  product_types,
} from "@prisma/client";
import { Form } from "@remix-run/react";
import type { Navigation } from "@remix-run/router";
import cn from "classnames";
import { useEffect, useState } from "react";

const formClass = "bg-base-300 px-4 py-2 rounded-lg";
const selectClass = "select select-bordered w-full";
const inputClass = "input input-bordered w-full";

const TaxonomyField = ({
  taxoName,
  taxoItems,
  inputError,
}: {
  taxoName: string;
  taxoItems: any;
  inputError: any;
}) => {
  const hasItems = taxoItems.length > 0;
  const [isNewTaxoItem, setIsNewTaxoItem] = useState(!hasItems);
  const [taxoSelectValue, setTaxoSelectValue] = useState("")

  const taxoInputClass = cn({
    [inputClass]: true,
    "mt-2": isNewTaxoItem,
    hidden: !isNewTaxoItem,
  });

  useEffect(() => {
    setIsNewTaxoItem(taxoSelectValue === "-1")
  }, [taxoSelectValue])
  

  return (
    <div className="mb-2">
      <label
        className="label"
        htmlFor={isNewTaxoItem ? `new${taxoName}` : taxoName}
      >
        <span className="label-text">Product {taxoName}</span>
      </label>
      {hasItems && (
        <select
          className={selectClass}
          name={taxoName}
          id={taxoName}
          value={taxoSelectValue}
          onChange={(e) => {
            setTaxoSelectValue(e.target.value)
          }}
        >
          <option disabled value="">
            Select a {taxoName}...
          </option>
          {taxoItems.map((taxoItem: any) => {
            return (
              <option
                key={taxoItem[`${taxoName}_id`]}
                value={taxoItem[`${taxoName}_id`]}
              >
                {taxoItem[`${taxoName}_name`]}
              </option>
            );
          })}
          <option value="-1">Add new {taxoName} +</option>
        </select>
      )}
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

const CreateProductForm = ({
  selectData,
  navigation,
  formErrors,
  onCancel,
  actionName
}: {
  selectData: {
    brands: product_brands[];
    models: product_models[];
    types: product_types[];
  };
  navigation: Navigation;
  formErrors?: any;
  onCancel: Function;
  actionName: string
}) => {
  const { brands, models, types } = selectData;

  return (
    <Form
      replace
      method="post"
      className={formClass}
      onSubmit={() => {  }}
    >
      {formErrors && formErrors.info && (
        <label className="label">
          <span className="label-text-alt text-error">{formErrors.info}</span>
        </label>
      )}

      <fieldset disabled={navigation.state === "submitting"}>
        <TaxonomyField
          taxoName="brand"
          taxoItems={brands}
          inputError={formErrors}
        />
        <TaxonomyField
          taxoName="type"
          taxoItems={types}
          inputError={formErrors}
        />
        <TaxonomyField
          taxoName="model"
          taxoItems={models}
          inputError={formErrors}
        />
        <div className="mb-2">
          <label className="label" htmlFor="price">
            <span className="label-text">Product price (£)</span>
          </label>
          <input
            className={inputClass}
            id="price"
            name="price"
            type="number"
            placeholder="10.00"
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
          <button
            className="btn btn-neutral"
            type="submit"
            name="_action"
            value={actionName}
          >
            {navigation.state === "submitting" ? "Submitting..." : "Submit"}
          </button>
          <button
            className="btn btn-neutral ml-3"
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

export default CreateProductForm;
