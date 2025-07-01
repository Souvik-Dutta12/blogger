import React, { useState } from "react";

const Pagination = ({ totalPosts, postsPerPage, onPageChange }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(totalPosts / postsPerPage);

  const goToPage = (page) => {
    setCurrentPage(page);
    onPageChange(page);
  };

  const getPageNumbers = () => {
    const pages = [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 4) {
        pages.push(1, 2, 3, 4, 5, "...", totalPages);
      } else if (currentPage >= totalPages - 3) {
        pages.push(1, "...", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(
          1,
          "...",
          currentPage - 1,
          currentPage,
          currentPage + 1,
          "...",
          totalPages
        );
      }
    }

    return pages;
  };

  return (
    <div className="w-full flex flex-wrap sm:flex-nowrap justify-center items-center gap-2 my-4 px-4 overflow-x-auto">
      {/* Prev */}
      <button
        onClick={() => goToPage(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-1 text-sm rounded bg-transparent hover:text-white duration-300 cursor-pointer text-neutral-500 disabled:opacity-50"
      >
        <i className="ri-arrow-left-line"></i> Prev
      </button>

      {/* Page Numbers */}
      <div className="flex gap-1 overflow-x-auto scrollbar-thin scrollbar-thumb-zinc-600">
        {getPageNumbers().map((num, idx) =>
          num === "..." ? (
            <span
              key={`ellipsis-${idx}`}
              className="px-3 py-1 text-sm text-zinc-400"
            >
              ...
            </span>
          ) : (
            <button
              key={num}
              onClick={() => goToPage(num)}
              className={`px-3 py-1 text-sm rounded cursor-pointer whitespace-nowrap ${currentPage === num
                  ? "bg-zinc-800 text-white"
                  : "bg-transparent hover:bg-zinc-900 duration-300 text-zinc-600"
                }`}
            >
              {num}
            </button>
          )
        )}
      </div>

      {/* Next */}
      <button
        onClick={() => goToPage(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-1 text-sm rounded bg-transparent hover:text-white duration-300 cursor-pointer text-neutral-500 disabled:opacity-50"
      >
        Next <i className="ri-arrow-right-line"></i>
      </button>
    </div>
  );
};

export default Pagination;
