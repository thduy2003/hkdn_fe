import { initializeApp } from 'firebase/app'
import { getMessaging } from 'firebase/messaging'

// TODO: Replace the following with your app's Firebase project configuration
// See: https://firebase.google.com/docs/web/learn-more#config-object
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_apiKey || '',
  authDomain: import.meta.env.VITE_FIREBASE_authDomain || '',
  projectId: import.meta.env.VITE_FIREBASE_projectId || '',
  storageBucket: import.meta.env.VITE_FIREBASE_storageBucket || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_messagingSenderId || '',
  appId: import.meta.env.VITE_FIREBASE_appId || ''
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Firebase Cloud Messaging and get a reference to the service
const messaging = getMessaging(app)

export default messaging
