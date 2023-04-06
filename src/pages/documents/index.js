import React, { useEffect, useRef, useState } from "react";
import TemplatesAndDocs from "../../components/TemplatesAndDocs";
import { getApi } from "../../api/apiMethods";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { LoadingOutlined } from "@ant-design/icons";

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

  useEffect(() => {
    getTemplatesHandler();
  }, []);

  return loading ? (
    <div className="flex h-[100vh] w-[100vw] justify-center items-center">
      <LoadingOutlined />
    </div>
  ) : (
    <TemplatesAndDocs
      uploadDocs={true}
      showOwner={false}
      paramFilteredData={filteredData}
      paramItemsData={itemsData.current}
    />
  );
}

export default Documents;
