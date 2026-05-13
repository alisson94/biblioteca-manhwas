import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { manhwaApi } from '@/lib/api'
import styles from './page.module.css'

type DetailPageProps = {
  params: {
    slug: string
  }
}

const statusLabels: Record<string, string> = {
  ativo: 'Lendo',
  concluído: 'Concluído',
  pausado: 'Pausado',
  dropped: 'Dropped',
}

export default async function ManhwaDetailPage({ params }: DetailPageProps) {
  const response = await manhwaApi.getBySlug(params.slug).catch(() => null)

  if (!response || !response.success || !response.data) {
    notFound()
  }

  const manhwa = response.data
  const mainTitle = manhwa.titulos[0] || 'Sem título'
  const secondaryTitles = manhwa.titulos.slice(1)
  const statusLabel = statusLabels[manhwa.status] || manhwa.status

  return (
    <main className={styles.page}>
      <div className="container">
        <div className={styles.topbar}>
          <Link href="/" className={styles.backLink}>
            ← Voltar para a lista
          </Link>
        </div>

        <section className={styles.hero}>
          <div className={styles.coverWrap}>
            <Image
              src={manhwa.capa || '/placeholder.jpg'}
              alt={mainTitle}
              fill
              className={styles.cover}
              priority
            />
          </div>

          <div className={styles.content}>
            <div className={styles.titleRow}>
              <div>
                <p className={styles.kicker}>Detalhes do manhwa</p>
                <h1 className={styles.title}>{mainTitle}</h1>
              </div>

              <span className={styles.status}>{statusLabel}</span>
            </div>

            {secondaryTitles.length > 0 && (
              <div className={styles.secondaryTitles}>
                {secondaryTitles.map((title) => (
                  <span key={title} className={styles.secondaryTitle}>
                    {title}
                  </span>
                ))}
              </div>
            )}

            <div className={styles.metaGrid}>
              <article className={styles.metaCard}>
                <span className={styles.metaLabel}>Capítulos</span>
                <strong className={styles.metaValue}>{manhwa.capitulos}</strong>
              </article>

              <article className={styles.metaCard}>
                <span className={styles.metaLabel}>Links</span>
                <strong className={styles.metaValue}>{manhwa.links.length}</strong>
              </article>

              <article className={styles.metaCard}>
                <span className={styles.metaLabel}>Slug</span>
                <strong className={styles.metaValue}>{manhwa.slug}</strong>
              </article>
            </div>

            {manhwa.tags.length > 0 && (
              <div className={styles.tags}>
                {manhwa.tags.map((tag) => (
                  <span key={tag} className={styles.tag}>
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </section>

        <section className={styles.panel}>
          <div className={styles.panelHeader}>
            <div>
              <p className={styles.kicker}>Fontes</p>
              <h2 className={styles.panelTitle}>Links cadastrados</h2>
            </div>
          </div>

          {manhwa.links.length === 0 ? (
            <div className={styles.emptyState}>
              <p>Este manhwa ainda não tem links cadastrados.</p>
            </div>
          ) : (
            <div className={styles.linksList}>
              {manhwa.links.map((link) => (
                <article key={link._id} className={styles.linkCard}>
                  <div className={styles.linkHeader}>
                    <strong>{link.idioma}</strong>
                    <span>
                      Capítulo {link.cap_atual} de {link.cap_total}
                    </span>
                  </div>

                  <a href={link.url} target="_blank" rel="noreferrer" className={styles.linkUrl}>
                    {link.url}
                  </a>

                  <div className={styles.progressBar} aria-label={`Progresso ${link.cap_atual} de ${link.cap_total}`}>
                    <span
                      style={{
                        width: `${Math.min(100, Math.max(0, (link.cap_atual / Math.max(1, link.cap_total)) * 100))}%`,
                      }}
                    />
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  )
}
