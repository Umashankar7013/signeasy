import axios from "axios";
import React, { useState, useEffect, useRef } from "react";
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
  const outputSearchParams = useRef(null);

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

  const popupObserver = (popup) => {
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
      outputSearchParams.current = new URL(currentUrl).searchParams;
      const status = outputSearchParams.current.get("status");
      console.log(
        outputSearchParams,
        outputSearchParams.current.get("status"),
        status === "success",
        "uma"
      );
      if (status === "success") {
        popup.close();
        timer && clearInterval(timer);
      }
    }, 500);
  };

  useEffect(() => {
    // if (!hubspotPopup) {
    //   return;
    // }
    // const timer = setInterval(() => {
    //   if (!hubspotPopup) {
    //     timer && clearInterval(timer);
    //     return;
    //   }
    //   const currentUrl = hubspotPopup.location.href;
    //   if (!currentUrl) {
    //     return;
    //   }
    //   const searchParams = new URL(currentUrl).searchParams;
    //   const status = searchParams.get("status");
    //   const userId = searchParams.get("hubspot_user_id");
    //   const portalId = searchParams.get("hubspot_portal_id");
    //   if (status === "success") {
    //     setHubspotAuth((prev) => ({
    //       ...prev,
    //       success: true,
    //       userId,
    //       portalId,
    //     }));
    //     hubspotPopup.close();
    //     setHubspotPopup(null);
    //     timer && clearInterval(timer);
    //   }
    // }, 500);
    popupObserver(hubspotPopup);
    if (outputSearchParams?.current) {
      setHubspotAuth((prev) => ({
        ...prev,
        success: true,
        userId,
        portalId,
      }));
    }
    console.log(outputSearchParams, "data");
  }, [hubspotPopup]);

  useEffect(() => {
    if (!signeasyPopup) {
      return;
    }
    const timer = setInterval(() => {
      if (!signeasyPopup) {
        timer && clearInterval(timer);
        return;
      }
      const currentUrl = signeasyPopup.location.href;
      if (!currentUrl) {
        return;
      }
      const searchParams = new URL(currentUrl).searchParams;
      const status = searchParams.get("status");
      if (status === "success") {
        setSigneasyAuth((prev) => ({
          ...prev,
          success: true,
        }));
        signeasyPopup.close();
        setSigneasyPopup(null);
        timer && clearInterval(timer);
      }
    }, 500);
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
          <div className="border-[1px] p-[12px] rounded-[8px] mt-[70px]">
            <ImageWithBasePath
              src="hubSpotIcon"
              height={50}
              width={50}
              alt=""
            />
          </div>
          <div className="text-[30px] font-inter font-bold pt-[30px]">
            HubSpot
          </div>
          <div className="text-[13px] pt-[60px] font-[600] pb-[30px] text-gray-400 font-inter">
            WE NEED PERMISSION TO ACCESS YOUR ACCOUNTS
          </div>
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
            <ImageWithBasePath
              src="signeasyIcon"
              height={75}
              width={75}
              alt=""
              className="border-[1px] rounded-[8px] mt-[70px]"
            />
            <div className="text-[30px] font-inter font-bold pt-[30px]">
              Signeasy
            </div>
            <div className="text-[13px] pt-[60px] font-[600] pb-[30px] text-gray-400 font-inter">
              WE NEED PERMISSION TO ACCESS YOUR ACCOUNTS
            </div>
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
