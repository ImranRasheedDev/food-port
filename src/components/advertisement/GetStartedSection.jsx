import { useState, useMemo, useCallback } from "react";
import { useForm } from "react-hook-form";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import LayoutWrapper from "@/components/layoutWrapper";
import { httpClient } from "@/hooks/api/useApi";
import PaymentForm from "./PaymentForm";
import ImageUpload from "./ImageUpload";
import AdInformationForm from "./AdInformationForm";
import AdLocationSidebar from "./AdLocationSidebar";
import TargetingOptions, { getGenderApiValues } from "./TargetingOptions";

// Stripe setup - only use env variables, initialize once
const stripePromise = import.meta.env.VITE_STRIPE_PUBLIC_KEY
  ? loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY)
  : null;

// Price per day for ad campaign
const PRICE_PER_DAY = 2;

// Helper to format date as YYYY-MM-DD
const formatDateString = (date) => {
  return date.toISOString().split('T')[0];
};

// Helper to calculate days between two date strings
const calculateDaysBetween = (startDateStr, endDateStr) => {
  const start = new Date(startDateStr);
  const end = new Date(endDateStr);
  const diffTime = Math.abs(end - start);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

// Helper to add days to a date string
const addDaysToDate = (dateStr, days) => {
  const date = new Date(dateStr);
  date.setDate(date.getDate() + days);
  return formatDateString(date);
};

// Get today's date string (computed once at module level for initial state)
const getToday = () => formatDateString(new Date());
const getDefaultEndDate = () => addDaysToDate(getToday(), 5);

export default function GetStartedSection() {
  const navigate = useNavigate();
  const [mediaFile, setMediaFile] = useState(null);
  const [mediaPreview, setMediaPreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Get today's date as minimum date (prevent past dates)
  const today = useMemo(() => getToday(), []);

  // Date state - start date is today, end date is today + 5 days
  const [startDate, setStartDate] = useState(getToday);
  const [endDate, setEndDate] = useState(getDefaultEndDate);

  // Days is derived from start and end date
  const days = useMemo(() => calculateDaysBetween(startDate, endDate), [startDate, endDate]);

  // Targeting options state
  const [selectedGender, setSelectedGender] = useState("both");
  const [selectedAgeGroups, setSelectedAgeGroups] = useState(["1", "2", "3", "4"]);
  const [selectedRadius, setSelectedRadius] = useState("10");

  const { register, setValue, watch, formState: { errors } } = useForm({
    defaultValues: {
      heading: "",
      description: "",
      address: "",
      latitude: "",
      longitude: "",
      city: "",
      zip_code: "",
    }
  });

  const watchAddress = watch("address");
  const watchLatitude = watch("latitude");
  const watchLongitude = watch("longitude");
  const watchHeading = watch("heading");

  // Calculate total price
  const totalPrice = useMemo(() => days * PRICE_PER_DAY, [days]);

  // Format end date for display
  const formattedEndDate = useMemo(() => {
    const date = new Date(endDate);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }, [endDate]);

  // Handle days change via +/- buttons - updates end date
  const handleDaysChange = useCallback((newDays) => {
    const clampedDays = Math.max(1, newDays);
    const newEndDate = addDaysToDate(startDate, clampedDays);
    setEndDate(newEndDate);
  }, [startDate]);

  // Handle date range change from picker - updates days automatically
  const handleDateRangeChange = useCallback((newStartDate, newEndDate) => {
    // Ensure start date is not in the past
    const validStartDate = newStartDate < today ? today : newStartDate;
    // Ensure end date is not before start date
    const validEndDate = newEndDate < validStartDate ? validStartDate : newEndDate;

    setStartDate(validStartDate);
    setEndDate(validEndDate);
  }, [today]);

  // Handle file change from ImageUpload component
  const handleFileChange = (file, preview) => {
    setMediaFile(file);
    setMediaPreview(preview);
  };

  // Handle clear file
  const handleClearFile = () => {
    setMediaFile(null);
    setMediaPreview(null);
  };

  // Handle payment success and form submission
  const handlePaymentSuccess = async (paymentIntentId) => {
    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("start_date", startDate);
      formData.append("end_date", endDate);
      formData.append("location[latitude]", watchLatitude);
      formData.append("location[longitude]", watchLongitude);
      formData.append("radius", selectedRadius);
      formData.append("address", watchAddress);
      formData.append("payment_intent_id", paymentIntentId);
      formData.append("heading", watchHeading);
      formData.append("description", watch("description"));

      // Add genders based on selection
      const genderValues = getGenderApiValues(selectedGender);
      genderValues.forEach(g => formData.append("genders[]", g));

      // Add age groups
      selectedAgeGroups.forEach(a => formData.append("age_groups[]", a));

      // Add media file
      if (mediaFile) {
        formData.append("media", mediaFile);
      }

      const response = await httpClient("/ad_campaign/add", {
        method: "POST",
        body: formData,
      });

      toast.success(response.message || "Ad campaign created successfully!");
      navigate("/");

    } catch (err) {
      toast.error(err?.message || "Failed to create ad campaign");
    } finally {
      setSubmitting(false);
    }
  };

  // Check if form is valid
  const isFormValid = useMemo(() => {
    return (
      watchAddress &&
      watchLatitude &&
      watchLongitude &&
      mediaFile &&
      watchHeading &&
      selectedAgeGroups.length > 0
    );
  }, [watchAddress, watchLatitude, watchLongitude, mediaFile, watchHeading, selectedAgeGroups]);

  // Check if Stripe is configured
  const isStripeConfigured = Boolean(import.meta.env.VITE_STRIPE_PUBLIC_KEY && import.meta.env.VITE_STRIPE_SECRET_KEY);

  return (
    <section className="py-12 bg-gray-50">
      <LayoutWrapper>
        <h1 className="text-3xl md:text-4xl font-bold mb-8">
          Get <span className="text-primary-50">Started</span>
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left Column - Form */}
          <div className="lg:col-span-3 space-y-6">
            <ImageUpload
              mediaFile={mediaFile}
              mediaPreview={mediaPreview}
              onFileChange={handleFileChange}
              onClear={handleClearFile}
            />

            <AdInformationForm register={register} errors={errors} />

            <TargetingOptions
              selectedGender={selectedGender}
              onGenderChange={setSelectedGender}
              selectedAgeGroups={selectedAgeGroups}
              onAgeGroupChange={setSelectedAgeGroups}
              selectedRadius={selectedRadius}
              onRadiusChange={setSelectedRadius}
            />

            {/* Payment Section */}
            <div className="bg-white rounded-xl p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Payment Method</h2>

              {!isStripeConfigured ? (
                <div className="py-8 text-center">
                  <p className="text-red-500">
                    Stripe is not configured. Please set VITE_STRIPE_PUBLIC_KEY and VITE_STRIPE_SECRET_KEY in your environment.
                  </p>
                </div>
              ) : stripePromise ? (
                <Elements stripe={stripePromise}>
                  <PaymentForm
                    totalAmount={totalPrice}
                    onPaymentSuccess={handlePaymentSuccess}
                    disabled={!isFormValid || submitting}
                  />
                </Elements>
              ) : (
                <div className="py-8 text-center">
                  <p className="text-red-500">
                    Failed to initialize Stripe. Please check your configuration.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Ad Location */}
          <div className="lg:col-span-2">
            <AdLocationSidebar
              register={register}
              setValue={setValue}
              errors={errors}
              watchAddress={watchAddress}
              watchLatitude={watchLatitude}
              watchLongitude={watchLongitude}
              days={days}
              setDays={handleDaysChange}
              startDate={startDate}
              endDate={endDate}
              onDateRangeChange={handleDateRangeChange}
              formattedEndDate={formattedEndDate}
              totalPrice={totalPrice}
              minDate={today}
            />
          </div>
        </div>
      </LayoutWrapper>
    </section>
  );
}
