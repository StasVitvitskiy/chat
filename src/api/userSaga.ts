import {CurrentUser} from "./user";
import {call, put, take} from "redux-saga/effects";
import {eventChannel} from "redux-saga";
import {auth} from "../firebase";

const USER_STATE_CHANGED = "API/USER_STATE_CHANGED"
export const userStateChanged = (user: CurrentUser) => ({
    type: USER_STATE_CHANGED,
    payload: user
}) as const
userStateChanged.toString = (): "API/USER_STATE_CHANGED" => USER_STATE_CHANGED

export function* subscribeToUserStateChange() {
    const channel = yield call(userStateChannel)
    while (true) {
        const {user} = yield take(channel)
        yield put(
            userStateChanged(user)
        )
    }
}
function userStateChannel() {
    return eventChannel(emitter => {
        auth.onAuthStateChanged(user => emitter({user}))

        return () => {}
    })
}