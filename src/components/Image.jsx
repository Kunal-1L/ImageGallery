import styles from "./Image.module.css";
import { MdCollections } from "react-icons/md";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { GlobalContext } from "../../store/GlobalStore";

const Image = ({ image, enlargedFlag }) => {
  const { setLogin } = useContext(GlobalContext);
  const navigate = useNavigate();
  const handleAddToCollectionClick = async () => {
    try {
      const user = sessionStorage.getItem("user");
      if (user === null) {
        alert("Please Sign In first...");
        setLogin("sign_in");
      } else {
        const id = image._id;
        const response = await axios.post(
          "http://localhost:8000/add_to_collection",
          { id, user }
        );
        alert(response.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleImageClick = () => {
    const user = sessionStorage.getItem("user");
    if (user != null) navigate(`/image/${image._id}`);
    else setLogin("sign_in");
  };
  return (
    <div
      className={`${
        enlargedFlag === true
          ? styles.enlarged_image_container
          : styles.image_container
      }`}
    >
      <div className={styles.image_title}>{image.title}</div>
      <div
        className={styles.add_to_collection}
        title="Add To Collection"
        onClick={handleAddToCollectionClick}
      >
        <MdCollections className={styles.add_to_collection_icon} />
      </div>
      <img
        src={image.url}
        alt={image.description || "Image"}
        className={styles.image_box}
        style={{ width: `${image.width}px`, height: `${image.height}px` }}
        onClick={handleImageClick}
      />
    </div>
  );
};

export default Image;
