import React, { useState } from "react";
import styles from "./createGroup.module.scss";
import Image from "next/image";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db, auth } from "../../../firebase/clientApp";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useAuthState } from "react-firebase-hooks/auth";
import { GroupAdd } from "@mui/icons-material";

// Function for Creating Groups...
const CreateGroup = (props: { class: string }) => {
  // Getting the current user session...
  const [user] = useAuthState(auth);

  // Defining states variables...
  const [groupName, setGroupName] = useState<string>("");
  const [usersList, setUsersList] = useState<any[]>(
    typeof Cookies.get("usersList") !== "undefined"
      ? JSON.parse(Cookies.get("usersList"))
      : []
  );
  const [addGrpBtnState, setAddGrpBtnState] = useState<string>(
    Cookies.get("addGrpState") !== undefined
      ? Cookies.get("addGrpState")
      : "collapsed"
  );
  const [addUsers, setAddUsers] = useState<any[]>([user?.uid]);

  // Setting the router instance...
  const router = useRouter();

  // Defining the ref variables for styling...
  const styling = {
    warningGroup: React.useRef<HTMLInputElement>(null),
    warningUser: React.useRef<HTMLInputElement>(null),
  };

  // Function for Registering Groups in DB...
  const registerChatRoom = async () => {
    try {
      await addDoc(collection(db, "chatRooms"), {
        name: groupName,
        admin: user?.uid,
        users: addUsers.join(","),
        createdAt: serverTimestamp(),
      });
      setAddUsers([user?.uid]);
      window.location.reload();
    } catch (err: any) {
      console.error(err);
      alert(err.message);
    }
  };

  // Function for handling form submit...
  const submitHandler = (event: React.MouseEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (groupName.length >= 4) {
      styling.warningGroup.current!.style.display = "none";
      const target: HTMLButtonElement =
        document.querySelector(".addGroupButton")!;
      const users = document.querySelectorAll(".grp-users");
      users.forEach((el, i: number) => {
        let target = el as HTMLDivElement;
        target.dataset.status = "not-added";
        target.style.outlineColor = "transparent";
        target.style.borderColor = "transparent";
      });
      const formCont: HTMLFormElement = event.currentTarget;
      formCont.style.opacity = "0";
      setTimeout(() => {
        formCont.style.height = "0rem";
        formCont.style.display = "none";
      }, 300);
      setTimeout(() => {
        styling.warningGroup.current!.style.display = "none";
      }, 200);
      target.dataset.toggle = "collapsed";
      styling.warningGroup.current!.style.display = "none";
      setAddGrpBtnState("collapsed");
      Cookies.set("addGrpState", target.dataset.toggle);
      registerChatRoom();
    } else {
      styling.warningGroup.current!.style.display = "block";
    }
  };

  // Function for Selecting Users for addition to the group ...
  const handleAddUser = (
    event: React.MouseEvent<HTMLDivElement>,
    i: number
  ) => {
    // Getting the current target element...
    const target: HTMLDivElement = event.currentTarget;
    // Checking if the user is already seelcted or not: if selected reset the selected status else add the selected status to user...
    if (
      target.dataset.status === "not-added" &&
      target.textContent !== `+ ${user?.displayName}`
    ) {
      target.dataset.status = "added";
      target.style.outlineColor = "rgba(0,0,0,0.5)";
      target.style.borderColor = "var(--primary-light)";
      let newList = [
        ...addUsers,
        JSON.parse(target.dataset.details as string).uid,
      ];
      setAddUsers(newList);
    } else if (
      target.dataset.status === "added" &&
      target.textContent !== `+ ${user?.displayName}`
    ) {
      target.dataset.status = "not-added";
      target.style.outlineColor = "transparent";
      target.style.borderColor = "transparent";
      let newList = addUsers;
      let index = 0;
      let id = JSON.parse(target.dataset.details as string).id;
      newList.forEach((el, i) => {
        if (el.id === id) index = i;
      });
      newList.splice(i, 1);
      setAddUsers(newList);
    }
  };

  // Function for handling group addition...
  const handleAddGrp = (event: React.MouseEvent<HTMLButtonElement>) => {
    const target: HTMLButtonElement = event.currentTarget;
    const formCont: HTMLFormElement = document.querySelector(
      `${props.class === "burger" ? ".bg-formCont" : ".formCont"}`
    )!;
    if (target.dataset.toggle === "collapsed") {
      formCont.style.display = "flex";
      formCont.style.height = "auto";
      setTimeout(() => {
        formCont.style.opacity = "1";
      }, 100);
      target.dataset.toggle = "expanded";
      setAddGrpBtnState("expanded");
      Cookies.set("addGrpState", target.dataset.toggle);
    } else {
      formCont.style.opacity = "0";
      setTimeout(() => {
        formCont.style.height = "0rem";
        formCont.style.display = "none";
      }, 300);
      setTimeout(() => {
        styling.warningGroup.current!.style.display = "none";
      }, 200);
      target.dataset.toggle = "collapsed";
      setAddGrpBtnState("collapsed");
      Cookies.set("addGrpState", target.dataset.toggle);
    }
  };

  // Redering components here...
  return (
    <div className={styles.createGroup}>
      {/* Toggle Button */}
      <button
        className={`${styles.addGroupButton} addGroupButton`}
        data-toggle={addGrpBtnState}
        onClick={handleAddGrp}
      >
        Add Group
        <GroupAdd />
      </button>
      {/* Form... */}
      <form
        className={`${styles.formCont} ${
          props.class === "burger" ? "bg-formCont" : "formCont"
        }`}
        onSubmit={submitHandler}
      >
        {/* Warning! */}
        <span className={styles.warning} ref={styling.warningGroup}>
          Group name must be at least 4 characters long
        </span>
        {/* Group name input field */}
        <input
          type="text"
          className={styles.grpName}
          placeholder="Enter Group Name..."
          value={groupName}
          minLength={4}
          onChange={(event) => setGroupName(event.target.value)}
        />
        {/* Listing all available users */}
        {usersList.map((el, i) => {
          if (el.uid !== user?.uid) {
            return (
              <div
                className={`${styles.users} grp-users`}
                key={i}
                data-status="not-added"
                data-details={JSON.stringify(el)}
                onClick={(event) => {
                  handleAddUser(event, i);
                }}
              >
                <Image
                  className={styles.profilePic}
                  src={el.avatar ?? "/user.png"}
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
        {/* Submit button */}
        <input
          type="submit"
          className={styles.createGrpBtn}
          value="Create Group"
        />
      </form>
    </div>
  );
};

export default CreateGroup;
