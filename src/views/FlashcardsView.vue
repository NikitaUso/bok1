<script setup>
defineOptions({ name: 'FlashcardsView' })
import { ref, computed, watch, onMounted } from 'vue'
import set1 from '../data/flashcards_set1.js'
import set2 from '../data/flashcards_set2.js'

// Modes (kapitel + combined kap6_7)
const modes = [
  { id: 'all', label: 'Alla kapitel' },
  { id: 'kap1', label: 'Kap 1' },
  { id: 'kap2', label: 'Kap 2' },
  { id: 'kap3', label: 'Kap 3' },
  { id: 'kap4', label: 'Kap 4' },
  { id: 'kap5', label: 'Kap 5' },
  { id: 'kap6_7', label: 'Kap 6-7' },
]

// State
const currentMode = ref('all')
const currentIndex = ref(0)
const isFlipped = ref(false)
const showFlashcards = ref(true) // show SET2 by default as requested

// Use SET2 as the active dataset by default
const activeSet = ref(set2)

const filteredCards = ref([])

function shuffleArray(arr) {
  const a = arr.slice()
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function updateAndShuffleCards() {
  const mode = currentMode.value
  const all = activeSet.value || []

  let selected = all.filter((c) => {
    if (mode === 'all') return true
    if (mode === 'kap6_7') return ['kap6_7', 'kap6', 'kap7'].includes(c.category)
    return c.category === mode
  })

  // Try restore saved order/index for this mode
  try {
    const storageKey = `flashcards_state_${mode}`
    const raw = localStorage.getItem(storageKey)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (parsed && parsed.order && Array.isArray(parsed.order)) {
        const ordered = parsed.order
          .map((q) => selected.find((s) => s.question === q))
          .filter(Boolean)
        // if restored list length matches selected, use it
        if (ordered.length === selected.length) {
          filteredCards.value = ordered
          currentIndex.value = Math.min(parsed.index || 0, ordered.length - 1)
          isFlipped.value = false
          return
        }
      }
    }
  } catch (e) {
    console.warn('Failed to load flashcard state', e)
  }

  // Fallback: shuffle
  filteredCards.value = shuffleArray(selected)
  currentIndex.value = 0
  isFlipped.value = false
  saveFlashcardsState(mode)
}

function saveFlashcardsState(mode) {
  try {
    const storageKey = `flashcards_state_${mode}`
    const order = filteredCards.value.map((c) => c.question)
    const payload = { order, index: currentIndex.value }
    localStorage.setItem(storageKey, JSON.stringify(payload))
  } catch (e) {
    console.warn('Failed to save flashcard state', e)
  }
}

const currentCard = computed(() => {
  if (filteredCards.value.length === 0) return null
  const idx = Math.min(currentIndex.value, filteredCards.value.length - 1)
  return filteredCards.value[idx]
})

watch(
  currentMode,
  () => {
    updateAndShuffleCards()
  },
  { immediate: true },
)

watch(currentIndex, () => {
  saveFlashcardsState(currentMode.value)
})

function flipCard() {
  if (!currentCard.value) return
  isFlipped.value = !isFlipped.value
}

function nextCard() {
  isFlipped.value = false
  setTimeout(() => {
    if (currentIndex.value < filteredCards.value.length - 1) {
      currentIndex.value++
    } else {
      currentIndex.value = 0
    }
    saveFlashcardsState(currentMode.value)
  }, 200)
}

function prevCard() {
  isFlipped.value = false
  setTimeout(() => {
    if (currentIndex.value > 0) {
      currentIndex.value--
    } else {
      currentIndex.value = Math.max(filteredCards.value.length - 1, 0)
    }
    saveFlashcardsState(currentMode.value)
  }, 200)
}

function shuffleAndRandomize() {
  if (!filteredCards.value || filteredCards.value.length === 0) return
  filteredCards.value = shuffleArray(filteredCards.value)
  currentIndex.value = Math.floor(Math.random() * filteredCards.value.length)
  isFlipped.value = false
  saveFlashcardsState(currentMode.value)
}

onMounted(() => {
  updateAndShuffleCards()
})
</script>

