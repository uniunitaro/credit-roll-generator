import { useEffect, useState } from 'react'

export const useAvailableFonts = (isRegularOnly = true) => {
  const [fonts, setFonts] = useState<
    {
      fullName: string
      family: string
      style?: string
    }[]
  >([])

  useEffect(() => {
    const getFonts = async () => {
      try {
        const availableFonts = await window.queryLocalFonts?.()
        if (!availableFonts) {
          throw new Error('queryLocalFonts is not available')
        }

        const filteredFonts = availableFonts.filter((font) => {
          if (isRegularOnly) {
            return font.style === 'Regular'
          }
          return true
        })

        // 同じfamilyのフォントは排除
        const familySet = new Set<string>()
        const uniqueFonts = filteredFonts.filter((font) => {
          if (familySet.has(font.family)) {
            return false
          }
          familySet.add(font.family)
          return true
        })

        setFonts(uniqueFonts)
      } catch (error) {
        setFonts([
          { fullName: 'ゴシック体', family: 'sans-serif' },
          { fullName: '明朝体', family: 'serif' },
          { fullName: '等幅', family: 'monospace' },
        ])
      }
    }

    getFonts()
  }, [isRegularOnly])

  return fonts
}
