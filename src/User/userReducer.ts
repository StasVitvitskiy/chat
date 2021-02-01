import firebase from "firebase";
import {Action, Dispatch} from "redux";
import {firestore} from "../firebase";
import {strict} from "assert";

export type UserInfo = {
    name: string,
    lastName: string,
    photoUrl: string,
    uid: string
}

export type CurrentUser = firebase.User | null | undefined

export type UserState = {
    currentUser: CurrentUser
    userInfo: {
        [uid: string]: UserInfo
    },
    userStatus: UserStatus
}

export type UserStatus = {
    [uid: string]: OnlineStatus
}
export type OnlineStatus = 'online' | 'offline'

export const initialUserState: UserState = {
    currentUser: undefined,
    userInfo: {},
    userStatus: {}
}
export type WithUserState = {
    user: UserState
}

export const setCurrentUser = (user: CurrentUser) => ({
    type: "USER/SET_CURRENT_USER",
    payload: {user}
}) as const

export const getUsersInfo = async () => {
    const usersCollection = await firestore.collection('personalInfo').get();
    const usersObject: {[uid: string]: UserInfo} = {};
    usersCollection.forEach((el) => {
        usersObject[el.data().uid] = el.data() as UserInfo;
    })
    return usersObject;
}

export const getUsers = () => async(dispatch: Dispatch) => {
    const userInfo = await getUsersInfo();
    dispatch(setUsersInfo(userInfo));
}

export const setUserState = (data: Partial<UserState>) => ({
    type: "USER/SET_USER_STATE",
    payload: {data}
}) as const

export const initUserState = (user: CurrentUser) => async(dispatch: Function) => {
    if(user) {
        const userInfo = await getUsersInfo();
        dispatch(setUserState({currentUser: user, userInfo}))

        dispatch(setUserOnlineStatus(user.uid, "online"))
        dispatch(subscribeToUserOnlineStatus())
        dispatch(subscribeToVisibilityChange(user.uid))
    } else {
        dispatch(
            setCurrentUser(user)
        )
    }
}

export const setUserOnlineStatus = (uid: string, status: 'online' | 'offline') => async() => {
    const userStatusRef = firestore.collection('userStatus')
    await userStatusRef.doc(uid).set({
        status
    })
}
export const subscribeToUserOnlineStatus = () => async(dispatch: Dispatch) => {
    const userStatusCollectionRef = firestore.collection('userStatus');
    userStatusCollectionRef.onSnapshot((snapshot) => {
        const statuses = snapshot.docs.map((el) => {
            return {
                uid: el.id,
                ...el.data()
            } as UserStatus
        })
        console.log(statuses)
        const userStatus = statuses.reduce((acc,cur) => {
            acc[cur.uid] = cur.status
            return acc;
        }, {} as UserStatus)
        dispatch(setUserStatus(userStatus));
    })
}
export const subscribeToVisibilityChange = (uid: string) => async (dispatch: Function) => {
    document.addEventListener("visibilitychange", () => {
        if(document.hidden) {
            dispatch(
                setUserOnlineStatus(uid, "offline")
            )
        } else {
            dispatch(
                setUserOnlineStatus(uid, 'online')
            )
        }
    })
    window.addEventListener("beforeunload", () => {
        dispatch(
            setUserOnlineStatus(uid, 'offline')
        );
    })
}
export const setUserStatus = (userStatus: UserStatus) => ({
    type: "USER/SET_USER_STATUS",
    payload: {userStatus}
}) as const
export const setUsersInfo = (usersObject: {[uid: string]: UserInfo}) => ({
    type: "USER/SET_USERS_INFO",
    payload: {usersObject}
}) as const

export function userReducer(
    state: UserState = initialUserState,
    action: ReturnType<typeof setCurrentUser | typeof setUsersInfo | typeof setUserStatus | typeof setUserState>
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
        case "USER/SET_USER_STATUS": {
            const {userStatus} = action.payload
            return {
                ...state,
                userStatus
            }
        }
        case "USER/SET_USER_STATE": {
            const {data} = action.payload
            return {
                ...state,
                ...data
            }
        }
        default: {
            return state
        }
    }
}

