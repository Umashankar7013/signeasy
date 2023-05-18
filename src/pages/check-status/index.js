import {
  CheckOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  DownOutlined,
  EllipsisOutlined,
  StopOutlined,
} from "@ant-design/icons";
import classNames from "classnames";
import React, { useContext, useEffect, useRef, useState } from "react";
import { getApi, putMethod } from "../../api/apiMethods";
import { AppContext } from "../_app";
import moment from "moment/moment";
import { Loader } from "../../components/Loader";
import axios from "axios";
import { notification } from "antd";
import { openNotification } from "../../utils/functions";
import { SignersData } from "../../components/SignersData";
import jwt_decode from "jwt-decode";

const CheckStatus = () => {
  const statusData = [
    { title: "Waiting for others" },
    { title: "Completed" },
    {
      title: "Voided",
    },
    {
      title: "Declined",
    },
  ];
  const statusUtils = {
    completed: {
      icon: <CheckOutlined className="text-[15px]" />,
      color: "#3ead5e",
      subText: "Signed by",
      action: "Download",
    },
    declined: {
      icon: <CloseCircleOutlined className="text-[15px]" />,
      color: "#c85353",
      subText: "by",
      action: "Void",
    },
    voided: {
      icon: <StopOutlined className="text-[15px]" />,
      color: "#c85353",
      subText: "by",
      action: "Download",
    },
    pending: {
      icon: <ClockCircleOutlined className="text-[15px]" />,
      color: "#fea07c",
      subText: "for",
      action: "Send Reminder",
    },
  };
  const headerData = [
    { title: "Document Name", width: "40%" },
    { title: "Status", width: "20%" },
    { title: "Last Modified", width: "20%" },
    { title: "Actions", width: "20%" },
  ];
  const [sortedData, setSortedData] = useState([]);
  const [browserWindow, setBrowserWindow] = useState();
  const { setDocParams, setJWTtoken, JWTtoken, docParams } =
    useContext(AppContext);
  const docsData = useRef({});
  const [loading, setLoading] = useState(true);
  const [downloadDropdown, setDownloadDropdown] = useState({
    isVisible: false,
    envelop: {},
  });
  const [threeDotDropdown, setThreeDotDropdown] = useState({
    isVisible: false,
    envelop: {},
  });
  const [api, contextHolder] = notification.useNotification();
  const signersData = useRef([]);
  const [showSignersData, setShowSignersData] = useState(false);

  const statusHandler = (data) => {
    let status;
    let flag = 0;
    data?.recipients?.map((recipient) => {
      if (recipient?.status === "declined") {
        flag = 1;
        status = recipient?.status;
        return;
      }
    });
    if (flag === 0) return data?.status;
    else return status;
  };

  const statusSortHandler = (envelopes) => {
    const statusOrder = ["voided", "declined", "pending", "completed"];
    let sortedEnvelopes = [];
    statusOrder?.map((status) => {
      envelopes?.map((envelope) => {
        if (envelope?.status === status) {
          sortedEnvelopes.push(envelope);
        }
      });
    });
    return sortedEnvelopes;
  };

  const dataManipulator = () => {
    const envelopes = docsData?.current?.envelopes;
    docsData.current.pending = 0;
    docsData.current.completed = 0;
    docsData.current.declined = 0;
    docsData.current.voided = 0;
    let envelopesCopy = envelopes;
    envelopes?.map((envelop, index) => {
      const status = statusHandler(envelop);
      envelopesCopy[index].status = status;
      docsData.current[status] += 1;
    });
    docsData.current.envelopes = envelopesCopy;
    const statusSortedData = statusSortHandler(envelopesCopy);
    setSortedData(statusSortedData);
  };

  const sortHandler = (selectedHeader) => {
    const documentUtils = {
      "Document Name": "name",
      "Last Modified": "updatedAt",
    };
    const sortKey = documentUtils?.[selectedHeader];
    const laterSort = sortedData?.sort((a, b) => {
      if (a?.[sortKey] > b?.[sortKey]) return 1;
      else if (a?.[sortKey] < b?.[sortKey]) return -1;
      else if (a?.[sortKey] === b?.[sortKey]) return 0;
    });
    laterSort && setSortedData([...laterSort]);
  };

  const getSignedFileId = async (envelopeId) => {
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
    return data?.data?.id;
  };

  const tokenHandler = async (type='token') => {
    console.log('in token handler')
    let apiData = {};
    const currentUrl = window.location.href;
    const searchParams = new URL(currentUrl).searchParams;
    const authId = searchParams?.get("authId");
    const objectId = searchParams?.get("object_id");
    const objectType = searchParams?.get("object_type");
    const envelope_id = searchParams?.get("envelope_id");
    console.log(searchParams, 'in token handler')
    setDocParams((prev) => ({ ...prev, authId, objectId, objectType, envelope_id }));
    if (authId !== docParams?.authId && (!envelope_id || envelope_id && type === 'download')) {
      localStorage?.clear();
      await getApi({
        endUrl: `set-up/auth?authId=${authId}`,
      })
        .then((data) => {
          data && setJWTtoken(data?.token);
          apiData = { objectId, objectType, envelope_id, data };
        })
        .catch((err) => {
          openNotification({
            message: "Error",
            description: err.message,
            type: "error",
            api,
          });
        });
    }
    return apiData;
  };

  const getDataHandler = async () => {
    console.log('getDataHandler')
    const { objectId, objectType, data } = await tokenHandler();
    await getApi({
      endUrl: `hubspot-card/check-status?object_type=${
        objectType || docParams?.objectType
      }&object_id=${Number(objectId || docParams?.objectId)}`,
      headers: {
        "x-access-token": data?.token || JWTtoken,
      },
    })
      .then((data) => {
        docsData.current = data?.data || {};
        dataManipulator();
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

  const sendReminderHandler = async (envelopeId) => {
    setLoading(true);
    await putMethod({
      endUrl: `actions/remainder/${envelopeId}`,
      headers: {
        "x-access-token": JWTtoken,
      },
    })
      .then((data) => {
        openNotification({
          message: "Success",
          description: "Successfully sent the reminder.",
          api,
        });
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

  const voidHandler = async (envelopeId) => {
    setLoading(true);
    await axios({
      method: "delete",
      url: `${process.env.NEXT_PUBLIC_BASE_URL}actions/void/${envelopeId}`,
      headers: {
        "x-access-token": JWTtoken,
      },
    })
      .then((data) => {
        openNotification({
          message: "Success",
          description: "Voided succesfully.",
          api,
        });
        setThreeDotDropdown({ isVisible: false, envelop: {} });
      })
      .catch((err) => {
        openNotification({
          message: "Error",
          description: err.message,
          type: "error",
          api,
        });
      });
    await getDataHandler();
    setLoading(false);
  };

  const pdfDownloadHandler = async (data, name, type) => {
    const blob = new Blob([data?.data], { type: "application/pdf" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${name.replace('.pdf', '')}_${type}.pdf`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const originalDownloadHandler = async (envelope) => {
    setLoading(true);
    let apiData
    console.log(envelope, 'in envelope')
    if (!envelope?.envelope_id) {
      console.log(envelope, 'apiData')
      apiData = await tokenHandler('download')
    }
    if (envelope?.envelope_id || apiData?.envelope_id) {
      console.log(apiData, 'apiData')
      const signed_file_id = await getSignedFileId(envelope?.envelope_id || apiData.envelope_id);
      await axios({
        method: "get",
        url: `https://api.signeasy.com/v3/signed/${signed_file_id}/download?type=merged&include_certificate=false`,
        headers: {
          Authorization: `Bearer ${jwt_decode(JWTtoken).signeasy_access_token}`,
        },
        responseType: 'blob'
      })
        .then(async (data) => {
          await pdfDownloadHandler(data, envelope?.name, 'signed');
          setDownloadDropdown((prev) => ({
            ...prev,
            isVisible: false,
            envelop: {},
          }));
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
    }
  };

  const certificateDownloadHandler = async (envelope) => {
    setLoading(true);
    const signed_file_id = await getSignedFileId(envelope?.envelope_id || docParams?.envelope_id);
    await axios({
      method: "get",
      url: `https://api.signeasy.com/v3/rs/envelope/signed/${signed_file_id}/certificate`,
      headers: {
        Authorization: `Bearer ${jwt_decode(JWTtoken).signeasy_access_token}`,
      },
      responseType: 'blob'
    })
      .then(async (data) => {
        await pdfDownloadHandler(data, envelope?.name, 'certificate');
        setDownloadDropdown((prev) => ({
          ...prev,
          isVisible: false,
          envelop: {},
        }));
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

  const documentWithCertificateDownloadHandler = async (envelope) => {
    setLoading(true);
    const signed_file_id = await getSignedFileId(envelope?.envelope_id || docParams?.envelope_id);
    await axios({
      method: "get",
      url: `https://api.signeasy.com/v3/signed/${signed_file_id}/download?type=merged&include_certificate=true`,
      headers: {
        Authorization: `Bearer ${jwt_decode(JWTtoken).signeasy_access_token}`,
      },
      responseType: 'blob'
    })
      .then(async (data) => {
        await pdfDownloadHandler(data, envelope?.name, 'certificate_with_signed');
        setDownloadDropdown((prev) => ({
          ...prev,
          isVisible: false,
          envelop: {},
        }));
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

  const actionsHandler = (action, envelop) => {
    if (action === "Send Reminder") sendReminderHandler(envelop?.envelope_id);
    if (action === "Void") voidHandler(envelop?.envelope_id);
    // if (action === "Download") documentWithCertificateDownloadHandler(envelop);
  };

  const ActionsDropdown = ({ subActions }) => {
    return (
      <>
        <div className="ovarallPop fixed inset-0"></div>
        <div className="absolute right-0 bg-[white] z-20 border-[1px] w-[100%] top-[25px]">
          {subActions?.map((action, index) => (
            <div
              className="py-[10px] px-[10px] text-[14px] cursor-pointer"
              onClick={action?.onClick}
              key={index}
            >
              {action?.title}
            </div>
          ))}
        </div>
      </>
    );
  };

  const signersCountHandler = (data, status) => {
    if (status === "declined") {
      const count = statusMembersCount(data, "declined");
      return count > 1 ? `${count} signers` : `${count} signer`;
    } else if (status === "pending") {
      const count = statusMembersCount(data, "not_viewed");
      return count > 1 ? `${count} signers` : `${count} signer`;
    } else if (data?.length > 1) {
      return `${data?.length} signers`;
    } else if (data?.length === 1) {
      return "1 signer";
    }
  };

  const statusMembersCount = (data, status) => {
    let count = 0;
    data?.map((recipient) => {
      if (recipient?.status === status) {
        count += 1;
      }
    });
    return count;
  };

  useEffect(() => {
    if (browserWindow) getDataHandler();
  }, [browserWindow]);

  useEffect(() => {
    setBrowserWindow(window);
  }, []);

  const subActionsObject = [
    {
      title: "Signed Envelope with Certificate",
      onClick: () =>
        documentWithCertificateDownloadHandler(downloadDropdown?.envelop),
    },
    {
      title: "Signed Envelope",
      onClick: () => originalDownloadHandler(downloadDropdown?.envelop),
    },
    {
      title: "Certificate",
      onClick: () => certificateDownloadHandler(downloadDropdown?.envelop),
    },
  ];

  const threeDotSubActionsObject = [
    {
      title: "Void",
      onClick: () => voidHandler(threeDotDropdown?.envelop?.envelope_id),
    },
  ];

  return (
    <>
      {contextHolder}
      {loading ? (
        <Loader />
      ) : (
        <div className="">
          <div className="font-[500]">Signeasy documents</div>
          <div className="flex border-[1px] w-fit py-[15px] rounded-[4px] mt-[20px] mb-[40px]">
            {statusData?.map((item, index) => (
              <div
                className={classNames(
                  index !== statusData?.length - 1 && "border-r-[1px]",
                  "px-[15px]"
                )}
                key={index}
              >
                <div className="text-[#838b90] text-[14px]">{item?.title}</div>
                <div className="font-[500]">
                  {item?.title === "Waiting for others"
                    ? docsData?.current?.pending
                    : docsData?.current?.[item?.title.toLowerCase()]}
                </div>
              </div>
            ))}
          </div>
          {/* Headers */}
          <div className="flex border-b-[1px] px-[30px] pb-[10px]">
            {headerData?.map((item, index) => (
              <div
                className={classNames(
                  "flex items-center select-none cursor-pointer",
                  item?.title === "Actions" && "justify-end"
                )}
                style={{ width: item?.width }}
                onClick={() => {
                  if (item?.title === "Status") {
                    const sortedEnvelopes = statusSortHandler(
                      docsData.current.envelopes
                    );
                    setSortedData(sortedEnvelopes);
                  } else {
                    sortHandler(item?.title);
                  }
                }}
                key={index}
              >
                <div className="text-[14px] text-[#838b90]">{item?.title}</div>
                {item?.title !== "Actions" && (
                  <DownOutlined className="text-[12px] pl-[5px] pt-[2px] text-[#838b90]" />
                )}
              </div>
            ))}
          </div>
          {/* data */}
          <div className="w-[100%]">
            {sortedData.map((item, index) => (
              <div
                className="flex items-center border-b-[1px] py-[12px] px-[30px]"
                key={index}
              >
                <div className="flex items-center w-[40%] pr-[10px]">
                  <div className="-mt-[6px]">
                    {statusUtils[item?.status]?.icon}
                  </div>
                  <div className="pl-[10px] font-[500] text-[14px]">
                    {item?.name}
                  </div>
                </div>
                <div
                  className="w-[20%] cursor-pointer select-none relative"
                  onClick={() => {
                    setShowSignersData(!showSignersData);
                    signersData.current = item;
                  }}
                >
                  <div
                    style={{ color: statusUtils[item?.status].color }}
                    className="text-[14px] capitalize"
                  >
                    {item?.status === "pending" ? "Waiting" : item?.status}
                  </div>
                  <div className="text-[14px] text-[#838b90]">
                    {statusUtils[item?.status]?.subText}
                    <span className="pl-[3px] text-[#3c9eeb]">
                      {signersCountHandler(item?.recipients, item?.status)}
                    </span>
                  </div>
                  {showSignersData &&
                    signersData.current?.envelope_id === item?.envelope_id && (
                      <SignersData data={signersData.current?.recipients} />
                    )}
                </div>
                <div className="w-[20%] text-[14px]">
                  {moment(item?.updatedAt).format("LLL")}
                </div>
                <div className="flex items-center relative justify-end w-[20%] select-none">
                  <div
                    className="w-[50%] justify-end flex items-center text-[#3c9eeb] text-[14px] cursor-pointer"
                    onClick={() =>
                      item?.status === "completed"
                        ? setDownloadDropdown((prev) => ({
                            ...prev,
                            isVisible: !prev.isVisible,
                            envelop: item,
                          }))
                        : actionsHandler(statusUtils[item.status]?.action, item)
                    }
                  >
                    {statusUtils[item.status]?.action}
                    {item?.status === "completed" && (
                      <DownOutlined className="text-[12px] pl-[5px] pt-[2px]" />
                    )}
                    {downloadDropdown?.isVisible &&
                      downloadDropdown?.envelop?.envelope_id ===
                        item?.envelope_id && (
                        <ActionsDropdown subActions={subActionsObject} />
                      )}
                  </div>
                  <div
                    className="text-[#3c9eeb] cursor-pointer"
                    onClick={() =>
                      item?.status === "pending" &&
                      setThreeDotDropdown((prev) => ({
                        ...prev,
                        isVisible: !prev.isVisible,
                        envelop: item,
                      }))
                    }
                  >
                    <EllipsisOutlined className="pl-[20px] cursor-pointer" />
                    {threeDotDropdown?.isVisible &&
                      threeDotDropdown?.envelop?.envelope_id ===
                        item?.envelope_id && (
                        <ActionsDropdown
                          subActions={threeDotSubActionsObject}
                        />
                      )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default CheckStatus;
