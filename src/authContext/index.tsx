import * as React from 'react'
import {ReactNode, useContext, useEffect, useState} from "react";
import {auth} from "../firebase";
import firebase from "firebase/app";

const AuthContext = React.createContext<{
    currentUser: firebase.User | null
}>({ currentUser: null })

export function useAuth(){
    return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: ReactNode }) {
    const [currentUser, setCurrentUser] = useState<firebase.User | null>(null);
    const [loading,setLoading] = useState(true);
    useEffect(() => {
        return auth.onAuthStateChanged(user => {
            setCurrentUser(user);
            setLoading(false);
        })
    }, [])
    const value = {
        currentUser,
    }
    return (
        <AuthContext.Provider value={value}>
            { !loading && children}
        </AuthContext.Provider>
    )
}