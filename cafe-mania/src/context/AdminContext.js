import { createContext, useState, useEffect } from "react";

const AdminContext = createContext();

const AdminProvider = ({ children }) => {
  const [adminToken, setAdminToken] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const token = sessionStorage.getItem("adminToken");
    if (token) {
      setAdminToken(token);
      setIsAdmin(true);
    }
  }, []);

  const login = (token) => {
    setAdminToken(token);
    setIsAdmin(true);
    sessionStorage.setItem("adminToken", token);
  };

  const logout = () => {
    setAdminToken(null);
    setIsAdmin(false);
    sessionStorage.removeItem("adminToken");
  };

  return (
    <AdminContext.Provider value={{ adminToken, isAdmin, login, logout }}>
      {children}
    </AdminContext.Provider>
  );
};

export { AdminProvider, AdminContext };
