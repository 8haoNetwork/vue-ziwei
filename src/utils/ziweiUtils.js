/**
 * 紫微斗数工具函数
 * 包含三合对宫计算等功能
 * 
 * 注意：翻译功能已迁移到 i18n 系统，请使用 src/i18n/index.js 中的 t() 和 kot() 函数
 */

/**
 * 修正索引（处理12宫循环）
 * @param {number} index - 原始索引
 * @param {number} max - 最大值（默认12）
 * @returns {number} 修正后的索引
 */
function fixIndex(index, max = 12) {
  while (index < 0) {
    index += max
  }
  while (index >= max) {
    index -= max
  }
  return index
}

/**
 * 根据宫位索引获取三方四正宫位索引
 * 三方四正包括：本宫、对宫（+6）、财帛位（+8）、官禄位（+4）
 * 
 * @param {number} palaceIndex - 宫位索引（0-11）
 * @returns {Object} 包含本宫、对宫、财帛位、官禄位的索引
 */
export function getSurroundedPalacesIndex(palaceIndex) {
  if (palaceIndex < 0 || palaceIndex > 11) {
    throw new Error('Palace index must be between 0 and 11')
  }
  
  return {
    target: palaceIndex,        // 本宫
    opposite: fixIndex(palaceIndex + 6),  // 对宫（+6）
    wealth: fixIndex(palaceIndex + 8),    // 财帛位（+8）
    career: fixIndex(palaceIndex + 4)     // 官禄位（+4）
  }
}

/**
 * 获取高亮宫位索引数组（包括本宫、对宫、三合位）
 * 
 * @param {number|string} palaceIndexOrName - 宫位索引或名称
 * @param {Array} palaces - 宫位数组（可选，如果传入名称则需要）
 * @returns {Array<number>} 需要高亮的宫位索引数组
 */
export function getHighlightedPalaces(palaceIndexOrName, palaces = null) {
  let targetIndex
  
  if (typeof palaceIndexOrName === 'number') {
    targetIndex = palaceIndexOrName
  } else if (typeof palaceIndexOrName === 'string' && palaces) {
    const index = palaces.findIndex(p => p.name === palaceIndexOrName)
    if (index === -1) {
      return []
    }
    targetIndex = index
  } else {
    return []
  }
  
  const surrounded = getSurroundedPalacesIndex(targetIndex)
  
  // 返回需要高亮的索引数组：本宫、对宫、财帛位、官禄位
  return [
    surrounded.target,
    surrounded.opposite,
    surrounded.wealth,
    surrounded.career
  ]
}

/**
 * 检查宫位是否应该高亮
 * 
 * @param {number} palaceIndex - 当前宫位索引
 * @param {Array<number>} highlightedIndices - 需要高亮的索引数组
 * @returns {boolean} 是否应该高亮
 */
export function shouldHighlightPalace(palaceIndex, highlightedIndices) {
  if (!highlightedIndices || !Array.isArray(highlightedIndices)) {
    return false
  }
  return highlightedIndices.includes(palaceIndex)
}


