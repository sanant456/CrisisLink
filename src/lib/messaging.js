import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import app from './firebase';
import { saveUserFCMToken } from './firestoreService';

export const requestForToken = async (userId) => {
  try {
    const messaging = getMessaging(app);
    const token = await getToken(messaging, {
      vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
    });
    if (token && userId) {
      console.log('FCM Token:', token);
      await saveUserFCMToken(userId, token);
      return token;
    } else {
      console.log('No registration token available or no userId provided.');
    }
  } catch (err) {
    console.log('An error occurred while retrieving token. ', err);
  }
};

export const onMessageListener = () =>
  new Promise((resolve) => {
    const messaging = getMessaging(app);
    onMessage(messaging, (payload) => {
      console.log('Message received. ', payload);
      resolve(payload);
    });
  });
