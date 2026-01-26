<template>
  <div class="matching-game relative min-h-[600px] flex flex-col justify-between">
    <!-- Game board -->
    <div class="flex-grow relative z-10 p-4 min-h-[400px]">
      
      <!-- Pictures Scatter Area -->
      <div class="flex flex-wrap justify-center items-center gap-12 md:gap-20 py-10">
        <div
          v-for="item in shuffledPictures"
          :key="'pic-' + item.id"
          @click="selectPicture(item)"
          :class="getPictureClass(item)"
          class="picture-item group relative transition-all duration-300"
        >
          <img
            :src="'/images/level1/' + item.image"
            :alt="item.word"
            class="w-32 h-32 md:w-48 md:h-48 object-contain drop-shadow-xl transition-transform duration-300 group-hover:scale-110"
          />
          <!-- Selection/Match Indicator -->
          <div v-if="selectedPicture?.id === item.id" class="absolute -inset-4 border-4 border-dashed border-indigo-400 rounded-full animate-spin-slow opacity-50 pointer-events-none"></div>
        </div>
      </div>
    </div>

    <!-- Message Overlay (Centered) -->
    <div v-if="message" class="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none">
      <div class="bg-white/90 backdrop-blur-md px-8 py-4 rounded-full shadow-2xl border-4 border-indigo-100">
        <p :class="messageClass" class="text-3xl font-black tracking-wide">{{ message }}</p>
      </div>
    </div>

    <!-- Words Row (Bottom) -->
    <div class="relative z-20 mt-auto bg-white/40 backdrop-blur-md p-6 rounded-3xl border border-white/50 shadow-lg">
      <div class="flex flex-wrap justify-center gap-4 md:gap-6">
        <div
          v-for="item in shuffledWords"
          :key="'word-' + item.id"
          @click="selectWord(item)"
          :class="getWordClass(item)"
          class="word-card"
        >
          <span class="text-sm md:text-xl font-bold uppercase tracking-wider">{{ item.word }}</span>
        </div>
      </div>

       <!-- Reset button -->
      <div v-if="isGameComplete" class="text-center mt-8">
        <button @click="resetGame" class="animate-bounce inline-flex items-center px-8 py-4 bg-gradient-to-r from-green-400 to-green-600 text-white text-xl font-bold rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all">
          Play Again! 🔄
        </button>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
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
    message.value = "Great job! ⭐";

    if (isGameComplete.value) {
      message.value = "Amazing! You matched all words! 🎉";
    }
  } else {
    // Wrong match
    wrongPair.value = {
      pictureId: selectedPicture.value.id,
      wordId: selectedWord.value.id,
    };
    message.value = "Try again! 🔄";

    setTimeout(() => {
      wrongPair.value = null;
    }, 800);
  }

  selectedPicture.value = null;
  selectedWord.value = null;
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
  if (message.value.includes("Great") || message.value.includes("Amazing")) {
    return "text-green-600";
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
/* Picture Styles */
.picture-item {
  @apply cursor-pointer relative filter transition-all duration-300;
}

.picture-item.selected img {
  @apply scale-125 drop-shadow-[0_20px_20px_rgba(0,0,0,0.2)];
}

.picture-item.matched {
  @apply opacity-30 grayscale cursor-default scale-90;
}

.picture-item.wrong {
  @apply animate-shake filter brightness-75 sepia saturate-200 hue-rotate-[-50deg]; /* Reddish tint */
}

/* Word Styles */
.word-card {
  @apply cursor-pointer px-6 py-3 bg-white rounded-xl shadow-md border-2 border-transparent transition-all duration-200 min-w-[120px] text-center;
}

.word-card:hover:not(.matched) {
  @apply -translate-y-1 shadow-lg border-indigo-200;
}

.word-card.selected {
  @apply bg-indigo-600 text-white border-indigo-600 scale-110 shadow-xl;
}

.word-card.matched {
  @apply opacity-0 w-0 h-0 m-0 p-0 overflow-hidden border-0; /* Hide matched words comfortably */
  transition: all 0.5s ease-in-out;
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
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}

.animate-shake {
  animation: shake 0.3s ease-in-out;
}
</style>
