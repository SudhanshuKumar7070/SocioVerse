import { onMessage } from "firebase/messaging";
import { messaging } from "./firebase.config.js";

export function listenForForegroundNotifications() {
  onMessage(messaging, (payload) => {
    console.log("Foreground message received:", payload);
    alert("FCM message received! Check console for details.");

    const title =
      payload?.notification?.title || payload?.data?.type || "New Notification";
    const body =
      payload?.notification?.body ||
      payload?.data?.payload ||
      "You have a new message";

    // Use ServiceWorker showNotification (more reliable than new Notification())
    if (navigator.serviceWorker) {
      navigator.serviceWorker.ready.then((registration) => {
        registration.showNotification(title, {
          body: body,
          icon: "/vite.svg",
          data: payload?.data,
        });
        console.log("Notification shown via service worker");
      });
    } else {
      // Fallback to Notification API
      try {
        new Notification(title, { body });
        console.log("Notification shown via Notification API");
      } catch (err) {
        console.error("Failed to create notification:", err);
      }
    }
  });

  console.log(" Foreground notification listener registered successfully");
}
