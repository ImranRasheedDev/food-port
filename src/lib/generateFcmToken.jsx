import { getToken } from "firebase/messaging";
import { messaging } from "@/firebase/firebaseConfig";

export const getFcmToken = async () => {
  try {
    // Request notification permission first
    const permission = await Notification.requestPermission();
    console.log("Notification permission:", permission);
    
    if (permission !== 'granted') {
      console.warn("Notification permission not granted");
      return null;
    }

    const token = await getToken(messaging, {
      vapidKey: "BOZcGTsC2cbxy8P74qPHq8Ba1byXsSCjZicvJdU_kmPEDd1BMcn0v9NroJZWn2z8MPW2rd4iXz1d0PHMAFHT2Wg",
    });
    console.log("FCM Token:", token);
    return token;
  } catch (error) {
    console.error("Error getting FCM token:", error);
    return null;
  }
};
