'use client'

import { useState } from 'react'
import { css } from '../../styled-system/css'
import NameInputForm from '../components/NameInputForm'
import NameList from '../components/NameList'
import type { Name } from '../types/name'

export default function Home() {
  const [names, setNames] = useState<Name[]>([])

  const handleNameAdd = (name: Name) => {
    setNames([...names, name])
  }

  return (
    <div
      className={css({
        display: 'flex',
        flexDir: 'column',
        minH: '100vh',
        p: '4',
      })}
    >
      <h1 className={css({ fontSize: '2xl', fontWeight: 'bold', mb: '4' })}>
        人名字取りアプリ
      </h1>

      <div className={css({ maxW: 'md', w: 'full' })}>
        <NameInputForm onNameAdd={handleNameAdd} />
        <NameList names={names} />
      </div>
    </div>
  )
}
