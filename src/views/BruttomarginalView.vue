<script setup>
import { reactive, ref, computed, onMounted } from 'vue'

const scenario = reactive({
  company: 'Billing Designs',
  period: '2016-07-01 – 2017-06-30',
  nettoomsattning: 0,
  handelsvaror: 0,
})

const userAnswer = ref('')
const resultText = ref('')
const success = ref(false)
const showSolution = ref(false)

function rand(step, min, max) {
  const steps = Math.floor((max - min) / step)
  return min + Math.floor(Math.random() * (steps + 1)) * step
}

function generateScenario() {
  // Slumpa omsättning 5–20 Mkr med "fina" siffror (avrundat till 10 000)
  const oms = rand(10_000, 5_000_000, 20_000_000)
  // Varuinköp som 30–70% av omsättning, avrundat till 1 000 för jämna tal
  const marginRate = Math.random() * 0.4 + 0.3 // 30–70% varuandel
  const varorRaw = oms * marginRate
  const varor = Math.round(varorRaw / 1_000) * 1_000
  scenario.company = `Företag ${String.fromCharCode(65 + Math.floor(Math.random() * 26))} AB`
  scenario.period = 'Räkenskapsår'
  scenario.nettoomsattning = oms
  scenario.handelsvaror = varor
  userAnswer.value = ''
  resultText.value = ''
  success.value = false
  showSolution.value = false
}

onMounted(generateScenario)

const bruttoresultat = computed(() => scenario.nettoomsattning - scenario.handelsvaror)
const bruttomarginal = computed(() => bruttoresultat.value / scenario.nettoomsattning)
const bruttomarginalPctText = computed(() => `${(bruttomarginal.value * 100).toFixed(1)}%`)

function check() {
  const expected = Number((bruttomarginal.value * 100).toFixed(1))
  const ans = Number(userAnswer.value)
  if (Number.isFinite(ans) && Math.abs(ans - expected) < 0.05) {
    success.value = true
    resultText.value = 'Rätt svar! 🎉'
    showSolution.value = false
  } else {
    success.value = false
    resultText.value = `Fel svar. Försök igen eller visa lösning.`
  }
}
</script>

<template>
  <div class="page">
    <h1>Bruttomarginal / Bruttoresultat</h1>
    <div class="card">
      <p>
        Vid bedömning av ett företags lönsamhet beaktas ofta bruttomarginalen. Beräkna företagets
        bruttomarginal (i %) med en decimal.
      </p>
      <ul>
        <li><strong>Företag:</strong> {{ scenario.company }}</li>
        <li>
          <strong>Nettoomsättning:</strong>
          {{ scenario.nettoomsattning.toLocaleString('sv-SE') }} kr
        </li>
        <li>
          <strong>Handelsvaror:</strong> {{ scenario.handelsvaror.toLocaleString('sv-SE') }} kr
        </li>
      </ul>
      <div class="answer-row">
        <label>Svar (% med en decimal)</label>
        <input type="number" v-model="userAnswer" step="0.1" placeholder="t.ex. 51.8" />
        <button class="btn-primary" @click="check">Rätta</button>
      </div>
      <p class="result">{{ resultText }}</p>
      <div class="actions">
        <button
          v-if="!success && resultText && !showSolution"
          class="btn-secondary"
          @click="showSolution = true"
        >
          Visa lösning
        </button>
        <button v-if="success" class="btn-success" @click="generateScenario">Slumpa ny</button>
      </div>
      <div v-if="showSolution" class="solution">
        <h3>Lösning</h3>
        <p>
          Bruttoresultat = {{ scenario.nettoomsattning.toLocaleString('sv-SE') }} −
          {{ scenario.handelsvaror.toLocaleString('sv-SE') }} =
          {{ bruttoresultat.toLocaleString('sv-SE') }} kr
        </p>
        <p>
          Bruttomarginal = {{ bruttoresultat.toLocaleString('sv-SE') }} /
          {{ scenario.nettoomsattning.toLocaleString('sv-SE') }} = {{ bruttomarginalPctText }}
        </p>
        <button class="btn-secondary" @click="showSolution = false">Dölj</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page {
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
}
.card {
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
}
ul {
  list-style: none;
  padding: 0;
}
ul li {
  margin-bottom: 6px;
}
.answer-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 12px;
}
.answer-row input {
  width: 140px;
  text-align: right;
  padding: 6px 8px;
}
.result {
  font-weight: 600;
  margin-top: 10px;
}
.actions {
  margin-top: 10px;
  display: flex;
  gap: 10px;
}
.solution {
  margin-top: 15px;
  background: #f7f7f7;
  border: 1px solid #e1e1e1;
  border-radius: 6px;
  padding: 12px;
}
.btn-primary {
  background: #3498db;
  color: #fff;
  padding: 8px 16px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
.btn-success {
  background: #27ae60;
  color: #fff;
  padding: 8px 16px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
.btn-secondary {
  background: #555;
  color: #fff;
  padding: 8px 16px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
</style>
