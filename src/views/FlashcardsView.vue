<script setup>
defineOptions({ name: 'FlashcardsView' })
import { ref, computed, watch, onMounted } from 'vue'

// --- KATEGORIER (KAPITEL) ---
const modes = [
  { id: 'all', label: 'Mix' },
  { id: 'kap1', label: 'Kap 1: Redovisningens Syfte' },
  { id: 'kap2', label: 'Kap 2: Process & Grundbegrepp' },
  { id: 'kap3', label: 'Kap 3: De Finansiella Rapporterna' },
  { id: 'kap4', label: 'Kap 4: Bokföringens Grunder' },
  { id: 'kap5', label: 'Kap 5: Löpande Bokföring & Regler' },
  { id: 'kap6', label: 'Kap 6: Bokslut & Periodiseringar' },
  { id: 'kap7', label: 'Kap 7: Balansräkningens Poster' },
  { id: 'kap8', label: 'Kap 8: Resultaträkningens Poster' },
  { id: 'kap9', label: 'Kap 9: Kassaflödesanalys' },
  { id: 'kap10', label: 'Kap 10: Noter & Upplysningar' },
  { id: 'kap11', label: 'Kap 11: Hållbarhetsredovisning' },
  { id: 'kap12', label: 'Kap 12: Koncernredovisning' },
  { id: 'kap13', label: 'Kap 13: Reglering & Normsättare' },
  { id: 'kap14', label: 'Kap 14: Grundläggande Principer' },
  { id: 'kap15', label: 'Kap 15: Introduktion till Analys' },
  { id: 'kap16', label: 'Kap 16: Nyckeltalsberäkning' },
  { id: 'kap17', label: 'Kap 17: Tolkning av Nyckeltal' },
]

const currentMode = ref('all')

