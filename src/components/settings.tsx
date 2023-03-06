import React from "react";
import useImageUpload from "../scripts/imgUpload";
import styles from "../styles/settings.module.scss";
import Cookie from "js-cookie";
import { AddAPhoto } from "@mui/icons-material";
import CreateGroup from "./createGroup";
import AddUsers from "./addUsers";
import { CloudImage } from "../../cloudinary/CloudImage";

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

// Function for Image Upload...
const onFileChange = async (file: File) => {
  const form_data = new FormData();
  let preset = process.env.NEXT_PUBLIC_PRESET;
  if (preset) {
    form_data.append("upload_preset", preset);
  }
  if (file) {
    form_data.append("file", file);
    const imageUrl = await CloudImage(form_data);

    if (imageUrl) {
      return imageUrl;
    } else {
      return "https://upload.wikimedia.org/wikipedia/commons/d/d1/Image_not_available.png";
    }
  }
  return "https://upload.wikimedia.org/wikipedia/commons/d/d1/Image_not_available.png";
};

// Main Component...
const Settings = () => {
  const [imageURL, setImageURL] = React.useState<string>("");

  React.useEffect(() => {
    if (imageURL !== undefined && imageURL.length !== 0) {
      const el: HTMLDivElement = document.querySelector(
        ".uploadedUserImageURL"
      )!;
      let loader = document.querySelectorAll(".settingsLoader");
      (loader[0] as HTMLDivElement).style.height = "0vh";
      (loader[0] as HTMLDivElement).style.marginBlock = "0rem";
      el.style.height = "20vh";
      el.style.marginBlock = "2rem";
      el.style.backgroundImage = `url('${imageURL}')`;
    }
  }, [imageURL]);

  // Function for handling changes whenenver image uploaded is changed by uploading it to cloudinary...
  const HandleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let file = (e.target as any).files[0];
    let loader = document.querySelectorAll(".settingsLoader");
    (loader[0] as HTMLDivElement).style.height = "12vh";
    (loader[0] as HTMLDivElement).style.marginBlock = "0.5rem";
    let data = new Promise(async (resolve, reject) => {
      const response = await onFileChange(file);
      resolve(response);
    });
    data.then((url: any) => {
      console.log(url);
      Cookie.set("userImageURL", url);
      setImageURL((currURL) => (currURL = url));
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
              style={{ display: "none" }}
              required
            />
          </form>
        </div>
        <Loader />
        <div
          className={`${styles.uploadedImg} uploadedUserImageURL`}
          style={{ backgroundImage: `url('${Cookie.get("userImageURL")}')` }}
        />
      </div>
      <CreateGroup />
      <AddUsers />
    </div>
  );
};

export default Settings;
