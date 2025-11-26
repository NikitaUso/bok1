<script setup>
defineOptions({ name: 'FormlerView' })
import FormulaLine from '../components/FormulaLine.vue'

const resultLeft = [{ id: 'res', text: 'Resultat', sign: '' }]
const resultRight = [
  { id: 'int', text: 'Intäkter', sign: '+' },
  { id: 'kost', text: 'Kostnader', sign: '-' },
]

const balansLeft = [{ id: 'till', text: 'Tillgångar', sign: '' }]
const balansRight = [
  { id: 'ek', text: 'Eget kapital', sign: '+' },
  { id: 'sk', text: 'Skulder', sign: '+' },
]

const kfLeft = [{ id: 'kf', text: 'Kassaflöde', sign: '' }]
const kfRight = [
  { id: 'inb', text: 'Inbetalningar', sign: '+' },
  { id: 'utb', text: 'Utbetalningar', sign: '-' },
]

const ekLeft = [{ id: 'ekub', text: 'Eget kapital (UB)', sign: '' }]
const ekRight = [
  { id: 'ekib', text: 'Eget kapital (IB)', sign: '+' },
  { id: 'res2', text: 'Periodens resultat', sign: '+' },
  { id: 'utd', text: 'Utdelning', sign: '-' },
  { id: 'ny', text: 'Nyemission', sign: '+' },
]

// Additional formulas on the page converted to FormulaLine data
const anlLeft = [{ id: 'anl_ub', text: 'Anläggningstillgångar (UB)', sign: '' }]
const anlRight = [
  { id: 'anl_ib', text: 'Anläggningstillgångar (IB)', sign: '+' },
  { id: 'invest', text: 'Investeringar', sign: '+' },
  { id: 'avskr', text: 'Avskrivningar', sign: '-' },
]

const kundLeft = [{ id: 'kund_ub', text: 'Kundfordringar (UB)', sign: '' }]
const kundRight = [
  { id: 'kund_ib', text: 'Kundfordringar (IB)', sign: '+' },
  { id: 'fors', text: 'Försäljningsintäkter', sign: '+' },
  { id: 'betal', text: 'Betalning från kunder', sign: '-' },
]

const levLeft = [{ id: 'lev_ub', text: 'Leverantörsskulder (UB)', sign: '' }]
const levRight = [
  { id: 'lev_ib', text: 'Leverantörsskulder (IB)', sign: '+' },
  { id: 'varu', text: 'Varuinköp', sign: '+' },
  { id: 'betallev', text: 'Betalning till leverantör', sign: '-' },
]

const varuLeft = [{ id: 'ksv', text: 'Kostnad såld vara', sign: '' }]
const varuRight = [
  { id: 'varu_ib', text: 'Varulager (IB)', sign: '+' },
  { id: 'inkop', text: 'Inköp', sign: '+' },
  { id: 'varu_ub', text: 'Varulager (UB)', sign: '-' },
]

const bankLeft = [{ id: 'bank_ub', text: 'Banklån (UB)', sign: '' }]
const bankRight = [
  { id: 'bank_ib', text: 'Banklån (IB)', sign: '+' },
  { id: 'nya_lan', text: 'Nya lån', sign: '+' },
  { id: 'amort', text: 'Amorteringar', sign: '-' },
]

const likvLeft = [{ id: 'likvid_ub', text: 'Likvida medel (UB)', sign: '' }]
const likvRight = [
  { id: 'likvid_ib', text: 'Likvida medel (IB)', sign: '+' },
  { id: 'inbetal', text: 'Inbetalningar', sign: '+' },
  { id: 'utbetal', text: 'Utbetalningar', sign: '-' },
]

const aretsInbLeft = [{ id: 'arets_inb', text: 'Årets inbetalningar (inkl moms) från kunder', sign: '' }]
const aretsInbRight = [
  { id: 'forsalj', text: 'Försäljning x 1.25', sign: '+' },
  { id: 'delta_kf', text: 'Δ Kundfordringar', sign: '-' },
]

const kfFinLeft = [{ id: 'kf_fin_ub', text: 'Kassaflöde från finansieringsverksamheten (UB)', sign: '' }]
const kfFinRight = [
  { id: 'kf_fin_ib', text: 'Kassa från finansieringsverksamheten (IB)', sign: '+' },
  { id: 'nyem', text: 'Nyemissioner', sign: '+' },
  { id: 'uppl', text: 'Upptagna lån', sign: '+' },
  { id: 'amort2', text: 'Amorteringar', sign: '-' },
  { id: 'utd2', text: 'Utdelningar', sign: '-' },
]

const ekUbLeft = [{ id: 'ekub2', text: 'Eget kapital (UB)', sign: '' }]
const ekUbRight = [
  { id: 'ekib2', text: 'Eget kapital (IB)', sign: '+' },
  { id: 'periodres', text: 'Periodens resultat', sign: '+' },
  { id: 'utd3', text: 'Utdelning', sign: '-' },
  { id: 'ny2', text: 'Nyemission', sign: '+' },
]

const deltaEkLeft = [{ id: 'deltaek', text: 'Δ Eget kapital', sign: '' }]
const deltaEkRight = [
  { id: 'arsres', text: 'Årets resultat', sign: '+' },
  { id: 'ny3', text: 'Nyemission', sign: '+' },
  { id: 'utd4', text: 'Utdelning', sign: '-' },
]

