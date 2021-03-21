import firebase from "firebase";
import 'firebase/firestore'
import 'firebase/auth'

firebase.initializeApp({
    apiKey: "AIzaSyA8bC-p7732b-iScY0fZ5kffRUHxApC4os",
    authDomain: "x-chat-46372.firebaseapp.com",
    projectId: "x-chat-46372",
    storageBucket: "x-chat-46372.appspot.com",
    messagingSenderId: "988841208881",
    appId: "1:988841208881:web:ffc08ba45066aa5d9bb910",
    measurementId: "G-JP4FS3RRTQ"
})

export const auth = firebase.auth();
export const firestore = firebase.firestore();
if (process.env.REACT_APP_USE_FIREBASE_EMULATORS === "true") {
    firestore.useEmulator("localhost", 8080);
    auth.useEmulator("http://localhost:9099")
}