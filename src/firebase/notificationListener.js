import { onMessage } from "firebase/messaging";
import { messaging } from "./firebaseConfig";

export const setupNotificationListener = (setNotifications) => {
  onMessage(messaging, (payload) => {
    console.log("New Notification:", payload);
    setNotifications((prev) => [
      payload.notification,
      ...prev,
    ]);
  });
};
