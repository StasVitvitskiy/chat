import {firestore} from "../firebase";
import {call, put, take} from "redux-saga/effects";
import firebase from "firebase";
import noop from "lodash/noop";
import {eventChannel} from "redux-saga";
import {userStateChanged} from "./userSaga";
import groupBy from "lodash/groupBy";

export type Message = {
    id?: string,
    text: string,
    userId: string,
    chatId: string,
    createdAt: firebase.firestore.Timestamp,
    status: MessageStatus
}
export type MessageStatus = "unread" | "read"
export type MessagesMap = {
    [chatId: string]: Message[]
}

const MARK_CHAT_MESSAGES_READ = "API/MARK_CHAT_MESSAGES_READ"
export const markAllChatMessagesAsRead = (chatId: string, userId: string) => ({
    type: MARK_CHAT_MESSAGES_READ,
    payload: {chatId, userId}
}) as const
markAllChatMessagesAsRead.toString = (): "API/MARK_CHAT_MESSAGES_READ" => MARK_CHAT_MESSAGES_READ

export function* markAllChatMessagesAsReadSaga(action: ReturnType<typeof markAllChatMessagesAsRead>) {
    const {chatId, userId} = action.payload
    const messagesRef = firestore.collection('messages');
    const messagesSnapshot = yield call(
        () => messagesRef.where("chatId", "==", chatId)
        .where("userId", "!=", userId).get()
    );
    messagesSnapshot.forEach((elem: firebase.firestore.QueryDocumentSnapshot) => {
        if(elem.data().status !== 'read') {
            messagesRef.doc(elem.id).update({
                status: "read"
            })
        }
    })
}

let unsubscribeFromMessagesUpdates = noop
function messagesChannel(uid: string) {
    unsubscribeFromMessagesUpdates()

    return eventChannel(emitter => {
        const messageRef = firestore.collection("messages");
        messageRef.orderBy("createdAt", "asc").onSnapshot(snapshot => {
            emitter(
                snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }))
            )
        })

        return unsubscribeFromMessagesUpdates
    })
}
export function* subscribeToMessagesSaga(action: ReturnType<typeof userStateChanged>) {
    if (action.payload) {
        const channel = yield call(messagesChannel, action.payload.uid)

        while (true) {
            const messages = yield take(channel)
            yield put(
                messagesResponse(
                    groupBy(
                        messages,
                        "chatId"
                    )
                )
            )
        }
    }
}

const MESSAGES_RESPONSE = "API/MESSAGES_RESPONSE"
export const messagesResponse = (messages: MessagesMap) => ({
    type: MESSAGES_RESPONSE,
    payload: messages
}) as const
messagesResponse.toString = (): "API/MESSAGES_RESPONSE" => MESSAGES_RESPONSE