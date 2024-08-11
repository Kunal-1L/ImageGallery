import { useEffect, useState } from "react";
import axios from "axios";
import { useQuery, useUpdateQuery } from "./customHooks/useQueryParam";
import Image from "./Image";
import { useNavigate, useParams } from "react-router-dom";
import styles from "./Gallery.module.css";
const Gallery = () => {
  const query = useQuery();
  const updateQuery = useUpdateQuery();
  const [images, setImages] = useState([]);
  const skip = parseInt(query.get("skip")) || 0;
  const limit = parseInt(query.get("limit")) || 10;
  const navigate = useNavigate();
  const { search } = useParams();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await axios.get("http://localhost:8000/fetch_images", {
          params: {
            skip,
            limit,
            search,
          },
        });
        if (!result.data.length) {
          if (search){
            navigate('/gallery');
          } 
          else{
             navigate('/gallery');
          }
        } else setImages(result.data);
      } catch (error) {
        console.log(error);
        navigate('/');
      }
    };

    fetchData();
  }, [skip, limit, search]); // Add skip and limit to dependency array

  const handleNextClick = () => {
    if (images.length >= limit) updateQuery({ skip: skip + limit, limit });
    else updateQuery({ skip: 0, limit });
  };

  const enlargedFlag = false;
  const handlePrevClick = () => {
    // Ensure skip doesn't go below 0
    if (skip - limit >= 0) {
      updateQuery({ skip: skip - limit, limit });
    } else navigate("/");
  };

  return (
    <div className={styles.gallery_container}>
        <div style={{minHeight:'77vh'}}>
        <div className={styles.images_parent}>
          {images.map((image, index) => (
            <Image key={index} image={image} enlargedFlag={enlargedFlag} />
          ))}
        </div>
      </div>
      <div className={styles.btn_cont}>
        {skip !== 0 && (
          <button onClick={handlePrevClick} className={styles.prev_btn}>
            Previous Page
          </button>
        )}
        {images.length >= limit && (
          <button onClick={handleNextClick} className={styles.next_btn}>
            Next Page
          </button>
        )}
      </div>
    </div>
  );
};

export default Gallery;
