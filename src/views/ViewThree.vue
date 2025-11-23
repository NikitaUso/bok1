<script setup>
defineOptions({ name: 'QuizView' })
import { ref, computed, watch, onMounted } from 'vue'

// --- FRÅGEDATA ---

// 1. De generella frågorna (från tidigare)
// Gör listorna reaktiva så shuffle fungerar korrekt
const generalQuestions = ref([
  {
    id: 'g1',
    question: 'Vad är balansekvationen?',
    options: [
      'Tillgångar = Eget Kapital + Skulder',
      'Intäkter - Kostnader = Resultat',
      'Inbetalningar - Utbetalningar = Kassaflöde',
      'Tillgångar - Skulder = Intäkter',
    ],
    correct: 0,
  },
  {
    id: 'g2',
    question: 'Vilket påstående beskriver en "Kostnad"?',
    options: [
      'En utgift som betalas direkt vid inköpet',
      'Värdet av en förbrukad resurs under en viss period',
      'Inköpspriset för en vara',
      'En inbetalning från en kund',
    ],
    correct: 1,
  },
  {
    id: 'g3',
    question: 'På vilken sida i T-kontot ökar ett skuldkonto?',
    options: ['Debet (Vänster)', 'Kredit (Höger)', 'Båda sidor', 'Ingen av sidorna'],
    correct: 1,
  },
  {
    id: 'g4',
    question: 'Vad innebär försiktighetsprincipen?',
    options: [
      'Att man alltid ska bokföra affärshändelser direkt',
      'Att man ska värdera tillgångar lågt och skulder högt vid osäkerhet',
      'Att man aldrig får ta lån',
      'Att man måste spara alla kvitton i 10 år',
    ],
    correct: 1,
  },
  {
    id: 'g5',
    question: 'Vad är en anläggningstillgång?',
    options: [
      'En tillgång avsedd att säljas omgående',
      'Pengar på bankkontot',
      'En tillgång avsedd att stadigvarande brukas i rörelsen',
      'En skuld till leverantörer',
    ],
    correct: 2,
  },
  {
    id: 'g6',
    question: 'Vilken lag styr vem som är bokföringsskyldig?',
    options: [
      'Årsredovisningslagen (ÅRL)',
      'Bokföringslagen (BFL)',
      'Aktiebolagslagen (ABL)',
      'Inkomstskattelagen (IL)',
    ],
    correct: 1,
  },
  // --- Fler generella frågor ---
  {
    id: 'g7',
    question: 'Vilken post tillhör normalt en omsättningstillgång?',
    options: ['Maskiner', 'Kassa', 'Byggnader', 'Aktiekapital'],
    correct: 1,
  },
  {
    id: 'g8',
    question: 'Vad innebär matchningsprincipen?',
    options: [
      'Att intäkter och kostnader ska redovisas i samma period',
      'Att alla kostnader ska skjutas upp',
      'Att endast intäkter redovisas',
      'Att bokföringen ska ske manuellt',
    ],
    correct: 0,
  },
  {
    id: 'g9',
    question: 'Vad är ingående moms?',
    options: [
      'Moms du ska betala till Skatteverket',
      'Moms du får tillbaka från leverantörer',
      'Moms du tar ut av kunder',
      'Ingen av ovan',
    ],
    correct: 1,
  },
  {
    id: 'g10',
    question: 'Vad visar en resultaträkning främst?',
    options: [
      'Tillgångar vid årets slut',
      'Intäkter och kostnader för perioden',
      'Kassaflöden',
      'Skulder',
    ],
    correct: 1,
  },
  {
    id: 'g11',
    question: 'Vad är en upplupen kostnad?',
    options: [
      'En kostnad som betalats i förväg',
      'En kostnad som är intjänad men ej betald',
      'En kostnad som ännu inte uppkommit men som ska betalas senare',
      'En kostnad som aldrig behöver betalas',
    ],
    correct: 2,
  },
  {
    id: 'g12',
    question: 'Vilken kontogrupp är 3xxx normalt?',
    options: ['Tillgångar', 'Skulder', 'Intäkter', 'Kostnader'],
    correct: 2,
  },
  {
    id: 'g13',
    question: 'Vad är en avsättning i bokföring?',
    options: [
      'En säker skuld med bestämd tidpunkt',
      'En skyldighet som är sannolik men osäker i belopp eller tid',
      'En typ av intäkt',
      'En likvid tillgång',
    ],
    correct: 1,
  },
  {
    id: 'g14',
    question: 'Vad innebär periodisering av intäkter?',
    options: [
      'Att redovisa en inkomst i den period tjänsten faktiskt utförs',
      'Att skjuta upp intäkter till framtiden alltid',
      'Att bokföra intäkter endast vid betalning',
      'Att ignore intäkter under bokslutet',
    ],
    correct: 0,
  },
  {
    id: 'g15',
    question: 'Vilken av följande är EJ en likviditetspost?',
    options: ['Kassa', 'Kortfristiga fordringar', 'Maskiner', 'Bank'],
    correct: 2,
  },
  {
    id: 'g16',
    question: 'Vad är ingående balans (IB)?',
    options: [
      'Balans vid årets slut',
      'Föregående års utgående balans som blir nästkommande års ingång',
      'Det belopp som aldrig förändras',
      'Kassabehållningen vid bokslutet',
    ],
    correct: 1,
  },
  {
    id: 'g17',
    question: 'Vilket konto minskar när du betalar en leverantörsfaktura?',
    options: ['Kassa/Bank', 'Leverantörsskulder', 'Båda', 'Inget'],
    correct: 2,
  },
  {
    id: 'g18',
    question: 'Vad är en kreditfaktura?',
    options: [
      'En faktura som ökar kundens skuld',
      'En korrigerande faktura som minskar beloppet',
      'En faktura för kreditförsäljning',
      'En faktura utan moms',
    ],
    correct: 1,
  },
  {
    id: 'g19',
    question: 'Vad menas med obeskattade reserver?',
    options: [
      'Reserver som redan är beskattade',
      'Vinster som avsätts i balansräkningen för att senare beskattas',
      'En skatt som betalas i förskott',
      'Ett slags bokföringsfel',
    ],
    correct: 1,
  },
  {
    id: 'g20',
    question: 'Vilken är en vanlig momsats i Sverige?',
    options: ['10%', '12%', '25%', '5%'],
    correct: 2,
  },
  {
    id: 'g21',
    question: 'Vad betyder att en skuld är kortfristig?',
    options: ['Betalas inom 12 månader', 'Betalas inom 5 år', 'Betalas aldrig', 'Inget av ovan'],
    correct: 0,
  },
  {
    id: 'g22',
    question: 'Vad är en verifikation?',
    options: [
      'Ett bevis på en affärshändelse, t.ex. kvitto eller faktura',
      'En typ av konto',
      'En redovisningsprincip',
      'En rapport till banken',
    ],
    correct: 0,
  },
  // --- NYA FRÅGOR (g23 - g50) ---
  {
    id: 'g23',
    question:
      'Vilken del av redovisningsprocessen handlar om att klassificera transaktioner i konton?',
    options: [
      'Rapportering',
      'Löpande bokföring',
      'Bokslutsarbete',
      'Transaktioner och omständigheter',
    ],
    correct: 1,
  },
  {
    id: 'g24',
    question: 'Vilken rapport visar företagets finansiella ställning vid en bestämd tidpunkt?',
    options: ['Resultaträkning', 'Kassaflödesanalys', 'Balansräkning', 'Noter'],
    correct: 2,
  },
  {
    id: 'g25',
    question: 'Vad innebär periodisering i redovisningen?',
    options: [
      'Att flytta poster mellan företag',
      'Att fördela inkomster och utgifter till rätt redovisningsperiod',
      'Att betala skatt i förskott',
      'Att arkivera verifikationer',
    ],
    correct: 1,
  },
  {
    id: 'g26',
    question: 'Vilken rapport visar företagets in- och utbetalningar?',
    options: ['Balansräkning', 'Resultaträkning', 'Kassaflödesanalys', 'Noter'],
    correct: 2,
  },
  {
    id: 'g27',
    question: 'Vad är en avsättning i bokföring?',
    options: [
      'En säker skuld med bestämd tidpunkt',
      'En skuld som är osäker i belopp eller tidpunkt',
      'En intäkt som skjuts upp',
      'En likvid tillgång',
    ],
    correct: 1,
  },
  {
    id: 'g28',
    question: 'Vilken huvudregel gäller för när kontanta in- och utbetalningar ska bokföras?',
    options: ['Senast nästa arbetsdag', 'Inom ett år', 'Vid bokslut', 'Aldrig'],
    correct: 0,
  },
  {
    id: 'g29',
    question: 'Vilken kontogrupp innehåller normalt kostnadskonton (t.ex. 5xxx)?',
    options: ['Tillgångar', 'Skulder', 'Intäkter', 'Kostnader'],
    correct: 3,
  },
  {
    id: 'g30',
    question: 'Vad menas med väsentlighet i redovisning?',
    options: [
      'Att alltid redovisa allt i detalj',
      'Att endast stora företag behöver redovisning',
      'Att information som kan påverka beslut ska tas med',
      'Att redovisningen måste vara hemlig',
    ],
    correct: 2,
  },
  {
    id: 'g31',
    question:
      'Vilken myndighet ger vägledning för redovisning för icke-noterade företag i Sverige?',
    options: ['Skatteverket', 'Bokföringsnämnden', 'Finansinspektionen', 'Bolagsverket'],
    correct: 1,
  },
  {
    id: 'g32',
    question: 'Vilken skattesats är vanlig för moms på normal varuförsäljning i Sverige?',
    options: ['6%', '12%', '25%', '0%'],
    correct: 2,
  },
  {
    id: 'g33',
    question: 'Vad beskriver intressentmodellen i redovisningssammanhang?',
    options: [
      'Hur intressenter påverkas av företagets redovisning och har krav',
      'Hur man upprättar en balansräkning',
      'Hur skatten beräknas',
      'Hur kontoplanen ska byggas',
    ],
    correct: 0,
  },
  {
    id: 'g34',
    question: 'Vad är en interimspost (t.ex. upplupen kostnad)?',
    options: [
      'En kostnad som är betald i förskott',
      'En kostnad som hänför sig till perioden men ännu ej betalats',
      'En skuld som aldrig betalas',
      'En inkomst som ännu ej fakturerats',
    ],
    correct: 1,
  },
  {
    id: 'g35',
    question: 'Vilket huvudsyfte har extern redovisning?',
    options: [
      'Att ge detaljerad intern styrinformation',
      'Att kommunicera ekonomisk information till externa användare',
      'Att bestämma löner',
      'Att ersätta skattedeklarationen',
    ],
    correct: 1,
  },
  {
    id: 'g36',
    question: 'Vad kallas den systematik som visar debet och kredit för ett konto?',
    options: ['Resultaträkning', 'T-konto', 'Kontoplan', 'Kassaflödesanalys'],
    correct: 1,
  },
  {
    id: 'g37',
    question: 'Vad innebär dubbel bokföring?',
    options: [
      'Att varje händelse bokförs på minst två konton med lika stort belopp i debet och kredit',
      'Att man bokför allt två gånger',
      'Att endast debet används',
      'Att bokföringen görs av två personer samtidigt',
    ],
    correct: 0,
  },
  {
    id: 'g38',
    question: 'Vilken av nedanstående är inte en del i kassaflödesanalysen?',
    options: [
      'Löpande verksamheten',
      'Investeringsverksamheten',
      'Finansieringsverksamheten',
      'Noter',
    ],
    correct: 3,
  },
  {
    id: 'g39',
    question: 'Vad visar resultaträkningen huvudsakligen?',
    options: [
      'Tillgångar och skulder',
      'Intäkter och kostnader för perioden',
      'Kassaflöden',
      'Eget kapital',
    ],
    correct: 1,
  },
  {
    id: 'g40',
    question: 'Vilken uppgift har en kontoplan (t.ex. BAS)?',
    options: [
      'Att fastställa skatt',
      'Att strukturera konton så att rapporter kan upprättas konsekvent',
      'Att ersätta bokföringslagen',
      'Att bestämma löner',
    ],
    correct: 1,
  },
  {
    id: 'g41',
    question: 'Vad är en nedskrivning av en tillgång?',
    options: [
      'En uppskrivning till marknadsvärde',
      'En minskning av det redovisade värdet när verkligt värde sjunkit',
      'En typ av avskrivning för immateriella tillgångar',
      'Att slå ihop två konton',
    ],
    correct: 1,
  },
  {
    id: 'g42',
    question: 'Vad innebär anskaffningsvärde vid värdering?',
    options: [
      'Det pris som tillgången skulle säljas för idag',
      'Det historiska priset vid förvärv minus ackumulerade avskrivningar',
      'Ett uppskattat framtida värde',
      'Ett värde baserat på skattemyndighetens bedömning',
    ],
    correct: 1,
  },
  {
    id: 'g43',
    question: 'Vilken information behöver en verifikation normalt innehålla?',
    options: [
      'När händelsen inträffade, vad den avser, belopp och motpart',
      'Endast beloppet',
      'Endast vem som godkände bokföringen',
      'Endast vilken bank som användes',
    ],
    correct: 0,
  },
  {
    id: 'g44',
    question: 'Vilken av följande är en finansiell anläggningstillgång?',
    options: ['Kassa', 'Byggnad', 'Aktier i ett annat företag som ägs långsiktigt', 'Varulager'],
    correct: 2,
  },
  {
    id: 'g45',
    question: 'Vad är en upplupen intäkt?',
    options: [
      'En intäkt som redan betalats',
      'En intäkt som är intjänad men ännu ej fakturerad eller betald',
      'En intäkt som aldrig bokförs',
      'En framtida prognospost',
    ],
    correct: 1,
  },
  {
    id: 'g46',
    question: 'Vad menas med bundet eget kapital?',
    options: [
      'Kapital som fritt kan delas ut till ägare',
      'Kapital som inte får delas ut enligt lag eller bolagsordning',
      'En typ av skuld',
      'Kassa och bank',
    ],
    correct: 1,
  },
  {
    id: 'g47',
    question: 'Varför krävs redovisning för skattesystemet?',
    options: [
      'För att redovisning bestämmer momssatser',
      'För att skatten baseras på ett företags deklarerade resultat',
      'För att undvika revision',
      'För att bestämma anställningstrygghet',
    ],
    correct: 1,
  },
  {
    id: 'g48',
    question: 'Vad kännetecknar omsättningstillgångar?',
    options: [
      'Att de används under lång tid (>1 år)',
      'Att de avses omsättas inom ett år',
      'Att de aldrig värderas',
      'Att de alltid är immateriella',
    ],
    correct: 1,
  },
  {
    id: 'g49',
    question: 'Vad visar kassaflödesanalysen som resultat- och balansräkningen inte visar direkt?',
    options: [
      'Periodens intäkter och kostnader',
      'Företagets likviditet genom faktiska in- och utbetalningar',
      'Eget kapitalets förändring',
      'En komplett kontoplan',
    ],
    correct: 1,
  },
  {
    id: 'g50',
    question: 'Vilket av följande är sant om aktieägare i noterade företag?',
    options: [
      'De brukar ha detaljerad daglig insyn i verksamheten',
      'De förlitar sig ofta på redovisning eftersom de saknar direkt insyn',
      'De alltid styr den operativa verksamheten',
      'De inte påverkas av redovisningen',
    ],
    correct: 1,
  },
])

