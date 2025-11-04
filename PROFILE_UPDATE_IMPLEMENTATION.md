# Profile Update Implementation - Event System

## Overview
This document explains how profile updates (name, image, and address) are synchronized across the application, specifically between the `UpdateProfile.jsx`, `UpdateLocation.jsx`, and `HeaderAfterLogin.jsx` components.

## How It Works

### Event-Based Architecture
The application uses a custom event system (`userUpdated`) to notify all components when user data changes. This ensures real-time UI updates without page refreshes.

### Flow Diagram
```
┌─────────────────────┐
│  UpdateProfile.jsx  │  User updates name/image
│  UpdateLocation.jsx │  User updates address
└──────────┬──────────┘
           │
           │ 1. Updates window.user
           │ 2. Saves to localStorage
           │ 3. Dispatches 'userUpdated' event
           │
           ▼
┌─────────────────────────────────────┐
│  Custom Event: 'userUpdated'         │
│  Detail: { ...updatedUserData }      │
└──────────┬──────────────────────────┘
           │
           │ Event listeners react
           │
           ▼
┌─────────────────────┐
│ HeaderAfterLogin.jsx│  Updates displayed:
│                     │  - User name
│                     │  - User image
│                     │  - User address
└─────────────────────┘
```

## Components

### 1. UpdateProfile.jsx
**Responsibility**: Handles user profile updates (name, image, email, phone, DOB, gender)

