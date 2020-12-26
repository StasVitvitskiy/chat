import React from 'react'
import {auth} from "../firebase";
import Button from "react-bootstrap/Button";

export function SignOut() {
    return auth.currentUser && (
        <Button onClick={() => auth.signOut()}>Sign Out</Button>
    )
}