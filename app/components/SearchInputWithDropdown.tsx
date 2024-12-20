import {
  customers,
  invoices,
  product_brands,
  product_models,
  product_types,
  products,
  quotes,
} from "@prisma/client";
import classNames from "classnames";
import { ReactNode, useState } from "react";
import { error } from "~/utils/errors";
import { getCurrencyString } from "~/utils/formatters";
import SearchInput from "./SearchInput";

export type ItemType =
  | customers
  | products
  | quotes
  | invoices
  | product_brands
  | product_models
  | product_types;

export type OnItemClick = (item: ItemType) => void;

const Item = ({
  dataType,
  item,
  onItemClick,
}: {
  dataType: string;
  item: any;
  onItemClick: OnItemClick;
}) => {
  let label = "";
  switch (dataType) {
    case "customers":
      label = `${item.name} - ${item.address}`;
      break;
    case "products":
      label = `${item.brand_name} - ${item.type_name} - ${
        item.model_name
      } - ${getCurrencyString(item.price)}`;
      break;
    case "brands":
      label = item.brand_name;
      break;
    case "models":
      label = item.model_name;
      break;
    case "types":
      label = item.type_name;
      break;
  }
  return (
    <li className="m-0 p-0">
      <a className="no-underline" onClick={() => onItemClick(item)}>
        {label}
      </a>
    </li>
  );
};

const ItemDropdown = ({
  onItemClick,
  dataType,
  items,
}: {
  onItemClick: OnItemClick;
  dataType: string;
  items: ItemType[];
}): ReactNode => {
  if (items.length === 0) return <></>;
  return (
    <ul tabIndex={0} className="my-0 p-2 menu dropdown-content bg-base-100">
      {items.map((item: ItemType, ind: number) => (
        <Item
          key={ind}
          dataType={dataType}
          item={item}
          onItemClick={onItemClick}
        />
      ))}
    </ul>
  );
};

type SearchInputWithDropdown = {
  dataType:
    | "customers"
    | "products"
    | "quotes"
    | "invoices"
    | "brands"
    | "models"
    | "types";
  onItemClick: OnItemClick;
  setAlertData: React.Dispatch<React.SetStateAction<error | null>>;
  isFixed?: boolean;
};

const SearchInputWithDropdown = ({
  dataType,
  onItemClick,
  setAlertData,
  isFixed = true,
}: SearchInputWithDropdown) => {
  const [items, setItems] = useState([]);
  const [isActive, setIsActive] = useState(false);
  return (
    <div
      onClick={() => setIsActive(false)}
      className={classNames({
        fixed: isFixed && isActive,
        absolute: !isFixed && isActive,
        "inset-0 z-20 bg-black/[.5]": isActive,
      })}
    >
      <SearchInput
        size={1}
        isRounded={!isActive}
        _action={`${dataType}_search`}
        placeholder={`start typing to filter ${dataType}...`}
        onClick={(e) => {
          setIsActive(true);
          e.stopPropagation();
        }}
        onDataLoaded={(fetchedData) => {
          console.log({fetchedData})
          if (fetchedData[dataType]) setItems(fetchedData[dataType]);
          if (fetchedData.error) setAlertData(fetchedData.error);
        }}
      />
      {isActive && (
        <ItemDropdown
          dataType={dataType}
          items={items}
          onItemClick={(item: ItemType) => {
            setItems([]);
            setIsActive(false);
            onItemClick(item);
          }}
        />
      )}
    </div>
  );
};

export default SearchInputWithDropdown;
