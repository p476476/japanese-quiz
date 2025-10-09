<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from 'vue'

// 倒數時間狀態
const countdown = ref('')

// 目標時間：2025/12/7 9:00 JST
const targetDate = new Date('2025-12-07T09:00:00+09:00') // JST: +09:00

let timer: number | undefined

const updateCountdown = () => {
  const now = new Date()
  const diff = targetDate.getTime() - now.getTime()

  if (diff <= 0) {
    countdown.value = '時間到！'
    clearInterval(timer)
    return
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24)
  const minutes = Math.floor((diff / (1000 * 60)) % 60)
  const seconds = Math.floor((diff / 1000) % 60)

  countdown.value = `${days}日 ${hours}時間 ${minutes}分 ${seconds}秒`
}

// 啟動倒數
onMounted(() => {
  updateCountdown()
  timer = setInterval(updateCountdown, 1000)
})

// 停止倒數
onUnmounted(() => {
  clearInterval(timer)
})
</script>

<template>
  <div class="countdown">
    <p>距離 JLPT 還有：{{ countdown }}</p>
  </div>
</template>

<style scoped>
.countdown {
  text-align: center;
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 20px;
}
</style>