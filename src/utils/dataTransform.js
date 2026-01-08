/**
 * 数据提取工具
 * 只处理必要的 API 响应格式转换
 */

/**
 * 从响应中提取data
 */
export function extractData(response) {
  // 处理后端ApiResp格式
  if (response.data && typeof response.data === 'object') {
    if ('data' in response.data) {
      // 如果响应是 { code, msg, data, exe_time } 格式
      return response.data.data
    }
    // 如果响应直接是数据
    return response.data
  }
  return response.data
}

