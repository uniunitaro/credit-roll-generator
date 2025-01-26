import { atom } from 'jotai'
import * as v from 'valibot'
import { nameGroupSchema, nameSchema } from '~/types/name'
import { settingSchema } from '~/types/setting'
import { nameFamily, nameGroupFamily, nameGroupIdsAtom } from './names'
import { settingAtom } from './setting'

const STORAGE_KEY = 'credit-roll-state'

const storageStateSchema = v.object({
  groupIds: v.fallback(v.array(v.string()), []),
  groups: v.fallback(v.array(nameGroupSchema), []),
  names: v.fallback(v.array(nameSchema), []),
  setting: settingSchema,
})

type StorageState = v.InferOutput<typeof storageStateSchema>

// 状態をJSONデータに変換するatom
export const stateToJsonAtom = atom(null, (get) => {
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

  return JSON.stringify(state)
})

// JSONデータをlocalStorageに保存するatom
export const saveStateAtom = atom(null, (get, set) => {
  const jsonState = set(stateToJsonAtom)
  try {
    localStorage.setItem(STORAGE_KEY, jsonState)
  } catch (error) {
    console.error('Failed to save state:', error)
  }
})

export const loadStorage = () => {
  try {
    const state = localStorage.getItem(STORAGE_KEY)
    if (!state) return null
    return JSON.parse(state)
  } catch (error) {
    console.error('Failed to load state from storage:', error)
    return null
  }
}

// JSONデータから状態を復元するatom
export const loadStateAtom = atom(null, (get, set, state: unknown) => {
  try {
    const parsedState = v.parse(storageStateSchema, state)

    // グループIDsの復元
    set(nameGroupIdsAtom, parsedState.groupIds)

    // グループの復元
    for (const group of parsedState.groups) {
      set(nameGroupFamily(group.id), group)
    }

    // namesの復元
    for (const name of parsedState.names) {
      set(nameFamily(name.id), name)
    }

    // 設定の復元
    set(settingAtom, parsedState.setting)
  } catch (error) {
    console.error('Failed to parse state:', error)
  }
})
