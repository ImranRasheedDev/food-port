# Get Direction Feature Implementation

## Overview
This document describes the implementation of the "Get Direction" button on the OrderWaiting page, which opens Google Maps with directions from the user's address to the restaurant address.

## Implementation Details

### 1. Restaurant Data Storage
When an order is confirmed, the restaurant information is saved to localStorage for later retrieval.

#### Modified Files:
- `src/pages/OrderConfirmation.jsx`
- `src/pages/Pay.jsx`
- `src/components/InnerPages/AddCardDetail.jsx`

#### Changes:
All three files now save restaurant data to localStorage when the order is successfully placed:

```javascript
const placeOrderMutation = usePlaceOrder({
  onSuccess: async (data) => {
    clearCart();
    
    // Save restaurant data to localStorage for directions
    if (restaurantData?.data) {
      const restaurantInfo = {
        name: restaurantData.data.name,
        address: restaurantData.data.address,
        latitude: restaurantData.data.latitude || restaurantData.data.lat,
        longitude: restaurantData.data.longitude || restaurantData.data.lng,
        city: restaurantData.data.city,
      };
      await window.helper.setStorageData("lastOrderRestaurant", restaurantInfo);
    }
    
    navigate("/order-waiting", { state: { orderData: data } });
  },
  // ... error handling
});
```

### 2. Get Direction Button Implementation
The OrderWaiting page now includes functionality to retrieve both user and restaurant addresses and open Google Maps with directions.

#### Modified File:
- `src/pages/OrderWaiting.jsx`

#### Key Features:
1. **User Address Retrieval**: Gets the user's address from `window.user` (already stored in localStorage)
2. **Restaurant Address Retrieval**: Gets the restaurant address from localStorage using the key `"lastOrderRestaurant"`
3. **Google Maps Integration**: Opens Google Maps in a new tab with directions from user address to restaurant address
4. **Error Handling**: Shows appropriate error messages if addresses are not found

#### Implementation:
```javascript
const handleGetDirection = async () => {
  try {
    // Get user address from window.user (already in localStorage)
    const userAddress = window.user?.address || window.user?.user_address;
    
    // Get restaurant address from localStorage
    const restaurantInfo = await window.helper.getStorageData("lastOrderRestaurant");
    
    if (!userAddress) {
      toast.error("User address not found. Please update your profile.");
      return;
    }
    
    if (!restaurantInfo || !restaurantInfo.address) {
      toast.error("Restaurant address not found.");
      return;
    }
    
    // Build Google Maps direction URL
    const origin = encodeURIComponent(userAddress);
    const destination = encodeURIComponent(restaurantInfo.address);
    
    const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&travelmode=driving`;
    
    // Open in new tab
    window.open(googleMapsUrl, '_blank', 'noopener,noreferrer');
  } catch (error) {
    console.error("Error opening directions:", error);
    toast.error("Failed to open directions. Please try again.");
  }
};
```

### 3. Button UI
The button includes:
- Click handler to open directions
- Hover effect for better UX
- Proper styling consistent with the app theme

```jsx
<button 
  onClick={handleGetDirection}
  className="bg-primary-50 text-white gap-2 px-8 h-12 rounded-none hover:bg-primary-60 transition-colors"
>
  Get Direction
</button>
```

## Data Flow

1. **Order Placement**:
   - User places order from OrderConfirmation, Pay, or AddCardDetail page
   - Restaurant data is fetched using `useRestaurantDetail` hook
   - On successful order placement, restaurant info is saved to localStorage with key `"lastOrderRestaurant"`

2. **Order Waiting Page**:
   - User is redirected to OrderWaiting page
   - User clicks "Get Direction" button
   - Function retrieves:
     - User address from `window.user.address` or `window.user.user_address`
     - Restaurant address from localStorage key `"lastOrderRestaurant"`
   - Google Maps URL is constructed with both addresses
   - New tab opens with directions

## Google Maps URL Format

The implementation uses the Google Maps Directions API URL format:
```
https://www.google.com/maps/dir/?api=1&origin=USER_ADDRESS&destination=RESTAURANT_ADDRESS&travelmode=driving
```

Parameters:
- `api=1`: Required parameter for Google Maps URLs API
- `origin`: User's delivery address (URL encoded)
- `destination`: Restaurant's address (URL encoded)
- `travelmode=driving`: Sets the default travel mode to driving

## Error Handling

The implementation includes comprehensive error handling:

1. **Missing User Address**: Shows toast error "User address not found. Please update your profile."
2. **Missing Restaurant Address**: Shows toast error "Restaurant address not found."
3. **General Errors**: Catches and logs any unexpected errors, shows toast error "Failed to open directions. Please try again."

## Storage Details

### User Address
- Stored in: `window.user` object (synced with localStorage key `"user"`)
- Fields used: `address` or `user_address`
- Already implemented in the existing authentication system

### Restaurant Address
- Stored in: localStorage key `"lastOrderRestaurant"`
- Storage method: Encrypted using `window.helper.setStorageData()`
- Retrieval method: Decrypted using `window.helper.getStorageData()`
- Data structure:
  ```javascript
  {
    name: "Restaurant Name",
    address: "Full Restaurant Address",
    latitude: 40.7128,
    longitude: -74.0060,
    city: "City Name"
  }
  ```

## Browser Compatibility

The implementation uses:
- `window.open()` with `'_blank'` target for new tab
- `noopener,noreferrer` for security
- Standard URL encoding via `encodeURIComponent()`
- Works in all modern browsers

## Testing Checklist

To verify the implementation:

1. ✅ Place an order through OrderConfirmation page
2. ✅ Verify restaurant data is saved to localStorage
3. ✅ Navigate to OrderWaiting page
4. ✅ Click "Get Direction" button
5. ✅ Verify Google Maps opens in new tab
6. ✅ Verify directions show from user address to restaurant address
7. ✅ Test error cases (missing addresses)
8. ✅ Test with different restaurants
9. ✅ Test order placement through Pay page
10. ✅ Test order placement through AddCardDetail page

## Notes

- The implementation does not break any existing functionality
- Restaurant data is saved only on successful order placement
- The feature works seamlessly with the existing authentication and order flow
- No additional API calls are required for this feature
- The implementation is secure, using the existing encryption methods for localStorage

