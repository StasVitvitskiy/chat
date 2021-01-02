import firebase from "firebase";

export type UserInfo = {
    name: string,
    photoUrl: string,
    uid: string
}

export type UserState = {
    currentUser: firebase.User | null | undefined
    userInfo: {
        [id: string]: UserInfo
    }
}
export const initialUserState: UserState = {
    currentUser: undefined,
    userInfo: {}
}
export type WithUserState = {
    user: UserState
}

export const setCurrentUser = (user: firebase.User | null) => ({
    type: "USER/SET_CURRENT_USER",
    payload: {user}
})

export function userReducer(
    state: UserState = initialUserState,
    action: ReturnType<typeof setCurrentUser>
):UserState {
    switch (action.type) {
        case "USER/SET_CURRENT_USER": {
            const {user: currentUser} = action.payload
            return {
                ...state,
                currentUser
            }
        }
        default: {
            return state
        }
    }
}

