<script setup>
import { ref, computed, reactive, onMounted } from 'vue'

// --- STYRNING ---
const currentStep = ref(1)
const step1Error = ref('')
const step1Success = ref(false)
const step2Error = ref('')
const step2Success = ref(false)
const step3Result = ref('')
const step3Success = ref(false)
// Visa lösning-flaggor per steg
const showSolution = reactive({ step1: false, step2: false, step3: false })

// --- SCENARIO DATA ---
const scenario = reactive({
  year: 2025,
  // Initiera med temporärt namn tills generateScenario körs
  company: 'Företag A AB',
  initialCapital: 0,
  bankLoan: 0,
  rentAnnual: 0,
  furnitureCost: 0,
  revenue: 0,
  materialCost: 0,
  dividend: 0,
  interestIncome: 0,
  interestExpense: 0,
  amortization: 0,
  depreciation: 0,
})

// Dynamiskt intro & transaktioner
const scenarioTitle = computed(() => `${scenario.company} - År ${scenario.year}`)
const scenarioIntro = computed(
  () => `${scenario.company} startar sin verksamhet den 1 januari ${scenario.year}.
Följande har hänt vid start (Ingående Balans):
- Ägarna har satt in ${scenario.initialCapital.toLocaleString('sv-SE')} kr i Aktiekapital.
- Företaget har lånat ${scenario.bankLoan.toLocaleString('sv-SE')} kr av banken.
- Totalt ${(scenario.initialCapital + scenario.bankLoan).toLocaleString('sv-SE')} kr finns på företagskontot (Kassa och Bank).`,
)

const transactions = computed(() => [
  {
    id: 1,
    text: `Lokalhyra på ${scenario.rentAnnual.toLocaleString('sv-SE')} kr betalas kontant i förskott för hela året.`,
  },
  {
    id: 2,
    text: `Möbler till kontoret köps in och betalas kontant med ${scenario.furnitureCost.toLocaleString('sv-SE')} kr.`,
  },
  {
    id: 3,
    text: `Arvoden från kunder (Intäkter) på ${scenario.revenue.toLocaleString('sv-SE')} kr erhålls kontant.`,
  },
  {
    id: 4,
    text: `Konsultmaterial införskaffas för ${scenario.materialCost.toLocaleString('sv-SE')} kr kontant (förbrukas direkt).`,
  },
  {
    id: 5,
    text: `Ägaren tar ut ${scenario.dividend.toLocaleString('sv-SE')} kr ur företaget som utdelning (tas från EK).`,
  },
  {
    id: 6,
    text: `Ränta gottgörs bankkontot med ${scenario.interestIncome.toLocaleString('sv-SE')} kr (Ränteintäkt).`,
  },
  {
    id: 7,
    text: `Vid årets slut amorteras banklånet med ${scenario.amortization.toLocaleString('sv-SE')} kr och samtidigt betalas ränta på lånet med ${scenario.interestExpense.toLocaleString('sv-SE')} kr.`,
  },
  {
    id: 8,
    text: `Bokslut: Beräkna och redovisa årets avskrivning på möbler (5 års livslängd): ${scenario.depreciation.toLocaleString('sv-SE')} kr.`,
  },
])

// --- T-KONTON ---
const accounts = ref([])
function getBalance(acc) {
  const d = acc.debits.reduce((a, b) => a + b, 0)
  const c = acc.credits.reduce((a, b) => a + b, 0)
  return { debit: d, credit: c, net: d - c }
}

// --- RR & BR ---
const rr = reactive({ intakter: '', kostnader: '', avskrivningar: '', finansiella: '' })
const br = reactive({ anlaggning: '', omsattning: '', egetKapital: '', skulder: '' })

// (RR/BR sammanställningar kan läggas till vid behov; ej använda här)

// --- ANALYS ---
// ANALYS SVAR (endast numeriska frågor)
const analysis = reactive({
  arResultat: '', // 1
  ekForandring: '', // 2
  inbetalningar: '', // 4
  utbetalningar: '', // 5
  kassaflode: '', // 6
  utgifter: '', // 7
  kostnader: '', // 8
  inkomster: '', // 10
  intakter: '', // 11
})

