import {Chat, chatsListResponse, MessagesMap, messagesResponse} from "../api";
import {clearStateOnSignOut} from "../appActions";

export type ChatsListState = {
    chatsArray: Chat[],
    messages: MessagesMap
}

export type WithChatsListState = {
    chatsList: ChatsListState
}

export const initialChatsListState: ChatsListState = {
    chatsArray: [],
    messages: {}
}

export function chatsListReducer(
    state: ChatsListState = initialChatsListState,
    action: ReturnType<typeof clearStateOnSignOut | typeof messagesResponse | typeof chatsListResponse>
): ChatsListState {
    switch (action.type) {
        case messagesResponse.toString():
            return {
                ...state,
                messages: action.payload
            }
        case chatsListResponse.toString():
            return {
                ...state,
                chatsArray: Object.values(action.payload)
            }
        case "APP_ACTIONS/CLEAR_STATE_ON_SIGN_OUT": {
            return initialChatsListState
        }
        default: {
            return state
        }
    }
}