const balansLikvLeft = [{ id: 'balanslikv', text: 'Balanslikviditet', sign: '' }]
const balansLikvRight = [
  { id: 'balanslikv_rhs', text: 'Samtliga omsättningstillgångar / Samtliga kortfristiga skulder', sign: '' },
]

const romargLeft = [{ id: 'romarg', text: 'Rörelsemarginal', sign: '' }]
const romargRight = [
  { id: 'romarg_rhs', text: 'Rörelseresultat / Nettoomsättning', sign: '' },
]

const rEkLeft2 = [{ id: 'rek', text: 'R_EK', sign: '' }]
const rEkRight2 = [
  { id: 'rek_rhs', text: '(Verkligt) resultat efter skatt / (Verkligt) genomsnittligt eget kapital', sign: '' },
]

const verkligtResLeft = [{ id: 'vres', text: 'Verkligt resultat', sign: '' }]
const verkligtResRight = [
  { id: 'vres_rhs', text: 'Redovisat resultat efter skatt +/- (1 – skattesats) x Bokslutsdispositioner', sign: '' },
]

const verkligtEkLeft2 = [{ id: 'vek', text: 'Verkligt EK', sign: '' }]
const verkligtEkRight2 = [
  { id: 'vek_rhs', text: 'Redovisat EK + (1 – skattesats) x Obeskattade reserver', sign: '' },
]

const genAvgLeft = [{ id: 'gavg', text: 'Genomsnittligt EK', sign: '' }]
const genAvgRight = [
  { id: 'gavg_rhs', text: '(EK IB + EK UB) / 2', sign: '' },
]

const rSyssLeft = [{ id: 'rsyss', text: 'R_Syss', sign: '' }]
const rSyssRight = [
  { id: 'rsyss_rhs', text: '(Rörelseresultat + finansiella intäkter) / (Verkligt) genomsnittligt sysselsatt kapital', sign: '' },
]

const verkligtSyssLeft = [{ id: 'vsyss', text: 'Verkligt sysselsatt kapital', sign: '' }]
const verkligtSyssRight = [
  { id: 'vsyss_rhs', text: 'Redovisat EK + (1 - skattesats) x Obeskattade reserver + Räntebärande skulder', sign: '' },
]

const solidLeft2 = [{ id: 'solid', text: 'Soliditet', sign: '' }]
const solidRight2 = [
  { id: 'solid_rhs', text: '(Verkligt) Eget kapital / Totalt kapital', sign: '' },
]
</script>

<template>
  <div class="formler-wrapper">
    <h1>Formelsamling & Cheat Sheet</h1>

    <section>
      <h2>Grundläggande Rapporter</h2>
      <h3>Resultaträkning</h3>
      <FormulaLine :left="resultLeft" :right="resultRight" />

      <h3>Balansräkning</h3>
      <FormulaLine :left="balansLeft" :right="balansRight" />

      <h3>Kassaflöde (Grund)</h3>
      <FormulaLine :left="kfLeft" :right="kfRight" />
    </section>

    <section>
      <h2>Balansposter & Förändringsanalys (IB/UB)</h2>
      <p>Här beskrivs hur utgående balans (UB) hänger ihop med ingående balans (IB) och årets händelser.</p>

      <h3>Tillgångar & Skulder</h3>
      <FormulaLine :left="anlLeft" :right="anlRight" />
      <FormulaLine :left="kundLeft" :right="kundRight" />
      <FormulaLine :left="levLeft" :right="levRight" />
      <FormulaLine :left="varuLeft" :right="varuRight" />
      <FormulaLine :left="bankLeft" :right="bankRight" />

      <h3>Likvida medel & Kassaflöde</h3>
      <FormulaLine :left="likvLeft" :right="likvRight" />
      <FormulaLine :left="aretsInbLeft" :right="aretsInbRight" />
      <FormulaLine :left="kfFinLeft" :right="kfFinRight" />

      <h3>Eget Kapital</h3>
      <FormulaLine :left="ekUbLeft" :right="ekUbRight" />
      <FormulaLine :left="deltaEkLeft" :right="deltaEkRight" />
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
.formler-wrapper {
  max-width: 900px;
  margin: 30px auto;
  padding: 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.06);
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

h1 { margin-top: 0; color: #2c3e50; border-bottom: 2px solid #eaeaea; padding-bottom: 10px; }
h2 { color: #34495e; margin-top: 30px; }
h3 { color: #7f8c8d; font-size: 1.1em; margin-bottom: 5px; }

pre {
  background: #f6f8fa;
  padding: 12px;
  border-radius: 6px;
  overflow-x: auto;
  border-left: 4px solid #42b983; /* Vue green accent */
  margin: 10px 0;
  font-size: 0.95em;
}

.note {
  background: #fffdf0;
  border: 1px solid #f0e68c;
  padding: 15px;
  border-radius: 6px;
  margin-top: 10px;
}

.note pre {
  background: #fff;
  border-left: 4px solid #f1c40f;
}

section { margin-bottom: 30px; }
ul { list-style-type: disc; padding-left: 20px; }
li { margin-bottom: 5px; }
</style>
