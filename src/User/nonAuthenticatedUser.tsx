import {useSelector} from "react-redux";
import {userStateSelector} from "./userSelectors";

export const NonAuthenticatedUser = ({children}: {children: JSX.Element}) => {
    const {currentUser} = useSelector(userStateSelector)
    if (currentUser === null) {
        return children
    }
    return null
}
