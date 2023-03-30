import { useRouter } from "next/router";
import React, { useState } from "react";
import { ImageWithBasePath } from "../../components/ImageWithBasePath";
import { PrimaryButton } from "../../components/PrimaryButton";
import { popupHandler } from "../../utils/functions";

const Home = () => {
  const router = useRouter();
  return (
    <div className="h-[100vh] w-[100vw] flex flex-col pt-[250px] items-center">
      <div className="text-[#1088E7] font-[600] font-inter text-[30px]">
        Signeasy
      </div>
      <div className="font-[600] font-inter leading-[36.31px] text-[30px] pt-[24px]">
        Agree, the easy way.
      </div>
      <div className="text-center font-inter text-[18px] md:w-[500px] mx-[20px] leading-[24px] pt-[15px] font-[400]">
        Easy-to-use eSignature and contract workflow platform to sign, send, and
        manage business agreements.
      </div>
      <PrimaryButton
        title="Enable"
        image={
          <ImageWithBasePath
            src="enableIcon"
            height={18}
            width={18}
            alt=""
            className="mr-[8px]"
          />
        }
        className="bg-[#1088E7] px-[14px] py-[10px] mt-[30px]"
        titleClassName="text-white"
        onClick={() =>
          // popupHandler({ url: "http://localhost:3000/templates" })
          router.push("/signature")
        }
      />
    </div>
  );
};

export default Home;
