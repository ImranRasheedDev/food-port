import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { cn, processImageUrl } from "@/lib/utils";
import { 
  useNotifications, 
  useUnreadNotifications, 
  useMarkNotificationRead, 
  useMarkAllNotificationsRead,
  useDeleteNotification,
  useDeleteAllNotifications 
} from "@/hooks/api/useNotifications";

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
  const message = notification.data?.body || notification.data?.title || "Notification";
  const orderId = notification.data?.data?.order_id;
  
  if (message.includes("Payment received")) {
    const beforePayment = message.replace("Payment received", "").trim();
    return (
      <>
        {beforePayment}
        <span className="text-green-500 font-medium"> Payment received</span>
        {orderId && (
          <span className="text-red-500 font-medium"> Order #{orderId}</span>
        )}
      </>
    );
  }
  
  if (message.includes("Order") || orderId) {
    if (message.includes("Order no.")) {
      const parts = message.split("Order no.");
      const orderNumber = parts[1]?.trim().split(" ")[0] || orderId;
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
    
    return (
      <>
        {message}
        {orderId && (
          <span className="text-red-500 font-medium"> Order #{orderId}</span>
        )}
      </>
    );
  }
  
  return message;
};

const NotificationMenu = ({ isOpen, onClose, triggerRef, firebaseNotificationCount = 0 }) => {
  const menuRef = useRef(null);
  const navigate = useNavigate();
  
  // API hooks
  const { data: notificationsResponse = {}, isLoading, error, refetch } = useNotifications();
  const { data: unreadNotificationsResponse } = useUnreadNotifications();
  const markAsRead = useMarkNotificationRead();
  const markAllRead = useMarkAllNotificationsRead();
  const deleteNotification = useDeleteNotification();

  // Extract notifications from API response
  const notifications = notificationsResponse?.data || [];
  const unreadCount = unreadNotificationsResponse?.data?.length || 0;
  const totalUnreadCount = unreadCount + firebaseNotificationCount;
  console.log("=== NOTIFICATION DEBUG ===");
  console.log("notificationsResponse:", notificationsResponse);
  console.log("notifications:", notifications);
  console.log("notifications.length:", notifications?.length);
  console.log("unreadNotificationsResponse:", unreadNotificationsResponse);
  console.log("unreadCount:", unreadCount);
  console.log("firebaseNotificationCount:", firebaseNotificationCount);
  console.log("totalUnreadCount:", totalUnreadCount);
  console.log("=== END DEBUG ===");

  // Inject custom scrollbar styles
  useEffect(() => {
    if (!document.getElementById('notification-scrollbar-styles')) {
      const style = document.createElement('style');
      style.id = 'notification-scrollbar-styles';
      style.textContent = customScrollbarStyles;
      document.head.appendChild(style);
    }
  }, []);

  // Handle notification click
  const handleNotificationClick = async (event, notification) => {
    event.stopPropagation(); // Prevent event bubbling
    if (!notification.read_at) {
      try {
        console.log('Marking notification as read:', notification.id);
        await markAsRead.mutateAsync(notification.id);
        console.log('Successfully marked notification as read');
        // The mutation will automatically invalidate queries, no need for manual refetch
      } catch (error) {
        console.error('Failed to mark notification as read:', error);
      }
    }
    // Don't close menu on click
  };

  // Handle mark all as read
  const handleMarkAllRead = async (event) => {
    event.stopPropagation(); // Prevent event bubbling
    try {
      await markAllRead.mutateAsync();
      // The mutation will automatically invalidate queries, no need for manual refetch
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
    }
  };

  // Handle delete notification
  const handleDeleteNotification = async (e, notificationId) => {
    e.stopPropagation();
    try {
      await deleteNotification.mutateAsync(notificationId);
      // The mutation will automatically invalidate queries, no need for manual refetch
    } catch (error) {
      console.error('Failed to delete notification:', error);
    }
  };

  // Handle view all notifications
  const handleViewAll = (event) => {
    event.stopPropagation(); // Prevent event bubbling
    navigate('/notifications');
    onClose();
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (triggerRef.current && triggerRef.current.contains(event.target)) {
        return;
      }
      
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      const timeoutId = setTimeout(() => {
        document.addEventListener("click", handleClickOutside);
      }, 10);

      return () => {
        clearTimeout(timeoutId);
        document.removeEventListener("click", handleClickOutside);
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

  // Show loading state
  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 md:hidden">
        <div className="fixed inset-0 bg-black/50" onClick={onClose} />
        <div
          ref={menuRef}
          className="absolute top-16 right-2 left-2 bg-white rounded-lg shadow-lg border overflow-hidden z-50 flex items-center justify-center"
          style={{ 
            height: "200px",
            width: "calc(100% - 16px)",
            minWidth: "320px"
          }}
        >
          <div className="text-gray-500">Loading notifications...</div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="fixed inset-0 z-50 md:hidden">
        <div className="fixed inset-0 bg-black/50" onClick={onClose} />
        <div
          ref={menuRef}
          className="absolute top-16 right-2 left-2 bg-white rounded-lg shadow-lg border overflow-hidden z-50 flex items-center justify-center"
          style={{ 
            height: "200px",
            width: "calc(100% - 16px)",
            minWidth: "320px"
          }}
        >
          <div className="text-red-500">Failed to load notifications</div>
        </div>
      </div>
    );
  }

  // Show no notifications state - check for empty array, null, undefined, or invalid data
  const hasValidNotifications = notifications && 
    Array.isArray(notifications) && 
    notifications.length > 0 && 
    notifications.some(notification => notification && notification.id);
    
  if (!hasValidNotifications) {
    return (
      <div className="fixed inset-0 z-50 md:hidden">
        <div className="fixed inset-0 bg-black/50" onClick={onClose} />
        <div
          ref={menuRef}
          className="absolute top-16 right-2 left-2 bg-white rounded-lg shadow-lg border overflow-hidden z-50 flex items-center justify-center"
          style={{ 
            height: "200px",
            width: "calc(100% - 16px)",
            minWidth: "320px"
          }}
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
        >
          <div className="text-gray-500 text-center">
            <div className="text-4xl mb-2">🔔</div>
            <div>No notifications found</div>
            <div className="text-sm text-gray-400 mt-2">You're all caught up!</div>
          </div>
        </div>
      </div>
    );
  }

  // Filter out invalid notifications and limit display
  const validNotifications = notifications.filter(notification => 
    notification && notification.id && notification.data
  );
  const displayNotifications = validNotifications.slice(0, 6);
  const hasMoreNotifications = validNotifications.length > 6;

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      {/* Overlay for mobile */}
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      
      {/* Mobile notification panel */}
      <div
        ref={menuRef}
        className="absolute top-16 right-2 left-2 bg-white rounded-lg shadow-lg border overflow-hidden z-50"
        style={{ 
          height: displayNotifications.length <= 6 ? `${displayNotifications.length * 72 + 60}px` : `${6 * 72 + 60}px`,
          width: "calc(100% - 16px)",
          minWidth: "320px"
        }}
        onClick={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
      >
        {/* Header with Mark All Read button */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-gray-50" onClick={(e) => e.stopPropagation()}>
          <h3 className="font-semibold text-gray-900">Notifications</h3>
          {totalUnreadCount > 0 && (
            <button
              onClick={(event) => handleMarkAllRead(event)}
              onMouseDown={(e) => e.stopPropagation()}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
              disabled={markAllRead.isPending}
            >
              {markAllRead.isPending ? 'Marking...' : 'Mark all read'}
            </button>
          )}
        </div>

        <div 
          className={`overflow-y-auto ${displayNotifications.length > 6 ? 'custom-scrollbar' : ''}`}
          style={{ 
            height: displayNotifications.length <= 6 ? `${displayNotifications.length * 72}px` : `${6 * 72}px`,
            scrollbarWidth: displayNotifications.length > 6 ? 'thin' : 'none'
          }}
          onClick={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
        >
          {displayNotifications.map((notification) => (
            <div
              key={notification.id}
              onClick={(event) => handleNotificationClick(event, notification)}
              onMouseDown={(e) => e.stopPropagation()}
              className={`flex items-start py-3 px-4 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 cursor-pointer relative group ${
                notification.read_at ? 'bg-gray-50' : 'bg-gray-100'
              }`}
            >
              {/* Avatar */}
              <div className="flex-shrink-0 mr-3">
                <img
                  src={processImageUrl("/images/avatar.jpg")}
                  alt={notification.data?.title || "User"}
                  className="w-12 h-12 rounded-full object-cover"
                />
              </div>
              
              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div className="flex-1 pr-2">
                    <p className="font-semibold text-gray-900 text-base leading-tight">
                      {notification.data?.title || "Notification"}
                    </p>
                    <p className="text-sm mt-1 leading-relaxed text-gray-600">
                      {renderNotificationMessage(notification)}
                    </p>
                  </div>
                  
                  {/* Time */}
                  <div className="flex-shrink-0">
                    <span className="text-xs text-gray-500 whitespace-nowrap">
                      {notification.created_at ? new Date(notification.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : 'Now'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All button */}
        {true && (
          <div className="px-4 py-3 border-t border-gray-200 bg-gray-50" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={(event) => handleViewAll(event)}
              onMouseDown={(e) => e.stopPropagation()}
              className="w-full text-center text-blue-600 hover:text-blue-800 font-medium py-2"
            >
              View All Notifications
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// Desktop version that appears as dropdown
const DesktopNotificationMenu = ({ isOpen, onClose, triggerRef, firebaseNotificationCount = 0 }) => {
  const menuRef = useRef(null);
  const navigate = useNavigate();
  
  // API hooks
  const { data: notificationsResponse = {}, isLoading, error, refetch } = useNotifications();
  const { data: unreadNotificationsResponse } = useUnreadNotifications();
  const markAsRead = useMarkNotificationRead();
  const markAllRead = useMarkAllNotificationsRead();
  const deleteNotification = useDeleteNotification();

  // Extract notifications from API response
  const notifications = notificationsResponse?.data || [];
  const unreadCount = unreadNotificationsResponse?.data?.length || 0;
  const totalUnreadCount = unreadCount + firebaseNotificationCount;
  console.log("=== DESKTOP NOTIFICATION DEBUG ===");
  console.log("notificationsResponse:", notificationsResponse);
  console.log("notifications:", notifications);
  console.log("notifications.length:", notifications?.length);
  console.log("unreadNotificationsResponse:", unreadNotificationsResponse);
  console.log("unreadCount:", unreadCount);
  console.log("firebaseNotificationCount:", firebaseNotificationCount);
  console.log("totalUnreadCount:", totalUnreadCount);
  console.log("=== END DESKTOP DEBUG ===");

  // Handle notification click
  const handleNotificationClick = async (event, notification) => {
    event.stopPropagation(); // Prevent event bubbling
    if (!notification.read_at) {
      try {
        await markAsRead.mutateAsync(notification.id);
        // The mutation will automatically invalidate queries, no need for manual refetch
      } catch (error) {
        console.error('Failed to mark notification as read:', error);
      }
    }
    // Don't close menu on click
  };

  // Handle mark all as read
  const handleMarkAllRead = async (event) => {
    event.stopPropagation(); // Prevent event bubbling
    try {
      await markAllRead.mutateAsync();
      // The mutation will automatically invalidate queries, no need for manual refetch
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
    }
  };

  // Handle delete notification
  const handleDeleteNotification = async (e, notificationId) => {
    e.stopPropagation();
    try {
      await deleteNotification.mutateAsync(notificationId);
      // The mutation will automatically invalidate queries, no need for manual refetch
    } catch (error) {
      console.error('Failed to delete notification:', error);
    }
  };

  // Handle view all notifications
  const handleViewAll = (event) => {
    event.stopPropagation(); // Prevent event bubbling
    navigate('/notifications');
    onClose();
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (triggerRef.current && triggerRef.current.contains(event.target)) {
        return;
      }
      
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      const timeoutId = setTimeout(() => {
        document.addEventListener("click", handleClickOutside);
      }, 10);

      return () => {
        clearTimeout(timeoutId);
        document.removeEventListener("click", handleClickOutside);
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

  // Show loading state
  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 hidden md:block pointer-events-none">
        <div
          ref={menuRef}
          className="absolute bg-white rounded-lg shadow-lg border pointer-events-auto flex items-center justify-center"
          style={{
            top: "68px",
            right: "20px",
            width: "420px",
            height: "200px"
          }}
        >
          <div className="text-gray-500">Loading notifications...</div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="fixed inset-0 z-50 hidden md:block pointer-events-none">
        <div
          ref={menuRef}
          className="absolute bg-white rounded-lg shadow-lg border pointer-events-auto flex items-center justify-center"
          style={{
            top: "68px",
            right: "20px",
            width: "420px",
            height: "200px"
          }}
        >
          <div className="text-red-500">Failed to load notifications</div>
        </div>
      </div>
    );
  }

  // Show no notifications state - check for empty array, null, undefined, or invalid data
  const hasValidNotifications = notifications && 
    Array.isArray(notifications) && 
    notifications.length > 0 && 
    notifications.some(notification => notification && notification.id);
    
  if (!hasValidNotifications) {
    return (
      <div className="fixed inset-0 z-50 hidden md:block pointer-events-none">
        <div
          ref={menuRef}
          className="absolute bg-white rounded-lg shadow-lg border pointer-events-auto flex items-center justify-center"
          style={{
            top: "68px",
            right: "20px",
            width: "420px",
            height: "200px"
          }}
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
        >
          <div className="text-gray-500 text-center">
            <div className="text-4xl mb-2">🔔</div>
            <div>No notifications found</div>
            <div className="text-sm text-gray-400 mt-2">You're all caught up!</div>
          </div>
        </div>
      </div>
    );
  }

  // Filter out invalid notifications and limit display
  const validNotifications = notifications.filter(notification => 
    notification && notification.id && notification.data
  );
  const displayNotifications = validNotifications.slice(0, 6);
  const hasMoreNotifications = validNotifications.length > 6;

  return (
    <div className="fixed inset-0 z-50 hidden md:block pointer-events-none">
      <div
        ref={menuRef}
        className="absolute bg-white rounded-lg shadow-lg border pointer-events-auto"
        style={{
          top: "68px",
          right: "20px",
          width: "420px",
          height: displayNotifications.length <= 6 ? `${displayNotifications.length * 72 + 60}px` : `${6 * 72 + 60}px`
        }}
        onClick={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
      >
        {/* Header with Mark All Read button */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-gray-50" onClick={(e) => e.stopPropagation()}>
          <h3 className="font-semibold text-gray-900">Notifications</h3>
          {totalUnreadCount > 0 && (
            <button
              onClick={(event) => handleMarkAllRead(event)}
              onMouseDown={(e) => e.stopPropagation()}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
              disabled={markAllRead.isPending}
            >
              {markAllRead.isPending ? 'Marking...' : 'Mark all read'}
            </button>
          )}
        </div>

        <div 
          className={`overflow-y-auto ${displayNotifications.length > 6 ? 'custom-scrollbar' : ''}`}
          style={{ 
            height: displayNotifications.length <= 6 ? `${displayNotifications.length * 72}px` : `${6 * 72}px`,
            scrollbarWidth: displayNotifications.length > 6 ? 'thin' : 'none'
          }}
          onClick={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
        >
          {displayNotifications.map((notification) => (
            <div
              key={notification.id}
              onClick={(event) => handleNotificationClick(event, notification)}
              onMouseDown={(e) => e.stopPropagation()}
              className={`flex items-start py-3 px-4 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 cursor-pointer relative group ${
                notification.read_at ? 'bg-gray-50' : 'bg-gray-100'
              }`}
            >
              {/* Avatar */}
              <div className="flex-shrink-0 mr-3">
                <img
                  src={processImageUrl("/images/avatar.jpg")}
                  alt={notification.data?.title || "User"}
                  className="w-12 h-12 rounded-full object-cover"
                />
              </div>
              
              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div className="flex-1 pr-2">
                    <p className="font-semibold text-gray-900 text-base leading-tight">
                      {notification.data?.title || "Notification"}
                    </p>
                    <p className="text-sm mt-1 leading-relaxed text-gray-600">
                      {renderNotificationMessage(notification)}
                    </p>
                  </div>
                  
                  {/* Time */}
                  <div className="flex-shrink-0">
                    <span className="text-xs text-gray-500 whitespace-nowrap">
                      {notification.created_at ? new Date(notification.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : 'Now'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All button */}
        {true && (
          <div className="px-4 py-3 border-t border-gray-200 bg-gray-50" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={(event) => handleViewAll(event)}
              onMouseDown={(e) => e.stopPropagation()}
              className="w-full text-center text-blue-600 hover:text-blue-800 font-medium py-2"
            >
              View All Notifications
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export { NotificationMenu, DesktopNotificationMenu };