import { createContext, useState } from "react";
import "../../styles/globals.css";

export const AppContext = createContext();

function MyApp({ Component, pageProps }) {
  const [selectedItem, setSelectedItem] = useState({});
  return (
    <AppContext.Provider
      value={{
        selectedItem,
        setSelectedItem,
      }}
    >
      <Component {...pageProps} />
    </AppContext.Provider>
  );
}

export default MyApp;