<template>
  <div v-if="showFlashcards" class="flashcard-wrapper">
    <div class="mode-selector-container">
      <label for="chapter-select">Välj kapitel:</label>
      <select id="chapter-select" v-model="currentMode">
        <option v-for="mode in modes" :key="mode.id" :value="mode.id">
          {{ mode.label }}
        </option>
      </select>
    </div>

    <div v-if="currentCard" class="scene">
      <div class="card" :class="{ 'is-flipped': isFlipped }" @click="flipCard">
        <div class="card-face card-front">
          <h3>
            FRÅGA
            <span class="counter">({{ currentIndex + 1 }} / {{ filteredCards.length }})</span>
          </h3>
          <p>{{ currentCard.question }}</p>
        </div>

        <div class="card-face card-back">
          <h3>SVAR</h3>
          <p>{{ currentCard.answer }}</p>
        </div>
      </div>
    </div>

    <div v-else class="scene empty-state">
      <p>Inga flashcards inlagda för detta kapitel än!</p>
    </div>

    <div class="controls" v-if="currentCard">
      <button
        @click="prevCard"
        :disabled="filteredCards.length <= 1"
        class="btn btn-prev"
        title="Föregående fråga"
      >
        Föregående
      </button>

      <button @click="shuffleAndRandomize" class="btn btn-shuffle">Slumpa</button>

      <button @click="nextCard" class="btn btn-next">Nästa kort</button>
    </div>
  </div>
</template>

<style scoped>
.flashcard-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  flex-grow: 1;
  min-height: 100%;
  padding: 40px 20px 80px 20px;
  box-sizing: border-box;
}

.mode-selector-container {
  margin-bottom: 30px;
  display: flex;
  align-items: center;
  gap: 10px;
  background: white;
  padding: 10px 20px;
  border-radius: 30px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
}

label {
  font-weight: bold;
  color: #2c3e50;
  font-size: 0.9rem;
}

select {
  padding: 8px 12px;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #f9f9f9;
  cursor: pointer;
}

.scene {
  width: 90vw;
  max-width: 800px;
  height: 500px;
  perspective: 1000px;
  margin: 0 0 40px 0;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: bold;
  color: #999;
  border: 3px dashed #ccc;
  border-radius: 20px;
}

.card {
  width: 100%;
  height: 100%;
  position: relative;
  transition: transform 0.6s;
  transform-style: preserve-3d;
  cursor: pointer;
}

.card.is-flipped {
  transform: rotateY(180deg);
}

.card-face {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  padding: 40px;
  box-sizing: border-box;
  text-align: center;
  overflow-y: auto;
}

.card-front {
  background: white;
  border: 4px solid #2c3e50;
  color: #2c3e50;
}

.card-back {
  background: #2c3e50;
  color: white;
  transform: rotateY(180deg);
}

h3 {
  font-size: 1.1rem;
  text-transform: uppercase;
  letter-spacing: 2px;
  margin: 0 0 20px 0;
  opacity: 0.6;
}

.counter {
  display: block;
  font-size: 0.9rem;
  margin-top: 5px;
}

p {
  font-size: 1.6rem;
  font-weight: bold;
  line-height: 1.5;
  margin: 0;
}

.controls {
  display: flex;
  gap: 16px;
  justify-content: center;
  align-items: center;
}

/* Unified button style - only color differs for variants */
.btn {
  padding: 15px 40px;
  border: none;
  border-radius: 50px;
  font-size: 1.2rem;
  font-weight: bold;
  cursor: pointer;
  transition:
    transform 0.18s,
    background-color 0.18s;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
  color: white;
}

.btn:disabled {
  opacity: 0.5;
  cursor: default;
}

.btn-prev {
  background-color: #3498db;
  box-shadow: 0 4px 12px rgba(52, 152, 219, 0.25);
}
.btn-prev:hover {
  transform: scale(1.03);
  background-color: #2d86c6;
}

.btn-shuffle {
  background-color: #8e44ad;
  box-shadow: 0 4px 12px rgba(142, 68, 173, 0.25);
}
.btn-shuffle:hover {
  transform: scale(1.03);
  background-color: #7a3aa0;
}

.btn-next {
  background-color: #42b883;
  box-shadow: 0 4px 15px rgba(66, 184, 131, 0.35);
}
.btn-next:hover {
  transform: scale(1.05);
  background-color: #3aa876;
}
</style>
