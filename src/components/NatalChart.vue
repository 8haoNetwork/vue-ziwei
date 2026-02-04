<template>
  <div class="natal-chart-container chart-container">
    <!-- 顶部导航栏 -->
    <div class="header chart-header">
      <button class="back-btn chart-back-btn" @click="goBack">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
      <div class="header-title chart-header-title">本命盘</div>
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
        <PalaceContent :palace="getPalaceByPosition(0)" activeTab="benming" :backendRawData="backendRawData" :clickedMutagenInfos="clickedMutagenInfos" :flying-star-self-transform="currentSettings.flying_star_self_transform" />
      </div>
      <div 
        class="palace-box chart-palace-box" 
        :class="getPalaceBoxClass(1)"
        @click="handlePalaceClick(getPalaceIndexByPosition(1))"
      >
        <PalaceContent :palace="getPalaceByPosition(1)" activeTab="benming" :backendRawData="backendRawData" :clickedMutagenInfos="clickedMutagenInfos" :flying-star-self-transform="currentSettings.flying_star_self_transform" />
      </div>
      <div 
        class="palace-box chart-palace-box" 
        :class="getPalaceBoxClass(2)"
        @click="handlePalaceClick(getPalaceIndexByPosition(2))"
      >
        <PalaceContent :palace="getPalaceByPosition(2)" activeTab="benming" :backendRawData="backendRawData" :clickedMutagenInfos="clickedMutagenInfos" :flying-star-self-transform="currentSettings.flying_star_self_transform" />
      </div>
      <div 
        class="palace-box chart-palace-box" 
        :class="getPalaceBoxClass(3)"
        @click="handlePalaceClick(getPalaceIndexByPosition(3))"
      >
        <PalaceContent :palace="getPalaceByPosition(3)" activeTab="benming" :backendRawData="backendRawData" :clickedMutagenInfos="clickedMutagenInfos" :flying-star-self-transform="currentSettings.flying_star_self_transform" />
      </div>
      
      <!-- 第2行：田宅、[中间信息]、[中间信息]、夫妻 -->
      <div 
        class="palace-box chart-palace-box" 
        :class="getPalaceBoxClass(4)"
        @click="handlePalaceClick(getPalaceIndexByPosition(4))"
      >
        <PalaceContent :palace="getPalaceByPosition(4)" activeTab="benming" :backendRawData="backendRawData" :clickedMutagenInfos="clickedMutagenInfos" :flying-star-self-transform="currentSettings.flying_star_self_transform" />
      </div>
      <!-- 中间信息块（合并2x2） -->
      <div class="info-block-center chart-info-block-center" v-if="chartData">
        <div class="info-content chart-info-content">
          <div class="info-row info-row-title chart-info-row chart-info-row-title">
            <span>{{ translateGender(chartData.gender) }} {{ translateFiveElementsClass(chartData.five_elements_class) }}</span>
          </div>
          <div class="info-row chart-info-row">
            <span class="info-label chart-info-label">{{ chartData.use_solar_time ? t('label.solarTime') : t('label.beijingTime') }}</span>
            <span class="info-value chart-info-value">{{ chartData.use_solar_time ? chartData.solar_date : (chartData.birth_date || chartData.solar_date) }}{{ chartData.birthTime ? ' ' + chartData.birthTime : '' }}</span>
          </div>
          <div class="info-row chart-info-row">
            <span class="info-label chart-info-label">{{ t('label.lunarCalendar') }}</span>
            <span class="info-value chart-info-value">{{ chartData.lunar_date }}</span>
          </div>
          <div class="info-row chart-info-row">
            <span class="info-label chart-info-label">{{ t('label.solarTermGanzhi') }}</span>
            <span class="info-value chart-info-value">{{ chartData.solar_term_ganzhi || '' }}</span>
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
        <PalaceContent :palace="getPalaceByPosition(5)" activeTab="benming" :backendRawData="backendRawData" :clickedMutagenInfos="clickedMutagenInfos" :flying-star-self-transform="currentSettings.flying_star_self_transform" />
      </div>
      
      <!-- 第3行：官禄、[中间信息]、[中间信息]、子女 -->
      <div 
        class="palace-box chart-palace-box" 
        :class="getPalaceBoxClass(6)"
        @click="handlePalaceClick(getPalaceIndexByPosition(6))"
      >
        <PalaceContent :palace="getPalaceByPosition(6)" activeTab="benming" :backendRawData="backendRawData" :clickedMutagenInfos="clickedMutagenInfos" :flying-star-self-transform="currentSettings.flying_star_self_transform" />
      </div>
      <div 
        class="palace-box chart-palace-box" 
        :class="getPalaceBoxClass(7)"
        @click="handlePalaceClick(getPalaceIndexByPosition(7))"
      >
        <PalaceContent :palace="getPalaceByPosition(7)" activeTab="benming" :backendRawData="backendRawData" :clickedMutagenInfos="clickedMutagenInfos" :flying-star-self-transform="currentSettings.flying_star_self_transform" />
      </div>
      
      <!-- 第4行：交友、迁移、疾厄、财帛 -->
      <div 
        class="palace-box chart-palace-box" 
        :class="getPalaceBoxClass(8)"
        @click="handlePalaceClick(getPalaceIndexByPosition(8))"
      >
        <PalaceContent :palace="getPalaceByPosition(8)" activeTab="benming" :backendRawData="backendRawData" :clickedMutagenInfos="clickedMutagenInfos" :flying-star-self-transform="currentSettings.flying_star_self_transform" />
      </div>
      <div 
        class="palace-box chart-palace-box" 
        :class="getPalaceBoxClass(9)"
        @click="handlePalaceClick(getPalaceIndexByPosition(9))"
      >
        <PalaceContent :palace="getPalaceByPosition(9)" activeTab="benming" :backendRawData="backendRawData" :clickedMutagenInfos="clickedMutagenInfos" :flying-star-self-transform="currentSettings.flying_star_self_transform" />
      </div>
      <div 
        class="palace-box chart-palace-box" 
        :class="getPalaceBoxClass(10)"
        @click="handlePalaceClick(getPalaceIndexByPosition(10))"
      >
        <PalaceContent :palace="getPalaceByPosition(10)" activeTab="benming" :backendRawData="backendRawData" :clickedMutagenInfos="clickedMutagenInfos" :flying-star-self-transform="currentSettings.flying_star_self_transform" />
      </div>
      <div 
        class="palace-box chart-palace-box" 
        :class="getPalaceBoxClass(11)"
        @click="handlePalaceClick(getPalaceIndexByPosition(11))"
      >
        <PalaceContent :palace="getPalaceByPosition(11)" activeTab="benming" :backendRawData="backendRawData" :clickedMutagenInfos="clickedMutagenInfos" :flying-star-self-transform="currentSettings.flying_star_self_transform" />
      </div>
    </div>

    <!-- 格局展示区域 -->
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
import { ref, onMounted, computed } from 'vue'
import { getNatalChart } from '../api/ziwei'
import { extractData } from '../utils/dataTransform'
import { 
  getHighlightedPalaces,
  shouldHighlightPalace
} from '../utils/ziweiUtils'
import { 
  translateStarName, 
  translateEarthlyBranch, 
  translateGender, 
  translateFiveElementsClass 
} from '../utils/i18nUtils'
import PalaceContent from './PalaceContent.vue'
import TransformIcon from './TransformIcon.vue'
import SettingsPanel from './SettingsPanel.vue'
import StarParametersPanel from './StarParametersPanel.vue'
import { t } from '../i18n'

