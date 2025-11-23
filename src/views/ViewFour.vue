<script setup>
defineOptions({ name: 'ReportAnalysisView' })
import { ref, computed } from 'vue'

const scenarios = [
  {
    id: 1,
    name: 'Kaffebaren Latte & Co',
    accounts: [
      // 1xxx – Tillgångar
      { label: 'Maskiner', number: '1210', ib: 160000, ub: 190000 },
      { label: 'Inventarier', number: '1220', ib: 100000, ub: 110000 },
      { label: 'Varulager', number: '1460', ib: 50000, ub: 60000 },
      { label: 'Kundfordringar', number: '1510', ib: 90000, ub: 80000 },
      { label: 'Kassa', number: '1910', ib: 30000, ub: 30000 },
      { label: 'Bank', number: '1930', ib: 40000, ub: 200000 },

      // 2xxx – Eget kapital & skulder
      { label: 'Aktiekapital', number: '2081', ib: 25000, ub: 25000 },
      { label: 'Årets resultat', number: '2099', ib: 0, ub: 300000 },
      { label: 'Banklån', number: '2350', ib: 320000, ub: 220000 },
      { label: 'Leverantörsskulder', number: '2440', ib: 70000, ub: 60000 },
      { label: 'Personalskatt', number: '2710', ib: 25000, ub: 25000 },
      { label: 'Sociala avgifter', number: '2730', ib: 30000, ub: 40000 },

      // 3xxx–8xxx – Resultatkonton (årsbelopp, IB = 0)
      { label: 'Varuförsäljning', number: '3001', ib: 0, ub: 1200000 },
      { label: 'Varuinköp', number: '4010', ib: 0, ub: 480000 },
      { label: 'Lokalhyra', number: '5010', ib: 0, ub: 180000 },
      { label: 'Kontorsmaterial', number: '6040', ib: 0, ub: 25000 },
      { label: 'Löner', number: '7010', ib: 0, ub: 140000 },
      { label: 'Arbetsgivaravgifter', number: '7510', ib: 0, ub: 35000 },
      { label: 'Avskrivningar', number: '7810', ib: 0, ub: 15000 },
      { label: 'Räntekostnader', number: '8410', ib: 0, ub: 25000 },
    ],
    solutions: {
      // Dessa tre använder du i resultaträkningen
      result: {
        nettoomsattning: 1200000,
        kostnader: 900000,
        aretsResultat: 300000,
      },
      // Dessa används i balans-rättningen
      balance: {
        tillgangar: 670000,
        egetKapital: 325000,
        skulder: 345000,
      },
      // Kassaflöde – används bara för rättning, inte direkt kopplat till alla konton här
      cashflow: {
        lopande: 260000,
        investering: -80000,
        finansiering: -20000,
        total: 160000,
      },
      // Nyckeltal baserat på ovan
      ratios: {
        rorelsemarginal: 25.0,
        soliditet: 48.5,
        kassalikviditet: 2.48,
      },
    },
  },
  {
    id: 2,
    name: 'Webbyrån Pixelpunk AB',
    accounts: [
      // 1xxx – Tillgångar
      { label: 'Maskiner', number: '1210', ib: 140000, ub: 150000 },
      { label: 'Inventarier', number: '1220', ib: 80000, ub: 90000 },
      { label: 'Varulager', number: '1460', ib: 60000, ub: 70000 },
      { label: 'Kundfordringar', number: '1510', ib: 100000, ub: 110000 },
      { label: 'Kassa', number: '1910', ib: 15000, ub: 20000 },
      { label: 'Bank', number: '1930', ib: 120000, ub: 160000 },

      // 2xxx – Eget kapital & skulder
      { label: 'Aktiekapital', number: '2081', ib: 25000, ub: 25000 },
      { label: 'Årets resultat', number: '2099', ib: 0, ub: 260000 },
      { label: 'Banklån', number: '2350', ib: 230000, ub: 210000 },
      { label: 'Leverantörsskulder', number: '2440', ib: 60000, ub: 55000 },
      { label: 'Personalskatt', number: '2710', ib: 18000, ub: 20000 },
      { label: 'Sociala avgifter', number: '2730', ib: 27000, ub: 30000 },

      // 3xxx–8xxx – Resultatkonton (årsbelopp, IB = 0)
      { label: 'Varuförsäljning', number: '3001', ib: 0, ub: 1100000 },
      { label: 'Varuinköp', number: '4010', ib: 0, ub: 426000 },
      { label: 'Lokalhyra', number: '5010', ib: 0, ub: 200000 },
      { label: 'Kontorsmaterial', number: '6040', ib: 0, ub: 30000 },
      { label: 'Löner', number: '7010', ib: 0, ub: 120000 },
      { label: 'Arbetsgivaravgifter', number: '7510', ib: 0, ub: 32000 },
      { label: 'Avskrivningar', number: '7810', ib: 0, ub: 18000 },
      { label: 'Räntekostnader', number: '8410', ib: 0, ub: 14000 },
    ],
    solutions: {
      result: {
        nettoomsattning: 1100000,
        kostnader: 840000,
        aretsResultat: 260000,
      },
      balance: {
        tillgangar: 600000,
        egetKapital: 285000,
        skulder: 315000,
      },
      cashflow: {
        lopande: 110000,
        investering: -40000,
        finansiering: -25000,
        total: 45000,
      },
      ratios: {
        rorelsemarginal: 23.6,
        soliditet: 47.5,
        kassalikviditet: 2.76,
      },
    },
  },

  {
    id: 3,
    name: 'Gymmet Starkare NU AB',
    accounts: [
      // 1xxx – Tillgångar
      { label: 'Maskiner', number: '1210', ib: 190000, ub: 210000 },
      { label: 'Inventarier', number: '1220', ib: 120000, ub: 130000 },
      { label: 'Varulager', number: '1460', ib: 85000, ub: 80000 },
      { label: 'Kundfordringar', number: '1510', ib: 125000, ub: 130000 },
      { label: 'Kassa', number: '1910', ib: 20000, ub: 25000 },
      { label: 'Bank', number: '1930', ib: 115000, ub: 150000 },

      // 2xxx – Eget kapital & skulder
      { label: 'Aktiekapital', number: '2081', ib: 40000, ub: 40000 },
      { label: 'Årets resultat', number: '2099', ib: 0, ub: 310000 },
      { label: 'Banklån', number: '2350', ib: 280000, ub: 260000 },
      { label: 'Leverantörsskulder', number: '2440', ib: 55000, ub: 60000 },
      { label: 'Personalskatt', number: '2710', ib: 18000, ub: 20000 },
      { label: 'Sociala avgifter', number: '2730', ib: 30000, ub: 35000 },

      // 3xxx–8xxx – Resultatkonton (årsbelopp, IB = 0)
      { label: 'Varuförsäljning', number: '3001', ib: 0, ub: 1300000 },
      { label: 'Varuinköp', number: '4010', ib: 0, ub: 520000 },
      { label: 'Lokalhyra', number: '5010', ib: 0, ub: 210000 },
      { label: 'Kontorsmaterial', number: '6040', ib: 0, ub: 28000 },
      { label: 'Löner', number: '7010', ib: 0, ub: 150000 },
      { label: 'Arbetsgivaravgifter', number: '7510', ib: 0, ub: 37000 },
      { label: 'Avskrivningar', number: '7810', ib: 0, ub: 20000 },
      { label: 'Räntekostnader', number: '8410', ib: 0, ub: 25000 },
    ],
    solutions: {
      result: {
        nettoomsattning: 1300000,
        kostnader: 990000,
        aretsResultat: 310000,
      },
      balance: {
        tillgangar: 725000,
        egetKapital: 350000,
        skulder: 375000,
      },
      cashflow: {
        lopande: 130000,
        investering: -50000,
        finansiering: -40000,
        total: 40000,
      },
      ratios: {
        rorelsemarginal: 23.8,
        soliditet: 48.3,
        kassalikviditet: 2.65,
      },
    },
  },

  {
    id: 4,
    name: 'Frisören Klipp & Färg',
    accounts: [
      // 1xxx – Tillgångar
      { label: 'Maskiner', number: '1210', ib: 160000, ub: 170000 },
      { label: 'Inventarier', number: '1220', ib: 110000, ub: 120000 },
      { label: 'Varulager', number: '1460', ib: 70000, ub: 75000 },
      { label: 'Kundfordringar', number: '1510', ib: 85000, ub: 90000 },
      { label: 'Kassa', number: '1910', ib: 18000, ub: 22000 },
      { label: 'Bank', number: '1930', ib: 120000, ub: 153000 },

      // 2xxx – Eget kapital & skulder
      { label: 'Aktiekapital', number: '2081', ib: 30000, ub: 30000 },
      { label: 'Årets resultat', number: '2099', ib: 0, ub: 270000 },
      { label: 'Banklån', number: '2350', ib: 230000, ub: 210000 },
      { label: 'Leverantörsskulder', number: '2440', ib: 60000, ub: 55000 },
      { label: 'Personalskatt', number: '2710', ib: 19000, ub: 20000 },
      { label: 'Sociala avgifter', number: '2730', ib: 35000, ub: 45000 },

      // 3xxx–8xxx – Resultatkonton (årsbelopp, IB = 0)
      { label: 'Varuförsäljning', number: '3001', ib: 0, ub: 1050000 },
      { label: 'Varuinköp', number: '4010', ib: 0, ub: 370000 },
      { label: 'Lokalhyra', number: '5010', ib: 0, ub: 190000 },
      { label: 'Kontorsmaterial', number: '6040', ib: 0, ub: 25000 },
      { label: 'Löner', number: '7010', ib: 0, ub: 120000 },
      { label: 'Arbetsgivaravgifter', number: '7510', ib: 0, ub: 36000 },
      { label: 'Avskrivningar', number: '7810', ib: 0, ub: 16000 },
      { label: 'Räntekostnader', number: '8410', ib: 0, ub: 23000 },
    ],
    solutions: {
      result: {
        nettoomsattning: 1050000,
        kostnader: 780000,
        aretsResultat: 270000,
      },
      balance: {
        tillgangar: 630000,
        egetKapital: 300000,
        skulder: 330000,
      },
      cashflow: {
        lopande: 95000,
        investering: -30000,
        finansiering: -28000,
        total: 37000,
      },
      ratios: {
        rorelsemarginal: 25.7,
        soliditet: 47.6,
        kassalikviditet: 2.21,
      },
    },
  },

  {
    id: 5,
    name: 'Bageriet Surdeg & Co',
    accounts: [
      // 1xxx – Tillgångar
      { label: 'Maskiner', number: '1210', ib: 185000, ub: 200000 },
      { label: 'Inventarier', number: '1220', ib: 130000, ub: 140000 },
      { label: 'Varulager', number: '1460', ib: 60000, ub: 65000 },
      { label: 'Kundfordringar', number: '1510', ib: 105000, ub: 115000 },
      { label: 'Kassa', number: '1910', ib: 21000, ub: 26000 },
      { label: 'Bank', number: '1930', ib: 130000, ub: 164000 },

      // 2xxx – Eget kapital & skulder
      { label: 'Aktiekapital', number: '2081', ib: 40000, ub: 40000 },
      { label: 'Årets resultat', number: '2099', ib: 0, ub: 290000 },
      { label: 'Banklån', number: '2350', ib: 250000, ub: 230000 },
      { label: 'Leverantörsskulder', number: '2440', ib: 65000, ub: 60000 },
      { label: 'Personalskatt', number: '2710', ib: 20000, ub: 22000 },
      { label: 'Sociala avgifter', number: '2730', ib: 60000, ub: 68000 },

      // 3xxx–8xxx – Resultatkonton (årsbelopp, IB = 0)
      { label: 'Varuförsäljning', number: '3001', ib: 0, ub: 1200000 },
      { label: 'Varuinköp', number: '4010', ib: 0, ub: 480000 },
      { label: 'Lokalhyra', number: '5010', ib: 0, ub: 195000 },
      { label: 'Kontorsmaterial', number: '6040', ib: 0, ub: 26000 },
      { label: 'Löner', number: '7010', ib: 0, ub: 125000 },
      { label: 'Arbetsgivaravgifter', number: '7510', ib: 0, ub: 38000 },
      { label: 'Avskrivningar', number: '7810', ib: 0, ub: 18000 },
      { label: 'Räntekostnader', number: '8410', ib: 0, ub: 28000 },
    ],
    solutions: {
      result: {
        nettoomsattning: 1200000,
        kostnader: 910000,
        aretsResultat: 290000,
      },
      balance: {
        tillgangar: 710000,
        egetKapital: 330000,
        skulder: 380000,
      },
      cashflow: {
        lopande: 120000,
        investering: -50000,
        finansiering: -31000,
        total: 39000,
      },
      ratios: {
        rorelsemarginal: 24.2,
        soliditet: 46.5,
        kassalikviditet: 2.03,
      },
    },
  },
]

