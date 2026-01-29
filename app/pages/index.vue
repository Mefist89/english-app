<template>
  <div class="min-h-screen relative bg-cover bg-center bg-no-repeat" style="background-image: url('/images/bg/bg.png')">
    <!-- Dark Overlay 30% -->
    <div class="absolute inset-0 bg-black/40"></div>

    <!-- Content -->
    <div class="relative z-10 min-h-screen flex flex-col items-center justify-center p-4 md:p-8">
    <!-- Welcome Section -->
    <div class="flex flex-col md:flex-row items-center justify-center gap-8 mb-12">
      <!-- Bugs Bunny Character -->
      <div class="w-48 md:w-64">
        <BugsBunny />
      </div>

      <!-- Welcome Text with Typewriter Effect -->
      <div class="bg-gradient-to-br from-blue-500 to-blue-700 rounded-3xl p-6 md:p-8 shadow-2xl border-4 border-white/30 backdrop-blur-sm">
        <h1 class="text-3xl md:text-5xl font-bold text-white drop-shadow-lg mb-4 min-h-[1.2em]">
          {{ displayedLine1 }}<span v-if="currentLine === 1" class="animate-blink">|</span>
        </h1>
        <p class="text-lg md:text-xl text-yellow-300 drop-shadow-md mb-2 min-h-[1.2em]">
          {{ displayedLine2 }}<span v-if="currentLine === 2" class="animate-blink">|</span>
        </p>
        <p class="text-base md:text-lg text-white/90 drop-shadow-md min-h-[1.2em]">
          {{ displayedLine3 }}<span v-if="currentLine === 3" class="animate-blink">|</span>
        </p>
      </div>
    </div>

    <!-- Start Button -->
    <div
      v-motion
      :initial="{ opacity: 0, scale: 0.8 }"
      :enter="{ opacity: 1, scale: 1, transition: { duration: 400, delay: 300 } }"
      class="mb-12"
    >
      <NuxtLink
        to="/level1"
        class="bg-gradient-to-r from-sky-400 to-blue-500 hover:from-sky-500 hover:to-blue-600 text-white font-bold text-2xl py-4 px-12 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110 border-2 border-white/30"
      >
        Let's Start!
      </NuxtLink>
    </div>

    <!-- Level Cards -->
    <div
      v-motion
      :initial="{ opacity: 0, y: 50 }"
      :enter="{ opacity: 1, y: 0, transition: { duration: 500, delay: 500 } }"
      class="grid grid-cols-3 gap-4 md:gap-6 max-w-3xl mx-auto"
    >
      <NuxtLink
        to="/level1"
        class="card hover:scale-105 cursor-pointer text-center"
      >
        <div class="text-4xl mb-2">1️⃣</div>
        <h2 class="text-lg md:text-xl font-bold text-blue-600">Level 1</h2>
        <p class="text-sm text-gray-500 mt-1">Match words</p>
      </NuxtLink>

      <NuxtLink
        to="/level2"
        class="card hover:scale-105 cursor-pointer text-center"
      >
        <div class="text-4xl mb-2">2️⃣</div>
        <h2 class="text-lg md:text-xl font-bold text-teal-600">Level 2</h2>
        <p class="text-sm text-gray-500 mt-1">Listen & choose</p>
      </NuxtLink>

      <NuxtLink
        to="/level3"
        class="card hover:scale-105 cursor-pointer text-center"
      >
        <div class="text-4xl mb-2">3️⃣</div>
        <h2 class="text-lg md:text-xl font-bold text-purple-600">Level 3</h2>
        <p class="text-sm text-gray-500 mt-1">Pack winter bag</p>
      </NuxtLink>

      <NuxtLink
        to="/level4"
        class="card hover:scale-105 cursor-pointer text-center"
      >
        <div class="text-4xl mb-2">4️⃣</div>
        <h2 class="text-lg md:text-xl font-bold text-pink-600">Level 4</h2>
        <p class="text-sm text-gray-500 mt-1">Guess shadow</p>
      </NuxtLink>

      <NuxtLink
        to="/level5"
        class="card hover:scale-105 cursor-pointer text-center"
      >
        <div class="text-4xl mb-2">5️⃣</div>
        <h2 class="text-lg md:text-xl font-bold text-orange-600">Level 5</h2>
        <p class="text-sm text-gray-500 mt-1">Dress up</p>
      </NuxtLink>

      <NuxtLink
        to="/level6"
        class="card hover:scale-105 cursor-pointer text-center"
      >
        <div class="text-4xl mb-2">6️⃣</div>
        <h2 class="text-lg md:text-xl font-bold text-green-600">Level 6</h2>
        <p class="text-sm text-gray-500 mt-1">Decorate tree</p>
      </NuxtLink>
    </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false
})

// Typewriter effect
const line1 = 'Hello, Friend!'
const line2 = 'Welcome to our English class!'
const line3 = 'My name is Bugs Bunny. What is your name?'

const displayedLine1 = ref('')
const displayedLine2 = ref('')
const displayedLine3 = ref('')
const currentLine = ref(1)

const typeSpeed = 80 // ms per character

const typeText = (text: string, displayRef: Ref<string>, lineNum: number) => {
  return new Promise<void>((resolve) => {
    let i = 0
    currentLine.value = lineNum
    const interval = setInterval(() => {
      if (i < text.length) {
        displayRef.value += text[i]
        i++
      } else {
        clearInterval(interval)
        resolve()
      }
    }, typeSpeed)
  })
}

onMounted(async () => {
  await new Promise(r => setTimeout(r, 500)) // Initial delay
  await typeText(line1, displayedLine1, 1)
  await new Promise(r => setTimeout(r, 300)) // Pause between lines
  await typeText(line2, displayedLine2, 2)
  await new Promise(r => setTimeout(r, 300))
  await typeText(line3, displayedLine3, 3)
  await new Promise(r => setTimeout(r, 500))
  currentLine.value = 0 // Hide cursor after typing complete
})
</script>

<style scoped>
@keyframes blink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
}

.animate-blink {
  animation: blink 0.8s infinite;
}
</style>
