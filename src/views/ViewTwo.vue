<script setup>
defineOptions({ name: 'TAccountView' })
import { ref, computed, watch, onMounted } from 'vue'

// --- KONTOPLAN (Referens) ---
const accountList = [
  // TILLGÅNGAR (1xxx)
  { code: '1910', name: 'Kassa', type: 'tillgång' },
  { code: '1930', name: 'Företagskonto', type: 'tillgång' },
  { code: '1510', name: 'Kundfordringar', type: 'tillgång' },
  { code: '1220', name: 'Inventarier', type: 'tillgång' },
  { code: '1240', name: 'Bilar', type: 'tillgång' },
  // EGET KAPITAL & SKULDER (2xxx)
  { code: '2081', name: 'Aktiekapital', type: 'ek' },
  { code: '2330', name: 'Checkräkningskredit', type: 'skuld' },
  { code: '2350', name: 'Banklån', type: 'skuld' },
  { code: '2440', name: 'Leverantörsskulder', type: 'skuld' },
  { code: '2610', name: 'Utgående moms', type: 'skuld' },
  { code: '2640', name: 'Ingående moms', type: 'tillgång' },
  { code: '2710', name: 'Personalskatt', type: 'skuld' },
  { code: '2730', name: 'Lagstadgade soc. avgifter', type: 'skuld' },
  // INTÄKTER (3xxx)
  { code: '3001', name: 'Varuförsäljning', type: 'intäkt' },
  { code: '3041', name: 'Försäljning tjänst', type: 'intäkt' },
  { code: '3900', name: 'Övriga intäkter', type: 'intäkt' },
  // KOSTNADER (4xxx-7xxx)
  { code: '4010', name: 'Varuinköp', type: 'kostnad' },
  { code: '5010', name: 'Lokalhyra', type: 'kostnad' },
  { code: '5400', name: 'Förbrukningsinventarier', type: 'kostnad' },
  { code: '6211', name: 'Telefonräkning', type: 'kostnad' },
  { code: '7010', name: 'Löner', type: 'kostnad' },
  { code: '7510', name: 'Arbetsgivaravgifter', type: 'kostnad' },
  { code: '8310', name: 'Ränteintäkter', type: 'intäkt' },
  { code: '8410', name: 'Räntekostnader', type: 'kostnad' },
  { code: '7810', name: 'Avskrivningar', type: 'kostnad' },
  { code: '2391', name: 'Förutbetalda intäkter', type: 'skuld' },
  { code: '6990', name: 'Övriga externa kostnader', type: 'kostnad' },
]

// Sorted view of account list for dropdowns (ascending by numeric code)
const sortedAccountList = computed(() => {
  return accountList.slice().sort((a, b) => Number(a.code) - Number(b.code))
})

