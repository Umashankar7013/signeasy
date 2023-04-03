import React, { useEffect, useRef, useState } from "react";
import {
  CaretUpOutlined,
  CaretDownOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import classNames from "classnames";
import { RadioButton } from "../../components/RadioButton";
import { useRouter } from "next/router";
import { PrimaryButton } from "../../components/PrimaryButton";
import { SearchBar } from "../../components/SearchBar";
import { getApi } from "../../api/apiMethods";

const Templates = () => {
  const headerData = ["TEMPLATE NAME", "OWNER", "LAST CHANGE"];
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [filteredData, setFilteredData] = useState();
  const selectedHeader = useRef("");
  const router = useRouter();
  const templateData = useRef();
  const [loading, setLoading] = useState(true);

  const searchHandler = (text) => {
    if (text.length === 0) {
      setFilteredData(templateData?.current);
      return;
    } else {
      const sortedData = templateData?.current?.filter((item) =>
        item?.name?.toLowerCase().includes(text)
      );
      sortedData && setFilteredData([...sortedData]);
    }
  };

  const sortHandler = () => {
    const templateUtils = {
      "TEMPLATE NAME": "name",
      OWNER: "name",
      "LAST CHANGE": "date",
    };
    const sortKey = templateUtils?.[selectedHeader?.current];
    const sortedData = templateData?.current?.sort((a, b) => {
      if (a?.[sortKey] > b?.[sortKey]) return 1;
      else if (a?.[sortKey] < b?.[sortKey]) return -1;
      else if (a?.[sortKey] === b?.[sortKey]) return 0;
    });
    sortedData && setFilteredData([...sortedData]);
  };

  const dateHandler = ({ timestamp = "" }) => {
    const date = new Date(timestamp);
    const modifiedTime = date.toLocaleString("en-US");
    return modifiedTime?.split(",");
  };

  const getTemplatesHandler = async () => {
    if (window) {
      const currentUrl = window.location.href;
      const searchParams = new URL(currentUrl).searchParams;
      const userId = searchParams?.get("hubspot_user_id");
      const portalId = searchParams?.get("hubspot_portal_id");
      const data = await getApi({
        endUrl: "hubspot-card/templates",
        params: {
          hubspot_user_id: userId,
          hubspot_portal_id: portalId,
        },
      });
      templateData.current = data?.data;
      setFilteredData(data?.data);
      setLoading(false);
    } else {
      console.log("Not able to access the window.");
    }
  };

  useEffect(() => {
    getTemplatesHandler();
  }, []);

  return loading ? (
    <div className="flex h-[100vh] w-[100vw] justify-center items-center">
      <LoadingOutlined />
    </div>
  ) : (
    <div className="w-[100%] px-[50px]">
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
      <div className="flex w-[100%] justify-around items-center bg-[#f6f8fa] border-[1px] border-[#D9D9D9]">
        {headerData?.map((item, index) => (
          <div
            className={classNames(
              "flex items-center py-[12px] cursor-pointer",
              selectedHeader.current === item && "bg-[#ebf0f5]",
              index === 0 && "flex-1 justify-start",
              index === 1 && "flex-[0.6] justify-center",
              index === 2 && "flex-[0.5] justify-center"
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
                index === 0 && "pl-[60px] w-fit"
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
            <div className="flex flex-1 items-center ml-[10px]">
              <div
                onClick={() =>
                  setSelectedTemplate((prev) =>
                    prev === template?.name ? "" : template?.name
                  )
                }
              >
                <RadioButton
                  isActive={template?.name === selectedTemplate}
                  isDisabled={template?.name === undefined}
                />
              </div>
              <div className="pl-[30px] text-[14px] font-lexend font-medium">
                {template?.name}
              </div>
            </div>
            <div className="flex flex-[0.6] text-[14px] justify-center font-lexend">
              {template?.ownerName || "uma"}
            </div>
            <div className="flex flex-col flex-[0.5] text-[14px] justify-center items-center">
              <div className="font-lexend">
                {dateHandler({ timestamp: template?.modified_time })[0]}
              </div>
              <div className="font-lexend text-[14px]">
                {dateHandler({ timestamp: template?.modified_time })[1]}
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Bottom Buttons */}
      <div className="flex justify-between items-center pt-[30px]">
        <div className="font-lexend font-bold cursor-pointer text-[14px]">
          Cancel
        </div>
        <PrimaryButton
          title="Next"
          className={classNames(
            "px-[40px] py-[10px]",
            selectedTemplate !== "" ? "bg-[#ee8162]" : "bg-[#D9D9D9]"
          )}
          titleClassName={classNames(
            "font-lexend font-bold text-[14px]",
            selectedTemplate !== "" ? "text-[white]" : "text-[gray]"
          )}
          onClick={() => router.push("/signature")}
        />
      </div>
    </div>
  );
};

export default Templates;
