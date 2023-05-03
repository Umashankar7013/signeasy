import { SearchOutlined } from "@ant-design/icons";
import classNames from "classnames";
import React from "react";

export const SearchBar = ({ className = "", onChange = () => {} }) => {
  return (
    <div
      className={classNames(
        "border-[1px] flex items-center py-[10px] px-[8px] rounded-[4px] bg-[#f6f8fa]",
        className
      )}
    >
      <input
        placeholder="Search"
        style={{ outline: "none" }}
        className="font-lexend text-[14px] bg-[#f6f8fa]"
        onChange={onChange}
      />
      <SearchOutlined style={{ color: "#3F8FAB", fontSize: "18px" }} />
    </div>
  );
};
