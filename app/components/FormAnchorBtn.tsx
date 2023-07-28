import type { AnchorHTMLAttributes } from "react";
import cn from "classnames";

interface FormAnchorButton<T> extends AnchorHTMLAttributes<T> {
  isSubmitting?: boolean;
}

const FormAnchorButton = ({ isSubmitting, className, ...props }: FormAnchorButton<HTMLAnchorElement>) => {
  const btnClass = cn({
    "btn": true,
    "btn-disabled": isSubmitting,
    ...(className && {[`${className}`] : true})
  });
  return (
    <a className={btnClass} {...props} />
  );
};

export default FormAnchorButton;
