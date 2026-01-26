<template>
  <div class="lyrics-game min-h-[600px] flex flex-col md:flex-row pb-12 gap-8">
    
    <!-- Song/Story Area -->
    <!-- Song/Story Area (Left) -->
    <div class="flex-grow w-full max-w-4xl space-y-6 mb-12 md:mb-0 pt-8 pl-4">
      <div 
        v-for="(line, lineIndex) in lines" 
        :key="lineIndex"
        class="flex flex-wrap items-center justify-center gap-3 text-lg md:text-3xl font-bold text-indigo-900 transition-all duration-500"
        :class="{'opacity-50 blur-[1px]': currentLineIndex !== lineIndex && !isComplete, 'scale-105': currentLineIndex === lineIndex}"
      >
        <template v-for="(segment, segIndex) in line.segments" :key="segIndex">
          <!-- Text Segment -->
          <span v-if="segment.type === 'text'" class="drop-shadow-sm">{{ segment.content }}</span>
          
          <!-- Slot Segment -->
          <div 
            v-else-if="segment.type === 'slot'"
            @click="handleSlotClick(lineIndex, segIndex)"
            class="relative w-20 h-20 md:w-24 md:h-24 rounded-2xl border-4 transition-all duration-300 flex items-center justify-center cursor-pointer shadow-inner"
            :class="[
              segment.filledItem 
                ? 'bg-white border-green-400 shadow-green-100' 
                : 'bg-white/50 border-dashed border-indigo-300 hover:border-indigo-500 hover:bg-indigo-50',
              activeSlot?.lineIndex === lineIndex && activeSlot?.segIndex === segIndex ? 'ring-4 ring-indigo-400 ring-offset-2' : ''
            ]"
          >
            <!-- Filled Image -->
            <transition name="pop">
              <img 
                v-if="segment.filledItem"
                :src="segment.filledItem.image" 
                :alt="segment.filledItem.name"
                class="w-16 h-16 md:w-20 md:h-20 object-contain drop-shadow-md"
              />
            </transition>
            
            <!-- Placeholder/Hint -->
            <span v-if="!segment.filledItem" class="text-indigo-200 text-2xl font-black opacity-50">+</span>
          </div>
        </template>
      </div>
    </div>

    <!-- Inventory / Options Area -->
    <!-- Inventory / Options Area (Right Column) -->
    <!-- Inventory / Options Area (Right Column) -->
    <div class="fixed md:sticky bottom-0 md:top-24 md:h-[calc(100vh-8rem)] w-full md:w-80 lg:w-96 bg-white/90 backdrop-blur-xl border-t md:border-l border-white/50 p-6 md:p-8 shadow-[-10px_0_40px_rgba(0,0,0,0.1)] z-50 md:rounded-3xl transition-transform duration-500 flex flex-col"
      :class="isComplete ? 'translate-y-full md:translate-x-full' : 'translate-y-0 md:translate-x-0'">
      <div class="h-full flex flex-col">
        <h3 class="text-center text-indigo-600 font-bold mb-6 uppercase tracking-wider text-sm">Choose an item</h3>
        
        <div class="grid grid-cols-3 md:grid-cols-2 gap-4 md:gap-6 justify-items-center content-start">
          <div 
            v-for="item in availableItems" 
            :key="item.id"
            @click="selectItem(item)"
            class="group relative cursor-pointer transition-all duration-300 p-4 rounded-2xl bg-white shadow-lg border-2 border-transparent hover:border-indigo-400 hover:-translate-y-1 hover:shadow-xl w-full aspect-square flex items-center justify-center"
            :class="{'ring-4 ring-indigo-400 ring-offset-2 bg-indigo-50 scale-105': selectedItem?.id === item.id, 'opacity-50 grayscale pointer-events-none': item.used}"
          >
            <img :src="item.image" :alt="item.name" class="w-full h-full object-contain" />
          </div>
        </div>
      </div>
    </div>

    <!-- Success Message & Reset -->
    <!-- Success Message & Reset (Centered Overlay or bottom of main) -->
    <div v-if="isComplete" class="fixed inset-0 z-[60] flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
      <div class="bg-white rounded-[2rem] p-8 md:p-12 text-center shadow-2xl animate-in fade-in zoom-in duration-500">
      <div class="text-4xl md:text-5xl mb-6">🎉 ❄️ 🎵</div>
      <h2 class="text-2xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-teal-500 mb-8">
        Wonderful Winter Song!
      </h2>
      <button 
        @click="resetGame"
        class="inline-flex items-center px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-lg font-bold rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all"
      >
        Sing Again! 🔄
      </button>
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

