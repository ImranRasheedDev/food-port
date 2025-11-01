import { onMessage } from "firebase/messaging";
import { messaging } from "./firebaseConfig";

export const setupNotificationListener = (callback) => {
  onMessage(messaging, (payload) => {
    console.log("New Firebase Notification:", payload);
    // Show browser notification
    if (payload.notification) {
      new Notification(payload.notification.title, {
        body: payload.notification.body,
        icon: '/images/logo.png'
      });
    }
    // Call the callback to update badge count
    if (callback) {
      callback(payload);
    }
  });
};
