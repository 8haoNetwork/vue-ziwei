<template>
  <div class="ziwei-chart-container chart-container">
    <!-- 顶部导航栏 -->
    <div class="header chart-header">
      <button class="back-btn chart-back-btn" @click="goBack">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
      <div class="header-title chart-header-title">紫微</div>
      <div class="header-right chart-header-right">
        <button class="icon-btn chart-icon-btn" @click="showParameters = true">参数</button>
        <button class="icon-btn chart-icon-btn" @click="showSettings = true">设置</button>
      </div>
    </div>

    <!-- 4x4传统布局星盘 -->
    <div class="palace-grid-4x4 chart-palace-grid-4x4" v-if="chartData && chartData.palaces">
      <!-- 第1行：福德、父母、命宫、兄弟 -->
      <div 
        class="palace-box chart-palace-box" 
        :class="getPalaceBoxClass(0)"
        @click="handlePalaceClick(getPalaceIndexByPosition(0))"
      >
        <PalaceContent :palace="getPalaceByPosition(0)" :activeTab="activeTab" :backendRawData="backendRawData" :clickedMutagenInfos="clickedMutagenInfos" :flying-star-self-transform="currentSettings.flying_star_self_transform" />
      </div>
      <div 
        class="palace-box chart-palace-box" 
        :class="getPalaceBoxClass(1)"
        @click="handlePalaceClick(getPalaceIndexByPosition(1))"
      >
        <PalaceContent :palace="getPalaceByPosition(1)" :activeTab="activeTab" :backendRawData="backendRawData" :clickedMutagenInfos="clickedMutagenInfos" :flying-star-self-transform="currentSettings.flying_star_self_transform" />
      </div>
      <div 
        class="palace-box chart-palace-box" 
        :class="getPalaceBoxClass(2)"
        @click="handlePalaceClick(getPalaceIndexByPosition(2))"
      >
        <PalaceContent :palace="getPalaceByPosition(2)" :activeTab="activeTab" :backendRawData="backendRawData" :clickedMutagenInfos="clickedMutagenInfos" :flying-star-self-transform="currentSettings.flying_star_self_transform" />
      </div>
      <div 
        class="palace-box chart-palace-box" 
        :class="getPalaceBoxClass(3)"
        @click="handlePalaceClick(getPalaceIndexByPosition(3))"
      >
        <PalaceContent :palace="getPalaceByPosition(3)" :activeTab="activeTab" :backendRawData="backendRawData" :clickedMutagenInfos="clickedMutagenInfos" :flying-star-self-transform="currentSettings.flying_star_self_transform" />
      </div>
      
      <!-- 第2行：田宅、[中间信息]、[中间信息]、夫妻 -->
      <div 
        class="palace-box chart-palace-box" 
        :class="getPalaceBoxClass(4)"
        @click="handlePalaceClick(getPalaceIndexByPosition(4))"
      >
        <PalaceContent :palace="getPalaceByPosition(4)" :activeTab="activeTab" :backendRawData="backendRawData" :clickedMutagenInfos="clickedMutagenInfos" :flying-star-self-transform="currentSettings.flying_star_self_transform" />
      </div>
      <!-- 中间信息块（合并2x2） -->
      <div class="info-block-center chart-info-block-center" v-if="chartData">
        <div class="info-content chart-info-content">
          <div class="info-row info-row-title chart-info-row chart-info-row-title">
            <span>{{ translateGender(chartData.gender) }} {{ translateFiveElementsClass(chartData.five_elements_class) }}</span>
          </div>
          <div class="info-row chart-info-row">
            <span class="info-label chart-info-label">{{ t('label.beijingTime') }}</span>
            <span class="info-value chart-info-value">{{ chartData.solar_date }} {{ chartData.birthTime || '' }}</span>
          </div>
          <div class="info-row chart-info-row">
            <span class="info-label chart-info-label">{{ t('label.lunarCalendar') }}</span>
            <span class="info-value chart-info-value">{{ chartData.lunar_date }}</span>
          </div>
          <div class="info-row chart-info-row">
            <span class="info-label chart-info-label">{{ t('label.ganzhi') }}</span>
            <span class="info-value chart-info-value">{{ chartData.chinese_date }}</span>
          </div>
          <div class="info-row chart-info-row">
            <span class="info-label chart-info-label">{{ t('label.zodiac') }}</span>
            <span class="info-value chart-info-value">{{ chartData.zodiac }}</span>
          </div>
          <div class="info-row chart-info-row">
            <span class="info-label chart-info-label">{{ t('label.lifeLord') }}</span>
            <span class="info-value chart-info-value">{{ translateStarName(chartData.soul_lord) || '' }}</span>
            <span class="info-label info-label-spaced chart-info-label chart-info-label-spaced">{{ t('label.bodyLord') }}</span>
            <span class="info-value chart-info-value">{{ translateStarName(chartData.body_lord) || '' }}</span>
          </div>
          <div class="info-row chart-info-row">
            <span class="info-label chart-info-label">{{ t('label.ziYearDoujun') }}</span>
            <span class="info-value chart-info-value">{{ translateEarthlyBranch(chartData.birth_year_doujun) || '' }}</span>
            <span class="info-label info-label-spaced chart-info-label chart-info-label-spaced">{{ t('label.yearlyDoujun') }}</span>
            <span class="info-value chart-info-value">{{ translateEarthlyBranch(chartData.current_year_doujun) || '' }}</span>
          </div>
          <div v-if="currentSettings.flying_star_self_transform" class="info-row transform-indicators chart-info-row chart-transform-indicators">
            <span class="self-transform-indicator chart-self-transform-indicator">
              <span>{{ t('label.selfTransform') }}  </span>
              <TransformIcon type="self" />
            </span>
            <span class="opposite-transform-indicator chart-opposite-transform-indicator">
              <span>{{ t('label.oppositeTransform') }}  </span>
              <TransformIcon type="opposite" />
            </span>
          </div>
          <div class="info-row chart-info-row">
            <span class="transform-legend chart-transform-legend">
              {{ t('label.fourTransformationsColors') }} > 
              <span class="color-lu chart-color-lu">禄</span> > 
              <span class="color-quan chart-color-quan">权</span> > 
              <span class="color-ke chart-color-ke">科</span> > 
              <span class="color-ji chart-color-ji">忌</span>
            </span>
          </div>
        </div>
      </div>
      <div 
        class="palace-box chart-palace-box" 
        :class="getPalaceBoxClass(5)"
        @click="handlePalaceClick(getPalaceIndexByPosition(5))"
      >
        <PalaceContent :palace="getPalaceByPosition(5)" :activeTab="activeTab" :backendRawData="backendRawData" :clickedMutagenInfos="clickedMutagenInfos" :flying-star-self-transform="currentSettings.flying_star_self_transform" />
      </div>
      
      <!-- 第3行：官禄、[中间信息]、[中间信息]、子女 -->
      <div 
        class="palace-box chart-palace-box" 
        :class="getPalaceBoxClass(6)"
        @click="handlePalaceClick(getPalaceIndexByPosition(6))"
      >
        <PalaceContent :palace="getPalaceByPosition(6)" :activeTab="activeTab" :backendRawData="backendRawData" :clickedMutagenInfos="clickedMutagenInfos" :flying-star-self-transform="currentSettings.flying_star_self_transform" />
      </div>
      <div 
        class="palace-box chart-palace-box" 
        :class="getPalaceBoxClass(7)"
        @click="handlePalaceClick(getPalaceIndexByPosition(7))"
      >
        <PalaceContent :palace="getPalaceByPosition(7)" :activeTab="activeTab" :backendRawData="backendRawData" :clickedMutagenInfos="clickedMutagenInfos" :flying-star-self-transform="currentSettings.flying_star_self_transform" />
      </div>
      
      <!-- 第4行：交友、迁移、疾厄、财帛 -->
      <div 
        class="palace-box chart-palace-box" 
        :class="getPalaceBoxClass(8)"
        @click="handlePalaceClick(getPalaceIndexByPosition(8))"
      >
        <PalaceContent :palace="getPalaceByPosition(8)" :activeTab="activeTab" :backendRawData="backendRawData" :clickedMutagenInfos="clickedMutagenInfos" :flying-star-self-transform="currentSettings.flying_star_self_transform" />
      </div>
      <div 
        class="palace-box chart-palace-box" 
        :class="getPalaceBoxClass(9)"
        @click="handlePalaceClick(getPalaceIndexByPosition(9))"
      >
        <PalaceContent :palace="getPalaceByPosition(9)" :activeTab="activeTab" :backendRawData="backendRawData" :clickedMutagenInfos="clickedMutagenInfos" :flying-star-self-transform="currentSettings.flying_star_self_transform" />
      </div>
      <div 
        class="palace-box chart-palace-box" 
        :class="getPalaceBoxClass(10)"
        @click="handlePalaceClick(getPalaceIndexByPosition(10))"
      >
        <PalaceContent :palace="getPalaceByPosition(10)" :activeTab="activeTab" :backendRawData="backendRawData" :clickedMutagenInfos="clickedMutagenInfos" :flying-star-self-transform="currentSettings.flying_star_self_transform" />
      </div>
      <div 
        class="palace-box chart-palace-box" 
        :class="getPalaceBoxClass(11)"
        @click="handlePalaceClick(getPalaceIndexByPosition(11))"
      >
        <PalaceContent :palace="getPalaceByPosition(11)" :activeTab="activeTab" :backendRawData="backendRawData" :clickedMutagenInfos="clickedMutagenInfos" :flying-star-self-transform="currentSettings.flying_star_self_transform" />
      </div>
    </div>

    <!-- Tab切换 -->
    <div class="tab-container">
      <div 
        v-for="(tab, index) in tabs" 
        :key="tab.key"
        class="tab-item"
        :class="{ 
          active: activeTab === tab.key,
          highlighted: isTabHighlighted(index)
        }"
        :style="activeTab === tab.key || isTabHighlighted(index) ? {
          borderBottomColor: `var(${tab.colorVar})`
        } : {}"
        @click="switchTab(tab.key)"
      >
        {{ tab.label }}
      </div>
    </div>

    <!-- 日期时间选择器（非本命时显示） -->
    <div class="date-selector" v-if="activeTab !== 'benming'">
      <button class="nav-btn" @click="prevDate">‹</button>
      <div class="date-display">
        <div>{{ currentDate }}</div>
        <div class="lunar-date">{{ lunarDate }}</div>
      </div>
      <button class="nav-btn" @click="nextDate">›</button>
      <button class="time-btn" @click="selectTime">时</button>
    </div>

    <!-- 格局展示区域（显示在图表下方） -->
    <div v-if="patterns && patterns.length > 0" class="patterns-container chart-patterns-container">
      <div class="patterns-title chart-patterns-title">格局 ({{ patterns.length }})</div>
      <div class="patterns-content chart-patterns-content">
        <div 
          v-for="(pattern, index) in patterns" 
          :key="index"
          class="pattern-item chart-pattern-item"
        >
          <div class="pattern-name chart-pattern-name">{{ pattern.name }}</div>
          <div class="pattern-description chart-pattern-description">{{ pattern.description || '无描述' }}</div>
        </div>
      </div>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="loading chart-loading">
      加载中...
    </div>

    <!-- 参数面板 -->
    <StarParametersPanel
      v-if="showParameters"
      :backend-data="backendRawData"
      @close="showParameters = false"
    />

    <!-- 设置面板 -->
    <SettingsPanel
      v-if="showSettings"
      :settings="currentSettings"
      @save="handleSettingsSave"
      @close="showSettings = false"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { getZiWeiChart } from '../api/ziwei'

