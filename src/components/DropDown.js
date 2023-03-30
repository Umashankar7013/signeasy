import { CaretDownOutlined } from "@ant-design/icons";
import classNames from "classnames";
import React, { useState } from "react";

export const DropDown = ({
  title = "Two-step verification",
  content = "",
  dropDownData = [],
  changeFun = () => {},
  userIndex = "",
}) => {
  const [showDropDown, setShowDropDown] = useState(false);
  return (
    <div className="relative">
      <div
        onClick={() => setShowDropDown(!showDropDown)}
        className="cursor-pointer relative"
      >
        <div className="font-lexend text-[14px] font-[500] leading-[17.5px] text-[#374659] select-none">
          {title}
        </div>
        <div className="flex justify-between items-center border-[1px] border-[#CDD6E1] bg-[#F6F8FA] p-[10px] rounded-[3px] mt-[3px]">
          <div className="font-lexend font-[400] leading-[18px] text-[15px] text-[#374659] select-none">
            {content}
          </div>
          <CaretDownOutlined
            style={{
              fontSize: "11px",
              padding: "0px",
              margin: "0px",
              color: "#3F8FAB",
            }}
          />
        </div>
      </div>
      {showDropDown && (
        <>
          <div
            className="ovarallPop fixed inset-0"
            onClick={() => setShowDropDown(false)}
          ></div>
          <div className="bg-[white] mt-[5px] rounded-[5px] absolute w-[100%] shadow-2xl">
            {dropDownData?.map((item, index) => (
              <div
                className={classNames(
                  "py-[5px] px-[10px] cursor-pointer select-none",
                  index !== dropDownData.length - 1 && "border-b-[1px]"
                )}
                onClick={() => {
                  changeFun(item, userIndex);
                  setShowDropDown(false);
                }}
                key={index}
              >
                {item}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};
