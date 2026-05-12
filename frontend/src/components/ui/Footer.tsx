'use client'

import styles from './Footer.module.css'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className={styles.footer}>
      <div className={styles['footer-content']}>
        <p>&copy; {currentYear} Biblioteca de Manhwas. Todos os direitos reservados.</p>
        <div className={styles['footer-links']}>
          <a href="#">Sobre</a>
          <a href="#">Contato</a>
          <a href="#">Privacidade</a>
        </div>
      </div>
    </footer>
  )
}