// --- state ---
const currentScenarioIndex = ref(0)
const currentScenario = computed(() => scenarios[currentScenarioIndex.value])

// vilken räkning är öppen?
const activeSection = ref('result')

// status för varje räkning (null = ej rättad, true = rätt, false = fel)
const sectionStatus = ref({
  result: null,
  balance: null,
  cashflow: null,
  ratios: null,
})

const activeSectionLabel = computed(() => {
  switch (activeSection.value) {
    case 'result':
      return 'Resultaträkning'
    case 'balance':
      return 'Balansräkning'
    case 'cashflow':
      return 'Kassaflödesanalys'
    case 'ratios':
      return 'Räkenskapsanalys / nyckeltal'
    default:
      return ''
  }
})

// användarens svar
const rrUser = ref({
  nettoomsattning: '',
  kostnader: '',
  aretsResultat: '',
})

const brUser = ref({
  tillgangar: '',
  ekSkulder: '',
})

const cfUser = ref({
  lopande: '',
  investering: '',
  finansiering: '',
  total: '',
})

const ratioUser = ref({
  rorelsemarginal: '',
  soliditet: '',
  kassalikviditet: '',
})

// feedback
const rrFeedbackMsg = ref('')
const rrFeedbackType = ref('') // success | error
const brFeedbackMsg = ref('')
const brFeedbackType = ref('')
const cfFeedbackMsg = ref('')
const cfFeedbackType = ref('')
const ratioFeedbackMsg = ref('')
const ratioFeedbackType = ref('')

