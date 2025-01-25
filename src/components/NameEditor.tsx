'use client'

import { createListCollection } from '@ark-ui/react'
import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { RotateCcwIcon } from 'lucide-react'
import type { FC } from 'react'
import { css } from 'styled-system/css'
import { hstack, stack } from 'styled-system/patterns'
import {
  changeGroupTypeAtom,
  nameFamily,
  nameGroupFamily,
  selectedItemAtom,
} from '~/atoms/names'
import { settingAtom } from '~/atoms/setting'
import { useAvailableFonts } from '~/hooks/useAvailableFonts'
import type { GroupType, NameType } from '~/types/name'
import { SimpleColorPicker } from './SimpleColorPicker'
import { SimpleCombobox } from './SimpleCombobox'
import { SimpleSelect } from './SimpleSelect'
import { IconButton } from './ui/icon-button'
import { Input } from './ui/input'
import { NumberInput } from './ui/number-input'

const NameEditor: FC = () => {
  const selectedItem = useAtomValue(selectedItemAtom)

  if (!selectedItem) {
    return (
      <div className={css({ p: '4', color: 'gray.500' })}>
        左のツリーから編集したい項目を選択してください
      </div>
    )
  }

  return selectedItem.type === 'name' ? (
    <NameEditForm nameId={selectedItem.id} />
  ) : selectedItem.type === 'group' ? (
    <GroupEditForm groupId={selectedItem.id} />
  ) : selectedItem.type === 'setting' ? (
    <SettingEditForm />
  ) : null
}

const NameEditForm: FC<{ nameId: string }> = ({ nameId }) => {
  const [name, setName] = useAtom(nameFamily(nameId))

  const collection = createListCollection({
    items: [
      { label: '姓名', value: 'split' },
      { label: '単一名', value: 'single' },
    ] satisfies { label: string; value: NameType }[],
  })

  return (
    <div className={stack({ gap: '4' })}>
      <h2 className={css({ fontSize: 'md', fontWeight: 'bold' })}>名前</h2>
      <div className={stack({ gap: '4' })}>
        <SimpleSelect
          value={name.type}
          onChange={(value) => {
            if (value === 'split') {
              setName({ ...name, type: 'split', firstName: '', lastName: '' })
            } else {
              setName({ ...name, type: 'single', name: '' })
            }
          }}
          collection={collection}
          label="形式"
          placeholder="形式を選択"
        />
        {name.groupType === 'character' && (
          <Input
            value={name.character}
            onChange={(e) => setName({ ...name, character: e.target.value })}
            placeholder="キャラクター名"
          />
        )}
        {name.type === 'split' ? (
          <div className={hstack({ gap: '2' })}>
            <Input
              value={name.lastName}
              onChange={(e) =>
                setName({ ...name, type: 'split', lastName: e.target.value })
              }
              placeholder="姓"
            />
            <Input
              value={name.firstName}
              onChange={(e) =>
                setName({ ...name, type: 'split', firstName: e.target.value })
              }
              placeholder="名"
            />
          </div>
        ) : (
          <Input
            value={name.name}
            onChange={(e) =>
              setName({ ...name, type: 'single', name: e.target.value })
            }
            placeholder="名前"
          />
        )}
        {name.groupType === 'character' && (
          <div className={hstack({ gap: '2', alignItems: 'flex-end' })}>
            <NumberInput
              value={name.characterFontSize?.toString() ?? ''}
              onValueChange={(value) => {
                setName({
                  ...name,
                  characterFontSize: value.valueAsNumber || undefined,
                })
              }}
              placeholder="全体設定の値を使用"
            >
              キャラクター名フォントサイズ
            </NumberInput>
            <IconButton
              variant="ghost"
              size="sm"
              aria-label="キャラクター名フォントサイズをリセット"
              onClick={() => setName({ ...name, characterFontSize: undefined })}
            >
              <RotateCcwIcon />
            </IconButton>
          </div>
        )}
        <div className={hstack({ gap: '2', alignItems: 'flex-end' })}>
          <NumberInput
            value={name.fontSize?.toString() ?? ''}
            onValueChange={(value) => {
              setName({ ...name, fontSize: value.valueAsNumber || undefined })
            }}
            placeholder="全体設定の値を使用"
          >
            名前フォントサイズ
          </NumberInput>
          <IconButton
            variant="ghost"
            size="sm"
            aria-label="名前フォントサイズをリセット"
            onClick={() => setName({ ...name, fontSize: undefined })}
          >
            <RotateCcwIcon />
          </IconButton>
        </div>
      </div>
    </div>
  )
}

