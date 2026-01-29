<template>
  <div class="audio-game min-h-[500px] flex flex-col items-center justify-center pb-60">
    
    <!-- Game Card -->
    <div class="relative w-full max-w-xl bg-white/60 backdrop-blur-xl rounded-[2.5rem] p-8 shadow-2xl border border-white/50 text-center transition-all duration-500">
       
        <!-- Progress Bar -->
        <div class="absolute top-8 left-1/2 -translate-x-1/2 flex items-center gap-2">
            <span v-for="(line, idx) in lines" :key="idx" class="w-3 h-3 rounded-full transition-colors duration-300" :class="idx <= currentLineIndex ? 'bg-indigo-500' : 'bg-gray-300'"></span>
        </div>

       <!-- Main Content -->
       <div class="flex items-center justify-center gap-8 md:gap-16 py-8">
           
           <!-- Audio Button (Big) -->
             <button 
             @click="playLine(lines[currentLineIndex])"
             class="w-24 h-24 md:w-32 md:h-32 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 group bg-indigo-600 hover:bg-indigo-500 hover:scale-110 active:scale-95 shrink-0"
             :class="{'animate-pulse ring-8 ring-indigo-300': isPlaying}"
           >
             <span class="text-5xl md:text-6xl filter drop-shadow-md text-white">
                {{ isPlaying ? '🔊' : '▶️' }}
             </span>
           </button>

           <!-- Question/Target Slot -->
           <div
             class="w-24 h-24 md:w-32 md:h-32 rounded-[2rem] border-4 border-dashed border-indigo-200 flex items-center justify-center bg-white/50 relative overflow-hidden shrink-0 transition-all duration-300"
             :class="{
               'border-green-400 bg-green-50': lines[currentLineIndex]?.filledItem,
               'animate-success-glow ring-8 ring-green-400/50 border-green-500 bg-green-100': showCorrectEffect
             }"
           >
             <transition name="pop" mode="out-in">
                <!-- If item found -->
                <img
                    v-if="lines[currentLineIndex]?.filledItem"
                    :src="lines[currentLineIndex].filledItem.image"
                    class="w-24 h-24 md:w-32 md:h-32 object-contain drop-shadow-lg"
                />
                <!-- Hint -->
                 <span v-else class="text-indigo-200 text-7xl font-round font-black opacity-40">?</span>
             </transition>

             <!-- Success checkmark overlay -->
             <transition name="pop">
               <div v-if="showCorrectEffect" class="absolute inset-0 flex items-center justify-center bg-green-500/20">
                 <span class="text-6xl animate-bounce">✅</span>
               </div>
             </transition>
           </div>
       </div>

       <!-- Correct Answer Popup -->
       <transition name="pop">
         <div v-if="showCorrectEffect" class="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-full font-bold text-xl shadow-lg flex items-center gap-2">
           <span class="text-2xl">⭐</span>
           Great Job!
           <span class="text-2xl">⭐</span>
         </div>
       </transition>

    </div>

    <!-- Inventory / Options (Fixed Bottom) -->
    <div class="fixed bottom-0 left-0 w-full bg-white/90 backdrop-blur-2xl p-6 pb-8 shadow-[0_-10px_60px_rgba(0,0,0,0.1)] z-50 rounded-t-[3rem]">
      <div class="max-w-5xl mx-auto">
        <h3 class="text-center text-indigo-500 font-bold mb-6 uppercase tracking-wider text-sm font-round">Listen and Choose the matching item</h3>
        <div class="flex justify-center gap-6 md:gap-10 overflow-x-auto pb-4 px-4 scrollbar-hide">
          <div
            v-for="item in availableItems"
            :key="item.id"
            @click="selectItem(item)"
            class="group relative cursor-pointer transition-all duration-300 p-4 rounded-3xl bg-white shadow-lg border-4 border-transparent hover:border-indigo-300 hover:-translate-y-2 hover:shadow-2xl min-w-[100px] flex items-center justify-center aspect-square"
            :class="{
              '!border-indigo-500 bg-indigo-50 scale-110': selectedItem?.id === item.id,
              'animate-shake !border-red-500 bg-red-50': showWrongEffect && lastWrongItemId === item.id
            }"
          >
             <img :src="item.image" :alt="item.name" class="w-16 h-16 md:w-20 md:h-20 object-contain filter group-hover:brightness-110" :class="{'opacity-30 grayscale': item.used}" />

             <!-- Checkmark if used -->
             <div v-if="item.used" class="absolute inset-0 flex items-center justify-center">
                 <span class="text-3xl">✅</span>
             </div>

             <!-- Wrong indicator -->
             <transition name="pop">
               <div v-if="showWrongEffect && lastWrongItemId === item.id" class="absolute inset-0 flex items-center justify-center bg-red-500/20 rounded-3xl">
                 <span class="text-4xl">❌</span>
               </div>
             </transition>
          </div>
        </div>
      </div>
    </div>

    <!-- Celebration Overlay -->
     <div v-if="showCelebration" class="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-md">
        <div class="bg-white rounded-[3rem] p-12 text-center shadow-2xl animate-in zoom-in fade-in duration-500 max-w-lg mx-6">
            <div class="text-8xl mb-4">🏆</div>
            <h2 class="text-5xl font-black text-indigo-600 mb-2 font-round">Amazing!</h2>
            <p class="text-xl text-gray-500">You have great listening ears!</p>
        </div>
     </div>

  </div>
</template>

<script setup lang="ts">
interface Item {
  id: number;
  name: string;
  image: string;
  used: boolean;
}

interface AudioLine {
  id: number;
  text: string;
  audio: string;
  targetId: number;
  filledItem: Item | null;
}

