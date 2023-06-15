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
      <div className="bg-[#FF7A59] px-[12px] py-[7px] rounded-[3px] cursor-pointer flex items-center">
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
          className="flex items-center mt-[3px] ml-[3px]"
        >
          {showDropdown ? (
            <CaretUpOutlined
              style={{
                fontSize: "11px",
                padding: "0px",
                margin: "0px",
                color: "#fff",
              }}
            />
          ) : (
            <CaretDownOutlined
              style={{
                fontSize: "11px",
                padding: "0px",
                margin: "0px",
                color: "#fff",
              }}
            />
          )}
        </div>
      </div>

      {showDropdown && dropdownData?.length > 0 && (
        <div className="absolute py-[7px] border-[#E0E3EA] w-fit right-0 px-[15px] text-[14px] font-[400] mt-[3px] border-[1px] rounded-[4px]">
          {dropdownData?.map((item, index) => (
            <div
              className="select-none cursor-pointer"
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
