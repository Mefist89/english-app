<template>
  <div
    class="min-h-screen relative bg-cover bg-center bg-no-repeat"
    style="background-image: url('/images/bg/bg-in.png')"
  >
    <!-- Dark Overlay 50% -->
    <div class="absolute inset-0 bg-black/50"></div>

    <!-- Content -->
    <div class="relative z-10 min-h-screen p-4 md:p-8">
    <div class="max-w-6xl mx-auto scale-[0.8] origin-top">
      <header
        class="relative overflow-hidden rounded-3xl bg-white/40 backdrop-blur-xl border border-white/50 shadow-xl p-8 mb-8 flex flex-col md:flex-row items-center justify-between gap-8"
      >
        <div class="relative z-10">
          <h1
            class="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mb-2 drop-shadow-sm"
          >
            Level 1
          </h1>
          <p class="text-xl text-indigo-900/70 font-medium tracking-wide">
            Winter Clothes Adventure ❄️
          </p>
        </div>

        <div
          class="relative z-10 w-32 md:w-40 transform hover:scale-110 transition-transform duration-300"
        >
          <Character
            name="Daffy Duck"
            image="/images/characters/daffy-duck-winter.png"
            message="Let's find pairs!"
            animate
          />
        </div>

        <!-- Decorative Background Elements -->
        <div
          class="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-purple-300/30 rounded-full blur-3xl"
        ></div>
        <div
          class="absolute bottom-0 left-0 -mb-10 -ml-10 w-64 h-64 bg-indigo-300/30 rounded-full blur-3xl"
        ></div>
      </header>

      <main
        class="bg-white/30 backdrop-blur-md rounded-3xl border border-white/50 shadow-xl p-6 md:p-10"
      >
        <MatchingGame />
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
          to="/level2"
          class="group inline-flex items-center px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 text-white font-semibold"
        >
          Next Level
          <span class="ml-2 group-hover:translate-x-1 transition-transform">→</span>
        </NuxtLink>
      </div>
    </div>
    </div>
  </div>
</template>
