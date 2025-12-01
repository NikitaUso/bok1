<script setup>
import { ref, computed, onMounted } from 'vue'

// --- TILLSTÅND ---
const exercises = ref([])
const currentIndex = ref(0)
const userAnswer = ref('')
const status = ref('unanswered') // 'unanswered', 'correct', 'wrong'
const showSolution = ref(false)

// --- GENERERA 10 UPPGIFTER ---
function generateExercises() {
  const newExercises = []
  const companies = [
    'Skriva AB',
    'Lagerkungen AB',
    'Grossisten AB',
    'Tekniklagret AB',
    'Byggmaxen AB',
    'Metall & Skrot AB',
  ]

  for (let i = 0; i < 10; i++) {
    const company = companies[Math.floor(Math.random() * companies.length)]
    const year = 2024

    // 1. Ingående lager (1/1)
    // Kvantitet: 2000-7000 st, Pris: 50-150 kr
    const ibQty = (Math.floor(Math.random() * 50) + 20) * 100
    const ibPrice = Math.floor(Math.random() * 100) + 50
    const ibValue = ibQty * ibPrice

    // 2. Inköp 1 (Vår)
    const buy1Qty = (Math.floor(Math.random() * 40) + 20) * 100
    const buy1Price = ibPrice + Math.floor(Math.random() * 20) - 10 // Prisvariation
    const buy1Value = buy1Qty * buy1Price
    const buy1Date = '15 april'

    // 3. Inköp 2 (Höst)
    const buy2Qty = (Math.floor(Math.random() * 40) + 20) * 100
    const buy2Price = buy1Price + Math.floor(Math.random() * 20) - 5
    const buy2Value = buy2Qty * buy2Price
    const buy2Date = '19 oktober'

    // Totalt tillgängligt för försäljning (Kostnad)
    const totalQty = ibQty + buy1Qty + buy2Qty
    const totalAcqValue = ibValue + buy1Value + buy2Value

    // 4. Utgående lager (31/12) - Kvantitet
    // Vi antar att ca 20-40% av varorna finns kvar
    const ubQty = Math.round((totalQty * (0.2 + Math.random() * 0.2)) / 100) * 100

    // 5. Nettoförsäljningsvärde 31/12 (Marknadsvärde)
    // Slumpa så att det ibland är lägre än anskaffningspriset (LVP-nedskrivning krävs)
    // och ibland högre (ingen nedskrivning).
    const netSalesPrice = buy2Price + Math.floor(Math.random() * 30) - 15

    // --- LÖSNING (FACIT) ---

    // Steg A: Värdera UB enligt FIFU och LVP
    // FIFU: De varor som finns kvar i lagret är de som köptes SIST.
    // Vi "plockar" varor bakifrån (från Inköp 2, sen Inköp 1, sen IB) tills vi fyllt ubQty.

    let remainingToFill = ubQty
    let ubValue = 0
    const ubBreakdown = [] // För förklaringen

    // 1. Kolla Inköp 2 (Nyast)
    if (remainingToFill > 0) {
      const takeFrom2 = Math.min(remainingToFill, buy2Qty)
      // LVP: Välj lägsta av anskaffningspris och nettoförsäljningsvärde
      const valPrice = Math.min(buy2Price, netSalesPrice)
      const isWriteDown = valPrice < buy2Price

      ubValue += takeFrom2 * valPrice

      ubBreakdown.push({
        source: `Inköp ${buy2Date}`,
        qty: takeFrom2,
        acq: buy2Price,
        net: netSalesPrice,
        used: valPrice,
        sum: takeFrom2 * valPrice,
        note: isWriteDown ? 'Nedskrivning (LVP)' : 'Anskaffningsvärde',
      })
      remainingToFill -= takeFrom2
    }

    // 2. Kolla Inköp 1
    if (remainingToFill > 0) {
      const takeFrom1 = Math.min(remainingToFill, buy1Qty)
      const valPrice = Math.min(buy1Price, netSalesPrice)
      const isWriteDown = valPrice < buy1Price

      ubValue += takeFrom1 * valPrice

      ubBreakdown.push({
        source: `Inköp ${buy1Date}`,
        qty: takeFrom1,
        acq: buy1Price,
        net: netSalesPrice,
        used: valPrice,
        sum: takeFrom1 * valPrice,
        note: isWriteDown ? 'Nedskrivning (LVP)' : 'Anskaffningsvärde',
      })
      remainingToFill -= takeFrom1
    }

    // 3. Kolla IB (Om vi har extremt mycket lager kvar)
    if (remainingToFill > 0) {
      const takeFromIB = Math.min(remainingToFill, ibQty)
      const valPrice = Math.min(ibPrice, netSalesPrice)
      const isWriteDown = valPrice < ibPrice

      ubValue += takeFromIB * valPrice

      ubBreakdown.push({
        source: `Lager 1/1`,
        qty: takeFromIB,
        acq: ibPrice,
        net: netSalesPrice,
        used: valPrice,
        sum: takeFromIB * valPrice,
        note: isWriteDown ? 'Nedskrivning (LVP)' : 'Anskaffningsvärde',
      })
      remainingToFill -= takeFromIB
    }

    // Steg B: Beräkna KSV
    // KSV = (Kostnad för alla tillgängliga varor) - (Värdet på det som är kvar)
    const ksvRaw = totalAcqValue - ubValue

    // Svaret ska vara i tkr, heltal (avrundat)
    const correctAnswer = Math.round(ksvRaw / 1000)

    newExercises.push({
      id: i + 1,
      company,
      year,
      data: {
        ib: { qty: ibQty, price: ibPrice, total: ibValue },
        buy1: { date: buy1Date, qty: buy1Qty, price: buy1Price, total: buy1Value },
        buy2: { date: buy2Date, qty: buy2Qty, price: buy2Price, total: buy2Value },
        ubQty,
        netSalesPrice,
      },
      solution: {
        totalAcqValue,
        ubValue,
        ubBreakdown,
        ksvRaw,
        correctAnswer,
      },
    })
  }

  exercises.value = newExercises
  currentIndex.value = 0
  resetInput()
}

