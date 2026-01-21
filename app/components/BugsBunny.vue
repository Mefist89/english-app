<template>
  <div
    v-motion
    :initial="{ opacity: 0, scale: 0.8, y: 50 }"
    :enter="{ opacity: 1, scale: 1, y: 0, transition: { duration: 600, type: 'spring' } }"
    class="relative"
  >
    <div class="relative inline-block">
      <!-- Character Image -->
      <img
        :src="characterImage"
        :alt="characterName"
        class="w-full h-auto max-w-xs md:max-w-md lg:max-w-lg object-contain drop-shadow-2xl"
        :class="{ 'animate-bounce': isAnimating }"
      />

      <!-- Speech Bubble -->
      <div
        v-if="message"
        v-motion
        :initial="{ opacity: 0, scale: 0.5, y: 20 }"
        :enter="{ opacity: 1, scale: 1, y: 0, transition: { duration: 300 } }"
        class="absolute -top-4 left-1/2 transform -translate-x-1/2 -translate-y-full mb-4"
      >
        <div class="relative bg-white rounded-2xl shadow-xl p-4 md:p-6 max-w-xs border-4 border-blue-400">
          <p class="text-lg md:text-xl font-bold text-gray-800 text-center">
            {{ message }}
          </p>
          <!-- Speech bubble tail -->
          <div class="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full">
            <div class="w-0 h-0 border-l-[20px] border-l-transparent border-r-[20px] border-r-transparent border-t-[20px] border-t-blue-400"></div>
            <div class="w-0 h-0 border-l-[16px] border-l-transparent border-r-[16px] border-r-transparent border-t-[16px] border-t-white absolute -top-[18px] left-1/2 transform -translate-x-1/2"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Props {
  message?: string
  animate?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  message: '',
  animate: false
})

const characterName = 'Bugs Bunny'
const characterImage = '/images/characters/bugs-bunny.png'
const isAnimating = ref(props.animate)

// Function to trigger animation
const bounce = () => {
  isAnimating.value = true
  setTimeout(() => {
    isAnimating.value = false
  }, 1000)
}

defineExpose({
  bounce
})
</script>

<style scoped>
@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-20px);
  }
}

.animate-bounce {
  animation: bounce 1s ease-in-out;
}
</style>
