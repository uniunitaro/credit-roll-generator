import type { ComponentProps, FC } from 'react'
import { css } from 'styled-system/css'
import { Button } from '../ui/button'

const TreeItemButton: FC<
  ComponentProps<'button'> & {
    isSelected?: boolean
    isDragOverlay?: boolean
  }
> = ({ isSelected, isDragOverlay, children, ...props }) => {
  return (
    <Button asChild variant="ghost" size="sm" {...props}>
      {/* TODO: キーボード操作 */}
      <div
        className={css({
          justifyContent: 'start',
          p: '2',
          w: 'full',
          _hover: !isDragOverlay ? { bg: 'gray.a3' } : {},
          bg: isSelected
            ? 'bg.muted'
            : isDragOverlay
              ? 'bg.muted'
              : 'transparent',
          fontSize: 'sm',
          fontWeight: 'normal',
          boxShadow: isDragOverlay ? 'lg' : undefined,
        })}
      >
        {children}
      </div>
    </Button>
  )
}

export default TreeItemButton