onMounted(generateExercises)

// --- LOGIK ---
const currentExercise = computed(() => exercises.value[currentIndex.value] || {})

function resetInput() {
  userAnswer.value = ''
  status.value = 'unanswered'
  showSolution.value = false
}

function checkAnswer() {
  if (!userAnswer.value) return

  const userInt = parseInt(userAnswer.value.replace(/\s/g, ''))
  const correct = currentExercise.value.solution.correctAnswer

  // Tillåt +/- 1 tkr felmarginal
  if (Math.abs(userInt - correct) <= 1) {
    status.value = 'correct'
    showSolution.value = true // Visa lösning direkt vid rätt svar
  } else {
    status.value = 'wrong'
    showSolution.value = false // Dölj lösning vid fel svar
  }
}

function nextExercise() {
  if (currentIndex.value < exercises.value.length - 1) {
    currentIndex.value++
    resetInput()
  }
}

function prevExercise() {
  if (currentIndex.value > 0) {
    currentIndex.value--
    resetInput()
  }
}
</script>

<template>
  <div class="wrapper">
    <h1>Övning: KSV, FIFU & LVP</h1>

    <div class="card" v-if="currentExercise.id">
      <div class="header-row">
        <span class="badge">Uppgift {{ currentIndex + 1 }} / 10</span>
      </div>

      <!-- SCENARIO -->
      <div class="scenario-box">
        <p>
          <strong>{{ currentExercise.company }}</strong> har följande uppgifter om sitt lager vid
          bokslutet för år {{ currentExercise.year }}.
        </p>

        <div class="table-wrapper">
          <table>
            <tr>
              <td>Lager den 1/1</td>
              <td>{{ currentExercise.data.ib.qty }} st</td>
              <td>à {{ currentExercise.data.ib.price }} kr/st</td>
              <td class="sum">
                = {{ (currentExercise.data.ib.total / 1000).toLocaleString() }} tkr
              </td>
            </tr>
            <tr>
              <td>Inköp {{ currentExercise.data.buy1.date }}</td>
              <td>{{ currentExercise.data.buy1.qty }} st</td>
              <td>à {{ currentExercise.data.buy1.price }} kr/st</td>
              <td class="sum">
                = {{ (currentExercise.data.buy1.total / 1000).toLocaleString() }} tkr
              </td>
            </tr>
            <tr>
              <td>Inköp {{ currentExercise.data.buy2.date }}</td>
              <td>{{ currentExercise.data.buy2.qty }} st</td>
              <td>à {{ currentExercise.data.buy2.price }} kr/st</td>
              <td class="sum">
                = {{ (currentExercise.data.buy2.total / 1000).toLocaleString() }} tkr
              </td>
            </tr>
            <tr class="ub-row">
              <td><strong>Lager den 31/12</strong></td>
              <td>
                <strong>{{ currentExercise.data.ubQty }} st</strong>
              </td>
              <td></td>
              <td class="sum"><strong>?</strong></td>
            </tr>
          </table>
        </div>

        <div class="info-text">
          <p>
            Nettoförsäljningsvärdet per styck den 31/12 uppgick till
            <strong>{{ currentExercise.data.netSalesPrice }} kr/st</strong>.
          </p>
          <p>
            Vid lagervärdering tillämpar företaget <em>lägsta värdets princip (LVP)</em> och
            flödesantagandet <em>FIFU</em> (först in, först ut).
          </p>
        </div>

        <p class="question">
          Ange storleken för <strong>kostnad sålda varor (KSV)</strong> under perioden. <br /><small
            >(Svara i tkr, heltal. Bortse från eventuella schablonmässiga inkuransavdrag).</small
          >
        </p>
      </div>

      <!-- INPUT -->
      <div class="input-section">
        <div class="input-row">
          <input
            type="text"
            v-model="userAnswer"
            placeholder="Svar..."
            :disabled="status === 'correct'"
            @keyup.enter="checkAnswer"
          />
          <span class="unit">tkr</span>
          <button v-if="status !== 'correct'" @click="checkAnswer" class="btn check-btn">
            Rätta
          </button>
        </div>

        <div v-if="status !== 'unanswered'" class="feedback-area">
          <div :class="['msg', status]">
            {{ status === 'correct' ? 'Rätt svar! 🎉' : 'Fel svar. Försök igen!' }}
          </div>

          <button
            v-if="status === 'wrong' && !showSolution"
            @click="showSolution = true"
            class="btn show-btn"
          >
            Visa lösning
          </button>
        </div>
      </div>

      <!-- FACIT -->
      <div v-if="showSolution" class="solution-card">
        <h3>💡 Lösningsgång</h3>

        <div class="step">
          <strong>1. Beräkna totalt värde av tillgängliga varor (IB + Inköp)</strong>
          <p>
            {{ (currentExercise.data.ib.total / 1000).toLocaleString() }} +
            {{ (currentExercise.data.buy1.total / 1000).toLocaleString() }} +
            {{ (currentExercise.data.buy2.total / 1000).toLocaleString() }}
            =
            <strong
              >{{ (currentExercise.solution.totalAcqValue / 1000).toLocaleString() }} tkr</strong
            >
          </p>
        </div>

        <div class="step">
          <strong>2. Värdera Utgående Lager (UB) - {{ currentExercise.data.ubQty }} st</strong>
          <p>
            Enligt FIFU består lagret av de <em>senast köpta</em> varorna. Enligt LVP väljer vi det
            lägsta av anskaffningsvärde och nettoförsäljningsvärde ({{
              currentExercise.data.netSalesPrice
            }}
            kr).
          </p>

          <ul class="breakdown-list">
            <li v-for="(batch, idx) in currentExercise.solution.ubBreakdown" :key="idx">
              <span class="batch-source">{{ batch.source }}:</span>
              {{ batch.qty }} st × min({{ batch.acq }}, {{ batch.net }}) = {{ batch.qty }} ×
              <strong>{{ batch.used }}</strong> kr =
              <span>{{ Math.round(batch.sum).toLocaleString() }} kr</span>
              <span class="note">({{ batch.note }})</span>
            </li>
          </ul>
          <p class="sub-total">
            Totalt UB-värde:
            <strong>{{ Math.round(currentExercise.solution.ubValue).toLocaleString() }} kr</strong>
            (ca {{ Math.round(currentExercise.solution.ubValue / 1000).toLocaleString() }} tkr)
          </p>
        </div>

        <div class="step final">
          <strong>3. Beräkna KSV</strong>
          <p>KSV = (Totala varukostnader) - (Värdet på UB)</p>
          <p class="math-calc">
            {{ (currentExercise.solution.totalAcqValue / 1000).toLocaleString() }} tkr -
            {{
              (currentExercise.solution.ubValue / 1000).toLocaleString(undefined, {
                maximumFractionDigits: 1,
              })
            }}
            tkr =
            <strong>{{ currentExercise.solution.correctAnswer.toLocaleString() }} tkr</strong>
          </p>
        </div>
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
  display: none; /* Dölj slumpaknappen enligt önskemål */
}

