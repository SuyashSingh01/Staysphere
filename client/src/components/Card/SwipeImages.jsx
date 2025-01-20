import React from 'react';
import { Carousel } from 'antd';
import img from '../../assets/pexels-pixabay-533769.jpg'


const contentStyle = {
  margin: 0,
  height: '100px',
  color: '#fff',
  textAlign: 'center',
};


// const photos = [{img:img},]
const SwipeImages = ({photos}) => (
  <>
    <Carousel arrows={true} infinite={false}>
      
     {photos.map(image =>
        <img src={image} className='w-16 rounded-sm'/>
     )}
    </Carousel>
    
  </>
);
export default SwipeImages;