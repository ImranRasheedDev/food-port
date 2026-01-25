import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";

const genderOptions = [
  { value: "both", label: "Both", apiValue: ["1", "2"] },
  { value: "male", label: "Male", apiValue: ["1"] },
  { value: "female", label: "Female", apiValue: ["2"] },
];

const ageGroupOptions = [
  { value: "1", label: "18-24" },
  { value: "2", label: "25-34" },
  { value: "3", label: "35-44" },
  { value: "4", label: "45+" },
];

export default function TargetingOptions({
  selectedGender,
  onGenderChange,
  selectedAgeGroups,
  onAgeGroupChange,
  selectedRadius,
  onRadiusChange
}) {
  const handleAgeGroupToggle = (value) => {
    if (selectedAgeGroups.includes(value)) {
      onAgeGroupChange(selectedAgeGroups.filter(v => v !== value));
    } else {
      onAgeGroupChange([...selectedAgeGroups, value]);
    }
  };

  const handleSelectAllAgeGroups = () => {
    if (selectedAgeGroups.length === ageGroupOptions.length) {
      onAgeGroupChange([]);
    } else {
      onAgeGroupChange(ageGroupOptions.map(opt => opt.value));
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 space-y-6">
      <h2 className="text-lg font-semibold text-gray-900">Targeting Options</h2>

      {/* Gender Selection */}
      <div className="space-y-3">
        <Label className="text-sm font-medium text-gray-700">
          Target Gender<span className="text-primary-50">*</span>
        </Label>
        <RadioGroup
          value={selectedGender}
          onValueChange={onGenderChange}
          className="flex flex-wrap gap-4"
        >
          {genderOptions.map((option) => (
            <div key={option.value} className="flex items-center space-x-2">
              <RadioGroupItem value={option.value} id={`gender-${option.value}`} />
              <Label
                htmlFor={`gender-${option.value}`}
                className="text-sm text-gray-600 cursor-pointer"
              >
                {option.label}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      {/* Age Groups Selection */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium text-gray-700">
            Target Age Groups<span className="text-primary-50">*</span>
          </Label>
          <button
            type="button"
            onClick={handleSelectAllAgeGroups}
            className="text-sm text-primary-50 hover:underline"
          >
            {selectedAgeGroups.length === ageGroupOptions.length ? "Deselect All" : "Select All"}
          </button>
        </div>
        <div className="flex flex-wrap gap-4">
          {ageGroupOptions.map((option) => (
            <div key={option.value} className="flex items-center space-x-2">
              <Checkbox
                id={`age-${option.value}`}
                checked={selectedAgeGroups.includes(option.value)}
                onCheckedChange={() => handleAgeGroupToggle(option.value)}
              />
              <Label
                htmlFor={`age-${option.value}`}
                className="text-sm text-gray-600 cursor-pointer"
              >
                {option.label}
              </Label>
            </div>
          ))}
        </div>
        {selectedAgeGroups.length === 0 && (
          <p className="text-sm text-red-500">Please select at least one age group</p>
        )}
      </div>

      {/* Radius Selection - Slider */}
      <div className="space-y-3">
        <Label className="text-sm font-medium text-gray-700">
          Target Radius<span className="text-primary-50">*</span>
        </Label>
        <Slider
          min={5}
          max={50}
          step={5}
          value={Number(selectedRadius)}
          onValueChange={(value) => onRadiusChange(String(value))}
          valueSuffix=" miles"
          className="py-2"
        />
      </div>
    </div>
  );
}

// Helper to get API values from gender selection
export function getGenderApiValues(selectedGender) {
  const option = genderOptions.find(opt => opt.value === selectedGender);
  return option?.apiValue || ["1", "2"];
}
