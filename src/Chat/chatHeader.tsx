import React, {PureComponent} from "react";
import {Box} from "@material-ui/core";
import {ChatState, WithChatState} from "./chatReducer";
import {connect} from "react-redux";
import {WithUserState} from "../User";
import { CurrentUser, UserStatus } from "../api";

export const ChatHeader = connect(
    (state: WithChatState & WithUserState) => ({
        ...state.chat,
        currentUser: state.user.currentUser,
        statuses: state.user.userStatus
    })
)(
    class extends PureComponent<ChatState & {currentUser: CurrentUser, statuses: UserStatus}> {
        render() {
            const {openChat, userInfo, currentUser, statuses} = this.props
            const user1 = userInfo[openChat?.user1 || ""] || {}
            const user2 = userInfo[openChat?.user2 || ""] || {}
            return (
                <Box display='flex' justifyContent='flex-start' alignItems='center' paddingLeft='10px' height='100%'>
                    <Box>
                        <Box color='white' fontSize='1.2rem'>
                            {user1?.uid === currentUser?.uid ? user2?.name : user1?.name}
                        </Box>
                        <Box color='lightgrey' fontSize='0.8rem'>
                            {statuses[String(user1?.uid === currentUser?.uid ? user2?.uid : user1?.uid)]}
                        </Box>
                    </Box>
                </Box>
            )
        }
    }
)