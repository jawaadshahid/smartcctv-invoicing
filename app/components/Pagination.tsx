import { Form, useFetcher } from "@remix-run/react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";

type OnDataLoaded = (fetchedData: any) => void;

type PaginationProps = {
  className: string;
  onDataLoaded: OnDataLoaded;
  totalCount: number;
  pageSize?: number;
  _action: string;
};

const Pagination = ({
  className,
  onDataLoaded,
  totalCount,
  pageSize = 10,
  _action,
}: PaginationProps) => {
  const fetcher = useFetcher();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageCount, setPageCount] = useState(Math.ceil(totalCount / pageSize));

  const gotoPrevPage = () => {
    setCurrentPage((oldPageNumber) => oldPageNumber - 1);
  };
  const gotoNextPage = () => {
    setCurrentPage((oldPageNumber) => oldPageNumber + 1);
  };

  useEffect(() => {
    setPageCount(Math.ceil(totalCount / pageSize));
    fetcher.submit(
      { _action, skip: pageSize * (currentPage - 1), take: pageSize },
      { method: "post" }
    );
  }, [currentPage, totalCount, pageSize]);

  useEffect(() => {
    if (!fetcher.data) return;
    onDataLoaded(fetcher.data);
  }, [fetcher.data]);

  if (totalCount <= pageSize) return <></>;

  return (
    <div className={`btn-group ${className}`}>
      <button
        className="btn"
        disabled={currentPage === 1}
        onClick={() => gotoPrevPage()}
      >
        <ChevronLeftIcon className="h-5 w-5 stroke-2" />
      </button>
      <button className="btn">
        {currentPage} of {pageCount}
      </button>
      <button
        className="btn"
        disabled={currentPage === pageCount}
        onClick={() => gotoNextPage()}
      >
        <ChevronRightIcon className="h-5 w-5 stroke-2" />
      </button>
    </div>
  );
};

export default Pagination;
