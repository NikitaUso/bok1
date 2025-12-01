<script setup>
import { ref, computed, onMounted } from 'vue'

// --- KONTOPLAN ---
const accountList = [
  { code: '1910', name: 'Kassa', type: 'tillgång' },
  { code: '1930', name: 'Företagskonto', type: 'tillgång' },
  { code: '2710', name: 'Personalskatt', type: 'skuld' },
  { code: '2730', name: 'Lagstadgade soc. avgifter', type: 'skuld' },
  { code: '7010', name: 'Löner', type: 'kostnad' },
  { code: '7510', name: 'Arbetsgivaravgifter', type: 'kostnad' },
]

// --- TILLSTÅND ---
const exercises = ref([])
const currentIndex = ref(0)
const userAccounts = ref([]) // Användarens T-konton
const selectedAccountCode = ref('')
const status = ref('unanswered') // 'unanswered', 'correct', 'wrong'
const feedbackMessage = ref('')

// Historik för att spara svar när man bläddrar
const history = ref({})

// --- GENERERA 10 UPPGIFTER ---
function generateExercises() {
  const newExercises = []

  const allCompanies = [
    'Gröna Fingrar AB',
    'Byggare Bob AB',
    'TechSolutions AB',
    'Café Hörnet AB',
    'Åkeri Andersson AB',
    'Svensk Trädvård AB',
    'Norrlandsel AB',
    'Västkustfisk AB',
    'Citykonsulterna AB',
    'Måleri & Färg AB',
    'Bageri Bullen AB',
    'IT-Supporten AB',
    'Städproffsen AB',
    'Logistikexperten AB',
    'Mediahuset AB',
  ]

  const shuffledCompanies = allCompanies.sort(() => 0.5 - Math.random()).slice(0, 10)
  const months = [
    'januari',
    'februari',
    'mars',
    'april',
    'maj',
    'juni',
    'augusti',
    'september',
    'oktober',
    'november',
    'december',
  ]

  for (let i = 0; i < 10; i++) {
    const company = shuffledCompanies[i]
    const month = months[Math.floor(Math.random() * months.length)]

    const baseNet = (Math.floor(Math.random() * 38) + 18) * 1000
    const taxOptions = [0.29, 0.3, 0.31, 0.32, 0.33, 0.34]
    const taxRate = taxOptions[Math.floor(Math.random() * taxOptions.length)]

    let grossSalary = Math.round(baseNet / (1 - taxRate) / 100) * 100
    const personalTax = Math.round(grossSalary * taxRate)
    const exactNet = grossSalary - personalTax
    const socRate = 0.31
    const socFees = Math.round(grossSalary * socRate)

    const text = `${company} ska betala ut lön för ${month}.
            Bruttolönen uppgår till ${grossSalary.toLocaleString('sv-SE')} kr.
                  Preliminärskatten är ${Math.round(taxRate * 100)}%.
                  Arbetsgivaravgifterna beräknas till 31%.
                  Bokför löneutbetalningen (via 1930) och kostnaderna.`

    const solution = [
      { code: '7010', side: 'debet', amount: grossSalary },
      { code: '2710', side: 'kredit', amount: personalTax },
      { code: '1930', side: 'kredit', amount: exactNet },
      { code: '7510', side: 'debet', amount: socFees },
      { code: '2730', side: 'kredit', amount: socFees },
    ]

    newExercises.push({
      id: i + 1,
      title: `${company} - ${month.charAt(0).toUpperCase() + month.slice(1)}`,
      text,
      solution,
    })
  }

  exercises.value = newExercises
  currentIndex.value = 0
  history.value = {} // Rensa historik vid ny generering
  loadState()
}

onMounted(generateExercises)

// --- LOGIK ---
const currentExercise = computed(() => exercises.value[currentIndex.value] || {})

const totalDebit = computed(() =>
  userAccounts.value.reduce((sum, acc) => sum + Number(acc.debit || 0), 0),
)
const totalCredit = computed(() =>
  userAccounts.value.reduce((sum, acc) => sum + Number(acc.credit || 0), 0),
)

function saveState() {
  // Spara nuvarande T-konton till historiken för detta index
  history.value[currentIndex.value] = {
    accounts: JSON.parse(JSON.stringify(userAccounts.value)),
    status: status.value,
    message: feedbackMessage.value,
  }
}

function loadState() {
  // Nollställ först
  userAccounts.value = []
  selectedAccountCode.value = ''
  status.value = 'unanswered'
  feedbackMessage.value = ''

  // Om vi har sparat data för denna fråga, ladda in den
  if (history.value[currentIndex.value]) {
    const saved = history.value[currentIndex.value]
    userAccounts.value = saved.accounts
    status.value = saved.status
    feedbackMessage.value = saved.message
  }
}

