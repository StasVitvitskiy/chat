import {applyMiddleware, combineReducers, createStore} from "redux";
import {signUpReducer} from "../SignUp";
import thunk from 'redux-thunk'

export type AppState = {
    signUp: ReturnType<typeof signUpReducer>
}
export const store = createStore(
    combineReducers({
        signUp: signUpReducer
    }),
    applyMiddleware(thunk)
)