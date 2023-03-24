import classNames from "classnames";
import React from "react";

export const PrimaryButton = ({
  image = "",
  title = "",
  className = "",
  titleClassName = "",
  onClick = () => {},
}) => {
  return (
    <div
      className={classNames(
        "flex items-center justify-center border-[1px] rounded-[8px] cursor-pointer",
        className
      )}
      onClick={onClick}
    >
      <div>{image}</div>
      <div
        className={classNames(
          "text-[18px] font-[400] leading-[24px]",
          titleClassName
        )}
      >
        {title}
      </div>
    </div>
  );
};