const emit = defineEmits(['back'])

const props = defineProps({
  birthInfo: {
    type: Object,
    required: false,
    default: () => ({
      birthDate: '1999-09-09',
      birthTime: '09:09',
      gender: 'male'
    })
  }
})

const loading = ref(false)
const chartData = ref(null)
const backendRawData = ref(null)

const showSettings = ref(false)
const showParameters = ref(false)

// 当前设置
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

// 高亮相关宫位的索引数组
const highlightedPalaces = ref([])
const clickedPalaceIndex = ref(-1)
const clickedMutagenInfos = ref([])

// 格局展示相关
const patterns = computed(() => {
  return backendRawData.value?.patterns || []
})

const goBack = () => {
  emit('back')
}

// 获取宫位在palaces数组中的实际索引
const getPalaceIndexByPosition = (position) => {
  if (!chartData.value || !chartData.value.palaces) {
    return -1
  }
  
  const palace = getPalaceByPosition(position)
  if (!palace) {
    return -1
  }
  
  // 通过 index 属性匹配（更可靠），如果找不到再通过名称匹配
  const index = chartData.value.palaces.findIndex(p => p.index === palace.index)
  if (index !== -1) {
    return index
  }
  // 备用方案：通过名称匹配
  return chartData.value.palaces.findIndex(p => p.name === palace.name)
}

