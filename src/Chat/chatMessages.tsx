import React, {PureComponent} from "react";
import {Box} from "@material-ui/core";
import {connect} from "react-redux";
import {ChatState, WithChatState} from "./chatReducer";
import { WithUserState} from "../User";
import firebase from "firebase";
import {format } from 'date-fns'
import {ChatMessage} from "./chatMessage";

export const ChatMessages = connect(
    (state) => ({
        ...(state as WithChatState).chat,
        currentUser: (state as WithUserState).user.currentUser
    })
)(
    class extends PureComponent<ChatState & {currentUser: firebase.User | null | undefined}> {
        render() {
            const isChatOpen = Boolean(this.props.id);
            const {user1,user2, currentUser} = this.props
            if(user1 && user2 && currentUser) {
                if(currentUser.uid !== user1.uid) {

                }
            }
            return(
                <Box width='100%' height='100%' bgcolor={isChatOpen ? "white" : "#b7b7b7"}>
                    {this.props.messages.map((el) => {
                        return <ChatMessage
                            key={el.id}
                            isMyMessage={currentUser ? el.userId === currentUser.uid : false }
                            message={el}
                        />
                    })}
                </Box>
            )
        }
    }
)