// --- DATABAS MED FRÅGOR ---
const allCards = [
  // ==================================================================
  // KAPITEL 1: Redovisningens Syfte (UTÖKAD & DETALJERAD)
  // ==================================================================
  {
    category: 'kap1',
    question: 'Vad för slags redovisning produceras av privatpersoner?',
    answer:
      'Främst Inkomstdeklaration (till Skatteverket). Vissa gör även frivillig hushållsbudget/kassabok för egen kontroll.',
  },
  {
    category: 'kap1',
    question: 'Vad är definitionen av en intressent?',
    answer:
      'En person eller grupp som har ett intresse av, är beroende av, eller påverkas av företagets agerande och ekonomi.',
  },
  {
    category: 'kap1',
    question: 'Vilka räknas oftast som företagets primära intressenter?',
    answer: 'Ägare (investerare) och Långivare (kreditgivare).',
  },
  {
    category: 'kap1',
    question: 'För vilka beslut behöver ägare redovisning?',
    answer:
      'För att bedöma lönsamhet, besluta om ansvarsfrihet för styrelsen, och avgöra om de ska köpa, sälja eller behålla sina aktier.',
  },
  {
    category: 'kap1',
    question: 'För vilka beslut behöver långivare (t.ex. banker) redovisning?',
    answer:
      'För att bedöma företagets betalningsförmåga (återbetalningskraft) och säkerhet, för att avgöra om de ska bevilja lån och till vilken ränta.',
  },
  {
    category: 'kap1',
    question: 'Vilken effekt får redovisning på ekonomin i stort (samhällsnivå)?',
    answer:
      'Den möjliggör effektiv resursallokering. Kapital söker sig till de företag som redovisningen visar är mest lönsamma och effektiva.',
  },
  {
    category: 'kap1',
    question: 'Vilka beslut baserar Skatteverket på redovisning?',
    answer:
      'Beslut om beskattning (Bolagsskatt, Moms, Arbetsgivaravgifter) och för att kontrollera att företaget följer skattelagstiftningen.',
  },
  {
    category: 'kap1',
    question: 'Varför är kunder intresserade av redovisning?',
    answer:
      'För att bedöma om leverantören är stabil och kan leverera varor/tjänster långsiktigt (viktigt för garantier, service och reservdelar).',
  },
  {
    category: 'kap1',
    question: 'Varför är leverantörer intresserade av redovisning?',
    answer: 'För att bedöma kundens betalningsförmåga innan de ger kredit (säljer på faktura).',
  },
  {
    category: 'kap1',
    question: 'Varför är anställda intresserade av redovisning?',
    answer:
      'För att bedöma anställningstrygghet, löneutrymme (löneförhandling) och företagets framtidsutsikter.',
  },
  {
    category: 'kap1',
    question: 'Vad är skillnaden på Extern och Intern redovisning?',
    answer:
      'Extern = Lagstyrd, riktad till utomstående (Årsredovisning). Intern = Frivillig, riktad till ledningen för styrning (Budget/Kalkyler).',
  },
  {
    category: 'kap1',
    question: 'Vad menas med Informationsasymmetri mellan ägare och ledning?',
    answer:
      'Ledningen (som arbetar dagligen i bolaget) vet mer än ägarna. Redovisningens syfte är att minska detta gap.',
  },
  {
    category: 'kap1',
    question: 'Vad innebär "Agentteorin" (Principal-Agent) inom redovisning?',
    answer:
      'Ägaren (principal) anlitar en ledning (agent). Redovisning behövs för att kontrollera att agenten agerar i principalens intresse.',
  },
  {
    category: 'kap1',
    question: 'Varför ska du lära dig redovisning ("Business Language")?',
    answer:
      'För att kunna förstå och kommunicera ekonomisk information, oavsett om du blir chef, investerare eller entreprenör. Det är "företagandets språk".',
  },
  {
    category: 'kap1',
    question: 'Vad är en Årsredovisning?',
    answer:
      'En offentlig handling som sammanställer räkenskaper och förvaltning för ett räkenskapsår. Ska ge en rättvisande bild av ställning och resultat.',
  },
  {
    category: 'kap1',
    question: 'Vad innebär det att redovisningen är ett beslutsunderlag?',
    answer:
      'Att informationen inte bara är historik, utan ska användas för att prognostisera framtiden och välja handlingsalternativ.',
  },

  // ==================================================================
  // KAPITEL 2: Process & Grundbegrepp (KOMPLETT)
  // ==================================================================
  {
    category: 'kap2',
    question: 'Hur definieras redovisning?',
    answer:
      'Att registrera, klassificera, värdera och rapportera ekonomisk information för att ge underlag för ekonomiska beslut.',
  },
  {
    category: 'kap2',
    question: 'Vilka är de fyra stegen i redovisningsprocessen?',
    answer:
      '1. Transaktion (Affärshändelse) -> 2. Löpande bokföring (Registrering) -> 3. Bokslut (Periodisering/Värdering) -> 4. Rapportering (Årsredovisning).',
  },
  {
    category: 'kap2',
    question: 'Ange tre viktiga begreppspar i redovisningsprocessen.',
    answer:
      '1. Inkomst & Utgift (Anskaffning/Försäljning)\n2. Inbetalning & Utbetalning (Kassaflöde)\n3. Intäkt & Kostnad (Resultat).',
  },
  {
    category: 'kap2',
    question: 'Vad är en Inkomst?',
    answer:
      'Den ekonomiska ersättning företaget har rätt till vid försäljning. Uppstår vid faktureringstillfället (när affären görs).',
  },
  {
    category: 'kap2',
    question: 'Vad är en Utgift?',
    answer:
      'Priset för en resurs (vara/tjänst) som företaget anskaffar. Uppstår vid inköpstillfället (när fakturan tas emot).',
  },
  {
    category: 'kap2',
    question: 'Vad är en Inbetalning vs Utbetalning?',
    answer:
      'När likvida medel (pengar) faktiskt byter ägare. Inbetalning = pengar in på kontot. Utbetalning = pengar ut från kontot.',
  },
  {
    category: 'kap2',
    question: 'Vad är en Intäkt?',
    answer:
      'En periodiserad inkomst. Värdet av de prestationer som utförts/levererats under en viss period (t.ex. hyresintäkt för just januari).',
  },
  {
    category: 'kap2',
    question: 'Vad är en Kostnad?',
    answer:
      'En periodiserad utgift. Värdet av de resurser som förbrukats under en viss period. (Kostnad = Utgift + Ingående Lager - Utgående Lager).',
  },
  {
    category: 'kap2',
    question: 'Vad innebär Periodisering?',
    answer:
      'Att fördela inkomster och utgifter till rätt tidsperiod (år) så att resultatet blir rättvisande enligt matchningsprincipen.',
  },
  {
    category: 'kap2',
    question: 'I vilka steg i redovisningsprocessen sker periodisering?',
    answer:
      'Främst i steg 3: Bokslutet. Det är då man omvandlar löpande inkomster/utgifter till intäkter/kostnader.',
  },
  {
    category: 'kap2',
    question: 'Vad ingår i en Årsredovisning (enligt ÅRL)?',
    answer:
      '1. Förvaltningsberättelse\n2. Resultaträkning\n3. Balansräkning\n4. Noter\n(Större företag ska även ha Kassaflödesanalys).',
  },
  {
    category: 'kap2',
    question: 'Vilka övriga aktörer finns i redovisningssystemet (förutom företaget)?',
    answer:
      'Normgivare (Bokföringsnämnden), Reglerare (Riksdagen/EU), Tillsynsmyndigheter (Skatteverket, Finansinspektionen) och Revisorer.',
  },
  {
    category: 'kap2',
    question: 'Vad är skillnaden på Bokföring och Redovisning?',
    answer:
      'Bokföring är det praktiska hantverket (registrera verifikationer). Redovisning är det bredare begreppet som även innefattar sammanställning, värdering och rapportering.',
  },
  // ==================================================================
  // KAPITEL 3: De Finansiella Rapporterna (KOMPLETT)
  // ==================================================================
  {
    category: 'kap3',
    question: 'Vad visar en kassaflödesanalys?',
    answer:
      'En rapport över företagets inbetalningar och utbetalningar under en viss period, samt förändringen av likvida medel.',
  },
  {
    category: 'kap3',
    question: 'Vad är skillnaden mellan Kassaflödesanalys och Resultaträkning?',
    answer:
      'Kassaflödesanalys fokuserar på pengar in/ut (likviditet). Resultaträkning fokuserar på intäkter/kostnader (prestation och lönsamhet).',
  },
  {
    category: 'kap3',
    question: 'Vad ingår i en balansräkning?',
    answer:
      'Företagets Tillgångar (resurser), Eget Kapital (ägarnas del) och Skulder (finansiering) vid en viss tidpunkt.',
  },
  {
    category: 'kap3',
    question: 'Ge exempel på Anläggningstillgångar vs Omsättningstillgångar.',
    answer:
      'Anläggningstillgångar: Maskiner, Inventarier (ska användas länge). Omsättningstillgångar: Varulager, Kundfordringar, Kassa (ska omsättas snabbt).',
  },
  {
    category: 'kap3',
    question: 'Vad är Eget Kapital (EK)?',
    answer:
      'Ägarnas del av företagets tillgångar (nettovärdet). Beräknas som Tillgångar minus Skulder.',
  },
  {
    category: 'kap3',
    question: 'Nämn tre grundläggande samband i redovisning.',
    answer:
      '1. Balansekvationen (T = EK + S)\n2. Resultatekvationen (R = I - K)\n3. Kassaflödessambandet (UB Likvida medel = IB + Inbet - Utbet).',
  },
  {
    category: 'kap3',
    question: 'Vad kan förklara förändringar i Eget Kapital?',
    answer:
      '1. Årets resultat (Vinst ökar, förlust minskar)\n2. Ägartillskott (Nyemission)\n3. Uttag till ägare (Utdelning).',
  },
  // ==================================================================
  // KAPITEL 4: Bokföringens Grunder (KOMPLETT)
  // ==================================================================
  {
    category: 'kap4',
    question: 'Vad är en affärshändelse?',
    answer:
      'En ekonomisk transaktion som omedelbart påverkar företagets ställning eller resultat (t.ex. inköp, försäljning, betalning).',
  },
  {
    category: 'kap4',
    question: 'Vilka är de fyra typkontona?',
    answer: '1. Tillgångar\n2. Skulder & Eget Kapital\n3. Intäkter\n4. Kostnader',
  },
  {
    category: 'kap4',
    question: 'Vilken är kopplingen mellan typkonton och rapporterna?',
    answer:
      'Tillgångar och Skulder/EK avslutas mot Balansräkningen (BR).\nIntäkter och Kostnader avslutas mot Resultaträkningen (RR).',
  },
  {
    category: 'kap4',
    question: 'Hur fungerar T-konton för Tillgångar?',
    answer: 'Ökar i Debet (Vänster).\nMinskar i Kredit (Höger).',
  },
  {
    category: 'kap4',
    question: 'Hur fungerar T-konton för Skulder & Eget Kapital?',
    answer: 'Minskar i Debet (Vänster).\nÖkar i Kredit (Höger).',
  },
  {
    category: 'kap4',
    question: 'Hur fungerar T-konton för Intäkter?',
    answer: 'Minskar i Debet (Vänster).\nÖkar i Kredit (Höger).',
  },
  {
    category: 'kap4',
    question: 'Hur fungerar T-konton för Kostnader?',
    answer: 'Ökar i Debet (Vänster).\nMinskar i Kredit (Höger).',
  },
  {
    category: 'kap4',
    question: 'Vad är sambandet mellan Inkomst och Intäkt?',
    answer:
      'Intäkt är en periodiserad inkomst. (Inkomst = det vi fakturerat. Intäkt = det vi presterat under perioden).',
  },
  {
    category: 'kap4',
    question: 'Vad är sambandet mellan Utgift och Kostnad?',
    answer:
      'Kostnad är en periodiserad utgift. (Utgift = det vi köpt in. Kostnad = det vi förbrukat under perioden).',
  },
  {
    category: 'kap4',
    question: 'Hur påverkas Eget Kapital av årets resultat?',
    answer:
      'En VINST ökar eget kapital (krediteras EK). En FÖRLUST minskar eget kapital (debiteras EK).',
  },
  {
    category: 'kap4',
    question: 'I vilken ordning upprättas ett bokslut (förenklat)?',
    answer:
      '1. Löpande bokföring\n2. Periodisering & Avstämning\n3. Fastställande av Resultaträkning\n4. Fastställande av Balansräkning.',
  },
  {
    category: 'kap4',
    question: 'Förklara Ingående Balans (IB) och Utgående Balans (UB).',
    answer:
      'IB = Värdet på kontot vid årets början (samma som förra årets UB).\nUB = Värdet på kontot vid årets slut.',
  },
  {
    category: 'kap4',
    question: 'Hur påverkas likvida medel av årets kassaflöde?',
    answer: 'UB Likvida medel = IB Likvida medel +/- Årets Kassaflöde.',
  },
  // ==================================================================
  // KAPITEL 5: Löpande Bokföring & Regler (KOMPLETT)
  // ==================================================================
  {
    category: 'kap5',
    question: 'Vad innebär bokföringsskyldighet och var regleras det?',
    answer:
      'Skyldigheten att löpande bokföra alla affärshändelser och upprätta bokslut. Regleras i Bokföringslagen (BFL). Gäller alla juridiska personer (t.ex. AB, HB).',
  },
  {
    category: 'kap5',
    question: 'Vad är skillnaden på bokföring i registreringsordning och systematisk ordning?',
    answer:
      'Registreringsordning = Kronologisk ordning (Grundbok/Dagbok).\nSystematisk ordning = Sorterat per konto (Huvudbok).',
  },
  {
    category: 'kap5',
    question: 'Vad kännetecknar associationsformen Aktiebolag (AB)?',
    answer:
      'Det är en juridisk person där ägarna inte har personligt betalningsansvar. Kräver minst 25 000 kr i aktiekapital.',
  },
  {
    category: 'kap5',
    question: 'Ge tre exempel på sidordnad bokföring.',
    answer:
      '1. Kundreskontra (detaljerad lista över kundfakturor)\n2. Leverantörsreskontra (detaljerad lista över lev.skulder)\n3. Anläggningsregister (detaljer om inventarier).',
  },
  {
    category: 'kap5',
    question: 'Vad är en verifikation?',
    answer:
      'Ett fysiskt eller digitalt underlag som bevisar att en affärshändelse ägt rum (t.ex. kvitto, faktura). Måste innehålla datum, belopp och parter.',
  },
  {
    category: 'kap5',
    question: 'Hur är BAS-kontoplanen uppbyggd?',
    answer:
      '1xxx = Tillgångar\n2xxx = Eget Kapital & Skulder\n3xxx = Intäkter\n4xxx-8xxx = Kostnader.',
  },
  {
    category: 'kap5',
    question: 'Förklara begreppet hemtagningsutgift.',
    answer:
      'Utgifter för att få varan till lagret, t.ex. frakt och tull. Dessa ska räknas in i lagervärdet (anskaffningsvärdet).',
  },
  {
    category: 'kap5',
    question: 'Vad är en kreditfaktura?',
    answer:
      'En "minusfaktura" som skickas när en vara returneras eller ett pris korrigeras i efterhand.',
  },
  {
    category: 'kap5',
    question: 'Vad är dröjsmålsränta?',
    answer: 'En ränta säljaren har rätt att ta ut om köparen betalar fakturan för sent.',
  },
  {
    category: 'kap5',
    question: 'När uppkommer en valutakursförlust på en kundfordran?',
    answer:
      'Om vi fakturerar i utländsk valuta och kursen SJUNKER innan vi får betalt (vi får färre SEK än vi bokförde från början).',
  },
  {
    category: 'kap5',
    question: 'Vad är en arbetsgivaravgift?',
    answer:
      'En lagstadgad avgift (sociala avgifter) som företaget betalar till staten för sina anställda. Ca 31,42% av bruttolönen.',
  },
  {
    category: 'kap5',
    question: 'Hur beräknas realisationsresultat på en kortfristig placering (t.ex. aktie)?',
    answer: 'Försäljningspris minus Anskaffningsvärde.\n(Positivt = Vinst, Negativt = Förlust).',
  },
  {
    category: 'kap5',
    question: 'Förklara begreppen preliminärskatt och skattekonto.',
    answer:
      'Preliminärskatt = Skatt företaget betalar varje månad baserat på förväntad vinst. Skattekonto = Saldot hos Skatteverket där alla inbetalningar och skatter dras.',
  },

  // ==================================================================
  // KAPITEL 6: Bokslut & Periodiseringar (KOMPLETT)
  // ==================================================================
  {
    category: 'kap6',
    question: 'Vad innebär periodisering respektive värdering i bokslutet?',
    answer:
      'Periodisering = Att placera inkomster/utgifter i rätt tidsperiod (matchning). Värdering = Att bestämma värdet på tillgångar och skulder enligt god redovisningssed.',
  },
  {
    category: 'kap6',
    question: 'Vad är en interimspost?',
    answer:
      'Ett samlingsnamn för interimsfordringar (förutbetalda kostnader/upplupna intäkter) och interimsskulder (upplupna kostnader/förutbetalda intäkter).',
  },
  {
    category: 'kap6',
    question: 'Vad är en förutbetald kostnad? (Ge exempel)',
    answer:
      'En utgift vi betalat i år, men som hör till nästa år (en Tillgång). Exempel: Hyra för januari som betalas i december.',
  },
  {
    category: 'kap6',
    question: 'Vad är en upplupen intäkt? (Ge exempel)',
    answer:
      'En intäkt vi tjänat in, men inte fakturerat/fått betalt för än (en Tillgång). Exempel: Utfört arbete i december som faktureras i januari.',
  },
  {
    category: 'kap6',
    question: 'Vad är en förutbetald intäkt? (Ge exempel)',
    answer:
      'Pengar vi fått in, men inte presterat motprestationen för än (en Skuld). Exempel: Förskottshyra från hyresgäst.',
  },
  {
    category: 'kap6',
    question: 'Vad är en upplupen kostnad? (Ge exempel)',
    answer:
      'En kostnad vi förbrukat, men inte fått faktura på än (en Skuld). Exempel: Elförbrukning i december, lön intjänad men ej utbetald.',
  },
  {
    category: 'kap6',
    question: 'Vad är en anläggningstillgång?',
    answer:
      'En tillgång avsedd att stadigvarande (länge) brukas eller innehas i rörelsen. Exempel: Maskiner, byggnader, patent.',
  },
  {
    category: 'kap6',
    question: 'Vad är skillnaden mellan avskrivning och nedskrivning?',
    answer:
      'Avskrivning = Planerad värdeminskning över livslängden (normalt slitage). Nedskrivning = Engångsneddragning av värdet p.g.a. oväntad värdeminskning (t.ex. skada/teknikskifte).',
  },
  {
    category: 'kap6',
    question: 'Hur beräknas realisationsresultat vid försäljning av inventarier?',
    answer:
      'Försäljningspris - Bokfört värde (Anskaffningsvärde - Ackumulerade avskrivningar). Positivt = Vinst, Negativt = Förlust.',
  },
  {
    category: 'kap6',
    question: 'Vad är en omsättningstillgång?',
    answer:
      'En tillgång som inte är anläggningstillgång. Avsedd att säljas eller förbrukas löpande. Exempel: Varulager, kundfordringar, kassa.',
  },
  {
    category: 'kap6',
    question: 'Hur värderas ett varulager enligt LVP?',
    answer:
      'Enligt Lägsta värdets princip (LVP): Det lägsta av Anskaffningsvärdet och Nettoförsäljningsvärdet (verkligt värde). Schablonregel: 97% av anskaffningsvärdet får användas.',
  },
  {
    category: 'kap6',
    question: 'Vad är en osäker kundfordran?',
    answer:
      'En fordran där det finns risk att kunden inte kan betala. Måste värderas ned om risken är betydande.',
  },
  {
    category: 'kap6',
    question: 'Vad är skillnaden på befarad och konstaterad kundförlust?',
    answer:
      'Befarad = Vi tror kunden inte betalar (värderas ned i bokslutet). Konstaterad = Vi VET att vi inte får betalt (t.ex. vid konkurs), då bokas momsen bort.',
  },
  {
    category: 'kap6',
    question: 'Vad är skillnaden mellan en skuld och en avsättning?',
    answer:
      'En skuld är säker till belopp och tidpunkt. En avsättning är en förpliktelse som är SANNOLIK men oviss till belopp eller tidpunkt (t.ex. garantier).',
  },
  {
    category: 'kap6',
    question: 'Hur värderas fordringar och skulder i utländsk valuta på balansdagen?',
    answer:
      'De ska räknas om till balansdagens kurs (kursen på bokslutsdatumet). Orealiserade kursvinster/förluster påverkar resultatet.',
  },
  {
    category: 'kap6',
    question: 'Vad är en obeskattad reserv respektive bokslutsdisposition?',
    answer:
      'Bokslutsdisposition = Åtgärden i Resultaträkningen för att minska skatten (t.ex. "Avsättning till periodiseringsfond"). Obeskattad reserv = "Sparbössan" i Balansräkningen där den obeskattade vinsten ligger.',
  },
  {
    category: 'kap6',
    question: 'Vilket är syftet med bokslutsdispositioner?',
    answer: 'Att skjuta upp skatt och jämna ut resultatet mellan goda och dåliga år.',
  },
  {
    category: 'kap6',
    question: 'Vad är skillnaden på redovisat resultat före skatt och skattemässigt resultat?',
    answer:
      'Redovisat resultat = Det bokföringen visar. Skattemässigt resultat = Resultatet efter skattemässiga justeringar (t.ex. ej avdragsgilla kostnader) som skatten baseras på.',
  },
  {
    category: 'kap6',
    question: 'Hur uppkommer en beräknad kvarskatt i bokslutet?',
    answer:
      'Om den slutliga skatten på årets vinst beräknas bli högre än den preliminärskatt vi betalat in under året, bokförs mellanskillnaden som en skatteskuld.',
  },
  // ==================================================================
  // KAPITEL 7: Balansräkningens Poster (KOMPLETT)
  // ==================================================================
  {
    category: 'kap7',
    question: 'Vad är definitionen av en Tillgång?',
    answer:
      'En resurs som kontrolleras av företaget till följd av inträffade händelser och som förväntas ge framtida ekonomiska fördelar.',
  },
  {
    category: 'kap7',
    question: 'Vad är definitionen av en Skuld?',
    answer:
      'Ett befintligt åtagande till följd av inträffade händelser som förväntas leda till ett utflöde av resurser (pengar) från företaget.',
  },
  {
    category: 'kap7',
    question: 'Vilka två grundläggande sätt finns att värdera tillgångar/skulder?',
    answer:
      '1. Anskaffningsvärde (historiskt värde, det vi betalade).\n2. Verkligt värde (marknadsvärde, vad det är värt idag).',
  },
  {
    category: 'kap7',
    question: 'Vad är skillnaden mellan Anläggningstillgång (AT) och Omsättningstillgång (OT)?',
    answer:
      'AT är avsedd att stadigvarande brukas eller innehas i rörelsen (minst 1 år). OT är allt annat (ska säljas/förbrukas löpande).',
  },
  {
    category: 'kap7',
    question: 'Vilka tre huvudtyper av anläggningstillgångar finns?',
    answer:
      '1. Immateriella (t.ex. patent, goodwill).\n2. Materiella (t.ex. maskiner, byggnader).\n3. Finansiella (t.ex. aktier i dotterbolag, långfristiga fordringar).',
  },
  {
    category: 'kap7',
    question: 'Varför görs avskrivningar på materiella/immateriella tillgångar?',
    answer:
      'För att fördela kostnaden över tillgångens ekonomiska livslängd (matchningsprincipen). Tillgången förbrukas/slits ju ut.',
  },
  {
    category: 'kap7',
    question: 'Varför görs ingen avskrivning på finansiella tillgångar (eller mark)?',
    answer:
      'För att de inte förbrukas eller slits ut över tid. De behåller (oftast) sitt värde eller ökar.',
  },
  {
    category: 'kap7',
    question: 'När ska en nedskrivning göras?',
    answer:
      'När tillgångens verkliga värde är lägre än det bokförda värdet och värdenedgången bedöms vara bestående.',
  },
  {
    category: 'kap7',
    question: 'Vad innebär aktivering av utgifter för immateriella tillgångar?',
    answer:
      'Att utgifter för t.ex. utveckling bokförs som en tillgång i balansräkningen istället för en kostnad direkt, om de förväntas ge framtida intäkter.',
  },
  {
    category: 'kap7',
    question: 'Vad är svårigheten med att värdera egentillverkat varulager?',
    answer:
      'Att beräkna vilka indirekta kostnader (t.ex. lokalhyra, administration) som ska räknas in i lagrets värde utöver direkt material och lön.',
  },
  {
    category: 'kap7',
    question: 'Vilken svårighet finns vid värdering av kundfordringar?',
    answer:
      'Att bedöma kreditrisken (risken att kunden inte betalar) och avgöra hur stor nedskrivning för "osäkra kundfordringar" som ska göras.',
  },
  {
    category: 'kap7',
    question: 'Vad är skillnaden mellan en Skuld och en Avsättning?',
    answer:
      'En skuld är säker till belopp och tidpunkt. En avsättning är en förpliktelse som är sannolik, men oviss gällande exakt belopp eller förfallodag.',
  },
  {
    category: 'kap7',
    question: 'Vad är Eget Kapital rent teoretiskt?',
    answer:
      'Det är en residualpost (restpost). Skillnaden mellan tillgångar och skulder. Representerar ägarnas nettoförmögenhet i bolaget.',
  },
  {
    category: 'kap7',
    question: 'Varför delas Eget Kapital in i Bundet och Fritt?',
    answer:
      'För att skydda borgenärerna (långivarna). Bundet kapital (t.ex. aktiekapital) får inte delas ut. Fritt kapital får delas ut till ägarna.',
  },
  {
    category: 'kap7',
    question: 'Vad är skillnaden mellan Nyemission och Fondemission?',
    answer:
      'Nyemission = Ägarna skjuter till nya pengar (EK ökar). Fondemission = Pengar flyttas från fritt till bundet EK (inga nya pengar in, EK oförändrat).',
  },

  // ==================================================================
  // KAPITEL 8: Resultaträkningens Poster (KOMPLETT)
  // ==================================================================
  {
    category: 'kap8',
    question: 'Hur definieras Intäkt respektive Kostnad?',
    answer:
      'Intäkt = Värdet av utförda prestationer under perioden.\nKostnad = Värdet av förbrukade resurser under perioden.',
  },
  {
    category: 'kap8',
    question: 'Ge exempel på transaktioner som INTE påverkar resultaträkningen.',
    answer:
      '1. Nyemission (Ägartillskott)\n2. Upptagande av lån\n3. Amortering av lån\n4. Moms (är en skuld/fordran).',
  },
  {
    category: 'kap8',
    question: 'Vilken är den största svårigheten vid intäktsredovisning av varor?',
    answer:
      'Att avgöra när "väsentliga risker och förmåner" har övergått till köparen (oftast vid leverans), vilket styr NÄR intäkten ska bokföras.',
  },
  {
    category: 'kap8',
    question: 'Hur är tiden viktig vid redovisning av tjänsteuppdrag?',
    answer:
      'Intäkten ska ofta redovisas i takt med att arbetet utförs (succesiv vinstavräkning) baserat på färdigställandegraden.',
  },
  {
    category: 'kap8',
    question: 'Vad är Kostnad för sålda varor (KSV) och hur beräknas den?',
    answer: 'Kostnaden för de varor vi faktiskt sålt.\nFormel: IB Lager + Årets Inköp - UB Lager.',
  },
  {
    category: 'kap8',
    question:
      'Hur skiljer sig redovisningen av en lagerinvestering jämfört med en marknadsföringskampanj?',
    answer:
      'Lagerinvestering: Bokförs som Tillgång (påverkar ej resultatet direkt).\nMarknadsföring: Bokförs oftast direkt som Kostnad (sänker resultatet direkt).',
  },
  {
    category: 'kap8',
    question: 'För vilka tillgångar ska avskrivningar göras?',
    answer:
      'För anläggningstillgångar med begränsad ekonomisk livslängd (t.ex. maskiner, inventarier, patent). Ej mark eller konst.',
  },
  {
    category: 'kap8',
    question: 'Vilka effekter får en nedskrivning av en maskin på resultatet?',
    answer:
      '1. Direkt effekt: Stor engångskostnad detta år (resultatet sjunker).\n2. Framtida effekt: Lägre avskrivningar kommande år (resultatet blir högre än annars).',
  },
  {
    category: 'kap8',
    question: 'Ge exempel på poster där det går lång tid mellan betalning och resultateffekt.',
    answer:
      '1. Inköp av fastighet/maskin (Betalas år 1, kostnadsförs via avskrivning i 20 år).\n2. Pensionsavsättningar (Kostnad nu, utbetalning om 30 år).',
  },
  {
    category: 'kap8',
    question: 'Vilka tre delar är en resultaträkning normalt indelad i?',
    answer:
      '1. Rörelseresultat (EBIT)\n2. Finansiellt resultat (Rännetto)\n3. Bokslutsdispositioner & Skatt.',
  },
  {
    category: 'kap8',
    question: 'Vad skiljer en Kostnadsslagsindelad RR från en Funktionsindelad RR?',
    answer:
      'Kostnadsslag: Sorterar på VAD vi köpt (Varor, Personal, Avskrivningar).\nFunktion: Sorterar på VAD det används till (KSV, Försäljning, Admin).',
  },

  // ==================================================================
  // KAPITEL 9: Kassaflödesanalys (KOMPLETT)
  // ==================================================================
  {
    category: 'kap9',
    question: 'Varför ger en ÖKNING av varulagret ett NEGATIVT kassaflöde?',
    answer:
      'För att vi har bundit kapital. Vi har köpt in mer än vi sålt/förbrukat, vilket betyder att pengar (likviditet) har lämnat bolaget för att bli varor.',
  },
  {
    category: 'kap9',
    question: 'Hur beräknas periodens investeringar (utbetalning) utifrån balansräkningen?',
    answer:
      'Utgående balans (AT) - Ingående balans (AT) + Årets avskrivningar + Bokfört värde på sålda tillgångar.',
  },
  {
    category: 'kap9',
    question: 'Hur räknar man fram inbetalning från försäljning av anläggningstillgångar?',
    answer:
      'Bokfört värde på det vi sålde +/- Realisationsresultatet (Vinst/Förlust vid försäljningen).',
  },
  {
    category: 'kap9',
    question:
      'Varför bör kassaflödet från den löpande verksamheten vara större än investeringsflödet över tid?',
    answer:
      'För att företaget ska vara självfinansierande. Man måste tjäna in de pengar som behövs för att återinvestera och ersätta gamla maskiner.',
  },
  {
    category: 'kap9',
    question: 'Vilka betalningsflöden ingår i Finansieringsverksamheten?',
    answer:
      '1. Nyupplåning (In)\n2. Amortering av lån (Ut)\n3. Nyemission (In)\n4. Aktieutdelning (Ut).',
  },

  // ==================================================================
  // KAPITEL 10: Noter & Upplysningar (KOMPLETT)
  // ==================================================================
  {
    category: 'kap10',
    question: 'Vilka två huvudtyper av upplysningar finns?',
    answer:
      '1. Obligatoriska (Krävs enligt lag/ÅRL).\n2. Frivilliga (Företaget väljer själva att berätta).',
  },
  {
    category: 'kap10',
    question: 'Var i årsredovisningen hittar man upplysningarna?',
    answer: 'Främst i Noterna och i Förvaltningsberättelsen.',
  },
  {
    category: 'kap10',
    question: 'Varför krävs obligatoriska upplysningar?',
    answer:
      'För att minska informationsasymmetrin och skydda intressenter. Siffrorna i RR/BR räcker inte alltid för att förstå risker och värderingar.',
  },
  {
    category: 'kap10',
    question: 'Vad är en risk med att lämna för mycket upplysningar?',
    answer:
      'Att konkurrenter kan få känslig information om företagets strategi, marginaler eller forskning.',
  },
  {
    category: 'kap10',
    question: 'Varför lämnar företag frivilliga upplysningar?',
    answer:
      'För att signalera styrka, bygga förtroende, locka investerare (ESG/Hållbarhet) eller förklara engångshändelser.',
  },
  {
    category: 'kap10',
    question: 'Vad är en Förvaltningsberättelse?',
    answer:
      'En beskrivande textöversikt av verksamheten, resultatet och ställningen. Ska innehålla väsentliga händelser som inte syns i siffrorna.',
  },
  {
    category: 'kap10',
    question: 'Vad visar rapporten över förändring i Eget Kapital?',
    answer:
      'Specifierar exakt vad som hänt med ägarnas pengar under året: IB EK + Årets Resultat + Nyemission - Utdelning = UB EK.',
  },
  {
    category: 'kap10',
    question: 'Vad innehåller Noterna?',
    answer:
      'Detaljerade specifikationer av belopp (t.ex. avskrivningstider, löner, uppdelning av skulder) och vilka redovisningsprinciper som använts.',
  },
  {
    category: 'kap10',
    question: 'Vad är en Eventualförpliktelse? (Ge exempel)',
    answer:
      'Ett möjligt åtagande som inte bokförs som skuld eftersom det är osäkert om det kommer hända. Måste upplysas om i not. Exempel: Borgensåtaganden, pågående rättstvister.',
  },

  // ==================================================================
  // KAPITEL 11: Hållbarhetsredovisning (KOMPLETT)
  // ==================================================================
  {
    category: 'kap11',
    question: 'Vad innebär hållbar utveckling (Brundtland-definitionen)?',
    answer:
      'En utveckling som tillfredsställer dagens behov utan att äventyra kommande generationers möjligheter att tillfredsställa sina behov.',
  },
  {
    category: 'kap11',
    question: 'Vad är GRI (Global Reporting Initiative)?',
    answer:
      'Det vanligaste privata ramverket för hållbarhetsrapportering. En global standard som används frivilligt av många företag.',
  },
  {
    category: 'kap11',
    question: 'Vad är CSRD och ESRS?',
    answer:
      'CSRD = EU-direktiv som ställer lagkrav på hållbarhetsrapportering.\nESRS = De specifika standarderna för HUR man ska rapportera enligt CSRD.',
  },
  {
    category: 'kap11',
    question: 'Vad har EFRAG för roll inom regleringen?',
    answer:
      'EFRAG är en rådgivande grupp till EU-kommissionen som tar fram utkast till standarderna (ESRS).',
  },
  {
    category: 'kap11',
    question: 'Vad säger Årsredovisningslagen (ÅRL) om hållbarhetsrapportering?',
    answer:
      'Större företag SKA upprätta en hållbarhetsrapport som täcker miljö, sociala förhållanden, personal, mänskliga rättigheter och motverkande av korruption.',
  },
  {
    category: 'kap11',
    question: 'Vad är IFRS Foundations (ISSB) roll i framtiden?',
    answer:
      'Att skapa en "global baslinje" för hållbarhetsrapportering (IFRS S1 & S2) med fokus på investerares behov (finansiell väsentlighet).',
  },
  {
    category: 'kap11',
    question: 'Varför är jämförbarhet svårt inom hållbarhetsredovisning?',
    answer:
      'P.g.a. brist på enhetliga definitioner, svårigheter att mäta "mjuka" värden och att olika ramverk används.',
  },
  {
    category: 'kap11',
    question: 'Vilka incitament har företag för att hållbarhetsrapportera?',
    answer:
      '1. Legitimitet (framstå som ansvarsfulla).\n2. Signalering (locka investerare/kunder).\n3. Effektivitet (minska energikostnader/risker).',
  },
  {
    category: 'kap11',
    question: 'Hur ser kopplingen ut mellan hållbarhet och lönsamhet?',
    answer:
      'Omdiskuterat. Vissa menar att det är en kostnad som sänker vinsten. Andra menar att det ökar långsiktig vinst genom minskad risk och starkare varumärke.',
  },

  // ==================================================================
  // KAPITEL 12: Koncernredovisning (KOMPLETT)
  // ==================================================================
  {
    category: 'kap12',
    question: 'Vad är en Koncern?',
    answer:
      'En ekonomisk enhet som består av ett Moderbolag och ett eller flera Dotterbolag där modern har bestämmande inflytande (oftast >50% av rösterna).',
  },
  {
    category: 'kap12',
    question: 'Vad är syftet med Koncernredovisning?',
    answer:
      'Att visa hela gruppens ekonomiska ställning som om det vore ETT enda företag, rensat från interna affärer.',
  },
  {
    category: 'kap12',
    question: 'Vad är interna fordringar/skulder och transaktioner?',
    answer:
      'Affärer mellan bolag i samma koncern (t.ex. modern lånar ut pengar till dottern). Dessa måste ELIMINERAS i koncernredovisningen.',
  },
  {
    category: 'kap12',
    question: 'Varför skiljer sig anskaffningsvärden mellan koncern och dotterbolag?',
    answer:
      'Dotterbolaget har sina gamla bokförda värden. Koncernen "köpte" bolaget vid en tidpunkt till marknadsvärde (vilket blir koncernens anskaffningsvärde).',
  },
  {
    category: 'kap12',
    question: 'Vad är en Förvärvsanalys?',
    answer:
      'En beräkning som görs när man köper ett dotterbolag. Man jämför priset man betalade med det verkliga värdet på dotterbolagets nettotillgångar.',
  },
  {
    category: 'kap12',
    question: 'Vad är Goodwill i koncernredovisningen?',
    answer:
      'Det övervärde som uppstår när man betalar MER för ett bolag än värdet på dess identifierbara nettotillgångar (t.ex. för varumärke, personal, synergieffekter).',
  },
  {
    category: 'kap12',
    question: 'Vad innebär Minoritetsintresse (Innehav utan bestämmande inflytande)?',
    answer:
      'Den del av dotterbolagets resultat och egna kapital som ägs av andra än moderbolaget (om modern äger mindre än 100%).',
  },

  // ==================================================================
  // KAPITEL 13: Reglering & Normsättare (KOMPLETT)
  // ==================================================================
  {
    category: 'kap13',
    question: 'Varför behöver redovisning vara reglerad?',
    answer:
      'För att skydda svagare intressenter, säkerställa jämförbarhet och minska informationsasymmetrin (så företag inte kan luras).',
  },
  {
    category: 'kap13',
    question: 'Vad betyder informationsasymmetri?',
    answer:
      'Att företagsledningen vet mer om företaget än vad de externa intressenterna (ägare/långivare) gör.',
  },
  {
    category: 'kap13',
    question: 'Vad innebär avvägningen mellan kostnad och nytta i reglering?',
    answer:
      'Regleraren måste se till att nyttan av informationen för användarna är större än kostnaden för företagen att ta fram den.',
  },
  {
    category: 'kap13',
    question: 'För- och nackdelar med Statlig vs Privat reglering?',
    answer:
      'Statlig = Demokratisk legitimitet och tvingande, men trög. Privat = Flexibel och hög expertis, men risk för särintressen/bristande insyn.',
  },
  {
    category: 'kap13',
    question: 'Vad innebär God redovisningssed?',
    answer:
      'En rättslig standard som formas av lag, rekommendationer från normsättare (t.ex. BFN) och praxis hos kvalificerade företag.',
  },
  {
    category: 'kap13',
    question: 'Vilka är de viktigaste svenska normsättarna?',
    answer:
      'Bokföringsnämnden (BFN) för onoterade bolag. Rådet för finansiell rapportering (RFR) för noterade bolag. Finansinspektionen (FI).',
  },
  {
    category: 'kap13',
    question: 'Vad är BFN:s roll?',
    answer:
      'Statlig myndighet som tolkar ÅRL och ger ut allmänna råd (t.ex. K2 och K3) som vägleder hur lagen ska tillämpas.',
  },
  {
    category: 'kap13',
    question: 'Hur påverkar internationell reglering (IFRS) svenska företag?',
    answer:
      'Svenska börsbolag MÅSTE följa IFRS i koncernredovisningen (EU-lag). Det påverkar även onoterade bolag då svensk normgivning (K3) inspireras av IFRS.',
  },
  {
    category: 'kap13',
    question: 'Vem är primär användare i Angloamerikansk vs Kontinental tradition?',
    answer:
      'Angloamerikansk (USA/UK) = Investerare/Aktiemarknad. Kontinental (Tyskland/Sverige) = Långivare/Staten (Skatteverket/Borgenärsskydd).',
  },
  {
    category: 'kap13',
    question: 'Vad skiljer Principbaserad från Regelbaserad redovisning?',
    answer:
      'Principbaserad (IFRS) = Fokus på övergripande principer och bedömningar ("true and fair"). Regelbaserad (US GAAP) = Detaljerade regler för varje situation.',
  },

  // ==================================================================
  // KAPITEL 14: Grundläggande Principer (KOMPLETT)
  // ==================================================================
  {
    category: 'kap14',
    question: 'Vilket är förhållandet mellan redovisningsregler och principer?',
    answer:
      'Principerna är den teoretiska grunden som reglerna bygger på. Om en specifik regel saknas, vägleder principerna hur man ska göra.',
  },
  {
    category: 'kap14',
    question: 'Vilka är de grundläggande antaganden som redovisningen vilar på?',
    answer:
      'De viktigaste är Fortlevnadsprincipen (Going Concern) och Bokföringsmässiga grunder (Accrual Basis).',
  },
  {
    category: 'kap14',
    question: 'Vad innebär principen om Redovisningsenhet?',
    answer:
      'Att företaget är en separat ekonomisk enhet, skild från ägarnas privata ekonomi. Endast företagets transaktioner ska bokföras.',
  },
  {
    category: 'kap14',
    question: 'Vad är innebörden i principen om Bokföringsmässiga grunder?',
    answer:
      'Transaktioner ska redovisas när de inträffar (prestationen), inte när pengarna betalas (kassaflödet). Det är grunden för periodisering.',
  },
  {
    category: 'kap14',
    question: 'Vad innebär Fortlevnadsprincipen (Going Concern)?',
    answer:
      'Vi förutsätter att företaget ska fortsätta sin verksamhet i överskådlig framtid. Därför värderas tillgångar till nyttjandevärde, inte slaktvärde.',
  },
  {
    category: 'kap14',
    question: 'Vad innebär Försiktighetsprincipen?',
    answer:
      'Vid osäkerhet ska man välja det alternativ som ger lägst vinst/tillgångar. "Kostnader tas direkt, intäkter först när de är säkra."',
  },
  {
    category: 'kap14',
    question: 'Vad är innebörden i Matchningsprincipen?',
    answer:
      'Att kostnader ska redovisas samma period som de intäkter de har varit med om att skapa (orsak-verkan).',
  },
  {
    category: 'kap14',
    question: 'Vilka är de grundläggande kvalitativa egenskaperna enligt IFRS?',
    answer:
      '1. Relevans (informationen påverkar beslut).\n2. Trovärdig representation (korrekt återgivande).',
  },
  {
    category: 'kap14',
    question: 'Vad innebär målet om "Korrekt återgivande" (True and Fair view)?',
    answer:
      'Att redovisningen ska spegla den ekonomiska verkligheten på ett neutralt och felfritt sätt, inte bara följa regler mekaniskt.',
  },

  // ==================================================================
  // KAPITEL 15: Introduktion till Analys (KOMPLETT)
  // ==================================================================
  {
    category: 'kap15',
    question: 'Varför är lönsamhet ett viktigt mått vid företagsanalys?',
    answer:
      'Det visar företagets förmåga att överleva på sikt och skapa värde åt ägarna. Utan lönsamhet dräneras kapitalet.',
  },
  {
    category: 'kap15',
    question: 'Vad betyder Räntabilitet (Return)?',
    answer:
      'Ett lönsamhetsmått som visar avkastningen i procent av det kapital som satsats. (Vinst / Kapital).',
  },
  {
    category: 'kap15',
    question: 'Hur skiljer sig långivares och aktieägares informationsbehov åt?',
    answer:
      'Långivare tittar på nedsidan (risk för konkurs, betalningsförmåga). Aktieägare tittar på uppsidan (vinsttillväxt, utdelning).',
  },
  {
    category: 'kap15',
    question: 'Vad betyder Operativ risk?',
    answer:
      'Risken kopplad till själva verksamheten (marknad, konkurrens, konjunktur). Mäts ofta via soliditet eller vinstmarginalens stabilitet.',
  },
  {
    category: 'kap15',
    question: 'Vad betyder Finansiell risk och hur analyseras den?',
    answer:
      'Risken att inte kunna betala sina skulder. Analyseras via Soliditet (lång sikt) och Likviditet (kort sikt).',
  },
  {
    category: 'kap15',
    question: 'Varför är Kapitalstyrka (Soliditet) viktig?',
    answer:
      'Ett starkt eget kapital fungerar som en "krockkudde" vid förluster. Hög soliditet = låg finansiell risk.',
  },
  {
    category: 'kap15',
    question: 'Hur ser Skatteverkets intresse av analysen ut?',
    answer:
      'De vill säkerställa att vinsten inte är för låg p.g.a. fusk, och att företaget har likviditet att betala skatter och avgifter.',
  },
  {
    category: 'kap15',
    question: 'Varför vill företagsledningen analysera sin egen externa redovisning?',
    answer:
      'För att förstå hur omvärlden (investerare/banker) ser på bolaget, vilket påverkar aktiekursen och lånevillkor.',
  },
  // ==================================================================
  // KAPITEL 16: Nyckeltalsberäkning (KOMPLETT)
  // ==================================================================
  {
    category: 'kap16',
    question: 'Vilka tre sätt används ofta för att jämföra nyckeltal?',
    answer:
      '1. Tiden (Historisk utveckling)\n2. Konkurrenter (Branschjämförelse)\n3. Mål (Budget/Egna målsättningar).',
  },
  {
    category: 'kap16',
    question:
      'Varför är Räntabilitet på Eget Kapital (Re) oftast högre än Räntabilitet på Totalt Kapital (Rt)?',
    answer:
      'P.g.a. Hävstångseffekten. Om vi lånar pengar till en ränta som är lägre än avkastningen på totalt kapital, tillfaller överskottet ägarna.',
  },
  {
    category: 'kap16',
    question: 'Vad är Sysselsatt Kapital?',
    answer:
      'Totalt kapital minus Räntefria skulder (t.ex. leverantörsskulder). Det kapital som "kräver avkastning" (från ägare och långivare).',
  },
  {
    category: 'kap16',
    question: 'Varför använder man Genomsnittligt Kapital vid beräkning av räntabilitet?',
    answer:
      'Resultatet tjänas in under hela året, medan kapitalet kan ändras. Genomsnittet ger en mer rättvisande bild av hur mycket kapital som arbetat.',
  },
  {
    category: 'kap16',
    question: 'Vad är Hävstångseffekten (Formel)?',
    answer:
      'Re = Rt + (Rt - Rs) x (S/E).\nVisar hur skuldsättningsgraden (S/E) påverkar ägarnas avkastning. Positivt om Rt > Låneräntan (Rs).',
  },
  {
    category: 'kap16',
    question: 'Vad visar DuPont-modellen?',
    answer:
      'Att räntabiliteten beror på två saker: Vinstmarginal (hur mycket vi tjänar på varje krona) och Kapitalomsättningshastighet (hur effektivt vi använder kapitalet).',
  },
  {
    category: 'kap16',
    question: 'Vad mäter Kapitalomsättningshastighet?',
    answer:
      'Omsättning / Totalt kapital. Visar hur effektivt företaget är på att generera försäljning med sina tillgångar. Högt värde = Effektivt.',
  },
  {
    category: 'kap16',
    question: 'Vad visar Soliditet?',
    answer:
      'Långsiktig betalningsförmåga. Hur stor del av tillgångarna som är finansierade med Eget Kapital. (Justerat EK / Totalt Kapital).',
  },
  {
    category: 'kap16',
    question: 'Varför bör Räntetäckningsgraden vara större än 1?',
    answer:
      'Om den är 1.0 går hela resultatet till att betala räntor. Är den lägre än 1 måste företaget låna mer eller sälja tillgångar för att betala räntan.',
  },
  {
    category: 'kap16',
    question: 'Nämn två likviditetsmått och hur de beräknas.',
    answer:
      '1. Kassalikviditet = (Omsättningstillgångar - Lager) / Kortfristiga skulder.\n2. Balanslikviditet = Samtliga Omsättningstillgångar / Kortfristiga skulder.',
  },
  {
    category: 'kap16',
    question: 'Vad visar kassaflödesmåttet Självfinansieringsgrad?',
    answer:
      'Kassaflöde från löpande verksamhet / Investeringar. Visar om företaget kan betala sina investeringar med egna intjänade pengar (>1).',
  },

  // ==================================================================
  // KAPITEL 17: Tolkning av Nyckeltal (KOMPLETT)
  // ==================================================================
  {
    category: 'kap17',
    question: 'Varför är det viktigt att bedöma utvecklingen historiskt (Trendanalys)?',
    answer:
      'En enskild siffra säger lite. En trend visar om företaget är på väg åt rätt eller fel håll och om resultaten är stabila eller volatila.',
  },
  {
    category: 'kap17',
    question: 'Hur hanteras Obeskattade reserver vid nyckeltalsberäkning (Justering)?',
    answer:
      'De delas upp: ca 80% räknas som Eget Kapital (Justerat EK) och ca 20% räknas som en Latent skatteskuld.',
  },
  {
    category: 'kap17',
    question: 'Hur vet man om Räntabilitet på Eget Kapital (Re) är "bra"?',
    answer:
      'Genom att jämföra med avkastningskravet (Riskfri ränta + Riskpremie) eller vad man kan få för avkastning på börsen/andra investeringar.',
  },
  {
    category: 'kap17',
    question: 'Varför är ökad omsättning (Tillväxt) ett positivt tecken?',
    answer:
      'Det visar att efterfrågan på företagets produkter ökar och att företaget tar marknadsandelar. Det är grunden för framtida vinstökning.',
  },
  {
    category: 'kap17',
    question: 'Hur kan ett företag ha ökad omsättning men negativ vinstutveckling?',
    answer:
      'De kanske "köper" marknadsandelar genom att sänka priserna (lägre marginal), eller så har kostnaderna ökat snabbare än intäkterna.',
  },
  {
    category: 'kap17',
    question: 'Vad kan en ökad Soliditet bero på?',
    answer:
      'Antingen att företaget gjort vinst som återinvesterats (EK ökar), eller att man amorterat lån/sålt tillgångar (Totalt kapital minskar).',
  },
  {
    category: 'kap17',
    question: 'Varför kan Kassalikviditet under 100% vara acceptabelt för t.ex. en mataffär?',
    answer:
      'För att de säljer varor kontant snabbt (får in pengar direkt) men betalar leverantörer på 30 dagar. Omsättningshastigheten på lagret är hög.',
  },
  {
    category: 'kap17',
    question: 'Varför är kunskap om samhällsekonomin viktig vid analys?',
    answer:
      'Externa faktorer som ränteläge, inflation och konjunktur påverkar företagets kostnader och efterfrågan, oavsett hur duktig ledningen är.',
  },
]

