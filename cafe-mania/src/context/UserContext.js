import { createContext, useEffect, useState } from "react";

const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [userToken, setUserToken] = useState(null);
  const [isUser, setIsUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("userToken");
    if (token) {
      setUserToken(token);
      setIsUser(true);
    }
  }, []);

  const login = (token) => {
    setUserToken(token);
    setIsUser(true);
    localStorage.setItem("userToken", token);
  };

  const logout = () => {
    setUserToken(null);
    setIsUser(false);
    localStorage.removeItem("userToken");
  };

  return (
    <UserContext.Provider value={{ userToken, isUser, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export { UserProvider, UserContext };
