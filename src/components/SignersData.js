import { UserOutlined } from "@ant-design/icons";
import React from "react";

export const SignersData = ({ data }) => {
  return (
    <>
      <div className="ovarallPop fixed inset-0"></div>
      <div className="absolute bg-[white] left-[-40px] z-20 rounded-[5px] p-[15px] max-h-[400px] overflow-y-scroll shadow-all top-[50px]">
        {data?.map((item) => (
          <div>
            <div className="flex pb-[10px]">
              <UserOutlined className="pt-[3px]" />
              <div className="pl-[10px]">
                <div className="text-[14px] font-lexend">{`${
                  item?.first_name || ""
                } ${item?.last_name || ""}`}</div>
                <div className="text-[14px] font-lexend">
                  {item?.email || ""}
                </div>
                <div className="text-[14px] font-lexend">
                  {item?.status || ""}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};
