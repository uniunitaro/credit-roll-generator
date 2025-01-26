import * as v from 'valibot'
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
} from '../constants/constants'

export const settingSchema = v.object({
  fontFamily: v.fallback(v.string(), DEFAULT_FONT_FAMILY),
  fontColor: v.fallback(v.string(), DEFAULT_FONT_COLOR),
  canvasBgColor: v.fallback(v.string(), DEFAULT_CANVAS_BG_COLOR),
  fontSize: v.fallback(v.number(), DEFAULT_FONT_SIZE),
  groupNameFontSize: v.fallback(v.number(), DEFAULT_GROUP_NAME_FONT_SIZE),
  characterFontSize: v.fallback(v.number(), DEFAULT_CHARACTER_FONT_SIZE),
  columnGap: v.fallback(v.number(), DEFAULT_COLUMN_GAP),
  groupGap: v.fallback(v.number(), DEFAULT_GROUP_GAP),
  nameGap: v.fallback(v.number(), DEFAULT_NAME_GAP),
  groupNameGap: v.fallback(v.number(), DEFAULT_GROUP_NAME_GAP),
})

export type Setting = v.InferOutput<typeof settingSchema>
