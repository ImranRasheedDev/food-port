import { useApiQuery, useApiMutation } from './useApi';

// Get cart count
export const useCartCount = (options = {}) => {
  return useApiQuery(['cart', 'count'], '/invoice/count', {}, options);
};

// Get all invoices
export const useInvoices = (options = {}) => {
  return useApiQuery(['invoices'], '/invoice/all', {}, options);
};

// Get single invoice
export const useInvoice = (invoiceId, options = {}) => {
  return useApiQuery(
    ['invoice', invoiceId],
    `/invoice/single/${invoiceId}`,
    {},
    {
      enabled: !!invoiceId,
      ...options,
    }
  );
};

// Update order status
export const useUpdateOrderStatus = (options = {}) => {
  return useApiMutation('/invoice/update-status', {
    invalidateQueries: [['invoices']],
    ...options,
  });
};

// Place order (add invoice)
export const usePlaceOrder = (options = {}) => {
  return useApiMutation('/invoice/add', {
    invalidateQueries: [['invoices'], ['cart', 'count']],
    ...options,
  });
};

// Helper function to format cart items for API
export const formatCartForAPI = (cartItems, restaurantId, deliveryAddressId = null, userAddresses = [], paymentIntentId = null, totalPrice = 0, stripePlatformFee = null) => {
  const orders = cartItems.map(item => {
    const addons = Object.values(item.addons || {})
      .filter(addon => addon.selected)
      .map(addon => ({
        product_addon_id: parseInt(Object.keys(item.addons).find(id => item.addons[id] === addon)),
        quantity: addon.quantity
      }));

    return {
      product_id: item.id,
      quantity: item.quantity,
      addons: addons
    };
  });

  // If no delivery address provided and user has addresses, use default address
  let finalDeliveryAddressId = deliveryAddressId;
  if (!finalDeliveryAddressId && userAddresses.length > 0) {
    const defaultAddress = userAddresses.find(addr => addr.is_default) || userAddresses[0];
    finalDeliveryAddressId = defaultAddress?.id;
  }

  // If still no address, use restaurant address
  if (!finalDeliveryAddressId) {
    return {
      restaurant_id: restaurantId,
      use_restaurant_address: true,
      orders: orders
    };
  }

  // Use platform fee from Stripe if available, otherwise calculate (5% of total price)
  const calculatedPlatformFee = stripePlatformFee || (totalPrice * 0.05);
  const finalPlatformFee = typeof calculatedPlatformFee === 'number' ? calculatedPlatformFee : parseFloat(calculatedPlatformFee);

  const orderData = {
    restaurant_id: restaurantId,
    delivery_address_id: finalDeliveryAddressId,
    platform_fee: finalPlatformFee,
    orders: orders
  };

  // Add payment intent ID if provided (for card payments)
  if (paymentIntentId) {
    orderData.payment_intent_id = paymentIntentId;
    orderData.payment_method = 'card';
  } else {
    orderData.payment_method = 'cash';
  }

  return orderData;
};
