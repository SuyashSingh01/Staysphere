import React from 'react'

function HostedSkeleton() {
  return (
    <div className="my-3 flex cursor-pointer flex-col md:flex-row gap-4 rounded-2xl bg-gray-200 p-4 transition-all mx-auto animate-pulse w-full">
    <div className='w-full h-64 md:h-48 bg-gray-300 rounded-md'></div>
    <div className='flex flex-col gap-2  p-2 md:p-4 rounded-md'>
      <div className=" w-full">
        <div className="h-6 bg-gray-300 rounded w-3/4"></div>
        <div className="line-clamp-4 mt-2 md:mt-4 py-4">
          <div className="h-4 bg-gray-300 rounded w-full mt-1"></div>
          <div className="h-4 bg-gray-300 rounded w-2/3 mt-1"></div>
          <div className="h-4 bg-gray-300 rounded w-1/2 mt-1"></div>
        </div>
      </div>
      <div className='mt-8 md:mt-8 my-8 '>
        <div className="h-4 bg-gray-300 rounded w-1/4"></div>
        <div className="h-4 bg-gray-300 rounded w-1/4 mt-1"></div>
        <div className='h-4 bg-gray-300 rounded w-1/4 mt-1'></div>
      </div>
      <div className='flex gap-4 md:gap-8'>
        <div className='bg-primary rounded-md p-2 w-32 h-8'></div>
        <div className='bg-primary rounded-md p-2 w-32 h-8'></div>
      </div>
    </div>
  </div>
  )
}

export default HostedSkeleton