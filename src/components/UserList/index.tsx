import React, { useEffect, useState } from "react";
import {
  query,
  doc,
  collection,
  orderBy,
  onSnapshot,
  updateDoc,
  getDoc,
} from "firebase/firestore";
import { db, auth } from "../../../firebase/clientApp";
import Cookies from "js-cookie";
import styles from "./userList.module.scss";
import { useAuthState } from "react-firebase-hooks/auth";
import Image from "next/image";

const UserList = () => {
  // Getting the current user session...
  const [user] = useAuthState(auth);

  // Defining the state variables...
  const [usersList, setUsersList] = useState<any[]>(
    typeof Cookies.get("usersList") !== "undefined"
      ? JSON.parse(Cookies.get("usersList"))
      : []
  );
  const [admittedUsers, setAdmittedUsers] = useState<any[]>(
    Cookies.get("currentGroup") !== undefined
      ? JSON.parse(Cookies.get("currentGroup")).users.split(",")
      : [user?.uid]
  );
  const [admins, setAdmins] = useState<any[]>(
    Cookies.get("currentGroup") !== undefined
      ? JSON.parse(Cookies.get("currentGroup")).admin.split(",")
      : [""]
  );

  // Function to get the list of users...
  const getUserList = () => {
    try {
      const qUsers = query(collection(db, "users"), orderBy("name"));
      let users: any[] = [];

      const getUsers = onSnapshot(qUsers, (QuerySnapshot) => {
        QuerySnapshot.forEach((doc) => {
          users.push({ ...doc.data(), id: doc.id });
        });
        setUsersList(users);
      });

      getUsers;
    } catch (err) {
      console.error(err);
    }
  };

  React.useEffect(() => {
    if (usersList.length > 0)
      Cookies.set("usersList", JSON.stringify(usersList));
  }, [usersList]);

  // Function to remove a user from the group...
  const removeUser = async () => {
    try {
      const docRef = doc(
        db,
        "chatRooms",
        JSON.parse(Cookies.get("currentGroup")).id
      );
      const docSnap = await getDoc(docRef);
      let data = docSnap.data();
      let existingUsers = data?.users.split(",");
      let id = JSON.parse(Cookies.get("selectedUser")).uid;
      existingUsers = existingUsers.filter((uid: string) => uid !== id);
      await updateDoc(docRef, {
        users: existingUsers.join(","),
      });
      setUsersList(usersList.filter((el) => el.uid !== id));
      let delta = JSON.parse(Cookies.get("currentGroup"));
      delta.users = existingUsers.join(",");
      Cookies.set("currentGroup", JSON.stringify(delta));
      if (admins.includes(id)) {
        let newAdminList = data?.admin.split(",");
        newAdminList = newAdminList.filter((uid: string) => uid !== id);
        console.log(newAdminList);
        await updateDoc(docRef, {
          admin: newAdminList.join(","),
        });
        let delta = JSON.parse(Cookies.get("currentGroup"));
        delta.admin = newAdminList.join(",");
        setAdmins(newAdminList);
        Cookies.set("currentGroup", JSON.stringify(delta));
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Function to update the admin list...
  const updateAdminList = async (newadminList: string[]) => {
    try {
      const docRef = doc(
        db,
        "chatRooms",
        JSON.parse(Cookies.get("currentGroup")).id
      );
      await updateDoc(docRef, {
        admin: [...new Set([...newadminList])].join(","),
      });
      let delta = JSON.parse(Cookies.get("currentGroup"));
      delta.admin = [...new Set([...newadminList])].join(",");
      setAdmins([...new Set([...newadminList])]);
      Cookies.set("currentGroup", JSON.stringify(delta));
    } catch (err) {
      console.error(err);
    }
  };

  // Function for getting userlist on component mount...
  useEffect(() => {
    getUserList();
  }, []);

  // Returning the JSX...
  return (
    <div className={`${styles.addeduserList} addeduserList`}>
      {/* Listing the users admitted in the current group */}
      {usersList.map((el, i) => {
        if (admittedUsers.includes(el.uid)) {
          return (
            <div
              className={`${styles.users} admittedUsers`}
              key={i}
              data-status="not-selected"
              data-details={JSON.stringify(el)}
            >
              <div
                className={`${styles.infoContainer} adduser-infoContainer`}
                onClick={(event) => {
                  // Checking if the user is an admin...
                  if (!admins.includes(user?.uid)) return;
                  // Checking if the user is the current user...
                  if (el.uid === user?.uid) return;

                  // Getting the target element for opening the modal form for further actions...
                  const target: HTMLDivElement = event.currentTarget;
                  const allusers = document.querySelectorAll(".admittedUsers");
                  const modal = document.querySelectorAll(".modal");
                  let currentIndex = [
                    ...target.parentElement!.parentElement!.children,
                  ].indexOf(target.parentElement!);

                  // Getting the current user element...
                  let currUser = allusers[currentIndex] as HTMLDivElement;
                  modal.forEach((el, index) => {
                    (el as HTMLFormElement).style.display = "none";
                  });

                  // Resetting the state of all the unselected users...
                  allusers.forEach((user, index) => {
                    if (index !== currentIndex)
                      (user as HTMLDivElement).dataset.status = "not-selected";
                    if (index !== currentIndex)
                      (
                        allusers[index].children[0] as HTMLDivElement
                      ).style.paddingBottom = "0rem";
                  });

                  // Checking if the user is selected or not and opening the modal form accordingly...
                  // Also setting the selected user in the cookies...
                  if (currUser.dataset.status === "not-selected") {
                    target.style.paddingBottom = "1rem";
                    currUser.dataset.status = "selected";
                    (modal[currentIndex] as HTMLFormElement).style.display =
                      "flex";
                    Cookies.set("selectedUser", currUser.dataset.details);
                  } else if (currUser.dataset.status === "selected") {
                    target.style.paddingBottom = "0rem";
                    currUser.dataset.status = "not-selected";
                    (modal[currentIndex] as HTMLFormElement).style.display =
                      "none";
                    Cookies.remove("selectedUser");
                  }
                }}
              >
                {/* Checking to see if user is admin or not and indicate as such */}
                {admins.includes(el.uid) ? (
                  <Image
                    className={styles.adminSymbol}
                    src="/crown.png"
                    alt={"admin"}
                    width={5}
                    height={5}
                  />
                ) : (
                  <></>
                )}
                <Image
                  className={styles.profilePic}
                  src={el.avatar ?? "/user.png"}
                  alt={"profilePic"}
                  width={28}
                  height={28}
                />
                <div className={styles.details}>
                  <span className={styles.name}>{`${el.name}`}</span>
                  <span className={styles.email}>{`${el.email}`}</span>
                </div>
              </div>
              {/* Form for removing a user or making a user an admin */}
              <form
                className={`${styles.modal} modal`}
                onSubmit={(event: React.MouseEvent<HTMLFormElement>) => {
                  event.preventDefault();
                  const remove = document.querySelector(
                    "#remove"
                  ) as HTMLInputElement;
                  const admin = document.querySelector(
                    "#admin"
                  ) as HTMLInputElement;
                  if (admin.checked) {
                    let newList = [];
                    if (admins.includes(el.uid)) {
                      newList = admins.filter((user) => user !== el.uid);
                      updateAdminList(newList);
                    } else {
                      newList = [...admins, el.uid];
                      updateAdminList(newList);
                    }
                  }
                  if (remove.checked) {
                    removeUser();
                  }
                  (event.target as HTMLFormElement).reset();
                }}
              >
                <span>
                  <label htmlFor="admin" className={styles.adminLabel}>
                    {admins.includes(el.uid)
                      ? "Remove User as Admin"
                      : "Assign User as Admin"}
                  </label>
                  <input
                    type="checkbox"
                    id="admin"
                    name="admin"
                    className={`${styles.admin} admin checkbox`}
                    onClick={(event) => {
                      const boxes = document.querySelectorAll(".checkbox");
                      boxes.forEach((el, index) => {
                        if (index !== [...boxes].indexOf(event.currentTarget))
                          (el as HTMLInputElement).checked = false;
                      });
                      (
                        document.querySelector("#admin") as HTMLInputElement
                      ).checked = true;
                    }}
                  />
                </span>
                <span>
                  <label htmlFor="remove" className={styles.removeLabel}>
                    Remove User
                  </label>
                  <input
                    type="checkbox"
                    id="remove"
                    name="remove"
                    className={`${styles.remove} remove checkbox`}
                    onClick={(event) => {
                      const boxes = document.querySelectorAll(".checkbox");
                      boxes.forEach((el, index) => {
                        if (index !== [...boxes].indexOf(event.currentTarget))
                          (el as HTMLInputElement).checked = false;
                      });
                      (
                        document.querySelector("#remove") as HTMLInputElement
                      ).checked = true;
                    }}
                  />
                </span>
                <input
                  type="submit"
                  value={"Done"}
                  className={styles.doneBtn}
                />
              </form>
            </div>
          );
        }
      })}
    </div>
  );
};

export default UserList;
