import React, {PureComponent} from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Typography from '@material-ui/core/Typography';
import {withStyles} from "@material-ui/core";
import {connect} from "react-redux";
import {ChatsListState, loadChats, WithChatsListState} from './chatsListReducer';
import {bindActionCreators} from "redux";
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import {CurrentUser, UserInfo, WithUserState} from "../User";
import {Chat, openChatById, WithChatState} from "../Chat";

const styles = {
    root: {
        width: '100%',
        maxWidth: '36ch',
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
        openedChatId: state.chat.id
    }),
    dispatch => bindActionCreators({loadChats, openChatById}, dispatch)
)(
    withStyles(styles)(
        class extends PureComponent<ChatsListState &
            {
                classes: {[className in keyof typeof styles]: string},
                loadChats: typeof loadChats,
                openChatById: typeof openChatById,
                currentUser: CurrentUser,
                userInfo: {
                    [uid: string]: UserInfo
                },
                openedChatId: string
            }> {
            componentDidMount() {
                this.props.loadChats()
            }
            getPeerName(chat: Chat) {
                const {currentUser, userInfo} = this.props;
                if(currentUser) {
                  return currentUser.uid === chat.user1 ? userInfo[chat.user2].name : userInfo[chat.user1].name;
                }
             }
             openChat = (chatId: string) => () => {
                this.props.openChatById(chatId,true)
             }
            render() {
                const {classes, chatsArray,currentUser, openedChatId} = this.props
                return (
                    <List className={classes.root}>
                        {chatsArray.map((elem) => {
                            return (
                                <>
                                    <ListItem
                                        key={elem.id}
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
                                                    fontSize: "0.8em"
                                                }
                                            }}
                                            secondary={
                                                <React.Fragment>
                                                    {elem.lastMessage && elem.lastMessage.userId === currentUser?.uid &&
                                                    (<Typography
                                                        component="span"
                                                        variant="body2"
                                                        className={classes.inline}
                                                        color="inherit"
                                                    >
                                                        You:&nbsp;
                                                    </Typography>)}
                                                    {(elem.lastMessage || {}).text}
                                                </React.Fragment>
                                            }
                                        />
                                    </ListItem>
                                    <Divider variant="inset" component="li" />
                                </>
                            )
                        })}
                    </List>
                )
            }
        }
    )
)