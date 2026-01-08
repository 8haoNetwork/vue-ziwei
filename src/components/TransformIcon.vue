<template>
  <span 
    class="transform-icon"
    :class="[`transform-icon-${type}`, customClass]"
  >
    <!-- 自化图标：循环箭头 -->
    <svg 
      v-if="type === 'self'"
      width="12" 
      height="12" 
      viewBox="0 10 120 120" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <path 
        d="M68.23 12.23a5.33 5.33 0 0 1 7.54 0l16 16a5.33 5.33 0 0 1 0 7.54l-16 16a5.33 5.33 0 0 1-7.54-7.54L75.13 37.33H66.67C47.74 37.33 32 53.08 32 72S47.74 106.67 66.67 106.67s34.67-15.74 34.67-34.67a5.33 5.33 0 1 1 10.67 0c0 24.81-20.52 45.33-45.33 45.33S21.33 96.81 21.33 72 41.86 26.67 66.67 26.67h8.46l-6.9-6.9a5.33 5.33 0 0 1 0-7.54z" 
        fill="currentColor"
      />
    </svg>
    
    <!-- 对宫化入图标：指向右上方的箭头 -->
    <svg 
      v-if="type === 'opposite'"
      width="12" 
      height="12" 
      viewBox="0 0 120 120" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <path 
        d="M69.025 57.958 L14.800 112.847 L8.062 106.192 l54.230 -54.888 -20.204 -19.963 L112.239 7.488 L89.231 77.921 z" 
        fill="currentColor"
      />
    </svg>
  </span>
</template>

<script setup>
defineProps({
  type: {
    type: String,
    required: true,
    validator: (value) => ['self', 'opposite'].includes(value)
  },
  customClass: {
    type: String,
    default: ''
  }
})
</script>

<style scoped>
.transform-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 9px;
  height: 9px;
  line-height: 1;
}

.transform-icon svg {
  width: 100%;
  height: 100%;
  display: block;
}
@media (max-width: 480px) {
  .transform-icon {
    width: 7px;
    height: 7px;
  }
}
</style>
