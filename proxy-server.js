/**
 * 简单的 API 代理服务器
 * 用于在生产环境中隐藏 appId 和 appKey
 * 
 * 使用方法：
 * 1. 安装依赖：npm install express cors dotenv
 * 2. 创建 .env 文件，添加：
 *    APP_ID=your_app_id
 *    APP_KEY=your_app_key
 *    API_BASE_URL=https://cloud.apiworks.com/open/astro
 *    PORT=3001
 * 3. 运行：node proxy-server.js
 */

const express = require('express')
const cors = require('cors')
const axios = require('axios')
require('dotenv').config()

const app = express()
const PORT = process.env.PORT || 3001

// 中间件
app.use(cors())
app.use(express.json())

// 从环境变量获取密钥
const APP_ID = process.env.APP_ID
const APP_KEY = process.env.APP_KEY
const API_BASE_URL = process.env.API_BASE_URL || 'https://cloud.apiworks.com/open/astro'

if (!APP_ID || !APP_KEY) {
  console.error('错误：请在 .env 文件中设置 APP_ID 和 APP_KEY')
  process.exit(1)
}

// 代理所有 /api/* 请求到后端 API
app.post('/api/ziwei/chart', async (req, res) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/ziwei/chart`,
      req.body,
      {
        headers: {
          'appId': APP_ID,
          'appKey': APP_KEY,
          'Content-Type': 'application/json'
        }
      }
    )
    
    res.json(response.data)
  } catch (error) {
    console.error('代理请求错误:', error.message)
    res.status(error.response?.status || 500).json({
      code: error.response?.status || 500,
      msg: error.response?.data?.msg || error.message,
      data: null
    })
  }
})

app.listen(PORT, () => {
  console.log(`代理服务器运行在 http://localhost:${PORT}`)
  console.log(`API 端点: http://localhost:${PORT}/api/ziwei/chart`)
})

