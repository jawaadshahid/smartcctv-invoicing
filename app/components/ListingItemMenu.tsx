import React, { useState } from "react";
import FormBtn from "./FormBtn";
import { EllipsisHorizontalIcon, XMarkIcon } from "@heroicons/react/24/outline";
import classNames from "classnames";

type Props = {
  children: React.ReactNode;
};

const ListingItemMenu = ({ children }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const overlayClassNames = classNames({
    "absolute md:static inset-0 flex gap-x-4 items-center justify-end px-4 md:px-0":
      true,
    "bg-black/[.5] md:bg-transparent": isOpen,
  });

  return (
    <div className={overlayClassNames}>
      <div
        className={`btn-group ${classNames({
          "md:flex": true,
          hidden: !isOpen,
        })}`}
      >
        {children}
      </div>
      <FormBtn
        className={classNames({ "md:hidden": true, hidden: !isOpen })}
        onClick={() => setIsOpen(false)}
      >
        <XMarkIcon className="h-5 w-5 stroke-2" />
      </FormBtn>
      <div
        className={`absolute inset-0 ${classNames({ "md:hidden": true, hidden: isOpen })}`}
        onClick={() => setIsOpen(true)}
      / >
    </div>
  );
};

export default ListingItemMenu;
