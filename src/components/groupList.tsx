import React, { useEffect, useState } from "react";
import { query, collection, orderBy, onSnapshot } from "firebase/firestore";
import Cookies from "js-cookie";
import { useAuthState } from "react-firebase-hooks/auth";
import { db, auth } from "../../firebase/clientApp";
import { useRouter } from "next/navigation";
import styles from "../styles/groupList.module.scss";

const GroupList = () => {
  const router = useRouter();
  const [groups, setGroups] = useState<any[]>(
    typeof Cookies.get("groupList") !== "undefined"
      ? JSON.parse(Cookies.get("groupList"))
      : []
  );
  const [currentGroup, setCurrentGroup] = useState<string>(
    Cookies.get("currentGroup") || ""
  );
  const [user] = useAuthState(auth);

  const getGroupsForUser = () => {
    try {
      const qGrps = query(collection(db, "chatRooms"), orderBy("createdAt"));

      const getGroups = onSnapshot(qGrps, (QuerySnapshot) => {
        let groups: any[] = [];
        QuerySnapshot.forEach((doc) => {
          let data = { ...doc.data(), id: doc.id } as any;
          let allowedUsers = data.users.split(",");
          if (user?.uid !== undefined && allowedUsers.includes(user.uid)) {
            groups.push(data);
            if (
              data.name.toLowerCase() === "common" &&
              (Cookies.get("currentGroup") === null ||
                Cookies.get("currentGroup") === undefined)
            ) {
              Cookies.set("currentGroup", JSON.stringify(data));
            }
          }
        });
        if (groups.length === 0) window.location.reload();
        if (
          Cookies.get("currentGroup") === null ||
          (Cookies.get("currentGroup") === undefined && groups[0] !== undefined)
        )
          Cookies.set("currentGroup", groups[0].id);
        Cookies.set("groupList", JSON.stringify(groups));
        setGroups(groups);
      });

      getGroups;
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getGroupsForUser();
  }, []);

  return (
    <div className={styles.groups}>
      {groups.map((el, i) => {
        return (
          <button
            className={styles.group}
            style={{
              backgroundColor:
                JSON.parse(Cookies.get("currentGroup")).id == el.id
                  ? "#f2c335"
                  : "var(--secondary)",
            }}
            key={i}
            data-details={JSON.stringify(el)}
            onClick={(event) => {
              Cookies.set(
                "currentGroup",
                (event.target as HTMLButtonElement).dataset.details
              );
              setCurrentGroup(
                (event.target as HTMLButtonElement).dataset.details!
              );
              window.location.reload();
            }}
          >{`${el.name} >`}</button>
        );
      })}
    </div>
  );
};

export default GroupList;
