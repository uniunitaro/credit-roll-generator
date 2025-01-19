import type { Metadata } from 'next'
import type { FC, ReactNode } from 'react'
import './globals.css'

export const metadata: Metadata = {
  title: 'エンドロールジェネレーター',
  description: '美しいレイアウトのエンドロールを作成できるツールです。',
}

const RootLayout: FC<Readonly<{ children: ReactNode }>> = ({ children }) => (
  <html lang="ja" className="dark">
    <body>{children}</body>
  </html>
)

export default RootLayout
