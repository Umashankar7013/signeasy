import React, { useEffect, useRef, useState } from "react";
import TemplatesAndDocs from "../../components/TemplatesAndDocs";
import { getApi } from "../../api/apiMethods";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { LoadingOutlined } from "@ant-design/icons";
import { useRouter } from "next/router";

function Documents() {
  const itemsData = useRef([
    {
      name: "Test Document 2",
      ownerName: "uma",
      modified_time: 23451234,
    },
    {
      name: "Test Document 1",
      ownerName: "joy",
      modified_time: 23451234,
    },
    {
      name: "Test Document 3",
      ownerName: "Dinesh",
      modified_time: 23451234,
    },
  ]);
  const [filteredData, setFilteredData] = useState();
  const [loading, setLoading] = useState(true);
  const [docParams, setDocParams] = useLocalStorage("docParams", {
    authId: "",
    objectId: "",
    objectType: "",
  });
  const [JWTtoken, setJWTtoken] = useLocalStorage("JWTtoken", "");
  const headerData = ["DOCUMENT NAME", "LAST CHANGE"];
  const [selectedItem, setSelectedItem] = useState({});
  const selectedHeader = useRef("");
  const router = useRouter();
  const inputFileRef = useRef(null);

  const getTemplatesHandler = async () => {
    if (window) {
      const currentUrl = window.location.href;
      const searchParams = new URL(currentUrl).searchParams;
      const authId = searchParams?.get("authId");
      const objectId = searchParams?.get("object_id");
      const objectType = searchParams?.get("object_type");
      setDocParams((prev) => ({ ...prev, authId, objectId, objectType }));
      const data = await getApi({
        endUrl: `set-up/auth?authId=${authId}`,
      });
      data && setJWTtoken(data?.token);
      const docsData = await getApi({
        endUrl: "hubspot-card/documents",
        headers: {
          "x-access-token": data?.token,
        },
      });
      console.log(docsData, "docsData");
      docsData && (itemsData.current = docsData?.data?.files);
      setFilteredData(itemsData?.current);
      setLoading(false);
    } else {
      console.log("Not able to access the window.");
    }
  };

  const searchHandler = (text) => {
    if (text.length === 0) {
      setFilteredData(itemsData?.current);
      return;
    } else {
      const sortedData = itemsData?.current?.filter((item) =>
        item?.name?.toLowerCase().includes(text)
      );
      sortedData && setFilteredData([...sortedData]);
    }
  };

  const sortHandler = () => {
    const templateUtils = {
      "TEMPLATE NAME": "name",
      "DOCUMENT NAME": "name",
      OWNER: "ownerName",
      "LAST CHANGE": "modified_time",
    };
    const sortKey = templateUtils?.[selectedHeader?.current];
    const sortedData = itemsData?.current?.sort((a, b) => {
      if (a?.[sortKey] > b?.[sortKey]) return 1;
      else if (a?.[sortKey] < b?.[sortKey]) return -1;
      else if (a?.[sortKey] === b?.[sortKey]) return 0;
    });
    sortedData && setFilteredData([...sortedData]);
  };

  const uploadDocHandler = async (file) => {
    console.log(file);
    var form = new FormData();
    form.append("file", file);
    const data = await axios({
      method: "post",
      url: "https://api.signeasy.com/v3/original/",
      headers: {
        Authorization: `Bearer ${jwt_decode(JWTtoken)}`,
      },
      data: {
        file: form,
        name: file?.name,
      },
    })
      .then((response) => console.log(response, "uploaded succesFully"))
      .catch((error) => console.log(error, "Error"));

    // YourAjaxLib.doUpload("/yourEndpoint/", form).then((result) =>
    //   console.log(result)
    // );
  };

  useEffect(() => {
    getTemplatesHandler();
  }, []);

  return loading ? (
    <div className="flex h-[100vh] w-[100vw] justify-center items-center">
      <LoadingOutlined />
    </div>
  ) : (
    <div className="w-[100%] px-[20px] md:px-[50px]">
      {/* Header */}
      <div className="font-lexend text-[14px] pt-[20px]">
        {`Pick a ${
          uploadDocs ? "document" : "template"
        } to send to your customer and attach to this conatct`}
      </div>
      {/* Search bar */}
      <div className="flex items-center justify-between">
        <SearchBar
          className="w-fit"
          onChange={(event) => searchHandler(event?.target?.value)}
        />
        {uploadDocs && (
          <div>
            {/* Upload document */}
            <input
              ref={inputFileRef}
              type="file"
              className="hidden"
              onChange={(event) => uploadDocHandler(event.target.files[0])}
            />
            <div
              value="Choose Files!"
              onClick={() => inputFileRef.current.click()}
              className="text-[14px] font-lexend font-[600] cursor-pointer text-[#3F8FAB]"
            >
              Upload document
            </div>
          </div>
        )}
      </div>
      {/* Table headers */}
      <div className="flex w-[100%] justify-between items-center bg-[#f6f8fa] border-[1px] border-[#D9D9D9]">
        {headerData?.map((item, index) => (
          <div
            className={classNames(
              "flex items-center py-[12px] cursor-pointer text-center",
              selectedHeader.current === item && "bg-[#ebf0f5]",
              index === 0 && "flex-1 justify-start",
              index === 1
                ? headerData?.length === 2
                  ? "flex-[0.4] justify-center"
                  : "flex-[0.6] justify-center"
                : "",
              index === 2 && "flex-[0.4] justify-center"
            )}
            key={index}
            onClick={() => {
              selectedHeader.current = item;
              sortHandler();
            }}
          >
            <div
              className={classNames(
                "font-lexend font-medium text-[14px]",
                index === 0 && "md:pl-[60px] pl-[47px]"
              )}
            >
              {item}
            </div>
            <div className="flex flex-col ml-[5px]">
              <CaretUpOutlined
                style={{
                  fontSize: "11px",
                  padding: "0px",
                  margin: "0px",
                  color: "gray",
                }}
              />
              <CaretDownOutlined
                style={{
                  fontSize: "11px",
                  padding: "0px",
                  margin: "0px",
                  color: selectedHeader.current === item ? "#3F8FAB" : "gray",
                }}
              />
            </div>
          </div>
        ))}
      </div>
      {/* Table data */}
      <div className="w-[100%] flex flex-col">
        {filteredData?.map((template, index) => (
          <div
            key={index}
            className={classNames(
              "flex w-[100%] items-center border-b-[1px] border-l-[1px] border-r-[1px] border-[#D9D9D9] py-[10px]",
              index === filteredData?.length - 1 && "shadow-lg"
            )}
          >
            <div
              className="flex flex-1 items-center ml-[10px] cursor-pointer"
              onClick={() =>
                setSelectedItem((prev) =>
                  prev?.id === template?.id ? {} : template?.id
                )
              }
            >
              <div>
                <RadioButton
                  isActive={template?.id === selectedItem?.id}
                  isDisabled={template?.name === undefined}
                />
              </div>
              <div className="md:pl-[30px] pl-[15px] text-[14px] font-lexend font-medium">
                {template?.name}
              </div>
            </div>
            {showOwner && (
              <div className="flex flex-[0.6] text-[14px] justify-center font-lexend">
                {template?.ownerName || "uma"}
              </div>
            )}
            <div className="flex flex-col flex-[0.4] text-[14px] justify-center items-center">
              <div className="font-lexend">
                {dateHandler({ timestamp: template?.last_modified_time })[0]}
              </div>
              <div className="font-lexend text-[14px]">
                {dateHandler({ timestamp: template?.last_modified_time })[1]}
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Bottom Buttons */}
      <div className="flex justify-between items-center pt-[30px]">
        <div className="font-lexend font-bold cursor-pointer text-[14px]">
          Cancel
        </div>
        <PrimaryButton
          title="Next"
          className={classNames(
            "px-[40px] py-[10px]",
            selectedItem !== "" ? "bg-[#ee8162]" : "bg-[#ebf0f5]"
          )}
          titleClassName={classNames(
            "font-lexend font-bold text-[14px]",
            selectedItem !== "" ? "text-[white]" : "text-[#b3c0d2]"
          )}
          onClick={() => router.push("/signature")}
        />
      </div>
    </div>
  );
}

export default Documents;
