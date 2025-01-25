'use client'

import {
  DndContext,
  type DragEndEvent,
  DragOverlay,
  type DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { useAtom, useAtomValue } from 'jotai'
import { PlusIcon, SettingsIcon } from 'lucide-react'
import { type FC, useCallback, useMemo, useState } from 'react'
import { css } from 'styled-system/css'
import { grid, hstack, stack } from 'styled-system/patterns'
import {
  getGroupByIdAtom,
  nameGroupIdsAtom,
  selectedItemAtom,
} from '~/atoms/names'
import { Button } from '../ui/button'
import DragHandle from './DragHandle'
import GroupTreeItem from './GroupTreeItem'
import TreeItemButton from './TreeItemButton'

const NameTreeView: FC = () => {
  const [nameGroupIds, setNameGroupIds] = useAtom(nameGroupIdsAtom)
  const [selectedItem, setSelectedItem] = useAtom(selectedItemAtom)
  const [activeId, setActiveId] = useState<string>()
  const activeGroup = useAtomValue(
    useMemo(() => getGroupByIdAtom(activeId), [activeId]),
  )
  const activeGroupName = activeGroup?.groupName

  const sensors = useSensors(useSensor(PointerSensor))

  const handleGroupAdd = useCallback(() => {
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

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id.toString())
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over) return

    if (active.id !== over.id) {
      const oldIndex = nameGroupIds.indexOf(active.id.toString())
      const newIndex = nameGroupIds.indexOf(over.id.toString())

      const newOrder = [...nameGroupIds]
      newOrder.splice(oldIndex, 1)
      newOrder.splice(newIndex, 0, active.id.toString())

      setNameGroupIds(newOrder)
    }

    setActiveId(undefined)
  }

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
          <DndContext
            sensors={sensors}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            id="group-tree"
          >
            <SortableContext
              items={nameGroupIds}
              strategy={verticalListSortingStrategy}
            >
              <div className={stack({ gap: '2' })}>
                {nameGroupIds.map((groupId) => (
                  <GroupTreeItem
                    key={groupId}
                    groupId={groupId}
                    onGroupDelete={handleGroupDelete}
                  />
                ))}
              </div>
            </SortableContext>
            <DragOverlay>
              {activeId ? (
                <TreeItemButton isSelected={true} isDragOverlay={true}>
                  <DragHandle />
                  {activeGroupName}
                </TreeItemButton>
              ) : null}
            </DragOverlay>
          </DndContext>
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

export default NameTreeView
