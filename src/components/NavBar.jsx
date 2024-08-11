import { useContext, useRef } from "react";
import styles from "./NavBar.module.css";
import { FaSearch } from "react-icons/fa";
import { FaAngleUp } from "react-icons/fa6";
import {GlobalContext} from '../../store/GlobalStore'
import { useNavigate } from "react-router-dom";
import axios from "axios";
const NavBar = () => {
  const {login , setLogin} = useContext(GlobalContext);
  const navigate = useNavigate();
  const user = sessionStorage.getItem('user');
  const searchRef = useRef(null);
  const handleLoginClick = () => {
    setLogin("sign_in");
  }
  const handleLogOutClick = () => {
    sessionStorage.clear();
    navigate('/');
    setLogin('');
  }
  
  const handleSearchSubmit = async(e) => {
    e.preventDefault();
    const user = sessionStorage.getItem('user')
    if(user){
      navigate(`/gallery/${searchRef.current.value}`);
    }
    else{
      alert("Please Sign In to continue...");
      handleLoginClick();
    }
    searchRef.current.value= '';
  }
  return (
    <div className={styles.main_header}>
      <div className={styles.inner_header}>
        <div className={styles.app_logo} onClick={() => navigate('/')}></div>
        <div className={styles.search_bar}>
          <div className={styles.search_icon_cont}>
            <FaSearch className={styles.search_icon} />
          </div>
          <div>
            <form onSubmit={handleSearchSubmit}>
              <input
                className={styles.input_search}
                type="text"
                ref = {searchRef}
                name="search_item"
                placeholder="Search now..."
              ></input>
            </form>
          </div>
        </div>
        {user === null && <div className={styles.login} onClick={handleLoginClick}>Sign In</div>}
        {user !== null && (
          <div className={styles.profile}>
            <div className={styles.profile_header}>
              <div>Profile</div>
              <div className={styles.drop_up_down}>
                <FaAngleUp />
              </div>
            </div>
            <div className={styles.drop_down_list}>
              <div className={styles.item1} onClick={() => navigate('/gallery')}>Gallery</div>
              <div className={styles.item2} onClick={handleLogOutClick}>LogOut</div>
              <div className={styles.item3} onClick={()=> navigate('/my_collection')}>My Collection</div>
              <div className={styles.item4} onClick={()=> user ?navigate('/add_image'): setLogin('sign_in')}>Upload Images</div>
            </div>
          </div>
        )}
        <div className={styles.about} onClick={() => navigate('/about')}>About</div>
      </div>
    </div>
  );
};

export default NavBar;
