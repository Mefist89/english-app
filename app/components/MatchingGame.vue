<template>
  <div class="matching-game relative min-h-[600px] flex flex-col justify-between pb-52">
    <!-- Confetti Canvas -->
    <canvas id="confetti-canvas" class="fixed inset-0 pointer-events-none z-50"></canvas>

    <!-- Game board -->
    <div class="flex-grow relative z-10 p-4 min-h-[400px]">
      
      <!-- Pictures Scatter Area -->
      <div class="flex flex-wrap justify-center items-center gap-8 md:gap-14 py-10">
        <div
          v-for="(item, index) in shuffledPictures"
          :key="'pic-' + item.id"
          @click="selectPicture(item)"
          :class="getPictureClass(item)"
          class="picture-item group relative transition-all duration-300"
          :style="{ transform: `rotate(${((index % 5) - 2) * 3}deg)` }"
        >
          <div class="bg-white p-4 rounded-xl shadow-lg border-4 border-white transform transition-transform group-hover:scale-110 group-hover:rotate-0">
             <img
              :src="'/images/level1/' + item.image"
              :alt="item.word"
              class="w-28 h-28 md:w-36 md:h-36 object-contain drop-shadow-md"
            />
          </div>
          
          <!-- Selection Indicator -->
          <div v-if="selectedPicture?.id === item.id" class="absolute -inset-6 border-4 border-dashed border-yellow-400 rounded-full animate-spin-slow opacity-80 pointer-events-none"></div>
        </div>
      </div>
    </div>

    <!-- Message Overlay (Centered) -->
    <div v-if="message" class="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none">
      <div class="bg-white/95 backdrop-blur-xl px-10 py-6 rounded-[3rem] shadow-[0_20px_60px_rgba(0,0,0,0.15)] border-4 border-yellow-200 text-center animate-in zoom-in fade-in duration-300">
        <p :class="messageClass" class="text-3xl md:text-5xl font-black tracking-wide font-round mb-2">{{ message }}</p>
        <span v-if="message.includes('Great')" class="text-6xl animate-bounce inline-block">⭐</span>
      </div>
    </div>

    <!-- Words Row (Bottom) -->
    <div class="fixed bottom-0 left-0 w-full z-50 bg-white/90 backdrop-blur-xl border-t-8 border-yellow-300 p-6 pb-8 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] rounded-t-[3rem]">
      <div class="max-w-6xl mx-auto flex flex-wrap justify-center gap-4 md:gap-6">
        <div
          v-for="(item, idx) in shuffledWords"
          :key="'word-' + item.id"
          @click="selectWord(item)"
          :class="[getWordClass(item), `bg-${['orange','blue','green','pink','purple'][idx % 5]}-100`]"
          class="word-card group"
        >
          <span class="text-lg md:text-2xl font-black uppercase tracking-wider font-round text-gray-700 group-hover:text-white transition-colors">{{ item.word }}</span>
        </div>
      </div>

       <!-- Reset button -->
      <div v-if="isGameComplete" class="text-center mt-8">
        <button @click="resetGame" class="animate-bounce inline-flex items-center px-10 py-5 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-2xl font-black rounded-full shadow-xl hover:shadow-2xl hover:scale-105 transition-all transform hover:-rotate-2 border-4 border-white font-round">
          Play Again! 🚀
        </button>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import confetti from 'canvas-confetti';

interface Item {
  id: number;
  word: string;
  image: string;
}

const items: Item[] = [
  { id: 1, word: "BOOTS", image: "boots.png" },
  { id: 2, word: "CAP", image: "cap.png" },
  { id: 3, word: "GLOVES", image: "gloves.png" },
  { id: 4, word: "MITTENS", image: "mittens.png" },
  { id: 5, word: "PARKA", image: "parka.png" },
  { id: 6, word: "PULLOVER", image: "pullover.png" },
  { id: 7, word: "SCARF", image: "scarf.png" },
];

const selectedPicture = ref<Item | null>(null);
const selectedWord = ref<Item | null>(null);
const matchedIds = ref<number[]>([]);
const wrongPair = ref<{ pictureId: number; wordId: number } | null>(null);
const message = ref("");
const correctMatches = computed(() => matchedIds.value.length);
const isGameComplete = computed(() => matchedIds.value.length === items.length);

