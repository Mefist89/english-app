<template>
  <div
    class="min-h-screen relative bg-cover bg-center bg-no-repeat"
    style="background-image: url('/images/bg/bg-in.png')"
  >
    <!-- Dark Overlay -->
    <div class="absolute inset-0 bg-black/50"></div>

    <!-- Content -->
    <div class="relative z-10 min-h-screen p-4 md:p-8 flex items-center justify-center">
      <div class="max-w-4xl w-full">
        <!-- Main Card -->
        <div class="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 md:p-12">
          <!-- Header with Character -->
          <div class="flex flex-col md:flex-row items-center gap-8 mb-10">
            <!-- Character -->
            <div class="w-40 md:w-52 shrink-0">
              <img
                src="/images/characters/slyvester-winter.png"
                alt="Sylvester"
                class="w-full h-auto drop-shadow-xl animate-bounce-slow"
              />
            </div>

            <!-- Message -->
            <div class="text-center md:text-left">
              <h1 class="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500 mb-3">
                Amazing!
              </h1>
              <p class="text-xl md:text-2xl text-gray-600 mb-4">
                You have great listening ears!
              </p>

              <!-- Score Stars -->
              <div class="flex items-center justify-center md:justify-start gap-1">
                <span v-for="i in 6" :key="i" class="text-4xl">
                  {{ i <= 6 ? '⭐' : '☆' }}
                </span>
              </div>
            </div>
          </div>

          <!-- Words Review Section -->
          <div class="mb-10">
            <h2 class="text-2xl font-bold text-gray-700 mb-6 text-center">
              Words You Learned:
            </h2>
            <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div
                v-for="word in words"
                :key="word.id"
                class="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-4 flex flex-col items-center gap-3 border-2 border-orange-100 hover:border-orange-300 transition-all hover:scale-105 cursor-pointer"
                @click="playAudio(word.audio)"
              >
                <!-- Image -->
                <img
                  :src="word.image"
                  :alt="word.name"
                  class="w-20 h-20 object-contain"
                />
                <!-- Word -->
                <span class="font-bold text-gray-700 uppercase text-lg">{{ word.name }}</span>
                <!-- Audio Button -->
                <button
                  class="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-full text-sm font-semibold transition-all hover:scale-110 active:scale-95"
                >
                  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z"/>
                  </svg>
                  Listen
                </button>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex flex-col sm:flex-row justify-center gap-4">
            <NuxtLink
              to="/level2"
              class="px-8 py-4 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-full font-bold text-lg transition-all hover:scale-105 text-center"
            >
              Play Again
            </NuxtLink>
            <NuxtLink
              to="/level3"
              class="px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-full font-bold text-lg shadow-lg hover:shadow-xl transition-all hover:scale-105 text-center"
            >
              Next Level →
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const words = [
  { id: 1, name: 'Scarf', image: '/images/level1/scarf.png', audio: '/audio/level2/scarf.mp3' },
  { id: 2, name: 'Boots', image: '/images/level1/boots.png', audio: '/audio/level2/boots.mp3' },
  { id: 3, name: 'Gloves', image: '/images/level1/gloves.png', audio: '/audio/level2/gloves.mp3' },
  { id: 4, name: 'Parka', image: '/images/level1/parka.png', audio: '/audio/level2/parka.mp3' },
  { id: 5, name: 'Cap', image: '/images/level1/cap.png', audio: '/audio/level2/cap.mp3' },
  { id: 6, name: 'Mittens', image: '/images/level1/mittens.png', audio: '/audio/level2/mittens.mp3' },
]

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
    transform: translateY(-15px);
  }
}

.animate-bounce-slow {
  animation: bounce-slow 2s ease-in-out infinite;
}
</style>
