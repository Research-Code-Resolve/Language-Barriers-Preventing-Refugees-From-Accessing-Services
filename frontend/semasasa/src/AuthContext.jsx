import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("semasasaUser");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const signup = (userData) => {
    const existingAccount = localStorage.getItem("semasasaAccount");

    if (existingAccount) {
      const account = JSON.parse(existingAccount);

      if (account.email === userData.email) {
        return {
          success: false,
          message: "An account with this email already exists.",
        };
      }
    }

    const account = {
      name: userData.name,
      email: userData.email,
      language: userData.language,
      role: "Service Provider",
      password: userData.password,
    };

    localStorage.setItem(
      "semasasaAccount",
      JSON.stringify(account)
    );

    const loggedInUser = {
      name: account.name,
      email: account.email,
      language: account.language,
      role: account.role,
    };

    localStorage.setItem(
      "semasasaUser",
      JSON.stringify(loggedInUser)
    );

    setUser(loggedInUser);

    return { success: true };
  };

  const login = (email, password) => {
    const savedAccount = localStorage.getItem("semasasaAccount");

    if (!savedAccount) {
      return {
        success: false,
        message: "No account found. Please sign up first.",
      };
    }

    const account = JSON.parse(savedAccount);

    if (
      account.email !== email ||
      account.password !== password
    ) {
      return {
        success: false,
        message: "Incorrect email or password.",
      };
    }

    const loggedInUser = {
      name: account.name,
      email: account.email,
      language: account.language,
      role: account.role,
    };

    localStorage.setItem(
      "semasasaUser",
      JSON.stringify(loggedInUser)
    );

    setUser(loggedInUser);

    return { success: true };
  };

  const updateUser = (updatedData) => {
    const updatedUser = {
      ...user,
      ...updatedData,
    };

    setUser(updatedUser);

    localStorage.setItem(
      "semasasaUser",
      JSON.stringify(updatedUser)
    );

    const savedAccount = localStorage.getItem("semasasaAccount");

    if (savedAccount) {
      const account = JSON.parse(savedAccount);

      localStorage.setItem(
        "semasasaAccount",
        JSON.stringify({
          ...account,
          ...updatedData,
        })
      );
    }
  };

  const logout = () => {
    localStorage.removeItem("semasasaUser");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        signup,
        login,
        updateUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}