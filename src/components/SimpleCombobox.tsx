'use client'

import { type ListCollection, Portal } from '@ark-ui/react'
import { CheckIcon, ChevronsUpDownIcon } from 'lucide-react'
import { useState } from 'react'
import { css } from 'styled-system/css'
import { Combobox, createListCollection } from './ui/combobox'
import { IconButton } from './ui/icon-button'
import { Input } from './ui/input'

type ComboboxItem = {
  label: string
  value: string
}

type SimpleComboboxProps<T extends ComboboxItem> = {
  value: T['value']
  onChange: (value: T['value']) => void
  collection: ListCollection<T>
  placeholder?: string
  label?: string
}

export const SimpleCombobox = <T extends ComboboxItem>({
  value,
  onChange,
  collection: initialCollection,
  placeholder = '選択してください',
  label,
}: SimpleComboboxProps<T>) => {
  const [collection, setCollection] = useState(initialCollection)
  const [inputValue, setInputValue] = useState(value)

  const handleInputChange = ({
    inputValue,
  }: Combobox.InputValueChangeDetails) => {
    const filtered = initialCollection.items.filter((item) =>
      item.label.toLowerCase().includes(inputValue.toLowerCase()),
    )

    setCollection(
      filtered.length > 0
        ? createListCollection({ items: filtered })
        : initialCollection,
    )

    setInputValue(inputValue)
  }

  const handleOpenChange = () => {
    setCollection(initialCollection)
  }

  return (
    <Combobox.Root
      positioning={{ sameWidth: true }}
      value={[value]}
      inputValue={inputValue}
      collection={collection}
      onValueChange={({ value }) => {
        onChange(value[0] as T['value'])
      }}
      onInputValueChange={handleInputChange}
      onOpenChange={handleOpenChange}
    >
      {label && <Combobox.Label>{label}</Combobox.Label>}
      <Combobox.Control>
        <Combobox.Input placeholder={placeholder} asChild>
          <Input />
        </Combobox.Input>
        <Combobox.Trigger asChild>
          <IconButton variant="link" aria-label="open" size="xs">
            <ChevronsUpDownIcon />
          </IconButton>
        </Combobox.Trigger>
      </Combobox.Control>
      <Portal>
        <Combobox.Positioner>
          <Combobox.Content
            className={css({ maxHeight: '300px', overflowY: 'auto' })}
          >
            <Combobox.ItemGroup>
              {collection.items.map((item) => (
                <Combobox.Item key={item.value} item={item}>
                  <Combobox.ItemText>{item.label}</Combobox.ItemText>
                  <Combobox.ItemIndicator>
                    <CheckIcon />
                  </Combobox.ItemIndicator>
                </Combobox.Item>
              ))}
            </Combobox.ItemGroup>
          </Combobox.Content>
        </Combobox.Positioner>
      </Portal>
    </Combobox.Root>
  )
}
