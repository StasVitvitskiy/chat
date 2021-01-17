import React from 'react'
import {
    Layout,
    LeftPanel,
    LeftPanelBottom,
    LeftPanelTop,
    RightPanel,
    RightPanelBottom,
    RightPanelMain,
    RightPanelTop
} from "../layout";
import {SignOut} from "../SignOut";
import {SearchUsers} from "../User";
import {ChatMessages} from "../Chat";

export function ChatRoom() {
    return (
        <main>
            <Layout>
                <LeftPanel>
                    <LeftPanelTop>
                        <SearchUsers />
                    </LeftPanelTop>
                    <LeftPanelBottom>
                        <SignOut />
                    </LeftPanelBottom>
                </LeftPanel>
                <RightPanel>
                    <RightPanelTop/>
                    <RightPanelMain>
                        <ChatMessages />
                    </RightPanelMain>
                    <RightPanelBottom/>
                </RightPanel>
            </Layout>
        </main>
    )
}