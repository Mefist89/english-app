<template>
  <div class="level-complete fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
    <div class="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
      <!-- Header with Character -->
      <div class="flex flex-col md:flex-row items-center gap-6 mb-8">
        <!-- Character -->
        <div class="w-32 md:w-40 shrink-0">
          <img
            :src="characterImage"
            :alt="characterName"
            class="w-full h-auto drop-shadow-xl animate-bounce-slow"
          />
        </div>

        <!-- Message -->
        <div class="text-center md:text-left">
          <h2 class="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-emerald-600 mb-2">
            {{ title }}
          </h2>
          <p class="text-xl text-gray-600">{{ subtitle }}</p>

          <!-- Score -->
          <div class="mt-4 flex items-center justify-center md:justify-start gap-2">
            <span class="text-2xl font-bold text-yellow-500">{{ correctCount }}</span>
            <span class="text-gray-400">/</span>
            <span class="text-2xl font-bold text-gray-400">{{ totalCount }}</span>
            <span class="text-3xl ml-2">
              {{ correctCount === totalCount ? '🌟' : correctCount >= totalCount / 2 ? '⭐' : '💪' }}
            </span>
          </div>
        </div>
      </div>

      <!-- Words Review Section -->
      <div class="mb-8">
        <h3 class="text-xl font-bold text-gray-700 mb-4 text-center">Words You Learned:</h3>
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <div
            v-for="word in words"
            :key="word.id"
            class="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-4 flex flex-col items-center gap-2 border-2 border-indigo-100 hover:border-indigo-300 transition-all hover:scale-105"
          >
            <!-- Image -->
            <img
              :src="word.image"
              :alt="word.name"
              class="w-16 h-16 object-contain"
            />
            <!-- Word -->
            <span class="font-bold text-gray-700 uppercase">{{ word.name }}</span>
            <!-- Audio Button -->
            <button
              @click="playAudio(word.audio)"
              class="flex items-center gap-1 px-3 py-1.5 bg-indigo-500 hover:bg-indigo-600 text-white rounded-full text-sm font-semibold transition-all hover:scale-110 active:scale-95"
            >
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z"/>
              </svg>
              Listen
            </button>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex flex-col sm:flex-row justify-center gap-4">
        <button
          @click="$emit('tryAgain')"
          class="px-8 py-4 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-full font-bold text-lg transition-all hover:scale-105"
        >
          Try Again
        </button>
        <button
          @click="$emit('nextLevel')"
          class="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-full font-bold text-lg shadow-lg hover:shadow-xl transition-all hover:scale-105"
        >
          Next Level →
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Word {
  id: number
  name: string
  image: string
  audio: string
}

interface Props {
  characterImage: string
  characterName: string
  title?: string
  subtitle?: string
  correctCount: number
  totalCount: number
  words: Word[]
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Great Job!',
  subtitle: "You've completed the level!"
})

defineEmits<{
  tryAgain: []
  nextLevel: []
}>()

const currentAudio = ref<HTMLAudioElement | null>(null)

const playAudio = (audioPath: string) => {
  // Stop any currently playing audio
  if (currentAudio.value) {
    currentAudio.value.pause()
    currentAudio.value.currentTime = 0
  }

  // Play new audio
  currentAudio.value = new Audio(audioPath)
  currentAudio.value.play().catch(err => {
    console.log('Audio play failed:', err)
  })
}

// Cleanup on unmount
onUnmounted(() => {
  if (currentAudio.value) {
    currentAudio.value.pause()
  }
})
</script>

<style scoped>
@keyframes bounce-slow {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.animate-bounce-slow {
  animation: bounce-slow 2s ease-in-out infinite;
}
</style>
