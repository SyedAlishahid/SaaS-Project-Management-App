import { createContext, useContext, useState } from "react";

import { SignupForm } from "../pages/signup.jsx";
import { LoginFrom } from "../pages/login.jsx";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const login = async (email, password) => {
    setLoading(true);

    try {
      const data = await LoginFrom.login({ email, password });

      setUser(data.user);
      return data;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (userData) => {
    return await SignupForm.signup(userData);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, signup, logout, setUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
