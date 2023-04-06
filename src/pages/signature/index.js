import React, { useContext, useEffect, useState } from "react";
import { CrossIcon } from "../../components/CrossIcon";
import { DropDown } from "../../components/DropDown";
import { Input } from "../../components/Input";
import { PlusIcon } from "../../components/PlusIcon";
import { PrimaryButton } from "../../components/PrimaryButton";
import { LeftOutlined, LoadingOutlined } from "@ant-design/icons";
import { PhoneNumberInput } from "../../components/PhoneNumberInput";
import { FormHeaderLables } from "../../components/FormHeaderLables";
import { verificationTypeData } from "../../constants/constants";
import { TextArea } from "../../components/TextArea";
import { ReactMultiEmail } from "react-multi-email";
import "react-multi-email/dist/style.css";
import { useRouter } from "next/router";
import { AppContext } from "../_app";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import axios from "axios";
import { popupHandler } from "../../utils/functions";
import { notification } from "antd";

function Signature() {
  const { selectedItem, docParams, JWTtoken } = useContext(AppContext);
  const [signersData, setSignersData] = useLocalStorage("signersData", [
    {
      first_name: docParams?.firstName || "",
      last_name: docParams?.lastName || "",
      email: docParams?.email || "",
      recipient_id: 1,
    },
  ]);
  const [api, contextHolder] = notification.useNotification();
  const openNotification = (placement = "top") => {
    api.info({
      message: `Success`,
      description: "Suucessfully sended the envelop to the signature.",
      placement,
    });
  };

  const signer = {
    first_name: "",
    last_name: "",
    email: "",
    recipient_id: signersData.length + 1,
  };
  const [emails, setEmails] = useState([]);
  const router = useRouter();

  const clearInputHandler = (index, title) => {
    const clearFunUtils = {
      "First name": "first_name",
      "Last name": "last_name",
      Email: "email",
    };
    setSignersData((prev) => {
      let previous = [...prev];
      previous[index][clearFunUtils[title]] = "";
      return previous;
    });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    const data = await axios({
      method: "post",
      url: "https://api-stg-hubspot-signeasy.tilicho.in/api/v1/hubspot-card/documents/send-envelope",
      headers: { "x-access-token": JWTtoken },
      data: {
        original_file_id: selectedItem?.id,
        recipients: signersData,
        embedded_signing: 1,
        is_ordered: 1,
      },
    }).catch((error) => console.log(error, "Error"));
    const data1 = await axios({
      method: "post",
      url: "https://api-stg-hubspot-signeasy.tilicho.in/api/v1/hubspot-card/envelope",
      headers: { "x-access-token": JWTtoken },
      data: {
        name: selectedItem?.name,
        envelope_id: data?.data?.data?.pending_file_id,
        object_type: docParams?.objectType,
        object_id: Number(docParams?.objectId),
      },
    });
    openNotification();
    localStorage.clear();
    setTimeout(
      () =>
        router.push(
          `${DEPLOYMENT_URL}documents?authId=1c0be571-fd77-4877-bd30-fdef12bf3362&object_id=51&object_type=CONTACT#https://app.hubspot.com`
        ),
      1000
    );
  };

  const editHandler = async (e) => {
    e.preventDefault();
    const data = await axios({
      method: "post",
      url: "https://api-stg-hubspot-signeasy.tilicho.in/api/v1/hubspot-card/documents/embed-edit",
      headers: { "x-access-token": JWTtoken },
      data: {
        sources: [
          {
            id: selectedItem?.id,
            type: "original",
            source_id: 1,
            name: "acme-contract",
          },
        ],
        recipients: signersData,
        redirect_url: "https://signeasy.vercel.app/signature",
        embedded_signing: true,
        is_ordered: false,
      },
    }).catch((error) => console.log(error, "Error"));
    const data1 = await axios({
      method: "post",
      url: "https://api-stg-hubspot-signeasy.tilicho.in/api/v1/hubspot-card/envelope",
      headers: { "x-access-token": JWTtoken },
      data: {
        name: selectedItem?.name,
        envelope_id: data?.data?.data?.pending_file_id,
        object_type: docParams?.objectType,
        object_id: Number(docParams?.objectId),
      },
    });
    location.assign(data?.data?.data?.url);
  };

  const Step1 = () => (
    <div>
      <FormHeaderLables
        text1="1. Review documents in your envelope"
        text2=" All documents in this envelope are part of your chosen template."
      />
      <div className="p-[16px] ml-[17px] border-[1px] mt-[14px] border-[#E0E3EA] rounded-[3px]">
        <div className="font-lexend font-[500] leading-[17px] text-[14px]">
          {selectedItem?.name}
        </div>
        {/* <div className="pt-[6px] font-lexend font-[300] leading-[15px] text-[12px] text-[#9DABC0]">
          1 pages
        </div> */}
      </div>
    </div>
  );

  const Step3 = () => (
    <div>
      <FormHeaderLables
        text1="3. Customize the message for your recipients"
        text2=" Edit the subject and message for the email sent with your envelope."
      />
      <div className="mt-[14px] pl-[17px]">
        <Input title="Email subject" limit={60} />
        <div className="mt-[47px]">
          <TextArea title="Message for signers" limit={200} />
        </div>
      </div>
    </div>
  );

  const Step4 = () => (
    <div>
      <FormHeaderLables
        text1="4. Send copies of signed documents"
        text2=" Copies of signed document can be shared to the below contact."
      />
      <div className="mt-[14px] pl-[17px]">
        {/* <Input title="Email" /> */}
        <div className="font-lexend font-[500] mb-[3px] text-[14px] leading-[17px] text-[#374659]">
          Email
        </div>
        <ReactMultiEmail
          placeholder=""
          emails={emails}
          onChange={(email) => {
            setEmails(email);
          }}
          getLabel={(email, index, removeEmail) => {
            return (
              <div data-tag key={index}>
                {email}
                <span data-tag-handle onClick={() => removeEmail(index)}>
                  ×
                </span>
              </div>
            );
          }}
          style={{
            backgroundColor: "#F6F8FA",
            fontFamily: ["Lexend Deca", " sans-serif"],
            borderColor: "#CDD6E1",
            fontSize: 14,
            paddingTop: 2,
            paddingLeft: 10,
          }}
          className=""
        />
        <style jsx global>{`
          .react-multi-email > input {
            background-color: #f6f8fa;
          }
          .react-multi-email [data-tag] {
            color: black;
          }
        `}</style>
      </div>
    </div>
  );

  return (
    <div className="h-[100vh] w-[100vw] px-[20px] md:px-[30px]">
      <form>
        {contextHolder}
        <Step1 />
        {/* <Step2 /> */}
        <div>
          <FormHeaderLables
            text1="2. Invite signers"
            text2="Add HubSpot contacts as recipients for this envelope."
          />
          {signersData?.map((item, index) => (
            <div
              className="border-[1px] px-[20px] pt-[15px] pb-[20px] border-[#E0E3EA] rounded-[3px] mt-[14px] ml-[17px]"
              key={index}
            >
              <div className="flex justify-between items-center">
                <div className="font-lexend font-[500] text-[14px] text-[#374659]">
                  {"<Role name>"}
                </div>
                <div
                  onClick={() => {
                    setSignersData((prev) => {
                      return prev.filter((item, index1) => index !== index1);
                    });
                  }}
                >
                  <CrossIcon />
                </div>
              </div>
              <div className="grid gap-x-[10px] gap-y-[10px] sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 pt-[17px] w-[100%]">
                <div className="w-[100%]">
                  <Input
                    title="First name"
                    required={true}
                    className="w-[100%]"
                    value={item?.first_name}
                    enableDelete={item?.first_name !== ""}
                    onChange={(event) =>
                      setSignersData((prev) => {
                        let previous = [...prev];
                        previous[index].first_name = event.target.value;
                        return previous;
                      })
                    }
                    index={index}
                    clearFun={clearInputHandler}
                  />
                </div>
                <div className="w-[100%]">
                  <Input
                    title="Last name"
                    required={true}
                    className="w-[100%]"
                    value={item?.last_name}
                    enableDelete={item?.last_name !== ""}
                    onChange={(event) =>
                      setSignersData((prev) => {
                        let previous = [...prev];
                        previous[index].last_name = event.target.value;
                        return previous;
                      })
                    }
                    index={index}
                    clearFun={clearInputHandler}
                  />
                </div>
                <div className="w-[100%]">
                  <Input
                    title="Email"
                    required={true}
                    className="w-[100%]"
                    value={item?.email}
                    enableDelete={item?.email !== ""}
                    onChange={(event) =>
                      setSignersData((prev) => {
                        let previous = [...prev];
                        previous[index].email = event.target.value;
                        return previous;
                      })
                    }
                    index={index}
                    clearFun={clearInputHandler}
                  />
                </div>
              </div>
            </div>
          ))}

          <div
            className="flex items-center ml-[17px] mt-[20px] cursor-pointer select-none"
            onClick={() => setSignersData((prev) => [...prev, signer])}
          >
            <PlusIcon />
            <div className="pl-[6px] font-lexend font-[600] text-[14px] leading-[17.5px] text-[#3F8FAB]">
              Add new recipient
            </div>
          </div>
        </div>
        <Step3 />
        <Step4 />
        {/* Bottom Buttons */}
        <div className="flex justify-between mt-[40px] pb-[50px]">
          <PrimaryButton
            title="Back"
            image={
              <LeftOutlined
                style={{
                  fontSize: 12,
                  color: "#ee8162",
                }}
              />
            }
            className="pl-[5px] py-[7px] pr-[15px] border-[#ee8162]"
            titleClassName="pl-[10px] font-bold text-[#ee8162] text-[14px]"
          />
          <div className="flex">
            <input
              type="submit"
              value="Edit in Signeasy"
              className="border-[1px] px-[15px] cursor-pointer rounded-[8px] border-[#ee8162] text-[#ee8162] font-bold text-[14px]"
              onClick={(e) => editHandler(e)}
            />
            <input
              type="submit"
              value="Send for signature"
              className="border-[1px] px-[15px] ml-[10px] cursor-pointer rounded-[8px] bg-[#ee8162] font-bold text-[14px] text-white"
              onClick={(e) => submitHandler(e)}
            />
          </div>
        </div>
      </form>
    </div>
  );
}

export default Signature;
