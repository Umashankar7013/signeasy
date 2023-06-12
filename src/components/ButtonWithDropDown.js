import { CaretDownOutlined, CaretUpOutlined } from "@ant-design/icons";
import React, { useState } from "react";

export const ButtonWithDropDown = ({
  buttonTitle = "",
  dropdownData = [],
  buttonOnClick = () => {},
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  return (
    <div>
      <div className="bg-[#FF7A59] pl-[12px] py-[7px] rounded-[3px] cursor-pointer flex items-baseline">
        <div>
          <input
            type="submit"
            className="text-[#fff] font-bold text-[14px] cursor-pointer"
            value={buttonTitle}
            onClick={(e) => buttonOnClick(e)}
          />
        </div>
        <div
          onClick={() => setShowDropdown(!showDropdown)}
          className="flex items-end"
        >
          {showDropdown ? (
            <CaretUpOutlined
              style={{
                fontSize: "11px",
                padding: "0px",
                margin: "0px",
                color: "#fff",
                paddingLeft: 30,
                paddingRight: 10,
              }}
            />
          ) : (
            <CaretDownOutlined
              style={{
                fontSize: "11px",
                padding: "0px",
                margin: "0px",
                color: "#fff",
                paddingLeft: 30,
                paddingRight: 10,
              }}
            />
          )}
        </div>
      </div>

      {showDropdown && dropdownData?.length > 0 && (
        <div className="absolute py-[5px] px-[5px] text-[13px] font-[700] mt-[3px] shadow-all border-[1px] w-[100%] rounded-[4px]">
          {dropdownData?.map((item, index) => (
            <div
              className="select-none pb-[5px] cursor-pointer"
              key={index}
              onClick={(e) => item.onClick(e)}
            >
              {item?.title}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
