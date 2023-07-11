import { CloudImage } from "../../cloudinary/CloudImage";

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

export default onFileChange;
