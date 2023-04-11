import { ImageWithBasePath } from "../components/ImageWithBasePath";

export const popupHandler = async ({ url }) => {
  let popup;
  if (window) {
    const width = 800;
    const height = window.outerHeight - 200;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 3.5;
    const title = "auth";
    popup = window.open(
      url,
      title,
      `width=${width},height=${height},left=${left},top=${top},modal=yes`
    );
  }
  return popup || {};
};

export const dateHandler = ({ timestamp = "" }) => {
  const date = new Date(timestamp * 1000);
  const modifiedTime = date.toLocaleString("en-US");
  return modifiedTime?.split(",");
};

export const openNotification = ({
  placement = "top",
  message = "",
  description = "",
  type = "success",
  api,
}) => {
  api.info({
    message: message,
    description: description,
    placement,
    icon:
      type === "success" ? (
        <ImageWithBasePath src="successIcon" height={20} width={20} />
      ) : (
        <ImageWithBasePath src="errorIcon" height={20} width={20} />
      ),
  });
};
