<script setup lang="ts">
import { ref } from 'vue'
import { getWordList } from '~/composables/getWordList'
import type { Word } from '~/interfaces/word'
// ----- 狀態 -----
const selectedDay = ref<number>(1)
const maxDay = ref<number>(0)
const wordList = ref<Word[][]>(await getWordList())
const dayWords = ref<Word[]>([])
// Visibility controls
const showHiragana = ref(true)
const showMeaning = ref(true)
const showKanji = ref(true)
const selectDay = (day: number) => {
  selectedDay.value = day;
}

watch([selectedDay, wordList], () => {
  dayWords.value = wordList.value[selectedDay.value - 1] || [];
}, { immediate: true })

watch(wordList, () => {
  maxDay.value = wordList.value.length;
}, { immediate: true })

</script>

<template>
  <!-- 天數按鈕 -->
  <div class="day-buttons">
    <button
        v-for="(day, i) in Array(maxDay).fill(0)"
        :key="i"
        :class="{ active: selectedDay === i + 1 }"
        @click="selectDay(i + 1)"
    >
      DAY{{ i + 1 }}
    </button>
  </div>

  <!-- Visibility toggles -->
  <div class="visibility-controls">
    <label>
      <input type="checkbox" v-model="showKanji" />
      漢字
    </label>
    <label>
      <input type="checkbox" v-model="showHiragana" />
      平假名
    </label>
    <label>
      <input type="checkbox" v-model="showMeaning" />
      意味
    </label>
  </div>
  
  
  <div>
    <table class="word-table">
      <thead>
      <tr>
        <th v-if="showKanji">漢字</th>
        <th v-if="showHiragana">平假名</th>
        <th v-if="showMeaning">意味</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="word in dayWords" :key="word.kanji">
        <td v-if="showKanji">{{word.kanji}}</td>
        <td v-if="showHiragana">{{ word.hiragana }}</td>
        <td v-if="showMeaning">{{ word.meaning }}</td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.word-table {
  width: 100%;
  border-collapse: collapse;
}

.word-table th,
.word-table td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

@media (prefers-color-scheme: light) {
  .word-table th {
    background-color: #f4f4f4;
  }
}

@media (prefers-color-scheme: dark) {
  .word-table th {
    background-color: #333;
    color: #fff;
  }
}

.day-buttons {
  margin-bottom: 20px;
}

.day-buttons button.active {
  background-color: #42b983;
  color: white;
}
</style>