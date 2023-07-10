import React from "react";
import uploadImage from "../../scripts/imgUpload";
import styles from "./settings.module.scss";
import Cookie from "js-cookie";
import { AddAPhoto, AddPhotoAlternate } from "@mui/icons-material";
import CreateGroup from "../CreateGroup";
import AddUsers from "../AddUsers";
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { db, auth } from "../../../firebase/clientApp";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/navigation";

// Function Component for Loader...
const Loader = () => {
  return (
    <div className={`${styles["settingsLoader"]} settingsLoader`}>
      {new Array(10).fill(0).map((_, i) => (
        <div className={styles.circle} key={i} />
      ))}
    </div>
  );
};

// Main Component...
const Settings = (props: { class: string }) => {
  // Getting current user session...
  const [user] = useAuthState(auth);

  // Getting router object...
  const router = useRouter();

  // Defining states vaiables...
  const [imageURL, setImageURL] = React.useState<string>("");
  const [bgImageURL, setBgImageURL] = React.useState<string>("");
  const [bgImagefile, setBgImageFile] = React.useState<any>(null);
  const [profileImageFile, setProfileImageFile] = React.useState<any>(null);

  // Function for upadting profile pic
  const UpdateDB = async (type: string) => {
    if (type === "user") {
      await uploadImage(profileImageFile).then(async (url: string) => {
        // Defining variables...
        let userId = "",
          userData = {},
          userImage = url;

        // Getting the user info...
        const q = query(collection(db, "users"), where("uid", "==", user?.uid));
        const querySnapshot = await getDocs(q);

        // Updating the user info...
        querySnapshot.forEach((doc) => {
          userId = doc.id;
          userData = doc.data();
        });

        // Setting the user info...
        const docRef = doc(collection(db, "users"), userId);
        await setDoc(docRef, {
          ...userData,
          avatar: userImage,
        });

        // Removing the cookie and reloading the page...
        Cookie.remove("userImageURL");
        window.location.reload();
      });
    } else if (type === "bg") {
      await uploadImage(bgImagefile).then(async (url: string) => {
        // Defining variables...
        let userId = "",
          userData = {},
          bgImage = url;

        // Getting the user info...
        const q = query(collection(db, "users"), where("uid", "==", user?.uid));
        const querySnapshot = await getDocs(q);

        // Updating the user info...
        querySnapshot.forEach((doc) => {
          userId = doc.id;
          userData = doc.data();
        });

        // Setting the user info...
        const docRef = doc(collection(db, "users"), userId);
        await setDoc(docRef, {
          ...userData,
          bg: url,
        });

        // Removing the cookie and reloading the page...
        Cookie.remove("bgImageURL");
        window.location.reload();
      });
    }
  };

  // Function for updating the loader and uploaded profile pic styling state...
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

  // Function for handling changes whenenver bg image or profile pic is changed...
  const HandleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    switch (e.target.name) {
      case "userImage": {
        let file = (e.target as any).files[0];
        const src = URL.createObjectURL(file);
        setImageURL((currURL) => (currURL = src));
        setProfileImageFile(file);
        break;
      }
      case "backgroundImage": {
        let file = (e.target as any).files[0];
        const src = URL.createObjectURL(file);
        Cookie.set("bgImageFile", JSON.stringify(file));
        setBgImageURL((currURL) => (currURL = src));
        setBgImageFile(file);
        break;
      }
    }
  };

  // Function for handling profile image form submit...
  const HandleSubmitProfilePic = () => {
    UpdateDB("user");

    // Resetting the profile image form and loader styling...
    const userImg = document.querySelector("#userImage")! as HTMLInputElement;
    const uploadedImg = document.querySelectorAll(".uploadedUserImageURL")!;
    let cnfrmBtn = document.querySelectorAll(".cnfrmBtn")!;

    uploadedImg.forEach((el) => {
      (el as HTMLDivElement).style.height = "0rem";
      (el as HTMLDivElement).style.marginBlock = "0rem";
      (el as HTMLDivElement).style.backgroundImage = "";
    });

    cnfrmBtn.forEach((el, i) => {
      if (i % 2 == 0) (el as HTMLDivElement).style.display = "none";
    });

    userImg.value = "";
  };

  // Function for handling background image form submit...
  const HandleSubmitBg = () => {
    UpdateDB("bg");

    // Resetting the bg image form and loader styling...
    const backgroundImg = document.querySelector(
      "#backgroundImage"
    )! as HTMLInputElement;
    const uploadedBgImg = document.querySelectorAll(".uploadedBgImageURL")!;
    let cnfrmBtn = document.querySelectorAll(".cnfrmBtn")!;

    uploadedBgImg.forEach((el) => {
      (el as HTMLDivElement).style.height = "0rem";
      (el as HTMLDivElement).style.marginBlock = "0rem";
      (el as HTMLDivElement).style.backgroundImage = "";
    });

    cnfrmBtn.forEach((el, i) => {
      if (i % 2 == 1) (el as HTMLDivElement).style.display = "none";
    });
    backgroundImg.value = "";
  };

  // Redering components here...
  return (
    <div className={styles.settings}>
      <div className={`${styles.inputField} ${styles.userImage}`}>
        {/* User Image Input Div */}
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
              required
            />
          </form>
        </div>
        <Loader />

        {/* User Image Preview Div */}
        <div
          className={`${styles.uploadedImg} uploadedUserImageURL`}
          style={{
            backgroundImage: `url('${Cookie.get("userImageURL") || ""}')`,
          }}
        />
        <button
          className={`${styles.cnfrmBtn} cnfrmBtn`}
          onClick={HandleSubmitProfilePic}
        >
          Confirm
        </button>
      </div>

      <div className={`${styles.inputField} ${styles.backgroundImage}`}>
        {/* Background Image Input Div */}
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

        {/* Background Image Preview Div */}
        <div
          className={`${styles.uploadedImg} uploadedBgImageURL`}
          style={{
            backgroundImage: `url('${Cookie.get("bgImageURL") || ""}')`,
          }}
        />
        <button
          className={`${styles.cnfrmBtn} cnfrmBtn`}
          onClick={HandleSubmitBg}
        >
          Confirm
        </button>
      </div>

      {/* Create Group and Add user Actions */}
      <CreateGroup class={props.class} />
      <AddUsers class={props.class} />
    </div>
  );
};

export default Settings;
