import {Chat, Message} from "../Chat";
import {Dispatch} from "redux";
import {userStateSelector} from "../User/userSelectors";
import {WithUserState} from "../User";
import {firestore} from "../firebase";
import groupBy from 'lodash/groupBy'
import {clearStateOnSignOut} from "../appActions";
import { uniqBy } from "lodash";

export type ChatsListState = {
    chatsArray: {
        user1: string,
        user2: string,
        id: string,
        lastMessage?: Message
    }[],
}

export type WithChatsListState = {
    chatsList: ChatsListState
}

export const initialChatsListState: ChatsListState = {
    chatsArray: []
}
export const setChatsListData = (data: ChatsListState) => ({
    type: "CHATS_LIST/SET_CHATS_LIST_DATA",
    payload: data
}) as const

export const loadChats = () => async(dispatch: Dispatch, getState: () => unknown) => {
    const {currentUser} = userStateSelector(getState() as WithUserState);
    const chatRef = firestore.collection('chat');
    const messagesRef = firestore.collection('messages')
    if(currentUser) {
        const snapshotByUser1 = await chatRef.where("user1", '==', currentUser.uid).get();
        const snapshotByUser2 = await chatRef.where("user2", '==', currentUser.uid).get();
        const chats = uniqBy(
            snapshotByUser1.docs.reduce((acc,cur) => acc.concat({
                ...cur.data() as { user1: string, user2: string },
                id: cur.id
            }), [] as Chat[]).concat(snapshotByUser2.docs.reduce((acc,cur) => {
                return acc.concat({
                    ...cur.data() as { user1: string, user2: string},
                    id: cur.id
                })
            }, [] as Chat[])),
            'id'
        )
        const messagesSnapshot = await messagesRef.where("chatId", 'in', chats.map((el) => el.id)).get()
        const messagesArray = messagesSnapshot.docs.reduce((acc,cur) => {
            return acc.concat({
                ...cur.data() as Omit<Message, "id">,
                id: cur.id
            })
        }, [] as Message[])
        const groupedByChatId = groupBy(messagesArray, 'chatId');
        const chatsWithLastMessage = chats.map((elem) => (
            {
                ...elem,
                lastMessage: (groupedByChatId[elem.id] || [])
                    .sort((a,b) => +a.createdAt.toDate() - +b.createdAt.toDate()).pop()
            }))

        dispatch(setChatsListData({chatsArray: chatsWithLastMessage}))
    }
}
// [
    // {
    // dsgeoijgiesdfsf:
    //   {
    //     user1: dswfrwefskfwopek23fe,
    //     user2: sdfsfkghsldgsdlfkjsl
    //   }
    // },
    // {
    // dsgeoijgiesdfsf:
    //   {
    //    user1: dswfrwefskfwopek23fe,
    //    user2: sdfsfkghsldgsdlfkjsl
    //   }
    // },
// ]


export function chatsListReducer(
    state: ChatsListState = initialChatsListState,
    action: ReturnType<typeof setChatsListData | typeof clearStateOnSignOut>
): ChatsListState {
    switch (action.type) {
        case "CHATS_LIST/SET_CHATS_LIST_DATA": {
            return {
                ...state,
                ...action.payload
            }
        }
        case "APP_ACTIONS/CLEAR_STATE_ON_SIGN_OUT": {
            return initialChatsListState
        }
        default: {
            return state
        }
    }
}