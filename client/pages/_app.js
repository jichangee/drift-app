import "antd/dist/antd.css";
import "@/styles/vars.css";
import "@/styles/global.css";
import App from "@/components/App";

export default function MyApp({ Component, pageProps }) {
  return <App Component={Component} pageProps={pageProps} />;
}
