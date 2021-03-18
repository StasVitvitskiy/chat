import {UserInfoState} from "./user";
import {call, put, take} from "redux-saga/effects";
import {noop} from "lodash";
import {eventChannel} from "redux-saga";
import {firestore} from "../firebase";
import {userStateChanged} from "./userSaga";

const PERSONAL_INFO_RESPONSE = "API/PERSONAL_INFO_RESPONSE"
export const personalInfoResponse = (personalInfo: UserInfoState) => ({
    type: PERSONAL_INFO_RESPONSE,
    payload: personalInfo
}) as const
personalInfoResponse.toString = (): "API/PERSONAL_INFO_RESPONSE" => PERSONAL_INFO_RESPONSE

export function* subscribeToPersonalInfo(action: ReturnType<typeof userStateChanged>) {
    const channel = yield call(personalInfoChannel)
    if (action.payload) {
        while (true) {
            const personalInfo = yield take(channel)
            yield put(personalInfoResponse(personalInfo))
        }
    }
}
let unsubscribeFromPersonalInfo = noop
function personalInfoChannel() {
    unsubscribeFromPersonalInfo()
    return eventChannel(emitter => {
        unsubscribeFromPersonalInfo = firestore.collection('personalInfo').onSnapshot(snapshot => {
            emitter(
                snapshot.docs.reduce((acc, cur) => ({
                    ...acc,
                    [cur.data().uid]: cur.data()
                }), {})
            )
        })

        return unsubscribeFromPersonalInfo
    })
}