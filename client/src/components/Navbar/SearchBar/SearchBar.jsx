import { useState } from "react";
import search_icon from "../../../assets/icons/search-icon.svg";
import filter_icon from "../../../assets/icons/filter-icon.svg";
// import FilterModal from "../FilterModal/FilderModal";

const SearchBar = ({ device = "desktop" }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isFilterModalOpen, setFilterModalOpen] = useState(false);

  function handleSearchButtonClick() {
    console.log("searchQuery - ", searchQuery);
  }

  function handleKeyPress(event) {
    if (event.key === "Enter") {
      handleSearchButtonClick();
    }
  }

  return (
    <>
      {device === "desktop" && (
        <div className="flex items-center border border-gray-300 rounded-full hover:shadow-md shadow-sm pr-2">
          {/* search input */}
          <input
            className="px-4 py-3 font-medium text-sm w-[100px] rounded-l-full mr-1"
            type="text"
            placeholder="Anywhere"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <span className="h-6 w-px bg-gray-200" />
          <button className="px-4 py-3 font-medium text-sm text-gray-800">
            Any week
          </button>
          <span className="h-6 w-px bg-gray-200" />
          <button className="px-4 py-3 font-medium text-sm text-gray-600">
            Add guests
          </button>
          {/* search button */}
          <button
            className="bg-orange-500 p-[10px] rounded-full"
            onClick={handleSearchButtonClick}
          >
            <img className="w-3 h-3 invert" src={search_icon} alt="" />
          </button>
        </div>
      )}
      {device === "mobile" && (
        <div className="flex items-center gap-3  w-full ">
          <div
            className="rounded-full flex-1 relative font-semibold group"
            style={{ boxShadow: "0px 1px 10px #00000029" }}
          >
            <img
              className="w-4 absolute group-focus-within:hidden top-[20px] left-[25px]"
              src={search_icon}
              alt="search icon"
            />
            <input
              className="text-center placeholder:text-black focus:placeholder:opacity-70 w-full h-full rounded-full py-4"
              type="text"
              placeholder="Start your search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
            />
          </div>

          <button
            onClick={() => setFilterModalOpen(true)}
            className="lg:px-4 px-3 py-3 border-[1px] border-gray-400 rounded-full hover:border-gray-600 hover:bg-gray-100 duration-100 flex gap-2 items-center"
          >
            <img className="h-4 w-4" src={filter_icon} alt="filter_icon" />
          </button>
        </div>
      )}

      {/* <FilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setFilterModalOpen(false)}
      /> */}
    </>
  );
};

export default SearchBar;
