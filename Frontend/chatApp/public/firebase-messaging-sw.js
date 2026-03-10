/* eslint-disable no-undef */
// Firebase Messaging Service Worker
// This runs in the background to handle push notifications when the app is not in focus.

importScripts(
  "https://www.gstatic.com/firebasejs/10.14.1/firebase-app-compat.js",
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.14.1/firebase-messaging-compat.js",
);

// Your Firebase config (must match what's in firebase.config.js)
const firebaseConfig = {
  apiKey: "AIzaSyDu620Io-JFN-hbFFu5UPlvUHY-db5LR_Y",
  authDomain: "sociocverse-notifications.firebaseapp.com",
  projectId: "sociocverse-notifications",
  storageBucket: "sociocverse-notifications.firebasestorage.app",
  messagingSenderId: "867650529409",
  appId: "1:867650529409:web:c87884df284531b9368580",
  measurementId: "G-9D9XSBFS6G",
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

// Handle background messages (when the app/tab is not in focus)
messaging.onBackgroundMessage((payload) => {
  console.log(
    "[firebase-messaging-sw.js] Background message received:",
    payload,
  );

  const notificationTitle = payload.notification?.title || "New Notification";
  const notificationOptions = {
    body: payload.notification?.body || "You have a new message",
    icon: payload.notification?.icon || "/vite.svg",
    data: payload.data,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification click — open or focus the app
self.addEventListener("notificationclick", (event) => {
  console.log("[firebase-messaging-sw.js] Notification clicked:", event);
  event.notification.close();

  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        // If a window/tab is already open, focus it
        for (const client of clientList) {
          if (client.url.includes(self.location.origin) && "focus" in client) {
            return client.focus();
          }
        }
        // Otherwise open a new tab
        if (clients.openWindow) {
          return clients.openWindow("/");
        }
      }),
  );
});
