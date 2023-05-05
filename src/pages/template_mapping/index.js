import React, { useContext, useEffect, useRef, useState } from "react";
import { getApi } from "../../api/apiMethods";
import { AppContext } from "../_app";
import { DropDown } from "../../components/DropDown";
import classNames from "classnames";
import { useRouter } from "next/router";

function TemplateMapping() {
  const tempaltesData = useRef([
    { id: 1, name: "Dummy1" },
    { id: 2, name: "Dummy2" },
    { id: 13, name: "Dummy3" },
    { id: 4, name: "Dummy4" },
    { id: 5, name: "Dummy4" },
    { id: 6, name: "Dummy5" },
    { id: 7, name: "Dummy6" },
    { id: 8, name: "Dummy7" },
    { id: 19, name: "Dummy8" },
    { id: 22, name: "Dummy9" },
    { id: 145, name: "Dummy10" },
    { id: 166, name: "Dummy11" },
    { id: 17, name: "Dummy12" },
  ]);
  const { selectedItem, setSelectedItem, setDocParams, JWTtoken, setJWTtoken } =
    useContext(AppContext);
  const headerData = [
    { title: "TEMPLATE NAME", width: "35%" },
    { title: "ROLES", width: "30%" },
    { title: "LAST MODIFIED", width: "35%" },
  ];
  const [selectedHeader, setSelectedHeader] = useState(headerData[0]?.title);
  const router = useRouter();

  const tokenHandler = async () => {
    const currentUrl = window.location.href;
    const searchParams = new URL(currentUrl).searchParams;
    const authId = searchParams?.get("authId");
    const objectId = searchParams?.get("object_id");
    const objectType = searchParams?.get("object_type");
    const firstName = searchParams?.get("first_name");
    const lastName = searchParams?.get("last_name");
    const email = searchParams?.get("email");
    setDocParams((prev) => ({
      ...prev,
      authId,
      objectId,
      objectType,
      firstName,
      lastName,
      email,
    }));
    const data = await getApi({
      endUrl: `set-up/auth?authId=${authId}`,
    });
    data && setJWTtoken(data?.token);
    return data;
  };

  const getTemplatesHandler = async () => {
    if (window) {
      const data = await tokenHandler();
      const docsData = await getApi({
        endUrl: "hubspot-card/templates",
        headers: {
          "x-access-token": data?.token,
        },
      });
      docsData && (tempaltesData.current = docsData);
    } else {
      console.log("Not able to access the window.");
    }
  };

  const actionsHandler = async (item, index) => {
    console.log(index, item);
  };

  useEffect(() => {
    getTemplatesHandler();
  }, []);

  return (
    <div className="h-[100vh] border-[1px] border-[#CDD6E1]">
      {/* Header */}
      <div className="w-[100%] fixed z-50 top-0 flex border-b-[1px] border-b-[#CDD6E1]">
        {headerData?.map((header, index) => (
          <div
            key={index}
            style={{
              width: header?.width,
            }}
            onClick={() => setSelectedHeader(header?.title)}
            className={classNames(
              "text-[12px] text-[#374659] font-[500] px-[24px] leading-[16.39px] py-[15px] cursor-pointer",
              selectedHeader === header?.title ? "bg-[#CDD6E1]" : "bg-[#EBF0F5]"
            )}
          >
            {header?.title}
          </div>
        ))}
      </div>
      {/* tempaltes */}
      <div className="mt-[46.39px]">
        {tempaltesData?.current?.map((template, index) => (
          <div
            className="flex w-[100%] items-center py-[20px] border-b-[1px] border-b-[#CDD6E1]"
            key={index}
          >
            <div className="w-[35%] text-[14px] text-[#3F8FAB] leading-[19.12px] font-[600] px-[24px]">
              {template?.name}
            </div>
            <div className="w-[30%] text-[14px] text-[#374659] font-[500] leading-[19.12px] px-[24px]">
              {"Role"}
            </div>
            <div className="w-[35%] flex justify-between items-center px-[24px]">
              <div className="text-[14px] text-[#374659] font-[500] leading-[19.12px]">
                {"2/24/2023 9:49:10 PM"}
              </div>
              <DropDown
                enableSearch={false}
                contentHeader="Actions"
                className="w-[100px]"
                showBottomContent={false}
                dropDownData={[{ name: "Template mapping" }, { name: "Edit" }]}
                dropDownClassName="w-[200px] right-[0px]"
                dropDownContentClassName="py-[15px] pl-[22px] text-[14px]"
                onClick={actionsHandler}
                specificIndex={index}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TemplateMapping;
