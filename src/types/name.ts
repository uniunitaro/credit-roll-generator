export type GroupType = 'normal' | 'character'

type BaseGroup = {
  id: string
  groupName: string
  nameIds: string[]
}

export type NormalGroup = BaseGroup & {
  type: 'normal'
  columns: number
}

export type CharacterGroup = BaseGroup & {
  type: 'character'
}

export type NameGroup = NormalGroup | CharacterGroup

type BaseName = {
  id: string
  firstName: string
  lastName: string
}

export type NormalName = BaseName & {
  kind: 'normal'
}

export type CharacterName = BaseName & {
  kind: 'character'
  character: string
}

export type Name = NormalName | CharacterName

export type GroupWithName = StrictOmit<NameGroup, 'nameIds'> & {
  names: Name[]
}
