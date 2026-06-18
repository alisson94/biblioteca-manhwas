'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Grid from '@/components/ui/Grid'
import Card from '@/components/ui/Card'
import Modal from '@/components/ui/Modal'
import Toast from '@/components/ui/Toast'
import { ManhwaForm } from '@/components/forms'
import { useToast } from '@/hooks/useToast'
import { CreateManhwaPayload, Manhwa } from '@/types'
import { manhwaApi } from '@/lib/api'

export default function Home() {
  const router = useRouter()
  const [manhwas, setManhwas] = useState<Manhwa[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const { toasts, success, error } = useToast()

  // pagination & search
  const [page, setPage] = useState(1)
  const [limit] = useState(12)
  const [totalPages, setTotalPages] = useState(1)
  const [search, setSearch] = useState('')
  const searchRef = useRef<number | null>(null)

  const fetchList = async (p = 1, q = '') => {
    setIsLoading(true)
    try {
      const res = await manhwaApi.list({ page: p, limit, search: q })
      if (res && res.success) {
        setManhwas(res.data)
        setTotalPages(res.meta?.totalPages || 1)
      } else {
        setManhwas([])
        error('Falha ao carregar manhwas')
      }
    } catch (err: any) {
      console.error(err)
      setManhwas([])
      error(err?.message || 'Erro desconhecido ao buscar manhwas')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchList(page, search)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page])

  // debounced search
  useEffect(() => {
    if (searchRef.current) window.clearTimeout(searchRef.current)
    searchRef.current = window.setTimeout(() => {
      setPage(1)
      fetchList(1, search)
    }, 450)
    return () => {
      if (searchRef.current) window.clearTimeout(searchRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search])

  const handleAddManhwa = () => setIsAddModalOpen(true)
  const handleCloseModal = () => setIsAddModalOpen(false)

  const handleCreateManhwa = async (payload: CreateManhwaPayload) => {
    setIsCreating(true)

    try {
      await manhwaApi.create(payload)
      success('Manhwa adicionado com sucesso!')
      setIsAddModalOpen(false)
      setSearch('')
      setPage(1)
      await fetchList(1, '')
    } catch (err: any) {
      console.error(err)
      error(err?.message || 'Erro ao adicionar manhwa')
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <main>
      <div className="container">
        <div
          style={{
            marginBottom: '1.5rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '1rem',
            flexWrap: 'wrap',
          }}
        >
          <div>
            <h2>Meus Manhwas</h2>
            <p style={{ color: 'var(--cor-texto-secundario)' }}>
              {manhwas.length} manhwas na biblioteca
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <input
              placeholder="Buscar por título..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                padding: '0.5rem 0.75rem',
                borderRadius: '6px',
                border: '1px solid #333',
                background: 'transparent',
                color: 'var(--cor-texto)',
              }}
            />

            <button className="btn-primary" onClick={handleAddManhwa}>
              + Adicionar
            </button>
          </div>
        </div>

        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '4rem 0' }}>
            <p>Carregando...</p>
          </div>
        ) : manhwas.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              padding: '4rem 2rem',
              backgroundColor: 'var(--cor-card)',
              borderRadius: '8px',
            }}
          >
            <h3 style={{ marginBottom: '1rem' }}>Nenhum manhwa encontrado</h3>
            <p style={{ marginBottom: '1.5rem', color: 'var(--cor-texto-secundario)' }}>
              Tente outra busca ou adicione um novo manhwa
            </p>
            <button className="btn-primary" onClick={handleAddManhwa}>
              + Adicionar Primeiro Manhwa
            </button>
          </div>
        ) : (
          <>
            <Grid>
              {manhwas.map((manhwa) => (
                <Card
                  key={manhwa._id}
                  manhwa={manhwa}
                  onClick={() => {
                    router.push(`/manhwa/${manhwa.slug}`)
                  }}
                />
              ))}
            </Grid>

            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1.5rem', gap: '0.5rem' }}>
              <button
                className="btn-secondary"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
              >
                Anterior
              </button>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem 1rem' }}>
                <span>Pagina {page} / {totalPages}</span>
              </div>
              <button
                className="btn-secondary"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
              >
                Próxima
              </button>
            </div>
          </>
        )}
      </div>

      <Modal isOpen={isAddModalOpen} title="Adicionar Novo Manhwa" onClose={handleCloseModal} showFooter={false}>
        <ManhwaForm
          submitLabel="Adicionar Manhwa"
          requireCover
          isSubmitting={isCreating}
          onCancel={handleCloseModal}
          onSubmit={(payload) => handleCreateManhwa(payload as CreateManhwaPayload)}
        />
      </Modal>

      <Toast toasts={toasts} />
    </main>
  )
}
