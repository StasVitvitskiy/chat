import {clearStateOnSignOut} from "../appActions";
import {
    Chat,
    MessagesMap,
    messagesResponse,
    openChatByIdResponse,
    openChatResponse,
    personalInfoResponse,
    UserInfoState
} from "../api";

export type ChatState = {
    openChat?: Chat
    userInfo: UserInfoState
    messages: MessagesMap
}

export type WithChatState = {
    chat: ChatState
}

export const initialChatState: ChatState = {
    userInfo: {},
    messages: {},
}

export function chatReducer(
    state: ChatState = initialChatState,
    action: ReturnType<
        typeof clearStateOnSignOut | typeof openChatResponse | typeof openChatByIdResponse
        | typeof messagesResponse | typeof personalInfoResponse
    >
): ChatState {
    switch(action.type) {
        case openChatResponse.toString():
        case openChatByIdResponse.toString():
            return {
                ...state,
                openChat: action.payload
            }
        case messagesResponse.toString():
            return {
                ...state,
                messages: action.payload
            }
        case personalInfoResponse.toString():
            return {
                ...state,
                userInfo: action.payload
            }
        case "APP_ACTIONS/CLEAR_STATE_ON_SIGN_OUT": {
            return initialChatState
        }
        default: {
            return state
        }
    }
}