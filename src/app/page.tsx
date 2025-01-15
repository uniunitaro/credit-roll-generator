'use client'

import type { FC } from 'react'
import { container } from 'styled-system/patterns'
import CreditRollGenerator from '~/components/CreditRollGenerator'
import { css } from '../../styled-system/css'

const Home: FC = () => {
  return (
    <div className={container({ py: '4' })}>
      <div>
        <h1 className={css({ fontSize: '2xl', fontWeight: 'bold', mb: '4' })}>
          エンドロールジェネレーター
        </h1>
        <CreditRollGenerator />
      </div>
    </div>
  )
}

export default Home
