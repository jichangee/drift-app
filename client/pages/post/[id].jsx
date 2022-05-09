import React, { useMemo, useState } from "react";
import { marked } from "marked";
import request from "@/utils/request";
import { DRIFT_TOKEN } from "@/lib/hooks/use-signed-in";
import PasswordModal from "@/components/Post/PasswordModal";
import styles from "./index.module.css";

export default function Index({ initialPost, postId }) {
  const [post, setPost] = useState(initialPost);
  const contentHTML = useMemo(() => {
    return post.content ? marked.parse(post.content) : "";
  }, [post]);
  const isShowAuthModal = useMemo(
    () => post.visibility === "protected" && !post.content && !post.title,
    [post]
  );
  return (
    <div className="max-main">
      <div className={styles.titleCon}>
        <h1 className={styles.title}>{post.title}</h1>
        <p className={styles.desc}>{post.description}</p>
      </div>
      {contentHTML && (
        <div
          className={styles.content}
          dangerouslySetInnerHTML={{ __html: contentHTML }}
        ></div>
      )}
      {isShowAuthModal && <PasswordModal setPost={setPost} id={postId} />}
    </div>
  );
}

export const getServerSideProps = async ({ params, req, res }) => {
  try {
    const token = req.cookies[DRIFT_TOKEN];
    const post = await request.get(`/posts/${params?.id}`, {
      headers: {
        authorization: `Bearer ${token}`,
      },
    });
    return {
      props: {
        initialPost: post,
        postId: params?.id,
      },
    };
  } catch (error) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
      props: {},
    };
  }
};
