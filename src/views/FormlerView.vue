<script setup>
defineOptions({ name: 'FormlerView' })
</script>

<template>
  <div class="formler-wrapper">
    <h1>Formler & Cheat Sheet</h1>

    <section>
      <h2>Begrepp</h2>
      <ul>
        <li><strong>Intäkt</strong> – Värdet av utförda prestationer (när varan/tjänsten levereras).</li>
        <li><strong>Inkomst</strong> – Värdet av det du säljer (uppstår vid försäljningstillfället).</li>
        <li><strong>Inbetalning</strong> – Pengar kommer in till företaget (när kunden betalar).</li>
        <li><strong>Kostnad</strong> – Värdet av förbrukade resurser.</li>
        <li><strong>Utgift</strong> – Värdet av anskaffade resurser.</li>
        <li><strong>Utbetalning</strong> – Pengar flödar ut ur företaget (när du faktiskt betalar).</li>
      </ul>
    </section>

    <section>
      <h2>Bokföring (kontoregel)</h2>
      <p>Debet = Vänster, Kredit = Höger</p>
      <p><strong>Summa debet = Summa kredit</strong></p>

      <h3>Typkonton och tecken</h3>
      <ul>
        <li>Tillgångskonton: Debet + , Kredit –</li>
        <li>Eget kapital & Skulder: Debet – , Kredit +</li>
        <li>Intäkt/Inkomst: Debet – , Kredit +</li>
        <li>Utgift/Kostnad: Debet + , Kredit –</li>
      </ul>
    </section>

    <section>
      <h2>Moms (kort)</h2>
      <p>Moms är ingen kostnad eller intäkt för företaget.</p>
      <p><strong>Utgående moms</strong> = vid försäljning (företaget lägger på moms)</p>
      <p><strong>Ingående moms</strong> = vid inköp (företaget betalar moms och får den tillbaka från Skatteverket)</p>

      <h3>Momsredovisning (översikt)</h3>
      <ol>
        <li>Samla transaktioner under perioden (Utgående → Kredit, Ingående → Debet)</li>
        <li>Beräkna skillnaden: Utgående moms - Ingående moms = Belopp att betala/få tillbaka</li>
        <li>Nolla kontona (flytta beloppen till momsredovisningskonto)</li>
        <li>Skillnaden bokförs mot bank vid betalning</li>
      </ol>
    </section>

    <section>
      <h2>Resultaträkning</h2>
      <pre>Resultat = Intäkter - Kostnader</pre>
    </section>

    <section>
      <h2>Balansräkning</h2>
      <pre>Tillgångar = Eget kapital + Skulder</pre>
    </section>

    <section>
      <h2>Kassaflödesanalys (nyckelformler)</h2>
      <pre>Kassaflöde = Inbetalningar - Utbetalningar</pre>
      <pre>Likvida medel (UB) = Likvida medel (IB) + Inbetalningar - Utbetalningar</pre>
      <pre>Kundfordringar (UB) = Kundfordringar (IB) + Försäljningsintäkter - Betalning från kunder</pre>
      <pre>Leverantörsskulder (UB) = Leverantörsskulder (IB) + Varuinköp - Betalning till leverantör</pre>
      <pre>Kostnad såld vara = Varulager (IB) + Inköp - Varulager (UB)</pre>
    </section>

    <section>
      <h2>Finansiering & eget kapital</h2>
      <pre>Eget kapital (UB) = Eget kapital (IB) + Periodens resultat - Utdelning + Nyemission</pre>
      <pre>Δ Eget kapital = Årets resultat + Nyemission - Utdelning</pre>
    </section>

    <section>
      <h2>Räkenskapsanalys / Nyckeltal</h2>
      <pre>Rörelsemarginal = Rörelseresultat / Nettoomsättning</pre>
      <pre>Genomsnittligt EK = (EK IB + EK UB) / 2</pre>
      <pre>REK = Resultat efter skatt / Genomsnittligt eget kapital</pre>
      <pre>Soliditet = Eget kapital / Totalt kapital</pre>
      <pre>Balanslikviditet = Samtliga omsättningstillgångar / Samtliga kortfristiga skulder</pre>
      <pre>Kassalikviditet = (Omsättningstillgångar - Varulager) / Samtliga kortfristiga skulder</pre>
    </section>

    <section>
      <h2>Snabbreferens</h2>
      <ul>
        <li>Banklån (UB) = Banklån (IB) + Nya lån - Amorteringar</li>
        <li>Årets inbetalningar (inkl. moms) ≈ Försäljning × 1.25 - Δ Kundfordringar</li>
      </ul>
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
}

h1 { margin-top: 0; }
pre { background:#f6f8fa; padding:10px; border-radius:6px; overflow:auto }
section { margin-bottom:18px }
</style>
