import {
  CheckOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  DownOutlined,
  EllipsisOutlined,
  StopOutlined,
} from "@ant-design/icons";
import classNames from "classnames";
import React, { useRef, useState } from "react";

const CheckStatus = () => {
  const statusData = [
    { title: "Waiting for others", count: 10 },
    { title: "Completed", count: 10 },
    {
      title: "Voided",
      count: 10,
    },
    {
      title: "Declined",
      count: 10,
    },
  ];
  const statusUtils = {
    Completed: {
      icon: <CheckOutlined className="text-[15px]" />,
      color: "#3ead5e",
      subText: "Signed by",
      action: "Download",
    },
    Declined: {
      icon: <CloseCircleOutlined className="text-[15px]" />,
      color: "#c85353",
      subText: "by",
      action: "Void",
    },
    Voided: {
      icon: <StopOutlined className="text-[15px]" />,
      color: "#c85353",
      subText: "by",
      action: "Download",
    },
    Waiting: {
      icon: <ClockCircleOutlined className="text-[15px]" />,
      color: "#fea07c",
      subText: "for",
      action: "Send Reminder",
    },
  };
  const headerData = [
    { title: "Document Name", width: "40%" },
    { title: "Status", width: "20%" },
    { title: "Last Modified", width: "20%" },
    { title: "Actions", width: "20%" },
  ];
  const docData = useRef([
    {
      name: "Dummy 2",
      status: "Waiting",
      signers: 2,
      last_modified: "Apr 22,2021 4:40 PM",
    },
    {
      name: "Dummy 1",
      status: "Completed",
      signers: 2,
      last_modified: "Apr 22,2021 4:40 PM",
    },
    {
      name: "Dummy 4",
      status: "Voided",
      signers: 2,
      last_modified: "Apr 22,2021 4:40 PM",
    },
    {
      name: "Dummy 3",
      status: "Declined",
      signers: 2,
      last_modified: "Apr 22,2021 4:40 PM",
    },
  ]);
  const [sortedData, setSortedData] = useState(docData.current);

  const sortHandler = (selectedHeader) => {
    const documentUtils = {
      "Document Name": "name",
      Status: "status",
      "Last Modified": "last_modified",
    };
    const sortKey = documentUtils?.[selectedHeader];
    const sortedData = docData?.current?.sort((a, b) => {
      if (a?.[sortKey] > b?.[sortKey]) return 1;
      else if (a?.[sortKey] < b?.[sortKey]) return -1;
      else if (a?.[sortKey] === b?.[sortKey]) return 0;
    });
    sortedData && setSortedData([...sortedData]);
  };

  return (
    <div className="px-[30px]">
      <div className="font-[500]">Signeasy documents</div>
      <div className="flex border-[1px] w-fit py-[15px] rounded-[4px] mt-[20px] mb-[40px]">
        {statusData?.map((item, index) => (
          <div
            className={classNames(
              index !== statusData?.length - 1 && "border-r-[1px]",
              "px-[15px]"
            )}
            key={index}
          >
            <div className="text-[#838b90] text-[14px]">{item?.title}</div>
            <div className="font-[500]">{item?.count}</div>
          </div>
        ))}
      </div>
      {/* Headers */}
      <div className="flex border-b-[1px] px-[30px] pb-[10px]">
        {headerData?.map((item, index) => (
          <div
            className={classNames(
              "flex items-center select-none cursor-pointer",
              item?.title === "Actions" && "justify-end"
            )}
            style={{ width: item?.width }}
            onClick={() => sortHandler(item?.title)}
            key={index}
          >
            <div className="text-[14px] text-[#838b90]">{item?.title}</div>
            {item?.title !== "Actions" && (
              <DownOutlined className="text-[12px] pl-[5px] pt-[2px] text-[#838b90]" />
            )}
          </div>
        ))}
      </div>
      {/* data */}
      <div className="w-[100%]">
        {sortedData.map((item, index) => (
          <div
            className="flex items-center border-b-[1px] py-[12px] px-[30px]"
            key={index}
          >
            <div className="flex items-center w-[40%] pr-[10px]">
              <div className="-mt-[6px]">{statusUtils[item?.status]?.icon}</div>
              <div className="pl-[10px] font-[500] text-[14px]">
                {item?.name || ""}
              </div>
            </div>
            <div className="w-[20%]">
              <div
                style={{ color: statusUtils[item?.status].color }}
                className="text-[14px]"
              >
                {item?.status}
              </div>
              <div className="text-[14px] text-[#838b90]">
                {statusUtils[item?.status]?.subText}
                <span className="pl-[3px] text-[#3c9eeb]">{`${item?.signers} signers`}</span>
              </div>
            </div>
            <div className="w-[20%] text-[14px]">{item?.last_modified}</div>
            <div className="flex items-center justify-end w-[20%] cursor-pointer select-none">
              <div className="w-[50%] justify-end flex items-center text-[#3c9eeb] text-[14px]">
                {statusUtils[item.status]?.action}
                {item?.status === "Completed" && (
                  <DownOutlined className="text-[12px] pl-[5px] pt-[2px]" />
                )}
              </div>
              <EllipsisOutlined className="pl-[20px]" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CheckStatus;
