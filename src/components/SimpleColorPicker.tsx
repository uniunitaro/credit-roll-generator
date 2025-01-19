import { parseColor } from '@ark-ui/react/color-picker'
import { PipetteIcon } from 'lucide-react'
import type { FC } from 'react'
import { HStack, Stack } from 'styled-system/jsx'
import { ColorPicker } from './ui/color-picker'
import { IconButton } from './ui/icon-button'
import { Input } from './ui/input'

export const SimpleColorPicker: FC<{
  color: string
  onColorChange: (color: string) => void
  label?: string
}> = ({ color, onColorChange, label }) => {
  return (
    <ColorPicker.Root
      value={parseColor(color)}
      onValueChange={(e) => onColorChange(e.valueAsString)}
    >
      <ColorPicker.Context>
        {(api) => (
          <>
            {label && <ColorPicker.Label>{label}</ColorPicker.Label>}
            <ColorPicker.Control>
              <ColorPicker.ChannelInput channel="hex" asChild>
                <Input />
              </ColorPicker.ChannelInput>
              <ColorPicker.Trigger asChild>
                <IconButton variant="outline">
                  <ColorPicker.Swatch value={api.value} />
                </IconButton>
              </ColorPicker.Trigger>
            </ColorPicker.Control>
            <ColorPicker.Positioner>
              <ColorPicker.Content>
                <Stack gap="3">
                  <ColorPicker.Area>
                    <ColorPicker.AreaBackground />
                    <ColorPicker.AreaThumb />
                  </ColorPicker.Area>
                  <HStack gap="3">
                    <ColorPicker.EyeDropperTrigger asChild>
                      <IconButton
                        size="xs"
                        variant="outline"
                        aria-label="Pick a color"
                      >
                        <PipetteIcon />
                      </IconButton>
                    </ColorPicker.EyeDropperTrigger>
                    <Stack gap="2" flex="1">
                      <ColorPicker.ChannelSlider channel="hue">
                        <ColorPicker.ChannelSliderTrack />
                        <ColorPicker.ChannelSliderThumb />
                      </ColorPicker.ChannelSlider>
                      <ColorPicker.ChannelSlider channel="alpha">
                        <ColorPicker.TransparencyGrid size="8px" />
                        <ColorPicker.ChannelSliderTrack />
                        <ColorPicker.ChannelSliderThumb />
                      </ColorPicker.ChannelSlider>
                    </Stack>
                  </HStack>
                  <HStack>
                    <ColorPicker.ChannelInput channel="hex" asChild>
                      <Input size="2xs" />
                    </ColorPicker.ChannelInput>
                    <ColorPicker.ChannelInput channel="alpha" asChild>
                      <Input size="2xs" />
                    </ColorPicker.ChannelInput>
                  </HStack>
                </Stack>
              </ColorPicker.Content>
            </ColorPicker.Positioner>
          </>
        )}
      </ColorPicker.Context>
      <ColorPicker.HiddenInput />
    </ColorPicker.Root>
  )
}
