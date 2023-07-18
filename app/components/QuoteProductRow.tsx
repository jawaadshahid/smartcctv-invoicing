import type { products } from "@prisma/client";
import { useEffect, useState } from "react";

const QuoteProductRow = ({
  rowId,
  products,
  productSelectValues,
  dispatchPSV,
}: {
  rowId: string;
  products: products[];
  productSelectValues: {
    row_id: string;
    product_id: string;
    qty: number;
    price: number;
  }[];
  dispatchPSV: any;
}) => {
  const TD_CLASSNAME =
    "before:content-[attr(data-label)] before:block before:mb-1 md:before:hidden";
  const inputClass = "input input-bordered w-full";
  const selectClass = "select select-bordered w-full";

  const [qty, setQty] = useState(1);
  const [unitPrice, setUnitPrice] = useState(0);
  const [subtotal, setSubtotal] = useState(0);
  const [productSelectValue, setProductSelectValue] = useState("");

  useEffect(() => {
    setSubtotal(Number(unitPrice * qty));
  }, [qty, unitPrice]);

  useEffect(() => {
    const currPSV = productSelectValues.find((p) => p.row_id === rowId);
    if (currPSV) {
      setProductSelectValue(currPSV.product_id);
      setQty(currPSV.qty);
      setUnitPrice(currPSV.price);
    }
  }, [productSelectValues, rowId]);

  const handleSelect = (row_id: string, product_id: string) => {
    const selectedProd: products | undefined = products.find(
      (product) => parseInt(product_id) === product.product_id
    );
    dispatchPSV({
      type: "update",
      row_id,
      product_id,
      qty: 1,
      price: selectedProd ? selectedProd.price : 0,
    });
  };

  const handleQtyInput = (row_id: string, qty: number) => {
    dispatchPSV({ type: "update", row_id, qty });
  };

  return (
    <tr className="flex flex-col md:table-row">
      <td
        colSpan={productSelectValue ? 1 : 4}
        data-label="Product"
        className={TD_CLASSNAME}
      >
        <select
          className={selectClass}
          name={`p_${rowId}_id`}
          id={`p_${rowId}_id`}
          value={productSelectValue}
          onChange={(e) => {
            handleSelect(rowId, e.target.value);
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
      {productSelectValue && (
        <>
          <td data-label="Quantity" className={TD_CLASSNAME}>
            <input
              className={inputClass}
              name={`p_${rowId}_qty`}
              id={`p_${rowId}_qty`}
              type="number"
              min="1"
              value={qty}
              onChange={(e) => {
                handleQtyInput(rowId, parseInt(e.target.value));
              }}
            />
          </td>
          <td data-label="Unit (£)" className={`${TD_CLASSNAME} md:text-right`}>
            {unitPrice ? unitPrice : " - "}
          </td>
          <td
            data-label="Subtotal (£)"
            className={`${TD_CLASSNAME} md:text-right`}
          >
            {subtotal ? subtotal : " - "}
          </td>
        </>
      )}
    </tr>
  );
};
export default QuoteProductRow;
