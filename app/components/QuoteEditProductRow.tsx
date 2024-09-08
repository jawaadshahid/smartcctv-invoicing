import { Prisma } from "@prisma/client";
import { useEffect, useState } from "react";
import { inputClass, respTDClass, respTRClass } from "~/utils/styleClasses";
import { getCurrencyString } from "../utils/formatters";
import FormBtn from "./FormBtn";

type PivType = {
  row_id: string;
  name: string;
  quantity: number;
  price: number;
};

const QuoteEditProductRow = ({
  rowId,
  productInputValue,
  dispatcher,
}: {
  rowId: string;
  productInputValue: PivType;
  dispatcher: React.Dispatch<any>;
}) => {
  const {
    price,
    quantity,
    name: productName,
  } = productInputValue || {
    price: 0,
    quantity: 1,
    productName: "",
  };
  const [itemTotal, setItemTotal] = useState(price * (quantity || 1));

  useEffect(() => {
    setItemTotal(price * (quantity || 1));
  }, [price, quantity]);

  const handleNameInput = (newProductName: string) => {
    dispatcher({
      type: "update",
      row_id: rowId,
      name: newProductName,
    });
  };

  const handleQtyInput = (new_qty: number) => {
    dispatcher({ type: "update", row_id: rowId, quantity: new_qty });
  };

  const handlePriceInput = (new_price: number) => {
    dispatcher({
      type: "update",
      row_id: rowId,
      price: new Prisma.Decimal(new_price),
    });
  };

  const handleDeleteBtn = (deletedRow_id: string) => {
    dispatcher({ type: "remove", row_id: deletedRow_id });
  };

  return (
    <tr className={respTRClass}>
      <td data-label="Product: " className={respTDClass}>
        <input
          type="text"
          className={inputClass}
          name={`ep_${rowId}_name`}
          id={`ep_${rowId}_name`}
          value={productName}
          onChange={(e) => {
            handleNameInput(e.target.value);
          }}
        />
      </td>
      <td data-label="Quantity: " className={respTDClass}>
        <div className="relative">
          <input
            className={inputClass}
            name={`ep_${rowId}_qty`}
            id={`ep_${rowId}_qty`}
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
      <td data-label="Unit price: " className={`${respTDClass} md:text-right`}>
        <input
          className={inputClass}
          name={`ep_${rowId}_price`}
          id={`ep_${rowId}_price`}
          type="number"
          min="0"
          step="any"
          value={price.toString()}
          onChange={(e) => {
            const val = e.target.value;
            const pennies = val.split(".")[1];
            if (!pennies || (pennies && pennies.length <= 2))
              handlePriceInput(Number(val));
          }}
          onBlur={(e) => {
            const val = Number(e.target.value);
            if (isNaN(val) || val <= 0) {
              handlePriceInput(0);
            }
          }}
        />
      </td>
      <td data-label="Item total: " className={`${respTDClass} md:text-right`}>
        {itemTotal ? getCurrencyString(itemTotal) : " - "}
      </td>
    </tr>
  );
};
export default QuoteEditProductRow;
