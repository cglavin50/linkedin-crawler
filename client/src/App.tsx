// IMPORTS
// import { useState } from 'react'
import './App.css';
import { JobSearch } from "./components/JobSearch"
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useAuthState } from 'react-firebase-hooks/auth'; 

// Firebase configuration
console.log("")
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCCnMZtY_oH07FsUzzAh4zeQN4GiR4W3dQ",
  authDomain: "job-crawler-d3002.firebaseapp.com",
  projectId: "job-crawler-d3002",
  storageBucket: "job-crawler-d3002.appspot.com",
  messagingSenderId: "298085583690",
  appId: "1:298085583690:web:32133c39677dbc8d4ccfb3",
  measurementId: "G-XXMHYVE729"
}; // in general safe to keep this public, read security rules

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
auth.useDeviceLanguage(); // use device's default langauge, don't need to set


function App() {
  const [user] = useAuthState(auth); // firebase react hook, user = null with auth is signed out
  return (
    <div className="App">
      <header>
        <h1>Job Crawler</h1>
        <SignOut />
      </header>
      <section>
        {user ? <JobSearch /> : <SignIn />}
      </section>
    </div>
  )
}

function SignIn() {
  const signInWithGoogle = () => {
    signInWithPopup(auth, provider); // firebase auth library to open up a popup window using google authentication as defined above
  };
  return (
    <button onClick = {signInWithGoogle}>Sign in with Google</button>
  )
}

function SignOut() {
  return auth.currentUser && (
    <button onClick={() => auth.signOut()}>Sign Out</button>
  ) // basic signout button from the auth library
}


export default App

