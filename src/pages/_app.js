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
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodWJzcG90X3VzZXJfaWQiOjQ5NzkyNzIyLCJodWJzcG90X3BvcnRhbF9pZCI6MjQwNTA1MDMsInNpZ25lYXN5X2FjY2Vzc190b2tlbiI6ImV5SmhiR2NpT2lKU1V6STFOaUlzSW5SNWNDSTZJa3BYVkNJc0ltdHBaQ0k2SWpkTUxYWjBWRE5pTjJwWWMySTJjVVpqTFZCaE55SjkuZXlKb2RIUndjem92TDNOcFoyNWxZWE41TG1OdmJTOWxiV0ZwYkNJNkltRnVhMmwwUUhScGJHbGphRzh1YVc0aUxDSm9kSFJ3Y3pvdkwzTnBaMjVsWVhONUxtTnZiUzkxYzJWeVgybGtJam9pTVRBM016YzROellpTENKb2RIUndjem92TDNOcFoyNWxZWE41TG1OdmJTOTBaWE4wWDIxdlpHVWlPaUl4SWl3aWFIUjBjSE02THk5emFXZHVaV0Z6ZVM1amIyMHZhWE5mZFhObGNsOXBiWEJ2Y25SbFpDSTZabUZzYzJVc0ltaDBkSEJ6T2k4dmMybG5ibVZoYzNrdVkyOXRMMnh2WjJsdVgyTnZkVzUwSWpveU15d2lhSFIwY0hNNkx5OXphV2R1WldGemVTNWpiMjB2YzI5MWNtTmxJam9pWlcxaGFXd2lMQ0pwYzNNaU9pSm9kSFJ3Y3pvdkwyRjFkR2d1YzJsbmJtVmhjM2t1WTI5dEx5SXNJbk4xWWlJNkltRjFkR2d3ZkRZelpXUmpNRFZrTXpBek1tVmxNVGhtTWpVd01XVmlaQ0lzSW1GMVpDSTZJbWgwZEhCek9pOHZZWEJwTFdWNGRDNXphV2R1WldGemVTNWpiMjB2SWl3aWFXRjBJam94Tmpnek56STBORFUwTENKbGVIQWlPakUyT0RZek1UWTBOVFFzSW1GNmNDSTZJa0o2TURKNGJubGlURXhIYURkdGRuUm5SVTgwUkZsU1pIVmhXRkZDVGxCeElpd2ljMk52Y0dVaU9pSnljenBqY21WaGRHVWdjbk02ZFhCa1lYUmxJRzl5YVdkcGJtRnNPbkpsWVdRZ2IzSnBaMmx1WVd3NlkzSmxZWFJsSUc5eWFXZHBibUZzT25Wd1pHRjBaU0J6YVdkdVpXUTZjbVZoWkNCemFXZHVaV1E2WTNKbFlYUmxJSE5wWjI1bFpEcDFjR1JoZEdVZ2RYTmxjanB5WldGa0lHWnBiR1Z6T25KbFlXUWdkWE5sY2pwamNtVmhkR1VnZEdWdGNHeGhkR1U2YldGdVlXZGxJSEp6T25OcFoyNXBibWQxY213Z2NuTTZjbVZoWkNCdlptWnNhVzVsWDJGalkyVnpjeUo5LkdEdUtyMXV3SWxyQ21fUTlpT1FPNDRHNkRMSDV4N1ZuOU1TclEzUU54R2pVTXVOdTBvbmU5TW9OWHpwalZDTG4tWXFod2hJTkdXbHluZHpVc1VXZ1lxVlpQV3NhTXFiM3NPVzZGdjNTVzE1R2dvRXduTm1UUGpXZWFSSE56d21WNGI0NUdjVnhwSzM5YjNhUUpMZDlHYXh0Q3lNTjVDLU4teDJjLV9GSVlLQnI0V1lJMFcwMFFDemFkS2gyQUtNMWkyRXdOV080UHNGbWstZndqd01Vd25SSjkzbFZRRFB0c1JDbUJzaXFlWVpIOFJ0SG5tMWQtcm01aHNHMVQwZVR0TUN6aFFLZ2hVNzg3bTlhbXZ3LVo3MzJtSzhDckZ6UEtqc3JiWW56a1hpazVMWDFCbDhyaXNiS0RydXNLTmluU3Q2a1lNbDlLYlA5S29BN05HT0NoZyIsImlhdCI6MTY4NDE0NDUyMCwiZXhwIjoxNjg0MTUxNzIwfQ.NHhfS8nTodg4-s7MVK5hK8Br7R2xrOv3n_sIOZxJhvQ"
  );
  const [hubSpotAuth, setHubspotAuth] = useState({
    success: false,
    userId: "",
    portalId: "",
  });
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
      }}
    >
      <Component {...pageProps} />
    </AppContext.Provider>
  );
}

export default MyApp;
