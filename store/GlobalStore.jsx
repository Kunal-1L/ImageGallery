import { createContext, useState } from "react";

const GlobalContext = createContext();

const GlobalState = ({ children }) => {
  const [login, setLogin] = useState("");

  return (
    <GlobalContext.Provider
      value={{
        login,
        setLogin,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export { GlobalState, GlobalContext };