// 2. Docs frågor (Kapitel 1-4)
const docsQuestions = ref([
  // --- KAPITEL 1 ---
  {
    question: 'Vad är redovisningens huvudsakliga syfte?',
    options: [
      'Att minska skatter för organisationen',
      'Att kommunicera ekonomisk information till omvärlden',
      'Att kontrollera de anställdas prestationer',
      'Att följa mode inom ekonomi',
    ],
    correct: 1,
    explanation:
      'Redovisning är ett språk för ekonomisk kommunikation mellan organisationen och dess omvärld.',
  },
  {
    question: 'Vilken av följande beskrivningar stämmer bäst in på extern redovisning?',
    options: [
      'Den används endast internt inom företaget',
      'Den riktar sig till användare utanför organisationen',
      'Den gäller bara för statliga organisationer',
      'Den handlar om personalfrågor',
    ],
    correct: 1,
    explanation:
      'Extern redovisning kommunicerar ekonomisk information till externa intressenter som ägare, banker och staten.',
  },
  {
    question: 'Varför är redovisning viktig för samhället i stort?',
    options: [
      'För att den underlättar hushållens konsumtion',
      'För att den möjliggör ekonomiska transaktioner och kapitaltillväxt',
      'För att den ersätter statliga regler',
      'För att den styr inflationen',
    ],
    correct: 1,
    explanation:
      'Redovisning är grunden för ekonomiska relationer och fördelning av kapital i samhället.',
  },
  {
    question: 'Hur skiljer sig en privatpersons ekonomi från en organisations ekonomi?',
    options: [
      'Privatpersoner behöver inte planera sin ekonomi',
      'Organisationer måste redovisa formellt och planerat',
      'Privatpersoner redovisar varje månad',
      'Organisationer saknar inkomstdeklaration',
    ],
    correct: 1,
    explanation:
      'Organisationer behöver systematiskt följa upp intäkter och kostnader – till skillnad från privatpersoner som ofta gör det informellt.',
  },
  {
    question:
      'Vilken är den största skillnaden mellan en privat deklaration och en årsredovisning?',
    options: [
      'Årsredovisningen är offentlig och mer omfattande',
      'Deklarationen lämnas in oftare',
      'Årsredovisningen handlar bara om skatt',
      'Deklarationen är frivillig',
    ],
    correct: 0,
    explanation:
      'En årsredovisning är tillgänglig för allmänheten och är mycket mer detaljerad än privatpersoners deklaration.',
  },
  {
    question: 'Vad beskriver intressentmodellen?',
    options: [
      'Hur vinster ska fördelas mellan aktieägare',
      'Hur organisationen är beroende av olika parter i omgivningen',
      'Hur staten kontrollerar företag',
      'Hur marknadsföring ska planeras',
    ],
    correct: 1,
    explanation:
      'Intressentmodellen visar att organisationen och dess omgivning har ett ömsesidigt beroende.',
  },
  {
    question: 'Varför är intressenternas förtroende viktigt?',
    options: [
      'För att undvika skatter',
      'För att säkra organisationens överlevnad',
      'För att minska lönekostnader',
      'För att undvika konkurrens',
    ],
    correct: 1,
    explanation:
      'Om intressenterna tappar förtroendet (t.ex. finansiärer, kunder, leverantörer), riskerar organisationen att inte kunna fortsätta.',
  },
  {
    question: 'Vad menas med en organisations legitimitet?',
    options: [
      'Att den är lagligt registrerad',
      'Att den uppfattas som ansvarstagande i samhället',
      'Att den betalar skatt i tid',
      'Att den har starka ägare',
    ],
    correct: 1,
    explanation:
      'Legitimitet handlar om att framstå som ansvarstagande i frågor som miljö, etik och samhällsansvar.',
  },
  {
    question: 'Varför är redovisning särskilt viktig för ägare i större företag?',
    options: [
      'För att de inte har direkt inblick i verksamheten',
      'För att de styr det dagliga arbetet',
      'För att de sätter löner',
      'För att de sköter bokföringen själva',
    ],
    correct: 0,
    explanation:
      'I stora företag är ägarna ofta långt ifrån verksamheten, och redovisningen ger dem nödvändig insyn.',
  },
  {
    question: 'Vad menas med informationsasymmetri?',
    options: [
      'Att alla parter har lika mycket information',
      'Att ledningen har mer information än ägarna',
      'Att redovisningen är felaktig',
      'Att investerare inte får tillgång till årsredovisningen',
    ],
    correct: 1,
    explanation:
      'Informationsasymmetri innebär att företagsledningen vet mer än ägarna – redovisning minskar denna skillnad.',
  },
  {
    question: 'Hur använder banker redovisning?',
    options: [
      'För att beräkna räntor på kunders lån',
      'För att bedöma företags återbetalningsförmåga',
      'För att fastställa löner för bankanställda',
      'För att undvika konkurrens',
    ],
    correct: 1,
    explanation:
      'Banker analyserar företags redovisning för att se om de har resurser och intjäningsförmåga att betala tillbaka lån.',
  },
  {
    question: 'Varför är redovisning något mindre viktig för banker än för investerare?',
    options: [
      'För att banker ofta har direktkontakt med företagsledningen',
      'För att banker inte bryr sig om vinster',
      'För att banker äger företagen',
      'För att banker bara lånar till små företag',
    ],
    correct: 0,
    explanation:
      'Banker kan kräva extra information direkt från företaget – de är inte lika beroende av offentlig redovisning.',
  },
  {
    question: 'Varför är redovisning nödvändig för skattesystemet?',
    options: [
      'För att den visar vilka anställda som finns',
      'För att den möjliggör rättvis beskattning baserat på inkomst',
      'För att den bestämmer momssatser',
      'För att undvika konkurser',
    ],
    correct: 1,
    explanation:
      'Skatteverket behöver redovisning för att kunna fastställa företags inkomst och därmed rätt skatt.',
  },
  {
    question: 'Hur kan redovisning vara användbar för de anställda?',
    options: [
      'För att bestämma semesterlängd',
      'För att bedöma företagets löneutrymme och trygghet',
      'För att välja aktieägare',
      'För att planera sin fritid',
    ],
    correct: 1,
    explanation:
      'Redovisning visar hur företaget mår ekonomiskt, vilket påverkar löner och trygghet.',
  },
  {
    question: 'Hur kan kunder och leverantörer använda redovisning?',
    options: [
      'För att skapa reklamkampanjer',
      'För att bedöma betalningsförmåga och stabilitet',
      'För att jämföra löner',
      'För att undvika redovisningsskyldighet',
    ],
    correct: 1,
    explanation:
      'Kunder vill veta att företaget kan leverera, leverantörer att de får betalt – båda ser till redovisningen för att bedöma detta.',
  },

  // --- KAPITEL 2 ---
  {
    question: 'Vad är extern redovisningens huvudsakliga fokus?',
    options: [
      'Interna kostnadsanalyser',
      'Finansiella rapporter som resultaträkning, balansräkning och kassaflödesanalys',
      'Budgetarbete och planering',
      'Personalredovisning',
    ],
    correct: 1,
    explanation:
      'Extern redovisning handlar om de finansiella rapporterna som visar organisationens ekonomiska ställning utåt.',
  },
  {
    question: 'Vad innebär redovisning enligt definitionen i kapitlet?',
    options: [
      'Endast att bokföra inkomster och utgifter',
      'Att registrera transaktioner och sammanställa dem i finansiella rapporter',
      'Att skapa budgetar och prognoser',
      'Att analysera marknaden',
    ],
    correct: 1,
    explanation:
      'Redovisning är hela processen från registrering av transaktioner till att presentera finansiella rapporter.',
  },
  {
    question: 'Vad är syftet med extern redovisning?',
    options: [
      'Att minska interna kostnader',
      'Att överbrygga informationsasymmetri mellan företaget och intressenter',
      'Att förbättra företagets marknadsföring',
      'Att beräkna löner',
    ],
    correct: 1,
    explanation:
      'Extern redovisning ska minska informationsklyftan mellan företaget och externa parter som ägare, banker och Skatteverket.',
  },
  {
    question: 'Vad skiljer extern redovisning från intern redovisning?',
    options: [
      'Extern redovisning riktar sig till interna beslutsfattare',
      'Intern redovisning följer lagkrav',
      'Extern redovisning riktar sig till intressenter utanför företaget',
      'De är exakt samma sak',
    ],
    correct: 2,
    explanation:
      'Extern redovisning är till för externa användare och regleras av lagar och normer, till skillnad från intern redovisning.',
  },
  {
    question: 'Vilka är de fyra stegen i redovisningsprocessen?',
    options: [
      'Registrering, analys, granskning, kommunikation',
      'Transaktioner och omständigheter, löpande redovisning, bokslutsarbete, rapportering',
      'Inkomst, utgift, intäkt, kostnad',
      'Resultaträkning, balansräkning, noter, kassaflödesanalys',
    ],
    correct: 1,
    explanation:
      'Redovisningsprocessen omfattar hela kedjan från transaktioner till rapportering i form av årsredovisning.',
  },
  {
    question: 'Vad avses med transaktioner i redovisningen?',
    options: [
      'Företagets interna beslut',
      'Alla typer av reklamaktiviteter',
      'Anskaffning och avyttring av resurser samt betalningar kopplade till fordringar och skulder',
      'Endast försäljningstransaktioner',
    ],
    correct: 2,
    explanation:
      'Transaktioner omfattar köp, försäljning, lån, amorteringar och andra ekonomiska händelser.',
  },
  {
    question: 'Vad menas med ekonomiska omständigheter?',
    options: [
      'Bara företagets framtida planer',
      'Företagets ägande av tillgångar och förekomst av skulder',
      'Enbart det som påverkar aktiekursen',
      'Personalens trivsel',
    ],
    correct: 1,
    explanation:
      'Omständigheter syftar på befintliga ekonomiska förhållanden som tillgångar och skulder.',
  },
  {
    question: 'Vad är syftet med löpande redovisning (bokföring)?',
    options: [
      'Att planera framtida investeringar',
      'Att systematiskt registrera och klassificera transaktioner',
      'Att analysera konkurrenters resultat',
      'Att utforma företagets strategi',
    ],
    correct: 1,
    explanation:
      'Bokföringen innebär att alla ekonomiska händelser dokumenteras löpande och sorteras i konton.',
  },
  {
    question: 'Vad är skillnaden mellan inbetalningar och inkomster?',
    options: [
      'De är exakt samma sak',
      'Inbetalningar sker när pengar kommer in, inkomster när varan eller tjänsten levereras',
      'Inbetalningar gäller kreditförsäljning, inkomster gäller kontantförsäljning',
      'Inkomster uppstår vid betalningstillfället',
    ],
    correct: 1,
    explanation:
      'Inbetalning avser pengaflödet, medan inkomsten uppstår när leveransen sker – oavsett betalning.',
  },
  {
    question: 'Vad är skillnaden mellan utgifter och kostnader?',
    options: [
      'Utgifter uppstår vid betalning, kostnader vid leverans',
      'Utgifter är framtida utbetalningar, kostnader är redan betalda',
      'Utgifter registreras när en resurs anskaffas, kostnader när resursen förbrukas',
      'De är samma sak i redovisningen',
    ],
    correct: 2,
    explanation:
      'Utgiften uppstår vid anskaffningen, medan kostnaden uppstår när resursen faktiskt förbrukas.',
  },
  {
    question: 'Vad betyder periodisering i redovisningen?',
    options: [
      'Att planera företagets likviditet',
      'Att fördela inkomster och utgifter till rätt redovisningsperiod',
      'Att minska skatten',
      'Att flytta skulder mellan bolag',
    ],
    correct: 1,
    explanation:
      'Periodisering innebär att man bestämmer vilka inkomster och utgifter som hör till den aktuella redovisningsperioden.',
  },
  {
    question: 'Vilka tre huvudrapporter upprättas i bokslutsarbetet?',
    options: [
      'Resultaträkning, balansräkning och kassaflödesanalys',
      'Inkomstdeklaration, budget och verksamhetsplan',
      'Lönelista, lagerinventering och kundregister',
      'Prognosrapport, finansplan och analysrapport',
    ],
    correct: 0,
    explanation:
      'Dessa tre rapporter utgör kärnan i den externa redovisningen och visar företagets resultat, ställning och kassaflöde.',
  },
  {
    question: 'Vad visar resultaträkningen?',
    options: [
      'Företagets framtida budget',
      'Periodens intäkter och kostnader',
      'Tillgångar och skulder på bokslutsdagen',
      'Endast utgifter',
    ],
    correct: 1,
    explanation:
      'Resultaträkningen visar hur företagets resultat (vinst eller förlust) uppkommit under perioden.',
  },
  {
    question: 'Vad visar balansräkningen?',
    options: [
      'Endast årets intäkter',
      'Endast in- och utbetalningar',
      'Företagets tillgångar, eget kapital och skulder på bokslutsdagen',
      'Prognoser över framtida vinster',
    ],
    correct: 2,
    explanation: 'Balansräkningen visar företagets ekonomiska ställning vid en viss tidpunkt.',
  },
  {
    question: 'Vad visar kassaflödesanalysen?',
    options: [
      'Periodens inbetalningar och utbetalningar',
      'En sammanställning av alla fakturor',
      'Företagets lönsamhet',
      'Balansen mellan skulder och eget kapital',
    ],
    correct: 0,
    explanation: 'Kassaflödesanalysen visar hur pengar har flutit in och ut under perioden.',
  },
  {
    question: 'Vad innebär rapportering i redovisningsprocessen?',
    options: [
      'Att skapa årsredovisning och andra finansiella rapporter som kommuniceras till användare',
      'Att granska personalens prestationer',
      'Att analysera marknadsdata',
      'Att förhandla med leverantörer',
    ],
    correct: 0,
    explanation:
      'Rapportering är sista steget där informationen sammanställs och kommuniceras i form av t.ex. årsredovisning.',
  },
  {
    question: 'Vilken av följande redovisningsrapporter är vanligast i företag?',
    options: ['Emissionsprospekt', 'Årsredovisning', 'Delårsdeklaration', 'Kassarapport'],
    correct: 1,
    explanation:
      'Årsredovisningen är den vanligaste formen av extern redovisning som ges ut årligen.',
  },
  {
    question:
      'Vilken är den redovisande organisationens huvudsakliga uppgift i redovisningssystemet?',
    options: [
      'Att skapa regler för redovisning',
      'Att utföra bokföring, bokslut och rapportering',
      'Att övervaka andra företag',
      'Att bestämma skattesatser',
    ],
    correct: 1,
    explanation:
      'Organisationen registrerar och sammanställer ekonomiska händelser för att upprätta rapporter.',
  },
  {
    question: 'Varför upprättas redovisningsrapporter?',
    options: [
      'För att de är lagstadgade och används av olika intressenter',
      'För att underlätta intern kommunikation',
      'För att ersätta budgetar',
      'För att minska administration',
    ],
    correct: 0,
    explanation:
      'Rapporterna tas fram eftersom de behövs av externa användare och ofta krävs enligt lag.',
  },
  {
    question: 'Vilka lagar innehåller de mest grundläggande reglerna för redovisning i Sverige?',
    options: [
      'Aktiebolagslagen och skattebrottslagen',
      'Bokföringslagen och årsredovisningslagen',
      'Revisionslagen och momslagen',
      'IFRS och K3',
    ],
    correct: 1,
    explanation:
      'Dessa lagar utgör grunden för svensk redovisningspraxis och gäller för de flesta företag.',
  },
  {
    question: 'Vilken myndighet utfärdar redovisningsregler för icke-noterade företag i Sverige?',
    options: ['Finansinspektionen', 'Bolagsverket', 'Bokföringsnämnden', 'Skatteverket'],
    correct: 2,
    explanation:
      'Bokföringsnämnden (BFN) ansvarar för att ge ut detaljerade regler för mindre och icke-noterade företag.',
  },
  {
    question: 'Vilket regelverk ska noterade företag följa?',
    options: [
      'Svenska bokföringslagen',
      'EU:s momsdirektiv',
      'Internationella redovisningsregler (IFRS)',
      'K2-regelverket',
    ],
    correct: 2,
    explanation:
      'Noterade företag ska följa IFRS för att kunna verka internationellt och söka kapital på flera marknader.',
  },

  // --- KAPITEL 3 ---
  {
    question: 'Vad är redovisningens slutprodukt?',
    options: ['Bokföringen', 'Redovisningsrapporterna', 'Lönehanteringen', 'Inkomstdeklarationen'],
    correct: 1,
    explanation:
      'Redovisningens syfte är att ta fram redovisningsrapporter som visar företagets ekonomiska situation.',
  },
  {
    question: 'Vilken rapport visar företagets in- och utbetalningar under året?',
    options: ['Resultaträkningen', 'Kassaflödesanalysen', 'Balansräkningen', 'Årsredovisningen'],
    correct: 1,
    explanation:
      'Kassaflödesanalysen visar företagets faktiska betalningsflöden under en viss period.',
  },
  {
    question: 'Vad är speciellt med kassaflödesanalysen jämfört med andra rapporter?',
    options: [
      'Den kräver ingen periodisering',
      'Den omfattar endast skulder',
      'Den är frivillig för alla företag',
      'Den visar bara resultatet',
    ],
    correct: 0,
    explanation:
      'Kassaflödesanalysen baseras enbart på betalningar och kräver därför ingen periodisering.',
  },
  {
    question: 'Vilka tre delar består kassaflödesanalysen av?',
    options: [
      'Intäkter, kostnader och resultat',
      'Den löpande verksamheten, investeringsverksamheten och finansieringsverksamheten',
      'Inkomster, utgifter och avskrivningar',
      'Tillgångar, eget kapital och skulder',
    ],
    correct: 1,
    explanation:
      'Dessa tre delar visar varifrån pengarna kommer och hur de används i verksamheten.',
  },
  {
    question: 'Hur beräknas årets kassaflöde?',
    options: [
      'Intäkter – kostnader',
      'Tillgångar – skulder',
      'Inbetalningar – utbetalningar',
      'Resultat – avskrivningar',
    ],
    correct: 2,
    explanation:
      'Kassaflödet är skillnaden mellan företagets totala in- och utbetalningar under året.',
  },
  {
    question: 'Vad visar resultaträkningen?',
    options: [
      'Företagets tillgångar och skulder',
      'Intäkter och kostnader för en viss period',
      'In- och utbetalningar',
      'Ägarnas kapitaltillskott',
    ],
    correct: 1,
    explanation:
      'Resultaträkningen visar företagets prestationer (intäkter) och resursförbrukning (kostnader).',
  },
  {
    question: 'Hur beräknas årets resultat?',
    options: [
      'Inbetalningar – utbetalningar',
      'Tillgångar – skulder',
      'Intäkter – kostnader',
      'Eget kapital – skulder',
    ],
    correct: 2,
    explanation:
      'Skillnaden mellan intäkter och kostnader visar företagets resultat (vinst eller förlust).',
  },
  {
    question: 'Vad kallas den successiva minskningen av värdet på en investering, t.ex. en maskin?',
    options: ['Nedskrivning', 'Avskrivning', 'Förbrukning', 'Avräkning'],
    correct: 1,
    explanation:
      'Avskrivningar speglar resursförbrukningen över flera år och periodiserar investeringskostnaden.',
  },
  {
    question: 'Vad är syftet med avskrivningar i resultaträkningen?',
    options: [
      'Att minska beskattningen',
      'Att jämna ut företagets intäkter',
      'Att fördela en investering som kostnad över flera år',
      'Att minska kassaflödet',
    ],
    correct: 2,
    explanation: 'Avskrivningar fördelar kostnaden av en tillgång på dess ekonomiska livslängd.',
  },
  {
    question: 'Vad visar balansräkningen?',
    options: [
      'Kassaflöden under året',
      'Företagets finansiella ställning vid en viss tidpunkt',
      'Intäkter och kostnader',
      'Ägarnas framtida avkastning',
    ],
    correct: 1,
    explanation:
      'Balansräkningen visar företagets tillgångar, eget kapital och skulder på bokslutsdagen.',
  },
  {
    question: 'Vilka tre huvuddelar finns i balansräkningen?',
    options: [
      'Intäkter, kostnader och resultat',
      'Tillgångar, eget kapital och skulder',
      'Inkomster, utgifter och kassaflöden',
      'Tillgångar, investeringar och amorteringar',
    ],
    correct: 1,
    explanation:
      'Balansräkningen visar vad företaget äger (tillgångar) och hur det finansierats (eget kapital och skulder).',
  },
  {
    question: 'Vad menas med att balansräkningen ska “balansera”?',
    options: [
      'Resultatet ska vara noll',
      'Tillgångarna ska vara lika stora som summan av eget kapital och skulder',
      'Kassaflödet ska vara konstant',
      'Inkomster ska motsvara utgifter',
    ],
    correct: 1,
    explanation:
      'Balansräkningen bygger på balansidentiteten: Tillgångar = Eget kapital + Skulder.',
  },
  {
    question: 'Vad är balansidentiteten?',
    options: [
      'Intäkter – kostnader = resultat',
      'Tillgångar = Eget kapital + Skulder',
      'Inbetalningar – utbetalningar = kassaflöde',
      'Tillgångar – skulder = resultat',
    ],
    correct: 1,
    explanation:
      'Balansidentiteten uttrycker att företagets resurser alltid motsvaras av dess finansiering.',
  },
  {
    question: 'Vad kallas balansräkningen vid årets slut?',
    options: [
      'Resultatrapport',
      'Utgående balansräkning',
      'Ingående balansräkning',
      'Kassaflödesrapport',
    ],
    correct: 1,
    explanation:
      'Utgående balansräkning visar den finansiella ställningen vid årets slut och blir nästa års ingående balans.',
  },
  {
    question: 'Hur hänger balansräkningen och resultaträkningen ihop?',
    options: [
      'Resultatet påverkar eget kapital i balansräkningen',
      'Balansräkningen visar årets intäkter',
      'Resultaträkningen bygger på kassaflödet',
      'De är helt oberoende av varandra',
    ],
    correct: 0,
    explanation:
      'Årets resultat i resultaträkningen förs över till eget kapital i balansräkningen.',
  },
  {
    question: 'Vad förklarar kassaflödesanalysen i förhållande till balansräkningen?',
    options: [
      'Förändringen i kassa',
      'Förändringen i eget kapital',
      'Förändringen i intäkter',
      'Förändringen i skuldsättning',
    ],
    correct: 0,
    explanation:
      'Kassaflödesanalysen visar hur kassan förändrats under året genom in- och utbetalningar.',
  },
  {
    question: 'Vad förklarar resultaträkningen i förhållande till balansräkningen?',
    options: [
      'Förändringen i kassa',
      'Förändringen i eget kapital',
      'Förändringen i tillgångar',
      'Förändringen i skulder',
    ],
    correct: 1,
    explanation:
      'Resultatet (intäkter minus kostnader) påverkar det egna kapitalet i balansräkningen.',
  },
  {
    question: 'Vilket samband gäller mellan ingående och utgående eget kapital?',
    options: [
      'Ingående eget kapital + årets resultat = utgående eget kapital',
      'Utgående eget kapital + årets resultat = ingående eget kapital',
      'Ingående eget kapital = årets resultat',
      'Ingående eget kapital – skulder = utgående eget kapital',
    ],
    correct: 0,
    explanation:
      'Det egna kapitalet ökar med årets resultat och minskar med förluster eller ägaruttag.',
  },
  {
    question: 'Hur påverkar ägartillskott och ägaruttag det egna kapitalet?',
    options: [
      'De påverkar endast kassaflödet',
      'De redovisas direkt mot eget kapital',
      'De påverkar resultatet i resultaträkningen',
      'De påverkar bara skulderna',
    ],
    correct: 1,
    explanation:
      'Ägartillskott ökar och ägaruttag minskar eget kapital utan att påverka resultatet.',
  },
  {
    question: 'Hur hänger de tre huvudrapporterna ihop?',
    options: [
      'De är oberoende av varandra',
      'Kassaflödesanalysen skapas först, sedan balansräkningen',
      'Resultaträkningen och kassaflödesanalysen förklarar förändringar i balansräkningen',
      'Balansräkningen skapar resultaträkningen',
    ],
    correct: 2,
    explanation:
      'Resultat och kassaflöde visar förändringar som påverkar balansräkningens värden vid årets slut.',
  },

  // --- KAPITEL 4 ---
  {
    question: 'Vad menas med dubbel bokföring?',
    options: [
      'Att varje affärshändelse bokförs en gång på ett konto',
      'Att varje affärshändelse bokförs på minst två konton, med lika stort belopp i debet och kredit',
      'Att företag måste bokföra både digitalt och manuellt',
      'Att varje verifikation måste finnas i två kopior',
    ],
    correct: 1,
    explanation: 'Detta system säkerställer att debet och kredit alltid balanserar.',
  },
  {
    question: 'Vad är ett T-konto?',
    options: [
      'Ett konto som används för att registrera enbart intäkter',
      'Ett konto som bara kan visa ett saldo',
      'Ett konto med en debetsida och en kreditsida',
      'Ett konto som används enbart vid bokslut',
    ],
    correct: 2,
    explanation:
      'T-kontot visualiserar debet (vänster) och kredit (höger) för ett specifikt konto.',
  },
  {
    question: 'En affärshändelse definieras som:',
    options: [
      'Endast betalningar som sker med bank',
      'En verifierbar ekonomisk händelse som påverkar företagets resultat eller finansiella ställning',
      'Alla interna beslut som fattas i ett företag',
      'Händelser som endast påverkar resultatet men inte balansen',
    ],
    correct: 1,
    explanation:
      'Alla händelser som påverkar ekonomin och kan bevisas (verifieras) måste bokföras.',
  },
  {
    question: 'Vilka typkonton bygger upp balansräkningen?',
    options: [
      'Tillgångar och inkomster',
      'Inkomster och utgifter',
      'Tillgångar samt eget kapital och skulder',
      'Intäkter och kostnader',
    ],
    correct: 2,
    explanation:
      'Balansräkningen består av tillgångar på debetsidan och eget kapital/skulder på kreditsidan.',
  },
  {
    question: 'Vilka typkonton bygger upp resultaträkningen?',
    options: [
      'Tillgångar och skulder',
      'Inkomster och utgifter',
      'Tillgångar och intäkter',
      'Intäkter och kostnader',
    ],
    correct: 3,
    explanation: 'Resultaträkningen består av intäkter (kredit) och kostnader (debet).',
  },
  {
    question: 'Vad innebär periodisering?',
    options: [
      'Att uppskatta framtida budgetar',
      'Att bestämma vilken del av inkomster och utgifter som ska redovisas som intäkter och kostnader för perioden',
      'Att bokföra årets resultat på eget kapital',
      'Att räkna ut företagets likviditet',
    ],
    correct: 1,
    explanation:
      'Periodisering omvandlar kassaflöden (inkomst/utgift) till resultatposter (intäkt/kostnad) för rätt period.',
  },
  {
    question: 'Hur bokförs en ökning av en tillgång på ett konto?',
    options: ['Kredit', 'Debet', 'Balans', 'Bara vid bokslut'],
    correct: 1,
    explanation: 'Tillgångar ökar alltid i Debet.',
  },
  {
    question: 'Hur bokförs en ökning av eget kapital eller skuld?',
    options: ['Debet', 'Kredit', 'Bara i slutet av året', 'Det beror på kontotypen'],
    correct: 1,
    explanation: 'Skulder och Eget Kapital ökar alltid i Kredit.',
  },
  {
    question: 'Vad är en inkomst?',
    options: [
      'Värdet av förbrukade resurser',
      'Värdet av anskaffade resurser',
      'Värdet av levererade resurser (försäljning)',
      'Inflöde av pengar',
    ],
    correct: 2,
    explanation:
      'Inkomst uppstår vid försäljningstillfället (fakturering), oavsett när betalning sker.',
  },
  {
    question: 'Vad är en intäkt?',
    options: [
      'Värdet av anskaffade resurser',
      'Värdet av utförda prestationer under en period',
      'All inkomst som bokförs',
      'All betalning som kommit in på banken',
    ],
    correct: 1,
    explanation:
      'Intäkt är en periodiserad inkomst – värdet av det vi faktiskt presterat under perioden.',
  },
  {
    question: 'Vad är en utgift?',
    options: [
      'Utflöde av likvida medel',
      'Värdet av förbrukade resurser',
      'Värdet av anskaffade resurser (inköpspriset)',
      'Minskning av eget kapital',
    ],
    correct: 2,
    explanation: 'Utgift är priset för en resurs vid anskaffningstillfället.',
  },
  {
    question: 'Vad är en kostnad?',
    options: [
      'Utflöde av pengar',
      'Värdet av förbrukade resurser under en period',
      'Värdet av inkomster minus utgifter',
      'Bokföringsmässig vinst',
    ],
    correct: 1,
    explanation: 'Kostnad är en periodiserad utgift – värdet av det vi använt upp under perioden.',
  },
  {
    question: 'Vad är en utbetalning?',
    options: [
      'Värdet av anskaffade resurser',
      'Minskning av eget kapital',
      'Utflöde av likvida medel (pengar)',
      'Värdet av levererade prestationer',
    ],
    correct: 2,
    explanation: 'Utbetalning sker när pengar faktiskt lämnar kontot eller kassan.',
  },
  {
    question: 'Vilket av följande påverkar både resultat och balans samtidigt?',
    options: [
      'En intern omförflyttning av pengar inom företaget',
      'En affärshändelse som bokförs i debet och kredit på två konton (t.ex. försäljning)',
      'Ett beslut som inte har ekonomiska konsekvenser',
      'Att inventera lagret',
    ],
    correct: 1,
    explanation:
      'De flesta externa transaktioner påverkar både en balanspost (t.ex. kassa/fordran) och en resultatpost (t.ex. intäkt).',
  },
  {
    question: 'Varför använder man fler än ett tillgångskonto?',
    options: [
      'För att göra bokföringen snabbare',
      'För att kunna se vilka tillgångar företaget har och hur värdet fördelar sig',
      'För att följa lagen om årsredovisning',
      'För att minska antalet konteringar',
    ],
    correct: 1,
    explanation:
      'Genom att dela upp tillgångar (kassa, lager, maskiner) får man bättre kontroll och överblick.',
  },
])

