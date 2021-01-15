import React, {RefObject, SyntheticEvent, useEffect, useRef, useState} from 'react'
import {auth, firestore} from "../firebase";
import {useCollectionData} from "react-firebase-hooks/firestore";
import firebase from "firebase/app";
import {ChatMessage} from "../messages";
import {Button} from "@material-ui/core";
import airplane from "../media/airplane.png";
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
import SearchUsers from "../searchUsers/SearchUsers";

export function ChatRoom() {
    const dummy = useRef<HTMLDivElement>()
    const messagesRef = firestore.collection('messages');
    const query = messagesRef.orderBy('createdAt').limit(25);
    const [messages] = useCollectionData<{
        id: string,
        text: string,
        uid: string,
        photoURL: string,
        createdAt: firebase.firestore.Timestamp
    }>(query, {idField: 'id'});
    const [formValue, setFormValue] = useState('');
    useEffect(() => {

    }, [formValue])
    const sendMessage = async (e: SyntheticEvent) => {
        e.preventDefault();
        const { currentUser } = auth
        if (currentUser) {
            const {uid, photoURL} = auth.currentUser as { uid: string, photoURL: string };
            await messagesRef.add({
                text: formValue,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                uid,
                photoURL
            })
            setFormValue('');
            if (dummy && dummy.current) {
                dummy.current.scrollIntoView({behavior: 'smooth'});
            }
        }
    }
    return (
        <>
            <main style={{display:"none"}}>
                {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}
                <div ref={dummy as RefObject<HTMLDivElement>}/>
                <form onSubmit={sendMessage} action="">
                    <input value={formValue} onChange={(event => setFormValue(event.target.value))}/>
                    <Button color='primary' type='submit'>
                        <img width='16px' src={airplane} alt=""/>
                    </Button>
                </form>
            </main>
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
                    <RightPanelMain/>
                    <RightPanelBottom/>
                </RightPanel>
            </Layout>
        </>
    )
}