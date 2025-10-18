import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

// Custom scrollbar styles
const customScrollbarStyles = `
  .custom-scrollbar::-webkit-scrollbar {
    width: 6px;
  }
  
  .custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
    border-radius: 3px;
  }
  
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: #d1d5db;
    border-radius: 3px;
  }
  
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #9ca3af;
  }
  
  .scrollbar-thin {
    scrollbar-width: thin;
    scrollbar-color: #d1d5db transparent;
  }
  
  .scrollbar-thin::-webkit-scrollbar {
    width: 6px;
  }
  
  .scrollbar-thin::-webkit-scrollbar-track {
    background: transparent;
    border-radius: 3px;
  }
  
  .scrollbar-thin::-webkit-scrollbar-thumb {
    background: #d1d5db;
    border-radius: 3px;
  }
  
  .scrollbar-thin::-webkit-scrollbar-thumb:hover {
    background: #9ca3af;
  }
`;

// Helper function to render notification message
const renderNotificationMessage = (notification) => {
  if (notification.isPayment) {
    const beforePayment = notification.message.replace("Payment received", "").trim();
    return (
      <>
        {beforePayment}
        <span className="text-green-500 font-medium"> Payment received</span>
      </>
    );
  }
  
  if (notification.message.includes("Order no.")) {
    const parts = notification.message.split("Order no.");
    const orderNumber = parts[1]?.trim().split(" ")[0] || "";
    const afterOrderNumber = parts[1]?.substring(orderNumber.length).trim() || "";
    
    return (
      <>
        {parts[0]}
        Order no.{" "}
        <span className="text-red-500 font-medium">{orderNumber}</span>
        {afterOrderNumber && ` ${afterOrderNumber}`}
      </>
    );
  }
  
  return notification.message;
};