// --- STATE ---
const currentCategory = ref('docs') // 'docs' eller 'general'
const currentQuestionIndex = ref(0)
const score = ref(0)
const showResult = ref(false)
const selectedOption = ref(null)
const isAnswered = ref(false)

// --- LOGIK ---
// activeQuestions returnerar den faktiska arrayen (reactive unwrap i template)
const activeQuestions = computed(() => {
  return currentCategory.value === 'docs' ? docsQuestions.value : generalQuestions.value
})

const currentQuestion = computed(() => activeQuestions.value[currentQuestionIndex.value])
const progressPercentage = computed(
  () => (currentQuestionIndex.value / activeQuestions.value.length) * 100,
)

// Nollställ quiz när man byter kategori
watch(currentCategory, (newVal, oldVal) => {
  // Save previous category state before switching
  if (oldVal) saveViewThreeState(oldVal)
  restartQuiz()
  // Try to restore saved state for new category
  loadViewThreeState(newVal)
})

function handleAnswer(index) {
  // If already correctly answered, ignore further clicks
  if (isAnswered.value) return

  // Set which option user selected
  selectedOption.value = index

  // If correct, mark as answered (correct) and increase score
  if (index === currentQuestion.value.correct) {
    isAnswered.value = true
    score.value++
  } else {
    // Wrong answer: do NOT mark as answered so the user can try again.
    // Keep selectedOption so UI can mark the wrong choice and shake it.
  }
}

