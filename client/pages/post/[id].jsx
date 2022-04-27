import React, { useMemo } from "react";
import { marked } from "marked";
import request from "@/utils/request";
import { DRIFT_TOKEN } from "@/lib/hooks/use-signed-in";
import styles from './index.module.css'

export default function Index({ post }) {
  const contentHTML = useMemo(() => {
    return marked.parse(post.content);
  }, [post]);
  return (
    <div>
      <div className={styles.titleCon}>
        <h1 className={styles.title}>{post.title}</h1>
        <p className={styles.desc}>{post.description}</p>
      </div>
      <div
        className={styles.content}
        dangerouslySetInnerHTML={{ __html: contentHTML }}
      ></div>
    </div>
  );
}

export const getServerSideProps = async ({ params, req, res }) => {
  try {
    const post = await request.get(`/posts/${params?.id}`, {
      headers: {
        authorization: `Bearer ${req.cookies[DRIFT_TOKEN]}`,
      },
    });
    return {
      props: {
        post,
        key: params?.id,
      },
    };
  } catch (error) {
    return {
      redirect: {
        destination: '/',
				permanent: false
      },
      props: {}
    }
  }
};
