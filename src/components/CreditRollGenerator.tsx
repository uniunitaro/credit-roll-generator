'use client'

import { useSetAtom } from 'jotai'
import type Konva from 'konva'
import dynamic from 'next/dynamic'
import { type FC, type RefObject, useEffect } from 'react'
import { css } from 'styled-system/css'
import { grid } from 'styled-system/patterns'
import { loadStateAtom, saveStateAtom } from '~/atoms/persistence'
import NameEditor from './NameEditor'
import NameTreeView from './NameTreeView'

const NameCanvas = dynamic(() => import('./NameCanvas'), { ssr: false })

const CreditRollGenerator: FC<{ stageRef: RefObject<Konva.Stage | null> }> = ({
  stageRef,
}) => {
  const loadState = useSetAtom(loadStateAtom)
  const saveState = useSetAtom(saveStateAtom)

  // 初回マウント時に状態を復元
  useEffect(() => {
    loadState()
  }, [loadState])

  // 状態変更を監視して保存
  useEffect(() => {
    // FIXME: 本当は更新を監視したいが今は2秒ごとに保存
    const saveInterval = setInterval(saveState, 2000)
    return () => clearInterval(saveInterval)
  }, [saveState])

  return (
    <div
      className={grid({
        gridTemplateColumns: '300px 300px minmax(0, 1fr)',
        gap: '0',
      })}
    >
      <div
        className={css({
          borderRightWidth: 1,
          borderColor: 'border.default',
          px: 2,
          overflowY: 'auto',
        })}
      >
        <NameTreeView />
      </div>
      <div className={css({ px: 2, overflowY: 'auto' })}>
        <NameEditor />
      </div>
      <NameCanvas stageRef={stageRef} />
    </div>
  )
}

export default CreditRollGenerator