// --- GENERERA SCENARIO ---
function rand(step, min, max) {
  const steps = Math.floor((max - min) / step)
  return min + Math.floor(Math.random() * (steps + 1)) * step
}

function resetUserInputs() {
  rr.intakter = ''
  rr.kostnader = ''
  rr.avskrivningar = ''
  rr.finansiella = ''
  br.anlaggning = ''
  br.omsattning = ''
  br.egetKapital = ''
  br.skulder = ''
  analysis.arResultat = ''
  analysis.ekForandring = ''
  analysis.inbetalningar = ''
  analysis.utbetalningar = ''
  analysis.kassaflode = ''
  analysis.utgifter = ''
  analysis.kostnader = ''
  analysis.inkomster = ''
  analysis.intakter = ''
  step1Success.value = false
  step2Success.value = false
  step3Success.value = false
  step1Error.value = ''
  step2Error.value = ''
  step3Result.value = ''
}

function generateScenario() {
  // Slumpa företagsnamn Företag A-Z AB
  const companyNames = Array.from(
    { length: 26 },
    (_, i) => `Företag ${String.fromCharCode(65 + i)} AB`,
  )
  scenario.company = companyNames[Math.floor(Math.random() * companyNames.length)]
  // Randomisera värden
  scenario.initialCapital = rand(10000, 50000, 150000)
  scenario.bankLoan = rand(25000, 200000, 500000)
  scenario.rentAnnual = rand(10000, 80000, 180000)
  scenario.furnitureCost = rand(10000, 40000, 120000)
  scenario.revenue = rand(50000, 600000, 1200000)
  scenario.materialCost = rand(5000, 30000, 90000)
  scenario.dividend = rand(10000, 30000, 100000)
  scenario.interestIncome = rand(1000, 1000, 5000)
  scenario.interestExpense = rand(1000, 5000, 20000)
  scenario.amortization = rand(5000, 50000, Math.min(100000, scenario.bankLoan / 2))
  // Depreciation straight-line 5 years
  scenario.depreciation = Math.round(scenario.furnitureCost / 5)

  // Initiera konton med IB
  accounts.value = [
    {
      code: '1930',
      name: 'Kassa och Bank',
      type: 'tillgång',
      debits: [scenario.initialCapital + scenario.bankLoan],
      credits: [],
    },
    {
      code: '2081',
      name: 'Eget Kapital',
      type: 'ek',
      debits: [],
      credits: [scenario.initialCapital],
    },
    { code: '2350', name: 'Banklån', type: 'skuld', debits: [], credits: [scenario.bankLoan] },
    { code: '1220', name: 'Inventarier (Möbler)', type: 'tillgång', debits: [], credits: [] },
    { code: '3000', name: 'Försäljning/Intäkter', type: 'intäkt', debits: [], credits: [] },
    { code: '5010', name: 'Lokalhyra', type: 'kostnad', debits: [], credits: [] },
    { code: '5400', name: 'Kontorsmaterial', type: 'kostnad', debits: [], credits: [] },
    { code: '8300', name: 'Ränteintäkter', type: 'intäkt', debits: [], credits: [] },
    { code: '8400', name: 'Räntekostnader', type: 'kostnad', debits: [], credits: [] },
    { code: '7830', name: 'Avskrivningar', type: 'kostnad', debits: [], credits: [] },
  ]

  resetUserInputs()
  currentStep.value = 1
}

onMounted(generateScenario)

// --- VALIDATION ---
function validateStep1() {
  const expected = {
    kassa:
      scenario.initialCapital +
      scenario.bankLoan -
      scenario.rentAnnual -
      scenario.furnitureCost +
      scenario.revenue -
      scenario.materialCost -
      scenario.dividend +
      scenario.interestIncome -
      scenario.amortization -
      scenario.interestExpense,
    ek: scenario.dividend - scenario.initialCapital, // debet - kredit
    lan: scenario.amortization - scenario.bankLoan,
    mobler: scenario.furnitureCost - scenario.depreciation,
    sales: -scenario.revenue,
    hyra: scenario.rentAnnual,
    material: scenario.materialCost,
    rInt: -scenario.interestIncome,
    rKost: scenario.interestExpense,
    avskr: scenario.depreciation,
  }
  const check = (code, val) => {
    const acc = accounts.value.find((a) => a.code === code)
    return acc && getBalance(acc).net === val
  }
  const allOk =
    check('1930', expected.kassa) &&
    check('2081', expected.ek) &&
    check('2350', expected.lan) &&
    check('1220', expected.mobler) &&
    check('3000', expected.sales) &&
    check('5010', expected.hyra) &&
    check('5400', expected.material) &&
    check('8300', expected.rInt) &&
    check('8400', expected.rKost) &&
    check('7830', expected.avskr)
  if (allOk) {
    step1Success.value = true
    step1Error.value = ''
    showSolution.step1 = false
  } else {
    step1Success.value = false
    step1Error.value = 'Något stämmer inte i saldona. Kontrollera dina bokföringar mot händelserna.'
    // Tillåt visa lösning efter fel
  }
}

