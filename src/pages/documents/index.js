import classNames from "classnames";
import React, { useState } from "react";
import Templates from "../templates";
import DocumentsPage from "../documentsPage";
import { Tabs } from "../../components/Tabs";

function TemplatesAndDocs() {
  const tabs = ["Templates", "Documents"];
  const [selectedTab, setSelectedTab] = useState(tabs[0]);

  const onChangeTabHandler = (tab) => {
    setSelectedTab(tab);
  };

  return (
    <div className="h-full">
      <div className="font-lexend text-[14px] leading-[17.5px] text-[#374659] font-[300]">
        Choose a template or document to send to your customer and attach to
        this contact
      </div>
      <Tabs tabs={tabs} onChangeTab={onChangeTabHandler} />
      {selectedTab === "Templates" && <Templates />}
      {selectedTab === "Documents" && <DocumentsPage />}
    </div>
  );
}

export default TemplatesAndDocs;
