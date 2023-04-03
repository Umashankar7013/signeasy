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
        // inputStyle={{
        //   backgroundColor: "#F6F8FA",
        //   height: 40,
        //   marginLeft: 15,
        //   fontFamily: ["Lexend Deca", " sans-serif"],
        // }}
        buttonStyle={{
          backgroundColor: "#F6F8FA",
          padding: 10,
        }}
        searchStyle={{
          backgroundColor: "red",
        }}
        onChange={onChange}
      />
      <style jsx global>{`
        .react-tel-input .form-control {
          background: red;
        }
        .react-tel-input .flag-dropdown {
          position: relative;
          width: fit;
        }
      `}</style>
    </>
  );
};
