<template>
  <div class="tree-game select-none">
    <!-- Level Indicator -->
    <div class="text-center mb-1">
      <p class="text-2xl font-bold text-white drop-shadow">
        Level {{ currentLevel }} / {{ totalLevels }}
      </p>
      <div class="flex justify-center gap-2 mt-2">
        <div
          v-for="level in totalLevels"
          :key="level"
          class="w-8 h-8 rounded-full flex items-center justify-center font-bold transition-all duration-300"
          :class="level < currentLevel ? 'bg-green-500 text-white' : level === currentLevel ? 'bg-yellow-400 text-gray-800 scale-110' : 'bg-white/30 text-white/50'"
        >
          {{ level <= currentLevel ? (level < currentLevel ? '✓' : level) : level }}
        </div>
      </div>
    </div>

    <!-- Progress Bar for current level -->
    <div class="max-w-md mx-auto mb-1">
      <div class="w-full h-4 bg-green-800 rounded-full overflow-hidden shadow-inner">
        <div
          class="h-full bg-gradient-to-r from-yellow-400 to-yellow-500 transition-all duration-500"
          :style="{ width: `${(currentLevelScore / itemsPerLevel) * 100}%` }"
        ></div>
      </div>
      <p class="text-center mt-2 text-white font-semibold drop-shadow">{{ currentLevelScore }} / {{ itemsPerLevel }}</p>
    </div>

    <!-- Tree Area -->
    <div class="relative flex justify-center mb-0">
      <!-- Tree Image -->
      <div class="relative">
        <img
          src="/images/level6/tree.png"
          alt="Christmas Tree"
          class="w-[624px] h-[702px] md:w-[780px] md:h-[858px] object-contain drop-shadow-2xl"
        />

        <!-- Filled slots from previous levels -->
        <div
          v-for="slot in filledSlots"
          :key="'filled-' + slot.id"
          class="absolute transform -translate-x-1/2 -translate-y-1/2"
          :style="slot.position"
        >
          <div class="px-4 py-2 rounded-xl bg-green-500 shadow-lg">
            <img
              :src="getImagePath(slot.filledImage!, slot.level)"
              :alt="slot.word"
              class="w-16 h-16 object-contain"
            />
          </div>
        </div>

        <!-- Current level slots -->
        <Transition name="slots">
          <div v-if="!isTransitioning" :key="currentLevel">
            <div
              v-for="slot in currentSlots"
              :key="slot.id"
              class="absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300"
              :style="slot.position"
              @dragover.prevent="handleDragOver(slot.id)"
              @dragleave="handleDragLeave"
              @drop.prevent="handleDrop($event, slot.id)"
            >
              <div
                class="px-7 py-4 rounded-xl font-bold text-2xl shadow-lg transition-all duration-300"
                :class="getSlotClass(slot)"
              >
                <span v-if="!slot.filled">{{ slot.word }}</span>
                <img
                  v-else
                  :src="getImagePath(slot.filledImage!, slot.level)"
                  :alt="slot.word"
                  class="w-16 h-16 object-contain"
                />
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </div>

    <!-- Items at Bottom -->
    <Transition name="items" mode="out-in">
      <div
        v-if="!isTransitioning"
        :key="currentLevel"
        class="flex flex-wrap justify-center gap-1 p-1 bg-white/20 backdrop-blur rounded-2xl -mt-8"
      >
        <div
          v-for="item in currentItems"
          :key="item.id"
          class="item-card"
          :class="{ 'opacity-50 pointer-events-none': item.used }"
          :draggable="!item.used"
          @dragstart="handleDragStart($event, item)"
        >
          <img
            :src="getImagePath(item.image, item.level)"
            :alt="item.name"
            class="w-20 h-20 md:w-24 md:h-24 object-contain pointer-events-none"
          />
        </div>
      </div>
    </Transition>

    <!-- Level Complete Message -->
    <Transition name="fade">
      <div
        v-if="showLevelComplete && !isComplete"
        class="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
      >
        <div class="bg-white rounded-3xl p-8 text-center shadow-2xl">
          <p class="text-3xl font-bold text-green-600 mb-4">Level {{ currentLevel - 1 }} Complete!</p>
          <p class="text-xl text-gray-600">Get ready for Level {{ currentLevel }}...</p>
        </div>
      </div>
    </Transition>

    <!-- Win Message -->
    <div v-if="isComplete" class="text-center mt-8">
      <p class="text-3xl font-bold text-yellow-300 drop-shadow-lg mb-4 animate-bounce">
        The Tree is Decorated! 🎄
      </p>
      <div class="flex justify-center gap-4">
        <button
          @click="resetGame"
          class="px-8 py-4 bg-white/80 hover:bg-white text-gray-700 text-xl font-bold rounded-full shadow-lg hover:scale-105 transition-all"
        >
          Play Again
        </button>
        <NuxtLink
          to="/level6/complete"
          class="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white text-xl font-bold rounded-full shadow-lg hover:scale-105 transition-all"
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

