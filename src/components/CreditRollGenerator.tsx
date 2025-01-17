'use client'

import { useAtom } from 'jotai'
import dynamic from 'next/dynamic'
import { type FC, useCallback } from 'react'
import { grid, stack } from 'styled-system/patterns'
import { nameGroupIdsAtom } from '~/atoms/names'
import NameGroup from './NameGroup'
import { Button } from './ui/button'

const NameCanvas = dynamic(() => import('./NameCanvas'), { ssr: false })

const CreditRollGenerator: FC = () => {
  const [nameGroupIds, setNameGroupIds] = useAtom(nameGroupIdsAtom)

  const handleGroupAdd = useCallback(() => {
    setNameGroupIds([...nameGroupIds, crypto.randomUUID()])
  }, [nameGroupIds, setNameGroupIds])

  const handleGroupDelete = useCallback(
    (groupId: string) => {
      setNameGroupIds(nameGroupIds.filter((id) => id !== groupId))
    },
    [nameGroupIds, setNameGroupIds],
  )

  return (
    <div className={grid({ columns: 2, gap: '6' })}>
      <div className={stack({ gap: '6' })}>
        <div className={stack({ gap: '6' })}>
          {nameGroupIds.map((nameGroupId) => (
            <NameGroup
              key={nameGroupId}
              groupId={nameGroupId}
              onGroupDelete={handleGroupDelete}
            />
          ))}
        </div>
        <Button onClick={handleGroupAdd}>グループを追加</Button>
      </div>
      <NameCanvas />
    </div>
  )
}

export default CreditRollGenerator
