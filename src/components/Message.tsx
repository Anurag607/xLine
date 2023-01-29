import React from "react"
import { db,auth } from "../../firebase/clientApp"
import { useAuthState } from "react-firebase-hooks/auth"
import Image from 'next/image'
import styles from '../styles/messages.module.scss'
import {selectMsg, deselectMsg} from '../scripts/msgReply.mjs'
import {
  doc,
  getDoc
} from "firebase/firestore"

const Message = ({ message, index }: {message: any, index: number}) => {
  const [user] = useAuthState(auth)
  const [replyTo, setReplyTo] = React.useState<any>(null)
  const [time, setTime] = React.useState<string>('')

  React.useEffect(() => {

    let dateTime = (message.createdAt !== null) ? message.createdAt.toDate() : new Date()
    setTime(currTime => currTime = `${dateTime.getHours()}:${dateTime.getMinutes()}`)

    if(message.replyTo !== undefined && message.replyTo !== null && message.replyTo.length > 0) {
      try {
        const getMessages = async() => {
          let docRef = doc(db, 'messages', message.replyTo)
          const docSnap = await getDoc(docRef)
          setReplyTo(docSnap.data())
        }
        getMessages()
      } catch(err) {
        console.error(err)
      }
    }
  }, []) // eslint-disable-line

  return (
    <div className={styles.messageContainer}>
      {( /*(Cookies.get("replyMode") !== undefined && Cookies.get("replyMode") === "true") ||*/ replyTo !== null ) ?

      <div
        className={`${styles["replyToContainer"]} replyToContainer ${styles[message.uid === user?.uid ? "right" : ""]}`}
        data-switch={"off"}
        onClick={(event:React.MouseEvent<HTMLDivElement>) => {
          if(!deselectMsg(index, event)) selectMsg(index, event)
          const sendMsg:HTMLInputElement = document.querySelector(".form-input__input")!
          if(sendMsg !== undefined && sendMsg !== null) sendMsg.focus()
        }}
      >
        <div
          // className={`${styles["reply-chat-bubble"]} chat-bubble ${styles[JSON.parse(Cookies.get('selectedMsg')).uid === user?.uid ? "right" : ""]}`}
          className={`${styles["replyTo-chat-bubble"]} replyTo-chat-bubble ${styles[replyTo.uid === user?.uid ? "right" : ""]}`}
          // data-details={Cookies.get('selectedMsg')}
          data-details={JSON.stringify(replyTo)}
          data-switch={"off"}
          onClick={(event:React.MouseEvent<HTMLDivElement>) => {
            if(!deselectMsg(index, event)) selectMsg(index, event)
          }}
        >
          <Image
            className={styles["replyTo-chat-bubble__left"]}
            // src={`${(JSON.parse(Cookies.get('selectedMsg')).avatar === null) ? '/user.png' : JSON.parse(Cookies.get('selectedMsg')).avatar}`}
            src={`${(replyTo.avatar === null) ? '/user.png' : replyTo.avatar}`}
            alt="user avatar"
            width={50}
            height={50}
          />
          <div className={styles["replyTo-chat-bubble__right"]}>
            {/* <p className={styles["user-name"]}>{JSON.parse(Cookies.get('selectedMsg')).name}</p>
            <p className={styles["user-message"]}>{JSON.parse(Cookies.get('selectedMsg')).text}</p> */}
            <p className={styles["replyTo-user-name"]}>{replyTo.name}</p>
            <p className={styles["replyTo-user-message"]}>{replyTo.text}</p>
          </div>
        </div>

        <div
          className={`${styles["reply-chat-bubble"]} reply-chat-bubble ${styles[message.uid === user?.uid ? "right" : ""]}`}
          data-details={JSON.stringify(message)}
          >
          <Image
            className={styles["reply-chat-bubble__left"]}
            src={`${(message.avatar === null) ? '/user.png' : message.avatar}`}
            alt="user avatar"
            width={50}
            height={50}
          />
          <div className={styles["reply-chat-bubble__right"]}>
            <p className={styles["reply-user-name"]}>{message.name}</p>
            <p className={styles["reply-user-message"]}>{message.text}</p>
          </div>
        </div>

        <div className={styles.time}>
          <span>{time}</span>
        </div>
      </div> :

      <div
        className={`${styles["chat-bubble"]} chat-bubble ${styles[message.uid === user?.uid ? "right" : ""]}`}
        data-details={JSON.stringify(message)}
        data-switch={"off"}
        onClick={(event:React.MouseEvent<HTMLDivElement>) => {
          if(!deselectMsg(index, event)) selectMsg(index, event)
          const sendMsg:HTMLInputElement = document.querySelector(".form-input__input")!
          if(sendMsg !== undefined && sendMsg !== null) sendMsg.focus()
        }}
      >
        <div>
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
        <div className={styles.time}>
          <span>{time}</span>
        </div>
      </div>
    }
    </div>
  )
}

export default Message
