<script setup>
import { reactive, ref, computed, onMounted } from 'vue'

// Fullskalig RR & BR med relevanta konton, samt totals
const scenario = reactive({
  company: '',
  periodLabel: '2021–2022',
  rr: {
    nettoomsattning: 0,
    handelsvaror: 0,
    ovrigaExterna: 0,
    personalkostnader: 0,
    avskrivningar: 0,
    ovrigaRorelsekostnader: 0,
    rorelseresultat: 0,
    finansiellaIntakter: 0,
    finansiellaKostnader: 0,
    resultatForeSkatt: 0,
    skatt: 0,
    aretsResultat: 0,
  },
  brPrev: {
    materiella: 0,
    finansiellaAT: 0,
    varulager: 0,
    kundfordringar: 0,
    ovrigaFordringar: 0,
    forutbetalda: 0,
    kassaBank: 0,
    summaTillgangar: 0,
  },
  brCurr: {
    materiella: 0,
    finansiellaAT: 0,
    varulager: 0,
    kundfordringar: 0,
    ovrigaFordringar: 0,
    forutbetalda: 0,
    kassaBank: 0,
    summaTillgangar: 0,
  },
})

const userAnswer = ref('')
const resultText = ref('')
const success = ref(false)
const showSolution = ref(false)

function rand(step, min, max) {
  const steps = Math.floor((max - min) / step)
  return min + Math.floor(Math.random() * (steps + 1)) * step
}

function generateScenario() {
  scenario.company = `Företag ${String.fromCharCode(65 + Math.floor(Math.random() * 26))} AB`
  const oms = rand(10_000, 10_000_000, 30_000_000)
  const hv = Math.round((oms * (0.35 + Math.random() * 0.3)) / 1_000) * 1_000
  const oe = Math.round((oms * (0.05 + Math.random() * 0.1)) / 1_000) * 1_000
  const pk = Math.round((oms * (0.1 + Math.random() * 0.15)) / 1_000) * 1_000
  const av = Math.round((oms * (0.01 + Math.random() * 0.04)) / 1_000) * 1_000
  const ork = Math.round((oms * (Math.random() * 0.05)) / 1_000) * 1_000
  const fi = rand(5_000, 0, 400_000)
  const fk = rand(5_000, 0, 400_000)

  const rr = oms - hv - oe - pk - av - ork
  const rfs = rr + fi - fk
  const skatt = rfs > 0 ? Math.round((rfs * 0.2) / 1_000) * 1_000 : 0
  const ar = rfs - skatt

  const totPrev = rand(10_000, 8_000_000, 18_000_000)
  const totCurr = Math.round((totPrev * (0.85 + Math.random() * 0.4)) / 10_000) * 10_000

  function dist(sum) {
    const m = Math.round((sum * 0.55) / 10_000) * 10_000
    const f = Math.round((sum * 0.05) / 10_000) * 10_000
    const vl = Math.round((sum * 0.08) / 10_000) * 10_000
    const kf = Math.round((sum * 0.06) / 10_000) * 10_000
    const of = Math.round((sum * 0.07) / 10_000) * 10_000
    const fb = Math.round((sum * 0.09) / 10_000) * 10_000
    const kb = sum - (m + f + vl + kf + of + fb)
    return {
      materiella: m,
      finansiellaAT: f,
      varulager: vl,
      kundfordringar: kf,
      ovrigaFordringar: of,
      forutbetalda: fb,
      kassaBank: kb,
      summaTillgangar: sum,
    }
  }

  scenario.rr = {
    nettoomsattning: oms,
    handelsvaror: hv,
    ovrigaExterna: oe,
    personalkostnader: pk,
    avskrivningar: av,
    ovrigaRorelsekostnader: ork,
    rorelseresultat: rr,
    finansiellaIntakter: fi,
    finansiellaKostnader: fk,
    resultatForeSkatt: rfs,
    skatt,
    aretsResultat: ar,
  }
  scenario.brPrev = dist(totPrev)
  scenario.brCurr = dist(totCurr)

  userAnswer.value = ''
  resultText.value = ''
  success.value = false
  showSolution.value = false
}

onMounted(generateScenario)

const genomsnittTotKap = computed(
  () => (scenario.brPrev.summaTillgangar + scenario.brCurr.summaTillgangar) / 2,
)
const numerator = computed(() => scenario.rr.rorelseresultat + scenario.rr.finansiellaIntakter)
const rtot = computed(() => numerator.value / genomsnittTotKap.value)
const rtotPctText = computed(() => `${(rtot.value * 100).toFixed(1)}%`)