interface Item {
  id: number
  name: string
  image: string
  used: boolean
  level: number
}

interface WordSlot {
  id: number
  word: string
  image: string
  position: { top: string; left: string }
  filled: boolean
  filledImage: string | null
  level: number
}

// 5 levels with 3 items each
const itemsPerLevel = 3
const totalLevels = 5

const allItems: Omit<Item, 'used'>[] = [
  // Level 1
  { id: 1, name: 'Boots', image: 'boots.png', level: 1 },
  { id: 2, name: 'Scarf', image: 'scarf.png', level: 1 },
  { id: 3, name: 'Mittens', image: 'mittens.png', level: 1 },
  // Level 2
  { id: 4, name: 'Gloves', image: 'gloves.png', level: 2 },
  { id: 5, name: 'Cap', image: 'cap-winter.png', level: 2 },
  { id: 6, name: 'Skates', image: 'skates.png', level: 2 },
  // Level 3
  { id: 7, name: 'Parka', image: 'parka.png', level: 3 },
  { id: 8, name: 'Pullover', image: 'pullover.png', level: 3 },
  { id: 9, name: 'Sled', image: 'sled.png', level: 3 },
  // Level 4
  { id: 10, name: 'Snowman', image: 'snowman.png', level: 4 },
  { id: 11, name: 'Ski', image: 'ski.png', level: 4 },
  { id: 12, name: 'Snow Globe', image: 'snow-globe.png', level: 4 },
  // Level 5 - Characters
  { id: 13, name: 'Bunny', image: 'banny-winter.png', level: 5 },
  { id: 14, name: 'Santa', image: 'santa-b-r.png', level: 5 },
  { id: 15, name: 'Grinch', image: 'grinch.png', level: 5 },
]

const slotPositions = [
  // Level 1 (top)
  { top: '20%', left: '25%' },
  { top: '20%', left: '50%' },
  { top: '20%', left: '75%' },
  // Level 2
  { top: '35%', left: '20%' },
  { top: '35%', left: '50%' },
  { top: '35%', left: '80%' },
  // Level 3
  { top: '50%', left: '15%' },
  { top: '50%', left: '50%' },
  { top: '50%', left: '85%' },
  // Level 4
  { top: '65%', left: '10%' },
  { top: '65%', left: '50%' },
  { top: '65%', left: '90%' },
  // Level 5 (bottom - characters)
  { top: '80%', left: '18%' },
  { top: '80%', left: '50%' },
  { top: '80%', left: '82%' },
]

// Helper to get image path based on level
const getImagePath = (image: string, level: number) => {
  if (level === 5) {
    return '/images/characters/' + image
  }
  return '/images/level3/' + image
}

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

const currentLevel = ref(1)
const isTransitioning = ref(false)
const showLevelComplete = ref(false)

const availableItems = ref<Item[]>(
  allItems.map(item => ({ ...item, used: false }))
)

const wordSlots = ref<WordSlot[]>(
  allItems.map((item, index) => ({
    id: item.id,
    word: item.name,
    image: item.image,
    position: slotPositions[index]!,
    filled: false,
    filledImage: null,
    level: item.level,
  }))
)

