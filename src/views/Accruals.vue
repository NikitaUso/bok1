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

  // Vi utgår alltid från att vi gör bokslut för År 1 (kalenderår)
  const currentYear = 'År 1'

  // 1. HYRA (Förutbetald kostnad)
  // Betalar kvartalshyra i förskott i december
  const rentPerMonth = (Math.floor(Math.random() * 10) + 5) * 1000 // 5k - 15k
  newExercises.push({
    title: 'Kvartalshyra i förskott',
    text: `Företaget betalar lokalhyra kvartalsvis i förskott. Den 28 december ${currentYear} betalades fakturan för perioden januari–mars År 2 på totalt ${(rentPerMonth * 3).toLocaleString('sv-SE')} kr.`,
    question: `Hur stor är hyreskostnaden för ${currentYear} som ska redovisas i resultaträkningen?`,
    answer: 0, // Ingen kostnad detta år, allt är förskott
    explanation: `Eftersom hyran avser nästa år (jan-mars År 2) är kostnaden för År 1 <strong>0 kr</strong>. Hela beloppet bokförs som en förutbetald kostnad (tillgång).`,
  })

  // 2. FÖRSÄKRING (Förutbetald kostnad)
  // Årspremie betalas i oktober/november
  const insuranceYearly = (Math.floor(Math.random() * 20) + 12) * 1000 // 12k - 32k
  const insuranceMonthly = insuranceYearly / 12
  newExercises.push({
    title: 'Företagsförsäkring',
    text: `Den 1 november ${currentYear} betalade företaget en årsförsäkring på ${insuranceYearly.toLocaleString('sv-SE')} kr. Försäkringen gäller från 1 november ${currentYear} till 31 oktober År 2.`,
    question: `Hur stor är försäkringskostnaden för ${currentYear}?`,
    answer: Math.round(insuranceMonthly * 2), // Nov + Dec
    explanation: `Försäkringen har utnyttjats i 2 månader under År 1 (nov, dec).<br>Uträkning: (${insuranceYearly} / 12) × 2 = <strong>${Math.round(insuranceMonthly * 2).toLocaleString('sv-SE')} kr</strong>.`,
  })

  // 3. ELRÄKNING (Upplupen kostnad)
  // Faktura kommer nästa år
  const elecCost = (Math.floor(Math.random() * 50) + 20) * 100
  newExercises.push({
    title: 'Elförbrukning december',
    text: `Elräkningen för december ${currentYear} på ${elecCost.toLocaleString('sv-SE')} kr kommer först i januari År 2.`,
    question: `Vilket belopp ska belasta resultatet för ${currentYear} avseende elen?`,
    answer: elecCost,
    explanation: `Elförbrukningen skedde under december År 1. Enligt matchningsprincipen är detta en kostnad för År 1, även om fakturan kommer senare (Upplupen kostnad). Svar: <strong>${elecCost.toLocaleString('sv-SE')} kr</strong>.`,
  })

  // 4. LÅNERÄNTA (Upplupen kostnad)
  // Betalas i efterskott
  const loanAmount = 1000000
  const interestRate = 0.04 // 4%
  const interestYearly = loanAmount * interestRate
  newExercises.push({
    title: 'Ränta på banklån',
    text: `Företaget har ett lån på ${loanAmount.toLocaleString('sv-SE')} kr med 4% ränta. Räntan betalas årsvis i efterskott den 31 mars varje år.`,
    question: `Hur stor räntekostnad ska belasta År 1 (perioden 1 april – 31 december)?`,
    answer: interestYearly * (9 / 12),
    explanation: `Vi måste kostnadsföra räntan för de månader som gått under året (april–december = 9 månader).<br>Uträkning: (${loanAmount} × 0,04) × (9/12) = <strong>${((interestYearly * 9) / 12).toLocaleString('sv-SE')} kr</strong>.`,
  })

  // 5. KUNDFAKTURA (Upplupen intäkt)
  // Arbete utfört men ej fakturerat
  const consultingHours = 50
  const hourlyRate = 1200
  const totalConsulting = consultingHours * hourlyRate
  newExercises.push({
    title: 'Utförda konsulttjänster',
    text: `Under december ${currentYear} arbetade konsulterna 50 timmar åt en kund (á ${hourlyRate} kr/h). Fakturering sker först i januari År 2.`,
    question: `Hur stor intäkt ska redovisas för ${currentYear}?`,
    answer: totalConsulting,
    explanation: `Arbetet är utfört (presterat) under År 1. Därför ska intäkten tas upp nu som en upplupen intäkt.<br>Uträkning: 50 × ${hourlyRate} = <strong>${totalConsulting.toLocaleString('sv-SE')} kr</strong>.`,
  })

  // 6. ABONNEMANG (Förutbetald intäkt)
  // Kund betalar i förskott
  const subTotal = 24000
  newExercises.push({
    title: 'Sålt årsabonnemang',
    text: `Vi säljer en mjukvarutjänst. En kund betalade ${subTotal.toLocaleString('sv-SE')} kr den 1 oktober ${currentYear} för ett års abonnemang (gäller 1 okt ${currentYear} – 30 sep År 2).`,
    question: `Hur stor del av detta är en intäkt för ${currentYear}?`,
    answer: subTotal * (3 / 12),
    explanation: `Vi har bara presterat tjänsten i 3 månader (okt, nov, dec) under År 1.<br>Uträkning: (${subTotal} / 12) × 3 = <strong>${((subTotal * 3) / 12).toLocaleString('sv-SE')} kr</strong>.`,
  })

  // 7. LEASING (Förutbetald kostnad - "Första förhöjda")
  // Lite klurigare
  const leasingTotal = 60000
  newExercises.push({
    title: 'Leasingavgift (Förskott)',
    text: `Den 1 december ${currentYear} betalade företaget leasingavgift för perioden december ${currentYear} till maj År 2 (6 månader). Totalt belopp: ${leasingTotal.toLocaleString('sv-SE')} kr.`,
    question: `Hur stor kostnad ska redovisas för ${currentYear}?`,
    answer: leasingTotal / 6, // Endast 1 månad (dec)
    explanation: `Fakturan täcker 6 månader, men bara 1 månad (december) ligger på År 1.<br>Uträkning: ${leasingTotal} / 6 = <strong>${(leasingTotal / 6).toLocaleString('sv-SE')} kr</strong>.`,
  })

  // 8. LOKALHYRA (Intäkt - Vi hyr ut)
  // Förutbetald intäkt
  const rentIn = 15000
  newExercises.push({
    title: 'Uthyrning av lagerlokal',
    text: `Vi hyr ut en del av vårt lager. Hyresgästen betalade ${(rentIn * 3).toLocaleString('sv-SE')} kr den 30 december ${currentYear} avseende hyra för kvartal 1 År 2.`,
    question: `Hur stor är hyresintäkten för ${currentYear}?`,
    answer: 0,
    explanation: `Hyran avser nästa år (jan-mars År 2). Prestationen har inte utförts än. Intäkten för År 1 är <strong>0 kr</strong>. Allt bokförs som förutbetald intäkt (skuld).`,
  })

  // 9. BONUS (Upplupen kostnad)
  // Lön till VD
  const bonus = 50000
  newExercises.push({
    title: 'Årsbonus till VD',
    text: `Styrelsen beslutade i december ${currentYear} att VD ska få en bonus på ${bonus.toLocaleString('sv-SE')} kr för årets goda resultat. Utbetalning sker i februari År 2.`,
    question: `Vilket belopp ska belasta resultatet År 1?`,
    answer: bonus,
    explanation: `Bonusen intjänades under År 1 och ska därför kostnadsföras då (Upplupen kostnad), även om utbetalningen sker senare. Svar: <strong>${bonus.toLocaleString('sv-SE')} kr</strong>.`,
  })

  // 10. LICENS (Blandat)
  const licenseCost = 36000
  newExercises.push({
    title: 'IT-Licenser',
    text: `Företaget betalade ${licenseCost.toLocaleString('sv-SE')} kr den 1 juli ${currentYear} för IT-licenser som gäller i 3 år framåt.`,
    question: `Hur stor är kostnaden för ${currentYear}?`,
    answer: (licenseCost / 36) * 6, // 36 månader totalt, 6 månader detta år
    explanation: `Licensen gäller 36 månader (3 år). Under År 1 har vi utnyttjat 6 månader (juli-dec).<br>Månadskostnad: ${licenseCost}/36 = 1000 kr.<br>Kostnad År 1: 1000 × 6 = <strong>${((licenseCost / 36) * 6).toLocaleString('sv-SE')} kr</strong>.`,
  })

  // Blanda uppgifterna varje gång
  exercises.value = newExercises.sort(() => Math.random() - 0.5)
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

  // Städa input (tillåt mellanslag)
  const userFloat = parseFloat(userAnswer.value.replace(/\s/g, '').replace(',', '.'))
  const correct = currentExercise.value.answer

  // Tillåt +/- 1 kr felmarginal
  if (Math.abs(userFloat - correct) <= 1) {
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
    <h1>Periodisering & Bokslut</h1>

    <div class="card" v-if="currentExercise.title">
      <div class="header-row">
        <span class="badge">Uppgift {{ currentIndex + 1 }} / 10</span>
        <button @click="generateExercises" class="reload-btn" v-if="false">🔄 Slumpa nya</button>
      </div>

      <!-- SCENARIO -->
      <div class="scenario-box">
        <h3>{{ currentExercise.title }}</h3>
        <p v-html="currentExercise.text"></p>
      </div>

      <div class="question-area">
        <p class="q-text">{{ currentExercise.question }}</p>

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

        <div v-if="status !== 'unanswered'" class="feedback-area">
          <span :class="['msg', status]">
            {{ status === 'correct' ? 'Rätt svar! 🎉' : 'Fel svar. Försök igen.' }}
          </span>
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
        <h4>💡 Förklaring</h4>
        <p v-html="currentExercise.explanation"></p>
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
  margin-bottom: 30px;
}

