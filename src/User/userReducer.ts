import firebase from "firebase";
import {Dispatch} from "redux";
import {firestore} from "../firebase";

export type UserInfo = {
    name: string,
    lastName: string,
    photoUrl: string,
    uid: string
}

export type UserState = {
    currentUser: firebase.User | null | undefined
    userInfo: {
        [uid: string]: UserInfo
    }
}
export const initialUserState: UserState = {
    currentUser: undefined,
    userInfo: {},
}
export type WithUserState = {
    user: UserState
}

export const setCurrentUser = (user: firebase.User | null) => ({
    type: "USER/SET_CURRENT_USER",
    payload: {user}
}) as const

export const getUsers = () => async (dispatch: Dispatch) => {
    const usersCollection = await firestore.collection('personalInfo').get();
    const usersObject: {[uid: string]: UserInfo} = {};
    usersCollection.forEach((el) => {
        usersObject[el.data().uid] = el.data() as UserInfo;
    })
    dispatch(setUsersInfo(usersObject));
}

export const setUsersInfo = (usersObject: {[uid: string]: UserInfo}) => ({
    type: "USER/SET_USERS_INFO",
    payload: {usersObject}
}) as const

export function userReducer(
    state: UserState = initialUserState,
    action: ReturnType<typeof setCurrentUser | typeof setUsersInfo>
):UserState {
    switch (action.type) {
        case "USER/SET_CURRENT_USER": {
            const {user: currentUser} = action.payload
            return {
                ...state,
                currentUser
            }
        }
        case "USER/SET_USERS_INFO": {
            const {usersObject: userInfo} = action.payload
            return {
                ...state,
                userInfo
            }
        }
        default: {
            return state
        }
    }
}

