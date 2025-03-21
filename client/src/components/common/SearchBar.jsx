import React, { useEffect, useState, memo } from "react";

import { useDispatch, useSelector } from "react-redux";
import { setSearch } from "../../Redux/slices/CategorySlice";
import { debounce } from "lodash";

const SearchBar = () => {
  const dispatch = useDispatch();
  const { search } = useSelector((state) => state.category);
  const [inputValue, setInputValue] = useState(search);
  const debouncedSearch = debounce((query) => {
    dispatch(setSearch(query));
  }, 500);

  useEffect(() => {
    debouncedSearch(inputValue);
    return () => debouncedSearch.cancel();
  }, [inputValue]);

  return (
    <div className="flex w-4/6 overflow-hidden rounded-full border border-gray-400 bg-gray-300 shadow-sm hover:shadow-lg md:w-1/2">
      <div className="grow">
        <input
          type="search"
          placeholder="Where you want to go?"
          className="h-full w-full border-none py-2 px-4 text-sm  focus:outline-none md:text-lg"
          onChange={(e) => setInputValue(e.target.value)}
          value={inputValue}
        />
      </div>
      <div className="bg-blue flex cursor-pointer  items-center bg-orange-400 active:bg-orange-500 transition-shadow text-white">
        <button className="flex rounded-r-full bg-orange-400 py-2 px-4 md:p-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={3}
            stroke="currentColor"
            className="mt-1 h-4 w-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
            />
          </svg>
          <span className="ml-1 hidden md:block">Search</span>
        </button>
      </div>
    </div>
  );
};

export default memo(SearchBar);
