<template>
  <div class="dress-up-game select-none">
    <!-- Level Indicator -->
    <div class="text-center mb-4">
      <p class="text-2xl font-bold text-white drop-shadow">
        Item {{ currentStep }} / {{ totalSteps }}
      </p>
      <div class="flex justify-center gap-2 mt-2">
        <div
          v-for="step in totalSteps"
          :key="step"
          class="w-8 h-8 rounded-full flex items-center justify-center font-bold transition-all duration-300"
          :class="step < currentStep ? 'bg-green-500 text-white' : step === currentStep ? 'bg-yellow-400 text-gray-800 scale-110' : 'bg-white/30 text-white/50'"
        >
          {{ step < currentStep ? '✓' : step }}
        </div>
      </div>
    </div>

    <!-- Game Area: Character + Clothing Item -->
    <div class="flex justify-center items-center gap-8 mb-6">
      <!-- Character Image (Left) -->
      <div class="relative bg-white/20 backdrop-blur rounded-3xl p-6">
        <Transition name="character" mode="out-in">
          <img
            :key="currentCharacterImage"
            :src="currentCharacterImage"
            alt="Bugs Bunny"
            class="w-[307px] h-96 md:w-96 md:h-[461px] object-contain drop-shadow-2xl"
          />
        </Transition>
      </div>

      <!-- Clothing Item Image (Right) -->
      <Transition name="clothing" mode="out-in">
        <div
          v-if="!isComplete && currentClothingImage"
          :key="currentClothingImage"
          class="relative bg-white/20 backdrop-blur rounded-3xl p-6"
        >
          <img
            :src="currentClothingImage"
            :alt="currentItemName"
            class="w-[307px] h-96 md:w-96 md:h-[461px] object-contain drop-shadow-2xl"
          />
        </div>
      </Transition>
    </div>

    <!-- Answer Options -->
    <Transition name="options">
      <div
        v-if="showOptions && !isComplete"
        class="flex flex-wrap justify-center gap-4 p-4 bg-white/20 backdrop-blur rounded-2xl max-w-[887px] mx-auto"
      >
        <button
          v-for="option in shuffledOptions"
          :key="option"
          @click="checkAnswer(option)"
          :disabled="isAnswering"
          class="px-10 py-5 bg-white/90 hover:bg-white rounded-xl font-bold text-2xl text-gray-800 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 min-w-[168px] disabled:opacity-50 disabled:pointer-events-none"
        >
          {{ option }}
        </button>
      </div>
    </Transition>

    <!-- Win Message -->
    <div v-if="isComplete" class="text-center mt-6">
      <p class="text-3xl font-bold text-yellow-300 drop-shadow-lg mb-4 animate-bounce">
        Bugs Bunny is Ready for Winter!
      </p>
      <div class="flex justify-center gap-4">
        <button
          @click="resetGame"
          class="px-8 py-4 bg-white/80 hover:bg-white text-gray-700 text-xl font-bold rounded-full shadow-lg hover:scale-105 transition-all"
        >
          Play Again
        </button>
        <NuxtLink
          to="/level5/complete"
          class="px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white text-xl font-bold rounded-full shadow-lg hover:scale-105 transition-all"
        >
          Continue →
        </NuxtLink>
      </div>
    </div>

    <!-- Feedback Message -->
    <Transition name="fade">
      <div
        v-if="feedbackMessage"
        class="fixed inset-0 flex items-center justify-center pointer-events-none z-50"
      >
        <div
          class="px-8 py-4 rounded-2xl text-3xl font-bold shadow-2xl"
          :class="feedbackType === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'"
        >
          {{ feedbackMessage }}
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import confetti from 'canvas-confetti'

interface DressStep {
  correctAnswer: string
  options: string[]
  resultImage: string
  clothingImage: string
}

const totalSteps = 5

