<template>
  <div class="bag-game select-none">
    <!-- Title -->
    <h2 class="text-2xl md:text-3xl font-bold text-center text-white drop-shadow-lg mb-4">
      Fill in the Santa's sack with winter
    </h2>

    <!-- Progress Bar -->
    <div class="max-w-md mx-auto mb-4">
      <div class="w-full h-6 bg-blue-500 rounded-full overflow-hidden shadow-inner">
        <div
          class="h-full bg-gradient-to-r from-blue-300 to-blue-400 transition-all duration-500"
          :style="{ width: `${(score / totalWinterItems) * 100}%` }"
        ></div>
      </div>
      <p class="text-center mt-2 text-white font-semibold drop-shadow">{{ score }} / {{ totalWinterItems }}</p>
    </div>

    <!-- Collected Items -->
    <div v-if="collectedItems.length > 0" class="max-w-2xl mx-auto mb-6 p-3 bg-green-500/80 backdrop-blur rounded-xl">
      <p class="text-center text-white font-semibold drop-shadow">
        Collected: {{ collectedItems.map(i => i.name).join(', ') }}
      </p>
    </div>

    <!-- Game Area -->
    <div class="relative">
      <!-- Top Row -->
      <div class="flex justify-center gap-4 md:gap-6 mb-4">
        <div
          v-for="item in topItems"
          :key="item.id"
          class="item-card"
          :class="{ 'animate-shake': item.wrong, 'collected': item.collected }"
          draggable="true"
          @dragstart="handleDragStart($event, item.id)"
        >
          <img :src="'/images/level3/' + item.image" :alt="item.name" class="w-16 h-16 md:w-20 md:h-20 object-contain pointer-events-none" />
        </div>
      </div>

      <!-- Middle Section: Left + Bag + Right -->
      <div class="flex justify-between items-center">
        <!-- Left Column -->
        <div class="flex flex-col gap-4">
          <div
            v-for="item in leftItems"
            :key="item.id"
            class="item-card"
            :class="{ 'animate-shake': item.wrong, 'collected': item.collected }"
            draggable="true"
            @dragstart="handleDragStart($event, item.id)"
          >
            <img :src="'/images/level3/' + item.image" :alt="item.name" class="w-16 h-16 md:w-20 md:h-20 object-contain pointer-events-none" />
          </div>
        </div>

        <!-- Bag in Center -->
        <div
          class="bag-drop-zone relative transition-all duration-300 mx-4"
          :class="{ 'scale-110 ring-4 ring-yellow-400': isDragOver }"
          @dragover.prevent="isDragOver = true"
          @dragleave="isDragOver = false"
          @dragenter.prevent
          @drop.prevent="handleDrop"
        >
          <img
            src="/images/level3/bag.png"
            alt="Santa's Bag"
            class="w-[400px] h-[400px] md:w-[500px] md:h-[500px] object-contain drop-shadow-2xl pointer-events-none"
          />
          <div
            v-if="isDragOver"
            class="absolute inset-0 flex items-center justify-center bg-yellow-300/30 rounded-full pointer-events-none"
          >
            <span class="text-5xl animate-pulse">+</span>
          </div>
        </div>

        <!-- Right Column -->
        <div class="flex flex-col gap-4">
          <div
            v-for="item in rightItems"
            :key="item.id"
            class="item-card"
            :class="{ 'animate-shake': item.wrong, 'collected': item.collected }"
            draggable="true"
            @dragstart="handleDragStart($event, item.id)"
          >
            <img :src="'/images/level3/' + item.image" :alt="item.name" class="w-16 h-16 md:w-20 md:h-20 object-contain pointer-events-none" />
          </div>
        </div>
      </div>

      <!-- Bottom Row -->
      <div class="flex justify-center gap-4 md:gap-6 mt-4">
        <div
          v-for="item in bottomItems"
          :key="item.id"
          class="item-card"
          :class="{ 'animate-shake': item.wrong, 'collected': item.collected }"
          draggable="true"
          @dragstart="handleDragStart($event, item.id)"
        >
          <img :src="'/images/level3/' + item.image" :alt="item.name" class="w-16 h-16 md:w-20 md:h-20 object-contain pointer-events-none" />
        </div>
      </div>
    </div>

    <!-- Win Message -->
    <div v-if="isComplete" class="text-center mt-8">
      <p class="text-3xl font-bold text-yellow-300 drop-shadow-lg mb-4 animate-bounce">You Win!</p>
      <button
        @click="resetGame"
        class="px-8 py-4 bg-gradient-to-r from-sky-400 to-blue-500 hover:from-sky-500 hover:to-blue-600 text-white text-xl font-bold rounded-full shadow-lg hover:scale-105 transition-all"
      >
        Play Again!
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import confetti from 'canvas-confetti'

