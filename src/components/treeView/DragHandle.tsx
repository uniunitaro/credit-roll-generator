import type { SyntheticListenerMap } from '@dnd-kit/core/dist/hooks/utilities'
import { GripVerticalIcon } from 'lucide-react'
import type { FC } from 'react'
import { css } from 'styled-system/css'

type Props = {
  listeners?: SyntheticListenerMap
}

const DragHandle: FC<Props> = ({ listeners }) => {
  return (
    <div
      className={css({
        display: 'flex',
        alignItems: 'center',
        color: 'fg.subtle',
        cursor: 'move',
      })}
      {...listeners}
    >
      <GripVerticalIcon />
    </div>
  )
}

export default DragHandle
