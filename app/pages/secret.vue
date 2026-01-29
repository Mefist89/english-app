<template>
  <div
    class="min-h-screen relative bg-cover bg-center bg-no-repeat overflow-hidden"
    style="background-image: url('/images/level6/bg6.jpg')"
  >
    <!-- Dark dramatic overlay -->
    <div class="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70"></div>

    <!-- Battle Arena -->
    <div class="relative z-10 min-h-screen flex flex-col items-center justify-center p-4">
      <!-- Title -->
      <h1 class="text-4xl md:text-5xl font-black text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-yellow-400 to-green-500 drop-shadow-lg">
        Santa Claus vs Grinch
      </h1>

      <!-- Gift Counters -->
      <div class="w-full max-w-4xl flex justify-between items-center mb-8 px-4">
        <!-- Santa Gifts -->
        <div class="flex flex-col items-center gap-2">
          <div class="flex items-center gap-2">
            <span class="text-2xl">🎅</span>
            <span class="text-white font-bold text-lg">Santa</span>
          </div>
          <div class="flex items-center gap-2">
            <div class="w-40 md:w-56 h-8 bg-gray-800/80 rounded-full overflow-hidden border-3 border-red-400">
              <div
                class="h-full bg-gradient-to-r from-red-500 to-yellow-400 transition-all duration-500 rounded-full flex items-center justify-end pr-2"
                :style="{ width: `${santaGiftsPercent}%` }"
              >
                <span v-if="santaGifts > 0" class="text-lg">🎁</span>
              </div>
            </div>
            <span class="text-yellow-300 font-bold text-xl">{{ santaGifts }}/5</span>
          </div>
        </div>

        <!-- Grinch Gifts -->
        <div class="flex flex-col items-center gap-2">
          <div class="flex items-center gap-2">
            <span class="text-white font-bold text-lg">Grinch</span>
            <span class="text-2xl">💚</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-green-300 font-bold text-xl">{{ grinchGifts }}/5</span>
            <div class="w-40 md:w-56 h-8 bg-gray-800/80 rounded-full overflow-hidden border-3 border-green-400">
              <div
                class="h-full bg-gradient-to-r from-green-500 to-emerald-400 transition-all duration-500 rounded-full flex items-center justify-end pr-2"
                :style="{ width: `${grinchGiftsPercent}%` }"
              >
                <span v-if="grinchGifts > 0" class="text-lg">🎁</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Battle Scene -->
      <div class="flex items-end justify-center gap-8 md:gap-24 mb-8">
        <!-- Santa -->
        <div class="relative">
          <img
            src="/images/characters/santa-b-r.png"
            alt="Santa Claus"
            class="h-52 md:h-72 w-auto object-contain drop-shadow-2xl transition-all duration-300"
            :class="[
              santaAttacking ? 'animate-attack-right' : '',
              santaDamaged ? 'animate-damage' : ''
            ]"
          />
          <!-- Attack Effect -->
          <Transition name="attack-effect">
            <div v-if="santaAttacking" class="absolute -right-8 top-1/2 -translate-y-1/2">
              <span class="text-5xl">✨</span>
            </div>
          </Transition>
        </div>

        <!-- VS -->
        <div class="text-6xl font-black text-yellow-400 drop-shadow-lg animate-pulse">
          VS
        </div>

        <!-- Grinch -->
        <div class="relative">
          <img
            src="/images/characters/grinch-santa.png"
            alt="Grinch"
            class="h-48 md:h-64 w-auto object-contain drop-shadow-2xl transition-all duration-300"
            :class="[
              grinchAttacking ? 'animate-attack-left' : '',
              grinchDamaged ? 'animate-damage' : ''
            ]"
          />
          <!-- Attack Effect -->
          <Transition name="attack-effect">
            <div v-if="grinchAttacking" class="absolute -left-8 top-1/2 -translate-y-1/2">
              <span class="text-5xl">💥</span>
            </div>
          </Transition>
        </div>
      </div>

      <!-- Question Box -->
      <div v-if="!gameOver" class="w-full max-w-2xl">
        <div class="bg-gradient-to-br from-indigo-900 to-purple-900 backdrop-blur-xl rounded-3xl shadow-2xl p-6 md:p-8 border-4 border-yellow-400/50">
          <!-- Question -->
          <div class="text-center mb-6">
            <p class="text-yellow-300 text-xl font-bold mb-4">Help Santa! What is this?</p>
            <div class="bg-white/90 rounded-2xl p-4 inline-block">
              <img
                :src="currentQuestion.image"
                :alt="currentQuestion.answer"
                class="w-28 h-28 object-contain mx-auto"
              />
            </div>
          </div>

          <!-- Answer Options -->
          <div class="grid grid-cols-2 gap-4">
            <button
              v-for="option in currentQuestion.options"
              :key="option"
              @click="checkAnswer(option)"
              :disabled="isChecking"
              class="py-4 px-6 rounded-xl font-bold text-xl transition-all duration-300 border-3 shadow-lg"
              :class="getOptionClass(option)"
            >
              {{ option }}
            </button>
          </div>

          <!-- Score Display -->
          <div class="text-center mt-6 text-yellow-300 font-bold text-lg">
            🎁 First to collect 5 gifts wins! 🎁
          </div>
        </div>
      </div>

      <!-- Game Over Screen -->
      <Transition name="fade">
        <div v-if="gameOver" class="w-full max-w-xl">
          <div class="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 text-center">
            <!-- Victory - Santa collected 5 gifts -->
            <template v-if="santaGifts >= maxGifts">
              <div class="text-6xl mb-4">🎉🎅🎁🎄🎁</div>
              <h2 class="text-3xl font-black text-green-600 mb-4">Santa Wins!</h2>
              <p class="text-xl text-gray-600 mb-6">You collected all the gifts! Christmas is saved!</p>
            </template>

            <!-- Defeat - Grinch collected 5 gifts -->
            <template v-else>
              <div class="text-6xl mb-4">💚🎁😈🎁💚</div>
              <h2 class="text-3xl font-black text-red-600 mb-4">Grinch Wins!</h2>
              <p class="text-xl text-gray-600 mb-6">Grinch stole all the gifts! Try again!</p>
            </template>

            <!-- Buttons -->
            <div class="flex flex-col sm:flex-row justify-center gap-4">
              <button
                @click="restartGame"
                class="px-8 py-4 bg-gradient-to-r from-red-500 to-green-500 text-white rounded-full font-bold text-lg shadow-lg hover:shadow-xl transition-all hover:scale-105"
              >
                Play Again
              </button>
              <NuxtLink
                to="/"
                class="px-8 py-4 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-full font-bold text-lg transition-all hover:scale-105 text-center"
              >
                Back to Menu
              </NuxtLink>
            </div>
          </div>
        </div>
      </Transition>

      <!-- Back Button -->
      <NuxtLink
        to="/"
        class="fixed top-4 left-4 z-50 w-12 h-12 bg-white/90 hover:bg-white rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import confetti from 'canvas-confetti'

