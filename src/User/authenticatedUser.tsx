import {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {userStateSelector} from "./userSelectors";
import {auth} from "../firebase";
import {getUsers, setCurrentUser} from "./userReducer";

export const AuthenticatedUser = ({children}: { children: JSX.Element }): JSX.Element | null => {
    const dispatch = useDispatch()
    useEffect(() => {
        return auth.onAuthStateChanged(user => {
            dispatch(
                setCurrentUser(user)
            );
            dispatch(
                getUsers()
            )
        })
    }, [dispatch])

    const {currentUser} = useSelector(userStateSelector)
    if (currentUser) {
        return children
    }
    return null
}
