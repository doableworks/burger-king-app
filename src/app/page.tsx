'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation';
import FlowManager from '@/app/components/FlowManager';
import styles from "../styles/pages/home.module.scss";



export default function Home() {

  return (
    <div className={styles.homePage}>
      <FlowManager ></FlowManager>
    </div>
  )
}