// Lösning data för steg 1
const solutionStep1 = computed(() => {
  const expected = {
    '1930 Kassa och Bank':
      scenario.initialCapital +
      scenario.bankLoan -
      scenario.rentAnnual -
      scenario.furnitureCost +
      scenario.revenue -
      scenario.materialCost -
      scenario.dividend +
      scenario.interestIncome -
      scenario.amortization -
      scenario.interestExpense,
    '2081 Eget Kapital': scenario.dividend - scenario.initialCapital,
    '2350 Banklån': scenario.amortization - scenario.bankLoan,
    '1220 Inventarier': scenario.furnitureCost - scenario.depreciation,
    '3000 Försäljning/Intäkter': -scenario.revenue,
    '5010 Lokalhyra': scenario.rentAnnual,
    '5400 Kontorsmaterial': scenario.materialCost,
    '8300 Ränteintäkter': -scenario.interestIncome,
    '8400 Räntekostnader': scenario.interestExpense,
    '7830 Avskrivningar': scenario.depreciation,
  }
  return expected
})

function validateStep2() {
  // Facit för rapporterna
  const intakter = scenario.revenue
  const kostnader = scenario.rentAnnual + scenario.materialCost
  const avskr = scenario.depreciation
  const finansiella = scenario.interestIncome - scenario.interestExpense
  const aretsResultat = intakter - kostnader - avskr + finansiella

  const anlaggning = scenario.furnitureCost - scenario.depreciation
  const kassaUB =
    scenario.initialCapital +
    scenario.bankLoan -
    scenario.rentAnnual -
    scenario.furnitureCost +
    scenario.revenue -
    scenario.materialCost -
    scenario.dividend +
    scenario.interestIncome -
    scenario.amortization -
    scenario.interestExpense
  const skulderUB = scenario.bankLoan - scenario.amortization
  const egetKapitalUB = scenario.initialCapital - scenario.dividend + aretsResultat

  const rrOk =
    Number(rr.intakter) === intakter &&
    Number(rr.kostnader) === kostnader &&
    Number(rr.avskrivningar) === avskr &&
    Number(rr.finansiella) === finansiella
  const brOk =
    Number(br.anlaggning) === anlaggning &&
    Number(br.omsattning) === kassaUB &&
    Number(br.skulder) === skulderUB &&
    Number(br.egetKapital) === egetKapitalUB

  if (rrOk && brOk) {
    step2Success.value = true
    step2Error.value = ''
    showSolution.step2 = false
  } else {
    step2Success.value = false
    step2Error.value = 'Rapporterna stämmer inte. Kontrollera RR & BR mot T-kontona.'
    // Kan visa lösning
  }
}

// Lösning data steg 2
const solutionStep2 = computed(() => {
  const intakter = scenario.revenue
  const kostnader = scenario.rentAnnual + scenario.materialCost
  const avskr = scenario.depreciation
  const finansiella = scenario.interestIncome - scenario.interestExpense
  const aretsResultat = intakter - kostnader - avskr + finansiella
  const anlaggning = scenario.furnitureCost - scenario.depreciation
  const kassaUB =
    scenario.initialCapital +
    scenario.bankLoan -
    scenario.rentAnnual -
    scenario.furnitureCost +
    scenario.revenue -
    scenario.materialCost -
    scenario.dividend +
    scenario.interestIncome -
    scenario.amortization -
    scenario.interestExpense
  const skulderUB = scenario.bankLoan - scenario.amortization
  const egetKapitalUB = scenario.initialCapital - scenario.dividend + aretsResultat
  return {
    rr: { intakter, kostnader, avskr, finansiella, aretsResultat },
    br: { anlaggning, kassaUB, egetKapitalUB, skulderUB },
  }
})