// helpers
const formatCurrency = (val) => {
  if (val === null || val === undefined) return '–'
  return val.toLocaleString('sv-SE')
}

const compareSection = (userObj, solObj, tolerance = 0) => {
  return Object.keys(solObj).every((key) => {
    const correct = Number(solObj[key])
    const given = Number(userObj[key] || 0)
    return Math.abs(given - correct) <= tolerance
  })
}

// --- Mini calculator helpers ---
const containsOperator = (val) => /[+\-*/%]/.test(String(val))

const isSafeExpression = (s) => {
  // allow digits, operators, parentheses, dots/commas, percent and whitespace
  return /^[0-9+\-*/().,%\s]+$/.test(String(s))
}

const evaluateExpressionString = (s) => {
  if (!s) return null
  let cleaned = String(s).trim()
  // Normalize comma to dot for decimals
  cleaned = cleaned.replace(/,/g, '.')
  if (!isSafeExpression(cleaned)) return null

  // Replace occurrences like 10% with (10/100)
  cleaned = cleaned.replace(/(\d+(?:\.\d+)?)%/g, '($1/100)')

  try {
    const res = Function('"use strict"; return (' + cleaned + ')')()
    if (typeof res === 'number' && Number.isFinite(res)) {
      return Math.round(res * 100) / 100
    }
  } catch {
    return null
  }
  return null
}

