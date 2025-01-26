'use client'
import type { GroupWithName } from '~/types/name'
import {
  calculatePositionsFromSingleName,
  calculatePositionsFromSplitName,
} from '~/utils/calculatePositions'
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
    name: string
    fontSize: number
    height: number
  }[][]
  offsetX: number
  columnGap: number
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
    fontSize?: number
  }[]
}
type NoTypesettingGroupWithPosition = BaseGroupWithPosition & {
  type: 'noTypesetting'
}
type GroupWithPosition =
  | NormalGroupWithPosition
  | CharacterGroupWithPosition
  | NoTypesettingGroupWithPosition

export type CalculateGroupPositionsResult = {
  groups: GroupWithPosition[]
  totalHeight: number
}

export const calculateGroupPositions = ({
  groups,
  fontFamily,
  fontSize,
  characterFontSize,
  columnGap,
  groupGap,
  groupNameFontSize,
  nameGap,
  groupNameGap,
}: {
  groups: GroupWithName[]
  fontFamily: string
  fontSize: number
  characterFontSize: number
  columnGap: number
  groupGap: number
  groupNameFontSize: number
  nameGap: number
  groupNameGap: number
}): CalculateGroupPositionsResult => {
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
  const PADDING_Y = 8
  let currentY = PADDING_Y
  return {
    groups: groups.map((group) => {
      const groupStartY = currentY

      const columnCount = group.type === 'normal' ? group.columns : 1
      const effectiveNameGap = group.nameGap ?? nameGap
      const effectiveGroupNameGap = group.groupNameGap ?? groupNameGap

      // a, b, cという名前がある場合、[[a, c], [b]]という構造にする
      const nameColumns = [...Array(columnCount)].map((_, columnIndex) => {
        return group.names
          .filter((_, i) => i % columnCount === columnIndex)
          .map((name, index) => {
            const nameFontSize = name.fontSize ?? fontSize
            const { positions, scale, width } =
              name.type === 'split'
                ? calculatePositionsFromSplitName({
                    lastName: name.lastName,
                    firstName: name.firstName,
                    fontFamily,
                    fontSize: nameFontSize,
                  })
                : calculatePositionsFromSingleName({
                    name: name.name,
                    fontFamily,
                    fontSize: nameFontSize,
                  })

            const { height: nameHeight } = getCharacterDimensions({
              fontFamily,
              fontSize: nameFontSize,
            })

            const nameY = group.groupName
              ? groupNameHeight + effectiveGroupNameGap
              : 0 // グループ名があればギャップ分下にずらす

            // 上の名前までの高さを計算
            const previousNamesHeight = group.names
              .filter((_, i) => i % columnCount === columnIndex)
              .slice(0, index)
              .reduce((acc, prevName) => {
                const prevFontSize = prevName.fontSize ?? fontSize
                const { height: prevHeight } = getCharacterDimensions({
                  fontFamily,
                  fontSize: prevFontSize,
                })
                return acc + prevHeight + effectiveNameGap
              }, 0)

            return {
              id: name.id,
              y: nameY + previousNamesHeight,
              positions,
              scale,
              width,
              name:
                name.type === 'split'
                  ? name.lastName + name.firstName
                  : name.name,
              fontSize: nameFontSize,
              height: nameHeight,
            }
          })
      })

      const characterNames = group.names.map((name, index) => {
        const nameY = group.groupName
          ? groupNameHeight + effectiveGroupNameGap
          : 0 // グループ名があればギャップ分下にずらす

        const nameFontSize = name.fontSize ?? fontSize
        const { height: nameHeight } = getCharacterDimensions({
          fontFamily,
          fontSize: nameFontSize,
        })

        const charFontSize =
          name.groupType === 'character'
            ? (name.characterFontSize ?? characterFontSize)
            : undefined
        const { height: charHeight } = charFontSize
          ? getCharacterDimensions({
              fontFamily,
              fontSize: charFontSize,
            })
          : { height: 0 }

        // 上の名前までの高さを計算
        const previousNamesHeight = group.names
          .slice(0, index)
          .reduce((acc, prevName) => {
            const prevFontSize = prevName.fontSize ?? fontSize
            const { height: prevHeight } = getCharacterDimensions({
              fontFamily,
              fontSize: prevFontSize,
            })
            return acc + prevHeight + effectiveNameGap
          }, 0)

        return {
          id: name.id,
          y: nameY + previousNamesHeight + (nameHeight - charHeight) / 2,
          name: name.groupType === 'character' ? name.character : '',
          fontSize: charFontSize,
        }
      })

      // 各カラムの高さを計算
      const columnHeights = nameColumns.map((column) =>
        column.reduce(
          (acc, name, index) =>
            acc +
            name.height +
            (index < column.length - 1 ? effectiveNameGap : 0),
          0,
        ),
      )

      const groupHeight =
        Math.max(...columnHeights) +
        (group.groupName ? groupNameHeight + effectiveGroupNameGap : 0)

      currentY += groupHeight + groupGap + group.offsetY // 次のグループまでの間隔

      const groupWidth =
        columnWidth * columnCount +
        (columnCount - 1) * (group.columnGap ?? columnGap)

      return {
        type: group.type,
        id: group.id,
        y: groupStartY + group.offsetY,
        groupName: group.groupName,
        nameColumns,
        characterNames,
        columnCount,
        columnWidth,
        width: groupWidth,
        offsetX: group.offsetX,
        columnGap: group.columnGap ?? columnGap,
      }
    }),
    totalHeight: currentY - groupGap + PADDING_Y, // 最後のグループ後のギャップを除く
  }
}
