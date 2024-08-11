import { useEffect, useState } from "react";
import styles from "./Featured.module.css";
import axios from "axios";
import Image from "./Image";
const fetchFeaturedItems = async () => {
  try {
    const result = await axios.get(
      "http://localhost:8000/fetch_featured_items"
    );
    return result;
  } catch (error) {
    throw error;
  }
};

const Featured = () => {
  const [featured_images, setFeaturedImages] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const featured_items = await fetchFeaturedItems();
        setFeaturedImages(featured_items.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className={styles.featured_container}>
        {featured_images.map((image, index) => (
          <Image key={index} image={image} />
        ))}
    </div>
  );
};

export default Featured;
