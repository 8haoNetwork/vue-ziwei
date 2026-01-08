/**
 * i18n 翻译工具函数
 * 统一处理各种名称的翻译
 */

import { t, kot } from '../i18n'

/**
 * 翻译星曜名称
 * @param {string} starName - 星曜名称
 * @returns {string} 翻译后的星曜名称
 */
export function translateStarName(starName) {
  if (!starName) return ''
  const starKey = kot(starName, 'star')
  return t(starKey) || starName
}

/**
 * 翻译宫位名称
 * @param {string|Object} palaceName - 宫位名称或宫位对象（如果是对象，使用 label 或 name 属性）
 * @returns {string} 翻译后的宫位名称
 */
export function translatePalaceName(palaceName) {
  if (!palaceName) return ''
  
  // 如果是对象，尝试获取 label 或 name 属性
  let name = palaceName
  if (typeof palaceName === 'object') {
    name = palaceName.label || palaceName.name || ''
  }
  
  if (!name) return ''
  const palaceKey = kot(name, 'palace')
  return t(palaceKey) || name
}

/**
 * 翻译亮度状态
 * @param {string} brightness - 亮度状态
 * @returns {string} 翻译后的亮度状态
 */
export function translateBrightness(brightness) {
  if (!brightness) return ''
  const brightnessKey = kot(brightness, 'brightness')
  return t(brightnessKey) || brightness
}

/**
 * 翻译地支名称
 * @param {string} earthlyBranch - 地支名称
 * @returns {string} 翻译后的地支名称
 */
export function translateEarthlyBranch(earthlyBranch) {
  if (!earthlyBranch) return ''
  const branchKey = kot(earthlyBranch, 'branch')
  return t(branchKey) || earthlyBranch
}

/**
 * 翻译天干名称
 * @param {string} heavenlyStem - 天干名称
 * @returns {string} 翻译后的天干名称
 */
export function translateHeavenlyStem(heavenlyStem) {
  if (!heavenlyStem) return ''
  const stemKey = kot(heavenlyStem, 'stem')
  return t(stemKey) || heavenlyStem
}

/**
 * 翻译性别
 * @param {string} gender - 性别
 * @returns {string} 翻译后的性别
 */
export function translateGender(gender) {
  if (!gender) return ''
  const genderKey = kot(gender, 'gender')
  return t(genderKey) || gender
}

/**
 * 翻译五行局
 * @param {string} fiveElementsClass - 五行局
 * @returns {string} 翻译后的五行局
 */
export function translateFiveElementsClass(fiveElementsClass) {
  if (!fiveElementsClass) return ''
  // 注意：在 i18n 配置中，fiveElementsClass 使用的是 'fiveElements' 前缀
  const classKey = kot(fiveElementsClass, 'fiveElements')
  return t(classKey) || fiveElementsClass
}

