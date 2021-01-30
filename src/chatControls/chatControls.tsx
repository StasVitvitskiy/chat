import React, {ChangeEvent, PureComponent, SyntheticEvent} from "react";
import {Box, Button, withStyles} from "@material-ui/core";
import {connect} from "react-redux";
import {ChatControlsState, sendMessage, setChatControlsData, WithChatControlsState} from "./chatControlsReducer";
import {InputBase} from "@material-ui/core";
import {bindActionCreators} from "redux";

const styles = {
    input: {
        backgroundColor: 'white',
        borderRadius: '10px 0px 0px 10px',
        padding: '5px',
        boxSizing: 'border-box' as const
    },
    fullWidth: {
        padding: 0
    }
}

const StyledButton = withStyles({
    contained: {
        borderRadius: "0px 10px 10px 0"
    }
})(Button)

export const ChatControls = connect(
    (state: WithChatControlsState) => state.chatControls,
    dispatch => bindActionCreators({setChatControlsData, sendMessage}, dispatch)
)(
    withStyles(styles)(
        class extends PureComponent<ChatControlsState & {
            setChatControlsData: typeof setChatControlsData,
            sendMessage: typeof sendMessage
        } & { classes: { [className in keyof typeof styles]: string } }> {
            handleKeyPress = (e: React.KeyboardEvent) => {
                if(e.key === "Enter") {
                    if(!e.shiftKey) {
                        e.preventDefault()
                        this.props.sendMessage();
                    }
                }
            }
            onChange = (e: ChangeEvent<HTMLInputElement>) => {
                this.props.setChatControlsData({userText: e.target.value})
            }
            handleSubmit = (e: SyntheticEvent) => {
                e.preventDefault();
                this.props.sendMessage()
            }
            render() {
                const {userText, classes} = this.props
                return (
                    <Box padding='10px' boxSizing='border-box' component='form' display='flex' onSubmit={this.handleSubmit}>
                        <InputBase
                            onKeyPress={this.handleKeyPress}
                            classes={classes}
                            multiline
                            rows={3}
                            fullWidth
                            autoFocus
                            color='primary'
                            value={userText}
                            onChange={this.onChange}
                        />
                        <StyledButton type='submit' variant="contained" color="primary">
                            Submit
                        </StyledButton>
                    </Box>
                )
            }
        }
    )
)