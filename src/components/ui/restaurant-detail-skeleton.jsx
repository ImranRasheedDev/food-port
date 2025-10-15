import React from 'react';

export const RestaurantDetailSkeleton = () => {
  return (
    <>
      <div className="h-[72px]" />
      
      {/* Banner Skeleton */}
      <div className="bg-primary-1014 lg:h-[300px] h-[400px] flex items-center animate-pulse">
        <div className="container mx-auto lg:px-0 px-6">
          <div className="flex flex-wrap">
            <div className="min-sm:flex md:gap-x-10 gap-x-4">
              <div className="flex-shrink-0 max-sm:mb-4">
                <div className="lg:w-[156px] lg:h-[156px] w-[100px] h-[100px] bg-gray-300 rounded-lg"></div>
              </div>
              <div className="flex-1">
                <div className="flex mb-3">
                  <div className="flex gap-x-6">
                    <div className="h-4 w-16 bg-gray-300 rounded"></div>
                    <div className="h-4 w-20 bg-gray-300 rounded"></div>
                    <div className="h-4 w-14 bg-gray-300 rounded"></div>
                  </div>
                </div>
                <div className="h-10 w-64 bg-gray-300 rounded mb-3"></div>
                <div className="flex gap-x-3 mb-2">
                  <div className="h-6 w-32 bg-gray-300 rounded"></div>
                  <div className="h-6 w-20 bg-gray-300 rounded"></div>
                </div>
                <div className="h-5 w-48 bg-gray-300 rounded"></div>
              </div>
            </div>
            <div className="ml-auto self-end">
              <div className="h-12 w-40 bg-gray-300 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Menu Navigation Skeleton */}
      <div className="bg-white lg:flex gap-x-20 lg:py-2 py-6 container mx-auto lg:px-0 px-6 animate-pulse">
        <div className="relative bg-gray-200 lg:w-[260px] w-full h-10 rounded-full mb-4 lg:mb-0"></div>
        <div className="flex gap-x-10">
          <div className="h-6 w-24 bg-gray-300 rounded"></div>
          <div className="h-6 w-20 bg-gray-300 rounded"></div>
          <div className="h-6 w-28 bg-gray-300 rounded"></div>
          <div className="h-6 w-18 bg-gray-300 rounded"></div>
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="bg-primary-1014 pt-20 pb-20">
        <div className="grid 2xl:grid-cols-4 xl:grid-cols-3 lg:grid-cols-2 grid-cols-1 gap-x-[30px] px-6 mx-auto justify-center">
          <div className="2xl:col-span-1 xl:col-span-1 lg:col-span-1 col-span-1 space-y-8 pt-22 hidden xl:block">
            {/* Left sidebar skeleton */}
            <div className="bg-gray-300 h-64 rounded-lg animate-pulse"></div>
            <div className="bg-gray-300 h-64 rounded-lg animate-pulse"></div>
            <div className="bg-gray-300 h-64 rounded-lg animate-pulse"></div>
          </div>
          
          <div className="2xl:col-span-2 xl:col-span-1 lg:col-span-1 col-span-1 max-xl:order-2">
            {/* Menu sections skeleton */}
            {[1, 2, 3].map((section) => (
              <div key={section} className="mb-10">
                <div className="h-8 w-48 bg-gray-300 rounded mb-3 animate-pulse"></div>
                <div className="h-4 w-72 bg-gray-300 rounded mb-5 animate-pulse"></div>
                <div className="grid 2xl:grid-cols-2 grid-cols-1 gap-4">
                  {[1, 2, 3, 4].map((item) => (
                    <div key={item} className="border border-gray-200 rounded-lg p-4 flex justify-between items-center gap-4 animate-pulse">
                      <div className="flex-1">
                        <div className="h-6 w-32 bg-gray-300 rounded mb-2"></div>
                        <div className="h-4 w-16 bg-gray-300 rounded mb-2"></div>
                        <div className="h-4 w-full bg-gray-300 rounded mb-1"></div>
                        <div className="h-4 w-3/4 bg-gray-300 rounded"></div>
                      </div>
                      <div className="w-32 h-32 bg-gray-300 rounded-lg"></div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            
            {/* Testimonials skeleton */}
            <div className="mb-10">
              <div className="h-8 w-48 bg-gray-300 rounded mb-3 animate-pulse"></div>
              <div className="h-4 w-64 bg-gray-300 rounded mb-5 animate-pulse"></div>
              <div className="space-y-6 pt-3">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="border border-gray-200 rounded-lg p-4 animate-pulse">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                      <div className="h-5 w-24 bg-gray-300 rounded"></div>
                      <div className="h-5 w-16 bg-gray-300 rounded"></div>
                    </div>
                    <div className="h-4 w-full bg-gray-300 rounded mb-1"></div>
                    <div className="h-4 w-3/4 bg-gray-300 rounded"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="2xl:col-span-1 xl:col-span-1 lg:col-span-1 col-span-1 space-y-8 pt-22 max-xl:order-1">
            {/* Right sidebar skeleton */}
            <div className="bg-gray-300 h-48 rounded-lg animate-pulse"></div>
            <div className="bg-gray-300 h-32 rounded-lg animate-pulse"></div>
            <div className="bg-gray-300 h-64 rounded-lg animate-pulse"></div>
            <div className="bg-gray-300 h-64 rounded-lg animate-pulse"></div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RestaurantDetailSkeleton;
