import { fork, takeLatest } from "redux-saga/effects";
import {openChat, openChatById, openChatByIdSaga, openChatSaga, subscribeToChatsList} from "./chatsListSaga";
import { subscribeToPersonalInfo } from "./personalInfoSaga";
import {setUserOnlineStatus, setUserOnlineStatusSaga, subscribeToUserStatus} from "./userOnlineStatusSaga";
import {subscribeToUserStateChange, userStateChanged} from "./userSaga";
import {subscribeToPageStateSaga} from "./visibilityChangeSaga";
import {markAllChatMessagesAsRead, markAllChatMessagesAsReadSaga, subscribeToMessagesSaga} from "./messagesSaga";

export function* apiSaga() {
    yield fork(subscribeToUserStateChange)

    yield takeLatest(userStateChanged.toString(), subscribeToPersonalInfo)
    yield takeLatest(userStateChanged.toString(), subscribeToUserStatus)
    yield takeLatest(userStateChanged.toString(), subscribeToPageStateSaga)
    yield takeLatest(userStateChanged.toString(), subscribeToChatsList)
    yield takeLatest(userStateChanged.toString(), subscribeToMessagesSaga)

    yield takeLatest(markAllChatMessagesAsRead.toString(), markAllChatMessagesAsReadSaga)
    yield takeLatest(openChatById.toString(), openChatByIdSaga)
    yield takeLatest(openChat.toString(), openChatSaga)
    yield takeLatest(setUserOnlineStatus.toString(), setUserOnlineStatusSaga)
}