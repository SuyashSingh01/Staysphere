import arrow from "../../assets/icons/arrow.svg";

// eslint-disable-next-line react/prop-types
function ArrowButton({ onClickHandler, direction, style }) {
  return (
    <button
      onClick={onClickHandler}
      className={`absolute top-1/2 transform -translate-y-1/2 flex justify-center items-center w-[34px] h-[34px] rounded-full z-10 ${style}`}
    >
      <img
        className={`w-3 h-3  ${direction === "next" ? "" : "rotate-180"}`}
        src={arrow}
        alt="arrow"
      />
    </button>
  );
}

export default ArrowButton;
