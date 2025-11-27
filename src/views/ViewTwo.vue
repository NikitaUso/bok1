<script setup>
defineOptions({ name: 'TAccountView' })
import { ref, computed, watch, onMounted } from 'vue'

// --- KONTOPLAN (Oförändrad) ---
const accountList = [
  { code: '1910', name: 'Kassa', type: 'tillgång' },
  { code: '1930', name: 'Företagskonto', type: 'tillgång' },
  { code: '1510', name: 'Kundfordringar', type: 'tillgång' },
  { code: '1220', name: 'Inventarier', type: 'tillgång' },
  { code: '1240', name: 'Bilar', type: 'tillgång' },
  { code: '2081', name: 'Aktiekapital', type: 'ek' },
  { code: '2330', name: 'Checkräkningskredit', type: 'skuld' },
  { code: '2350', name: 'Banklån', type: 'skuld' },
  { code: '2440', name: 'Leverantörsskulder', type: 'skuld' },
  { code: '2610', name: 'Utgående moms', type: 'skuld' },
  { code: '2640', name: 'Ingående moms', type: 'tillgång' },
  { code: '2710', name: 'Personalskatt', type: 'skuld' },
  { code: '2730', name: 'Lagstadgade soc. avgifter', type: 'skuld' },
  { code: '2391', name: 'Förutbetalda intäkter', type: 'skuld' },
  { code: '3001', name: 'Varuförsäljning', type: 'intäkt' },
  { code: '3041', name: 'Försäljning tjänst', type: 'intäkt' },
  { code: '3900', name: 'Övriga intäkter', type: 'intäkt' },
  { code: '8310', name: 'Ränteintäkter', type: 'intäkt' },
  { code: '4010', name: 'Varuinköp', type: 'kostnad' },
  { code: '5010', name: 'Lokalhyra', type: 'kostnad' },
  { code: '5400', name: 'Förbrukningsinventarier', type: 'kostnad' },
  { code: '6211', name: 'Telefonräkning', type: 'kostnad' },
  { code: '6990', name: 'Övriga externa kostnader', type: 'kostnad' },
  { code: '7010', name: 'Löner', type: 'kostnad' },
  { code: '7510', name: 'Arbetsgivaravgifter', type: 'kostnad' },
  { code: '8410', name: 'Räntekostnader', type: 'kostnad' },
  { code: '7810', name: 'Avskrivningar', type: 'kostnad' },
]

const sortedAccountList = computed(() => {
  return accountList.slice().sort((a, b) => Number(a.code) - Number(b.code))
})

