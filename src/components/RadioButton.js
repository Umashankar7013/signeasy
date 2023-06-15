import classNames from "classnames";
import React from "react";

export const RadioButton = ({ isActive, isDisabled = false }) => {
  return (
    <div className="h-[35px] w-[35px] flex justify-center items-center">
      <div
        className={classNames(
          "h-[22px] w-[22px] rounded-full border-[1.5px] flex justify-center items-center",
          isActive && "border-[#3F8FAB]",
          isDisabled && "bg-gray-100",
          isDisabled ? "cursor-not-allowed" : "cursor-pointer"
        )}
      >
        {isActive && (
          <div
            className={classNames(
              "h-[13px] w-[13px] rounded-full border-[1.5px]",
              isActive && "bg-[#3F8FAB]"
            )}
          ></div>
        )}
      </div>
    </div>
  );
};