interface Segment {
  type: 'text' | 'slot';
  content?: string;
  targetId?: number; // The ID of the item that should go here
  filledItem?: Item | null;
}

interface Line {
  segments: Segment[];
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

const items = ref<Item[]>(structuredClone(allItems));

// Game State
const selectedItem = ref<Item | null>(null);
const activeSlot = ref<{lineIndex: number, segIndex: number} | null>(null);

// Song Structure
const lines = ref<Line[]>([
  {
    segments: [
      { type: 'text', content: 'Put on your' },
      { type: 'slot', targetId: 1, filledItem: null } // Scarf
    ]
  },
  {
    segments: [
      { type: 'text', content: 'Your' },
      { type: 'slot', targetId: 2, filledItem: null }, // Boots
      { type: 'text', content: 'and your' },
      { type: 'slot', targetId: 3, filledItem: null } // Gloves
    ]
  },
  {
    segments: [
      { type: 'text', content: "Let's go outside" }
    ]
  },
  {
    segments: [
      { type: 'text', content: "Hurry, hurry up!" }
    ]
  },
  // Verse 2
  {
    segments: [
      { type: 'text', content: 'Put on your' },
      { type: 'slot', targetId: 4, filledItem: null } // Parka
    ]
  },
  {
    segments: [
      { type: 'text', content: 'Your' },
      { type: 'slot', targetId: 5, filledItem: null }, // Cap
      { type: 'text', content: 'and your' },
      { type: 'slot', targetId: 6, filledItem: null } // Mittens
    ]
  },
  {
    segments: [
      { type: 'text', content: "Let's go outside" }
    ]
  },
  {
    segments: [
      { type: 'text', content: "Hurry, hurry up!" }
    ]
  }
]);

// Computed
const availableItems = computed(() => items.value);
const currentLineIndex = computed(() => {
  // Find the first line with an empty slot
  const index = lines.value.findIndex(line => line.segments.some(s => s.type === 'slot' && !s.filledItem));
  return index === -1 ? lines.value.length - 1 : index;
});
const isComplete = computed(() => lines.value.every(line => line.segments.every(s => s.type !== 'slot' || s.filledItem)));

// Actions
const selectItem = (item: Item) => {
  if (item.used) return;
  selectedItem.value = selectedItem.value?.id === item.id ? null : item;
  attemptFill();
};

const handleSlotClick = (lineIndex: number, segIndex: number) => {
  const segment = lines.value[lineIndex].segments[segIndex];
  if (segment.filledItem) return; // Already filled

  activeSlot.value = { lineIndex, segIndex };
  attemptFill();
};

const attemptFill = () => {
  if (!selectedItem.value || !activeSlot.value) return;

  const { lineIndex, segIndex } = activeSlot.value;

  if (!lines.value[lineIndex] || !lines.value[lineIndex].segments[segIndex]) return;
  const segment = lines.value[lineIndex].segments[segIndex];
  
  // Check if correct (Strict matching for learning?)
  // User asked: "Put on your [scarf image]" -> implies specific order.
  if (segment.targetId === selectedItem.value.id) {
    // Correct!
    segment.filledItem = { ...selectedItem.value };
    
    // Mark item as used
    const itemInList = items.value.find(i => i.id === selectedItem.value!.id);
    if (itemInList) itemInList.used = true;

    // Reset selection
    selectedItem.value = null;
    activeSlot.value = null;
    
    // Play sound? (Maybe later)
  } else {
    // Wrong match
    // Could add visual feedback like shake
    // Just reset for specific UI feedback if we wanted
    selectedItem.value = null; // Deselect to force user to try again
  }
};

const resetGame = () => {
  items.value = structuredClone(allItems);
  selectedItem.value = null;
  activeSlot.value = null;
  
  lines.value.forEach(line => {
    line.segments.forEach(seg => {
      if (seg.type === 'slot') seg.filledItem = null;
    });
  });
};

</script>

<style scoped>
.pop-enter-active {
  animation: pop-in 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

@keyframes pop-in {
  0% { transform: scale(0); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
}
</style>
