import classNames from "classnames";
import { CrossIcon } from "./CrossIcon";

export const Input = ({
  title,
  placeholder,
  onChange = () => {},
  className = "",
  limit,
  enableDelete = false,
  required = false,
  value,
  index,
  clearFun = () => {},
  showError = false,
  width = "",
}) => {
  return (
    <div style={{ width }}>
      <div className="font-lexend font-[500] text-[14px] leading-[17px] text-[#374659]">
        {`${title} ${required ? "*" : ""}`}
      </div>
      <div
        className={classNames(
          "flex h-[40px] justify-between items-center border-[1px] rounded-[3px] bg-[#F6F8FA] mt-[3px]",
          showError ? "border-[red]" : "border-[#CDD6E1]",
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
          required={required}
        />
        {enableDelete && (
          <div className="mr-[10px]" onClick={() => clearFun(index, title)}>
            <CrossIcon />
          </div>
        )}
      </div>
      <div className="flex justify-end font-lexend font-[500] leading-[15px] text-[#8297B3] text-[12px]">
        {limit}
      </div>
    </div>
  );
};
