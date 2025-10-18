// public/firebase-messaging-sw.js
importScripts("https://www.gstatic.com/firebasejs/10.7.2/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.7.2/firebase-messaging-compat.js");

firebase.initializeApp({
    apiKey: "AIzaSyCxiUEN77g93rz-ymKQqn8tLD_3nS5Px6k",
    authDomain: "endless-air-452303-f5.firebaseapp.com",
    projectId: "endless-air-452303-f5",
    storageBucket: "endless-air-452303-f5.firebasestorage.app",
    messagingSenderId: "1029591382872",
    appId: "1:1029591382872:web:4f1b006458b0d2240c832d"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log("Received background message: ", payload);
  const { title, body } = payload.notification;
  self.registration.showNotification(title, { body });
});
