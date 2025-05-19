import { createContext, useContext, useState } from "react";

const API = "https://fsa-jwt-practice.herokuapp.com";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState();
  const [location, setLocation] = useState("GATE");

  // TODO: signup
  async function signup(name) {
    try {
      const response = await fetch(API + "/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: name,
        }),
      });
      const result = await response.json();
      setToken(result.token);
      setLocation("TABLET");
      console.log(result, "\n");

      // This will depend on the API you're actually working with
      return result.token;
    } catch (e) {
      console.error("oh no ;(");
    }
  }

  // TODO: authenticate
  async function authenticate(token) {
    try {
      const response = await fetch(API + "/authenticate", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const result = await response.json();
      setLocation("TUNNEL");
      return result;
    } catch (e) {
      console.error("Authentication issue:(");
    }
  }

  const value = { location, signup, authenticate };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw Error("useAuth must be used within an AuthProvider");
  return context;
}
