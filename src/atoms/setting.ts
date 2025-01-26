import { atom } from 'jotai'
import {
  DEFAULT_CANVAS_BG_COLOR,
  DEFAULT_CHARACTER_FONT_SIZE,
  DEFAULT_COLUMN_GAP,
  DEFAULT_FONT_COLOR,
  DEFAULT_FONT_FAMILY,
  DEFAULT_FONT_SIZE,
  DEFAULT_GROUP_GAP,
  DEFAULT_GROUP_NAME_FONT_SIZE,
  DEFAULT_GROUP_NAME_GAP,
  DEFAULT_NAME_GAP,
} from '~/constants/constants'
import type { Setting } from '~/types/setting'

export const settingAtom = atom<Setting>({
  fontFamily: DEFAULT_FONT_FAMILY,
  fontColor: DEFAULT_FONT_COLOR,
  canvasBgColor: DEFAULT_CANVAS_BG_COLOR,
  fontSize: DEFAULT_FONT_SIZE,
  groupNameFontSize: DEFAULT_GROUP_NAME_FONT_SIZE,
  characterFontSize: DEFAULT_CHARACTER_FONT_SIZE,
  columnGap: DEFAULT_COLUMN_GAP,
  groupGap: DEFAULT_GROUP_GAP,
  nameGap: DEFAULT_NAME_GAP,
  groupNameGap: DEFAULT_GROUP_NAME_GAP,
})
