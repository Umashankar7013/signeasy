import React, { useState, useEffect } from "react";
import { deleteApi } from "../../api/apiMethods";
import { AuthLabels } from "../../components/AuthLabels";
import { AuthorizeButton } from "../../components/AuthorizeButton";
import { ImageWithBasePath } from "../../components/ImageWithBasePath";
import { RevokeButton } from "../../components/RevokeButton";
import { AUTH_BASE_URL, AUTH_REDIRECTION_URL } from "../../constants/constants";
import { openNotification, popupHandler } from "../../utils/functions";
import { notification } from "antd";

const Authorize = () => {
  const [hubspotPopup, setHubspotPopup] = useState(null);
  const [signeasyPopup, setSigneasyPopup] = useState(null);
  const [hubSpotAuth, setHubspotAuth] = useState({
    success: false,
    userId: "",
    portalId: "",
  });
  const [signeasyAuth, setSigneasyAuth] = useState({
    success: false,
  });
  const [revokeLoader, setRevokeLoader] = useState({
    hubspot: false,
    signeasy: false,
  });
  const [api, contextHolder] = notification.useNotification();

  const revokeHandler = async ({ endUrl, name }) => {
    if (name === "hubspot") {
      setRevokeLoader((prev) => ({ ...prev, hubspot: true }));
    } else {
      setRevokeLoader((prev) => ({ ...prev, signeasy: true }));
    }
    const params = {
      hubspot_user_id: hubSpotAuth?.userId,
      hubspot_portal_id: hubSpotAuth?.portalId,
    };
    const data = await deleteApi({ endUrl, params });
    if (data?.is_success) {
      if (name === "hubspot") {
        setHubspotAuth((prev) => ({ ...prev, success: false }));
        setRevokeLoader((prev) => ({ ...prev, hubspot: false }));
        openNotification({
          api,
          message: "success",
          description: "Authorization to hubspot revoked successfully",
        });
      } else {
        setSigneasyAuth((prev) => ({ ...prev, success: false }));
        setRevokeLoader((prev) => ({ ...prev, signeasy: false }));
        openNotification({
          api,
          message: "success",
          description: "Authhorization to signeasy revoked successfully",
        });
      }
    }
  };

  const hubSpotAuthHandler = async () => {
    const popup = await popupHandler({
      url: `${AUTH_BASE_URL}hubspot/sign-in?redirect_uri=${AUTH_REDIRECTION_URL}/`,
    });
    setHubspotPopup(popup);
  };

  const signeasyAuthHandler = async () => {
    const popup = await popupHandler({
      url: `${AUTH_BASE_URL}signeasy/sign-in?redirect_uri=${AUTH_REDIRECTION_URL}&hubspot_user_id=${hubSpotAuth?.userId}&hubspot_portal_id=${hubSpotAuth?.portalId}`,
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
      console.log(currentUrl);
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
        // popup.close();
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
    <>
      {contextHolder}
      <div className="w-[100vw] h-[100vh] flex flex-col items-center">
        <div className="flex items-start pt-[30px]">
          <div className="text-[24px] pr-[20px] font-inter font-[500]">
            Authorize
          </div>
          <ImageWithBasePath src="openLockIcon" height={30} width={30} />
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
                    endUrl: "hubspot/revoke",
                    name: "hubspot",
                  })
                }
                loading={revokeLoader?.hubspot}
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
                  loading={revokeLoader?.signeasy}
                />
              ) : (
                <AuthorizeButton onClick={signeasyAuthHandler} />
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Authorize;
