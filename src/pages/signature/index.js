import React, { useState } from "react";
import { CrossIcon } from "../../components/CrossIcon";
import { DropDown } from "../../components/DropDown";
import { Input } from "../../components/Input";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { PlusIcon } from "../../components/PlusIcon";
import { PrimaryButton } from "../../components/PrimaryButton";
import { LeftOutlined } from "@ant-design/icons";

function Signature() {
  const headerClass =
    "text-[16px] font-lexend font-[600] leading-[20px] text-[#374659] pt-[40px]";
  const descriptionClass =
    "font-lexend text-[14px] font-[300] leading-[17.5px] text-[#374659] pt-[5px] pl-[17px]";
  const verificationTypeData = [
    "Not Required",
    "SMS verification",
    "Email verification",
  ];
  const [signersData, setSignersData] = useState([
    {
      data: verificationTypeData,
      verificationType: undefined,
    },
  ]);
  const signer = {
    data: verificationTypeData,
    verificationType: undefined,
  };

  const verificationTypeHandler = (type, index) => {
    setSignersData((prev) => {
      let previousItems = [...prev];
      previousItems[index].verificationType = type;
      return previousItems;
    });
  };

  return (
    <div className="h-[100vh] w-[100vw] px-[30px]">
      {/* step 1 */}
      <div>
        <div className={headerClass}>1. Review documents in your envelope</div>
        <div className={descriptionClass}>
          All documents in this envelope are part of your chosen template.
        </div>
        <div className="p-[16px] ml-[17px] border-[1px] mt-[14px] border-[#E0E3EA] rounded-[3px] w-[70%]">
          <div className="font-lexend font-[500] leading-[17px] text-[14px]">
            Healthcare discharge form.pdf
          </div>
          <div className="pt-[6px] font-lexend font-[300] leading-[15px] text-[12px] text-[#9DABC0]">
            1 pages
          </div>
        </div>
      </div>
      {/* step 2 */}
      <div>
        <div className={headerClass}>2. Invite signers</div>
        <div className={descriptionClass}>
          Add HubSpot contacts as recipients for this envelope.
        </div>
        {signersData?.map((item, index) => (
          <div
            className="border-[1px] px-[20px] pt-[15px] pb-[20px] border-[#E0E3EA] rounded-[3px] w-[70%] mt-[14px] ml-[17px]"
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
                <Input title="Name" isManditory={true} className="w-[100%]" />
              </div>
              <div className="ml-[10px] w-[100%]">
                <Input title="Email" isManditory={true} className="w-[100%]" />
              </div>
            </div>
            <div className="border-b-[1px] pt-[30px]"></div>
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
                <div className="font-lexend font-[500] text-[#374659] leading-[17.5px] mb-[3px]">
                  Mobile number *
                </div>
                <PhoneInput
                  country={"us"}
                  dropdownStyle={{
                    marginLeft: -10,
                    fontFamily: ["Lexend Deca", " sans-serif"],
                  }}
                  inputStyle={{
                    backgroundColor: "#F6F8FA",
                    height: 40,
                    marginLeft: 15,
                    fontFamily: ["Lexend Deca", " sans-serif"],
                  }}
                  buttonStyle={{
                    backgroundColor: "#F6F8FA",
                    padding: 10,
                  }}
                  searchStyle={{
                    backgroundColor: "red",
                  }}
                  // onChange={(value) => console.log(value)}
                />
              </div>
            )}
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
      {/* step 3 */}
      <div>
        <div className={headerClass}>
          3. Customize the message for your recipients
        </div>
        <div className={descriptionClass}>
          Edit the subject and message for the email sent with your envelope.
        </div>
        <div className="mt-[14px] pl-[17px]">
          <Input title="Email subject" limit={60} />
          <div className="mt-[47px]">
            <Input title="Message for signers" limit={200} />
          </div>
        </div>
      </div>
      {/* step 4 */}
      <div>
        <div className={headerClass}> 4. Send copies of signed documents</div>
        <div className={descriptionClass}>
          Copies of signed document can be shared to the below contact.
        </div>
        <div className="mt-[14px] pl-[17px]">
          <Input title="Email" />
        </div>
      </div>
      {/* Bottom Buttons */}
      <div className="flex justify-between mt-[40px] w-[90%] pb-[50px]">
        <PrimaryButton
          title="Back"
          image={
            <LeftOutlined
              style={{
                fontSize: 12,
                color: "orange",
              }}
            />
          }
          className="pl-[5px] py-[7px] pr-[15px] border-orange-300"
          titleClassName="pl-[10px] font-bold text-orange-300 text-[14px]"
        />
        <div className="flex">
          <PrimaryButton
            title="Edit in Signeasy"
            className="px-[15px] border-orange-300"
            titleClassName="font-bold text-[14px] text-orange-300"
          />
          <PrimaryButton
            title="Send for signature"
            className="px-[15px] bg-orange-300 ml-[10px]"
            titleClassName="font-bold text-[14px] text-white"
          />
        </div>
      </div>
    </div>
  );
}

export default Signature;
