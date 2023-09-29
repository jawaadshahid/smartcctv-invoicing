import type { products } from "@prisma/client";
import { useEffect, useState } from "react";
import {
  inputClass,
  respTDClass,
  respTRClass,
  selectClass,
} from "~/utils/styleClasses";
import { getCurrencyString } from "../utils/formatters";
import FormBtn from "./FormBtn";

type PsvType = {
  row_id: string;
  product_id: string;
  quantity: number;
  price: number;
};

const QuoteNewProductRow = ({
  rowId,
  products,
  productSelectValue,
  dispatcher,
}: {
  rowId: string;
  products: products[];
  productSelectValue: PsvType;
  dispatcher: React.Dispatch<any>;
}) => {
  const { price, quantity, product_id } = productSelectValue || {
    price: 0,
    quantity: 1,
    product_id: "",
  };
  const [itemTotal, setItemTotal] = useState(price * (quantity || 1));

  useEffect(() => {
    setItemTotal(price * (quantity || 1));
  }, [price, quantity]);

  const handleSelect = (new_product_id: string) => {
    const selectedProd: products | undefined = products.find(
      (product) => parseInt(new_product_id) === product.product_id
    );
    dispatcher({
      type: "update",
      row_id: rowId,
      product_id: new_product_id,
      qty: 1,
      price: selectedProd ? selectedProd.price : 0,
    });
  };

  const handleQtyInput = (new_qty: number) => {
    dispatcher({ type: "update", row_id: rowId, quantity: new_qty });
  };

  const handleDeleteBtn = (deletedRow_id: string) => {
    dispatcher({ type: "remove", row_id: deletedRow_id });
  };

  return (
    <tr className={respTRClass}>
      <td
        colSpan={product_id ? 1 : 4}
        data-label="Product"
        className={respTDClass}
      >
        <select
          className={selectClass}
          name={`np_${rowId}_id`}
          id={`np_${rowId}_id`}
          value={product_id}
          onChange={(e) => {
            handleSelect(e.target.value);
          }}
        >
          <option disabled value="">
            Select a product...
          </option>
          <option value="-1">Add new product +</option>
          {products.map(
            ({ product_id, brand_name, type_name, model_name, price }) => {
              return (
                <option key={product_id} value={product_id}>
                  {brand_name} - {type_name} - {model_name} -{" "}
                  {getCurrencyString(price)}
                </option>
              );
            }
          )}
        </select>
      </td>
      {product_id && (
        <>
          <td data-label="Quantity" className={respTDClass}>
            <div className="relative">
              <input
                className={inputClass}
                name={`np_${rowId}_qty`}
                id={`np_${rowId}_qty`}
                type="number"
                min="1"
                value={quantity.toString()}
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
                &#10005;
              </FormBtn>
            </div>
          </td>
          <td
            data-label="Unit price"
            className={`${respTDClass} md:text-right`}
          >
            {price ? getCurrencyString(price) : " - "}
          </td>
          <td
            data-label="Item total"
            className={`${respTDClass} md:text-right`}
          >
            {itemTotal ? getCurrencyString(itemTotal) : " - "}
          </td>
        </>
      )}
    </tr>
  );
};
export default QuoteNewProductRow;
