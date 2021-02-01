import React, {PureComponent} from "react";
import {Box} from "@material-ui/core";
import {ChatState, WithChatState} from "./chatReducer";
import {connect} from "react-redux";
import {CurrentUser, UserStatus, WithUserState} from "../User";

export const ChatHeader = connect(
    (state: WithChatState & WithUserState) => ({
        ...state.chat,
        currentUser: state.user.currentUser,
        statuses: state.user.userStatus
    })
)(
    class extends PureComponent<ChatState & {currentUser: CurrentUser, statuses: UserStatus}> {
        render() {
            const {user1, user2, currentUser, statuses} = this.props
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