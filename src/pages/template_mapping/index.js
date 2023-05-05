import React, { useContext, useEffect, useRef } from "react";
import { getApi } from "../../api/apiMethods";
import { AppContext } from "../_app";
import { DropDown } from "../../components/DropDown";

function TemplateMapping() {
  const tempaltesData = useRef([
    { id: 1, name: "Dummy" },
    { id: 2, name: "Dummy" },
    { id: 13, name: "Dummy" },
    { id: 4, name: "Dummy" },
    { id: 5, name: "Dummy" },
    { id: 6, name: "Dummy" },
    { id: 7, name: "Dummy" },
    { id: 8, name: "Dummy" },
    { id: 19, name: "Dummy" },
    { id: 22, name: "Dummy" },
    { id: 145, name: "Dummy" },
    { id: 166, name: "Dummy" },
    { id: 17, name: "Dummy" },
  ]);
  const { selectedItem, setSelectedItem, setDocParams, JWTtoken, setJWTtoken } =
    useContext(AppContext);
  const headerData = [
    { title: "TEMPLATE NAME", width: "35%" },
    { title: "ROLES", width: "30%" },
    { title: "LAST MODIFIED", width: "35%" },
  ];

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

  useEffect(() => {
    getTemplatesHandler();
  }, []);

  return (
    <div className="h-[100vh] w-[100vw] border-[1px] border-[#CDD6E1]">
      {/* Header */}
      <div className="w-[100%] flex border-b-[1px] border-b-[#CDD6E1] bg-[#EBF0F5]">
        {headerData?.map((header, index) => (
          <div
            key={index}
            style={{
              width: header?.width,
            }}
            className="text-[12px] text-[#374659] leading-[16.39px] py-[15px]"
          >
            {header?.title}
          </div>
        ))}
      </div>
      {/* tempaltes */}
      {tempaltesData?.current?.map((template, index) => (
        <div className="flex w-[100%]" key={index}>
          <div className="w-[35%] text-[14px] text-[#3F8FAB] leading-[19.12px] font-[600]">
            {template?.name}
          </div>
          <div className="w-[30%] text-[14px] text-[#374659] font-[500] leading-[19.12px]">
            {"Role"}
          </div>
          <div className="w-[35%] flex justify-between items-center">
            <div className="text-[14px] text-[#374659] font-[500] leading-[19.12px]">
              {"2/24/2023 9:49:10 PM"}
            </div>
            <DropDown enableSearch={false} content="Actions" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default TemplateMapping;
