'use client'

import { type FC, useEffect, useRef } from 'react'
import { css } from '../../styled-system/css'

const NameCanvas: FC<{ lastName: string; firstName: string }> = ({
  lastName,
  firstName,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // 1文字分の幅を計算
    ctx.font = '16px monospace'
    const singleCharWidth = ctx.measureText('あ').width
    const targetWidth = singleCharWidth * 5 // 5文字分の幅

    // Canvasサイズ設定
    canvas.width = targetWidth
    canvas.height = 24

    // サイズ設定後に再度フォントを設定（必要）
    ctx.font = '16px monospace'
    ctx.fillStyle = 'black'
    ctx.textBaseline = 'middle'

    // 文字描画
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    const fullName = lastName + firstName

    if (fullName.length > 5) {
      // 6文字以上の場合、文字を縮小
      const scale = targetWidth / ctx.measureText(fullName).width
      ctx.save()
      ctx.scale(scale, 1)
      ctx.fillText(fullName, 0, canvas.height / 2)
      ctx.restore()
    } else if (fullName.length < 5) {
      // 4文字以下の場合、苗字と名前の間にスペースを追加
      const spaces = '　'.repeat(5 - fullName.length)
      const formattedName = `${lastName}${spaces}${firstName}`
      ctx.fillText(formattedName, 0, canvas.height / 2)
    } else {
      // ちょうど5文字の場合
      ctx.fillText(fullName, 0, canvas.height / 2)
    }
  }, [lastName, firstName])

  return (
    <canvas
      ref={canvasRef}
      className={css({ border: '1px solid', borderColor: 'slate.200' })}
    />
  )
}

export default NameCanvas
