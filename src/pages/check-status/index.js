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
  const [docsData, setDocsData] = useState();
  const [loading, setLoading] = useState(true);
  const [downloadDropdown, setDownloadDropdown] = useState({
    isVisible: false,
    envelop: {},
  });
  const [api, contextHolder] = notification.useNotification();

  const sortHandler = (selectedHeader) => {
    const documentUtils = {
      "Document Name": "name",
      Status: "status",
      "Last Modified": "last_modified",
    };
    const sortKey = documentUtils?.[selectedHeader];
    const laterSort = sortedData?.sort((a, b) => {
      if (a?.[sortKey] > b?.[sortKey]) return 1;
      else if (a?.[sortKey] < b?.[sortKey]) return -1;
      else if (a?.[sortKey] === b?.[sortKey]) return 0;
    });
    laterSort && setSortedData([...laterSort]);
  };

  const tokenHandler = async () => {
    let apiData = {};
    const currentUrl = window.location.href;
    const searchParams = new URL(currentUrl).searchParams;
    const authId = searchParams?.get("authId");
    const objectId = searchParams?.get("object_id");
    const objectType = searchParams?.get("object_type");
    setDocParams({
      authId: authId,
      objectId: objectId,
      objectType: objectType,
    });
    if (authId !== docParams?.authId) {
      await getApi({
        endUrl: `set-up/auth?authId=${authId}`,
      })
        .then((data) => {
          data && setJWTtoken(data?.token);
          apiData = data;
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
    const token = await tokenHandler();
    await getApi({
      endUrl: `hubspot-card/check-status?object_type=${
        docParams?.objectType
      }&object_id=${Number(docParams?.objectId)}`,
      headers: {
        "x-access-token": token?.token || JWTtoken,
      },
    })
      .then((data) => {
        setDocsData(data?.data || {});
        setSortedData(data?.data?.envelopes);
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
        console.log(data);
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
    }).catch((err) => {
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

  const pdfDownloadHandler = async (data, name) => {
    const blob = new Blob([data], { type: "application/pdf" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = name;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const originalDownloadHandler = async (envelope) => {
    setLoading(true);
    await getApi({
      endUrl: `actions/download/original/${envelope?.envelope_id}`,
      headers: {
        "x-access-token": JWTtoken,
      },
    })
      .then(async (data) => {
        await pdfDownloadHandler(data, envelope?.name);
        setDownloadDropdown((prev) => ({
          ...prev,
          isVisible: false,
          envelop: {},
        }));
        setLoading(false);
      })
      .catch((err) => {
        openNotification({
          message: "Error",
          description: err.message,
          type: "error",
          api,
        });
      });
  };

  const certificateDownloadHandler = async (envelope) => {
    setLoading(true);
    await getApi({
      endUrl: `actions/download/certificate/${envelope?.envelope_id}`,
      headers: {
        "x-access-token": JWTtoken,
      },
    })
      .then(async (data) => {
        await pdfDownloadHandler(data, envelope?.name);
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
    await getApi({
      endUrl: `actions/download/certificate-original/${envelope?.envelope_id}`,
      headers: {
        "x-access-token": JWTtoken,
      },
    })
      .then(async (data) => {
        await pdfDownloadHandler(data, envelope?.name);
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
    if (action === "Download") documentWithCertificateDownloadHandler(envelop);
  };

  const ActionsDropdown = () => {
    const subActions = ["original", "certificate"];
    return (
      <>
        {/* <div
          className="ovarallPop fixed inset-0"
          onClick={() =>
            setDownloadDropdown({
              isVisible: false,
              envelop: {},
            })
          }
        ></div> */}
        <div className="absolute right-0 bg-[white] z-20 border-[1px] w-[100%] top-[25px]">
          {subActions?.map((action, index) => (
            <div
              className="py-[10px] px-[10px]"
              onClick={() => {
                if (action === "original")
                  originalDownloadHandler(downloadDropdown?.envelop);
                if (action === "certificate")
                  certificateDownloadHandler(downloadDropdown?.envelop);
              }}
              key={index}
            >
              {action}
            </div>
          ))}
        </div>
      </>
    );
  };

  const signersCountHandler = (data, status) => {
    if (data?.length === 1 && status === "voided") {
      return "You";
    } else if (data?.length > 1) {
      return `${data?.length} signers`;
    } else if (data?.length === 1) {
      return "1 signer";
    }
  };

  useEffect(() => {
    if (browserWindow) getDataHandler();
  }, [browserWindow]);

  useEffect(() => {
    setBrowserWindow(window);
  }, []);

  useEffect(() => {
    return () => setJWTtoken("");
  }, []);

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
                    ? docsData?.pending
                    : docsData?.[item?.title.toLowerCase()]}
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
                onClick={() => sortHandler(item?.title)}
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
                <div className="w-[20%]">
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
                </div>
                <div className="w-[20%] text-[14px]">
                  {moment(item?.updatedAt).format("LLL")}
                </div>
                <div className="flex items-center relative justify-end w-[20%] cursor-pointer select-none">
                  <div
                    className="w-[50%] justify-end flex items-center text-[#3c9eeb] text-[14px]"
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
                        item?.envelope_id && <ActionsDropdown />}
                  </div>
                  <EllipsisOutlined className="pl-[20px]" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9
//   .eyJodWJzcG90X3VzZXJfaWQiOjQ5NzkyNzIyLCJodWJzcG90X3BvcnRhbF9pZCI6MjQwNTA1MDMsInNpZ25lYXN5X2FjY2Vzc190b2tlbiI6ImV5SmhiR2NpT2lKU1V6STFOaUlzSW5SNWNDSTZJa3BYVkNJc0ltdHBaQ0k2SWpkTUxYWjBWRE5pTjJwWWMySTJjVVpqTFZCaE55SjkuZXlKb2RIUndjem92TDNOcFoyNWxZWE41TG1OdmJTOWxiV0ZwYkNJNkltRnVhMmwwUUhScGJHbGphRzh1YVc0aUxDSm9kSFJ3Y3pvdkwzTnBaMjVsWVhONUxtTnZiUzkxYzJWeVgybGtJam9pTVRBM016YzROellpTENKb2RIUndjem92TDNOcFoyNWxZWE41TG1OdmJTOTBaWE4wWDIxdlpHVWlPaUl4SWl3aWFIUjBjSE02THk5emFXZHVaV0Z6ZVM1amIyMHZhWE5mZFhObGNsOXBiWEJ2Y25SbFpDSTZabUZzYzJVc0ltaDBkSEJ6T2k4dmMybG5ibVZoYzNrdVkyOXRMMnh2WjJsdVgyTnZkVzUwSWpveU15d2lhSFIwY0hNNkx5OXphV2R1WldGemVTNWpiMjB2YzI5MWNtTmxJam9pWlcxaGFXd2lMQ0pwYzNNaU9pSm9kSFJ3Y3pvdkwyRjFkR2d1YzJsbmJtVmhjM2t1WTI5dEx5SXNJbk4xWWlJNkltRjFkR2d3ZkRZelpXUmpNRFZrTXpBek1tVmxNVGhtTWpVd01XVmlaQ0lzSW1GMVpDSTZJbWgwZEhCek9pOHZZWEJwTFdWNGRDNXphV2R1WldGemVTNWpiMjB2SWl3aWFXRjBJam94Tmpnek56STBORFUwTENKbGVIQWlPakUyT0RZek1UWTBOVFFzSW1GNmNDSTZJa0o2TURKNGJubGlURXhIYURkdGRuUm5SVTgwUkZsU1pIVmhXRkZDVGxCeElpd2ljMk52Y0dVaU9pSnljenBqY21WaGRHVWdjbk02ZFhCa1lYUmxJRzl5YVdkcGJtRnNPbkpsWVdRZ2IzSnBaMmx1WVd3NlkzSmxZWFJsSUc5eWFXZHBibUZzT25Wd1pHRjBaU0J6YVdkdVpXUTZjbVZoWkNCemFXZHVaV1E2WTNKbFlYUmxJSE5wWjI1bFpEcDFjR1JoZEdVZ2RYTmxjanB5WldGa0lHWnBiR1Z6T25KbFlXUWdkWE5sY2pwamNtVmhkR1VnZEdWdGNHeGhkR1U2YldGdVlXZGxJSEp6T25OcFoyNXBibWQxY213Z2NuTTZjbVZoWkNCdlptWnNhVzVsWDJGalkyVnpjeUo5LkdEdUtyMXV3SWxyQ21fUTlpT1FPNDRHNkRMSDV4N1ZuOU1TclEzUU54R2pVTXVOdTBvbmU5TW9OWHpwalZDTG4tWXFod2hJTkdXbHluZHpVc1VXZ1lxVlpQV3NhTXFiM3NPVzZGdjNTVzE1R2dvRXduTm1UUGpXZWFSSE56d21WNGI0NUdjVnhwSzM5YjNhUUpMZDlHYXh0Q3lNTjVDLU4teDJjLV9GSVlLQnI0V1lJMFcwMFFDemFkS2gyQUtNMWkyRXdOV080UHNGbWstZndqd01Vd25SSjkzbFZRRFB0c1JDbUJzaXFlWVpIOFJ0SG5tMWQtcm01aHNHMVQwZVR0TUN6aFFLZ2hVNzg3bTlhbXZ3LVo3MzJtSzhDckZ6UEtqc3JiWW56a1hpazVMWDFCbDhyaXNiS0RydXNLTmluU3Q2a1lNbDlLYlA5S29BN05HT0NoZyIsImlhdCI6MTY4Mzc3OTU0NiwiZXhwIjoxNjgzODA4MzQ2fQ
//   .UtDLjTOUWjlkQTvRmnVkwpc_pY2CUVjfk1NlV8o6kRU;

export default CheckStatus;