// Get items for current level (shuffled)
const currentItems = computed(() => {
  const levelItems = availableItems.value.filter(item => item.level === currentLevel.value)
  return shuffle(levelItems)
})

// Get slots for current level (shuffled words)
const currentSlots = computed(() => {
  return wordSlots.value.filter(slot => slot.level === currentLevel.value && !slot.filled)
})

// Get filled slots from all levels (to show on tree)
const filledSlots = computed(() => {
  return wordSlots.value.filter(slot => slot.filled)
})

// Score for current level
const currentLevelScore = computed(() => {
  return wordSlots.value.filter(slot => slot.level === currentLevel.value && slot.filled).length
})

const isComplete = computed(() => currentLevel.value > totalLevels)

const draggedItem = ref<Item | null>(null)
const dragOverSlotId = ref<number | null>(null)
const feedbackMessage = ref('')
const feedbackType = ref<'success' | 'error'>('success')

const handleDragStart = (event: DragEvent, item: Item) => {
  if (item.used) return
  draggedItem.value = item
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = 'move'
    event.dataTransfer.setData('text/plain', item.id.toString())
  }
}

const handleDragOver = (slotId: number) => {
  dragOverSlotId.value = slotId
}

const handleDragLeave = () => {
  dragOverSlotId.value = null
}

const handleDrop = (_event: DragEvent, slotId: number) => {
  dragOverSlotId.value = null

  if (!draggedItem.value) return

  const slot = wordSlots.value.find(s => s.id === slotId)
  if (!slot || slot.filled) return

  const item = availableItems.value.find(i => i.id === draggedItem.value!.id)
  if (!item) return

  // Check if correct match
  if (item.name === slot.word) {
    slot.filled = true
    slot.filledImage = item.image
    item.used = true

    showFeedback('Correct! ⭐', 'success')

    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.5 }
    })

    // Check if level complete
    const levelComplete = wordSlots.value
      .filter(s => s.level === currentLevel.value)
      .every(s => s.filled)

    if (levelComplete) {
      if (currentLevel.value < totalLevels) {
        // Move to next level
        isTransitioning.value = true
        showLevelComplete.value = true

        setTimeout(() => {
          showLevelComplete.value = false
          currentLevel.value++
          isTransitioning.value = false
        }, 1500)
      } else {
        // Game complete
        currentLevel.value++
        triggerWinConfetti()
      }
    }
  } else {
    showFeedback('Try again! 🙈', 'error')
  }

  draggedItem.value = null
}

const showFeedback = (message: string, type: 'success' | 'error') => {
  feedbackMessage.value = message
  feedbackType.value = type
  setTimeout(() => {
    feedbackMessage.value = ''
  }, 1000)
}

const getSlotClass = (slot: WordSlot) => {
  if (slot.filled) {
    return 'bg-green-500 text-white scale-110'
  }
  if (dragOverSlotId.value === slot.id) {
    return 'bg-yellow-400 text-gray-800 scale-110 ring-4 ring-yellow-300'
  }
  return 'bg-white/90 text-gray-800 hover:bg-white'
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
      colors: ['#22C55E', '#EF4444', '#FBBF24']
    })
    confetti({
      particleCount: 5,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors: ['#22C55E', '#EF4444', '#FBBF24']
    })

    if (Date.now() < end) {
      requestAnimationFrame(frame)
    }
  })()
}

const resetGame = () => {
  currentLevel.value = 1
  availableItems.value = allItems.map(item => ({ ...item, used: false }))
  wordSlots.value = allItems.map((item, index) => ({
    id: item.id,
    word: item.name,
    image: item.image,
    position: slotPositions[index]!,
    filled: false,
    filledImage: null,
    level: item.level,
  }))
}
</script>

<style scoped>
.item-card {
  @apply cursor-grab active:cursor-grabbing p-3 bg-white/90 rounded-xl shadow-md hover:shadow-lg hover:scale-110 transition-all duration-300 border-2 border-transparent hover:border-green-400;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slots-enter-active,
.slots-leave-active,
.items-enter-active,
.items-leave-active {
  transition: all 0.5s ease;
}

.slots-enter-from,
.items-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.slots-leave-to,
.items-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
</style>
