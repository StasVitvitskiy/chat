import {WithUserState} from "./userReducer";

export const userStateSelector = (state: WithUserState) => state.user