function addAccount() {
  if (!selectedAccountCode.value) return
  const exists = userAccounts.value.find((acc) => acc.code === selectedAccountCode.value)
  if (exists) {
    alert('Detta konto är redan tillagt!')
    return
  }
  const accountInfo = accountList.find((a) => a.code === selectedAccountCode.value)
  userAccounts.value.push({
    code: accountInfo.code,
    name: accountInfo.name,
    debit: '',
    credit: '',
  })
  selectedAccountCode.value = ''
  feedbackMessage.value = ''
}

function removeAccount(code) {
  userAccounts.value = userAccounts.value.filter((a) => a.code !== code)
}

function checkAnswer() {
  if (!currentExercise.value) return

  if (totalDebit.value !== totalCredit.value) {
    status.value = 'error'
    feedbackMessage.value = `Det balanserar inte! Debet: ${totalDebit.value} kr, Kredit: ${totalCredit.value} kr. Diff: ${totalDebit.value - totalCredit.value} kr.`
    return
  }
  if (totalDebit.value === 0) {
    status.value = 'error'
    feedbackMessage.value = 'Inga belopp ifyllda.'
    return
  }

  const solution = currentExercise.value.solution
  let allCorrect = true

  solution.forEach((solRow) => {
    const userRow = userAccounts.value.find((u) => u.code === solRow.code)
    if (!userRow) {
      allCorrect = false
      return
    }
    const userDebit = Number(userRow.debit || 0)
    const userCredit = Number(userRow.credit || 0)

    if (solRow.side === 'debet') {
      if (userDebit !== solRow.amount || userCredit !== 0) allCorrect = false
    } else {
      if (userCredit !== solRow.amount || userDebit !== 0) allCorrect = false
    }
  })

  const activeUserAccounts = userAccounts.value.filter((u) => u.debit > 0 || u.credit > 0)
  if (activeUserAccounts.length !== solution.length) {
    allCorrect = false
  }

  if (allCorrect) {
    status.value = 'correct'
    feedbackMessage.value = 'Helt rätt konterat! Snyggt! 🎉'
  } else {
    status.value = 'error'
    feedbackMessage.value = 'Något stämmer inte. Kontrollera konton och belopp.'
  }
}

function nextExercise() {
  saveState() // Spara innan vi byter
  if (currentIndex.value < exercises.value.length - 1) {
    currentIndex.value++
    loadState() // Ladda nästa (om vi varit där förut)
  } else {
    feedbackMessage.value = 'Bra jobbat! Du har klarat alla uppgifter.'
  }
}

function prevExercise() {
  saveState() // Spara innan vi byter
  if (currentIndex.value > 0) {
    currentIndex.value--
    loadState() // Ladda föregående
  }
}

function skipExercise() {
  nextExercise()
}
</script>

<template>
  <div class="exercise-view">
    <!-- HEADER & SCENARIO -->
    <div class="scenario-card" v-if="currentExercise.id">
      <div class="header-row">
        <h2>Uppgift {{ currentIndex + 1 }} / 10: {{ currentExercise.title }}</h2>
        <button @click="generateExercises" class="reload-btn" v-if="false">🔄 Slumpa nya</button>
      </div>
      <p class="scenario-text">{{ currentExercise.text }}</p>
    </div>

    <!-- WORKSPACE (T-KONTON) -->
    <div class="workspace">
      <!-- LÄGG TILL KONTO -->
      <div class="add-bar">
        <select v-model="selectedAccountCode">
          <option disabled value="">-- Välj konto --</option>
          <option v-for="acc in accountList" :key="acc.code" :value="acc.code">
            {{ acc.code }} {{ acc.name }}
          </option>
        </select>
        <button @click="addAccount" class="add-btn" :disabled="!selectedAccountCode">➕</button>
      </div>

      <!-- GRID MED T-KONTON -->
      <div class="t-accounts-grid">
        <div v-for="acc in userAccounts" :key="acc.code" class="t-account">
          <div class="t-header">
            <span>{{ acc.code }} {{ acc.name }}</span>
            <button class="remove-btn" @click="removeAccount(acc.code)">✕</button>
          </div>

          <div class="t-body">
            <!-- Debet -->
            <div class="side debet">
              <label>Debet</label>
              <input type="number" v-model="acc.debit" placeholder="0" />
            </div>
            <!-- Streck -->
            <div class="divider"></div>
            <!-- Kredit -->
            <div class="side kredit">
              <label>Kredit</label>
              <input type="number" v-model="acc.credit" placeholder="0" />
            </div>
          </div>
        </div>

        <div v-if="userAccounts.length === 0" class="empty-hint">
          Lägg till konton (t.ex. 7010 Löner) för att börja kontera.
        </div>
      </div>

      <!-- SUMMERING -->
      <div class="totals-row" v-if="userAccounts.length">
        <span>Debet: {{ totalDebit.toLocaleString('sv-SE') }}</span>
        <span class="separator">|</span>
        <span>Kredit: {{ totalCredit.toLocaleString('sv-SE') }}</span>
      </div>

      <!-- KNAPPAR & FEEDBACK -->
      <div class="action-area">
        <div class="buttons-row">
          <!-- NY KNAPP: Föregående -->
          <button v-if="currentIndex > 0" @click="prevExercise" class="btn btn-secondary">
            ⬅️ Föregående
          </button>

          <button v-if="status !== 'correct'" @click="checkAnswer" class="btn btn-check">
            Rätta
          </button>
          <button v-if="status !== 'correct'" @click="skipExercise" class="btn btn-skip">
            Hoppa över
          </button>
        </div>

        <div v-if="feedbackMessage" :class="['feedback', status]">
          <p>{{ feedbackMessage }}</p>
          <button v-if="status === 'correct'" @click="nextExercise" class="next-btn">
            Nästa uppgift ➡️
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.exercise-view {
  padding: 20px;
  max-width: 900px;
  margin: 0 auto;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: #333;
}

