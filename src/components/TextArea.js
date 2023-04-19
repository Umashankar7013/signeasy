import classNames from "classnames";
import React from "react";

export const TextArea = ({
  title,
  placeholder,
  onChange = () => {},
  className = "w-[100%]",
  limit,
  required = false,
  value,
  rows = 2,
}) => {
  return (
    <div>
      <div className="font-lexend font-[500] text-[14px] leading-[17px] text-[#374659]">
        {`${title} ${required ? "*" : ""}`}
      </div>
      <textarea
        className={classNames(
          "outline-none border-[1px] border-[#CDD6E1] h-auto rounded-[3px] font-lexend mt-[3px] font-[300] px-[10px] bg-[#F6F8FA]",
          className
        )}
        placeholder={placeholder}
        onChange={onChange}
        value={value}
        rows={rows}
      />
      <div className="flex justify-end font-lexend font-[500] leading-[15px] text-[#8297B3] text-[12px]">
        {limit}
      </div>
    </div>
  );
};
