<template>
  <div class="palace-content" v-if="palace">
    <!-- 身宫标识：左侧竖向显示 -->
    <div class="body-palace-label" v-if="isBodyPalace && activeTab === 'benming'">
      <div class="body-palace-text vertical-text">{{ t('palace.bodyPalace') }}</div>
    </div>
    
    <!-- 顶部：主星和辅星名称（竖排，同一行） -->
    <div class="stars-row" v-if="(palace.major_stars && palace.major_stars.length > 0) || (combinedMinorStars.length > 0)">
      <!-- 主星 -->
      <div 
        v-for="(star, sIndex) in palace.major_stars" 
        :key="sIndex" 
        class="star-group main-star-group"
        :class="getStarStatusClass(star.brightness)"
      >
        <div class="star-name-vertical" :style="getStarHighlightStyle(star)">{{ translateStarName(star.name) }}</div>
        <div class="star-brightness-text" v-if="star.brightness">{{ translateBrightness(star.brightness) }}</div>
        <!-- 四化星：本命1行，大限2行，其余3行 -->
        <div class="mutagen-rows" v-if="getStarMutagens(star).length > 0">
          <div 
            v-for="(mutagen, mIndex) in getStarMutagens(star)" 
            :key="mIndex"
            class="transform transform-star" 
            :style="mutagen.type ? { backgroundColor: mutagen.color } : {}"
          >
            <template v-if="mutagen.type">{{ getMutagenText(mutagen.type) }}</template>
            <template v-else>&nbsp;</template>
          </div>
        </div>
        <div v-if="flyingStarSelfTransform && getStarTransformTypes(star).length > 0" class="transform-indicator">
          <TransformIcon 
            v-for="(transform, tIndex) in getStarTransformTypes(star)"
            :key="tIndex"
            :type="transform.transform_type" 
            :custom-class="getTransformIconClassByMutagen(transform.mutagen_type)"
          />
        </div>
      </div>
      
      <!-- 辅星（全部显示） -->
      <div 
        v-for="(star, sIndex) in combinedMinorStars" 
        :key="'minor-' + sIndex" 
        class="star-group minor-star-group"
        :class="getStarTypeClass(star.type)"
      >
        <div class="star-name-vertical" :style="getStarHighlightStyle(star)">{{ translateStarName(star.name) }}</div>
        <div class="star-brightness-text" v-if="star.brightness">{{ translateBrightness(star.brightness) }}</div>
        <!-- 四化星：本命1行，大限2行，其余3行 -->
        <div class="mutagen-rows" v-if="getStarMutagens(star).length > 0">
          <div 
            v-for="(mutagen, mIndex) in getStarMutagens(star)" 
            :key="mIndex"
            class="transform transform-star" 
            :style="mutagen.type ? { backgroundColor: mutagen.color } : {}"
          >
            <template v-if="mutagen.type">{{ getMutagenText(mutagen.type) }}</template>
            <template v-else>&nbsp;</template>
          </div>
        </div>
        <div v-if="flyingStarSelfTransform && getStarTransformTypes(star).length > 0" class="transform-indicator">
          <TransformIcon 
            v-for="(transform, tIndex) in getStarTransformTypes(star)"
            :key="tIndex"
            :type="transform.transform_type" 
            :custom-class="getTransformIconClassByMutagen(transform.mutagen_type)"
          />
        </div>
      </div>
    </div>
    
    <!-- 中间左侧：流耀星名称（竖排，非本命盘显示） -->
    <div class="palace-left-container" v-if="activeTab !== 'benming' && dynamicStars.length > 0">
      <div class="dynamic-stars-vertical">
        <div 
          v-for="(star, sIndex) in dynamicStars" 
          :key="'dynamic-' + sIndex" 
          class="dynamic-star-item vertical-text"
        >
          {{ translateStarName(star) }}
        </div>
      </div>
    </div>
    <!-- 底部区域：年龄范围和底部信息 -->
    <div class="palace-bottom-container">
      <!-- 年龄范围 - 横排数字 -->
      <div class="palace-ages" v-if="activeTab === 'benming' && palace.decadal && palace.decadal.length > 0">
        <span v-for="(age, aIndex) in palace.decadal" :key="age" class="age-item">
          {{ age }}<span v-if="aIndex < palace.decadal.length - 1">,</span>
        </span>
      </div>
      
      <!-- 底部：左侧横向文字，中间宫位名称，右侧天干地支 -->
      <div class="palace-bottom">
        <!-- 左侧：运限神煞星曜横排文字 -->
        <div class="bottom-left" v-if="horoscopeSpiritStars.length > 0">
          <span 
            v-for="(star, sIndex) in horoscopeSpiritStars" 
            :key="'horoscope-' + sIndex" 
            class="extra-star-horizontal"
          >
            {{ translateStarName(star) }}
          </span>
        </div>
        
        <!-- 中间：运限宫位信息（两列显示） -->
        <div class="bottom-center">
          <div 
            class="age-range-info" 
            :class="{ 'age-range-in-range': isAgeRangeInRange }"
            v-if="activeTab === 'benming' && ageRangeInfo"
          >
            {{ ageRangeInfo }}
          </div>
          <div class="horoscope-palaces">
            <div class="horoscope-column">
              <div v-for="(item, idx) in leftColumn" :key="idx" class="horoscope-item">
                <span class="horoscope-text" :class="getHoroscopeTextClass(item.key)">{{ translatePalaceName(item) }}</span>
              </div>
            </div>
            <div class="horoscope-column">
              <div v-for="(item, idx) in rightColumn" :key="idx" class="horoscope-item">
                <span class="horoscope-text" :class="getHoroscopeTextClass(item.key)">{{ translatePalaceName(item) }}</span>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 右侧：长生十二神和地支信息 -->
        <div class="bottom-right" v-if="palace.life_12_star || (palace.heavenly_stem && palace.earthly_branch)">
          <div class="bottom-right-content">
            <!-- 长生十二神（横排） -->
            <div class="life-12-star" v-if="palace.life_12_star">
              {{ translateStarName(palace.life_12_star) }}
            </div>
            <!-- 地支（竖排） -->
            <div class="branch-text vertical-text" v-if="palace.heavenly_stem && palace.earthly_branch">
              {{ palace.heavenly_stem }}{{ palace.earthly_branch }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { t, kot } from '../i18n'
import { normalizeMutagenType, getMutagenText } from '../utils/mutagenUtils'
import { 
  translateStarName, 
  translatePalaceName, 
  translateBrightness 
} from '../utils/i18nUtils'
import TransformIcon from './TransformIcon.vue'

const props = defineProps({
  palace: {
    type: Object,
    default: null
  },
  activeTab: {
    type: String,
    default: 'benming'
  },
  backendRawData: {
    type: Object,
    default: null
  },
  clickedMutagenInfos: {
    type: Array,
    default: () => []
  },
  flyingStarSelfTransform: {
    type: Boolean,
    default: true
  }
})

// 合并 minor_stars 和 adj_stars
const combinedMinorStars = computed(() => {
  if (!props.palace) return []
  const minor = props.palace.minor_stars || []
  const adj = props.palace.adj_stars || []
  return [...minor, ...adj]
})

// 获取不同运限的宫位名称
const horoscopePalaces = computed(() => {
  if (!props.palace || !props.backendRawData) return []
  
  const currentPalaceIndex = props.palace.index
  const result = []
  
  const horoscopeKeys = ['benming', 'daxian', 'liunian', 'liuyue', 'liuri', 'liushi']
  // 获取每个运限的宫位名称
  const horoscopeMap = {
    'benming': props.backendRawData.natal,
    'daxian': props.backendRawData.decadal,
    'liunian': props.backendRawData.yearly,
    'liuyue': props.backendRawData.monthly,
    'liuri': props.backendRawData.daily,
    'liushi': props.backendRawData.hourly
  }
  
  horoscopeKeys.forEach(key => {
    const horoscope = horoscopeMap[key]
    if (!horoscope || !horoscope.palaces) return
    
    // 使用 palaces 字段
    const palace = horoscope.palaces.find(p => p.index === currentPalaceIndex)
    if (palace && palace.name) {
      result.push({
        key,
        label: palace.name,
      })
    }
  })
  
  return result
})

// 左列：流时、流日、流月（只在流时时显示）
const leftColumn = computed(() => {
  // 根据当前 activeTab，确定应该显示哪些运限
  let keysToShow = []
  
  if (props.activeTab === 'liuyue') {
    keysToShow = ['liuyue']
  } else if (props.activeTab === 'liuri') {
    keysToShow = ['liuri', 'liuyue']
  } else if (props.activeTab === 'liushi') {
    keysToShow = ['liushi', 'liuri', 'liuyue']
  }
  
  return horoscopePalaces.value.filter(item => 
    keysToShow.includes(item.key)
  )
})

// 右列：根据 activeTab 动态计算显示的运限
const rightColumn = computed(() => {
  // 根据当前 activeTab，确定应该显示哪些运限
  let keysToShow = []
  
  if (props.activeTab === 'benming') {
    keysToShow = ['benming']
  } else if (props.activeTab === 'daxian') {
    keysToShow = ['daxian', 'benming']
  } else {
    keysToShow = ['liunian', 'daxian', 'benming']
  } 
  
  return horoscopePalaces.value.filter(item => 
    keysToShow.includes(item.key)
  )
})

// 获取当前运限的星曜（根据 activeTab 决定）
const horoscopeSpiritStars = computed(() => {
  if (!props.palace || !props.backendRawData) return []
  
  const currentPalaceIndex = props.palace.index
  
  // 根据当前 tab 决定使用哪个运限的 stars
  const horoscopeMap = {
    'benming': props.backendRawData.natal,
    'daxian': props.backendRawData.decadal,
    'liunian': props.backendRawData.yearly,
    'liuyue': props.backendRawData.monthly,
    'liuri': props.backendRawData.daily,
    'liushi': props.backendRawData.hourly
  }
  
  const currentHoroscope = horoscopeMap[props.activeTab] || props.backendRawData.natal
  if (!currentHoroscope || !currentHoroscope.palaces) return []
  
  // 使用 palaces 字段
  const palace = currentHoroscope.palaces.find(p => p.index === currentPalaceIndex)
  if (!palace || !palace.spirit_stars) return []
  
  return palace.spirit_stars || []
})

// 获取当前运限的流耀星（dynamic_stars，非本命盘）
// 显示当前 tab 和前两个 tab 的流耀
const dynamicStars = computed(() => {
  if (!props.palace || !props.backendRawData || props.activeTab === 'benming') return []
  
  const currentPalaceIndex = props.palace.index
  
  // 定义所有 tab 的顺序（排除 benming，因为它没有 dynamic_stars）
  const tabOrder = ['daxian', 'liunian', 'liuyue', 'liuri', 'liushi']
  
  // 找到当前 tab 在顺序中的位置
  const currentIndex = tabOrder.indexOf(props.activeTab)
  if (currentIndex === -1) return []
  
  // 确定要显示的 tab 列表：当前 tab 和前两个 tab（如果存在）
  const tabsToShow = []
  for (let i = Math.max(0, currentIndex - 2); i <= currentIndex; i++) {
    tabsToShow.push(tabOrder[i])
  }
  
  // 根据当前 tab 决定使用哪个运限的 dynamic_stars
  const horoscopeMap = {
    'daxian': props.backendRawData.decadal,
    'liunian': props.backendRawData.yearly,
    'liuyue': props.backendRawData.monthly,
    'liuri': props.backendRawData.daily,
    'liushi': props.backendRawData.hourly
  }
  
  // 收集所有需要显示的流耀星
  const allStars = []
  tabsToShow.forEach(tabKey => {
    const horoscope = horoscopeMap[tabKey]
    if (!horoscope || !horoscope.palaces) return
    
    const palace = horoscope.palaces.find(p => p.index === currentPalaceIndex)
    if (palace && palace.dynamic_stars && palace.dynamic_stars.length > 0) {
      allStars.push(...palace.dynamic_stars)
    }
  })
  
  return allStars
})

// 判断是否是身宫
const isBodyPalace = computed(() => {
  if (!props.palace || !props.backendRawData) {
    return false
  }
  // body_palace_idx 是后端原始索引（从寅宫开始，0-11）
  // palace.index 也是后端原始索引，所以可以直接比较
  const bodyPalaceIdx = props.backendRawData.body_palace_idx
  if (bodyPalaceIdx === undefined || bodyPalaceIdx === null) {
    return false
  }
  // 确保类型一致进行比较
  return Number(props.palace.index) === Number(bodyPalaceIdx)
})

// 获取本命的年龄范围信息
const ageRangeInfo = computed(() => {
  if (props.activeTab !== 'benming' || !props.palace || !props.backendRawData) {
    return null
  }
  
  const natal = props.backendRawData.natal
  if (!natal || !natal.palaces) {
    return null
  }
  
  const currentPalaceIndex = props.palace.index
  const item = natal.palaces.find(i => i.index === currentPalaceIndex)
  if (item && item.range_start !== undefined && item.range_end !== undefined) {
    return `${item.range_start}-${item.range_end}`
  }
  
  return null
})

// 判断年龄范围是否在范围内（in_range）
const isAgeRangeInRange = computed(() => {
  if (props.activeTab !== 'benming' || !props.palace || !props.backendRawData) {
    return false
  }
  
  const natal = props.backendRawData.natal
  if (!natal || !natal.palaces) {
    return false
  }
  
  const currentPalaceIndex = props.palace.index
  const item = natal.palaces.find(i => i.index === currentPalaceIndex)
  if (item && item.in_range !== undefined && item.in_range !== null) {
    return item.in_range === true
  }
  
  return false
})

// 获取星曜亮度状态样式类
const getStarStatusClass = (brightness) => {
  if (!brightness) return ''
  
  // 先通过 kot 将状态转换为键名，然后翻译
  const statusKey = kot(brightness, 'brightness') || brightness
  const translatedStatus = t(statusKey)
  
  const statusMap = {
    '庙': 'brightness-miao',
    '旺': 'brightness-wang',
    '得': 'brightness-de',
    '利': 'brightness-li',
    '平': 'brightness-ping',
    '不得地': 'brightness-budedi',
    '陷': 'brightness-xian'
  }
  
  return statusMap[translatedStatus] || ''
}

// 翻译亮度状态（使用 i18n）
// 翻译函数已从 i18nUtils 导入

// 获取运限文本的样式类
const getHoroscopeTextClass = (key) => {
  const classMap = {
    'benming': 'horoscope-benming',
    'daxian': 'horoscope-daxian',
    'liunian': 'horoscope-liunian',
    'liuyue': 'horoscope-liuyue',
    'liuri': 'horoscope-liuri',
    'liushi': 'horoscope-liushi'
  }
  return classMap[key] || ''
}

// 获取星曜类型样式类
const getStarTypeClass = (type) => {
  if (!type) return 'star-type-other'
  
  const typeMap = {
    'major': 'star-type-major',
    'soft': 'star-type-soft',
    'tough': 'star-type-tough',
    'adjective': 'star-type-adjective',
    'flower': 'star-type-flower',
    'helper': 'star-type-helper',
    'lucun': 'star-type-lucun',
    'tianma': 'star-type-tianma'
  }
  
  return typeMap[type] || 'star-type-other'
}

// 获取四化文字
// getMutagenText 已从 mutagenUtils 导入

// 获取星曜的 transform_types 数组
const getStarTransformTypes = (star) => {
  if (!star || !star.transform_types || !Array.isArray(star.transform_types)) {
    return []
  }
  return star.transform_types.filter(t => t && (t.transform_type === 'self' || t.transform_type === 'opposite'))
}

// 根据 mutagen_type 获取图标颜色类
const getTransformIconClassByMutagen = (mutagenType) => {
  if (!mutagenType) return ''
  
  // 将 sihuaKe 转换为 ke 等
  const normalizedType = getMutagenType(mutagenType)
  if (!normalizedType) return ''
  
  return `transform-icon-${normalizedType}`
}

// 获取自化/对宫化入图标的颜色类（保留兼容性）
const getTransformIconClass = (star) => {
  if (!star || !star.mutagen_type) {
    return ''
  }

  // 从 star 对象中获取已保存的四化类型
  // 返回对应的颜色类
  return `transform-icon-${star.mutagen_type}`
}

// normalizeMutagenType 已从 mutagenUtils 导入
// 为了保持兼容性，创建一个别名
const getMutagenType = normalizeMutagenType

// 获取tab颜色
const getTabColor = (tabKey) => {
  const colorMap = {
    'benming': 'var(--color-horoscope-benming)',
    'daxian': 'var(--color-horoscope-daxian)',
    'liunian': 'var(--color-horoscope-liunian)',
    'liuyue': 'var(--color-horoscope-liuyue)',
    'liuri': 'var(--color-horoscope-liuri)',
    'liushi': 'var(--color-horoscope-liushi)'
  }
  return colorMap[tabKey] || '#666'
}

// 获取星曜在不同tab下的四化信息
// 本命：1行，大限：2行（本命+大限），其余：3行（前两个tab+当前tab）
const getStarMutagens = (star) => {
  if (!star || !star.name || !props.backendRawData) return []
  
  const tabOrder = ['benming', 'daxian', 'liunian', 'liuyue', 'liuri', 'liushi']
  const currentIndex = tabOrder.indexOf(props.activeTab)
  if (currentIndex === -1) return []
  
  // 根据当前tab确定要显示的行数
  let tabsToCheck = []
  if (props.activeTab === 'benming') {
    // 本命：只显示本命（1行）
    tabsToCheck = ['benming']
  } else if (props.activeTab === 'daxian') {
    // 大限：显示本命和大限（2行）
    tabsToCheck = ['benming', 'daxian']
  } else {
    // 其余：显示前两个tab + 当前tab（3行）
    for (let i = Math.max(0, currentIndex - 2); i <= currentIndex; i++) {
      tabsToCheck.push(tabOrder[i])
    }
  }
  
  const horoscopeMap = {
    'benming': props.backendRawData.natal,
    'daxian': props.backendRawData.decadal,
    'liunian': props.backendRawData.yearly,
    'liuyue': props.backendRawData.monthly,
    'liuri': props.backendRawData.daily,
    'liushi': props.backendRawData.hourly
  }
  
  // 始终返回固定数量的元素，即使没有四化星也要保留空间
  const mutagens = []
  tabsToCheck.forEach(tabKey => {
    const horoscope = horoscopeMap[tabKey]
    let mutagenData = {
      type: null,
      color: getTabColor(tabKey),
      tabKey: tabKey
    }
    
    if (horoscope && horoscope.mutagen_stars) {
      const mutagenStarName = horoscope.mutagen_stars[star.name]
      if (mutagenStarName) {
        const mutagenType = getMutagenType(mutagenStarName)
        if (mutagenType) {
          mutagenData.type = mutagenType
        }
      }
    }
    
    mutagens.push(mutagenData)
  })
  
  return mutagens
}

// 获取星曜的高亮样式（基于 clickedMutagenInfos）
const getStarHighlightStyle = (star) => {
  if (!star || !star.name || !props.clickedMutagenInfos || props.clickedMutagenInfos.length === 0) {
    return {}
  }
  
  if (!props.palace || props.palace.index === undefined) {
    return {}
  }
  
  // 查找匹配的 mutagen_info
  const matchedInfo = props.clickedMutagenInfos.find(info => 
    info.star_name === star.name && info.palace_index === props.palace.index
  )
  
  if (!matchedInfo || !matchedInfo.mutagen_type) {
    return {}
  }
  
  // 根据 mutagen_type 获取颜色
  const normalizedType = getMutagenType(matchedInfo.mutagen_type)
  if (!normalizedType) {
    return {}
  }
  
  // 使用 CSS 变量获取四化颜色
  const colorVarMap = {
    'lu': 'var(--color-mutagen-lu)',   // 绿色 - 禄
    'quan': 'var(--color-mutagen-quan)', // 橙色 - 权
    'ke': 'var(--color-mutagen-ke)',   // 蓝色 - 科
    'ji': 'var(--color-mutagen-ji)'    // 红色 - 忌
  }
  
  const backgroundColor = colorVarMap[normalizedType]
  if (!backgroundColor) {
    return {}
  }
  
  // 返回背景色样式，字体为白色
  return {
    backgroundColor: backgroundColor,
    color: '#ffffff',
    borderRadius: '2px',
  }
}
</script>

<style scoped>
.palace-content {
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
  padding: 3px;
  justify-content: space-between;
  font-size: 10px;
}

/* 身宫标识：左侧竖向显示 */
.body-palace-label {
  position: absolute;
  left: 2px;
  top: 40%;
  transform: translateY(-50%);
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: flex-start;
}

.body-palace-text {
  writing-mode: vertical-rl;
  text-orientation: upright;
  font-size: 9px;
  font-weight: 600;
  color:rgb(243, 117, 117);
  line-height: 0.5;
  padding: 2px 4px;
  border: 1px solid rgb(243, 117, 117);
  border-radius: 2px;
}

/* 竖排文字基础样式 */
.vertical-text {
  writing-mode: vertical-rl;
  text-orientation: upright;
}

/* 中间左侧：流耀星名称（竖排） */
.palace-left-container {
  position: absolute;
  left: 2px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 5;
  display: flex;
  align-items: center;
  justify-content: flex-start;
}

.dynamic-stars-vertical {
  display: flex;
  flex-direction: row;
  gap: 0px;
  align-items: flex-end;
}

.dynamic-star-item {
  font-size: 9px;
  line-height: 1.1;
}

/* 顶部：主星和辅星区域 - 横排，每个星体名称竖排，同一行，从右到左排列，右对齐 */
.stars-row {
  display: flex;
  flex-direction: row-reverse;
  flex-wrap: wrap-reverse;
  margin-bottom: 2px;
  align-items: flex-end;
  justify-content: flex-start;
}

.star-group {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  gap: 1px;
}

.main-star-group {
  min-width: 3px;
}

.minor-star-group {
  min-width: 2px;
}

.star-name-vertical {
  writing-mode: vertical-rl;
  text-orientation: upright;
  font-size: 11px;
  color: #1a1a1a;
  line-height: 1.2;
  text-align: center;
  padding: 2px 0 2px 0;
}

.star-brightness-text {
  font-size: 9px;
  color: #666;
  writing-mode: horizontal-tb;
  text-align: center;
  width: 100%;
}

/* 四化星多行容器 */
.mutagen-rows {
  display: flex;
  flex-direction: column;
  gap: 0;
  align-items: center;
}

/* 星曜下方的四化标识，使用 transform 样式 */
.transform-star {
  font-size: 8px;
  padding: 1px 3px;
  width: auto;
  min-width: 12px;
}

/* 星曜亮度颜色 - 根据传统紫微斗数盘样式 */
.brightness-miao .star-name-vertical {
  color: #c62828;  /* 深红色 - 庙 */
}

.brightness-wang .star-name-vertical {
  color: #e65100;  /* 深橙色 - 旺 */
}

.brightness-de .star-name-vertical {
  color: #2e7d32;  /* 深绿色 - 得 */
}

.brightness-li .star-name-vertical {
  color: #1565c0;  /* 深蓝色 - 利 */
}

.brightness-ping .star-name-vertical {
  color: #424242;  /* 深灰色 - 平 */
}

.brightness-budedi .star-name-vertical {
  color: #757575;  /* 灰色 - 不得地 */
}

.brightness-xian .star-name-vertical {
  color: #757575;  /* 灰色 - 陷（提高对比度，去掉透明度） */
}

/* 辅星样式 */
.minor-star-group .star-name-vertical {
  font-size: 10px;
}

/* 星曜下方的自化和对宫化入标识 */
.transform-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2px;
  margin-top: 1px;
  width: 100%;
  flex-direction: column;
}


