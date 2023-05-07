import { LoadingOutlined } from "@ant-design/icons";
import React from "react";

export const Loader = () => {
  return (
    <div className="flex h-[60vh] w-[100vw] justify-center items-center">
      <LoadingOutlined />
    </div>
  );
};