const showCalc = (objRef, key) => {
  const val = objRef && objRef.value ? objRef.value[key] : ''
  const str = String(val ?? '')
  return containsOperator(str)
}

const evaluateAllVisible = () => {
  // Evaluate all fields in rrUser, brUser, cfUser, ratioUser
  Object.keys(rrUser.value).forEach((k) => evaluateField(rrUser, k))
  Object.keys(brUser.value).forEach((k) => evaluateField(brUser, k))
  Object.keys(cfUser.value).forEach((k) => evaluateField(cfUser, k))
  Object.keys(ratioUser.value).forEach((k) => evaluateField(ratioUser, k))
}

const anyFieldHasExpr = computed(() => {
  const all = [rrUser.value, brUser.value, cfUser.value, ratioUser.value]
  return all.some((obj) => Object.values(obj).some((v) => containsOperator(String(v ?? ''))))
})

const evaluateField = (objRef, key) => {
  const raw = objRef && objRef.value ? objRef.value[key] : ''
  const result = evaluateExpressionString(raw)
  if (result !== null) {
    objRef.value[key] = result
  }
}

const resetAnswers = () => {
  rrUser.value = { nettoomsattning: '', kostnader: '', aretsResultat: '' }
  brUser.value = { tillgangar: '', ekSkulder: '' }
  cfUser.value = { lopande: '', investering: '', finansiering: '', total: '' }
  ratioUser.value = { rorelsemarginal: '', soliditet: '', kassalikviditet: '' }

  rrFeedbackMsg.value = ''
  rrFeedbackType.value = ''
  brFeedbackMsg.value = ''
  brFeedbackType.value = ''
  cfFeedbackMsg.value = ''
  cfFeedbackType.value = ''
  ratioFeedbackMsg.value = ''
  ratioFeedbackType.value = ''

  sectionStatus.value = {
    result: null,
    balance: null,
    cashflow: null,
    ratios: null,
  }

  activeSection.value = 'result'
}

