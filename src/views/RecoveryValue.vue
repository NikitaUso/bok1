<script setup>
import { ref, computed, onMounted } from 'vue'

// --- TILLSTÅND ---
const exercises = ref([])
const currentIndex = ref(0)
const userAnswer = ref('')
const status = ref('unanswered') // 'unanswered', 'correct', 'wrong'
const showSolution = ref(false) // Styr om facit ska visas

// --- GENERERA 10 FASTA UPPGIFTER ---
function generateExercises() {
  const newExercises = []

  // FASTA HÅLLPUNKTER FÖR KONSEKVENS
  const testYear = 2022 // Året vi gör nedskrivningsprövningen (2022-12-31)
  const targetYear = 2023 // Året vi frågar efter (2023-12-31)

  for (let i = 0; i < 10; i++) {
    // 1. Variera livslängd (5, 8, 10, 20, 25 år)
    const lifeOptions = [5, 8, 10, 20, 25]
    const lifeYears = lifeOptions[Math.floor(Math.random() * lifeOptions.length)]

    // 2. Variera ålder vid testtillfället (hur många år har gått fram till 2022-12-31?)
    // T.ex. 2 till 4 år gammal. (Måste vara mindre än livslängden)
    const yearsOwned = Math.floor(Math.random() * 3) + 2 // 2, 3 eller 4 år

    // Räkna bakåt för att få inköpsår
    const purchaseYear = testYear - yearsOwned + 1

    // 3. Anskaffningsvärde (Snygga siffror, delbart med livslängd)
    const factor = Math.floor(Math.random() * 80) + 40
    const acquisition = factor * lifeYears * 100 // T.ex. 100 000 kr

    // --- BERÄKNINGAR (FACIT) ---

    // Årlig avskrivning (före test)
    const annualDep = acquisition / lifeYears

    // Ackumulerad avskrivning fram till 2022-12-31
    const accDepAtTest = annualDep * yearsOwned

    // Bokfört värde FÖRE prövning 2022-12-31
    const carryingBeforeTest = acquisition - accDepAtTest

    // 4. Återvinningsvärde
    // Vi slumpa om det ska bli nedskrivning eller ej (70% chans för nedskrivning)
    let recoverable
    const isImpairment = Math.random() > 0.3

    if (isImpairment) {
      // Sätt återvinningsvärdet LÄGRE än bokfört värde (80-95%)
      recoverable = Math.floor(carryingBeforeTest * (0.8 + Math.random() * 0.15))
    } else {
      // Sätt återvinningsvärdet HÖGRE än bokfört värde (105-115%)
      recoverable = Math.floor(carryingBeforeTest * (1.05 + Math.random() * 0.1))
    }
    // Avrunda till snyggt tal (närmaste 100-tal)
    recoverable = Math.round(recoverable / 100) * 100

    // Beräkna nedskrivning
    const impairment = Math.max(0, carryingBeforeTest - recoverable)

    // Bokfört värde EFTER prövning 2022-12-31
    const carryingAfterTest = carryingBeforeTest - impairment

    // 5. Värde vid slutet av NÄSTA år (2023-12-31)
    // Vi måste räkna ut den NYA årliga avskrivningen baserat på kvarvarande värde och tid.
    const remainingLifeAtTest = lifeYears - yearsOwned
    const newAnnualDep = carryingAfterTest / remainingLifeAtTest

    // Utgående värde 2023-12-31
    // Vi avrundar svaret till heltal för att undvika decimalproblem
    const val2023 = Math.round(carryingAfterTest - newAnnualDep)

    newExercises.push({
      id: i + 1,
      purchaseDate: `${purchaseYear}-01-01`,
      acquisition,
      lifeYears,
      closingDate: `${testYear}-12-31`,
      targetDate: `${targetYear}-12-31`,
      recoverable,

      // Data för facit
      yearsOwned,
      annualDep,
      carryingBeforeTest,
      impairment,
      carryingAfterTest,
      remainingLifeAtTest,
      newAnnualDep,
      correctAnswer: val2023,
    })
  }

  exercises.value = newExercises
  currentIndex.value = 0
  resetInput()
}

