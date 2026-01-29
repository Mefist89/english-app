<template>
  <div class="shadow-game">
    <!-- Progress -->
    <div class="max-w-md mx-auto mb-6">
      <div class="flex justify-between text-white font-semibold mb-2">
        <span>Question {{ currentIndex + 1 }} / {{ totalQuestions }}</span>
        <span>Score: {{ score }}</span>
      </div>
      <div class="w-full h-4 bg-white/30 rounded-full overflow-hidden">
        <div
          class="h-full bg-gradient-to-r from-pink-400 to-purple-500 transition-all duration-500"
          :style="{ width: `${((currentIndex + 1) / totalQuestions) * 100}%` }"
        ></div>
      </div>
    </div>

    <!-- Image Display -->
    <div class="flex justify-center mb-8">
      <div class="relative w-64 h-64 md:w-80 md:h-80">
        <!-- Visible half (left/top) -->
        <div class="absolute inset-0 overflow-hidden" style="clip-path: polygon(0 0, 100% 0, 0 100%);">
          <img
            :src="currentItem.image"
            :alt="currentItem.name"
            class="w-full h-full object-contain"
          />
        </div>
        <!-- Shadow half (right/bottom) -->
        <div class="absolute inset-0 overflow-hidden" style="clip-path: polygon(100% 0, 100% 100%, 0 100%);">
          <img
            :src="currentItem.image"
            :alt="currentItem.name"
            class="w-full h-full object-contain brightness-0 opacity-40"
          />
        </div>
        <!-- Diagonal line -->
        <div class="absolute inset-0 pointer-events-none">
          <svg class="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <line x1="0" y1="100" x2="100" y2="0" stroke="white" stroke-width="0.5" stroke-dasharray="4,4" opacity="0.5"/>
          </svg>
        </div>
      </div>
    </div>

    <!-- Answer Options -->
    <div class="grid grid-cols-2 gap-4 max-w-lg mx-auto">
      <button
        v-for="option in currentOptions"
        :key="option.id"
        @click="selectAnswer(option)"
        :disabled="answered"
        class="p-4 rounded-2xl font-bold text-lg transition-all duration-300 border-4"
        :class="getOptionClass(option)"
      >
        {{ option.name }}
      </button>
    </div>

    <!-- Feedback -->
    <div v-if="answered" class="text-center mt-6">
      <p
        class="text-2xl font-bold mb-4"
        :class="isCorrect ? 'text-green-400' : 'text-red-400'"
      >
        {{ isCorrect ? 'Correct!' : 'Wrong! It was ' + currentItem.name }}
      </p>
      <button
        v-if="currentIndex < totalQuestions - 1"
        @click="nextQuestion"
        class="px-8 py-3 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-bold text-xl rounded-full shadow-lg hover:scale-105 transition-all"
      >
        Next
      </button>
    </div>

    <!-- Game Complete -->
    <div v-if="isComplete" class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div class="bg-white rounded-3xl p-10 text-center shadow-2xl max-w-md mx-4">
        <div class="text-7xl mb-4">
          {{ score >= totalQuestions * 0.7 ? '🎉' : '👍' }}
        </div>
        <h2 class="text-4xl font-black text-cyan-600 mb-2">
          {{ score >= totalQuestions * 0.7 ? 'Great Job!' : 'Good Try!' }}
        </h2>
        <p class="text-xl text-gray-600 mb-6">
          You got {{ score }} out of {{ totalQuestions }} correct!
        </p>
        <div class="flex flex-col gap-3">
          <button
            @click="resetGame"
            class="w-full py-4 bg-gray-200 hover:bg-gray-300 text-gray-700 text-xl font-bold rounded-full transition-all hover:scale-105"
          >
            Play Again
          </button>
          <NuxtLink
            to="/level4/complete"
            class="w-full py-4 bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-white text-xl font-bold rounded-full shadow-lg hover:scale-105 transition-all inline-block"
          >
            Continue →
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import confetti from 'canvas-confetti'

interface Item {
  id: number
  name: string
  image: string
}

const allItems: Item[] = [
  { id: 1, name: 'Skates', image: '/images/level3/skates.png' },
  { id: 2, name: 'Sled', image: '/images/level3/sled.png' },
  { id: 3, name: 'Mittens', image: '/images/level3/mittens.png' },
  { id: 4, name: 'Snowman', image: '/images/level3/snowman.png' },
  { id: 5, name: 'Ski', image: '/images/level3/ski.png' },
  { id: 6, name: 'Snow Globe', image: '/images/level3/snow-globe.png' },
  { id: 7, name: 'Boots', image: '/images/level3/boots.png' },
  { id: 8, name: 'Scarf', image: '/images/level3/scarf.png' },
  { id: 9, name: 'Christmas Ball', image: '/images/level3/Red-christmas.png' },
  { id: 10, name: 'Pullover', image: '/images/level3/pullover.png' },
  { id: 11, name: 'Parka', image: '/images/level3/parka.png' },
  { id: 12, name: 'Gloves', image: '/images/level3/gloves.png' },
  { id: 13, name: 'Winter Cap', image: '/images/level3/cap-winter.png' },
]

const shuffle = <T,>(array: T[]): T[] => {
  const arr = [...array]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

const totalQuestions = 8
const questions = ref<Item[]>([])
const currentIndex = ref(0)
const score = ref(0)
const answered = ref(false)
const selectedOption = ref<Item | null>(null)
const isCorrect = ref(false)
const isComplete = ref(false)

const currentItem = computed(() => questions.value[currentIndex.value] || allItems[0])

const currentOptions = computed(() => {
  const correct = currentItem.value
  const others = shuffle(allItems.filter(item => item.id !== correct.id)).slice(0, 3)
  return shuffle([correct, ...others])
})

const getOptionClass = (option: Item) => {
  if (!answered.value) {
    return 'bg-white/90 hover:bg-white border-white/50 hover:border-purple-300 text-gray-700 hover:scale-105'
  }

  if (option.id === currentItem.value.id) {
    return 'bg-green-500 border-green-400 text-white'
  }

  if (selectedOption.value?.id === option.id && !isCorrect.value) {
    return 'bg-red-500 border-red-400 text-white'
  }

  return 'bg-white/50 border-white/30 text-gray-400'
}

const selectAnswer = (option: Item) => {
  if (answered.value) return

  answered.value = true
  selectedOption.value = option
  isCorrect.value = option.id === currentItem.value.id

  if (isCorrect.value) {
    score.value++
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 }
    })
  }
}

const nextQuestion = () => {
  if (currentIndex.value < totalQuestions - 1) {
    currentIndex.value++
    answered.value = false
    selectedOption.value = null
  } else {
    isComplete.value = true
    if (score.value >= totalQuestions * 0.7) {
      triggerWinConfetti()
    }
  }
}

const triggerWinConfetti = () => {
  const duration = 2000
  const end = Date.now() + duration

  ;(function frame() {
    confetti({
      particleCount: 3,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors: ['#EC4899', '#A855F7', '#3B82F6']
    })
    confetti({
      particleCount: 3,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors: ['#EC4899', '#A855F7', '#3B82F6']
    })

    if (Date.now() < end) {
      requestAnimationFrame(frame)
    }
  })()
}

const resetGame = () => {
  questions.value = shuffle([...allItems]).slice(0, totalQuestions)
  currentIndex.value = 0
  score.value = 0
  answered.value = false
  selectedOption.value = null
  isCorrect.value = false
  isComplete.value = false
}

// Initialize
onMounted(() => {
  resetGame()
})
</script>

<style scoped>
</style>
