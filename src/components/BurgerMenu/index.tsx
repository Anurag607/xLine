import React, { useEffect, useState } from "react";
import styles from "./burgerMenu.module.scss";
import { Menu } from "../../scripts/burger";
import Cookies from "js-cookie";
import {
  query,
  collection,
  orderBy,
  onSnapshot,
  where,
} from "firebase/firestore";
import { db, auth } from "../../../firebase/clientApp";
import { useAuthState } from "react-firebase-hooks/auth";
import { Sidebar } from "../Sidebar";

const Burger = () => {
  // Defining states here...
  const [burgerState, setBurgerState] = React.useState("close");
  const [messages, setMessages] = useState<any>([]);
  const [user] = useAuthState(auth);

  // Function for getting messages for current group...
  useEffect(() => {
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
      });

      getMessages;
    } catch (err) {
      console.error(err);
    }
  }, [user]); // eslint-disable-line

  // Rendering components here...
  return (
    <div className={`${styles.burgerWrapper} burgerWrapper`}>
      <div
        className={`${styles.menu1} menu1`}
        data-toggle={burgerState}
        onClick={(event) => {
          if (burgerState === "open") setBurgerState("close");
          if (burgerState === "close") setBurgerState("open");
          Menu();
        }}
      >
        <div className={`${styles.menuBarCont} menuBarCont`}>
          <span className={`${styles["menu_bar1"]} menu_bar1`} />
          <span className={`${styles["menu_bar2"]} menu_bar2`} />
          <span className={`${styles["menu_bar3"]} menu_bar3`} />
        </div>
      </div>
      {window.innerWidth < 1100 ? <Sidebar class="burger" /> : <></>}
    </div>
  );
};

export default Burger;
