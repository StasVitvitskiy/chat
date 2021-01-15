import {applyMiddleware, combineReducers, createStore} from "redux";
import {signUpReducer} from "../SignUp";
import thunk from 'redux-thunk'
import {signInReducer} from "../SignIn";
import {userReducer} from "../User";
import { composeWithDevTools } from 'redux-devtools-extension'
import {personalInfoReducer} from "../personalInfo";

export type AppState = {
    signUp: ReturnType<typeof signUpReducer>
    signIn: ReturnType<typeof signInReducer>
    user: ReturnType<typeof userReducer>
    personalInfo: ReturnType<typeof personalInfoReducer>
}
export const store = createStore(
    combineReducers({
        signUp: signUpReducer,
        signIn: signInReducer,
        user: userReducer,
        personalInfo: personalInfoReducer,
    }),
    composeWithDevTools(
        applyMiddleware(thunk)
    )
)