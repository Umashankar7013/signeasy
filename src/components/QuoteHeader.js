import { Steps } from "antd";
import React from "react";

export const QuoteHeader = () => {
  const steps = [
    { title: "DEAL" },
    { title: "DETAILS" },
    { title: "BUYER INFO" },
    { title: "YOUR INFO" },
    { title: "LINE ITEMS" },
    { title: "SIGNATURE & PAYMENT" },
    { title: "REVIEW" },
  ];
  return (
    <div className="flex justify-between items-center">
      <div className="font-lexend text-[14px] font-[300]">Edit a quote</div>
      <div className="w-[100%] z-1">
        {steps?.map((item, index) => (
          <ul className="progressBar" key={index}>
            <li className="active text-[14px] font-[500]">{item?.title}</li>
          </ul>
        ))}
      </div>
      <div className="font-lexend text-[14px] font-[300]">Steps 1 of 7</div>
    </div>
  );
};