.scenario-box {
  margin-bottom: 25px;
}

.table-wrapper {
  background: #f9f9f9;
  padding: 15px;
  border-radius: 8px;
  margin: 15px 0;
  border: 1px solid #eee;
}

table {
  width: 100%;
  border-collapse: collapse;
}
td {
  padding: 5px;
}
.sum {
  text-align: right;
  font-family: monospace;
  font-size: 1.1rem;
}
.ub-row td {
  border-top: 2px solid #ccc;
  padding-top: 10px;
}

.info-text {
  background: #e3f2fd;
  padding: 15px;
  border-radius: 5px;
  border-left: 5px solid #2196f3;
  margin-bottom: 20px;
}

.question {
  font-size: 1.2rem;
  font-weight: bold;
  color: #2c3e50;
}

.input-row {
  display: flex;
  align-items: center;
  gap: 10px;
}
input {
  width: 120px;
  padding: 10px;
  font-size: 1.2rem;
  border: 2px solid #ddd;
  border-radius: 5px;
  text-align: center;
}
input:focus {
  border-color: #3498db;
  outline: none;
}
.unit {
  font-weight: bold;
  font-size: 1.1rem;
}

.btn {
  padding: 10px 25px;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
}
.check-btn {
  background: #2c3e50;
  color: white;
}
.check-btn:hover {
  background: #1a252f;
}

