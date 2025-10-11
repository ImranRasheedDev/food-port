import React from "react";
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";

export default function AddressAutocomplete({ setValue, error, icon }) {
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
    <div className="relative w-full">
      <div className="flex items-center">
        {icon && <span className="mr-2">{icon}</span>}
        <input
          value={value}
          onChange={handleInput}
          placeholder="Address"
          disabled={!ready}
          className="w-full rounded border p-3"
        />
      </div>

      {status === "OK" && data.length > 0 && (
        <ul className="absolute z-50 bg-white border rounded w-full mt-1 max-h-60 overflow-auto">
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

      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}