// --- ÖVNINGAR (Scenario + Facit) ---
const exercises = [
  {
    id: 1,
    title: 'Försäljning på kredit',
    text: 'Du har sålt varor för 100 000 kr exklusive moms på kredit (faktura). Momsen är 25% (25 000 kr). Kunden ska betala senare.',
    solution: [
      { code: '3001', side: 'kredit', amount: 100000 },
      { code: '2610', side: 'kredit', amount: 25000 },
      { code: '1510', side: 'debet', amount: 125000 },
    ],
    // följdfråga: betalning från kund
    next: 3,
  },
  {
    id: 2,
    title: 'Inköp av varor',
    text: 'Du köper in varor till lagret för 40 000 kr exklusive moms mot faktura. Momsen är 25% (10 000 kr).',
    solution: [
      { code: '4010', side: 'debet', amount: 40000 },
      { code: '2640', side: 'debet', amount: 10000 },
      { code: '2440', side: 'kredit', amount: 50000 },
    ],
  },
  {
    id: 3,
    title: 'Betalning från kund',
    text: 'Kunden betalar fakturan på 125 000 kr (från uppgift 1) till ditt företagskonto.',
    solution: [
      { code: '1930', side: 'debet', amount: 125000 },
      { code: '1510', side: 'kredit', amount: 125000 },
    ],
  },
  {
    id: 4,
    title: 'Nyemission (Starta bolag)',
    text: 'Ägarna sätter in 50 000 kr på företagskontot som aktiekapital.',
    solution: [
      { code: '1930', side: 'debet', amount: 50000 },
      { code: '2081', side: 'kredit', amount: 50000 },
    ],
  },
  {
    id: 5,
    title: 'Betalning av hyra',
    text: 'Företaget betalar lokalhyra på 10 000 kr (momsfri) direkt från företagskontot.',
    solution: [
      { code: '5010', side: 'debet', amount: 10000 },
      { code: '1930', side: 'kredit', amount: 10000 },
    ],
  },
  {
    id: 6,
    title: 'Upptagande av banklån',
    text: 'Företaget lånar 200 000 kr av banken. Pengarna sätts in på företagskontot.',
    solution: [
      { code: '1930', side: 'debet', amount: 200000 },
      { code: '2350', side: 'kredit', amount: 200000 },
    ],
  },
  {
    id: 7,
    title: 'Amortering av lån',
    text: 'Företaget betalar av (amorterar) 10 000 kr på banklånet via företagskontot.',
    solution: [
      { code: '2350', side: 'debet', amount: 10000 },
      { code: '1930', side: 'kredit', amount: 10000 },
    ],
  },
  {
    id: 8,
    title: 'Räntekostnad',
    text: 'Banken drar ränta på lånet direkt från kontot med 1 500 kr.',
    solution: [
      { code: '8410', side: 'debet', amount: 1500 },
      { code: '1930', side: 'kredit', amount: 1500 },
    ],
  },
  {
    id: 9,
    title: 'Inköp av inventarier',
    text: 'Du köper en ny dator (inventarie) för 20 000 kr + moms (5 000 kr). Betalas direkt från företagskontot.',
    solution: [
      { code: '1220', side: 'debet', amount: 20000 },
      { code: '2640', side: 'debet', amount: 5000 },
      { code: '1930', side: 'kredit', amount: 25000 },
    ],
  },
  {
    id: 10,
    title: 'Löneutbetalning',
    text: 'Dags för lön! Bruttolönen är 30 000 kr. Personalskatten är 9 000 kr. Nettolönen (21 000 kr) betalas ut till den anställde från företagskontot.',
    solution: [
      { code: '7010', side: 'debet', amount: 30000 },
      { code: '2710', side: 'kredit', amount: 9000 },
      { code: '1930', side: 'kredit', amount: 21000 },
    ],
  },
  {
    id: 11,
    title: 'Arbetsgivaravgifter',
    text: 'I samband med lönen bokförs arbetsgivaravgifter på 31.42% (vi avrundar till 9 400 kr). Detta är en kostnad nu men betalas senare.',
    solution: [
      { code: '7510', side: 'debet', amount: 9400 },
      { code: '2730', side: 'kredit', amount: 9400 },
    ],
  },
  {
    id: 12,
    title: 'Momsredovisning (Betalning)',
    text: 'Du har 25 000 kr i Utgående moms (skuld) och 10 000 kr i Ingående moms (fordran). Du ska nu kvitta dessa och betala mellanskillnaden (15 000 kr) till Skatteverket från företagskontot.',
    solution: [
      { code: '2610', side: 'debet', amount: 25000 },
      { code: '2640', side: 'kredit', amount: 10000 },
      { code: '1930', side: 'kredit', amount: 15000 },
    ],
  },
  {
    id: 13,
    title: 'Kreditfaktura från leverantör',
    text: 'Du har returnerat defekta varor till en leverantör. Du får en kreditfaktura på 10 000 kr + moms (2 500 kr). Skulden minskar.',
    solution: [
      { code: '2440', side: 'debet', amount: 12500 }, // Skulden minskar
      { code: '4010', side: 'kredit', amount: 10000 }, // Kostnaden minskar (krediteras)
      { code: '2640', side: 'kredit', amount: 2500 }, // Momsen minskar
    ],
  },
  {
    id: 14,
    title: 'Försäljning av tjänst',
    text: 'Du har utfört konsultarbete och skickat en faktura på 20 000 kr + moms (5 000 kr).',
    solution: [
      { code: '3041', side: 'kredit', amount: 20000 }, // Tjänsteintäkt
      { code: '2610', side: 'kredit', amount: 5000 }, // Utgående moms
      { code: '1510', side: 'debet', amount: 25000 }, // Kundfordran
    ],
  },
  {
    id: 15,
    title: 'Inköp förbrukningsinventarier',
    text: 'Företaget köper kontorsmaterial och småverktyg på faktura för 5 000 kr + moms (1 250 kr). Detta bokförs som en kostnad direkt.',
    solution: [
      { code: '5400', side: 'debet', amount: 5000 }, // Kostnad
      { code: '2640', side: 'debet', amount: 1250 }, // Ingående moms
      { code: '2440', side: 'kredit', amount: 6250 }, // Lev.skuld
    ],
  },
  {
    id: 16,
    title: 'Telefonräkning',
    text: 'Telefonräkningen dras via autogiro från företagskontot. Belopp: 1 000 kr + moms (250 kr).',
    solution: [
      { code: '6211', side: 'debet', amount: 1000 },
      { code: '2640', side: 'debet', amount: 250 },
      { code: '1930', side: 'kredit', amount: 1250 },
    ],
  },
  {
    id: 17,
    title: 'Ränteintäkt',
    text: 'Banken sätter in ränta på företagskontot: 500 kr.',
    solution: [
      { code: '1930', side: 'debet', amount: 500 }, // Pengar in
      { code: '8310', side: 'kredit', amount: 500 }, // Ränteintäkt
    ],
  },
  {
    id: 18,
    title: 'Betalning av leverantörsskuld',
    text: 'Vi betalar en gammal leverantörsfaktura på 50 000 kr via företagskontot.',
    solution: [
      { code: '2440', side: 'debet', amount: 50000 }, // Skulden minskar
      { code: '1930', side: 'kredit', amount: 50000 }, // Pengar ut
    ],
  },
  {
    id: 19,
    title: 'Kreditfaktura till kund',
    text: 'En kund var missnöjd och vi skickar en kreditfaktura (återbetalning) på 10 000 kr + moms (2 500 kr). Vi minskar kundens skuld till oss.',
    solution: [
      { code: '3001', side: 'debet', amount: 10000 }, // Intäkten minskar (Debet)
      { code: '2610', side: 'debet', amount: 2500 }, // Momsen minskar
      { code: '1510', side: 'kredit', amount: 12500 }, // Kundfordran minskar
    ],
  },
  {
    id: 20,
    title: 'Kontantförsäljning',
    text: 'Vi säljer varor kontant i butiken för 4 000 kr + moms (1 000 kr). Pengarna läggs i kassan.',
    solution: [
      { code: '1910', side: 'debet', amount: 5000 }, // Kassan ökar
      { code: '3001', side: 'kredit', amount: 4000 }, // Varuinkomst
      { code: '2610', side: 'kredit', amount: 1000 }, // Utgående moms
    ],
  },
  {
    id: 21,
    title: 'Insättning dagskassa',
    text: 'Vi tar 5 000 kr ur kassan och sätter in på företagskontot.',
    solution: [
      { code: '1930', side: 'debet', amount: 5000 }, // Bank ökar
      { code: '1910', side: 'kredit', amount: 5000 }, // Kassa minskar
    ],
  },
  {
    id: 22,
    title: 'Betalning av skatter & avgifter',
    text: 'Vi betalar in förra månadens personalskatt (9 000 kr) och sociala avgifter (9 400 kr) till Skatteverket via företagskontot.',
    solution: [
      { code: '2710', side: 'debet', amount: 9000 }, // Skulden nollas
      { code: '2730', side: 'debet', amount: 9400 }, // Skulden nollas
      { code: '1930', side: 'kredit', amount: 18400 }, // Pengar ut
    ],
  },
  {
    id: 23,
    title: 'Utnyttjande av checkkredit',
    text: 'Kontot är tomt! Vi köper varor för 20 000 kr + moms (5 000 kr) och betalar genom att utnyttja vår checkräkningskredit (vi ökar vår skuld till banken).',
    solution: [
      { code: '4010', side: 'debet', amount: 20000 },
      { code: '2640', side: 'debet', amount: 5000 },
      { code: '2330', side: 'kredit', amount: 25000 }, // Skuld checkkredit ökar
    ],
  },
  {
    id: 24,
    title: 'Övriga intäkter',
    text: 'Vi säljer gamla lastpallar och får 2 000 kr + moms (500 kr) insatt på företagskontot.',
    solution: [
      { code: '1930', side: 'debet', amount: 2500 },
      { code: '3900', side: 'kredit', amount: 2000 }, // Övrig intäkt
      { code: '2610', side: 'kredit', amount: 500 },
    ],
  },
  {
    id: 25,
    title: 'Inköp av företagsbil',
    text: 'Företaget köper en begagnad bil för 100 000 kr (ingen avlyftbar moms på personbilar i detta fall, så hela beloppet bokförs som tillgång). Vi betalar med banklån direkt.',
    solution: [
      { code: '1240', side: 'debet', amount: 100000 }, // Tillgång Bilar
      { code: '2350', side: 'kredit', amount: 100000 }, // Skuld Banklån ökar
    ],
  },

  // --- NYA ÖVNINGAR 26-50 ---
  {
    id: 26,
    title: 'Försäljning mot kontant betalning',
    text: 'Vi säljer varor kontant för 8 000 kr inkl moms (25%).',
    solution: [
      { code: '1910', side: 'debet', amount: 8000 },
      { code: '3001', side: 'kredit', amount: 6400 },
      { code: '2610', side: 'kredit', amount: 1600 },
    ],
  },
  {
    id: 27,
    title: 'Inköp kontant (momsfri tjänst)',
    text: 'Vi köper städtjänst för 2 000 kr, ingen moms.',
    solution: [
      { code: '5400', side: 'debet', amount: 2000 },
      { code: '1910', side: 'kredit', amount: 2000 },
    ],
  },
  {
    id: 28,
    title: 'Insättning från ägare',
    text: 'Ägaren sätter in 20 000 kr i företagskontot som aktiekapital.',
    solution: [
      { code: '1930', side: 'debet', amount: 20000 },
      { code: '2081', side: 'kredit', amount: 20000 },
    ],
  },
  {
    id: 29,
    title: 'Betalning av leverantörsfaktura via bank',
    text: 'Betalar leverantörsfaktura på 7 500 kr från företagskontot.',
    solution: [
      { code: '2440', side: 'debet', amount: 7500 },
      { code: '1930', side: 'kredit', amount: 7500 },
    ],
  },
  {
    id: 30,
    title: 'Korrigering: felaktig bokning',
    text: 'Vi korrigerar en tidigare felaktigt bokförd utgift som var 3 000 kr.',
    solution: [
      { code: '4010', side: 'kredit', amount: 3000 },
      { code: '1930', side: 'debet', amount: 3000 },
    ],
  },
  {
    id: 31,
    title: 'Försäljning på kredit med rabatt',
    text: 'Säljer för 50 000 kr ex moms, men ger 5% rabatt (2 500 kr). Momsen 25%.',
    solution: [
      { code: '3001', side: 'kredit', amount: 47500 },
      { code: '2610', side: 'kredit', amount: 11875 },
      { code: '1510', side: 'debet', amount: 59375 },
    ],
  },
  {
    id: 32,
    title: 'Betalning av lön via autogiro',
    text: 'Utbetalar nettolön 18 000 kr och arbetsgivaravgifter 5 650 kr.',
    solution: [
      { code: '7010', side: 'debet', amount: 23000 },
      { code: '2710', side: 'kredit', amount: 9000 },
      { code: '1930', side: 'kredit', amount: 14000 },
    ],
  },
  {
    id: 33,
    title: 'Kvitto köpt material kontant',
    text: 'Köper material för 1 200 kr inkl moms (25%) kontant.',
    solution: [
      { code: '4010', side: 'debet', amount: 960 },
      { code: '2640', side: 'debet', amount: 240 },
      { code: '1910', side: 'kredit', amount: 1200 },
    ],
  },
  {
    id: 34,
    title: 'Mindre uttag till ägare',
    text: 'Ägaren tar ut 3 000 kr privat från företagskontot.',
    solution: [
      { code: '2081', side: 'debet', amount: 3000 },
      { code: '1930', side: 'kredit', amount: 3000 },
    ],
  },
  {
    id: 35,
    title: 'Försäljning tjänst fakturerad',
    text: 'Fakturerar kund 12 000 kr + moms 25%.',
    solution: [
      { code: '3041', side: 'kredit', amount: 12000 },
      { code: '2610', side: 'kredit', amount: 3000 },
      { code: '1510', side: 'debet', amount: 15000 },
    ],
  },
  {
    id: 36,
    title: 'Betalning av försäkring',
    text: 'Betalar försäkringspremie 6 000 kr (momsfri) från företagskontot.',
    solution: [
      { code: '5400', side: 'debet', amount: 6000 },
      { code: '1930', side: 'kredit', amount: 6000 },
    ],
  },
  {
    id: 37,
    title: 'Fakturautskrift - kund betalar delvis',
    text: 'Kund betalar 5 000 kr på faktura som tidigare var 15 000 kr inklusive moms.',
    solution: [
      { code: '1930', side: 'debet', amount: 5000 },
      { code: '1510', side: 'kredit', amount: 5000 },
    ],
  },
  {
    id: 38,
    title: 'Återköp från leverantör (kreditfaktura)',
    text: 'Leverantören ger kredit på 2 500 kr + moms 625 kr.',
    solution: [
      { code: '2440', side: 'debet', amount: 3125 },
      { code: '4010', side: 'kredit', amount: 2500 },
      { code: '2640', side: 'kredit', amount: 625 },
    ],
  },
  {
    id: 39,
    title: 'Ränteintäkt från bank',
    text: 'Banken sätter in 120 kr i ränta på företagskontot.',
    solution: [
      { code: '1930', side: 'debet', amount: 120 },
      { code: '8310', side: 'kredit', amount: 120 },
    ],
  },
  {
    id: 40,
    title: 'Betalning av moms',
    text: 'Betalar in momsnetto 4 000 kr från företagskontot.',
    solution: [
      { code: '2610', side: 'debet', amount: 4000 },
      { code: '1930', side: 'kredit', amount: 4000 },
    ],
  },
  {
    id: 41,
    title: 'Köpt kontorsmöbler på kredit',
    text: 'Köper möbler för 15 000 kr + moms 3 750 kr mot faktura.',
    solution: [
      { code: '1220', side: 'debet', amount: 15000 },
      { code: '2640', side: 'debet', amount: 3750 },
      { code: '2440', side: 'kredit', amount: 18750 },
    ],
  },
  {
    id: 42,
    title: 'Avskrivning (förenklad)',
    text: 'Bokför årlig avskrivning på inventarie 2 000 kr.',
    solution: [
      { code: '7810', side: 'debet', amount: 2000 },
      { code: '1220', side: 'kredit', amount: 2000 },
    ],
  },
  {
    id: 43,
    title: 'Betalning via swish',
    text: 'Kund betalar 350 kr via Swish (omgående in på företagskonto).',
    solution: [
      { code: '1930', side: 'debet', amount: 350 },
      { code: '3001', side: 'kredit', amount: 280 },
      { code: '2610', side: 'kredit', amount: 70 },
    ],
  },
  {
    id: 44,
    title: 'Kostnadsersättning företagets resa',
    text: 'Betalar reseersättning 1 200 kr inkl moms (momsredovisning enkel).',
    solution: [
      { code: '5400', side: 'debet', amount: 960 },
      { code: '2640', side: 'debet', amount: 240 },
      { code: '1930', side: 'kredit', amount: 1200 },
    ],
  },
  {
    id: 45,
    title: 'Förskottsbetalning från kund',
    text: 'Kund betalar 10 000 kr i förskott för arbete som ska utföras senare (förutbetald intäkt).',
    solution: [
      { code: '1930', side: 'debet', amount: 10000 },
      { code: '2391', side: 'kredit', amount: 10000 },
    ],
  },
  {
    id: 46,
    title: 'Banköverföring mellan egna konton',
    text: 'Flyttar 5 000 kr från kassa till företagskonto.',
    solution: [
      { code: '1930', side: 'debet', amount: 5000 },
      { code: '1910', side: 'kredit', amount: 5000 },
    ],
  },
  {
    id: 47,
    title: 'Ersättning för reklam',
    text: 'Betalar 4 000 kr för annonsering (moms 25%).',
    solution: [
      { code: '5400', side: 'debet', amount: 3200 },
      { code: '2640', side: 'debet', amount: 800 },
      { code: '1930', side: 'kredit', amount: 4000 },
    ],
  },
  {
    id: 48,
    title: 'Utbetalning av utdelning',
    text: 'Företaget betalar utdelning 25 000 kr till ägare.',
    solution: [
      { code: '2081', side: 'debet', amount: 25000 },
      { code: '1930', side: 'kredit', amount: 25000 },
    ],
  },
  {
    id: 49,
    title: 'Justering av felaktig moms',
    text: 'Korrigerar moms där ingående moms ökar med 500 kr.',
    solution: [
      { code: '2640', side: 'debet', amount: 500 },
      { code: '1930', side: 'kredit', amount: 500 },
    ],
  },
  {
    id: 50,
    title: 'Slutsaldo - räkna av',
    text: 'Bokför en utbetalning på 2 200 kr som avslutar en leverantörsskuld.',
    solution: [
      { code: '2440', side: 'debet', amount: 2200 },
      { code: '1930', side: 'kredit', amount: 2200 },
    ],
  },
  // --- NYA ÖVNINGAR 51-100 ---
  {
    id: 51,
    title: 'Förskottsinköp varor',
    text: 'Vi betalar 30 000 kr i förskott för varuinköp, moms 25%.',
    solution: [
      { code: '1930', side: 'kredit', amount: 37500 },
      { code: '2640', side: 'debet', amount: 7500 },
      { code: '4010', side: 'debet', amount: 30000 },
    ],
  },
  {
    id: 52,
    title: 'Delbetalning från kund',
    text: 'Kund betalar 2 500 kr på en tidigare faktura.',
    solution: [
      { code: '1930', side: 'debet', amount: 2500 },
      { code: '1510', side: 'kredit', amount: 2500 },
    ],
  },
  {
    id: 53,
    title: 'Köp av material på kredit',
    text: 'Köper material för 6 400 kr ex moms mot faktura.',
    solution: [
      { code: '4010', side: 'debet', amount: 6400 },
      { code: '2640', side: 'debet', amount: 1600 },
      { code: '2440', side: 'kredit', amount: 8000 },
    ],
  },
  {
    id: 54,
    title: 'Utbetalning - kontantinköp',
    text: 'Köper kontorsmaterial för 450 kr kontant.',
    solution: [
      { code: '5400', side: 'debet', amount: 450 },
      { code: '1910', side: 'kredit', amount: 450 },
    ],
  },
  {
    id: 55,
    title: 'Bankavgift',
    text: 'Bank tar avgift 45 kr från företagskontot.',
    solution: [
      { code: '6990', side: 'debet', amount: 45 },
      { code: '1930', side: 'kredit', amount: 45 },
    ],
  },
  {
    id: 56,
    title: 'Returnerad kundbetalning',
    text: 'En tidigare betalning på 1 000 kr återbetalas till kund.',
    solution: [
      { code: '1510', side: 'debet', amount: 1000 },
      { code: '1930', side: 'kredit', amount: 1000 },
    ],
  },
  {
    id: 57,
    title: 'Amortering av lån',
    text: 'Amorterar lån med 20 000 kr via företagskontot.',
    solution: [
      { code: '2350', side: 'debet', amount: 20000 },
      { code: '1930', side: 'kredit', amount: 20000 },
    ],
  },
  {
    id: 58,
    title: 'Upplupen kostnad - ränta',
    text: 'Ränta 300 kr som ska betalas senare (upplupen kostnad).',
    solution: [
      { code: '8410', side: 'debet', amount: 300 },
      { code: '2350', side: 'kredit', amount: 300 },
    ],
  },
  {
    id: 59,
    title: 'Försäljning med kreditkort',
    text: 'Säljer varor för 1 800 kr inkl moms via kortbetalning.',
    solution: [
      { code: '1930', side: 'debet', amount: 1800 },
      { code: '3001', side: 'kredit', amount: 1440 },
      { code: '2610', side: 'kredit', amount: 360 },
    ],
  },
  {
    id: 60,
    title: 'Inventarieinköp kontant',
    text: 'Köper inventarie för 12 000 kr inkl moms.',
    solution: [
      { code: '1220', side: 'debet', amount: 9600 },
      { code: '2640', side: 'debet', amount: 2400 },
      { code: '1910', side: 'kredit', amount: 12000 },
    ],
  },
  {
    id: 61,
    title: 'Betalning leverantör via bank',
    text: 'Betalar faktura 9 000 kr via banken.',
    solution: [
      { code: '2440', side: 'debet', amount: 9000 },
      { code: '1930', side: 'kredit', amount: 9000 },
    ],
  },
  {
    id: 62,
    title: 'Nyemission från ägare',
    text: 'Ägaren sätter in 100 000 kr som aktiekapital.',
    solution: [
      { code: '1930', side: 'debet', amount: 100000 },
      { code: '2081', side: 'kredit', amount: 100000 },
    ],
  },
  {
    id: 63,
    title: 'Uttag ägare privat',
    text: 'Ägaren tar ut 1 500 kr privat från företagskontot.',
    solution: [
      { code: '2081', side: 'debet', amount: 1500 },
      { code: '1930', side: 'kredit', amount: 1500 },
    ],
  },
  {
    id: 64,
    title: 'Betalning av hyra via autogiro',
    text: 'Betalar hyra 12 000 kr (momsfri).',
    solution: [
      { code: '5010', side: 'debet', amount: 12000 },
      { code: '1930', side: 'kredit', amount: 12000 },
    ],
  },
  {
    id: 65,
    title: 'Försäljning tjänst med faktura',
    text: 'Fakturerar kund 6 000 kr + moms 25%.',
    solution: [
      { code: '3041', side: 'kredit', amount: 6000 },
      { code: '2610', side: 'kredit', amount: 1500 },
      { code: '1510', side: 'debet', amount: 7500 },
    ],
  },
  {
    id: 66,
    title: 'Banklån upptas',
    text: 'Företaget tar lån 250 000 kr som sätts in på kontot.',
    solution: [
      { code: '1930', side: 'debet', amount: 250000 },
      { code: '2350', side: 'kredit', amount: 250000 },
    ],
  },
  {
    id: 67,
    title: 'Momsjustering - retur',
    text: 'Vi returnerar varor och justerar moms, returbelopp 2 500 kr + moms 625 kr.',
    solution: [
      { code: '2440', side: 'debet', amount: 3125 },
      { code: '4010', side: 'kredit', amount: 2500 },
      { code: '2640', side: 'kredit', amount: 625 },
    ],
  },
  {
    id: 68,
    title: 'Arbetsgivaravgifter deklareras',
    text: 'Bokför arbetsgivaravgifter 4 700 kr som skuld.',
    solution: [
      { code: '7510', side: 'debet', amount: 4700 },
      { code: '2730', side: 'kredit', amount: 4700 },
    ],
  },
  {
    id: 69,
    title: 'Kostnadsreducering - rabatt från leverantör',
    text: 'Får rabatt på 1 200 kr som minskar leverantörsskulden.',
    solution: [
      { code: '2440', side: 'debet', amount: 1200 },
      { code: '4010', side: 'kredit', amount: 1200 },
    ],
  },
  {
    id: 70,
    title: 'Bankränta intjänad',
    text: 'Får ränteintäkt 80 kr från banken.',
    solution: [
      { code: '1930', side: 'debet', amount: 80 },
      { code: '8310', side: 'kredit', amount: 80 },
    ],
  },
  {
    id: 71,
    title: 'Betalning av telefonräkning',
    text: 'Telefonräkning 900 kr inkl moms betalas via bank.',
    solution: [
      { code: '6211', side: 'debet', amount: 900 },
      { code: '1930', side: 'kredit', amount: 900 },
    ],
  },
  {
    id: 72,
    title: 'Inkasso - kund blir betalningsinställd',
    text: 'En kundförlust konstateras, 4 000 kr.',
    solution: [
      { code: '3001', side: 'debet', amount: 4000 },
      { code: '1510', side: 'kredit', amount: 4000 },
    ],
  },
  {
    id: 73,
    title: 'Avskrivning på maskin',
    text: 'Årlig avskrivning 5 000 kr på maskin.',
    solution: [
      { code: '7810', side: 'debet', amount: 5000 },
      { code: '1220', side: 'kredit', amount: 5000 },
    ],
  },
  {
    id: 74,
    title: 'Betalning leverantör - delbetalning',
    text: 'Gör delbetalning 3 000 kr på leverantörsskuld.',
    solution: [
      { code: '2440', side: 'debet', amount: 3000 },
      { code: '1930', side: 'kredit', amount: 3000 },
    ],
  },
  {
    id: 75,
    title: 'Köpt programvara',
    text: 'Köper licens för 7 500 kr ex moms mot faktura.',
    solution: [
      { code: '5400', side: 'debet', amount: 7500 },
      { code: '2640', side: 'debet', amount: 1875 },
      { code: '2440', side: 'kredit', amount: 9375 },
    ],
  },
  {
    id: 76,
    title: 'Förskottsbetalning från kund',
    text: 'Tar emot 2 500 kr i förskott för framtida leverans.',
    solution: [
      { code: '1930', side: 'debet', amount: 2500 },
      { code: '2391', side: 'kredit', amount: 2500 },
    ],
  },
  {
    id: 77,
    title: 'UTbetalning - kontant till leverantör',
    text: 'Betalar 600 kr kontant till leverantör.',
    solution: [
      { code: '2440', side: 'debet', amount: 600 },
      { code: '1910', side: 'kredit', amount: 600 },
    ],
  },
  {
    id: 78,
    title: 'Mindre reparation - faktura',
    text: 'Betalar 2 200 kr för reparation via faktura (inkl moms).',
    solution: [
      { code: '5400', side: 'debet', amount: 1760 },
      { code: '2640', side: 'debet', amount: 440 },
      { code: '2440', side: 'kredit', amount: 2200 },
    ],
  },
  {
    id: 79,
    title: 'Försäljning med kredit - inkassokrav',
    text: 'Kund faktureras 9 000 kr + moms, ännu obetald.',
    solution: [
      { code: '3001', side: 'kredit', amount: 9000 },
      { code: '2610', side: 'kredit', amount: 2250 },
      { code: '1510', side: 'debet', amount: 11250 },
    ],
  },
  {
    id: 80,
    title: 'Återbetalning av lån från ägare',
    text: 'Ägaren återbetalar 10 000 kr av eget lån.',
    solution: [
      { code: '1930', side: 'debet', amount: 10000 },
      { code: '2330', side: 'kredit', amount: 10000 },
    ],
  },
  {
    id: 81,
    title: 'Kostnad för utbildning',
    text: 'Betalar 4 500 kr för personalutbildning (faktura).',
    solution: [
      { code: '5400', side: 'debet', amount: 4500 },
      { code: '2440', side: 'kredit', amount: 4500 },
    ],
  },
  {
    id: 82,
    title: 'Försäljning av begagnad inventarie',
    text: 'Säljer gammal dator för 2 000 kr kontant.',
    solution: [
      { code: '1910', side: 'debet', amount: 2000 },
      { code: '1220', side: 'kredit', amount: 2000 },
    ],
  },
  {
    id: 83,
    title: 'Betalning av sociala avgifter',
    text: 'Betalar arbetsgivaravgifter 9 400 kr från kontot.',
    solution: [
      { code: '2730', side: 'debet', amount: 9400 },
      { code: '1930', side: 'kredit', amount: 9400 },
    ],
  },
  {
    id: 84,
    title: 'Banköverföring - valutaeffekt',
    text: 'Valutaväxling orsakar kursförlust 300 kr.',
    solution: [
      { code: '6990', side: 'debet', amount: 300 },
      { code: '1930', side: 'kredit', amount: 300 },
    ],
  },
  {
    id: 85,
    title: 'Korrigering av felaktigt konterad kostnad',
    text: 'Flyttar 700 kr från fel konto till rätt konto.',
    solution: [
      { code: '5400', side: 'debet', amount: 700 },
      { code: '4010', side: 'kredit', amount: 700 },
    ],
  },
  {
    id: 86,
    title: 'Inkasso - delvis mottaget',
    text: 'Får 2 000 kr från kund som var delvis obetald.',
    solution: [
      { code: '1930', side: 'debet', amount: 2000 },
      { code: '1510', side: 'kredit', amount: 2000 },
    ],
  },
  {
    id: 87,
    title: 'Förskottsbetalning leverantör',
    text: 'Betalar 5 000 kr i förskott till leverantör (moms ex).',
    solution: [
      { code: '1930', side: 'kredit', amount: 5000 },
      { code: '2440', side: 'debet', amount: 5000 },
    ],
  },
  {
    id: 88,
    title: 'Mindre försäljning i kassan',
    text: 'Kontant försäljning 420 kr inkl moms.',
    solution: [
      { code: '1910', side: 'debet', amount: 420 },
      { code: '3001', side: 'kredit', amount: 336 },
      { code: '2610', side: 'kredit', amount: 84 },
    ],
  },
  {
    id: 89,
    title: 'Betalning via betalningsförmedlare',
    text: 'Inbetalning 3 500 kr via extern betalningsförmedlare.',
    solution: [
      { code: '1930', side: 'debet', amount: 3500 },
      { code: '3001', side: 'kredit', amount: 2800 },
      { code: '2610', side: 'kredit', amount: 700 },
    ],
  },
  {
    id: 90,
    title: 'Inköp av reklam kontant',
    text: 'Betalar reklam 2 500 kr kontant (inkl moms).',
    solution: [
      { code: '5400', side: 'debet', amount: 2000 },
      { code: '2640', side: 'debet', amount: 500 },
      { code: '1910', side: 'kredit', amount: 2500 },
    ],
  },
  {
    id: 91,
    title: 'Fakturakreditera kund',
    text: 'Ger kund kreditering 1 250 kr + moms 312,5 kr.',
    solution: [
      { code: '3001', side: 'debet', amount: 1250 },
      { code: '2610', side: 'debet', amount: 312.5 },
      { code: '1510', side: 'kredit', amount: 1562.5 },
    ],
  },
  {
    id: 92,
    title: 'Inköp av fordonsservice på kredit',
    text: 'Faktura 3 200 kr ex moms för service.',
    solution: [
      { code: '5400', side: 'debet', amount: 3200 },
      { code: '2640', side: 'debet', amount: 800 },
      { code: '2440', side: 'kredit', amount: 4000 },
    ],
  },
  {
    id: 93,
    title: 'Företagskort - inköp',
    text: 'Betalning via företagskort 1 100 kr inkl moms.',
    solution: [
      { code: '1930', side: 'debet', amount: 1100 },
      { code: '5400', side: 'kredit', amount: 880 },
      { code: '2640', side: 'kredit', amount: 220 },
    ],
  },
  {
    id: 94,
    title: 'Bokföring av gåva (marknadsföring)',
    text: 'Skickar gåva värd 600 kr inkl moms till kund.',
    solution: [
      { code: '5400', side: 'debet', amount: 480 },
      { code: '2640', side: 'debet', amount: 120 },
      { code: '1910', side: 'kredit', amount: 600 },
    ],
  },
  {
    id: 95,
    title: 'Nya aktier från ägarinjektion',
    text: 'Ägarna investerar ytterligare 50 000 kr.',
    solution: [
      { code: '1930', side: 'debet', amount: 50000 },
      { code: '2081', side: 'kredit', amount: 50000 },
    ],
  },
  {
    id: 96,
    title: 'Betalning av utlägg för anställd',
    text: 'Anställd får ersättning 900 kr kontant för utlägg.',
    solution: [
      { code: '7010', side: 'debet', amount: 900 },
      { code: '1910', side: 'kredit', amount: 900 },
    ],
  },
  {
    id: 97,
    title: 'Avräkning för kundfaktura som blir betald',
    text: 'Kund betalar en tidigare faktura på 7 500 kr.',
    solution: [
      { code: '1930', side: 'debet', amount: 7500 },
      { code: '1510', side: 'kredit', amount: 7500 },
    ],
  },
  {
    id: 98,
    title: 'Ej avdragsgill kostnad - fördelning',
    text: 'Del av kostnad 400 kr ej avdragsgill, konteras om.',
    solution: [
      { code: '6990', side: 'debet', amount: 400 },
      { code: '5400', side: 'kredit', amount: 400 },
    ],
  },
  {
    id: 99,
    title: 'Mindre säljtransaktion via kort',
    text: 'Säljer vara för 220 kr inkl moms via kort.',
    solution: [
      { code: '1930', side: 'debet', amount: 220 },
      { code: '3001', side: 'kredit', amount: 176 },
      { code: '2610', side: 'kredit', amount: 44 },
    ],
  },
  {
    id: 100,
    title: 'Periodisering - upplupen intäkt',
    text: 'Upplupen intäkt på 2 500 kr ska bokföras som intäkt nu men avräknas senare.',
    solution: [
      { code: '1510', side: 'debet', amount: 2500 },
      { code: '3041', side: 'kredit', amount: 2500 },
    ],
  },
]

