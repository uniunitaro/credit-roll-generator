'use client'

import { useAtomValue } from 'jotai'
import type { FC } from 'react'
import { Group, Layer, Stage, Text } from 'react-konva'
import { useMeasure } from 'react-use'
import { css } from 'styled-system/css'
import { allGroupsAtom } from '~/atoms/names'
import { DEFAULT_COLUMN_GAP, DEFAULT_GROUP_GAP } from '~/constants/constants'
import type { GroupWithName } from '~/types/name'
import { calculatePositionsFromSplitName } from '~/utils/calculatePositions'
import { getCharacterDimensions } from '~/utils/getCharacterDimensions'

type BaseGroupWithPosition = {
  id: string
  y: number
  groupName: string
  nameColumns: {
    id: string
    y: number
    positions: { char: string; x: number }[]
    scale: number
    width: number
  }[][]
}

type NormalGroupWithPosition = BaseGroupWithPosition & {
  type: 'normal'
  columnCount: number
  columnWidth: number
  width: number
}

type CharacterGroupWithPosition = BaseGroupWithPosition & {
  type: 'character'
  characterNames: {
    id: string
    y: number
    name: string
  }[]
}

type GroupWithPosition = NormalGroupWithPosition | CharacterGroupWithPosition

const calculateGroupPositions = ({
  groups,
  fontFamily,
  fontSize,
  characterFontSize,
}: {
  groups: GroupWithName[]
  fontFamily: string
  fontSize: number
  characterFontSize: number
}): GroupWithPosition[] => {
  const { height: normalHeight } = getCharacterDimensions({
    fontFamily,
    fontSize,
  })
  const { height: characterHeight } = getCharacterDimensions({
    fontFamily,
    fontSize: characterFontSize,
  })

  const { width: columnWidth } = calculatePositionsFromSplitName({
    lastName: 'あ',
    firstName: 'あ',
    fontFamily,
    fontSize,
  })

  // FIXME: マジックナンバー！！
  let currentY = 8
  return groups.map((group) => {
    const groupStartY = currentY

    const columnCount = group.type === 'normal' ? group.columns : 1

    // a, b, cという名前がある場合、[[a, c], [b]]という構造にする
    const nameColumns = [...Array(columnCount)].map((_, columnIndex) => {
      return group.names
        .filter((_, i) => i % columnCount === columnIndex)
        .map((name, index) => {
          const { positions, scale, width } = calculatePositionsFromSplitName({
            lastName: name.lastName,
            firstName: name.firstName,
            fontFamily,
            fontSize,
          })

          const nameY = group.groupName ? DEFAULT_GROUP_GAP : 0 // グループ名があればギャップ分下にずらす
          return {
            id: name.id,
            y: nameY + index * DEFAULT_GROUP_GAP,
            positions,
            scale,
            width,
          }
        })
    })

    const characterNames = group.names.map((name, index) => {
      const nameY = group.groupName ? DEFAULT_GROUP_GAP : 0 // グループ名があればギャップ分下にずらす
      return {
        id: name.id,
        // 声優名とフォントサイズが異なるためキャラクター名が右カラムの声優名の縦中央に表示されるように調整
        y:
          nameY +
          index * DEFAULT_GROUP_GAP +
          (normalHeight - characterHeight) / 2,
        name: name.kind === 'character' ? name.character : '',
      }
    })

    const groupHeight =
      Math.max(
        ...nameColumns.map((column) => Math.max(...column.map((n) => n.y))),
      ) +
      DEFAULT_GROUP_GAP +
      (group.groupName ? 8 : 0)
    currentY += groupHeight + DEFAULT_GROUP_GAP // 次のグループまでの間隔

    const groupWidth =
      columnWidth * columnCount + (columnCount - 1) * DEFAULT_COLUMN_GAP

    return {
      type: group.type,
      id: group.id,
      y: groupStartY,
      groupName: group.groupName,
      nameColumns,
      characterNames,
      columnCount,
      columnWidth,
      width: groupWidth,
    }
  })
}

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
