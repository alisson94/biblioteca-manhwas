'use client'

import styles from './Header.module.css'

interface HeaderProps {
  onAddClick?: () => void
}

export default function Header({ onAddClick }: HeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles['header-container']}>
        <h1>📚 Biblioteca de Manhwas</h1>
        <nav className={styles['header-nav']}>
          {onAddClick && (
            <button className="btn-primary" onClick={onAddClick}>
              + Adicionar
            </button>
          )}
        </nav>
      </div>
    </header>
  )
}
