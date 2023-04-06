import React, { useEffect, useRef, useState } from "react";
import TemplatesAndDocs from "../../components/TemplatesAndDocs";
import { getApi } from "../../api/apiMethods";
import { LoadingOutlined } from "@ant-design/icons";

const Templates = () => {
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

  const getTemplatesHandler = async () => {
    if (window) {
      const currentUrl = window.location.href;
      const searchParams = new URL(currentUrl).searchParams;
      const userId = searchParams?.get("hubspot_user_id");
      const portalId = searchParams?.get("hubspot_portal_id");
      const data = await getApi({
        endUrl: "hubspot-card/templates",
        params: {
          hubspot_user_id: userId,
          hubspot_portal_id: portalId,
        },
      });
      data && (itemsData.current = data?.data);
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
      paramFilteredData={filteredData}
      paramItemsData={itemsData.current}
      itemsGetFun={getTemplatesHandler}
    />
  );
};

export default Templates;