function getExpectedAnalysis() {
  const intakter = scenario.revenue + scenario.interestIncome // Intäkter (intäkter) fråga 11
  const inkomster = scenario.revenue + scenario.interestIncome // Inkomsterna (antag samma i detta case) fråga 10
  const utgifter =
    scenario.rentAnnual + scenario.furnitureCost + scenario.materialCost + scenario.interestExpense // amortization not utgift, dividend not utgift
  const kostnader =
    scenario.rentAnnual + scenario.materialCost + scenario.depreciation + scenario.interestExpense // depreciation + interest exp + consumed material + rent
  const aretsResultat =
    scenario.revenue +
    scenario.interestIncome -
    (scenario.rentAnnual + scenario.materialCost + scenario.depreciation + scenario.interestExpense)
  const egetKapitalUB = scenario.initialCapital - scenario.dividend + aretsResultat
  const ekForandring = egetKapitalUB - scenario.initialCapital
  const inbetalningar =
    scenario.initialCapital + scenario.bankLoan + scenario.revenue + scenario.interestIncome // all cash inflows
  const utbetalningar =
    scenario.rentAnnual +
    scenario.furnitureCost +
    scenario.materialCost +
    scenario.dividend +
    scenario.amortization +
    scenario.interestExpense // cash outflows
  const kassaflode = inbetalningar - utbetalningar
  return {
    aretsResultat,
    ekForandring,
    inbetalningar,
    utbetalningar,
    kassaflode,
    utgifter,
    kostnader,
    inkomster,
    intakter: intakter,
  }
}

function checkAnalysis() {
  const exp = getExpectedAnalysis()
  const allNumericOk =
    Number(analysis.arResultat) === exp.aretsResultat &&
    Number(analysis.ekForandring) === exp.ekForandring &&
    Number(analysis.inbetalningar) === exp.inbetalningar &&
    Number(analysis.utbetalningar) === exp.utbetalningar &&
    Number(analysis.kassaflode) === exp.kassaflode &&
    Number(analysis.utgifter) === exp.utgifter &&
    Number(analysis.kostnader) === exp.kostnader &&
    Number(analysis.inkomster) === exp.inkomster &&
    Number(analysis.intakter) === exp.intakter

  if (allNumericOk) {
    step3Result.value = 'Alla numeriska svar är rätt! 🎉'
    step3Success.value = true
    showSolution.step3 = false
  } else {
    step3Result.value = 'Något numeriskt svar är fel. Försök igen eller visa lösning.'
    step3Success.value = false
  }
}

// Lösning steg 3
const solutionStep3 = computed(() => getExpectedAnalysis())

// Helper för T-konto input
function addEntry(acc, side) {
  if (side === 'debit') acc.debits.push(0)
  else acc.credits.push(0)
}
function removeEntry(acc, side, idx) {
  if (side === 'debit') acc.debits.splice(idx, 1)
  else acc.credits.splice(idx, 1)
}
</script>

