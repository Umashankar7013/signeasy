import "../../styles/globals.css";
import { Layout } from "../components/Layout";
import { ErrorPage } from "../components/ErrorPage";

function MyApp({ Component, pageProps }) {
  return typeof navigator !== "undefined" && navigator.cookieEnabled ? (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  ) : (
    <ErrorPage />
  );
}

export default MyApp;
