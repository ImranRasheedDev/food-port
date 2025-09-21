export function NoData({ description = "No Data" }) {
  return (
    <div className="col-span-full flex items-center justify-center p-8">
      <div className="text-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 7a4 4 0 014-4h10a4 4 0 014 4v10a4 4 0 01-4 4H7a4 4 0 01-4-4V7z"
          />
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 13h8" />
        </svg>
        <p className="mt-4 text-gray-600">{description}</p>
      </div>
    </div>
  );
}
