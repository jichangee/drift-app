import React, { useState } from "react";
import { Modal, Input } from "antd";
import { useRouter } from "next/router";
import request from "@/utils/request";
export default function Index({ setPost, id }) {
  const router = useRouter();
  const [isShowModal, setIsShowModal] = useState(true);
  const [password, setPassword] = useState("");
  const handleSubmit = () => {
    request.get(`/posts/auth/${id}?password=${password}`).then((data) => {
      setIsShowModal(false);
      setPost(data);
    });
  };
  const handleCancel = () => {
    router.replace("/");
  };
  return (
    <Modal
      title="请输入密码"
      visible={isShowModal}
      onOk={handleSubmit}
      onCancel={handleCancel}
      cancelText="取消"
      okText="确认"
    >
      <Input value={password} onChange={(e) => setPassword(e.target.value)} />
    </Modal>
  );
}
