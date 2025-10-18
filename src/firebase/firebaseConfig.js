import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";

const firebaseConfig = {
    apiKey: "AIzaSyCxiUEN77g93rz-ymKQqn8tLD_3nS5Px6k",
    authDomain: "endless-air-452303-f5.firebaseapp.com",
    projectId: "endless-air-452303-f5",
    storageBucket: "endless-air-452303-f5.firebasestorage.app",
    messagingSenderId: "1029591382872",
    appId: "1:1029591382872:web:4f1b006458b0d2240c832d"
  };
  


const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);
