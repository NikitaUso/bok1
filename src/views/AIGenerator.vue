<script setup>
import { ref, computed } from 'vue'

const API_KEY = 'AIzaSyCGUCQBbk1ETWxxuGs_wiS6IokwMB7rZuk'

// --- STATE ---
const userInput = ref('')
const isLoading = ref(false)
const errorMessage = ref('')
const currentScenario = ref(null) // Här sparas den genererade övningen

// --- ARBETSYTA (T-konton) ---
const userAccounts = ref([])
const selectedAccountCode = ref('')
const feedbackMessage = ref('')
const feedbackType = ref('')

// --- KONTOPLAN ---
const accountList = [
  { code: '1910', name: 'Kassa' },
  { code: '1930', name: 'Företagskonto' },
  { code: '1510', name: 'Kundfordringar' },
  { code: '1220', name: 'Inventarier' },
  { code: '1240', name: 'Bilar' },
  { code: '2081', name: 'Aktiekapital' },
  { code: '2330', name: 'Checkräkningskredit' },
  { code: '2350', name: 'Banklån' },
  { code: '2440', name: 'Leverantörsskulder' },
  { code: '2610', name: 'Utgående moms' },
  { code: '2640', name: 'Ingående moms' },
  { code: '2710', name: 'Personalskatt' },
  { code: '2730', name: 'Lagstadgade soc. avgifter' },
  { code: '2391', name: 'Förutbetalda intäkter' },
  { code: '3001', name: 'Varuförsäljning' },
  { code: '3041', name: 'Försäljning tjänst' },
  { code: '3900', name: 'Övriga intäkter' },
  { code: '8310', name: 'Ränteintäkter' },
  { code: '4010', name: 'Varuinköp' },
  { code: '5010', name: 'Lokalhyra' },
  { code: '5400', name: 'Förbrukningsinventarier' },
  { code: '6211', name: 'Telefonräkning' },
  { code: '6990', name: 'Övriga externa kostnader' },
  { code: '7010', name: 'Löner' },
  { code: '7510', name: 'Arbetsgivaravgifter' },
  { code: '8410', name: 'Räntekostnader' },
  { code: '7810', name: 'Avskrivningar' },
]

const sortedAccountList = computed(() => {
  return accountList.slice().sort((a, b) => Number(a.code) - Number(b.code))
})

// --- 1. GENERERA ÖVNING ---
async function generateScenario() {
  if (!userInput.value) return
  if (!API_KEY || API_KEY.includes('DIN_NYA')) {
    alert('Ingen API-nyckel!')
    return
  }

  isLoading.value = true
  errorMessage.value = ''
  currentScenario.value = null
  userAccounts.value = []
  feedbackMessage.value = ''

  const accountsString = accountList.map((a) => `${a.code} ${a.name}`).join(', ')

  // Tydligare prompt till AI:t
  const promptText = `
    Agera bokföringslärare. Skapa en konteringsövning baserat på användarens text: "${userInput.value}".

    Regler:
    1. Använd ENDAST dessa konton: ${accountsString}.
    2. Svara ENDAST med ett giltigt JSON-objekt (inga markdown-tecken).
    3. I "text"-fältet: Beskriv ENDAST affärshändelsen i sig. Inkludera INTE instruktioner som "Beräkna momsen" eller "Bokför affärshändelsen". Skriv som en faktabeskrivning av vad som hänt.
    4. JSON-strukturen ska vara exakt så här:
    {
      "title": "Kort och tydlig rubrik",
      "text": "En välformulerad, neutral beskrivning av affärshändelsen.",
      "solution": [
        { "code": "xxxx", "side": "debet", "amount": 0 },
        { "code": "yyyy", "side": "kredit", "amount": 0 }
      ]
    }

    Exempel på BRA text: "Företaget har sålt varor kontant för 5000 kr inklusive moms."
    Exempel på DÅLIG text: "Företaget har sålt varor kontant för 5000 kr inklusive moms. Beräkna momsen (25%) och bokför affärshändelsen."
  `

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY.trim()}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: promptText }] }] }),
      },
    )

    const data = await response.json()
    let textResponse = data.candidates[0].content.parts[0].text

    // Städa svaret
    textResponse = textResponse
      .replace(/```json/g, '')
      .replace(/```/g, '')
      .trim()

    currentScenario.value = JSON.parse(textResponse)
  } catch (error) {
    errorMessage.value = 'Fel vid generering: ' + error.message
    console.error(error)
  } finally {
    isLoading.value = false
  }
}

// --- 2. HANTERA T-KONTON ---
function addAccount() {
  if (!selectedAccountCode.value) return
  const acc = accountList.find((a) => a.code === selectedAccountCode.value)
  userAccounts.value.push({ code: acc.code, name: acc.name, debit: '', credit: '' })
  selectedAccountCode.value = ''
}

function removeAccount(index) {
  userAccounts.value.splice(index, 1)
}

