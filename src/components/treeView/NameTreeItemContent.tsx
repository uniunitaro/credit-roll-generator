import type { FC } from 'react'
import { css } from 'styled-system/css'
import type { Name } from '~/types/name'

type Props = {
  name: Name
  isNameEmpty: boolean
}

const NameTreeItemContent: FC<Props> = ({ name, isNameEmpty }) => {
  if (isNameEmpty) {
    return <span className={css({ color: 'fg.subtle' })}>空の名前</span>
  }

  return (
    <span
      className={css({
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        w: 'full',
      })}
    >
      {name.type === 'split' ? `${name.lastName} ${name.firstName}` : name.name}
    </span>
  )
}

export default NameTreeItemContent
