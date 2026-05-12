'use client'

import { ReactNode } from 'react'
import styles from './Modal.module.css'

interface ModalProps {
  isOpen: boolean
  title: string
  children: ReactNode
  onClose: () => void
  onConfirm?: () => void
  confirmText?: string
  cancelText?: string
  showFooter?: boolean
}

export default function Modal({
  isOpen,
  title,
  children,
  onClose,
  onConfirm,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  showFooter = true,
}: ModalProps) {
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Escape') {
      onClose()
    }
  }

  return (
    <div
      className={`${styles.overlay} ${isOpen ? styles.active : ''}`}
      onClick={handleOverlayClick}
      onKeyDown={handleKeyDown}
    >
      <div className={styles.content}>
        <div className={styles.header}>
          <h2>{title}</h2>
          <button className={styles.closeButton} onClick={onClose}>
            ✕
          </button>
        </div>

        <div className={styles.body}>{children}</div>

        {showFooter && (
          <div className={styles.footer}>
            <button className="btn-secondary" onClick={onClose}>
              {cancelText}
            </button>
            {onConfirm && (
              <button className="btn-primary" onClick={onConfirm}>
                {confirmText}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
