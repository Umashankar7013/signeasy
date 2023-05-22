import axios from "axios";

export const getApi = async ({
  endUrl = "",
  params = {},
  body = {},
  headers = {},
}) => {
  const data = await axios({
    method: "get",
    url: `${process.env.NEXT_PUBLIC_BASE_URL}${endUrl}`,
    params,
    body,
    headers,
  });
  return data?.data;
};

export const deleteApi = async ({ endUrl = "", params = {}, body = {} }) => {
  const data = await axios({
    method: "delete",
    url: `${process.env.NEXT_PUBLIC_AUTH_BASE_URL}${endUrl}`,
    params,
    body,
  }).catch((err) => console.log("Error", err));
  return data?.data;
};

export const putMethod = async ({
  endUrl = "",
  params = {},
  data = {},
  headers = {},
}) => {
  const apiData = await axios({
    method: "put",
    url: `${process.env.NEXT_PUBLIC_BASE_URL}${endUrl}`,
    params,
    data,
    headers,
  });
  return apiData?.data;
};
