import React from "react";
import Skeleton from "@/components/ui/skeleton";
import { useCategories } from "@/hooks/api";
import { NoData } from "@/components/ui/empty";

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
  <div className="grid grid-cols-8 gap-8 max-w-6xl mx-auto">
    {Array.from({ length: 8 }).map((_, i) => (
      <div key={i} className="text-center" aria-hidden="true">
        <div className="w-20 h-20 rounded-full overflow-hidden mx-auto mb-3 border-4 border-white shadow-lg">
          <Skeleton className="w-full h-full rounded-full" />
        </div>
        <Skeleton className="h-4 rounded w-3/4 mx-auto" />
      </div>
    ))}
  </div>
);

const CuisineGrid = ({ items }) => (
  <div className="grid grid-cols-8 gap-8 max-w-6xl mx-auto">
    {items.map((c) => (
      <div
        key={c.id}
        className="text-center hover:scale-105 transition-transform"
      >
        <div className="w-20 h-20 rounded-full overflow-hidden mx-auto mb-3 border-4 border-white shadow-lg">
          <img
            src={c.image}
            alt={c.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
        <p className="text-primary-400 font-medium">{c.name}</p>
      </div>
    ))}
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
      <div className="container mx-auto px-4">
        <SectionHeader />
        {isLoading ? (
          <SkeletonGrid />
        ) : itemsToRender === null ? (
          <NoData title="No Popular Restaurants" />
        ) : (
          <CuisineGrid items={itemsToRender} />
        )}
      </div>
    </section>
  );
}
