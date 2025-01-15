'use client'

import { type FC, useState } from 'react'
import { stack } from 'styled-system/patterns'
import type { Name } from '~/types/name'
import NameInputForm from '../components/NameInputForm'
import NameList from '../components/NameList'

const CreditRollGenerator: FC = () => {
  const [names, setNames] = useState<Name[]>([])

  const handleNameAdd = (name: Name) => {
    setNames([...names, name])
  }
  return (
    <div className={stack({ gap: '4', align: 'start' })}>
      <NameInputForm onNameAdd={handleNameAdd} />
      <NameList names={names} />
    </div>
  )
}

export default CreditRollGenerator
