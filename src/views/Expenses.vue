<script setup>
import { ref, computed, onMounted } from 'vue'

// --- TILLSTÅND ---
const exercises = ref([])
const currentIndex = ref(0)
const userAnswers = ref({
  a: '',
  b: '',
  c: '',
  d: '',
  e: '',
  f: '',
})
const status = ref('unanswered') // 'unanswered', 'correct', 'wrong'
const showSolution = ref(false)

// --- GENERERA 10 UPPGIFTER ---
function generateExercises() {
  const newExercises = []

  const scenarios = [
    {
      type: 'försäkring',
      seller: 'TryggHansa AB',
      buyer: 'Företaget AB',
      item: 'företagsförsäkring',
    },
    { type: 'hyra', seller: 'Fastighetsbolaget', buyer: 'Hyresgästen AB', item: 'lokalhyra' },
    {
      type: 'licens',
      seller: 'TechSoft AB',
      buyer: 'IT-Konsulterna AB',
      item: 'programvarulicens',
    },
    { type: 'service', seller: 'ServicePartner AB', buyer: 'Fabriken AB', item: 'serviceavtal' },
    { type: 'leasing', seller: 'Leasingbolaget', buyer: 'Åkeriet AB', item: 'leasing av lastbil' },
  ]

  const months = [
    { name: 'januari', days: 31 },
    { name: 'februari', days: 28 },
    { name: 'mars', days: 31 },
    { name: 'april', days: 30 },
    { name: 'maj', days: 31 },
    { name: 'juni', days: 30 },
    { name: 'juli', days: 31 },
    { name: 'augusti', days: 31 },
    { name: 'september', days: 30 },
    { name: 'oktober', days: 31 },
    { name: 'november', days: 30 },
    { name: 'december', days: 31 },
  ]

  for (let i = 0; i < 10; i++) {
    const scen = scenarios[Math.floor(Math.random() * scenarios.length)]

    // Slumpa belopp (delbart med 12 för enkla siffror)
    const amount = (Math.floor(Math.random() * 20) + 2) * 6000

    // Slumpa fakturadatum (sent på året år 1)
    const invMonthIdx = Math.floor(Math.random() * 3) + 9 // Okt, Nov, Dec
    const invMonth = months[invMonthIdx]
    const invDay = Math.floor(Math.random() * 20) + 1
    const invDateStr = `${invDay} ${invMonth.name} år 1`

    // Slumpa betalningsdatum
    const payDelay = Math.floor(Math.random() * 20) + 10
    let payDayRaw = invDay + payDelay
    let payMonthIdx = invMonthIdx
    let payYear = 1

    if (payDayRaw > invMonth.days) {
      payDayRaw -= invMonth.days
      payMonthIdx++
      if (payMonthIdx > 11) {
        payMonthIdx = 0
        payYear = 2
      }
    }
    const payDateStr = `${payDayRaw} ${months[payMonthIdx] ? months[payMonthIdx].name : 'januari'} år ${payYear}`

    // Period (Alltid 12 månader för enkelhet)
    let startMonthIdx = invMonthIdx + (Math.random() > 0.5 ? 1 : 0)
    let startYear = 1
    if (startMonthIdx > 11) {
      startMonthIdx = 0
      startYear = 2
    }

    let endMonthIdx = startMonthIdx - 1
    let endYear = startYear + 1
    if (endMonthIdx < 0) {
      endMonthIdx = 11
      endYear = startYear
    }

    const pStartStr = `1 ${months[startMonthIdx].name} år ${startYear}`
    const pEndStr = `${months[endMonthIdx].days} ${months[endMonthIdx].name} år ${endYear}`

    const text = `${scen.seller} skickade och bokförde den ${invDateStr} en faktura för en ${scen.item}
                  till ${scen.buyer}. Fakturan avser perioden ${pStartStr} till ${pEndStr} och beloppet är
                  ${amount.toLocaleString('sv-SE')} kr. ${scen.buyer} betalar fakturan den ${payDateStr}.`

    // --- RÄKNA UT FACIT ---

    let monthsInYear1 = 0
    if (startYear === 1) {
      monthsInYear1 = 12 - startMonthIdx
    } else {
      monthsInYear1 = 0
    }

    const periodizedAmount = (amount / 12) * monthsInYear1

    const correct = {
      full: amount,
      periodized: periodizedAmount,
    }

    newExercises.push({
      id: i + 1,
      text,
      amount,
      periodizedAmount,
      monthsInYear1,
      dates: {
        invoice: invDateStr,
        payment: payDateStr,
        period: `${pStartStr} – ${pEndStr}`,
      },
      roles: {
        seller: scen.seller,
        buyer: scen.buyer,
      },
      correct,
    })
  }

  exercises.value = newExercises
  currentIndex.value = 0
  resetInputs()
}

