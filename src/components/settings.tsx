import React from "react";
import uploadImage from "../scripts/imgUpload";
import styles from "../styles/settings.module.scss";
import Cookie from "js-cookie";
import { AddAPhoto, AddPhotoAlternate } from "@mui/icons-material";
import CreateGroup from "./createGroup";
import AddUsers from "./addUsers";
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { db, auth } from "../../firebase/clientApp";
import { useAuthState } from "react-firebase-hooks/auth";

// Function Component for Loader...
const Loader = () => {
  return (
    <div className={`${styles["settingsLoader"]} settingsLoader`}>
      <div className={styles.circle} />
      <div className={styles.circle} />
      <div className={styles.circle} />
      <div className={styles.circle} />
      <div className={styles.circle} />
      <div className={styles.circle} />
      <div className={styles.circle} />
      <div className={styles.circle} />
      <div className={styles.circle} />
      <div className={styles.circle} />
    </div>
  );
};

// Main Component...
const Settings = (props: { class: string }) => {
  const [imageURL, setImageURL] = React.useState<string>("");
  const [bgImageURL, setBgImageURL] = React.useState<string>("");
  const [user] = useAuthState(auth);

  // Function for upadting profile pic
  const updateProfilePic = async (type: string) => {
    if (type === "user") {
      const q = query(collection(db, "users"), where("uid", "==", user?.uid));
      const querySnapshot = await getDocs(q);
      let userId = "",
        userData = {},
        userImage = Cookie.get("userImageURL");
      querySnapshot.forEach((doc) => {
        userId = doc.id;
        userData = doc.data();
      });
      const docRef = doc(collection(db, "users"), userId);
      await setDoc(docRef, {
        ...userData,
        avatar: userImage,
      });
      Cookie.remove("userImageURL");
      window.location.reload();
    } else if (type === "bg") {
      const q = query(collection(db, "users"), where("uid", "==", user?.uid));
      const querySnapshot = await getDocs(q);
      let userId = "",
        userData = {},
        bgImage = Cookie.get("bgImageURL");
      querySnapshot.forEach((doc) => {
        userId = doc.id;
        userData = doc.data();
      });
      const docRef = doc(collection(db, "users"), userId);
      await setDoc(docRef, {
        ...userData,
        bg: bgImage,
      });
      Cookie.remove("bgImageURL");
      window.location.reload();
    }
  };

  // Function for updating the loader and uploaded img styling state...
  React.useEffect(() => {
    if (imageURL !== undefined && imageURL.length !== 0) {
      const uploadedImg = document.querySelectorAll(".uploadedUserImageURL")!;
      let loaders = document.querySelectorAll(".settingsLoader");
      let cnfrmBtn = document.querySelectorAll(".cnfrmBtn")!;
      loaders.forEach((loader, i) => {
        if (i % 2 == 0) {
          (loader as HTMLDivElement).style.height = "0rem";
          (loader as HTMLDivElement).style.marginBlock = "0rem";
        }
      });
      uploadedImg.forEach((el) => {
        (el as HTMLDivElement).style.height = "6rem";
        (el as HTMLDivElement).style.marginBlock = "1rem";
        (el as HTMLDivElement).style.backgroundImage = `url('${imageURL}')`;
      });
      cnfrmBtn.forEach((el, i) => {
        if (i % 2 == 0) (el as HTMLDivElement).style.display = "flex";
      });
    }
  }, [imageURL]);

  // Function for updating the loader and uploaded bg img styling state...
  React.useEffect(() => {
    if (bgImageURL !== undefined && bgImageURL.length !== 0) {
      const uploadedImg = document.querySelectorAll(".uploadedBgImageURL")!;
      let loaders = document.querySelectorAll(".settingsLoader");
      let cnfrmBtn = document.querySelectorAll(".cnfrmBtn")!;
      loaders.forEach((loader, i) => {
        if (i % 2 == 1) {
          (loader as HTMLDivElement).style.height = "0rem";
          (loader as HTMLDivElement).style.marginBlock = "0rem";
        }
      });
      uploadedImg.forEach((el) => {
        (el as HTMLDivElement).style.height = "6rem";
        (el as HTMLDivElement).style.marginBlock = "1rem";
        (el as HTMLDivElement).style.backgroundImage = `url('${bgImageURL}')`;
      });
      cnfrmBtn.forEach((el, i) => {
        if (i % 2 == 1) (el as HTMLDivElement).style.display = "flex";
      });
    }
  }, [bgImageURL]);

  // Function for handling changes whenenver image uploaded is changed by uploading it to cloudinary...
  const HandleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    switch (e.target.name) {
      case "userImage": {
        let file = (e.target as any).files[0];
        let loaders = document.querySelectorAll(".settingsLoader");
        loaders.forEach((loader, i) => {
          if (i % 2 == 0) {
            (loader as HTMLDivElement).style.height = "6rem";
            (loader as HTMLDivElement).style.marginBlock = "0.5rem";
          }
        });

        let data = new Promise(async (resolve, reject) => {
          const response = await uploadImage(file);
          resolve(response);
        });
        data.then((url: any) => {
          Cookie.set("userImageURL", url);
          setImageURL((currURL) => (currURL = url));
        });
        break;
      }
      case "backgroundImage": {
        let file = (e.target as any).files[0];
        let loaders = document.querySelectorAll(".settingsLoader");
        loaders.forEach((loader, i) => {
          if (i % 2 == 1) {
            (loader as HTMLDivElement).style.height = "6rem";
            (loader as HTMLDivElement).style.marginBlock = "0.5rem";
          }
        });

        let data = new Promise(async (resolve, reject) => {
          const response = await uploadImage(file);
          resolve(response);
        });
        data.then((url: any) => {
          Cookie.set("bgImageURL", url);
          setBgImageURL((currURL) => (currURL = url));
        });
        break;
      }
    }
  };

  const handleChangePic = () => {
    let type = "user";
    updateProfilePic(type);
    const uploadedImg = document.querySelectorAll(".uploadedUserImageURL")!;
    let cnfrmBtn = document.querySelectorAll(".cnfrmBtn")!;
    uploadedImg.forEach((el) => {
      (el as HTMLDivElement).style.height = "0rem";
      (el as HTMLDivElement).style.marginBlock = "0rem";
      (el as HTMLDivElement).style.backgroundImage = `url('${
        Cookie.get("userImageURL") || ""
      }')`;
    });
    cnfrmBtn.forEach((el, i) => {
      if (i % 2 == 0) (el as HTMLDivElement).style.display = "none";
    });
  };

  const handleChangeBg = () => {
    let type = "bg";
    updateProfilePic(type);
    const uploadedBgImg = document.querySelectorAll(".uploadedBgImageURL")!;
    let cnfrmBtn = document.querySelectorAll(".cnfrmBtn")!;
    uploadedBgImg.forEach((el) => {
      (el as HTMLDivElement).style.height = "0rem";
      (el as HTMLDivElement).style.marginBlock = "0rem";
      (el as HTMLDivElement).style.backgroundImage = `url('${
        Cookie.get("bgImageURL") || ""
      }')`;
    });
    cnfrmBtn.forEach((el, i) => {
      if (i % 2 == 1) (el as HTMLDivElement).style.display = "none";
    });
  };

  // Redering components here...
  return (
    <div className={styles.settings}>
      <div className={`${styles.inputField} ${styles.userImage}`}>
        <div className={`${styles.inputDiv}`}>
          <div className={styles.label}>{"Change Profile Pic "}</div>
          <form>
            <label htmlFor={"userImage"}>
              <AddAPhoto />
            </label>
            <input
              type="file"
              id="userImage"
              name="userImage"
              accept="image/*"
              onChange={HandleChange}
            />
          </form>
        </div>
        <Loader />
        <div
          className={`${styles.uploadedImg} uploadedUserImageURL`}
          style={{
            backgroundImage: `url('${Cookie.get("userImageURL") || ""}')`,
          }}
        />
        <button
          className={`${styles.cnfrmBtn} cnfrmBtn`}
          onClick={handleChangePic}
        >
          Confirm
        </button>
      </div>
      <div className={`${styles.inputField} ${styles.backgroundImage}`}>
        <div className={`${styles.inputDiv}`}>
          <div className={styles.label}>{"Change Background"}</div>
          <form>
            <label htmlFor={"backgroundImage"}>
              <AddPhotoAlternate />
            </label>
            <input
              type="file"
              id="backgroundImage"
              name="backgroundImage"
              accept="image/*"
              onChange={HandleChange}
              required
            />
          </form>
        </div>
        <Loader />
        <div
          className={`${styles.uploadedImg} uploadedBgImageURL`}
          style={{
            backgroundImage: `url('${Cookie.get("bgImageURL") || ""}')`,
          }}
        />
        <button
          className={`${styles.cnfrmBtn} cnfrmBtn`}
          onClick={handleChangeBg}
        >
          Confirm
        </button>
      </div>
      <CreateGroup class={props.class} />
      <AddUsers class={props.class} />
    </div>
  );
};

export default Settings;
