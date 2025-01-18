'use client'

import { useAtom, useAtomValue } from 'jotai'
import { Plus, X } from 'lucide-react'
import { type ComponentProps, type FC, useCallback } from 'react'
import { css } from 'styled-system/css'
import { hstack, stack } from 'styled-system/patterns'
import {
  nameFamily,
  nameGroupFamily,
  nameGroupIdsAtom,
  selectedItemAtom,
} from '~/atoms/names'
import { Button } from './ui/button'
import { IconButton } from './ui/icon-button'

const NameTreeView: FC = () => {
  const [nameGroupIds, setNameGroupIds] = useAtom(nameGroupIdsAtom)
  const [selectedItem, setSelectedItem] = useAtom(selectedItemAtom)

  const handleGroupAdd = useCallback(() => {
    setNameGroupIds([...nameGroupIds, crypto.randomUUID()])
  }, [nameGroupIds, setNameGroupIds])

  const handleGroupDelete = useCallback(
    (groupId: string) => {
      setNameGroupIds(nameGroupIds.filter((id) => id !== groupId))
      if (selectedItem?.type === 'group' && selectedItem.id === groupId) {
        setSelectedItem(undefined)
      }
    },
    [nameGroupIds, setNameGroupIds, selectedItem, setSelectedItem],
  )

  return (
    <div className={stack({ gap: '4' })}>
      <div className={stack({ gap: '2' })}>
        {nameGroupIds.map((groupId) => (
          <GroupTreeItem
            key={groupId}
            groupId={groupId}
            onGroupDelete={handleGroupDelete}
          />
        ))}
      </div>
      <Button variant="ghost" onClick={handleGroupAdd}>
        <div className={hstack({ gap: '2' })}>
          <Plus />
          グループを追加
        </div>
      </Button>
    </div>
  )
}

const GroupTreeItem: FC<{
  groupId: string
  onGroupDelete: (groupId: string) => void
}> = ({ groupId, onGroupDelete }) => {
  const [group, setGroup] = useAtom(nameGroupFamily(groupId))
  const [selectedItem, setSelectedItem] = useAtom(selectedItemAtom)

  const handleNameAdd = useCallback(() => {
    const newId = crypto.randomUUID()
    setGroup((prev) => ({
      ...prev,
      nameIds: [...prev.nameIds, newId],
    }))
    setSelectedItem({ type: 'name', id: newId })
  }, [setGroup, setSelectedItem])

  const handleGroupDelete = useCallback(
    (e: React.MouseEvent) => {
      // 削除ボタンのクリックイベントを親要素に伝播させない
      e.stopPropagation()

      nameGroupFamily.remove(groupId)
      onGroupDelete(groupId)
    },
    [groupId, onGroupDelete],
  )

  const handleNameDelete = useCallback(
    (nameId: string) => {
      setGroup((prev) => ({
        ...prev,
        nameIds: prev.nameIds.filter((id) => id !== nameId),
      }))
      if (selectedItem?.type === 'name' && selectedItem.id === nameId) {
        setSelectedItem(undefined)
      }
    },
    [setGroup, setSelectedItem, selectedItem],
  )

  return (
    <div className={stack({ gap: '1' })}>
      <div className={css({ display: 'flex', alignItems: 'center', gap: '2' })}>
        <TreeItemButton
          isSelected={
            selectedItem?.type === 'group' && selectedItem.id === groupId
          }
          onClick={() => setSelectedItem({ type: 'group', id: groupId })}
        >
          <div
            className={hstack({ justifyContent: 'space-between', w: 'full' })}
          >
            グループ {group.nameIds.length}件
            <IconButton
              variant="ghost"
              size="sm"
              aria-label="グループを削除"
              onClick={handleGroupDelete}
            >
              <X />
            </IconButton>
          </div>
        </TreeItemButton>
      </div>
      <div className={stack({ pl: '4', gap: 1 })}>
        {group.nameIds.map((nameId) => (
          <NameTreeItem
            key={nameId}
            nameId={nameId}
            onNameDelete={handleNameDelete}
          />
        ))}
        <Button variant="ghost" size="sm" onClick={handleNameAdd}>
          <div className={hstack({ gap: '2' })}>
            <Plus />
            名前を追加
          </div>
        </Button>
      </div>
    </div>
  )
}

const NameTreeItem: FC<{
  nameId: string
  onNameDelete: (nameId: string) => void
}> = ({ nameId, onNameDelete }) => {
  const name = useAtomValue(nameFamily(nameId))
  const [selectedItem, setSelectedItem] = useAtom(selectedItemAtom)

  const isNameEmpty = name.lastName === '' && name.firstName === ''

  const handleNameDelete = useCallback(
    (e: React.MouseEvent) => {
      // 削除ボタンのクリックイベントを親要素に伝播させない
      e.stopPropagation()

      nameFamily.remove(nameId)
      onNameDelete(nameId)
    },
    [nameId, onNameDelete],
  )

  return (
    <TreeItemButton
      isSelected={selectedItem?.type === 'name' && selectedItem.id === nameId}
      onClick={() => setSelectedItem({ type: 'name', id: nameId })}
    >
      <div className={hstack({ justifyContent: 'space-between', w: 'full' })}>
        {isNameEmpty ? (
          <span className={css({ color: 'fg.subtle' })}>空の名前</span>
        ) : (
          <span>
            {name.lastName} {name.firstName}
          </span>
        )}
        <IconButton
          variant="ghost"
          size="sm"
          aria-label="名前を削除"
          onClick={handleNameDelete}
        >
          <X />
        </IconButton>
      </div>
    </TreeItemButton>
  )
}

const TreeItemButton: FC<
  ComponentProps<'button'> & {
    isSelected?: boolean
  }
> = ({ isSelected, children, ...props }) => {
  return (
    <Button asChild variant="ghost" size="sm" {...props}>
      {/* TODO: キーボード操作 */}
      <div
        className={css({
          justifyContent: 'start',
          p: '2',
          borderRadius: 'xl',
          w: 'full',
          _hover: { bg: 'bg.muted' },
          bg: isSelected ? 'bg.muted' : 'transparent',
          fontSize: 'sm',
          fontWeight: 'normal',
        })}
      >
        {children}
      </div>
    </Button>
  )
}

export default NameTreeView
