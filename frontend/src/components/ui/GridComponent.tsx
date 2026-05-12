'use client'

import { ReactNode } from 'react'
import styles from './Grid.module.css'

interface GridProps {
  children: ReactNode
}

export default function GridComponent({ children }: GridProps) {
  return <div className={styles.grid}>{children}</div>
}
