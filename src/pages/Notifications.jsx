import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { processImageUrl } from "@/lib/utils";
import {
  useNotifications,
  useUnreadNotifications,
  useMarkNotificationRead,
  useMarkAllNotificationsRead,
  useDeleteNotification,
  useDeleteAllNotifications,
} from "@/hooks/api/useNotifications";

// Helper function to render notification message
const renderNotificationMessage = (notification) => {
  const message =
    notification.data?.body || notification.data?.title || "Notification";
  const orderId = notification.data?.data?.order_id;

  if (message.includes("Payment received")) {
    const beforePayment = message.replace("Payment received", "").trim();
    return (
      <>
        {beforePayment}
        <span className="text-green-500 font-medium"> Payment received</span>
        {orderId && (
          <span className="block mt-1 text-green-600 font-medium">
            Order #{orderId}
          </span>
        )}
      </>
    );
  }

  if (message.includes("Order") || orderId) {
    return (
      <>
        {message}
        {orderId && (
          <span className="block mt-1 text-blue-600 font-medium">
            Order #{orderId}
          </span>
        )}
      </>
    );
  }

  return message;
};

// Helper function to format date
const formatDate = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInHours = (now - date) / (1000 * 60 * 60);

  if (diffInHours < 1) {
    return "Just now";
  } else if (diffInHours < 24) {
    return `${Math.floor(diffInHours)}h ago`;
  } else if (diffInHours < 48) {
    return "Yesterday";
  } else {
    return date.toLocaleDateString();
  }
};

// Helper function to group notifications by date
const groupNotificationsByDate = (notifications) => {
  const groups = {};

  notifications?.data?.forEach((notification) => {
    const date = new Date(notification.created_at);
    const dateKey = date.toDateString();

    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }
    groups[dateKey].push(notification);
  });

  return groups;
};

const Notifications = () => {
  const navigate = useNavigate();
  const [selectedNotifications, setSelectedNotifications] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  // API hooks
  const {
    data: notifications = [],
    isLoading,
    error,
    refetch,
  } = useNotifications();
  const { data: unreadCount = 0 } = useUnreadNotifications();
  const markAsRead = useMarkNotificationRead();
  const markAllRead = useMarkAllNotificationsRead();
  const deleteNotification = useDeleteNotification();
  const deleteAllNotifications = useDeleteAllNotifications();

  // Handle notification click
  const handleNotificationClick = async (notification) => {
    if (!notification.read_at) {
      try {
        await markAsRead.mutateAsync(notification.id);
        // No need for manual refetch - mutation automatically invalidates queries
      } catch (error) {
        console.error("Failed to mark notification as read:", error);
      }
    }
  };

  // Handle mark all as read
  const handleMarkAllRead = async () => {
    try {
      await markAllRead.mutateAsync();
      // No need for manual refetch - mutation automatically invalidates queries
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error);
    }
  };

  // Handle delete notification
  const handleDeleteNotification = async (notificationId) => {
    try {
      await deleteNotification.mutateAsync(notificationId);
      // No need for manual refetch - mutation automatically invalidates queries
    } catch (error) {
      console.error("Failed to delete notification:", error);
    }
  };

  // Handle delete selected notifications
  const handleDeleteSelected = async () => {
    try {
      for (const id of selectedNotifications) {
        await deleteNotification.mutateAsync(id);
      }
      setSelectedNotifications([]);
      setSelectAll(false);
      // No need for manual refetch - mutations automatically invalidate queries
    } catch (error) {
      console.error("Failed to delete selected notifications:", error);
    }
  };

  // Handle delete all notifications
  const handleDeleteAll = async () => {
    try {
      await deleteAllNotifications.mutateAsync();
      setSelectedNotifications([]);
      setSelectAll(false);
      // No need for manual refetch - mutation automatically invalidates queries
    } catch (error) {
      console.error("Failed to delete all notifications:", error);
    }
  };

  // Handle select all
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedNotifications([]);
    } else {
      setSelectedNotifications(notifications.map((n) => n.id));
    }
    setSelectAll(!selectAll);
  };

  // Handle individual selection
  const handleSelectNotification = (notificationId) => {
    if (selectedNotifications.includes(notificationId)) {
      setSelectedNotifications(
        selectedNotifications.filter((id) => id !== notificationId)
      );
    } else {
      setSelectedNotifications([...selectedNotifications, notificationId]);
    }
  };

  const groupedNotifications = groupNotificationsByDate(notifications);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading notifications...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Failed to load notifications
          </h2>
          <p className="text-gray-600 mb-4">
            There was an error loading your notifications.
          </p>
          <button
            onClick={() => refetch()}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!notifications || notifications.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🔔</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            No notifications
          </h2>
          <p className="text-gray-600 mb-4">
            You don't have any notifications yet.
          </p>
          <button
            onClick={() => navigate("/")}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate(-1)}
                className="text-gray-600 hover:text-gray-900"
              >
                ← Back
              </button>
              <h1 className="text-2xl font-bold text-gray-900">
                Notifications
              </h1>
              {unreadCount > 0 && (
                <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
                  {unreadCount} unread
                </span>
              )}
            </div>

            <div className="flex items-center space-x-2">
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllRead}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                  disabled={markAllRead.isPending}
                >
                  {markAllRead.isPending ? "Marking..." : "Mark all read"}
                </button>
              )}

              {selectedNotifications.length > 0 && (
                <button
                  onClick={handleDeleteSelected}
                  className="text-sm text-red-600 hover:text-red-800 font-medium"
                  disabled={deleteNotification.isPending}
                >
                  Delete Selected ({selectedNotifications.length})
                </button>
              )}

              {notifications.length > 0 && (
                <button
                  onClick={handleDeleteAll}
                  className="text-sm text-red-600 hover:text-red-800 font-medium"
                  disabled={deleteAllNotifications.isPending}
                >
                  Delete All
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Grouped Notifications */}
        {Object.entries(groupedNotifications).map(
          ([dateKey, dateNotifications]) => (
            <div key={dateKey} className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 px-2">
                {new Date(dateKey).toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </h3>

              <div className="space-y-2">
                {dateNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`rounded-lg shadow-sm border p-4 hover:shadow-md transition-shadow ${
                      notification.read_at ? "bg-gray-50" : "bg-gray-100"
                    }`}
                  >
                    <div className="flex items-start space-x-4">
                      {/* Notification Icon */}

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="font-semibold text-gray-900 text-base">
                              {notification.data?.title || "Notification"}
                            </p>
                            <p className="text-gray-600 text-sm mt-1">
                              {renderNotificationMessage(notification)}
                            </p>
                          </div>

                          {/* Time and Actions */}
                          <div className="flex items-center space-x-2 ml-4">
                            <span className="text-xs text-gray-500 whitespace-nowrap">
                              {formatDate(notification.created_at)}
                            </span>
                            {!notification.read_at && (
                              <button
                                onClick={() =>
                                  handleNotificationClick(notification)
                                }
                                className="text-xs cursor-pointer text-blue-600 hover:text-blue-800 font-medium"
                              >
                                Mark read
                              </button>
                            )}
                            <button
                              onClick={() =>
                                handleDeleteNotification(notification.id)
                              }
                              className="text-xs text-red-600 hover:text-red-800 font-medium"
                              disabled={deleteNotification.isPending}
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default Notifications;
