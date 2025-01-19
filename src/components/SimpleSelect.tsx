'use client'

import type { ListCollection } from '@ark-ui/react'
import { CheckIcon, ChevronsUpDownIcon } from 'lucide-react'
import { Select } from './ui/select'

type SelectItem = {
  label: string
  value: string
}

type SimpleSelectProps<T extends SelectItem> = {
  value: T['value']
  onChange: (value: T['value']) => void
  collection: ListCollection<T>
  placeholder?: string
  label?: string
}

export const SimpleSelect = <T extends SelectItem>({
  value,
  onChange,
  collection,
  placeholder = '選択してください',
  label,
}: SimpleSelectProps<T>) => {
  return (
    <Select.Root
      variant="outline"
      positioning={{ sameWidth: true }}
      value={[value]}
      collection={collection}
      onValueChange={({ value }) => {
        onChange(value[0] as T['value'])
      }}
    >
      {label && <Select.Label>{label}</Select.Label>}
      <Select.Control>
        <Select.Trigger>
          <Select.ValueText placeholder={placeholder} />
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
  )
}
