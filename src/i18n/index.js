import i18next from 'i18next'
import zhCN from './locales/zh-CN'
import enUS from './locales/en-US'

const resources = {
  'zh-CN': {
    translation: zhCN
  },
  'en-US': {
    translation: enUS
  }
}

// 初始化 i18next
i18next.init({
  lng: 'zh-CN',
  resources,
  fallbackLng: 'zh-CN'
})

/**
 * 设置语言
 * @param {string} language - 语言代码 'zh-CN' 或 'en-US'
 */
export const setLanguage = (language) => {
  i18next.changeLanguage(language)
}

/**
 * 翻译函数
 * @param {string} key - 翻译键
 * @returns {string} 翻译后的文本
 */
export const t = (key) => {
  if (!key) return ''
  return i18next.t(key) || key
}

/**
 * 通过翻译文本反查 Key（Key of Translation）
 * @param {string} value - 翻译后的文本
 * @param {string} prefix - 可选的键前缀（如 'label', 'palace', 'branch' 等），用于缩小搜索范围
 * @returns {string} 翻译键（带前缀）
 */
export const kot = (value, prefix = '') => {
  if (!value) return value
  
  // 如果已经包含前缀（如 'label.lifeLord'），直接返回
  if (value.includes('.')) {
    return value
  }
  
  // 在指定前缀范围内搜索
  const searchPrefix = prefix ? `${prefix}.` : ''
  
  for (const [, resource] of Object.entries(resources)) {
    for (const [key, translation] of Object.entries(resource.translation)) {
      // 如果指定了前缀，只搜索该前缀下的 key
      if (prefix && !key.startsWith(searchPrefix)) {
        continue
      }
      if (translation === value) {
        return key
      }
    }
  }
  
  // 如果没找到，且指定了前缀，返回带前缀的 key
  return prefix ? `${searchPrefix}${value}` : value
}

export default i18next

