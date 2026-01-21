<template>
  <div class="min-h-screen p-8">
    <div class="max-w-6xl mx-auto">
      <NuxtLink to="/" class="btn-primary mb-8 inline-block">
        ← Back to Home
      </NuxtLink>

      <div class="flex flex-col md:flex-row items-center justify-between mb-8 gap-8">
        <h1 class="text-4xl md:text-5xl font-bold text-purple-600">Games</h1>
        <div class="w-32 md:w-40">
          <BugsBunny message="Let's play!" />
        </div>
      </div>

      <div class="space-y-8">
        <DragDropExample />
      </div>
    </div>
  </div>
</template>
