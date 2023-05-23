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
    name: "",
  });
  const [JWTtoken, setJWTtoken] = useLocalStorage(
    "JWTtoken",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodWJzcG90X3VzZXJfaWQiOjQ5NzkyNzIyLCJodWJzcG90X3BvcnRhbF9pZCI6MjQwNTA1MDMsInNpZ25lYXN5X2FjY2Vzc190b2tlbiI6ImV5SmhiR2NpT2lKU1V6STFOaUlzSW5SNWNDSTZJa3BYVkNJc0ltdHBaQ0k2SWpkTUxYWjBWRE5pTjJwWWMySTJjVVpqTFZCaE55SjkuZXlKb2RIUndjem92TDNOcFoyNWxZWE41TG1OdmJTOWxiV0ZwYkNJNkltRnVhMmwwUUhScGJHbGphRzh1YVc0aUxDSm9kSFJ3Y3pvdkwzTnBaMjVsWVhONUxtTnZiUzkxYzJWeVgybGtJam9pTVRBM016YzROellpTENKb2RIUndjem92TDNOcFoyNWxZWE41TG1OdmJTOTBaWE4wWDIxdlpHVWlPaUl4SWl3aWFIUjBjSE02THk5emFXZHVaV0Z6ZVM1amIyMHZhWE5mZFhObGNsOXBiWEJ2Y25SbFpDSTZabUZzYzJVc0ltaDBkSEJ6T2k4dmMybG5ibVZoYzNrdVkyOXRMMnh2WjJsdVgyTnZkVzUwSWpveU5pd2lhSFIwY0hNNkx5OXphV2R1WldGemVTNWpiMjB2YzI5MWNtTmxJam9pWlcxaGFXd2lMQ0pwYzNNaU9pSm9kSFJ3Y3pvdkwyRjFkR2d1YzJsbmJtVmhjM2t1WTI5dEx5SXNJbk4xWWlJNkltRjFkR2d3ZkRZelpXUmpNRFZrTXpBek1tVmxNVGhtTWpVd01XVmlaQ0lzSW1GMVpDSTZJbWgwZEhCek9pOHZZWEJwTFdWNGRDNXphV2R1WldGemVTNWpiMjB2SWl3aWFXRjBJam94TmpnME56UTJOREEyTENKbGVIQWlPakUyT0Rjek16ZzBNRFlzSW1GNmNDSTZJa0o2TURKNGJubGlURXhIYURkdGRuUm5SVTgwUkZsU1pIVmhXRkZDVGxCeElpd2ljMk52Y0dVaU9pSnljenBqY21WaGRHVWdjbk02ZFhCa1lYUmxJRzl5YVdkcGJtRnNPbkpsWVdRZ2IzSnBaMmx1WVd3NlkzSmxZWFJsSUc5eWFXZHBibUZzT25Wd1pHRjBaU0J6YVdkdVpXUTZjbVZoWkNCemFXZHVaV1E2WTNKbFlYUmxJSE5wWjI1bFpEcDFjR1JoZEdVZ2RYTmxjanB5WldGa0lHWnBiR1Z6T25KbFlXUWdkWE5sY2pwamNtVmhkR1VnZEdWdGNHeGhkR1U2YldGdVlXZGxJSEp6T25OcFoyNXBibWQxY213Z2NuTTZjbVZoWkNCdlptWnNhVzVsWDJGalkyVnpjeUo5LjhPWHp5dVVJR0hZVzJSMjQ2VnQweGVWYl9rX2pCc0REcEdsRi1tbDV6NXZXaS1EYTN4WGlpdUdzU3poQzNIZmVfcnhkT2xjTHZOWUlINkw1ZE0xckoxS2xPakRJOExHekFlV21LNTl4YkVkSVNOSjdzWWRXTWZNcjRTUGU5cDBidkk3SlB1bmFINE9IYURDUGI5TGJHVWEtYVdwbjFNV09kTXYtWEVEb2QyWUk2WnhDbzFJdWlNQjg5WkNzYXh3SHlnZVhnSGk5UnFId1RXMEdGcUJPVmZLUGtrRFlmSElQbUpIV19DY3YwZm1CRTI4TjE3Y0dVeV84OFBqY3c2UmxFRGR1MXJLRFM0TGVCa2p4ZXJIZFI0aU1fT0pzNW5wclhHaVlEVjh5ZHdhVC0yRDZjRTFIdWpIVlNhdnhKLUUtQjZfVXpPbGxKSnZkQk1VcEwxbU8tdyIsImlhdCI6MTY4NDgxNTUwOCwiZXhwIjoxNjg0ODIyNzA4fQ.gB9XYvIB2xPBWROVn5yljzU5OetMS2kZ4CJgOJq2k1U"
  );
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
      <Component {...pageProps} />
    </AppContext.Provider>
  );
}

export default MyApp;