// Items Data
const allItems: Item[] = [
  { id: 1, name: 'Scarf', image: '/images/level1/scarf.png', used: false },
  { id: 2, name: 'Boots', image: '/images/level1/boots.png', used: false },
  { id: 3, name: 'Gloves', image: '/images/level1/gloves.png', used: false },
  { id: 4, name: 'Parka', image: '/images/level1/parka.png', used: false },
  { id: 5, name: 'Cap', image: '/images/level1/cap.png', used: false },
  { id: 6, name: 'Mittens', image: '/images/level1/mittens.png', used: false },
];

const shuffle = <T,>(array: T[]): T[] => {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

const items = ref<Item[]>(shuffle(structuredClone(allItems)));

// Game State
const selectedItem = ref<Item | null>(null);
const isPlaying = ref(false);
const showCelebration = ref(false);
const currentAudio = ref<HTMLAudioElement | null>(null);
const showCorrectEffect = ref(false);
const showWrongEffect = ref(false);
const lastWrongItemId = ref<number | null>(null);

const lines = ref<AudioLine[]>([
  { id: 1, text: "Put on your Scarf", audio: '/audio/level2/put-on-scarf.mp3', targetId: 1, filledItem: null },
  { id: 2, text: "Put on your Boots", audio: '/audio/level2/put-on-boots.mp3', targetId: 2, filledItem: null },
  { id: 3, text: "Put on your Gloves", audio: '/audio/level2/put-on-gloves.mp3', targetId: 3, filledItem: null },
  { id: 4, text: "Put on your Parka", audio: '/audio/level2/put-on-parka.mp3', targetId: 4, filledItem: null },
  { id: 5, text: "Put on your Cap", audio: '/audio/level2/put-on-cap.mp3', targetId: 5, filledItem: null },
  { id: 6, text: "Put on your Mittens", audio: '/audio/level2/put-on-mittens.mp3', targetId: 6, filledItem: null },
]);

// Computed
const availableItems = computed(() => items.value);

const currentLineIndex = computed(() => {
  const index = lines.value.findIndex(line => !line.filledItem);
  return index === -1 ? lines.value.length - 1 : index; 
});

const isComplete = computed(() => lines.value.every(line => line.filledItem));

// Watch for game completion
watch(isComplete, (complete) => {
  if (complete) {
    showCelebration.value = true;
    // Navigate to complete page after delay
    setTimeout(() => {
      navigateTo('/level2/complete');
    }, 2000);
  }
});

// Actions
const playLine = (line: AudioLine) => {
  if (isPlaying.value || !line) return;

  // Stop any currently playing audio
  if (currentAudio.value) {
    currentAudio.value.pause();
    currentAudio.value.currentTime = 0;
  }

  isPlaying.value = true;
  currentAudio.value = new Audio(line.audio);

  currentAudio.value.onended = () => {
    isPlaying.value = false;
  };

  currentAudio.value.onerror = () => {
    isPlaying.value = false;
  };

  currentAudio.value.play().catch(() => {
    isPlaying.value = false;
  });
};

const selectItem = (item: Item) => {
  if (item.used) return;
  // If clicked again, deselect? Or just simple select. Let's do toggle.
  selectedItem.value = selectedItem.value?.id === item.id ? null : item;
  
  if (selectedItem.value) {
     attemptMatch();
  }
};

const attemptMatch = () => {
  if (!selectedItem.value) return;
  
  const currentLine = lines.value[currentLineIndex.value];
  if (!currentLine) return; // Should not happen if game complete handled

  if (currentLine.targetId === selectedItem.value.id) {
    // Correct - show celebration effect
    showCorrectEffect.value = true;

    // Play success sound
    const successAudio = new Audio('/audio/level2/great-job.mp3');
    successAudio.play().catch(() => {});

    currentLine.filledItem = { ...selectedItem.value };

    // Mark global item as used
    const itemInList = items.value.find(i => i.id === selectedItem.value!.id);
    if (itemInList) itemInList.used = true;

    selectedItem.value = null;

    // Hide effect after delay
    setTimeout(() => {
      showCorrectEffect.value = false;
    }, 1500);

  } else {
    // Wrong - play try again sound and show shake effect
    lastWrongItemId.value = selectedItem.value.id;
    showWrongEffect.value = true;

    const tryAgainAudio = new Audio('/audio/level2/try-again.mp3');
    tryAgainAudio.play().catch(() => {});

    selectedItem.value = null;

    // Hide effect after animation
    setTimeout(() => {
      showWrongEffect.value = false;
      lastWrongItemId.value = null;
    }, 600);
  }
};

const resetGame = () => {
  items.value = shuffle(structuredClone(allItems));
  selectedItem.value = null;
  showCelebration.value = false;
  lines.value.forEach(l => l.filledItem = null);
};

// Cleanup on unmount
onUnmounted(() => {
  if (currentAudio.value) {
    currentAudio.value.pause();
  }
});
</script>

<style scoped>
.font-round {
    font-family: 'Varela Round', 'nunito', sans-serif; /* Fallback */
}

.scrollbar-hide::-webkit-scrollbar {
    display: none;
}
.scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
}

.pop-enter-active,
.pop-leave-active {
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.pop-enter-from,
.pop-leave-to {
  transform: scale(0.5);
  opacity: 0;
}

/* Shake animation for wrong answer */
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-8px); }
  20%, 40%, 60%, 80% { transform: translateX(8px); }
}

.animate-shake {
  animation: shake 0.5s ease-in-out;
}

/* Success glow animation */
@keyframes success-glow {
  0%, 100% {
    box-shadow: 0 0 20px rgba(34, 197, 94, 0.5);
  }
  50% {
    box-shadow: 0 0 40px rgba(34, 197, 94, 0.8);
  }
}

.animate-success-glow {
  animation: success-glow 0.5s ease-in-out 3;
}
</style>