const currentIndex = ref(0)
const isFlipped = ref(false)
// Toggle to hide/show flashcards UI; keep data in code but render nothing when false
const showFlashcards = ref(false)

// Vi ändrar filteredCards till en ref (istället för computed) så vi kan spara den blandade ordningen
const filteredCards = ref([])

// Hjälpfunktion för att blanda en array (Fisher-Yates shuffle)
function shuffleArray(array) {
  const arr = [...array] // Gör en kopia för att inte ändra originalet
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

// Funktion som körs när vi byter mode: Filtrera OCH blanda
function updateAndShuffleCards() {
  let selectedCards = []

  // 1. Filtrera fram rätt kapitel
  if (currentMode.value === 'all') {
    selectedCards = allCards
  } else {
    selectedCards = allCards.filter((card) => card.category === currentMode.value)
  }

  // 2. Försök återställa sparad ordning för detta mode, annars blanda korten och spara i vår ref
  const storageKey = `flashcards_state_${currentMode.value}`
  try {
    const raw = localStorage.getItem(storageKey)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (parsed && Array.isArray(parsed.order) && parsed.order.length > 0) {
        // Bygg en karta över valda kort för att återskapa ordningen
        const map = new Map(selectedCards.map((c) => [c.question, c]))
        const ordered = parsed.order.map((q) => map.get(q)).filter(Boolean)

        // Om den sparade ordningen matchar vårt filter, använd den
        if (ordered.length === selectedCards.length) {
          filteredCards.value = ordered
          currentIndex.value = Math.min(parsed.index || 0, ordered.length - 1)
          isFlipped.value = false
          // Spara current state (to be safe)
          saveFlashcardsState(currentMode.value)
          return
        }
      }
    }
  } catch (e) {
    // ignore and fall back to shuffle
    console.warn('Failed to load flashcard state', e)
  }

  // Fall back: blanda kort
  filteredCards.value = shuffleArray(selectedCards)

  // 3. Nollställ positionen
  currentIndex.value = 0
  isFlipped.value = false
  saveFlashcardsState(currentMode.value)
}

