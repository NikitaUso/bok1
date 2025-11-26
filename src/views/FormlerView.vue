<script setup>
defineOptions({ name: 'FormlerView' })
import { ref } from 'vue'
import FormulaLine from '../components/FormulaLine.vue'

// --- LOGIK FÖR ATT FLYTTA TERMER ---

/**
 * Algebraisk omflyttning.
 * Princip: Flytta allt till vänster sida så att summan blir 0.
 * Identifiera sedan vilken term som klickades och isolera den.
 */
const rearrangeEquation = (clickedId, leftRef, rightRef) => {
  const currentLeft = leftRef.value
  const currentRight = rightRef.value

  // 1. Normalisera alla termer som om de stod på "noll-sidan" (LHS - RHS = 0)
  // Om en term står till vänster behåller den sitt tecken.
  // Om en term står till höger byter vi tecken (för att "flytta" den till noll-sidan).

  const allTermsNormalized = []

  // Hantera vänstersidan
  currentLeft.forEach((t) => {
    // Om tecken saknas är det underförstått plus.
    const rawSign = t.sign === '-' ? '-' : '+'
    allTermsNormalized.push({ ...t, netSign: rawSign })
  })

  // Hantera högersidan (invertera tecken)
  currentRight.forEach((t) => {
    const rawSign = t.sign === '-' ? '-' : '+'
    // Invertera: + blir -, - blir +
    const invertedSign = rawSign === '+' ? '-' : '+'
    allTermsNormalized.push({ ...t, netSign: invertedSign })
  })

  // 2. Hitta den klickade termen (vårt nya LHS)
  const target = allTermsNormalized.find((t) => t.id === clickedId)
  if (!target) return

  // 3. Bygg nya listor
  // Logik:
  // Om target var POSITIV (+) i noll-ekvationen:
  //    Target = - (Alla andra) -> Vi måste byta tecken på alla andra när de flyttas till RHS.
  // Om target var NEGATIV (-) i noll-ekvationen:
  //    -Target + Övriga = 0  ->  Target = Övriga -> Övriga behåller sina tecken på RHS.

  const newLeft = [{ id: target.id, text: target.text, sign: '' }] // Vänster har aldrig tecken

  const newRight = allTermsNormalized
    .filter((t) => t.id !== clickedId)
    .map((t) => {
      let finalSign = ''

      if (target.netSign === '+') {
        // Target var positiv, flytta andra till RHS => byt deras tecken
        finalSign = t.netSign === '+' ? '-' : '+'
      } else {
        // Target var negativ, flytta Target till RHS => andra stannar kvar (behåll tecken)
        // (Fast visuellt byter de sida, algebraiskt stämmer detta).
        finalSign = t.netSign
      }

      return {
        id: t.id,
        text: t.text,
        sign: finalSign,
      }
    })

  // Snygga till: Första termen på högersidan ska inte ha '+' synligt, men '-' måste synas.
  if (newRight.length > 0 && newRight[0].sign === '+') {
    newRight[0].sign = ''
  }

  // Sortera så att positiva termer hamnar först om möjligt (estetiskt),
  // men behåll "Intäkter - Kostnader" ordning om möjligt.
  // (Valfritt: Ta bort nedan sort om du vill behålla strikt ordning)
  newRight.sort((a, b) => {
    if (a.sign === '' && b.sign === '-') return -1
    if (a.sign === '-' && b.sign === '') return 1
    return 0
  })

  // Uppdatera reaktiv data
  leftRef.value = newLeft
  rightRef.value = newRight
}

// Helper för att hantera klick i mallen
const handleTermClick = (id, leftRef, rightRef) => {
  rearrangeEquation(id, leftRef, rightRef)
}

// --- DATA (Nu med ref) ---

const resultLeft = ref([{ id: 'res', text: 'Resultat', sign: '' }])
const resultRight = ref([
  { id: 'int', text: 'Intäkter', sign: '+' },
  { id: 'kost', text: 'Kostnader', sign: '-' },
])

const balansLeft = ref([{ id: 'till', text: 'Tillgångar', sign: '' }])
const balansRight = ref([
  { id: 'ek', text: 'Eget kapital', sign: '+' },
  { id: 'sk', text: 'Skulder', sign: '+' },
])