const emit = defineEmits(['back'])
import { extractData } from '../utils/dataTransform'
import { 
  getHighlightedPalaces,
  shouldHighlightPalace
} from '../utils/ziweiUtils'
import { sortPalacesFromOrigin, mergeHoroscopeData } from '../utils/palaceUtils'
import { 
  translateStarName, 
  translateEarthlyBranch, 
  translateGender, 
  translateFiveElementsClass 
} from '../utils/i18nUtils'
import { t, kot } from '../i18n'
import PalaceContent from './PalaceContent.vue'
import TransformIcon from './TransformIcon.vue'
import SettingsPanel from './SettingsPanel.vue'
import StarParametersPanel from './StarParametersPanel.vue'

const props = defineProps({
  birthInfo: {
    type: Object,
    required: false,
    default: () => ({
      birthDate: new Date().toISOString().split('T')[0],
      birthTime: '13:00',
      gender: 'male'
    })
  }
})

// 不再需要 emit reset

const loading = ref(false)
const chartData = ref(null)
const backendRawData = ref(null) // 存储原始后端数据
const activeTab = ref('benming')
const showSettings = ref(false)
const showParameters = ref(false)

// 从 localStorage 加载保存的设置
const loadSavedSettings = () => {
  try {
    const saved = localStorage.getItem('ziwei_chart_settings')
    if (saved) {
      return JSON.parse(saved)
    }
  } catch (error) {
    console.error('从本地存储加载设置失败:', error)
  }
  return null
}