/* 自化/对宫化入图标的四化颜色 */
.transform-icon-lu {
  color: var(--color-mutagen-lu); /* 绿色 - 禄 */
}

.transform-icon-quan {
  color: var(--color-mutagen-quan); /* 橙色 - 权 */
}

.transform-icon-ke {
  color: var(--color-mutagen-ke); /* 蓝色 - 科 */
}

.transform-icon-ji {
  color: var(--color-mutagen-ji); /* 红色 - 忌 */
}

.transform {
  display: inline-block;
  padding: 2px 2px;
  border-radius: 2px;
  font-size: 9px;
  color: #fff;
  text-align: center;
  line-height: 1.2;
}

.transform-lu {
  background-color: var(--color-mutagen-lu);
}

.transform-quan {
  background-color: var(--color-mutagen-quan);
}

.transform-ke {
  background-color: var(--color-mutagen-ke);
}

.transform-ji {
  background-color: var(--color-mutagen-ji);
}

/* 底部区域容器 */
.palace-bottom-container {
  margin-top: auto;
  display: flex;
  flex-direction: column;
}

/* 底部区域布局 */
.palace-bottom {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: flex-end;
  padding-top: 2px;
  min-height: 25px;
  position: relative;
}

.bottom-left {
  position: absolute;
  left: 0;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1px;
  font-size: 9px;
  color: #666;
}