const GroupEditForm: FC<{ groupId: string }> = ({ groupId }) => {
  const [group, setGroup] = useAtom(nameGroupFamily(groupId))

  const changeGroupType = useSetAtom(changeGroupTypeAtom)

  const collection = createListCollection({
    items: [
      { label: '通常', value: 'normal' },
      { label: 'キャラクター', value: 'character' },
      { label: '字取りなし', value: 'noTypesetting' },
    ] satisfies { label: string; value: GroupType }[],
  })

  return (
    <div className={stack({ gap: '4' })}>
      <h2 className={css({ fontSize: 'md', fontWeight: 'bold' })}>グループ</h2>
      <div className={stack({ gap: '4' })}>
        <Input
          value={group.groupName}
          onChange={(e) => {
            setGroup({ ...group, groupName: e.target.value })
          }}
          placeholder="グループ名"
        />
        <SimpleSelect
          value={group.type}
          onChange={(value) => {
            changeGroupType(groupId, value)
          }}
          collection={collection}
          label="タイプ"
          placeholder="タイプを選択"
        />
        {group.type === 'normal' && (
          <NumberInput
            value={group.columns.toString()}
            onValueChange={(value) => {
              setGroup({ ...group, columns: value.valueAsNumber || 0 })
            }}
          >
            カラム数
          </NumberInput>
        )}
        <NumberInput
          value={group.nameGap.toString()}
          onValueChange={(value) => {
            setGroup({ ...group, nameGap: value.valueAsNumber || 0 })
          }}
        >
          名前間隔
        </NumberInput>
        <NumberInput
          value={group.groupNameGap.toString()}
          onValueChange={(value) => {
            setGroup({ ...group, groupNameGap: value.valueAsNumber || 0 })
          }}
        >
          グループ名と名前の間隔
        </NumberInput>
      </div>
    </div>
  )
}

const SettingEditForm: FC = () => {
  const [setting, setSetting] = useAtom(settingAtom)
  const fonts = useAvailableFonts()

  return (
    <div className={stack({ gap: '4' })}>
      <h2 className={css({ fontSize: 'md', fontWeight: 'bold' })}>全体設定</h2>
      <div className={stack({ gap: '4' })}>
        <SimpleCombobox
          value={setting.fontFamily}
          onChange={(value) => {
            setSetting({ ...setting, fontFamily: value })
          }}
          collection={createListCollection({
            items: fonts.map((font) => ({
              label: font.fullName,
              value: font.family,
            })),
          })}
          label="フォント"
          placeholder="フォントを選択"
        />

        <SimpleColorPicker
          color={setting.fontColor}
          onColorChange={(color) => {
            setSetting({ ...setting, fontColor: color })
          }}
          label="フォント色"
        />

        <SimpleColorPicker
          color={setting.canvasBgColor}
          onColorChange={(color) => {
            setSetting({ ...setting, canvasBgColor: color })
          }}
          label="背景色"
        />

        <NumberInput
          value={setting.fontSize.toString()}
          onValueChange={(value) => {
            setSetting({ ...setting, fontSize: value.valueAsNumber || 0 })
          }}
        >
          フォントサイズ
        </NumberInput>
        <NumberInput
          value={setting.groupNameFontSize.toString()}
          onValueChange={(value) => {
            setSetting({
              ...setting,
              groupNameFontSize: value.valueAsNumber || 0,
            })
          }}
        >
          グループ名フォントサイズ
        </NumberInput>
        <NumberInput
          value={setting.characterFontSize.toString()}
          onValueChange={(value) => {
            setSetting({
              ...setting,
              characterFontSize: value.valueAsNumber || 0,
            })
          }}
        >
          キャラクター名フォントサイズ
        </NumberInput>
        <NumberInput
          value={setting.columnGap.toString()}
          onValueChange={(value) => {
            setSetting({ ...setting, columnGap: value.valueAsNumber || 0 })
          }}
        >
          カラム間隔
        </NumberInput>
        <NumberInput
          value={setting.groupGap.toString()}
          onValueChange={(value) => {
            setSetting({ ...setting, groupGap: value.valueAsNumber || 0 })
          }}
        >
          グループ間隔
        </NumberInput>
      </div>
    </div>
  )
}

export default NameEditor