const kfLeft = ref([{ id: 'kf', text: 'Kassaflöde', sign: '' }])
const kfRight = ref([
  { id: 'inb', text: 'Inbetalningar', sign: '+' },
  { id: 'utb', text: 'Utbetalningar', sign: '-' },
])

const ekLeft = ref([{ id: 'ekub', text: 'Eget kapital (UB)', sign: '' }])
const ekRight = ref([
  { id: 'ekib', text: 'Eget kapital (IB)', sign: '+' },
  { id: 'res2', text: 'Periodens resultat', sign: '+' },
  { id: 'utd', text: 'Utdelning', sign: '-' },
  { id: 'ny', text: 'Nyemission', sign: '+' },
])

const anlLeft = ref([{ id: 'anl_ub', text: 'Anläggningstillgångar (UB)', sign: '' }])
const anlRight = ref([
  { id: 'anl_ib', text: 'Anläggningstillgångar (IB)', sign: '+' },
  { id: 'invest', text: 'Investeringar', sign: '+' },
  { id: 'avskr', text: 'Avskrivningar', sign: '-' },
])

const kundLeft = ref([{ id: 'kund_ub', text: 'Kundfordringar (UB)', sign: '' }])
const kundRight = ref([
  { id: 'kund_ib', text: 'Kundfordringar (IB)', sign: '+' },
  { id: 'fors', text: 'Försäljningsintäkter', sign: '+' },
  { id: 'betal', text: 'Betalning från kunder', sign: '-' },
])

const levLeft = ref([{ id: 'lev_ub', text: 'Leverantörsskulder (UB)', sign: '' }])
const levRight = ref([
  { id: 'lev_ib', text: 'Leverantörsskulder (IB)', sign: '+' },
  { id: 'varu', text: 'Varuinköp', sign: '+' },
  { id: 'betallev', text: 'Betalning till leverantör', sign: '-' },
])

const varuLeft = ref([{ id: 'ksv', text: 'Kostnad såld vara', sign: '' }])
const varuRight = ref([
  { id: 'varu_ib', text: 'Varulager (IB)', sign: '+' },
  { id: 'inkop', text: 'Inköp', sign: '+' },
  { id: 'varu_ub', text: 'Varulager (UB)', sign: '-' },
])

const bankLeft = ref([{ id: 'bank_ub', text: 'Banklån (UB)', sign: '' }])
const bankRight = ref([
  { id: 'bank_ib', text: 'Banklån (IB)', sign: '+' },
  { id: 'nya_lan', text: 'Nya lån', sign: '+' },
  { id: 'amort', text: 'Amorteringar', sign: '-' },
])

const likvLeft = ref([{ id: 'likvid_ub', text: 'Likvida medel (UB)', sign: '' }])
const likvRight = ref([
  { id: 'likvid_ib', text: 'Likvida medel (IB)', sign: '+' },
  { id: 'inbetal', text: 'Inbetalningar', sign: '+' },
  { id: 'utbetal', text: 'Utbetalningar', sign: '-' },
])

const aretsInbLeft = ref([
  { id: 'arets_inb', text: 'Årets inbetalningar (inkl moms) från kunder', sign: '' },
])
const aretsInbRight = ref([
  { id: 'forsalj', text: 'Försäljning x 1.25', sign: '+' },
  { id: 'delta_kf', text: 'Δ Kundfordringar', sign: '-' },
])

const kfFinLeft = ref([
  { id: 'kf_fin_ub', text: 'Kassaflöde från finansieringsverksamheten (UB)', sign: '' },
])
const kfFinRight = ref([
  { id: 'kf_fin_ib', text: 'Kassa från finansieringsverksamheten (IB)', sign: '+' },
  { id: 'nyem', text: 'Nyemissioner', sign: '+' },
  { id: 'uppl', text: 'Upptagna lån', sign: '+' },
  { id: 'amort2', text: 'Amorteringar', sign: '-' },
  { id: 'utd2', text: 'Utdelningar', sign: '-' },
])

const ekUbLeft = ref([{ id: 'ekub2', text: 'Eget kapital (UB)', sign: '' }])
const ekUbRight = ref([
  { id: 'ekib2', text: 'Eget kapital (IB)', sign: '+' },
  { id: 'periodres', text: 'Periodens resultat', sign: '+' },
  { id: 'utd3', text: 'Utdelning', sign: '-' },
  { id: 'ny2', text: 'Nyemission', sign: '+' },
])

