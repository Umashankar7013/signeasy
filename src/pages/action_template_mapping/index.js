import { LeftOutlined } from "@ant-design/icons";
import { useRouter } from "next/router";
import React from "react";

function ActionTemplateMapping() {
  const router = useRouter();
  const selectedTemplate = JSON.parse(router.query?.selectedItem);
  return (
    <div className="h-[100vh]">
      <div className="flex items-center">
        <LeftOutlined />
        <div>Back to templates</div>
      </div>
    </div>
  );
}

export default ActionTemplateMapping;
