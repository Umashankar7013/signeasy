import React, { useState, useEffect, useContext } from "react";
import { openNotification, popupHandler } from "../utils/functions";
import { AuthLabels } from "./AuthLabels";
import { RevokeButton } from "./RevokeButton";
import { AuthorizeButton } from "./AuthorizeButton";
import { deleteApi } from "../api/apiMethods";
import { AppContext } from "./Layout";
import { ErrorPage } from "./ErrorPage";

export const SigneasyAuth = ({
  api,
  redirectionUrl,
  onlySigneasy,
  openInPopup = true,
}) => {
  const { hubSpotAuth } = useContext(AppContext);
  const [signeasyPopup, setSigneasyPopup] = useState(null);
  const [signeasyAuth, setSigneasyAuth] = useState({
    success: false,
    redirectionUrl: "",
  });
  const [revokeLoader, setRevokeLoader] = useState(false);
  const [hubspotCredentials, setHubspotCredentials] = useState(hubSpotAuth);
  const [browserWindow, setBrowserWindow] = useState();

  const revokeHandler = async ({ endUrl }) => {
    setRevokeLoader(true);
    const params = {
      hubspot_user_id: hubspotCredentials?.userId,
      hubspot_portal_id: hubspotCredentials?.portalId,
    };
    const data = await deleteApi({ endUrl, params });
    if (data?.is_success) {
      setSigneasyAuth((prev) => ({ ...prev, success: false }));
      setRevokeLoader(false);
      openNotification({
        api,
        message: "success",
        description: "Authhorization to signeasy revoked successfully",
      });
    }
  };

  const signeasyAuthHandler = async () => {
    let popup;
    let url = `${process.env.NEXT_PUBLIC_AUTH_BASE_URL}signeasy/sign-in?redirect_uri=${redirectionUrl}&hubspot_user_id=${hubspotCredentials?.userId}&hubspot_portal_id=${hubspotCredentials?.portalId}`;
    if (openInPopup) {
      popup = await popupHandler({
        url,
      });
    } else {
      popup = window && window.open(url, "_self");
    }
    setSigneasyPopup(popup);
  };

  const popupObserver = ({ popup }) => {
    if (!popup) {
      return;
    }
    const timer = setInterval(() => {
      if (!popup) {
        timer && clearInterval(timer);
        return;
      }
      const currentUrl = popup.location.href;
      if (!currentUrl) {
        return;
      }
      const searchParams = new URL(currentUrl).searchParams;
      const status = searchParams.get("status");
      const redirectionUrl = searchParams?.get("redirect_to");
      if (status === "success") {
        setSigneasyAuth((prev) => ({
          ...prev,
          success: true,
          redirectionUrl,
        }));
        setSigneasyPopup(null);
        popup.close();
        timer && clearInterval(timer);
      }
    }, 500);
  };

  useEffect(() => {
    if (browserWindow && onlySigneasy) {
      const currentUrl = window.location.href;
      const searchParams = new URL(currentUrl).searchParams;
      const userId = searchParams?.get("hubspot_user_id");
      const portalId = searchParams?.get("hubspot_portal_id");
      if (userId && portalId) {
        setHubspotCredentials((prev) => ({
          ...prev,
          userId,
          portalId,
        }));
      }
    }
  }, [browserWindow]);

  useEffect(() => {
    popupObserver({ popup: signeasyPopup });
  }, [signeasyPopup]);

  useEffect(() => {
    if (onlySigneasy && signeasyAuth?.success) {
      window &&
        window.parent.postMessage(JSON.stringify({ action: "DONE" }), "*");
    } else if (signeasyAuth?.redirectionUrl !== "" && signeasyAuth?.success) {
      location && location?.assign(signeasyAuth?.redirectionUrl);
    }
  }, [signeasyAuth]);

  useEffect(() => {
    setBrowserWindow(window);
  }, []);

  return (
    <>
      <div className="flex flex-col items-center">
        <AuthLabels
          imageName={"signeasyIcon"}
          imageDetails={{ height: 10, width: 74 }}
          title="Signeasy"
        />
        {signeasyAuth?.success ? (
          <RevokeButton
            onClick={() =>
              revokeHandler({
                endUrl: "signeasy/revoke",
              })
            }
            loading={revokeLoader}
          />
        ) : (
          <AuthorizeButton onClick={signeasyAuthHandler} />
        )}
      </div>
    </>
  );
};
