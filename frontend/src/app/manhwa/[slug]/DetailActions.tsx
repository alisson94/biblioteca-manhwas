'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import Modal from '@/components/ui/Modal'
import Toast from '@/components/ui/Toast'
import { LinkForm, ManhwaForm } from '@/components/forms'
import { useToast } from '@/hooks/useToast'
import { CreateLinkPayload, Link, Manhwa, UpdateLinkPayload, UpdateManhwaPayload } from '@/types'
import { linkApi, manhwaApi } from '@/lib/api'
import styles from './DetailActions.module.css'

interface DetailActionsProps {
  manhwa: Manhwa
}

function clampChapter(value: number, capTotal: number) {
  if (!Number.isFinite(value)) {
    return 1
  }

  return Math.min(Math.max(1, value), Math.max(1, capTotal))
}

export default function DetailActions({ manhwa }: DetailActionsProps) {
  const router = useRouter()
  const { toasts, success, error } = useToast()
  const [isManhwaModalOpen, setIsManhwaModalOpen] = useState(false)
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false)
  const [editingLink, setEditingLink] = useState<Link | undefined>()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [deletingLinkId, setDeletingLinkId] = useState<string | null>(null)
  const [isDeletingManhwa, setIsDeletingManhwa] = useState(false)
  const [chapterDrafts, setChapterDrafts] = useState<Record<string, number>>(() =>
    Object.fromEntries(manhwa.links.map((link) => [link._id, link.cap_atual]))
  )
  const [chapterSavingId, setChapterSavingId] = useState<string | null>(null)

  const linkCountLabel = useMemo(() => {
    return manhwa.links.length === 1 ? '1 link cadastrado' : `${manhwa.links.length} links cadastrados`
  }, [manhwa.links.length])

  useEffect(() => {
    setChapterDrafts(Object.fromEntries(manhwa.links.map((link) => [link._id, link.cap_atual])))
  }, [manhwa.links])

  const closeLinkModal = (force = false) => {
    if (isSubmitting && !force) {
      return
    }

    setIsLinkModalOpen(false)
    setEditingLink(undefined)
  }

  const refreshPage = () => {
    router.refresh()
  }

  const handleUpdateManhwa = async (payload: UpdateManhwaPayload) => {
    setIsSubmitting(true)

    try {
      await manhwaApi.update(manhwa.slug, payload)
      success('Manhwa atualizado com sucesso!')
      setIsManhwaModalOpen(false)
      refreshPage()
    } catch (err: any) {
      console.error(err)
      error(err?.message || 'Erro ao atualizar manhwa')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteManhwa = async () => {
    const confirmed = window.confirm(`Excluir "${manhwa.titulos[0] || manhwa.slug}"? Esta acao nao pode ser desfeita.`)

    if (!confirmed) {
      return
    }

    setIsDeletingManhwa(true)

    try {
      await manhwaApi.delete(manhwa.slug)
      success('Manhwa removido com sucesso!')
      router.push('/')
      router.refresh()
    } catch (err: any) {
      console.error(err)
      error(err?.message || 'Erro ao remover manhwa')
      setIsDeletingManhwa(false)
    }
  }

  const handleAddLink = () => {
    setEditingLink(undefined)
    setIsLinkModalOpen(true)
  }

  const handleEditLink = (link: Link) => {
    setEditingLink(link)
    setIsLinkModalOpen(true)
  }

  const handleSubmitLink = async (payload: CreateLinkPayload | UpdateLinkPayload) => {
    setIsSubmitting(true)

    try {
      if (editingLink) {
        await linkApi.update(manhwa.slug, editingLink._id, payload as UpdateLinkPayload)
        success('Link atualizado com sucesso!')
      } else {
        await linkApi.add(manhwa.slug, payload as CreateLinkPayload)
        success('Link adicionado com sucesso!')
      }

      closeLinkModal(true)
      refreshPage()
    } catch (err: any) {
      console.error(err)
      error(err?.message || 'Erro ao salvar link')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteLink = async (link: Link) => {
    const confirmed = window.confirm(`Remover o link ${link.idioma}?`)

    if (!confirmed) {
      return
    }

    setDeletingLinkId(link._id)

    try {
      await linkApi.delete(manhwa.slug, link._id)
      success('Link removido com sucesso!')
      refreshPage()
    } catch (err: any) {
      console.error(err)
      error(err?.message || 'Erro ao remover link')
    } finally {
      setDeletingLinkId(null)
    }
  }

  const updateChapterDraft = (link: Link, value: number) => {
    setChapterDrafts((current) => ({
      ...current,
      [link._id]: clampChapter(value, link.cap_total),
    }))
  }

  const saveChapter = async (link: Link, value: number) => {
    const nextValue = clampChapter(value, link.cap_total)
    setChapterSavingId(link._id)
    updateChapterDraft(link, nextValue)

    try {
      await linkApi.updateChapter(manhwa.slug, link._id, { cap_atual: nextValue })
      success('Capitulo atualizado!')
      refreshPage()
    } catch (err: any) {
      console.error(err)
      error(err?.message || 'Erro ao atualizar capitulo')
    } finally {
      setChapterSavingId(null)
    }
  }

  return (
    <div className={styles.root}>
      <div className={styles.heroActions}>
        <button className="btn-secondary" onClick={() => setIsManhwaModalOpen(true)} disabled={isDeletingManhwa}>
          Editar manhwa
        </button>
        <button className={styles.dangerButton} onClick={handleDeleteManhwa} disabled={isDeletingManhwa}>
          {isDeletingManhwa ? 'Removendo...' : 'Excluir manhwa'}
        </button>
      </div>

      <div className={styles.panelActions}>
        <span style={{ color: 'var(--cor-texto-secundario)' }}>{linkCountLabel}</span>
        <button className="btn-secondary" onClick={handleAddLink}>
          Adicionar link
        </button>
      </div>

      {manhwa.links.length === 0 ? (
        <div className={styles.emptyState}>
          <p>Este manhwa ainda nao tem links cadastrados.</p>
        </div>
      ) : (
        <div className={styles.linksList}>
          {manhwa.links.map((link) => {
            const draftValue = chapterDrafts[link._id] ?? link.cap_atual
            const progress = Math.min(100, Math.max(0, (link.cap_atual / Math.max(1, link.cap_total)) * 100))
            const isSavingChapter = chapterSavingId === link._id
            const isDeletingLink = deletingLinkId === link._id

            return (
              <article key={link._id} className={styles.linkCard}>
                <div className={styles.linkHeader}>
                  <div>
                    <strong>{link.idioma}</strong>
                    <span style={{ display: 'block', color: 'var(--cor-texto-secundario)' }}>
                      Capitulo {link.cap_atual} de {link.cap_total}
                    </span>
                  </div>

                  <div className={styles.linkActions}>
                    <button className={styles.smallButton} onClick={() => handleEditLink(link)} disabled={isDeletingLink}>
                      Editar
                    </button>
                    <button className={styles.dangerButton} onClick={() => handleDeleteLink(link)} disabled={isDeletingLink}>
                      {isDeletingLink ? 'Removendo...' : 'Excluir'}
                    </button>
                  </div>
                </div>

                <a href={link.url} target="_blank" rel="noreferrer" className={styles.linkUrl}>
                  {link.url}
                </a>

                <div className={styles.progressBar} aria-label={`Progresso ${link.cap_atual} de ${link.cap_total}`}>
                  <span style={{ width: `${progress}%` }} />
                </div>

                <div className={styles.chapterControls}>
                  <button
                    className={styles.smallButton}
                    onClick={() => saveChapter(link, draftValue - 1)}
                    disabled={isSavingChapter || draftValue <= 1}
                  >
                    -
                  </button>
                  <input
                    className={styles.chapterInput}
                    type="number"
                    min="1"
                    max={link.cap_total}
                    value={draftValue}
                    onChange={(event) => updateChapterDraft(link, Number(event.target.value))}
                    disabled={isSavingChapter}
                    aria-label="Capitulo atual"
                  />
                  <button
                    className={styles.smallButton}
                    onClick={() => saveChapter(link, draftValue + 1)}
                    disabled={isSavingChapter || draftValue >= link.cap_total}
                  >
                    +
                  </button>
                  <button
                    className="btn-secondary"
                    onClick={() => saveChapter(link, draftValue)}
                    disabled={isSavingChapter || draftValue === link.cap_atual}
                  >
                    {isSavingChapter ? 'Salvando...' : 'Salvar capitulo'}
                  </button>
                </div>
              </article>
            )
          })}
        </div>
      )}

      <Modal
        isOpen={isManhwaModalOpen}
        title="Editar Manhwa"
        onClose={() => setIsManhwaModalOpen(false)}
        showFooter={false}
      >
        <ManhwaForm
          initialManhwa={manhwa}
          submitLabel="Salvar alteracoes"
          isSubmitting={isSubmitting}
          onCancel={() => setIsManhwaModalOpen(false)}
          onSubmit={(payload) => handleUpdateManhwa(payload as UpdateManhwaPayload)}
        />
      </Modal>

      <Modal
        isOpen={isLinkModalOpen}
        title={editingLink ? 'Editar Link' : 'Adicionar Link'}
        onClose={closeLinkModal}
        showFooter={false}
      >
        <LinkForm
          key={editingLink?._id || 'new-link'}
          initialLink={editingLink}
          submitLabel={editingLink ? 'Salvar link' : 'Adicionar link'}
          isSubmitting={isSubmitting}
          onCancel={closeLinkModal}
          onSubmit={handleSubmitLink}
        />
      </Modal>

      <Toast toasts={toasts} />
    </div>
  )
}