// --- STATE ---
const currentExerciseIndex = ref(0)
const userAccounts = ref([]) // Lista över de T-konton användaren lagt till: { code, name, debit: val, credit: val }
const selectedAccountCode = ref('')
const feedbackMessage = ref('')
const feedbackType = ref('') // 'success' eller 'error'

// Track completed (corrected) exercises by id
const completedExercises = ref([])

// Pending group of linked exercises: ids that are answered in a chain but the chain hasn't finished yet
const pendingGroup = ref([])

// Store user answers per exercise id so we can restore when navigating back/forward in a chain
const userAnswersById = ref({})

// Helper: build predecessor map (id -> predecessorId) for quick chain traversal
function getPredecessorMap() {
  const map = new Map()
  exercises.forEach((e) => {
    if (e.next) map.set(e.next, e.id)
  })
  return map
}

// Given an exercise id, return the full chain of ids (root -> ... -> tail) that includes it
function getChainIdsFor(id) {
  if (!id) return []
  const pred = getPredecessorMap()
  // find root by walking predecessors
  let root = id
  while (pred.has(root)) {
    root = pred.get(root)
  }

  // build chain from root following `next`
  const mapById = new Map(exercises.map((e) => [e.id, e]))
  const chain = []
  let cur = root
  const seen = new Set()
  while (cur && !seen.has(cur)) {
    seen.add(cur)
    chain.push(cur)
    const ex = mapById.get(cur)
    if (!ex || !ex.next) break
    cur = ex.next
  }
  return chain
}

