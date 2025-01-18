'use client'

import dynamic from 'next/dynamic'
import type { FC } from 'react'
import { css } from 'styled-system/css'
import { grid } from 'styled-system/patterns'
import NameEditor from './NameEditor'
import NameTreeView from './NameTreeView'

const NameCanvas = dynamic(() => import('./NameCanvas'), { ssr: false })

const CreditRollGenerator: FC = () => {
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
        })}
      >
        <NameTreeView />
      </div>
      <div className={css({ px: 2 })}>
        <NameEditor />
      </div>
      <NameCanvas />
    </div>
  )
}

export default CreditRollGenerator