function nextQuestion() {
  if (currentQuestionIndex.value < activeQuestions.value.length - 1) {
    currentQuestionIndex.value++
    selectedOption.value = null
    isAnswered.value = false
  } else {
    showResult.value = true
  }
}

function prevQuestion() {
  if (currentQuestionIndex.value > 0) {
    currentQuestionIndex.value--
    selectedOption.value = null
    isAnswered.value = false
    showResult.value = false
  }
}

function restartQuiz() {
  currentQuestionIndex.value = 0
  score.value = 0
  showResult.value = false
  selectedOption.value = null
  isAnswered.value = false
}

onMounted(() => {
  // Try to restore state for the currently selected category on mount
  loadViewThreeState(currentCategory.value)
})

function getButtonClass(index) {
  // If the question has been answered correctly, show the correct one
  if (isAnswered.value) {
    if (index === currentQuestion.value.correct) return 'correct'
    return 'dimmed'
  }

  // Not yet answered correctly: if user has selected an option and it's wrong, mark it as wrong
  if (selectedOption.value === null || selectedOption.value === undefined) return ''

  if (selectedOption.value === index && index !== currentQuestion.value.correct) return 'wrong'

  // Dim other options while waiting for correct click
  return 'dimmed'
}

// Fisher-Yates
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

