import React from 'react'
import {auth} from "../firebase";
import {Button} from "@material-ui/core";

export function SignOut() {
    return auth.currentUser && (
        <Button color="primary" onClick={() => auth.signOut()}>Sign Out</Button>
    )
}