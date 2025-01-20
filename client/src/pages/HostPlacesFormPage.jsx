
import axios from 'axios';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import Spinner from '../components/common/Spinner.jsx';
import Perks from '../components/PlaceDetail/Perks.jsx';
import React, { useEffect, useState } from 'react';
import PerksWidget from '../components/common/PerksWidget.jsx';
import { useNavigate, useParams } from 'react-router-dom';
import MultiplePhotosUploader from '../components/common/MultiplePhotosUploader.jsx';
import { addListing, updateListing } from '../Redux/slices/ListingSlice.js';

const HostPlacesFormPage = () => {
  
  const { id } = useParams();

  const place = JSON.parse(localStorage.getItem('listing'));
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    title: place?.title || '',
    address: place?.address || '',
    description: place?.description || '',
    perks: place?.perks || [],
    extraInfo: place?.extraInfo || '',
    maxGuests: place?.maxGuests || 2,
    price: place?.price || 1,
  });


  const {
    title,
    address,
    description,
    perks,
    extraInfo,
    maxGuests,
    price,
  } = formData;

  const isValidPlaceData = () => {
    if (title?.trim() === '') {
      toast.error("Title can't be empty!");
      return false;
    } else if (address?.trim() === '') {
      toast.error("Address can't be empty!");
      return false;
    } else if (fileList?.length < 1) {
      toast.error('Upload at least 1 photos!');
      return false;
    } else if (description?.trim() === '') {
      toast.error("Description can't be empty!");
      return false;
    } else if (maxGuests < 1) {
      toast.error('At least one guests is required!');
      return false;
    } else if (maxGuests > 10) {
      toast.error("Max. guests can't be greater than 10");
      return false;
    }

    return true;
  };

  const handleFormData = (e) => {
    const { name, value, type } = e.target;
    // If the input is not a checkbox, update 'formData' directly
    if (type !== 'checkbox') {
      setFormData({ ...formData, [name]: value });
      return;
    }

    // If type is checkbox (perks)
    if (type === 'checkbox') {
      const currentPerks = [...perks];
      let updatedPerks = [];

      // Check if the perk is already in perks array
      if (currentPerks.includes(name)) {
        updatedPerks = currentPerks.filter((perk) => perk !== name);
      } else {
        updatedPerks = [...currentPerks, name];
      }
      setFormData({ ...formData, perks: updatedPerks });
    }
  };

  useEffect(() => {
    if (!id) {
      return;
    }
    // make the backend call to get the place data
    const getPlace = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(`http://localhost:3001/listings/${id}`);
        setFormData(data);
        setFileList(data.photos);
      } catch (error) {
        console.log('Error: ', error.message);
      }
      setLoading(false);
    };
    getPlace();

  }, [id]);

  const label = (header, description) => {
    return (
      <>
        <h2 className="mt-4 text-2xl">{header}</h2>
        <p className="text-sm text-gray-500">{description}</p>
      </>
    );
  };

  const savePlace = async (e) => {
    e.preventDefault();

    const formDataIsValid = isValidPlaceData();
    const sanitizedFileList = fileList.map(({ lastModifiedDate, ...rest }) => rest);
    const placeData = { ...formData, fileList: sanitizedFileList };

    // Make API call only if formData is valid and dispatch the action
    if (formDataIsValid) {
      console.log('placeData:', placeData);
      try {
        let existslistings = JSON.parse(localStorage.getItem('listings')) || [];
        if (existslistings.length) {
          // update existing place
          existslistings = existslistings.map((listing) => parseInt(listing.id) === parseInt(id) ? placeData : listing);

          localStorage.setItem('listings', JSON.stringify(existslistings));
          // dispatch(updateListing({ id, ...placeData }));

        } else {
          // new place
          placeData.id = existslistings.length ? Math.max(...existslistings.map(listing => listing.id)) + 1 : 1;
          existslistings.push(placeData);
          localStorage.setItem('listings', JSON.stringify(placeData));
          // dispatch(addListing(placeData));
        }
        navigate('/account/places');
        // console.log('existing listings:', existslistings);
        toast.success('Place saved successfully!');
      } catch (e) {
        console.log('Error: ', e.message);
        toast.error('Failed to save place!');
      }
    }
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="flex min-h-screen min-w-screen items-center justify-center bg-gray-100">
      <form onSubmit={savePlace} className='mx-4'>
        {label(
          'Title',
          'Title for your place. Should be short and catchy as in advertisement',
        )}
        <input
          type="text"
          name="title"
          value={title}
          onChange={handleFormData}
          placeholder="title, for example: My lovely apt"
        />

        {label('Address', 'Address to this place')}
        <input
          type="text"
          name="address"
          value={address}
          onChange={handleFormData}
          placeholder="address"
        />

        {label('Photos', 'Upload the pics of your place')}
        <MultiplePhotosUploader
          fileList={fileList}
          setFileList={setFileList}
        />
        {label('Perks', ' Select all the perks of your place')}
        {( id == undefined) ?
          (<PerksWidget selected={perks} handleFormData={handleFormData} />)
          : 
          (<Perks selected={perks} handleFormData={handleFormData} />)}
        {label('Description', 'Tell us more about your place')}
        <textarea
          value={description}
          name="description"
          onChange={handleFormData}
        />
        {label(
          'Number of guests & Price',
          // 'add check in and out times, remember to have some time window forcleaning the room between guests. '
          'Specify the maximum number of guests so that the client stays within the limit.',
        )}
        <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-4">
          <div>
            <h3 className="mt-2 -mb-1">Max no. of guests</h3>
            <input
              type="text"
              name="maxGuests"
              value={maxGuests}
              onChange={handleFormData}
              placeholder="1"
            />
          </div>
          <div>
            <h3 className="mt-2 -mb-1">Price per night</h3>
            <input
              type="number"
              name="price"
              value={price}
              onChange={handleFormData}
              placeholder="1"
            />
          </div>
        </div>
        {label('Extra info', 'house rules, etc ')}
        <textarea
          value={extraInfo}
          name="extraInfo"
          onChange={handleFormData}
        />

        <button className="mx-auto my-4 flex rounded-full bg-primary py-3 px-20 text-xl font-semibold text-white"
          onClick={savePlace} >
          Save
        </button>
      </form>
    </div>
  );
};

export default HostPlacesFormPage;
