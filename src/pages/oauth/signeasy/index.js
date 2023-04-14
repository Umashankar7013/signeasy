import React from "react";
import { SigneasyAuth } from "../../../components/SigneasyAuth";
import { notification } from "antd";
import { SIGNEASY_REDIRECTION_URL } from "../../../constants/constants";

const SigneasyAuthPage = () => {
  const [api, contextHolder] = notification.useNotification();
  return (
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
