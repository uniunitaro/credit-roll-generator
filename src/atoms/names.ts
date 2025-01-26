import { atom } from 'jotai'
import { atomFamily } from 'jotai/utils'
import { DEFAULT_COLUMNS } from '~/constants/constants'
import type { GroupType, GroupWithName, Name, NameGroup } from '~/types/name'

export const nameGroupIdsAtom = atom<string[]>([crypto.randomUUID()])

export const nameGroupFamily = atomFamily((id: string) =>
  atom<NameGroup>({
    id,
    type: 'normal',
    groupName: '',
    columns: DEFAULT_COLUMNS,
    nameGap: undefined,
    groupNameGap: undefined,
    offsetX: 0,
    offsetY: 0,
    nameIds: [crypto.randomUUID()],
  }),
)

export const nameFamily = atomFamily((id: string) =>
  atom<Name>({
    groupType: 'normal',
    type: 'split',
    id,
    lastName: '',
    firstName: '',
    fontSize: undefined,
  }),
)

// TODO: 更新系atomは別ファイルに書いたほうが見通しいいかも

export const addNameAtom = atom(null, (get, set, groupId: string) => {
  const newId = crypto.randomUUID()
  const group = get(nameGroupFamily(groupId))
  set(nameGroupFamily(groupId), (prev) => ({
    ...prev,
    nameIds: [...prev.nameIds, newId],
  }))
  set(nameFamily(newId), {
    groupType: group.type,
    type: 'split',
    id: newId,
    lastName: '',
    firstName: '',
    fontSize: undefined,
    character: '',
    characterFontSize: undefined,
  })
  set(selectedItemAtom, { type: 'name', id: newId })
})

export const allGroupsAtom = atom<GroupWithName[]>((get) => {
  const ids = get(nameGroupIdsAtom)
  const groups = ids.map((id) => {
    const group = get(nameGroupFamily(id))
    const names = group.nameIds.map((nameId) => get(nameFamily(nameId)))
    return {
      ...group,
      names,
    }
  })

  return groups
})

export const changeGroupTypeAtom = atom(
  null,
  (get, set, groupId: string, newType: GroupType) => {
    const group = get(nameGroupFamily(groupId))
    const names = group.nameIds.map((nameId) => get(nameFamily(nameId)))

    const newGroup: NameGroup =
      newType === 'character'
        ? {
            ...group,
            type: 'character',
            nameGap: group.nameGap,
            groupNameGap: group.groupNameGap,
          }
        : {
            ...group,
            type: newType,
            columns: DEFAULT_COLUMNS,
            nameGap: group.nameGap,
            groupNameGap: group.groupNameGap,
          }
    set(nameGroupFamily(groupId), newGroup)

    for (const name of names) {
      if (newType === 'character') {
        set(nameFamily(name.id), {
          ...name,
          groupType: 'character',
          character: '',
          characterFontSize: undefined,
        })
      } else {
        set(nameFamily(name.id), {
          ...name,
          groupType: 'normal',
        })
      }
    }
  },
)

type SelectedItem =
  | {
      type: 'group' | 'name'
      id: string
    }
  | { type: 'setting' }
  | undefined

export const selectedItemAtom = atom<SelectedItem>()

export const getGroupByIdAtom = (groupId: string | undefined) =>
  atom((get) => {
    if (!groupId) return undefined
    return get(nameGroupFamily(groupId))
  })

export const getNameByIdAtom = (nameId: string | undefined) =>
  atom((get) => {
    if (!nameId) return undefined
    return get(nameFamily(nameId))
  })
