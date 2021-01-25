import {UserInfo, WithUserState} from "../User";
import {Dispatch} from "redux";
import {firestore} from "../firebase";
import {userStateSelector} from "../User/userSelectors";
import {History} from 'history'
import firebase from "firebase";

export type Message = {
    id?: string,
    text: string,
    userId: string,
    chatId: string,
    createdAt: firebase.firestore.FieldValue
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

export const openChatById = (chatId: string) => async (dispatch: Dispatch, getState: () => unknown) => {
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
        messageRef.where("chatId", "==", chatId).onSnapshot(function(snapshot){
            if (!snapshot.metadata.hasPendingWrites) {
                const messages = snapshot.docs.map((el) => {
                    return {
                        id: el.id,
                        ...el.data()
                    } as Message
                })
                dispatch(setMessages(messages));
            }
        })
    }
}

export const openChat = (userId: string, history: History) => async (dispatch: Dispatch, getState: () => unknown) => {
    const { currentUser, userInfo } = userStateSelector(getState() as WithUserState)
    const chatRef = firestore.collection('chat');
    const messageRef = firestore.collection("messages");
    if (currentUser) {
        const chats = await chatRef.where("user1","in", [userId, currentUser.uid] )
            .get().then(snapshot => {
                return snapshot.docs.map(doc => ({...doc.data(), id: doc.id} as { user1: string, user2: string, id: string }))
                    .filter(doc => doc.user2 === userId || doc.user2 === currentUser.uid)
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
            const messagesSnapshot = await messageRef.where("chatId", "==", id).get()
            dispatch(setChatData(
                {
                    id: id,
                    user1: userInfo[user1],
                    user2: userInfo[user2],
                    messages: messagesSnapshot.docs.map((el) => {
                        return {
                            id: el.id,
                            ...el.data()
                        } as Message
                    })
                }
            ))
            history.push(`/chat/${id}`)
        }
    }
}

export function chatReducer(
    state: ChatState = initialChatState,
    action: ReturnType<typeof setChatData | typeof setMessages>
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
        default: {
            return state
        }
    }
}