// 当前设置（包含出生信息和高级设置）
// 优先使用 localStorage 中的设置，其次使用 props.birthInfo，最后使用默认值
const savedSettings = loadSavedSettings()
const currentSettings = ref({
  birthDate: savedSettings?.birthDate || props.birthInfo.birthDate || '1999-09-09',
  birthTime: savedSettings?.birthTime || props.birthInfo.birthTime || '09:09',
  gender: savedSettings?.gender || props.birthInfo.gender || 'male',
  longitude: savedSettings?.longitude || props.birthInfo.longitude || '',
  latitude: savedSettings?.latitude || props.birthInfo.latitude || '',
  is_solar_time: savedSettings?.is_solar_time !== undefined ? savedSettings.is_solar_time : (props.birthInfo.is_solar_time || false),
  is_late_zi: savedSettings?.is_late_zi || false,
  flying_star_self_transform: savedSettings?.flying_star_self_transform !== undefined ? savedSettings.flying_star_self_transform : true,
  leap_boundary: savedSettings?.leap_boundary || 'mid_month',
  custom_transform_type: savedSettings?.custom_transform_type || {},
  custom_transforms: savedSettings?.custom_transforms || null
})

// 获取当前时间并格式化为 'YYYY-MM-DD HH:mm'
const getCurrentDateTime = () => {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  const hours = String(now.getHours()).padStart(2, '0')
  const minutes = String(now.getMinutes()).padStart(2, '0')
  return `${year}-${month}-${day} ${hours}:${minutes}`
}

