import {applyMiddleware, combineReducers, createStore} from "redux";
import {signUpReducer} from "../SignUp";
import thunk from 'redux-thunk'
import {signInReducer} from "../SignIn";

export type AppState = {
    signUp: ReturnType<typeof signUpReducer>
    signIn: ReturnType<typeof signInReducer>
}
export const store = createStore(
    combineReducers({
        signUp: signUpReducer,
        signIn: signInReducer
    }),
    applyMiddleware(thunk)
)