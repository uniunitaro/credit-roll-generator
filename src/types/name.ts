export type GroupType = 'normal' | 'character'

export type NameGroup = {
  id: string
  type: GroupType
  groupName: string
  nameIds: string[]
}

export type NormalName = {
  kind: 'normal'
  id: string
  firstName: string
  lastName: string
}

export type CharacterName = {
  kind: 'character'
  id: string
  firstName: string
  lastName: string
  character: string
}

export type Name = NormalName | CharacterName

export type GroupWithName = {
  id: string
  groupName: string
  names: Name[]
}
