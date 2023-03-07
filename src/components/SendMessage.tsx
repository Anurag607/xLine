import React, { useState } from "react";
import { auth, db } from "../../firebase/clientApp";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import styles from "../styles/sendMessage.module.scss";
import Cookies from "js-cookie";
import { deselectMsgs } from "@/scripts/msgReply";
import { AttachFile } from "@mui/icons-material";
import uploadImage from "../scripts/imgUpload";

// Function Component for Loader...
const Loader = () => {
  return (
    <div className={`${styles["messageLoader"]} messageLoader`}>
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

const SendMessage = ({ scroll }: { scroll: any }) => {
  const [message, setMessage] = useState("");
  const [image, setImage] = useState<string>("");

  // Function for sending messages...
  const sendMessage = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    let loaders = document.querySelectorAll(".messageLoader");
    let modal = document.querySelector(".imageMsgModal");
    const uploadedImg = document.querySelectorAll(".uploadedImageMsg")!;
    (modal as HTMLDivElement).style.height = "0vh";
    uploadedImg.forEach((el) => {
      (el as HTMLDivElement).style.width = "0%";
      (el as HTMLDivElement).style.height = "0%";
    });
    loaders.forEach((loader, i) => {
      (loader as HTMLDivElement).style.height = "0rem";
    });
    if (message.trim() === "" && image.trim() === "") {
      alert("Enter valid message");
      return;
    }
    const { uid, displayName, photoURL, email } = auth.currentUser as any;
    await addDoc(collection(db, "messages"), {
      text: message,
      image: image,
      name: displayName === null ? email.split("@")[0] : displayName,
      avatar: Cookies.get("userImage"),
      createdAt: serverTimestamp(),
      replyTo:
        Cookies.get("replyMode") === "true"
          ? JSON.parse(Cookies.get("selectedMsg")).id
          : null,
      room: JSON.parse(Cookies.get("currentGroup")).id,
      uid,
    });
    setMessage("");
    deselectMsgs();
    scroll.current.scrollIntoView({ behavior: "smooth" });
  };

  // Function for updating the loader and uploaded img styling state...
  React.useEffect(() => {
    if (image !== undefined && image.length !== 0) {
      const uploadedImg = document.querySelectorAll(".uploadedImageMsg")!;
      let loaders = document.querySelectorAll(".messageLoader");
      loaders.forEach((loader, i) => {
        (loader as HTMLDivElement).style.height = "0rem";
      });
      setTimeout(() => {
        uploadedImg.forEach((el) => {
          (el as HTMLDivElement).style.width = "98%";
          (el as HTMLDivElement).style.height = "97%";
          (el as HTMLDivElement).style.backgroundImage = `url('${image}')`;
        });
      }, 400);
    }
  }, [image]);

  // Function for handling changes whenenver image uploaded is changed by uploading it to cloudinary...
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    let file = (e.target as any).files[0];
    let loaders = document.querySelectorAll(".messageLoader");
    let modal = document.querySelector(".imageMsgModal");
    const uploadedImg = document.querySelectorAll(".uploadedImageMsg")!;
    (modal as HTMLDivElement).style.height = "50vh";
    uploadedImg.forEach((el) => {
      (el as HTMLDivElement).style.width = "0%";
      (el as HTMLDivElement).style.height = "0%";
    });
    setTimeout(() => {
      loaders.forEach((loader, i) => {
        (loader as HTMLDivElement).style.height = "6rem";
      });
    }, 300);

    let data = new Promise(async (resolve, reject) => {
      const response = await uploadImage(file);
      resolve(response);
    });
    data.then((url: any) => {
      Cookies.set("imageMsg", url);
      setImage((currURL) => (currURL = url));
    });
  };

  return (
    <>
      <form
        onSubmit={(event) => sendMessage(event)}
        className={`${styles["send-message"]} send-message`}
      >
        <label htmlFor="messageInput" hidden>
          Enter Message
        </label>
        <input
          id="messageInput"
          name="messageInput"
          type="text"
          className={`${styles["form-input__input"]} form-input__input`}
          placeholder="Message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          autoFocus
          autoComplete="off"
        />
        <div className={styles["featureContainer"]}>
          <label htmlFor="imageMsg" className={styles.imageMsgLabel}>
            <AttachFile />
          </label>
          <input
            type="file"
            id="imageMsg"
            name="imageMsg"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleImageUpload}
          />
        </div>
        <button type="submit">Send</button>
      </form>
      <div
        className={`${styles.modal} imageMsgModal`}
        style={{ width: `${window.innerWidth > 800 ? "48.75vw" : "83.5vw"}` }}
      >
        <Loader />
        <div
          className={`${styles.uploadedImg} uploadedImageMsg`}
          style={{
            backgroundImage: `url('${Cookies.get("imageMsg") || ""}')`,
          }}
        />
      </div>
    </>
  );
};

export default SendMessage;
