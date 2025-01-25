'use client'
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
export const calculateGroupPositions = ({
  groups,
  fontFamily,
  fontSize,
  characterFontSize,
  columnGap,
  groupGap,
  nameGap,
  groupNameGap,
  groupNameFontSize,
}: {
  groups: GroupWithName[]
  fontFamily: string
  fontSize: number
  characterFontSize: number
  columnGap: number
  groupGap: number
  nameGap: number
  groupNameGap: number
  groupNameFontSize: number
}): GroupWithPosition[] => {
  const { height: normalHeight } = getCharacterDimensions({
    fontFamily,
    fontSize,
  })
  const { height: characterHeight } = getCharacterDimensions({
    fontFamily,
    fontSize: characterFontSize,
  })

  const { height: groupNameHeight } = getCharacterDimensions({
    fontFamily,
    fontSize: groupNameFontSize,
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

          const nameY = group.groupName ? groupNameHeight + groupNameGap : 0 // グループ名があればギャップ分下にずらす
          return {
            id: name.id,
            y: nameY + index * (normalHeight + nameGap),
            positions,
            scale,
            width,
          }
        })
    })

    const characterNames = group.names.map((name, index) => {
      const nameY = group.groupName ? groupNameHeight + groupNameGap : 0 // グループ名があればギャップ分下にずらす
      return {
        id: name.id,
        // 声優名とフォントサイズが異なるためキャラクター名が右カラムの声優名の縦中央に表示されるように調整
        y:
          nameY +
          index * (normalHeight + nameGap) +
          (normalHeight - characterHeight) / 2,
        name: name.kind === 'character' ? name.character : '',
      }
    })

    const groupHeight =
      (Math.max(...nameColumns.map((column) => column.length)) - 1) *
        (normalHeight + nameGap) +
      normalHeight +
      (group.groupName ? groupNameHeight + groupNameGap : 0)
    currentY += groupHeight + groupGap // 次のグループまでの間隔

    const groupWidth = columnWidth * columnCount + (columnCount - 1) * columnGap

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
