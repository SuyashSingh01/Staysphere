import { useEffect, useState } from "react";

function DatePicker({
  dateAfterToday = 0,
  onDateChange,
  maxSeletedDate = null,
}) {
  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    const today = new Date();
    const defaultDate = new Date(today);
    defaultDate.setDate(today.getDate() + dateAfterToday);

    const formattedDate = defaultDate.toISOString().split("T")[0]; // Extract 'YYYY-MM-DD'
    setCurrentDate(formattedDate);

    if (onDateChange) {
      onDateChange(formattedDate);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateAfterToday]);

  const handleDateChange = (e) => {
    const selectedDate = e.target.value;
    setCurrentDate(selectedDate);
    if (onDateChange) {
      onDateChange(selectedDate);
    }
  };

  return (
    <div className="text-xs lg:text-base">
      <input
        type="date"
        id="datePicker"
        min={new Date().toISOString().split("T")[0]}
        max={maxSeletedDate && maxSeletedDate}
        value={currentDate}
        onChange={handleDateChange}
      />
    </div>
  );
}

export default DatePicker;
