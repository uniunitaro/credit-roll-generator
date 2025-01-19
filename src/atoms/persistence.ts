import { atom } from 'jotai'
import type { Name, NameGroup } from '~/types/name'
import { nameFamily, nameGroupFamily, nameGroupIdsAtom } from './names'

const STORAGE_KEY = 'credit-roll-state'

type StorageState = {
  groupIds: string[]
  groups: NameGroup[]
  names: Name[]
}

// 状態を保存するatom
export const saveStateAtom = atom(null, (get) => {
  const groupIds = get(nameGroupIdsAtom)
  const groups = groupIds.map((id) => get(nameGroupFamily(id)))
  const names = groups.flatMap((group) =>
    group.nameIds.map((nameId) => get(nameFamily(nameId))),
  )

  const state: StorageState = {
    groupIds,
    groups,
    names,
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch (error) {
    console.error('Failed to save state:', error)
  }
})

// 状態を復元するatom
export const loadStateAtom = atom(null, (get, set) => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return

    const state = JSON.parse(stored) as StorageState

    // グループIDsの復元
    set(nameGroupIdsAtom, state.groupIds)

    // グループの復元
    for (const group of state.groups) {
      set(nameGroupFamily(group.id), group)
    }

    // namesの復元
    for (const name of state.names) {
      set(nameFamily(name.id), name)
    }
  } catch (error) {
    console.error('Failed to load state:', error)
  }
})
