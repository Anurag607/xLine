import React, { useEffect, useState } from "react";
import { groupType } from "@/utils/types";
import { query, collection, orderBy, onSnapshot } from "firebase/firestore";
import Cookies from "js-cookie";
import { useAuthState } from "react-firebase-hooks/auth";
import { db, auth } from "../../../firebase/clientApp";
import styles from "./groupList.module.scss";
import { useRouter } from "next/navigation";

const GroupList = () => {
  // Defining states vaiables...
  const [groups, setGroups] = useState<any[]>(
    typeof Cookies.get("groupList") !== "undefined"
      ? JSON.parse(Cookies.get("groupList"))
      : []
  );

  // Getting current user session...
  const [user] = useAuthState(auth);

  // Getting router object...
  const router = useRouter();

  // Function for getting groups for current user...
  const getGroupsForUser = () => {
    try {
      const qGrps = query(collection(db, "chatRooms"), orderBy("createdAt"));

      const getGroups = onSnapshot(qGrps, (QuerySnapshot) => {
        let groups: groupType[] = [];
        // Iterating through all groups...
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
        // In case no group is found for current user, reload the page...
        if (groups.length === 0) window.location.reload();
        // Setting current group to first group in the list...
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

  // Getting groups for current user on component mount...
  useEffect(() => {
    getGroupsForUser();
  }, []);

  // Returning JSX...
  return (
    <div className={styles.groups}>
      {/* Rendering the list of groups for the current user */}
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
              window.location.reload();
            }}
          >{`${el.name} >`}</button>
        );
      })}
    </div>
  );
};

export default GroupList;