.extra-star-horizontal {
  writing-mode: horizontal-tb;
  text-orientation: mixed;
  line-height: 1.2;
  display: inline-block;
}

.bottom-center {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  flex-direction: column;
  flex: 0 0 auto;
  min-width: 60px;
  min-height: 35px;
  width: 60px;
}

.palace-name-highlight {
  font-size: 12px;
  color: #c62828;  /* 红色高亮 */
  writing-mode: horizontal-tb;
}

/* 年龄范围信息 */
.age-range-info {
  font-size: 8px;
  color:rgb(23, 22, 22);
  text-align: left;
  width: 100%;
  margin-bottom: 2px;
  padding-left: 2px;
}

/* 年龄范围在范围内时的外框样式 */
.age-range-info.age-range-in-range {
  border: 1px solid;
  border-radius: 2px;
  padding: 1px 2px;
  display: inline-block;
  width: fit-content;
  margin-left: 0;
  align-self: flex-start;
}

/* 运限宫位信息两列布局 */
.horoscope-palaces {
  display: flex;
  gap: 4px;
  align-items: flex-end;
  justify-content: center;
  width: 100%;
}

.horoscope-column {
  display: flex;
  flex-direction: column-reverse;
  gap: 2px;
  flex: 0 0 auto;
  min-width: 30px;
}

