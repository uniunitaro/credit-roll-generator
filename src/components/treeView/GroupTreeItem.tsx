import {
  DndContext,
  type DragEndEvent,
  DragOverlay,
  type DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { PlusIcon, XIcon } from 'lucide-react'
import { type FC, useCallback, useId, useMemo, useState } from 'react'
import { css } from 'styled-system/css'
import { hstack, stack } from 'styled-system/patterns'
import {
  addNameAtom,
  getNameByIdAtom,
  nameGroupFamily,
  selectedItemAtom,
} from '~/atoms/names'
import { Button } from '../ui/button'
import { IconButton } from '../ui/icon-button'
import DragHandle from './DragHandle'
import NameTreeItem from './NameTreeItem'
import TreeItemButton from './TreeItemButton'

const GroupTreeItem: FC<{
  groupId: string
  onGroupDelete: (groupId: string) => void
}> = ({ groupId, onGroupDelete }) => {
  const [group, setGroup] = useAtom(nameGroupFamily(groupId))
  const [selectedItem, setSelectedItem] = useAtom(selectedItemAtom)
  const [activeId, setActiveId] = useState<string>()
  const activeNameObj = useAtomValue(
    useMemo(() => getNameByIdAtom(activeId), [activeId]),
  )
  const activeName =
    activeNameObj?.type === 'split'
      ? `${activeNameObj.lastName} ${activeNameObj.firstName}`
      : activeNameObj?.name

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

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: groupId })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : undefined,
  }

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id.toString())
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over) return

    if (active.id !== over.id) {
      const oldIndex = group.nameIds.indexOf(active.id.toString())
      const newIndex = group.nameIds.indexOf(over.id.toString())

      const newOrder = [...group.nameIds]
      newOrder.splice(oldIndex, 1)
      newOrder.splice(newIndex, 0, active.id.toString())

      setGroup((prev) => ({
        ...prev,
        nameIds: newOrder,
      }))
    }

    setActiveId(undefined)
  }

  const isGroupNameEmpty = group.groupName === ''

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={stack({ gap: '1' })}
      {...attributes}
    >
      <div className={css({ display: 'flex', alignItems: 'center', gap: '2' })}>
        <TreeItemButton
          isSelected={
            selectedItem?.type === 'group' && selectedItem.id === groupId
          }
          onClick={() => setSelectedItem({ type: 'group', id: groupId })}
        >
          <DragHandle listeners={listeners} />
          <div
            className={hstack({
              justifyContent: 'space-between',
              w: 'full',
              minW: '0',
            })}
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
        <DndContext
          id={`group-${useId()}`}
          sensors={useSensors(useSensor(PointerSensor))}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={group.nameIds}
            strategy={verticalListSortingStrategy}
          >
            {group.nameIds.map((nameId) => (
              <NameTreeItem
                key={nameId}
                nameId={nameId}
                onNameDelete={handleNameDelete}
              />
            ))}
          </SortableContext>
          <DragOverlay>
            {activeId ? (
              <TreeItemButton isSelected={true} isDragOverlay={true}>
                <DragHandle />
                {activeName}
              </TreeItemButton>
            ) : null}
          </DragOverlay>
        </DndContext>
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

export default GroupTreeItem
