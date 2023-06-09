import React, { useContext, useEffect, useRef, useState } from "react";
import { getApi } from "../../api/apiMethods";
import { CaretDownOutlined, CaretUpOutlined } from "@ant-design/icons";
import { useRouter } from "next/router";
import { SearchBar } from "../../components/SearchBar";
import { RadioButton } from "../../components/RadioButton";
import classNames from "classnames";
import { dateHandler, openNotification } from "../../utils/functions";
import jwt_decode from "jwt-decode";
import { notification } from "antd";
import { Loader } from "../../components/Loader";
import { BottomButtons } from "../../components/BottomButtons";
import { ErrorPage } from "../../components/ErrorPage";
import { AppContext } from "../../components/Layout";

function DocumentsPage({ showUpload = true, forTemplates = false }) {
  const itemsData = useRef([]);
  const [filteredData, setFilteredData] = useState();
  const [loading, setLoading] = useState(true);
  const headerData = [
    forTemplates ? "TEMPLATE NAME" : "DOCUMENT NAME",
    "LAST CHANGE",
  ];
  const {
    selectedItem,
    setSelectedItem,
    setDocParams,
    JWTtoken,
    setJWTtoken,
    docParams,
  } = useContext(AppContext);
  const selectedHeader = useRef("");
  const router = useRouter();
  const inputFileRef = useRef(null);
  const [browserWindow, setBrowserWindow] = useState();
  const [api, contextHolder] = notification.useNotification();
  const timeVariable = forTemplates ? "modified_time" : "last_modified_time";
  const sortAccending = useRef(false);

  const tokenHandler = async () => {
    let apiData = {};
    const currentUrl = window.location.href;
    const searchParams = new URL(currentUrl).searchParams;
    const authId = searchParams?.get("authId");
    const urlParams = new URLSearchParams(location.search.substring(1));
    const entries = urlParams.entries();
    const result = {};
    for (const [key, value] of entries) {
      result[key] = value;
    }
    setDocParams(result);
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

  const getDocumentsHandler = async () => {
    if (window) {
      const data = await tokenHandler();
      await getApi({
        endUrl: "hubspot-card/documents",
        headers: {
          "x-access-token": data?.token || JWTtoken,
        },
      })
        .then((docsData) => {
          docsData && (itemsData.current = docsData?.data?.files);
          setFilteredData(itemsData?.current);
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

  const getTemplatesHandler = async () => {
    if (window) {
      const data = await tokenHandler();
      await getApi({
        endUrl: "hubspot-card/templates",
        headers: {
          "x-access-token": data?.token || JWTtoken,
        },
      })
        .then((docsData) => {
          docsData && (itemsData.current = docsData?.data);
          setFilteredData(itemsData?.current);
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

  const searchHandler = (text) => {
    if (text.length === 0) {
      setFilteredData(itemsData?.current);
      return;
    } else {
      const sortedData = itemsData?.current?.filter((item) =>
        item?.name?.toLowerCase().includes(text)
      );
      sortedData && setFilteredData([...sortedData]);
    }
  };

  const sortHandler = (value) => {
    const templateUtils = {
      "TEMPLATE NAME": "name",
      "DOCUMENT NAME": "name",
      OWNER: "ownerName",
      "LAST CHANGE": timeVariable,
    };
    const sortKey = templateUtils?.[selectedHeader?.current];
    let sortedData;
    if (value === "acce") {
      sortedData = itemsData?.current?.sort((a, b) => {
        if (a?.[sortKey] > b?.[sortKey]) return 1;
        else if (a?.[sortKey] < b?.[sortKey]) return -1;
        else if (a?.[sortKey] === b?.[sortKey]) return 0;
      });
    } else {
      sortedData = itemsData?.current?.sort((a, b) => {
        if (a?.[sortKey] < b?.[sortKey]) return 1;
        else if (a?.[sortKey] > b?.[sortKey]) return -1;
        else if (a?.[sortKey] === b?.[sortKey]) return 0;
      });
    }
    sortedData && setFilteredData([...sortedData]);
  };

  const uploadDocHandler = async (file) => {
    setLoading(true);
    var formdata = new FormData();
    formdata.append("file", file);
    formdata.append("name", file?.name);
    formdata.append("rename_if_exists", 1);
    let myHeaders = new Headers();
    myHeaders.append(
      "Authorization",
      `Bearer ${jwt_decode(JWTtoken).signeasy_access_token}`
    );
    let requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: formdata,
      redirect: "follow",
    };
    fetch("https://api.signeasy.com/v3/original/", requestOptions)
      .then((response) => response.text())
      .then((result) => {
        setSelectedItem(JSON.parse(result));
        openNotification({
          api,
          message: "Success",
          description: "Successfully uploaded the file.",
        });
        router.push({
          pathname: "/signature",
        });
        setLoading(false);
        getDocumentsHandler();
      })
      .catch((error) => {
        openNotification({
          message: "Error",
          description: error?.response?.data?.message,
          type: "error",
          api,
        });
        setLoading(false);
      });
  };

  useEffect(() => {
    if (forTemplates && browserWindow) {
      getTemplatesHandler();
    } else {
      if (browserWindow) getDocumentsHandler();
    }
  }, [browserWindow]);

  useEffect(() => {
    setBrowserWindow(window);
  }, []);

  return (
    <>
      {contextHolder}
      {loading ? (
        <Loader />
      ) : (
        <>
          <div className="">
            {/* Search bar */}
            <div className="flex items-center justify-between">
              <SearchBar
                className="w-fit my-[20px]"
                onChange={(event) => searchHandler(event?.target?.value)}
              />
              {showUpload && (
                <div>
                  {/* Upload document */}
                  <input
                    ref={inputFileRef}
                    type="file"
                    className="hidden"
                    onChange={(event) =>
                      uploadDocHandler(event.target.files[0])
                    }
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.xml,.rtf,.txt,.html,.htm,.jpeg,.jpg,.png,.bmp,.gif,.tiff,.tif,.ods,.odt,.odp,.csv"
                  />
                  <div
                    onClick={() => inputFileRef.current.click()}
                    className="text-[14px] font-lexend font-[600] cursor-pointer text-[#3F8FAB]"
                  >
                    Upload document
                  </div>
                </div>
              )}
            </div>
            {/* Table headers */}
            <div className="flex justify-between items-center bg-[#f6f8fa] border-[1px] border-[#D9D9D9]">
              {headerData?.map((item, index) => (
                <div
                  className={classNames(
                    "flex items-center py-[12px] cursor-pointer text-center",
                    selectedHeader.current === item && "bg-[#ebf0f5]",
                    index === 0 && "flex-1 justify-start",
                    index === 1 && "flex-[0.4] justify-center"
                  )}
                  key={index}
                  onClick={() => {
                    if (selectedHeader.current === item) {
                      if (sortAccending.current === true) {
                        sortAccending.current = false;
                      } else {
                        sortAccending.current = true;
                      }
                    }
                    selectedHeader.current = item || "";
                    sortHandler(sortAccending.current ? "acce" : "dec");
                  }}
                >
                  <div
                    className={classNames(
                      "font-lexend font-[600] text-[#374659] text-[12px] leading-[16.39px]",
                      index === 0 && "pl-[70px]"
                    )}
                  >
                    {item}
                  </div>
                  <div className="flex flex-col ml-[5px]">
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
                          selectedHeader.current === item ? "#3F8FAB" : "gray",
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
            {/* Table data */}
            <div className="">
              <div className="w-[100%] pb-[81.6px]">
                {filteredData?.map((document, index) => (
                  <div
                    key={index}
                    className={classNames(
                      "flex w-[100%] items-center border-b-[1px] border-l-[1px] border-r-[1px] border-[#D9D9D9] py-[10px]"
                    )}
                  >
                    <div
                      className="flex flex-1 items-center ml-[18px] cursor-pointer"
                      onClick={() => {
                        setSelectedItem((prev) =>
                          prev?.id === document?.id ? {} : document
                        );
                      }}
                    >
                      <RadioButton
                        isActive={document?.id === selectedItem?.id}
                        isDisabled={document?.name === undefined}
                      />
                      <div className="pl-[18px] pr-[50px] text-[14px] font-lexend font-[500]">
                        {document?.name}
                      </div>
                    </div>
                    <div className="flex flex-col flex-[0.4] -ml-[120px] text-[14px] justify-center items-center">
                      <div className="font-lexend font-[400]">
                        {
                          dateHandler({
                            timestamp: document?.[timeVariable],
                          })[0]
                        }
                      </div>
                      <div className="font-lexend text-[14px] font-[400]">
                        {
                          dateHandler({
                            timestamp: document?.[timeVariable],
                          })[1]
                        }
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* Bottom Buttons */}
          <div className="fixed bottom-0 pb-[6px] pt-[30px] bg-[white] w-[100%]">
            <BottomButtons forTemplates={forTemplates} />
          </div>
        </>
      )}
    </>
  );
}

export default DocumentsPage;
