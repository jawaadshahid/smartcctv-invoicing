import type { products } from "@prisma/client";
import { useEffect, useState } from "react";
import { getCurrencyString } from "../utils/formatters";
import {
  inputClass,
  respTDClass,
  respTRClass,
  selectClass,
} from "~/utils/styleClasses";

type PsvType = {
  row_id: string;
  product_id: string;
  quantity: number;
  price: number;
};

const QuoteProductRow = ({
  rowId,
  products,
  productSelectValues,
  dispatchPSV,
}: {
  rowId: string;
  products: products[];
  productSelectValues: PsvType[];
  dispatchPSV: any;
}) => {
  const currPSV = productSelectValues.find((p) => p.row_id === rowId);
  const { price, quantity, product_id } = currPSV || {
    price: 0,
    quantity: 1,
    product_id: "",
  };
  const [itemTotal, setItemTotal] = useState(price * quantity);

  useEffect(() => {
    setItemTotal(price * (quantity || 1));
  }, [price, quantity]);

  const handleSelect = (new_product_id: string) => {
    const selectedProd: products | undefined = products.find(
      (product) => parseInt(new_product_id) === product.product_id
    );
    dispatchPSV({
      type: "update",
      row_id: rowId,
      product_id: new_product_id,
      qty: 1,
      price: selectedProd ? selectedProd.price : 0,
    });
  };

  const handleQtyInput = (new_qty: number) => {
    dispatchPSV({ type: "update", row_id: rowId, quantity: new_qty });
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
          name={`p_${rowId}_id`}
          id={`p_${rowId}_id`}
          value={product_id}
          onChange={(e) => {
            handleSelect(e.target.value);
          }}
        >
          <option disabled value="">
            Select a product...
          </option>
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
          <option value="-1">Add new product +</option>
        </select>
      </td>
      {product_id && (
        <>
          <td data-label="Quantity" className={respTDClass}>
            <input
              className={inputClass}
              name={`p_${rowId}_qty`}
              id={`p_${rowId}_qty`}
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => handleQtyInput(parseInt(e.target.value))}
              onBlur={(e) => {
                const val = parseInt(e.target.value);
                if (isNaN(val) || val < 1) {
                  handleQtyInput(1);
                }
              }}
            />
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
export default QuoteProductRow;