function saveFlashcardsState(mode) {
  try {
    const storageKey = `flashcards_state_${mode}`
    const order = filteredCards.value.map((c) => c.question)
    const payload = { order, index: currentIndex.value }
    localStorage.setItem(storageKey, JSON.stringify(payload))
  } catch (e) {
    console.warn('Failed to save flashcard state', e)
  }
}

// Hämtar det kort vi tittar på just nu från den (nu blandade) listan
const currentCard = computed(() => {
  if (filteredCards.value.length === 0) return null
  // Skydd för index
  const idx = Math.min(currentIndex.value, filteredCards.value.length - 1)
  return filteredCards.value[idx]
})

// Bevaka currentMode: När den ändras, filtrera och blanda om kortleken
// "immediate: true" gör att den även körs en gång direkt när sidan laddas
watch(
  currentMode,
  () => {
    updateAndShuffleCards()
  },
  { immediate: true },
)

function flipCard() {
  if (!currentCard.value) return
  isFlipped.value = !isFlipped.value
}

function nextCard() {
  isFlipped.value = false
  setTimeout(() => {
    if (currentIndex.value < filteredCards.value.length - 1) {
      currentIndex.value++
    } else {
      currentIndex.value = 0
    }
    saveFlashcardsState(currentMode.value)
  }, 200)
}

