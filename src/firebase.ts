import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBjo7WCewovqlmB_OTebN6mcznMgu_siUg",
  authDomain: "gemini-ai-chat-88e0f.firebaseapp.com",
  projectId: "gemini-ai-chat-88e0f",
  storageBucket: "gemini-ai-chat-88e0f.firebasestorage.app",
  messagingSenderId: "692751802706",
  appId: "1:692751802706:web:8707832fda1889786bda8b"
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider };
