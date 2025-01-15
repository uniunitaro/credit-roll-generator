'use client'

import { type FC, useState } from 'react'
import { css } from '../../styled-system/css'
import { hstack } from '../../styled-system/patterns'
import type { Name } from '../types/name'
import { Button } from './ui/button'
import { Input } from './ui/input'

const NameInputForm: FC<{ onNameAdd: (name: Name) => void }> = ({
  onNameAdd,
}) => {
  const [lastName, setLastName] = useState('')
  const [firstName, setFirstName] = useState('')

  const handleSubmit = () => {
    if (lastName.trim() && firstName.trim()) {
      onNameAdd({ lastName: lastName.trim(), firstName: firstName.trim() })
      setLastName('')
      setFirstName('')
    }
  }

  return (
    <div className={css({ mb: '4' })}>
      <div className={hstack({ gap: '2' })}>
        <Input
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          placeholder="名字"
        />
        <Input
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          placeholder="名前"
        />
        <Button onClick={handleSubmit}>追加</Button>
      </div>
    </div>
  )
}

export default NameInputForm