const currentDate = ref(getCurrentDateTime())
const lunarDate = ref('乙巳年冬月初十')

// 高亮相关宫位的索引数组
const highlightedPalaces = ref([])
// 当前点击的宫位索引（本宫）
const clickedPalaceIndex = ref(-1)
// 当前点击宫位的四化信息数组
const clickedMutagenInfos = ref([])

// 格局展示相关
const patterns = computed(() => {
  return backendRawData.value?.patterns || []
})

// 计算是否有自化（命宫有四化）- 已移除，不再使用
const hasSelfTransform = computed(() => false)

// 计算是否有对宫入化（命宫的对宫有四化）- 已移除，不再使用
const hasOppositeTransform = computed(() => false)

// 翻译性别（使用 i18n）
// 翻译函数已从 i18nUtils 导入

// 获取宫位在palaces数组中的实际索引
const getPalaceIndexByPosition = (position) => {
  if (!chartData.value || !chartData.value.palaces) {
    return -1
  }
  
  const palace = getPalaceByPosition(position)
  if (!palace) {
    return -1
  }
  
  // 找到该宫位在palaces数组中的索引
  return chartData.value.palaces.findIndex(p => p.name === palace.name)
}

// 处理宫位点击事件
const handlePalaceClick = (palaceIndex) => {
  if (palaceIndex === -1) {
    return
  }
  
  // 保存当前点击的宫位索引（本宫）
  clickedPalaceIndex.value = palaceIndex
  
  // 获取需要高亮的宫位索引（包括本宫、对宫、三合位）
  const indices = getHighlightedPalaces(palaceIndex, chartData.value?.palaces)
  // 从高亮数组中移除本宫，因为本宫使用不同的样式
  highlightedPalaces.value = indices.filter(idx => idx !== palaceIndex)
  
  // 获取点击宫位的四化信息数组（从 natal.palaces 中获取）
  if (backendRawData.value?.natal?.palaces && chartData.value?.palaces) {
    // palaceIndex 是 chartData.palaces 中的索引，需要获取对应的 palace 对象
    const clickedPalace = chartData.value.palaces[palaceIndex]
    if (clickedPalace) {
      // 通过 index 属性在 natal.palaces 中找到对应的 palace
      const natalPalace = backendRawData.value.natal.palaces.find(
        p => p.index === clickedPalace.index
      )
      clickedMutagenInfos.value = natalPalace?.mutagen_infos || []
    } else {
      clickedMutagenInfos.value = []
    }
  } else {
    clickedMutagenInfos.value = []
  }
}

