'use client'

import { useAtomValue } from 'jotai'
import type Konva from 'konva'
import type { FC, RefObject } from 'react'
import { useImperativeHandle } from 'react'
import { Group, Layer, Stage, Text } from 'react-konva'
import { css } from 'styled-system/css'
import { allGroupsAtom } from '~/atoms/names'
import { settingAtom } from '~/atoms/setting'
import { useCanvasScale } from '~/hooks/useCanvasScale'
import { calculateGroupPositions } from '../utils/calculateGroupPositions'

export type NameCanvasRef = {
  exportToImage: () => void
}

const NameCanvas: FC<{
  ref: RefObject<NameCanvasRef | null>
  stageRef: RefObject<Konva.Stage | null>
}> = ({ ref, stageRef }) => {
  const {
    fontFamily,
    fontSize,
    characterFontSize,
    groupNameFontSize,
    columnGap,
    groupGap,
    fontColor,
    canvasBgColor,
    nameGap,
    groupNameGap,
  } = useAtomValue(settingAtom)

  const groups = useAtomValue(allGroupsAtom)
  const { groups: groupsWithPositions, totalHeight } = calculateGroupPositions({
    groups,
    fontFamily,
    fontSize,
    characterFontSize,
    columnGap,
    groupGap,
    groupNameFontSize,
    nameGap,
    groupNameGap,
  })

  const {
    containerRef,
    canvasWidth,
    canvasHeight,
    scale,
    position,
    setPosition,
    handleDragBounds,
    handleWheel,
    logicalWidth,
  } = useCanvasScale(stageRef, totalHeight)

  useImperativeHandle(ref, () => ({
    exportToImage: () => {
      if (!stageRef.current) return

      // 現在の状態を保存
      const currentWidth = stageRef.current.width()
      const currentHeight = stageRef.current.height()
      const currentScale = stageRef.current.scale()
      const currentPosition = stageRef.current.position()

      // 出力用の設定に変更
      stageRef.current.width(1920)
      stageRef.current.height(totalHeight)
      stageRef.current.scale({ x: 1, y: 1 })
      stageRef.current.position({ x: 0, y: 0 })

      const dataURL = stageRef.current.toDataURL()

      // 元の状態に戻す
      stageRef.current.width(currentWidth)
      stageRef.current.height(currentHeight)
      stageRef.current.scale(currentScale)
      stageRef.current.position(currentPosition)

      const link = document.createElement('a')
      link.download = 'credit-roll.png'
      link.href = dataURL
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    },
  }))

  return (
    <div
      ref={containerRef}
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
                        charName.name.length *
                          (charName.fontSize ?? characterFontSize) +
                        group.offsetX
                      }
                      y={charName.y}
                      fontSize={charName.fontSize ?? characterFontSize}
                      fontFamily={fontFamily}
                      fill={fontColor}
                      rotation={0.05}
                    />
                  ))}

                  {/* TODO: キャラクター名の場合は今のところ1カラムのみ */}
                  {group.nameColumns.at(0)?.map((name) => (
                    <Group
                      key={name.id}
                      x={logicalWidth / 2 + columnGap / 2 + group.offsetX}
                      y={name.y}
                    >
                      {name.positions.map((pos, i) => (
                        <Text
                          // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                          key={i}
                          text={pos.char}
                          x={pos.x * name.scale}
                          fontSize={name.fontSize}
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
                      x={
                        columnIndex * (group.columnWidth + columnGap) +
                        group.offsetX
                      }
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
                              fontSize={name.fontSize}
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
              {group.type === 'noTypesetting' && (
                <Group>
                  {group.nameColumns.map((column, columnIndex) => (
                    <Group
                      // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                      key={columnIndex}
                      x={group.offsetX}
                      y={0}
                    >
                      {column.map((name) => (
                        <Group key={name.id} y={name.y}>
                          <Text
                            text={name.name}
                            fontSize={name.fontSize}
                            fontFamily={fontFamily}
                            align="center"
                            width={logicalWidth}
                            fill={fontColor}
                            rotation={0.05}
                          />
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
