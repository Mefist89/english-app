<template>
  <div class="min-h-screen flex flex-col items-center justify-center p-4 md:p-8">
    <!-- Welcome Section -->
    <div class="flex flex-col md:flex-row items-center justify-center gap-8 mb-12">
      <!-- Bugs Bunny Character -->
      <div class="w-48 md:w-64">
        <BugsBunny />
      </div>

      <!-- Welcome Text -->
      <div
        v-motion
        :initial="{ opacity: 0, x: 50 }"
        :enter="{ opacity: 1, x: 0, transition: { duration: 600 } }"
        class="text-center md:text-left"
      >
        <h1 class="text-4xl md:text-6xl font-bold text-purple-600 mb-4">
          Hello, Friend!
        </h1>
        <p class="text-xl md:text-2xl text-gray-700 mb-2">
          Welcome to our English class!
        </p>
        <p class="text-lg md:text-xl text-gray-600">
          My name is Bugs Bunny. What is your name?
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
        class="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold text-2xl py-4 px-12 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110"
      >
        Let's Start!
      </NuxtLink>
    </div>

    <!-- Menu Cards -->
    <div
      v-motion
      :initial="{ opacity: 0, y: 50 }"
      :enter="{ opacity: 1, y: 0, transition: { duration: 500, delay: 500 } }"
      class="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-4xl mx-auto"
    >
      <NuxtLink
        to="/level1"
        class="card hover:scale-105 cursor-pointer text-center"
      >
        <div class="text-4xl mb-2">1️⃣</div>
        <h2 class="text-lg md:text-xl font-bold text-blue-600">Level 1</h2>
      </NuxtLink>

      <NuxtLink
        to="/games"
        class="card hover:scale-105 cursor-pointer text-center"
      >
        <div class="text-4xl mb-2">🎮</div>
        <h2 class="text-lg md:text-xl font-bold text-green-600">Games</h2>
      </NuxtLink>

      <NuxtLink
        to="/dress-up"
        class="card hover:scale-105 cursor-pointer text-center"
      >
        <div class="text-4xl mb-2">👕</div>
        <h2 class="text-lg md:text-xl font-bold text-pink-600">Dress Up</h2>
      </NuxtLink>

      <NuxtLink
        to="/bingo"
        class="card hover:scale-105 cursor-pointer text-center"
      >
        <div class="text-4xl mb-2">🎯</div>
        <h2 class="text-lg md:text-xl font-bold text-orange-600">Bingo</h2>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false
})
</script>
