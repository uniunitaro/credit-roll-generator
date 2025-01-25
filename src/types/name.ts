type BaseGroup = {
  id: string
  groupName: string
  nameIds: string[]
  nameGap: number
  groupNameGap: number
}

export type NormalGroup = BaseGroup & {
  type: 'normal'
  columns: number
}

export type CharacterGroup = BaseGroup & {
  type: 'character'
}

export type NameGroup = NormalGroup | CharacterGroup
export type GroupType = NameGroup['type']

type SplitName = {
  type: 'split'
  id: string
  firstName: string
  lastName: string
}

type SingleName = {
  type: 'single'
  id: string
  name: string
}

type BaseName = SplitName | SingleName

export type NormalName = BaseName & {
  groupType: 'normal'
}

export type CharacterName = BaseName & {
  groupType: 'character'
  character: string
}

export type Name = NormalName | CharacterName
export type NameType = Name['type']

export type GroupWithName = StrictOmit<NameGroup, 'nameIds'> & {
  names: Name[]
}