function shuffleActiveQuestions() {
  if (currentCategory.value === 'docs') {
    // shuffle docsQuestions in place by replacing its contents
    const shuffled = shuffleArray(docsQuestions.value)
    docsQuestions.value.splice(0, docsQuestions.value.length, ...shuffled)
  } else {
    const shuffled = shuffleArray(generalQuestions.value)
    generalQuestions.value.splice(0, generalQuestions.value.length, ...shuffled)
  }
  // reset quiz state to start of shuffled set
  currentQuestionIndex.value = 0
  selectedOption.value = null
  isAnswered.value = false
  // save new order/state
  saveViewThreeState(currentCategory.value)
}

// Helper to produce a stable key for a question (prefer id if available)
function questionKey(q) {
  return q.id ?? q.question
}

function saveViewThreeState(category) {
  try {
    const key = `viewthree_state_${category}`
    const list = category === 'docs' ? docsQuestions.value : generalQuestions.value
    const order = list.map((q) => questionKey(q))
    const payload = {
      order,
      index: currentQuestionIndex.value,
      score: score.value,
      selectedOption: selectedOption.value,
      isAnswered: isAnswered.value,
    }
    localStorage.setItem(key, JSON.stringify(payload))
  } catch (e) {
    console.warn('Failed to save ViewThree state', e)
  }
}

