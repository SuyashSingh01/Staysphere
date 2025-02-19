import { useRef, useState, useEffect, memo, useCallback } from "react";
import { categories } from "../../data/categories.js";
import filter_icon from "../../assets/icons/filter-icon.svg";
import ArrowButton from "../Button/ArrowButton.jsx";
import { setLoading } from "../../Redux/slices/AuthSlice.js";
import { useDispatch, useSelector } from "react-redux";
import { FaFilter } from "react-icons/fa";
import { setSelectedCategory } from "../../Redux/slices/CategorySlice.js";

const CatNavbar = ({ closeFilterModal, openFilterModal }) => {
  const { selectedCategory } = useSelector((state) => state.category);
  const [activeCategory, setActiveCategory] = useState(selectedCategory);
  const scrollContainerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const dispatch = useDispatch();

  // Function to update scroll state
  const updateScrollStates = useCallback(() => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } =
        scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth);
    }
  }, []);

  // Smooth scrolling function
  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -500 : 500,
        behavior: "smooth",
      });
    }
  };

  // Attach event listeners for scrolling and resizing
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener("scroll", updateScrollStates);
      window.addEventListener("resize", updateScrollStates);
      updateScrollStates();
    }

    return () => {
      if (scrollContainer) {
        scrollContainer.removeEventListener("scroll", updateScrollStates);
      }
      window.removeEventListener("resize", updateScrollStates);
    };
  }, [updateScrollStates]);

  // Handle category selection
  const handleCategoryButtonClick = (category) => {
    setActiveCategory(category);
    dispatch(setSelectedCategory(category));
    // make sure the backend call with this category and
    // update the listing data in state

    dispatch(setLoading(true));
    setTimeout(() => {
      dispatch(setLoading(false));
    }, 1500);
  };

  return (
    <nav className="flex justify-around items-center gap-x-10 sm:gap-x-4 sm:py-4 py-1 w-full sticky top-[83px] z-50 bg-white mx-auto">
      {/* Category Navigation */}
      <div className="relative xl:w-[70%] lg:w-[62%] sm:w-full w-[80%] flex justify-between ">
        <div
          ref={scrollContainerRef}
          className="flex items-center gap-8 overflow-x-auto no-scrollbar w-full"
        >
          {categories.map((category) => (
            <button
              key={category.value}
              onClick={() => handleCategoryButtonClick(category.value)}
              className={`bg-white flex flex-col items-center gap-2 whitespace-nowrap pb-2 text-xs  
                  border-b-2 border-gray-700 border-opacity-0 transition-all  
                  ${
                    activeCategory === category.value
                      ? "border-opacity-100 opacity-100 cursor-default"
                      : "hover:opacity-100 hover:border-opacity-40 opacity-70"
                  }`}
            >
              <img
                className="w-6 h-6"
                src={category.icon}
                alt={category.label}
              />
              <span className="font-semibold">{category.label}</span>
            </button>
          ))}
        </div>

        {/* Left Arrow Button */}
        {canScrollLeft && (
          <ArrowButton
            onClickHandler={() => scroll("left")}
            direction="prev"
            style="absolute left-0 bg-orange-400 active:bg-orange-500  border-2 sm:flex border-gray-300 hover:scale-[1.05] hover:shadow-lg z-50"
          />
        )}

        {/* Right Arrow Button */}
        {canScrollRight && (
          <ArrowButton
            onClickHandler={() => scroll("right")}
            direction="next"
            style="absolute right-0 bg-orange-400 active:bg-orange-500 border-2 sm:flex border-gray-300 hover:scale-[1.05] hover:shadow-lg z-50"
          />
        )}
        {/* Filters Section */}
      </div>
      <div className="hidden md:block">
        <button
          className="flex items-center bg-orange-400 active:bg-orange-500 gap-2 border px-3 py-2 rounded-full text-white-700 hover:shadow text-sm sm:text-base m"
          onClick={openFilterModal}
        >
          <FaFilter size={20} color="white" />
          <span className="">Filters</span>
        </button>
      </div>
    </nav>
  );
};

export default memo(CatNavbar);
