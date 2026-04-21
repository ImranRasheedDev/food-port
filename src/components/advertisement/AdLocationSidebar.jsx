import { MapPin, Plus, Minus } from "lucide-react";
import AddressAutocomplete from "@/components/AddressAutocomplete";
import { DateRangePicker } from "@/components/ui/date-range-picker";

export default function AdLocationSidebar({
  register,
  setValue,
  errors,
  watchAddress,
  watchLatitude,
  watchLongitude,
  days,
  setDays,
  startDate,
  endDate,
  onDateRangeChange,
  formattedEndDate,
  totalPrice,
  minDate,
}) {
  return (
    <div className="bg-white rounded-xl p-6 sticky top-24">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Ad Location</h2>

      {/* Location Input */}
      <AddressAutocomplete
        id="ad-location"
        placeholder="e.g.: Dallas, Tx,"
        setValue={setValue}
        error={errors.address?.message}
        icon={<MapPin className="w-5 h-5" />}
      />
      <input type="hidden" {...register("address", { required: "Address is required" })} />
      <input type="hidden" {...register("latitude", { required: true })} />
      <input type="hidden" {...register("longitude", { required: true })} />

      {/* Map */}
      <div className="mt-4 rounded-lg overflow-hidden border border-gray-200">
        {watchLatitude && watchLongitude ? (
          <iframe
            src={`https://maps.google.com/maps?q=${watchLatitude},${watchLongitude}&z=14&output=embed`}
            width="100%"
            height="200"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        ) : (
          <iframe
            src="https://maps.google.com/maps?q=32.7767,-96.7970&z=12&output=embed"
            width="100%"
            height="200"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        )}
      </div>

      {/* Location Tag */}
      {watchAddress && (
        <div className="mt-4">
          <span className="inline-block px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
            {watchAddress.split(",").slice(0, 2).join(",")}
          </span>
        </div>
      )}

      {/* Days Selector */}
      <div className="mt-6">
        <label className="block text-sm text-gray-500 mb-2">Days</label>
        <div className="flex items-center justify-between">
          <span className="text-2xl font-semibold">{days}</span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setDays(Math.max(1, days - 1))}
              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
            >
              <Minus className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setDays(days + 1)}
              className="w-8 h-8 rounded-full bg-primary-50 text-white flex items-center justify-center hover:bg-primary-50/90 transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Date Range Picker */}
      <div className="mt-4">
        <DateRangePicker
          startDate={startDate}
          endDate={endDate}
          onDateChange={onDateRangeChange}
          minDate={minDate}
        />
      </div>

      {/* Price */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <span className="text-2xl font-bold text-primary-50">
          ${totalPrice.toFixed(2)}
        </span>
      </div>
    </div>
  );
}
