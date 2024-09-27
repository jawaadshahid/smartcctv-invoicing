import { SquaresPlusIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useEffect, useRef, useState } from "react";
import { inputClass } from "~/utils/styleClasses";
import FormBtn from "./FormBtn";
import SearchInputWithDropdown, { ItemType } from "./SearchInputWithDropdown";
import { product_brands, product_models, product_types } from "@prisma/client";
import ReadOnlyWithClearInput from "./ReadOnlyWithClearInput";

const getItemByType = (item: ItemType, type: "brand" | "model" | "type") => {
  switch (type) {
    case "brand":
      const { brand_id, brand_name } = item as product_brands;
      return { id: brand_id, name: brand_name };
    case "model":
      const { model_id, model_name } = item as product_models;
      return { id: model_id, name: model_name };
    case "type":
      const { type_id, type_name } = item as product_types;
      return { id: type_id, name: type_name };
  }
};

const TaxonomyField = ({
  taxoName,
  inputError,
  existingItem,
}: {
  taxoName: "brand" | "model" | "type";
  inputError: any;
  existingItem?: product_brands | product_models | product_types;
}) => {
  const [selectedItem, setSelectedItem] = useState<ItemType | null>(null);
  const [isNewItem, setIsNewItem] = useState(false);
  const [isFirstRender, setIsFirstRender] = useState(true);
  const newInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isFirstRender) {
      if (!existingItem) return () => setIsFirstRender(false);
      setSelectedItem(existingItem);
    }
    return () => setIsFirstRender(false);
  }, []);

  return (
    <div className="mb-2">
      <h4 className="label-text">Product {taxoName}</h4>
      <div className="flex items-start gap-2">
        {isNewItem ? (
          <label className={`${inputClass} flex flex-auto items-center gap-2`}>
            <input
              id={`new${taxoName}`}
              name={`new${taxoName}`}
              type="text"
              placeholder={`Defined new ${taxoName} here...`}
              className="grow bg-transparent focus:outline-0"
              ref={newInputRef}
            />
            <XMarkIcon
              className="h-5 w-5 opacity-70"
              onClick={() => {
                if (newInputRef.current) newInputRef.current.value = "";
                setIsNewItem(false);
              }}
            />
          </label>
        ) : selectedItem ? (
          <ReadOnlyWithClearInput
            name={taxoName}
            id={taxoName}
            value={getItemByType(selectedItem, taxoName).id}
            label={getItemByType(selectedItem, taxoName).name}
            onClear={() => setSelectedItem(null)}
          />
        ) : (
          <>
            <div className="flex-1">
              <SearchInputWithDropdown
                dataType={`${taxoName}s`}
                onItemClick={(item: ItemType) => setSelectedItem(item)}
                isFixed={false}
              />
            </div>
            <FormBtn
              onClick={(e) => {
                e.preventDefault();
                setIsNewItem(true);
              }}
            >
              <SquaresPlusIcon className="h-5 w-5 stroke-2" />
            </FormBtn>
          </>
        )}
      </div>
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

export default TaxonomyField;
