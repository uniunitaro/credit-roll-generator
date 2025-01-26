import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useAtom, useAtomValue } from 'jotai'
import { XIcon } from 'lucide-react'
import { type FC, useCallback } from 'react'
import { css } from 'styled-system/css'
import { hstack } from 'styled-system/patterns'
import { nameFamily, selectedItemAtom } from '~/atoms/names'
import { IconButton } from '../ui/icon-button'
import DragHandle from './DragHandle'
import TreeItemButton from './TreeItemButton'

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

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: nameId })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : undefined,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={css({
        display: 'flex',
        alignItems: 'center',
        gap: '2',
      })}
      {...attributes}
    >
      <TreeItemButton
        isSelected={selectedItem?.type === 'name' && selectedItem.id === nameId}
        onClick={() => setSelectedItem({ type: 'name', id: nameId })}
      >
        <DragHandle listeners={listeners} />
        <div
          className={hstack({
            justifyContent: 'space-between',
            w: 'full',
            minW: '0',
          })}
        >
          {isNameEmpty ? (
            <span className={css({ color: 'fg.subtle' })}>空の名前</span>
          ) : (
            <span
              className={css({
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
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
    </div>
  )
}

export default NameTreeItem
