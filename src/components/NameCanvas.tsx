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

    // サイズ設定後に再度フォントを設定
    ctx.font = '16px monospace'
    ctx.fillStyle = 'black'
    ctx.textBaseline = 'middle'

    // 文字描画
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    const fullName = lastName + firstName
    const centerX = canvas.width / 2

    const { positions, scale } = calculatePositions(
      ctx,
      fullName,
      lastName,
      firstName,
      singleCharWidth,
      targetWidth,
      centerX,
    )

    // 文字描画
    if (scale !== 1) {
      ctx.save()
      ctx.scale(scale, 1)
    }

    for (const { char, x } of positions) {
      ctx.fillText(char, x / scale, canvas.height / 2)
    }

    if (scale !== 1) {
      ctx.restore()
    }
  }, [lastName, firstName])

  return (
    <canvas
      ref={canvasRef}
      className={css({ border: '1px solid', borderColor: 'slate.200' })}
    />
  )
}

const calculatePositions = (
  ctx: CanvasRenderingContext2D,
  fullName: string,
  lastName: string,
  firstName: string,
  singleCharWidth: number,
  targetWidth: number,
  centerX: number,
) => {
  const positions: { char: string; x: number }[] = []

  if (fullName.length > 5) {
    // 6文字以上の場合、均等に配置
    const scale = targetWidth / ctx.measureText(fullName).width
    fullName.split('').forEach((char, index) => {
      positions.push({
        char,
        x: ctx.measureText(fullName.slice(0, index)).width * scale,
      })
    })
    return { positions, scale }
  }

  if (fullName.length === 5) {
    // 5文字の場合、等間隔で配置
    fullName.split('').forEach((char, index) => {
      positions.push({
        char,
        x: singleCharWidth * index,
      })
    })
    return { positions, scale: 1 }
  }

  if (lastName.length === 2 && firstName.length === 1) {
    // 名字2文字、名前1文字の場合
    positions.push({ char: lastName[0], x: 0 })
    positions.push({ char: lastName[1], x: centerX - singleCharWidth })
    positions.push({ char: firstName, x: targetWidth - singleCharWidth })
    return { positions, scale: 1 }
  }

  if (lastName.length === 1 && firstName.length === 2) {
    // 名字1文字、名前2文字の場合
    positions.push({ char: lastName, x: 0 })
    positions.push({ char: firstName[0], x: centerX })
    positions.push({ char: firstName[1], x: targetWidth - singleCharWidth })
    return { positions, scale: 1 }
  }

  if (lastName.length === 1 && firstName.length === 1) {
    // 名字1文字、名前1文字の場合
    positions.push({ char: lastName, x: 0 })
    positions.push({ char: firstName, x: targetWidth - singleCharWidth })
    return { positions, scale: 1 }
  }

  if (lastName.length === 1 && firstName.length === 3) {
    // 名字1文字、名前3文字の場合
    positions.push({ char: lastName, x: 0 })
    firstName.split('').forEach((char, index) => {
      positions.push({
        char,
        x: singleCharWidth * (index + 2), // スペース1文字分開けて配置
      })
    })
    return { positions, scale: 1 }
  }

  if (lastName.length === 3 && firstName.length === 1) {
    // 名字3文字、名前1文字の場合
    lastName.split('').forEach((char, index) => {
      positions.push({
        char,
        x: singleCharWidth * index,
      })
    })
    positions.push({
      char: firstName,
      x: singleCharWidth * 4, // スペース1文字分開けて配置
    })
    return { positions, scale: 1 }
  }

  if (lastName.length === 2 && firstName.length === 2) {
    // 名字2文字、名前2文字の場合
    const spacing = (targetWidth - singleCharWidth * 4) / 3
    positions.push({ char: lastName[0], x: 0 })
    positions.push({ char: lastName[1], x: singleCharWidth + spacing })
    positions.push({
      char: firstName[0],
      x: singleCharWidth * 2 + spacing * 2,
    })
    positions.push({ char: firstName[1], x: targetWidth - singleCharWidth })
    return { positions, scale: 1 }
  }

  // その他の場合、等間隔で配置
  const totalSpace = targetWidth - fullName.length * singleCharWidth
  const spacing = totalSpace / (fullName.length + 1)
  fullName.split('').forEach((char, index) => {
    positions.push({
      char,
      x: spacing * (index + 1) + singleCharWidth * index,
    })
  })
  return { positions, scale: 1 }
}

export default NameCanvas
