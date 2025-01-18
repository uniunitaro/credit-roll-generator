export const getCharacterDimensions = ({
  fontFamily,
  fontSize,
  text = 'あ',
}: {
  fontFamily: string
  fontSize: number
  text?: string
}): {
  width: number
  height: number
} => {
  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d')
  if (!context) {
    return { width: 0, height: 0 }
  }
  context.font = `${fontSize}px ${fontFamily}`
  const metrics = context.measureText(text)
  return {
    width: metrics.width,
    height: metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent,
  }
}