.card {
  background: white;
  padding: 30px;
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
  font-size: 0.9rem;
}

.reload-btn {
  background: #f0f0f0;
  border: 1px solid #ccc;
  padding: 5px 10px;
  border-radius: 5px;
  cursor: pointer;
}

.scenario-box {
  background: #fdfdfd;
  padding: 20px;
  border-left: 5px solid #3498db;
  border-radius: 5px;
  margin-bottom: 25px;
}
.scenario-box h3 {
  margin-top: 0;
  color: #2c3e50;
}
.scenario-box p {
  font-size: 1.1rem;
  line-height: 1.5;
  margin-bottom: 0;
}

.question-area {
  margin-bottom: 25px;
}
.q-text {
  font-weight: bold;
  font-size: 1.1rem;
  margin-bottom: 10px;
}

.input-row {
  display: flex;
  gap: 10px;
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
  padding: 0 25px;
  border: none;
  border-radius: 8px;
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
}
.msg {
  font-weight: bold;
  margin-right: 15px;
  display: inline-block;
  padding: 8px 0;
}
.msg.correct {
  color: #27ae60;
}
.msg.wrong {
  color: #c0392b;
}

.show-btn {
  background: #e67e22;
  color: white;
  padding: 8px 20px;
  font-size: 0.9rem;
}
.show-btn:hover {
  background: #d35400;
}

.solution-card {
  margin-top: 20px;
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  border-radius: 8px;
  padding: 20px;
  animation: fadeIn 0.5s;
}
.solution-card h4 {
  margin-top: 0;
  color: #166534;
}

.nav-row {
  display: flex;
  justify-content: space-between;
  margin-top: 30px;
  border-top: 1px solid #eee;
  padding-top: 20px;
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
