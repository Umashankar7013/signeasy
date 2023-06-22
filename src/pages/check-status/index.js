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
import moment from "moment/moment";
import { Loader } from "../../components/Loader";
import axios from "axios";
import { Modal, notification } from "antd";
import { openNotification } from "../../utils/functions";
import { SignersData } from "../../components/SignersData";
import jwt_decode from "jwt-decode";
import { ErrorPage } from "../../components/ErrorPage";
import { AppContext } from "../../components/Layout";
import { CompletedIcon } from "../../../public/svg/CompletedIcon";
import { DeclinedIcon } from "../../../public/svg/DeclinedIcon";
import { VoidedIcon } from "../../../public/svg/VoidedIcon";
import { WaitingIcon } from "../../../public/svg/WaitingIcon";
import { DownArrowIcon } from "../../../public/svg/DownArrowIcon";

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
      icon: <CompletedIcon />,
      color: "#0F9835",
      subText: "Signed by",
      action: "Download",
      actionData: [
        {
          title: "Signed Envelope with Certificate",
          onClick: () =>
            documentWithCertificateDownloadHandler(threeDotDropdown?.envelop),
        },
        {
          title: "Signed Envelope",
          onClick: () => originalDownloadHandler(threeDotDropdown?.envelop),
        },
        {
          title: "Certificate",
          onClick: () => certificateDownloadHandler(threeDotDropdown?.envelop),
        },
      ],
    },
    declined: {
      icon: <DeclinedIcon />,
      color: "#BC2C2C",
      subText: "by",
      action: "Void",
      actionData: [
        {
          title: "Void",
          onClick: () =>
            setShowVoidPopUp((prev) => ({
              ...prev,
              isVisible: true,
              id: threeDotDropdown?.envelop?.envelope_id,
            })),
        },
      ],
    },
    voided: {
      icon: <VoidedIcon />,
      color: "#BC2C2C",
      subText: "by",
      action: "Download",
    },
    pending: {
      icon: <WaitingIcon />,
      color: "#FF7540",
      subText: "for",
      action: "Send Reminder",
      actionData: [
        {
          title: "Void",
          onClick: () =>
            setShowVoidPopUp((prev) => ({
              ...prev,
              isVisible: true,
              id: threeDotDropdown?.envelop?.envelope_id,
            })),
        },
        {
          title: "Send Reminder",
          onClick: () =>
            sendReminderHandler(threeDotDropdown?.envelop?.envelope_id),
        },
      ],
    },
  };
  const headerData = [
    { title: "Document Name", width: "28%" },
    { title: "Object Type", width: "20%" },
    { title: "Status", width: "20%" },
    { title: "Last Modified", width: "20%" },
    { title: "Actions", width: "10%" },
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
  const [showVoidPopUp, setShowVoidPopUp] = useState({
    isVisible: false,
    id: "",
  });
  const selectedHeader = useRef("Last Modified");
  const sortAccending = useRef(false);

  const statusHandler = (data) => {
    let status;
    let flag = 0;
    data?.status !== "voided" &&
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

  const sortOnUpdateHandler = (envelopes, value = "dec") => {
    let sortedData;
    if (value === "acce") {
      sortedData = envelopes?.sort((a, b) => {
        if (a?.["updatedAt"] > b?.["updatedAt"]) return 1;
        else if (a?.["updatedAt"] < b?.["updatedAt"]) return -1;
        else if (a?.["updatedAt"] === b?.["updatedAt"]) return 0;
      });
    } else {
      sortedData = envelopes?.sort((a, b) => {
        if (a?.["updatedAt"] < b?.["updatedAt"]) return 1;
        else if (a?.["updatedAt"] > b?.["updatedAt"]) return -1;
        else if (a?.["updatedAt"] === b?.["updatedAt"]) return 0;
      });
    }
    return sortedData;
  };

  const sortHandler = (selectedHeader, value) => {
    const documentUtils = {
      "Document Name": "name",
      "Object Type": "object_type",
    };
    const sortKey = documentUtils?.[selectedHeader];
    if (value === "acce") {
      const laterSort = sortedData?.sort((a, b) => {
        if (a?.[sortKey] > b?.[sortKey]) return 1;
        else if (a?.[sortKey] < b?.[sortKey]) return -1;
        else if (a?.[sortKey] === b?.[sortKey]) return 0;
      });
      laterSort && setSortedData([...laterSort]);
    } else {
      const laterSort = sortedData?.sort((a, b) => {
        if (a?.[sortKey] < b?.[sortKey]) return 1;
        else if (a?.[sortKey] > b?.[sortKey]) return -1;
        else if (a?.[sortKey] === b?.[sortKey]) return 0;
      });
      laterSort && setSortedData([...laterSort]);
    }
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
    const statusSortedData = sortOnUpdateHandler(envelopesCopy);
    setSortedData(statusSortedData);
  };

  const VoidPopUp = ({ open = false }) => {
    return (
      <Modal
        open={open}
        footer={null}
        closable={false}
        style={{ borderRadius: 0, padding: 0 }}
        onCancel={() =>
          setShowVoidPopUp((prev) => ({
            ...prev,
            isVisible: false,
            id: "",
          }))
        }
      >
        <div className="text-[14px] font-[500]">Reason for voiding request</div>
        <div className="text-[12px] font-[500] pt-[15px]">
          Once voided,signers can no longer access this document.They will
          receive an email notification,along with your reason for voiding this
          request.
        </div>
        <textarea
          placeholder="Add your reason here(max 255 characters)"
          className="w-[100%] outline-none border-[1px] rounded-[3px] text-[12px] mt-[15px] flex h-[100px] resize-none p-[7px]"
        />
        <div className="flex items-center justify-end mt-[15px]">
          <div
            className="h-[30px] w-[67px] text-[12px] font-[500] flex text-[#4e90e2] bg-[#f5fafe] items-center justify-center border-[1px] border-[#4e90e2] mr-[10px] rounded-[3px] cursor-pointer"
            onClick={() =>
              setShowVoidPopUp((prev) => ({
                ...prev,
                isVisible: false,
                id: "",
              }))
            }
          >
            Cancel
          </div>
          <div
            className="h-[30px] text-[12px] flex w-[67px] font-[500] text-[#fff] bg-[#e6716d] items-center justify-center rounded-[3px] cursor-pointer"
            onClick={async () => {
              await voidHandler(showVoidPopUp.id);
              setShowVoidPopUp((prev) => ({
                ...prev,
                isVisible: false,
                id: "",
              }));
            }}
          >
            Void
          </div>
        </div>
      </Modal>
    );
  };

  const getSignedFileId = async (envelopeId) => {
    const data = await axios({
      method: "get",
      url: `https://api.signeasy.com/v3/rs/envelope/signed/pending/${envelopeId}`,
      headers: {
        Authorization: `Bearer ${jwt_decode(JWTtoken).signeasy_access_token}`,
      },
    }).catch((err) => {
      openNotification({
        message: "Error",
        description: err?.response?.data?.message,
        type: "error",
        api,
      });
    });
    return data?.data?.id;
  };

  const tokenHandler = async () => {
    let apiData = {};
    const currentUrl = window.location.href;
    const searchParams = new URL(currentUrl).searchParams;
    const authId = searchParams?.get("authId");
    const objectId = searchParams?.get("object_id");
    const objectType = searchParams?.get("object_type");
    setDocParams((prev) => ({ ...prev, authId, objectId, objectType }));
    if (authId !== docParams?.authId) {
      localStorage?.clear();
      await getApi({
        endUrl: `set-up/auth?authId=${authId}`,
      })
        .then((data) => {
          data && setJWTtoken(data?.token);
          apiData = { objectId, objectType, data };
        })
        .catch((err) => {
          openNotification({
            message: "Error",
            description: err?.response?.data?.message,
            type: "error",
            api,
          });
        });
    }
    return apiData;
  };

  const getDataHandler = async () => {
    const { objectId, objectType, data } = await tokenHandler();
    await getApi({
      endUrl: `hubspot-card/envelopes?cs=yes&object_type=${
        objectType || docParams?.objectType || "CONTACT"
      }&object_id=${Number(
        objectId || docParams?.objectId || "151"
      )}&limit=999`,
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
          description: err?.response?.data?.message,
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
          description: err?.response?.data?.message,
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
          description: err?.response?.data?.message,
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
    link.download = `${name.replace(".pdf", "")}_${type}.pdf`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const originalDownloadHandler = async (envelope) => {
    setLoading(true);
    const signed_file_id = await getSignedFileId(envelope?.envelope_id);
    await axios({
      method: "get",
      url: `https://api.signeasy.com/v3/signed/${signed_file_id}/download?type=merged&include_certificate=false`,
      headers: {
        Authorization: `Bearer ${jwt_decode(JWTtoken).signeasy_access_token}`,
      },
      responseType: "blob",
    })
      .then(async (data) => {
        await pdfDownloadHandler(data, envelope?.name, "signed");
        setDownloadDropdown((prev) => ({
          ...prev,
          isVisible: false,
          envelop: {},
        }));
      })
      .catch((err) => {
        openNotification({
          message: "Error",
          description: err?.response?.data?.message,
          type: "error",
          api,
        });
      });
    setLoading(false);
  };

  const certificateDownloadHandler = async (envelope) => {
    setLoading(true);
    const signed_file_id = await getSignedFileId(envelope?.envelope_id);
    await axios({
      method: "get",
      url: `https://api.signeasy.com/v3/rs/envelope/signed/${signed_file_id}/certificate`,
      headers: {
        Authorization: `Bearer ${jwt_decode(JWTtoken).signeasy_access_token}`,
      },
      responseType: "blob",
    })
      .then(async (data) => {
        await pdfDownloadHandler(data, envelope?.name, "certificate");
        setDownloadDropdown((prev) => ({
          ...prev,
          isVisible: false,
          envelop: {},
        }));
      })
      .catch((err) => {
        openNotification({
          message: "Error",
          description: err?.response?.data?.message,
          type: "error",
          api,
        });
      });
    setLoading(false);
  };

  const documentWithCertificateDownloadHandler = async (envelope) => {
    setLoading(true);
    const signed_file_id = await getSignedFileId(envelope?.envelope_id);
    await axios({
      method: "get",
      url: `https://api.signeasy.com/v3/signed/${signed_file_id}/download?type=merged&include_certificate=true`,
      headers: {
        Authorization: `Bearer ${jwt_decode(JWTtoken).signeasy_access_token}`,
      },
      responseType: "blob",
    })
      .then(async (data) => {
        await pdfDownloadHandler(
          data,
          envelope?.name,
          "certificate_with_signed"
        );
        setDownloadDropdown((prev) => ({
          ...prev,
          isVisible: false,
          envelop: {},
        }));
      })
      .catch((err) => {
        openNotification({
          message: "Error",
          description: err?.response?.data?.message,
          type: "error",
          api,
        });
      });
    setLoading(false);
  };

  const actionsHandler = (action, envelop) => {
    if (action === "Send Reminder") sendReminderHandler(envelop?.envelope_id);
    if (action === "Void") {
      setShowVoidPopUp((prev) => ({
        ...prev,
        isVisible: true,
        id: envelop?.envelope_id,
      }));
    }
    // if (action === "Download") documentWithCertificateDownloadHandler(envelop);
  };

  const ActionsDropdown = ({ subActions }) => {
    return (
      <>
        <div className="ovarallPop fixed inset-0"></div>
        <div className="absolute right-0 bg-[white] z-20 border-[1px] w-[100%] top-[25px]">
          {subActions?.map((action, index) => (
            <div
              className={classNames(
                "py-[10px] px-[10px] text-[14px] cursor-pointer",
                index !== subActions?.length && "border-b-[1px]"
              )}
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
      onClick: () =>
        setShowVoidPopUp((prev) => ({
          ...prev,
          isVisible: true,
          id: threeDotDropdown?.envelop?.envelope_id,
        })),
    },
  ];

  return (
    <>
      {contextHolder}
      {loading ? (
        <Loader />
      ) : (
        <div className="">
          <VoidPopUp open={showVoidPopUp.isVisible} />
          <div className="font-[600] text-[20px] font-lato leading-[28px] text-[#141414]">
            Signeasy documents
          </div>
          <div className="flex border-[1px] w-fit py-[24px] rounded-[4px] mt-[26px] border-[#D7D7D7] mb-[48px]">
            {statusData?.map((item, index) => (
              <div
                className={classNames(
                  index !== statusData?.length - 1 && "border-r-[1px]",
                  index === 0
                    ? "pl-[24px] pr-[32px]"
                    : index === statusData?.length - 1
                    ? "pr-[24px] pl-[32px]"
                    : "px-[32px]"
                )}
                key={index}
              >
                <div className="text-[#646E74] text-[14px] font-[500] font-lato leading-[20px]">
                  {item?.title}
                </div>
                <div className="font-[600] text-[20px] font-lato leading-[28px] pt-[6px] text-[#141414]">
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
                  if (selectedHeader.current === item?.title) {
                    if (sortAccending.current === true) {
                      sortAccending.current = false;
                    } else {
                      sortAccending.current = true;
                    }
                  }
                  selectedHeader.current = item?.title || "";
                  if (item?.title === "Status") {
                    const sortedEnvelopes = statusSortHandler(
                      docsData.current.envelopes
                    );
                    setSortedData([...sortedEnvelopes]);
                  } else if (item?.title === "Last Modified") {
                    const sortedEnvelopes = sortOnUpdateHandler(
                      docsData.current.envelopes,
                      sortAccending.current ? "acce" : "dec"
                    );
                    setSortedData([...sortedEnvelopes]);
                  } else {
                    sortHandler(
                      item?.title,
                      sortAccending.current ? "acce" : "dec"
                    );
                  }
                }}
                key={index}
              >
                <div className="text-[14px] text-[#646E74] font-lato leading-[16px]">
                  {item?.title}
                </div>
                {item?.title !== "Actions" && (
                  <div className="pl-[6px]">
                    <DownArrowIcon />
                  </div>
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
                <div className="flex items-center w-[28%] pr-[10px]">
                  <div>{statusUtils[item?.status]?.icon}</div>
                  <div className="pl-[9px] font-[400] font-lato text-[14px] leading-[18px] text-[#141414]">
                    {item?.name}
                  </div>
                </div>
                <div className="flex items-center w-[20%] pr-[10px]">
                  <div className="font-[400] font-lato text-[14px]">
                    {item?.object_type}
                  </div>
                </div>
                <div
                  className={classNames(
                    "w-[20%] select-none relative",
                    item?.status !== "voided" && "cursor-pointer "
                  )}
                  onClick={() => {
                    if (item?.status !== "voided") {
                      setShowSignersData(!showSignersData);
                      signersData.current = item;
                    }
                  }}
                >
                  <div
                    style={{ color: statusUtils[item?.status].color }}
                    className="text-[14px] capitalize font-lato"
                  >
                    {item?.status === "pending" ? "Waiting" : item?.status}
                  </div>
                  <div className="text-[14px] text-[#888888] font-lato">
                    {statusUtils[item?.status]?.subText}
                    <span className="pl-[3px] text-[#1088E7] font-lato">
                      {item?.status === "voided"
                        ? " You"
                        : signersCountHandler(item?.recipients, item?.status)}
                    </span>
                  </div>
                  {showSignersData &&
                    signersData.current?.envelope_id === item?.envelope_id && (
                      <SignersData data={signersData.current} />
                    )}
                </div>
                <div className="w-[20%]">
                  <div className="text-[14px] font-lato text-[#646E74] font-[400] leading-[20px]">
                    {moment(item?.updatedAt).format("LL")}
                  </div>
                  <div className="text-[14px] font-lato text-[#8A8A8A] font-[400] leading-[20px]">
                    {moment(item?.updatedAt).format("LT")}
                  </div>
                </div>
                <div className="flex items-center relative justify-end w-[10%] pr-[20px] select-none">
                  {/* <div
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
                  </div> */}
                  {item?.status !== "voided" && (
                    <div
                      className="text-[#3c9eeb] cursor-pointer"
                      onClick={() =>
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
                            subActions={statusUtils[item?.status]?.actionData}
                          />
                        )}
                    </div>
                  )}
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
