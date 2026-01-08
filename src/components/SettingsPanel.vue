<template>
  <Teleport to="body">
    <div class="settings-page">
    <div class="settings-header">
      <button class="back-btn" @click="handleClose">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
      <h2 class="settings-title">设置</h2>
      <button class="reset-btn" @click="handleReset">重置</button>
    </div>

      <div class="settings-content">
        <form>
          <!-- 出生信息 -->
          <div class="settings-section">
            <h3 class="section-title">出生信息</h3>
            
            <div class="form-group">
              <label for="birthDate" class="form-label">出生日期</label>
              <input
                id="birthDate"
                v-model="localSettings.birthDate"
                type="date"
                class="form-input"
                required
              />
            </div>

            <div class="form-group">
              <label for="birthTime" class="form-label">出生时间</label>
              <input
                id="birthTime"
                v-model="localSettings.birthTime"
                type="time"
                class="form-input"
                required
              />
            </div>

            <div class="form-group">
              <label class="form-label">性别</label>
              <div class="gender-options">
                <label class="radio-label">
                  <input
                    v-model="localSettings.gender"
                    type="radio"
                    value="male"
                    class="radio-input"
                    required
                  />
                  <span class="radio-text">男</span>
                </label>
                <label class="radio-label">
                  <input
                    v-model="localSettings.gender"
                    type="radio"
                    value="female"
                    class="radio-input"
                    required
                  />
                  <span class="radio-text">女</span>
                </label>
              </div>
            </div>

            <div class="form-group">
              <label for="longitude" class="form-label">经度</label>
              <input
                id="longitude"
                v-model="localSettings.longitude"
                type="number"
                step="0.1"
                class="form-input"
                placeholder="例如：116.5"
              />
              <p class="form-desc">出生地经度（-180 到 180）</p>
            </div>

            <div class="form-group">
              <label for="latitude" class="form-label">纬度</label>
              <input
                id="latitude"
                v-model="localSettings.latitude"
                type="number"
                step="0.1"
                class="form-input"
                placeholder="例如：39.9"
              />
              <p class="form-desc">出生地纬度（-90 到 90）</p>
            </div>
          </div>

          <!-- 时间设置 -->
          <div class="settings-section">
            <h3 class="section-title">时间设置</h3>

            <div class="form-group">
              <label for="leapBoundary" class="form-label">闰月分界</label>
              <select
                id="leapBoundary"
                v-model="localSettings.leap_boundary"
                class="form-input"
              >
                <option value="mid_month">月中分隔</option>
                <option value="current_month">隶属本月</option>
                <option value="next_month">隶属下月</option>
              </select>
            </div>

            <div class="switch-group">
              <label class="switch-label">
                <span class="switch-text">晚子时</span>
                <input
                  v-model="localSettings.is_late_zi"
                  type="checkbox"
                  class="switch-input"
                />
                <span class="switch-slider"></span>
              </label>
              <p class="switch-desc">23:00-00:00 计算为本日</p>
            </div>
            
            <div class="switch-group">
              <label class="switch-label">
                <span class="switch-text">真太阳时</span>
                <input
                  v-model="localSettings.is_solar_time"
                  type="checkbox"
                  class="switch-input"
                />
                <span class="switch-slider"></span>
              </label>
              <p class="switch-desc">根据出生地经纬度计算真太阳时</p>
            </div>
          </div>

          <!-- 四化设置 -->
          <div class="settings-section">
            <h3 class="section-title">四化设置</h3>
            
            <div class="switch-group">
              <label class="switch-label">
                <span class="switch-text">飞星自化</span>
                <input
                  v-model="localSettings.flying_star_self_transform"
                  type="checkbox"
                  class="switch-input"
                />
                <span class="switch-slider"></span>
              </label>
              <p class="switch-desc">启用飞星自化功能</p>
            </div>

            <div class="transform-list">
              <div
                v-for="(group, groupKey) in transformGroups"
                :key="groupKey"
                class="transform-group"
              >
                <div
                  class="transform-group-header"
                  :class="{ active: expandedGroup === groupKey }"
                  @click="toggleGroup(groupKey)"
                >
                  <span class="transform-stem">{{ group.stem }}</span>
                  <span class="transform-desc">
                    {{ getCurrentTransformDesc(groupKey) }}
                  </span>
                  <span class="transform-arrow">›</span>
                </div>
                <div
                  v-if="expandedGroup === groupKey"
                  class="transform-options"
                >
                  <div
                    v-for="option in group.options"
                    :key="option.value"
                    class="transform-option"
                    :class="{ active: getSelectedTransformType(groupKey) === option.value }"
                    @click="selectTransform(groupKey, option.value)"
                  >
                    <span class="transform-option-name">{{ option.name }}</span>
                    <span
                      v-if="getSelectedTransformType(groupKey) === option.value"
                      class="transform-check"
                    >✓</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </form>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, watch, computed } from 'vue'

