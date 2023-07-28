import type { ButtonHTMLAttributes } from "react";
import cn from "classnames";

interface FormBtn<T> extends ButtonHTMLAttributes<T> {
  isSubmitting?: boolean;
}

const FormBtn = ({ isSubmitting, className, disabled, ...props }: FormBtn<HTMLButtonElement>) => {
  const btnClass = cn({
    "btn": true,
    "loading": isSubmitting && props.type === "submit",
    ...(className && {[`${className}`] : true})
  });
  return (
    <button className={btnClass} disabled={disabled || isSubmitting} {...props} />
  );
};

export default FormBtn;
