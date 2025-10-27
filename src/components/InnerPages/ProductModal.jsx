import { Minus, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
} from "../ui/dialog";
import { Label } from "../ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Checkbox } from "../ui/checkbox";
import { Textarea } from "../ui/textarea";
import { useState, useEffect, useMemo } from "react";
import { useProductWithAddons } from "@/hooks/api";
import { useCart } from "@/contexts/CartContext";
import { toast } from "react-toastify";
import { processImageUrl } from "@/lib/utils";

export default function ProductModal({
  open,
  setOpen,
  productId,
  restaurantData,
}) {
  const [countValue, setCountValue] = useState(1);
  const [selectedAddons, setSelectedAddons] = useState({});
  const [instructions, setInstructions] = useState("");
  const [imageError, setImageError] = useState(false);
  const { addToCart } = useCart();

  // Reset state when modal closes
  useEffect(() => {
    if (!open) {
      setCountValue(1);
      setSelectedAddons({});
      setInstructions("");
      setImageError(false);
    }
  }, [open]);

  const {
    data: productData,
    isLoading,
    error,
  } = useProductWithAddons(productId, {
    enabled: !!productId && open,
  });

  const product = productData?.data;

  // Calculate total price including addons
  const totalPrice = useMemo(() => {
    if (!product) return 0;

    const basePrice = parseFloat(product.price) || 0;
    let addonPrice = 0;

    // Calculate addon prices
    Object.values(selectedAddons).forEach((addon) => {
      if (addon.selected) {
        addonPrice += (parseFloat(addon.price) || 0) * addon.quantity;
      }
    });

    return (basePrice + addonPrice) * countValue;
  }, [product, selectedAddons, countValue]);

  // Get processed image URL with error handling
  const imageSrc = useMemo(() => {
    if (imageError || !product?.image_url) {
      return processImageUrl("/images/placeholder1.jpg"); // Use processImageUrl for consistent path handling
    }
    return processImageUrl(product.image_url, "/images/placeholder1.jpg");
  }, [product?.image_url, imageError]);

  const handleImageError = () => {
    setImageError(true);
  };

  const handleAddToCart = () => {
    if (!product) return;

    const cartData = {
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: countValue,
      selectedAddons: selectedAddons,
      instructions: instructions,
      restaurantId: restaurantData?.id || product.restaurant_id,
      restaurantName: restaurantData?.name || "Restaurant",
      image: product.image_url,
    };

    addToCart(cartData);
    toast.success(`${product.name} added to cart!`);
    setOpen(false);
  };

  // Initialize selected addons when product data loads
  useEffect(() => {
    if (product?.product_addon_categories) {
      const initialAddons = {};
      product.product_addon_categories.forEach((category) => {
        category.product_addons.forEach((addon) => {
          initialAddons[addon.id] = {
            selected: false,
            quantity: 1,
            price: addon.price,
            name: addon.name,
            categoryId: category.id,
            categoryName: category.name,
            type: category.type,
            required: category.required,
            min: category.min || 0,
            max: category.max || null,
          };
        });
      });
      setSelectedAddons(initialAddons);
    }
  }, [product]);

  // Handle addon selection
  const handleAddonChange = (addonId, checked) => {
    setSelectedAddons((prev) => ({
      ...prev,
      [addonId]: {
        ...prev[addonId],
        selected: checked,
      },
    }));
  };

  // Handle addon quantity change
  const handleAddonQuantityChange = (addonId, quantity) => {
    if (quantity < 1) return;
    setSelectedAddons((prev) => ({
      ...prev,
      [addonId]: {
        ...prev[addonId],
        quantity: quantity,
      },
    }));
  };

  // Check if all required addons are selected
  const isAddToCartDisabled = useMemo(() => {
    if (!product?.product_addon_categories) return false;

    return product.product_addon_categories.some((category) => {
      if (!category.required) return false;

      const categoryAddons = Object.values(selectedAddons).filter(
        (addon) => addon.categoryId === category.id
      );

      const selectedCount = categoryAddons.filter(
        (addon) => addon.selected
      ).length;
      return selectedCount < (category.min || 1);
    });
  }, [product, selectedAddons]);

  if (isLoading) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-[880px]! p-0 block overflow-y-auto max-h-[90vh] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-track]:bg-gray-100">
          <div className="w-full h-[286px] bg-gray-200 animate-pulse"></div>
          <div className="p-8">
            <div className="h-8 bg-gray-200 animate-pulse rounded mb-4"></div>
            <div className="h-4 bg-gray-200 animate-pulse rounded mb-2"></div>
            <div className="h-4 bg-gray-200 animate-pulse rounded mb-4"></div>
            <div className="h-6 bg-gray-200 animate-pulse rounded w-20"></div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (error || !product) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-[880px]! p-0 block overflow-y-auto max-h-[90vh] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-track]:bg-gray-100">
          <div className="p-8 text-center">
            <div className="text-lg text-red-500">
              Error loading product details
            </div>
            <button
              onClick={() => setOpen(false)}
              className="mt-4 bg-primary-50 text-white px-4 py-2 rounded-full"
            >
              Close
            </button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-[880px]! p-0 block overflow-y-auto max-h-[90vh] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-track]:bg-gray-100">
        <img
          src={imageSrc}
          alt="product-modal-image"
          className="w-full h-[286px] object-cover block"
          onError={handleImageError}
          loading="lazy"
        />
        <div className="border-b border-primary-1007 mx-8 py-6 mb-4">
          <h2 className="text-2xl font-bold mb-1">{product.name}</h2>
          <p className="text-primary-1013 mb-3">{product.description}</p>
          <p className="text-2xl font-bold text-primary-50">
            ${totalPrice.toFixed(2)}
          </p>
        </div>

        {/* Dynamic Addon Categories */}
        {product.product_addon_categories?.map((category) => (
          <div key={category.id} className="mx-8 mb-6">
            <h2 className="text-xl font-bold mb-2">
              {category.name}
              {category.required && (
                <span className="text-red-500 ml-1">*</span>
              )}
            </h2>
            <div className="border border-primary-1007 rounded-xl p-7 mt-4">
              {category.type === "radio" ? (
                <RadioGroup
                  value={
                    Object.keys(selectedAddons).find(
                      (id) =>
                        selectedAddons[id].categoryId === category.id &&
                        selectedAddons[id].selected
                    ) || ""
                  }
                  onValueChange={(value) => {
                    // Deselect all other addons in this category
                    const newAddons = { ...selectedAddons };
                    Object.keys(newAddons).forEach((id) => {
                      if (newAddons[id].categoryId === category.id) {
                        newAddons[id].selected = id === value;
                      }
                    });
                    setSelectedAddons(newAddons);
                  }}
                  className="space-y-5"
                >
                  {category.product_addons.map((addon) => (
                    <div key={addon.id} className="flex items-center space-x-2">
                      <RadioGroupItem
                        className="border-primary-50 data-[state=checked]:[&>span>svg]:fill-white data-[state=checked]:bg-primary-50"
                        value={addon.id.toString()}
                        id={addon.id.toString()}
                      />
                      <Label htmlFor={addon.id.toString()}>{addon.name}</Label>
                      <p className="text-primary-1015 ml-auto">
                        {addon.price === 0
                          ? "Free"
                          : `$${addon.price.toFixed(2)}`}
                      </p>
                    </div>
                  ))}
                </RadioGroup>
              ) : (
                <div className="space-y-5">
                  {category.product_addons.map((addon) => (
                    <div key={addon.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={addon.id.toString()}
                        checked={selectedAddons[addon.id]?.selected || false}
                        onCheckedChange={(checked) =>
                          handleAddonChange(addon.id, checked)
                        }
                        className="border-primary-50 data-[state=checked]:bg-primary-50 data-[state=checked]:border-primary-50"
                      />
                      <Label htmlFor={addon.id.toString()} className="flex-1">
                        {addon.name}
                      </Label>
                      {selectedAddons[addon.id]?.selected && (
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() =>
                              handleAddonQuantityChange(
                                addon.id,
                                (selectedAddons[addon.id]?.quantity || 1) - 1
                              )
                            }
                            className="border-2 border-primary-50 text-primary-50 w-6 h-6 flex justify-center items-center rounded-full cursor-pointer"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="font-bold w-8 text-center">
                            {selectedAddons[addon.id]?.quantity || 1}
                          </span>
                          <button
                            onClick={() =>
                              handleAddonQuantityChange(
                                addon.id,
                                (selectedAddons[addon.id]?.quantity || 1) + 1
                              )
                            }
                            className="border-2 border-primary-50 text-primary-50 w-6 h-6 flex justify-center items-center rounded-full cursor-pointer"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                      <p className="text-primary-1015 ml-auto">
                        {addon.price === 0
                          ? "Free"
                          : `$${addon.price.toFixed(2)}`}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        <div className="mx-8 mt-8">
          <h2 className="text-xl font-bold">Add extra instructions</h2>
          <Textarea
            placeholder="eg. sauce."
            className="border-2 border-primary-1007 rounded-xl p-4 mt-4 h-32"
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
          />
          <div className="flex justify-between items-center mt-8 mb-8 w-full gap-4">
            <div className="flex justify-between items-center gap-2 ">
              <button
                disabled={countValue === 1}
                className="border-2 border-primary-50 text-primary-50 w-6 h-6 flex justify-center items-center rounded-full cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => setCountValue(countValue - 1)}
              >
                <Minus className="w-4 h-4 text-primary-50" />
              </button>
              <span className="font-bold">{countValue}</span>
              <button
                onClick={() => setCountValue(countValue + 1)}
                className="border-2 border-primary-50 text-primary-50 w-6 h-6 flex justify-center items-center rounded-full cursor-pointer"
              >
                <Plus className="w-4 h-4 text-primary-50" />
              </button>
            </div>
            <div className="w-full">
              <button
                disabled={isAddToCartDisabled}
                onClick={handleAddToCart}
                className={`cursor-pointer text-white px-4 py-2 rounded-full w-full block ${
                  isAddToCartDisabled
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-primary-50"
                }`}
              >
                {isAddToCartDisabled
                  ? "Select Required Options"
                  : "Add to cart"}
              </button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
