import { useState, useEffect } from 'react';
import axios from 'axios';
import { setLoading } from '../Redux/slices/AuthSlice';
import { useDispatch } from 'react-redux';


const useFetch = (url) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const dispatch=useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      dispatch(setLoading(true));
      try {
        const response = await axios.get(url);
        console.log("response",response)
        if (!response) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        setData(response.data);
      } catch (error) {
        setError(error);
      }finally {
       dispatch(setLoading(false));
      }
    };

    fetchData();
  }, [url]);

  return { data,error };
};

export default useFetch;
