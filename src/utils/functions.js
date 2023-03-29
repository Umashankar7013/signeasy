export const popupHandler = async ({ url }) => {
  let popup;
  if (window) {
    const width = 1000;
    const height = 700;
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
