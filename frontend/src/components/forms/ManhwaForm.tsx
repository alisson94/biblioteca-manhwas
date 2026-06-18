'use client'

import { FormEvent, useMemo, useState } from 'react'
import { CreateManhwaPayload, Manhwa, UpdateManhwaPayload } from '@/types'
import styles from './ManhwaForm.module.css'

type ManhwaFormPayload = CreateManhwaPayload | UpdateManhwaPayload

interface ManhwaFormProps {
  initialManhwa?: Manhwa
  submitLabel: string
  isSubmitting?: boolean
  requireCover?: boolean
  onCancel?: () => void
  onSubmit: (payload: ManhwaFormPayload) => Promise<void> | void
}

const BASE_STATUS_OPTIONS = ['Lendo', 'Concluído', 'Planejo Ler']

function splitTags(value: string) {
  return value
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean)
}

export default function ManhwaForm({
  initialManhwa,
  submitLabel,
  isSubmitting = false,
  requireCover = false,
  onCancel,
  onSubmit,
}: ManhwaFormProps) {
  const [titulos, setTitulos] = useState<string[]>(
    initialManhwa?.titulos?.length ? initialManhwa.titulos : ['']
  )
  const [capa, setCapa] = useState<File | undefined>()
  const [status, setStatus] = useState(initialManhwa?.status || BASE_STATUS_OPTIONS[0])
  const [capitulos, setCapitulos] = useState(String(initialManhwa?.capitulos || ''))
  const [tags, setTags] = useState(initialManhwa?.tags?.join(', ') || '')
  const [errors, setErrors] = useState<string[]>([])

  const statusOptions = useMemo(() => {
    if (status && !BASE_STATUS_OPTIONS.includes(status)) {
      return [status, ...BASE_STATUS_OPTIONS]
    }

    return BASE_STATUS_OPTIONS
  }, [status])

  const updateTitulo = (index: number, value: string) => {
    setTitulos((current) => current.map((titulo, itemIndex) => (itemIndex === index ? value : titulo)))
  }

  const removeTitulo = (index: number) => {
    setTitulos((current) => current.filter((_, itemIndex) => itemIndex !== index))
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const cleanTitles = titulos.map((titulo) => titulo.trim()).filter(Boolean)
    const parsedCapitulos = Number(capitulos)
    const nextErrors: string[] = []

    if (!cleanTitles.length) {
      nextErrors.push('Informe pelo menos um titulo.')
    }

    if (requireCover && !capa) {
      nextErrors.push('A capa e obrigatoria para criar um manhwa.')
    }

    if (!Number.isFinite(parsedCapitulos) || parsedCapitulos < 1) {
      nextErrors.push('Capitulos deve ser um numero maior ou igual a 1.')
    }

    if (!status.trim()) {
      nextErrors.push('Informe o status.')
    }

    setErrors(nextErrors)

    if (nextErrors.length) {
      return
    }

    await onSubmit({
      titulos: cleanTitles,
      capa,
      status: status.trim(),
      capitulos: parsedCapitulos,
      tags: splitTags(tags),
    })
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className="form-group">
        <label>Titulos</label>
        <div className={styles.titles}>
          {titulos.map((titulo, index) => (
            <div className={styles.titleRow} key={index}>
              <input
                type="text"
                value={titulo}
                placeholder={index === 0 ? 'Titulo principal' : 'Outro titulo'}
                onChange={(event) => updateTitulo(index, event.target.value)}
                disabled={isSubmitting}
              />
              {titulos.length > 1 && (
                <button
                  type="button"
                  className={styles.removeButton}
                  onClick={() => removeTitulo(index)}
                  disabled={isSubmitting}
                  aria-label="Remover titulo"
                >
                  x
                </button>
              )}
            </div>
          ))}
        </div>
        <button
          type="button"
          className={`btn-secondary ${styles.addTitleButton}`}
          onClick={() => setTitulos((current) => [...current, ''])}
          disabled={isSubmitting}
        >
          Adicionar titulo
        </button>
      </div>

      <div className="form-group">
        <label htmlFor="capa">Imagem da capa</label>
        <input
          id="capa"
          type="file"
          accept="image/png,image/jpeg,image/webp"
          onChange={(event) => setCapa(event.target.files?.[0])}
          disabled={isSubmitting}
        />
        {!requireCover && <p className="form-help">Deixe vazio para manter a capa atual.</p>}
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="capitulos">Total de capitulos</label>
          <input
            id="capitulos"
            type="number"
            min="1"
            value={capitulos}
            onChange={(event) => setCapitulos(event.target.value)}
            disabled={isSubmitting}
          />
        </div>

        <div className="form-group">
          <label htmlFor="status">Status</label>
          <select
            id="status"
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            disabled={isSubmitting}
          >
            {statusOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="tags">Tags</label>
        <input
          id="tags"
          type="text"
          value={tags}
          placeholder="Ex: Acao, Aventura"
          onChange={(event) => setTags(event.target.value)}
          disabled={isSubmitting}
        />
        <p className="form-help">Separe por virgula. Tags sao opcionais.</p>
      </div>

      {errors.map((error) => (
        <p className={styles.error} key={error}>
          {error}
        </p>
      ))}

      <div className={styles.actions}>
        {onCancel && (
          <button type="button" className="btn-secondary" onClick={onCancel} disabled={isSubmitting}>
            Cancelar
          </button>
        )}
        <button type="submit" className="btn-primary" disabled={isSubmitting}>
          {isSubmitting ? 'Salvando...' : submitLabel}
        </button>
      </div>
    </form>
  )
}
