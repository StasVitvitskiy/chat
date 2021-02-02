import {Dispatch} from "redux";
import {auth} from "../firebase";
import {clearStateOnSignOut} from "../appActions";

export type SignInState = {
    email: string
    password: string
    error: string
    loading: boolean
}

export type WithSignInState = {
    signIn: SignInState
}

export const initialSignInState: SignInState = {
    email: "",
    password: "",
    error: "",
    loading: false
}

export const setSignInField = (field: keyof SignInState, value: string | boolean) => {
    return {
        type: "SIGN_IN/SET_FIELD",
        payload: {
            field,
            value
        }
    }
}

export const signIn = (
    email: string,
    password: string,
) => async (dispatch: Dispatch) => {
    try {
        dispatch(setSignInField("error", ""));
        dispatch(setSignInField("loading", true));
        await auth.signInWithEmailAndPassword(email,password)
        dispatch(setSignInField("loading", false));
    } catch(error) {
        dispatch(setSignInField("error", error.message));
        dispatch(setSignInField("loading", false));
    }
}


export function signInReducer(
    state: SignInState = initialSignInState,
    action: ReturnType<typeof setSignInField | typeof clearStateOnSignOut>
):SignInState {
    switch (action.type) {
        case "SIGN_IN/SET_FIELD": {
            const {field, value} = action.payload;
            return {
                ...state,
                [field]: value
            }
        }
        case "APP_ACTIONS/CLEAR_STATE_ON_SIGN_OUT": {
            return initialSignInState
        }
        default: {
            return state
        }
    }
}
