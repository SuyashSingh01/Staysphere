import { useState } from "react";
import PropTypes from "prop-types";
import DatePicker from "../DatePicker/DatePicker.jsx";
import tag_icon from "../../../assets/icons/tag-icon.svg";
import flag_icon from "../../../assets/icons/flag.svg";
import { formatNumberWithCommas } from "../../../utility/utils";
import GuestDropdown from "../GuestDropdown/GuestDropdown.jsx";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { addBooking } from "../../../Redux/slices/BookingSlice.js";
import { notification } from "antd";

function BookingSummaryCard({ originalPrice, discountedPrice = 2, place }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { _id, price } = place;
  const [date1, setDate1] = useState(null);
  const [date2, setDate2] = useState(null);

  const [dateDifference, setDateDifference] = useState(5);
  const [guests, setGuests] = useState(1);

  const { user } = useSelector((state) => state.auth);
  // const [dateRange, setDateRange] = useState({ from: null, to: null });

  const [bookingData, setBookingData] = useState({
    name: user?.name || "",
    phone: "",
  });
  // const { noOfGuests, name, phone } = bookingData;

  // handle booking form
  const handleBookingData = (e) => {
    setBookingData({
      ...bookingData,
      [e.target.name]: e.target.value,
    });
  };

  const handleBooking = async () => {
    // User must be signed in to book place

    if (!user) {
      notification.error({
        message: "Please sign in to book place ",
        duration: 1,
      });

      navigate("/register");
      return;
    }

    // BOOKING DATA VALIDATION
    if (numberOfNights < 1) {
      return toast.error("Please select valid dates");
    } else if (guests < 1) {
      return toast.error("No. of guests can't be less than 1");
    } else if (guests > place?.maxGuests) {
      return notification.error({
        message: `Allowed max. no. of guests: ${place.guests}`,
        duration: 1,
        placement: "topLeft",
      });
    } else if (bookingData.phone.trim() === "") {
      return notification.error({
        message: "Phone can't be empty",
        duration: 1,
        placement: "topLeft",
      });
    }
    // send the data to backend server

    try {
      const bookingDetails = {
        checkIn: date1,
        checkOut: date2,
        name: bookingData.name,
        guests,
        phone: bookingData.phone,
        placeId: _id,

        price: numberOfNights * price,
      };
      console.log("bookingDetails", bookingDetails);
      dispatch(addBooking(bookingDetails));

      navigate(`/account/bookings/${_id}/confirm-pay`, {
        state: {
          place,
          bookingDetails,
        },
      });
    } catch (error) {
      notification.error({ message: "Something went wrong!" });
      console.log("Error: ", error.message);
    }
  };

  // useEffect(() => {
  //   localStorage.setItem("date1", date1);
  //   localStorage.setItem("date2", date2);
  //   localStorage.setItem("guests", guests);
  //   localStorage.setItem("numberOfNights", dateDifference);
  // }, [date1, date2, guests, dateDifference]);

  const handleGuestChange = (value) => {
    setGuests(value);
  };

  const calculateDateDifference = (start, end) => {
    if (start && end) {
      const startDate = new Date(start);
      const endDate = new Date(end);
      if (!isNaN(startDate) && !isNaN(endDate)) {
        const diff = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
        setDateDifference(diff > 0 ? diff : 1);
      } else {
        setDateDifference(1);
      }
    } else {
      setDateDifference(5);
    }
  };

  const handleDateChange1 = (date) => {
    setDate1(date);
    calculateDateDifference(date, date2);
  };

  const handleDateChange2 = (date) => {
    setDate2(date);
    calculateDateDifference(date1, date);
  };

  const numberOfNights = dateDifference;
  const total = discountedPrice * numberOfNights;

  return (
    <div className="sticky top-28">
      <div
        className="w-full max-w-[400px] p-6 bg-white border border-gray-300 rounded-xl"
        style={{ boxShadow: "#e6e6e6 0px 0px 8px 2px" }}
      >
        <div className="p-0 flex flex-col gap-4">
          <div className="flex items-baseline gap-1">
            <span className="line-through text-xl text-gray-500">
              ₹{formatNumberWithCommas(89)}
            </span>
            <span className="font-semibold text-xl">
              ₹{formatNumberWithCommas(discountedPrice)}
            </span>
            <span className="text-gray-500">night</span>
          </div>

          <div className="border border-gray-500 rounded-lg overflow-hidden ">
            <div className="grid grid-cols-2 border-b border-gray-500">
              <div className="p-3 border-r border-gray-500">
                <div className="text-xs font-semibold uppercase">CHECK-IN</div>
                <DatePicker
                  onDateChange={handleDateChange1}
                  maxSeletedDate={date2}
                />
              </div>
              <div className="p-3">
                <div className="text-xs font-semibold uppercase">CHECKOUT</div>
                <DatePicker
                  dateAfterToday={5}
                  onDateChange={handleDateChange2}
                />
              </div>
            </div>

            <GuestDropdown
              guests={guests}
              handleGuestChange={handleGuestChange}
            />
          </div>

          <button
            onClick={handleBooking}
            className="w-full h-12 text-base bg-[#ff7738] active:bg-[#ffb638] hover:bg-[#ffb698]/90 text-white font-semibold rounded-lg"
          >
            Book
          </button>
          <input
            name="phone"
            type="tel"
            value={bookingData.phone}
            onChange={handleBookingData}
            placeholder="Phone number"
            className="border border-gray-300 rounded-lg p-2"
          />

          <div className="text-center text-gray-500 text-sm">
            You won&apos;t be charged yet
          </div>

          <div className="space-y-4 pt-4">
            <div className="flex justify-between items-center">
              <div className="underline">
                ₹{discountedPrice} x {numberOfNights} nights
              </div>
              <div>₹{formatNumberWithCommas(total)}</div>
            </div>

            <div className="pt-4 border-t flex justify-between items-center font-semibold">
              <div>Total before taxes</div>
              <div>₹{formatNumberWithCommas(total)}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-2 mt-6 flex items-start gap-5 border-gray-300 rounded-lg p-6">
        <img className="w-8" src={tag_icon} alt="tag_icon" />
        <div>
          <h3 className="text-lg font-semibold">Lower price</h3>
          <p className="text-gray-500">
            Your dates are ₹734 less than the avg. nightly rate of the last 3
            months.
          </p>
        </div>
      </div>

      <div className="flex justify-center w-full mt-6 pb-12">
        <div className="flex items-center gap-3">
          <img src={flag_icon} className="w-4 opacity-80" alt="flag_icon" />
          <a className="underline cursor-pointer">Report this listing</a>
        </div>
      </div>
    </div>
  );
}
BookingSummaryCard.propTypes = {
  originalPrice: PropTypes.number,
  discountedPrice: PropTypes.number,
  place: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    maxGuests: PropTypes.number.isRequired,
  }).isRequired,
};

export default BookingSummaryCard;
