import firebase from "firebase";

export type UserInfo = {
    name: string,
    lastName: string,
    photoUrl: string,
    uid: string
}
export type UserInfoState = {
    [uid: string]: UserInfo
}

export type CurrentUser = firebase.User | null | undefined

export type UserStatus = {
    [uid: string]: OnlineStatus
}
export type OnlineStatus = 'online' | 'offline'