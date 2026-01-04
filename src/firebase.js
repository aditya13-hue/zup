import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Your Firebase config
const firebaseConfig = {
    apiKey: "AIzaSyAwkB3uPo1rZynJstVUhfJgKxP9r5SucM8",
    authDomain: "zupp-scanner.firebaseapp.com",
    projectId: "zupp-scanner",
    storageBucket: "zupp-scanner.firebasestorage.app",
    messagingSenderId: "822144523940",
    appId: "1:822144523940:web:12b470665380630062d031"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;