// Computed info for current chain (index and total). Null if not part of multi-step chain.
const chainInfo = computed(() => {
  const ex = currentExercise.value
  if (!ex) return null
  const ids = getChainIdsFor(ex.id)
  if (!ids || ids.length <= 1) return null
  const idx = ids.indexOf(ex.id)
  return { index: idx + 1, total: ids.length, ids }
})

// ORDER: exercises can be shuffled; exerciseOrder holds the current ordering
const exerciseOrder = ref([...exercises])

// Hämta nuvarande övning (från exerciseOrder)
const currentExercise = computed(() => {
  if (!exerciseOrder.value || exerciseOrder.value.length === 0) return null
  const idx = Math.min(currentExerciseIndex.value, exerciseOrder.value.length - 1)
  return exerciseOrder.value[idx]
})

// Totals for UX: sum of debet and kredit entered by the user
const totalDebit = computed(() =>
  userAccounts.value.reduce((sum, acc) => sum + Number(acc.debit || 0), 0),
)

const totalCredit = computed(() =>
  userAccounts.value.reduce((sum, acc) => sum + Number(acc.credit || 0), 0),
)

// --- FUNKTIONER ---

function addAccount() {
  if (!selectedAccountCode.value) return

  // Kolla om kontot redan finns
  const exists = userAccounts.value.find((acc) => acc.code === selectedAccountCode.value)
  if (exists) {
    alert('Detta konto är redan tillagt!')
    return
  }

  // Hitta kontoinfo
  const accountInfo = accountList.find((a) => a.code === selectedAccountCode.value)

  // Lägg till i användarens arbetsyta
  userAccounts.value.push({
    code: accountInfo.code,
    name: accountInfo.name,
    debit: '', // Användaren fyller i dessa
    credit: '',
  })

  // Återställ dropdown
  selectedAccountCode.value = ''
  feedbackMessage.value = '' // Rensa gamla felmeddelanden
}

