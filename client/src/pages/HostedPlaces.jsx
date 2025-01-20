import axios from 'axios';
import { useSelector } from 'react-redux';
import HostedSkeleton from '../components/Skeleton/HostedSkeleton.jsx';
import InfoCard from '../components/Card/InfoCard.jsx';
import React, { useState, useEffect } from 'react';
import { Link ,useNavigate } from 'react-router-dom';

const HostedPlaces = () => {

  // get listings from redux
  const {listings}=useSelector((state)=> (state.listings));
  const navigate=useNavigate();
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);


  const listplace=JSON.parse(localStorage.getItem('listings'));

  useEffect(() => {
    const getPlaces = async () => {
      try {
        // get from backend
        const { data } = await axios.get('http://localhost:3001/hosted');
        // setPlaces(data);

        // currently using available data from api
        setPlaces(listplace);

      } catch (error) {
        console.log(error.message);
      }
      setLoading(false);
    };
     getPlaces();   

  }, []);
  if (loading) {
    <div className="mx-4 mt-4 flex flex-col justify-center gap-4 ">
       {new Array(12).map((_,index) => {
            return <HostedSkeleton key={index}/>;
        })}
  </div>
  }

  return (
    <div className='mt-4 mb-8' >
      <h1 className='font-semibold text-3xl mt-4 mb-4 text-center'>Your Hosted Places</h1>
      <div className="mx-4 mt-4 flex flex-col justify-center flex-wrap gap-4 w-full">
        {places.length > 0 &&
          places.map((place,index) => {
            return <InfoCard setPlaces={setPlaces} place={place} key={index} navigate={navigate} />
          })}
      </div>
      <div className="text-center mt-4 mb-4 ">
        <Link
          className="gap-1 m-11 inline-flex rounded-full bg-primary py-3 px-5 md:px-13 text-xl font-semibold text-white "
          to={'/account/places/new'}>
          Add new place
        </Link>
      </div>
    </div>
  );
};

export default HostedPlaces;
