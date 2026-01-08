/**
 * 宫位工具函数
 * 只处理必要的转换，如宫位排序和运限数据合并
 */

import { normalizeMutagenType } from './mutagenUtils'

/**
 * 重新排序宫位：从命宫开始顺时针排列
 * @param {Array} palaces - 后端返回的宫位数组
 * @param {number} originPalaceIdx - 命宫索引
 * @returns {Array} 排序后的宫位数组
 */
export function sortPalacesFromOrigin(palaces, originPalaceIdx) {
  if (!palaces || !Array.isArray(palaces)) {
    return []
  }
  
  const sortedPalaces = []
  const startIndex = originPalaceIdx || 0
  
  for (let i = 0; i < 12; i++) {
    const idx = (startIndex + i) % 12
    const palace = palaces.find(p => p.index === idx)
    if (palace) {
      sortedPalaces.push(palace)
    }
  }
  
  return sortedPalaces
}

/**
 * 合并运限数据到宫位
 * @param {Array} palaces - 宫位数组
 * @param {Object} horoscope - 当前运限对象（包含 palaces 和 mutagen_stars）
 * @returns {Array} 合并后的宫位数组
 */
export function mergeHoroscopeData(palaces, horoscope) {
  if (!palaces || !Array.isArray(palaces)) {
    return palaces || []
  }
  
  if (!horoscope) {
    return palaces
  }
  
  // 获取 mutagen_stars 字典
  const mutagenStars = horoscope.mutagen_stars || {}
  
  // 处理星曜，添加 horoscope_mutagen 字段
  const processStars = (stars) => {
    if (!stars || !Array.isArray(stars)) return stars
    return stars.map(star => {
      // 检查该星曜是否在 mutagen_stars 字典中
      const mutagenStarName = mutagenStars[star.name]
      if (mutagenStarName) {
        const mutagenType = normalizeMutagenType(mutagenStarName)
        if (mutagenType) {
          return {
            ...star,
            horoscope_mutagen: mutagenType
          }
        }
      }
      return star
    })
  }
  
  // 合并运限数据到每个宫位
  return palaces.map(palace => ({
    ...palace,
    major_stars: processStars(palace.major_stars),
    minor_stars: processStars(palace.minor_stars),
    adj_stars: processStars(palace.adj_stars)
  }))
}

