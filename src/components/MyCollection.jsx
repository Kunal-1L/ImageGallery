import { useEffect, useState } from "react";
import axios from "axios";
import Image from "./Image";
import styles from "./MyCollection.module.css";
const MyCollection = () => {
  const [collection, setCollection] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchMyCollection = async (user) => {
    setLoading(true);
    try {
      const response = await axios.get(
        "http://localhost:8000/fetch_my_collection",
        { params: { user } }
      );
      console.log(response.data.collection);
      return response.data.collection; // Corrected typo
    } catch (error) {
      console.error("Error fetching collection:", error);
      throw error;
    }
    finally{
      setLoading(false);
    }
  };

  useEffect(() => {
    const user = sessionStorage.getItem("user");
    if (user) {
      fetchMyCollection(user)
        .then((data) => {
          console.log(data);
          setCollection(data);
        })
        .catch((error) => {
          setError(error);
        });
    }
  }, []);

  return (
    <div className={styles.collection_container}>
      {!loading ? (
        collection.length > 0 ? (
          <div className={styles.collection_list}>
            {collection.map((image, index) => (
              <Image key={index} image={image} enlargedFlag={false} />
            ))}
          </div>
        ) : (
          <div className={styles.loading_container}>Please Add Images in your collections...</div>
        )
      ) : (
        <div className={styles.loading_container}>Loading...</div>
      )}
    </div>
  );
};

export default MyCollection;
