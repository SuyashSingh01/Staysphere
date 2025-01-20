import React from 'react'
import rightlogo from '../../assets/image.png'
import leftlogo from '../../assets/imager.png'

function ReviewCategorieSection() {

    return (
        <div>
            <div className='mx-auto w-[80%]'>
                <div className='flex gap-2 justify-center md:gap-4'>
                    <img src={leftlogo} alt="leftlogo" />
                    <h1 className='font-extrabold text-2xl md:text-5xl '>5.0</h1>
                    <img src={rightlogo} alt="rightlogo" />
                </div>
                <h2 className='text-center font-bold'>Guest Favourite</h2>
                <div className='text-center'>
                    <p>This home is in the <strong>top 5%</strong> of eligible listings based on ratings, reviews and reliability</p>
                </div>
            </div>
            
            <div className='flex justify-between flex-row gap-2 md:gap-7 border-1 w-full p-2 md:p-4 mt-4'>
                <div className='border-l p-2  border-gray-200 w-20'>
                    <h1>Overall Rating</h1>
                    <h2 className='font-extrabold text-lg md:text-xl'>5.0</h2>
                    
                </div>
                <div className='border-l border-gray-200 p-2 '>
                    <h1>Accuracy</h1>
                    <h2 className='font-extrabold text-lg md:text-xl'>5.0</h2>
                    <p>5.0</p>
                </div>
                <div className=' border-l border-gray-200 p-2'>
                    <h1>Check In</h1>
                    <h2 className='font-extrabold text-lg md:text-xl'>5.0</h2>
                    <p>5.0</p>
                </div>
                <div className=' border-l border-gray-200 p-2'>
                    <h1>Communication</h1>
                    <h2 className='font-extrabold text-lg md:text-xl'>5.0</h2>
                    <p>5.0</p>
                </div>
                <div className=' border-l border-gray-200 p-2'>
                    <h1>Cleanliness</h1>
                    <h2 className='font-extrabold text-lg md:text-xl'>5.0</h2>
                    <p>5.0</p>
                </div>
            </div>
        </div>
    )
}

export default ReviewCategorieSection