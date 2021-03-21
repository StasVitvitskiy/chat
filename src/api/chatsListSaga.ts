import noop from "lodash/noop";
import {eventChannel} from "redux-saga";
import { call, put, take } from "redux-saga/effects";
import {firestore} from "../firebase";
import {userStateChanged} from "./userSaga";
import {history} from "../history";
import firebase from "firebase";

export type Chat = {
    id: string,
    user1: string,
    user2: string
}
export type ChatsMap = {
    [id: string]: Chat
}

const CHATS_LIST_RESPONSE = "API/CHATS_LIST_RESPONSE"
export const chatsListResponse = (chatsList: ChatsMap) => ({
    type: CHATS_LIST_RESPONSE,
    payload: chatsList
}) as const
chatsListResponse.toString = (): "API/CHATS_LIST_RESPONSE" => CHATS_LIST_RESPONSE

export function* subscribeToChatsList(action: ReturnType<typeof userStateChanged>): unknown {
    const channel = yield call(chatsListChannel)

    if (action.payload) {
        const uid = action.payload.uid
        while (true) {
            const chatsList = yield take(channel)
            yield put(chatsListResponse(
                chatsList.filter((chat: Chat) => chat.user1 === uid || chat.user2 === uid)
                    .reduce((acc: ChatsMap, chat: Chat) => ({
                        ...acc,
                        [chat.id]: chat
                    }), {})
            ))
        }
    }
}

let unsubscribeFromChatsList = noop
function chatsListChannel() {
    unsubscribeFromChatsList()

    return eventChannel(emitter => {
        const chatRef = firestore.collection('chat');
        unsubscribeFromChatsList = chatRef.onSnapshot(snapshot => {
            emitter(
                snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }))
            )
        })

        return unsubscribeFromChatsList
    })
}

const OPEN_CHAT_BY_ID = "API/OPEN_CHAT_BY_ID"
export const openChatById = (chatId: string, redirect: boolean = false) => ({
    type: OPEN_CHAT_BY_ID,
    payload: {chatId, redirect}
}) as const
openChatById.toString = (): "API/OPEN_CHAT_BY_ID" => OPEN_CHAT_BY_ID

const OPEN_CHAT_BY_ID_RESPONSE = "API/OPEN_CHAT_BY_ID_RESPONSE"
export const openChatByIdResponse = (chat: Chat) => ({
    type: OPEN_CHAT_BY_ID_RESPONSE,
    payload: chat
}) as const
openChatByIdResponse.toString = (): "API/OPEN_CHAT_BY_ID_RESPONSE" => OPEN_CHAT_BY_ID_RESPONSE

export function* openChatByIdSaga (action: ReturnType<typeof openChatById>): unknown {
    const {chatId, redirect} = action.payload
    const chatRef = firestore.collection('chat');
    const docRef = chatRef.doc(chatId);
    const chatSnapshot = yield call(() => docRef.get())
    if(chatSnapshot.exists) {
        yield put(
            openChatByIdResponse({
                id: chatSnapshot.id,
                ...chatSnapshot.data()
            })
        )
        if(redirect) {
            history.push(`/chat/${chatId}`)
        }
    }
}

const OPEN_CHAT = "API/OPEN_CHAT"
export const openChat = (userId: string, currentUserId: string) => ({
    type: OPEN_CHAT,
    payload: {userId, currentUserId}
}) as const
openChat.toString = (): "API/OPEN_CHAT" => OPEN_CHAT

const OPEN_CHAT_RESPONSE = "API/OPEN_CHAT_RESPONSE"
export const openChatResponse = (chat: Chat) => ({
    type: OPEN_CHAT_RESPONSE,
    payload: chat
}) as const
openChatResponse.toString = (): "API/OPEN_CHAT_RESPONSE" => OPEN_CHAT_RESPONSE

export function* openChatSaga(action: ReturnType<typeof openChat>): unknown {
    const {userId, currentUserId} = action.payload
    const chatRef = firestore.collection('chat');

    const snapshot = yield call(() => chatRef.get())
    const chats = snapshot.docs.map((doc: firebase.firestore.QueryDocumentSnapshot) => ({...doc.data(), id: doc.id} as Chat))
        .filter((chat: Chat) => {
            return (chat.user1 === currentUserId && chat.user2 === userId) ||
                (chat.user1 === userId && chat.user2 === currentUserId)
        })

    if(!chats.length) {
        const newChat = {
            user1: currentUserId,
            user2: userId,
        }
        const docRef = yield call(() => chatRef.add(newChat))
        yield put(openChatResponse({
            id: docRef.id,
            ...newChat
        }))
        history.push(`/chat/${docRef.id}`)
    } else {
        const {id} = chats[0]
        yield put(openChatResponse(chats[0]))
        history.push(`/chat/${id}`)
    }
}