const goToScenario = (index) => {
  if (index < 0 || index >= scenarios.length) return
  currentScenarioIndex.value = index
  resetAnswers()
}

const nextScenario = () => {
  if (currentScenarioIndex.value < scenarios.length - 1) {
    goToScenario(currentScenarioIndex.value + 1)
  } else {
    goToScenario(0)
  }
}

const prevScenario = () => {
  if (currentScenarioIndex.value > 0) {
    goToScenario(currentScenarioIndex.value - 1)
  } else {
    goToScenario(scenarios.length - 1)
  }
}

// --- rättnings-funktioner ---

const checkResult = () => {
  const ok = compareSection(rrUser.value, currentScenario.value.solutions.result, 0)
  sectionStatus.value.result = ok
  if (ok) {
    rrFeedbackType.value = 'success'
    rrFeedbackMsg.value = 'Resultaträkningen är korrekt.'
  } else {
    rrFeedbackType.value = 'error'
    rrFeedbackMsg.value = 'Resultaträkningen stämmer inte med scenariot.'
  }
}

const checkBalance = () => {
  const sol = currentScenario.value.solutions.balance
  const expectedAssets = Number(sol.tillgangar || 0)
  const expectedEkSkulder = Number(sol.egetKapital || 0) + Number(sol.skulder || 0)

  const givenAssets = Number(brUser.value.tillgangar || 0)
  const givenEkSkulder = Number(brUser.value.ekSkulder || 0)

  const okAssets = Math.abs(givenAssets - expectedAssets) <= 0
  const okEkSkulder = Math.abs(givenEkSkulder - expectedEkSkulder) <= 0
  const ok = okAssets && okEkSkulder

  sectionStatus.value.balance = ok
  if (ok) {
    brFeedbackType.value = 'success'
    brFeedbackMsg.value = 'Balansräkningen är korrekt.'
  } else {
    brFeedbackType.value = 'error'
    brFeedbackMsg.value = 'Balansräkningen stämmer inte med bokslutet.'
  }
}

const checkCashflow = () => {
  const ok = compareSection(cfUser.value, currentScenario.value.solutions.cashflow, 0)
  sectionStatus.value.cashflow = ok
  if (ok) {
    cfFeedbackType.value = 'success'
    cfFeedbackMsg.value = 'Kassaflödesanalysen är korrekt.'
  } else {
    cfFeedbackType.value = 'error'
    cfFeedbackMsg.value = 'Kassaflödet stämmer inte.'
  }
}

const checkRatios = () => {
  const sol = currentScenario.value.solutions.ratios
  const user = ratioUser.value

  const okMargin = Math.abs(Number(user.rorelsemarginal || 0) - sol.rorelsemarginal) <= 0.1
  const okSol = Math.abs(Number(user.soliditet || 0) - sol.soliditet) <= 0.1
  const okKassa = Math.abs(Number(user.kassalikviditet || 0) - sol.kassalikviditet) <= 0.02

  const ok = okMargin && okSol && okKassa
  sectionStatus.value.ratios = ok

  if (ok) {
    ratioFeedbackType.value = 'success'
    ratioFeedbackMsg.value = 'Alla nyckeltal är korrekta.'
  } else {
    ratioFeedbackType.value = 'error'
    ratioFeedbackMsg.value = 'Minst ett nyckeltal är fel.'
  }
}
</script>

