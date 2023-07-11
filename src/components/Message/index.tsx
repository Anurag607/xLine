import React from "react";
import { db, auth } from "../../../firebase/clientApp";
import { useAuthState } from "react-firebase-hooks/auth";
import Image from "next/image";
import styles from "./messages.module.scss";
import { selectMsg, deselectMsg } from "../../scripts/msgReply";
import { doc, getDoc } from "firebase/firestore";

const Message = ({ message, index }: { message: any; index: number }) => {
  // Getting current user session...
  const [user] = useAuthState(auth);

  // Defining state variables...
  const [replyTo, setReplyTo] = React.useState<any>(null);
  const [time, setTime] = React.useState<string>("");

  React.useEffect(() => {
    // Getting and setting time from message data...
    let dateTime =
      message.createdAt !== null ? message.createdAt.toDate() : new Date();
    setTime(
      (currTime) =>
        (currTime = `${dateTime.getHours()}:${dateTime.getMinutes()}`)
    );

    // Getting and setting replyTo message data...
    if (
      message.replyTo !== undefined &&
      message.replyTo !== null &&
      message.replyTo.length > 0
    ) {
      try {
        const getMessages = async () => {
          let docRef = doc(db, "messages", message.replyTo);
          const docSnap = await getDoc(docRef);
          setReplyTo(docSnap.data());
        };
        getMessages();
      } catch (err) {
        console.error(err);
      }
    }
  }, []); // eslint-disable-line

  return (
    <div className={styles.messageContainer}>
      {/* Checking to see if current message is a reply, if true then adding the following div to indicate that message */}
      {replyTo !== null ? (
        <div
          className={`${styles["replyToContainer"]} replyToContainer ${
            styles[message.uid === user?.uid ? "right" : ""]
          }`}
          data-switch={"off"}
          onClick={(event: React.MouseEvent<HTMLDivElement>) => {
            if (!deselectMsg(index, event)) selectMsg(index, event);
            const sendMsg: HTMLInputElement =
              document.querySelector(".form-input__input")!;
            if (sendMsg !== undefined && sendMsg !== null) sendMsg.focus();
          }}
        >
          {/* For reply messages sent by the current user */}
          <div
            className={`${styles["replyTo-chat-bubble"]} replyTo-chat-bubble ${
              styles[replyTo.uid === user?.uid ? "right" : ""]
            }`}
            data-details={JSON.stringify(replyTo)}
            data-switch={"off"}
            onClick={(event: React.MouseEvent<HTMLDivElement>) => {
              if (!deselectMsg(index, event)) selectMsg(index, event);
            }}
          >
            {replyTo.image !== null &&
            replyTo.image !== undefined &&
            replyTo.image.length > 0 ? (
              <div
                className={styles.messageBubbleImg}
                style={{ backgroundImage: `url('${replyTo.image}')` }}
              />
            ) : (
              <></>
            )}
            {/* For reply messages not sent by the current user */}
            <div className={styles["replyTo-chat-bubble__wrapper"]}>
              <Image
                className={styles["replyTo-chat-bubble__left"]}
                src={`${replyTo.avatar ?? "/user.png"}`}
                alt="user avatar"
                width={50}
                height={50}
              />
              <div className={styles["replyTo-chat-bubble__right"]}>
                <p className={styles["replyTo-user-name"]}>{replyTo.name}</p>
                <p className={styles["replyTo-user-message"]}>{replyTo.text}</p>
              </div>
            </div>
          </div>

          {/* For showing the current message sent by the current user */}
          <div
            className={`${styles["reply-chat-bubble"]} reply-chat-bubble ${
              styles[message.uid === user?.uid ? "right" : ""]
            }`}
            data-details={JSON.stringify(message)}
          >
            <Image
              className={styles["reply-chat-bubble__left"]}
              src={`${message.avatar ?? "/user.png"}`}
              alt="user avatar"
              width={50}
              height={50}
            />
            <div className={styles["reply-chat-bubble__right"]}>
              <p className={styles["reply-user-name"]}>{message.name}</p>
              <p className={styles["reply-user-message"]}>{message.text}</p>
            </div>
          </div>

          {/* Div showing time */}
          <div className={styles.time}>
            <span>{time}</span>
          </div>
        </div>
      ) : (
        // For messages sent by the current user
        <div
          className={`${styles["chat-bubble"]} chat-bubble ${
            styles[message.uid === user?.uid ? "right" : ""]
          }`}
          data-details={JSON.stringify(message)}
          data-switch={"off"}
          onClick={(event: React.MouseEvent<HTMLDivElement>) => {
            if (!deselectMsg(index, event)) selectMsg(index, event);
            const sendMsg: HTMLInputElement =
              document.querySelector(".form-input__input")!;
            if (sendMsg !== undefined && sendMsg !== null) sendMsg.focus();
          }}
        >
          {message.image !== null &&
          message.image !== undefined &&
          message.image.length > 0 ? (
            <div
              className={styles.messageBubbleImg}
              style={{ backgroundImage: `url('${message.image}')` }}
            />
          ) : (
            <></>
          )}
          {/* For messages not sent by the current user */}
          <div className={styles.messageTxt}>
            <Image
              className={styles["chat-bubble__left"]}
              src={`${message.avatar ?? "/user.png"}`}
              alt="user avatar"
              width={50}
              height={50}
            />
            <div className={styles["chat-bubble__right"]}>
              <p className={styles["user-name"]}>{message.name}</p>
              <p className={styles["user-message"]}>{message.text}</p>
            </div>
          </div>
          {/* Div showing time */}
          <div className={styles.time}>
            <span>{time}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Message;
