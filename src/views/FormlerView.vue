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
      <pre>Anläggningstillgångar (UB) = Anläggningstillgångar (IB) + Investeringar - Avskrivningar</pre>
      <pre>Kundfordringar (UB) = Kundfordringar (IB) + Försäljningsintäkter - Betalning från kunder</pre>
      <pre>Leverantörsskulder (UB) = Leverantörsskulder (IB) + Varuinköp - Betalning till leverantör</pre>
      <pre>Varulager: Kostnad såld vara = Varulager (IB) + Inköp - Varulager (UB)</pre>
      <pre>Banklån (UB) = Banklån (IB) + Nya lån - Amorteringar</pre>

      <h3>Likvida medel & Kassaflöde</h3>
      <pre>Likvida medel (UB) = Likvida medel (IB) + Inbetalningar - Utbetalningar</pre>
      <pre>Årets inbetalningar (inkl moms) från kunder = Försäljning x 1.25 - Δ Kundfordringar</pre>
      <pre>Kassaflöde från finansieringsverksamheten (UB) = Kassa från finansieringsverksamheten (IB) + Nyemissioner + Upptagna lån - Amorteringar - Utdelningar</pre>

      <h3>Eget Kapital</h3>
      <pre>Eget kapital (UB) = Eget kapital (IB) + Periodens resultat - Utdelning + Nyemission</pre>
      <pre>Δ Eget kapital = Årets resultat + Nyemission - Utdelning</pre>
    </section>

    <section>
      <h2>Nyckeltal: Likviditet & Marginal</h2>
      <pre>Balanslikviditet = Samtliga omsättningstillgångar / Samtliga kortfristiga skulder</pre>
      <pre>Rörelsemarginal = Rörelseresultat / Nettoomsättning</pre>
    </section>

    <section>
      <h2>Nyckeltal: Lönsamhet & Avkastning</h2>

      <h3>Avkastning på Eget Kapital (R_EK)</h3>
      <pre>R_EK = (Verkligt) resultat efter skatt / (Verkligt) genomsnittligt eget kapital</pre>
      <div class="note">
        <p><strong>Hjälpformler för R_EK:</strong></p>
        <pre>Verkligt resultat = Redovisat resultat efter skatt +/- (1 – skattesats) x Bokslutsdispositioner</pre>
        <pre>Verkligt EK = Redovisat EK + (1 – skattesats) x Obeskattade reserver</pre>
        <pre>Genomsnittligt EK = (EK IB + EK UB) / 2</pre>
      </div>

      <h3>Avkastning på Sysselsatt Kapital (R_Syss)</h3>
      <pre>R_Syss = (Rörelseresultat + finansiella intäkter) / (Verkligt) genomsnittligt sysselsatt kapital</pre>
      <div class="note">
        <p><strong>Hjälpformler för R_Syss:</strong></p>
        <pre>Verkligt sysselsatt kapital = Redovisat EK + (1 - skattesats) x Obeskattade reserver + Räntebärande skulder</pre>
      </div>
    </section>

    <section>
      <h2>Finansiell Stabilitet</h2>
      <h3>Soliditet</h3>
      <pre>Soliditet = (Verkligt) Eget kapital / Totalt kapital</pre>
      <p><em>Kom ihåg justeringen av Eget Kapital:</em></p>
      <pre>Verkligt EK = Redovisat EK + (1 – skattesats) x Obeskattade reserver</pre>
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
