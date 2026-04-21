import { useState, useCallback } from "react";
import { toast } from "react-toastify";
import { Upload, Minus } from "lucide-react";

export default function ImageUpload({ mediaFile, mediaPreview, onFileChange, onClear }) {
  const [dragActive, setDragActive] = useState(false);

  const processFile = useCallback((file) => {
    if (!file.type.match(/^image\/(jpeg|jpg|png)$/)) {
      toast.error("Only JPG and PNG files are allowed");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size must be less than 10MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      onFileChange(file, e.target?.result);
    };
    reader.readAsDataURL(file);
  }, [onFileChange]);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  }, [processFile]);

  return (
    <div
      className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
        dragActive ? "border-primary-50 bg-primary-50/5" : "border-gray-300 bg-white"
      }`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      {mediaPreview ? (
        <div className="relative">
          <img
            src={mediaPreview}
            alt="Preview"
            className="max-h-64 mx-auto rounded-lg object-contain"
          />
          <button
            type="button"
            onClick={onClear}
            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
          >
            <Minus className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <>
          <div className="flex justify-center mb-4">
            <Upload className="w-12 h-12 text-primary-50" />
          </div>
          <p className="text-gray-600 mb-2">
            Drop your images here, or{" "}
            <label className="text-primary-50 cursor-pointer hover:underline">
              click to browse
              <input
                type="file"
                className="hidden"
                accept="image/jpeg,image/jpg,image/png"
                onChange={handleFileChange}
              />
            </label>
          </p>
          <p className="text-sm text-gray-400">
            1600 × 1200 (4:3) recommended. JPG and PNG files are allowed
          </p>
        </>
      )}
    </div>
  );
}
