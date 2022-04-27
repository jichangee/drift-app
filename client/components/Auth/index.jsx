import React from 'react'
import { Form, Input, Button, message } from 'antd'
import request from '@/utils/request'
import Cookies from 'js-cookie'
import styles from './index.module.css'
import { useRouter } from 'next/router'
import useSignedIn from '@/lib/hooks/use-signed-in'
export default function Index({ page }) {
  const { signin } = useSignedIn()
  const router = useRouter()
  const isSignup = page === 'signup'

  const handleSubmit = (values) => {
    request.post(`/auth/${page}`, {
      ...values
    }).then(res => {
      signin(res.token)
      message.success(isSignup ? '注册成功' : '登录成功')
      router.push('/new')
    })
  }
  return (
    <div className={styles.content}>
      <Form className={styles.formGroup} onFinish={handleSubmit}>
        <Form.Item name="username">
          <Input className={styles.input} placeholder="账号" />
        </Form.Item>
        <Form.Item name="password">
          <Input className={styles.input} placeholder="密码" type="password" />
        </Form.Item>
        <Form.Item>
          <Button className={styles.button} type="primary" htmlType="submit">{isSignup ? '注册' : '登录'}</Button>
        </Form.Item>
      </Form>
    </div>
  )
}
