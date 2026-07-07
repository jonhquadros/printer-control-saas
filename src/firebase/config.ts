import { initializeApp, getApps, getApp } from "firebase/app";
import { initializeAuth, browserLocalPersistence, browserSessionPersistence, indexedDBLocalPersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBGIheHVsYzrpQRh55F9dqIyKwf7W0dv6k",
  authDomain: "gen-lang-client-0778844675.firebaseapp.com",
  projectId: "gen-lang-client-0778844675",
  storageBucket: "gen-lang-client-0778844675.firebasestorage.app",
  messagingSenderId: "239247904166",
  appId: "1:239247904166:web:1e3f21d08e9bd0fdadd367"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Explicitly initialize Auth with persistence
export const auth = initializeAuth(app, {
  persistence: [indexedDBLocalPersistence, browserLocalPersistence, browserSessionPersistence]
});

export const db = getFirestore(app, "ai-studio-printercontrolsa-3c0958d0-3515-4928-b986-7d477476f17a");
export const storage = getStorage(app);

export default app;
