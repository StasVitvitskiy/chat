import {useSelector} from "react-redux";
import {userStateSelector} from "./userSelectors";

export const AuthenticatedUser = ({children}: { children: JSX.Element }): JSX.Element | null => {
    const {currentUser} = useSelector(userStateSelector)
    if (currentUser) {
        return children
    }
    return null
}
