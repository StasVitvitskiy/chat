import {Dispatch} from "redux";
import {auth} from "../firebase";
import {History} from "history"

export type SignUpState = {
    email: string
    password: string
    confirmPassword: string
    error: string
    loading: boolean
}
export type WithSignUpState = {
    signUp: SignUpState
}

export const initialSignUpState: SignUpState= {
    email: "",
    password: "",
    confirmPassword: "",
    error: "",
    loading: false
}

export const setSignUpField = (field: keyof SignUpState, value: string | boolean) => {
    return {
        type: "SIGN_UP/SET_FIELD",
        payload: {
            field,
            value
        }
    }
}
export const signUp = (
    email: string,
    password: string,
    confirmPassword: string,
    history: History
) => async (dispatch: Dispatch) => {
    if(password !== confirmPassword) {
        return dispatch(setSignUpField("error", "Passwords do not match!"))
    }
    try {
        dispatch(setSignUpField("error", ""))
        dispatch(setSignUpField("loading", true))
        await auth.createUserWithEmailAndPassword(email,password)
        dispatch(setSignUpField("loading", false))
        history.push('/personal-info');
    } catch(error) {
        const errorCode = error.code;
        const errorMessage = error.message;
        if (errorCode === 'auth/weak-password') {
            dispatch(setSignUpField("error", "The password is too weak."))
        } else {
            dispatch(setSignUpField("error", errorMessage))
        }
        dispatch(setSignUpField("loading", false))
    }
}

export function signUpReducer(
    state: SignUpState = initialSignUpState,
    action: ReturnType<typeof setSignUpField>
): SignUpState {
    switch (action.type) {
        case "SIGN_UP/SET_FIELD": {
            const {field, value} = action.payload
            return {
                ...state,
                [field]: value
            }
        }
        default:
            return state
    }
}