import { useState, useCallback } from 'react';

export const useCartConfirmation = () => {
  const [confirmationModal, setConfirmationModal] = useState({
    isOpen: false,
    title: '',
    description: '',
    onConfirm: null,
    onCancel: null,
    currentRestaurantName: '',
    newRestaurantName: '',
  });

  const showRestaurantConfirmation = useCallback((
    currentRestaurantName,
    newRestaurantName,
    onConfirm,
    onCancel
  ) => {
    setConfirmationModal({
      isOpen: true,
      title: 'Different Restaurant Detected',
      description: (
        <span>
          You have items from <strong className="font-bold text-primary-50">{currentRestaurantName}</strong> in your cart. 
          Adding items from <strong className="font-bold text-primary-50">{newRestaurantName}</strong> will remove your previous cart items. 
          Do you want to continue?
        </span>
      ),
      onConfirm,
      onCancel,
      currentRestaurantName,
      newRestaurantName,
    });
  }, []);

  const handleConfirm = useCallback(() => {
    if (confirmationModal.onConfirm) {
      confirmationModal.onConfirm();
    }
    setConfirmationModal(prev => ({ ...prev, isOpen: false }));
  }, [confirmationModal.onConfirm]);

  const handleCancel = useCallback(() => {
    if (confirmationModal.onCancel) {
      confirmationModal.onCancel();
    }
    setConfirmationModal(prev => ({ ...prev, isOpen: false }));
  }, [confirmationModal.onCancel]);

  const closeModal = useCallback(() => {
    setConfirmationModal(prev => ({ ...prev, isOpen: false }));
  }, []);

  return {
    confirmationModal,
    showRestaurantConfirmation,
    handleConfirm,
    handleCancel,
    closeModal,
  };
};
