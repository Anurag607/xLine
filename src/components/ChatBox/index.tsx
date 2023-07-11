import React, { useEffect, useRef, useState } from "react";
import {
  query,
  collection,
  orderBy,
  onSnapshot,
  where,
  getDocs,
} from "firebase/firestore";
import { db, auth } from "../../../firebase/clientApp";
import Message from "../Message";
import SendMessage from "../SendMessage";
import styles from "./chatBox.module.scss";
import { useAuthState } from "react-firebase-hooks/auth";
import Cookies from "js-cookie";
import { Sidebar } from "../Sidebar";
import { messageType } from "@/utils/types";

const ChatBox = () => {
  // Defining state variables here...
  const [messages, setMessages] = useState<messageType[]>([]);
  const scroll = useRef<any>(null);
  const [currentGroup, setCurrentGroup] = useState<string>(
    Cookies.get("currentGroup") || ""
  );
  const [user] = useAuthState(auth);
  const [bgImage, setBgImage] = useState<string>(Cookies.get("bgImage" || ""));

  // Function for getting background pic
  const getBgImage = async () => {
    const q = query(collection(db, "users"), where("uid", "==", user?.uid));
    const querySnapshot = await getDocs(q);
    let userData: any = {};
    querySnapshot.forEach((doc) => {
      userData = doc.data();
    });
    Cookies.set(userData.bg);
    setBgImage(userData.bg);
  };

  // Function for getting background images for current group...
  useEffect(() => {
    getBgImage();
  }, []);

  // Function for scrolling into view the most recent message...
  const scrollToMessage = () => {
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
  };

  // Function for getting messages for current group...
  const getMessageData = () => {
    try {
      const qMsgs = query(
        collection(db, "messages"),
        where(
          "room",
          "==",
          JSON.parse(Cookies.get("currentGroup") || "{id=''}").id
        ),
        orderBy("createdAt")
      );

      const getMessages = onSnapshot(qMsgs, (QuerySnapshot) => {
        let messages: any[] = [];
        QuerySnapshot.forEach((doc) => {
          messages.push({ ...doc.data(), id: doc.id });
        });
        setMessages(messages);
        scrollToMessage();
      });

      getMessages;
    } catch (err) {
      console.error(err);
    }
  };

  // Function for getting latest messages for current group...
  useEffect(() => {
    getMessageData();
    scrollToMessage();
  }, []);

  // Funtion for scrolling to the most recent message...
  useEffect(() => {
    scrollToMessage();
  }, [messages]);

  // Rendering components here...
  return (
    <main className={styles["chat-box"]}>
      <div className={styles["chat-body"]}>
        <Sidebar class="main" />
        <section
          className={`${styles["messages-wrapper"]} messages`}
          id={"messages-wrapper"}
          style={{
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.677), rgba(0, 0, 0, 0.65)), url('${
              bgImage && bgImage.length > 0 ? bgImage : "/116.jpg"
            }')`,
          }}
        >
          {/* Listing all messages here */}
          {messages.map((message: any, index: number) => {
            // Getting date here...
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

            // Rendering messages here...
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

          {/* Scroll span for scrolling to the latest message */}
          <div className={`${styles.scrollSpan} scrollSpan`} ref={scroll} />
        </section>
      </div>

      {/* Input field for sending messages */}
      <SendMessage scroll={scroll} />
    </main>
  );
};

export default ChatBox;
