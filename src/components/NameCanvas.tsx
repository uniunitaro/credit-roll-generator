'use client'

import { useAtomValue } from 'jotai'
import type { FC } from 'react'
import { Group, Layer, Stage, Text } from 'react-konva'
import { useMeasure } from 'react-use'
import { css } from 'styled-system/css'
import { allGroupsAtom } from '~/atoms/names'
import { settingAtom } from '~/atoms/setting'
import { calculateGroupPositions } from '../utils/calculateGroupPositions'

const NameCanvas: FC = () => {
  const {
    fontFamily,
    fontSize,
    characterFontSize,
    groupNameFontSize,
    columnGap,
    groupGap,
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
  })

  const [ref, { width: containerWidth }] = useMeasure<HTMLDivElement>()
  const canvasWidth = containerWidth || 1280
  const canvasHeight = canvasWidth * (9 / 16)

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
      <Stage width={canvasWidth} height={canvasHeight}>
        <Layer>
          {groupsWithPositions.map((group) => (
            <Group key={group.id} y={group.y}>
              {group.groupName && (
                <Text
                  text={group.groupName}
                  fontSize={groupNameFontSize}
                  fontFamily={fontFamily}
                  align="center"
                  width={canvasWidth}
                  fill={fontColor}
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
                        canvasWidth / 2 -
                        columnGap / 2 -
                        charName.name.length * characterFontSize
                      }
                      y={charName.y}
                      fontSize={characterFontSize}
                      fontFamily={fontFamily}
                      fill={fontColor}
                    />
                  ))}

                  {/* TODO: キャラクター名の場合は今のところ1カラムのみ */}
                  {group.nameColumns.at(0)?.map((name) => (
                    <Group
                      key={name.id}
                      x={canvasWidth / 2 + columnGap / 2}
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
                        />
                      ))}
                    </Group>
                  ))}
                </>
              )}
              {group.type === 'normal' && (
                <Group x={(canvasWidth - group.width) / 2}>
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
