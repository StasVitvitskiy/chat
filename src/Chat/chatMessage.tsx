import React, {PureComponent} from "react";
import {Box} from "@material-ui/core";
import {Message} from "./chatReducer";
import {format} from "date-fns";

export class ChatMessage extends PureComponent<{isMyMessage: boolean, message: Message}> {
    render() {
        const {isMyMessage, message: {text, createdAt}} = this.props
        return (
            <Box overflow='scroll' display='flex' boxSizing='border-box' padding='5px' justifyContent={isMyMessage ? "flex-end" : "flex-start"}>
                <Box minWidth='150px' maxWidth='33%' padding='10px' borderRadius='10px' bgcolor='#4A7799'>
                    <Box textAlign='left' color='white' fontSize='1rem'>{text}</Box>
                    <Box textAlign='right' color='lightgrey' fontSize='0.8rem'>{format(createdAt.toDate(), 'EEE H:mm:ss')}</Box>
                </Box>
            </Box>
        )
    }
}