definePageMeta({
  layout: false
})

interface Question {
  image: string
  answer: string
  options: string[]
}

const questions: Question[] = [
  { image: '/images/level3/boots.png', answer: 'Boots', options: ['Boots', 'Scarf', 'Mittens', 'Cap'] },
  { image: '/images/level3/scarf.png', answer: 'Scarf', options: ['Gloves', 'Scarf', 'Parka', 'Sled'] },
  { image: '/images/level3/mittens.png', answer: 'Mittens', options: ['Mittens', 'Boots', 'Ski', 'Cap'] },
  { image: '/images/level3/gloves.png', answer: 'Gloves', options: ['Scarf', 'Pullover', 'Gloves', 'Skates'] },
  { image: '/images/level3/cap-winter.png', answer: 'Cap', options: ['Mittens', 'Cap', 'Boots', 'Sled'] },
  { image: '/images/level3/skates.png', answer: 'Skates', options: ['Ski', 'Sled', 'Skates', 'Snowman'] },
  { image: '/images/level3/parka.png', answer: 'Parka', options: ['Parka', 'Pullover', 'Scarf', 'Gloves'] },
  { image: '/images/level3/pullover.png', answer: 'Pullover', options: ['Parka', 'Pullover', 'Cap', 'Boots'] },
  { image: '/images/level3/sled.png', answer: 'Sled', options: ['Ski', 'Skates', 'Sled', 'Snowman'] },
  { image: '/images/level3/snowman.png', answer: 'Snowman', options: ['Snow Globe', 'Snowman', 'Skates', 'Mittens'] },
  { image: '/images/level3/ski.png', answer: 'Ski', options: ['Ski', 'Sled', 'Skates', 'Boots'] },
  { image: '/images/level3/snow-globe.png', answer: 'Snow Globe', options: ['Snowman', 'Christmas Ball', 'Snow Globe', 'Mittens'] },
]

// Shuffle and pick questions
const shuffleArray = <T>(array: T[]): T[] => {
  const newArray = [...array]
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[newArray[i], newArray[j]] = [newArray[j]!, newArray[i]!]
  }
  return newArray
}

