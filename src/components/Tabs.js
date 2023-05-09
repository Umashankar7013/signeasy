import classNames from "classnames";
import React, { useState } from "react";

export const Tabs = ({ tabs, onChangeTab = () => {} }) => {
  const [selectedTab, setSelectedTab] = useState(tabs[0]);
  return (
    <div className="border-b-2 flex pt-[19px]">
      {tabs?.map((tab) => (
        <div
          className={classNames(
            "px-[20px] cursor-pointer font-lexend text-[#374659] text-[14px] pb-[12px] font-[500] leading-[17.5px] select-none",
            selectedTab === tab && "border-b-[5px] border-b-[#374659]"
          )}
          onClick={() => {
            onChangeTab(tab);
            setSelectedTab(tab);
          }}
        >
          {tab}
        </div>
      ))}
    </div>
  );
};
