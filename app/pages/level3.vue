<template>
  <div
    class="min-h-screen relative bg-cover bg-center bg-no-repeat"
    style="background-image: url('/images/bg/bg-in.png')"
  >
    <!-- Dark Overlay 50% -->
    <div class="absolute inset-0 bg-black/50"></div>

    <!-- Content -->
    <div class="relative z-10 min-h-screen p-4 md:p-8">
    <div class="max-w-6xl mx-auto">
      <header
        class="relative overflow-hidden rounded-3xl bg-white/20 backdrop-blur-xl border border-white/30 shadow-xl p-6 mb-6 flex flex-col md:flex-row items-center justify-between gap-6"
      >
        <div class="relative z-10">
          <h1
            class="text-3xl md:text-5xl font-black text-white drop-shadow-lg mb-2"
          >
            Level 3
          </h1>
          <p class="text-lg text-white/90 font-medium tracking-wide drop-shadow">
            Pack the Winter Bag!
          </p>
        </div>

        <div
          class="relative z-10 w-32 md:w-40 transform hover:scale-110 transition-transform duration-300"
        >
          <Character
            name="Lola Bunny"
            image="/images/characters/Lola_Bunny.png"
            message="Drag winter items!"
            animate
          />
        </div>

        <!-- Decorative snowflakes -->
        <div class="absolute top-2 right-10 text-4xl opacity-50 animate-pulse">❄️</div>
        <div class="absolute bottom-2 left-10 text-3xl opacity-40 animate-pulse delay-300">❄️</div>
      </header>

      <main
        class="bg-white/20 backdrop-blur-md rounded-3xl border border-white/30 shadow-xl p-4 md:p-8"
      >
        <BagGame />
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
          to="/level4"
          class="group inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 text-white font-semibold"
        >
          Next Level
          <span class="ml-2 group-hover:translate-x-1 transition-transform">→</span>
        </NuxtLink>
      </div>
    </div>
    </div>
  </div>
</template>
