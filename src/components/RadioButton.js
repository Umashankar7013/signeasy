import classNames from "classnames";
import React from "react";

export const RadioButton = ({ isActive, isDisabled = false }) => {
  return (
    <div
      className={classNames(
        "h-[25px] w-[25px] rounded-full border-[1.5px] flex justify-center items-center",
        isActive && "border-[#3F8FAB]",
        isDisabled && "bg-gray-100",
        isDisabled ? "cursor-not-allowed" : "cursor-pointer"
      )}
    >
      {isActive && (
        <div
          className={classNames(
            "h-[15px] w-[15px] rounded-full border-[1.5px]",
            isActive && "bg-[#3F8FAB]"
          )}
        ></div>
      )}
    </div>
  );
};
