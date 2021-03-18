import React, {PureComponent} from "react";
import {Box, debounce} from "@material-ui/core";
import {connect} from "react-redux";
import {ChatState, WithChatState} from "./chatReducer";
import { WithUserState} from "../User";
import {ChatMessage} from "./chatMessage";
import {CurrentUser, markAllChatMessagesAsRead} from "../api";

export const ChatMessages = connect(
    (state: WithChatState & WithUserState) => ({
        ...state.chat,
        currentUser: state.user.currentUser
    }),
    {markAllChatMessagesAsRead}
)(
    class extends PureComponent<ChatState & {
        currentUser: CurrentUser,
        markAllChatMessagesAsRead: (chatId: string, userId: string) => void
    }> {
        componentDidMount() {
            window.addEventListener("resize", this.onWindowResize);
            window.addEventListener("visibilitychange", this.onVisibilityChange)
        }

        componentDidUpdate() {
            this.scrollToLastMessage()
            this.markNewMessagesRead()
        }

        componentWillUnmount() {
            window.removeEventListener("resize", this.onWindowResize);
            window.removeEventListener("visibilitychange", this.onVisibilityChange)
        }
        scrollToLastMessage = () => {
            if(this.messagesContainerRef.current) {
                this.messagesContainerRef.current.scrollTop = this.messagesContainerRef.current.scrollHeight
            }
        }
        onWindowResize = debounce(() => {
            this.scrollToLastMessage()
        }, 500)

        messagesContainerRef = React.createRef<HTMLDivElement>()

        hasUnreadMessages() {
            const {openChat, messages} = this.props
            return (messages[openChat?.id || ""] || []).filter(msg => msg.status === "unread").length
        }
        onVisibilityChange = () => {
            if (!document.hidden) {
                this.markNewMessagesRead()
            }
        }

        markNewMessagesRead() {
            if (this.hasUnreadMessages() && this.props.openChat && this.props.currentUser) {
                this.props.markAllChatMessagesAsRead(this.props.openChat.id, this.props.currentUser.uid)
            }
        }

        render() {
            const isChatOpen = Boolean(this.props.openChat?.id);
            const {currentUser} = this.props
            return(
                <Box
                    // @ts-ignore
                    ref={this.messagesContainerRef}
                    maxHeight='100%'
                    overflow='auto'
                    width='100%'
                    height='100%'
                    bgcolor={isChatOpen ? "white" : "#b7b7b7"}
                >
                    {(this.props.messages[this.props.openChat?.id || ""] || []).map((el) => {
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