function prevCard() {
  isFlipped.value = false
  setTimeout(() => {
    if (currentIndex.value > 0) {
      currentIndex.value--
    } else {
      // wrap-around to last card for convenience
      currentIndex.value = Math.max(filteredCards.value.length - 1, 0)
    }
    saveFlashcardsState(currentMode.value)
  }, 200)
}

function shuffleAndRandomize() {
  if (!filteredCards.value || filteredCards.value.length === 0) return
  // Shuffle current filtered set
  filteredCards.value = shuffleArray(filteredCards.value)
  // Jump to a random card
  currentIndex.value = Math.floor(Math.random() * filteredCards.value.length)
  isFlipped.value = false
  saveFlashcardsState(currentMode.value)
}

// Spara index när det ändras (t.ex. via UI eller programatiskt)
watch(currentIndex, () => {
  saveFlashcardsState(currentMode.value)
})

// När mode ändras så uppdateras kortleken via watch tidigare, men spara mode-change så state för det mode kan återställas senare
watch(currentMode, () => {
  // Try to restore immediately after mode change
  updateAndShuffleCards()
})

onMounted(() => {
  // Ensure initial shuffle/load runs (watch with immediate already does it, but call to be explicit)
  updateAndShuffleCards()
})
</script>

<template>
  <div v-if="showFlashcards" class="flashcard-wrapper">
    <div class="mode-selector-container">
      <label for="chapter-select">Välj kapitel:</label>
      <select id="chapter-select" v-model="currentMode">
        <option v-for="mode in modes" :key="mode.id" :value="mode.id">
          {{ mode.label }}
        </option>
      </select>
    </div>

    <div v-if="currentCard" class="scene">
      <div class="card" :class="{ 'is-flipped': isFlipped }" @click="flipCard">
        <div class="card-face card-front">
          <h3>
            FRÅGA
            <span class="counter">({{ currentIndex + 1 }} / {{ filteredCards.length }})</span>
          </h3>
          <p>{{ currentCard.question }}</p>
        </div>

        <div class="card-face card-back">
          <h3>SVAR</h3>
          <p>{{ currentCard.answer }}</p>
        </div>
      </div>
    </div>

    <div v-else class="scene empty-state">
      <p>Inga flashcards inlagda för detta kapitel än!</p>
    </div>

    <div class="controls" v-if="currentCard">
      <button
        @click="prevCard"
        :disabled="filteredCards.length <= 1"
        class="btn btn-prev"
        title="Föregående fråga"
      >
        Föregående
      </button>

      <button @click="shuffleAndRandomize" class="btn btn-shuffle">Slumpa</button>

      <button @click="nextCard" class="btn btn-next">Nästa kort</button>
    </div>
  </div>