**Key Actions**:
- When profile is updated successfully:
  1. Preserves existing address data (since it's not in this form)
  2. Merges updated data with existing `window.user`
  3. Saves to localStorage via `window.helper.setStorageData()`
  4. Updates `window.user` global object
  5. **Dispatches `userUpdated` event** with complete user data
  
**Code Location**: Lines 107-204

```javascript
// After successful profile update
await window.helper.setStorageData("user", updatedUser);
window.user = updatedUser;

// Notify all components
window.dispatchEvent(new CustomEvent('userUpdated', { detail: updatedUser }));
```

### 2. UpdateLocation.jsx
**Responsibility**: Manages user addresses (add, edit, delete, set default)

**Key Actions**:
- **When setting default address** (lines 98-160):
  1. Updates `window.user.address`, `user_address`, `latitude`, `longitude`, `city`, `zip_code`
  2. Saves to localStorage
  3. **Dispatches `userUpdated` event**

- **When adding new address as default** (lines 168-201):
  1. If first address (becomes default automatically), updates `window.user`
  2. Saves to localStorage
  3. **Dispatches `userUpdated` event**

- **When editing default address** (lines 162-208):
  1. Refetches addresses to get latest data
  2. Updates `window.user` with edited default address
  3. Saves to localStorage
  4. **Dispatches `userUpdated` event**

**Code Example**:
```javascript
// After address update
window.user.address = newDefaultAddress.address;
window.user.user_address = newDefaultAddress.address;
await window.helper.setStorageData("user", window.user);

// Notify all components
window.dispatchEvent(new CustomEvent('userUpdated', { detail: { ...window.user } }));
```

### 3. HeaderAfterLogin.jsx
**Responsibility**: Displays user information in the header and listens for updates

**Key Actions**:
- Sets up event listener on component mount (lines 117-176)
- When `userUpdated` event is received:
  1. Extracts updated data from `event.detail`
  2. Updates local state:
     - `userName` - from `updatedUser.name`
     - `userAddress` - from `updatedUser.address || user_address || location`
     - `userImage` - from `updatedUser.image` (with proper URL construction)
  3. Updates `window.user` to ensure consistency
  4. UI automatically re-renders with new data

**Code Example**:
```javascript
useEffect(() => {
  const handleUserUpdate = (event) => {
    const updatedUser = event.detail;
    
    // Update state
    setUserName(updatedUser.name || "");
    setUserAddress(updatedUser.address || updatedUser.user_address || updatedUser.location || "");
    
    // Handle image URL construction
    let imageValue = updatedUser.image || "";
    if (imageValue && !imageValue.startsWith('http') && !imageValue.startsWith('/')) {
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
      imageValue = `${apiBaseUrl}/${imageValue}`;
    }
    setUserImage(imageValue || "");
    
    // Ensure window.user is updated
    window.user = updatedUser;
  };

  window.addEventListener('userUpdated', handleUserUpdate);
  return () => window.removeEventListener('userUpdated', handleUserUpdate);
}, []);
```

## Data Preservation

### Address Data Preservation in UpdateProfile.jsx
Since `UpdateProfile.jsx` doesn't handle address updates, it preserves all address-related fields:

```javascript
const preservedFields = {
  address: window.user?.address || "",
  user_address: window.user?.user_address || "",
  location: window.user?.location || "",
  latitude: window.user?.latitude || "",
  longitude: window.user?.longitude || "",
  city: window.user?.city || "",
  zip_code: window.user?.zip_code || "",
  address_data: window.user?.address_data || null,
};

const updatedUser = {
  ...window.user,        // Existing data
  ...userData,           // New data from API
  ...preservedFields,    // Ensure address fields are preserved
};
```

## Image URL Handling

The application handles three types of image URLs:

1. **Full HTTP/HTTPS URLs**: Used as-is
   - Example: `https://api.example.com/uploads/avatar.jpg`

2. **Static Assets**: Processed via `processImageUrl()`
   - Example: `/images/avatar.jpg` → Handled by Vite

3. **API Relative Paths**: Constructed with API base URL
   - Example: `uploads/users/avatar.jpg` → `https://api.example.com/uploads/users/avatar.jpg`

**Code Pattern**:
```javascript
let imageValue = updatedUser.image || "";
if (imageValue && imageValue.trim() !== "") {
  // Clean escaped slashes
  imageValue = imageValue.replace(/\\\//g, '/');
  
  if (!imageValue.startsWith('http') && !imageValue.startsWith('/')) {
    // API relative path - construct full URL
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
    imageValue = apiBaseUrl ? `${apiBaseUrl.replace(/\/$/, '')}/${imageValue}` : imageValue;
  }
}
```

## Address Field Handling

The `getInitialAddress()` function in `HeaderAfterLogin.jsx` checks multiple possible address fields for maximum compatibility:

```javascript
const getInitialAddress = () => {
  return window.user?.address || window.user?.user_address || window.user?.location || "";
};
```

This ensures the header displays the address regardless of which field the API uses.

## Testing the Implementation

### To Test Profile Updates:
1. Navigate to `/account-settings`
2. Update your name or upload a new image
3. Click "Save Changes"
4. **Expected Result**: Header should immediately show updated name/image without page refresh

### To Test Address Updates:
1. Navigate to `/account-settings` (scroll to address section)
2. Add a new address or set an existing address as default
3. **Expected Result**: Header should immediately show "Your address: [new address]" without page refresh

### To Test on Mobile:
1. Open mobile menu (hamburger icon)
2. Verify user name and image are displayed
3. Update profile
4. Close and reopen menu
5. **Expected Result**: Updated information should be visible

## Debugging

All components now include comprehensive console logging:

- **UpdateProfile.jsx**: Logs prefixed with `"UpdateProfile:"`
- **UpdateLocation.jsx**: Logs prefixed with `"UpdateLocation:"`
- **HeaderAfterLogin.jsx**: Logs prefixed with `"HeaderAfterLogin:"`

### Debug Pattern:
```javascript
console.log("=== ComponentName: Action Starting ===");
console.log("ComponentName: Relevant data:", data);
// ... operations ...
console.log("=== ComponentName: Action Complete ===");
```

### How to Debug:
1. Open browser DevTools (F12)
2. Go to Console tab
3. Update profile or address
4. Look for the logging sequence:
   ```
   === UpdateProfile: Profile update successful ===
   UpdateProfile: Dispatching userUpdated event
   === HeaderAfterLogin: Received userUpdated event ===
   HeaderAfterLogin: Updating userName from: "Old Name" to: "New Name"
   HeaderAfterLogin: State update complete
   ```

## Key Points

✅ **Real-time Updates**: Changes reflect immediately without page refresh
✅ **Data Persistence**: All updates saved to localStorage
✅ **Cross-Component Sync**: All components listening to `userUpdated` event stay in sync
✅ **Data Preservation**: Profile updates preserve address data and vice versa
✅ **Image URL Flexibility**: Handles various image URL formats
✅ **Fallback Support**: Multiple field checks for address compatibility
✅ **Comprehensive Logging**: Easy debugging with detailed console logs

## Future Improvements

1. **Add Loading States**: Show loading indicators during updates
2. **Optimistic Updates**: Update UI before API response
3. **Error Handling**: Better error messages if event dispatch fails
4. **TypeScript**: Add types for event detail structure
5. **Event Payload Validation**: Validate event.detail structure before using

## Troubleshooting

### Problem: Header not updating after profile change
**Solution**: 
1. Check browser console for event dispatch logs
2. Verify event listener is registered
3. Ensure `window.user` is being updated
4. Check if localStorage is accessible

### Problem: Image not displaying
**Solution**:
1. Check console for image URL construction logs
2. Verify `VITE_API_BASE_URL` is set in `.env`
3. Check network tab for failed image requests
4. Verify image path from API response

### Problem: Address not showing
**Solution**:
1. Check console for address field values
2. Verify at least one of: `address`, `user_address`, or `location` is set
3. Check if address is saved in `window.user`
4. Verify localStorage has updated user data