// Kör vid start
onMounted(generateExercises)

// --- LOGIK ---
const currentExercise = computed(() => exercises.value[currentIndex.value] || {})

function resetInput() {
  userAnswer.value = ''
  status.value = 'unanswered'
  showSolution.value = false // Dölj lösning när vi byter fråga
}

function checkAnswer() {
  if (!userAnswer.value) return

  // Vi tillåter decimaler i inmatning men jämför heltal
  const userInt = Math.round(parseFloat(userAnswer.value))
  const correct = currentExercise.value.correctAnswer

  // Tillåt +/- 2 i felmarginal pga avrundningar
  if (Math.abs(userInt - correct) <= 2) {
    status.value = 'correct'
    showSolution.value = true // Visa lösning direkt om man har rätt
  } else {
    status.value = 'wrong'
    showSolution.value = false // Dölj lösning om man har fel (tills man klickar på knappen)
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
  <div class="drill-container">
    <div class="header-row">
      <h1>Övning: Återvinningsvärde</h1>
    </div>

    <!-- FRÅGEKORT -->
    <div class="question-card" v-if="currentExercise.id">
      <div class="progress-badge">Uppgift {{ currentIndex + 1 }} / {{ exercises.length }}</div>

      <div class="scenario">
        <p class="intro-text">
          Ett företag köpte in en maskin den <strong>{{ currentExercise.purchaseDate }}</strong
          >. <br />Företaget tillämpar linjär avskrivning.
        </p>

        <div class="data-box">
          <div class="data-row">
            <span>Anskaffningsvärde:</span>
            <strong>{{ currentExercise.acquisition.toLocaleString('sv-SE') }} kr</strong>
          </div>
          <div class="data-row">
            <span>Ekonomisk livslängd:</span>
            <strong>{{ currentExercise.lifeYears }} år</strong>
          </div>
        </div>

        <div class="event-box">
          <h3>Bokslut {{ currentExercise.closingDate }}</h3>
          <p>
            Företaget genomför en värdeprövning. Det fastställs att maskinens
            <strong>återvinningsvärde</strong> denna dag uppgår till:
          </p>
          <div class="recoverable-value">
            {{ currentExercise.recoverable.toLocaleString('sv-SE') }} kr
          </div>
        </div>

        <p class="question-text">
          Vad är maskinens redovisade värde den
          <strong>{{ currentExercise.targetDate }}</strong
          >?
        </p>
      </div>

      <!-- SVARSFÄLT -->
      <div class="input-section">
        <div class="input-wrapper">
          <input
            type="number"
            v-model="userAnswer"
            placeholder="Svar..."
            :disabled="status !== 'unanswered'"
            @keyup.enter="checkAnswer"
          />
          <span class="unit">kr</span>
        </div>

        <button v-if="status === 'unanswered'" @click="checkAnswer" class="action-btn check-btn">
          Rätta
        </button>

        <div v-else class="result-container">
          <div class="result-feedback" :class="status">
            {{ status === 'correct' ? 'Rätt svar! 🎉' : 'Fel svar ❌' }}
          </div>

          <!-- Knapp för att visa lösning om man har fel -->
          <button
            v-if="status === 'wrong' && !showSolution"
            @click="showSolution = true"
            class="action-btn show-sol-btn"
          >
            Visa lösning
          </button>
        </div>
      </div>

      <!-- NAVIGERING -->
      <div class="navigation">
        <button @click="prevExercise" class="nav-btn" :disabled="currentIndex === 0">
          ← Föregående
        </button>
        <button
          @click="nextExercise"
          class="nav-btn"
          :disabled="currentIndex === exercises.length - 1"
        >
          Nästa →
        </button>
      </div>
    </div>

    <!-- FACIT / FÖRKLARING -->
    <div v-if="showSolution" class="explanation-card">
      <h3>💡 Lösningsgång</h3>

      <!-- Steg 1: Värde vid test -->
      <div class="calc-step">
        <span class="step-label"
          >1. Beräkna värde vid testdatum ({{ currentExercise.closingDate }})</span
        >
        <p>
          Maskinen köptes {{ currentExercise.purchaseDate }}. Vid testdatumet har det gått exakt
          <strong>{{ currentExercise.yearsOwned }} år</strong>.
        </p>
        <p>
          Ursprunglig avskrivning per år: <br />
          {{ currentExercise.acquisition.toLocaleString('sv-SE') }} /
          {{ currentExercise.lifeYears }} =
          <strong>{{ currentExercise.annualDep.toLocaleString('sv-SE') }} kr/år</strong>
        </p>
        <div class="step-math">
          Bokfört värde (före test) = {{ currentExercise.acquisition.toLocaleString('sv-SE') }} - ({
          { currentExercise.annualDep.toLocaleString('sv-SE') } }}
          <strong>{{ currentExercise.carryingBeforeTest.toLocaleString('sv-SE') }} kr</strong>
          <strong>{{ currentExercise.carryingBeforeTest.toLocaleString() }} kr</strong>
        </div>
      </div>

      <!-- Steg 2: Nedskrivningsprövning -->
      <div class="calc-step highlight-step">
        <span class="step-label">2. Jämför med återvinningsvärdet</span>
        <p>
          Bokfört värde: {{ currentExercise.carryingBeforeTest.toLocaleString('sv-SE') }} kr <br />
          Återvinningsvärde: {{ currentExercise.recoverable.toLocaleString('sv-SE') }} kr
        </p>

        <div v-if="currentExercise.impairment > 0" class="impairment-alert">
          ⚠️ Återvinningsvärdet är lägre!
          <br />
          Vi skriver ned till återvinningsvärdet.
          <br />
          Nedskrivning = {{ currentExercise.carryingBeforeTest }} -
          {{ currentExercise.recoverable }} = <strong>{{ currentExercise.impairment }} kr</strong>.
          <br />
          Nytt bokfört värde 2022-12-31:
          <strong>{{ currentExercise.carryingAfterTest.toLocaleString('sv-SE') }} kr</strong>
        </div>
        <div v-else class="no-impairment-alert">
          ✅ Återvinningsvärdet är högre.
          <br />
          Ingen nedskrivning görs. Värdet behålls.
          <br />
          Bokfört värde 2022-12-31:
          <strong>{{ currentExercise.carryingAfterTest.toLocaleString('sv-SE') }} kr</strong>
        </div>
      </div>

      <!-- Steg 3: Värde nästa år -->
      <div class="calc-step">
        <span class="step-label"
          >3. Beräkna värde efter ett år ({{ currentExercise.targetDate }})</span
        >
        <p>
          Vi måste fördela det <em>nya</em> bokförda värdet på den <em>återstående</em> tiden.
          <br />
          Kvarvarande livslängd: {{ currentExercise.lifeYears }} -
          {{ currentExercise.yearsOwned }} =
          <strong>{{ currentExercise.remainingLifeAtTest }} år</strong>.
        </p>
        <p>
          Ny avskrivning 2023 = {{ currentExercise.carryingAfterTest.toLocaleString('sv-SE') }} /
          {{ currentExercise.remainingLifeAtTest }} ≈
          <strong>{{ Math.round(currentExercise.newAnnualDep).toLocaleString('sv-SE') }} kr</strong>
        </p>
        <div class="step-math final">
          Värde 2023-12-31 = {{ currentExercise.carryingAfterTest.toLocaleString('sv-SE') }} -
          {{ Math.round(currentExercise.newAnnualDep).toLocaleString('sv-SE') }} =
          <strong>{{ currentExercise.correctAnswer.toLocaleString('sv-SE') }} kr</strong>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.drill-container {
  max-width: 700px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Segoe UI', sans-serif;
  color: #333;
}

.header-row h1 {
  text-align: center;
  color: #2c3e50;
  margin-bottom: 30px;
  font-size: 2rem;
}

.question-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
  padding: 30px;
  border: 1px solid #f0f2f5;
  position: relative;
}

.progress-badge {
  position: absolute;
  top: 20px;
  right: 20px;
  background: #eef2f6;
  color: #666;
  padding: 5px 12px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: bold;
}

.intro-text {
  font-size: 1.1rem;
  line-height: 1.5;
  margin-bottom: 20px;
}

.data-box {
  background: #f8f9fa;
  padding: 15px;
  border-radius: 8px;
  border-left: 4px solid #3498db;
  margin-bottom: 20px;
}

.data-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 1.1rem;
}
.data-row:last-child {
  margin-bottom: 0;
}

