import { CaretDownOutlined, SearchOutlined } from "@ant-design/icons";
import classNames from "classnames";
import React, { useState } from "react";

export const DropDown = ({
  title = "",
  content = "",
  dropDownData = [],
  onChange = () => {},
  userIndex = "",
  key = "name",
  enableSearch = true,
  bottomContent = "Dummy",
  onClickBottomContent = () => {},
  showBottomContent = true,
  contentClassName = "",
}) => {
  const [showDropDown, setShowDropDown] = useState(false);
  const [filteredData, setFilteredData] = useState(dropDownData);
  const searchHandler = (text) => {
    if (text.length === 0) {
      setFilteredData(dropDownData);
    } else {
      const data = dropDownData?.filter((item) =>
        item?.[key]?.toLowerCase().includes(text)
      );
      setFilteredData(data);
    }
  };
  return (
    <div className="relative">
      <div
        onClick={() => setShowDropDown(!showDropDown)}
        className="cursor-pointer relative"
      >
        <div className="font-lexend text-[14px] font-[500] leading-[17.5px] text-[#374659] select-none">
          {title}
        </div>
        <div
          className={classNames(
            "flex justify-between items-center border-[1px] border-[#CDD6E1] bg-[#F6F8FA] p-[10px] rounded-[3px] mt-[3px]",
            contentClassName
          )}
        >
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
          <div className="bg-[white] border-[1px] z-40 mt-[5px] rounded-[5px] absolute w-[100%] shadow-2xl">
            {enableSearch && (
              <div className="border-[1px] my-[10px] px-[10px] border-[#00d0e4] flex items-center">
                <input
                  placeholder="search"
                  className="py-[10px] w-[100%] outline-none "
                  onChange={(e) => searchHandler(e.target.value)}
                />
                <SearchOutlined
                  style={{ color: "#3F8FAB", fontSize: "18px" }}
                />
              </div>
            )}
            <div className="border-b-[2px]">
              {filteredData?.map((item, index) => (
                <div
                  className={classNames(
                    "py-[5px] px-[10px] cursor-pointer select-none hover:bg-[#00d0e4]",
                    index !== dropDownData.length - 1 && "border-b-[1px]"
                  )}
                  onClick={() => {
                    onChange(item, userIndex);
                    setShowDropDown(false);
                  }}
                  key={index}
                >
                  {item?.[key]}
                </div>
              ))}
            </div>
            {showBottomContent && (
              <div
                className="mx-[10px] mb-[10px] w-fit hover:border-b-[2px] cursor-pointer font-lexend font-[600] text-[#00d0e4]"
                onClick={onClickBottomContent}
              >
                {bottomContent}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};
