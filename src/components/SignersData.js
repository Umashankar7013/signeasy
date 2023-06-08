import classNames from "classnames";
import moment from "moment";
import React from "react";

export const SignersData = ({ data }) => {
  return (
    <>
      <div className="ovarallPop fixed inset-0"></div>
      <div className="absolute bg-[white] left-[-40px] z-20 rounded-[5px] px-[15px] max-h-[400px] overflow-y-scroll shadow-all top-[50px]">
        {data?.recipients?.map((item, index) => (
          <div key={index}>
            <div
              className={classNames(
                "flex py-[10px] items-center",
                index !== data?.length - 1 && "border-b-[1px]"
              )}
            >
              <div className="pl-[10px]">
                <div className="text-[14px] font-lexend">
                  Name :
                  <span className="font-[300]">
                    {` ${item?.first_name || ""} ${item?.last_name || ""}`}
                  </span>
                </div>
                <div className="text-[14px] font-lexend">
                  Email :
                  <span className="font-[300]">{` ${item?.email || ""}`}</span>
                </div>
                <div className="text-[14px] font-lexend">
                  Status :
                  <span className="font-[300] ml-[2px]">
                    {data?.status === "completed"
                      ? `Signed on ${moment(item?.updatedAt).format("LLL")}`
                      : `${item?.status || ""}`}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};
