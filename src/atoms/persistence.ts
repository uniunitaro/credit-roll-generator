import { atom } from 'jotai'
import type { Name, NameGroup } from '~/types/name'
import type { Setting } from '~/types/setting'
import { nameFamily, nameGroupFamily, nameGroupIdsAtom } from './names'
import { settingAtom } from './setting'

const STORAGE_KEY = 'credit-roll-state'

type StorageState = {
  groupIds: string[]
  groups: NameGroup[]
  names: Name[]
  setting: Setting
}

// 状態を保存するatom
export const saveStateAtom = atom(null, (get) => {
  const groupIds = get(nameGroupIdsAtom)
  const groups = groupIds.map((id) => get(nameGroupFamily(id)))
  const names = groups.flatMap((group) =>
    group.nameIds.map((nameId) => get(nameFamily(nameId))),
  )
  const setting = get(settingAtom)

  const state: StorageState = {
    groupIds,
    groups,
    names,
    setting,
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

    // 設定の復元
    set(settingAtom, state.setting)
  } catch (error) {
    console.error('Failed to load state:', error)
  }
})