onMounted(generateExercises)

// --- LOGIK ---
const currentExercise = computed(() => exercises.value[currentIndex.value] || {})

function resetInputs() {
  userAnswers.value = { a: '', b: '', c: '', d: '', e: '', f: '' }
  status.value = 'unanswered'
  showSolution.value = false
}

function checkAnswer() {
  const fullAmt = currentExercise.value.correct.full
  const partAmt = currentExercise.value.correct.periodized
  let allCorrect = true

  const parse = (val) => parseInt(val.replace(/\s/g, '')) || 0

  if (parse(userAnswers.value.a) !== fullAmt) allCorrect = false
  if (parse(userAnswers.value.b) !== fullAmt) allCorrect = false
  if (parse(userAnswers.value.c) !== partAmt) allCorrect = false // Intäkt
  if (parse(userAnswers.value.d) !== fullAmt) allCorrect = false
  if (parse(userAnswers.value.e) !== fullAmt) allCorrect = false
  if (parse(userAnswers.value.f) !== partAmt) allCorrect = false // Kostnad

  if (allCorrect) {
    status.value = 'correct'
    showSolution.value = true
  } else {
    status.value = 'wrong'
    showSolution.value = false
  }
}

function nextExercise() {
  if (currentIndex.value < exercises.value.length - 1) {
    currentIndex.value++
    resetInputs()
  }
}

function prevExercise() {
  if (currentIndex.value > 0) {
    currentIndex.value--
    resetInputs()
  }
}
</script>

<template>
  <div class="wrapper">
    <h1>Övning: Inkomst, Utgift & Periodisering</h1>

    <div class="card" v-if="currentExercise.id">
      <div class="header-row">
        <span class="badge">Uppgift {{ currentIndex + 1 }} / 10</span>
        <button @click="generateExercises" class="reload-btn" v-if="false">🔄 Slumpa nya</button>
      </div>

      <!-- SCENARIO -->
      <div class="scenario-box">
        <p>{{ currentExercise.text }}</p>
      </div>

      <div class="questions-grid">
        <p class="instruction">
          Ange beloppen (kr) som gäller för <strong>År 1</strong>. <br /><small
            >(Tips: Intäkt och Kostnad ska periodiseras)</small
          >
        </p>

        <!-- A -->
        <div class="q-item">
          <label>a) Inkomst ({{ currentExercise.roles.seller }})</label>
          <input
            type="text"
            v-model="userAnswers.a"
            placeholder="Belopp..."
            :disabled="status === 'correct'"
          />
        </div>

        <!-- B -->
        <div class="q-item">
          <label>b) Inbetalning ({{ currentExercise.roles.seller }})</label>
          <input
            type="text"
            v-model="userAnswers.b"
            placeholder="Belopp..."
            :disabled="status === 'correct'"
          />
        </div>

        <!-- C -->
        <div class="q-item">
          <label>c) Intäkt År 1 ({{ currentExercise.roles.seller }})</label>
          <input
            type="text"
            v-model="userAnswers.c"
            placeholder="Belopp..."
            :disabled="status === 'correct'"
          />
        </div>

        <!-- D -->
        <div class="q-item">
          <label>d) Utgift ({{ currentExercise.roles.buyer }})</label>
          <input
            type="text"
            v-model="userAnswers.d"
            placeholder="Belopp..."
            :disabled="status === 'correct'"
          />
        </div>

        <!-- E -->
        <div class="q-item">
          <label>e) Utbetalning ({{ currentExercise.roles.buyer }})</label>
          <input
            type="text"
            v-model="userAnswers.e"
            placeholder="Belopp..."
            :disabled="status === 'correct'"
          />
        </div>

        <!-- F -->
        <div class="q-item">
          <label>f) Kostnad År 1 ({{ currentExercise.roles.buyer }})</label>
          <input
            type="text"
            v-model="userAnswers.f"
            placeholder="Belopp..."
            :disabled="status === 'correct'"
          />
        </div>
      </div>

      <!-- KNAPPAR -->
      <div class="action-row">
        <button v-if="status !== 'correct'" @click="checkAnswer" class="check-btn">
          Rätta belopp
        </button>

        <div v-if="status !== 'unanswered'" class="feedback-area">
          <span :class="['msg', status]">
            {{ status === 'correct' ? 'Rätt belopp! 🎉' : 'Fel belopp, försök igen.' }}
          </span>
          <button
            v-if="status === 'wrong' && !showSolution"
            @click="showSolution = true"
            class="show-btn"
          >
            Visa lösning
          </button>
        </div>
      </div>

      <!-- FACIT -->
      <div v-if="showSolution" class="solution-card">
        <h3>💡 Facit & Periodisering</h3>
        <ul>
          <li>
            <strong>a, b, d, e (Kassaflöde/Faktura):</strong>
            {{ currentExercise.amount.toLocaleString('sv-SE') }} kr. <br /><span class="detail"
              >Hela beloppet bokförs som Inkomst/Utgift vid fakturadatumet och
              Inbetalning/Utbetalning vid betalningsdatumet.</span
            >
          </li>
          <li class="calc-item">
            <strong>c, f (Periodiserat för År 1):</strong>
            {{ currentExercise.periodizedAmount.toLocaleString('sv-SE') }} kr.
            <br />
            <div class="calc-box">
              Perioden i År 1 är <strong>{{ currentExercise.monthsInYear1 }} månader</strong>.
              <br />
              Uträkning: ({{ currentExercise.amount.toLocaleString('sv-SE') }} kr / 12 mån) ×
              {{ currentExercise.monthsInYear1 }} mån =
              <strong>{{ currentExercise.periodizedAmount.toLocaleString('sv-SE') }} kr</strong>.
            </div>
          </li>
        </ul>
      </div>

      <!-- NAVIGERING -->
      <div class="nav-row">
        <button @click="prevExercise" :disabled="currentIndex === 0" class="nav-link">
          ← Föregående
        </button>
        <button
          @click="nextExercise"
          :disabled="currentIndex === exercises.length - 1"
          class="nav-link"
        >
          Nästa →
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.wrapper {
  max-width: 800px;
  margin: 0 auto;
  padding: 24px;
  font-family: 'Segoe UI', sans-serif;
  color: #333;
}