// Persistens för ViewTwo: spara/återställ index och arbetsyta
function saveViewTwoState() {
  try {
    const key = 'viewtwo_state'
    const payload = {
      index: currentExerciseIndex.value,
      userAccounts: userAccounts.value,
      order: exerciseOrder.value.map((e) => e.id),
      completed: completedExercises.value,
      pendingGroup: pendingGroup.value,
      userAnswersById: userAnswersById.value,
    }
    localStorage.setItem(key, JSON.stringify(payload))
  } catch (e) {
    console.warn('Failed to save ViewTwo state', e)
  }
}

function loadViewTwoState() {
  try {
    const key = 'viewtwo_state'
    const raw = localStorage.getItem(key)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (parsed) {
        // restore order if present
        if (parsed.order && Array.isArray(parsed.order) && parsed.order.length > 0) {
          const map = new Map(exercises.map((ex) => [ex.id, ex]))
          const ordered = parsed.order.map((id) => map.get(id)).filter(Boolean)
          if (ordered.length === exercises.length) {
            exerciseOrder.value = ordered
          } else {
            exerciseOrder.value = [...exercises]
          }
        } else {
          exerciseOrder.value = [...exercises]
        }

        currentExerciseIndex.value = Math.min(parsed.index || 0, exerciseOrder.value.length - 1)
        userAccounts.value = parsed.userAccounts || []
        completedExercises.value = parsed.completed || []
        pendingGroup.value = parsed.pendingGroup || []
        userAnswersById.value = parsed.userAnswersById || {}
      }
    }
  } catch (e) {
    console.warn('Failed to load ViewTwo state', e)
  }
}

