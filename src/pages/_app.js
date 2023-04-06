import { createContext, useState } from "react";
import "../../styles/globals.css";
import { useLocalStorage } from "../hooks/useLocalStorage";

export const AppContext = createContext();

function MyApp({ Component, pageProps }) {
  const [selectedItem, setSelectedItem] = useState({});
  const [docParams, setDocParams] = useLocalStorage("docParams", {
    authId: "",
    objectId: "",
    objectType: "",
    firstName: "",
    lastName: "",
    email: "",
  });
  const [JWTtoken, setJWTtoken] = useLocalStorage("JWTtoken", "");
  return (
    <AppContext.Provider
      value={{
        selectedItem,
        setSelectedItem,
        docParams,
        setDocParams,
        JWTtoken,
        setJWTtoken,
      }}
    >
      <Component {...pageProps} />
    </AppContext.Provider>
  );
}

export default MyApp;