<template>
  <div class="analysis-view">
    <div class="page-header">
      <h1>Räkna på rapporter &amp; analyser</h1>
    </div>

    <!-- Scenario-väljare -->
    <div class="scenario-bar">
      <button class="nav-btn" @click="prevScenario">⬅ Föregående</button>

      <div class="scenario-select">
        <label for="scenario">Scenario</label>
        <select id="scenario" v-model.number="currentScenarioIndex" @change="resetAnswers">
          <option v-for="(s, idx) in scenarios" :key="s.id" :value="idx">
            {{ s.id }}. {{ s.name }}
          </option>
        </select>
      </div>

      <button class="nav-btn" @click="nextScenario">Nästa ➡</button>
    </div>

    <!-- Bokslutstabell -->
    <div class="card">
      <div class="card-header">
        <h2>Bokslut (IB / UB)</h2>
      </div>

      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Konto</th>
              <th>Kontonummer</th>
              <th>IB</th>
              <th>UB</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="acc in currentScenario.accounts" :key="acc.label">
              <td>{{ acc.label }}</td>
              <td class="acct-number">{{ acc.number }}</td>
              <td class="num">{{ formatCurrency(acc.ib) }}</td>
              <td class="num">{{ formatCurrency(acc.ub) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Lista med alla räkningar -->
    <div class="tasks-row">
      <div
        class="task-item"
        :class="{
          active: activeSection === 'result',
          done: sectionStatus.result === true,
        }"
        @click="activeSection = 'result'"
      >
        <span>Resultaträkning</span>
      </div>

      <div
        class="task-item"
        :class="{
          active: activeSection === 'balance',
          done: sectionStatus.balance === true,
        }"
        @click="activeSection = 'balance'"
      >
        <span>Balansräkning</span>
      </div>

      <div
        class="task-item"
        :class="{
          active: activeSection === 'cashflow',
          done: sectionStatus.cashflow === true,
        }"
        @click="activeSection = 'cashflow'"
      >
        <span>Kassaflödesanalys</span>
      </div>

      <div
        class="task-item"
        :class="{
          active: activeSection === 'ratios',
          done: sectionStatus.ratios === true,
        }"
        @click="activeSection = 'ratios'"
      >
        <span>Räkenskapsanalys / nyckeltal</span>
      </div>
    </div>

    <div class="current-section-center" v-if="activeSection">
      {{ activeSectionLabel }}
    </div>

    <!-- Aktiv räkning -->
    <div class="card calc-card" v-if="activeSection === 'result'">
      <div class="card-header">
        <h2>Resultaträkning</h2>
      </div>

      <div class="form-group">
        <label>Nettoomsättning (kr)</label>
        <div class="calc-input">
          <input
            v-model="rrUser.nettoomsattning"
            type="text"
            placeholder="Belopp i kr"
            @keydown.enter.prevent="evaluateField(rrUser, 'nettoomsattning')"
          />
          <button
            v-if="showCalc(rrUser, 'nettoomsattning')"
            class="btn-calc"
            @click="evaluateField(rrUser, 'nettoomsattning')"
          >
            Räkna
          </button>
        </div>
      </div>
      <div class="form-group">
        <label>Totala kostnader (kr)</label>
        <div class="calc-input">
          <input
            v-model="rrUser.kostnader"
            type="text"
            placeholder="Belopp i kr"
            @keydown.enter.prevent="evaluateField(rrUser, 'kostnader')"
          />
          <button
            v-if="showCalc(rrUser, 'kostnader')"
            class="btn-calc"
            @click="evaluateField(rrUser, 'kostnader')"
          >
            Räkna
          </button>
        </div>
      </div>
      <div class="form-group">
        <label>Årets resultat (kr)</label>
        <div class="calc-input">
          <input
            v-model="rrUser.aretsResultat"
            type="text"
            placeholder="Belopp i kr"
            @keydown.enter.prevent="evaluateField(rrUser, 'aretsResultat')"
          />
          <button
            v-if="showCalc(rrUser, 'aretsResultat')"
            class="btn-calc"
            @click="evaluateField(rrUser, 'aretsResultat')"
          >
            Räkna
          </button>
        </div>
      </div>

      <button class="btn-check" @click="checkResult">Rätta</button>

      <div v-if="rrFeedbackMsg" :class="['feedback', rrFeedbackType]">
        {{ rrFeedbackMsg }}
      </div>
    </div>

    <div class="card calc-card" v-else-if="activeSection === 'balance'">
      <div class="card-header">
        <h2>Balansräkning</h2>
      </div>

      <div class="form-group">
        <label>Summa tillgångar (UB)</label>
        <div class="calc-input">
          <input
            v-model="brUser.tillgangar"
            type="text"
            placeholder="Belopp i kr"
            @keydown.enter.prevent="evaluateField(brUser, 'tillgangar')"
          />
          <button
            v-if="showCalc(brUser, 'tillgangar')"
            class="btn-calc"
            @click="evaluateField(brUser, 'tillgangar')"
          >
            Räkna
          </button>
        </div>
      </div>
      <div class="form-group">
        <label>Summa eget kapital + skulder (UB)</label>
        <div class="calc-input">
          <input
            v-model="brUser.ekSkulder"
            type="text"
            placeholder="Belopp i kr"
            @keydown.enter.prevent="evaluateField(brUser, 'ekSkulder')"
          />
          <button
            v-if="showCalc(brUser, 'ekSkulder')"
            class="btn-calc"
            @click="evaluateField(brUser, 'ekSkulder')"
          >
            Räkna
          </button>
        </div>
      </div>

      <button class="btn-check" @click="checkBalance">Rätta</button>

      <div v-if="brFeedbackMsg" :class="['feedback', brFeedbackType]">
        {{ brFeedbackMsg }}
      </div>
    </div>

    <div class="card calc-card" v-else-if="activeSection === 'cashflow'">
      <div class="card-header">
        <h2>Kassaflödesanalys</h2>
      </div>

      <div class="form-group">
        <label>Kassaflöde från löpande verksamheten (kr)</label>
        <div class="calc-input">
          <input
            v-model="cfUser.lopande"
            type="text"
            placeholder="Belopp i kr"
            @keydown.enter.prevent="evaluateField(cfUser, 'lopande')"
          />
          <button
            v-if="showCalc(cfUser, 'lopande')"
            class="btn-calc"
            @click="evaluateField(cfUser, 'lopande')"
          >
            Räkna
          </button>
        </div>
      </div>
      <div class="form-group">
        <label>Kassaflöde från investeringsverksamheten (kr)</label>
        <div class="calc-input">
          <input
            v-model="cfUser.investering"
            type="text"
            placeholder="Belopp i kr"
            @keydown.enter.prevent="evaluateField(cfUser, 'investering')"
          />
          <button
            v-if="showCalc(cfUser, 'investering')"
            class="btn-calc"
            @click="evaluateField(cfUser, 'investering')"
          >
            Räkna
          </button>
        </div>
      </div>
      <div class="form-group">
        <label>Kassaflöde från finansieringsverksamheten (kr)</label>
        <div class="calc-input">
          <input
            v-model="cfUser.finansiering"
            type="text"
            placeholder="Belopp i kr"
            @keydown.enter.prevent="evaluateField(cfUser, 'finansiering')"
          />
          <button
            v-if="showCalc(cfUser, 'finansiering')"
            class="btn-calc"
            @click="evaluateField(cfUser, 'finansiering')"
          >
            Räkna
          </button>
        </div>
      </div>
      <div class="form-group">
        <label>Årets totala kassaflöde (kr)</label>
        <div class="calc-input">
          <input
            v-model="cfUser.total"
            type="text"
            placeholder="Belopp i kr"
            @keydown.enter.prevent="evaluateField(cfUser, 'total')"
          />
          <button
            v-if="showCalc(cfUser, 'total')"
            class="btn-calc"
            @click="evaluateField(cfUser, 'total')"
          >
            Räkna
          </button>
        </div>
      </div>

      <button class="btn-check" @click="checkCashflow">Rätta</button>

      <div v-if="cfFeedbackMsg" :class="['feedback', cfFeedbackType]">
        {{ cfFeedbackMsg }}
      </div>
    </div>

    <div class="card calc-card" v-else-if="activeSection === 'ratios'">
      <div class="card-header">
        <h2>Räkenskapsanalys / nyckeltal</h2>
      </div>

      <div class="form-group">
        <label>Rörelsemarginal (%)</label>
        <div class="calc-input">
          <input
            v-model="ratioUser.rorelsemarginal"
            type="text"
            placeholder="Procent"
            @keydown.enter.prevent="evaluateField(ratioUser, 'rorelsemarginal')"
          />
          <button
            v-if="showCalc(ratioUser, 'rorelsemarginal')"
            class="btn-calc"
            @click="evaluateField(ratioUser, 'rorelsemarginal')"
          >
            Räkna
          </button>
        </div>
      </div>
      <div class="form-group">
        <label>Soliditet (%)</label>
        <div class="calc-input">
          <input
            v-model="ratioUser.soliditet"
            type="text"
            placeholder="Procent"
            @keydown.enter.prevent="evaluateField(ratioUser, 'soliditet')"
          />
          <button
            v-if="showCalc(ratioUser, 'soliditet')"
            class="btn-calc"
            @click="evaluateField(ratioUser, 'soliditet')"
          >
            Räkna
          </button>
        </div>
      </div>
      <div class="form-group">
        <label>Kassalikviditet (kvot)</label>
        <div class="calc-input">
          <input
            v-model="ratioUser.kassalikviditet"
            type="text"
            placeholder="Kvot"
            @keydown.enter.prevent="evaluateField(ratioUser, 'kassalikviditet')"
          />
          <button
            v-if="showCalc(ratioUser, 'kassalikviditet')"
            class="btn-calc"
            @click="evaluateField(ratioUser, 'kassalikviditet')"
          >
            Räkna
          </button>
        </div>
      </div>

      <button class="btn-check" @click="checkRatios">Rätta</button>

      <div v-if="ratioFeedbackMsg" :class="['feedback', ratioFeedbackType]">
        {{ ratioFeedbackMsg }}
      </div>
    </div>

    <!-- Rensa-knapp -->
    <div class="bottom-actions">
      <button class="btn-reset" @click="resetAnswers">Rensa alla svar</button>
      <button v-if="anyFieldHasExpr" class="btn-calc" @click="evaluateAllVisible">
        Räkna alla
      </button>
    </div>
  </div>
