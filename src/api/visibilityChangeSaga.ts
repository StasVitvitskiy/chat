import noop from "lodash/noop";
import {eventChannel} from "redux-saga";
import {userStateChanged} from "./userSaga";
import {call, put, take} from "redux-saga/effects";
import {setUserOnlineStatus} from "./userOnlineStatusSaga";

const DOCUMENT_VISIBLE = "DOCUMENT_VISIBLE"
const DOCUMENT_HIDDEN = "DOCUMENT_HIDDEN"
const DOCUMENT_CLOSED = "DOCUMENT_CLOSED"

let unsubscribeFromPageState = noop
function pageStateChannel() {
    unsubscribeFromPageState()

    return eventChannel(emitter => {
        function handleVisibilityChange () {
            if (document.hidden) {
                emitter(DOCUMENT_HIDDEN)
            } else {
                emitter(DOCUMENT_VISIBLE)
            }
        }
        document.addEventListener("visibilitychange", handleVisibilityChange)

        function handlePageClose() {
            emitter(DOCUMENT_CLOSED)
        }
        window.addEventListener("beforeunload", handlePageClose)

        unsubscribeFromPageState = () => {
            document.removeEventListener("visibilitychange", handleVisibilityChange)
            window.removeEventListener("beforeunload", handlePageClose)
        }

        return unsubscribeFromPageState
    })
}

export function* subscribeToPageStateSaga(action: ReturnType<typeof userStateChanged>): unknown {
    const channel = yield call(pageStateChannel)
    const {payload} = action

    if (payload) {
        while (true) {
            const pageState = yield take(channel)
            switch (pageState) {
                case DOCUMENT_VISIBLE:
                    yield put(setUserOnlineStatus(payload.uid, "online"))
                    break
                default:
                    yield put(setUserOnlineStatus(payload.uid, "offline"))
            }
        }
    }
}