'use client'

import { useState, useEffect } from 'react'
import Grid from '@/components/ui/Grid'
import Card from '@/components/ui/Card'
import Modal from '@/components/ui/Modal'
import Toast from '@/components/ui/Toast'
import { useToast } from '@/hooks/useToast'
import { Manhwa } from '@/types'

export default function Home() {
  const [manhwas, setManhwas] = useState<Manhwa[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const { toasts, info } = useToast()

  useEffect(() => {
    // Placeholder - will be replaced with actual API call in Phase 3
    setIsLoading(false)
    info('Frontend pronto! Phase 2 completa - Componentes visuais implementados')
  }, [info])

  const handleAddManhwa = () => {
    setIsAddModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsAddModalOpen(false)
  }

  return (
    <main>
      <div className="container">
        <div
          style={{
            marginBottom: '2rem',
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
            <h3 style={{ marginBottom: '1rem' }}>Nenhum manhwa adicionado</h3>
            <p style={{ marginBottom: '1.5rem', color: 'var(--cor-texto-secundario)' }}>
              Comece adicionando seus manhwas favoritos à sua biblioteca
            </p>
            <button className="btn-primary" onClick={handleAddManhwa}>
              + Adicionar Primeiro Manhwa
            </button>
          </div>
        ) : (
          <Grid>
            {manhwas.map((manhwa) => (
              <Card
                key={manhwa._id}
                manhwa={manhwa}
                onClick={() => {
                  // Will navigate to detail page in Phase 5
                }}
              />
            ))}
          </Grid>
        )}
      </div>

      <Modal
        isOpen={isAddModalOpen}
        title="Adicionar Novo Manhwa"
        onClose={handleCloseModal}
        showFooter={false}
      >
        <p style={{ color: 'var(--cor-texto-secundario)' }}>
          Formulário será implementado na Phase 6
        </p>
      </Modal>

      <Toast toasts={toasts} />
    </main>
  )
}
