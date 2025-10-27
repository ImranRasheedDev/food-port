import React, { useState } from "react";
import Skeleton from "@/components/ui/skeleton";
import { useCategories } from "@/hooks/api";
import { NoData } from "@/components/ui/empty";
import LayoutWrapper from "../layoutWrapper";
import { processImageUrl } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

const staticCuisineTypes = [
  { name: "All", image: "/images/all.jpg" },
  { name: "Breakfast", image: "/images/breakpast.jpg" },
  { name: "Lunch", image: "/images/lunch.jpg" },
  { name: "Supper", image: "/images/supper.jpg" },
  { name: "Dinner", image: "/images/dinner.jpg" },
  { name: "Mid Night", image: "/images/mid-night.jpg" },
];

const SectionHeader = () => (
  <div className="text-center mb-12">
    <h2 className="text-4xl font-bold text-gray-900 mb-4">
      <span className="text-red-500">Cuisine</span> For You
    </h2>
    <p className="text-gray-600">
      Browse our top cuisine here to discover different food.
    </p>
  </div>
);

const SkeletonGrid = () => (
  <div className="flex justify-center">
    <div className="flex gap-8 overflow-x-auto scrollbar-hide pb-2 max-w-full">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="text-center flex-shrink-0" aria-hidden="true">
          <div className="w-20 h-20 rounded-full overflow-hidden mx-auto mb-3 border-4 border-white shadow-lg">
            <Skeleton className="w-full h-full rounded-full" />
          </div>
          <Skeleton className="h-4 rounded w-3/4 mx-auto" />
        </div>
      ))}
    </div>
  </div>
);

const CuisineItem = ({ item }) => {
  const [imageError, setImageError] = useState(false);
  const navigate = useNavigate();
  
  const imageSrc = (() => {
    if (imageError) {
      return processImageUrl("/images/placeholder1.jpg"); // Use processImageUrl for consistent path handling
    }
    return processImageUrl(item.image, "/images/placeholder1.jpg");
  })();

  const handleImageError = () => {
    setImageError(true);
  };

  const handleClick = () => {
    // Navigate to AllResturants with category ID in state
    navigate("/all-resturants", { 
      state: { 
        categoryId: item.id === "all" ? null : item.id,
        categoryName: item.name 
      } 
    });
  };

  return (
    <div 
      className="text-center flex-shrink-0 hover:scale-105 transition-transform cursor-pointer"
      onClick={handleClick}
    >
      <div className="w-20 h-20 rounded-full overflow-hidden mx-auto mb-3 border-4 border-white shadow-lg">
        <img
          src={imageSrc}
          alt={item.name}
          className="w-full h-full object-cover"
          loading="lazy"
          onError={handleImageError}
        />
      </div>
      <p className="text-primary-400 font-medium">{item.name}</p>
    </div>
  );
};

const CuisineGrid = ({ items }) => (
  <div className="flex justify-center">
    <div className="flex gap-8 overflow-x-auto scrollbar-hide pb-2 max-w-full">
      {items.map((c) => (
        <CuisineItem key={c.id} item={c} />
      ))}
    </div>
  </div>
);

export default function CuisineForYou() {
  const { data: res, isLoading } = useCategories();
  const apiItems = res?.data ?? null;
  const allOption = { id: "all", name: "All", image: "/images/all.jpg" };

  let itemsToRender = null;
  if (apiItems !== null) {
    itemsToRender = apiItems.length
      ? [
          allOption,
          ...apiItems.map((c) => ({
            id: c.id,
            name: c.name,
            image: c.image_url,
          })),
        ]
      : null;
  } else {
    itemsToRender = staticCuisineTypes.map((c, i) => ({
      id: `static-${i}`,
      ...c,
    }));
  }

  return (
    <section className="py-16 bg-gray-50">
        <LayoutWrapper>
        <SectionHeader />
        {isLoading ? (
          <SkeletonGrid />
        ) : itemsToRender === null ? (
          <NoData title="No Cuisines Found" />
        ) : (
          <CuisineGrid items={itemsToRender} />
        )}
      </LayoutWrapper>
    </section>
  );
}
