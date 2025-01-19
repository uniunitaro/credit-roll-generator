'use client'

import { createListCollection } from '@ark-ui/react'
import { useAtom, useAtomValue, useSetAtom } from 'jotai'
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
import type { GroupType } from '~/types/name'
import { SimpleColorPicker } from './SimpleColorPicker'
import { SimpleCombobox } from './SimpleCombobox'
import { SimpleSelect } from './SimpleSelect'
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

  return (
    <div className={stack({ gap: '4' })}>
      <h2 className={css({ fontSize: 'md', fontWeight: 'bold' })}>名前</h2>
      <div className={stack({ gap: '4' })}>
        {name.kind === 'character' && (
          <Input
            value={name.character}
            onChange={(e) => setName({ ...name, character: e.target.value })}
            placeholder="キャラクター名"
          />
        )}
        <div className={hstack({ gap: '2' })}>
          <Input
            value={name.lastName}
            onChange={(e) => setName({ ...name, lastName: e.target.value })}
            placeholder="姓"
          />
          <Input
            value={name.firstName}
            onChange={(e) => setName({ ...name, firstName: e.target.value })}
            placeholder="名"
          />
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
              setGroup({ ...group, columns: value.valueAsNumber })
            }}
          >
            カラム数
          </NumberInput>
        )}
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
            setSetting({ ...setting, fontSize: value.valueAsNumber })
          }}
        >
          フォントサイズ
        </NumberInput>
        <NumberInput
          value={setting.groupNameFontSize.toString()}
          onValueChange={(value) => {
            setSetting({ ...setting, groupNameFontSize: value.valueAsNumber })
          }}
        >
          グループ名フォントサイズ
        </NumberInput>
        <NumberInput
          value={setting.characterFontSize.toString()}
          onValueChange={(value) => {
            setSetting({ ...setting, characterFontSize: value.valueAsNumber })
          }}
        >
          キャラクター名フォントサイズ
        </NumberInput>
        <NumberInput
          value={setting.columnGap.toString()}
          onValueChange={(value) => {
            setSetting({ ...setting, columnGap: value.valueAsNumber })
          }}
        >
          カラム間隔
        </NumberInput>
        <NumberInput
          value={setting.groupGap.toString()}
          onValueChange={(value) => {
            setSetting({ ...setting, groupGap: value.valueAsNumber })
          }}
        >
          グループ間隔
        </NumberInput>
      </div>
    </div>
  )
}

export default NameEditor
