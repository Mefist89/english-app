<template>
  <div class="min-h-screen p-8">
    <div class="max-w-6xl mx-auto">
      <NuxtLink to="/" class="btn-primary mb-8 inline-block">
        ← Back to Home
      </NuxtLink>

      <div class="flex flex-col md:flex-row items-center justify-between mb-8 gap-8">
        <h1 class="text-4xl md:text-5xl font-bold text-purple-600">Lessons</h1>
        <div class="w-32 md:w-40">
          <BugsBunny message="Pick a lesson!" />
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="card">
          <div class="text-4xl mb-4">🔤</div>
          <h2 class="text-2xl font-bold mb-2">Alphabet</h2>
          <p class="text-gray-600 mb-4">Learn ABC</p>
          <button class="btn-primary w-full">Start</button>
        </div>

        <div class="card">
          <div class="text-4xl mb-4">📝</div>
          <h2 class="text-2xl font-bold mb-2">Words</h2>
          <p class="text-gray-600 mb-4">Learn new words</p>
          <button class="btn-primary w-full">Start</button>
        </div>

        <div class="card">
          <div class="text-4xl mb-4">🎨</div>
          <h2 class="text-2xl font-bold mb-2">Colors</h2>
          <p class="text-gray-600 mb-4">Learn colors</p>
          <button class="btn-primary w-full">Start</button>
        </div>
      </div>
    </div>
  </div>
</template>
