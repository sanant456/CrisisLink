importScripts('https://www.gstatic.com/firebasejs/10.7.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyAEngZUK2hmcrAYTmXN-wR-Q8qlKCdM5F0",
  authDomain: "crisis-link-33b22.firebaseapp.com",
  projectId: "crisis-link-33b22",
  storageBucket: "crisis-link-33b22.firebasestorage.app",
  messagingSenderId: "907372564377",
  appId: "1:907372564377:web:f9ae00a5ae605858854d08"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/favicon.ico'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
