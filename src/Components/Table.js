import React, { useState, useEffect } from "react";
import { Headers } from "../Constants/Headers";
import CompanyList from "./CompanyList";

const Table = () => {
  const [page, setPage] = useState(1);
  const [prevDisabled, setPrevDisabled] = useState(true);
  const [nextDisabled, setNextDisabled] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  useEffect(() => {
    page !== 1 ? setPrevDisabled(false) : setPrevDisabled(true);
    page === totalPages ? setNextDisabled(true) : setNextDisabled(false);
  }, [page]);
  // useEffect(()=>{console.log("rendered 1 time")},[])
  const handleTotalPages = (totPages) => {
    setTotalPages(totPages);
  };
  return (
    <div className="relative overflow-auto m-5 sm:rounded-lg ">
      <table className="w-full text-2xl text-left text-gray-500 dark:text-gray-400">
        <thead className="text-xl shadow-md  text-gray-700 uppercase bg-gray-200 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            {/* {console.log(Headers.value)} */}
            {Headers.map((head, idx) => {
              return <th key={`th-${idx}`}>{head}</th>;
            })}
          </tr>
        </thead>
        <div className="m-2"></div>
        <CompanyList
          pageNum={page}
          setTotalPagesCallback={handleTotalPages}
        ></CompanyList>
      </table>

      <div className="flex m-4 justify-center">
        <button
          onClick={() => setPage((page) => page - 1)}
          disabled={prevDisabled}
          className="inline-flex focus:outline-none disabled:opacity-75 items-center px-4 py-2 mr-3 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
        >
          <svg
            aria-hidden="true"
            className="w-5 h-5 mr-2"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l2.293 2.293a1 1 0 010 1.414z"
              clipRule="evenodd"
            ></path>
          </svg>
          Previous
        </button>
        <div className="m-2">{page}</div>
        <button
          onClick={() => setPage((page) => page + 1)}
          disabled={nextDisabled}
          className="inline-flex focus:outline-none disabled:opacity-75 items-center px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
        >
          Next
          <svg
            aria-hidden="true"
            className="w-5 h-5 ml-2"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
              clipRule="evenodd"
            ></path>
          </svg>
        </button>
      </div>
    </div>
  );
};
export default Table;
