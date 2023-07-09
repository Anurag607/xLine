import React, { useState } from "react";
import styles from "./addUser.module.scss";
import Image from "next/image";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { db, auth } from "../../../firebase/clientApp";
import Cookies from "js-cookie";
import { useAuthState } from "react-firebase-hooks/auth";
import { PersonAdd } from "@mui/icons-material";

const AddUsers: React.FC<{ class: string }> = (props) => {
  const [user] = useAuthState(auth);
  const [addUserBtnState, setAddUserBtnState] = useState<string>(
    Cookies.get("addUserState") !== undefined
      ? Cookies.get("addUserState")
      : "collapsed"
  );
  const [updateUsers, setUpdateUsers] = useState<any[]>([user?.uid]);
  const [admittedUsers, setAdmittedUsers] = useState<any[]>(
    Cookies.get("currentGroup") !== undefined
      ? JSON.parse(Cookies.get("currentGroup")).users.split(",")
      : [user?.uid]
  );
  const [usersList, setUsersList] = useState<any[]>(
    typeof Cookies.get("usersList") !== "undefined"
      ? JSON.parse(Cookies.get("usersList"))
      : []
  );
  const styling = {
    warningGroup: React.useRef<HTMLInputElement>(null),
    warningUser: React.useRef<HTMLInputElement>(null),
  };

  // Function for Updating user list...
  const updateUserList = async () => {
    try {
      const docRef = doc(
        db,
        "chatRooms",
        JSON.parse(Cookies.get("currentGroup")).id
      );
      const docSnap = await getDoc(docRef);
      let data = docSnap.data();
      await updateDoc(docRef, {
        users: [...new Set([...data?.users.split(","), ...updateUsers])].join(
          ","
        ),
      });
      let delta = JSON.parse(Cookies.get("currentGroup"));
      delta.users = [
        ...new Set([...data?.users.split(","), ...updateUsers]),
      ].join(",");
      Cookies.set("currentGroup", JSON.stringify(delta));
      window.location.reload();
    } catch (err) {
      console.error(err);
    }
  };

  // Function for handling form submit...
  const handleSubmit = (event: React.MouseEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (
      !JSON.parse(Cookies.get("currentGroup"))
        .admin.split(",")
        .includes(user?.uid)
    ) {
      styling.warningUser.current!.style.display = "block";
      styling.warningUser.current!.innerHTML = "Only the admin can add Users";
    } else if (updateUsers.length < 2) {
      styling.warningUser.current!.style.display = "block";
    } else {
      styling.warningUser.current!.style.display = "none";
      const target: HTMLButtonElement =
        document.querySelector(".addUserButton")!;
      const users = document.querySelectorAll(".users");
      users.forEach((el, i: number) => {
        let target = el as HTMLDivElement;
        target.dataset.status = "not-added";
        target.style.outlineColor = "transparent";
        target.style.borderColor = "transparent";
      });
      const userList: HTMLFormElement = event.currentTarget;
      userList.style.opacity = "0";
      setTimeout(() => {
        userList.style.height = "0rem";
        userList.style.display = "none";
      }, 300);
      setTimeout(() => {
        styling.warningUser.current!.style.display = "none";
      }, 200);
      target.dataset.toggle = "collapsed";
      styling.warningUser.current!.style.display = "none";
      setAddUserBtnState("collapsed");
      Cookies.set("addUserState", target.dataset.toggle);
      updateUserList();
    }
  };

  // Function for handling user addition...
  const handleAddUser = (event: React.MouseEvent<HTMLButtonElement>) => {
    const target: HTMLButtonElement = event.currentTarget;
    const userList: HTMLFormElement = document.querySelector(
      `${props.class === "burger" ? ".bg-userList" : ".userList"}`
    )!;

    if (target.dataset.toggle === "collapsed") {
      userList.style.display = "flex";
      userList.style.height = "auto";
      setTimeout(() => {
        userList.style.opacity = "1";
      }, 100);
      target.dataset.toggle = "expanded";
      setAddUserBtnState("expanded");
      Cookies.set("addUserState", target.dataset.toggle);
    } else {
      userList.style.opacity = "0";
      setTimeout(() => {
        userList.style.height = "0rem";
        userList.style.display = "none";
      }, 300);
      setTimeout(() => {
        styling.warningUser.current!.style.display = "none";
      }, 200);
      target.dataset.toggle = "collapsed";
      setAddUserBtnState("collapsed");
      Cookies.set("addUserState", target.dataset.toggle);
    }
  };

  // Function for handling user selection...
  const handleSelectUser = (
    event: React.MouseEvent<HTMLDivElement>,
    i: number
  ) => {
    const target: HTMLDivElement = event.currentTarget;
    if (target.dataset.status === "not-added") {
      target.dataset.status = "added";
      target.style.outlineColor = "rgba(0,0,0,0.5)";
      target.style.borderColor = "var(--primary-light)";
      let newList = [
        ...updateUsers,
        JSON.parse(target.dataset.details as string).uid,
      ];
      setUpdateUsers(newList);
    } else if (target.dataset.status === "added") {
      target.dataset.status = "not-added";
      target.style.outlineColor = "transparent";
      target.style.borderColor = "transparent";
      let newList = updateUsers;
      let index = 0;
      let id = JSON.parse(target.dataset.details as string).id;
      newList.forEach((el, i) => {
        if (el.id === id) index = i;
      });
      newList.splice(i, 1);
      setUpdateUsers(newList);
    }
  };

  // Redering components here...
  return (
    <div className={styles.addUsers}>
      {(
        Cookies.get("currentGroup") !== undefined
          ? JSON.parse(Cookies.get("currentGroup"))
              .admin.split(",")
              .includes(user?.uid)
          : ""
      ) ? (
        <>
          <button
            className={`${styles.addUserButton} addUserButton`}
            data-toggle={addUserBtnState}
            onClick={handleAddUser}
          >
            Add Users
            <PersonAdd />
          </button>
          <form
            className={`${styles.userList} ${
              props.class === "burger" ? "bg-userList" : "userList"
            }`}
            onSubmit={handleSubmit}
          >
            <span className={styles.warning} ref={styling.warningUser}>
              Add at least one User
            </span>
            {usersList.map((el, i) => {
              if (el.uid !== user?.uid && !admittedUsers.includes(el.uid)) {
                return (
                  <div
                    className={`${styles.users} users`}
                    key={i}
                    data-status="not-added"
                    data-details={JSON.stringify(el)}
                    style={{
                      outlineColor: `${
                        admittedUsers.includes(el.uid)
                          ? "rgba(0,0,0,0.5)"
                          : "transparent"
                      }}`,
                      borderColor: `${
                        admittedUsers.includes(el.uid)
                          ? "var(--primary-light)"
                          : "transparent"
                      }}`,
                    }}
                    onClick={(event) => {
                      handleSelectUser(event, i);
                    }}
                  >
                    <Image
                      className={styles.profilePic}
                      src={el.avatar ? el.avatar : "/user.png"}
                      alt={"profilePic"}
                      width={28}
                      height={28}
                    />
                    <div className={styles.details}>
                      <span className={styles.name}>{`+ ${el.name}`}</span>
                      <span className={styles.email}>{`${el.email}`}</span>
                    </div>
                  </div>
                );
              }
            })}
            <input
              type="submit"
              className={styles.addUserBtn}
              value="Add Users"
            />
          </form>
        </>
      ) : (
        <></>
      )}
    </div>
  );
};

export default AddUsers;
