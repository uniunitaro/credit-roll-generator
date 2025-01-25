'use client'

import type Konva from 'konva'
import { ImageIcon } from 'lucide-react'
import type { FC } from 'react'
import { useRef } from 'react'
import { container, grid, hstack } from 'styled-system/patterns'
import CreditRollGenerator from '~/components/CreditRollGenerator'
import type { NameCanvasRef } from '~/components/NameCanvas'
import { Button } from '~/components/ui/button'
import { css } from '../../styled-system/css'

const Home: FC = () => {
  const stageRef = useRef<Konva.Stage>(null)
  const nameCanvasRef = useRef<NameCanvasRef>(null)

  // TODO: ダウンロードはあとで考え直す、scaleで1920にするより1920で描画しなおしてscale: 1でだすほうがよさそう？
  const handleDownload = () => {
    nameCanvasRef.current?.exportToImage()
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
          <Button onClick={handleDownload}>
            <ImageIcon className={css({ width: '16px', height: '16px' })} />
            画像出力
          </Button>
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
