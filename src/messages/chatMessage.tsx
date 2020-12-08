import React from "react";
import {auth} from '../firebase'
import firebase from "firebase";

export function ChatMessage(
    props: {
      message: {
          text: string,
          uid: string,
          photoURL: string,
          createdAt: firebase.firestore.Timestamp
      }
    }
) {
  const {text, uid, photoURL,createdAt} = props.message;
  if(!createdAt) {
    return null;
  }
  const date = createdAt.toDate();
  const month = date.getMonth() + 1 < 10 ? '0' + date.getMonth() + 1 : date.getMonth() + 1;
  const day = date.getDay() < 10 ? '0' + date.getDay() : date.getDay();
  const hr = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
  const min = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
  console.log(text, date, `${month}/${day} at ${hr}:${min}`)
  const messageClass = uid === (auth.currentUser || {}).uid ? 'sent' : 'received';
  return(
      <div className={`message ${messageClass}`}>
        <img src={photoURL} alt=""/>
        <p>{` ${text}  ${month}/${day} at ${hr}:${min}`}</p>
      </div>
  )
}