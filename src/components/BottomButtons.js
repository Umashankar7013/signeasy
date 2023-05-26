import { useRouter } from "next/router";
import React, { useContext } from "react";
import { PrimaryButton } from "./PrimaryButton";
import classNames from "classnames";
import { AppContext } from "./Layout";

export const BottomButtons = ({ forTemplates = false }) => {
  const { selectedItem } = useContext(AppContext);
  const router = useRouter();
  return (
    <div className="flex justify-between items-center">
      <div
        className="font-lexend font-bold cursor-pointer text-[14px]"
        onClick={() => {
          if (window) {
            window.parent.postMessage(JSON.stringify({ action: "DONE" }), "*");
            window.close();
          }
        }}
      >
        Cancel
      </div>
      <PrimaryButton
        title="Next"
        className={classNames(
          "px-[40px] py-[10px]",
          Object.keys(selectedItem)?.length > 0
            ? "bg-[#ee8162]"
            : "bg-[#ebf0f5]"
        )}
        titleClassName={classNames(
          "font-lexend font-bold text-[14px]",
          Object.keys(selectedItem)?.length > 0
            ? "text-[white]"
            : "text-[#b3c0d2]"
        )}
        onClick={() =>
          router.push({
            pathname: "/signature",
            query: { type: forTemplates ? "template" : "original" },
          })
        }
      />
    </div>
  );
};
