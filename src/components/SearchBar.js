import { SearchOutlined } from "@ant-design/icons";
import classNames from "classnames";
import React from "react";

export const SearchBar = ({ className = "", onChange = () => {} }) => {
  return (
    <div
      className={classNames(
        "border-[1px] flex items-center py-[10px] px-[8px] rounded-[4px] my-[20px] bg-[#f6f8fa]",
        className
      )}
    >
      <input
        placeholder="Search"
        style={{ outline: "none" }}
        className="font-lexend bg-gray-100"
        onChange={onChange}
      />
      <SearchOutlined style={{ color: "#3F8FAB", fontSize: "18px" }} />
    </div>
  );
};
