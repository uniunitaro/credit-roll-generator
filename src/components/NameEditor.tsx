'use client'

import { useAtom, useAtomValue } from 'jotai'
import type { FC } from 'react'
import { css } from 'styled-system/css'
import { hstack, stack } from 'styled-system/patterns'
import { nameFamily, nameGroupFamily, selectedItemAtom } from '~/atoms/names'
import { Input } from './ui/input'

const NameEditor: FC = () => {
  const selectedItem = useAtomValue(selectedItemAtom)

  if (!selectedItem) {
    return (
      <div className={css({ p: '4', color: 'gray.500' })}>
        左のツリーから編集したい項目を選択してください
      </div>
    )
  }

  return selectedItem.type === 'name' ? (
    <NameEditForm nameId={selectedItem.id} />
  ) : (
    <GroupEditForm groupId={selectedItem.id} />
  )
}

const NameEditForm: FC<{ nameId: string }> = ({ nameId }) => {
  const [name, setName] = useAtom(nameFamily(nameId))

  return (
    <div className={stack({ gap: '4' })}>
      <h2 className={css({ fontSize: 'md', fontWeight: 'bold' })}>名前</h2>
      <div className={hstack({ gap: '2' })}>
        <Input
          value={name.lastName}
          onChange={(e) => setName({ ...name, lastName: e.target.value })}
          placeholder="姓"
        />
        <Input
          value={name.firstName}
          onChange={(e) => setName({ ...name, firstName: e.target.value })}
          placeholder="名"
        />
      </div>
    </div>
  )
}

const GroupEditForm: FC<{ groupId: string }> = ({ groupId }) => {
  const group = useAtomValue(nameGroupFamily(groupId))

  return (
    <div className={stack({ gap: '4' })}>
      <h2 className={css({ fontSize: 'md', fontWeight: 'bold' })}>グループ</h2>
      <div>名前数: {group.nameIds.length}件</div>
    </div>
  )
}

export default NameEditor
