import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [adminInfo, setAdminInfo] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("admin_token");
    const storedInfo = localStorage.getItem("admin_info");
    if (storedToken && storedInfo) {
      setToken(storedToken);
      setAdminInfo(JSON.parse(storedInfo));
    }
    setLoading(false);
  }, []);

  const loginAdmin = (tokenVal, info) => {
    localStorage.setItem("admin_token", tokenVal);
    localStorage.setItem("admin_info", JSON.stringify(info));
    setToken(tokenVal);
    setAdminInfo(info);
  };

  const logoutAdmin = () => {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_info");
    setToken(null);
    setAdminInfo(null);
  };

  return (
    <AuthContext.Provider value={{ adminInfo, token, loading, loginAdmin, logoutAdmin, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
};

// Super Admin
const SuperAuthContext = createContext(null);

export const SuperAuthProvider = ({ children }) => {
  const [superAdminInfo, setSuperAdminInfo] = useState(null);
  const [superToken, setSuperToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = localStorage.getItem("superadmin_token");
    const i = localStorage.getItem("superadmin_info");
    if (t && i) { setSuperToken(t); setSuperAdminInfo(JSON.parse(i)); }
    setLoading(false);
  }, []);

  const loginSuperAdmin = (tokenVal, info) => {
    localStorage.setItem("superadmin_token", tokenVal);
    localStorage.setItem("superadmin_info", JSON.stringify(info));
    setSuperToken(tokenVal);
    setSuperAdminInfo(info);
  };

  const logoutSuperAdmin = () => {
    localStorage.removeItem("superadmin_token");
    localStorage.removeItem("superadmin_info");
    setSuperToken(null);
    setSuperAdminInfo(null);
  };

  return (
    <SuperAuthContext.Provider value={{ superAdminInfo, superToken, loading, loginSuperAdmin, logoutSuperAdmin, isAuthenticated: !!superToken }}>
      {children}
    </SuperAuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
export const useSuperAuth = () => useContext(SuperAuthContext);
