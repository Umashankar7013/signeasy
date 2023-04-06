import axios from "axios";
import { AUTH_BASE_URL, BASE_URL } from "../constants/constants";

export const getApi = async ({
  endUrl = "",
  params = {},
  body = {},
  headers = {},
}) => {
  const data = await axios({
    method: "get",
    url: `${BASE_URL}${endUrl}`,
    params,
    body,
    headers,
  }).catch((err) => console.log("Error", err));
  return data?.data;
};

export const deleteApi = async ({ endUrl = "", params = {}, body = {} }) => {
  const data = await axios({
    method: "delete",
    url: `${AUTH_BASE_URL}${endUrl}`,
    params,
    body,
  }).catch((err) => console.log("Error", err));
  return data?.data;
};
