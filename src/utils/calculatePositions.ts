export const calculatePositionsFromSplitName = ({
  lastName,
  firstName,
  fontFamily,
  fontSize,
}: {
  lastName: string
  firstName: string
  fontFamily: string
  fontSize: number
}): {
  positions: { char: string; x: number }[]
  scale: number
  width: number
} => {
  const fullName = lastName + firstName

  const singleCharWidth = (() => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (!ctx) {
      throw new Error('Failed to get canvas context')
    }

    ctx.font = `${fontSize}px ${fontFamily}`
    return ctx.measureText('あ').width
  })()
  const targetWidth = singleCharWidth * 5

  const positions: { char: string; x: number }[] = []

  // 6文字以上
  if (fullName.length > 5) {
    const scale = targetWidth / (fullName.length * singleCharWidth)
    fullName.split('').forEach((char, index) => {
      positions.push({
        char,
        x: singleCharWidth * index,
      })
    })
    return { positions, scale, width: targetWidth }
  }

  // 5文字
  if (fullName.length === 5) {
    fullName.split('').forEach((char, index) => {
      positions.push({ char, x: singleCharWidth * index })
    })
    return { positions, scale: 1, width: targetWidth }
  }

  // 名字2文字・名前1文字
  if (lastName.length === 2 && firstName.length === 1) {
    const spacing = (targetWidth - singleCharWidth * 4) / 3
    positions.push({ char: lastName[0], x: 0 })
    positions.push({ char: lastName[1], x: singleCharWidth + spacing })
    positions.push({ char: firstName, x: targetWidth - singleCharWidth })
    return { positions, scale: 1, width: targetWidth }
  }

  // 名字1文字・名前2文字
  if (lastName.length === 1 && firstName.length === 2) {
    const spacing = (targetWidth - singleCharWidth * 4) / 3
    positions.push({ char: lastName, x: 0 })
    positions.push({ char: firstName[0], x: singleCharWidth * 2 + spacing * 2 })
    positions.push({ char: firstName[1], x: targetWidth - singleCharWidth })
    return { positions, scale: 1, width: targetWidth }
  }

  // 名字1文字・名前1文字
  if (lastName.length === 1 && firstName.length === 1) {
    positions.push({ char: lastName, x: 0 })
    positions.push({ char: firstName, x: targetWidth - singleCharWidth })
    return { positions, scale: 1, width: targetWidth }
  }

  // 名字1文字・名前3文字
  if (lastName.length === 1 && firstName.length === 3) {
    positions.push({ char: lastName, x: 0 })
    firstName.split('').forEach((char, index) => {
      positions.push({ char, x: singleCharWidth * (index + 2) })
    })
    return { positions, scale: 1, width: targetWidth }
  }

  // 名字3文字・名前1文字
  if (lastName.length === 3 && firstName.length === 1) {
    lastName.split('').forEach((char, index) => {
      positions.push({ char, x: singleCharWidth * index })
    })
    positions.push({ char: firstName, x: singleCharWidth * 4 })
    return { positions, scale: 1, width: targetWidth }
  }

  // 名字2文字・名前2文字
  if (lastName.length === 2 && firstName.length === 2) {
    const spacing = (targetWidth - singleCharWidth * 4) / 3
    positions.push({ char: lastName[0], x: 0 })
    positions.push({ char: lastName[1], x: singleCharWidth + spacing })
    positions.push({ char: firstName[0], x: singleCharWidth * 2 + spacing * 2 })
    positions.push({ char: firstName[1], x: targetWidth - singleCharWidth })
    return { positions, scale: 1, width: targetWidth }
  }

  // その他
  const totalSpace = targetWidth - fullName.length * singleCharWidth
  const spacing = totalSpace / (fullName.length + 1)
  fullName.split('').forEach((char, index) => {
    positions.push({
      char,
      x: spacing * (index + 1) + singleCharWidth * index,
    })
  })
  return { positions, scale: 1, width: targetWidth }
}
