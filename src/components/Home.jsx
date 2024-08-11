import { GlobalContext } from '../../store/GlobalStore';
import styles from './Home.module.css'
import Featured from './Featured';
import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
const Home = () => {
    const images = [
        '../../public/Child adoption-pana.svg',
        '../../public/Digital transformation-amico.svg',
        '../../public/Education-rafiki.svg',
        '../../public/Medical care-rafiki.svg',
        '../../public/Wedding-amico.svg'
    ];

    const [currentIndex, setCurrentIndex] = useState(0);
    const {login, setLogin} = useContext(GlobalContext);
    const user = sessionStorage.getItem('user');
    const navigate = useNavigate();
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex(prevIndex => (prevIndex + 1) % images.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [images.length]);

    const handleDiscoverClick = () => {
        console.log(user);
        if(user)
            navigate('/gallery');
        else    
            setLogin('sign_in');
    }
    return (
    <>
        <div className={styles.main_hero_container}>
            <div className={styles.inner_hero_section}>
                <div className={styles.hero_tag_section}>
                    <div className={styles.hero_tag_head}>Pic Img</div>
                    <div className={styles.hero_sub_tag_head}>Discover, Organize, and Share Your Visual Stories</div>
                    <div className={styles.upload_sec}><button onClick={() => user ? navigate('/add_image') : setLogin('sign_in')}>Upload Images</button></div>
                </div>
                <div className={styles.hero_image_section}>
                    {images.map((image, index) => (
                        currentIndex === index && (
                            <div key={index} className={styles.hero_slide_img}>
                                <img src={image} alt={`Slide ${index}`} />
                            </div>
                        )
                    ))}
                </div>
            </div>
            {(login === '' || login === 'login_success') && <Featured className={styles.featured_section}></Featured>}
        </div><br></br><br></br><br></br><br></br><br></br>
        {(login !== 'sign_in' && login !== 'create_account' ) && <button className={styles.discover_more} onClick={handleDiscoverClick}>Discover More</button>}
    </>

    );
}

export default Home;
