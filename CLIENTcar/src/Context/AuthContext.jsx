import React, { createContext, useState, useEffect } from "react";
import API from "../services/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // ✅ track loading

  const fetchProfile = async () => {
    try {
      const res = await API.get("/profile", { withCredentials: true });
      setUser(res.data.data);
      console.log("AuthContext User Set:", res.data.user); // {name, email, role}
    } catch (err) {
      setUser(null);
      
    } finally {
      setLoading(false); // ✅ done loading
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, fetchProfile, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
