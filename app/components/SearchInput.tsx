import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useFetcher } from "@remix-run/react";
import classNames from "classnames";
import { InputHTMLAttributes, useEffect, useRef, useState } from "react";
import FormBtn from "./FormBtn";

export type OnDataLoaded = (fetchedData: any) => void;

export interface SearchInputProps<T> extends InputHTMLAttributes<T> {
  onDataLoaded: OnDataLoaded;
  onClear?: Function;
  _action: string;
  isRounded?: boolean;
  inputRef?: React.MutableRefObject<HTMLInputElement | null>;
}

const SearchInput = ({
  placeholder = "search",
  inputRef,
  onDataLoaded,
  onClear,
  _action,
  isRounded = true,
  ...props
}: SearchInputProps<HTMLInputElement>) => {
  const fetcher = useFetcher();
  const [searchTerm, setSearchTerm] = useState("");
  const [doingTermSearch, setDoingTermSearch] = useState(false);
  const [isFirstRendered, setIsFirstRendered] = useState(false);
  const searchInputRef = inputRef || useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isFirstRendered) {
      setDoingTermSearch(true);
      const termSearchTimeout = setTimeout(() => {
        fetcher.submit(
          { _action, search_term: searchTerm },
          { method: "post" }
        );
      }, 600);
      return () => clearTimeout(termSearchTimeout);
    }
    return () => setIsFirstRendered(true);
  }, [searchTerm]);

  useEffect(() => {
    setDoingTermSearch(false);
    if (!fetcher.data) return;
    onDataLoaded(fetcher.data);
  }, [fetcher.data]);

  const isRoundedClass = classNames({
    "rounded-none": !isRounded,
  });

  return (
    <label
      className={`relative input input-bordered flex flex-auto items-center gap-2 ${isRoundedClass}`}
    >
      <input
        type="text"
        className="grow bg-transparent focus:outline-0"
        placeholder={placeholder}
        value={searchTerm}
        ref={searchInputRef}
        onChange={(e) => setSearchTerm(e.target.value)}
        {...props}
      />
      {doingTermSearch ? (
        <a className="btn btn-ghost btn-square loading w-5" />
      ) : searchInputRef.current && searchInputRef.current.value.length > 0 ? (
        <FormBtn
          className={`absolute -right-px bg-transparent border-0 rounded-l-none ${isRoundedClass}`}
          onClick={(e) => {
            e.preventDefault();
            setSearchTerm("");
            searchInputRef.current?.focus();
            if (onClear) onClear();
            e.stopPropagation();
          }}
        >
          <XMarkIcon className="h-5 w-5 stroke-2" />
        </FormBtn>
      ) : (
        <MagnifyingGlassIcon className="h-5 w-5 opacity-70" />
      )}
    </label>
  );
};

export default SearchInput;