</template>

<style scoped>
.flashcard-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  flex-grow: 1;
  min-height: 100%;
  padding: 40px 20px 80px 20px;
  box-sizing: border-box;
}

.mode-selector-container {
  margin-bottom: 30px;
  display: flex;
  align-items: center;
  gap: 10px;
  background: white;
  padding: 10px 20px;
  border-radius: 30px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
}

label {
  font-weight: bold;
  color: #2c3e50;
  font-size: 0.9rem;
}

select {
  padding: 8px 12px;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #f9f9f9;
  cursor: pointer;
}

.scene {
  width: 90vw;
  max-width: 800px;
  height: 500px;
  perspective: 1000px;
  margin: 0 0 40px 0;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: bold;
  color: #999;
  border: 3px dashed #ccc;
  border-radius: 20px;
}

.card {
  width: 100%;
  height: 100%;
  position: relative;
  transition: transform 0.6s;
  transform-style: preserve-3d;
  cursor: pointer;
}

.card.is-flipped {
  transform: rotateY(180deg);
}

.card-face {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  padding: 40px;
  box-sizing: border-box;
  text-align: center;
  overflow-y: auto;
}

.card-front {
  background: white;
  border: 4px solid #2c3e50;
  color: #2c3e50;
}

.card-back {
  background: #2c3e50;
  color: white;
  transform: rotateY(180deg);
}

