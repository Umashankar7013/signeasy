import { LeftOutlined } from "@ant-design/icons";
import classNames from "classnames";
import { useRouter } from "next/router";
import React, { useContext, useState } from "react";
import { Tabs } from "../../components/Tabs";
import { PrimaryButton } from "../../components/PrimaryButton";
import { MultiTextInputDropdown } from "../../components/MultiTextInputDropdown";
import { AppContext } from "../_app";

function ActionTemplateMapping() {
  const router = useRouter();
  const { selectedItem } = useContext(AppContext);
  const tabs = ["Contacts", "Company", "Deals"];
  const [selectedTab, setSelectedTab] = useState(tabs[0]);
  const headerData = ["SIGNEASY", "HUBSPOT VARIABLES"];

  const onChangeTabHandler = (tab) => {
    setSelectedTab(tab);
  };

  const [data, setData] = useState({
    Contacts: [
      {
        name: "First name",
        dropDownData: [
          "First name",
          "Last Name",
          "Phone number",
          "Company name",
        ],
        selectedVariables: [],
      },
      {
        name: "Last name",
        dropDownData: [
          "First name",
          "Last Name",
          "Phone number",
          "Company name",
        ],
        selectedVariables: [],
      },
      {
        name: "Company name",
        dropDownData: [
          "First name",
          "Last Name",
          "Phone number",
          "Company name",
        ],
        selectedVariables: [],
      },
      {
        name: "Phone number",
        dropDownData: [
          "First name",
          "Last Name",
          "Phone number",
          "Company name",
        ],
        selectedVariables: [],
      },
    ],
    Company: [
      {
        name: "First name",
        dropDownData: [
          "First name",
          "Last Name",
          "Phone number",
          "Company name",
        ],
        selectedVariables: [],
      },
      {
        name: "Last name",
        dropDownData: [
          "First name",
          "Last Name",
          "Phone number",
          "Company name",
        ],
        selectedVariables: [],
      },
      {
        name: "Company name",
        dropDownData: [
          "First name",
          "Last Name",
          "Phone number",
          "Company name",
        ],
        selectedVariables: [],
      },
      {
        name: "Phone number",
        dropDownData: [
          "First name",
          "Last Name",
          "Phone number",
          "Company name",
        ],
        selectedVariables: [],
      },
    ],
    Deals: [
      {
        name: "First name",
        dropDownData: [
          "First name",
          "Last Name",
          "Phone number",
          "Company name",
        ],
        selectedVariables: [],
      },
      {
        name: "Last name",
        dropDownData: [
          "First name",
          "Last Name",
          "Phone number",
          "Company name",
        ],
        selectedVariables: [],
      },
      {
        name: "Company name",
        dropDownData: [
          "First name",
          "Last Name",
          "Phone number",
          "Company name",
        ],
        selectedVariables: [],
      },
      {
        name: "Phone number",
        dropDownData: [
          "First name",
          "Last Name",
          "Phone number",
          "Company name",
        ],
        selectedVariables: [],
      },
    ],
  });

  const addVariablesHandler = (item, index) => {
    setData((prev) => {
      prev?.[selectedTab]?.[index].selectedVariables.push(item);
      return { ...prev };
    });
  };

  const deleteVariableHandler = (variable, index) => {
    setData((prev) => {
      const filteredData = prev?.[selectedTab]?.[
        index
      ]?.selectedVariables?.filter((item) => item !== variable);
      prev[selectedTab][index].selectedVariables = filteredData;
      return { ...prev };
    });
  };

  const activateSaveHandler = () => {
    let count = 0;
    data?.[selectedTab].map((item) => {
      if (item?.selectedVariables?.length > 0) {
        count += 1;
      }
    });
    if (count === data?.length) return true;
    else return false;
  };

  return (
    <div>
      {/* Back Button */}
      <div
        className="flex items-center cursor-pointer w-fit pb-[15px]"
        onClick={() => router.back()}
      >
        <LeftOutlined className="text-[#3F8FAB] text-[10px]" />
        <div className="text-[14px] text-[#3F8FAB] pl-[7px] font-lexend font-[500]">
          Back to templates
        </div>
      </div>
      {/* Template Name */}
      <div className="text-[18px] font-lexend leading-[22.5px] text-[#374659] pb-[20px]">
        {selectedItem?.name || "name"}
      </div>
      {/* Tabs */}
      <div className="pb-[23px]">
        <Tabs tabs={tabs} onChangeTab={onChangeTabHandler} />
      </div>
      {/* Table */}
      <div className="border-[1px] mb-[70px]">
        {/* Header */}
        <div className="flex w-[100%] bg-[#F6F8FA] border-b-[1px]">
          {headerData?.map((header, index) => (
            <div
              className="w-[50%] py-[14px] pl-[25px] text-[14px] text-[#374659] font-[700] font-lexend leading-[17.5px]"
              key={index}
            >
              {header}
            </div>
          ))}
        </div>
        {/* Variables data */}
        <div>
          {data?.[selectedTab].map((item, index) => (
            <div
              className={classNames(
                "flex items-center",
                index !== data?.length && "border-b-[1px]"
              )}
              key={index}
            >
              <div className="w-[50%] pl-[25px] text-[14px] text-[#374659] font-[400] font-lexend">
                {item?.name}
              </div>
              <div className="w-[200px] pl-[25px] py-[19px]">
                <MultiTextInputDropdown
                  placeHolder="Select variables"
                  className="justify-between bg-[#F6F8FA] h-[36px]"
                  dropDownData={item?.dropDownData}
                  data={item?.selectedVariables}
                  addFun={addVariablesHandler}
                  deleteFun={deleteVariableHandler}
                  specificIndex={index}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Save Button */}
      <div className="fixed bottom-0 h-[68px] bg-[#F6F8FA] w-[100%] flex items-center">
        <PrimaryButton
          title="Save"
          className={classNames(
            "px-[25px] py-[11px] text-[#FFFFFF] bg-[#EE8162] font-[600] ml-[25px]",
            activateSaveHandler() ? "opacity-100" : "opacity-50"
          )}
        />
      </div>
    </div>
  );
}

export default ActionTemplateMapping;
