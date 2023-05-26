import { LeftOutlined } from "@ant-design/icons";
import classNames from "classnames";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";
import { Tabs } from "../../components/Tabs";
import { PrimaryButton } from "../../components/PrimaryButton";
import { MultiTextInputDropdown } from "../../components/MultiTextInputDropdown";
import { getApi, putMethod } from "../../api/apiMethods";
import { openNotification } from "../../utils/functions";
import { notification } from "antd";
import { Loader } from "../../components/Loader";
import { ErrorPage } from "../../components/ErrorPage";
import { AppContext } from "../../components/Layout";

function ActionTemplateMapping() {
  const router = useRouter();
  const { selectedItem, JWTtoken, tabsDropdownData } = useContext(AppContext);
  const [browserWindow, setBrowserWindow] = useState();
  const tabs = ["Contacts", "Company", "Deals"];
  const [selectedTab, setSelectedTab] = useState(tabs[0]);
  const headerData = ["SIGNEASY", "HUBSPOT VARIABLES"];
  const [api, contextHolder] = notification.useNotification();
  const [loading, setLoading] = useState(true);
  const tabsDropdownDataUtils = {
    Contacts: "contacts",
    Company: "companies",
    Deals: "deals",
  };

  const onChangeTabHandler = (tab) => {
    setSelectedTab(tab);
  };

  const [data, setData] = useState({});

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
    data?.[selectedTab]?.map((item) => {
      if (item?.selectedVariables?.length > 0) {
        count += 1;
      }
    });
    if (count === data?.[selectedTab]?.length) return true;
    else return false;
  };

  const saveHandler = async () => {
    setLoading(true);
    const tabUtils = {
      Contacts: "contact",
      Company: "company",
      Deals: "deal",
    };
    let formattedData = {};
    Object?.keys(data)?.map((key) => {
      let array = [];
      data[key]?.map((item) => {
        array.push({
          signeasy_field: item?.name,
          hubspot_field: item?.selectedVariables,
        });
      });
      formattedData[tabUtils[key]] = array;
    });
    await putMethod({
      endUrl: `set-up/settings/mapping/${selectedItem?.id}`,
      headers: {
        "x-access-token": JWTtoken,
      },
      data: formattedData,
    })
      .then(() => {
        openNotification({
          message: "Success",
          description: "Mapping stored successfully",
          api,
        });
        setTimeout(() => router.back(), 1000);
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

  const selectedVariablesHandler = (data, tab, value) => {
    let returnValue = [];
    data?.[tab]?.map((item) => {
      if (item?.signeasy_field === value) {
        returnValue = item?.hubspot_field;
        return;
      }
    });
    return returnValue;
  };

  const getSavedTemplateData = async () => {
    await getApi({
      endUrl: `set-up/settings/mapping/${selectedItem?.id}`,
      headers: {
        "x-access-token": JWTtoken,
      },
    })
      .then((data) => {
        let tabs = ["Contacts", "Company", "Deals"];
        const tabUtils = {
          Contacts: "contact",
          Company: "company",
          Deals: "deal",
        };
        let dataObject = {};
        tabs?.map((tab) => {
          let array = [];
          selectedItem?.metadata?.merge_fields?.map((field) => {
            array.push({
              name: field?.label,
              dropDownData: tabsDropdownData[tabsDropdownDataUtils[tab]],
              selectedVariables: selectedVariablesHandler(
                data?.data,
                tabUtils[tab],
                field?.label
              ),
            });
          });
          dataObject[tab] = array;
        });
        setData(dataObject);
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

  useEffect(() => {
    getSavedTemplateData();
    setBrowserWindow(window);
  }, []);

  return typeof browserWindow?.localStorage === "undefined" ? (
    <ErrorPage />
  ) : (
    <>
      {contextHolder}
      {loading ? (
        <Loader />
      ) : (
        <div className="p-[30px]">
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
              {data?.[selectedTab]?.map((item, index) => (
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
          <div className="fixed bottom-0 h-[68px] bg-[#F6F8FA] w-[94%] flex items-center">
            <PrimaryButton
              title="Save"
              className={classNames(
                "px-[25px] py-[11px] text-[#FFFFFF] bg-[#EE8162] font-[600] ml-[25px]",
                activateSaveHandler() ? "opacity-100" : "opacity-50"
              )}
              onClick={() => activateSaveHandler() && saveHandler()}
            />
          </div>
        </div>
      )}
    </>
  );
}

export default ActionTemplateMapping;
