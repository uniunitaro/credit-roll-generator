'use client'

import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { PlusIcon, SettingsIcon, XIcon } from 'lucide-react'
import { type ComponentProps, type FC, useCallback } from 'react'
import { css } from 'styled-system/css'
import { grid, hstack, stack } from 'styled-system/patterns'
import {
  addNameAtom,
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
    // TODO: ここらへんもatomに寄せる、更新系atomは別ファイルに書いたほうが見通しいいかも
    const newId = crypto.randomUUID()
    setNameGroupIds([...nameGroupIds, newId])
    setSelectedItem({ type: 'group', id: newId })
  }, [nameGroupIds, setNameGroupIds, setSelectedItem])

  const handleGroupDelete = useCallback(
    (groupId: string) => {
      setNameGroupIds(nameGroupIds.filter((id) => id !== groupId))
      if (selectedItem?.type === 'group' && selectedItem.id === groupId) {
        setSelectedItem(undefined)
      }
    },
    [nameGroupIds, setNameGroupIds, selectedItem, setSelectedItem],
  )

  const handleSettingClick = useCallback(() => {
    setSelectedItem({ type: 'setting' })
  }, [setSelectedItem])
  const isSettingSelected = selectedItem?.type === 'setting'

  return (
    <div
      className={grid({
        gridTemplateRows: 'minmax(0, 1fr) auto',
        gridTemplateColumns: 'minmax(0, 1fr)',
        gap: '0',
        h: 'full',
      })}
    >
      <div
        className={stack({
          gap: '4',
          pb: '2',
          borderBottomWidth: 1,
          borderColor: 'border.default',
        })}
      >
        <div className={stack({ overflowY: 'auto' })}>
          <div className={stack({ gap: '2' })}>
            {nameGroupIds.map((groupId) => (
              <GroupTreeItem
                key={groupId}
                groupId={groupId}
                onGroupDelete={handleGroupDelete}
              />
            ))}
          </div>
          <Button
            variant="ghost"
            className={css({ justifyContent: 'start' })}
            onClick={handleGroupAdd}
          >
            <div className={hstack({ gap: '2' })}>
              <PlusIcon />
              グループを追加
            </div>
          </Button>
        </div>
      </div>

      <div className={stack({ pt: '2' })}>
        <Button
          variant="ghost"
          className={css({
            justifyContent: 'start',
            bg: isSettingSelected ? 'bg.muted' : 'transparent',
            _hover: { bg: 'gray.a3' },
          })}
          onClick={handleSettingClick}
        >
          <SettingsIcon />
          全体設定
        </Button>
      </div>
    </div>
  )
}

const GroupTreeItem: FC<{
  groupId: string
  onGroupDelete: (groupId: string) => void
}> = ({ groupId, onGroupDelete }) => {
  const [group, setGroup] = useAtom(nameGroupFamily(groupId))
  const [selectedItem, setSelectedItem] = useAtom(selectedItemAtom)

  const addName = useSetAtom(addNameAtom)
  const handleNameAdd = useCallback(() => {
    addName(groupId)
  }, [addName, groupId])

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

  const isGroupNameEmpty = group.groupName === ''

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
            {isGroupNameEmpty ? (
              <span className={css({ color: 'fg.subtle' })}>空のグループ</span>
            ) : (
              <span
                className={css({
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                })}
              >
                {group.groupName}
              </span>
            )}

            <IconButton
              variant="ghost"
              size="sm"
              aria-label="グループを削除"
              onClick={handleGroupDelete}
            >
              <XIcon />
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
        <Button
          variant="ghost"
          size="sm"
          className={css({ justifyContent: 'start' })}
          onClick={handleNameAdd}
        >
          <div className={hstack({ gap: '2' })}>
            <PlusIcon />
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

  const isNameEmpty =
    name.type === 'split'
      ? name.lastName === '' && name.firstName === ''
      : name.name === ''

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
          <span
            className={css({
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              w: 'full',
            })}
          >
            {name.type === 'split'
              ? `${name.lastName} ${name.firstName}`
              : name.name}
          </span>
        )}
        <IconButton
          variant="ghost"
          size="sm"
          aria-label="名前を削除"
          onClick={handleNameDelete}
        >
          <XIcon />
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
          w: 'full',
          _hover: { bg: 'gray.a3' },
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