h3 {
  font-size: 1.1rem;
  text-transform: uppercase;
  letter-spacing: 2px;
  margin: 0 0 20px 0;
  opacity: 0.6;
}

.counter {
  display: block;
  font-size: 0.9rem;
  margin-top: 5px;
}

p {
  font-size: 1.6rem;
  font-weight: bold;
  line-height: 1.5;
  margin: 0;
}

.controls {
  display: flex;
  gap: 16px;
  justify-content: center;
  align-items: center;
}

/* Unified button style - only color differs for variants */
.btn {
  padding: 15px 40px;
  border: none;
  border-radius: 50px;
  font-size: 1.2rem;
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
  box-shadow: 0 4px 12px rgba(52, 152, 219, 0.25);
}
.btn-prev:hover {
  transform: scale(1.03);
  background-color: #2d86c6;
}

.btn-shuffle {
  background-color: #8e44ad;
  box-shadow: 0 4px 12px rgba(142, 68, 173, 0.25);
}
.btn-shuffle:hover {
  transform: scale(1.03);
  background-color: #7a3aa0;
}

.btn-next {
  background-color: #42b883;
  box-shadow: 0 4px 15px rgba(66, 184, 131, 0.35);
}
.btn-next:hover {
  transform: scale(1.05);
  background-color: #3aa876;
}
</style>
