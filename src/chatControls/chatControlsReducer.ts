import {Dispatch} from "redux";
import {chatControlsStateSelector} from "./chatControlsStateSelector";
import {firestore} from "../firebase";
import firebase from "firebase";
import {userStateSelector} from "../User/userSelectors";
import {WithUserState} from "../User";
import {chatStateSelector} from "../Chat/chatSelector";
import {Message, WithChatState} from "../Chat";


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
    const {id} = chatStateSelector(getState() as WithChatState);
    const messageRef = firestore.collection("messages");
    if(currentUser) {
        await messageRef.add({
            text: userText,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            userId: currentUser.uid,
            chatId: id
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
    action: ReturnType<typeof setChatControlsData>
): ChatControlsState {
    switch(action.type) {
        case "CHAT_CONTROLS/SET_CHAT_CONTROLS_DATA": {
            return {
                    ...state,
                    ...action.payload
                }
        }
        default: {
            return state
        }
    }
}