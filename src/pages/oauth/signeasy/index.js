import React, { useEffect, useState } from "react";
import { SigneasyAuth } from "../../../components/SigneasyAuth";
import { notification } from "antd";
import { SIGNEASY_REDIRECTION_URL } from "../../../constants/constants";
import { ErrorPage } from "../../../components/ErrorPage";

const SigneasyAuthPage = () => {
  const [api, contextHolder] = notification.useNotification();
  const [browserWindow, setBrowserWindow] = useState();

  useEffect(() => {
    setBrowserWindow(window);
  }, []);

  return typeof browserWindow?.localStorage === "undefined" ? (
    <ErrorPage />
  ) : (
    <>
      {contextHolder}
      <SigneasyAuth
        api={api}
        redirectionUrl={SIGNEASY_REDIRECTION_URL}
        onlySigneasy={true}
        openInPopup={false}
      />
    </>
  );
};

export default SigneasyAuthPage;