// 获取宫位盒子的类名
const getPalaceBoxClass = (position) => {
  const palace = getPalaceByPosition(position)
  const palaceIndex = getPalaceIndexByPosition(position)
  
  // 判断是否是命宫（只有在没有点击其他宫位时，命宫才默认高亮）
  const isOriginPalace = palace?.index === chartData.value?.natal_palace_idx && clickedPalaceIndex.value === -1
  // 判断是否是点击的本宫
  const isClickedPalace = palaceIndex === clickedPalaceIndex.value
  // 判断是否是对宫或三合宫
  const isSurroundedPalace = shouldHighlightPalace(palaceIndex, highlightedPalaces.value)
  
  return {
    'highlight': isOriginPalace || isClickedPalace,
    'highlight-surrounded': isSurroundedPalace
  }
}

// 返回首页
const goBack = () => {
  emit('back')
}

// 处理重置（打开设置面板）
const handleReset = () => {
  showSettings.value = true
}

const tabs = [
  { key: 'benming', label: '本命', colorVar: '--color-horoscope-benming' },
  { key: 'daxian', label: '大限', colorVar: '--color-horoscope-daxian' },
  { key: 'liunian', label: '流年', colorVar: '--color-horoscope-liunian' },
  { key: 'liuyue', label: '流月', colorVar: '--color-horoscope-liuyue' },
  { key: 'liuri', label: '流日', colorVar: '--color-horoscope-liuri' },
  { key: 'liushi', label: '流时', colorVar: '--color-horoscope-liushi' }
]

// 判断哪些tab应该高亮（当前tab和前2个tab）
const getHighlightedTabs = computed(() => {
  const currentIndex = tabs.findIndex(tab => tab.key === activeTab.value)
  if (currentIndex === -1) return []
  
  const highlightedIndices = []
  for (let i = Math.max(0, currentIndex - 2); i <= currentIndex; i++) {
    highlightedIndices.push(i)
  }
  return highlightedIndices
})

// 判断tab是否应该高亮
const isTabHighlighted = (tabIndex) => {
  return getHighlightedTabs.value.includes(tabIndex)
}

