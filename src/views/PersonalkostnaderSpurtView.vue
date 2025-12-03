<template>
  <div class="page">
    <h1>Personalkostnader Formel</h1>

    <div class="formula-card tumregel">
      <h3>Relationen: Brutto & Netto</h3>
      <p class="desc-text">
        Klicka på termerna <strong>i denna rutan</strong> för att vända på just denna ekvation.
      </p>

      <div class="equation-wrapper static-math">
        <div class="term-col">
          <button class="math-btn active">
            {{ topEquation.left.label }}
          </button>
          <span class="math-value-small">{{ topEquation.left.value }}</span>
        </div>

        <span class="operator">=</span>

        <div class="fraction" v-if="topEquation.type === 'division'">
          <div class="numerator term-col">
            <button class="math-btn clickable" @click="setTopMode(topEquation.numerator.key)">
              {{ topEquation.numerator.label }}
            </button>
            <span class="math-value-small">{{ topEquation.numerator.value }}</span>
          </div>
          <div class="denominator term-col">
            <button class="math-btn clickable" @click="setTopMode(topEquation.denominator.key)">
              {{ topEquation.denominator.label }}
            </button>
            <span class="math-value-small">{{ topEquation.denominator.value }}</span>
          </div>
        </div>

        <div class="linear-math" v-else>
          <div class="term-col">
            <button class="math-btn clickable" @click="setTopMode(topEquation.term1.key)">
              {{ topEquation.term1.label }}
            </button>
            <span class="math-value-small">{{ topEquation.term1.value }}</span>
          </div>

          <span class="math-operator">×</span>

          <div class="term-col">
            <button class="math-btn clickable" @click="setTopMode(topEquation.term2.key)">
              {{ topEquation.term2.label }}
            </button>
            <span class="math-value-small">{{ topEquation.term2.value }}</span>
          </div>
        </div>
      </div>
    </div>

    <hr class="divider" />

    <p>Här nedan ser du totalkostnaderna för företaget.</p>

    <div class="formula-card interactive">
      <div class="equation-wrapper">
        <div class="term-box result">
          <button class="term-btn active">
            {{ bottomEquation.left.label }}
          </button>
          <div class="term-desc">{{ bottomEquation.left.desc }}</div>
        </div>

        <div class="operator">=</div>

        <div class="term-box calculation">
          <button class="term-btn clickable" @click="setBottomMode(bottomEquation.right.key)">
            {{ bottomEquation.right.label }}
          </button>

          <span class="math-operator">{{ bottomEquation.operator }}</span>

          <div class="factor-badge" :title="bottomEquation.factorDesc">
            {{ bottomEquation.factor }}
          </div>
        </div>
      </div>
      <div class="equation-explanation">
        <small
          ><em>{{ bottomEquation.explanation }}</em></small
        >
      </div>
    </div>

    <div class="calculator-section">
      <h3>Ange värden</h3>

      <div class="input-wrapper">
        <label>Ange Bruttolön (kr):</label>
        <input type="number" v-model.number="bruttolon" step="1000" />
      </div>

      <div class="result-grid">
        <div
          class="res-card"
          :class="{ selected: bottomMode === 'netto' }"
          @click="setBottomMode('netto')"
        >
          <span class="label">Nettolön</span>
          <span class="value">{{ formatCurrency(values.netto) }}</span>
        </div>

        <div
          class="res-card"
          :class="{ selected: bottomMode === 'skatt' }"
          @click="setBottomMode('skatt')"
        >
          <span class="label">Skatt (30%)</span>
          <span class="value">{{ formatCurrency(values.skatt) }}</span>
        </div>

        <div
          class="res-card"
          :class="{ selected: bottomMode === 'ag' }"
          @click="setBottomMode('ag')"
        >
          <span class="label">Ag-avgift (31%)</span>
          <span class="value">{{ formatCurrency(values.ag) }}</span>
        </div>

        <div
          class="res-card highlight"
          :class="{ selected: bottomMode === 'brutto' }"
          @click="setBottomMode('brutto')"
        >
          <span class="label">Bruttolön</span>
          <span class="value">{{ formatCurrency(values.brutto) }}</span>
        </div>

        <div
          class="res-card total"
          :class="{ selected: bottomMode === 'total' }"
          @click="setBottomMode('total')"
        >
          <span class="label">Total Kostnad</span>
          <span class="value">{{ formatCurrency(values.total) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

// --- GEMENSAM DATA (Endast siffran delas) ---
const bruttolon = ref(30000)

// --- TILLSTÅND (Helt separerade) ---
const topMode = ref('brutto') // Styr ENDAST den övre "Tumregel"-boxen
const bottomMode = ref('total') // Styr ENDAST den nedre kalkylatorn

// --- KONSTANTER ---
const RATES = {
  skatt: 0.3,
  ag: 0.31,
  nettoFactor: 0.7, // 1 - 0.30
  totalFactor: 1.31, // 1 + 0.31
}

// --- LOGIK 1: ÖVRE BOXEN (Tumregel) ---
const topEquation = computed(() => {
  const b = bruttolon.value || 0
  const n = b * RATES.nettoFactor

  const fMoney = (v) => new Intl.NumberFormat('sv-SE').format(Math.round(v))
  const fPerc = '0,70' // (1 - 0,30)

  // 1. Visa Nettolön formeln (Multiplikation)
  if (topMode.value === 'netto') {
    return {
      type: 'multiplication',
      left: { label: 'Nettolön', value: fMoney(n) },
      term1: { key: 'brutto', label: 'Bruttolön', value: fMoney(b) },
      term2: { key: 'factor', label: '(1 - Skatt)', value: fPerc },
    }
  }

  // 2. Visa Faktor formeln (Division)
  if (topMode.value === 'factor') {
    return {
      type: 'division',
      left: { label: '(1 - Skatt)', value: fPerc },
      numerator: { key: 'netto', label: 'Nettolön', value: fMoney(n) },
      denominator: { key: 'brutto', label: 'Bruttolön', value: fMoney(b) },
    }
  }

  // 3. Default: Visa Bruttolön formeln (Division)
  return {
    type: 'division',
    left: { label: 'Bruttolön', value: fMoney(b) },
    numerator: { key: 'netto', label: 'Nettolön', value: fMoney(n) },
    denominator: { key: 'factor', label: '(1 - Skatt)', value: fPerc },
  }
})

const setTopMode = (key) => {
  topMode.value = key
}

// --- LOGIK 2: NEDRE BOXEN (Huvudkalkylator) ---
const bottomEquation = computed(() => {
  const mode = bottomMode.value

  if (mode === 'skatt') {
    return {
      left: { label: 'Skatt', desc: 'Preliminärskatt' },
      right: { key: 'brutto', label: 'Bruttolön' },
      operator: '×',
      factor: '0,30',
      factorDesc: '30% Skatt',
      explanation: 'Skatten är 30% av bruttolönen.',
    }
  }
  if (mode === 'ag') {
    return {
      left: { label: 'Ag-avgift', desc: 'Sociala avgifter' },
      right: { key: 'brutto', label: 'Bruttolön' },
      operator: '×',
      factor: '0,31',
      factorDesc: '31% Avgift',
      explanation: 'Arbetsgivaravgiften är 31% av bruttolönen.',
    }
  }
  if (mode === 'netto') {
    return {
      left: { label: 'Nettolön', desc: 'I plånboken' },
      right: { key: 'brutto', label: 'Bruttolön' },
      operator: '×',
      factor: '0,70',
      factorDesc: 'Faktor (1 - 0,30)',
      explanation: 'Nettolönen är 70% av bruttolönen.',
    }
  }
  if (mode === 'brutto') {
    return {
      left: { label: 'Bruttolön', desc: 'Kontraktslön' },
      right: { key: 'total', label: 'Total Kostnad' },
      operator: '/',
      factor: '1,31',
      factorDesc: 'Påslaget',
      explanation: 'Dividera totalen med 1,31 för att få bruttolönen.',
    }
  }

  // Default: Total
  return {
    left: { label: 'Total Kostnad', desc: 'Företaget betalar' },
    right: { key: 'brutto', label: 'Bruttolön' },
    operator: '×',
    factor: '1,31',
    factorDesc: 'Påslag (1 + 0,31)',
    explanation: 'Total kostnad = Brutto + 31%.',
  }
})

const setBottomMode = (key) => {
  bottomMode.value = key
}

// --- VÄRDEN (Räknas alltid ut baserat på input) ---
const values = computed(() => {
  const b = bruttolon.value || 0
  return {
    brutto: b,
    netto: b * RATES.nettoFactor,
    skatt: b * RATES.skatt,
    ag: b * RATES.ag,
    total: b * RATES.totalFactor,
  }
})

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

.divider {
  border: 0;
  border-top: 2px dashed #e2e8f0;
  margin: 40px 0;
}

/* --- KORT GENERIELLT --- */
.formula-card {
  position: relative;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 30px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
  margin-bottom: 30px;
  text-align: center;
}

.tag {
  position: absolute;
  top: 12px;
  right: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  padding: 4px 8px;
  border-radius: 4px;
}

/* Specifik styling för övre boxen */
.tumregel {
  border-color: #cbd5e1;
  background: #fafafa;
}
.tumregel .tag {
  background: #e2e8f0;
  color: #475569;
}

/* Specifik styling för nedre boxen */
.interactive {
  border-color: #bfdbfe;
}
.interactive .tag {
  background: #dbeafe;
  color: #1e40af;
}

/* --- MATEMATIK LAYOUT (Övre boxen) --- */
.static-math {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 15px;
  font-size: 1.2rem;
  margin-top: 20px;
}

.operator,
.math-operator {
  font-size: 2rem;
  color: #94a3b8;
  font-weight: 300;
  margin: 0 10px;
}

.term-col {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.math-value-small {
  font-size: 0.85rem;
  color: #64748b;
  font-family: monospace;
}

.math-btn {
  background: white;
  border: 2px solid #cbd5e1;
  padding: 8px 16px;
  border-radius: 8px;
  font-weight: 700;
  color: #475569;
  font-size: 1.1rem;
  min-width: 110px;
  cursor: default;
}

.math-btn.clickable {
  cursor: pointer;
  border-style: dashed;
}
.math-btn.clickable:hover {
  background: #fffbeb;
  border-color: #f59e0b;
  color: #b45309;
}
.math-btn.active {
  background: #f1f5f9;
  border-color: #475569;
  color: #0f172a;
  border-style: solid;
}

/* BRÅK */
.fraction {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  margin: 0 10px;
}
.numerator {
  border-bottom: 2px solid #334155;
  padding-bottom: 8px;
  margin-bottom: 8px;
  width: 100%;
}

/* LINJÄR */
.linear-math {
  display: flex;
  align-items: center;
}

/* --- INTERAKTIV (Nedre boxen) --- */
.equation-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 15px;
  flex-wrap: wrap;
  margin-bottom: 20px;
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

/* --- INPUT & GRID --- */
.calculator-section {
  background: #f8fafc;
  padding: 30px;
  border-radius: 12px;
  border: 1px solid #f1f5f9;
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
}
.res-card.selected {
  border-color: #3b82f6;
  background: #eff6ff;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
}
.res-card.highlight {
  background: #f0f9ff;
}
.res-card.total {
  border-bottom: 4px solid #3b82f6;
}

.res-card .label {
  font-size: 0.85rem;
  text-transform: uppercase;
  color: #64748b;
  margin-bottom: 8px;
}
.res-card .value {
  font-size: 1.4rem;
  font-weight: 700;
  color: #0f172a;
}
</style>
