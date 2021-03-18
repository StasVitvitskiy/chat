import {Dispatch} from "redux";
import {chatControlsStateSelector} from "./chatControlsStateSelector";
import {firestore} from "../firebase";
import firebase from "firebase";
import {userStateSelector} from "../User/userSelectors";
import {WithUserState} from "../User";
import {chatStateSelector} from "../Chat/chatSelector";
import {WithChatState} from "../Chat";
import {clearStateOnSignOut} from "../appActions";
import {Message} from "../api";


export type ChatControlsState = {
    userText: string,
}

export const initialChatControlsState: ChatControlsState = {
    userText: ''
}

export type WithChatControlsState = {
    chatControls: ChatControlsState
}

export const setChatControlsData = (chatControlsData: ChatControlsState) => ({
    type: "CHAT_CONTROLS/SET_CHAT_CONTROLS_DATA",
    payload: chatControlsData
})

export const sendMessage = () => async (dispatch: Dispatch, getState: () => unknown) => {
    const {userText} = chatControlsStateSelector(getState() as WithChatControlsState);
    const {currentUser} = userStateSelector(getState() as WithUserState)
    const {openChat} = chatStateSelector(getState() as WithChatState);
    const messageRef = firestore.collection("messages");
    if(currentUser && openChat) {
        const {id, user1, user2} = openChat
        await messageRef.add({
            text: userText,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            userId: currentUser.uid,
            chatId: id,
            status: user1 === user2 ? "read" : "unread"
        } as Message)
    }
    dispatch(setChatControlsData(
        {
            userText: ""
        }
    ))
}

export function chatControlsReducer(
    state: ChatControlsState = initialChatControlsState,
    action: ReturnType<typeof setChatControlsData | typeof clearStateOnSignOut>
): ChatControlsState {
    switch(action.type) {
        case "CHAT_CONTROLS/SET_CHAT_CONTROLS_DATA": {
            return {
                    ...state,
                    ...action.payload
                }
        }
        case "APP_ACTIONS/CLEAR_STATE_ON_SIGN_OUT": {
            return initialChatControlsState
        }
        default: {
            return state
        }
    }
}