<template>
  <div class="min-h-screen relative bg-cover bg-center bg-no-repeat overflow-hidden" style="background-image: url('/images/bg/bg.png')">
    <!-- Falling Snow -->
    <div class="absolute inset-0 pointer-events-none z-20">
      <img
        v-for="flake in snowflakes"
        :key="flake.id"
        :src="flake.image"
        :style="flake.style"
        class="absolute snowflake"
        alt=""
      />
    </div>

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
      <Transition name="box">
        <div
          v-if="showBox"
          class="relative bg-gradient-to-br from-sky-400 to-blue-600 rounded-3xl p-8 md:p-10 shadow-2xl border-4 border-white/40 backdrop-blur-sm w-[420px] md:w-[500px] min-h-[200px]"
        >
          <!-- Audio Button -->
          <button
            @click="playAudio"
            class="absolute -right-4 -top-4 w-14 h-14 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform duration-300 border-3 border-white/50"
            :class="{ 'animate-pulse': isPlaying }"
          >
            <svg v-if="!isPlaying" xmlns="http://www.w3.org/2000/svg" class="w-7 h-7 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z"/>
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" class="w-7 h-7 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
            </svg>
          </button>

          <h1 class="text-3xl md:text-4xl font-bold text-white drop-shadow-lg mb-4 min-h-[1.4em] leading-relaxed">
            {{ displayedLine1 }}<span v-if="currentLine === 1" class="animate-blink">|</span>
          </h1>
          <p class="text-lg md:text-xl text-amber-200 drop-shadow-md mb-3 min-h-[1.4em] leading-relaxed">
            {{ displayedLine2 }}<span v-if="currentLine === 2" class="animate-blink">|</span>
          </p>
          <p class="text-base md:text-lg text-sky-100 drop-shadow-md min-h-[1.4em] leading-relaxed">
            {{ displayedLine3 }}<span v-if="currentLine === 3" class="animate-blink">|</span>
          </p>
        </div>
      </Transition>
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

      <!-- Secret Level - Only visible after completing level 6 -->
      <Transition name="secret">
        <NuxtLink
          v-if="isSecretLevelUnlocked"
          to="/secret"
          class="card hover:scale-105 cursor-pointer text-center col-span-3 bg-gradient-to-r from-red-100 via-yellow-100 to-green-100 border-2 border-red-300 relative overflow-hidden"
        >
          <div class="absolute inset-0 bg-gradient-to-r from-red-500/10 via-yellow-500/10 to-green-500/10 animate-pulse"></div>
          <div class="relative z-10">
            <div class="text-4xl mb-2">🎅 vs 💚</div>
            <h2 class="text-lg md:text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-yellow-600 to-green-600">Boss Battle</h2>
            <p class="text-sm text-gray-600 mt-1">Santa Claus vs Grinch</p>
          </div>
        </NuxtLink>
      </Transition>
    </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false
})

// Game Progress - check if secret level is unlocked
const { isSecretLevelUnlocked, loadProgress } = useGameProgress()

// Snowflakes
interface Snowflake {
  id: number
  image: string
  style: Record<string, string>
}

const snowflakeImages = [
  '/images/ui/snowflake-1.png',
  '/images/ui/snowflake-2.png',
  '/images/ui/snowflake-3.png',
  '/images/ui/snowflake-4.png',
  '/images/ui/snowflake-5.png',
  '/images/ui/snowflake-6.png',
]

const snowflakes = ref<Snowflake[]>([])

const createSnowflakes = () => {
  const flakes: Snowflake[] = []
  const count = 30 // Number of snowflakes

  for (let i = 0; i < count; i++) {
    const size = Math.random() * 30 + 20 // 20-50px
    const left = Math.random() * 100 // 0-100%
    const delay = Math.random() * 15 // 0-15s delay
    const duration = Math.random() * 10 + 15 // 15-25s fall duration
    const drift = Math.random() * 40 - 20 // -20 to 20px horizontal drift

    flakes.push({
      id: i,
      image: snowflakeImages[Math.floor(Math.random() * snowflakeImages.length)]!,
      style: {
        left: `${left}%`,
        width: `${size}px`,
        height: `${size}px`,
        animationDuration: `${duration}s`,
        animationDelay: `${delay}s`,
        '--drift': `${drift}px`,
        opacity: `${Math.random() * 0.5 + 0.3}`, // 0.3-0.8 opacity
      }
    })
  }

  snowflakes.value = flakes
}

onMounted(() => {
  createSnowflakes()
  loadProgress()
})

// Typewriter effect
const line1 = 'Hello, Friend!'
const line2 = 'Welcome to our English class!'
const line3 = 'My name is Bugs Bunny. What is your name?'

const showBox = ref(false)
const displayedLine1 = ref('')
const displayedLine2 = ref('')
const displayedLine3 = ref('')
const currentLine = ref(0)

// Audio
const isPlaying = ref(false)
const audio = ref<HTMLAudioElement | null>(null)

const playAudio = () => {
  if (!audio.value) {
    audio.value = new Audio('/audio/bugs-bunny-welcome.mp3')
    audio.value.onended = () => {
      isPlaying.value = false
    }
  }

  if (isPlaying.value) {
    audio.value.pause()
    audio.value.currentTime = 0
    isPlaying.value = false
  } else {
    audio.value.play()
    isPlaying.value = true
  }
}

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
  // Show box after 1 second
  await new Promise(r => setTimeout(r, 1000))
  showBox.value = true

  // Wait for box animation to complete
  await new Promise(r => setTimeout(r, 600))

  // Start typing
  await typeText(line1, displayedLine1, 1)
  await new Promise(r => setTimeout(r, 300))
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

.box-enter-active {
  transition: all 0.5s ease-out;
}

.box-enter-from {
  opacity: 0;
  transform: scale(0.8) translateY(20px);
}

.box-enter-to {
  opacity: 1;
  transform: scale(1) translateY(0);
}

/* Snowfall animation */
@keyframes snowfall {
  0% {
    transform: translateY(-100px) translateX(0) rotate(0deg);
  }
  50% {
    transform: translateY(50vh) translateX(var(--drift, 0px)) rotate(180deg);
  }
  100% {
    transform: translateY(100vh) translateX(calc(var(--drift, 0px) * -1)) rotate(360deg);
  }
}

.snowflake {
  animation: snowfall linear infinite;
  will-change: transform;
  filter: brightness(0) invert(1);
}

/* Secret level transition */
.secret-enter-active {
  transition: all 0.6s ease-out;
}

.secret-leave-active {
  transition: all 0.3s ease-in;
}

.secret-enter-from {
  opacity: 0;
  transform: scale(0.5) translateY(20px);
}

.secret-leave-to {
  opacity: 0;
  transform: scale(0.8);
}
</style>