const NotificationMenu = ({ isOpen, onClose, triggerRef }) => {
  const menuRef = useRef(null);

  // Inject custom scrollbar styles
  useEffect(() => {
    if (!document.getElementById('notification-scrollbar-styles')) {
      const style = document.createElement('style');
      style.id = 'notification-scrollbar-styles';
      style.textContent = customScrollbarStyles;
      document.head.appendChild(style);
    }
  }, []);

  // Mock notification data based on the image
  const notifications = [
    {
      id: 1,
      avatar: "/images/avatar.jpg",
      name: "Amanda Clark",
      message: "Ordered large meal - Order no. 34567",
      time: "12:56",
      status: "order"
    },
    {
      id: 2,
      avatar: "/images/avatar.jpg", 
      name: "Adrian James",
      message: "Food delivered to Adrian James",
      time: "15:56",
      status: "delivered"
    },
    {
      id: 3,
      avatar: "/images/footer-logo.png",
      name: "Food Port",
      message: "Payment received",
      time: "15:45",
      status: "payment",
      isPayment: true
    },
    {
      id: 4,
      avatar: "/images/avatar.jpg",
      name: "Ariana", 
      message: "Order booked - Order no. 23456",
      time: "Yesterday",
      status: "order",
      orderNumber: "23456"
    },
    {
      id: 5,
      avatar: "/images/avatar.jpg",
      name: "Promotional",
      message: "Get featured on app create an ad",
      time: "Yesterday", 
      status: "promotional"
    },
    {
      id: 6,
      avatar: "/images/avatar.jpg",
      name: "Suzume Higashi",
      message: "Food delivered to Suzume",
      time: "10/12/2022",
      status: "delivered"
    },
    {
      id: 7,
      avatar: "/images/avatar.jpg",
      name: "Leonardo",
      message: "Ordered beef cheeseburger wi...",
      time: "10/12/2022",
      status: "order"
    }
  ];

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Don't close if clicking on the trigger element
      if (triggerRef.current && triggerRef.current.contains(event.target)) {
        return;
      }
      
      // Close if clicking outside the menu
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      // Use a small delay to ensure the toggle action completes first
      const timeoutId = setTimeout(() => {
        document.addEventListener("mousedown", handleClickOutside);
      }, 10);

      return () => {
        clearTimeout(timeoutId);
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }

    return () => {};
  }, [isOpen, onClose, triggerRef]);

  // Close menu on escape key
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      {/* Overlay for mobile */}
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      
      {/* Mobile notification panel */}
      <div
        ref={menuRef}
        className="absolute top-16 right-2 left-2 bg-white rounded-lg shadow-lg border overflow-hidden z-50"
        style={{ 
          // Height for exactly 6 notifications (each notification ~72px height)
          height: notifications.length <= 6 ? `${notifications.length * 72 + 8}px` : `${6 * 72 + 8}px`,
          width: "calc(100% - 16px)",
          minWidth: "320px"
        }}
      >
        <div 
          className={`overflow-y-auto px-4 ${notifications.length > 6 ? 'custom-scrollbar' : ''}`}
          style={{ 
            height: notifications.length <= 6 ? `${notifications.length * 72 + 8}px` : `${6 * 72 + 8}px`,
            scrollbarWidth: notifications.length > 6 ? 'thin' : 'none'
          }}
        >
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className="flex items-start py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 cursor-pointer"
            >
              {/* Avatar */}
              <div className="flex-shrink-0 mr-3">
                <img
                  src={notification.avatar}
                  alt={notification.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
              </div>
              
              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div className="flex-1 pr-2">
                    <p className="font-semibold text-gray-900 text-base leading-tight">
                      {notification.name}
                    </p>
                    <p className="text-gray-600 text-sm mt-1 leading-relaxed">
                      {renderNotificationMessage(notification)}
                    </p>
                  </div>
                  
                  {/* Time */}
                  <div className="flex-shrink-0">
                    <span className="text-xs text-gray-500 whitespace-nowrap">
                      {notification.time}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Desktop version that appears as dropdown
const DesktopNotificationMenu = ({ isOpen, onClose, triggerRef }) => {
  const menuRef = useRef(null);

  const notifications = [
    {
      id: 1,
      avatar: "/images/avatar.jpg",
      name: "Amanda Clark",
      message: "Ordered large meal - Order no. 34567",
      time: "12:56",
      status: "order"
    },
    {
      id: 2,
      avatar: "/images/avatar.jpg", 
      name: "Adrian James",
      message: "Food delivered to Adrian James",
      time: "15:56",
      status: "delivered"
    },
    {
      id: 3,
      avatar: "/images/footer-logo.png",
      name: "Food Port",
      message: "Payment received",
      time: "15:45",
      status: "payment",
      isPayment: true
    },
    {
      id: 4,
      avatar: "/images/avatar.jpg",
      name: "Ariana", 
      message: "Order booked - Order no. 23456",
      time: "Yesterday",
      status: "order",
      orderNumber: "23456"
    },
    {
      id: 5,
      avatar: "/images/avatar.jpg",
      name: "Promotional",
      message: "Get featured on app create an ad",
      time: "Yesterday", 
      status: "promotional"
    },
    {
      id: 6,
      avatar: "/images/avatar.jpg",
      name: "Suzume Higashi",
      message: "Food delivered to Suzume",
      time: "10/12/2022",
      status: "delivered"
    },
    {
      id: 7,
      avatar: "/images/avatar.jpg",
      name: "Leonardo",
      message: "Ordered beef cheeseburger wi...",
      time: "10/12/2022",
      status: "order"
    }
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      // Don't close if clicking on the trigger element
      if (triggerRef.current && triggerRef.current.contains(event.target)) {
        return;
      }
      
      // Close if clicking outside the menu
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      // Use a small delay to ensure the toggle action completes first
      const timeoutId = setTimeout(() => {
        document.addEventListener("mousedown", handleClickOutside);
      }, 10);

      return () => {
        clearTimeout(timeoutId);
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }

    return () => {};
  }, [isOpen, onClose, triggerRef]);

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 hidden md:block pointer-events-none">
      <div
        ref={menuRef}
        className="absolute bg-white rounded-lg shadow-lg border pointer-events-auto"
        style={{
          top: "80px",
          right: "20px",
          width: "420px",
          // Height for exactly 6 notifications (each notification ~72px height)
          height: notifications.length <= 6 ? `${notifications.length * 72 + 8}px` : `${6 * 72 + 8}px`
        }}
      >
        <div 
          className={`overflow-y-auto px-4 ${notifications.length > 6 ? 'custom-scrollbar' : ''}`}
          style={{ 
            height: notifications.length <= 6 ? `${notifications.length * 72 + 8}px` : `${6 * 72 + 8}px`,
            scrollbarWidth: notifications.length > 6 ? 'thin' : 'none'
          }}
        >
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className="flex items-start py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 cursor-pointer"
            >
              {/* Avatar */}
              <div className="flex-shrink-0 mr-3">
                <img
                  src={notification.avatar}
                  alt={notification.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
              </div>
              
              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div className="flex-1 pr-2">
                    <p className="font-semibold text-gray-900 text-base leading-tight">
                      {notification.name}
                    </p>
                    <p className="text-gray-600 text-sm mt-1 leading-relaxed">
                      {renderNotificationMessage(notification)}
                    </p>
                  </div>
                  
                  {/* Time */}
                  <div className="flex-shrink-0">
                    <span className="text-xs text-gray-500 whitespace-nowrap">
                      {notification.time}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export { NotificationMenu, DesktopNotificationMenu };
