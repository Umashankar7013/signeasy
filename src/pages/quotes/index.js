import React from "react";
import { QuoteHeader } from "../../components/QuoteHeader";
import { PrimaryButton } from "../../components/PrimaryButton";
import classNames from "classnames";
import { DropDown } from "../../components/DropDown";

function Quotes() {
  const dropDownData = [
    { name: "Test Deal 1" },
    { name: "Test Deal 2" },
    { name: "Test Deal 3" },
  ];
  return (
    <div className="h-[100vh]">
      <div className="fixed w-[100%] top-[0px] py-[15px]">
        <QuoteHeader />
      </div>

      <div className="mt-[100px]">
        <div>Quote details</div>
        <DropDown
          dropDownData={dropDownData}
          content={"Choose or create a deal"}
          dropDownContentClassName="px-[15px] py-[10px] font-[300]"
          contentHeader="Create Quote"
        />
      </div>

      <div className="fixed bottom-0 flex items-center justify-between w-[100%] bg-[#f5f8fa] py-[10px]">
        <div className="font-lexend border-b-[2px] border-b-[black]">Exit</div>
        <div className="flex items-center">
          <div className="font-lexend text-[black] mr-[15px]">
            Last saved on May 3, 2023
          </div>
          <PrimaryButton
            title="Next"
            className={classNames(
              "px-[40px] py-[10px]"
              //   Object.keys(selectedItem)?.length > 0
              //     ? "bg-[#ee8162]"
              //     : "bg-[#ebf0f5]"
            )}
            titleClassName={classNames(
              "font-lexend font-bold text-[14px]"
              //   Object.keys(selectedItem)?.length > 0
              //     ? "text-[white]"
              //     : "text-[#b3c0d2]"
            )}
          />
        </div>
      </div>
    </div>
  );
}

export default Quotes;
