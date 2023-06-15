import classNames from "classnames";
import React from "react";

export const FormHeaderLables = ({ text1, text2, className = "" }) => {
  const headerClass = classNames(
    "text-[16px] font-lexend font-[600] leading-[20px] text-[#374659]",
    className
  );
  const descriptionClass =
    "font-lexend text-[14px] font-[300] leading-[17.5px] text-[#374659] pt-[5px] pl-[17px]";
  return (
    <>
      <div className={headerClass}>{text1}</div>
      <div className={descriptionClass}>{text2}</div>
    </>
  );
};
