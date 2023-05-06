import classNames from "classnames";
import React, { useState } from "react";
import Templates from "../templates";
import DocumentsPage from "../documentsPage";

function TemplatesAndDocs() {
  const [selectedTab, setSelectedTab] = useState("templates");
  return (
    <div className="h-[100vh]">
      <div className="font-lexend text-[14px] leading-[17.5px] text-[#374659] font-[300]">
        Choose a template or document to send to your customer and attach to
        this contact
      </div>
      <div className="border-b-2 flex pt-[19px]">
        <div
          className={classNames(
            "px-[20px] cursor-pointer font-lexend text-[#374659] text-[14px] pb-[12px] font-[500] leading-[17.5px]",
            selectedTab === "templates" && "border-b-[5px] border-b-[#374659]"
          )}
          onClick={() => setSelectedTab("templates")}
        >
          Templates
        </div>
        <div
          className={classNames(
            "px-[20px] cursor-pointer pb-[12px] font-lexend text-[#374659] text-[14px] font-[500] leading-[17.5px]",
            selectedTab === "documents" && "border-b-[5px] border-b-[#374659]"
          )}
          onClick={() => setSelectedTab("documents")}
        >
          Documents
        </div>
      </div>
      {selectedTab === "templates" && <Templates />}
      {selectedTab === "documents" && <DocumentsPage />}
    </div>
  );
}

export default TemplatesAndDocs;
