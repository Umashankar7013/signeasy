import React, { useContext, useEffect, useRef, useState } from "react";
import { getApi } from "../../api/apiMethods";
import { DropDown } from "../../components/DropDown";
import classNames from "classnames";
import { useRouter } from "next/router";
import { Loader } from "../../components/Loader";
import { notification } from "antd";
import { dateHandler, openNotification } from "../../utils/functions";
import { ErrorPage } from "../../components/ErrorPage";
import { AppContext } from "../../components/Layout";
import { CaretDownOutlined, CaretUpOutlined } from "@ant-design/icons";

function TemplateMapping() {
  const tempaltesData = useRef([]);
  const {
    setDocParams,
    JWTtoken,
    setJWTtoken,
    setSelectedItem,
    docParams,
    setTabsDropdownData,
  } = useContext(AppContext);
  const headerData = [
    { title: "TEMPLATE NAME", width: "35%" },
    { title: "ROLES", width: "30%" },
    { title: "LAST MODIFIED", width: "35%" },
  ];
  const selectedHeader = useRef(headerData[2]?.title);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [sortedData, setSortedData] = useState([]);
  const [browserWindow, setBrowserWindow] = useState();
  const [api, contextHolder] = notification.useNotification();
  const sortAccending = useRef(false);

  const showToastHandler = () => {
    openNotification({
      message: "Success",
      description: "Mapping stored successfully",
      api,
    });
  };

  const tokenHandler = async () => {
    let apiData = {};
    const currentUrl = window.location.href;
    const searchParams = new URL(currentUrl).searchParams;
    const authId = searchParams?.get("authId");
    const showToast = searchParams?.get("showToast");
    if (showToast === "show") {
      showToastHandler();
    }
    setDocParams((prev) => ({ ...prev, authId }));
    if (authId !== docParams?.authId) {
      localStorage?.clear();
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
            description: err?.response?.data?.message,
            type: "error",
            api,
          });
        });
    }
    return apiData;
  };

  const sortHandler = (value) => {
    const templateUtils = {
      "TEMPLATE NAME": "name",
      ROLE: "role",
      "LAST MODIFIED": "modified_time",
    };
    const sortKey = templateUtils?.[selectedHeader?.current];
    let sortedData;
    if (value === "acce") {
      sortedData = tempaltesData?.current?.sort((a, b) => {
        if (a?.[sortKey] > b?.[sortKey]) return 1;
        else if (a?.[sortKey] < b?.[sortKey]) return -1;
        else if (a?.[sortKey] === b?.[sortKey]) return 0;
      });
    } else {
      sortedData = tempaltesData?.current?.sort((a, b) => {
        if (a?.[sortKey] < b?.[sortKey]) return 1;
        else if (a?.[sortKey] > b?.[sortKey]) return -1;
        else if (a?.[sortKey] === b?.[sortKey]) return 0;
      });
    }
    sortedData && setSortedData([...sortedData]);
  };

  const getTemplatesHandler = async () => {
    if (window) {
      const data = await tokenHandler();
      await getApi({
        endUrl: "hubspot-card/templates",
        headers: {
          "x-access-token": data?.token || JWTtoken,
        },
      })
        .then(async (docsData) => {
          docsData && (tempaltesData.current = docsData?.data);
          sortHandler("dec");
          await getApi({
            endUrl: "set-up/settings/objects",
            headers: {
              "x-access-token": data?.token || JWTtoken,
            },
          })
            .then((data) => {
              setTabsDropdownData(data?.data || {});
            })
            .catch((err) => {
              openNotification({
                message: "Error",
                description: err?.response?.data?.message,
                type: "error",
                api,
              });
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
    } else {
      console.log("Not able to access the window.");
    }
  };

  const actionsHandler = async (item, index) => {
    setSelectedItem(tempaltesData?.current[index]);
    setLoading(true);
    await router.push({
      pathname: "/action-template-mapping",
    });
    setLoading(false);
  };

  useEffect(() => {
    if (browserWindow) {
      getTemplatesHandler();
    }
  }, [browserWindow]);

  useEffect(() => {
    setBrowserWindow(window);
  }, []);

  return (
    <div>
      {contextHolder}
      {loading ? (
        <Loader />
      ) : (
        <div className="border-[1px] border-[#CDD6E1]">
          {/* Header */}
          <div className="fixed w-[100%] z-50 flex border-b-[1px] border-b-[#CDD6E1]">
            {headerData?.map((header, index) => (
              <div
                className={classNames(
                  "flex items-center w-[100%] cursor-pointer",
                  selectedHeader.current === header?.title
                    ? "bg-[#CFD6E0]"
                    : "bg-[#ECF0F4]"
                )}
                style={{
                  width: header?.width,
                }}
                onClick={() => {
                  if (selectedHeader.current === header?.title) {
                    sortAccending.current = true;
                  } else {
                    sortAccending.current = false;
                  }
                  selectedHeader.current = header?.title || "";
                  sortHandler(sortAccending.current ? "acce" : "dec");
                }}
                key={index}
              >
                <div
                  className={classNames(
                    "text-[12px] text-[#373859] font-[500] font-lexend px-[24px] py-[15px] leading-[16.39px]"
                  )}
                >
                  {header?.title}
                </div>
                <div className="flex flex-col">
                  <CaretUpOutlined
                    style={{
                      fontSize: "11px",
                      padding: "0px",
                      margin: "0px",
                      color: "gray",
                    }}
                  />
                  <CaretDownOutlined
                    style={{
                      fontSize: "11px",
                      padding: "0px",
                      margin: "0px",
                      color:
                        selectedHeader.current === header?.title
                          ? "#3F8FAB"
                          : "gray",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
          {/* tempaltes */}
          <div className="mt-[46.39px]">
            {sortedData?.map((template, index) => (
              <div
                className={classNames(
                  "flex w-[100%] items-center py-[20px]",
                  index !== tempaltesData?.current.length - 1 &&
                    "border-b-[1px] border-b-[#CDD6E1]"
                )}
                key={index}
              >
                <div className="w-[35%] text-[14px] text-[#3F8FAB] leading-[19.12px] font-[600] px-[24px]">
                  {template?.name}
                </div>
                <div className="w-[30%] text-[14px] text-[#374659] font-[500] leading-[19.12px] px-[24px]">
                  {template?.metadata?.roles?.map((role, index) => {
                    return (
                      <span
                        // style={{
                        //   color: `rgb${role?.color}`,
                        // }}
                        key={index}
                        className="text-[#374659]"
                      >
                        {role?.name}
                        <span className="text-[black]">
                          {index !== template?.metadata?.roles?.length - 1
                            ? ", "
                            : ""}
                        </span>
                      </span>
                    );
                  })}
                </div>
                <div className="w-[35%] flex justify-between items-center px-[24px]">
                  <div className="text-[14px] text-[#374659] font-[500] leading-[19.12px]">
                    {dateHandler({ timestamp: template?.modified_time })}
                  </div>
                  <DropDown
                    enableSearch={false}
                    contentHeader="Actions"
                    className="w-[100px]"
                    showBottomContent={false}
                    dropDownData={[{ name: "Template mapping" }]}
                    dropDownClassName="w-[200px] right-[0px]"
                    dropDownContentClassName="py-[15px] pl-[22px] text-[14px]"
                    onClick={actionsHandler}
                    specificIndex={index}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default TemplateMapping;