<template>
  <div class="sim-wrapper">
    <h1>Bokslutssimulator</h1>

    <div class="intro-box">
      <h3>{{ scenarioTitle }}</h3>
      <p class="intro-text">{{ scenarioIntro }}</p>
    </div>

    <!-- NAVIGATION TABS -->
    <div class="step-nav">
      <div
        :class="['step-badge', { active: currentStep === 1, done: step1Success }]"
        @click="currentStep = 1"
      >
        1. Bokföring
      </div>
      <div class="line"></div>
      <div
        :class="['step-badge', { active: currentStep === 2, done: step2Success }]"
        @click="currentStep = 2"
      >
        2. Bokslut
      </div>
      <div class="line"></div>
      <div
        :class="['step-badge', { active: currentStep === 3, done: step3Success }]"
        @click="currentStep = 3"
      >
        3. Analys
      </div>
    </div>

    <!-- STEG 1: BOKFÖRING -->
    <div v-if="currentStep === 1" class="step-content">
      <div class="split-view">
        <div class="events-panel">
          <h4>Affärshändelser</h4>
          <ul>
            <li v-for="t in transactions" :key="t.id">
              <strong>{{ t.id }}.</strong> {{ t.text }}
            </li>
          </ul>
        </div>

        <div class="accounts-panel">
          <h4>T-Konton (Bokför här)</h4>
          <p class="hint">Klicka på + för att lägga till en rad. Fyll i belopp.</p>

          <div class="accounts-grid">
            <div v-for="acc in accounts" :key="acc.code" class="t-account">
              <div class="t-header">{{ acc.code }} {{ acc.name }}</div>
              <div class="t-body">
                <div class="side">
                  <div v-for="(val, idx) in acc.debits" :key="'d' + idx" class="input-wrap">
                    <input type="number" v-model="acc.debits[idx]" />
                    <button
                      class="remove-btn-mini"
                      v-if="acc.debits.length > 0"
                      @click="removeEntry(acc, 'debit', idx)"
                      title="Ta bort rad"
                    >
                      -
                    </button>
                  </div>
                  <button
                    class="add-btn-mini"
                    @click="addEntry(acc, 'debit')"
                    title="Lägg till rad"
                  >
                    +
                  </button>
                </div>
                <div class="divider"></div>
                <div class="side">
                  <div v-for="(val, idx) in acc.credits" :key="'c' + idx" class="input-wrap">
                    <input type="number" v-model="acc.credits[idx]" />
                    <button
                      class="remove-btn-mini"
                      v-if="acc.credits.length > 0"
                      @click="removeEntry(acc, 'credit', idx)"
                      title="Ta bort rad"
                    >
                      -
                    </button>
                  </div>
                  <button
                    class="add-btn-mini"
                    @click="addEntry(acc, 'credit')"
                    title="Lägg till rad"
                  >
                    +
                  </button>
                </div>
              </div>
              <div class="t-footer">
                Saldo: {{ getBalance(acc).net.toLocaleString('sv-SE') }} kr
              </div>
            </div>
          </div>

          <div class="action-row">
            <p v-if="step1Error" class="error">{{ step1Error }}</p>
            <button @click="validateStep1" class="btn-primary">Rätta Bokföring</button>
            <button
              v-if="step1Error && !showSolution.step1"
              @click="showSolution.step1 = true"
              class="btn-secondary"
            >
              Visa lösning
            </button>
            <button v-if="step1Success" @click="currentStep = 2" class="btn-success">
              Gå till Bokslut ➡️
            </button>
          </div>
          <div v-if="showSolution.step1" class="solution-panel">
            <h4>Facit T-konton (Netto)</h4>
            <ul>
              <li v-for="(val, name) in solutionStep1" :key="name">
                <strong>{{ name }}:</strong> {{ val.toLocaleString('sv-SE') }}
              </li>
            </ul>
            <button class="btn-secondary" @click="showSolution.step1 = false">Dölj</button>
          </div>
        </div>
        <!-- end accounts-panel -->
      </div>
      <!-- end split-view -->
    </div>
    <!-- end step1 -->

    <!-- STEG 2: BOKSLUT -->
    <div v-if="currentStep === 2" class="step-content">
      <div class="reports-grid">
        <div class="report-card">
          <h4>Resultaträkning</h4>
          <div class="form-row">
            <label>Intäkter</label>
            <input type="number" v-model="rr.intakter" />
          </div>
          <div class="form-row">
            <label>Kostnader</label>
            <input type="number" v-model="rr.kostnader" />
          </div>
          <div class="form-row">
            <label>Avskrivningar</label>
            <input type="number" v-model="rr.avskrivningar" />
          </div>
          <div class="form-row">
            <label>Finansiella (netto)</label>
            <input type="number" v-model="rr.finansiella" />
          </div>
        </div>
        <div class="report-card">
          <h4>Balansräkning</h4>
          <div class="form-row">
            <label>Anläggningstillgångar</label>
            <input type="number" v-model="br.anlaggning" />
          </div>
          <div class="form-row">
            <label>Kassa</label>
            <input type="number" v-model="br.omsattning" />
          </div>
          <div class="form-row">
            <label>Eget Kapital</label>
            <input type="number" v-model="br.egetKapital" />
          </div>
          <div class="form-row">
            <label>Skulder</label>
            <input type="number" v-model="br.skulder" />
          </div>
          <div class="sum-row">
            <span>S:a EK & Skulder</span>
            <span
              >{{ (Number(br.egetKapital) + Number(br.skulder)).toLocaleString('sv-SE') }} kr</span
            >
          </div>
        </div>
      </div>
      <div class="action-row">
        <p v-if="step2Error" class="error">{{ step2Error }}</p>
        <button @click="validateStep2" class="btn-primary">Rätta Bokslut</button>
        <button
          v-if="step2Error && !showSolution.step2"
          @click="showSolution.step2 = true"
          class="btn-secondary"
        >
          Visa lösning
        </button>
        <button v-if="step2Success" @click="currentStep = 3" class="btn-success">
          Gå till Analys ➡️
        </button>
      </div>
      <div v-if="showSolution.step2" class="solution-panel">
        <h4>Facit Bokslut</h4>
        <div class="facet-block">
          <strong>Resultaträkning</strong>
          <ul>
            <li>Intäkter: {{ solutionStep2.rr.intakter.toLocaleString('sv-SE') }} kr</li>
            <li>Kostnader: {{ solutionStep2.rr.kostnader.toLocaleString('sv-SE') }} kr</li>
            <li>Avskrivningar: {{ solutionStep2.rr.avskr.toLocaleString('sv-SE') }} kr</li>
            <li>
              Finansiella (netto): {{ solutionStep2.rr.finansiella.toLocaleString('sv-SE') }} kr
            </li>
            <li>Årets Resultat: {{ solutionStep2.rr.aretsResultat.toLocaleString('sv-SE') }} kr</li>
          </ul>
        </div>
        <div class="facet-block">
          <strong>Balansräkning</strong>
          <ul>
            <li>
              Anläggningstillgångar: {{ solutionStep2.br.anlaggning.toLocaleString('sv-SE') }} kr
            </li>
            <li>
              Kassa (Omsättn.tillg): {{ solutionStep2.br.kassaUB.toLocaleString('sv-SE') }} kr
            </li>
            <li>Eget Kapital: {{ solutionStep2.br.egetKapitalUB.toLocaleString('sv-SE') }} kr</li>
            <li>Skulder: {{ solutionStep2.br.skulderUB.toLocaleString('sv-SE') }} kr</li>
          </ul>
        </div>
        <button class="btn-secondary" @click="showSolution.step2 = false">Dölj</button>
      </div>
    </div>

    <!-- STEG 3: ANALYS (lista) -->
    <div v-if="currentStep === 3" class="step-content">
      <h3>Analys (Numeriska frågor)</h3>
      <div class="analysis-form list-mode">
        <ul class="analysis-list">
          <li>
            <label>1. Årets resultat</label>
            <input type="number" v-model="analysis.arResultat" placeholder="kr" />
          </li>
          <li>
            <label>2. Förändring av EK</label>
            <input type="number" v-model="analysis.ekForandring" placeholder="kr" />
          </li>
          <li>
            <label>4. Inbetalningar</label>
            <input type="number" v-model="analysis.inbetalningar" placeholder="kr" />
          </li>
          <li>
            <label>5. Utbetalningar</label>
            <input type="number" v-model="analysis.utbetalningar" placeholder="kr" />
          </li>
          <li>
            <label>6. Kassaflöde</label>
            <input type="number" v-model="analysis.kassaflode" placeholder="kr" />
          </li>
          <li>
            <label>7. Utgifter</label>
            <input type="number" v-model="analysis.utgifter" placeholder="kr" />
          </li>
          <li>
            <label>8. Kostnader</label>
            <input type="number" v-model="analysis.kostnader" placeholder="kr" />
          </li>
          <li>
            <label>10. Inkomster</label>
            <input type="number" v-model="analysis.inkomster" placeholder="kr" />
          </li>
          <li>
            <label>11. Intäkter</label>
            <input type="number" v-model="analysis.intakter" placeholder="kr" />
          </li>
        </ul>
        <div class="analysis-actions">
          <button @click="checkAnalysis" class="btn-primary wide">Rätta analys</button>
          <p class="result-text">{{ step3Result }}</p>
          <button
            v-if="!step3Success && step3Result && !showSolution.step3"
            @click="showSolution.step3 = true"
            class="btn-secondary"
          >
            Visa lösning
          </button>
        </div>
        <div v-if="showSolution.step3" class="solution-panel">
          <h4>Facit</h4>
          <ul class="facit-list">
            <li>
              <strong>1.</strong> {{ solutionStep3.aretsResultat.toLocaleString('sv-SE') }} kr
            </li>
            <li><strong>2.</strong> {{ solutionStep3.ekForandring.toLocaleString('sv-SE') }} kr</li>
            <li>
              <strong>4.</strong> {{ solutionStep3.inbetalningar.toLocaleString('sv-SE') }} kr
            </li>
            <li>
              <strong>5.</strong> {{ solutionStep3.utbetalningar.toLocaleString('sv-SE') }} kr
            </li>
            <li><strong>6.</strong> {{ solutionStep3.kassaflode.toLocaleString('sv-SE') }} kr</li>
            <li><strong>7.</strong> {{ solutionStep3.utgifter.toLocaleString('sv-SE') }} kr</li>
            <li><strong>8.</strong> {{ solutionStep3.kostnader.toLocaleString('sv-SE') }} kr</li>
            <li><strong>10.</strong> {{ solutionStep3.inkomster.toLocaleString('sv-SE') }} kr</li>
            <li><strong>11.</strong> {{ solutionStep3.intakter.toLocaleString('sv-SE') }} kr</li>
          </ul>
          <button class="btn-secondary" @click="showSolution.step3 = false">Dölj</button>
        </div>
        <div class="action-row" v-if="step3Success">
          <button @click="generateScenario" class="btn-success">Generera ny</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.sim-wrapper {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Segoe UI', sans-serif;
  color: #333;
}

