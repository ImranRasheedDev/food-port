import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { toast } from 'react-toastify';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState(() => {
        const localData = localStorage.getItem('food-port-cart');
        return localData ? JSON.parse(localData) : [];
    });
    
    const [restaurantData, setRestaurantData] = useState(() => {
        const localData = localStorage.getItem('food-port-restaurant');
        return localData ? JSON.parse(localData) : null;
    });

    const [confirmationModal, setConfirmationModal] = useState({
        isOpen: false,
        title: '',
        description: '',
        onConfirm: null,
        onCancel: null,
        currentRestaurantName: '',
        newRestaurantName: '',
    });

    useEffect(() => {
        localStorage.setItem('food-port-cart', JSON.stringify(cartItems));
    }, [cartItems]);
    
    useEffect(() => {
        if (restaurantData) {
            localStorage.setItem('food-port-restaurant', JSON.stringify(restaurantData));
        }
    }, [restaurantData]);

    const addToCart = (item, onRestaurantConflict) => {
        setCartItems(prevItems => {
            // Check if cart has items from different restaurant
            if (prevItems.length > 0) {
                const currentRestaurantId = prevItems[0].restaurantId;
                if (currentRestaurantId !== item.restaurantId) {
                    // Trigger restaurant conflict callback
                    if (onRestaurantConflict) {
                        onRestaurantConflict({
                            currentRestaurantName: prevItems[0].restaurantName,
                            newRestaurantName: item.restaurantName,
                            onConfirm: () => {
                                // Clear cart and add new item
                                setRestaurantData({
                                    id: item.restaurantId,
                                    name: item.restaurantName
                                });
                                setCartItems([item]);
                            },
                            onCancel: () => {
                                // Keep existing cart unchanged
                                return prevItems;
                            }
                        });
                        return prevItems; // Return current items, modal will handle the actual change
                    }
                }
            }

            // Check if item already exists in cart
            const existingItemIndex = prevItems.findIndex(
                cartItem => 
                    cartItem.id === item.id && 
                    JSON.stringify(cartItem.selectedAddons) === JSON.stringify(item.selectedAddons) &&
                    cartItem.instructions === item.instructions
            );

            if (existingItemIndex > -1) {
                // Update quantity of existing item
                const updatedItems = [...prevItems];
                updatedItems[existingItemIndex].quantity += item.quantity;
                return updatedItems;
            } else {
                // Add new item to cart
                // Set restaurant data if it's the first item
                if (prevItems.length === 0) {
                    setRestaurantData({
                        id: item.restaurantId,
                        name: item.restaurantName
                    });
                }
                return [...prevItems, item];
            }
        });
    };

    const removeFromCart = (itemId) => {
        setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
    };

    const updateItemQuantity = (itemId, quantity) => {
        if (quantity <= 0) {
            removeFromCart(itemId);
            return;
        }
        
        setCartItems(prevItems => 
            prevItems.map(item => 
                item.id === itemId ? { ...item, quantity } : item
            )
        );
    };

    const clearCart = () => {
        setCartItems([]);
        setRestaurantData(null);
    };
    
    const setRestaurantInfo = (restaurant) => {
        setRestaurantData(restaurant);
    };

    const getCartTotal = () => {
        return cartItems.reduce((total, item) => {
            const itemTotal = item.price * item.quantity;
            
            // Add addon prices
            const addonTotal = Object.values(item.selectedAddons || {})
                .filter(addon => addon.selected)
                .reduce((addonSum, addon) => addonSum + (addon.price * addon.quantity * item.quantity), 0);
            
            return total + itemTotal + addonTotal;
        }, 0);
    };

    const getCartItemCount = () => {
        return cartItems.reduce((total, item) => total + item.quantity, 0);
    };

    const isCartEmpty = () => {
        return cartItems.length === 0;
    };

    const value = useMemo(() => ({
        items: cartItems,
        addToCart,
        removeFromCart,
        updateItemQuantity,
        clearCart,
        getCartTotal,
        getCartItemCount,
        isCartEmpty,
        restaurantData,
        setRestaurantInfo
    }), [cartItems, restaurantData]);

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);
