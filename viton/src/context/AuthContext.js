import React, { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const API_URL = "http://localhost:8000/login";

    const payload = {
      email: email,
      password: password,
    };

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        return false
      }

      // Correctly extract user details
      console.log(data.name)

      const user = { username: data.name }; // email might be missing

      setCurrentUser(user);
      localStorage.setItem("user", JSON.stringify(user));


      return data.authentic; // Assuming backend returns { authentic: true/false }
    } catch (error) {
      console.error("Fetch error:", error);
      return false;
    }
  };

  const register = async (name, email, password) => {
    const API_URL = "http://localhost:8000/register";

    const payload = { name, email, password };

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });

        const data = await response.json();

        if (!response.ok || !data.registered) {
            return false;  // Registration failed
        }

        // If registration is successful, store user info
        const user = { username: name, email: email };
        setCurrentUser(user);
        localStorage.setItem("user", JSON.stringify(user));

        return true; // Registration successful

    } catch (error) {
        console.error("Fetch error:", error);
        return false; // Return false in case of an error
    }
};
  

  // const login = async (email, password) => {
  //   const isValid = await validate(email, password);
  //   if (isValid) {
  //     return true;
  //   }
  //   return false;
  // };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem("user");
  };

  const value = {
    currentUser,
    login,
    register,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};

export default AuthContext;
