import { LoadingOutlined } from "@ant-design/icons";
import classNames from "classnames";
import React from "react";

export const Loader = ({ className = "h-[100vh]" }) => {
  return (
    <div
      className={classNames(
        "flex w-[100vw] justify-center items-center",
        className
      )}
    >
      <LoadingOutlined />
    </div>
  );
};