function removeAccount(code) {
  userAccounts.value = userAccounts.value.filter((a) => a.code !== code)
}

function checkAnswer() {
  const solution = currentExercise.value.solution

  // 1. Kolla om Debet = Kredit (Balans)
  let totalDebit = 0
  let totalCredit = 0

  userAccounts.value.forEach((acc) => {
    totalDebit += Number(acc.debit || 0)
    totalCredit += Number(acc.credit || 0)
  })

  if (totalDebit !== totalCredit) {
    feedbackType.value = 'error'
    feedbackMessage.value = `Det balanserar inte! Debet: ${totalDebit} kr, Kredit: ${totalCredit} kr.`
    return
  }

  if (totalDebit === 0) {
    feedbackType.value = 'error'
    feedbackMessage.value = 'Du har inte skrivit in några belopp än.'
    return
  }

  // 2. Kolla mot facit
  // Vi måste kolla att varje rad i facit finns matchad i användarens svar
  // Och att användaren inte har lagt till extra felaktiga rader

  let allCorrect = true

  // Loopa igenom facit och se om användaren har motsvarande
  solution.forEach((solRow) => {
    const userRow = userAccounts.value.find((u) => u.code === solRow.code)

    if (!userRow) {
      allCorrect = false
      return
    }

    // Kolla belopp på rätt sida
    const userVal = solRow.side === 'debet' ? Number(userRow.debit) : Number(userRow.credit)
    const otherVal = solRow.side === 'debet' ? Number(userRow.credit) : Number(userRow.debit)

    if (userVal !== solRow.amount || otherVal !== 0) {
      allCorrect = false
    }
  })

  // Kolla också att användaren inte lagt till fler konton än vad som behövs
  if (userAccounts.value.length !== solution.length) {
    allCorrect = false
  }

  if (allCorrect) {
    feedbackType.value = 'success'
    feedbackMessage.value = 'Helt rätt! 🎉'

    const ex = currentExercise.value
    const exId = ex && ex.id

    // If this exercise has a linked next that is not yet completed, keep answers
    // and move to the next linked exercise without clearing the workspace.
    if (ex && ex.next && !completedExercises.value.includes(ex.next)) {
      // add current to pending group
      if (exId && !pendingGroup.value.includes(exId)) pendingGroup.value.push(exId)

      // save user's answers for this exercise so we can restore when navigating back
      if (exId) {
        userAnswersById.value[exId] = JSON.parse(JSON.stringify(userAccounts.value))
        console.log(`[Chain] Saved answers for exercise ${exId}:`, userAnswersById.value[exId])
      }

      // find index of next in current order
      const nextIdx = exerciseOrder.value.findIndex((e) => e.id === ex.next)
      if (nextIdx >= 0) {
        console.log(`[Chain] Moving from ${exId} to next ${ex.next} (index ${nextIdx})`)
        currentExerciseIndex.value = nextIdx
        feedbackMessage.value = 'Fortsätt följdfrågan...'
        feedbackType.value = ''
        // if we have saved answers for the next exercise, restore them
        const nextId = ex.next
        const saved = userAnswersById.value && userAnswersById.value[nextId]
        if (saved) {
          console.log(`[Chain] Restoring saved answers for ${nextId}:`, saved)
          userAccounts.value = JSON.parse(JSON.stringify(saved))
        } else {
          console.log(`[Chain] No saved answers for ${nextId}, keeping current workspace`)
        }
      }
      // persist
      saveViewTwoState()
      return
    }

    // If there's no next (or next already completed), this ends a chain.
    // Mark this and any pending group ids as completed.
    const toMark = []
    if (pendingGroup.value.length) toMark.push(...pendingGroup.value)
    if (exId) toMark.push(exId)
    toMark.forEach((id) => {
      if (!completedExercises.value.includes(id)) completedExercises.value.push(id)
    })

    // clear pending group and workspace, then advance to next exercise
    // remove saved answers for the finished chain
    const toClear = toMark.slice()
    toClear.forEach((id) => {
      if (userAnswersById.value && userAnswersById.value[id]) delete userAnswersById.value[id]
    })
    pendingGroup.value = []
    userAccounts.value = []
    saveViewTwoState()
    // Move forward normally
    nextExercise()
  } else {
    feedbackType.value = 'error'
    feedbackMessage.value = 'Tyvärr, fel konton eller belopp. Försök igen!'
  }
}

