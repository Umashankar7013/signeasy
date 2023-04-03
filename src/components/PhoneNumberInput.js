import React from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

export const PhoneNumberInput = ({ onChange = () => {} }) => {
  return (
    <>
      <PhoneInput
        country={"us"}
        dropdownStyle={{
          marginLeft: -10,
          fontFamily: ["Lexend Deca", " sans-serif"],
        }}
        inputStyle={{
          fontFamily: ["Lexend Deca", " sans-serif"],
        }}
        buttonStyle={{
          backgroundColor: "#F6F8FA",
          padding: 7,
          borderRadius: "3px",
        }}
        searchStyle={{
          backgroundColor: "red",
        }}
        onChange={onChange}
      />
      <style jsx global>{`
        .react-tel-input .form-control {
          background: #f6f8fa;
          margin-left: 55px;
          padding-left: 10px;
          border-radius: 3px;
        }
      `}</style>
    </>
  );
};