.event-box {
  background: #fff8e1;
  padding: 15px;
  border-radius: 8px;
  border: 1px solid #ffe0b2;
  margin-bottom: 25px;
  text-align: center;
}

.event-box h3 {
  margin: 0 0 10px 0;
  color: #f57c00;
  font-size: 1rem;
  text-transform: uppercase;
}

.recoverable-value {
  font-size: 1.8rem;
  font-weight: 800;
  color: #2c3e50;
  margin-top: 5px;
}

.question-text {
  font-size: 1.25rem;
  font-weight: 600;
  color: #2c3e50;
  text-align: center;
  margin-bottom: 5px;
}

/* INPUT SECTION */
.input-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  margin-bottom: 30px;
}

.input-wrapper {
  position: relative;
  width: 200px;
}

input {
  width: 100%;
  padding: 12px 15px;
  padding-right: 40px; /* Space for unit */
  font-size: 1.3rem;
  border: 2px solid #ddd;
  border-radius: 8px;
  text-align: center;
  font-weight: bold;
}

input:focus {
  border-color: #3498db;
  outline: none;
}

.unit {
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: #999;
  font-weight: bold;
}

.action-btn {
  padding: 12px 40px;
  border: none;
  border-radius: 30px;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  transition: transform 0.1s;
}