// --- SCENARION ---
const scenarioList = [
  {
    id: 'chain-sales-1',
    title: 'Försäljningscykeln',
    steps: [
      {
        stepTitle: 'Del 1: Fakturera kund',
        text: 'Du säljer varor till "Cykelhuset AB" på kredit. Fakturabeloppet är 100 000 kr exklusive moms (25%). Skicka fakturan.',
        solution: [
          { code: '3001', side: 'kredit', amount: 100000 },
          { code: '2610', side: 'kredit', amount: 25000 },
          { code: '1510', side: 'debet', amount: 125000 },
        ],
      },
      {
        stepTitle: 'Del 2: Betalning',
        text: 'Nu har "Cykelhuset AB" betalat fakturan från förra steget (125 000 kr). Pengarna kommer in på Företagskontot.',
        solution: [
          { code: '1930', side: 'debet', amount: 125000 },
          { code: '1510', side: 'kredit', amount: 125000 },
        ],
      },
      {
        stepTitle: 'Del 3: Återbetalning (Reklamation)',
        text: 'Oj! Cykelhuset var missnöjda med en del av leveransen. Du betalar tillbaka 10 000 kr + moms (2 500 kr) direkt från företagskontot.',
        solution: [
          { code: '3001', side: 'debet', amount: 10000 },
          { code: '2610', side: 'debet', amount: 2500 },
          { code: '1930', side: 'kredit', amount: 12500 },
        ],
      },
    ],
  },
  {
    id: 'chain-loan-1',
    title: 'Finansiering',
    steps: [
      {
        stepTitle: 'Del 1: Ta lån',
        text: 'Företaget tar ett banklån på 200 000 kr för att köpa inventarier. Pengarna sätts in på företagskontot.',
        solution: [
          { code: '1930', side: 'debet', amount: 200000 },
          { code: '2350', side: 'kredit', amount: 200000 },
        ],
      },
      {
        stepTitle: 'Del 2: Inköp',
        text: 'Nu använder vi pengarna. Vi köper en maskin (inventarie) för 100 000 kr + moms (25 000 kr) och betalar direkt från kontot.',
        solution: [
          { code: '1220', side: 'debet', amount: 100000 },
          { code: '2640', side: 'debet', amount: 25000 },
          { code: '1930', side: 'kredit', amount: 125000 },
        ],
      },
      {
        stepTitle: 'Del 3: Ränta och amortering',
        text: 'I slutet av månaden drar banken 5 000 kr i amortering och 1 000 kr i räntekostnad från kontot.',
        solution: [
          { code: '2350', side: 'debet', amount: 5000 },
          { code: '8410', side: 'debet', amount: 1000 },
          { code: '1930', side: 'kredit', amount: 6000 },
        ],
      },
    ],
  },
  {
    id: 'single-startup',
    title: 'Starta bolag',
    steps: [
      {
        stepTitle: 'Nyemission',
        text: 'Ägarna startar bolaget och sätter in 50 000 kr i aktiekapital på företagskontot.',
        solution: [
          { code: '1930', side: 'debet', amount: 50000 },
          { code: '2081', side: 'kredit', amount: 50000 },
        ],
      },
    ],
  },
  {
    id: 'single-rent',
    title: 'Lokalhyra',
    steps: [
      {
        stepTitle: 'Betalning av hyra',
        text: 'Hyran för lokalen betalas via autogiro. 12 000 kr (momsfri).',
        solution: [
          { code: '5010', side: 'debet', amount: 12000 },
          { code: '1930', side: 'kredit', amount: 12000 },
        ],
      },
    ],
  },
  {
    id: 'chain-lev-1',
    title: 'Inköp mot faktura',
    steps: [
      {
        stepTitle: 'Del 1: Inköp',
        text: 'Du köper in varor till lagret mot faktura. 40 000 kr + moms (10 000 kr).',
        solution: [
          { code: '4010', side: 'debet', amount: 40000 },
          { code: '2640', side: 'debet', amount: 10000 },
          { code: '2440', side: 'kredit', amount: 50000 },
        ],
      },
      {
        stepTitle: 'Del 2: Betalning',
        text: 'Du betalar leverantörsfakturan på 50 000 kr från föregående steg.',
        solution: [
          { code: '2440', side: 'debet', amount: 50000 },
          { code: '1930', side: 'kredit', amount: 50000 },
        ],
      },
    ],
  },
  {
    id: 'single-wage',
    title: 'Löneutbetalning',
    steps: [
      {
        stepTitle: 'Lön',
        text: 'Bruttolön 30 000 kr. Skatt 9 000 kr. Nettolön utbetalas från kontot.',
        solution: [
          { code: '7010', side: 'debet', amount: 30000 },
          { code: '2710', side: 'kredit', amount: 9000 },
          { code: '1930', side: 'kredit', amount: 21000 },
        ],
      },
    ],
  },
  {
    id: 'single-soc',
    title: 'Arbetsgivaravgifter',
    steps: [
      {
        stepTitle: 'Bokför avgift',
        text: 'Vi bokför arbetsgivaravgifterna kopplat till lönen (skuld). Belopp: 9 426 kr.',
        solution: [
          { code: '7510', side: 'debet', amount: 9426 },
          { code: '2730', side: 'kredit', amount: 9426 },
        ],
      },
    ],
  },
]

// --- STATE ---
const scenarios = ref([...scenarioList])
const currentGroupIndex = ref(0)
const currentStepIndex = ref(0)
const userAccounts = ref([])
const selectedAccountCode = ref('')
const feedbackMessage = ref('')
const feedbackType = ref('')

