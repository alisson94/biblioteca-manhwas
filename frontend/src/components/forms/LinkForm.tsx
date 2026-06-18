'use client'

import { FormEvent, useState } from 'react'
import { CreateLinkPayload, Link, UpdateLinkPayload } from '@/types'
import styles from './LinkForm.module.css'

type LinkFormPayload = CreateLinkPayload | UpdateLinkPayload

interface LinkFormProps {
  initialLink?: Link
  submitLabel: string
  isSubmitting?: boolean
  onCancel?: () => void
  onSubmit: (payload: LinkFormPayload) => Promise<void> | void
}

const LANGUAGE_OPTIONS = ['PT', 'EN', 'ES', 'CH']

function isValidUrl(value: string) {
  try {
    new URL(value)
    return true
  } catch {
    return false
  }
}

export default function LinkForm({
  initialLink,
  submitLabel,
  isSubmitting = false,
  onCancel,
  onSubmit,
}: LinkFormProps) {
  const [idioma, setIdioma] = useState(initialLink?.idioma || LANGUAGE_OPTIONS[0])
  const [url, setUrl] = useState(initialLink?.url || '')
  const [capTotal, setCapTotal] = useState(String(initialLink?.cap_total || ''))
  const [errors, setErrors] = useState<string[]>([])

  const languageOptions = idioma && !LANGUAGE_OPTIONS.includes(idioma)
    ? [idioma, ...LANGUAGE_OPTIONS]
    : LANGUAGE_OPTIONS

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const parsedCapTotal = Number(capTotal)
    const nextErrors: string[] = []

    if (!idioma.trim()) {
      nextErrors.push('Informe o idioma.')
    }

    if (!url.trim() || !isValidUrl(url.trim())) {
      nextErrors.push('Informe uma URL valida.')
    }

    if (!Number.isFinite(parsedCapTotal) || parsedCapTotal < 1) {
      nextErrors.push('Caps. totais deve ser maior ou igual a 1.')
    }

    setErrors(nextErrors)

    if (nextErrors.length) {
      return
    }

    const basePayload = {
      idioma: idioma.trim(),
      url: url.trim(),
      cap_total: parsedCapTotal,
    }

    await onSubmit(initialLink ? basePayload : { ...basePayload, cap_atual: 1 })
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="idioma">Idioma</label>
          <select
            id="idioma"
            value={idioma}
            onChange={(event) => setIdioma(event.target.value)}
            disabled={isSubmitting}
          >
            {languageOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="cap_total">Caps. totais</label>
          <input
            id="cap_total"
            type="number"
            min="1"
            value={capTotal}
            onChange={(event) => setCapTotal(event.target.value)}
            disabled={isSubmitting}
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="url">URL do link</label>
        <input
          id="url"
          type="url"
          placeholder="https://..."
          value={url}
          onChange={(event) => setUrl(event.target.value)}
          disabled={isSubmitting}
        />
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