// Shuffle arrays for randomization
const shuffle = <T,>(array: T[]): T[] => {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

const shuffledPictures = ref(shuffle(items));
const shuffledWords = ref(shuffle(items));

const selectPicture = (item: Item) => {
  if (matchedIds.value.includes(item.id)) return;

  wrongPair.value = null;
  selectedPicture.value = item;
  message.value = "";

  if (selectedWord.value) {
    checkMatch();
  }
};

const selectWord = (item: Item) => {
  if (matchedIds.value.includes(item.id)) return;

  wrongPair.value = null;
  selectedWord.value = item;
  message.value = "";

  if (selectedPicture.value) {
    checkMatch();
  }
};

const checkMatch = () => {
  if (!selectedPicture.value || !selectedWord.value) return;

  if (selectedPicture.value.id === selectedWord.value.id) {
    // Correct match
    matchedIds.value.push(selectedPicture.value.id);
    message.value = "Great! ⭐";
    triggerConfetti();

    if (isGameComplete.value) {
      message.value = "YOU WON! 🎉";
      triggerMassiveConfetti();
      // Navigate to complete page after a short delay
      setTimeout(() => {
        navigateTo('/level1/complete');
      }, 2000);
    }
  } else {
    // Wrong match
    wrongPair.value = {
      pictureId: selectedPicture.value.id,
      wordId: selectedWord.value.id,
    };
    message.value = "Oops! 🙈";

    setTimeout(() => {
      wrongPair.value = null;
    }, 800);
  }

  selectedPicture.value = null;
  selectedWord.value = null;
};

const triggerConfetti = () => {
  confetti({
    particleCount: 30,
    spread: 50,
    origin: { y: 0.7 },
    colors: ['#FCD34D', '#F87171', '#60A5FA', '#34D399']
  });
};

const triggerMassiveConfetti = () => {
  const duration = 3000;
  const end = Date.now() + duration;

  (function frame() {
    confetti({
      particleCount: 5,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors: ['#FCD34D', '#F87171']
    });
    confetti({
      particleCount: 5,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors: ['#60A5FA', '#34D399']
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  }());
};

const getPictureClass = (item: Item) => {
  if (matchedIds.value.includes(item.id)) {
    return "matched";
  }
  if (wrongPair.value?.pictureId === item.id) {
    return "wrong";
  }
  if (selectedPicture.value?.id === item.id) {
    return "selected";
  }
  return "";
};

const getWordClass = (item: Item) => {
  if (matchedIds.value.includes(item.id)) {
    return "matched";
  }
  if (wrongPair.value?.wordId === item.id) {
    return "wrong";
  }
  if (selectedWord.value?.id === item.id) {
    return "selected";
  }
  return "";
};

const messageClass = computed(() => {
  if (message.value.includes("Great") || message.value.includes("WON")) {
    return "text-green-500";
  }
  return "text-orange-500";
});

const resetGame = () => {
  selectedPicture.value = null;
  selectedWord.value = null;
  matchedIds.value = [];
  wrongPair.value = null;
  message.value = "";
  shuffledPictures.value = shuffle(items);
  shuffledWords.value = shuffle(items);
};
</script>

<style scoped>
.font-round {
    font-family: 'Varela Round', 'nunito', sans-serif;
}

/* Picture Styles */
.picture-item {
  @apply cursor-pointer relative filter transition-all duration-300 z-10;
}

.picture-item.selected {
  @apply z-30 scale-110 rotate-0;
}

.picture-item.matched {
  @apply opacity-0 scale-50 pointer-events-none absolute; /* Fly away effect */
  transition: all 0.8s cubic-bezier(0.6, -0.28, 0.735, 0.045);
}

.picture-item.wrong {
  @apply animate-shake filter grayscale sepia; 
}

/* Word Styles */
.word-card {
  @apply cursor-pointer px-6 py-4 rounded-2xl shadow-[0_6px_0_rgba(0,0,0,0.1)] border-b-4 border-transparent transition-all duration-200 min-w-[140px] text-center transform hover:-translate-y-1 active:translate-y-1 active:shadow-none;
}

.word-card:hover {
  @apply brightness-105 bg-indigo-500 text-white shadow-[0_8px_0_rgba(79,70,229,0.2)];
}

.word-card.selected {
  @apply bg-indigo-600 text-white scale-110 shadow-[0_10px_20px_rgba(79,70,229,0.3)] ring-4 ring-indigo-300;
}

.word-card.matched {
  @apply hidden; /* Hide immediately or animate out */
}

.word-card.wrong {
  @apply bg-red-100 border-red-400 text-red-600 animate-shake;
}

@keyframes spin-slow {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.animate-spin-slow {
  animation: spin-slow 8s linear infinite;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-10px) rotate(-5deg); }
  75% { transform: translateX(10px) rotate(5deg); }
}

.animate-shake {
  animation: shake 0.4s ease-in-out;
}
</style>
