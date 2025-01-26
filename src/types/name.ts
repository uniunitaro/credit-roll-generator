import * as v from 'valibot'

const baseGroupSchema = v.object({
  id: v.string(),
  groupName: v.fallback(v.string(), ''),
  nameIds: v.fallback(v.array(v.string()), []),
  nameGap: v.undefinedable(v.number()),
  groupNameGap: v.undefinedable(v.number()),
  offsetX: v.fallback(v.number(), 0),
  offsetY: v.fallback(v.number(), 0),
  columnGap: v.undefinedable(v.number()),
})

const normalGroupSchema = v.intersect([
  baseGroupSchema,
  v.object({
    type: v.literal('normal'),
    columns: v.fallback(v.number(), 1),
  }),
])

const noTypesettingGroupSchema = v.intersect([
  baseGroupSchema,
  v.object({
    type: v.literal('noTypesetting'),
  }),
])

const characterGroupSchema = v.intersect([
  baseGroupSchema,
  v.object({
    type: v.literal('character'),
  }),
])

export const nameGroupSchema = v.union([
  normalGroupSchema,
  noTypesettingGroupSchema,
  characterGroupSchema,
])

const baseBaseNameSchema = v.object({
  id: v.string(),
  fontSize: v.undefinedable(v.number()),
})

const splitNameSchema = v.intersect([
  baseBaseNameSchema,
  v.object({
    type: v.literal('split'),
    firstName: v.fallback(v.string(), ''),
    lastName: v.fallback(v.string(), ''),
  }),
])

const singleNameSchema = v.intersect([
  baseBaseNameSchema,
  v.object({
    type: v.literal('single'),
    name: v.fallback(v.string(), ''),
  }),
])

const baseNameSchema = v.union([splitNameSchema, singleNameSchema])

const normalNameSchema = v.intersect([
  baseNameSchema,
  v.object({
    groupType: v.union([v.literal('normal'), v.literal('noTypesetting')]),
  }),
])

const characterNameSchema = v.intersect([
  baseNameSchema,
  v.object({
    groupType: v.literal('character'),
    character: v.fallback(v.string(), ''),
    characterFontSize: v.undefinedable(v.number()),
  }),
])

export const nameSchema = v.union([normalNameSchema, characterNameSchema])

export type NameGroup = v.InferOutput<typeof nameGroupSchema>
export type GroupType = NameGroup['type']
export type Name = v.InferOutput<typeof nameSchema>
export type NameType = Name['type']

export type GroupWithName = StrictOmit<NameGroup, 'nameIds'> & {
  names: Name[]
}
