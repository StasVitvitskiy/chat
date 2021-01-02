import {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {userStateSelector} from "./userSelectors";
import {auth} from "../firebase";
import {setCurrentUser} from "./userReducer";

export const AuthenticatedUser = ({children}: { children: JSX.Element }): JSX.Element | null => {
    const dispatch = useDispatch()
    useEffect(() => {
        return auth.onAuthStateChanged(user => {
            dispatch(
                setCurrentUser(user)
            );
        })
    }, [dispatch])

    const {currentUser} = useSelector(userStateSelector)
    if (currentUser) {
        return children
    }
    return null
}