// Historik för att spara användarens svar per fråga
const history = ref({})

// --- COMPUTED ---
const currentGroup = computed(() => scenarios.value[currentGroupIndex.value] || null)
const currentExercise = computed(() => currentGroup.value?.steps[currentStepIndex.value] || null)

const chainInfo = computed(() => {
  if (!currentGroup.value) return null
  const total = currentGroup.value.steps.length
  if (total <= 1) return null
  return { current: currentStepIndex.value + 1, total: total }
})

// Kan vi gå bakåt?
const canGoBack = computed(() => {
  return currentGroupIndex.value > 0 || currentStepIndex.value > 0
})

const totalDebit = computed(() =>
  userAccounts.value.reduce((sum, acc) => sum + Number(acc.debit || 0), 0),
)
const totalCredit = computed(() =>
  userAccounts.value.reduce((sum, acc) => sum + Number(acc.credit || 0), 0),
)

// --- FUNKTIONER ---

function addAccount() {
  if (!selectedAccountCode.value) return
  const exists = userAccounts.value.find((acc) => acc.code === selectedAccountCode.value)
  if (exists) {
    alert('Detta konto är redan tillagt!')
    return
  }
  const accountInfo = accountList.find((a) => a.code === selectedAccountCode.value)
  userAccounts.value.push({ code: accountInfo.code, name: accountInfo.name, debit: '', credit: '' })
  selectedAccountCode.value = ''
  feedbackMessage.value = ''
}

function removeAccount(code) {
  userAccounts.value = userAccounts.value.filter((a) => a.code !== code)
}

function getHistoryKey(gIndex, sIndex) {
  return `g${gIndex}-s${sIndex}`
}

function saveCurrentState() {
  const key = getHistoryKey(currentGroupIndex.value, currentStepIndex.value)
  // Spara en djup kopia av arrayen
  history.value[key] = JSON.parse(JSON.stringify(userAccounts.value))
}

function loadStateForCurrentStep() {
  const key = getHistoryKey(currentGroupIndex.value, currentStepIndex.value)
  if (history.value[key]) {
    // Ladda sparad historik
    userAccounts.value = JSON.parse(JSON.stringify(history.value[key]))
  } else {
    // Ingen historik (ny fråga) -> Töm
    userAccounts.value = []
  }
}

function checkAnswer() {
  if (!currentExercise.value) return
  const solution = currentExercise.value.solution
  let cd = 0,
    cc = 0
  userAccounts.value.forEach((acc) => {
    cd += Number(acc.debit || 0)
    cc += Number(acc.credit || 0)
  })

  if (cd !== cc) {
    feedbackType.value = 'error'
    feedbackMessage.value = `Det balanserar inte! Diff: ${cd - cc} kr.`
    return
  }
  if (cd === 0) {
    feedbackType.value = 'error'
    feedbackMessage.value = 'Inga belopp ifyllda.'
    return
  }

  let allCorrect = true
  solution.forEach((solRow) => {
    const userRow = userAccounts.value.find((u) => u.code === solRow.code)
    if (!userRow) {
      allCorrect = false
      return
    }
    const userVal = solRow.side === 'debet' ? Number(userRow.debit) : Number(userRow.credit)
    const otherVal = solRow.side === 'debet' ? Number(userRow.credit) : Number(userRow.debit)
    if (userVal !== solRow.amount || otherVal !== 0) allCorrect = false
  })
  if (userAccounts.value.length !== solution.length) allCorrect = false

  if (allCorrect) {
    handleSuccess()
  } else {
    feedbackType.value = 'error'
    feedbackMessage.value = 'Tyvärr, fel konton eller belopp. Försök igen!'
  }
}

function handleSuccess() {
  feedbackType.value = 'success'
  // Spara svaret direkt när man klarat det
  saveCurrentState()

  const isLastStepInGroup = currentStepIndex.value >= currentGroup.value.steps.length - 1
  const isLastGroup = currentGroupIndex.value >= scenarios.value.length - 1

  if (!isLastStepInGroup) feedbackMessage.value = 'Rätt! Nu kommer nästa händelse i kedjan...'
  else if (!isLastGroup) feedbackMessage.value = 'Helt rätt! Går vidare till nästa scenario.'
  else feedbackMessage.value = 'Du har klarat ALLA övningar! Bra jobbat! 🏆'
}

