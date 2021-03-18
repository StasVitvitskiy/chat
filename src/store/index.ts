import {applyMiddleware, combineReducers, createStore} from "redux";
import {signUpReducer} from "../SignUp";
import thunk from 'redux-thunk'
import {signInReducer} from "../SignIn";
import {userReducer} from "../User";
import { composeWithDevTools } from 'redux-devtools-extension'
import {personalInfoReducer} from "../personalInfo";
import {chatReducer} from '../Chat'
import {chatControlsReducer} from "../chatControls/chatControlsReducer";
import {chatsListReducer} from "../ChatsList";
import createSagaMiddleware from 'redux-saga'
import { all } from 'redux-saga/effects'
import {apiSaga} from "../api";

export type AppState = {
    signUp: ReturnType<typeof signUpReducer>
    signIn: ReturnType<typeof signInReducer>
    user: ReturnType<typeof userReducer>
    personalInfo: ReturnType<typeof personalInfoReducer>
    chat: ReturnType<typeof chatReducer>
    chatControls: ReturnType<typeof chatControlsReducer>
    chatsList: ReturnType<typeof chatsListReducer>
}

const sagaMiddleware = createSagaMiddleware()
export const store = createStore(
    combineReducers({
        signUp: signUpReducer,
        signIn: signInReducer,
        user: userReducer,
        personalInfo: personalInfoReducer,
        chat: chatReducer,
        chatControls: chatControlsReducer,
        chatsList: chatsListReducer
    }),
    composeWithDevTools(
        applyMiddleware(thunk, sagaMiddleware)
    )
)
sagaMiddleware.run(function* () {
    yield all([apiSaga()])
})