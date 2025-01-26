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

    const parsedState = v.parse(storageStateSchema, JSON.parse(stored))

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
    console.error('Failed to load state:', error)
  }
})
