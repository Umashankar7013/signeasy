import classNames from "classnames";
import { CrossIcon } from "./CrossIcon";

export const Input = ({
  title,
  placeholder,
  onChange = () => {},
  className = "w-[70%]",
  limit,
  enableDelete = false,
  isManditory = false,
  value,
}) => {
  return (
    <div>
      <div className="font-lexend font-[500] text-[14px] leading-[17px] text-[#374659]">
        {`${title} ${isManditory ? "*" : ""}`}
      </div>
      <div
        className={classNames(
          "flex h-[40px] justify-between items-center border-[1px] rounded-[3px] border-[#CDD6E1] bg-[#F6F8FA] mt-[3px]",
          className
        )}
      >
        <input
          placeholder={placeholder}
          className={classNames(
            "outline-none font-lexend font-[300] w-[90%] px-[10px] bg-[#F6F8FA]"
          )}
          onChange={onChange}
          value={value}
        />
        {enableDelete && (
          <div className="mr-[10px]">
            <CrossIcon />
          </div>
        )}
      </div>
      <div className="flex justify-end w-[70%] font-lexend font-[500] leading-[15px] text-[#8297B3] text-[12px]">
        {limit}
      </div>
    </div>
  );
};
