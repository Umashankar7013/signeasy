import classNames from "classnames";
import React, { useState } from "react";
import Templates from "../templates";
import DocumentsPage from "../documentsPage";
import { Tabs } from "../../components/Tabs";

function TemplatesAndDocs() {
  const tabs = ["Templates", "Originals"];
  const [selectedTab, setSelectedTab] = useState(tabs[0]);

  const onChangeTabHandler = (tab) => {
    setSelectedTab(tab);
  };

  return (
    <div>
      <div className="font-lexend text-[14px] leading-[17.5px] text-[#374659] pb-[19px] font-[300]">
        Choose a template or document to send to your customer and attach to
        this contact
      </div>
      <Tabs tabs={tabs} onChangeTab={onChangeTabHandler} />
      {selectedTab === "Templates" && <Templates />}
      {selectedTab === "Originals" && <DocumentsPage />}
    </div>
  );
}

export default TemplatesAndDocs;
