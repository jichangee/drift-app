import React, { useRef, useEffect, useState } from "react";
import { Form, Input, Button, Tabs, Dropdown, Menu, message } from "antd";
import request from '@/utils/request'
import Preview from "@/components/Preview";
import TextareaMarkdown from "textarea-markdown-editor";
import styles from "./index.module.css";
export default function Index() {
  const codeEditorRef = useRef();
  const [value, setValue] = useState("");

  const handleSubmit = (values) => {
    console.log('values', values)
    request.post('/posts/create', {
      ...values,
      visibility: 'private'
    }).then(() => {
      message.success('创建成功')
    })
  }
  return (
    <div className={styles.main}>
      <Form className={styles.formGroup} layout="vertical" onFinish={handleSubmit}>
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
            <Button type="primary" htmlType="submit">创建（私人）</Button>
          </div>
        </Form.Item>
      </Form>
    </div>
  );
}
