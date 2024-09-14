import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useFetcher } from "@remix-run/react";
import { InputHTMLAttributes, useEffect, useRef, useState } from "react";

type OnDataLoaded = (fetchedData: any) => void;

interface SearchInput<T> extends InputHTMLAttributes<T> {
  onDataLoaded: OnDataLoaded;
  _action: string;
  inputRef: React.MutableRefObject<HTMLInputElement | null>
}

const SearchInput = ({
  placeholder = "search",
  inputRef,
  onDataLoaded,
  _action,
  ...props
}: SearchInput<HTMLInputElement>) => {
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

  return (
    <label className="input input-bordered flex flex-auto items-center gap-2">
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
      ) : searchTerm.length > 0 ? (
        <XMarkIcon
          className="h-5 w-5 opacity-70"
          onClick={() => {
            setSearchTerm("");
            searchInputRef?.current?.focus();
          }}
        />
      ) : (
        <MagnifyingGlassIcon className="h-5 w-5 opacity-70" />
      )}
    </label>
  );
};

export default SearchInput;
