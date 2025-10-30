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
import { useCartConfirmation } from "@/hooks/useCartConfirmation";
import ConfirmationModal from "../ui/confirmation-modal";
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
  const { addToCart, items: cartItems } = useCart();
  const { 
    confirmationModal, 
    showRestaurantConfirmation, 
    handleConfirm, 
    handleCancel, 
    closeModal 
  } = useCartConfirmation();

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

    // Handle restaurant conflict with modal
    const handleRestaurantConflict = (conflictData) => {
      showRestaurantConfirmation(
        conflictData.currentRestaurantName,
        conflictData.newRestaurantName,
        () => {
          // User confirmed - execute the confirm action
          toast.success(`${product.name} added to cart!`);
          conflictData.onConfirm();
          setOpen(false);
        },
        () => {
          // User cancelled - execute the cancel action
          toast.info("Item not added to cart");
          conflictData.onCancel();
        }
      );
    };

    // Check if there's a restaurant conflict first
    const hasConflict = cartItems.length > 0 && 
      cartItems[0].restaurantId !== cartData.restaurantId;

    addToCart(cartData, handleRestaurantConflict);
    
    // Only show success toast if there's no conflict (item added directly)
    if (!hasConflict) {
      toast.success(`${product.name} added to cart!`);
      setOpen(false);
    }
  };

  // Initialize selected addons when product data loads
  useEffect(() => {
    if (product?.product_addon_categories) {
      const initialAddons = {};
      product.product_addon_categories.forEach((category) => {
        category.product_addons.forEach((addon) => {
          initialAddons[addon.id] = {
            selected: false,
            quantity: addon.min_quantity || 1, // Start with minimum quantity
            price: addon.price,
            name: addon.name,
            categoryId: category.id,
            categoryName: category.name,
            type: category.type,
            required: category.required,
            min: addon.min_quantity || 1, // Individual addon min quantity
            max: addon.max_quantity || null, // Individual addon max quantity
            categoryMin: category.min || 0, // Category level min
            categoryMax: category.max || null, // Category level max
          };
        });
      });
      setSelectedAddons(initialAddons);
    }
  }, [product]);

  // Calculate base price for single unit (without addons)
  const baseUnitPrice = useMemo(() => {
    if (!product) return 0;
    return parseFloat(product.price) || 0;
  }, [product]);

  // Handle addon selection with max validation
  const handleAddonChange = (addonId, checked) => {
    setSelectedAddons((prev) => {
      const addon = prev[addonId];
      if (!addon) return prev;

      // Check max limit for this category
      const categoryAddons = Object.values(prev).filter(
        (a) => a.categoryId === addon.categoryId
      );
      const selectedCount = categoryAddons.filter((a) => a.selected).length;

      // Allow unchecking anytime, but only allow checking if under max
      if (checked && addon.max !== null) {
        // Only prevent selecting if we're already at or over max
        // (allowing to select up to exactly max)
        if (selectedCount >= addon.max) {
          return prev;
        }
      }

      return {
        ...prev,
        [addonId]: {
          ...addon,
          selected: checked,
        },
      };
    });
  };

  // Handle addon quantity change with min/max validation
  const handleAddonQuantityChange = (addonId, quantity) => {
    const addon = selectedAddons[addonId];
    if (!addon) return;

    // Enforce minimum quantity
    const minQuantity = addon.min || 1;
    
    // Don't allow quantity below minimum
    if (quantity < minQuantity) return;
    
    // Check category-level max limit (total quantity across all addons in category)
    if (addon.categoryMax !== null) {
      const categoryAddons = Object.values(selectedAddons).filter(
        (a) => a.categoryId === addon.categoryId
      );
      const currentTotalQuantity = categoryAddons.reduce((total, a) => {
        return total + (a.selected ? a.quantity : 0);
      }, 0);
      
      // Calculate what the new total would be
      const newTotalQuantity = currentTotalQuantity - addon.quantity + quantity;
      
      // Don't allow if new total exceeds category max
      if (newTotalQuantity > addon.categoryMax) return;
    }
    
    // Check individual addon max limit
    if (addon.max !== null && quantity > addon.max) return;

    setSelectedAddons((prev) => ({
      ...prev,
      [addonId]: {
        ...prev[addonId],
        quantity: quantity,
      },
    }));
  };

  // Check if all required addons meet min/max requirements
  const isAddToCartDisabled = useMemo(() => {
    if (!product?.product_addon_categories) return false;

    return product.product_addon_categories.some((category) => {
      const categoryAddons = Object.values(selectedAddons).filter(
        (addon) => addon.categoryId === category.id
      );

      const selectedAddonsInCategory = categoryAddons.filter(
        (addon) => addon.selected
      );

      // Check if required category has minimum selections
      if (category.required && selectedAddonsInCategory.length < (category.min || 1)) {
        return true;
      }

      // Check if any selected addon doesn't meet its individual min quantity requirement
      const hasInvalidQuantity = selectedAddonsInCategory.some((addon) => {
        const minQuantity = addon.min || 1;
        return addon.quantity < minQuantity;
      });

      if (hasInvalidQuantity) {
        return true;
      }

      return false;
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
            ${baseUnitPrice.toFixed(2)}
          </p>
        </div>

        {/* Dynamic Addon Categories */}
        {product.product_addon_categories?.map((category) => {
          const categoryAddons = Object.values(selectedAddons).filter(
            (a) => a.categoryId === category.id
          );
          const selectedCount = categoryAddons.filter(
            (a) => a.selected
          ).length;
          
          // Calculate total quantity across all selected addons in this category
          const totalQuantity = categoryAddons.reduce((total, addon) => {
            return total + (addon.selected ? addon.quantity : 0);
          }, 0);
          
          const maxReached = category.max !== null && totalQuantity >= category.max;
          const minReached = category.min !== null && selectedCount >= category.min;

          return (
          <div key={category.id} className="mx-8 mb-6">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xl font-bold">
                {category.name}
                {category.required && (
                  <span className="text-red-500 ml-1">*</span>
                )}
              </h2>
              {(category.min > 0 || category.max !== null) && (
                <div className="text-sm text-gray-600 flex gap-2 items-center">
                  {category.min > 0 && (
                    <span className={`${!minReached ? 'text-red-500' : 'text-green-600'}`}>
                      Min: {category.min}
                    </span>
                  )}
                  {category.max !== null && (
                    <span className={`${maxReached ? 'text-red-500' : 'text-blue-600'}`}>
                      Max: {category.max}
                    </span>
                  )}
                  <span className="text-gray-500">
                    ({totalQuantity}/{category.max !== null ? category.max : '∞'})
                  </span>
                </div>
              )}
            </div>
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
                  {category.product_addons.map((addon) => {
                    const isSelected = selectedAddons[addon.id]?.selected;
                    const buttonDisabled = !isSelected && maxReached;
                    const currentQuantity = selectedAddons[addon.id]?.quantity || 1;
                    const minQuantity = selectedAddons[addon.id]?.min || 1;
                    const maxQuantity = selectedAddons[addon.id]?.max;
                    
                    const minusDisabled = !isSelected || currentQuantity <= minQuantity;
                    
                    // Check if adding one more would exceed category max
                    const wouldExceedCategoryMax = category.max !== null && 
                      (totalQuantity + 1) > category.max;
                    
                    const plusDisabled = !isSelected || 
                      (maxQuantity !== null && currentQuantity >= maxQuantity) ||
                      wouldExceedCategoryMax;

                    return (
                      <div key={addon.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={addon.id.toString()}
                          checked={isSelected || false}
                          onCheckedChange={(checked) =>
                            handleAddonChange(addon.id, checked)
                          }
                          disabled={buttonDisabled}
                          className="border-primary-50 data-[state=checked]:bg-primary-50 data-[state=checked]:border-primary-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        />
                        {buttonDisabled && (
                          <span className="text-xs text-red-500 ml-1">Category max reached</span>
                        )}
                        <Label htmlFor={addon.id.toString()} className="flex-1">
                          <div className="flex flex-col">
                            <span>{addon.name}</span>
                            {(minQuantity > 1 || maxQuantity !== null) && (
                              <span className="text-xs text-gray-500">
                                {minQuantity > 1 && `Min: ${minQuantity}`}
                                {minQuantity > 1 && maxQuantity !== null && ' • '}
                                {maxQuantity !== null && `Max: ${maxQuantity}`}
                              </span>
                            )}
                          </div>
                        </Label>
                        {isSelected && (
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() =>
                                handleAddonQuantityChange(
                                  addon.id,
                                  currentQuantity - 1
                                )
                              }
                              disabled={minusDisabled}
                              className={`border-2 border-primary-50 text-primary-50 w-6 h-6 flex justify-center items-center rounded-full ${
                                minusDisabled 
                                  ? 'opacity-50 cursor-not-allowed' 
                                  : 'cursor-pointer hover:bg-primary-50 hover:text-white'
                              }`}
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="font-bold w-8 text-center">
                              {currentQuantity}
                            </span>
                            <button
                              onClick={() =>
                                handleAddonQuantityChange(
                                  addon.id,
                                  currentQuantity + 1
                                )
                              }
                              disabled={plusDisabled}
                              className={`border-2 border-primary-50 text-primary-50 w-6 h-6 flex justify-center items-center rounded-full ${
                                plusDisabled 
                                  ? 'opacity-50 cursor-not-allowed' 
                                  : 'cursor-pointer hover:bg-primary-50 hover:text-white'
                              }`}
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
                    );
                  })}
                </div>
              )}
            </div>
          </div>
          );
        })}

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
              {isAddToCartDisabled && (
                <p className="text-sm text-red-500 mb-2 text-center">
                  Please select required addons and ensure minimum quantities are met
                </p>
              )}
              <button
                disabled={isAddToCartDisabled}
                onClick={handleAddToCart}
                className={`cursor-pointer text-white px-4 py-3 rounded-full w-full block ${
                  isAddToCartDisabled
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-primary-50 hover:bg-primary-60"
                } transition-colors`}
              >
                <div className="flex justify-between items-center">
                  <span>Add to cart</span>
                  <span className="font-bold">${totalPrice.toFixed(2)}</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </DialogContent>
      
      {/* Confirmation Modal */}
      <ConfirmationModal
        open={confirmationModal.isOpen}
        onOpenChange={closeModal}
        title={confirmationModal.title}
        description={confirmationModal.description}
        confirmText="Yes, Replace Cart"
        cancelText="Keep Current Cart"
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </Dialog>
  );
}
