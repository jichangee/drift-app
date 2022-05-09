import React, { useRef, useState } from "react";
import { Form, Input, Tabs, Dropdown, Menu, message, Modal } from "antd";
import request from "@/utils/request";
import { useRouter } from 'next/router'
import Preview from "@/components/Preview";
import TextareaMarkdown from "textarea-markdown-editor";
import styles from "./index.module.css";
export default function Index() {
  const [form] = Form.useForm();
  const router = useRouter()
  const [passwordForm] = Form.useForm();
  const codeEditorRef = useRef();
  const [isShowModal, setIsShowModal] = useState(false);
  const [value, setValue] = useState("");
  const onMenuClick = () => {};

  const handleProtectedClick = () => {
    setIsShowModal(true);
  };
  const handlePasswordSubmit = () => {
    const values = passwordForm.getFieldsValue(true);
    if (!values.password) {
      message.error("请输入密码");
      return;
    }
    if (values.password !== values.password2) {
      message.error("两次密码输入不一致");
      return;
    }
    handleSubmit("protected", values.password);
  };

  const handleSubmit = (visibility, password) => {
    const values = form.getFieldsValue(true);
    request
      .post("/posts/create", {
        ...values,
        visibility,
        password,
      })
      .then(() => {
        message.success("创建成功");
        router.replace('/mine')
      });
  };

  const menu = (
    <Menu onClick={onMenuClick}>
      <Menu.Item key="private" onClick={() => handleSubmit("private")}>
        创建（私有）
      </Menu.Item>
      <Menu.Item key="protected" onClick={handleProtectedClick}>
        创建（密码）
      </Menu.Item>
    </Menu>
  );
  return (
    <div className={styles.main}>
      <Form className={styles.formGroup} layout="vertical" form={form}>
        <Form.Item label="标题" name="title" className={styles.formItem}>
          <Input />
        </Form.Item>
        <Form.Item label="描述" name="description" className={styles.formItem}>
          <Input />
        </Form.Item>
        <Form.Item className={styles.formItem}>
          <Tabs>
            <Tabs.TabPane tab="正文" key="edit">
              <TextareaMarkdown.Wrapper ref={codeEditorRef}>
                <Form.Item noStyle name="content">
                  <Input.TextArea
                    autoSize={{ minRows: 3, maxRows: 15 }}
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    ref={codeEditorRef}
                  />
                </Form.Item>
              </TextareaMarkdown.Wrapper>
            </Tabs.TabPane>
            <Tabs.TabPane tab="预览" key="preview">
              <Preview content={value} />
            </Tabs.TabPane>
          </Tabs>
        </Form.Item>
        <Form.Item className={styles.formItem}>
          <div style={{ textAlign: "right" }}>
            <Dropdown.Button
              overlay={menu}
              type="primary"
              onClick={() => handleSubmit("public")}
            >
              创建（公开）
            </Dropdown.Button>
          </div>
        </Form.Item>
      </Form>
      <Modal
        title="请输入密码"
        visible={isShowModal}
        onOk={handlePasswordSubmit}
        onCancel={() => setIsShowModal(false)}
        cancelText="取消"
        okText="确认"
      >
        <Form form={passwordForm}>
          <Form.Item name="password">
            <Input placeholder="请输入密码" type="password" />
          </Form.Item>
          <Form.Item name="password2">
            <Input placeholder="请再次输入密码" type="password" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
