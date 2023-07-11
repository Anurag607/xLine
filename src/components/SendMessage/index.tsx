import React, { useState } from "react";
import { auth, db } from "../../../firebase/clientApp";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import styles from "./sendMessage.module.scss";
import Cookies from "js-cookie";
import { deselectMsgs } from "../../scripts/msgReply";
import { AttachFile, CloseTwoTone } from "@mui/icons-material";
import uploadImage from "../../scripts/imgUpload";

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
  // Defining states vaiables...
  const [message, setMessage] = useState("");
  const [image, setImage] = useState<string>("");
  const [file, setFile] = useState<any>(null);

  const CloseImageModal = () => {
    let closeBtn = document.querySelector("#closeImageModal")!;
    let loaders = document.querySelectorAll(".messageLoader");
    let modal = document.querySelector(".imageMsgModal");
    let imageMsg = document.querySelector("#imageMsg") as HTMLInputElement;
    const uploadedImg = document.querySelectorAll(".uploadedImageMsg")!;
    (modal as HTMLDivElement).style.height = "0vh";
    uploadedImg.forEach((el) => {
      (el as HTMLDivElement).style.width = "0%";
      (el as HTMLDivElement).style.height = "0%";
    });
    loaders.forEach((loader, i) => {
      (loader as HTMLDivElement).style.height = "0rem";
    });
    (closeBtn as HTMLButtonElement).style.scale = "0";
    imageMsg!.value = "";
    setImage("");
  };

  // Function for updating the DB with the latest message (Text/image, text, image).....
  const UpdateDB = async (url: string | null) => {
    // Getting the user info...
    const { uid, displayName, email } = auth.currentUser as any;

    await addDoc(collection(db, "messages"), {
      text: message,
      image: url,
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
  };

  // Function for sending messages...
  const sendMessage = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Checking if the message is empty...
    if (message.trim() === "" && image.trim() === "") {
      alert("Enter valid message");
      return;
    }

    if (file !== null) {
      // Uploading the image to cloudinary...
      await uploadImage(file).then(async (url: string) => {
        UpdateDB(url);
      });
    } else {
      UpdateDB(null);
    }

    // Updating the message states...
    setMessage("");
    setFile(null);
    deselectMsgs();

    // Updating the loader and uploaded img styling state...
    CloseImageModal();

    // Scrolling to the bottom of the chat...
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

  // Function for updating the loader and uploaded img styling state...
  const ImageChangeHandler = (event: React.MouseEvent<HTMLInputElement>) => {
    let closeBtn = document.querySelector("#closeImageModal")!;
    let target = event.target as HTMLInputElement;
    let modal = document.querySelector(".imageMsgModal");
    const uploadedImg = document.querySelectorAll(".uploadedImageMsg")!;

    const src = URL.createObjectURL(target.files![0]);
    setImage((currURL) => (currURL = src));
    setFile(target.files![0]);

    (modal as HTMLDivElement).style.height = "50vh";
    (closeBtn as HTMLButtonElement).style.scale = "1";
    uploadedImg.forEach((el) => {
      (el as HTMLDivElement).style.width = "0%";
      (el as HTMLDivElement).style.height = "0%";
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
            onInput={ImageChangeHandler}
          />
        </div>
        <button type="submit">Send</button>
      </form>

      {/* Modal for previewing img upload */}
      <div
        className={`${styles.modal} imageMsgModal`}
        style={{ width: `${window.innerWidth > 800 ? "48.75vw" : "83.5vw"}` }}
      >
        <Loader />
        <CloseTwoTone
          id={"closeImageModal"}
          className={styles.closeBtn}
          onClick={CloseImageModal}
        />
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
