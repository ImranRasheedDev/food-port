export default function AdInformationForm({ register, errors }) {
  return (
    <div className="bg-white rounded-xl p-6 space-y-4">
      <h2 className="text-lg font-semibold text-gray-900">Information</h2>

      {/* Heading Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Add Offer or Deal Heading<span className="text-primary-50">*</span>
        </label>
        <input
          type="text"
          {...register("heading", { required: "Heading is required" })}
          placeholder="e.g.: Claim Your 30% Discount Daily Now!"
          className="w-full h-12 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-50 focus:border-transparent"
        />
        <p className="text-sm text-primary-50 mt-1">
          Headings must consist of 7 or less words only.
        </p>
        {errors.heading && (
          <p className="text-sm text-red-500 mt-1">{errors.heading.message}</p>
        )}
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Write a Description
        </label>
        <textarea
          {...register("description")}
          rows={4}
          placeholder="Describe your offer or deal..."
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-50 focus:border-transparent resize-none"
        />
      </div>
    </div>
  );
}
