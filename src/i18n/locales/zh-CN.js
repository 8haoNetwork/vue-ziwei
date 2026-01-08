import star from './zh-CN/star'
import palace from './zh-CN/palace'
import brightness from './zh-CN/brightness'
import mutagen from './zh-CN/mutagen'
import gender from './zh-CN/gender'
import heavenlyStem from './zh-CN/heavenlyStem'
import earthlyBranch from './zh-CN/earthlyBranch'
import fiveElementsClass from './zh-CN/fiveElementsClass'
import label from './zh-CN/label'

// 为每个模块添加前缀，避免 key 冲突
const addPrefix = (obj, prefix) => {
  const result = {}
  for (const [key, value] of Object.entries(obj)) {
    result[`${prefix}.${key}`] = value
  }
  return result
}

export default {
  ...addPrefix(star, 'star'),
  ...addPrefix(palace, 'palace'),
  ...addPrefix(brightness, 'brightness'),
  ...addPrefix(mutagen, 'mutagen'),
  ...addPrefix(gender, 'gender'),
  ...addPrefix(heavenlyStem, 'stem'),
  ...addPrefix(earthlyBranch, 'branch'),
  ...addPrefix(fiveElementsClass, 'fiveElements'),
  ...addPrefix(label, 'label')
}

