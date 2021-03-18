import {firestore} from "../firebase";
import {noop} from "lodash";
import {eventChannel} from "redux-saga";
import {UserStatus} from "./user";
import {call, put, take} from "redux-saga/effects";
import {userStateChanged} from "./userSaga";

const SET_USER_ONLINE_STATUS = "API/SET_USER_ONLINE_STATUS"
export const setUserOnlineStatus = (uid: string, status: 'online' | 'offline') => ({
    type: SET_USER_ONLINE_STATUS,
    payload: {uid, status}
}) as const
setUserOnlineStatus.toString = () => SET_USER_ONLINE_STATUS

export function* setUserOnlineStatusSaga(action: ReturnType<typeof setUserOnlineStatus>) {
    const {uid, status} = action.payload
    const userStatusRef = firestore.collection('userStatus')
    userStatusRef.doc(uid).set({
        status
    })
}

const ONLINE_STATUS_RESPONSE = "ONLINE_STATUS_RESPONSE"
export const onlineStatusResponse = (data: UserStatus) => ({
    type: ONLINE_STATUS_RESPONSE,
    payload: data
}) as const
onlineStatusResponse.toString = (): "ONLINE_STATUS_RESPONSE" => ONLINE_STATUS_RESPONSE

let currentUserId: string
export function* subscribeToUserStatus(action: ReturnType<typeof userStateChanged>) {
    const channel = yield call(onlineStatusChannel)
    if (action.payload) {
        currentUserId = action.payload.uid
        yield put(setUserOnlineStatus(currentUserId, "online"))

        while (true) {
            const userStatus = yield take(channel)
            yield put(
                onlineStatusResponse(userStatus)
            )
        }
    } else if (currentUserId) {
        yield put(setUserOnlineStatus(currentUserId, "offline"))
    }
}
let unsubscribeFromUserOnlineStatus = noop
function onlineStatusChannel() {
    unsubscribeFromUserOnlineStatus()
    return eventChannel(emitter => {
        const userStatusCollectionRef = firestore.collection('userStatus');
        unsubscribeFromUserOnlineStatus = userStatusCollectionRef.onSnapshot((snapshot) => {
            const statuses = snapshot.docs.map((el) => {
                return {
                    uid: el.id,
                    ...el.data()
                } as UserStatus
            })
            const userStatus = statuses.reduce((acc,cur) => {
                acc[cur.uid] = cur.status
                return acc;
            }, {} as UserStatus)
            emitter(userStatus)
        })

        return unsubscribeFromUserOnlineStatus
    })
}