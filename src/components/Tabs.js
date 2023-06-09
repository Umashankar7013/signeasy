import classNames from "classnames";
import React, { useState } from "react";

export const Tabs = ({ tabs, onChangeTab = () => {} }) => {
  const [selectedTab, setSelectedTab] = useState(tabs[0]);
  return (
    <div className="border-b-2 flex">
      {tabs?.map((tab, index) => (
        <div key={index} className="relative">
          <div
            className={classNames(
              "px-[20px] cursor-pointer font-lexend text-[#374659] text-[14px] pb-[12px] leading-[17.5px] select-none",
              selectedTab === tab ? "font-[500]" : "font-[300]"
            )}
            onClick={() => {
              onChangeTab(tab);
              setSelectedTab(tab);
            }}
          >
            {tab}
          </div>
          {selectedTab === tab && (
            <div className="h-[5px] w-[100%] absolute bg-[#374659] -mt-[1px] rounded-[10px]"></div>
          )}
        </div>
      ))}
    </div>
  );
};
