import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useFetcher } from "@remix-run/react";
import { InputHTMLAttributes, useEffect, useState } from "react";

type OnDataLoaded = (fetchedData: any) => void;

interface SearchInput<T> extends InputHTMLAttributes<T> {
  onDataLoaded: OnDataLoaded;
  _action: string
}

const SearchInput = ({
  placeholder = "search",
  onDataLoaded,
  _action,
  ...props
}: SearchInput<HTMLInputElement>) => {
  const fetcher = useFetcher();
  const [searchTerm, setSearchTerm] = useState("");
  const [doingTermSearch, setDoingTermSearch] = useState(false);
  const [isFirstRendered, setIsFirstRendered] = useState(false);

  useEffect(() => {
    if (isFirstRendered) {
      setDoingTermSearch(true);
      const termSearchTimeout = setTimeout(() => {
        fetcher.submit({ _action, search_term: searchTerm }, { method: "post" });
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
    <label className="input input-bordered flex items-center gap-2">
      <input
        type="text"
        className="grow bg-transparent focus:outline-0"
        placeholder={placeholder}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        {...props}
      />
      {doingTermSearch ? (
        <a className="btn btn-ghost btn-square loading w-5" />
      ) : (
        <MagnifyingGlassIcon className="h-5 w-5 opacity-70" />
      )}
    </label>
  );
};

export default SearchInput;