h1 {
  text-align: center;
  color: #2c3e50;
  margin-bottom: 20px;
}

.card {
  background: white;
  padding: 25px;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid #f0f2f5;
}

.header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.badge {
  background: #eef2f6;
  color: #666;
  padding: 5px 12px;
  border-radius: 20px;
  font-weight: bold;
}

.reload-btn {
  background: #f0f0f0;
  border: 1px solid #ccc;
  padding: 5px 10px;
  border-radius: 5px;
  cursor: pointer;
}

.scenario-box {
  background: #fff8e1;
  padding: 20px;
  border-left: 5px solid #ffca28;
  border-radius: 5px;
  margin-bottom: 25px;
  font-size: 1.1rem;
  line-height: 1.6;
}

.instruction {
  margin-bottom: 15px;
  color: #555;
  font-size: 0.95rem;
}

.questions-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 25px;
}

@media (max-width: 600px) {
  .questions-grid {
    grid-template-columns: 1fr;
  }
}

.q-item {
  display: flex;
  flex-direction: column;
}
.q-item label {
  font-weight: bold;
  font-size: 0.9rem;
  margin-bottom: 5px;
  color: #2c3e50;
}
.q-item input {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 1rem;
}

.action-row {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
}

.check-btn {
  padding: 12px 40px;
  background: #2c3e50;
  color: white;
  border: none;
  border-radius: 5px;
  font-weight: bold;
  font-size: 1.1rem;
  cursor: pointer;
}
.check-btn:hover {
  background: #1a252f;
}

.feedback-area {
  margin-top: 15px;
  text-align: center;
}
.msg {
  font-weight: bold;
  margin-right: 15px;
  display: block;
  margin-bottom: 10px;
}
.msg.correct {
  color: #27ae60;
}
.msg.wrong {
  color: #c0392b;
}

.show-btn {
  padding: 8px 20px;
  background: #e67e22;
  color: white;
  border: none;
  border-radius: 5px;
  font-weight: bold;
  cursor: pointer;
}
.show-btn:hover {
  background: #d35400;
}

.solution-card {
  margin-top: 20px;
  background: #fdfdfd;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 20px;
  animation: fadeIn 0.5s;
}

.solution-card ul {
  padding-left: 20px;
}
.solution-card li {
  margin-bottom: 15px;
}
.detail {
  color: #666;
  font-size: 0.95rem;
  display: block;
  margin-top: 2px;
}

.calc-item {
  background: #f0fdf4;
  padding: 10px;
  border-radius: 5px;
  list-style: none;
  margin-left: -20px;
}
.calc-box {
  margin-top: 5px;
  font-family: 'Consolas', monospace;
  font-size: 0.95rem;
  color: #333;
}

.nav-row {
  display: flex;
  justify-content: space-between;
  margin-top: 30px;
  border-top: 1px solid #eee;
  padding-top: 15px;
}
.nav-link {
  background: none;
  border: none;
  color: #3498db;
  font-weight: bold;
  cursor: pointer;
  font-size: 1rem;
}
.nav-link:disabled {
  color: #ccc;
  cursor: not-allowed;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
