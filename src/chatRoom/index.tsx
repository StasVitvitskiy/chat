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
import {SignOut} from "../SignOut";
import {SearchUsers} from "../User";
import {ChatMessages, openChatById} from "../Chat";
import { useParams } from 'react-router-dom';
import {useDispatch} from "react-redux";
import {ChatControls} from "../chatControls";
import {ChatHeader} from "../Chat/chatHeader";

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
                <LayoutHeaderLeft />
                <LayoutHeaderRight>
                    <ChatHeader />
                </LayoutHeaderRight>
                <LeftPanel>
                    <LeftPanelTop>
                        <SearchUsers />
                    </LeftPanelTop>
                    <LeftPanelBottom>
                        <SignOut />
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