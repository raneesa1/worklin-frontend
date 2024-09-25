/// <reference lib="webworker" />

declare const self: ServiceWorkerGlobalScope;
declare var firebase: any;

importScripts(
  'https://www.gstatic.com/firebasejs/9.1.3/firebase-app-compat.js'
);
importScripts(
  'https://www.gstatic.com/firebasejs/9.1.3/firebase-messaging-compat.js'
);

firebase.initializeApp({
  apiKey: 'AIzaSyB1_LRTS-Bt5RJrO3v-Pg8wy5f3Csk2920',
  authDomain: 'worklin-fdc34.firebaseapp.com',
  projectId: 'worklin-fdc34',
  storageBucket: 'worklin-fdc34.appspot.com',
  messagingSenderId: '228244392798',
  appId: '1:228244392798:web:3617645a7b63431a55ddcf',
  measurementId: 'G-D0MTB6SC9H',
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload: any) {
  console.log('Received background message ', payload);

  // Customize notification here
  const notificationTitle = payload.notification.title;
  const notificationOptions: NotificationOptions = {
    body: payload.notification.body,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

export {}; // This is to make the file a module
