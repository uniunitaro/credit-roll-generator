'use client'

import { useAtomValue } from 'jotai'
import type Konva from 'konva'
import type { Vector2d } from 'konva/lib/types'
import type { FC, RefObject } from 'react'
import { useEffect, useState } from 'react'
import { Group, Layer, Stage, Text } from 'react-konva'
import { useMeasure } from 'react-use'
import { css } from 'styled-system/css'
import { allGroupsAtom } from '~/atoms/names'
import { settingAtom } from '~/atoms/setting'
import { calculateGroupPositions } from '../utils/calculateGroupPositions'

const NameCanvas: FC<{ stageRef: RefObject<Konva.Stage | null> }> = ({
  stageRef,
}) => {
  const {
    fontFamily,
    fontSize,
    characterFontSize,
    groupNameFontSize,
    columnGap,
    groupGap,
    nameGap,
    groupNameGap,
    fontColor,
    canvasBgColor,
  } = useAtomValue(settingAtom)

  const groups = useAtomValue(allGroupsAtom)
  const groupsWithPositions = calculateGroupPositions({
    groups,
    fontFamily,
    fontSize,
    characterFontSize,
    columnGap,
    groupGap,
    nameGap,
    groupNameGap,
    groupNameFontSize,
  })

  const [ref, { width: containerWidth }] = useMeasure<HTMLDivElement>()
  const logicalWidth = 1920
  const canvasWidth = containerWidth || logicalWidth
  const canvasHeight = canvasWidth * (9 / 16)
  const baseScale = canvasWidth / logicalWidth
  const [scale, setScale] = useState(baseScale)
  const [position, setPosition] = useState<Vector2d>({ x: 0, y: 0 })

  useEffect(() => {
    setScale(baseScale)
  }, [baseScale])

  const handleDragBounds = (pos: Vector2d) => {
    const stage = stageRef.current
    if (!stage) return pos

    // スケールを考慮した実際の表示サイズ
    const scaledWidth = logicalWidth * scale
    const scaledHeight = canvasHeight * scale

    // キャンバスの端に到達したときの最大/最小位置を計算
    const maxX = 0
    const minX = Math.min(0, canvasWidth - scaledWidth)
    const maxY = 0
    const minY = Math.min(0, canvasHeight - scaledHeight)

    // x座標とy座標を制限
    const x = Math.min(maxX, Math.max(minX, pos.x))
    const y = Math.min(maxY, Math.max(minY, pos.y))

    return { x, y }
  }

  const handleWheel = (e: Konva.KonvaEventObject<WheelEvent>) => {
    e.evt.preventDefault()

    const stage = stageRef.current
    if (!stage) return

    const scaleBy = 1.1
    const oldScale = scale
    const pointer = stage.getPointerPosition()

    if (!pointer) return

    const mousePointTo = {
      x: (pointer.x - position.x) / oldScale,
      y: (pointer.y - position.y) / oldScale,
    }

    const newScale = e.evt.deltaY < 0 ? oldScale * scaleBy : oldScale / scaleBy
    const limitedScale = Math.max(baseScale, newScale)

    const initialPos = {
      x: pointer.x - mousePointTo.x * limitedScale,
      y: pointer.y - mousePointTo.y * limitedScale,
    }

    // スケール変更後の位置を制限
    const scaledWidth = logicalWidth * limitedScale
    const scaledHeight = canvasHeight * limitedScale

    const maxX = 0
    const minX = Math.min(0, canvasWidth - scaledWidth)
    const maxY = 0
    const minY = Math.min(0, canvasHeight - scaledHeight)

    const boundedPos = {
      x: Math.min(maxX, Math.max(minX, initialPos.x)),
      y: Math.min(maxY, Math.max(minY, initialPos.y)),
    }

    setScale(limitedScale)
    setPosition(boundedPos)
  }

  return (
    <div
      ref={ref}
      className={css({
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: 'border.default',
      })}
      style={{ backgroundColor: canvasBgColor }}
    >
      <Stage
        ref={stageRef}
        width={canvasWidth}
        height={canvasHeight}
        scale={{ x: scale, y: scale }}
        position={position}
        draggable
        onWheel={handleWheel}
        onDragEnd={(e) => {
          setPosition(e.target.position())
        }}
        dragBoundFunc={handleDragBounds}
      >
        <Layer>
          {groupsWithPositions.map((group) => (
            <Group key={group.id} y={group.y}>
              {group.groupName && (
                <Text
                  text={group.groupName}
                  fontSize={groupNameFontSize}
                  fontFamily={fontFamily}
                  align="center"
                  width={logicalWidth}
                  fill={fontColor}
                  rotation={0.05}
                />
              )}

              {group.type === 'character' && (
                <>
                  {group.characterNames.map((charName) => (
                    <Text
                      key={charName.id}
                      text={charName.name}
                      // FIXME: 今はfontSizeと一文字の横幅が同じと仮定している、英字のときとかずれる
                      x={
                        logicalWidth / 2 -
                        columnGap / 2 -
                        charName.name.length * characterFontSize
                      }
                      y={charName.y}
                      fontSize={characterFontSize}
                      fontFamily={fontFamily}
                      fill={fontColor}
                      rotation={0.05}
                    />
                  ))}

                  {/* TODO: キャラクター名の場合は今のところ1カラムのみ */}
                  {group.nameColumns.at(0)?.map((name) => (
                    <Group
                      key={name.id}
                      x={logicalWidth / 2 + columnGap / 2}
                      y={name.y}
                    >
                      {name.positions.map((pos, i) => (
                        <Text
                          // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                          key={i}
                          text={pos.char}
                          x={pos.x * name.scale}
                          fontSize={fontSize}
                          fontFamily={fontFamily}
                          scaleX={name.scale}
                          fill={fontColor}
                          rotation={0.05}
                        />
                      ))}
                    </Group>
                  ))}
                </>
              )}
              {group.type === 'normal' && (
                <Group x={(logicalWidth - group.width) / 2}>
                  {group.nameColumns.map((column, columnIndex) => (
                    <Group
                      // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                      key={columnIndex}
                      x={columnIndex * (group.columnWidth + columnGap)}
                      y={0}
                    >
                      {column.map((name) => (
                        <Group key={name.id} y={name.y}>
                          {name.positions.map((pos, i) => (
                            <Text
                              // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                              key={i}
                              text={pos.char}
                              x={pos.x * name.scale}
                              fontSize={fontSize}
                              fontFamily={fontFamily}
                              scaleX={name.scale}
                              fill={fontColor}
                              rotation={0.05}
                            />
                          ))}
                        </Group>
                      ))}
                    </Group>
                  ))}
                </Group>
              )}
            </Group>
          ))}
        </Layer>
      </Stage>
    </div>
  )
}

export default NameCanvas
