import React, { useContext } from "react";
import { ImageWithBasePath } from "../../components/ImageWithBasePath";
import { notification } from "antd";
import { HubspotAuth } from "../../components/HubspotAuth";
import { SigneasyAuth } from "../../components/SigneasyAuth";
import { AppContext } from "../_app";

const Authorize = () => {
  const [api, contextHolder] = notification.useNotification();
  const { hubSpotAuth } = useContext(AppContext);

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
          <HubspotAuth api={api} />
          {hubSpotAuth?.success && <SigneasyAuth api={api} />}
        </div>
      </div>
    </>
  );
};

export default Authorize;
