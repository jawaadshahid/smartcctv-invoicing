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

type OnItemClick = (item: ItemType) => void;

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

type SearchInputWithDropdownProps = {
  dataType:
    | "customers"
    | "products"
    | "quotes"
    | "invoices"
    | "brands"
    | "models"
    | "types";
  onItemClick: OnItemClick;
};

const SearchInputWithDropdown = ({
  dataType,
  onItemClick,
}: SearchInputWithDropdownProps) => {
  const [items, setItems] = useState([]);
  const [isActive, setIsActive] = useState(false);
  return (
    <div
      onClick={() => setIsActive(false)}
      className={classNames({
        "fixed inset-0 z-20 bg-black/[.5]": isActive,
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
          if (fetchedData[dataType]) setItems(fetchedData[dataType]);
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