h1 {
  text-align: center;
  color: #2c3e50;
  margin-bottom: 20px;
}

.intro-box {
  background: #e3f2fd;
  padding: 20px;
  border-radius: 8px;
  border-left: 5px solid #2196f3;
  margin-bottom: 30px;
}
.intro-text {
  white-space: pre-line;
  line-height: 1.5;
}

/* STEP NAV */
.step-nav {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 30px;
}
.step-badge {
  background: #eee;
  color: #888;
  padding: 10px 20px;
  border-radius: 20px;
  font-weight: bold;
  cursor: pointer;
  position: relative;
  transition:
    background 0.3s,
    color 0.3s;
}
.step-badge.active {
  background: #2c3e50;
  color: white;
}
.step-badge.done {
  background: #27ae60;
  color: white;
  cursor: pointer;
}
.step-badge:hover {
  animation: pulse 0.6s ease-in-out;
}
@keyframes pulse {
  0% {
    box-shadow: 0 0 0 rgba(255, 255, 255, 0);
  }
  50% {
    box-shadow: 0 0 10px rgba(66, 185, 131, 0.7);
  }
  100% {
    box-shadow: 0 0 0 rgba(255, 255, 255, 0);
  }
}
.line {
  width: 50px;
  height: 2px;
  background: #eee;
  margin: 0 10px;
}