function checkAnswer() {
  if (!currentScenario.value) return

  const solution = currentScenario.value.solution
  let debetSum = 0
  let creditSum = 0

  userAccounts.value.forEach((a) => {
    debetSum += Number(a.debit || 0)
    creditSum += Number(a.credit || 0)
  })

  if (debetSum !== creditSum) {
    feedbackType.value = 'error'
    feedbackMessage.value = `Balanserar ej! Debet: ${debetSum}, Kredit: ${creditSum}`
    return
  }

  // Enkel rättning
  let correct = true
  if (userAccounts.value.length !== solution.length) correct = false

  solution.forEach((sol) => {
    const userAcc = userAccounts.value.find((u) => u.code === sol.code)
    if (!userAcc) {
      correct = false
      return
    }

    const userVal = sol.side === 'debet' ? Number(userAcc.debit) : Number(userAcc.credit)

    // Tillåt liten marginal om det är decimaltal
    if (Math.abs(userVal - sol.amount) > 0.5) correct = false
  })

  if (correct) {
    feedbackType.value = 'success'
    feedbackMessage.value = 'Helt rätt! Snyggt jobbat. 🎉'
  } else {
    feedbackType.value = 'error'
    feedbackMessage.value = 'Fel konton eller belopp. Försök igen.'
  }
}
</script>

<template>
  <div class="ai-wrapper">
    <div class="input-section">
      <h1>Övningsgenerator</h1>
      <textarea
        v-model="userInput"
        placeholder="Beskriv en händelse (t.ex: Jag sålde varor kontant för 5000 kr)..."
        rows="3"
      ></textarea>
      <button @click="generateScenario" :disabled="isLoading" class="btn-gen">
        {{ isLoading ? 'Genererar...' : 'Skapa övning' }}
      </button>
      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
    </div>

    <div v-if="currentScenario" class="practice-area">
      <div class="scenario-box">
        <h2>{{ currentScenario.title }}</h2>
        <p class="scenario-text">{{ currentScenario.text }}</p>
      </div>

      <div class="workspace">
        <div class="controls">
          <select v-model="selectedAccountCode">
            <option value="" disabled>-- Välj konto --</option>
            <option v-for="acc in sortedAccountList" :key="acc.code" :value="acc.code">
              {{ acc.code }} {{ acc.name }}
            </option>
          </select>
          <button @click="addAccount" class="btn-add">➕</button>
        </div>

        <div class="t-grid">
          <div v-for="(acc, index) in userAccounts" :key="index" class="t-account">
            <div class="t-header">
              <span>{{ acc.code }} {{ acc.name }}</span>
              <button class="remove-btn" @click="removeAccount(index)">✕</button>
            </div>
            <div class="t-body">
              <div class="side debet">
                <label>Debet</label>
                <input v-model="acc.debit" type="number" />
              </div>
              <div class="divider"></div>
              <div class="side kredit">
                <label>Kredit</label>
                <input v-model="acc.credit" type="number" />
              </div>
            </div>
          </div>
        </div>

        <div class="actions">
          <button @click="checkAnswer" class="btn-check">Rätta</button>
          <div v-if="feedbackMessage" :class="['msg', feedbackType]">{{ feedbackMessage }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.ai-wrapper {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Segoe UI', sans-serif;
}

.input-section {
  background: white;
  padding: 20px;
  border-radius: 10px;
  margin-bottom: 30px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
  text-align: center;
  border: 1px solid #eee;
}

textarea {
  width: 100%;
  padding: 12px;
  margin: 10px 0;
  border: 1px solid #ddd;
  border-radius: 6px;
  box-sizing: border-box;
  font-size: 1rem;
}

.btn-gen {
  background: #2c3e50;
  color: white;
  padding: 12px 30px;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  font-size: 1.1rem;
  font-weight: bold;
  transition: transform 0.1s;
}
.btn-gen:active {
  transform: scale(0.98);
}
.btn-gen:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* SCENARIO BOX - Tydlig uppgift */
.scenario-box {
  background: #eef2f3;
  padding: 25px;
  border-left: 6px solid #3498db;
  border-radius: 8px;
  margin-bottom: 25px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
}
.scenario-box h2 {
  margin-top: 0;
  color: #2c3e50;
}
.scenario-text {
  font-size: 1.2rem;
  line-height: 1.5;
  color: #333;
}

.workspace {
  background: white;
  padding: 20px;
  border-radius: 10px;
  border: 1px solid #eee;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
}

.controls {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}
select {
  flex: 1;
  padding: 10px;
  border-radius: 6px;
  border: 1px solid #ccc;
  font-size: 1rem;
}
.btn-add {
  padding: 0 20px;
  background: #27ae60;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 6px;
  font-size: 1.2rem;
}

.t-grid {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  margin-bottom: 20px;
  justify-content: center;
}
.t-account {
  border: 1px solid #34495e;
  width: 280px;
  background: white;
  border-radius: 4px;
  overflow: hidden;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
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

.btn-check {
  background: #2980b9;
  color: white;
  padding: 12px 40px;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  font-size: 1.1rem;
  font-weight: bold;
}
.msg {
  margin-top: 15px;
  font-weight: bold;
  padding: 15px;
  border-radius: 8px;
  text-align: center;
  font-size: 1.1rem;
}
.msg.success {
  background: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}
.msg.error {
  background: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}
.error {
  color: red;
  margin-top: 10px;
}
</style>
