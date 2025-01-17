'use client'

import { useAtom } from 'jotai'
import { X } from 'lucide-react'
import { type FC, useCallback } from 'react'
import { nameFamily } from '~/atoms/names'
import type { Name } from '~/types/name'
import { hstack } from '../../styled-system/patterns'
import { IconButton } from './ui/icon-button'
import { Input } from './ui/input'

const NameListItem: FC<{
  nameId: string
  onNameDelete: (nameId: string) => void
}> = ({ nameId, onNameDelete }) => {
  const [name, setName] = useAtom(nameFamily(nameId))

  const handleNameUpdate = useCallback(
    (newName: Name) => {
      setName(newName)
    },
    [setName],
  )

  const handleNameDelete = useCallback(() => {
    nameFamily.remove(nameId)
    onNameDelete(nameId)
  }, [nameId, onNameDelete])

  return (
    <div className={hstack({ gap: '2' })}>
      <Input
        value={name.lastName}
        onChange={(e) =>
          handleNameUpdate({ ...name, lastName: e.target.value })
        }
        placeholder="姓"
      />
      <Input
        value={name.firstName}
        onChange={(e) =>
          handleNameUpdate({ ...name, firstName: e.target.value })
        }
        placeholder="名"
      />
      <IconButton
        variant="ghost"
        size="sm"
        aria-label="名前を削除"
        onClick={() => onNameDelete(name.uuid)}
      >
        <X />
      </IconButton>
    </div>
  )
}

export default NameListItem
