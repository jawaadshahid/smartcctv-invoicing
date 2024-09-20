import { XMarkIcon } from "@heroicons/react/24/outline";
import { InputHTMLAttributes } from "react";
import { inputClass } from "~/utils/styleClasses";

interface ReadOnlyInput<T> extends InputHTMLAttributes<T> {
  onClear: Function;
  label: string;
}

const ReadOnlyWithClearInput = ({
  label,
  onClear,
  ...props
}: ReadOnlyInput<HTMLInputElement>) => {
  return (
    <label className={`${inputClass} flex flex-auto items-center gap-2`}>
      <input type="hidden" {...props} />
      <input
        readOnly
        value={label}
        className="grow bg-transparent focus:outline-0"
      />
      <XMarkIcon className="h-5 w-5 opacity-70" onClick={() => onClear()} />
    </label>
  );
};

export default ReadOnlyWithClearInput;
