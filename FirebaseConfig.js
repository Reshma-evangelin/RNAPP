import { initializeApp, getApps, getApp } from "firebase/app";
import {
  initializeAuth,
  getReactNativePersistence,
  getAuth,
} from "firebase/auth";
import { getDatabase } from "firebase/database"; // ✅ For Realtime Database
import AsyncStorage from "@react-native-async-storage/async-storage";

// ✅ Your Firebase configuration with databaseURL included
const firebaseConfig = {
  apiKey: "AIzaSyDgf0jBkpJDaRJCZHn1CVXEh_OhQghJT8s",
  authDomain: "com.nere.heatstrokeapp",
  databaseURL: "https://rnapp-5d451-default-rtdb.firebaseio.com/", // ✅ Important for Realtime DB
  projectId: "rnapp-5d451",
  storageBucket: "rnapp-5d451.appspot.com",
  messagingSenderId: "neelgats2004@gmail.com", // Fixed value
  appId: "1:598438709901:android:bc7b0e18e85bc7405070c4"
};

// ✅ Initialize Firebase App
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// ✅ Initialize Auth with AsyncStorage
const auth = getApps().length === 0
  ? initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage),
    })
  : getAuth(app);

// ✅ Initialize Realtime Database
const database = getDatabase(app);

// ✅ Export both auth and database
export { auth, database };
