import { getCharacterDimensions } from './getCharacterDimensions'

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

  const { width: singleCharWidth } = getCharacterDimensions({
    fontFamily,
    fontSize,
    text: 'あ',
  })

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

export const calculatePositionsFromSingleName = ({
  name,
  fontFamily,
  fontSize,
}: {
  name: string
  fontFamily: string
  fontSize: number
}): {
  positions: { char: string; x: number }[]
  scale: number
  width: number
} => {
  const { width: singleCharWidth } = getCharacterDimensions({
    fontFamily,
    fontSize,
    text: 'あ',
  })

  const targetWidth = singleCharWidth * 5
  const positions: { char: string; x: number }[] = []

  // 6文字以上の場合は縮小する
  if (name.length > 5) {
    const scale = targetWidth / (name.length * singleCharWidth)
    name.split('').forEach((char, index) => {
      positions.push({
        char,
        x: singleCharWidth * index,
      })
    })
    return { positions, scale, width: targetWidth }
  }

  // 1文字の場合は中央配置
  if (name.length === 1) {
    positions.push({
      char: name,
      x: (targetWidth - singleCharWidth) / 2,
    })
    return { positions, scale: 1, width: targetWidth }
  }

  // 2-4文字の場合は端に寄せて残りを均等配置
  if (name.length >= 2 && name.length <= 4) {
    // 最初の文字は左端
    positions.push({ char: name[0], x: 0 })

    if (name.length === 2) {
      // 2文字の場合は両端
      positions.push({ char: name[1], x: targetWidth - singleCharWidth })
    } else if (name.length === 3) {
      // 3文字の場合は左端、中央、右端
      positions.push({ char: name[1], x: (targetWidth - singleCharWidth) / 2 })
      positions.push({ char: name[2], x: targetWidth - singleCharWidth })
    } else {
      // 4文字の場合は名字2・名前2と同じ配置
      const spacing = (targetWidth - singleCharWidth * 4) / 3
      positions.push({ char: name[1], x: singleCharWidth + spacing })
      positions.push({ char: name[2], x: singleCharWidth * 2 + spacing * 2 })
      positions.push({ char: name[3], x: targetWidth - singleCharWidth })
    }
    return { positions, scale: 1, width: targetWidth }
  }

  // 5文字の場合は均等配置
  const spacing =
    (targetWidth - name.length * singleCharWidth) / (name.length - 1)
  name.split('').forEach((char, index) => {
    positions.push({
      char,
      x: (singleCharWidth + spacing) * index,
    })
  })
  return { positions, scale: 1, width: targetWidth }
}
