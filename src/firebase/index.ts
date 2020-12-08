import firebase from "firebase";
import 'firebase/firestore'
import 'firebase/auth'

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