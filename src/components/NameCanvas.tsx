'use client'

import { useAtomValue } from 'jotai'
import type { FC } from 'react'
import { Group, Layer, Stage, Text } from 'react-konva'
import { useMeasure } from 'react-use'
import { css } from 'styled-system/css'
import { allGroupsAtom } from '~/atoms/names'
import type { GroupWithName } from '~/types/name'
import { calculatePositionsFromSplitName } from '~/utils/calculatePositions'
import { getCharacterDimensions } from '~/utils/getCharacterDimensions'

// TODO: 変更可能にする
const COLUMN_GAP = 30

type GroupWithPosition = {
  id: string
  y: number
  groupName: string
  names: {
    id: string
    y: number
    positions: { char: string; x: number }[]
    scale: number
    width: number
  }[]
  characterNames: {
    id: string
    y: number
    name: string
  }[]
}

const calculateGroupsWithPositions = ({
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

  let currentY = 8
  return groups.map((group) => {
    const groupStartY = currentY

    const names = group.names.map((name, index) => {
      const { positions, scale, width } = calculatePositionsFromSplitName({
        lastName: name.lastName,
        firstName: name.firstName,
        fontFamily,
        fontSize,
      })

      // FIXME: マジックナンバー！！
      const nameY = group.groupName ? 30 : 0 // グループ名があれば30px下にずらす
      return {
        id: name.id,
        y: nameY + index * 30,
        positions,
        scale,
        width,
      }
    })

    const characterNames = group.names.map((name, index) => {
      const nameY = group.groupName ? 30 : 0 // グループ名があれば30px下にずらす
      return {
        id: name.id,
        // 声優名とフォントサイズが異なるためキャラクター名が右カラムの声優名の縦中央に表示されるように調整
        y: nameY + index * 30 + (normalHeight - characterHeight) / 2,
        name: name.kind === 'character' ? name.character : '',
      }
    })

    // グループの高さを計算（最後の名前のY + 30px + 余白）
    const groupHeight =
      Math.max(...names.map((n) => n.y)) + 30 + (group.groupName ? 8 : 0)
    currentY += groupHeight + 30 // 次のグループまでの間隔

    return {
      id: group.id,
      y: groupStartY,
      groupName: group.groupName,
      names,
      characterNames,
    }
  })
}

const NameCanvas: FC<{
  fontFamily?: string
  fontSize?: number
  characterFontSize?: number
}> = ({ fontFamily = 'monospace', fontSize = 16, characterFontSize = 12 }) => {
  const groups = useAtomValue(allGroupsAtom)
  const groupsWithPositions = calculateGroupsWithPositions({
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

              {group.characterNames.map((charName) => (
                <Text
                  key={charName.id}
                  text={charName.name}
                  // FIXME: 今はfontSizeと一文字の横幅が同じと仮定している、英字のときとかずれる
                  x={
                    canvasWidth / 2 -
                    COLUMN_GAP / 2 -
                    charName.name.length * characterFontSize
                  }
                  y={charName.y}
                  fontSize={characterFontSize}
                  fontFamily={fontFamily}
                />
              ))}

              {group.names.map((name) => (
                <Group
                  key={name.id}
                  x={canvasWidth / 2 + COLUMN_GAP / 2}
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
            </Group>
          ))}
        </Layer>
      </Stage>
    </div>
  )
}

export default NameCanvas
