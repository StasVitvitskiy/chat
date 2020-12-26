import * as React from 'react'
import {ReactNode, useContext, useEffect, useState} from "react";
import {auth} from "../firebase";
import firebase from "firebase/app";

const AuthContext = React.createContext<{
    currentUser: firebase.User | null,
    signup?: (email: string, password: string) => Promise<firebase.auth.UserCredential>,
    signin: (email: string, password: string) => Promise<firebase.auth.UserCredential | null>,
}>({ currentUser: null, signin: () => Promise.resolve(null) })

export function useAuth(){
    return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: ReactNode }) {
    const [currentUser, setCurrentUser] = useState<firebase.User | null>(null);
    const [loading,setLoading] = useState(true);
    function signup(email: string,password: string) {
        return auth.createUserWithEmailAndPassword(email,password)
    }
    function signin(email:string,password: string) {
        return auth.signInWithEmailAndPassword(email,password);
    }
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            setCurrentUser(user);
            setLoading(false);
        })
        return unsubscribe;
    }, [])
    const value = {
        currentUser,
        signup,
        signin
    }
    return (
        <AuthContext.Provider value={value}>
            { !loading && children}
        </AuthContext.Provider>
    )
}