const maxGifts = 5
const gameQuestions = ref<Question[]>([])
const currentRound = ref(1)
const santaGifts = ref(0)
const grinchGifts = ref(0)
const gameOver = ref(false)
const isChecking = ref(false)
const selectedAnswer = ref<string | null>(null)
const isCorrect = ref<boolean | null>(null)

// Computed percentages for progress bars
const santaGiftsPercent = computed(() => (santaGifts.value / maxGifts) * 100)
const grinchGiftsPercent = computed(() => (grinchGifts.value / maxGifts) * 100)

// Attack animations
const santaAttacking = ref(false)
const grinchAttacking = ref(false)
const santaDamaged = ref(false)
const grinchDamaged = ref(false)

const currentQuestion = computed(() => {
  const q = gameQuestions.value[currentRound.value - 1]
  if (!q) return { image: '', answer: '', options: [] }
  // Shuffle options for each question
  return {
    ...q,
    options: shuffleArray(q.options)
  }
})

const initGame = () => {
  gameQuestions.value = shuffleArray(questions).slice(0, 10) // More questions for 5 gifts each
  currentRound.value = 1
  santaGifts.value = 0
  grinchGifts.value = 0
  gameOver.value = false
  selectedAnswer.value = null
  isCorrect.value = null
}

const getOptionClass = (option: string) => {
  if (selectedAnswer.value === null) {
    return 'bg-gradient-to-r from-sky-400 to-blue-500 border-sky-300 hover:from-sky-300 hover:to-blue-400 hover:scale-105 text-white'
  }

  if (option === currentQuestion.value.answer) {
    return 'bg-gradient-to-r from-green-400 to-emerald-500 border-green-300 text-white scale-105 shadow-green-500/50'
  }

  if (option === selectedAnswer.value && !isCorrect.value) {
    return 'bg-gradient-to-r from-red-500 to-rose-600 border-red-400 text-white'
  }

  return 'bg-gray-500/50 border-gray-400 text-gray-300'
}

const checkAnswer = async (answer: string) => {
  if (isChecking.value) return

  isChecking.value = true
  selectedAnswer.value = answer
  isCorrect.value = answer === currentQuestion.value.answer

  if (isCorrect.value) {
    // Santa gets a gift!
    santaAttacking.value = true
    await new Promise(r => setTimeout(r, 300))
    santaGifts.value = Math.min(maxGifts, santaGifts.value + 1)
    await new Promise(r => setTimeout(r, 300))
    santaAttacking.value = false
  } else {
    // Grinch steals a gift!
    grinchAttacking.value = true
    await new Promise(r => setTimeout(r, 300))
    grinchGifts.value = Math.min(maxGifts, grinchGifts.value + 1)
    await new Promise(r => setTimeout(r, 300))
    grinchAttacking.value = false
  }

  // Check game over - whoever gets 5 gifts first wins
  if (santaGifts.value >= maxGifts || grinchGifts.value >= maxGifts) {
    await new Promise(r => setTimeout(r, 500))
    gameOver.value = true

    if (santaGifts.value >= maxGifts) {
      // Santa wins - Victory confetti
      confetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.6 },
        colors: ['#ef4444', '#22c55e', '#fbbf24', '#ffffff']
      })
    }
  } else {
    // Next round
    await new Promise(r => setTimeout(r, 800))
    currentRound.value++
    selectedAnswer.value = null
    isCorrect.value = null
  }

  isChecking.value = false
}

const restartGame = () => {
  initGame()
}

onMounted(() => {
  initGame()
})
</script>

<style scoped>
@keyframes attack-right {
  0%, 100% {
    transform: translateX(0);
  }
  50% {
    transform: translateX(30px);
  }
}

@keyframes attack-left {
  0%, 100% {
    transform: translateX(0);
  }
  50% {
    transform: translateX(-30px);
  }
}

@keyframes damage {
  0%, 100% {
    filter: brightness(1);
  }
  25%, 75% {
    filter: brightness(0.5) sepia(1) hue-rotate(-50deg);
  }
  50% {
    filter: brightness(2);
  }
}

.animate-attack-right {
  animation: attack-right 0.4s ease-in-out;
}

.animate-attack-left {
  animation: attack-left 0.4s ease-in-out;
}

.animate-damage {
  animation: damage 0.4s ease-in-out;
}

/* Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: all 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: scale(0.9);
}

.attack-effect-enter-active {
  transition: all 0.2s ease-out;
}

.attack-effect-leave-active {
  transition: all 0.2s ease-in;
}

.attack-effect-enter-from {
  opacity: 0;
  transform: translateY(-50%) scale(0);
}

.attack-effect-leave-to {
  opacity: 0;
  transform: translateY(-50%) scale(2);
}
</style>
