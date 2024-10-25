import { SquaresPlusIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { Prisma, type products } from "@prisma/client";
import { useEffect, useState } from "react";
import { inputClass, respTDClass, respTRClass } from "~/utils/styleClasses";
import { getCurrencyString } from "../utils/formatters";
import FormBtn from "./FormBtn";
import ReadOnlyWithClearInput from "./ReadOnlyWithClearInput";
import SearchInputWithDropdown, { ItemType } from "./SearchInputWithDropdown";
import { error } from "~/utils/errors";

type PsvType = {
  row_id: string;
  product_id: string;
  quantity: number;
  price: number;
};

const QuoteNewProductRow = ({
  rowId,
  createdProduct,
  dispatcher,
  setAlertData,
}: {
  rowId: string;
  createdProduct?: products;
  dispatcher: React.Dispatch<any>;
  setAlertData: React.Dispatch<React.SetStateAction<error | null>>;
}) => {
  const [selectedProduct, setSelectedProduct] = useState<products | null>(null);
  const [qty, setQty] = useState(1);
  const [itemTotal, setItemTotal] = useState(0);

  useEffect(() => {
    if (!createdProduct) return;
    setSelectedProduct(createdProduct);
  }, [createdProduct]);

  useEffect(() => {
    if (!selectedProduct) return;
    setItemTotal(Prisma.Decimal.mul(selectedProduct.price, qty).toNumber());
  }, [selectedProduct, qty]);

  const handleSelect = (product: products) => {
    setSelectedProduct(product);
    const { product_id, price } = product;
    dispatcher({
      type: "update",
      row_id: rowId,
      product_id,
      qty: 1,
      price,
    });
  };

  const handleQtyInput = (new_qty: number) => {
    setQty(new_qty);
    dispatcher({ type: "update", row_id: rowId, quantity: new_qty });
  };

  const handleDeleteBtn = (deletedRow_id: string) => {
    setSelectedProduct(null);
    dispatcher({ type: "remove", row_id: deletedRow_id });
  };

  return (
    <tr className={respTRClass}>
      <td
        colSpan={selectedProduct ? 1 : 4}
        data-label="Product: "
        className={respTDClass}
      >
        {selectedProduct ? (
          <ReadOnlyWithClearInput
            name={`np_${rowId}_id`}
            id={`np_${rowId}_id`}
            value={selectedProduct.product_id}
            label={`${selectedProduct.brand_name} - ${
              selectedProduct.type_name
            } - ${selectedProduct.model_name} - ${getCurrencyString(
              selectedProduct.price
            )}`}
            onClear={() => handleDeleteBtn(rowId)}
          />
        ) : (
          <div className="flex items-start gap-2">
            <div className="flex-1">
              <SearchInputWithDropdown
                dataType="products"
                setAlertData={setAlertData}
                onItemClick={(item: ItemType) => handleSelect(item as products)}
              />
            </div>
            <FormBtn
              onClick={(e) => {
                e.preventDefault();
                setSelectedProduct(null);
                dispatcher({
                  type: "update",
                  row_id: rowId,
                  product_id: "-1",
                  qty: 1,
                  price: 0,
                });
              }}
            >
              <SquaresPlusIcon className="h-5 w-5 stroke-2" />
            </FormBtn>
          </div>
        )}
      </td>
      {selectedProduct && (
        <>
          <td data-label="Quantity: " className={respTDClass}>
            <div className="relative">
              <input
                className={`${inputClass} mb-2 md:mb-0`}
                name={`np_${rowId}_qty`}
                id={`np_${rowId}_qty`}
                type="number"
                min="1"
                value={qty.toString()}
                onChange={(e) => handleQtyInput(parseInt(e.target.value))}
                onBlur={(e) => {
                  const val = parseInt(e.target.value);
                  if (isNaN(val) || val < 1) {
                    handleQtyInput(1);
                  }
                }}
              />
              <FormBtn
                className="absolute right-0 bg-transparent border-0 rounded-l-none"
                onClick={(e) => {
                  e.preventDefault();
                  handleDeleteBtn(rowId);
                }}
              >
                <XMarkIcon className="h-5 w-5 stroke-2" />
              </FormBtn>
            </div>
          </td>
          <td
            data-label="Unit price: "
            className={`${respTDClass} md:text-right`}
          >
            {getCurrencyString(selectedProduct.price)}
          </td>
          <td
            data-label="Item total: "
            className={`${respTDClass} md:text-right`}
          >
            {getCurrencyString(itemTotal)}
          </td>
        </>
      )}
    </tr>
  );
};
export default QuoteNewProductRow;
