import { useContext, useRef } from "react";
import styles from "./SignUp.module.css";
import { IoCloseSharp } from "react-icons/io5";
import { GlobalContext } from "../../store/GlobalStore";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const SignUp = () => {
  const { login, setLogin } = useContext(GlobalContext);
  const user_id_ref = useRef(null);
  const user_password_ref = useRef(null);
  const navigate = useNavigate();

  const handleCloseClick = () => {
    setLogin("");
  };

  const handleFormSubmitClick = (e) => {
    e.preventDefault();
    const user_id_val = user_id_ref.current.value;
    const user_password_val = user_password_ref.current.value;

    user_id_ref.current.value = "";
    user_password_ref.current.value = "";

    if (login === "sign_in") {
      handleLoginClick({ user_id_val, user_password_val });
    } else {
      handleCreateAccountClick({ user_id_val, user_password_val });
    }
  };

  const handleCreateAccountClick = async (data) => {
    try {
      const result = await axios.post("http://localhost:8000/create_account", data);
      alert("Account created successfully, please Sign In now...");
      setLogin("sign_in");
    } catch (error) {
      alert(error.response.data.message);
    }
  };

  const handleLoginClick = async (data) => {
    try {
      const result = await axios.post("http://localhost:8000/sign_in", data);
      alert(result.data.message);
      sessionStorage.setItem("user", result.data.user);
      setLogin("login_success");
      navigate("/");
    } catch (error) {
      alert(error.response.data.message);
    }
  };

  return (
    <form className={styles.sign_up_container} onSubmit={handleFormSubmitClick}>
      <div className={styles.closeButton_container} onClick={handleCloseClick}>
        <IoCloseSharp className={styles.closeButton} />
      </div>

      <div className={styles.sign_up_box}>
        <div className={styles.sign_up_logo}>
          {login === "sign_in" ? "Sign In" : "Sign Up"}
        </div>
        <div className={styles.user_id}>
          <label htmlFor="user_id">Username</label>
          <input
            className={styles.input_cont}
            type="email"
            name="user_id"
            ref={user_id_ref}
            required
          />
        </div>
        <div className={styles.user_password}>
          <label htmlFor="user_password">Password</label>
          <input
            className={styles.input_cont}
            type="password"
            name="user_password"
            ref={user_password_ref}
            required
          />
        </div>
        <div className={styles.create_account}>
          <button type="submit">
            {login === "sign_in" ? "Sign In" : "Sign Up"}
          </button>
        </div>
        <div>
          {login === "sign_in" ? (
            <div>
              Don't have an account?{" "}
              <span
                onClick={() => setLogin("create_account")}
                style={{ cursor: "pointer", color: "blue" }}
              >
                Click Here
              </span>
            </div>
          ) : (
            <div>
              Already have an account?{" "}
              <span
                onClick={() => setLogin("sign_in")}
                style={{ cursor: "pointer", color: "blue" }}
              >
                Sign In
              </span>
            </div>
          )}
        </div>
      </div>
    </form>
  );
};

export default SignUp;
