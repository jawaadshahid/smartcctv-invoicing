import { ReactNode, useEffect, useRef, useState } from "react";
import SearchInput from "./SearchInput";
import classNames from "classnames";

export type ItemType = {
  id: number;
  label: string;
};

type OnItemClick = (item: ItemType) => void;

const ItemDropdown = ({
  onItemClick,
  dataType,
  items,
}: {
  onItemClick: OnItemClick;
  dataType: string;
  items: any[];
}): ReactNode => {
  if (items.length === 0) return <></>;
  return (
    <ul tabIndex={0} className="my-0 p-2 menu dropdown-content bg-base-100">
      {items.map((item: any) => {
        let id = 0,
          label = "";
        switch (dataType) {
          case "customers":
            id = item.customer_id;
            label = `${item.name} - ${item.address}`;
        }
        return (
          <li key={id} className="m-0 p-0">
            <a
              className="no-underline"
              onClick={() => {
                onItemClick({ id, label });
              }}
            >
              {label}
            </a>
          </li>
        );
      })}
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
        className={classNames({ "rounded-none": isActive })}
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
