import React, { useState, useEffect, useContext } from "react";
import { deleteApi } from "../api/apiMethods";
import { openNotification, popupHandler } from "../utils/functions";
import { AUTH_REDIRECTION_URL } from "../constants/constants";
import { AuthLabels } from "./AuthLabels";
import { RevokeButton } from "./RevokeButton";
import { AuthorizeButton } from "./AuthorizeButton";
import { AppContext } from "./Layout";
import { ErrorPage } from "./ErrorPage";

export const HubspotAuth = ({ api }) => {
  const [hubspotPopup, setHubspotPopup] = useState(null);
  const { hubSpotAuth, setHubspotAuth } = useContext(AppContext);
  const [revokeLoader, setRevokeLoader] = useState(false);

  const revokeHandler = async ({ endUrl }) => {
    setRevokeLoader(true);
    const params = {
      hubspot_user_id: hubSpotAuth?.userId,
      hubspot_portal_id: hubSpotAuth?.portalId,
    };
    const data = await deleteApi({ endUrl, params });
    if (data?.is_success) {
      setHubspotAuth((prev) => ({ ...prev, success: false }));
      setRevokeLoader(false);
      openNotification({
        api,
        message: "success",
        description: "Authorization to hubspot revoked successfully",
      });
    }
  };

  const hubSpotAuthHandler = async () => {
    const popup = await popupHandler({
      url: `${process.env.NEXT_PUBLIC_BASE_URL}oauth/hubspot/sign-in?redirect_uri=${AUTH_REDIRECTION_URL}/`,
    });
    setHubspotPopup(popup);
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
      const userId = searchParams?.get("hubspot_user_id");
      const portalId = searchParams?.get("hubspot_portal_id");
      if (status === "success") {
        setHubspotAuth((prev) => ({
          ...prev,
          success: true,
          userId,
          portalId,
        }));
        setHubspotPopup(null);
        popup.close();
        timer && clearInterval(timer);
      }
    }, 500);
  };

  useEffect(() => {
    popupObserver({ popup: hubspotPopup });
  }, [hubspotPopup]);

  return (
    <div className="flex flex-col items-center">
      <AuthLabels
        imageName={"hubSpotIcon"}
        title="HubSpot"
        imageClass="p-[12px]"
      />
      {hubSpotAuth?.success ? (
        <RevokeButton
          onClick={() =>
            revokeHandler({
              endUrl: "hubspot/revoke",
            })
          }
          loading={revokeLoader}
        />
      ) : (
        <AuthorizeButton onClick={hubSpotAuthHandler} />
      )}
    </div>
  );
};
