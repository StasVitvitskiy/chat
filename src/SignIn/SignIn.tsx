import React, {RefObject, SyntheticEvent, useEffect, useRef, useState} from "react";
import {auth,firestore} from '../firebase'
import firebase from "firebase";
import {useCollectionData} from "react-firebase-hooks/firestore";
import {ChatMessage} from '../messages/chatMessage'
import airplane from '../media/airplane.png'
import Button from "react-bootstrap/Button";

export function SignIn() {
  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }
  return (
      <Button variant='outline-primary' onClick={signInWithGoogle}>Sign In With Google</Button>
  )
}

export function SignOut() {
  return auth.currentUser && (
      <Button onClick={() => auth.signOut()}>Sign Out</Button>
  )
}

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
      <main>
        {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}
        <div ref={dummy as RefObject<HTMLDivElement>}/>
        <form onSubmit={sendMessage} action="">
          <input value={formValue} onChange={(event => setFormValue(event.target.value))}/>
          <Button type='submit'>
            <img width='16px' src={airplane} alt=""/>
          </Button>
        </form>
      </main>
  )
}