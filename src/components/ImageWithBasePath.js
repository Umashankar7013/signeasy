import React from "react";
import Image from "next/image";

export const ImageWithBasePath = (props) => {
  const url = props?.isurl ? props.src : `/assets/${props.src}.png`;
  return <Image {...props} src={url}></Image>;
};
