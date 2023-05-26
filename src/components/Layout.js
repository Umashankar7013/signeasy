import React, { createContext, useState } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";

export const AppContext = createContext();

export const Layout = ({ children }) => {
  const [selectedItem, setSelectedItem] = useState({});
  const [docParams, setDocParams] = useLocalStorage("docParams", {
    authId: "",
    objectId: "",
    objectType: "",
    firstName: "",
    lastName: "",
    email: "",
    name: "",
  });
  const [JWTtoken, setJWTtoken] = useLocalStorage("JWTtoken", "");
  const [hubSpotAuth, setHubspotAuth] = useState({
    success: false,
    userId: "",
    portalId: "",
  });
  const [tabsDropdownData, setTabsDropdownData] = useState({});

  return (
    <AppContext.Provider
      value={{
        selectedItem,
        setSelectedItem,
        docParams,
        setDocParams,
        JWTtoken,
        setJWTtoken,
        hubSpotAuth,
        setHubspotAuth,
        tabsDropdownData,
        setTabsDropdownData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
