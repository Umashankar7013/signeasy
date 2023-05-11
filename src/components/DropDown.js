import { CaretDownOutlined, SearchOutlined } from "@ant-design/icons";
import classNames from "classnames";
import React, { useState } from "react";

export const DropDown = ({
  title = "",
  contentHeader = "",
  dropDownData = [],
  onClick = () => {},
  specificIndex = "",
  key = "name",
  enableSearch = true,
  bottomContent = "Dummy",
  onClickBottomContent = () => {},
  showBottomContent = true,
  contentClassName = "",
  className = "",
  dropDownClassName = "",
  dropDownContentClassName = "py-[5px]",
  singleInputOnly = false,
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
        className={classNames("cursor-pointer relative", className)}
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
            {contentHeader}
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
          <div
            className={classNames(
              "bg-[white] border-[1px] z-40 mt-[5px] rounded-[5px] absolute w-[100%] shadow-2xl",
              dropDownClassName
            )}
          >
            {enableSearch && (
              <div className="py-[10px] px-[10px] bg-[#eaf0f6]">
                <div className="border-[1px] px-[10px] border-[#00d0e4] flex items-center rounded-[4px] bg-[#fff]">
                  <input
                    placeholder="Search"
                    className="py-[10px] w-[100%] font-lexend outline-none text-[16px]"
                    onChange={(e) => searchHandler(e.target.value)}
                  />
                  <SearchOutlined
                    style={{
                      color: "#3F8FAB",
                      fontSize: "18px",
                    }}
                  />
                </div>
              </div>
            )}
            <div className="border-b-[2px]">
              {filteredData?.length > 0 ? (
                filteredData?.map((item, index) => (
                  <div
                    className={classNames(
                      "cursor-pointer font-lexend text-[#33475B] select-none",
                      dropDownContentClassName
                    )}
                    onClick={() => {
                      onClick(item, specificIndex);
                      setShowDropDown(false);
                    }}
                    key={index}
                  >
                    {item?.[key]}
                  </div>
                ))
              ) : (
                <div className="px-[15px] py-[10px] text-[15px] font-lexend font-[300] text-[#d1e1ee]">
                  No results found
                </div>
              )}
            </div>
            {showBottomContent && (
              <div className="py-[15px] px-[15px]">
                <div
                  className="w-fit hover:border-b-[1px] border-b-[black] cursor-pointer font-lexend font-[600] text-[#00d0e4] select-none"
                  onClick={onClickBottomContent}
                >
                  {bottomContent}
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};