function nextExercise() {
  if (currentExerciseIndex.value < exercises.length - 1) {
    currentExerciseIndex.value++
    // Nollställ allt
    userAccounts.value = []
    feedbackMessage.value = ''
    feedbackType.value = ''
  } else {
    feedbackType.value = 'success'
    feedbackMessage.value = 'Du har klarat alla övningar! Snyggt! 🏆'
  }
  // spara state
  saveViewTwoState()
}

// Gå till föregående uppgift
function prevExercise() {
  // Save current exercise answers before navigating away (if in a chain)
  const currentEx = currentExercise.value
  if (currentEx && currentEx.id) {
    const chainIds = getChainIdsFor(currentEx.id)
    // if current is in a multi-step chain, save its state
    if (chainIds && chainIds.length > 1) {
      console.log(`[Prev] Current exercise ${currentEx.id} is in chain:`, chainIds)
      userAnswersById.value[currentEx.id] = JSON.parse(JSON.stringify(userAccounts.value))
      console.log(`[Prev] Saved current answers for ${currentEx.id}:`, userAnswersById.value[currentEx.id])
    }

    const predMap = getPredecessorMap()
    const predId = predMap.get(currentEx.id)
    if (predId) {
      const predIdx = exerciseOrder.value.findIndex((e) => e.id === predId)
      if (predIdx >= 0) {
        console.log(`[Prev] Moving from ${currentEx.id} back to predecessor ${predId} (index ${predIdx})`)
        currentExerciseIndex.value = predIdx
        // restore saved answers if present
        const saved = userAnswersById.value && userAnswersById.value[predId]
        if (saved) {
          console.log(`[Prev] Restoring saved answers for ${predId}:`, saved)
          userAccounts.value = JSON.parse(JSON.stringify(saved))
        } else {
          console.log(`[Prev] No saved answers for ${predId}, clearing workspace`)
          userAccounts.value = []
        }
        feedbackMessage.value = ''
        feedbackType.value = ''
        saveViewTwoState()
        return
      }
    }
  }

  // default: step back normally (not in a chain)
  console.log(`[Prev] No chain predecessor, stepping back normally from index ${currentExerciseIndex.value}`)
  if (currentExerciseIndex.value > 0) {
    currentExerciseIndex.value--
  } else {
    // wrap-around till sista uppgift för enkel navigation
    currentExerciseIndex.value = Math.max(exercises.length - 1, 0)
  }

  // Nollställ arbetsytan när vi byter uppgift (default behavior)
  userAccounts.value = []
  feedbackMessage.value = ''
  feedbackType.value = ''
  // spara state
  saveViewTwoState()
}

// NY FUNKTION: Hoppa över uppgift
function skipExercise() {
  // Vi anropar nextExercise direkt för att gå vidare utan att rätta
  // Vill man kan man lägga till en text om att man hoppade över, men vi kör enkelt:
  nextExercise()
  saveViewTwoState()
}

// Hjälp: Fisher-Yates shuffle
function shuffleArray(arr) {
  const a = arr.slice()
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const tmp = a[i]
    a[i] = a[j]
    a[j] = tmp
  }
  return a
}

// Slumpa ordningen av övningar och hoppa till en slumpad övning
function shuffleAndRandomizeViewTwo() {
  const shuffled = shuffleArray(exerciseOrder.value)
  exerciseOrder.value = shuffled
  // välj en slumpmässig övning
  currentExerciseIndex.value = Math.floor(Math.random() * exerciseOrder.value.length)
  // rensa arbetsytan
  userAccounts.value = []
  feedbackMessage.value = ''
  feedbackType.value = ''
  // spara state inkl. order
  saveViewTwoState()
}

