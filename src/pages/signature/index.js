import React, { useContext, useEffect, useRef, useState } from "react";
import { CrossIcon } from "../../components/CrossIcon";
import { Input } from "../../components/Input";
import { PlusIcon } from "../../components/PlusIcon";
import { PrimaryButton } from "../../components/PrimaryButton";
import {
  LeftOutlined,
  CheckCircleFilled,
  BorderOutlined,
  CheckSquareOutlined,
  CheckOutlined,
} from "@ant-design/icons";
import { FormHeaderLables } from "../../components/FormHeaderLables";
import { TextArea } from "../../components/TextArea";
import { ReactMultiEmail } from "react-multi-email";
import "react-multi-email/dist/style.css";
import { useRouter } from "next/router";
import axios from "axios";
import { notification } from "antd";
import { openNotification } from "../../utils/functions";
import { Loader } from "../../components/Loader";
import { AppContext } from "../../components/Layout";
import Image from "next/image";
import { ImageWithBasePath } from "../../components/ImageWithBasePath";
import classNames from "classnames";

function Signature() {
  const { selectedItem, docParams, JWTtoken, setDocParams } =
    useContext(AppContext);
  const [browserWindow, setBrowserWindow] = useState();
  const router = useRouter();
  const type = router.query?.type;
  const [signersData, setSignersData] = useState([
    {
      first_name: docParams?.firstname || "",
      last_name: docParams?.lastname || "",
      email: docParams?.email || "",
    },
  ]);
  const [api, contextHolder] = notification.useNotification();
  const signer = {
    first_name: "",
    last_name: "",
    email: "",
  };
  const [emails, setEmails] = useState([]);
  const [emailSubject, setEmailSubject] = useState("");
  const [message, setMessage] = useState("");
  const [emptyInput, setEmptyInput] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [roles, setRoles] = useState(
    type === "original"
      ? [{ ...signer, name: "Signer 1" }]
      : selectedItem?.metadata?.roles
  );
  const [timer, setTimer] = useState(5);
  const timeIntervel = useRef(null);
  const [enableDrag, setEnableDrag] = useState(false);
  const dragItem = useRef();
  const dragOverItem = useRef();

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

  const envelopSaveHandler = async ({
    id,
    name,
    token,
    objectId,
    objectType,
  }) => {
    setLoading(true);
    await axios({
      method: "post",
      url: `${process.env.NEXT_PUBLIC_BASE_URL}hubspot-card/envelope`,
      headers: { "x-access-token": token },
      data: {
        name: name,
        envelope_id: id,
        object_type: objectType ? objectType : docParams?.object_type,
        object_id: objectId ? Number(objectId) : Number(docParams?.object_id),
      },
    })
      .then((response) => {
        localStorage.clear();
        setShowSuccessMessage(true);
        timeIntervel.current = setInterval(
          () => setTimer((prev) => prev - 1),
          1000
        );
        setLoading(false);
      })
      .catch((error) => {
        openNotification({
          message: "Error",
          description: error.message,
          type: "error",
          api,
        });
        setLoading(false);
      });
  };

  const requiredFieldsCheckHandler = () => {
    let flag = 0;
    signersData.map((item) => {
      if (
        !(item.first_name !== "" && item.last_name !== "" && item.email !== "")
      ) {
        flag = 1;
        return;
      }
    });
    if (flag === 0) return true;
    else {
      setEmptyInput(true);
      return false;
    }
  };

  const recipientRoleMappingHandler = () => {
    let mappingArray = [];
    signersData?.map((_, index) => {
      mappingArray.push({
        role_id: index + 1,
        recipient_id: index + 1,
        source_id: 1,
      });
    });
    return mappingArray;
  };

  const recipientIdHandler = () => {
    let clone = [];
    signersData?.map((item, index) => {
      clone.push({ ...item, recipient_id: index + 1 });
    });
    return clone;
  };

  const paramsHandler = () => {
    let copy = docParams;
    delete copy.authId;
    delete copy.hubspot_user_id;
    delete copy.hubspot_portal_id;
    return copy;
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (requiredFieldsCheckHandler()) {
      setLoading(true);
      let formattedEmails = [];
      emails?.map((item) => {
        formattedEmails?.push({ email: item });
      });

      let data;
      let params = paramsHandler();
      if (type === "original") {
        data = {
          original_file_id: selectedItem?.id,
          recipients: signersData,
          embedded_signing: false,
          is_ordered: 1,
        };
      } else {
        data = {
          sources: [
            {
              id: selectedItem?.id,
              type: "template",
              name: selectedItem?.name,
              source_id: 1,
            },
          ],
          recipients: recipientIdHandler(),
          embedded_signing: false,
          is_ordered: false,
          name: emailSubject !== "" ? emailSubject : selectedItem?.name,
          message: message,
          cc: formattedEmails || [],
          recipient_role_mapping: recipientRoleMappingHandler(),
        };
      }
      await axios({
        method: "post",
        url: `${process.env.NEXT_PUBLIC_BASE_URL}hubspot-card/${
          type === "original" ? "documents" : "templates"
        }/send-envelope`,
        headers: { "x-access-token": JWTtoken },
        data,
        params,
      })
        .then(async (data) => {
          await envelopSaveHandler({
            id:
              type === "original"
                ? data?.data?.data?.pending_file_id
                : data?.data?.data?.id,
            name: selectedItem?.name,
            token: JWTtoken,
          });
        })
        .catch((error) => {
          openNotification({
            message: "Error",
            description: error?.response?.data?.message,
            type: "error",
            api,
          });
          setLoading(false);
        });
    }
  };

  const editHandler = async (e) => {
    e.preventDefault();
    if (requiredFieldsCheckHandler()) {
      setLoading(true);
      let formattedEmails = [];
      emails?.map((item) => {
        formattedEmails?.push({ email: item });
      });
      let data;
      let params = {};
      if (type === "original") {
        data = {
          sources: [
            {
              id: selectedItem?.id,
              type,
              source_id: 1,
              name: selectedItem?.name,
            },
          ],
          recipients: recipientIdHandler(),
          redirect_url: `${
            process.env.NEXT_PUBLIC_DEPLOYMENT_URL
          }signature?name=${encodeURIComponent(
            selectedItem?.name
          )}&object_type=${docParams?.object_type}&object_id=${
            docParams?.object_id
          }&JWTtoken=${JWTtoken}&first_name=${encodeURIComponent(
            docParams?.firstname
          )}&last_name=${encodeURIComponent(
            encodeURIComponent(docParams?.lastname)
          )}&email=${encodeURIComponent(docParams?.email)}`,
          embedded_signing: false,
          is_ordered: false,
        };
      } else {
        params = {
          object_type: docParams?.object_type,
          firstname: docParams?.firstname,
          lastname: docParams?.lastname,
          email: docParams?.email,
          name: docParams?.name,
        };
        data = {
          sources: [
            {
              id: selectedItem?.id,
              type: "template",
              name: selectedItem?.name,
              source_id: 1,
            },
          ],
          recipients: recipientIdHandler(),
          embedded_signing: false,
          is_ordered: false,
          name: emailSubject !== "" ? emailSubject : selectedItem?.name,
          message: message,
          cc: formattedEmails || [],
          recipient_role_mapping: recipientRoleMappingHandler(),
          redirect_url: `${
            process.env.NEXT_PUBLIC_DEPLOYMENT_URL
          }signature?name=${encodeURIComponent(
            selectedItem?.name
          )}&object_type=${docParams?.object_type}&object_id=${
            docParams?.object_id
          }&JWTtoken=${JWTtoken}&first_name=${encodeURIComponent(
            docParams?.firstname
          )}&last_name=${encodeURIComponent(
            docParams?.lastname
          )}&email=${encodeURIComponent(docParams?.email)}`,
        };
      }

      await axios({
        method: "post",
        url: `${process.env.NEXT_PUBLIC_BASE_URL}hubspot-card/documents/embed-edit`,
        headers: { "x-access-token": JWTtoken },
        data,
        params,
      })
        .then(async (data) => {
          window?.open(data?.data?.data?.url, "_self");
        })
        .catch((error) => {
          openNotification({
            message: "Error",
            description: error.message,
            type: "error",
            api,
          });
          setLoading(false);
        });
    }
  };

  useEffect(() => {
    for (let i = 1; i <= selectedItem?.metadata?.roles?.length; i++) {
      setSignersData((prev) => {
        if (prev?.length < selectedItem?.metadata?.roles?.length)
          return [...prev, signer];
        return [...prev];
      });
    }
  }, [selectedItem?.metadata?.roles]);

  if (timer === 0) {
    clearInterval(timeIntervel.current);
    window?.parent?.postMessage(JSON.stringify({ action: "DONE" }), "*");
  }

  const Step1 = () => (
    <div>
      <FormHeaderLables
        text1="1. Review documents in your envelope"
        text2=" All documents in this envelope are part of your choosen template."
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

  const Step4 = () => (
    <div>
      <FormHeaderLables
        text1="4. Send copies of signed documents"
        text2=" Copies of signed document can be shared to the below contact."
      />
      <div className="mt-[14px] pl-[17px] w-[75%]">
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

  const popupObserver = async () => {
    const currentUrl = window.location.href;
    const searchParams = new URL(currentUrl).searchParams;
    const pending_file_id = searchParams.get("pending_file_id");
    if (pending_file_id) {
      setLoading(true);
      const JWTtoken = searchParams?.get("JWTtoken");
      const objectId = searchParams?.get("object_id");
      const objectType = searchParams?.get("object_type");
      const firstName = searchParams?.get("first_name");
      const lastName = searchParams?.get("last_name");
      const email = searchParams?.get("email");
      const docName = searchParams?.get("name");
      setDocParams((prev) => ({
        ...prev,
        authId: null,
        objectId,
        objectType,
        firstName,
        lastName,
        email,
      }));
      await envelopSaveHandler({
        id: pending_file_id,
        name: docName,
        token: JWTtoken,
        objectId: objectId,
        objectType: objectType,
      });
    }
  };

  const dragStart = (e, position) => {
    dragItem.current = position;
  };

  const dragEnter = (e, position) => {
    dragOverItem.current = position;
    let data1 = roles[dragItem.current];
    let data2 = roles[dragOverItem.current];
    setRoles((prev) => {
      prev[dragOverItem.current] = data1;
      prev[dragItem.current] = data2;
      return [...prev];
    });
    data1 = signersData[dragItem.current];
    data2 = signersData[dragOverItem.current];
    setSignersData((prev) => {
      prev[dragOverItem.current] = data1;
      prev[dragItem.current] = data2;
      return [...prev];
    });
  };

  useEffect(() => {
    return () => setSignersData([{}]);
  }, []);

  useEffect(() => {
    popupObserver();
    setBrowserWindow(window);
  }, []);

  return (
    <>
      {contextHolder}
      <div>
        {loading ? (
          <Loader />
        ) : (
          <>
            {showSuccessMessage ? (
              <div className="flex justify-center flex-col items-center h-[100vh] w-[100vw]">
                <div className="flex items-center justify-center">
                  <CheckCircleFilled
                    style={{
                      fontSize: 24,
                      color: "green",
                    }}
                  />
                  <div className="ml-[5px] text-[20px]">
                    Contract sent out for signature successfully. Taking you
                    back to the main screen.
                  </div>
                </div>
                <div className="text-[20px]">{`${timer} Sec`}</div>
              </div>
            ) : (
              <form>
                <div className="fixed overflow-scroll xs:h-[90%] h-[85%] pb-[30px] overflow-x-hidden w-[100%]">
                  <Step1 />
                  {/* <Step2 /> */}
                  <div>
                    <FormHeaderLables
                      text1="2. Invite signers"
                      text2="Add HubSpot contacts as recipients for this envelope."
                    />
                    {roles?.map((item, index) => (
                      <div
                        className={classNames(
                          "flex items-center w-[100%]",
                          enableDrag && roles?.length > 1 && "pl-[20px]"
                        )}
                        key={index}
                      >
                        {enableDrag && roles?.length > 1 && (
                          <div
                            draggable
                            onDragStart={(e) => dragStart(e, index)}
                            onDragEnter={(e) => dragEnter(e, index)}
                          >
                            <ImageWithBasePath
                              src="dragIcon"
                              height={18}
                              width={10}
                              className="cursor-pointer"
                            />
                          </div>
                        )}
                        <div
                          className="border-[1px] pt-[15px] px-[20px] w-[100%] pb-[20px] border-[#E0E3EA] rounded-[3px] mt-[14px] ml-[17px]"
                          key={index}
                        >
                          <div className="flex justify-between items-center">
                            <div className="font-lexend font-[500] text-[14px] text-[#374659]">
                              {item?.name}
                            </div>
                            <div
                              onClick={() => {
                                type === "original" &&
                                  setSignersData((prev) => {
                                    return prev.filter(
                                      (item, index1) => index !== index1
                                    );
                                  });
                                type === "original" &&
                                  setRoles((prev) => {
                                    return prev.filter(
                                      (item, index1) => index !== index1
                                    );
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
                                value={signersData[index]?.first_name}
                                enableDelete={
                                  signersData[index]?.first_name !== ""
                                }
                                onChange={(event) =>
                                  setSignersData((prev) => {
                                    let previous = [...prev];
                                    previous[index].first_name =
                                      event.target.value;
                                    return previous;
                                  })
                                }
                                index={index}
                                clearFun={clearInputHandler}
                                showError={
                                  emptyInput &&
                                  signersData[index]?.first_name === ""
                                }
                              />
                            </div>
                            <div className="w-[100%]">
                              <Input
                                title="Last name"
                                required={true}
                                className="w-[100%]"
                                value={signersData[index]?.last_name}
                                enableDelete={
                                  signersData[index]?.last_name !== ""
                                }
                                onChange={(event) =>
                                  setSignersData((prev) => {
                                    let previous = [...prev];
                                    previous[index].last_name =
                                      event.target.value;
                                    return previous;
                                  })
                                }
                                index={index}
                                clearFun={clearInputHandler}
                                showError={
                                  emptyInput &&
                                  signersData[index]?.last_name === ""
                                }
                              />
                            </div>
                            <div className="w-[100%]">
                              <Input
                                title="Email"
                                required={true}
                                className="w-[100%]"
                                value={signersData[index]?.email}
                                enableDelete={signersData[index]?.email !== ""}
                                onChange={(event) =>
                                  setSignersData((prev) => {
                                    let previous = [...prev];
                                    previous[index].email = event.target.value;
                                    return previous;
                                  })
                                }
                                index={index}
                                clearFun={clearInputHandler}
                                showError={
                                  emptyInput && signersData[index]?.email === ""
                                }
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    {type === "original" && (
                      <div className="flex items-center justify-between ml-[17px] mt-[20px]">
                        {roles?.length > 1 && (
                          <div
                            className="flex items-center cursor-pointer select-none"
                            onClick={() => setEnableDrag(!enableDrag)}
                          >
                            <div
                              className={classNames(
                                "h-[16px] w-[16px] border-[1px] flex justify-center items-center rounded-[2px]",
                                enableDrag && "bg-[#3F8FAB]"
                              )}
                            >
                              {enableDrag && (
                                <CheckOutlined className="text-[10px] text-[#fff]" />
                              )}
                            </div>
                            <div className="pl-[6px] font-lexend font-[600] text-[14px] leading-[17.5px] text-[#3F8FAB]">
                              Set signing order
                            </div>
                          </div>
                        )}
                        <div
                          className="flex items-center cursor-pointer select-none"
                          onClick={() => {
                            type === "original" &&
                              setSignersData((prev) => [...prev, signer]);
                            type === "original" &&
                              setRoles((prev) => [
                                ...prev,
                                {
                                  ...signer,
                                  name: `Signer ${prev.length + 1}`,
                                },
                              ]);
                          }}
                        >
                          <PlusIcon />
                          <div className="pl-[6px] font-lexend font-[600] text-[14px] leading-[17.5px] text-[#3F8FAB]">
                            Add new recipient
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  {/* Step3 */}
                  <div>
                    <FormHeaderLables
                      text1="3. Customize the message for your recipients"
                      text2=" Edit the subject and message for the email sent with your envelope."
                    />
                    <div className="mt-[14px] pl-[17px]">
                      <Input
                        title="Email subject"
                        limit={60 - emailSubject?.length}
                        onChange={(e) => {
                          e.target.value =
                            e.target.value.match(/^([^]{0,60})/)[0];
                          setEmailSubject(e.target.value);
                        }}
                        width="75%"
                      />
                      <div className="mt-[30px]">
                        <TextArea
                          title="Message for signers"
                          limit={200 - message.length}
                          onChange={(e) => {
                            e.target.value =
                              e.target.value.match(/^([^]{0,200})/)[0];
                            setMessage(e.target.value);
                          }}
                          rows={3}
                          width="75%"
                        />
                      </div>
                    </div>
                  </div>
                  <Step4 />
                </div>
                {/* Bottom Buttons */}
                <div className="xs:flex justify-between fixed py-[10px] bottom-[0px] w-[100%] bg-[white]">
                  <PrimaryButton
                    title="Back"
                    image={
                      <LeftOutlined
                        style={{
                          fontSize: 12,
                          color: "#FF7A59",
                        }}
                      />
                    }
                    className="pl-[5px] py-[7px] pr-[15px] border-[#FF7A59] rounded-[3px]"
                    titleClassName="pl-[10px] font-bold text-[#FF7A59] text-[14px]"
                    onClick={() => router.back()}
                  />
                  <div className="flex w-[100%] xs:w-fit xs:mt-[0px] mt-[10px]">
                    <input
                      type="submit"
                      value={type === "original" ? "Add fields" : "Preview"}
                      className="border-[1px] px-[15px] py-[7px] cursor-pointer rounded-[3px] border-[#FF7A59] text-[#FF7A59] font-bold text-[14px]"
                      onClick={(e) => editHandler(e)}
                    />
                    <input
                      type="submit"
                      value={
                        type === "original"
                          ? "Send without fields"
                          : "Send for signature"
                      }
                      className="border-[1px] px-[15px] ml-[10px] py-[7px] cursor-pointer rounded-[3px] bg-[#FF7A59] font-bold text-[14px] text-white"
                      onClick={(e) => submitHandler(e)}
                    />
                  </div>
                </div>
              </form>
            )}
          </>
        )}
      </div>
    </>
  );
}

export default Signature;
