<template>
  <div>
    <NuxtRouteAnnouncer />
    <NuxtPage />
  </div>
</template>

<script setup lang="ts">
useHead({
  title: 'English Learning App',
  meta: [
    { name: 'description', content: 'Interactive English learning app for first graders' }
  ]
})
</script>