// 更新图表数据（基于已有的后端数据）
const updateChartData = () => {
  if (!backendRawData.value) {
    return
  }
  
  // 获取当前tab对应的运限数据对象
  const horoscopeMap = {
    'benming': backendRawData.value.natal,
    'daxian': backendRawData.value.decadal,
    'liunian': backendRawData.value.yearly,
    'liuyue': backendRawData.value.monthly,
    'liuri': backendRawData.value.daily,
    'liushi': backendRawData.value.hourly
  }
  
  const currentHoroscope = horoscopeMap[activeTab.value] || backendRawData.value.natal
  
  // 排序宫位（从命宫开始）
  let sortedPalaces = sortPalacesFromOrigin(
    backendRawData.value.natal?.palaces || [],
    backendRawData.value.natal_palace_idx
  )
  
  // 合并运限数据
  if (currentHoroscope) {
    sortedPalaces = mergeHoroscopeData(sortedPalaces, currentHoroscope)
  }
  
  // 直接使用后端数据，只添加排序后的宫位
  chartData.value = {
    ...backendRawData.value,
    palaces: sortedPalaces
  }
  
  // 清空高亮
  highlightedPalaces.value = []
  clickedPalaceIndex.value = -1
  clickedMutagenInfos.value = []
  
  // 初始化时自动高亮对应运限的命宫及其三合宫和对宫
  if (sortedPalaces && sortedPalaces.length > 0) {
    let targetPalaceIndex = 0
    
    // 如果是本命，高亮本命宫（索引0，因为排序从本命宫开始）
    if (activeTab.value === 'benming') {
      targetPalaceIndex = 0
    } else {
      // 对于其他运限（大限、流年等），需要找到该运限的命宫位置
      // 该运限的 palaces[0].index 就是该运限命宫在本命盘中的索引
      if (currentHoroscope && currentHoroscope.palaces && currentHoroscope.palaces.length > 0) {
        const horoscopeOriginIndex = currentHoroscope.palaces[0].index
        // 在排序后的数组中找到这个索引对应的位置
        targetPalaceIndex = sortedPalaces.findIndex(p => p.index === horoscopeOriginIndex)
        // 如果找不到，默认使用0
        if (targetPalaceIndex === -1) {
          targetPalaceIndex = 0
        }
      }
    }
    
    handlePalaceClick(targetPalaceIndex)
  }
}

// 切换Tab
const switchTab = (tabKey) => {
  activeTab.value = tabKey
  updateChartData()
}

// 加载图表数据
const loadChartData = async () => {
  loading.value = true
  try {
    // 构建target_date（对于非本命盘）
    let targetDate = undefined
    if (activeTab.value !== 'benming') {
      const dateStr = currentDate.value
      if (dateStr.includes(' ')) {
        // 如果包含时间，格式化为 HH:mm:ss
        const [date, time] = dateStr.split(' ')
        const timeParts = time.split(':')
        targetDate = `${date} ${timeParts[0]}:${timeParts[1] || '00'}:00`
      } else {
        // 只有日期，使用12:00:00作为默认时间
        targetDate = `${dateStr} 12:00:00`
      }
    }
    
    // 构建请求参数（使用 currentSettings，并添加 target_date）
    const params = {
      birthDate: currentSettings.value.birthDate,
      birthTime: currentSettings.value.birthTime,
      gender: currentSettings.value.gender,
      longitude: currentSettings.value.longitude,
      latitude: currentSettings.value.latitude,
      is_solar_time: currentSettings.value.is_solar_time,
      is_late_zi: currentSettings.value.is_late_zi,
      leap_boundary: currentSettings.value.leap_boundary,
      custom_transforms: currentSettings.value.custom_transforms,
      // 注意：flying_star_self_transform 仅本地保存，不提交给后端
      // flying_star_self_transform: currentSettings.value.flying_star_self_transform,
      ...(targetDate && { target_date: targetDate })
    }
    
    // 只有当 custom_transform_type 存在且不为空对象时才传递
    if (currentSettings.value.custom_transform_type && 
        typeof currentSettings.value.custom_transform_type === 'object' &&
        Object.keys(currentSettings.value.custom_transform_type).length > 0) {
      params.custom_transform_type = currentSettings.value.custom_transform_type
    }
    
    const response = await getZiWeiChart(params)
    
    // 提取后端返回的数据
    const backendData = extractData(response)
    
    if (backendData) {
      // 保存原始后端数据
      backendRawData.value = backendData
      // 更新图表数据（会使用当前的 activeTab）
      updateChartData()
      
      // 更新农历日期显示
      if (chartData.value && chartData.value.lunar_date) {
        lunarDate.value = chartData.value.lunar_date
      }
    } else {
      // 如果没有数据，清空图表数据
      chartData.value = null
    }
  } catch (error) {
    console.error('加载紫微斗数数据失败:', error)
    // 清空图表数据
    chartData.value = null
  } finally {
    loading.value = false
  }
}

// 注意：切换 tab 时不再重新加载数据，而是直接使用已存在的后端数据重新转换