function nextStep() {
  // Spara nuvarande innan vi går vidare (för säkerhets skull)
  saveCurrentState()

  const isLastStepInGroup = currentStepIndex.value >= currentGroup.value.steps.length - 1

  if (!isLastStepInGroup) {
    currentStepIndex.value++
  } else {
    if (currentGroupIndex.value < scenarios.value.length - 1) {
      currentGroupIndex.value++
      currentStepIndex.value = 0
    }
  }

  // Återställ feedback och ladda om det finns historik eller rensa
  feedbackMessage.value = ''
  feedbackType.value = ''
  loadStateForCurrentStep()
  saveToLocalStorage()
}

function prevStep() {
  if (!canGoBack.value) return

  // Spara nuvarande (om man skrivit något man vill ha kvar när man går fram igen)
  saveCurrentState()

  if (currentStepIndex.value > 0) {
    currentStepIndex.value--
  } else if (currentGroupIndex.value > 0) {
    currentGroupIndex.value--
    // Gå till sista steget i föregående grupp
    currentStepIndex.value = scenarios.value[currentGroupIndex.value].steps.length - 1
  }

  feedbackMessage.value = ''
  feedbackType.value = ''
  loadStateForCurrentStep()
  saveToLocalStorage()
}

function skipExercise() {
  // Markera som "hoppad över" i historiken kanske? Nja, vi bara går vidare.
  saveCurrentState() // Sparar det halvfärdiga
  nextStep()
}

function shuffleScenarios() {
  const arr = [...scenarioList]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const temp = arr[i]
    arr[i] = arr[j]
    arr[j] = temp
  }
  scenarios.value = arr
  currentGroupIndex.value = 0
  currentStepIndex.value = 0
  userAccounts.value = []
  history.value = {} // Rensa historik vid ny slumpning
  feedbackMessage.value = ''
  saveToLocalStorage()
}

// --- PERSISTENCE ---
const STORAGE_KEY = 'taccount_v2'
function saveToLocalStorage() {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      g: currentGroupIndex.value,
      s: currentStepIndex.value,
      h: history.value, // Spara även svaren
    }),
  )
}
function loadFromLocalStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const data = JSON.parse(raw)
      currentGroupIndex.value = data.g || 0
      currentStepIndex.value = data.s || 0
      history.value = data.h || {}
      // Ladda in kontona för där vi är nu
      loadStateForCurrentStep()
    }
  } catch (e) {}
}

onMounted(() => {
  loadFromLocalStorage()
})
</script>

