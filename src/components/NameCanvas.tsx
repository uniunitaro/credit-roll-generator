'use client'

import { useAtomValue } from 'jotai'
import type { FC } from 'react'
import { Group, Layer, Stage, Text } from 'react-konva'
import { useMeasure } from 'react-use'
import { css } from 'styled-system/css'
import { allGroupsAtom } from '~/atoms/names'
import { DEFAULT_COLUMN_GAP } from '~/constants/constants'
import { calculateGroupPositions } from '../utils/calculateGroupPositions'

const NameCanvas: FC<{
  fontFamily?: string
  fontSize?: number
  characterFontSize?: number
}> = ({ fontFamily = 'monospace', fontSize = 16, characterFontSize = 12 }) => {
  const groups = useAtomValue(allGroupsAtom)
  const groupsWithPositions = calculateGroupPositions({
    groups,
    fontFamily,
    fontSize,
    characterFontSize,
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
    >
      <Stage width={canvasWidth} height={canvasHeight}>
        <Layer>
          {groupsWithPositions.map((group) => (
            <Group key={group.id} y={group.y}>
              {group.groupName && (
                <Text
                  text={group.groupName}
                  fontSize={14} // TODO: グループ名のフォントサイズを調整
                  fontFamily={fontFamily}
                  align="center"
                  width={canvasWidth}
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
                        DEFAULT_COLUMN_GAP / 2 -
                        charName.name.length * characterFontSize
                      }
                      y={charName.y}
                      fontSize={characterFontSize}
                      fontFamily={fontFamily}
                    />
                  ))}

                  {/* TODO: キャラクター名の場合は今のところ1カラムのみ */}
                  {group.nameColumns.at(0)?.map((name) => (
                    <Group
                      key={name.id}
                      x={canvasWidth / 2 + DEFAULT_COLUMN_GAP / 2}
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
                      x={columnIndex * (group.columnWidth + DEFAULT_COLUMN_GAP)}
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