// 4x4布局位置映射：传统紫微斗数盘布局
// 从命宫开始顺时针排列：命宫(0)、兄弟(1)、夫妻(2)、子女(3)、财帛(4)、疾厄(5)、迁移(6)、交友(7)、官禄(8)、田宅(9)、福德(10)、父母(11)
const getPalaceByPosition = (position) => {
  // palaceOrder使用的是后端原始索引（从寅宫开始），所以需要使用backendRawData.value.natal.palaces
  if (!backendRawData.value || !backendRawData.value.natal || !backendRawData.value.natal.palaces) {
    return null
  }
  
  const palaces = backendRawData.value.natal.palaces
  // 4x4布局中每个位置对应的宫位索引（后端原始索引，从寅宫开始）
  // 后端数据从寅宫开始：寅(0)、卯(1)、辰(2)、巳(3)、午(4)、未(5)、申(6)、酉(7)、戌(8)、亥(9)、子(10)、丑(11)
  // 标准布局从左下角（位置8）开始顺时针排列：寅、卯、辰、巳、午、未、申、酉、戌、亥、子、丑
  // 顺时针顺序：位置8 -> 6 -> 4 -> 0 -> 1 -> 2 -> 3 -> 5 -> 7 -> 11 -> 10 -> 9
  // 位置0-3: 第1行
  // 位置4: 第2行第1列
  // 位置5: 第2行第4列
  // 位置6: 第3行第1列
  // 位置7: 第3行第4列
  // 位置8-11: 第4行
  const palaceOrder = [3, 4, 5, 6, 2, 7, 1, 8, 0, 11, 10, 9]
  
  // 根据位置索引获取对应的后端原始索引
  if (position >= 0 && position < 12) {
    const backendIndex = palaceOrder[position]
    // 在后端原始palaces数组中找到index字段等于backendIndex的宫位
    const palace = palaces.find(p => p.index === backendIndex)
    if (palace) {
      // 如果需要显示运限数据，需要从chartData中获取合并后的数据
      if (chartData.value && chartData.value.palaces) {
        const sortedPalace = chartData.value.palaces.find(p => p.index === backendIndex)
        return sortedPalace || palace
      }
      return palace
    }
  }
  
  return null
}

// 日期导航
const prevDate = () => {
  const date = new Date(currentDate.value.split(' ')[0])
  date.setDate(date.getDate() - 1)
  const dateStr = date.toISOString().split('T')[0]
  const time = currentDate.value.split(' ')[1] || '14:40'
  currentDate.value = `${dateStr} ${time}`
  loadChartData()
}

const nextDate = () => {
  const date = new Date(currentDate.value.split(' ')[0])
  date.setDate(date.getDate() + 1)
  const dateStr = date.toISOString().split('T')[0]
  const time = currentDate.value.split(' ')[1] || '14:40'
  currentDate.value = `${dateStr} ${time}`
  loadChartData()
}

const selectTime = () => {
  // 实现时间选择逻辑（可以弹出时间选择器）
  const time = prompt('请输入时间 (格式: HH:mm)', currentDate.value.split(' ')[1] || '14:40')
  if (time) {
    const date = currentDate.value.split(' ')[0]
    currentDate.value = `${date} ${time}`
    loadChartData()
  }
}


// 处理设置保存
const handleSettingsSave = (newSettings) => {
  // 保存旧设置用于比较
  const oldSettings = { ...currentSettings.value }
  
  // 更新当前设置
  currentSettings.value = { ...newSettings }
  
  // 保存到 localStorage
  try {
    localStorage.setItem('ziwei_chart_settings', JSON.stringify(newSettings))
  } catch (error) {
    console.error('保存设置到本地存储失败:', error)
  }
  
  // 检查是否只修改了 flying_star_self_transform
  const fieldsToCompare = [
    'birthDate',
    'birthTime',
    'gender',
    'longitude',
    'latitude',
    'is_solar_time',
    'is_late_zi',
    'leap_boundary',
    'custom_transform_type',
    'custom_transforms'
  ]
  
  const hasOtherChanges = fieldsToCompare.some(field => {
    const oldValue = oldSettings[field]
    const newValue = newSettings[field]
    
    // 对于对象类型，使用 JSON 比较
    if (typeof oldValue === 'object' && typeof newValue === 'object') {
      return JSON.stringify(oldValue) !== JSON.stringify(newValue)
    }
    
    return oldValue !== newValue
  })
  
  showSettings.value = false
  
  // 如果只修改了 flying_star_self_transform，不需要重新请求后端
  if (!hasOtherChanges) {
    return
  }
  
  // 有其他字段变化，需要重新请求后端
  loadChartData()
}

