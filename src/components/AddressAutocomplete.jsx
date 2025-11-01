import React from "react";
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";

export default function AddressAutocomplete({ id = "address", placeholder = "Address", setValue, error, icon }) {
  const {
    ready,
    value,
    setValue: setHookValue,
    suggestions: { status, data },
    clearSuggestions,
  } = usePlacesAutocomplete({
    debounce: 300,
  });

  // Handle input change
  const handleInput = (e) => {
    const inputValue = e.target.value;
    setHookValue(inputValue);

    // 🧹 Clear dependent fields when address is cleared
    if (inputValue.trim() === "") {
      setValue("city", "");
      setValue("zip_code", "");
      setValue("latitude", "");
      setValue("longitude", "");
    }
  };

  // Handle select from suggestions
  const handleSelect = async (description) => {
    setHookValue(description, false);
    clearSuggestions();

    try {
      const results = await getGeocode({ address: description });
      const { lat, lng } = await getLatLng(results[0]);

      const components = results[0].address_components;
      const cityComp =
        components.find((c) => c.types.includes("locality")) ||
        components.find((c) => c.types.includes("administrative_area_level_2"));
      const postalComp = components.find((c) =>
        c.types.includes("postal_code")
      );

      setValue("address", description, { shouldValidate: true });
      setValue("city", cityComp ? cityComp.long_name : "");
      setValue("zip_code", postalComp ? postalComp.long_name : "");
      setValue("latitude", lat);
      setValue("longitude", lng);
    } catch (err) {
      console.error("Error fetching place details:", err);
    }
  };

  return (
    <div className="w-full">
      <div className="relative">
        {icon && (
          <div className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
            {icon}
          </div>
        )}
        <input
          value={value}
          onChange={handleInput}
          name={id}
          placeholder={placeholder}
          disabled={!ready}
          autoComplete="street-address"
          className={`w-full h-14 rounded-full border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50 ${icon ? "pl-14" : "pl-6"
            } pr-6 ${error ? "border-red-500 focus:ring-red-500" : ""}`}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={error ? `${id}-error` : undefined}
        />
        {status === "OK" && data.length > 0 && (
          <ul className="absolute z-50 bg-white border rounded w-full mt-1 max-h-60 overflow-auto shadow-lg">
            {data.map(({ place_id, description }) => (
              <li
                key={place_id}
                onClick={() => handleSelect(description)}
                className="cursor-pointer p-2 hover:bg-gray-100"
              >
                {description}
              </li>
            ))}
          </ul>
        )}
      </div>
      {error && (
        <p
          id={`${id}-error`}
          className="mt-2 text-sm text-red-600"
          role="alert"
          aria-live="polite"
        >
          {error}
        </p>
      )}
    </div>
  );
}
