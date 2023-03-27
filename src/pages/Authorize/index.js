import axios from "axios";
import React, { useState, useEffect } from "react";
import OauthPopup from "react-oauth-popup";
import { ImageWithBasePath } from "../../components/ImageWithBasePath";
import { PrimaryButton } from "../../components/PrimaryButton";

const Authorize = () => {
  const [authorized, setAuthorized] = useState({
    hubSpot: false,
    signeasy: false,
  });
  const [externalPopup, setExternalPopup] = useState(null);
  const [authUrl, setAuthUrl] = useState("");

  const hubSpotAuthHandler = async () => {
    await axios
      .get("https://13.235.22.210/api/v1/oauth/hubspot/sign-in")
      .then((response) => {
        setAuthUrl(response?.data?.data?.url);

        // if (window) {
        //   const width = 500;
        //   const height = 400;
        //   const left = window.screenX + (window.outerWidth - width) / 2;
        //   const top = window.screenY + (window.outerHeight - height) / 2.5;
        //   const title = "hubspot_auth";
        //   const popup = window.open(
        //     authUrl,
        //     title,
        //     `width=${width},height=${height},left=${left},top=${top}`
        //   );
        //   console.log(popup?.location, "uma");
        //   setExternalPopup(popup);
        // }
      })
      .catch((e) => console.log(e));
  };

  useEffect(() => {
    if (!externalPopup) {
      return;
    }

    const timer = setInterval(() => {
      if (!externalPopup) {
        timer && clearInterval(timer);
        return;
      }
      const currentUrl = externalPopup.location.href;
      if (!currentUrl) {
        return;
      }
      const searchParams = new URL(currentUrl).searchParams;
      const code = searchParams.get("code");
      if (code) {
        externalPopup.close();
        console.log(`The popup URL has URL code param = ${code}`);
        YourApi.endpoint(code)
          .then(() => {
            // change UI to show after the code was stored
            console.log("Success");
          })
          .catch(() => {
            // API error
            console.log("error");
          })
          .finally(() => {
            // clear timer at the end
            setExternalPopup(null);
            timer && clearInterval(timer);
          });
      }
    }, 500);
  }, [externalPopup]);

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
          {authorized?.hubSpot ? (
            <div>
              <div className="text-[green] font-inter text-center pb-[10px]">
                Authorized Succesfully
              </div>
              <PrimaryButton
                title="Revoke"
                className="w-[250px] border-[red]"
                titleClassName="py-[5px] text-[red]"
                onClick={() =>
                  setAuthorized((prev) => ({ ...prev, hubSpot: false }))
                }
              />
            </div>
          ) : (
            <OauthPopup
              url={authUrl}
              onClose={() => console.log("popup closed")}
              onCode={(code, params) => {
                console.log(code, params, "uma");
              }}
            >
              <PrimaryButton
                title="Authorize"
                className="w-[250px] border-[#1088E7]"
                titleClassName="py-[5px] text-[#1088E7]"
                onClick={hubSpotAuthHandler}
              />
            </OauthPopup>
          )}
        </div>
        {/* // signeasy */}
        {authorized?.hubSpot && (
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
            {authorized?.signeasy ? (
              <div>
                <div className="text-[green] font-inter text-center pb-[10px]">
                  Authorized Succesfully
                </div>
                <PrimaryButton
                  title="Revoke"
                  className="w-[250px] border-[red]"
                  titleClassName="py-[5px] text-[red]"
                  onClick={() =>
                    setAuthorized((prev) => ({ ...prev, signeasy: false }))
                  }
                />
              </div>
            ) : (
              <PrimaryButton
                title="Authorize"
                className="w-[250px] border-[#1088E7]"
                titleClassName="py-[5px] text-[#1088E7]"
                onClick={() =>
                  setAuthorized((prev) => ({ ...prev, signeasy: true }))
                }
              />
            )}
          </div>
        )}

        {/* <OauthPopup
          url="http://FriendlyMultiNationalTechConglomerate.com"
          // onCode={onCode}
          // onClose={onClose}
        >
          <div>Click me to open a Popup</div>
        </OauthPopup> */}
      </div>
    </div>
  );
};

export default Authorize;
