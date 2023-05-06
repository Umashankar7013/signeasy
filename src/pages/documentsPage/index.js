import React, { useContext, useEffect, useRef, useState } from "react";
import { getApi } from "../../api/apiMethods";
import { CaretDownOutlined, CaretUpOutlined } from "@ant-design/icons";
import { useRouter } from "next/router";
import { SearchBar } from "../../components/SearchBar";
import { RadioButton } from "../../components/RadioButton";
import classNames from "classnames";
import { dateHandler, openNotification } from "../../utils/functions";
import { AppContext } from "../_app";
import jwt_decode from "jwt-decode";
import { notification } from "antd";
import { Loader } from "../../components/Loader";
import { BottomButtons } from "../../components/BottomButtons";

function DocumentsPage({ showUpload = true, forTemplates = false }) {
  const itemsData = useRef([]);
  const [filteredData, setFilteredData] = useState();
  const [loading, setLoading] = useState(true);
  const headerData = [
    forTemplates ? "TEMPLATE NAME" : "DOCUMENT NAME",
    "LAST CHANGE",
  ];
  const { selectedItem, setSelectedItem, setDocParams, JWTtoken, setJWTtoken } =
    useContext(AppContext);
  const selectedHeader = useRef("");
  const router = useRouter();
  const inputFileRef = useRef(null);
  const [browserWindow, setBrowserWindow] = useState();
  const [api, contextHolder] = notification.useNotification();

  const tokenHandler = async () => {
    const currentUrl = window.location.href;
    const searchParams = new URL(currentUrl).searchParams;
    const authId = searchParams?.get("authId");
    const objectId = searchParams?.get("object_id");
    const objectType = searchParams?.get("object_type");
    const firstName = searchParams?.get("first_name");
    const lastName = searchParams?.get("last_name");
    const email = searchParams?.get("email");
    const JWTtoken = searchParams?.get("JWTtoken");
    setDocParams((prev) => ({
      ...prev,
      authId,
      objectId,
      objectType,
      firstName,
      lastName,
      email,
    }));
    if (authId) {
      const data = await getApi({
        endUrl: `set-up/auth?authId=${authId}`,
      });
      setJWTtoken(data?.token);
    }
    if (JWTtoken) {
      setJWTtoken(JWTtoken);
    }
  };

  const getDocumentsHandler = async () => {
    if (window) {
      const docsData = await getApi({
        endUrl: "hubspot-card/documents",
        headers: {
          "x-access-token": JWTtoken,
        },
      });
      docsData && (itemsData.current = docsData?.data?.files);
      setFilteredData(itemsData?.current);
      setLoading(false);
    } else {
      console.log("Not able to access the window.");
    }
  };

  const getTemplatesHandler = async () => {
    if (window) {
      const docsData = await getApi({
        endUrl: "hubspot-card/templates",
        headers: {
          "x-access-token": JWTtoken,
        },
      });
      docsData && (itemsData.current = docsData?.data);
      setFilteredData(itemsData?.current);
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

  const sortHandler = () => {
    const templateUtils = {
      "TEMPLATE NAME": "name",
      "DOCUMENT NAME": "name",
      OWNER: "ownerName",
      "LAST CHANGE": "modified_time",
    };
    const sortKey = templateUtils?.[selectedHeader?.current];
    const sortedData = itemsData?.current?.sort((a, b) => {
      if (a?.[sortKey] > b?.[sortKey]) return 1;
      else if (a?.[sortKey] < b?.[sortKey]) return -1;
      else if (a?.[sortKey] === b?.[sortKey]) return 0;
    });
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
          description: error.message,
          type: "error",
          api,
        });
        setLoading(false);
      });
  };

  useEffect(() => {
    if (forTemplates && JWTtoken !== "") {
      getTemplatesHandler();
    } else {
      if (JWTtoken !== "") {
        getDocumentsHandler();
      }
    }
  }, [browserWindow, JWTtoken]);

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
                  onChange={(event) => uploadDocHandler(event.target.files[0])}
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
                  index === 1
                    ? headerData?.length === 2
                      ? "flex-[0.4] justify-center"
                      : "flex-[0.6] justify-center"
                    : ""
                  // index === 2 && "flex-[0.4] justify-center"
                )}
                key={index}
                onClick={() => {
                  selectedHeader.current = item;
                  sortHandler();
                }}
              >
                <div
                  className={classNames(
                    "font-lexend font-medium text-[14px]",
                    index === 0 && "md:pl-[60px] pl-[47px]"
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
          <div className="w-[100%] shadow-md pb-[100px]">
            {filteredData?.map((document, index) => (
              <div
                key={index}
                className={classNames(
                  "flex w-[100%] items-center border-b-[1px] border-l-[1px] border-r-[1px] border-[#D9D9D9] py-[10px]",
                  index === filteredData?.length - 1 && "shadow-lg"
                )}
              >
                <div
                  className="flex flex-1 items-center ml-[10px] cursor-pointer"
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
                  <div className="md:pl-[30px] pl-[15px] pr-[10px] text-[14px] font-lexend font-medium">
                    {document?.name}
                  </div>
                </div>
                <div className="flex flex-col flex-[0.4] text-[14px] justify-center items-center">
                  <div className="font-lexend">
                    {
                      dateHandler({
                        timestamp: document?.last_modified_time,
                      })[0]
                    }
                  </div>
                  <div className="font-lexend text-[14px]">
                    {
                      dateHandler({
                        timestamp: document?.last_modified_time,
                      })[1]
                    }
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* Bottom Buttons */}
          <div className="fixed bottom-0 bg-[white] w-[100%] py-[15px] px-[20px]">
            <BottomButtons forTemplates={forTemplates} />
          </div>
        </>
      )}
    </>
  );
}

export default DocumentsPage;