<template>
  <div class="exercise-view">
    <div class="scenario-card" v-if="currentGroup">
      <div class="header-row">
        <div>
          <h2 class="main-title">{{ currentGroup.title }}</h2>
          <h3 class="sub-title" v-if="currentExercise.stepTitle">
            - {{ currentExercise.stepTitle }}
          </h3>
        </div>
        <div class="status-box">
          <div v-if="chainInfo" class="chain-badge">
            🔗 Händelse {{ chainInfo.current }} av {{ chainInfo.total }}
          </div>
          <span class="progress-text"
            >Scenario {{ currentGroupIndex + 1 }} / {{ scenarios.length }}</span
          >
        </div>
      </div>
      <p class="scenario-text">{{ currentExercise.text }}</p>
    </div>

    <div class="workspace">
      <div class="add-bar">
        <select v-model="selectedAccountCode">
          <option disabled value="">-- Välj konto --</option>
          <option v-for="acc in sortedAccountList" :key="acc.code" :value="acc.code">
            {{ acc.code }} {{ acc.name }}
          </option>
        </select>
        <button @click="addAccount" class="add-btn">➕</button>
      </div>

      <div class="t-accounts-grid">
        <div v-for="acc in userAccounts" :key="acc.code" class="t-account">
          <div class="t-header">
            <span>{{ acc.code }} {{ acc.name }}</span>
            <button class="remove-btn" @click="removeAccount(acc.code)">✕</button>
          </div>
          <div class="t-body">
            <div class="side debet">
              <label>Debet</label>
              <input type="number" v-model="acc.debit" placeholder="0" />
            </div>
            <div class="divider"></div>
            <div class="side kredit">
              <label>Kredit</label>
              <input type="number" v-model="acc.credit" placeholder="0" />
            </div>
          </div>
        </div>
        <div v-if="userAccounts.length === 0" class="empty-hint">
          Lägg till konton för att börja bokföra händelsen.
        </div>
      </div>

      <div class="totals-row" v-if="userAccounts.length">
        <span>Debet: {{ totalDebit }}</span>
        <span class="separator">|</span>
        <span>Kredit: {{ totalCredit }}</span>
      </div>

      <div class="action-area">
        <div class="buttons-row">
          <button v-if="canGoBack" @click="prevStep" class="btn btn-prev">⬅️ Föregående</button>

          <button v-if="feedbackType !== 'success'" @click="checkAnswer" class="btn btn-check">
            Rätta
          </button>
          <button v-if="feedbackType !== 'success'" @click="skipExercise" class="btn btn-skip">
            Hoppa över
          </button>
        </div>

        <div v-if="feedbackMessage" :class="['feedback', feedbackType]">
          <p>{{ feedbackMessage }}</p>
          <button v-if="feedbackType === 'success'" @click="nextStep" class="next-btn">
            {{
              chainInfo && chainInfo.current < chainInfo.total
                ? 'Nästa händelse i kedjan ➡️'
                : 'Nästa Scenario ⏩'
            }}
          </button>
        </div>

        <div class="shuffle-row" v-if="!feedbackMessage">
          <button @click="shuffleScenarios" class="link-btn">Slumpa ordning på scenarion</button>
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
}

.scenario-card {
  background: white;
  padding: 30px;
  border-radius: 16px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.06);
  margin-bottom: 30px;
  border-left: 8px solid #3498db;
}

.header-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
  border-bottom: 1px solid #eee;
  padding-bottom: 15px;
}

.main-title {
  margin: 0;
  color: #2c3e50;
  font-size: 1.6rem;
}
.sub-title {
  margin: 5px 0 0 0;
  color: #7f8c8d;
  font-size: 1.1rem;
  font-weight: normal;
}

.status-box {
  text-align: right;
}
.chain-badge {
  background: #e1f5fe;
  color: #0277bd;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: bold;
  margin-bottom: 5px;
  display: inline-block;
}
.progress-text {
  display: block;
  font-size: 0.9rem;
  color: #95a5a6;
}
.scenario-text {
  font-size: 1.25rem;
  line-height: 1.6;
  color: #34495e;
}

/* WORKSPACE */
.add-bar {
  display: flex;
  gap: 10px;
  margin-bottom: 30px;
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
}

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
}
.side {
  flex: 1;
  padding: 0 5px;
  display: flex;
  flex-direction: column;
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
  margin: -10px 0;
}

/* TOTALS - NEUTRAL FÄRG */
.totals-row {
  text-align: center;
  font-weight: bold;
  font-size: 1.1rem;
  color: #2c3e50; /* Alltid mörkblå/svart, aldrig röd */
  margin-bottom: 20px;
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

.action-area {
  text-align: center;
}
.buttons-row {
  display: flex;
  gap: 15px;
  justify-content: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.btn {
  padding: 12px 25px;
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
.btn-prev {
  background: #f39c12;
  color: white;
} /* Gul/Orange för Bakåt */

.feedback {
  margin-top: 20px;
  padding: 20px;
  border-radius: 12px;
  animation: popIn 0.3s ease;
}
.feedback.success {
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
  margin-top: 15px;
  padding: 12px 25px;
  background: #155724;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
  font-size: 1rem;
}
.link-btn {
  background: none;
  border: none;
  color: #3498db;
  text-decoration: underline;
  cursor: pointer;
  margin-top: 10px;
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
