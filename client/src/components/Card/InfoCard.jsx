import React from 'react';
import PlaceImg from '../common/PlaceImg.jsx';

const InfoCard = ({ place, navigate, index, setPlaces }) => {

  const editHandler = () => {
    navigate(`/account/places/${place.id}`, { state: { place } });
  }
  const deletHandler = () => {
    navigate(`/account/places`);
    const getHostedlisting = JSON.parse(localStorage.getItem('listings'));
    const index = getHostedlisting.findIndex(item => item.id === place.id);
    if (index !== -1) {
      getHostedlisting.splice(index, 1);
    }
    localStorage.setItem('listings', JSON.stringify(getHostedlisting));
    setPlaces(getHostedlisting);

  }
  const requestHandler=()=>{
    navigate('/account/hosted/bookings');
  }
  return (
    <div className="mx-3 flex flex-col md:flex-row gap-4 rounded-2xl bg-gray-100 p-2 md:p-4 transition-all hover:bg-gray-200 shadow-md" key={index}>

      <PlaceImg place={place} className=' w-full md:w-30 rounded-md' />
      <div className='flex flex-col gap-2  p-2 md:p-4 rounded-md'>
        <div className=" w-full">
          <h2 className="text-lg md:text-2xl font-bold  md:mt-2">{place.title}</h2>
          <p className="line-clamp-4 mt-2 md:mt-4 py-4 text-sm text-wrap">{place.description}</p>
        </div>
        <div className='mt-8 md:mt-8 my-8 '>
          <p className="text-sm md:text-base">Max Guests: {place.maxGuests}</p>
          <p className="text-sm md:text-base">Price: {place.price}</p>
          <p className='text-sm md:text-base'>No. of Booking:{place?.booked}</p>
        </div>
        <div className='flex flex-wrap gap-2 md:gap-4 '>
          <button className='bg-primary cursor-pointer rounded-md md:p-2 w-16 md:w-32 text-white' onClick={editHandler}>Edit</button>
          <button className='bg-primary cursor-pointer rounded-md md:p-2 w-16 md:w-32 text-white' onClick={deletHandler}>Delete</button>
          <button className='bg-primary cursor-pointer rounded-md md:p-3 w-16 md:w-32 text-white' onClick={requestHandler}>See-Request</button>

        </div>
      </div>
    </div>
  );
};

export default InfoCard;
