<script lang="ts" setup>
import {nextTick, ref, watch} from 'vue'

interface Props {
  maxDay: number
  selectedDay: number
}

const props = defineProps<Props>()
defineEmits(['update:selectedDay'])

const scrollContainer = ref<HTMLDivElement | null>(null)

// 🌟 自動捲動至選中按鈕
watch(
    () => props.selectedDay,
    async () => {
      await nextTick()
      const container = scrollContainer.value
      const activeBtn = container?.querySelector('.bg-blue-500')
      if (activeBtn) {
        activeBtn.scrollIntoView({behavior: 'smooth', inline: 'center'})
      }
    }
)
</script>

<template>
  <div class="day-buttons">
    <button
        v-for="i in maxDay"
        :key="i"
        :class="{ active: selectedDay === i }"
        class="px-3 py-1 rounded-lg border shrink-0"
        @click="$emit('update:selectedDay', i)"
    >
      {{ i }}
    </button>
  </div>
</template>

<style scoped>
.day-buttons {
  margin: 10px;
}


.day-buttons button {
  margin: 5px;
  padding: 5px 10px;
}

.day-buttons button.active {
  background-color: #42b983;
}
</style>