/* SPLIT VIEW */
.split-view {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 20px;
}
@media (max-width: 800px) {
  .split-view {
    grid-template-columns: 1fr;
  }
}

.events-panel {
  background: #f9f9f9;
  padding: 15px;
  border-radius: 8px;
}
.events-panel ul {
  padding-left: 20px;
}
.events-panel li {
  margin-bottom: 10px;
  font-size: 0.95rem;
}

/* T-ACCOUNTS */
.accounts-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  justify-content: center;
}
.t-account {
  background: white;
  width: 220px;
  border: 1px solid #ccc;
  border-radius: 5px;
}
.t-header {
  background: #2c3e50;
  color: white;
  text-align: center;
  padding: 5px;
  font-weight: bold;
  font-size: 0.9rem;
}
.t-body {
  display: flex;
  min-height: 80px;
}
.side {
  flex: 1;
  padding: 5px;
  display: flex;
  flex-direction: column;
  gap: 5px;
}
.divider {
  width: 1px;
  background: #2c3e50;
}
.input-wrap input {
  width: 100%;
  padding: 2px;
  font-size: 0.9rem;
  text-align: right;
}
.input-wrap {
  display: flex;
  gap: 4px;
  align-items: center;
}
.add-btn-mini {
  background: #eee;
  border: none;
  cursor: pointer;
  font-weight: bold;
  color: #555;
  width: 100%;
}
.add-btn-mini:hover {
  background: #ddd;
}
.remove-btn-mini {
  background: #f6d8d8;
  border: none;
  cursor: pointer;
  font-weight: bold;
  color: #b04141;
  padding: 0 8px;
  height: 24px;
  border-radius: 4px;
}
.remove-btn-mini:hover {
  background: #eebfbf;
}
.t-footer {
  background: #f1f1f1;
  text-align: center;
  font-size: 0.85rem;
  padding: 2px;
  font-weight: bold;
}

