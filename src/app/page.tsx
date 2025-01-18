import type { FC } from 'react'
import { container, grid } from 'styled-system/patterns'
import CreditRollGenerator from '~/components/CreditRollGenerator'
import { css } from '../../styled-system/css'

const Home: FC = () => {
  return (
    <div className={container({ py: '4', h: '100vh' })}>
      <div
        className={grid({
          gridTemplateRows: 'auto minmax(0, 1fr)',
          gap: '4',
          h: 'full',
        })}
      >
        <h1 className={css({ fontSize: '2xl', fontWeight: 'bold' })}>
          エンドロールジェネレーター
        </h1>
        <CreditRollGenerator />
      </div>
    </div>
  )
}

export default Home
