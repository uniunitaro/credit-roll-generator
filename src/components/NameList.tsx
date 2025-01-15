'use client'

import dynamic from 'next/dynamic'
import type { FC } from 'react'
import { css } from '../../styled-system/css'
import type { Name } from '../types/name'

const NameCanvas = dynamic(() => import('./NameCanvas'), { ssr: false })

const NameList: FC<{ names: Name[] }> = ({ names }) => {
  return (
    <div className={css({ display: 'flex', flexDir: 'column', gap: '2' })}>
      <NameCanvas names={names} />
    </div>
  )
}

export default NameList
