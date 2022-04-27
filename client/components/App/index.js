import React from "react";
import styles from "./index.module.css";
import Header from "../Header";

export default function Index({ Component, pageProps }) {
  return (
    <div>
      <Header />
      <div className={[styles.content, ' max-main']}>
        <Component {...pageProps} />
      </div>
    </div>
  );
}