/* REPORTS */
.reports-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
}
.report-card {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}
.report-card h4 {
  border-bottom: 2px solid #2c3e50;
  padding-bottom: 10px;
  margin-top: 0;
}
.form-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  align-items: center;
}
.form-row label {
  font-size: 0.9rem;
}
.form-row input {
  width: 100px;
  padding: 5px;
  text-align: right;
}
.sum-row {
  display: flex;
  justify-content: space-between;
  font-weight: bold;
  border-top: 1px solid #ccc;
  padding-top: 5px;
  margin-bottom: 15px;
}
.total {
  border-bottom: 3px double #2c3e50;
}
.sub-header {
  font-weight: bold;
  margin: 15px 0 5px 0;
  color: #666;
  font-size: 0.9rem;
  text-transform: uppercase;
}
.mt {
  margin-top: 20px;
}

/* ANALYSIS */
.analysis-form {
  max-width: 500px;
  margin: 0 auto;
  background: white;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
}
.analysis-form.list-mode ul.analysis-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.analysis-form.list-mode ul.analysis-list li label {
  font-weight: 600;
  display: block;
  margin-bottom: 6px;
}
.analysis-form.list-mode ul.analysis-list li input {
  width: 160px;
  padding: 6px 8px;
  border: 1px solid #ccc;
  border-radius: 5px;
  text-align: right;
}
.facit-list {
  list-style: none;
  padding: 0;
  margin: 10px 0 15px;
  columns: 2;
  column-gap: 25px;
}
.facit-list li {
  margin-bottom: 6px;
  font-size: 0.9rem;
}
.analysis-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 18px;
}
.analysis-grid .q-group.wide {
  grid-column: 1 / 3;
}
.analysis-grid textarea {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 5px;
  resize: vertical;
  font-family: inherit;
}
.q-group {
  margin-bottom: 20px;
}
.q-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: bold;
}
.q-group input {
  padding: 10px;
  width: 100%;
  border: 1px solid #ccc;
  border-radius: 5px;
}
.input-suffix {
  display: flex;
  align-items: center;
  gap: 5px;
}
.result-text {
  margin-top: 20px;
  font-weight: bold;
  font-size: 1.1rem;
  text-align: center;
}

/* BUTTONS & ALERTS */
.action-row {
  margin-top: 30px;
  text-align: center;
}
.btn-primary {
  background: #3498db;
  color: white;
  padding: 10px 25px;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  cursor: pointer;
}
.btn-success {
  background: #27ae60;
  color: white;
  padding: 10px 25px;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  cursor: pointer;
}
.btn-secondary {
  background: #555;
  color: #fff;
  padding: 8px 18px;
  border: none;
  border-radius: 5px;
  font-size: 0.9rem;
  cursor: pointer;
  margin-left: 8px;
}
.btn-secondary:hover {
  background: #333;
}
.solution-panel {
  background: #f9f9f9;
  border: 1px solid #ddd;
  padding: 15px;
  border-radius: 8px;
  margin-top: 15px;
  animation: fadeIn 0.3s;
}
.solution-panel ul {
  padding-left: 18px;
}
.solution-panel li {
  margin-bottom: 6px;
  font-size: 0.9rem;
}
.error {
  color: #c0392b;
  font-weight: bold;
}
.success-msg {
  color: #27ae60;
  font-weight: bold;
  margin-bottom: 10px;
}
</style>
