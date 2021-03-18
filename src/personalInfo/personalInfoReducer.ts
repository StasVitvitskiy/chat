import {History} from "history";
import {auth, firestore} from "../firebase";
import firebase from "firebase";


export type PersonalInfoState = {
    name: string,
    lastName: string,
}

export type WithPersonalInfoState = {
    personalInfo: PersonalInfoState
}

export const initialPersonalInfoState: PersonalInfoState = {
    name: "",
    lastName: "",
}

export const setPersonalInfoField = (field: keyof PersonalInfoState, value: string) => {
    return {
        type: "PERSONAL_INFO/SET_FIELD",
        payload: {
            field,
            value
        }
    } as const
}

export const clearPersonalInfo = () => {
    return {
        type: "PERSONAL_INFO/CLEAR_FORM"
    } as const
}

export const sendPersonalInfo = (formNameValue: string, formLastNameValue: string, history: History) =>
    async (dispatch: Function) => {
        const personalInfoRef = firestore.collection('personalInfo');
        const { currentUser } = auth
        if (currentUser) {
            const { uid, photoURL,email } = auth.currentUser as firebase.UserInfo;
            const foundRecords = await personalInfoRef.where("uid", "==", uid).get();
            if(!foundRecords.size) {
                await personalInfoRef.add({
                    name: formNameValue,
                    lastName: formLastNameValue,
                    photoURL,
                    uid,
                    email
                })
            }
            dispatch(clearPersonalInfo())
            history.push('/');
        }
    }

export function personalInfoReducer(
    state: PersonalInfoState = initialPersonalInfoState,
    action: ReturnType<typeof setPersonalInfoField | typeof clearPersonalInfo>
): PersonalInfoState {
    switch (action.type) {
        case "PERSONAL_INFO/SET_FIELD": {
            const {field, value} = action.payload
            return {
                ...state,
                [field]: value
            }
        }
        case "PERSONAL_INFO/CLEAR_FORM": {
            return initialPersonalInfoState
        }
        default: {
            return state
        }
    }
}