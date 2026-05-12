'use client'

import Image from 'next/image'
import styles from './Card.module.css'
import { Manhwa } from '@/types'

interface CardProps {
  manhwa: Manhwa
  onClick: () => void
}

export default function Card({ manhwa, onClick }: CardProps) {
  const mainTitle = manhwa.titulos[0] || 'Sem título'
  const statusLabel = {
    ativo: 'Lendo',
    concluído: 'Concluído',
    pausado: 'Pausado',
    dropped: 'Dropped',
  }[manhwa.status] || manhwa.status

  const statusClass = {
    ativo: 'statusLendo',
    concluído: 'statusConcluido',
    pausado: 'statusPausado',
    dropped: 'statusDropped',
  }[manhwa.status] || ''

  return (
    <div className={styles.card} onClick={onClick}>
      <div className={styles.cardImage} style={{ position: 'relative' }}>
        <Image
          src={manhwa.capa || '/placeholder.jpg'}
          alt={mainTitle}
          fill
          style={{ objectFit: 'cover' }}
          priority={false}
          onError={(e) => {
            const target = e.target as HTMLImageElement
            target.src = '/placeholder.jpg'
          }}
        />
      </div>

      <div className={styles.cardInfo}>
        <h3 className={styles.cardTitle}>{mainTitle}</h3>
        <p className={styles.cardStatus}>{manhwa.capitulos} capítulos</p>

        <div className={styles.tags}>
          <span className={`${styles.tag} ${styles[statusClass]}`}>
            {statusLabel}
          </span>
          {manhwa.tags.slice(0, 2).map((tag, idx) => (
            <span key={idx} className={styles.tag}>
              {tag}
            </span>
          ))}
          {manhwa.tags.length > 2 && (
            <span className={styles.tag}>+{manhwa.tags.length - 2}</span>
          )}
        </div>
      </div>
    </div>
  )
}
