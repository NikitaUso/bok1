<script setup>
import { ref, computed, onMounted } from 'vue'

// --- TILLSTÅND ---
const exercises = ref([])
const currentIndex = ref(0)
const userAnswer = ref('')
const status = ref('unanswered') // 'unanswered', 'correct', 'wrong'
const showSolution = ref(false)

// --- HJÄLPFUNKTIONER ---
const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min
const formatSEK = (val) =>
  new Intl.NumberFormat('sv-SE', { style: 'currency', currency: 'SEK' }).format(val)

// --- GENERERA 10 UPPGIFTER ---
function generateExercises() {
  const newExercises = []
  const currencies = [
    { name: 'EUR', rateMin: 10, rateMax: 12 },
    { name: 'USD', rateMin: 9, rateMax: 11 },
    { name: 'GBP', rateMin: 12, rateMax: 14 },
  ]

  for (let i = 0; i < 10; i++) {
    const type = i < 7 ? 'kursdiff' : 'asset' // 7 st kursdiffar, 3 st värderingar
    const currency = currencies[Math.floor(Math.random() * currencies.length)]

    // Slumpa belopp (jämna 1000-tal)
    const amountFC = getRandomInt(5, 50) * 1000

    // Slumpa kurser (med 2 decimaler)
    const rate1 = parseFloat(
      (Math.random() * (currency.rateMax - currency.rateMin) + currency.rateMin).toFixed(2),
    )
    const rate2 = parseFloat((rate1 + (Math.random() * 2 - 1)).toFixed(2)) // +/- 1 kr från rate1

    let ex = {}

    if (type === 'kursdiff') {
      // SCENARIO 1: Faktura -> (Kreditfaktura) -> Betalning/Bokslut
      const isExport = Math.random() > 0.5 // Export (Fordran) eller Import (Skuld)
      const hasCreditNote = Math.random() > 0.4 // 40% chans för kreditfaktura (den svåra typen)

      const invoiceSEK = Math.round(amountFC * rate1)
      let creditAmountFC = 0
      let creditSEK = 0
      let creditRate = 0

      let text = `Företaget ${isExport ? 'Exportera AB' : 'Importera AB'} ${isExport ? 'säljer' : 'köper'} varor i ${currency.name}. `
      text += `Faktura på ${amountFC.toLocaleString('sv-SE')} ${currency.name} bokförs till kursen ${rate1} SEK/${currency.name}. `

      if (hasCreditNote) {
        creditAmountFC = getRandomInt(1, 5) * 100 // Litet belopp
        creditRate = parseFloat((rate1 + (Math.random() * 0.5 - 0.25)).toFixed(2)) // Lite annan kurs
        creditSEK = Math.round(creditAmountFC * creditRate)
        text += `<br>Några dagar senare skickas en kreditfaktura på ${creditAmountFC} ${currency.name} (kurs ${creditRate}). `
      }

      // Slutbetalning (Restbeloppet)
      const finalAmountFC = amountFC - creditAmountFC
      const paymentSEK = Math.round(finalAmountFC * rate2)
      text += `<br>Slutbetalning sker till kursen ${rate2} SEK/${currency.name} (totalt ${paymentSEK} SEK).`

      // Beräkna facit (Resultatpåverkan)
      // Bokfört värde (Netto) = Faktura SEK - Kredit SEK
      const bookedNetSEK = invoiceSEK - creditSEK

      // Faktiskt betalt/erhållet
      // Diff = Betalt - Bokfört
      let diff = 0
      if (isExport) {
        // Fordran: Vi får betalt. Får vi MER än bokfört = Vinst (+)
        diff = paymentSEK - bookedNetSEK
      } else {
        // Skuld: Vi betalar. Betalar vi MER än bokfört = Förlust (-)
        diff = bookedNetSEK - paymentSEK
      }

      ex = {
        id: i + 1,
        title: 'Resultatpåverkan (Valutakurs)',
        text: text,
        question:
          'Ange storleken på resultatpåverkan (före skatt) som uppkommit till följd av kursförändringen. (Minus vid förlust).',
        correctAnswer: diff,
        explanation: {
          step1: `Ursprunglig faktura: ${amountFC} ${currency.name} × ${rate1} = ${invoiceSEK} SEK`,
          step2: hasCreditNote
            ? `Kreditfaktura: ${creditAmountFC} ${currency.name} × ${creditRate} = ${creditSEK} SEK`
            : 'Ingen kreditfaktura.',
          step3: `Bokfört värde (netto) att reglera: ${invoiceSEK} - ${creditSEK} = ${bookedNetSEK} SEK`,
          step4: `Faktiskt belopp vid betalning: ${paymentSEK} SEK`,
          step5: `Differens (Kurs${diff >= 0 ? 'vinst' : 'förlust'}): ${isExport ? paymentSEK : bookedNetSEK} - ${isExport ? bookedNetSEK : paymentSEK} = ${diff} kr`,
        },
      }
    } else {
      // SCENARIO 2: Tillgångsvärdering (Asset)
      const lifeYears = 5
      const yearsPassed = 1
      const acquisitionSEK = Math.round(amountFC * rate1)

      // Avskrivning
      const depPerYear = acquisitionSEK / lifeYears
      const bookValue = acquisitionSEK - depPerYear * yearsPassed

      const text = `Bolaget köper den 1 januari en maskin från USA för ${amountFC.toLocaleString('sv-SE')} ${currency.name}.
                    Växelkursen vid köpet var ${rate1} SEK/${currency.name}. Maskinen skrivs av på ${lifeYears} år.
                    <br>På bokslutsdagen 31 december är kursen ${rate2} SEK/${currency.name}.`

      ex = {
        id: i + 1,
        title: 'Värdering av Tillgång',
        text: text,
        question:
          'Till vilket värde ska maskinen värderas i bokslutet den 31 december? (Svara i kr)',
        correctAnswer: Math.round(bookValue),
        explanation: {
          step1: `Anskaffningsvärde i SEK: ${amountFC} × ${rate1} = ${acquisitionSEK} kr. (Valutakurs vid köpet används).`,
          step2: `Tillgångar (som maskiner) är icke-monetära poster och omvärderas INTE efter balansdagens kurs.`,
          step3: `Årets avskrivning: ${acquisitionSEK} / ${lifeYears} = ${depPerYear} kr.`,
          step4: `Redovisat värde: ${acquisitionSEK} - ${depPerYear} = ${Math.round(bookValue)} kr.`,
        },
      }
    }

    newExercises.push(ex)
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

  // Tillåt mellanslag i svaret (t.ex. 10 000)
  const userInt = parseInt(userAnswer.value.replace(/\s/g, ''))
  const correct = currentExercise.value.correctAnswer

  // Tillåt +/- 1 kr felmarginal
  if (Math.abs(userInt - correct) <= 1) {
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
    <h1>Övning: Växelkurser & Värdering</h1>

    <div class="card" v-if="currentExercise.id">
      <div class="header">
        <span class="badge">Uppgift {{ currentIndex + 1 }} / {{ exercises.length }}</span>
        <h2>{{ currentExercise.title }}</h2>
      </div>

      <p class="scenario" v-html="currentExercise.text"></p>

      <p class="question">
        <strong>{{ currentExercise.question }}</strong>
      </p>

      <!-- INPUT -->
      <div class="input-row">
        <input
          type="text"
          v-model="userAnswer"
          placeholder="Svar i kr..."
          :disabled="status === 'correct'"
          @keyup.enter="checkAnswer"
        />
        <button v-if="status !== 'correct'" @click="checkAnswer" class="btn check-btn">
          Rätta
        </button>
      </div>

      <!-- FEEDBACK -->
      <div v-if="status !== 'unanswered'" class="feedback-area">
        <div :class="['msg', status]">
          {{ status === 'correct' ? 'Rätt svar! 🎉' : 'Fel svar ❌' }}
        </div>

        <button
          v-if="status === 'wrong' && !showSolution"
          @click="showSolution = true"
          class="btn show-btn"
        >
          Visa lösning
        </button>
      </div>

      <!-- NAVIGATION -->
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
      <h3>💡 Uträkning</h3>
      <ul>
        <li>{{ currentExercise.explanation.step1 }}</li>
        <li>{{ currentExercise.explanation.step2 }}</li>
        <li>{{ currentExercise.explanation.step3 }}</li>
        <li v-if="currentExercise.explanation.step4">{{ currentExercise.explanation.step4 }}</li>
        <li v-if="currentExercise.explanation.step5" class="final-step">
          <strong>{{ currentExercise.explanation.step5 }}</strong>
        </li>
      </ul>
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
  margin-bottom: 30px;
}

.card {
  background: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid #f0f2f5;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  border-bottom: 2px solid #f0f0f0;
  padding-bottom: 10px;
}

.badge {
  background: #eef2f6;
  color: #666;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: bold;
}

.scenario {
  font-size: 1.1rem;
  line-height: 1.6;
  margin-bottom: 20px;
}
.question {
  font-size: 1.1rem;
  margin-bottom: 20px;
  color: #2c3e50;
}

.input-row {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

input {
  flex: 1;
  padding: 12px;
  font-size: 1.1rem;
  border: 2px solid #ddd;
  border-radius: 8px;
}
input:focus {
  border-color: #3498db;
  outline: none;
}

.btn {
  padding: 0 30px;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: transform 0.1s;
}
.check-btn {
  background: #2c3e50;
  color: white;
}
.check-btn:hover {
  background: #1a252f;
  transform: scale(1.02);
}

.feedback-area {
  margin-bottom: 20px;
}
.msg {
  padding: 10px;
  border-radius: 8px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 10px;
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
  background: #f39c12;
  color: white;
  width: 100%;
  padding: 10px;
}
.show-btn:hover {
  background: #e67e22;
}

.nav-row {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
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

.solution-card {
  margin-top: 20px;
  background: #fdfdfd;
  border-left: 5px solid #27ae60;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  animation: fadeIn 0.5s;
}

ul {
  padding-left: 20px;
}
li {
  margin-bottom: 8px;
  line-height: 1.5;
}
.final-step {
  margin-top: 10px;
  font-size: 1.1rem;
  color: #2c3e50;
  background: #e8f5e9;
  padding: 5px;
  display: inline-block;
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
