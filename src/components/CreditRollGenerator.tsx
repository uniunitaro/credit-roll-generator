'use client'

import dynamic from 'next/dynamic'
import { type FC, useState } from 'react'
import { grid } from 'styled-system/patterns'
import type { Name } from '~/types/name'
import NameInputForm from '../components/NameInputForm'

const NameCanvas = dynamic(() => import('./NameCanvas'), { ssr: false })

const CreditRollGenerator: FC = () => {
  const [names, setNames] = useState<Name[]>([])

  const handleNameAdd = (name: Name) => {
    setNames([...names, name])
  }
  return (
    <div
      className={grid({
        gridTemplateColumns: '400px minmax(0, 1fr)',
        gap: '6',
      })}
    >
      <NameInputForm onNameAdd={handleNameAdd} />
      <NameCanvas names={names} />
    </div>
  )
}

export default CreditRollGenerator
