<template>
  <div class="card">
    <h3 class="text-2xl font-bold mb-4">Drag the letters to spell the word!</h3>

    <div class="mb-6">
      <p class="text-lg mb-2">Target word: <strong class="text-blue-600">CAT</strong></p>
      <div class="flex gap-2 p-4 bg-gray-100 rounded-lg min-h-[80px]">
        <VueDraggable
          v-model="droppedLetters"
          :animation="150"
          class="flex gap-2 flex-1"
          group="letters"
        >
          <div
            v-for="letter in droppedLetters"
            :key="letter.id"
            class="w-16 h-16 bg-blue-500 text-white rounded-lg flex items-center justify-center text-2xl font-bold cursor-move hover:bg-blue-600"
          >
            {{ letter.value }}
          </div>
        </VueDraggable>
      </div>
    </div>

    <div class="mb-4">
      <p class="text-lg mb-2">Available letters:</p>
      <VueDraggable
        v-model="availableLetters"
        :animation="150"
        class="flex gap-2 flex-wrap"
        group="letters"
      >
        <div
          v-for="letter in availableLetters"
          :key="letter.id"
          class="w-16 h-16 bg-green-500 text-white rounded-lg flex items-center justify-center text-2xl font-bold cursor-move hover:bg-green-600"
        >
          {{ letter.value }}
        </div>
      </VueDraggable>
    </div>

    <button
      @click="checkAnswer"
      class="btn-primary"
    >
      Check Answer
    </button>

    <div v-if="message" class="mt-4 p-4 rounded-lg" :class="isCorrect ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'">
      {{ message }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { VueDraggable } from 'vue-draggable-plus'

interface Letter {
  id: number
  value: string
}

const availableLetters = ref<Letter[]>([
  { id: 1, value: 'C' },
  { id: 2, value: 'A' },
  { id: 3, value: 'T' },
  { id: 4, value: 'B' },
  { id: 5, value: 'D' }
])

const droppedLetters = ref<Letter[]>([])
const message = ref('')
const isCorrect = ref(false)

const checkAnswer = () => {
  const word = droppedLetters.value.map(l => l.value).join('')
  if (word === 'CAT') {
    message.value = '🎉 Correct! Great job!'
    isCorrect.value = true
  } else {
    message.value = '🤔 Try again! Drag the letters to spell CAT'
    isCorrect.value = false
  }
}
</script>