// Återställ sparad state vid mount och spara på förändringar
onMounted(() => {
  loadViewTwoState()
})

watch(currentExerciseIndex, () => {
  saveViewTwoState()
})

watch(
  userAccounts,
  () => {
    saveViewTwoState()
  },
  { deep: true },
)
</script>

<template>
  <div class="exercise-view">
    <!-- SCENARIO -->
    <div class="scenario-card">
      <div class="header-row">
        <h2>{{ currentExercise.title }}</h2>
        <div style="display: flex; gap: 12px; align-items: center">
          <span class="progress">({{ currentExerciseIndex + 1 }} / {{ exercises.length }})</span>
          <span v-if="chainInfo" class="chain-progress"
            >Serie: {{ chainInfo.index }} / {{ chainInfo.total }}</span
          >
        </div>
      </div>
      <p class="scenario-text">{{ currentExercise.text }}</p>
    </div>

    <!-- ARBETSYTA -->
    <div class="workspace">
      <!-- Kontoväljare -->
      <div class="add-bar">
        <select v-model="selectedAccountCode">
          <option disabled value="">-- Välj ett konto att lägga till --</option>
          <option v-for="acc in sortedAccountList" :key="acc.code" :value="acc.code">
            {{ acc.code }} {{ acc.name }}
          </option>
        </select>
        <button @click="addAccount" class="add-btn">➕ Lägg till T-konto</button>
      </div>

      <!-- Användarens T-konton -->
      <div class="t-accounts-grid">
        <div v-for="acc in userAccounts" :key="acc.code" class="t-account">
          <div class="t-header">
            <span>{{ acc.code }} {{ acc.name }}</span>
            <button class="remove-btn" @click="removeAccount(acc.code)">✕</button>
          </div>

          <div class="t-body">
            <!-- Debet Sida -->
            <div class="side debet">
              <label>Debet</label>
              <input type="number" v-model="acc.debit" placeholder="0" />
            </div>

            <div class="divider"></div>

            <!-- Kredit Sida -->
            <div class="side kredit">
              <label>Kredit</label>
              <input type="number" v-model="acc.credit" placeholder="0" />
            </div>
          </div>
        </div>

        <div v-if="userAccounts.length === 0" class="empty-hint">
          Välj konton i listan ovan för att börja bygga din kontering.
        </div>
      </div>

      <!-- Totals: show sum of Debet and Kredit -->
      <div class="totals-row" v-if="userAccounts.length">
        <span>Summa Debet: {{ totalDebit }} kr</span>
        <span>Summa Kredit: {{ totalCredit }} kr</span>
      </div>

      <!-- Action-knappar & Feedback -->
      <div class="action-area">
        <div class="buttons-row">
          <button @click="prevExercise" class="btn btn-prev">Föregående</button>
          <button @click="checkAnswer" class="btn btn-check">Rätta</button>
          <!-- NY KNAPP: Hoppa över -->
          <button @click="skipExercise" class="btn btn-skip">Hoppa över</button>
        </div>

        <!-- Slumpa centrerad under huvudknapparna -->
        <div class="shuffle-row">
          <button @click="shuffleAndRandomizeViewTwo" class="btn btn-shuffle">Slumpa</button>
        </div>

        <div v-if="feedbackMessage" :class="['feedback', feedbackType]">
          {{ feedbackMessage }}
          <button
            v-if="feedbackType === 'success' && currentExerciseIndex < exercises.length - 1"
            @click="nextExercise"
            class="next-btn"
          >
            Nästa uppgift ➡️
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.exercise-view {
  padding: 20px;
  max-width: 1000px;
  margin: 0 auto;
}

/* SCENARIO CARD */
.scenario-card {
  background: white;
  padding: 25px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  margin-bottom: 30px;
  border-left: 6px solid #2c3e50;
}

.header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.scenario-card h2 {
  margin: 0;
  color: #2c3e50;
  font-size: 1.5rem;
}

.scenario-text {
  font-size: 1.2rem;
  line-height: 1.6;
  color: #444;
}

.progress {
  font-weight: bold;
  color: #888;
}

/* WORKSPACE */
.add-bar {
  display: flex;
  gap: 15px;
  margin-bottom: 30px;
  background: #fff;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
}

select {
  flex: 1;
  padding: 10px;
  font-size: 1rem;
  border: 1px solid #ddd;
  border-radius: 5px;
}

.add-btn {
  background-color: #3498db;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
  font-size: 1rem;
}
.add-btn:hover {
  background-color: #2980b9;
}

/* T-KONTON GRID */
.t-accounts-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
  margin-bottom: 40px;
  min-height: 200px;
}

.empty-hint {
  color: #999;
  font-style: italic;
  font-size: 1.1rem;
  margin-top: 50px;
}

.t-account {
  background: white;
  width: 280px;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.t-header {
  background: #2c3e50;
  color: white;
  padding: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: bold;
}

.remove-btn {
  background: none;
  border: none;
  color: #ff6b6b;
  font-size: 1.2rem;
  cursor: pointer;
}
.remove-btn:hover {
  color: #ff4757;
}

.t-body {
  display: flex;
  position: relative;
  padding: 15px 5px;
  background: #fdfdfd;
}

.side {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 10px;
}

.side label {
  font-size: 0.8rem;
  text-transform: uppercase;
  color: #888;
  margin-bottom: 5px;
  font-weight: bold;
}

.side input {
  width: 100%;
  padding: 8px;
  text-align: right;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-weight: bold;
}

/* Vertikalt streck */
.divider {
  width: 2px;
  background-color: #2c3e50;
  margin: -15px 0; /* Dra ut den så den täcker hela höjden */
}

/* ACTION AREA */
.action-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.buttons-row {
  display: flex;
  gap: 15px;
}

/* Totals row to show sum of debet/kredit for better UX */
.totals-row {
  display: flex;
  justify-content: center;
  gap: 40px;
  margin-bottom: 20px;
  font-weight: bold;
  color: #2c3e50;
}

.feedback {
  padding: 15px 25px;
  border-radius: 8px;
  font-weight: bold;
  text-align: center;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.feedback.success {
  background-color: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.feedback.error {
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

.next-btn {
  background-color: #2c3e50;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 5px;
}

/* Unified button style - only color differs for variants */
.btn {
  padding: 15px 40px;
  border: none;
  border-radius: 50px;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  transition:
    transform 0.18s,
    background-color 0.18s;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
  color: white;
}

.btn:disabled {
  opacity: 0.5;
  cursor: default;
}

.btn-prev {
  background-color: #3498db;
}
.btn-prev:hover {
  transform: scale(1.03);
  background-color: #2d86c6;
}

.btn-check {
  background-color: #27ae60;
}
.btn-check:hover {
  transform: scale(1.03);
  background-color: #219150;
}

.btn-skip {
  background-color: #95a5a6;
}
.btn-skip:hover {
  transform: scale(1.03);
  background-color: #7f8c8d;
}

.btn-shuffle {
  background-color: #8e44ad;
}
.btn-shuffle:hover {
  transform: scale(1.03);
  background-color: #7a36a8;
}

.shuffle-row {
  display: flex;
  justify-content: center;
  margin-top: 12px;
}
</style>
