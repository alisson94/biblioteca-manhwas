import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Biblioteca de Manhwas',
  description: 'Sua biblioteca pessoal de manhwas favoritos',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body>
        {children}
      </body>
    </html>
  )
}
