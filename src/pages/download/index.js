import React, { useEffect, useState } from "react";
import { getApi } from "../../api/apiMethods";
import { openNotification } from "../../utils/functions";
import axios from "axios";
import { Loader } from "../../components/Loader";
import { notification } from "antd";
import jwt_decode from "jwt-decode";

const Download = () => {
  const [loading, setLoading] = useState(true);
  const [browserWindow, setBrowserWindow] = useState();
  const [api, contextHolder] = notification.useNotification();

  const getSignedFileId = async (envelopeId, JWTtoken) => {
    const data = await axios({
      method: "get",
      url: `https://api.signeasy.com/v3/rs/envelope/signed/pending/${envelopeId}`,
      headers: {
        //"x-access-token": JWTtoken,
        "Authorization": `Bearer ${jwt_decode(JWTtoken).signeasy_access_token}`
      },
    }).catch((err) => {
      openNotification({
        message: "Error",
        description: err.message,
        type: "error",
        api,
      });
    });
    return data;
  };

  const pdfDownloadHandler = async (data, name) => {
    const blob = new Blob([data?.data], { type: "application/pdf" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${name.replace('.pdf', '')}_${type}.pdf`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const originalDownloadHandler = async (envelope_id, JWTtoken) => {
    setLoading(true);
    const signed_file = await getSignedFileId(envelope_id, JWTtoken);
    const signed_file_id = signed_file?.data?.id;
    const name = signed_file?.data?.name;
    await axios({
      method: "get",
      url: `https://api.signeasy.com/v3/signed/${signed_file_id}/download?type=merged&include_certificate=false`,
      headers: {
        Authorization: `Bearer ${jwt_decode(JWTtoken).signeasy_access_token}`,
      },
      responseType: 'blob'
    })
      .then(async (data) => {
        await pdfDownloadHandler(data, name, 'signed');
        window.parent.postMessage(JSON.stringify({ action: "DONE" }), "*");
      })
      .catch((err) => {
        openNotification({
          message: "Error",
          description: err.message,
          type: "error",
          api,
        });
      });
    setLoading(false);
    window.parent.postMessage(JSON.stringify({ action: "DONE" }), "*");
  };

  const certificateDownloadHandler = async (envelope_id, JWTtoken) => {
    setLoading(true);
    const signed_file = await getSignedFileId(envelope_id, JWTtoken);
    const signed_file_id = signed_file?.data?.id;
    const name = signed_file?.data?.name;
    await axios({
      method: "get",
      url: `https://api.signeasy.com/v3/rs/envelope/signed/${signed_file_id}/certificate`,
      headers: {
        Authorization: `Bearer ${jwt_decode(JWTtoken).signeasy_access_token}`,
      },
      responseType: 'blob'
    })
      .then(async (data) => {
        await pdfDownloadHandler(data, name, 'certificate');
        window.parent.postMessage(JSON.stringify({ action: "DONE" }), "*");
      })
      .catch((err) => {
        openNotification({
          message: "Error",
          description: err.message,
          type: "error",
          api,
        });
      });
    setLoading(false);
    window.parent.postMessage(JSON.stringify({ action: "DONE" }), "*");
  };

  const documentWithCertificateDownloadHandler = async (
    envelope_id,
    JWTtoken
  ) => {
    setLoading(true);
    const signed_file = await getSignedFileId(envelope_id, JWTtoken);
    const signed_file_id = signed_file?.data?.id;
    const name = signed_file?.data?.name;
    await axios({
      method: "get",
      url: `https://api.signeasy.com/v3/signed/${signed_file_id}/download?type=merged&include_certificate=true`,
      headers: {
        Authorization: `Bearer ${jwt_decode(JWTtoken).signeasy_access_token}`,
      },
      responseType: 'blob'
    })
      .then(async (data) => {
        await pdfDownloadHandler(data, name, 'certificate_with_signed');
        window.parent.postMessage(JSON.stringify({ action: "DONE" }), "*");
      })
      .catch((err) => {
        openNotification({
          message: "Error",
          description: err.message,
          type: "error",
          api,
        });
      });
    setLoading(false);
  };

  const tokenHandler = async () => {
    let apiData = {};
    const currentUrl = window.location.href;
    const searchParams = new URL(currentUrl).searchParams;
    const authId = searchParams?.get("authId");
    const object = searchParams?.get("object");
    const enevelope_id = searchParams?.get("envelope_id");
    await getApi({
      endUrl: `set-up/auth?authId=${authId}`,
    })
      .then(async (data) => {
        if (object === "envelope") {
          await originalDownloadHandler(enevelope_id, data?.token);
        } else if (object === "envelope-certificate") {
          await documentWithCertificateDownloadHandler(
            enevelope_id,
            data?.token
          );
        } else if (object === "certificate") {
          await certificateDownloadHandler(enevelope_id, data?.token);
        }
       // window.parent.postMessage(JSON.stringify({ action: "DONE" }), "*");
      })
      .catch((err) => {
        openNotification({
          message: "Error",
          description: err.message,
          type: "error",
          api,
        });
        setLoading(false);
      });
    return apiData;
  };

  useEffect(() => {
    browserWindow && tokenHandler();
  }, [browserWindow]);

  useEffect(() => {
    setBrowserWindow(window);
  }, []);

  return (
    <>
      {contextHolder}
      {loading ? <Loader /> : <div></div>}
    </>
  );
};

export default Download;
