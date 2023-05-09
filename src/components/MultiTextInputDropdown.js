import { CaretDownOutlined, CloseOutlined } from "@ant-design/icons";
import classNames from "classnames";
import React, { useState } from "react";

export const MultiTextInputDropdown = ({
  placeHolder = "",
  data = [],
  className = "",
  dropDownData = [],
  addFun = () => {},
  deleteFun = () => {},
  specificIndex = 0,
}) => {
  const [showDropDown, setShowDropDown] = useState(false);
  return (
    <div className="relative">
      <div
        className={classNames(
          "flex items-center p-[7px] cursor-pointer border-[1px] border-[#D5DCE4] rounded-[4px]",
          className
        )}
        onClick={() => setShowDropDown(true)}
      >
        <div className="flex overflow-x-scroll">
          {data.length > 0 ? (
            data?.map((item, index) => (
              <div
                className="px-[6px] flex items-center py-[3px] bg-[#ECF0F4] mr-[10px]"
                key={index}
              >
                <div className="flex">
                  {item?.split(" ")?.map((text) => (
                    <div className="pl-[4px] text-[12px] text-[#424E5E] font-[400] select-none">
                      {text}
                    </div>
                  ))}
                </div>
                <CloseOutlined
                  className="text-[9px] pl-[10px] text-[#000000]"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteFun(item, specificIndex);
                  }}
                />
              </div>
            ))
          ) : (
            <div className="text-[14px] font-lexend text-[#99A6BA] font-[400]">
              {placeHolder}
            </div>
          )}
        </div>
        <CaretDownOutlined
          style={{
            fontSize: "11px",
            color: "#3F8FAB",
            paddingLeft: "10px",
          }}
        />
      </div>
      {showDropDown && (
        <div className="">
          <div
            className="ovarallPop fixed inset-0"
            onClick={() => setShowDropDown(false)}
          ></div>
          <div className="absolute left-0 top-[35px] border-[1px] w-[100%] px-[10px] z-30 bg-[white]">
            {dropDownData?.map(
              (item, index) =>
                !data?.includes(item) && (
                  <div
                    className="py-[7px] text-[14px] font-lexend text-[#99A6BA] cursor-pointer select-none"
                    onClick={() => {
                      addFun(item, specificIndex);
                      setShowDropDown(false);
                    }}
                    key={index}
                  >
                    {item}
                  </div>
                )
            )}
          </div>
        </div>
      )}
    </div>
  );
};
