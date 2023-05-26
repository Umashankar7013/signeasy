import { useEffect, useState } from "react";
import "../../styles/globals.css";
import { Layout } from "../components/Layout";
import { ErrorPage } from "../components/ErrorPage";

function MyApp({ Component, pageProps }) {
  // const [cookieEnabled, setCookieEnabled] = useState(true);

  // useEffect(() => {
  //   setCookieEnabled(navigator.cookieEnabled);
  // }, []);

  return navigator.cookieEnabled ? (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  ) : (
    <ErrorPage />
  );
}

export default MyApp;
