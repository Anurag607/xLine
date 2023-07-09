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
  const [user] = useAuthState(auth);
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

  const getUserList = () => {
    try {
      const qUsers = query(collection(db, "users"), orderBy("name"));

      const getUsers = onSnapshot(qUsers, (QuerySnapshot) => {
        let users: any[] = [];
        QuerySnapshot.forEach((doc) => {
          users.push({ ...doc.data(), id: doc.id });
        });
        Cookies.set("usersList", JSON.stringify(users));
        setUsersList(users);
      });

      getUsers;
    } catch (err) {
      console.error(err);
    }
  };

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
        Cookies.set("currentGroup", JSON.stringify(delta));
      }
      window.location.reload();
    } catch (err) {
      console.error(err);
    }
  };

  const updateAdminList = async (newadminList: string[]) => {
    try {
      const docRef = doc(
        db,
        "chatRooms",
        JSON.parse(Cookies.get("currentGroup")).id
      );
      const docSnap = await getDoc(docRef);
      let data = docSnap.data();
      await updateDoc(docRef, {
        admin: [...new Set([...data?.admin.split(","), ...newadminList])].join(
          ","
        ),
      });
      let delta = JSON.parse(Cookies.get("currentGroup"));
      delta.admin = [
        ...new Set([...data?.admin.split(","), ...newadminList]),
      ].join(",");
      setAdmins([...new Set([...data?.admin.split(","), ...newadminList])]);
      Cookies.set("currentGroup", JSON.stringify(delta));
      window.location.reload();
    } catch (err) {
      console.error(err);
    }
  };

  const func = () => {
    const q = query(collection(db, "users"));
    let users: any[] = [];
    const getUsers = onSnapshot(q, (querySnapshot) => {
      querySnapshot.forEach((doc) => {
        let temp = doc.data();
        users.push(temp.uid);
      });
      console.log(users.join(","));
    });
    getUsers;
  };

  useEffect(() => {
    getUserList();
    // func();
  }, []);

  return (
    <div className={`${styles.addeduserList} addeduserList`}>
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
                  if (!admins.includes(user?.uid)) return;
                  if (el.uid === user?.uid) return;
                  const target: HTMLDivElement = event.currentTarget;
                  const allusers = document.querySelectorAll(".admittedUsers");
                  const modal = document.querySelectorAll(".modal");
                  let currentIndex = [
                    ...target.parentElement!.parentElement!.children,
                  ].indexOf(target.parentElement!);
                  let currUser = allusers[currentIndex] as HTMLDivElement;
                  modal.forEach((el, index) => {
                    (el as HTMLFormElement).style.display = "none";
                  });
                  allusers.forEach((user, index) => {
                    if (index !== currentIndex)
                      (user as HTMLDivElement).dataset.status = "not-selected";
                    if (index !== currentIndex)
                      (
                        allusers[index].children[0] as HTMLDivElement
                      ).style.paddingBottom = "0rem";
                  });
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
                  src={el.avatar ? el.avatar : "/user.png"}
                  alt={"profilePic"}
                  width={28}
                  height={28}
                />
                <div className={styles.details}>
                  <span className={styles.name}>{`${el.name}`}</span>
                  <span className={styles.email}>{`${el.email}`}</span>
                </div>
              </div>
              <form
                className={`${styles.modal} modal`}
                onSubmit={(event) => {
                  event.preventDefault();
                  const remove = document.querySelector(
                    "#remove"
                  ) as HTMLInputElement;
                  const admin = document.querySelector(
                    "#admin"
                  ) as HTMLInputElement;
                  if (admin.checked) {
                    let newList = [
                      ...admins,
                      JSON.parse(Cookies.get("selectedUser")).uid,
                    ];
                    updateAdminList(newList);
                  }
                  if (remove.checked) {
                    removeUser();
                  }
                }}
              >
                <span>
                  <label htmlFor="admin" className={styles.adminLabel}>
                    Assign User as Admin
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
