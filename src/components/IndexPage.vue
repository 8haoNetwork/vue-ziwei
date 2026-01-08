<template>
  <div class="index-page">
    <div class="index-container">
      <h1 class="title">紫微斗数盘</h1>
      <p class="subtitle">选择查看方式</p>
      
      <div class="options">
        <div class="option-card" @click="navigateToFullChart">
          <div class="card-icon">📊</div>
          <h2 class="card-title">完整运限盘</h2>
          <p class="card-description">查看本命、大限、流年、流月、流日、流时等全部运限</p>
        </div>
        
        <div class="option-card" @click="navigateToNatalChart">
          <div class="card-icon">⭐</div>
          <h2 class="card-title">本命盘</h2>
          <p class="card-description">仅查看本命盘数据，快速了解命盘基本信息</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const emit = defineEmits(['navigate'])

const navigateToFullChart = () => {
  emit('navigate', 'full')
}

const navigateToNatalChart = () => {
  emit('navigate', 'natal')
}
</script>

<style scoped>
.index-page {
  width: 100%;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 20px;
}

.index-container {
  max-width: 800px;
  width: 100%;
  text-align: center;
}

.title {
  font-size: 48px;
  font-weight: 700;
  color: #2d3748;
  margin: 0 0 10px 0;
}

.subtitle {
  font-size: 18px;
  color: #4a5568;
  margin: 0 0 40px 0;
}

.options {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
  margin-top: 40px;
}

.option-card {
  background: white;
  border-radius: 12px;
  padding: 32px 24px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  border: 1px solid #e2e8f0;
}

.option-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
  border-color: #cbd5e0;
}

.option-card:active {
  transform: translateY(-2px);
}

.card-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.card-title {
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin: 0 0 12px 0;
}

.card-description {
  font-size: 14px;
  color: #666;
  line-height: 1.6;
  margin: 0;
}

@media (max-width: 640px) {
  .title {
    font-size: 36px;
  }
  
  .subtitle {
    font-size: 16px;
  }
  
  .options {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  
  .option-card {
    padding: 24px 20px;
  }
  
  .card-title {
    font-size: 20px;
  }
}
</style>

