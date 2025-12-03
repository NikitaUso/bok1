<template>
  <div class="page">
    <h1>Personalkostnader Formel</h1>
    <p>Klicka på valfri ruta nedan för att se formeln för just den kostnaden.</p>

    <div class="formula-card">
      <div class="equation-wrapper">
        <div class="term-box result">
          <button class="term-btn active">
            {{ currentEquation.left.label }}
          </button>
          <div class="term-desc">{{ currentEquation.left.desc }}</div>
        </div>

        <div class="operator">=</div>

        <div class="term-box calculation">
          <button class="term-btn clickable" @click="setEquationTarget(currentEquation.right.key)">
            {{ currentEquation.right.label }}
          </button>

          <span class="math-operator">{{ currentEquation.operator }}</span>

          <div class="factor-badge" :title="currentEquation.factorDesc">
            {{ currentEquation.factor }}
          </div>
        </div>
      </div>

      <div class="equation-explanation">
        <small
          ><em>{{ currentEquation.explanation }}</em></small
        >
      </div>
    </div>

    <div class="calculator-section">
      <h3>Testa med egna siffror</h3>

      <div class="mode-row">
        <label for="inputMode">Utgå från:</label>
        <select id="inputMode" v-model="inputMode">
          <option value="brutto">Bruttolön</option>
          <option value="netto">Nettolön</option>
        </select>
      </div>

      <div class="input-wrapper">
        <label v-if="inputMode === 'brutto'">Ange Bruttolön (kr):</label>
        <label v-else>Ange Nettolön (kr):</label>
        <input type="number" v-model.number="inputAmount" step="1000" />
      </div>

      <div class="result-grid">
        <div
          class="res-card"
          :class="{ selected: activeMode === 'netto' }"
          @click="setEquationTarget('netto')"
        >
          <span class="label">Nettolön (x 0,70)</span>
          <span class="value">{{ formatCurrency(values.netto) }}</span>
        </div>

        <div
          class="res-card"
          :class="{ selected: activeMode === 'skatt' }"
          @click="setEquationTarget('skatt')"
        >
          <span class="label">Skatt (x 0,30)</span>
          <span class="value">{{ formatCurrency(values.skatt) }}</span>
        </div>

        <div
          class="res-card"
          :class="{ selected: activeMode === 'ag' }"
          @click="setEquationTarget('ag')"
        >
          <span class="label">Ag-avgift (x 0,31)</span>
          <span class="value">{{ formatCurrency(values.ag) }}</span>
        </div>

        <div
          class="res-card highlight"
          :class="{ selected: activeMode === 'brutto' }"
          @click="setEquationTarget('brutto')"
        >
          <span class="label">Bruttolön (Bas)</span>
          <span class="value">{{ formatCurrency(values.brutto) }}</span>
        </div>

        <div
          class="res-card total"
          :class="{ selected: activeMode === 'total' }"
          @click="setEquationTarget('total')"
        >
          <span class="label">Total Kostnad (x 1,31)</span>
          <span class="value">{{ formatCurrency(values.total) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

// --- State ---
const inputMode = ref('brutto') // 'brutto' | 'netto'
const inputAmount = ref(30000)
const activeMode = ref('total') // 'total', 'brutto', 'netto', 'skatt', 'ag'

// --- Konstanter ---
const FACTORS = {
  skatt: 0.3,
  ag: 0.31,
  netto: 0.7, // (1 - 0.30)
  total: 1.31, // (1 + 0.31)
}

// --- Logik för Formeln ---
const currentEquation = computed(() => {
  const mode = activeMode.value

  // Scenario 1: SKATT (NY!)
  if (mode === 'skatt') {
    return {
      left: { label: 'Skatt', desc: 'Preliminärskatt till Skatteverket' },
      right: { key: 'brutto', label: 'Bruttolön' },
      operator: '×',
      factor: '0,30',
      factorDesc: 'Skattesatsen är 30%',
      explanation: 'Skatten beräknas som 30% av bruttolönen.',
    }
  }

  // Scenario 2: ARBETSGIVARAVGIFT (NY!)
  if (mode === 'ag') {
    return {
      left: { label: 'Ag-avgift', desc: 'Sociala avgifter' },
      right: { key: 'brutto', label: 'Bruttolön' },
      operator: '×',
      factor: '0,31',
      factorDesc: 'Avgiften är 31%',
      explanation: 'Arbetsgivaravgiften beräknas som 31% av bruttolönen (ovanpå lönen).',
    }
  }

  // Scenario 3: NETTOLÖN
  if (mode === 'netto') {
    return {
      left: { label: 'Nettolön', desc: 'Pengar i plånboken' },
      right: { key: 'brutto', label: 'Bruttolön' },
      operator: '×',
      factor: '0,70',
      factorDesc: 'Faktor efter skatt (100% - 30%)',
      explanation: 'Den anställde får behålla 70% av bruttolönen.',
    }
  }

  // Scenario 4: BRUTTOLÖN (Baklänges)
  if (mode === 'brutto') {
    return {
      left: { label: 'Bruttolön', desc: 'Lönen på kontraktet' },
      right: { key: 'total', label: 'Total Kostnad' },
      operator: '/',
      factor: '1,31',
      factorDesc: 'Dividera bort påslaget',
      explanation: 'För att räkna ut vilken lön en totalbudget räcker till, dela totalen med 1,31.',
    }
  }

  // Scenario 5: TOTAL (Default)
  return {
    left: { label: 'Total Kostnad', desc: 'Företagets utgift' },
    right: { key: 'brutto', label: 'Bruttolön' },
    operator: '×',
    factor: '1,31',
    factorDesc: 'Faktor för påslag (100% + 31%)',
    explanation: 'Totala kostnaden är bruttolönen plus 31% i avgifter.',
  }
})

const setEquationTarget = (mode) => {
  activeMode.value = mode
}

// --- Beräkning av värden ---
const bruttoBase = computed(() => {
  const amount = inputAmount.value || 0
  return inputMode.value === 'brutto' ? amount : amount / FACTORS.netto
})

const values = computed(() => {
  const b = bruttoBase.value || 0
  return {
    brutto: b,
    skatt: b * FACTORS.skatt,
    ag: b * FACTORS.ag,
    netto: b * FACTORS.netto,
    total: b * FACTORS.total,
  }
})

// --- Formatering ---
const formatCurrency = (val) => {
  return new Intl.NumberFormat('sv-SE', {
    style: 'currency',
    currency: 'SEK',
    maximumFractionDigits: 0,
  }).format(val)
}
</script>

<style scoped>
.page {
  max-width: 800px;
  margin: 0 auto;
  padding: 40px 20px;
  font-family: 'Inter', system-ui, sans-serif;
  color: #2c3e50;
}

/* Formel Styling */
.formula-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 40px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05);
  margin-bottom: 40px;
  text-align: center;
}

