import axios from "axios";
import React, { useState, useEffect, useRef } from "react";
import { AuthLabels } from "../../components/AuthLabels";
import { AuthorizeButton } from "../../components/AuthorizeButton";
import { ImageWithBasePath } from "../../components/ImageWithBasePath";
import { PrimaryButton } from "../../components/PrimaryButton";
import { RevokeButton } from "../../components/RevokeButton";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { popupHandler } from "../../utils/functions";

const Authorize = () => {
  const [hubspotPopup, setHubspotPopup] = useState(null);
  const [signeasyPopup, setSigneasyPopup] = useState(null);
  const [hubSpotAuth, setHubspotAuth] = useLocalStorage("hubSpotAuth", {
    success: false,
    userId: "",
    portalId: "",
  });
  const [signeasyAuth, setSigneasyAuth] = useLocalStorage("signeasyAuth", {
    success: false,
  });
  const redirectUri = "https://signeasy.vercel.app/Authorize";

  const revokeHandler = async ({ url, name }) => {
    await axios({
      method: "delete",
      url,
      params: {
        hubspot_user_id: hubSpotAuth?.userId,
        hubspot_portal_id: hubSpotAuth?.portalId,
      },
    }).then((response) => {
      if (response?.data?.is_success) {
        if (name === "hubspot") {
          setHubspotAuth((prev) => ({ ...prev, success: false }));
        } else {
          setSigneasyAuth((prev) => ({ ...prev, success: false }));
        }
      }
    });
  };

  const hubSpotAuthHandler = async () => {
    const popup = await popupHandler({
      url: `https://api-stg-hubspot-signeasy.tilicho.in/api/v1/oauth/hubspot/sign-in?redirect_uri=${redirectUri}/`,
    });
    setHubspotPopup(popup);
  };

  const signeasyAuthHandler = async () => {
    const popup = await popupHandler({
      url: `https://api-stg-hubspot-signeasy.tilicho.in/api/v1/oauth/signeasy/sign-in?redirect_uri=${redirectUri}&hubspot_user_id=${hubSpotAuth?.userId}&hubspot_portal_id=${hubSpotAuth?.portalId}`,
    });
    setSigneasyPopup(popup);
  };

  const popupObserver = ({ popup, name }) => {
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
        if (name === "hubspot") {
          setHubspotAuth((prev) => ({
            ...prev,
            success: true,
            userId,
            portalId,
          }));
          setHubspotPopup(null);
        } else {
          setSigneasyAuth((prev) => ({ ...prev, success: true }));
          setSigneasyPopup(null);
        }
        popup.close();
        timer && clearInterval(timer);
      }
    }, 500);
  };

  useEffect(() => {
    popupObserver({ popup: hubspotPopup, name: "hubspot" });
  }, [hubspotPopup]);

  useEffect(() => {
    popupObserver({ popup: signeasyPopup });
  }, [signeasyPopup]);

  return (
    <div className="w-[100vw] h-[100vh] flex flex-col items-center">
      <div className="flex items-start pt-[30px]">
        <div className="text-[24px] pr-[20px] font-inter font-[500]">
          Authorize
        </div>
        <ImageWithBasePath src="openLockIcon" height={30} width={30} alt="" />
      </div>
      <div className="md:flex w-[100%] justify-around">
        {/* // HubSpot */}
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
                  url: "https://api-stg-hubspot-signeasy.tilicho.in/api/v1/oauth/hubspot/revoke",
                  name: "hubspot",
                })
              }
            />
          ) : (
            <AuthorizeButton onClick={hubSpotAuthHandler} />
          )}
        </div>
        {/* // signeasy */}
        {hubSpotAuth?.success && (
          <div className="flex flex-col items-center">
            <AuthLabels
              imageName={"signeasyIcon"}
              imageDetails={{ height: 75, width: 75 }}
              title="Signeasy"
            />
            {signeasyAuth?.success ? (
              <RevokeButton
                onClick={() =>
                  revokeHandler({
                    url: "https://api-stg-hubspot-signeasy.tilicho.in/api/v1/oauth/signeasy/revoke",
                  })
                }
              />
            ) : (
              <AuthorizeButton onClick={signeasyAuthHandler} />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Authorize;
