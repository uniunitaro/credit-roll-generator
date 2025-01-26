type BaseGroup = {
  id: string
  groupName: string
  nameIds: string[]
  nameGap: number | undefined
  groupNameGap: number | undefined
  offsetX: number
  offsetY: number
  columnGap: number | undefined
}

export type NormalGroup = BaseGroup & {
  type: 'normal'
  columns: number
}

export type NoTypesettingGroup = BaseGroup & {
  type: 'noTypesetting'
}

export type CharacterGroup = BaseGroup & {
  type: 'character'
}

export type NameGroup = NormalGroup | NoTypesettingGroup | CharacterGroup
export type GroupType = NameGroup['type']

type BaseBaseName = {
  id: string
  fontSize: number | undefined
}

type SplitName = BaseBaseName & {
  type: 'split'
  firstName: string
  lastName: string
}

type SingleName = BaseBaseName & {
  type: 'single'
  name: string
}

type BaseName = SplitName | SingleName

export type NormalName = BaseName & {
  groupType: 'normal' | 'noTypesetting'
}

export type CharacterName = BaseName & {
  groupType: 'character'
  character: string
  characterFontSize: number | undefined
}

export type Name = NormalName | CharacterName
export type NameType = Name['type']

export type GroupWithName = StrictOmit<NameGroup, 'nameIds'> & {
  names: Name[]
}