.equation-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 15px;
  flex-wrap: wrap;
  margin-bottom: 20px;
}

.operator {
  font-size: 2rem;
  color: #94a3b8;
  font-weight: 300;
}

.math-operator {
  font-size: 1.5rem;
  font-weight: bold;
  color: #3b82f6;
  margin: 0 10px;
}

.term-box {
  display: flex;
  align-items: center;
  flex-direction: column;
}

.term-btn {
  padding: 12px 24px;
  font-size: 1.1rem;
  border-radius: 8px;
  border: 2px solid #cbd5e1;
  background: white;
  font-weight: 600;
  color: #475569;
  cursor: pointer;
  transition: all 0.2s;
  min-width: 140px;
}

.term-btn.active {
  background: #eff6ff;
  border-color: #3b82f6;
  color: #1d4ed8;
  cursor: default;
  transform: scale(1.05);
}

.term-btn.clickable:hover {
  border-color: #f59e0b;
  background: #fffbeb;
  transform: translateY(-2px);
}

.term-desc {
  margin-top: 8px;
  font-size: 0.85rem;
  color: #64748b;
}

.factor-badge {
  background: #f1f5f9;
  color: #334155;
  padding: 8px 16px;
  border-radius: 20px;
  font-weight: bold;
  font-family: monospace;
  font-size: 1.1rem;
  border: 1px dashed #cbd5e1;
}

.equation-explanation {
  color: #64748b;
  background: #f8fafc;
  display: inline-block;
  padding: 8px 16px;
  border-radius: 6px;
}

/* Calculator Section */
.calculator-section {
  background: #f8fafc;
  padding: 30px;
  border-radius: 12px;
}

.mode-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 15px;
}
.mode-row select {
  padding: 8px 10px;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
}

.input-wrapper {
  margin-bottom: 30px;
}
.input-wrapper input {
  font-size: 1.2rem;
  padding: 10px;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  width: 100%;
  max-width: 200px;
  margin-top: 5px;
}

.result-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 15px;
}

.res-card {
  background: white;
  padding: 20px;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  cursor: pointer;
  transition: all 0.2s;
}

.res-card:hover {
  border-color: #94a3b8;
  transform: translateY(-2px);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
}

.res-card.selected {
  border-color: #3b82f6;
  background: #eff6ff;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
}

.res-card.highlight {
  background: #f0f9ff; /* Svag blå ton för Brutto */
}

.res-card.total {
  border-bottom: 4px solid #3b82f6;
}

.res-card .label {
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: #64748b;
  margin-bottom: 8px;
}

.res-card .value {
  font-size: 1.4rem;
  font-weight: 700;
  color: #0f172a;
}
</style>