const deltaEkLeft = ref([{ id: 'deltaek', text: 'Δ Eget kapital', sign: '' }])
const deltaEkRight = ref([
  { id: 'arsres', text: 'Årets resultat', sign: '+' },
  { id: 'ny3', text: 'Nyemission', sign: '+' },
  { id: 'utd4', text: 'Utdelning', sign: '-' },
])

// Nyckeltal (kvoter) är svårare att "klicka runt" på samma sätt (multiplikation/division),
// så jag lämnar dessa statiska om du inte vill bygga om dem till A = B * C logik.
const balansLikvLeft = ref([{ id: 'balanslikv', text: 'Balanslikviditet', sign: '' }])
const balansLikvRight = ref([
  {
    id: 'balanslikv_rhs',
    text: 'Samtliga omsättningstillgångar / Samtliga kortfristiga skulder',
    sign: '',
  },
])

const romargLeft = ref([{ id: 'romarg', text: 'Rörelsemarginal', sign: '' }])
const romargRight = ref([{ id: 'romarg_rhs', text: 'Rörelseresultat / Nettoomsättning', sign: '' }])

const rEkLeft2 = ref([{ id: 'rek', text: 'R_EK', sign: '' }])
const rEkRight2 = ref([
  {
    id: 'rek_rhs',
    text: '(Verkligt) resultat efter skatt / (Verkligt) genomsnittligt eget kapital',
    sign: '',
  },
])

const verkligtResLeft = ref([{ id: 'vres', text: 'Verkligt resultat', sign: '' }])
const verkligtResRight = ref([
  {
    id: 'vres_rhs',
    text: 'Redovisat resultat efter skatt +/- (1 – skattesats) x Bokslutsdispositioner',
    sign: '',
  },
])

const verkligtEkLeft2 = ref([{ id: 'vek', text: 'Verkligt EK', sign: '' }])
const verkligtEkRight2 = ref([
  { id: 'vek_rhs', text: 'Redovisat EK + (1 – skattesats) x Obeskattade reserver', sign: '' },
])

const genAvgLeft = ref([{ id: 'gavg', text: 'Genomsnittligt EK', sign: '' }])
const genAvgRight = ref([{ id: 'gavg_rhs', text: '(EK IB + EK UB) / 2', sign: '' }])

const rSyssLeft = ref([{ id: 'rsyss', text: 'R_Syss', sign: '' }])
const rSyssRight = ref([
  {
    id: 'rsyss_rhs',
    text: '(Rörelseresultat + finansiella intäkter) / (Verkligt) genomsnittligt sysselsatt kapital',
    sign: '',
  },
])

const verkligtSyssLeft = ref([{ id: 'vsyss', text: 'Verkligt sysselsatt kapital', sign: '' }])
const verkligtSyssRight = ref([
  {
    id: 'vsyss_rhs',
    text: 'Redovisat EK + (1 - skattesats) x Obeskattade reserver + Räntebärande skulder',
    sign: '',
  },
])

const solidLeft2 = ref([{ id: 'solid', text: 'Soliditet', sign: '' }])
const solidRight2 = ref([
  { id: 'solid_rhs', text: '(Verkligt) Eget kapital / Totalt kapital', sign: '' },
])
</script>

