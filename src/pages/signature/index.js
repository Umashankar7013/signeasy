import React, { useContext, useEffect, useState } from "react";
import { CrossIcon } from "../../components/CrossIcon";
import { DropDown } from "../../components/DropDown";
import { Input } from "../../components/Input";
import { PlusIcon } from "../../components/PlusIcon";
import { PrimaryButton } from "../../components/PrimaryButton";
import { LeftOutlined } from "@ant-design/icons";
import { PhoneNumberInput } from "../../components/PhoneNumberInput";
import { FormHeaderLables } from "../../components/FormHeaderLables";
import { verificationTypeData } from "../../constants/constants";
import { TextArea } from "../../components/TextArea";
import { ReactMultiEmail } from "react-multi-email";
import "react-multi-email/dist/style.css";
import { useRouter } from "next/router";
import { AppContext } from "../_app";

function Signature() {
  const [signersData, setSignersData] = useState([
    {
      verificationType: undefined,
    },
  ]);
  const signer = {
    verificationType: undefined,
  };
  const [emails, setEmails] = useState([]);
  const router = useRouter();
  const { selectedItem, docParams } = useContext(AppContext);

  useEffect(() => {
    if (
      docParams?.firstName !== "" ||
      docParams?.lastName !== "" ||
      docParams?.email !== ""
    ) {
    }
  }, []);

  const verificationTypeHandler = (type, index) => {
    setSignersData((prev) => {
      let previousItems = [...prev];
      previousItems[index].verificationType = type;
      return previousItems;
    });
  };

  const Step1 = () => (
    <div>
      <FormHeaderLables
        text1="1. Review documents in your envelope"
        text2=" All documents in this envelope are part of your chosen template."
      />
      <div className="p-[16px] ml-[17px] border-[1px] mt-[14px] border-[#E0E3EA] rounded-[3px] md:w-[70%]">
        <div className="font-lexend font-[500] leading-[17px] text-[14px]">
          {selectedItem?.name}
        </div>
        {/* <div className="pt-[6px] font-lexend font-[300] leading-[15px] text-[12px] text-[#9DABC0]">
          1 pages
        </div> */}
      </div>
    </div>
  );

  const Step2 = () => (
    <div>
      <FormHeaderLables
        text1="2. Invite signers"
        text2="Add HubSpot contacts as recipients for this envelope."
      />
      {signersData?.map((item, index) => (
        <div
          className="border-[1px] px-[20px] pt-[15px] pb-[20px] border-[#E0E3EA] rounded-[3px] md:w-[70%] mt-[14px] ml-[17px]"
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
          <div className="flex pt-[17px] w-[100%]">
            <div className="w-[100%]">
              <Input title="first name" required={true} className="w-[100%]" />
            </div>
            <div className="ml-[10px] w-[100%]">
              <Input title="last name" required={true} className="w-[100%]" />
            </div>
            <div className="ml-[10px] w-[100%]">
              <Input title="Email" required={true} className="w-[100%]" />
            </div>
          </div>
          {/* Two step verification */}
          {/* <div className="border-b-[1px] pt-[30px]"></div>
          <div className="w-[50%] mt-[30px]">
            <DropDown
              dropDownData={verificationTypeData}
              content={item?.verificationType || verificationTypeData[0]}
              userIndex={index}
              changeFun={verificationTypeHandler}
            />
            {item?.verificationType === "SMS verification" && (
              <div className="font-lexend text-[14px] mt-[10px] font-[300] leading-[17.5px]">
                A code will be sent to the recipient via SMS.
              </div>
            )}
          </div>
          {item?.verificationType === "SMS verification" && (
            <div className="mt-[30px]">
              <div className="font-lexend text-[14px] font-[500] text-[#374659] leading-[17.5px] mb-[3px]">
                Mobile number *
              </div>
              <PhoneNumberInput />
            </div>
          )} */}
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
          className="md:w-[70%]"
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
        <Step1 />
        <Step2 />
        <Step3 />
        <Step4 />
        {/* Bottom Buttons */}
        <div className="flex justify-between mt-[40px] md:w-[90%] pb-[50px]">
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
            <PrimaryButton
              title="Edit in Signeasy"
              className="px-[15px] border-[#ee8162]"
              titleClassName="font-bold text-[14px] text-[#ee8162]"
            />
            <input
              type="submit"
              value="Send for signature"
              className="border-[1px] px-[15px] ml-[10px] cursor-pointer rounded-[8px] bg-[#ee8162] font-bold text-[14px] text-white"
            />
          </div>
        </div>
      </form>
    </div>
  );
}

export default Signature;