function loadViewThreeState(category) {
  try {
    const key = `viewthree_state_${category}`
    const raw = localStorage.getItem(key)
    if (!raw) return
    const parsed = JSON.parse(raw)
    if (!parsed || !Array.isArray(parsed.order)) return

    // rebuild order from saved keys
    const source = category === 'docs' ? docsQuestions.value : generalQuestions.value
    const map = new Map(source.map((q) => [questionKey(q), q]))
    const ordered = parsed.order.map((k) => map.get(k)).filter(Boolean)
    if (ordered.length === source.length) {
      // replace contents
      if (category === 'docs') {
        docsQuestions.value.splice(0, docsQuestions.value.length, ...ordered)
      } else {
        generalQuestions.value.splice(0, generalQuestions.value.length, ...ordered)
      }
      currentQuestionIndex.value = Math.min(parsed.index || 0, ordered.length - 1)
      score.value = parsed.score || 0
      selectedOption.value = parsed.selectedOption == null ? null : parsed.selectedOption
      isAnswered.value = !!parsed.isAnswered
    }
  } catch (e) {
    console.warn('Failed to load ViewThree state', e)
  }
}

// Persist important state pieces whenever they change so progress is not lost
watch(currentQuestionIndex, () => {
  saveViewThreeState(currentCategory.value)
})

