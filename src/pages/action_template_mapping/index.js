import { LeftOutlined } from "@ant-design/icons";
import classNames from "classnames";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { Tabs } from "../../components/Tabs";
import { PrimaryButton } from "../../components/PrimaryButton";
import { MultiTextInputDropdown } from "../../components/MultiTextInputDropdown";

function ActionTemplateMapping() {
  const router = useRouter();
  const selectedTemplate = JSON?.parse(router?.query?.selectedItem) || {};
  // const selectedTemplate = "";
  const tabs = ["Contacts", "Company", "Deals"];
  const [selectedTab, setSelectedTab] = useState(tabs[0]);
  const headerData = ["SIGNEASY", "HUBSPOT VARIABLES"];
  const onChangeTabHandler = (tab) => {
    setSelectedTab(tab);
  };
  const [data, setData] = useState([
    {
      name: "First name",
      dropDownData: ["First name", "Last Name", "Phone number", "Company name"],
      selectedVariables: [],
    },
    {
      name: "Last name",
      dropDownData: ["First name", "Last Name", "Phone number", "Company name"],
      selectedVariables: [],
    },
    {
      name: "Company name",
      dropDownData: ["First name", "Last Name", "Phone number", "Company name"],
      selectedVariables: [],
    },
    {
      name: "Phone number",
      dropDownData: ["First name", "Last Name", "Phone number", "Company name"],
      selectedVariables: [],
    },
  ]);

  const addVariablesHandler = (item, index) => {
    setData((prev) => {
      prev[index].selectedVariables.push(item);
      return [...prev];
    });
  };

  const deleteVariableHandler = (variable, index) => {
    setData((prev) => {
      const filteredData = prev?.[index]?.selectedVariables?.filter(
        (item) => item !== variable
      );
      prev[index].selectedVariables = filteredData;
      return [...prev];
    });
  };

  const activateSaveHandler = () => {
    let count = 0;
    data?.map((item) => {
      if (item?.selectedVariables?.length > 0) {
        count += 1;
      }
    });
    if (count === data?.length) return true;
    else return false;
  };

  return (
    <div className="">
      <div
        className="flex items-center cursor-pointer w-fit pb-[15px]"
        onClick={() => router.back()}
      >
        <LeftOutlined className="text-[#3F8FAB] text-[10px]" />
        <div className="text-[14px] text-[#3F8FAB] pl-[7px] font-lexend font-[500]">
          Back to templates
        </div>
      </div>
      <div className="text-[18px] font-lexend leading-[22.5px] text-[#374659] pb-[20px]">
        {selectedTemplate?.name || "name"}
      </div>
      <div className="pb-[23px]">
        <Tabs tabs={tabs} onChangeTab={onChangeTabHandler} />
      </div>
      <div className="border-[1px] mb-[70px]">
        <div className="flex w-[100%] bg-[#F6F8FA] border-b-[1px]">
          {headerData?.map((header) => (
            <div className="w-[50%] py-[14px] pl-[25px] text-[14px] text-[#374659] font-[700] font-lexend leading-[17.5px]">
              {header}
            </div>
          ))}
        </div>
        <div>
          {data?.map((item, index) => (
            <div
              className={classNames(
                "flex items-center",
                index !== data?.length && "border-b-[1px]"
              )}
            >
              <div className="w-[50%] pl-[25px] text-[14px] text-[#374659] font-[400] font-lexend">
                {item?.name}
              </div>
              <div className="w-[200px] pl-[25px] py-[19px]">
                <MultiTextInputDropdown
                  placeHolder="Select variables"
                  className="justify-between bg-[#F6F8FA]"
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
      <div className="fixed bottom-0 h-[68px] bg-[#F6F8FA] w-[100%] flex items-center">
        <PrimaryButton
          title="Save"
          className={classNames(
            "px-[25px] py-[11px] text-[#FFFFFF] bg-[#EE8162] font-[600] ml-[40px]",
            activateSaveHandler() ? "opacity-100" : "opacity-50"
          )}
        />
      </div>
    </div>
  );
}

export default ActionTemplateMapping;
