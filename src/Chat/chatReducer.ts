import {CurrentUser, UserInfo, WithUserState} from "../User";
import {Dispatch} from "redux";
import {firestore} from "../firebase";
import {userStateSelector} from "../User/userSelectors";
import {History} from 'history'
import firebase from "firebase";
import {clearStateOnSignOut} from "../appActions";
import {history} from '../history'
import { noop } from "lodash";
import {chatStateSelector} from "./chatSelector";

export type Message = {
    id?: string,
    text: string,
    userId: string,
    chatId: string,
    createdAt: firebase.firestore.Timestamp,
    status: MessageStatus
}
export type MessageStatus = "unread" | "read"
export type Chat = {
    id: string,
    user1: string,
    user2: string
}

export type ChatState = {
    id: string,
    user1: UserInfo | null,
    user2: UserInfo | null,
    messages: Message[]
}

export type WithChatState = {
    chat: ChatState
}

export const initialChatState: ChatState = {
    id: '',
    user1: null,
    user2: null,
    messages: []
}

export const setChatData = (data: ChatState) => ({
    type: "CHAT/SET_CHAT_DATA",
    payload: data
}) as const

export const setMessages = (messages: Message[]) => ({
    type: "CHAT/SET_MESSAGES",
    payload: {messages}
}) as const

let unsubcribeFromMessagesUpdates = () => {} // noop

export const markAllChatMessagesAsRead = async (chatId: string, currentUser: CurrentUser) => {
    const messagesRef = firestore.collection('messages');
    const messagesSnapshot = await messagesRef.where("chatId", "==", chatId)
        .where("userId", "!=", currentUser?.uid).get();
    messagesSnapshot.forEach((elem) => {
        if(elem.data().status !== 'read') {
            messagesRef.doc(elem.id).update({
                status: "read"
            })
        }
    })
}

export const openChatById = (chatId: string, redirect: boolean = false) =>
    async (dispatch: Dispatch, getState: () => unknown) => {
        const {userInfo, currentUser} = userStateSelector( getState() as WithUserState)
        const chatRef = firestore.collection('chat');
        const docRef = chatRef.doc(chatId);
        const chatSnapshot = await docRef.get()
        if(chatSnapshot.exists) {
            const chatObject =  chatSnapshot.data() as {user1: string, user2: string}
            dispatch(
                setChatData(
                    {
                        id: chatId,
                        user1: userInfo[chatObject.user1],
                        user2: userInfo[chatObject.user2],
                        messages: []
                    }
                )
            )
            markAllChatMessagesAsRead(chatId, currentUser)
            if(redirect) {
                history.push(`/chat/${chatId}`)
            }
            subscribeToChatMessagesUpdates(chatId, dispatch, getState)
    }
}
let subscribeToVisibilityChange = noop;
export const subscribeToChatMessagesUpdates = (chatId:string, dispatch: Dispatch, getState: () => unknown) => {
    const {currentUser} = userStateSelector(getState() as WithUserState)
    const messageRef = firestore.collection("messages");

    document.removeEventListener('visibilitychange', subscribeToVisibilityChange)
    subscribeToVisibilityChange = () => {
        const {messages} = chatStateSelector(getState() as WithChatState)
        if(!document.hidden) {
            messages.forEach((el) => {
                if(el.status !== 'read' && currentUser?.uid !== el.userId) {
                    messageRef.doc(el.id).update({
                        status: 'read'
                    })
                }
            })
        }
    }
    document.addEventListener('visibilitychange', subscribeToVisibilityChange)

    unsubcribeFromMessagesUpdates()
    unsubcribeFromMessagesUpdates = messageRef.where("chatId", "==", chatId).onSnapshot(
        function(snapshot){
            const messages = snapshot.docs.map((el) => {
                return {
                    id: el.id,
                    ...el.data()
                } as Message
            }).sort((a,b) => {
                if(a.createdAt && b.createdAt) {
                    return +a.createdAt.toDate() - +b.createdAt.toDate();
                }
                return 0;
            })
            if (!document.hidden) {
                messages.forEach((el) => {
                    if(el.status !== 'read' && currentUser?.uid !== el.userId) {
                        messageRef.doc(el.id).update({
                            status: 'read'
                        })
                    }
                })
            }
            dispatch(setMessages(messages));
        }
    )
}

export const openChat = (userId: string, history: History) => async (dispatch: Dispatch, getState: () => unknown) => {
    const { currentUser, userInfo } = userStateSelector(getState() as WithUserState)
    const chatRef = firestore.collection('chat');
    if (currentUser) {
        const chats = await chatRef
            .get().then(snapshot => {
                return snapshot.docs.map(doc => ({...doc.data(), id: doc.id} as { user1: string, user2: string, id: string }))
                    .filter(doc => {
                        const userIds = [doc.user2, doc.user1]
                        return userIds.includes(currentUser.uid) && userIds.includes(userId)
                    })
            })
        if(!chats.length) {
            const docRef = await chatRef.add({
                user1: currentUser.uid,
                user2: userId,
            })
            dispatch(setChatData(
                {
                    id: docRef.id,
                    user1: userInfo[currentUser.uid],
                    user2: userInfo[userId],
                    messages: []
                }
            ))
            subscribeToChatMessagesUpdates(docRef.id, dispatch, getState)
            history.push(`/chat/${docRef.id}`)
        } else {
            const {user1, user2, id} = chats[0];
            dispatch(setChatData(
                {
                    id: id,
                    user1: userInfo[user1],
                    user2: userInfo[user2],
                    messages: []
                }
            ))
            subscribeToChatMessagesUpdates(id, dispatch, getState);
            markAllChatMessagesAsRead(id, currentUser)
            history.push(`/chat/${id}`)
        }
    }
}

export function chatReducer(
    state: ChatState = initialChatState,
    action: ReturnType<typeof setChatData | typeof setMessages | typeof clearStateOnSignOut>
): ChatState {
    switch(action.type) {
        case "CHAT/SET_CHAT_DATA": {
            return {
                ...state,
                ...action.payload
            }
        }
        case "CHAT/SET_MESSAGES": {
            return {
                ...state,
                messages: action.payload.messages
            }
        }
        case "APP_ACTIONS/CLEAR_STATE_ON_SIGN_OUT": {
            return initialChatState
        }
        default: {
            return state
        }
    }
}