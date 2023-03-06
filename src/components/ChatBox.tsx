import React, { useEffect, useRef, useState } from "react";
import {
  query,
  collection,
  orderBy,
  onSnapshot,
  where,
} from "firebase/firestore";
import { db, auth } from "../../firebase/clientApp";
import Message from "./Message";
import SendMessage from "./SendMessage";
import styles from "../styles/chatBox.module.scss";
import { useAuthState } from "react-firebase-hooks/auth";
import Cookies from "js-cookie";
import { Sidebar } from "../components/sidebar";

const ChatBox = () => {
  const [messages, setMessages] = useState<any>([]);
  const scroll = useRef<any>(null);
  const [currentGroup, setCurrentGroup] = useState<string>(
    Cookies.get("currentGroup") || ""
  );
  const [user] = useAuthState(auth);

  useEffect(() => {
    const messagesCont: HTMLElement = document.querySelector(".messages")!;
    let el = messagesCont.children[
      messagesCont.childElementCount - 2
    ] as HTMLDivElement;
    if (el !== undefined)
      el.scrollIntoView({
        block: "start",
        inline: "nearest",
        behavior: "smooth",
      });
  }, [messages]); //eslint-disable-line

  useEffect(() => {
    if (!user || currentGroup.length === 0) {
      window.location.reload();
      return;
    }

    try {
      const qMsgs = query(
        collection(db, "messages"),
        where("room", "==", JSON.parse(Cookies.get("currentGroup")).id),
        orderBy("createdAt")
      );

      const getMessages = onSnapshot(qMsgs, (QuerySnapshot) => {
        let messages: any[] = [];
        QuerySnapshot.forEach((doc) => {
          messages.push({ ...doc.data(), id: doc.id });
        });
        setMessages(messages);
      });

      getMessages;
    } catch (err) {
      console.error(err);
    }
  }, [user]); // eslint-disable-line

  return (
    <main className={styles["chat-box"]}>
      <div className={styles["chat-body"]}>
        <Sidebar />
        <section
          className={`${styles["messages-wrapper"]} messages`}
          id={"messages-wrapper"}
        >
          {messages.map((message: any, index: number) => {
            let dateTime =
              message.createdAt !== null
                ? message.createdAt.toDate()
                : new Date();
            let months = [
              "Jan",
              "Feb",
              "Mar",
              "Apr",
              "May",
              "Jun",
              "July",
              "Aug",
              "Sep",
              "Oct",
              "Nov",
              "Dec",
            ];
            let day = dateTime.getDate();
            let month = dateTime.getMonth();
            let year = dateTime.getFullYear();
            switch (day[1]) {
              case "1": {
                day += "st";
                break;
              }
              case "2": {
                day += "nd";
                break;
              }
              case "3": {
                day += "rd";
                break;
              }
              default: {
                day += "th";
                break;
              }
            }
            let currentDate = `${day} ${months[month]} ${year}`;
            let date = Cookies.get("currentDate");
            if (date !== currentDate) {
              Cookies.set("currentDate", currentDate);
              return (
                <div key={message.id}>
                  <div className={styles.dateContainer}>
                    <span>{currentDate}</span>
                  </div>
                  <Message key={message.id} message={message} index={index} />
                </div>
              );
            } else {
              return (
                <Message key={message.id} message={message} index={index} />
              );
            }
          })}
          <div className={`${styles.scrollSpan} scrollSpan`} ref={scroll} />
        </section>
      </div>
      <SendMessage scroll={scroll} />
    </main>
  );
};

export default ChatBox;