const dressSteps: DressStep[] = [
  {
    correctAnswer: 'Parka',
    options: ['Parka', 'Scarf', 'Boots', 'Hat'],
    resultImage: '/images/level5/banny-r-parka.png',
    clothingImage: '/images/level5/parka.png'
  },
  {
    correctAnswer: 'Scarf',
    options: ['Gloves', 'Scarf', 'Socks', 'Mittens'],
    resultImage: '/images/level5/banny-r-boots.png',
    clothingImage: '/images/level5/scarf.png'
  },
  {
    correctAnswer: 'Boots',
    options: ['Shoes', 'Boots', 'Slippers', 'Sandals'],
    resultImage: '/images/level5/banny-r-gloves.png',
    clothingImage: '/images/level5/boots.png'
  },
  {
    correctAnswer: 'Gloves',
    options: ['Mittens', 'Socks', 'Gloves', 'Scarf'],
    resultImage: '/images/level5/banny-r-cap.png',
    clothingImage: '/images/level5/Gloves.png'
  },
  {
    correctAnswer: 'Cap',
    options: ['Hat', 'Cap', 'Hood', 'Beanie'],
    resultImage: '/images/level5/banny-winter.png',
    clothingImage: '/images/level5/cap.png'
  }
]

const currentStep = ref(1)
const showArrow = ref(true)
const showOptions = ref(false)
const isAnswering = ref(false)
const currentCharacterImage = ref('/images/level5/bugs-bunny.png')
const feedbackMessage = ref('')
const feedbackType = ref<'success' | 'error'>('success')

const isComplete = computed(() => currentStep.value > totalSteps)

const currentItemName = computed(() => {
  if (currentStep.value <= totalSteps) {
    return dressSteps[currentStep.value - 1]!.correctAnswer
  }
  return ''
})

const currentClothingImage = computed(() => {
  if (currentStep.value <= totalSteps) {
    return dressSteps[currentStep.value - 1]!.clothingImage
  }
  return ''
})

const shuffle = <T,>(array: T[]): T[] => {
  const arr = [...array]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const temp = arr[i]!
    arr[i] = arr[j]!
    arr[j] = temp
  }
  return arr
}

const shuffledOptions = ref<string[]>([])

const updateShuffledOptions = () => {
  if (currentStep.value <= totalSteps) {
    const step = dressSteps[currentStep.value - 1]!
    shuffledOptions.value = shuffle([...step.options])
  }
}

const checkAnswer = (answer: string) => {
  if (isAnswering.value) return

  const step = dressSteps[currentStep.value - 1]!

  if (answer === step.correctAnswer) {
    isAnswering.value = true
    showFeedback('Correct! ⭐', 'success')
    showOptions.value = false
    showArrow.value = false

    // After 1 second, show the new image
    setTimeout(() => {
      currentCharacterImage.value = step.resultImage

      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 }
      })

      // Move to next step
      currentStep.value++
      isAnswering.value = false

      if (currentStep.value <= totalSteps) {
        // Show arrow for next step
        setTimeout(() => {
          showArrow.value = true
          updateShuffledOptions()
          // Show options after 1 second
          setTimeout(() => {
            showOptions.value = true
          }, 1000)
        }, 500)
      } else {
        // Game complete
        triggerWinConfetti()
      }
    }, 1000)
  } else {
    showFeedback('Try again! 🙈', 'error')
  }
}

const showFeedback = (message: string, type: 'success' | 'error') => {
  feedbackMessage.value = message
  feedbackType.value = type
  setTimeout(() => {
    feedbackMessage.value = ''
  }, 1000)
}

const triggerWinConfetti = () => {
  const duration = 3000
  const end = Date.now() + duration

  ;(function frame() {
    confetti({
      particleCount: 5,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors: ['#A855F7', '#EC4899', '#FBBF24']
    })
    confetti({
      particleCount: 5,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors: ['#A855F7', '#EC4899', '#FBBF24']
    })

    if (Date.now() < end) {
      requestAnimationFrame(frame)
    }
  })()
}

const resetGame = () => {
  currentStep.value = 1
  currentCharacterImage.value = '/images/level5/bugs-bunny.png'
  showArrow.value = true
  showOptions.value = false
  updateShuffledOptions()

  setTimeout(() => {
    showOptions.value = true
  }, 1000)
}

// Initialize - show options after 1 second
onMounted(() => {
  updateShuffledOptions()
  setTimeout(() => {
    showOptions.value = true
  }, 1000)
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.options-enter-active,
.options-leave-active {
  transition: all 0.5s ease;
}

.options-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.options-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

.character-enter-active,
.character-leave-active {
  transition: all 0.5s ease;
}

.character-enter-from {
  opacity: 0;
  transform: scale(0.9);
}

.character-leave-to {
  opacity: 0;
  transform: scale(1.1);
}

.clothing-enter-active,
.clothing-leave-active {
  transition: all 0.5s ease;
}

.clothing-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.clothing-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}
</style>
