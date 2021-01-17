import React, {PureComponent} from "react";
import {Box} from "@material-ui/core";
import {connect} from "react-redux";
import {ChatState, WithChatState} from "./chatReducer";

export const ChatMessages = connect(
    (state:WithChatState): ChatState => state.chat
)(
    class extends PureComponent<ChatState> {
        render() {
            const isChatOpen = Boolean(this.props.id);
            return(
                <Box width='100%' height='100%' bgcolor={isChatOpen ? "white" : "#b7b7b7"}>
                    {this.props.messages.map((el, key) => {
                        return <div key={String(key)}>{el.text}</div>
                    })}
                </Box>
            )
        }
    }
)