.horoscope-column:first-child {
  align-items: flex-end;
}

.horoscope-column:last-child {
  align-items: flex-start;
}

.horoscope-item {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 8px;
  line-height: 1;
}

.horoscope-text {
  color: #333;
  font-weight: 600;
  font-size: 9px;
}

/* 不同运限的颜色 */
.horoscope-benming {
  color: var(--color-horoscope-benming);
}

.horoscope-daxian {
  color: var(--color-horoscope-daxian);
}

.horoscope-liunian {
  color: var(--color-horoscope-liunian);
}

.horoscope-liuyue {
  color: var(--color-horoscope-liuyue);
}

.horoscope-liuri {
  color: var(--color-horoscope-liuri);
}

.horoscope-liushi {
  color: var(--color-horoscope-liushi);
}

.bottom-right {
  position: absolute;
  right: 0;
  display: flex;
  justify-content: flex-end;
  align-items: flex-start;
  font-size: 9px;
  text-align: right;
}

.bottom-right-content {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 2px;
}

.life-12-star {
  font-size: 9px;
  line-height: 1.2;
  text-align: right;
  color: #333;
}

.branch-text {
  writing-mode: vertical-rl;
  text-orientation: upright;
  line-height: 1.2;
  text-align: right;
}

/* 星曜类型颜色 - 区分不同类型 */
.star-type-major {
  color: #1a1a1a;
  font-size: 10px;
}

