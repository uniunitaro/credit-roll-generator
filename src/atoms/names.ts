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
    nameIds: [crypto.randomUUID()],
  }),
)

export const nameFamily = atomFamily((id: string) =>
  atom<Name>({ kind: 'normal', id, lastName: '', firstName: '' }),
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
    kind: group.type,
    id: newId,
    lastName: '',
    firstName: '',
    character: '',
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
      newType === 'normal'
        ? { ...group, type: 'normal', columns: DEFAULT_COLUMNS }
        : { ...group, type: 'character' }
    set(nameGroupFamily(groupId), newGroup)

    for (const name of names) {
      if (newType === 'character') {
        set(nameFamily(name.id), {
          ...name,
          kind: 'character',
          character: '',
        })
      } else {
        set(nameFamily(name.id), {
          ...name,
          kind: 'normal',
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
  | undefined

export const selectedItemAtom = atom<SelectedItem>()
