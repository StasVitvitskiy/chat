import React, {useEffect} from 'react'
import {
    Layout, LayoutHeaderLeft, LayoutHeaderRight,
    LeftPanel,
    LeftPanelBottom,
    LeftPanelTop,
    RightPanel,
    RightPanelBottom,
    RightPanelMain,
} from "../layout";
import {SearchUsers} from "../User";
import {ChatMessages, openChatById} from "../Chat";
import { useParams } from 'react-router-dom';
import {useDispatch} from "react-redux";
import {ChatControls} from "../chatControls";
import {ChatHeader} from "../Chat/chatHeader";
import {UserHeader} from "../User/userHeader";
import {ChatsList} from "../ChatsList";

export function ChatRoom() {
    const dispatch = useDispatch()
    // eslint-disable-next-line
    const { chatId } = useParams() as { chatId?: string }
    useEffect(() => {
        if(chatId) {
            dispatch(openChatById(chatId))
        }
    },[chatId, dispatch])
    return (
        <main>
            <Layout>
                <LayoutHeaderLeft>
                    <UserHeader />
                </LayoutHeaderLeft>
                <LayoutHeaderRight>
                    <ChatHeader />
                </LayoutHeaderRight>
                <LeftPanel>
                    <LeftPanelTop>
                        <SearchUsers />
                    </LeftPanelTop>
                    <LeftPanelBottom>
                        <ChatsList />
                    </LeftPanelBottom>
                </LeftPanel>
                <RightPanel>
                    <RightPanelMain>
                        <ChatMessages />
                    </RightPanelMain>
                    <RightPanelBottom>
                        <ChatControls />
                    </RightPanelBottom>
                </RightPanel>
            </Layout>
        </main>
    )
}