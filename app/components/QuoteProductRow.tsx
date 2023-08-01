import type { products } from "@prisma/client";
import { useEffect, useState } from "react";
import {
  inputClass,
  resTDClass,
  resTRClass,
  selectClass,
} from "~/utils/styleClasses";

type PsvType = {
  row_id: string;
  product_id: string;
  qty: number;
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
  const { price, qty, product_id } = currPSV || {
    price: 0,
    qty: 1,
    product_id: "",
  };
  const [subtotal, setSubtotal] = useState(price * qty);

  useEffect(() => {
    setSubtotal(price * qty);
  }, [price, qty]);

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
    dispatchPSV({ type: "update", row_id: rowId, qty: new_qty });
  };

  return (
    <tr className={resTRClass}>
      <td
        colSpan={product_id ? 1 : 4}
        data-label="Product"
        className={resTDClass}
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
          {products.map(({ product_id, brand_name, type_name, model_name }) => {
            return (
              <option key={product_id} value={product_id}>
                {brand_name} - {type_name} - {model_name}
              </option>
            );
          })}
          <option value="-1">Add new product +</option>
        </select>
      </td>
      {product_id && (
        <>
          <td data-label="Quantity" className={resTDClass}>
            <input
              className={inputClass}
              name={`p_${rowId}_qty`}
              id={`p_${rowId}_qty`}
              type="number"
              min="1"
              value={qty}
              onChange={(e) => {
                const numval = parseInt(e.target.value);
                handleQtyInput(!isNaN(numval) && numval >= 0 ? numval : 1);
              }}
            />
          </td>
          <td data-label="Unit (£)" className={`${resTDClass} md:text-right`}>
            {price ? price : " - "}
          </td>
          <td
            data-label="Subtotal (£)"
            className={`${resTDClass} md:text-right`}
          >
            {subtotal ? subtotal : " - "}
          </td>
        </>
      )}
    </tr>
  );
};
export default QuoteProductRow;
