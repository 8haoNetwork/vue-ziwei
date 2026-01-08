<template>
  <Teleport to="body">
    <div class="parameters-page">
      <div class="parameters-header">
        <button class="back-btn" @click="handleClose">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
        <h2 class="parameters-title">你的紫微参数</h2>
        <div></div> <!-- 占位符，保持标题居中 -->
      </div>

      <div class="parameters-content">
        <!-- 星曜参数表格 -->
        <div class="parameters-section">
          <div class="table-container">
            <table class="parameters-table">
              <thead>
                <tr>
                  <th>星曜</th>
                  <th>落宫</th>
                  <th>属性</th>
                  <th>四化</th>
                  <th>状态</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(star, index) in starParameters" :key="index">
                  <td class="star-name-cell" :class="{ 'highlighted': isStarHighlighted(star.name) }">
                    {{ translateStarName(star.name) }}
                  </td>
                  <td>{{ translatePalaceName(star.palaceName) }}</td>
                  <td>{{ starAttributeMap[translateStarName(star.name)] || '-' }}</td>
                  <td>
                    <span 
                      v-if="star.mutagen" 
                      class="mutagen-badge"
                      :class="'mutagen-' + (normalizeMutagenType(star.mutagen) || '')"
                    >
                      {{ getMutagenText(star.mutagen) || '-' }}
                    </span>
                    <span v-else>-</span>
                  </td>
                  <td>{{ translateBrightness(star.brightness) || '-' }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- 宫位-星曜-地支表格 -->
        <div class="parameters-section">
          <div class="table-container">
            <table class="parameters-table">
              <thead>
                <tr>
                  <th>宫位</th>
                  <th>星曜</th>
                  <th>地支</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(row, index) in palaceStarsListRows" :key="`${row.palaceIndex}-${index}`">
                  <td v-if="row.isFirstRow" :rowspan="row.rowspan">{{ row.palaceName }}</td>
                  <td>{{ row.star }}</td>
                  <td v-if="row.isFirstRow" :rowspan="row.rowspan" class="last-column">{{ row.earthlyBranch }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { computed } from 'vue'
import { t, kot } from '../i18n'
import { sortPalacesFromOrigin } from '../utils/palaceUtils'
import { getMutagenText, normalizeMutagenType } from '../utils/mutagenUtils'
import { 
  translateStarName, 
  translatePalaceName, 
  translateBrightness, 
  translateEarthlyBranch 
} from '../utils/i18nUtils'

const props = defineProps({
  backendData: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['close'])

// 翻译函数已从 i18nUtils 导入

// 星名到五行属性的映射（示例，可能需要根据实际情况调整）
const starAttributeMap = {
  '紫微': '土',
  '天机': '木',
  '太阳': '火',
  '武曲': '金',
  '天同': '水',
  '廉贞': '火/木',
  '天府': '土',
  '太阴': '水',
  '贪狼': '木/水',
  '巨门': '水/金',
  '天相': '水',
  '天梁': '土',
  '七杀': '金/火',
  '破军': '水',
  '文昌': '金',
  '文曲': '水',
  '左辅': '土',
  '右弼': '水',
  '天魁': '火',
  '天钺': '火',
  '禄存': '土',
  '天马': '火',
  '擎羊': '金',
  '陀罗': '金',
  '火星': '火',
  '铃星': '火',
  '地空': '火',
  '地劫': '火'
}

// 从星名中提取四化（禄、权、科、忌）
const getMutagenType = (starName) => {
  if (!starName) return null
  return props.backendData.natal?.mutagen_stars?.[starName] || null
}

// 处理单个星，提取星信息
const processStar = (star, palace) => {
  // 确保 star.name 是字符串
  const starName = star?.name ? String(star.name) : String(star)
  if (!starName) return null
  
  return {
    name: starName,
    palaceName: palace.name,
    mutagen: getMutagenType(starName),
    brightness: star.brightness
  }
}

// 获取星曜参数列表
const starParameters = computed(() => {
  if (!props.backendData || !props.backendData.natal || !props.backendData.natal.palaces) {
    return []
  }

  const stars = []
  const processedStars = new Set()

  props.backendData.natal.palaces.forEach(palace => {
    const palace_stars = [...(palace.major_stars || []), ...(palace.minor_stars || [])]
    palace_stars.forEach(star => {
        const starInfo = processStar(star, palace)
        if (starInfo && !processedStars.has(starInfo.name)) {
            stars.push(starInfo)
            processedStars.add(starInfo.name)
        }
        })
  })

  // 按照固定顺序排序
  stars.sort((a, b) => {
    // 获取中文名称用于排序
    const nameA = translateStarName(a.name)
    const nameB = translateStarName(b.name)
    const indexA = fixedStarOrder.indexOf(nameA)
    const indexB = fixedStarOrder.indexOf(nameB)
    // 如果星名不在固定顺序中，排在最后
    if (indexA === -1 && indexB === -1) return 0
    if (indexA === -1) return 1
    if (indexB === -1) return -1
    return indexA - indexB
  })

  return stars
})

// 固定的宫位顺序：命宫-兄弟-夫妻-子女-财帛-疾厄-迁移-交友-官禄-田宅-福德-父母
// 使用后端返回的英文格式名称
const fixedPalaceOrder = [
  'soulPalace',      // 命宫
  'siblingsPalace',  // 兄弟
  'spousePalace',    // 夫妻
  'childrenPalace',  // 子女
  'wealthPalace',    // 财帛
  'healthPalace',    // 疾厄
  'surfacePalace',   // 迁移
  'friendsPalace',   // 交友
  'careerPalace',    // 官禄
  'propertyPalace',  // 田宅
  'spiritPalace',    // 福德
  'parentsPalace'    // 父母
]

// 固定的星曜顺序
const fixedStarOrder = [
  '紫微', '天机', '太阳', '武曲', '天同', '廉贞',
  '天府', '太阴', '贪狼', '巨门', '天相', '天梁',
  '七杀', '破军',
  '文昌', '文曲', '左辅', '右弼', '天魁', '天钺',
  '禄存', '天马', '擎羊', '陀罗', '火星', '铃星',
  '地空', '地劫'
]

// 获取宫位-星曜-地支列表（展平为行数据）
const palaceStarsListRows = computed(() => {
  if (!props.backendData || !props.backendData.natal || !props.backendData.natal.palaces) {
    return []
  }

  // 创建一个以宫位名称为 key 的映射
  const palaceMap = {}
  props.backendData.natal.palaces.forEach(palace => {
    if (palace && palace.name) {
      palaceMap[palace.name] = palace
    }
  })

  const palace_rows = []

  // 按照固定顺序排序
  fixedPalaceOrder.forEach(palaceName => {
    let palace = palaceMap[palaceName]
    if (!palace) {
              // 尝试通过翻译名称匹配（如果后端返回的是中文名称）
              const matchedPalace = props.backendData.natal.palaces.find(p => {
        if (!p || !p.name) return false
        return translatePalaceName(p.name) === translatePalaceName(palaceName) || p.name === palaceName
      })
      if (!matchedPalace) return
      palace = matchedPalace
    }

    const stars = palace.major_stars || []
    const rowCount = stars.length > 0 ? stars.length : 1
    
    if (stars.length > 0) {
      stars.forEach((star, index) => {
        palace_rows.push({
          palaceIndex: palace.index,
          palaceName: translatePalaceName(palace.name),
          star: translateStarName(star.name),
          earthlyBranch: translateEarthlyBranch(palace.earthly_branch),
          rowspan: rowCount,
          isFirstRow: index === 0
        })
      })
    } else {
      palace_rows.push({
        palaceIndex: palace.index,
        palaceName: translatePalaceName(palace.name),
        star: "-",
        earthlyBranch: translateEarthlyBranch(palace.earthly_branch),
        rowspan: 1,
        isFirstRow: true
      })
    }
  })

  return palace_rows
})

// 判断星是否高亮（可以根据需要调整）
const isStarHighlighted = (starName) => {
  // 可以根据实际需求实现高亮逻辑
  return false
}

const handleClose = () => {
  emit('close')
}
</script>

<style scoped>
.parameters-page {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: white;
  display: flex;
  flex-direction: column;
  z-index: 1000;
  overflow: hidden;
}

.parameters-header {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid #eee;
  flex-shrink: 0;
  background: white;
  position: sticky;
  top: 0;
  z-index: 10;
}

.back-btn {
  background: none;
  border: none;
  padding: 8px;
  margin-right: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #333;
  border-radius: 8px;
  transition: background-color 0.2s;
  flex-shrink: 0;
}

.back-btn:hover {
  background-color: #f5f5f5;
}

.back-btn svg {
  width: 24px;
  height: 24px;
}

.parameters-title {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #333;
  flex: 1;
  text-align: start;
}

.parameters-content {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  -webkit-overflow-scrolling: touch;
}

.parameters-section {
  margin-bottom: 32px;
}

.parameters-section:last-child {
  margin-bottom: 16px;
}

.section-title {
  margin: 0 0 12px 0;
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.table-container {
  overflow-x: auto;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
}

.parameters-table {
  width: 100%;
  border-collapse: collapse;
  background: white;
  font-size: 14px;
}

.parameters-table thead {
  background-color: #f5f5f5;
}

.parameters-table th {
  padding: 12px 8px;
  text-align: center;
  font-weight: 600;
  color: #333;
  border-bottom: 1px solid #e0e0e0;
  border-right: 1px solid #e0e0e0;
  white-space: nowrap;
  font-size: 14px;
}

.parameters-table th:last-child {
  border-right: none;
}

.parameters-table td {
  padding: 10px 8px;
  border-bottom: 1px solid #f0f0f0;
  border-right: 1px solid #e0e0e0;
  color: #666;
  text-align: center;
}

.parameters-table td.last-column {
  border-right: none;
}

.parameters-table tbody tr:last-child td {
  border-bottom: none;
}

.parameters-table tbody tr:hover {
  background-color: #f9f9f9;
}

.star-name-cell {
  color: #333;
  font-weight: 500;
}

.star-name-cell.highlighted {
  color: #667eea;
  font-weight: 600;
}

.mutagen-badge {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
  color: white;
}

.mutagen-lu {
  background-color: var(--color-mutagen-lu);
}

.mutagen-quan {
  background-color: var(--color-mutagen-quan);
}

.mutagen-ke {
  background-color: var(--color-mutagen-ke);
}

.mutagen-ji {
  background-color: var(--color-mutagen-ji);
}

@media (max-width: 640px) {
  .parameters-header {
    padding: 10px 12px;
  }
  
  .parameters-title {
    font-size: 16px;
  }
  
  .parameters-content {
    padding: 12px;
  }

  .parameters-table {
    font-size: 12px;
  }

  .parameters-table th,
  .parameters-table td {
    padding: 8px 6px;
  }
}
</style>

