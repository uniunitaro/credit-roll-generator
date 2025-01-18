import { atom } from 'jotai'
import { atomFamily } from 'jotai/utils'
import type { Name, NameGroup } from '~/types/name'

export const nameGroupIdsAtom = atom<string[]>([crypto.randomUUID()])

export const nameGroupFamily = atomFamily((uuid: string) =>
  atom<NameGroup>({ uuid: uuid, nameIds: [crypto.randomUUID()] }),
)

export const nameFamily = atomFamily((uuid: string) =>
  atom<Name>({ uuid: uuid, lastName: '', firstName: '' }),
)

export const allNamesAtom = atom((get) => {
  const ids = get(nameGroupIdsAtom)
  const nameGroups = ids.map((id) => get(nameGroupFamily(id)))
  const names = nameGroups.flatMap((group) =>
    group.nameIds.map((id) => get(nameFamily(id))),
  )

  return names
})

type SelectedItem =
  | {
      type: 'group' | 'name'
      id: string
    }
  | undefined

export const selectedItemAtom = atom<SelectedItem>()
