import "../../styles/globals.css";
import { Layout } from "../components/Layout";
import { ErrorPage } from "../components/ErrorPage";
import { useEffect, useState } from "react";
import { Loader } from "../components/Loader";

function MyApp({ Component, pageProps }) {
  const [loading, setLoading] = useState(true);
  const [cookieEnabled, setCookieEnabled] = useState(true);

  useEffect(() => {
    setCookieEnabled(navigator.cookieEnabled);
    setLoading(false);
  }, []);

  return loading ? (
    <Loader />
  ) : cookieEnabled ? (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  ) : (
    <ErrorPage />
  );
}

export default MyApp;