</template>

<style scoped>
.analysis-view {
  max-width: 1150px;
  margin: 0 auto;
  padding: 20px;
}

.page-header h1 {
  margin: 0 0 16px;
  color: #2c3e50;
}

.current-section-center {
  text-align: center;
  margin: 8px 0 12px;
  font-weight: 700;
  color: #2c3e50;
  font-size: 1rem;
}

.scenario-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 18px;
}

.scenario-select {
  display: flex;
  align-items: center;
  gap: 8px;
}

.scenario-select label {
  font-size: 0.9rem;
  font-weight: 600;
}

.scenario-select select {
  padding: 6px 10px;
  border-radius: 6px;
  border: 1px solid #ddd;
  min-width: 260px;
}

.nav-btn {
  border: none;
  background-color: #ecf0f1;
  padding: 7px 14px;
  border-radius: 999px;
  cursor: pointer;
  font-weight: 600;
  color: #2c3e50;
}

/* Cards */
.card {
  background: white;
  border-radius: 12px;
  padding: 16px 18px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
  margin-bottom: 16px;
}

.card-header h2 {
  margin: 0 0 8px;
  color: #2c3e50;
}

/* Bokslutstabell */
.table-wrapper {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;
}

th,
td {
  padding: 7px 9px;
  border-bottom: 1px solid #eee;
  text-align: left;
}

