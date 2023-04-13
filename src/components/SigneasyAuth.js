import React, { useState, useEffect, useContext } from "react";
import { openNotification, popupHandler } from "../utils/functions";
import { AUTH_BASE_URL, AUTH_REDIRECTION_URL } from "../constants/constants";
import { AuthLabels } from "./AuthLabels";
import { RevokeButton } from "./RevokeButton";
import { AuthorizeButton } from "./AuthorizeButton";
import { deleteApi } from "../api/apiMethods";
import { AppContext } from "../pages/_app";

export const SigneasyAuth = ({ api }) => {
  const { hubSpotAuth } = useContext(AppContext);
  const [signeasyPopup, setSigneasyPopup] = useState(null);
  const [signeasyAuth, setSigneasyAuth] = useState({
    success: false,
    redirectionUrl: "",
  });
  const [revokeLoader, setRevokeLoader] = useState(false);

  const revokeHandler = async ({ endUrl }) => {
    setRevokeLoader(true);
    const params = {
      hubspot_user_id: hubSpotAuth?.userId,
      hubspot_portal_id: hubSpotAuth?.portalId,
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
    const popup = await popupHandler({
      url: `${AUTH_BASE_URL}signeasy/sign-in?redirect_uri=${AUTH_REDIRECTION_URL}&hubspot_user_id=${hubSpotAuth?.userId}&hubspot_portal_id=${hubSpotAuth?.portalId}`,
    });
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
        setLoading(true);
        setSigneasyPopup(null);
      }
      popup.close();
      timer && clearInterval(timer);
    }, 500);
  };

  useEffect(() => {
    popupObserver({ popup: signeasyPopup });
  }, [signeasyPopup]);

  useEffect(() => {
    if (signeasyAuth?.redirectionUrl !== "") {
      location && location?.assign(signeasyAuth?.redirectionUrl);
    }
  }, [signeasyAuth?.redirectionUrl]);

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
