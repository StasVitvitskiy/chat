import {UserInfo, WithUserState} from "../User";
import {Dispatch} from "redux";
import {firestore} from "../firebase";
import {userStateSelector} from "../User/userSelectors";
import {History} from 'history'
import firebase from "firebase";
import {clearStateOnSignOut} from "../appActions";
import {history} from '../history'

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

export const markAllChatMessagesAsRead = async (chatId: string) => {
    const messagesRef = firestore.collection('messages');
    const messagesSnapshot = await messagesRef.where("chatId", "==", chatId).get();
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
        const {userInfo} = userStateSelector( getState() as WithUserState)
        const chatRef = firestore.collection('chat');
        const messageRef = firestore.collection("messages");
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
            markAllChatMessagesAsRead(chatId)
            if(redirect) {
                history.push(`/chat/${chatId}`)
            }
            unsubcribeFromMessagesUpdates()
            unsubcribeFromMessagesUpdates = messageRef.where("chatId", "==", chatId).onSnapshot(
                function(snapshot){
                    if (!snapshot.metadata.hasPendingWrites) {
                        const messages = snapshot.docs.map((el) => {
                            return {
                                id: el.id,
                                ...el.data()
                            } as Message
                        }).sort((a,b) => {
                            return +a.createdAt.toDate() - +b.createdAt.toDate();
                        })
                        dispatch(setMessages(messages));
                    }
                }
            )
    }
}

export const openChat = (userId: string, history: History) => async (dispatch: Dispatch, getState: () => unknown) => {
    const { currentUser, userInfo } = userStateSelector(getState() as WithUserState)
    const chatRef = firestore.collection('chat');
    const messageRef = firestore.collection("messages");
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
            history.push(`/chat/${chatRef.id}`)
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
            unsubcribeFromMessagesUpdates()
            unsubcribeFromMessagesUpdates = messageRef.where("chatId", "==", id).onSnapshot(
                function(snapshot){
                    if (!snapshot.metadata.hasPendingWrites) {
                        const messages = snapshot.docs.map((el) => {
                            return {
                                id: el.id,
                                ...el.data()
                            } as Message
                        }).sort((a,b) => {
                            return +a.createdAt.toDate() - +b.createdAt.toDate();
                        })
                        dispatch(setMessages(messages));
                    }
                }
            )
            markAllChatMessagesAsRead(id)
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