watch(score, () => {
  saveViewThreeState(currentCategory.value)
})

watch(selectedOption, () => {
  saveViewThreeState(currentCategory.value)
})

watch(isAnswered, () => {
  saveViewThreeState(currentCategory.value)
})
</script>

<template>
  <div class="quiz-container">
    <!-- FLIKMENY -->
    <div class="tabs">
      <button @click="currentCategory = 'docs'" :class="{ active: currentCategory === 'docs' }">
        Docs frågor
      </button>
      <button
        @click="currentCategory = 'general'"
        :class="{ active: currentCategory === 'general' }"
      >
        Generella frågor
      </button>
    </div>

    <div class="quiz-view">
      <!-- RESULTATVY -->
      <div v-if="showResult" class="result-card">
        <h2>🎉 Bra jobbat!</h2>
        <p class="score-text">Du fick {{ score }} av {{ activeQuestions.length }} rätt.</p>

        <div class="score-bar">
          <div
            class="score-fill"
            :style="{ width: (score / activeQuestions.length) * 100 + '%' }"
          ></div>
        </div>

        <p v-if="score === activeQuestions.length">Alla rätt! Fantastiskt! ⭐️</p>
        <p v-else-if="score > activeQuestions.length / 2">Godkänt! Repetera gärna de du missade.</p>
        <p v-else>Kämpa på! Kika på Flashcards-delen lite till. 😉</p>

        <button @click="restartQuiz" class="restart-btn">Kör igen 🔄</button>
      </div>

      <!-- FRÅGEVY -->
      <div v-else class="question-card">
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: progressPercentage + '%' }"></div>
        </div>

        <div class="header-row">
          <button @click="prevQuestion" class="btn prev-btn" :disabled="currentQuestionIndex === 0">
            Föregående
          </button>

          <span class="q-counter"
            >Fråga {{ currentQuestionIndex + 1 }} / {{ activeQuestions.length }}</span
          >

          <button @click="shuffleActiveQuestions" class="btn btn-shuffle-small">Slumpa</button>
        </div>

        <h2 class="question-text">{{ currentQuestion.question }}</h2>

        <div class="options-grid">
          <button
            v-for="(option, index) in currentQuestion.options"
            :key="index"
            @click="handleAnswer(index)"
            class="option-btn"
            :class="getButtonClass(index)"
            :disabled="isAnswered"
          >
            {{ option }}
          </button>
        </div>

        <!-- FÖRKLARINGSRUTA (Visas efter svar) -->
        <div v-if="isAnswered" class="explanation-box">
          <!-- Only show explanation content if available -->
          <div v-if="currentQuestion.explanation" class="exp-content">
            <strong>💡 Förklaring:</strong>
            <p>{{ currentQuestion.explanation }}</p>
          </div>
          <button @click="nextQuestion" class="next-btn">Nästa fråga</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.quiz-container {
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* --- FLIKAR --- */
.tabs {
  display: flex;
  background: white;
  padding: 5px;
  border-radius: 50px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  margin-bottom: 20px;
}

.tabs button {
  background: none;
  border: none;
  padding: 10px 25px;
  border-radius: 40px;
  font-size: 1rem;
  font-weight: bold;
  color: #666;
  cursor: pointer;
  transition: all 0.3s;
}

.tabs button.active {
  background-color: #2c3e50;
  color: white;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}

.quiz-view {
  width: 100%;
  display: flex;
  justify-content: center;
}

/* --- KORTET --- */
.question-card,
.result-card {
  background: white;
  width: 100%;
  padding: 30px;
  border-radius: 20px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;
}

/* --- HEADER --- */
.header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 15px;
  margin-bottom: 10px;
}