/* SCENARIO */
.scenario-card {
  background: white;
  padding: 25px;
  border-radius: 16px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.06);
  margin-bottom: 30px;
  border-left: 6px solid #3498db;
}

.header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  padding-bottom: 15px;
  border-bottom: 1px solid #eee;
}

.header-row h2 {
  margin: 0;
  color: #2c3e50;
  font-size: 1.4rem;
}

.reload-btn {
  background: #f0f0f0;
  border: 1px solid #ccc;
  padding: 5px 10px;
  border-radius: 5px;
  cursor: pointer;
}

.scenario-text {
  font-size: 1.15rem;
  line-height: 1.6;
}

/* WORKSPACE */
.add-bar {
  display: flex;
  gap: 10px;
  margin-bottom: 25px;
}
select {
  flex: 1;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid #ddd;
  font-size: 1rem;
}
.add-btn {
  width: 50px;
  background: #2ecc71;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1.2rem;
  cursor: pointer;
}
.add-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.t-accounts-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
  min-height: 150px;
  margin-bottom: 20px;
}

.empty-hint {
  color: #bdc3c7;
  font-style: italic;
  margin-top: 40px;
  text-align: center;
  width: 100%;
}

/* T-KONTO STIL */
.t-account {
  background: #fff;
  width: 260px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  border: 1px solid #ecf0f1;
}
.t-header {
  background: #34495e;
  color: #fff;
  padding: 8px 12px;
  display: flex;
  justify-content: space-between;
  font-weight: 600;
  font-size: 0.95rem;
}
.remove-btn {
  background: none;
  border: none;
  color: #e74c3c;
  cursor: pointer;
  font-weight: bold;
}

.t-body {
  display: flex;
  padding: 10px;
  position: relative;
  align-items: center;
}
.side {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.side label {
  font-size: 0.7rem;
  text-transform: uppercase;
  color: #95a5a6;
  margin-bottom: 4px;
  text-align: center;
}
.side input {
  width: 100%;
  text-align: right;
  padding: 6px;
  border: 1px solid #bdc3c7;
  border-radius: 4px;
  font-weight: bold;
}
.divider {
  width: 1px;
  background: #34495e;
  align-self: stretch;
  margin: 0 8px;
}

/* TOTALS */
.totals-row {
  text-align: center;
  font-weight: bold;
  font-size: 1.1rem;
  color: #2c3e50;
  margin-bottom: 25px;
  background: #f8f9fa;
  padding: 10px 20px;
  border-radius: 8px;
  display: inline-block;
  margin-left: 50%;
  transform: translateX(-50%);
}
.separator {
  margin: 0 15px;
  color: #ccc;
}

/* ACTION AREA */
.action-area {
  text-align: center;
}
.buttons-row {
  display: flex;
  gap: 15px;
  justify-content: center;
  margin-bottom: 20px;
}

.btn {
  padding: 12px 30px;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: transform 0.1s;
}
.btn:active {
  transform: scale(0.98);
}
.btn-check {
  background: #3498db;
  color: white;
}
.btn-skip {
  background: #ecf0f1;
  color: #7f8c8d;
}
.btn-secondary {
  background: #95a5a6;
  color: white;
}

.feedback {
  margin-top: 20px;
  padding: 20px;
  border-radius: 12px;
  animation: popIn 0.3s ease;
}
.feedback.correct {
  background: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}
.feedback.error {
  background: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

.next-btn {
  margin-top: 10px;
  padding: 10px 25px;
  background: #155724;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
  font-size: 1rem;
}

@keyframes popIn {
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
