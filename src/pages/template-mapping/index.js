import React, { useContext, useEffect, useRef, useState } from "react";
import { getApi } from "../../api/apiMethods";
import { AppContext } from "../_app";
import { DropDown } from "../../components/DropDown";
import classNames from "classnames";
import { useRouter } from "next/router";
import { Loader } from "../../components/Loader";
import { notification } from "antd";
import { dateHandler, openNotification } from "../../utils/functions";
import axios from "axios";

function TemplateMapping() {
  const tempaltesData = useRef([
    { id: 1, name: "Dummy1" },
    { id: 2, name: "Dummy2" },
    { id: 3, name: "Dummy3" },
    { id: 4, name: "Dummy4" },
    { id: 5, name: "Dummy4" },
    { id: 6, name: "Dummy5" },
    { id: 7, name: "Dummy6" },
    { id: 8, name: "Dummy7" },
    { id: 9, name: "Dummy8" },
    { id: 11, name: "Dummy10" },
    { id: 12, name: "Dummy11" },
    { id: 13, name: "Dummy12" },
  ]);
  const { setDocParams, JWTtoken, setJWTtoken, setSelectedItem, docParams } =
    useContext(AppContext);
  const headerData = [
    { title: "TEMPLATE NAME", width: "35%" },
    { title: "ROLES", width: "30%" },
    { title: "LAST MODIFIED", width: "35%" },
  ];
  const selectedHeader = useRef(headerData[0]?.title);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [sortedData, setSortedData] = useState([]);
  const [browserWindow, setBrowserWindow] = useState();
  const [api, contextHolder] = notification.useNotification();

  const tokenHandler = async () => {
    let apiData = {};
    // if (JWTtoken === "" || JWTtoken === "undefined") {
    const currentUrl = window.location.href;
    const searchParams = new URL(currentUrl).searchParams;
    const authId = searchParams?.get("authId");
    const userId = searchParams?.get("hubspot_user_id");
    const portalId = searchParams?.get("hubspot_portal_id");
    const page = searchParams?.get("page");
    setDocParams((prev) => ({ ...prev, authId }));
    console.log(authId === docParams?.authId)
    if (authId !== docParams?.authId) {
      await getApi({
        endUrl: `set-up/auth?authId=${authId}&hubspot_user_id=${userId}&hubspot_portal_id=${portalId}&page=${page}`,
      })
        .then((data) => {
          data && setJWTtoken(data?.token);
          apiData = data;
        })
        .catch((err) => {
          openNotification({
            message: "Error",
            description: err.message,
            type: "error",
            api,
          });
        });
      // }
    }
    return apiData;
  };

  const sortHandler = () => {
    const templateUtils = {
      "TEMPLATE NAME": "name",
      ROLE: "role",
      "LAST MODIFIED": "modified_time",
    };
    const sortKey = templateUtils?.[selectedHeader?.current];
    const sortedData = tempaltesData?.current?.sort((a, b) => {
      if (a?.[sortKey] > b?.[sortKey]) return 1;
      else if (a?.[sortKey] < b?.[sortKey]) return -1;
      else if (a?.[sortKey] === b?.[sortKey]) return 0;
    });
    sortedData && setSortedData([...sortedData]);
  };

  const getTemplatesHandler = async () => {
    if (window) {
      const data = await tokenHandler();
      await getApi({
        endUrl: "hubspot-card/templates",
        headers: {
          "x-access-token": data?.token || JWTtoken,
        },
      })
        .then((docsData) => {
          docsData && (tempaltesData.current = docsData?.data);
          sortHandler();
        })
        .catch((err) => {
          openNotification({
            message: "Error",
            description: err.message,
            type: "error",
            api,
          });
        });
      setLoading(false);
    } else {
      console.log("Not able to access the window.");
    }
  };

  const actionsHandler = async (item, index) => {
    setSelectedItem(tempaltesData?.current[index]);
    setLoading(true);
    await router.push({
      pathname: "/action-template-mapping",
    });
    setLoading(false);
  };

  useEffect(() => {
    if (browserWindow) {
      getTemplatesHandler();
    }
  }, [browserWindow]);

  useEffect(() => {
    setBrowserWindow(window);
  }, []);

  useEffect(() => {
    return () => {
      console.log("return");
      setJWTtoken("");
    };
  }, []);

  return (
    <>
      {contextHolder}
      {loading ? (
        <Loader />
      ) : (
        <div className="border-[1px] border-[#CDD6E1]">
          {/* Header */}
          <div className="w-[100%] fixed z-50 top-0 flex border-b-[1px] border-b-[#CDD6E1]">
            {headerData?.map((header, index) => (
              <div
                key={index}
                style={{
                  width: header?.width,
                }}
                onClick={() => {
                  selectedHeader.current = header?.title;
                  sortHandler();
                }}
                className={classNames(
                  "text-[12px] text-[#374659] font-[500] px-[24px] leading-[16.39px] py-[15px] cursor-pointer",
                  selectedHeader.current === header?.title
                    ? "bg-[#CDD6E1]"
                    : "bg-[#EBF0F5]"
                )}
              >
                {header?.title}
              </div>
            ))}
          </div>
          {/* tempaltes */}
          <div className="mt-[46.39px]">
            {sortedData?.map((template, index) => (
              <div
                className={classNames(
                  "flex w-[100%] items-center py-[20px]",
                  index !== tempaltesData?.current.length - 1 &&
                    "border-b-[1px] border-b-[#CDD6E1]"
                )}
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
                    {dateHandler({ timestamp: template?.modified_time })}
                  </div>
                  <DropDown
                    enableSearch={false}
                    contentHeader="Actions"
                    className="w-[100px]"
                    showBottomContent={false}
                    dropDownData={[
                      { name: "Template mapping" },
                      { name: "Edit" },
                    ]}
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
      )}
    </>
  );
}

// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodWJzcG90X3VzZXJfaWQiOjQ5NzkyNzIyLCJodWJzcG90X3BvcnRhbF9pZCI6MjQwNTA1MDMsInNpZ25lYXN5X2FjY2Vzc190b2tlbiI6ImV5SmhiR2NpT2lKU1V6STFOaUlzSW5SNWNDSTZJa3BYVkNJc0ltdHBaQ0k2SWpkTUxYWjBWRE5pTjJwWWMySTJjVVpqTFZCaE55SjkuZXlKb2RIUndjem92TDNOcFoyNWxZWE41TG1OdmJTOWxiV0ZwYkNJNkltRnVhMmwwUUhScGJHbGphRzh1YVc0aUxDSm9kSFJ3Y3pvdkwzTnBaMjVsWVhONUxtTnZiUzkxYzJWeVgybGtJam9pTVRBM016YzROellpTENKb2RIUndjem92TDNOcFoyNWxZWE41TG1OdmJTOTBaWE4wWDIxdlpHVWlPaUl4SWl3aWFIUjBjSE02THk5emFXZHVaV0Z6ZVM1amIyMHZhWE5mZFhObGNsOXBiWEJ2Y25SbFpDSTZabUZzYzJVc0ltaDBkSEJ6T2k4dmMybG5ibVZoYzNrdVkyOXRMMnh2WjJsdVgyTnZkVzUwSWpveU15d2lhSFIwY0hNNkx5OXphV2R1WldGemVTNWpiMjB2YzI5MWNtTmxJam9pWlcxaGFXd2lMQ0pwYzNNaU9pSm9kSFJ3Y3pvdkwyRjFkR2d1YzJsbmJtVmhjM2t1WTI5dEx5SXNJbk4xWWlJNkltRjFkR2d3ZkRZelpXUmpNRFZrTXpBek1tVmxNVGhtTWpVd01XVmlaQ0lzSW1GMVpDSTZJbWgwZEhCek9pOHZZWEJwTFdWNGRDNXphV2R1WldGemVTNWpiMjB2SWl3aWFXRjBJam94Tmpnek56STBORFUwTENKbGVIQWlPakUyT0RZek1UWTBOVFFzSW1GNmNDSTZJa0o2TURKNGJubGlURXhIYURkdGRuUm5SVTgwUkZsU1pIVmhXRkZDVGxCeElpd2ljMk52Y0dVaU9pSnljenBqY21WaGRHVWdjbk02ZFhCa1lYUmxJRzl5YVdkcGJtRnNPbkpsWVdRZ2IzSnBaMmx1WVd3NlkzSmxZWFJsSUc5eWFXZHBibUZzT25Wd1pHRjBaU0J6YVdkdVpXUTZjbVZoWkNCemFXZHVaV1E2WTNKbFlYUmxJSE5wWjI1bFpEcDFjR1JoZEdVZ2RYTmxjanB5WldGa0lHWnBiR1Z6T25KbFlXUWdkWE5sY2pwamNtVmhkR1VnZEdWdGNHeGhkR1U2YldGdVlXZGxJSEp6T25OcFoyNXBibWQxY213Z2NuTTZjbVZoWkNCdlptWnNhVzVsWDJGalkyVnpjeUo5LkdEdUtyMXV3SWxyQ21fUTlpT1FPNDRHNkRMSDV4N1ZuOU1TclEzUU54R2pVTXVOdTBvbmU5TW9OWHpwalZDTG4tWXFod2hJTkdXbHluZHpVc1VXZ1lxVlpQV3NhTXFiM3NPVzZGdjNTVzE1R2dvRXduTm1UUGpXZWFSSE56d21WNGI0NUdjVnhwSzM5YjNhUUpMZDlHYXh0Q3lNTjVDLU4teDJjLV9GSVlLQnI0V1lJMFcwMFFDemFkS2gyQUtNMWkyRXdOV080UHNGbWstZndqd01Vd25SSjkzbFZRRFB0c1JDbUJzaXFlWVpIOFJ0SG5tMWQtcm01aHNHMVQwZVR0TUN6aFFLZ2hVNzg3bTlhbXZ3LVo3MzJtSzhDckZ6UEtqc3JiWW56a1hpazVMWDFCbDhyaXNiS0RydXNLTmluU3Q2a1lNbDlLYlA5S29BN05HT0NoZyIsImlhdCI6MTY4MzgxNTAwNSwiZXhwIjoxNjgzODQzODA1fQ.kvgzNLi0DKtBS3F8FIWzSi_123hdQKCRganGbXDBqFA",

export default TemplateMapping;
