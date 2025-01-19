'use client'

import { createListCollection } from '@ark-ui/react'
import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { CheckIcon, ChevronsUpDownIcon } from 'lucide-react'
import type { FC } from 'react'
import { css } from 'styled-system/css'
import { hstack, stack } from 'styled-system/patterns'
import {
  changeGroupTypeAtom,
  nameFamily,
  nameGroupFamily,
  selectedItemAtom,
} from '~/atoms/names'
import type { GroupType } from '~/types/name'
import { Input } from './ui/input'
import { NumberInput } from './ui/number-input'
import { Select } from './ui/select'

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
  ) : (
    <GroupEditForm groupId={selectedItem.id} />
  )
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
        <div>
          {/* TODO: Select使いやすくコンポーネント化する */}
          <Select.Root
            variant="outline"
            positioning={{ sameWidth: true }}
            collection={collection}
            value={[group.type]}
            onValueChange={({ value }) => {
              changeGroupType(
                groupId,
                (value.at(0) as GroupType | undefined) ?? 'normal',
              )
            }}
          >
            <Select.Label>タイプ</Select.Label>
            <Select.Control>
              <Select.Trigger>
                <Select.ValueText placeholder="タイプを選択" />
                <ChevronsUpDownIcon />
              </Select.Trigger>
            </Select.Control>
            <Select.Positioner>
              <Select.Content>
                <Select.ItemGroup>
                  {collection.items.map((item) => (
                    <Select.Item key={item.value} item={item}>
                      <Select.ItemText>{item.label}</Select.ItemText>
                      <Select.ItemIndicator>
                        <CheckIcon />
                      </Select.ItemIndicator>
                    </Select.Item>
                  ))}
                </Select.ItemGroup>
              </Select.Content>
            </Select.Positioner>
          </Select.Root>
        </div>
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

export default NameEditor
