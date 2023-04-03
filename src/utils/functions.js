export const popupHandler = async ({ url }) => {
  let popup;
  if (window) {
    const width = window.outerWidth - 350;
    const height = window.outerHeight - 150;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2.5;
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
  const date = new Date(timestamp);
  const modifiedTime = date.toLocaleString("en-US");
  return modifiedTime?.split(",");
};
