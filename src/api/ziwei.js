import axios from 'axios'

// 获取 API 基础地址，如果未设置则给出提示
const baseURL = import.meta.env.VITE_API_BASE_URL
if (!baseURL) {
  console.warn(
    '⚠️ 警告: VITE_API_BASE_URL 未设置！\n' +
    '请在项目根目录创建 .env 文件，并设置 VITE_API_BASE_URL。\n' +
    '例如：VITE_API_BASE_URL=http://localhost:3001/api\n' +
    '或：VITE_API_BASE_URL=https://cloud.apiworks.com/open/astro'
  )
}

const api = axios.create({
  baseURL: baseURL || '',
  timeout: 10000
})

// 请求拦截器：添加header
api.interceptors.request.use(
  (config) => {
    // 添加appId和appKey到header
    // 注意：如果使用环境变量，这些值仍然会暴露在前端代码中
    // 建议使用代理服务器方案（见 README.md）
    config.headers = config.headers || {}
    config.headers['X-App-Id'] = import.meta.env.VITE_APP_ID || ''
    config.headers['X-App-Key'] = import.meta.env.VITE_APP_KEY || ''
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

/**
 * 构建请求体参数
 * @param {Object} params - 前端参数
 * @returns {Object} 后端请求体
 */
function buildRequestBody(params) {
  // 合并出生日期和时间，格式：YYYY-MM-DD HH:mm:ss
  let birthday = params.birthday
  if (!birthday && params.birthDate) {
    if (params.birthTime) {
      // 确保时间格式为 HH:mm:ss
      const timeParts = params.birthTime.split(':')
      const timeStr = timeParts.length === 1 
        ? `${timeParts[0]}:00:00`
        : timeParts.length === 2
        ? `${timeParts[0]}:${timeParts[1]}:00`
        : params.birthTime
      birthday = `${params.birthDate} ${timeStr}`
    } else {
      birthday = `${params.birthDate} 00:00:00`
    }
  }
  
  // 转换性别格式
  const genderMap = {
    '男': 'male',
    '女': 'female',
    'male': 'male',
    'female': 'female'
  }
  const gender = genderMap[params.gender] || params.gender
  
  // 构建请求体（后台接口使用 birth_dt 表示出生日期时间）
  const requestBody = {
    birth_dt: birthday,
    tz: params.tz || 8,
    gender: gender
  }
  
  if (params.target_date !== undefined) {
    requestBody.target_date = params.target_date
  }
  
  // 可选参数
  // longitude 和 latitude 是 Optional[float]，只有提供值时才传递
  if (params.longitude !== undefined && params.longitude !== '' && params.longitude !== null) {
    const lon = parseFloat(params.longitude)
    if (!isNaN(lon)) {
      requestBody.longitude = lon
    }
  }
  if (params.latitude !== undefined && params.latitude !== '' && params.latitude !== null) {
    const lat = parseFloat(params.latitude)
    if (!isNaN(lat)) {
      requestBody.latitude = lat
    }
  }
  // is_solar_time 是 bool，默认 False，应该总是传递
  requestBody.is_solar_time = params.is_solar_time !== undefined ? Boolean(params.is_solar_time) : false
  if (params.is_late_zi !== undefined) {
    requestBody.is_late_zi = params.is_late_zi
  }
  if (params.leap_boundary) {
    requestBody.leap_boundary = params.leap_boundary
  }
  if (params.custom_transform_type) {
    requestBody.custom_transform_type = params.custom_transform_type
  }
  if (params.custom_transforms) {
    requestBody.custom_transforms = params.custom_transforms
  }
  
  return requestBody
}

/**
 * 获取本命盘数据
 * 注意：此接口返回的数据不包含大限、流年、流月、流日、流时等运限数据
 * @param {Object} params - 请求参数（不包含 target_date）
 * @param {string} params.birthday - 出生日期 (格式: YYYY-MM-DD HH:mm:ss)
 * @param {number} params.tz - 时区，默认8
 * @param {string} params.gender - 性别 ('男'/'女' 或 'male'/'female')
 * @param {boolean} params.is_late_zi - 是否使用晚子时处理
 * @param {string} params.leap_boundary - 闰月分界：mid_month/current_month/next_month
 * @param {Object} params.custom_transform_type - 自定义四化配置
 * @returns {Promise}
 */
export function getNatalChart(params) {
  const requestBody = buildRequestBody(params)
  // 本命盘不需要 target_date，确保移除
  delete requestBody.target_date
  // 确保不会传递 target_date 参数
  if ('target_date' in requestBody) {
    delete requestBody.target_date
  }
  return api.post('/ziwei/natal', requestBody)
}

/**
 * 获取紫微斗数盘数据（全部运限及星耀落宫解读）
 * @param {Object} params - 请求参数
 * @param {string} params.birthday - 出生日期 (格式: YYYY-MM-DD HH:mm:ss)
 * @param {number} params.tz - 时区，默认8
 * @param {string} params.gender - 性别 ('男'/'女' 或 'male'/'female')
 * @param {string} params.target_date - 目标日期时间 (格式: YYYY-MM-DD HH:mm:ss，可选)
 * @param {boolean} params.is_late_zi - 是否使用晚子时处理
 * @param {string} params.leap_boundary - 闰月分界：mid_month/current_month/next_month
 * @param {Object} params.custom_transforms - 自定义四化配置
 * @returns {Promise}
 */
export function getZiWeiChart(params) {
  const requestBody = buildRequestBody(params)
  return api.post('/ziwei/detail', requestBody)
}


/**
 * 获取紫微斗数盘数据（全部运限及星耀落宫解读）
 * @param {Object} params - 请求参数
 * @param {string} params.birthday - 出生日期 (格式: YYYY-MM-DD HH:mm:ss)
 * @param {number} params.tz - 时区，默认8
 * @param {string} params.gender - 性别 ('男'/'女' 或 'male'/'female')
 * @param {string} params.target_date - 目标日期时间 (格式: YYYY-MM-DD HH:mm:ss，可选)
 * @param {boolean} params.is_late_zi - 是否使用晚子时处理
 * @param {string} params.leap_boundary - 闰月分界：mid_month/current_month/next_month
 * @param {Object} params.custom_transforms - 自定义四化配置
 * @returns {Promise}
 */
export function getZiWeiDetail(params) {
  const requestBody = buildRequestBody(params)
  return api.post('/ziwei/detail', requestBody)
}


export default api

