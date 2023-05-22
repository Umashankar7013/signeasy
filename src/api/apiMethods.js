import axios from "axios";

export const getApi = async ({
  endUrl = "",
  params = {},
  data = {},
  headers = {},
}) => {
  const apiData = await axios({
    method: "get",
    url: `${process.env.NEXT_PUBLIC_BASE_URL}${endUrl}`,
    params,
    data,
    headers,
  });
  return apiData?.data;
};

export const deleteApi = async ({ endUrl = "", params = {}, data = {} }) => {
  const apiData = await axios({
    method: "delete",
    url: `${process.env.NEXT_PUBLIC_AUTH_BASE_URL}${endUrl}`,
    params,
    data,
  }).catch((err) => console.log("Error", err));
  return apiData?.data;
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