.star-type-soft {
  color: #1565c0;  /* 蓝色 - 软星 */
}

.star-type-tough {
  color: #c62828;  /* 红色 - 硬星 */
}

.star-type-adjective {
  color: #6a1b9a;  /* 紫色 - 杂曜 */
}

.star-type-flower {
  color: #ad1457;  /* 深粉色 - 桃花星 */
}

.star-type-helper {
  color: #2e7d32;  /* 绿色 - 辅助星 */
}

.star-type-lucun {
  color: #e65100;  /* 橙色 - 禄存 */
}

.star-type-tianma {
  color: #00695c;  /* 深青色 - 天马 */
}

.star-type-other {
  color: #616161;
}

/* 年龄范围 - 横排数字 */
.palace-ages {
  display: flex;
  flex-direction: row;
  gap: 1px;
  margin: 0;
  margin-bottom: 2px;
  font-size: 8px;
  color:rgb(38, 37, 37);
  line-height: 1.2;
  justify-content: start;
  align-items: center;
  flex-wrap: wrap;
}

.age-item {
  display: inline-block;
  padding: 0 1px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .palace-content {
    padding: 2px;
    font-size: 9px;
  }

  .star-name-vertical {
    font-size: 8px;
  }
  
  .minor-star-group .star-name-vertical {
    font-size: 8px;
  }

  .star-brightness-text {
    font-size: 8px;
  }

  .stars-row {
    gap: 0px;
    margin-bottom: 1px;
  }

  .main-star-group {
    min-width: 1px;
  }

  .minor-star-group {
    min-width: 1px;
  }

  .dynamic-star-item {
    font-size: 8px;
  }  

  .transform {
    font-size: 8px;
    padding: 1px 1px;
  }

  .palace-ages {
    font-size: 7px;
    gap: 1px;
  }

  .palace-name-highlight {
    font-size: 10px;
  }

  .bottom-left {
    font-size: 8px;
  }

  .bottom-right {
    font-size: 9px;
  }

  .life-12-star {
    font-size: 7px;
  }

  .age-range-info {
    font-size: 6px;
  }

  .transform-star {
    min-width: 1px;
  }

}

@media (max-width: 480px) {
  .palace-content {
    padding: 2px;
    font-size: 8px;
  }

  .star-name-vertical {
    font-size: 8px;
    padding: 1px 0 1px 0;
  }
  
  .minor-star-group .star-name-vertical {
    font-size: 7px;
  }

  .star-brightness-text {
    font-size: 6px;
  }

  .dynamic-star-item {
    font-size: 7px;
  }  

  .transform {
    font-size: 7px;
    padding: 1px 1px;
  }

  .palace-ages {
    font-size: 6px;
  }

  .palace-name-highlight {
    font-size: 9px;
  }

  .bottom-left {
    font-size: 7px;
  }
  .bottom-right {
    font-size: 8px;
  }
}
</style>

