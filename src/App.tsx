import React from 'react';
import './App.css';

import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'
import {SignIn, ChatRoom, SignOut} from './SignIn/SignIn'
import {useAuthState} from 'react-firebase-hooks/auth'
import {useCollectionData} from "react-firebase-hooks/firestore";

firebase.initializeApp({
    apiKey: "AIzaSyBwOjX_KwRD_dCqTjFirn0KoUsomisXhHw",
    authDomain: "chat-ad599.firebaseapp.com",
    databaseURL: "https://chat-ad599.firebaseio.com",
    projectId: "chat-ad599",
    storageBucket: "chat-ad599.appspot.com",
    messagingSenderId: "584079205141",
    appId: "1:584079205141:web:e92e8013fbb19a51d37f1c",
    measurementId: "G-28D5DR3CH1"
})

export const auth = firebase.auth();
export const firestore = firebase.firestore();

function App() {
  const [user] = useAuthState(auth);
  console.log("USER: ", user)

  return (
    <div className="App">
        <section>
            {user ? <ChatRoom /> : <SignIn />}
            <SignOut/>
        </section>
    </div>
  );
}

export default App;