.check-btn {
  background-color: #2c3e50;
  color: white;
  box-shadow: 0 4px 10px rgba(44, 62, 80, 0.3);
}
.check-btn:hover {
  transform: scale(1.05);
  background-color: #1a252f;
}

.show-sol-btn {
  background-color: #f39c12;
  color: white;
  box-shadow: 0 4px 10px rgba(243, 156, 18, 0.3);
  margin-top: 10px;
}
.show-sol-btn:hover {
  background-color: #e67e22;
  transform: scale(1.05);
}

.result-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.result-feedback {
  padding: 10px 30px;
  border-radius: 30px;
  font-weight: bold;
  font-size: 1.1rem;
}
.result-feedback.correct {
  background: #d4edda;
  color: #155724;
}
.result-feedback.wrong {
  background: #f8d7da;
  color: #721c24;
}

/* NAVIGATION */
.navigation {
  display: flex;
  justify-content: space-between;
  border-top: 1px solid #eee;
  padding-top: 20px;
}

.nav-btn {
  background: none;
  border: none;
  color: #3498db;
  font-weight: bold;
  font-size: 1rem;
  cursor: pointer;
}
.nav-btn:disabled {
  color: #ccc;
  cursor: not-allowed;
}
.nav-btn:hover:not(:disabled) {
  text-decoration: underline;
}

/* EXPLANATION */
.explanation-card {
  margin-top: 25px;
  background: white;
  padding: 25px;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  animation: slideDown 0.4s ease-out;
}

.calc-step {
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px dashed #eee;
}
.calc-step:last-child {
  border-bottom: none;
}

.step-label {
  display: block;
  font-size: 0.85rem;
  text-transform: uppercase;
  color: #888;
  font-weight: bold;
  margin-bottom: 8px;
}

.step-math {
  font-family: 'Consolas', monospace;
  background: #f8f9fa;
  padding: 10px;
  border-radius: 6px;
  color: #333;
}

.impairment-alert {
  color: #c0392b;
  background: #fff5f5;
  padding: 10px;
  border-radius: 6px;
  margin-top: 5px;
}
.no-impairment-alert {
  color: #27ae60;
  background: #f0fff4;
  padding: 10px;
  border-radius: 6px;
  margin-top: 5px;
}

.final {
  background: #e8f5e9;
  border: 1px solid #c8e6c9;
  font-size: 1.2rem;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
