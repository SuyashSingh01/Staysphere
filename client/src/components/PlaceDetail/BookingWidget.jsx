import {useState } from 'react';
import {useNavigate } from 'react-router-dom';
import { differenceInDays } from 'date-fns';
import { toast } from 'react-toastify';
import DatePickerWithRange from './DatePickerWithRange.jsx';
import { useDispatch } from 'react-redux';
import { setLoading } from '../../Redux/slices/AuthSlice.js';
import {useSelector} from 'react-redux'

const BookingWidget = ({ place }) => {

  const navigate=useNavigate();
  
  const { user } = useSelector((state)=>state.auth);

  const [dateRange, setDateRange] = useState({ from: null, to: null });

  const [bookingData, setBookingData] = useState({noOfGuests: 1,name: user?.name||'',phone: '',});
  const dispatch = useDispatch();
  const { noOfGuests, name, phone } = bookingData;
  const {  id, price } = place;

  const numberOfNights =dateRange.from && dateRange.to? 
  differenceInDays(new Date(dateRange.to).setHours(0, 0, 0, 0),new Date(dateRange.from).setHours(0, 0, 0, 0),): 0;

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
      toast.error('Please sign in to book place ');
      navigate('/register')
      return ;
    }

    // BOOKING DATA VALIDATION
    if (numberOfNights < 1) {
      return toast.error('Please select valid dates');
    } else if (noOfGuests < 1) {
      return toast.error("No. of guests can't be less than 1");
    } else if (noOfGuests > place.maxGuests) {
      return toast.error(`Allowed max. no. of guests: ${place.maxGuests}`);
    } else if (name.trim() === '') {
      return toast.error("Name can't be empty");
    } else if (phone.trim() === '') {
      return toast.error("Phone can't be empty");
    }
    // send the data to backend server
    dispatch(setLoading(true));
    try {
      const bookingDetail= {
        checkIn: dateRange.from.toISOString(),
        checkOut: dateRange.to.toISOString(),
        noOfGuests,
        name,
        phone,
        place: id,
        price: numberOfNights * price,
      };
      // here the id should be the same as  the place id 
   
      // dispatch(addBooking(BookingDetails));
      const BookingDetails = {
        booking:bookingDetail,
        placeDetail: place,
      };
    
      navigate(`/account/bookings/${id}/confirm-pay/`, { state: {
        BookingDetails,
        } 
      });
      // take out the booking id from server response created in database
      // const bookingId = response.data.booking._id;
    } catch (error) {
      toast.error('Something went wrong!');
      console.log('Error: ', error.message);
    }finally{
    dispatch(setLoading(false));
    }
  

  };

  return (
    <div className="rounded-2xl bg-white py-8 shadow-xl">
      <div className="text-center text-xl">
        Price: <span className="font-semibold">₹{place.price}</span> / per night
      </div>
      <div className="mt-4 rounded-2xl border p-2">
        <div className="flex md:w-full">
          <DatePickerWithRange setDateRange={setDateRange} />
        </div>
        <div className="border-t py-3 px-4">
          <label>Number of guests: 
          <input 
            type="number"
            name="noOfGuests"
            placeholder={`Max. guests: ${place.maxGuests}`}
            min={1}
            max={place.maxGuests}
            value={noOfGuests}
            onChange={handleBookingData}
            />
          </label>
        </div>
        <div className="border-t py-3 px-4">
          <label>Your full name: </label>
          <input
            type="text"
            name="name"
            value={name}
            onChange={handleBookingData}
          />
          <label>Phone number: </label>
          <input
            type="tel"
            name="phone"
            value={phone}
            minLength={10}
            onChange={handleBookingData}
          />
        </div>
      </div>
      <button onClick={handleBooking} className="primary mt-4 py-2">
        Book this place
        {numberOfNights > 0 && <span> ₹{numberOfNights * price}</span>}
      </button>
    </div>
  );
};

export default BookingWidget;
