import axios from 'axios';
import Perks from './Perks.jsx';
import Spinner from '../common/Spinner.jsx';
import Reviews from '../common/Reviews.jsx';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';
import PlaceGallery from '../common/PlaceGallery.jsx';
import BookingWidget from './BookingWidget.jsx';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setLoading } from '../../Redux/slices/AuthSlice';
import AddressLink from './AddressLink.jsx';
import ReviewCategorieSection from './ReviewCategorieSection.jsx';


const PlaceDetail = () => {

  const { id } = useParams();
  const [place, setPlace] = useState({});
  const { loading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const getPlace = async () => {
    // backend call
    dispatch(setLoading(true));
    try {
      const response = await axios.get(`http://localhost:3001/listings`);
      const placeDetail = response.data.find((place) => parseInt(place.id, 10) === parseInt(id, 10));
      setPlace(placeDetail);

    } catch (e) {
      console.log("eror ", e.message);
      toast.error(e.message);
    }
    dispatch(setLoading(false));

  };
  useEffect(() => {
    getPlace();
  }, [id]);

  if (loading) return <Spinner />;
  if (!place) return;
  return (
    <div className="mt-4 overflow-x-hidden px-8 md:pt-16">
      <h1 className="text-3xl mt-2 ">{place?.title}</h1>
      <AddressLink className="my-2 block" placeAddress={place?.address} />
      <PlaceGallery place={place} />
      <div className='mt-8 mb-8 flex flex-col md:flex-row '>
        <div className=" md:w-[65%]">
          <div className="my-4">
            <h2 className="md:text-2xl font-semibold text-xl">Description</h2>
            {place?.description}
          </div>
          Max number of guests: {place?.maxGuests}
          <Perks perks={place?.perks} />
        </div>
        <div className='sm:w-full md:w-[35%] sticky top-0'>
          <BookingWidget place={place} />
        </div>
      </div>
      <div className="-mx-8 border-t bg-white px-8 py-8">
        <div>
          <h2 className="mt-4 text-2xl font-semibold">Extra Info</h2>
        </div>
        <div className="mb-4 mt-2 text-sm leading-5 text-gray-700">
          {place?.extraInfo}
        </div>
      </div>
      <div className='mt-4'>
        <ReviewCategorieSection Rating={place.rating}/>
        <Reviews />
      </div>
      <div className='mt-4 mb-4'>
      <iframe width="100%" height="600" src="https://maps.google.com/maps?width=100%&amp;height=600&amp;hl=en&amp;coord=52.70967533219885, -8.020019531250002&amp;q=1%20Grafton%20Street%2C%20Dublin%2C%20Ireland&amp;ie=UTF8&amp;t=&amp;z=14&amp;iwloc=B&amp;output=embed" frameborder="0" scrolling="no" marginheight="0" marginwidth="0"></iframe><br />
      </div>
    </div>
  )
};

export default PlaceDetail;
