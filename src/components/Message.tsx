import React from "react"
import { auth } from "../../firebase/clientApp"
import { useAuthState } from "react-firebase-hooks/auth"
import Image from 'next/image'
import styles from '../styles/messages.module.scss'

const Message = ({ message }: {message: any}) => {
  const [user] = useAuthState(auth)
  return (
    <div
      className={`${styles["chat-bubble"]} ${styles[message.uid === user?.uid ? "right" : ""]}`}>
      <Image
        className={styles["chat-bubble__left"]}
        src={`${(message.avatar === null) ? '/user.png' : message.avatar}`}
        alt="user avatar"
        width={50}
        height={50}
      />
      <div className={styles["chat-bubble__right"]}>
        <p className={styles["user-name"]}>{message.name}</p>
        <p className={styles["user-message"]}>{message.text}</p>
      </div>
    </div>
  )
}

export default Message
