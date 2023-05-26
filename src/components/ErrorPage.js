import React from "react";

export const ErrorPage = () => {
  return (
    <div className="h-[100vh] w-[100vw] flex justify-center items-center">
      <div className="text-[16px] font-lexend font-[600] text-center">
        Sorry, something went wrong.
      </div>
      <div className="text-[14px] font-lexend font-[300] text-center">
        Set browser to accept cookies. This page uses cookies for a safer, more
        personal experience. To proceed, change you browser settings to allow
        cookies.
      </div>
    </div>
  );
};
