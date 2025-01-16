'use client'

import type { FC } from 'react'
import { Layer, Stage, Text } from 'react-konva'
import { useMeasure } from 'react-use'
import { css } from 'styled-system/css'

const NameCanvas: FC<{
  names: { lastName: string; firstName: string }[]
  fontFamily?: string
  fontSize?: number
}> = ({ names, fontFamily = 'monospace', fontSize = 16 }) => {
  const [ref, { width: containerWidth }] = useMeasure<HTMLDivElement>()
  console.log('containerWidth', containerWidth)
  const width = containerWidth || 1280
  const height = width * (9 / 16)

  return (
    <div
      ref={ref}
      className={css({
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: 'border.default',
      })}
    >
      <Stage width={width} height={height}>
        <Layer>
          {names.map((name, index) => {
            const { positions, scale } = calculatePositions({
              lastName: name.lastName,
              firstName: name.firstName,
              fontFamily,
              fontSize,
            })
            const yOffset = index * 30 + 8 // 名前ごとの縦位置調整

            return positions.map((pos, i) => (
              <Text
                key={`${name.lastName}${name.firstName}-${index}-${i}`}
                text={pos.char}
                x={pos.x * scale}
                y={yOffset}
                fontSize={fontSize}
                fontFamily="monospace"
                scaleX={scale}
              />
            ))
          })}
        </Layer>
      </Stage>
    </div>
  )
}

const calculatePositions = ({
  lastName,
  firstName,
  fontFamily,
  fontSize,
}: {
  lastName: string
  firstName: string
  fontFamily: string
  fontSize: number
}) => {
  const fullName = lastName + firstName

  const singleCharWidth = (() => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (!ctx) {
      throw new Error('Failed to get canvas context')
    }

    ctx.font = `${fontSize}px ${fontFamily}`
    return ctx.measureText('あ').width
  })()
  const targetWidth = singleCharWidth * 5
  const centerX = targetWidth / 2

  const positions: { char: string; x: number }[] = []

  // 6文字以上
  if (fullName.length > 5) {
    const scale = targetWidth / (fullName.length * singleCharWidth)
    fullName.split('').forEach((char, index) => {
      positions.push({
        char,
        x: singleCharWidth * index,
      })
    })
    return { positions, scale }
  }

  // 5文字
  if (fullName.length === 5) {
    fullName.split('').forEach((char, index) => {
      positions.push({ char, x: singleCharWidth * index })
    })
    return { positions, scale: 1 }
  }

  // 名字2文字・名前1文字
  if (lastName.length === 2 && firstName.length === 1) {
    positions.push({ char: lastName[0], x: 0 })
    positions.push({ char: lastName[1], x: centerX - singleCharWidth })
    positions.push({ char: firstName, x: targetWidth - singleCharWidth })
    return { positions, scale: 1 }
  }

  // 名字1文字・名前2文字
  if (lastName.length === 1 && firstName.length === 2) {
    positions.push({ char: lastName, x: 0 })
    positions.push({ char: firstName[0], x: centerX })
    positions.push({ char: firstName[1], x: targetWidth - singleCharWidth })
    return { positions, scale: 1 }
  }

  // 名字1文字・名前1文字
  if (lastName.length === 1 && firstName.length === 1) {
    positions.push({ char: lastName, x: 0 })
    positions.push({ char: firstName, x: targetWidth - singleCharWidth })
    return { positions, scale: 1 }
  }

  // 名字1文字・名前3文字
  if (lastName.length === 1 && firstName.length === 3) {
    positions.push({ char: lastName, x: 0 })
    firstName.split('').forEach((char, index) => {
      positions.push({ char, x: singleCharWidth * (index + 2) })
    })
    return { positions, scale: 1 }
  }

  // 名字3文字・名前1文字
  if (lastName.length === 3 && firstName.length === 1) {
    lastName.split('').forEach((char, index) => {
      positions.push({ char, x: singleCharWidth * index })
    })
    positions.push({ char: firstName, x: singleCharWidth * 4 })
    return { positions, scale: 1 }
  }

  // 名字2文字・名前2文字
  if (lastName.length === 2 && firstName.length === 2) {
    const spacing = (targetWidth - singleCharWidth * 4) / 3
    positions.push({ char: lastName[0], x: 0 })
    positions.push({ char: lastName[1], x: singleCharWidth + spacing })
    positions.push({ char: firstName[0], x: singleCharWidth * 2 + spacing * 2 })
    positions.push({ char: firstName[1], x: targetWidth - singleCharWidth })
    return { positions, scale: 1 }
  }

  // その他
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
