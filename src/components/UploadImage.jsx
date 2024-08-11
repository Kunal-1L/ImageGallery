import React, { useRef } from "react";
import axios from "axios";
import styles from "./UploadImage.module.css";
const App = () => {
  const imageURLRef = useRef(null);
  const imageTitleRef = useRef(null);
  const imageTagsRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const imageURL = imageURLRef.current.value;
    const imageTitle = imageTitleRef.current.value;
    const imageTags = imageTagsRef.current.value
      .split(",")
      .map((tag) => tag.trim());
    console.log(imageURL, imageTitle, imageTags);
    const img = new Image();
    img.onload = async () => {
      const imageWidth = img.width > 350 ? 350 : img.width;
      const imageHeight = img.height > 300 ? 300: img.height;
      try {
        console.log();
        const result = await axios.post("http://localhost:8000/add_image", {
          user_id: "kumar180kunal@gmail.com",
          imageTitle,
          imageTags,
          imageURL,
          imageWidth,
          imageHeight,
        });
      } catch (error) {
        console.log(error);
      }
      imageURLRef.current.value = "";
      imageTitleRef.current.value = "";
      imageTagsRef.current.value = "";
    };

    img.onerror = () => {
      console.log("Invalid image URL.");
    };

    img.src = imageURL;
  };

  return (
    <form onSubmit={handleSubmit} className={styles.upload_container}>
      <div className={styles.upload_parent}>
        <div className={styles.upload_head}>Pic Img</div>
        <div className={styles.upload_input}>
          <div>
            <input
              ref={imageTitleRef}
              type="text"
              name="image_title"
              placeholder="Enter title for your image"
            />
          </div>
          <div>
            <input
              ref={imageURLRef}
              type="text"
              name="image_url"
              placeholder="Enter image URL"
            />
          </div>
        </div>
        <div className={styles.upload_input}>
          <input
            ref={imageTagsRef}
            type="text"
            name="image_tags"
            placeholder="Enter 3 tags for your image (comma separated)"
          />
        </div>
        <div>
          <button type="submit">Add Image</button>
        </div>
      </div>
    </form>
  );
};

export default App;
