<template>
  <div class="app-container">
    <IndexPage v-if="currentPage === 'index'" @navigate="handleNavigate" />
    <ZiWeiChart 
      v-else-if="currentPage === 'full'" 
      :birth-info="defaultBirthInfo"
      @back="goToIndex"
    />
    <NatalChart 
      v-else-if="currentPage === 'natal'" 
      :birth-info="defaultBirthInfo"
      @back="goToIndex"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import IndexPage from './components/IndexPage.vue'
import ZiWeiChart from './components/ZiWeiChart.vue'
import NatalChart from './components/NatalChart.vue'

// 当前页面：'index', 'full', 'natal'
const currentPage = ref('index')

// 默认出生信息
const defaultBirthInfo = ref({
  birthDate: '1999-09-09',
  birthTime: '09:09',
  gender: 'male'
})

const handleNavigate = (page) => {
  currentPage.value = page
}

const goToIndex = () => {
  currentPage.value = 'index'
}
</script>

<style scoped>
.app-container {
  width: 100%;
  min-height: 100vh;
  background-color: #f5f5f5;
}
</style>

