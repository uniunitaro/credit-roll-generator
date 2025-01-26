import type Konva from 'konva'
import type { Vector2d } from 'konva/lib/types'
import { type RefObject, useCallback, useEffect, useState } from 'react'
import { useMeasure } from 'react-use'

export const useCanvasScale = (
  stageRef: RefObject<Konva.Stage | null>,
  totalHeight: number,
) => {
  const [containerRef, { width: containerWidth, height: containerHeight }] =
    useMeasure<HTMLDivElement>()
  const logicalWidth = 1920
  const canvasWidth = containerWidth || logicalWidth
  const canvasHeight = containerHeight || 0
  const baseScale = canvasWidth / logicalWidth
  const [scale, setScale] = useState(baseScale)
  const [position, setPosition] = useState<Vector2d>({ x: 0, y: 0 })

  useEffect(() => {
    setScale(baseScale)
  }, [baseScale])

  const handleDragBounds = useCallback(
    (pos: Vector2d) => {
      const stage = stageRef.current
      if (!stage) return pos

      // スケールを考慮した実際の表示サイズ
      const scaledWidth = logicalWidth * scale
      const scaledHeight = totalHeight * scale

      // キャンバスの端に到達したときの最大/最小位置を計算
      const maxX = 0
      const minX = Math.min(0, canvasWidth - scaledWidth)
      const maxY = 0
      const minY = Math.min(0, canvasHeight - scaledHeight)

      // x座標とy座標を制限
      const x = Math.min(maxX, Math.max(minX, pos.x))
      const y = Math.min(maxY, Math.max(minY, pos.y))

      return { x, y }
    },
    [canvasWidth, canvasHeight, scale, totalHeight, stageRef],
  )

  const handleWheel = useCallback(
    (e: Konva.KonvaEventObject<WheelEvent>) => {
      e.evt.preventDefault()

      const stage = stageRef.current
      if (!stage) return

      const scaleBy = 1.1
      const oldScale = scale
      const pointer = stage.getPointerPosition()

      if (!pointer) return

      const mousePointTo = {
        x: (pointer.x - position.x) / oldScale,
        y: (pointer.y - position.y) / oldScale,
      }

      const newScale =
        e.evt.deltaY < 0 ? oldScale * scaleBy : oldScale / scaleBy
      const limitedScale = Math.max(baseScale, newScale)

      const initialPos = {
        x: pointer.x - mousePointTo.x * limitedScale,
        y: pointer.y - mousePointTo.y * limitedScale,
      }

      // スケール変更後の位置を制限
      const scaledWidth = logicalWidth * limitedScale
      const scaledHeight = totalHeight * limitedScale

      const maxX = 0
      const minX = Math.min(0, canvasWidth - scaledWidth)
      const maxY = 0
      const minY = Math.min(0, canvasHeight - scaledHeight)

      const boundedPos = {
        x: Math.min(maxX, Math.max(minX, initialPos.x)),
        y: Math.min(maxY, Math.max(minY, initialPos.y)),
      }

      setScale(limitedScale)
      setPosition(boundedPos)
    },
    [
      baseScale,
      canvasWidth,
      canvasHeight,
      position,
      scale,
      totalHeight,
      stageRef,
    ],
  )

  return {
    containerRef,
    canvasWidth,
    canvasHeight,
    scale,
    position,
    setPosition,
    handleDragBounds,
    handleWheel,
    logicalWidth,
  }
}