.category-badge {
  background: #eee;
  padding: 4px 10px;
  border-radius: 10px;
  font-size: 0.8rem;
  color: #555;
  font-weight: bold;
}

.q-counter {
  flex: 1;
  text-align: center;
  font-size: 1rem;
  font-weight: bold;
  color: #2c3e50;
}

/* --- PROGRESS BAR --- */
.progress-bar {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 6px;
  background: #f0f2f5;
}

.progress-fill {
  height: 100%;
  background: #42b883;
  transition: width 0.3s ease;
}

.q-counter {
  color: #888;
  font-size: 0.9rem;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.question-text {
  font-size: 1.4rem;
  color: #2c3e50;
  margin: 10px 0 30px 0;
  line-height: 1.4;
}

/* --- SVARSALTERNATIV --- */
.options-grid {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.option-btn {
  background: white;
  border: 2px solid #e0e0e0;
  padding: 15px 20px;
  border-radius: 12px;
  font-size: 1rem;
  color: #333;
  cursor: pointer;
  transition: all 0.2s;
  text-align: left;
  font-weight: 500;
}

.option-btn:hover:not(:disabled) {
  border-color: #2c3e50;
  background: #f9f9f9;
}

/* Feedback-färger */
.option-btn.correct {
  background-color: #d4edda;
  border-color: #28a745;
  color: #155724;
}

.option-btn.wrong {
  background-color: #f8d7da;
  border-color: #dc3545;
  color: #721c24;
  opacity: 0.8;
}

/* Shake animation for wrong answers */
.option-btn.wrong {
  animation: shake 0.6s ease;
}

@keyframes shake {
  0% {
    transform: translateX(0);
  }
  20% {
    transform: translateX(-6px);
  }
  40% {
    transform: translateX(6px);
  }
  60% {
    transform: translateX(-4px);
  }
  80% {
    transform: translateX(4px);
  }
  100% {
    transform: translateX(0);
  }
}

/* Unified small button for header */
.btn {
  padding: 10px 18px;
  border: none;
  border-radius: 12px;
  font-size: 0.95rem;
  font-weight: bold;
  cursor: pointer;
  color: white;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
}
.btn-shuffle-small {
  background-color: #8e44ad;
}
.btn-shuffle-small:hover {
  background-color: #7a36a8;
}

.prev-btn {
  background-color: #3498db;
}
.prev-btn:hover {
  background-color: #2b86c6;
}

.option-btn.dimmed {
  opacity: 0.4;
}

/* --- FÖRKLARINGSRUTA --- */
.explanation-box {
  margin-top: 25px;
  background-color: #f8f9fa;
  border-left: 5px solid #42b883;
  padding: 20px;
  border-radius: 8px;
  animation: fadeIn 0.5s ease;
}

.exp-content strong {
  display: block;
  margin-bottom: 5px;
  color: #2c3e50;
}

.exp-content p {
  margin: 0;
  font-size: 1rem;
  color: #555;
}

.next-btn {
  margin-top: 15px;
  width: 100%;
  padding: 12px;
  background-color: #2c3e50;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.2s;
}
.next-btn:hover {
  background-color: #1a252f;
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

/* --- RESULTAT --- */
.result-card {
  text-align: center;
}

.score-text {
  font-size: 1.5rem;
  font-weight: bold;
  margin: 10px 0;
}

.score-bar {
  width: 100%;
  height: 20px;
  background: #eee;
  border-radius: 10px;
  margin: 20px 0;
  overflow: hidden;
}

.score-fill {
  height: 100%;
  background: #42b883;
  transition: width 1s ease;
}

.restart-btn {
  margin-top: 30px;
  background-color: #2c3e50;
  color: white;
  border: none;
  padding: 15px 40px;
  border-radius: 50px;
  font-size: 1.2rem;
  cursor: pointer;
  font-weight: bold;
}
.restart-btn:hover {
  background-color: #1a252f;
}
</style>
