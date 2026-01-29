<template>
  <div
    class="min-h-screen relative bg-cover bg-center bg-no-repeat"
    style="background-image: url('/images/level6/bg6.jpg')"
  >
    <!-- Dark Overlay -->
    <div class="absolute inset-0 bg-black/40"></div>

    <!-- Content -->
    <div class="relative z-10 min-h-screen p-4 md:p-8">
      <div class="max-w-6xl mx-auto scale-[0.8] origin-top">
        <header
          class="relative overflow-hidden rounded-3xl bg-white/20 backdrop-blur-xl border border-white/30 shadow-xl p-6 mb-6 flex flex-col md:flex-row items-center justify-between gap-6"
        >
          <div class="relative z-10">
            <h1
              class="text-3xl md:text-5xl font-black text-white drop-shadow-lg mb-2"
            >
              Level 6
            </h1>
            <p class="text-lg text-white/90 font-medium tracking-wide drop-shadow">
              Decorate the Tree!
            </p>
          </div>

          <div
            v-if="showCharacter"
            class="relative z-10 w-32 md:w-40 transform transition-all duration-500"
            :class="showCharacter ? 'opacity-100 scale-100' : 'opacity-0 scale-50'"
          >
            <Character
              name="Grinch"
              image="/images/characters/grinch.png"
              :message="characterMessage"
              animate
            />
          </div>

          <!-- Decorative snowflakes -->
          <div class="absolute top-2 right-10 text-4xl opacity-50 animate-pulse">🎄</div>
          <div class="absolute bottom-2 left-10 text-3xl opacity-40 animate-pulse delay-300">🎁</div>
        </header>

        <main
          v-if="showTree"
          class="bg-white/20 backdrop-blur-md rounded-3xl border border-white/30 shadow-xl p-4 md:p-8 transition-all duration-500"
          :class="showTree ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'"
        >
          <TreeGame />
        </main>

        <!-- Navigation Buttons -->
        <div class="flex justify-between items-center mt-8">
          <NuxtLink
            to="/"
            class="group inline-flex items-center px-6 py-3 bg-white/80 backdrop-blur-md rounded-full shadow-sm hover:shadow-md transition-all duration-300 border border-white/50 text-gray-600 font-semibold hover:bg-white"
          >
            <span class="mr-2 group-hover:-translate-x-1 transition-transform">←</span>
            Menu
          </NuxtLink>
          <NuxtLink
            to="/"
            class="group inline-flex items-center px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 text-white font-semibold"
          >
            Finish
            <span class="ml-2 group-hover:translate-x-1 transition-transform">🎉</span>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const showCharacter = ref(false)
const showTree = ref(false)
const characterMessage = ref('')

onMounted(() => {
  // Show character after 1 second
  setTimeout(() => {
    showCharacter.value = true
    characterMessage.value = 'Help me put the presents back!'
  }, 1000)

  // Show tree after 2 seconds (1 sec after character)
  setTimeout(() => {
    showTree.value = true
  }, 2000)
})
</script>
