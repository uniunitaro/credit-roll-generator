'use client'

import { type FC, useState } from 'react'
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
    <div>
      <div className={hstack({ gap: '2' })}>
        <Input
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          placeholder="姓"
        />
        <Input
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          placeholder="名"
        />
        <Button onClick={handleSubmit}>追加</Button>
      </div>
    </div>
  )
}

export default NameInputForm
