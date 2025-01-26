'use client'

import { useSetAtom } from 'jotai'
import type Konva from 'konva'
import { DownloadIcon, ImageIcon, UploadIcon } from 'lucide-react'
import type { FC } from 'react'
import { useRef } from 'react'
import { container, grid, hstack } from 'styled-system/patterns'
import { loadStateAtom, stateToJsonAtom } from '~/atoms/persistence'
import CreditRollGenerator from '~/components/CreditRollGenerator'
import type { NameCanvasRef } from '~/components/NameCanvas'
import { Button } from '~/components/ui/button'
import { css } from '../../styled-system/css'

const Home: FC = () => {
  const stageRef = useRef<Konva.Stage>(null)
  const nameCanvasRef = useRef<NameCanvasRef>(null)
  const stateToJson = useSetAtom(stateToJsonAtom)
  const loadState = useSetAtom(loadStateAtom)

  const handleDownload = () => {
    nameCanvasRef.current?.exportToImage()
  }

  const handleExport = () => {
    const state = stateToJson()

    // JSONファイルとしてダウンロード
    const blob = new Blob([state], {
      type: 'application/json',
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'credit-roll-project.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleImport = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json'
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (!file) return

      try {
        const text = await file.text()
        const state = JSON.parse(text)
        loadState(state)
      } catch (error) {
        console.error('Failed to import state:', error)
        alert('ファイルの読み込みに失敗しました')
      }
    }
    input.click()
  }

  return (
    <div className={container({ py: '4', h: '100vh' })}>
      <div
        className={grid({
          gridTemplateRows: 'auto minmax(0, 1fr)',
          gap: '4',
          h: 'full',
        })}
      >
        <div className={hstack({ justify: 'space-between' })}>
          <h1 className={css({ fontSize: '2xl', fontWeight: 'bold' })}>
            エンドロールジェネレーター
          </h1>
          <div className={hstack({ gap: '2' })}>
            <Button onClick={handleExport} variant="outline">
              <UploadIcon />
              エクスポート
            </Button>
            <Button onClick={handleImport} variant="outline">
              <DownloadIcon />
              インポート
            </Button>
            <Button onClick={handleDownload}>
              <ImageIcon />
              画像出力
            </Button>
          </div>
        </div>
        <CreditRollGenerator
          stageRef={stageRef}
          nameCanvasRef={nameCanvasRef}
        />
      </div>
    </div>
  )
}

export default Home
