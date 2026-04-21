import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

function DateRangePicker({
  startDate,
  endDate,
  onDateChange,
  minDate,
  trigger,
  className,
}) {
  const [open, setOpen] = React.useState(false);
  const [localStartDate, setLocalStartDate] = React.useState(startDate);
  const [localEndDate, setLocalEndDate] = React.useState(endDate);

  // Update local state when props change
  React.useEffect(() => {
    setLocalStartDate(startDate);
    setLocalEndDate(endDate);
  }, [startDate, endDate]);

  // Format date for display
  const formatDisplayDate = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr + "T00:00:00");
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Handle start date change
  const handleStartDateChange = (e) => {
    const newStartDate = e.target.value;
    setLocalStartDate(newStartDate);

    // If end date is before new start date, update end date
    if (newStartDate > localEndDate) {
      setLocalEndDate(newStartDate);
    }
  };

  // Handle end date change
  const handleEndDateChange = (e) => {
    const newEndDate = e.target.value;
    if (newEndDate >= localStartDate) {
      setLocalEndDate(newEndDate);
    }
  };

  // Apply date range
  const handleApply = () => {
    onDateChange(localStartDate, localEndDate);
    setOpen(false);
  };

  // Calculate days between dates
  const calculateDays = () => {
    if (!localStartDate || !localEndDate) return 0;
    const start = new Date(localStartDate);
    const end = new Date(localEndDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <button
            type="button"
            className={cn(
              "flex items-center gap-3 text-left w-full p-3 rounded-lg border border-gray-200 hover:border-primary-50 hover:bg-gray-50 transition-colors cursor-pointer",
              className
            )}
          >
            <Calendar className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-sm text-gray-500">Run this ad until</p>
              <p className="font-medium">{formatDisplayDate(endDate)}</p>
            </div>
          </button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Select Date Range</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          {/* Start Date */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Start Date</label>
            <input
              type="date"
              value={localStartDate}
              onChange={handleStartDateChange}
              min={minDate}
              className="w-full h-11 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-50 focus:border-transparent"
            />
          </div>

          {/* End Date */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">End Date</label>
            <input
              type="date"
              value={localEndDate}
              onChange={handleEndDateChange}
              min={localStartDate || minDate}
              className="w-full h-11 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-50 focus:border-transparent"
            />
          </div>

          {/* Duration Preview */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Duration</span>
              <span className="font-semibold text-primary-50">{calculateDays()} days</span>
            </div>
            <div className="flex justify-between items-center mt-2 text-sm text-gray-500">
              <span>{formatDisplayDate(localStartDate)}</span>
              <span>→</span>
              <span>{formatDisplayDate(localEndDate)}</span>
            </div>
          </div>

          {/* Apply Button */}
          <button
            type="button"
            onClick={handleApply}
            className="w-full h-11 bg-primary-50 text-white rounded-lg font-medium hover:bg-primary-50/90 transition-colors"
          >
            Apply
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export { DateRangePicker };
