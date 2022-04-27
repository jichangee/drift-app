import { Form, Select, InputNumber, Switch, Slider, Button } from 'antd'
// Custom DatePicker that uses Day.js instead of Moment.js
import Header from '../components/Header'
import styles from './index.module.css'
import homeStyles from '@/styles/home.module.css'
import Link from 'next/link'

export default function Home() {
  return (
    <div className={[styles.content, homeStyles.main]}>
    </div>
  )
}
