<script lang="ts" setup>
import {onMounted, ref} from 'vue'
import {fetchSpreadsheetCount, fetchWordsFromSheet} from "../services/sheet.ts";
import type {Word} from "../interfaces/word.ts";

// ----- 型別定義 -----

// ----- 狀態 -----
const words = ref<Word[]>([])
// 題目順序
const shuffledIndexes = [] as number[]
const wrongWords = ref<Word[]>([])
const currentIndex = ref<number>(0)
const currentWord = ref<Word | null>(null)
const userAnswer = ref<string>('')
const feedback = ref<string>('')
const isCorrect = ref<boolean>(false)
const score = ref<number>(0)
const selectedDay = ref<string>("DAY1")
const maxDay = ref<number>(0)

// ----- Google Sheets 設定 -----
const SPREADSHEET_ID = '1p32SlSi6j3Uy4nxRhdY1cELmGnBSsxsMDiDwllrvXW0'
const API_KEY = 'AIzaSyBVEKg-ozr1Bia9nC7dpQc0QwVUg5XAhc0'

const init = async () => {
  currentIndex.value = 0
  score.value = 0
  feedback.value = ''
  currentWord.value = null
  userAnswer.value = ''
  feedback.value = ''
  maxDay.value =  await fetchSpreadsheetCount(SPREADSHEET_ID, API_KEY);
  wrongWords.value = []
  
  await fetchWords();
  shuffleWords();
  let nextIndex = shuffledIndexes[0] ?? -1
  currentWord.value = words.value[nextIndex] || null;
}

const selectDay = (dayStr: string) => {
  selectedDay.value = dayStr;
  init();
}

// ----- 取得單字 -----
const fetchWords = async (): Promise<void> => {
  try {
    words.value = await fetchWordsFromSheet(SPREADSHEET_ID, `${selectedDay.value}!A:B`, API_KEY)
    currentWord.value = words.value[currentIndex.value] || null
  } catch (err) {
    console.error('讀取單字失敗', err)
  }
}

// ----- 檢查答案 -----
const checkAnswer = (): void => {
  if (!userAnswer.value || !currentWord.value) return

  if (userAnswer.value === currentWord.value.hiragana) {
    feedback.value = '答對了！🎉'
    isCorrect.value = true
    score.value++
  } else {
    feedback.value = `答錯了，正確答案是: ${currentWord.value.hiragana}`
    isCorrect.value = false
    wrongWords.value.push(currentWord.value)
  }

  // 1 秒後自動進入下一題
  setTimeout(() => {
    nextWord()
  }, isCorrect.value ? 1000 : 2000)
}

// ----- 下一題 -----
const nextWord = (): void => {
  currentIndex.value++
  if (currentIndex.value >= words.value.length) {
    feedback.value = '測驗結束！'

    currentIndex.value = 0
    score.value = 0
  } else {
    feedback.value = ''
  }
  let nextIndex = shuffledIndexes[currentIndex.value] ?? -1
  currentWord.value = words.value[nextIndex] || null
  userAnswer.value = ''
}

const shuffleWords = (): void => {
  // Initialize array
  while (shuffledIndexes.length !== 0) {
    shuffledIndexes.pop();
  }

  for (let i = 0; i < words.value.length; i++) {
    shuffledIndexes.push(i)
  }
  let currentIndex = shuffledIndexes.length;
  let randomIndex: number;

  // While there remain elements to shuffle.
  while (currentIndex !== 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [shuffledIndexes[currentIndex], shuffledIndexes[randomIndex]] = [
      shuffledIndexes[randomIndex],
      shuffledIndexes[currentIndex],
    ] as [number, number];
  }
}

// ----- 元件掛載時取得單字 -----
  onMounted(() => {
    //從 Google Sheets 取得最大天數
    
    
    init();
  })
</script>

<template>
  <div class="quiz-container">
    <h1>日文單字小考</h1>

    <!-- 天數按鈕 -->
    <div class="day-buttons">
      <button
          v-for="day in Array(maxDay).fill(0).map((_, i) => 'DAY' + (i + 1))"
          :key="day"
          :class="{ active: selectedDay === day }"
          @click="selectDay(day)"
      >
        {{ day }}
      </button>
    </div>

    <div v-if="currentWord" class="question">
      <p>{{ currentIndex + 1}} / {{ words.length }}</p>
      <p><strong>{{ currentWord?.kanji }}</strong></p>
      <input
          v-model="userAnswer"
          placeholder="請輸入平假名"
          @keyup.enter="checkAnswer"
      />
      <button @click="checkAnswer">確認</button>
    </div>

    <div v-if="feedback" :class="{'correct': isCorrect, 'wrong': !isCorrect}">
      {{ feedback }}
    </div>
    <div v-if="wrongWords.length > 0">
      <ul>
        <li v-for="word in wrongWords">
          {{ word.kanji }} - {{ word.hiragana }}
        </li>
      </ul>
    </div>
  </div>
</template>


<style>
.quiz-container {
  max-width: 400px;
  margin: auto;
  text-align: center;
  font-family: sans-serif;
}

.correct {
  color: green;
}

.wrong {
  color: red;
}

input {
  padding: 5px;
  font-size: 16px;
}

button {
  margin-left: 10px;
  padding: 5px 10px;
}

.day-buttons {
  margin-bottom: 20px;
}

.day-buttons button {
  margin: 0 5px;
  padding: 5px 10px;
}

.day-buttons button.active {
  background-color: #42b983;
  color: white;
}
</style>