interface Item {
  id: number
  name: string
  image: string
  isWinter: boolean
  collected: boolean
  wrong: boolean
}

const allItems: Omit<Item, 'collected' | 'wrong'>[] = [
  // Winter items (correct) - 13 items
  { id: 1, name: 'Skates', image: 'skates.png', isWinter: true },
  { id: 2, name: 'Sled', image: 'sled.png', isWinter: true },
  { id: 3, name: 'Mittens', image: 'mittens.png', isWinter: true },
  { id: 4, name: 'Snowman', image: 'snowman.png', isWinter: true },
  { id: 5, name: 'Ski', image: 'ski.png', isWinter: true },
  { id: 6, name: 'Snow Globe', image: 'snow-globe.png', isWinter: true },
  { id: 7, name: 'Boots', image: 'boots.png', isWinter: true },
  { id: 8, name: 'Scarf', image: 'scarf.png', isWinter: true },
  { id: 9, name: 'Christmas Ball', image: 'Red-christmas.png', isWinter: true },
  { id: 10, name: 'Pullover', image: 'pullover.png', isWinter: true },
  { id: 11, name: 'Parka', image: 'parka.png', isWinter: true },
  { id: 12, name: 'Gloves', image: 'gloves.png', isWinter: true },
  { id: 13, name: 'Winter Cap', image: 'cap-winter.png', isWinter: true },
  // Non-winter items (incorrect) - 7 items
  { id: 14, name: 'Flippers', image: 'Flippers.png', isWinter: false },
  { id: 15, name: 'Sunglasses', image: 'Sunglasses.png', isWinter: false },
  { id: 16, name: 'Butterfly', image: 'Free-Butterfly.png', isWinter: false },
  { id: 17, name: 'Summer Cap', image: 'cap-summer.png', isWinter: false },
  { id: 18, name: 'Shorts', image: 'Shorts.png', isWinter: false },
  { id: 19, name: 'Flip Flops', image: 'Flip-flops.png', isWinter: false },
  { id: 20, name: 'Diving Mask', image: 'diving-snorkel-mask.png', isWinter: false },
]

const shuffle = <T,>(array: T[]): T[] => {
  const arr = [...array]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

const items = ref<Item[]>(
  shuffle(allItems).map(item => ({ ...item, collected: false, wrong: false }))
)

// Distribute items: top (5), left (5), right (5), bottom (5)
const topItems = computed(() => items.value.slice(0, 5))
const leftItems = computed(() => items.value.slice(5, 10))
const rightItems = computed(() => items.value.slice(10, 15))
const bottomItems = computed(() => items.value.slice(15, 20))

const totalWinterItems = allItems.filter(item => item.isWinter).length
const score = ref(0)
const isDragOver = ref(false)
const draggedItemId = ref<number | null>(null)
const isComplete = computed(() => score.value === totalWinterItems)
const collectedItems = computed(() => items.value.filter(i => i.collected && i.isWinter))

const handleDragStart = (event: DragEvent, itemId: number) => {
  draggedItemId.value = itemId
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = 'move'
    event.dataTransfer.setData('text/plain', itemId.toString())
  }
}

const handleDrop = (event: DragEvent) => {
  isDragOver.value = false

  const itemId = draggedItemId.value || parseInt(event.dataTransfer?.getData('text/plain') || '0')
  if (!itemId) return

  const item = items.value.find(i => i.id === itemId)
  if (!item || item.collected) return

  if (item.isWinter) {
    // Correct answer - collect item
    item.collected = true
    score.value++

    confetti({
      particleCount: 30,
      spread: 60,
      origin: { y: 0.6 }
    })

    if (isComplete.value) {
      triggerWinConfetti()
    }
  } else {
    // Wrong answer - shake
    item.wrong = true
    setTimeout(() => {
      item.wrong = false
    }, 500)
  }

  draggedItemId.value = null
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
      colors: ['#60A5FA', '#34D399', '#FBBF24']
    })
    confetti({
      particleCount: 5,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors: ['#60A5FA', '#34D399', '#FBBF24']
    })

    if (Date.now() < end) {
      requestAnimationFrame(frame)
    }
  })()
}

const resetGame = () => {
  items.value = shuffle(allItems).map(item => ({ ...item, collected: false, wrong: false }))
  score.value = 0
}
</script>

<style scoped>
.item-card {
  @apply cursor-grab active:cursor-grabbing p-2 bg-white/80 rounded-xl shadow-md hover:shadow-lg hover:scale-110 transition-all duration-300 border-2 border-transparent hover:border-blue-300;
}

.item-card.collected {
  @apply opacity-0 scale-0 pointer-events-none;
}

.bag-drop-zone {
  min-width: 200px;
  min-height: 200px;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-10px); }
  75% { transform: translateX(10px); }
}

.animate-shake {
  animation: shake 0.3s ease-in-out 2;
}
</style>
