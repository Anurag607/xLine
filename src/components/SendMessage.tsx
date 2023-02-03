import React, { useState } from "react"
import { auth, db } from "../../firebase/clientApp"
import { addDoc, collection, serverTimestamp } from "firebase/firestore"
import styles from "../styles/sendMessage.module.scss"
import Cookies from 'js-cookie'
import { deselectMsgs } from "@/scripts/msgReply.mjs"

const SendMessage = ({ scroll }: {scroll: any}) => {
  const [message, setMessage] = useState("")

  const sendMessage = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (message.trim() === "") {
      alert("Enter valid message")
      return
    }
    const { uid, displayName, photoURL, email } = auth.currentUser as any
    await addDoc(collection(db, "messages"), {
      text: message,
      name: (displayName === null) ? email.split("@")[0] : displayName,
      avatar: photoURL,
      createdAt: serverTimestamp(),
      replyTo: (Cookies.get("replyMode") === "true") ? JSON.parse(Cookies.get('selectedMsg')).id : null,
      room: JSON.parse(Cookies.get('currentGroup')).id,
      uid,
    })
    setMessage("")
    deselectMsgs()
    scroll.current.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <form onSubmit={(event) => sendMessage(event)} className={`${styles["send-message"]} send-message`}>
      <label htmlFor="messageInput" hidden>
        Enter Message
      </label>
      <input
        id="messageInput"
        name="messageInput"
        type="text"
        className={`${styles["form-input__input"]} form-input__input`}
        placeholder="Message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        autoFocus
        autoComplete="off"
      />
      <button type="submit">Send</button>
    </form>
  )
}

export default SendMessage