<template>
  <div class="formler-wrapper">
    <h1>Formelsamling & Cheat Sheet</h1>
    <p class="intro-text">
      Tips: Klicka på en term i ekvationerna för att lösa ut den (flytta den till vänsterledet).
    </p>

    <section>
      <h2>Grundläggande Rapporter</h2>
      <h3>Resultaträkning</h3>
      <FormulaLine
        :left="resultLeft"
        :right="resultRight"
        @click-term="(id) => handleTermClick(id, resultLeft, resultRight)"
      />

      <h3>Balansräkning</h3>
      <FormulaLine
        :left="balansLeft"
        :right="balansRight"
        @click-term="(id) => handleTermClick(id, balansLeft, balansRight)"
      />

      <h3>Kassaflöde (Grund)</h3>
      <FormulaLine
        :left="kfLeft"
        :right="kfRight"
        @click-term="(id) => handleTermClick(id, kfLeft, kfRight)"
      />
    </section>

    <section>
      <h2>Balansposter & Förändringsanalys (IB/UB)</h2>

      <h3>Tillgångar & Skulder</h3>
      <FormulaLine
        :left="anlLeft"
        :right="anlRight"
        @click-term="(id) => handleTermClick(id, anlLeft, anlRight)"
      />
      <FormulaLine
        :left="kundLeft"
        :right="kundRight"
        @click-term="(id) => handleTermClick(id, kundLeft, kundRight)"
      />
      <FormulaLine
        :left="levLeft"
        :right="levRight"
        @click-term="(id) => handleTermClick(id, levLeft, levRight)"
      />
      <FormulaLine
        :left="varuLeft"
        :right="varuRight"
        @click-term="(id) => handleTermClick(id, varuLeft, varuRight)"
      />
      <FormulaLine
        :left="bankLeft"
        :right="bankRight"
        @click-term="(id) => handleTermClick(id, bankLeft, bankRight)"
      />

      <h3>Likvida medel & Kassaflöde</h3>
      <FormulaLine
        :left="likvLeft"
        :right="likvRight"
        @click-term="(id) => handleTermClick(id, likvLeft, likvRight)"
      />
      <FormulaLine
        :left="aretsInbLeft"
        :right="aretsInbRight"
        @click-term="(id) => handleTermClick(id, aretsInbLeft, aretsInbRight)"
      />
      <FormulaLine
        :left="kfFinLeft"
        :right="kfFinRight"
        @click-term="(id) => handleTermClick(id, kfFinLeft, kfFinRight)"
      />

      <h3>Eget Kapital</h3>
      <FormulaLine
        :left="ekUbLeft"
        :right="ekUbRight"
        @click-term="(id) => handleTermClick(id, ekUbLeft, ekUbRight)"
      />
      <FormulaLine
        :left="deltaEkLeft"
        :right="deltaEkRight"
        @click-term="(id) => handleTermClick(id, deltaEkLeft, deltaEkRight)"
      />
    </section>

    <section>
      <h2>Nyckeltal: Likviditet & Marginal</h2>
      <FormulaLine :left="balansLikvLeft" :right="balansLikvRight" />
      <FormulaLine :left="romargLeft" :right="romargRight" />
    </section>

    <section>
      <h2>Nyckeltal: Lönsamhet & Avkastning</h2>

      <h3>Avkastning på Eget Kapital (R_EK)</h3>
      <FormulaLine :left="rEkLeft2" :right="rEkRight2" />
      <div class="note">
        <p><strong>Hjälpformler för R_EK:</strong></p>
        <FormulaLine :left="verkligtResLeft" :right="verkligtResRight" />
        <FormulaLine :left="verkligtEkLeft2" :right="verkligtEkRight2" />
        <FormulaLine :left="genAvgLeft" :right="genAvgRight" />
      </div>

      <h3>Avkastning på Sysselsatt Kapital (R_Syss)</h3>
      <FormulaLine :left="rSyssLeft" :right="rSyssRight" />
      <div class="note">
        <p><strong>Hjälpformler för R_Syss:</strong></p>
        <FormulaLine :left="verkligtSyssLeft" :right="verkligtSyssRight" />
      </div>
    </section>

    <section>
      <h2>Finansiell Stabilitet</h2>
      <h3>Soliditet</h3>
      <FormulaLine :left="solidLeft2" :right="solidRight2" />
      <p><em>Kom ihåg justeringen av Eget Kapital:</em></p>
      <FormulaLine :left="verkligtEkLeft2" :right="verkligtEkRight2" />
    </section>
  </div>
</template>

<style scoped>
/* Behåll din tidigare CSS här */
.formler-wrapper {
  max-width: 900px;
  margin: 30px auto;
  padding: 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

h1 {
  margin-top: 0;
  color: #2c3e50;
  border-bottom: 2px solid #eaeaea;
  padding-bottom: 10px;
}
h2 {
  color: #34495e;
  margin-top: 30px;
}
h3 {
  color: #7f8c8d;
  font-size: 1.1em;
  margin-bottom: 5px;
}

.intro-text {
  background: #e8f5e9;
  color: #2e7d32;
  padding: 10px;
  border-radius: 6px;
  margin-bottom: 20px;
  border: 1px solid #c8e6c9;
}

.note {
  background: #fffdf0;
  border: 1px solid #f0e68c;
  padding: 15px;
  border-radius: 6px;
  margin-top: 10px;
}

section {
  margin-bottom: 30px;
}
</style>