// 处理宫位点击事件
const handlePalaceClick = (palaceIndex) => {
  if (palaceIndex === -1) {
    return
  }
  
  clickedPalaceIndex.value = palaceIndex
  
  const indices = getHighlightedPalaces(palaceIndex, chartData.value?.palaces)
  highlightedPalaces.value = indices.filter(idx => idx !== palaceIndex)
  
  // /astro/natal 返回的数据不包含运限数据，只包含本命盘数据
  // 数据可能在 natal.palaces 中，也可能直接在 palaces 中
  const palacesSource = backendRawData.value?.natal?.palaces || backendRawData.value?.palaces
  if (palacesSource && chartData.value?.palaces) {
    const clickedPalace = chartData.value.palaces[palaceIndex]
    if (clickedPalace) {
      const natalPalace = palacesSource.find(
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
  
  const isOriginPalace = palace?.index === chartData.value?.natal_palace_idx && clickedPalaceIndex.value === -1
  const isClickedPalace = palaceIndex === clickedPalaceIndex.value
  const isSurroundedPalace = shouldHighlightPalace(palaceIndex, highlightedPalaces.value)
  
  return {
    'highlight': isOriginPalace || isClickedPalace,
    'highlight-surrounded': isSurroundedPalace
  }
}

// 4x4布局位置映射
const getPalaceByPosition = (position) => {
  // /astro/natal 返回的数据可能直接是 palaces 数组，也可能在 natal.palaces 中
  const palacesSource = backendRawData.value?.natal?.palaces || backendRawData.value?.palaces
  if (!backendRawData.value || !palacesSource) {
    return null
  }
  
  const palaceOrder = [3, 4, 5, 6, 2, 7, 1, 8, 0, 11, 10, 9]
  
  if (position >= 0 && position < 12) {
    const backendIndex = palaceOrder[position]
    const palace = palacesSource.find(p => p.index === backendIndex)
    if (palace) {
      if (chartData.value && chartData.value.palaces) {
        const sortedPalace = chartData.value.palaces.find(p => p.index === backendIndex)
        return sortedPalace || palace
      }
      return palace
    }
  }
  
  return null
}

// 更新图表数据（只显示本命盘）
const updateChartData = () => {
  if (!backendRawData.value) {
    chartData.value = null
    return
  }
  
  // /astro/natal 接口返回的数据结构可能不同
  // 如果返回的数据直接包含 natal 字段，使用它
  // 如果没有 natal 字段，说明返回的数据本身就是本命盘数据
  const natal = backendRawData.value.natal || backendRawData.value
  const natalPalaceIdx = natal.natal_palace_idx || backendRawData.value.natal_palace_idx
  const rawPalaces = natal.palaces || backendRawData.value.palaces || []
  
  // 只使用本命盘相关数据，忽略任何运限数据（decadal, yearly, monthly, daily, hourly）
  chartData.value = {
    gender: backendRawData.value.gender,
    solar_date: backendRawData.value.solar_date,
    birth_date: backendRawData.value.birth_date,
    birthTime: backendRawData.value.birthTime,
    use_solar_time: backendRawData.value.use_solar_time,
    lunar_date: backendRawData.value.lunar_date,
    lunar_ganzhi: backendRawData.value.lunar_ganzhi,
    solar_term_ganzhi: backendRawData.value.solar_term_ganzhi,
    zodiac: backendRawData.value.zodiac,
    five_elements_class: backendRawData.value.five_elements_class,
    soul_lord: backendRawData.value.soul_lord,
    body_lord: backendRawData.value.body_lord,
    birth_year_doujun: backendRawData.value.birth_year_doujun,
    current_year_doujun: backendRawData.value.current_year_doujun,
    natal_palace_idx: natalPalaceIdx,
    body_palace_idx: natal.body_palace_idx || backendRawData.value.body_palace_idx,
    palaces: rawPalaces
  }
  
  // 清空高亮
  highlightedPalaces.value = []
  clickedPalaceIndex.value = -1
  clickedMutagenInfos.value = []
  
  // 自动高亮命宫及其三方四正
  if (rawPalaces && rawPalaces.length > 0 && natalPalaceIdx !== undefined) {
    // 在数组中找到命宫的位置（通过原始索引匹配）
    const targetPalaceIndex = rawPalaces.findIndex(p => p.index === natalPalaceIdx)
    if (targetPalaceIndex !== -1) {
      handlePalaceClick(targetPalaceIndex)
    }
  }
}

// 加载本命盘数据
const loadChartData = async () => {
  loading.value = true
  
  try {
    const params = {
      birthDate: currentSettings.value.birthDate,
      birthTime: currentSettings.value.birthTime,
      gender: currentSettings.value.gender,
      longitude: currentSettings.value.longitude,
      latitude: currentSettings.value.latitude,
      is_solar_time: currentSettings.value.is_solar_time,
      tz: 8
    }
    
    if (currentSettings.value.is_late_zi !== undefined) {
      params.is_late_zi = currentSettings.value.is_late_zi
    }
    if (currentSettings.value.leap_boundary) {
      params.leap_boundary = currentSettings.value.leap_boundary
    }
    if (currentSettings.value.custom_transform_type && 
        typeof currentSettings.value.custom_transform_type === 'object' &&
        Object.keys(currentSettings.value.custom_transform_type).length > 0) {
      params.custom_transform_type = currentSettings.value.custom_transform_type
    }
    
    const response = await getNatalChart(params)
    
    const backendData = extractData(response)
    
    if (backendData) {
      backendRawData.value = backendData
      updateChartData()
    } else {
      chartData.value = null
    }
  } catch (error) {
    console.error('加载本命盘数据失败:', error)
    chartData.value = null
  } finally {
    loading.value = false
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

// 初始化
onMounted(() => {
  loadChartData()
})
</script>

<!-- 导入共享样式（不使用 scoped） -->
<style>
@import '../styles/chartCommon.css';
</style>

<style scoped>

.natal-chart-container {
  max-width: 100%;
  margin: 0 auto;
  background-color: #fff;
  min-height: 100vh;
  padding-bottom: 60px;
}

</style>

