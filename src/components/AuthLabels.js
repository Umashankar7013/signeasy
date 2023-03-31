import classNames from "classnames";
import React from "react";
import { ImageWithBasePath } from "./ImageWithBasePath";

export const AuthLabels = ({
  imageName,
  imageDetails = { height: 50, width: 50 },
  title,
  imageClass = "",
}) => {
  return (
    <>
      <div
        className={classNames(
          "border-[1px] rounded-[8px] mt-[70px]",
          imageClass
        )}
      >
        <ImageWithBasePath
          src={imageName}
          height={imageDetails.height}
          width={imageDetails.width}
        />
      </div>
      <div className="text-[30px] font-inter font-bold pt-[30px]">{title}</div>
      <div className="text-[13px] pt-[60px] font-[600] pb-[30px] text-gray-400 font-inter">
        WE NEED PERMISSION TO ACCESS YOUR ACCOUNTS
      </div>
    </>
  );
};
