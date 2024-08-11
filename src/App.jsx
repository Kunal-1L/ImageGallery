import "./App.css";
import NavBar from "./components/NavBar";
import Home from "./components/Home";
import Gallery from "./components/Gallery";
import About from "./components/About"
import ImageDetails from "./components/ImageDetails";
import UploadImage from "./components/UploadImage";
import SignUp from "./components/SignUp";
import { Routes, Route } from "react-router-dom";
import { useContext } from "react";
import { GlobalContext } from "../store/GlobalStore";
import MyCollection from "./components/MyCollection";
function App() {
  const { login } = useContext(GlobalContext);
  return (
    <div>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/gallery/:search" element={<Gallery />}></Route>
        <Route path="/gallery" element={<Gallery />}></Route>
        <Route path="/image/:id" element={<ImageDetails />}></Route>
        <Route path="/my_collection" element={<MyCollection />}></Route>
        <Route path="/add_image" element={<UploadImage />}></Route>
        <Route path='/about' element={<About />}></Route>
        <Route path="/*" element={<Error />}></Route>
      </Routes>
      {(login === "sign_in" || login === "create_account") && <SignUp />}
    </div>
    
  );
}

export default App;
