// import React, { useEffect, useRef, useState } from "react";
// import TemplatesAndDocs from "../../components/TemplatesAndDocs";
// import { getApi } from "../../api/apiMethods";
// import { LoadingOutlined } from "@ant-design/icons";

// const Templates = () => {
//   const itemsData = useRef([
//     {
//       name: "Test Document 2",
//       ownerName: "uma",
//       modified_time: 23451234,
//     },
//     {
//       name: "Test Document 1",
//       ownerName: "joy",
//       modified_time: 23451234,
//     },
//     {
//       name: "Test Document 3",
//       ownerName: "Dinesh",
//       modified_time: 23451234,
//     },
//   ]);
//   const [filteredData, setFilteredData] = useState();
//   const [loading, setLoading] = useState(true);

//   const getTemplatesHandler = async () => {
//     if (window) {
//       const currentUrl = window.location.href;
//       const searchParams = new URL(currentUrl).searchParams;
//       const userId = searchParams?.get("hubspot_user_id");
//       const portalId = searchParams?.get("hubspot_portal_id");
//       const data = await getApi({
//         endUrl: "hubspot-card/templates",
//         params: {
//           hubspot_user_id: userId,
//           hubspot_portal_id: portalId,
//         },
//       });
//       data && (itemsData.current = data?.data);
//       setFilteredData(itemsData?.current);
//       setLoading(false);
//     } else {
//       console.log("Not able to access the window.");
//     }
//   };

//   useEffect(() => {
//     getTemplatesHandler();
//   }, []);

//   return loading ? (
//     <div className="flex h-[100vh] w-[100vw] justify-center items-center">
//       <LoadingOutlined />
//     </div>
//   ) : (
//     <TemplatesAndDocs
//       paramFilteredData={filteredData}
//       paramItemsData={itemsData.current}
//       itemsGetFun={getTemplatesHandler}
//     />
//   );
// };

// export default Templates;

import React, { useContext, useEffect, useRef, useState } from "react";
import { getApi } from "../../api/apiMethods";
import {
  CaretDownOutlined,
  CaretUpOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/router";
import { SearchBar } from "../../components/SearchBar";
import { RadioButton } from "../../components/RadioButton";
import { PrimaryButton } from "../../components/PrimaryButton";
import classNames from "classnames";
import { dateHandler } from "../../utils/functions";
import { AppContext } from "../_app";
import jwt_decode from "jwt-decode";
import { ImageWithBasePath } from "../../components/ImageWithBasePath";
import { Loader } from "../../components/Loader";
import { BottomButtons } from "../../components/BottomButtons";

function Templates() {
  const itemsData = useRef([
    {
      id: 1,
      name: "Test Document 2",
      ownerName: "uma Shankar",
      modified_time: 23451234,
    },
    {
      id: 2,
      name: "Test Document 1",
      ownerName: "joy",
      modified_time: 23451234,
    },
    {
      id: 3,
      name: "Test Document 3",
      ownerName: "Dinesh",
      modified_time: 23451234,
    },
  ]);
  const [filteredData, setFilteredData] = useState();
  const [loading, setLoading] = useState(true);
  const headerData = ["TEMPLATE NAME", "OWNER", "LAST CHANGE"];
  const { selectedItem, setSelectedItem, setDocParams, setJWTtoken } =
    useContext(AppContext);
  const selectedHeader = useRef("");
  const router = useRouter();
  const [browserWindow, setBrowserWindow] = useState();

  const getTemplatesHandler = async () => {
    if (window) {
      const currentUrl = window.location.href;
      const searchParams = new URL(currentUrl).searchParams;
      const authId = searchParams?.get("authId");
      const objectId = searchParams?.get("object_id");
      const objectType = searchParams?.get("object_type");
      const firstName = searchParams?.get("first_name");
      const lastName = searchParams?.get("last_name");
      const email = searchParams?.get("email");
      setDocParams((prev) => ({
        ...prev,
        authId,
        objectId,
        objectType,
        firstName,
        lastName,
        email,
      }));
      const data = await getApi({
        endUrl: `set-up/auth?authId=${authId}`,
      });
      data && setJWTtoken(data?.token);
      const docsData = await getApi({
        endUrl: "hubspot-card/templates",
        headers: {
          "x-access-token": data?.token,
        },
      });
      docsData && (itemsData.current = docsData?.data?.files);
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

  useEffect(() => {
    getTemplatesHandler();
  }, [browserWindow]);

  useEffect(() => {
    setBrowserWindow(window);
  }, []);

  return loading ? (
    <Loader />
  ) : (
    <div className="w-[100%] pb-[30px] px-[20px] md:px-[50px]">
      {/* Header */}
      <div className="font-lexend text-[14px] pt-[20px]">
        Pick a template to send to your customer and attach to this conatct
      </div>
      {/* Search bar */}
      <SearchBar
        className="w-fit"
        onChange={(event) => searchHandler(event?.target?.value)}
      />
      {/* Table headers */}
      <div className="flex w-[100%] justify-between items-center bg-[#f6f8fa] border-[1px] border-[#D9D9D9]">
        {headerData?.map((item, index) => (
          <div
            className={classNames(
              "flex items-center py-[12px] cursor-pointer text-center",
              selectedHeader.current === item && "bg-[#ebf0f5]",
              index === 0 && "flex-1 justify-start",
              index === 1 && "flex-[0.4] justify-center",
              index === 2 && "flex-[0.4] justify-center"
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
                  color: selectedHeader.current === item ? "#3F8FAB" : "gray",
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Table data */}
      <div className="w-[100%] flex flex-col">
        {filteredData?.map((template, index) => (
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
                  prev?.id === template?.id ? {} : template
                );
              }}
            >
              <RadioButton
                isActive={template?.id === selectedItem?.id}
                isDisabled={template?.name === undefined}
              />
              <div className="md:pl-[30px] pl-[15px] pr-[10px] text-[14px] font-lexend font-medium flex-wrap">
                {template?.name}
              </div>
            </div>
            <div className="flex flex-[0.4] justify-center items-center">
              <div className="text-[14px] font-lexend font-medium flex-wrap px-[10px]">
                {template?.ownerName || "Owner Name"}
              </div>
            </div>
            <div className="flex flex-col flex-[0.4] text-[14px] justify-center items-center">
              <div className="font-lexend">
                {
                  dateHandler({
                    timestamp: template?.last_modified_time,
                  })[0]
                }
              </div>
              <div className="font-lexend text-[14px]">
                {
                  dateHandler({
                    timestamp: template?.last_modified_time,
                  })[1]
                }
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Bottom Buttons */}
      <div className="sticky bottom-0 bg-[#f6f8fa] py-[15px] px-[20px]">
        <BottomButtons />
      </div>
    </div>
  );
}

export default Templates;
