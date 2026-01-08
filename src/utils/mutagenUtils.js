/**
 * 四化工具函数
 * 处理四化类型的标准化和翻译
 */

import { t, kot } from '../i18n'

/**
 * 标准化四化类型
 * 将各种格式的四化类型转换为标准格式（lu, quan, ke, ji）
 * @param {string} mutagenName - 四化类型名称（如 "sihuaLu", "化禄", "lu" 等）
 * @returns {string|null} 标准化的四化类型（'lu', 'quan', 'ke', 'ji'）或 null
 */
export function normalizeMutagenType(mutagenName) {
  if (!mutagenName) return null
  
  const lowerName = String(mutagenName).toLowerCase()
  
  // 支持格式：sihuaLu, sihuaQuan, sihuaKe, sihuaJi 等
  if (lowerName.includes('禄') || lowerName.includes('lu')) return 'lu'
  if (lowerName.includes('权') || lowerName.includes('quan')) return 'quan'
  if (lowerName.includes('科') || lowerName.includes('ke')) return 'ke'
  if (lowerName.includes('忌') || lowerName.includes('ji')) return 'ji'
  
  return null
}

/**
 * 获取四化类型的翻译文本
 * @param {string} mutagen - 四化类型（可以是标准化格式或原始格式）
 * @returns {string} 翻译后的四化名称（如 "禄", "权", "科", "忌"）
 */
export function getMutagenText(mutagen) {
  if (!mutagen) return ''
  
  // 先标准化四化类型
  const normalizedMutagen = normalizeMutagenType(mutagen)
  if (!normalizedMutagen) return mutagen
  
  // 使用 i18n 翻译
  const mutagenKey = kot(normalizedMutagen, 'mutagen')
  return t(mutagenKey) || normalizedMutagen
}