th {
  background-color: #f5f7f9;
  font-weight: 600;
}

td.num {
  text-align: right;
}

.acct-number {
  text-align: center;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, 'Roboto Mono', 'Courier New', monospace;
  color: #333;
}

/* Task list */
.tasks-row {
  display: flex;
  gap: 10px;
  margin: 10px 0 16px;
  flex-wrap: wrap;
  justify-content: center;
}

.task-item {
  flex: 0 1 auto;
  min-width: 160px;
  padding: 10px 12px;
  border-radius: 10px;
  background: #ffffff;
  border: 1px solid #dcdcdc;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.95rem;
  display: flex;
  justify-content: center;
  align-items: center;
  transition:
    background-color 0.15s,
    border-color 0.15s,
    transform 0.15s;
}

.task-item.active {
  border-color: #42b883;
  transform: translateY(-1px);
}

.task-item.done {
  background-color: #e7f7ee;
  border-color: #42b883;
}

/* Forms */
.calc-card {
  max-width: 520px;
  margin: 0 auto;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 10px;
}

.calc-input {
  display: flex;
  gap: 8px;
  align-items: center;
}

.btn-calc {
  padding: 6px 10px;
  border-radius: 999px;
  border: none;
  background: #2b6cb0;
  color: white;
  cursor: pointer;
  font-weight: 600;
}

label {
  font-size: 0.85rem;
  color: #555;
  font-weight: 600;
}

input[type='number'] {
  padding: 7px 9px;
  border-radius: 6px;
  border: 1px solid #dcdcdc;
  font-size: 0.95rem;
}

/* Buttons & feedback */
.btn-check {
  margin-top: 8px;
  padding: 8px 18px;
  border-radius: 999px;
  border: none;
  background-color: #42b883;
  color: white;
  font-weight: 600;
  cursor: pointer;
}

.feedback {
  margin-top: 10px;
  padding: 9px 11px;
  border-radius: 8px;
  font-size: 0.9rem;
}

.feedback.success {
  background-color: #d4edda;
  color: #155724;
}

.feedback.error {
  background-color: #f8d7da;
  color: #721c24;
}

.bottom-actions {
  margin-top: 10px;
  display: flex;
  justify-content: center;
}

.btn-reset {
  background: #ecf0f1;
  border: none;
  border-radius: 999px;
  padding: 7px 16px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  color: #2c3e50;
}

@media (max-width: 800px) {
  .scenario-bar {
    flex-direction: column;
    align-items: stretch;
  }

  .tasks-row {
    flex-direction: column;
  }
}
</style>
