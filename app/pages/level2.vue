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
      <NuxtLink 
        to="/" 
        class="group inline-flex items-center px-6 py-3 bg-white/80 backdrop-blur-md rounded-full shadow-sm hover:shadow-md transition-all duration-300 mb-8 border border-white/50 text-orange-600 font-semibold"
      >
        <span class="mr-2 group-hover:-translate-x-1 transition-transform">←</span> Back to Home
      </NuxtLink>

      <header class="relative overflow-hidden rounded-3xl bg-white/40 backdrop-blur-xl border border-white/50 shadow-xl p-8 mb-8 flex flex-col md:flex-row items-center justify-between gap-8">
        <div class="relative z-10 text-center md:text-left">
          <h1 class="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500 mb-2 drop-shadow-sm">
            Level 2
          </h1>
          <p class="text-xl text-orange-900/70 font-medium tracking-wide">
            Listening Challenge 👂
          </p>
        </div>
        
        <div class="relative z-10 w-32 md:w-40 transform hover:scale-110 transition-transform duration-300">
          <BugsBunny message="Listen carefully!" animate />
        </div>
        
        <!-- Decorative Background Elements -->
        <div class="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-yellow-300/30 rounded-full blur-3xl"></div>
        <div class="absolute bottom-0 left-0 -mb-10 -ml-10 w-64 h-64 bg-orange-300/30 rounded-full blur-3xl"></div>
      </header>

      <main class="bg-white/30 backdrop-blur-md rounded-3xl border border-white/50 shadow-xl p-6 md:p-10 min-h-[600px]">
        <AudioGame />
      </main>
    </div>
    </div>
  </div>
</template>