function check() {
  const expected = Number((rtot.value * 100).toFixed(1))
  const ans = Number(userAnswer.value)
  if (Number.isFinite(ans) && Math.abs(ans - expected) < 0.05) {
    success.value = true
    resultText.value = 'Rätt svar! 🎉'
    showSolution.value = false
  } else {
    success.value = false
    resultText.value = 'Fel svar. Försök igen eller visa lösning.'
  }
}
</script>

<template>
  <div class="page">
    <h1>Räntabilitet på totalt kapital</h1>
    <div class="card">
      <p>
        Ange företagets räntabilitet på totalt kapital (baserat på genomsnittligt kapital) avseende
        {{ scenario.periodLabel }}. Svara i procent med en decimal.
      </p>

      <div class="grid">
        <div class="col">
          <h3>Resultaträkning (innevarande år)</h3>
          <table class="nice">
            <tbody>
              <tr>
                <td>Nettoomsättning</td>
                <td class="num">{{ scenario.rr.nettoomsattning.toLocaleString('sv-SE') }} kr</td>
              </tr>
              <tr>
                <td>Handelsvaror</td>
                <td class="num">{{ scenario.rr.handelsvaror.toLocaleString('sv-SE') }} kr</td>
              </tr>
              <tr>
                <td>Övriga externa kostnader</td>
                <td class="num">{{ scenario.rr.ovrigaExterna.toLocaleString('sv-SE') }} kr</td>
              </tr>
              <tr>
                <td>Personalkostnader</td>
                <td class="num">{{ scenario.rr.personalkostnader.toLocaleString('sv-SE') }} kr</td>
              </tr>
              <tr>
                <td>Avskrivningar</td>
                <td class="num">{{ scenario.rr.avskrivningar.toLocaleString('sv-SE') }} kr</td>
              </tr>
              <tr>
                <td>Övriga rörelsekostnader</td>
                <td class="num">
                  {{ scenario.rr.ovrigaRorelsekostnader.toLocaleString('sv-SE') }} kr
                </td>
              </tr>
              <tr class="total">
                <td><strong>Rörelseresultat</strong></td>
                <td class="num">
                  <strong>{{ scenario.rr.rorelseresultat.toLocaleString('sv-SE') }} kr</strong>
                </td>
              </tr>
              <tr>
                <td>Finansiella intäkter</td>
                <td class="num">
                  {{ scenario.rr.finansiellaIntakter.toLocaleString('sv-SE') }} kr
                </td>
              </tr>
              <tr>
                <td>Finansiella kostnader</td>
                <td class="num">
                  {{ scenario.rr.finansiellaKostnader.toLocaleString('sv-SE') }} kr
                </td>
              </tr>
              <tr>
                <td>Resultat före skatt</td>
                <td class="num">{{ scenario.rr.resultatForeSkatt.toLocaleString('sv-SE') }} kr</td>
              </tr>
              <tr>
                <td>Skatt</td>
                <td class="num">{{ scenario.rr.skatt.toLocaleString('sv-SE') }} kr</td>
              </tr>
              <tr class="total">
                <td><strong>Årets resultat</strong></td>
                <td class="num">
                  <strong>{{ scenario.rr.aretsResultat.toLocaleString('sv-SE') }} kr</strong>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="col">
          <h3>Balansräkning (sammandrag)</h3>
          <table class="nice">
            <thead>
              <tr>
                <th></th>
                <th class="num">2022-08-31</th>
                <th class="num">2021-08-31</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Materiella anläggningstillgångar</td>
                <td class="num">{{ scenario.brCurr.materiella.toLocaleString('sv-SE') }} kr</td>
                <td class="num">{{ scenario.brPrev.materiella.toLocaleString('sv-SE') }} kr</td>
              </tr>
              <tr>
                <td>Finansiella anläggningstillgångar</td>
                <td class="num">{{ scenario.brCurr.finansiellaAT.toLocaleString('sv-SE') }} kr</td>
                <td class="num">{{ scenario.brPrev.finansiellaAT.toLocaleString('sv-SE') }} kr</td>
              </tr>
              <tr>
                <td>Varulager</td>
                <td class="num">{{ scenario.brCurr.varulager.toLocaleString('sv-SE') }} kr</td>
                <td class="num">{{ scenario.brPrev.varulager.toLocaleString('sv-SE') }} kr</td>
              </tr>
              <tr>
                <td>Kundfordringar</td>
                <td class="num">{{ scenario.brCurr.kundfordringar.toLocaleString('sv-SE') }} kr</td>
                <td class="num">{{ scenario.brPrev.kundfordringar.toLocaleString('sv-SE') }} kr</td>
              </tr>
              <tr>
                <td>Övriga fordringar</td>
                <td class="num">
                  {{ scenario.brCurr.ovrigaFordringar.toLocaleString('sv-SE') }} kr
                </td>
                <td class="num">
                  {{ scenario.brPrev.ovrigaFordringar.toLocaleString('sv-SE') }} kr
                </td>
              </tr>
              <tr>
                <td>Förutbetalda kostnader och upplupna intäkter</td>
                <td class="num">{{ scenario.brCurr.forutbetalda.toLocaleString('sv-SE') }} kr</td>
                <td class="num">{{ scenario.brPrev.forutbetalda.toLocaleString('sv-SE') }} kr</td>
              </tr>
              <tr>
                <td>Kassa och bank</td>
                <td class="num">{{ scenario.brCurr.kassaBank.toLocaleString('sv-SE') }} kr</td>
                <td class="num">{{ scenario.brPrev.kassaBank.toLocaleString('sv-SE') }} kr</td>
              </tr>
              <tr class="total">
                <td><strong>Summa tillgångar</strong></td>
                <td class="num">
                  <strong>{{ scenario.brCurr.summaTillgangar.toLocaleString('sv-SE') }} kr</strong>
                </td>
                <td class="num">
                  <strong>{{ scenario.brPrev.summaTillgangar.toLocaleString('sv-SE') }} kr</strong>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="answer-row">
        <label>Svar (% med en decimal)</label>
        <input type="number" v-model="userAnswer" step="0.1" placeholder="t.ex. 10.2" />
        <button class="btn-primary" @click="check">Rätta</button>
      </div>
      <p class="result">{{ resultText }}</p>
      <div class="actions">
        <button
          v-if="!success && resultText && !showSolution"
          class="btn-secondary"
          @click="showSolution = true"
        >
          Visa lösning
        </button>
        <button v-if="success" class="btn-success" @click="generateScenario">Slumpa ny</button>
      </div>

      <div v-if="showSolution" class="solution">
        <h3>Lösning</h3>
        <p>
          Genomsnittligt totalt kapital = ({{
            scenario.brPrev.summaTillgangar.toLocaleString('sv-SE')
          }}
          + {{ scenario.brCurr.summaTillgangar.toLocaleString('sv-SE') }}) / 2 =
          {{ Math.round(genomsnittTotKap).toLocaleString('sv-SE') }} kr
        </p>
        <p>
          Numerator = Rörelseresultat + Finansiella intäkter =
          {{
            (scenario.rr.rorelseresultat + scenario.rr.finansiellaIntakter).toLocaleString('sv-SE')
          }}
          kr
        </p>
        <p>RTOT = {{ rtotPctText }}</p>
        <button class="btn-secondary" @click="showSolution = false">Dölj</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
}
.card {
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
}
.grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}
.nice {
  width: 100%;
  border-collapse: collapse;
}
.nice th,
.nice td {
  border-bottom: 1px solid #e1e1e1;
  padding: 8px;
}
.nice th {
  text-align: left;
}
.num {
  text-align: right;
}
.formula {
  margin-top: 10px;
  font-style: italic;
}
.answer-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 12px;
}
.answer-row input {
  width: 140px;
  text-align: right;
  padding: 6px 8px;
}
.result {
  font-weight: 600;
  margin-top: 10px;
}
.actions {
  margin-top: 10px;
  display: flex;
  gap: 10px;
}
.solution {
  margin-top: 15px;
  background: #f7f7f7;
  border: 1px solid #e1e1e1;
  border-radius: 6px;
  padding: 12px;
}
.btn-primary {
  background: #3498db;
  color: #fff;
  padding: 8px 16px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
.btn-success {
  background: #27ae60;
  color: #fff;
  padding: 8px 16px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
.btn-secondary {
  background: #555;
  color: #fff;
  padding: 8px 16px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
@media (max-width: 800px) {
  .grid {
    grid-template-columns: 1fr;
  }
}
</style>
