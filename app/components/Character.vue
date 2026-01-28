<template>
  <div
    v-motion
    :initial="{ opacity: 0, scale: 0.8, y: 50 }"
    :enter="{
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { duration: 600, type: 'spring' },
    }"
    class="relative"
  >
    <div class="relative inline-block">
      <!-- Character Image -->
      <img
        :src="image"
        :alt="name"
        class="w-full h-auto max-w-xs md:max-w-md lg:max-w-lg object-contain drop-shadow-2xl"
        :class="{ 'animate-bounce': isAnimating }"
      />

      <!-- Speech Bubble -->
      <div
        v-if="message"
        v-motion
        :initial="{ opacity: 0, scale: 0.5, x: 20 }"
        :enter="{ opacity: 1, scale: 1, x: 0, transition: { duration: 300 } }"
        class="absolute top-1/2 right-full transform -translate-y-1/2 mr-3 z-20 w-max max-w-[150px] md:max-w-xs"
      >
        <div
          class="relative bg-white/90 backdrop-blur-sm rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] p-3 md:p-5 border border-white/50 ring-4 ring-indigo-50"
        >
          <p
            class="text-sm md:text-lg font-bold text-indigo-900 text-center leading-snug"
          >
            {{ message }}
          </p>
          <!-- Speech bubble tail (pointing right) -->
          <div
            class="absolute top-1/2 right-0 transform translate-x-full -translate-y-1/2 drop-shadow-sm"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              class="text-white/90 transform rotate-[-90deg]"
            >
              <path d="M12 24L0 0H24L12 24Z" fill="currentColor" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

interface Props {
  name: string;
  image: string;
  message?: string;
  animate?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  message: "",
  animate: false,
});

const isAnimating = ref(props.animate);

const bounce = () => {
  isAnimating.value = true;
  setTimeout(() => {
    isAnimating.value = false;
  }, 1000);
};

defineExpose({
  bounce,
});
</script>

<style scoped>
@keyframes bounce {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-20px);
  }
}

.animate-bounce {
  animation: bounce 1s ease-in-out;
}
</style>