// 初始化设置（从 props.birthInfo）
watch(() => props.birthInfo, (newBirthInfo) => {
  if (newBirthInfo) {
    const updated = {
      birthDate: newBirthInfo.birthDate || '',
      birthTime: newBirthInfo.birthTime || '12:00',
      gender: newBirthInfo.gender || 'male',
      is_late_zi: currentSettings.value.is_late_zi || false,
      flying_star_self_transform: currentSettings.value.flying_star_self_transform !== undefined ? currentSettings.value.flying_star_self_transform : true,
      leap_boundary: currentSettings.value.leap_boundary || 'mid_month',
      custom_transforms: currentSettings.value.custom_transforms || null
    }
    // 只有当已经存在 custom_transform_type 时才保留
    if (currentSettings.value.custom_transform_type) {
      updated.custom_transform_type = currentSettings.value.custom_transform_type
    }
    currentSettings.value = updated
  }
}, { immediate: true })

// 监听 birthInfo 变化，重新加载数据
watch(() => props.birthInfo, () => {
  if (props.birthInfo) {
    loadChartData()
  }
}, { immediate: true })

onMounted(() => {
  if (props.birthInfo) {
    loadChartData()
  }
})
</script>

<!-- 导入共享样式（不使用 scoped） -->
<style>
@import '../styles/chartCommon.css';
</style>

<style scoped>

.ziwei-chart-container {
  max-width: 100%;
  margin: 0 auto;
  background-color: #fff;
  min-height: 100vh;
  padding-bottom: 60px;
}

/* 中央信息块 */
.info-block {
  padding: 15px;
  background-color: #fff;
  border-bottom: 1px solid #eee;
}

.info-block-center-placeholder {
  display: none; /* 占位符，不显示 */
}

/* 宫位内容样式已移至PalaceContent组件 */

/* 日期选择器 */
.date-selector {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 15px;
  background-color: #fff;
  border-top: 1px solid #eee;
  border-bottom: 1px solid #eee;
  gap: 15px;
}

.nav-btn {
  background: none;
  border: none;
  font-size: 20px;
  color: #333;
  cursor: pointer;
  padding: 5px 10px;
}

.date-display {
  text-align: center;
  flex: 1;
}

.date-display > div:first-child {
  font-size: 16px;
  font-weight: bold;
  color: #333;
}

.lunar-date {
  font-size: 12px;
  color: #666;
  margin-top: 3px;
}

.time-btn {
  background-color: #2196f3;
  color: #fff;
  border: none;
  padding: 5px 15px;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
}

/* Tab切换 */
.tab-container {
  display: flex;
  background-color: #fff;
  border-top: 1px solid #eee;
  border-bottom: 1px solid #eee;
  overflow-x: auto;
}

.tab-item {
  flex: 1;
  padding: 12px;
  text-align: center;
  font-size: 14px;
  color: #666;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  white-space: nowrap;
  min-width: 60px;
}

.tab-item.active {
  font-weight: bold;
}

/* ZiWeiChart 特有的响应式样式 */
@media (max-width: 768px) {
  .ziwei-chart-container {
    padding-bottom: 40px;
  }

  .info-label {
    margin-right: 6px;
  }

  .tab-container {
    padding: 8px 0;
  }

  .tab-item {
    padding: 10px 8px;
    font-size: 12px;
    min-width: 50px;
  }

  .date-selector {
    padding: 12px 8px;
    gap: 10px;
  }

  .date-display > div:first-child {
    font-size: 14px;
  }

  .lunar-date {
    font-size: 11px;
  }

  .nav-btn {
    font-size: 18px;
    padding: 4px 8px;
  }

  .time-btn {
    padding: 4px 12px;
    font-size: 12px;
  }
}

/* 超小屏幕优化 */
@media (max-width: 480px) {
  .info-label {
    margin-right: 5px;
  }
}
</style>

