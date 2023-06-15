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
  const [JWTtoken, setJWTtoken] = useLocalStorage(
    "JWTtoken",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiaHVic3BvdF91c2VyX2lkIjo0OTc5MjcyMiwiaHVic3BvdF9wb3J0YWxfaWQiOjI0MDUwNTAzLCJzaWduZWFzeV9hY2Nlc3NfdG9rZW4iOiJleUpoYkdjaU9pSlNVekkxTmlJc0luUjVjQ0k2SWtwWFZDSXNJbXRwWkNJNklqZE1MWFowVkROaU4ycFljMkkyY1VaakxWQmhOeUo5LmV5Sm9kSFJ3Y3pvdkwzTnBaMjVsWVhONUxtTnZiUzlsYldGcGJDSTZJbUZ1YTJsMFFIUnBiR2xqYUc4dWFXNGlMQ0pvZEhSd2N6b3ZMM05wWjI1bFlYTjVMbU52YlM5MWMyVnlYMmxrSWpvaU1UQTNNemM0TnpZaUxDSm9kSFJ3Y3pvdkwzTnBaMjVsWVhONUxtTnZiUzkwWlhOMFgyMXZaR1VpT2lJeElpd2lhSFIwY0hNNkx5OXphV2R1WldGemVTNWpiMjB2YVhOZmRYTmxjbDlwYlhCdmNuUmxaQ0k2Wm1Gc2MyVXNJbWgwZEhCek9pOHZjMmxuYm1WaGMza3VZMjl0TDJ4dloybHVYMk52ZFc1MElqb3pNaXdpYUhSMGNITTZMeTl6YVdkdVpXRnplUzVqYjIwdmMyOTFjbU5sSWpvaVpXMWhhV3dpTENKcGMzTWlPaUpvZEhSd2N6b3ZMMkYxZEdndWMybG5ibVZoYzNrdVkyOXRMeUlzSW5OMVlpSTZJbUYxZEdnd2ZEWXpaV1JqTURWa016QXpNbVZsTVRobU1qVXdNV1ZpWkNJc0ltRjFaQ0k2SW1oMGRIQnpPaTh2WVhCcExXVjRkQzV6YVdkdVpXRnplUzVqYjIwdklpd2lhV0YwSWpveE5qZzJOVFF5T0RjeExDSmxlSEFpT2pFMk9Ea3hNelE0TnpFc0ltRjZjQ0k2SWtKNk1ESjRibmxpVEV4SGFEZHRkblJuUlU4MFJGbFNaSFZoV0ZGQ1RsQnhJaXdpYzJOdmNHVWlPaUp5Y3pwamNtVmhkR1VnY25NNmRYQmtZWFJsSUc5eWFXZHBibUZzT25KbFlXUWdiM0pwWjJsdVlXdzZZM0psWVhSbElHOXlhV2RwYm1Gc09uVndaR0YwWlNCemFXZHVaV1E2Y21WaFpDQnphV2R1WldRNlkzSmxZWFJsSUhOcFoyNWxaRHAxY0dSaGRHVWdkWE5sY2pweVpXRmtJR1pwYkdWek9uSmxZV1FnZFhObGNqcGpjbVZoZEdVZ2RHVnRjR3hoZEdVNmJXRnVZV2RsSUhKek9uTnBaMjVwYm1kMWNtd2djbk02Y21WaFpDQnZabVpzYVc1bFgyRmpZMlZ6Y3lKOS5OTjluYkY5eG5nUzk5UDhuV2p2QWh1bnhpUFVZVEhlbmZZbGIxem9tVVRycjRPV3dXUEdja2JlMUQwMEo1NFNHeENuN0xQTWhic2tEWWNMRE1HOEFfaEtOVF9ycXJNY1BkWVdFX2oxWVRncGhaZlJ4MG1VRmtiME5URHZIZU9vTUtmczZiUnEtcnFOVm10aUhHQnN2UmVsOGZBMzBLVFlvd3JmY3BOaXV6UlNMYmVid3FTeWl0NjYyQ3JfelhRckdYQXN5WEo4elZfOUpGM1Q1YnV1S3EzS2luc3V3dTJQOGtOVjNnZmM3RGJfVUhDOEVnQW4xSy1SNUg5LUZfVVd6MWxSejhiUGJ4Tlp4MFp4bDNNcXVGWVdPNmtPMnZDUmNCMW9oZFhYdVJiSVNPWjhNTjBjTmhjQk1PVlZwbDFhN0hQaUduM2w3UnExZmlOM0hVdF9jVVEiLCJpYXQiOjE2ODY4MTk0MjQsImV4cCI6MTY4NjgyNjYyNH0.VZccHSleYXs-29p6gxPcAKfcflQ9ZpeMAMOKhnXe2js"
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
      {children}
    </AppContext.Provider>
  );
};