const props = defineProps({
  settings: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['save', 'close'])

// 四化分组数据（需要在初始化前定义）
const transformGroups = {
  jia: {
    stem: '甲',
    options: [
      { value: 'jia_1', name: '廉破武阳' },
      { value: 'jia_2', name: '廉破曲阳' }
    ]
  },
  wu: {
    stem: '戊',
    options: [
      { value: 'wu_1', name: '贪阴右机' },
      { value: 'wu_2', name: '贪阴阳机' }
    ]
  },
  geng: {
    stem: '庚',
    options: [
      { value: 'geng_1', name: '阳武阴同' },
      { value: 'geng_2', name: '阳武府同' }
    ]
  },
  xin: {
    stem: '辛',
    options: [
      { value: 'xin_1', name: '巨阳曲昌' },
      { value: 'xin_2', name: '巨阳武昌' }
    ]
  },
  ren: {
    stem: '壬',
    options: [
      { value: 'ren_1', name: '梁紫辅武' },
      { value: 'ren_2', name: '梁紫府武' }
    ]
  },
  gui: {
    stem: '癸',
    options: [
      { value: 'gui_1', name: '破巨阴贪' },
      { value: 'gui_2', name: '破巨阳贪' }
    ]
  }
}

// 初始的 custom_transform_type（用于判断用户是否修改）
// custom_transform_type 现在是一个对象，例如: {"辛": "xin_2"} 或 {"戊": "wu_2", "庚": "geng_2"}
const initialTransformType = props.settings.custom_transform_type || {}
const parsedInitialTransformType = typeof initialTransformType === 'string' 
  ? {} 
  : (initialTransformType || {})

// 本地设置副本
const   localSettings = ref({
  birthDate: props.settings.birthDate || '',
  birthTime: props.settings.birthTime || '12:00',
  gender: props.settings.gender || 'male',
  longitude: props.settings.longitude || '',
  latitude: props.settings.latitude || '',
  is_solar_time: props.settings.is_solar_time || false,
  is_late_zi: props.settings.is_late_zi || false,
  flying_star_self_transform: props.settings.flying_star_self_transform !== undefined ? props.settings.flying_star_self_transform : true,
  leap_boundary: props.settings.leap_boundary || 'mid_month',
  custom_transform_type: parsedInitialTransformType,
  custom_transforms: props.settings.custom_transforms || null
})

// 跟踪初始值，用于判断是否修改（深拷贝）
const initialSettingsRef = ref({
  custom_transform_type: JSON.parse(JSON.stringify(parsedInitialTransformType))
})

// 监听 props 变化，更新本地设置
watch(() => props.settings, (newSettings) => {
  const newTransformType = newSettings.custom_transform_type || {}
  const parsedNewTransformType = typeof newTransformType === 'string' 
    ? {} 
    : (newTransformType || {})
  
  localSettings.value = {
    birthDate: newSettings.birthDate || '',
    birthTime: newSettings.birthTime || '12:00',
    gender: newSettings.gender || 'male',
    longitude: newSettings.longitude || '',
    latitude: newSettings.latitude || '',
    is_solar_time: newSettings.is_solar_time || false,
    is_late_zi: newSettings.is_late_zi || false,
    flying_star_self_transform: newSettings.flying_star_self_transform !== undefined ? newSettings.flying_star_self_transform : true,
    leap_boundary: newSettings.leap_boundary || 'mid_month',
    custom_transform_type: parsedNewTransformType,
    custom_transforms: newSettings.custom_transforms || null
  }
  // 更新初始值引用（深拷贝）
  initialSettingsRef.value.custom_transform_type = JSON.parse(JSON.stringify(parsedNewTransformType))
}, { deep: true })

// 当前展开的分组
const expandedGroup = ref(null)

// 切换分组展开/折叠
const toggleGroup = (groupKey) => {
  if (expandedGroup.value === groupKey) {
    expandedGroup.value = null
  } else {
    expandedGroup.value = groupKey
  }
}

// 选择四化类型（选择某个分组下的选项）
const selectTransform = (groupKey, value) => {
  const group = transformGroups[groupKey]
  if (!group) return
  
  // 确保 custom_transform_type 是一个对象
  if (!localSettings.value.custom_transform_type || typeof localSettings.value.custom_transform_type !== 'object') {
    localSettings.value.custom_transform_type = {}
  }
  
  // 更新该分组的选择
  localSettings.value.custom_transform_type[group.stem] = value
  
  // 选择后自动折叠
  expandedGroup.value = null
}

// 获取默认设置
const getDefaultSettings = () => {
  return {
    birthDate: '1999-09-09',
    birthTime: '09:09',
    gender: 'male',
    longitude: '',
    latitude: '',
    is_solar_time: false,
    is_late_zi: false,
    flying_star_self_transform: true,
    leap_boundary: 'mid_month',
    custom_transform_type: {},
    custom_transforms: null
  }
}

// 重置所有设置为默认值
const handleReset = () => {
  if (confirm('确定要重置所有设置为默认值吗？')) {
    const defaultSettings = getDefaultSettings()
    localSettings.value = { ...defaultSettings }
    // 更新初始值引用
    initialSettingsRef.value.custom_transform_type = {}
  }
}

// 获取某个分组当前选中的类型
const getSelectedTransformType = (groupKey) => {
  const group = transformGroups[groupKey]
  if (!group) return ''
  
  const transformType = localSettings.value.custom_transform_type
  if (!transformType || typeof transformType !== 'object') {
    return ''
  }
  
  // 从对象中获取该分组对应的值
  return transformType[group.stem] || ''
}

// 获取当前选中项的描述（显示时使用）
const getCurrentTransformDesc = (groupKey) => {
  const group = transformGroups[groupKey]
  if (!group) return ''
  
  const selectedType = getSelectedTransformType(groupKey)
  if (!selectedType) {
    // 未选择时显示第一项
    return group.options[0]?.name || ''
  }
  
  const selectedOption = group.options.find(
    opt => opt.value === selectedType
  )
  return selectedOption ? selectedOption.name : group.options[0]?.name || ''
}

// 监听 custom_transform_type 变化，自动设置 custom_transforms
watch(() => localSettings.value.custom_transform_type, (newType) => {
  // 如果 custom_transform_type 不为空对象，清空 JSON 配置
  if (newType && typeof newType === 'object' && Object.keys(newType).length > 0) {
    localSettings.value.custom_transforms = null
  }
}, { deep: true })

const handleClose = () => {
  // 退出时自动保存
  const settingsToSave = { ...localSettings.value }
  // 深比较 custom_transform_type 是否与初始值相同
  const currentTransformType = settingsToSave.custom_transform_type || {}
  const initialTransformType = initialSettingsRef.value.custom_transform_type || {}
  const isTransformTypeUnchanged = JSON.stringify(currentTransformType) === JSON.stringify(initialTransformType)
  
  // 如果用户没有修改 custom_transform_type（与初始值相同），则不传递该字段
  if (isTransformTypeUnchanged) {
    delete settingsToSave.custom_transform_type
  }
  
  // 如果 custom_transform_type 为空对象，也不传递
  if (settingsToSave.custom_transform_type && 
      typeof settingsToSave.custom_transform_type === 'object' &&
      Object.keys(settingsToSave.custom_transform_type).length === 0) {
    delete settingsToSave.custom_transform_type
  }
  
  // 如果选择了预设类型，将 custom_transform_type 传递给后端
  // 如果使用 JSON 配置，则传递 custom_transforms
  if (settingsToSave.custom_transform_type && 
      typeof settingsToSave.custom_transform_type === 'object' &&
      Object.keys(settingsToSave.custom_transform_type).length > 0) {
    // 预设类型优先，清空 JSON 配置
    settingsToSave.custom_transforms = null
  }

  emit('save', settingsToSave)
  return true // 验证成功，返回 true
}
</script>

<style scoped>
.settings-page {
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

.settings-header {
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

.settings-title {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #333;
  flex: 1;
  text-align: center;
  padding-right: 60px; /* 为右侧按钮留出空间 */
}

.reset-btn {
  background: none;
  border: 1px solid #ddd;
  border-radius: 6px;
  padding: 6px 16px;
  font-size: 14px;
  color: #666;
  cursor: pointer;
  transition: all 0.2s;
  flex-shrink: 0;
}

.reset-btn:hover {
  background-color: #f5f5f5;
  border-color: #999;
  color: #333;
}

.settings-content {
  flex: 1;
  overflow-y: auto;
  padding: 20px 16px;
  -webkit-overflow-scrolling: touch;
}

.settings-section {
  margin-bottom: 32px;
}

.settings-section:last-of-type {
  margin-bottom: 24px;
}

.section-title {
  margin: 0 0 16px 0;
  font-size: 16px;
  font-weight: 600;
  color: #333;
  padding-bottom: 8px;
  border-bottom: 2px solid #667eea;
}

.form-group {
  margin-bottom: 20px;
}

.form-label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #555;
  margin-bottom: 8px;
}

.form-input {
  width: 100%;
  padding: 10px 12px;
  border: 2px solid #e0e0e0;
  border-radius: 6px;
  font-size: 14px;
  transition: border-color 0.3s;
  outline: none;
  box-sizing: border-box;
}

.form-input:focus {
  border-color: #667eea;
}

.form-textarea {
  width: 100%;
  padding: 10px 12px;
  border: 2px solid #e0e0e0;
  border-radius: 6px;
  font-size: 14px;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  transition: border-color 0.3s;
  outline: none;
  resize: vertical;
  box-sizing: border-box;
}

.form-textarea:focus {
  border-color: #667eea;
}

.form-hint {
  margin-top: 6px;
  font-size: 12px;
  color: #999;
  line-height: 1.4;
}

.form-desc {
  margin-top: 6px;
  font-size: 12px;
  color: #999;
  line-height: 1.4;
}

.gender-options {
  display: flex;
  gap: 16px;
}

.radio-label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 8px 16px;
  border: 2px solid #e0e0e0;
  border-radius: 6px;
  transition: all 0.3s;
}

.radio-label:hover {
  border-color: #667eea;
  background-color: #f5f5f5;
}

.radio-input {
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.radio-input:checked + .radio-text {
  color: #667eea;
  font-weight: 600;
}

.radio-label:has(.radio-input:checked) {
  border-color: #667eea;
  background-color: #f0f4ff;
}

.radio-text {
  font-size: 14px;
  color: #333;
}

.switch-group {
  margin-bottom: 20px;
}

.switch-label {
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  padding: 12px;
  background-color: #f9f9f9;
  border-radius: 6px;
  transition: background-color 0.2s;
}

.switch-label:hover {
  background-color: #f0f0f0;
}

.switch-text {
  font-size: 14px;
  font-weight: 500;
  color: #333;
  flex: 1;
}

.switch-input {
  position: relative;
  width: 44px;
  height: 24px;
  appearance: none;
  background-color: #ccc;
  border-radius: 12px;
  outline: none;
  cursor: pointer;
  transition: background-color 0.3s;
  flex-shrink: 0;
}

.switch-input::before {
  content: '';
  position: absolute;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: white;
  top: 2px;
  left: 2px;
  transition: transform 0.3s;
}

.switch-input:checked {
  background-color: #667eea;
}

.switch-input:checked::before {
  transform: translateX(20px);
}

.switch-desc {
  margin-top: 6px;
  margin-left: 12px;
  font-size: 12px;
  color: #999;
  line-height: 1.4;
}


/* 四化列表样式 */
.transform-list {
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  overflow: hidden;
  background-color: #fff;
}

.transform-group {
  border-bottom: 1px solid #e0e0e0;
}

.transform-group:last-child {
  border-bottom: none;
}

.transform-group-header {
  display: flex;
  align-items: center;
  padding: 14px 16px;
  cursor: pointer;
  transition: background-color 0.2s;
  background-color: #fff;
}

.transform-group-header:hover {
  background-color: #f5f5f5;
}

.transform-group-header.active {
  background-color: #f0f0f0;
}

.transform-stem {
  font-size: 15px;
  font-weight: 500;
  color: #333;
  min-width: 32px;
}

.transform-desc {
  flex: 1;
  font-size: 14px;
  color: #666;
  margin-left: 16px;
  text-align: right;
}

.transform-arrow {
  font-size: 20px;
  color: #999;
  margin-left: 12px;
  transition: transform 0.2s;
  transform: rotate(0deg);
}

.transform-group-header.active .transform-arrow {
  transform: rotate(90deg);
}

.transform-options {
  background-color: #fafafa;
  border-top: 1px solid #e0e0e0;
  padding: 8px 0;
}

.transform-option {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px 12px 48px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.transform-option:hover {
  background-color: #f0f0f0;
}

.transform-option.active {
  background-color: #e8f0fe;
}

.transform-option-name {
  font-size: 14px;
  color: #333;
}

.transform-option.active .transform-option-name {
  color: #667eea;
  font-weight: 500;
}

.transform-check {
  color: #667eea;
  font-size: 16px;
  font-weight: bold;
}

@media (max-width: 640px) {
  .settings-header {
    padding: 10px 12px;
  }
  
  .settings-title {
    font-size: 16px;
    padding-right: 50px;
  }
  
  .settings-content {
    padding: 16px 12px;
  }
  
  .transform-group-header {
    padding: 12px 14px;
  }
  
  .transform-option {
    padding: 10px 14px 10px 40px;
  }
}
</style>