.feedback-area {
  margin-top: 15px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
}
.msg {
  font-weight: bold;
  padding: 10px;
  border-radius: 5px;
  width: 100%;
  text-align: center;
}
.msg.correct {
  background-color: #d4edda;
  color: #155724;
}
.msg.wrong {
  background-color: #f8d7da;
  color: #721c24;
}

.show-btn {
  background: #f39c12;
  color: white;
  padding: 8px 20px;
  font-size: 0.9rem;
  align-self: center;
}
.show-btn:hover {
  background: #e67e22;
}

.solution-card {
  margin-top: 25px;
  background: #fdfdfd;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 20px;
  animation: fadeIn 0.5s;
  border-left: 5px solid #27ae60;
}

.step {
  margin-bottom: 20px;
  border-bottom: 1px dashed #eee;
  padding-bottom: 15px;
}
.step:last-child {
  border-bottom: none;
  margin-bottom: 0;
}

.breakdown-list {
  list-style: none;
  padding: 0;
  margin-top: 10px;
}
.breakdown-list li {
  background: #f1f1f1;
  padding: 8px;
  margin-bottom: 5px;
  border-radius: 4px;
  font-family: monospace;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.batch-source {
  font-weight: bold;
  color: #555;
}
.note {
  font-size: 0.8rem;
  color: #888;
  font-style: italic;
}

.final {
  background: #e8f5e9;
  border: 1px solid #c8e6c9;
  padding: 15px;
  border-radius: 5px;
}
.math-calc {
  font-family: monospace;
  font-size: 1.2rem;
  margin-top: 5px;
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
