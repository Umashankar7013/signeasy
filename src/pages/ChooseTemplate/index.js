import React, { useRef, useState } from "react";
import {
  SearchOutlined,
  CaretUpOutlined,
  CaretDownOutlined,
} from "@ant-design/icons";
import classNames from "classnames";
import { RadioButton } from "../../components/RadioButton";

const ChooseTemplate = () => {
  const templateData = [
    {
      templateName: "Sales Non-disclosure Agreement",
      name: "Uma",
      date: "1/23/2023",
      time: "9:49:10 PM",
    },
    {
      templateName: "Healthcare Discharge Form",
      name: "Shankar",
      date: "1/23/2023",
      time: "9:08:40 PM",
    },
    {
      templateName: "Agreement Form",
      name: "Joy",
      date: "12/5/2022",
      time: "12:48:01 AM",
    },
    {
      templateName: "NDA_1",
      name: "Dinesh",
      date: "11/28/2022",
      time: "12:55:58 PM",
    },
  ];
  const headerData = ["TEMPLATE NAME", "OWNER", "LAST CHANGE"];
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [filteredData, setFilteredData] = useState(templateData);
  const selectedHeader = useRef("");

  const searchHandler = (text) => {
    if (text.length === 0) {
      setFilteredData(templateData);
      return;
    } else {
      const sortedData = templateData.filter((item) =>
        item?.templateName?.toLowerCase().includes(text)
      );
      setFilteredData([...sortedData]);
    }
  };

  const sortHandler = () => {
    const templateUtils = {
      "TEMPLATE NAME": "templateName",
      OWNER: "name",
      "LAST CHANGE": "date",
    };
    const sortKey = templateUtils?.[selectedHeader?.current];
    const sortedData = templateData.sort((a, b) => {
      if (a?.[sortKey] > b?.[sortKey]) return 1;
      else if (a?.[sortKey] < b?.[sortKey]) return -1;
      else if (a?.[sortKey] === b?.[sortKey]) return 0;
    });

    setFilteredData([...sortedData]);
  };

  return (
    <div className="w-[100%] px-[50px]">
      <div className="font-lexend pt-[20px]">
        Pick a template to send to your customer and attach to this conatct
      </div>
      <div className="border-[1px] w-fit flex items-center py-[10px] px-[8px] rounded-[4px] my-[20px] bg-gray-100">
        <input
          placeholder="Search"
          style={{ outline: "none" }}
          className="font-lexend bg-gray-100"
          onChange={(event) => searchHandler(event?.target?.value)}
        />
        <SearchOutlined style={{ color: "#3F8FAB", fontSize: "18px" }} />
      </div>
      <div className="flex w-[100%] justify-around items-center bg-gray-100 border-[1px] border-[#D9D9D9]">
        {headerData?.map((item, index) => (
          <div
            className={classNames(
              "flex items-center py-[12px]",
              selectedHeader.current === item && "bg-gray-300",
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
                "font-lexend font-medium",
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
      <div className="w-[100%] flex flex-col">
        {filteredData?.map((template, index) => (
          <div
            key={index}
            className={classNames(
              "flex w-[100%] items-center border-b-[1px] border-l-[1px] border-r-[1px] border-[#D9D9D9] py-[10px] py-[10px]",
              index === filteredData?.length - 1 && "drop-shadow-lg"
            )}
          >
            <div className="flex flex-1 items-center ml-[10px]">
              <div
                onClick={() =>
                  setSelectedTemplate((prev) =>
                    prev === template?.templateName
                      ? ""
                      : template?.templateName
                  )
                }
              >
                <RadioButton
                  isActive={template?.templateName === selectedTemplate}
                  isDisabled={template?.templateName === undefined}
                />
              </div>
              <div className="pl-[30px] font-lexend font-medium">
                {template?.templateName}
              </div>
            </div>
            <div className="flex flex-[0.6] justify-center font-lexend">
              {template?.name}
            </div>
            <div className="flex flex-col flex-[0.5] items-center">
              <div className="font-lexend">{template?.date}</div>
              <div className="font-lexend">{template?.time}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-between items-center pt-[30px]">
        <div className="font-lexend font-bold">Cancel</div>
        <div
          className={classNames(
            "px-[40px] py-[8px] rounded-[4px] font-lexend font-bold",
            selectedTemplate !== ""
              ? "bg-orange-300 text-[white]"
              : "bg-[#D9D9D9] text-[gray]"
          )}
        >
          Next
        </div>
      </div>
    </div>
  );
};

export default ChooseTemplate;
