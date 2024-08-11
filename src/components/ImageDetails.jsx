import axios from "axios";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import styles from "./ImageDetails.module.css";
import Image from './Image';
const ImageDetails = () => {
  const { id } = useParams();
  const [imageDetails, setImageDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const enlargedFlag = true;
  useEffect(() => {
    const fetchImageDetails = async () => {
      try {
        let image = sessionStorage.getItem("image");
        if (!image || JSON.parse(image)._id !== id) {
          const response = await axios.get(
            `http://localhost:8000/image_details`,
            {
              params: { id: id },
            }
          );
          if (response.data.image && response.data.image.length > 0) {
            image = response.data.image[0];
            sessionStorage.setItem("image", JSON.stringify(image));
          } else {
            throw new Error("No image found");
          }
        } else {
          image = JSON.parse(image);
        }
        setImageDetails(image);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchImageDetails();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className={styles.imageDetails_container}>
      {imageDetails ? (
        <Image image={imageDetails} enlargedFlag={enlargedFlag}></Image>
      ) : (
        <p>No details available.</p>
      )}
    </div>
  );
};

export default ImageDetails;
