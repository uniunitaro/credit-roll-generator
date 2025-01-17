'use client'

import { useAtom } from 'jotai'
import { X } from 'lucide-react'
import { type FC, useCallback } from 'react'
import { css } from 'styled-system/css'
import { nameGroupFamily } from '~/atoms/names'
import { hstack, stack } from '../../styled-system/patterns'
import NameListItem from './NameListItem'
import { Button } from './ui/button'
import { IconButton } from './ui/icon-button'

const NameGroup: FC<{
  groupId: string
  onGroupDelete: (groupId: string) => void
}> = ({ groupId, onGroupDelete }) => {
  const [group, setGroup] = useAtom(nameGroupFamily(groupId))

  const handleGroupDelete = useCallback(() => {
    nameGroupFamily.remove(groupId)
    onGroupDelete(groupId)
  }, [groupId, onGroupDelete])

  const handleNameAdd = useCallback(() => {
    setGroup((prev) => ({
      ...prev,
      nameIds: [...prev.nameIds, crypto.randomUUID()],
    }))
  }, [setGroup])

  const handleNameDelete = useCallback(
    (nameId: string) => {
      setGroup((prev) => ({
        ...prev,
        nameIds: prev.nameIds.filter((id) => id !== nameId),
      }))
    },
    [setGroup],
  )

  return (
    <div
      className={stack({
        gap: '2',
        p: '4',
        borderWidth: 1,
        borderColor: 'border.default',
        borderRadius: '2xl',
      })}
    >
      <div className={hstack({ gap: '2', justifyContent: 'space-between' })}>
        <h2 className={css({ fontSize: 'lg', fontWeight: 'bold' })}>
          名前グループ
        </h2>
        <IconButton
          variant="ghost"
          size="sm"
          aria-label="グループを削除"
          onClick={handleGroupDelete}
        >
          <X />
        </IconButton>
      </div>
      <div className={stack({ gap: '4' })}>
        <div className={stack({ gap: '2' })}>
          {group.nameIds.map((nameId) => (
            <NameListItem
              key={nameId}
              nameId={nameId}
              onNameDelete={handleNameDelete}
            />
          ))}
        </div>
        <Button onClick={handleNameAdd}>名前を追加</Button>
      </div>
    </div>
  )
}

export default NameGroup
