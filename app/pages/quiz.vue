<script lang="ts" setup>
import {onMounted, ref} from 'vue'
import type {Word} from "~/interfaces/word";
import {getWordList} from "~/composables/getWordList";

// ----- 型別定義 -----

// ----- 狀態 -----
const selectedDay = ref<number>(1)
// 題目順序
const shuffledIndexes = [] as number[]
const wrongWords = ref<Word[]>([])
const currentIndex = ref<number>(-1)
const userAnswer = ref<string>('')
const feedback = ref<string>('')
const isCorrect = ref<boolean>(false)
const maxDay = ref<number>(0)
const wordList = ref<Word[][]>(await getWordList())
const dayWords = ref<Word[]>([])
const currentWord = ref<Word | null>(null)

const init = async () => {
  currentIndex.value = 0
  feedback.value = ''
  userAnswer.value = ''
  feedback.value = ''
  maxDay.value = wordList.value.length
  wrongWords.value = []

  shuffleWords();
}

const selectDay = (day: number) => {
  selectedDay.value = day;
  init();
}

// ----- 檢查答案 -----
const checkAnswer = (): void => {
  if (!userAnswer.value || !currentWord.value) return

  if (userAnswer.value === currentWord.value.hiragana) {
    feedback.value = '答對了！🎉'
    isCorrect.value = true
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
  if (currentIndex.value >= dayWords.value.length) {
    feedback.value = '測驗結束！'
    currentIndex.value = -1
  } else {
    feedback.value = ''
  }
  userAnswer.value = ''
}

const shuffleWords = (): void => {
  // Initialize array
  while (shuffledIndexes.length !== 0) {
    shuffledIndexes.pop();
  }

  for (let i = 0; i < wordList.value[selectedDay.value - 1]!.length; i++) {
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

watch([wordList, selectedDay, currentIndex], () => {
  dayWords.value = wordList.value[selectedDay.value - 1] || [];
  let index = shuffledIndexes[currentIndex.value] || 0;
  currentWord.value = dayWords.value[index] || null;
});

// ----- 元件掛載時取得單字 -----
onMounted(() => {
  init();
})

</script>

<template>
  <div class="quiz-container">
    <h1>日文單字小考</h1>

    <div>
      <DayScrollButtons
          v-model:selectedDay="selectedDay"
          :maxDay="maxDay"
      />
    </div>

    <div v-if="currentIndex >= 0" class="question">
      <p>{{ currentIndex + 1 }} / {{ dayWords.length }}</p>
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