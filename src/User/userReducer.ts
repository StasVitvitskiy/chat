import {CurrentUser, personalInfoResponse, UserInfo, userStateChanged, UserStatus} from "../api";
import {onlineStatusResponse} from "../api/userOnlineStatusSaga";

export type UserState = {
    currentUser: CurrentUser
    userInfo: {
        [uid: string]: UserInfo
    },
    userStatus: UserStatus
}

export const initialUserState: UserState = {
    currentUser: undefined,
    userInfo: {},
    userStatus: {}
}
export type WithUserState = {
    user: UserState
}

export function userReducer(
    state: UserState = initialUserState,
    action: ReturnType<typeof userStateChanged | typeof personalInfoResponse | typeof onlineStatusResponse>
):UserState {
    switch (action.type) {
        case userStateChanged.toString(): {
            const {payload: currentUser} = action
            return {
                ...state,
                currentUser
            }
        }
        case personalInfoResponse.toString(): {
            const {payload: userInfo} = action
            return {
                ...state,
                userInfo
            }
        }
        case onlineStatusResponse.toString(): {
            const {payload: userStatus} = action
            return {
                ...state,
                userStatus
            }
        }
        default: {
            return state
        }
    }
}

