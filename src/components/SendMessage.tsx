import React, { useState } from "react"
import { auth, db } from "../../firebase/clientApp"
import { addDoc, collection, serverTimestamp } from "firebase/firestore"
import styles from "../styles/sendMessage.module.scss"
import Cookies from 'js-cookie'

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
      room: Cookies.get('currentGroup'),
      uid,
    })
    setMessage("")
    scroll.current.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <form onSubmit={(event) => sendMessage(event)} className={styles["send-message"]}>
      <label htmlFor="messageInput" hidden>
        Enter Message
      </label>
      <input
        id="messageInput"
        name="messageInput"
        type="text"
        className={styles["form-input__input"]}
        placeholder="Message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        autoFocus
        autoComplete="false"
      />
      <button type="submit">Send</button>
    </form>
  )
}

export default SendMessage
