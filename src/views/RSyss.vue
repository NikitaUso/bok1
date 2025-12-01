<script setup>
import { ref, computed, onMounted } from 'vue'

// --- TILLSTÅND ---
const exercises = ref([])
const currentIndex = ref(0)
const userAnswer = ref('')
const status = ref('unanswered') // 'unanswered', 'correct', 'wrong'
const showSolution = ref(false)

// --- GENERERA UPPGIFTER ---
function generateExercises() {
  const newExercises = []

  for (let i = 0; i < 5; i++) {
    // 1. RESULTATRÄKNING
    const sales = Math.round((Math.random() * 4000 + 4000) / 100) * 100 // 4000 - 8000
    const ksv = Math.round(sales * (0.6 + Math.random() * 0.1)) * -1 // -60% till -70%
    const personnel = Math.round(sales * 0.15) * -1
    const dep = Math.round(sales * 0.05) * -1
    const otherOp = Math.round(sales * 0.05) * -1

    // Rörelseresultat (EBIT)
    const ebit = sales + ksv + personnel + dep + otherOp

    const intIncome = Math.round(Math.random() * 30 + 10) // 10-40
    const intExp = Math.round(Math.random() * 60 + 20) * -1 // -20 till -80

    const resBeforeTax = ebit + intIncome + intExp
    const tax = Math.round(resBeforeTax * 0.22) * -1
    const netResult = resBeforeTax + tax

    // 2. BALANSRÄKNING (Vi bygger baklänges från EK+Skulder)

    // IB (01-jan)
    const ib_equity = Math.round((Math.random() * 500 + 500) / 10) * 10
    const ib_retained = Math.round((Math.random() * 200 + 100) / 10) * 10
    const ib_loan = Math.round((Math.random() * 400 + 200) / 10) * 10 // Räntebärande
    const ib_lev = Math.round((Math.random() * 200 + 100) / 10) * 10 // Räntefri
    const ib_other_liab = Math.round((Math.random() * 150 + 50) / 10) * 10 // Räntefri

    const ib_total = ib_equity + ib_retained + ib_loan + ib_lev + ib_other_liab

    // UB (31-dec) - Låt det växa lite
    const ub_equity = ib_equity + (Math.random() > 0.8 ? 50 : 0) // Ev nyemission
    // Balanserad vinst ökar oftast med årets resultat (förenklat)
    const ub_retained = ib_retained + Math.round(netResult * 0.5)

    const ub_loan = ib_loan + (Math.random() > 0.5 ? 50 : -50)
    const ub_lev = Math.round(ib_lev * (0.9 + Math.random() * 0.2))
    const ub_other_liab = Math.round(ib_other_liab * (0.9 + Math.random() * 0.2))

    const ub_total = ub_equity + ub_retained + ub_loan + ub_lev + ub_other_liab

    // Tillgångar (måste matcha totalt)
    const ib_assets = ib_total
    const ub_assets = ub_total

    // Fördela tillgångar (bara visuellt, påverkar ej R_syss)
    const ub_fixed = Math.round(ub_assets * 0.4)
    const ub_stock = Math.round(ub_assets * 0.2)
    const ub_receiv = Math.round(ub_assets * 0.2)
    const ub_cash = ub_assets - ub_fixed - ub_stock - ub_receiv

    const ib_fixed = Math.round(ib_assets * 0.4)
    const ib_stock = Math.round(ib_assets * 0.2)
    const ib_receiv = Math.round(ib_assets * 0.2)
    const ib_cash = ib_assets - ib_fixed - ib_stock - ib_receiv

    // --- BERÄKNINGAR FÖR FACIT ---

    // 1. Täljare: Rörelseresultat + Finansiella intäkter
    const numerator = ebit + intIncome

    // 2. Nämnare: Genomsnittligt Sysselsatt Kapital
    // Sysselsatt kapital = Totalt eget kapital + Räntebärande skulder
    // (Alternativt: Totala tillgångar - Räntefria skulder)

    // IB Sysselsatt
    const ib_syss = ib_equity + ib_retained + ib_loan

    // UB Sysselsatt
    const ub_syss = ub_equity + ub_retained + ub_loan

    // Genomsnitt
    const avg_syss = (ib_syss + ub_syss) / 2

    // R_syss
    const r_syss = (numerator / avg_syss) * 100

    // Avrunda till 1 decimal
    const correctAnswer = Math.round(r_syss * 10) / 10

    newExercises.push({
      id: i + 1,
      rr: {
        sales,
        ksv,
        personnel,
        dep,
        otherOp,
        ebit,
        intIncome,
        intExp,
        resBeforeTax,
        tax,
        netResult,
      },
      br: {
        ib: {
          fixed: ib_fixed,
          stock: ib_stock,
          receiv: ib_receiv,
          cash: ib_cash,
          total: ib_total,
          equity: ib_equity,
          retained: ib_retained,
          loan: ib_loan,
          lev: ib_lev,
          other: ib_other_liab,
        },
        ub: {
          fixed: ub_fixed,
          stock: ub_stock,
          receiv: ub_receiv,
          cash: ub_cash,
          total: ub_total,
          equity: ub_equity,
          retained: ub_retained,
          loan: ub_loan,
          lev: ub_lev,
          other: ub_other_liab,
        },
      },
      solution: {
        numerator,
        ib_syss,
        ub_syss,
        avg_syss,
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

  // Tillåt kommatecken
  const userFloat = parseFloat(userAnswer.value.replace(',', '.'))
  const correct = currentExercise.value.solution.correctAnswer

  // Tillåt +/- 0.2 procentenheters felmarginal
  if (Math.abs(userFloat - correct) <= 0.2) {
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
    <h1>Räntabilitet på Sysselsatt Kapital</h1>

    <div class="card" v-if="currentExercise.id">
      <div class="header-row">
        <span class="badge">Uppgift {{ currentIndex + 1 }} / 5</span>
        <button @click="generateExercises" class="reload-btn" v-if="false">🔄 Slumpa nya</button>
      </div>

      <div class="data-container">
        <!-- RESULTATRÄKNING -->
        <div class="table-box">
          <h3>Resultaträkning 2024</h3>
          <table>
            <tr>
              <td>Försäljning</td>
              <td class="num">{{ currentExercise.rr.sales }}</td>
            </tr>
            <tr>
              <td>KSV</td>
              <td class="num">{{ currentExercise.rr.ksv }}</td>
            </tr>
            <tr>
              <td>Personalkostnader</td>
              <td class="num">{{ currentExercise.rr.personnel }}</td>
            </tr>
            <tr>
              <td>Avskrivningar</td>
              <td class="num">{{ currentExercise.rr.dep }}</td>
            </tr>
            <tr>
              <td>Övriga rörelsekostnader</td>
              <td class="num">{{ currentExercise.rr.otherOp }}</td>
            </tr>
            <tr class="sum-row">
              <td><strong>Rörelseresultat</strong></td>
              <td class="num">
                <strong>{{ currentExercise.rr.ebit }}</strong>
              </td>
            </tr>
            <tr>
              <td>Ränteintäkter</td>
              <td class="num">{{ currentExercise.rr.intIncome }}</td>
            </tr>
            <tr>
              <td>Räntekostnader</td>
              <td class="num">{{ currentExercise.rr.intExp }}</td>
            </tr>
            <tr class="sum-row">
              <td>Resultat före skatt</td>
              <td class="num">{{ currentExercise.rr.resBeforeTax }}</td>
            </tr>
            <tr>
              <td>Skattekostnad</td>
              <td class="num">{{ currentExercise.rr.tax }}</td>
            </tr>
            <tr class="sum-row double">
              <td>Årets resultat</td>
              <td class="num">{{ currentExercise.rr.netResult }}</td>
            </tr>
          </table>
        </div>

        <!-- BALANSRÄKNING -->
        <div class="table-box">
          <h3>Balansräkning</h3>
          <table>
            <thead>
              <tr>
                <th>Tillgångar</th>
                <th>31-dec</th>
                <th>01-jan</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Anläggningstillgångar</td>
                <td class="num">{{ currentExercise.br.ub.fixed }}</td>
                <td class="num">{{ currentExercise.br.ib.fixed }}</td>
              </tr>
              <tr>
                <td>Varulager</td>
                <td class="num">{{ currentExercise.br.ub.stock }}</td>
                <td class="num">{{ currentExercise.br.ib.stock }}</td>
              </tr>
              <tr>
                <td>Kundfordringar</td>
                <td class="num">{{ currentExercise.br.ub.receiv }}</td>
                <td class="num">{{ currentExercise.br.ib.receiv }}</td>
              </tr>
              <tr>
                <td>Kassa och bank</td>
                <td class="num">{{ currentExercise.br.ub.cash }}</td>
                <td class="num">{{ currentExercise.br.ib.cash }}</td>
              </tr>
              <tr class="sum-row">
                <td><strong>Summa Tillgångar</strong></td>
                <td class="num">
                  <strong>{{ currentExercise.br.ub.total }}</strong>
                </td>
                <td class="num">
                  <strong>{{ currentExercise.br.ib.total }}</strong>
                </td>
              </tr>
            </tbody>

            <thead>
              <tr>
                <th>EK + Skulder</th>
                <th>31-dec</th>
                <th>01-jan</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Aktiekapital</td>
                <td class="num">{{ currentExercise.br.ub.equity }}</td>
                <td class="num">{{ currentExercise.br.ib.equity }}</td>
              </tr>
              <tr>
                <td>Balanserad vinst inkl. årets res.</td>
                <td class="num">{{ currentExercise.br.ub.retained }}</td>
                <td class="num">{{ currentExercise.br.ib.retained }}</td>
              </tr>
              <tr>
                <td>Banklån (Räntebärande)</td>
                <td class="num">{{ currentExercise.br.ub.loan }}</td>
                <td class="num">{{ currentExercise.br.ib.loan }}</td>
              </tr>
              <tr>
                <td>Leverantörsskulder</td>
                <td class="num">{{ currentExercise.br.ub.lev }}</td>
                <td class="num">{{ currentExercise.br.ib.lev }}</td>
              </tr>
              <tr>
                <td>Övriga korta skulder</td>
                <td class="num">{{ currentExercise.br.ub.other }}</td>
                <td class="num">{{ currentExercise.br.ib.other }}</td>
              </tr>
              <tr class="sum-row">
                <td><strong>Summa EK+Skulder</strong></td>
                <td class="num">
                  <strong>{{ currentExercise.br.ub.total }}</strong>
                </td>
                <td class="num">
                  <strong>{{ currentExercise.br.ib.total }}</strong>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="question-section">
        <p class="question-text">
          Beräkna <strong>Räntabilitet på sysselsatt kapital</strong> för år 2024.
        </p>
        <p class="hint">Använd genomsnittligt kapital. Svara i procent med en decimal.</p>

        <div class="input-row">
          <input
            type="text"
            v-model="userAnswer"
            placeholder="T.ex. 12,5"
            :disabled="status === 'correct'"
            @keyup.enter="checkAnswer"
          />
          <span class="unit">%</span>
          <button v-if="status !== 'correct'" @click="checkAnswer" class="check-btn">Rätta</button>
        </div>

        <div v-if="status !== 'unanswered'" class="feedback-area">
          <div :class="['msg', status]">
            {{ status === 'correct' ? 'Rätt svar! 🎉' : 'Fel svar ❌' }}
          </div>
          <button
            v-if="status === 'wrong' && !showSolution"
            @click="showSolution = true"
            class="show-btn"
          >
            Visa lösning
          </button>
        </div>
      </div>

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

    <!-- LÖSNING -->
    <div v-if="showSolution" class="solution-card">
      <h3>💡 Lösningsgång</h3>

      <div class="step">
        <strong>1. Beräkna Täljaren: (Rörelseresultat + Finansiella intäkter)</strong>
        <p>Rörelseresultat = {{ currentExercise.rr.ebit }}</p>
        <p>Finansiella intäkter (Ränteintäkter) = {{ currentExercise.rr.intIncome }}</p>
        <p class="calc">
          {{ currentExercise.rr.ebit }} + {{ currentExercise.rr.intIncome }} =
          <strong>{{ currentExercise.solution.numerator }}</strong>
        </p>
      </div>

      <div class="step">
        <strong>2. Beräkna Sysselsatt Kapital (IB & UB)</strong>
        <p><em>Sysselsatt kapital = Totalt Eget Kapital + Räntebärande skulder</em></p>

        <p><strong>01-jan (IB):</strong></p>
        <p>
          EK ({{ currentExercise.br.ib.equity }} + {{ currentExercise.br.ib.retained }}) + Banklån
          ({{ currentExercise.br.ib.loan }})
        </p>
        <p class="calc">
          = <strong>{{ currentExercise.solution.ib_syss }}</strong>
        </p>

        <p><strong>31-dec (UB):</strong></p>
        <p>
          EK ({{ currentExercise.br.ub.equity }} + {{ currentExercise.br.ub.retained }}) + Banklån
          ({{ currentExercise.br.ub.loan }})
        </p>
        <p class="calc">
          = <strong>{{ currentExercise.solution.ub_syss }}</strong>
        </p>
      </div>

      <div class="step">
        <strong>3. Beräkna Genomsnittligt Sysselsatt Kapital</strong>
        <p>({{ currentExercise.solution.ib_syss }} + {{ currentExercise.solution.ub_syss }}) / 2</p>
        <p class="calc">
          = <strong>{{ currentExercise.solution.avg_syss }}</strong>
        </p>
      </div>

      <div class="step final">
        <strong>4. Beräkna $R_{syss}$</strong>
        <p>
          {{ currentExercise.solution.numerator }} / {{ currentExercise.solution.avg_syss }} =
          {{
            (
              (currentExercise.solution.numerator / currentExercise.solution.avg_syss) *
              100
            ).toFixed(2)
          }}
          %
        </p>
        <p class="answer">
          Svar: <strong>{{ currentExercise.solution.correctAnswer }} %</strong>
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.wrapper {
  max-width: 1000px;
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
  padding: 20px;
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

/* DATA TABELLER */
.data-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 30px;
}

@media (max-width: 768px) {
  .data-container {
    grid-template-columns: 1fr;
  }
}

.table-box {
  background: #f9f9f9;
  padding: 15px;
  border-radius: 8px;
  border: 1px solid #eee;
}

h3 {
  margin-top: 0;
  border-bottom: 2px solid #2c3e50;
  padding-bottom: 5px;
  font-size: 1.1rem;
}

table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;
}
td,
th {
  padding: 4px 8px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}
.num {
  text-align: right;
  font-family: 'Consolas', monospace;
}
.sum-row td {
  border-top: 1px solid #000;
  font-weight: bold;
  background: #eef;
}
.sum-row.double td {
  border-bottom: 3px double #000;
}

/* FRÅGE-DELEN */
.question-section {
  text-align: center;
  background: #fff8e1;
  padding: 20px;
  border-radius: 8px;
  border: 1px solid #ffe0b2;
  margin-bottom: 20px;
}

.question-text {
  font-size: 1.2rem;
  margin-bottom: 5px;
}
.hint {
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 20px;
}

.input-row {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin-bottom: 15px;
}

input {
  padding: 10px;
  font-size: 1.2rem;
  width: 100px;
  text-align: center;
  border: 2px solid #ccc;
  border-radius: 5px;
}
.unit {
  font-weight: bold;
  font-size: 1.2rem;
}

.check-btn {
  padding: 10px 20px;
  background: #2c3e50;
  color: white;
  border: none;
  border-radius: 5px;
  font-weight: bold;
  cursor: pointer;
}
.check-btn:hover {
  background: #1a252f;
}

.feedback-area {
  margin-top: 10px;
}
.msg {
  padding: 10px;
  border-radius: 5px;
  font-weight: bold;
  display: inline-block;
  margin-right: 10px;
}
.msg.correct {
  background: #d4edda;
  color: #155724;
}
.msg.wrong {
  background: #f8d7da;
  color: #721c24;
}

.show-btn {
  padding: 10px 20px;
  background: #f39c12;
  color: white;
  border: none;
  border-radius: 5px;
  font-weight: bold;
  cursor: pointer;
}
.show-btn:hover {
  background: #e67e22;
}

/* NAVIGATION */
.nav-row {
  display: flex;
  justify-content: space-between;
}
.nav-link {
  background: none;
  border: none;
  color: #3498db;
  font-weight: bold;
  cursor: pointer;
}
.nav-link:disabled {
  color: #ccc;
  cursor: not-allowed;
}

/* LÖSNING */
.solution-card {
  margin-top: 20px;
  background: #fdfdfd;
  border-left: 5px solid #27ae60;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  animation: fadeIn 0.5s;
}

.step {
  margin-bottom: 15px;
  border-bottom: 1px dashed #eee;
  padding-bottom: 10px;
}
.step:last-child {
  border-bottom: none;
}
.calc {
  background: #f0f0f0;
  padding: 5px 10px;
  border-radius: 4px;
  display: inline-block;
  margin-top: 5px;
  font-family: 'Consolas', monospace;
}
.answer {
  font-size: 1.2rem;
  color: #27ae60;
  margin-top: 10px;
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
