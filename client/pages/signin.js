import React from 'react'
import styles from '@/components/Auth/index.module.css'
import Auth from '@/components/Auth/index.jsx'
export default function Signin() {
  return (
    <div className={styles.main}>
      <h1 className='text-center'>登录</h1>
      <Auth page="signin" />
    </div>
  )
}
