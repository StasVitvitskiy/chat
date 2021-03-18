import React, {PureComponent} from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Typography from '@material-ui/core/Typography';
import {Box, withStyles} from "@material-ui/core";
import {connect} from "react-redux";
import {ChatsListState, WithChatsListState} from './chatsListReducer';
import {bindActionCreators} from "redux";
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import {WithUserState} from "../User";
import {WithChatState} from "../Chat";
import {Chat, CurrentUser, Message, openChatById, UserInfoState} from '../api';

const styles = {
    root: {
        width: '100%',
        color: "#777777"
    },
    inline: {
        display: 'inline',
    },
}

export const ChatsList = connect(
    (state: WithChatsListState & WithUserState & WithChatState) => ({
        ...state.chatsList,
        currentUser: state.user.currentUser,
        userInfo: state.user.userInfo,
        openedChatId: state.chat.openChat?.id,
        lastMessagesMap: state.chatsList.chatsArray.reduce((acc, chat) => ({
            ...acc,
            [chat.id]: (state.chatsList.messages[chat.id] || []).slice(-1)[0]
        }), {}),
        unreadMessagesMap: state.chatsList.chatsArray.reduce((acc, chat) => ({
            ...acc,
            [chat.id]: (state.chatsList.messages[chat.id] || []).filter(msg => {
                return msg.status === "unread" && msg.userId !== state.user.currentUser?.uid
            }).length
        }), {})
    }),
    dispatch => bindActionCreators({openChatById}, dispatch)
)(
    withStyles(styles)(
        class extends PureComponent<ChatsListState &
            {
                classes: {[className in keyof typeof styles]: string},
                openChatById: typeof openChatById,
                currentUser: CurrentUser,
                userInfo: UserInfoState,
                openedChatId?: string,
                lastMessagesMap: {[chatId: string]: Message},
                unreadMessagesMap: {[chatId: string]: number}
            }> {
            getPeerName(chat: Chat) {
                const {currentUser, userInfo} = this.props;
                const {user1, user2} = chat
                if(currentUser && user1 in userInfo && user2 in userInfo) {
                  return currentUser.uid === user1 ? userInfo[user2].name : userInfo[user1].name;
                }
             }
             openChat = (chatId: string) => () => {
                this.props.openChatById(chatId,true)
             }
            render() {
                const {classes, chatsArray,currentUser, openedChatId, lastMessagesMap, unreadMessagesMap} = this.props
                return (
                    <List className={classes.root}>
                        {chatsArray.map((elem) => {
                            const lastMessage = lastMessagesMap[elem.id]
                            return (
                                <React.Fragment key={elem.id}>
                                    <ListItem
                                        style={{
                                            cursor: "pointer",
                                            backgroundColor: openedChatId === elem.id? "#6490B1" : "inherit",
                                            color: openedChatId === elem.id? "white" : "inherit"
                                        }}
                                        onClick={this.openChat(elem.id)}
                                        alignItems="flex-start">
                                        <ListItemAvatar>
                                            <AccountCircleIcon />
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={this.getPeerName(elem)}
                                            secondaryTypographyProps={{
                                                color: "inherit",
                                                style: {
                                                    fontSize: "0.8em",
                                                    display: "flex",
                                                    justifyContent: "space-between",
                                                    alignItems: "center"
                                                }
                                            }}
                                            secondary={
                                                <React.Fragment>
                                                    {lastMessage?.userId === currentUser?.uid &&
                                                    (<Typography
                                                        component="span"
                                                        variant="body2"
                                                        className={classes.inline}
                                                        color="inherit"
                                                    >
                                                        You:&nbsp;
                                                    </Typography>)}
                                                        <span>
                                                        {lastMessage?.text}
                                                    </span>
                                                    {Boolean(unreadMessagesMap[elem.id]) && (
                                                        <Box
                                                            component='span'
                                                            bgcolor='#64C26F'
                                                            display='flex'
                                                            justifyContent="center"
                                                            alignItems='center'
                                                            padding='0.25ch 1ch'
                                                            borderRadius="50%"
                                                            color="white"
                                                            boxSizing="border-box"
                                                        >
                                                            {(unreadMessagesMap[elem.id])}
                                                        </Box>
                                                    )}
                                                </React.Fragment>
                                            }
                                        />
                                    </ListItem>
                                    <Divider variant="inset" component="li" />
                                </React.Fragment>
                            )
                        })}
                    </List>
                )
            }
        }
    )
)