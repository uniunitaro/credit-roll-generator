'use client'

import type { FC } from 'react'
import { css } from '../../styled-system/css'
import type { Name } from '../types/name'
import NameCanvas from './NameCanvas'

const NameList: FC<{ names: Name[] }> = ({ names }) => {
  return (
    <div className={css({ display: 'flex', flexDir: 'column', gap: '2' })}>
      {names.map((name, index) => (
        <div
          key={`${name.lastName}${name.firstName}-${index}`}
          className={css({ display: 'flex', alignItems: 'center' })}
        >
          <NameCanvas lastName={name.lastName} firstName={name.firstName} />
        </div>
      ))}
    </div>
  )
}

export default NameList
