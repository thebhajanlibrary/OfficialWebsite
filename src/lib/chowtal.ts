/**
 * Chowtal / Phagwah singing lyrics (lyrics-only — no audio).
 * Sources: Chowtal Rang Bahar (Sasenarine / Manuel) and Triveni Mandir
 * Chowtal Group booklet. Cleaned for singing; intros and credits trimmed.
 * English meanings from Rang Bahar (Medini Hombol) where available.
 *
 * `order` ≈ typical session usefulness / how often sung (lower = first).
 */

import { CHOWTAL_TRANSLATIONS } from "@/lib/chowtal-translations";

export type ChowtalKind =
  | "chowtal"
  | "ullara"
  | "dhamari"
  | "kabir"
  | "lej"
  | "jati"
  | "bhartal"
  | "belwara"
  | "rasiya"
  | "baiswara"
  | "jogira"
  | "folk";

export const CHOWTAL_KIND_LABELS: Record<ChowtalKind, string> = {
  chowtal: "Chowtal",
  ullara: "Ullara",
  dhamari: "Dhamari",
  kabir: "Kabir",
  lej: "Lej",
  jati: "Jati",
  bhartal: "Bhartal",
  belwara: "Belwara",
  rasiya: "Rasiya",
  baiswara: "Baiswara",
  jogira: "Jogira",
  folk: "Folk / Holi songs",
};

/** Display order of kind groups on the index page */
export const CHOWTAL_KIND_ORDER: ChowtalKind[] = [
  "chowtal",
  "ullara",
  "dhamari",
  "kabir",
  "lej",
  "folk",
  "rasiya",
  "bhartal",
  "jati",
  "belwara",
  "baiswara",
  "jogira",
];

export type ChowtalSong = {
  slug: string;
  title: string;
  kind: ChowtalKind;
  /** Lower = earlier / more commonly sung in a Phagwah session */
  order: number;
  /** Short cue for finding the right piece while singing */
  cue?: string;
  roman_lyrics: string;
  /** English meaning (shown as a block under the song) */
  translation?: string;
  /** Optional reference recording (YouTube watch URL) */
  youtube_url?: string;
};

function withTranslation(song: ChowtalSong): ChowtalSong {
  const translation = CHOWTAL_TRANSLATIONS[song.slug];
  return translation ? { ...song, translation } : song;
}

export const CHOWTAL_SONGS: ChowtalSong[] = [
  // —— Session openers ——
  {
    slug: "shiva-shankar-deen-dayal",
    title: "Shiva Shankar deen dayaal",
    kind: "chowtal",
    order: 0,
    cue: "Opening sumiran — Shiva / Mahadev",
    youtube_url: "https://www.youtube.com/watch?v=Qni4jE1hbYE",
    roman_lyrics: `## Opening

Bolo bolo Ayodhya Naath, Siyaavar Ramchandra ki jai!

## Tek

Shiva Shankar deen dayaal maha bardanee
Shiva Shankar deen dayaal maha bardanee

## Pad

Ang bibhooti leehay mrig chhaala
Jata Ganga aur gyaanee
Maathe oonkay tilak chandramaa ho
Jaankay teenee nayan jag jaanee
Maha bardanee

Baahan bail trishool biraajat
Kar naagini lapataanee
Bhang dhatoor bail kee paatee ho
Bhola owra jahar beech saanee
Maha bardanee

Shwet basan gar munda kee maala
Sang may Gauri Bhawaanee
Ling poojaawat damaru bajaawat
Tahaan gaawat bahu bidhi baanee
Maha bardanee

Mahadev dewan ke raajaa
Owra gunnan kee khaanee
Tulsidas charanan par mohit
Tahaan gaal bajaawai surtaanee
Maha bardanee`,
  },
  {
    slug: "devi-sharada-sumiri-manaavo",
    title: "Devi Shaarada sumiri manaavo",
    kind: "chowtal",
    order: 1,
    cue: "Opening sumiran — Sharada",
    roman_lyrics: `## Tek

Devi Shaarada sumiri manaavo
Hriday se jaani

## Pad

Sumiran karo Raam aru Lachiman
Bharat bhuaal bakhaani
Sumiran karo Shri Maatu Jaanaki ho
Tumaho tin lok ki raani
Hriday se jaani

Shiva Shankar bhola ko sumiro
Sumiro Gauri sayaani
Phir se sumiro Ganesh ki murti ho
Ati sundar pandit gyaani
Hriday se jaani

Kari sumiran Anjani ke nandan
Meri araj hamaani
Phir se sumiro Shri Maatu Bhagauti ho
Tum hi ho aadi Bhavaani
Hriday se jaani

Tulsidas sumiran kar gaavat
Sur se aisi baani
Sab devan se aagya leke ho
Baaje dhol manjira aani
Hriday se jaani`,
  },
  {
    slug: "mai-sumiro-sharada-ho-devi",
    title: "Main sumiro Shaarada ho devi",
    kind: "dhamari",
    order: 2,
    cue: "Often follows Sharada chowtal",
    roman_lyrics: `Main sumiro Shaarada ho devi
Sab devan ki moola

Aadi joti Vindhyachal sumiro
Kaali charan sam toola

Asht bhuja aru Hinglaaj ko
Jaako chadhai paan phoola

Chauharaja sukh daayak sumiro
Sheetal charan na bhoola

Sarvroop maharaani charan ko
Sharan gaye kalesh oola`,
  },
  {
    slug: "yahaa-araj-ganesh-gosain",
    title: "Yahaa araj more mahaaraaj Ganesh Gosain",
    kind: "chowtal",
    order: 3,
    cue: "Ganesh — early in session",
    roman_lyrics: `## Tek

Yahaa araj more mahaaraaj
Ganesh Gosain

## Pad

He Shankar ki suvanday nidhi
Budhimaan adhikaai
Gyaani baredin bhajan tum
Tero yash tribhuvan chhaai
Ganesh Gosain

Bramhadik poojan nisivaasar
Charan kamal shir naai
Aath sidhi ro ghar bhitar
Rukh dekhi karat sevakaai
Ganesh Gosain

Ati udaar sansaar maahi tum
Chaari pad arat paai
Tin kar sakal mangal naashat
Jo nar tero gungaai
Ganesh Gosain

Mati ati pangu chadhat giri oopar
Chalatina eka upaai
Dwij chholakan pari charan manaavat
Yahi avsar ho hun sahaai
Ganesh Gosain`,
  },

  // —— Holi / colour songs (very commonly sung) ——
  {
    slug: "taki-maarat-mohan-pichkaari",
    title: "Taki maarat Mohan pichkaari",
    kind: "chowtal",
    order: 4,
    cue: "Classic Holi / pichkari",
    roman_lyrics: `## Tek

Taki maarat Mohan pichkaari
Bhije tan saari

## Pad

Abir gulaal kumkum kesar
Bhare kanak pichkaari
Maarat karat dou chhatiyan par
Lakhi cho! na jaat samhaari
Bhije tan saari

Tab sakhi aagar saagar mati ko
Lalita aadi pukaari
Aagai Radhe sakhiyan linhe
Khoob bhushan saaji sanwaari
Bhije tan saari

Bhar bhar ke kanth tilari
Aur besar adhik sudhaari
Gore badan par agiya raajat
Tan dekhi ke mohe Muraari
Bhije tan saari

Shyaam sakha dao dekh parathain
Madan surati anuhaari
Aa ori lakhi Shyaam lalit chhabi
Jahaan phaag rache Banwaari
Bhije tan saari`,
  },
  {
    slug: "rang-chhirke-kunj-bihari",
    title: "Rang chhirke Kunj Bihari",
    kind: "chowtal",
    order: 5,
    cue: "Holi colours — Kunj Bihari",
    roman_lyrics: `## Tek

Rang chhirke Kunj Bihari
Bhije meri saari

## Pad

Chhirke rang phir jaise bhaura
Aakar khinchat pichkaari
Lalkaarat maarat sab sakhiyan
Vai to kood e ugol majhaari
Bhije meri saari

Dheli no Mohan ko sakhiyan
Har har rang ke gulaari
Jhura bir malat mukhu par
Nakh sikh lalit Banwaari
Bhije meri saari

Khelat phaag madhya sakhiyan ke
Dhe dhe choliya phaari
Rasiya Kaanha malat dou joban
Naya joban dote bigaari
Bhije meri saari

Ha ha karate k nahin maanat
Malat kapol Bihari
Dwij Hari Charan Shyaam ras maate ho
Ras le Vrishbhaanu dulaari
Bhije meri saari`,
  },
  {
    slug: "sakhi-aai-nand-ki-khori",
    title: "Sakhi aai Nand ki khori",
    kind: "chowtal",
    order: 6,
    cue: "Holi in Nand’s lane",
    roman_lyrics: `## Tek

Sakhi aai Nand ki khori
Khele rang hori

## Pad

Naana baran chir sab pahire
Bhushan ang banori
Shyaam sundar sab sakhi sang ki ho
Liye ke sar mragmaad ghori
Khele rang hori

Haathan kanak riye pichkaari
Abir ariyl bhir jhori
Chirkat rang Shyaam Shyaama par
Par maarat nainan rori
Khele rang hori

Auchat aay dhaay Chandravali
Hari bhujaan gahori
Phaagun Dev kahat Braj naari ho
Ab meri daav parori
Khele rang hori

Murali mukut chhor sab lei hen
Motiyan maang marori
Bhagvaan Das chatur Man Mohan
Maano naari roop dharori
Khele rang hori

## Ullara

Nand Nandan khele Brij hori
Gwaal baal sang abir uraave
Sundar bhir ras jhori
Baajat aavat taal pakhaavaj
Git sabe ras bori`,
  },
  {
    slug: "brij-mein-ati-dhoom",
    title: "Brij mein ati dhoom machaayi",
    kind: "chowtal",
    order: 7,
    cue: "Nandji ke laala — Holi dhoom",
    roman_lyrics: `## Tek

Brij mein ati dhoom machaayi
Nandji ke laala

## Pad

Saaje shringaar Radhika
Laadhi nakh sikh sundar bhaala
Aur sakhi sab saaji chale sang
Juli gai jahava sab gwaal
Nandji ke laala

Jitne baaja sang liye hain
Baajate k taala
Ho ho kari hori sab gaavat
Laulaasi lihe Brij baala
Nandji ke laala

Taki taki ghaat sakhiyan par
Maarat bhari bhari rang Gopaala
Le gulaal Hari ko sakhi maarat
Maano Hari he gaye matwaala
Nandji ke laala

Kanehan ke pichke chhulat jyon
Barasat megh karaala
Raam Avtar bhiji tehiaus ar
Sab lakhi sur hota nihaala
Nandji ke laala`,
  },
  {
    slug: "gopi-gopal-khelen-hori",
    title: "Gopi Gopaal khelen hori",
    kind: "lej",
    order: 8,
    cue: "Very popular Holi lej",
    roman_lyrics: `Gopi Gopaal khelen hori

Baajat mrdang murchang
Jang karat aaran baajat jori
Ghanta ghaharaane koli nagaare
Ektaare dhuni ek thori

Aur manjira jhaanjh vina daf
Dholak taan adhik tori
Eke Brij-naari audhat saari
Suha rang se rang bori

Paayan pagu baajen upur chhajen
Kar mundari pahire bhori
Ur bich maala chanchal chaala
Chitavat chit karen chori

Bendi shir sohe sab jag mohe
Rupa salonum iri thori
Chandan mandan jamak jamaaye
Keshar aur gulaab ghori

Kanchan pichakaari hani hani maari
Ek na haare Brij gori
Sang baal anek Gopaal liye
Abir gulaal bhar jhori

Eke mrg naini kokil beni
Dhaave dhamake chamke dauri
Eke chanchal odhe anchal eke
Badan male rori`,
  },
  {
    slug: "phaagun-maas-basant",
    title: "Phaagun maas basant",
    kind: "kabir",
    order: 9,
    cue: "Short kabir — Phagwah season",
    roman_lyrics: `Phaagun maas basant hai
Sab gaavat chowtaal
Daf manjira jhaanjhar mrdang
Haath kartaal

Bhala, Govinda bhajan kar more mana`,
  },
  {
    slug: "ho-ho-hori-hai-rahi",
    title: "Ho ho hori hai rahi",
    kind: "kabir",
    order: 10,
    cue: "Short kabir — Holi",
    roman_lyrics: `Ho ho hori hai rahi
Krishan Raadhika sang
Barsaane ki galin men
Abir uraavat rang

Bhala, Govinda bhajan kar more mana`,
  },
  {
    slug: "kaanha-ron-kona-gail",
    title: "Kaanha ron kona gail",
    kind: "chowtal",
    order: 11,
    cue: "Fetching water — Yamuna",
    roman_lyrics: `## Tek

Kaanha ron kona gail
Hamaari bharan jaao paani

## Pad

Roj baroj bharo Jamuna jal
Chaalu chalo alhi laani
Jaane chaho to jaane paiho
Tum ho almast javaani
Bharan jaao paani

Kab se bhayo Biraj ko lhaakur
Ham tum ko nahin jaani
Der bhai ghar jaane de Mohan
Mohistuni ghar saasu risaani
Bharan jaao paani

Abhir garur jaaro na maanen
Bole ati se baani
Chor baror basat yeh Braj mein ho
Tum rokat naari biraani
Bharan jaao paani

Raanha parosi taanamaaren
Kahen raan ki aani
Dwij Hari Charan sharan sat guruji ke
Sakhi tum asi chatur sayaani
Bharan jaao paani`,
  },

  // —— Deity / Ramayana favourites ——
  {
    slug: "hori-khelat-pawan-kumar",
    title: "Hori khelat Pawan Kumar",
    kind: "chowtal",
    order: 11,
    cue: "Hanuman Holi — Anjani ke laal",
    youtube_url: "https://www.youtube.com/watch?v=mcbJtUbkMo8",
    roman_lyrics: `## Tek

Hori khelat Pawan Kumar
Anjani ke laal

## Pad

Anjani ke avatar liyo
Jab laage soot putaaro
Lok bhaye andhiyaari
Anjani ke laal

## Ullara

Kaun disha se aaye Pawan Sut
Kaun disha se aaye
Kekar putra kekar paayak
Kaun disha se aaye

Anjani ke putra
Raam ji ke paayak
Lakshman kuvar bataaye
Kaun disha se aaye

Kahaan tere Raam
Kahaan tere Lakshman
Kahaan mudrika laaye
Kaun disha se aaye

## Closing

Mahavir Hanumaan Gosain
Anjani ke laal
Mahavir Hanumaan Gosain
Anjani ke laal`,
  },
  {
    slug: "sumiro-hanuman-gosain",
    title: "Sumiro Hanumaan Gosain",
    kind: "chowtal",
    order: 12,
    cue: "Hanuman — with ullara",
    roman_lyrics: `## Tek

Sumiro Hanumaan Gosain
Araj suno meri

## Pad

Araj karo meri garaj nivaaro
Kaathu dukh ke beri
Nishi vaasar sumiro hiy bhitar
Mohi aas charan gati teri
Araj suno meri

Aayo sharan tihare swaami
Har hu dukh sab gheri
Aai ke duri karo dukh paatak
Dushthan hu prabhu ab heri
Araj suno meri

Tum udaar samrath bar niko
Main byaakul hai teri
Daas gohaari karo dukh bhanjana
Meri or karo tum pheri
Araj suno meri

Tulsidas dukh doori kiheu
Hai din o sukh ki dheri
Raam ke dut budhi ke saagar
Sudhi lije tu santan keri
Araj suno meri

## Ullara

Pavan Sut kaun dish se aaye, Pavan Sut
Kekar putra kekar tum paayaka
Kehi tohi kuvar palhaayo, Pavan Sut
Kahaan chhore Raam kahaan chhore Lakshman
Kahaan mudrika paaye, Pavan Sut
Ban chhore Raam, banai chhore Lakshman
Banai mudrika paaye, Pavan Sut`,
  },
  {
    slug: "bhaju-pavan-tanay",
    title: "Bhaju pavan tanay bal dhaam",
    kind: "chowtal",
    order: 13,
    cue: "Hanuman praise",
    roman_lyrics: `## Tek

Bhaju pavan tanay bal dhaam
Gyaan gun raasi

## Pad

Ati shay prabal prataap javan
Sab thaurahi sabha prakaashi
Sur nar muni dhanikarat bimal yash
Us ko Raghunaath upaasi
Gyaan gun raasi

Naak pataal jagat jas jaahir
Par saakit nivaasi
Raghunaayak ki nikat biraajat
Jaanat prabhu keri khavaasi
Gyaan gun araasi

Krt mukut mani maal bhaal bicha
Tilak rekh tum naasi
Subaran shail barantan raajita
Lakhi tum naam udaasi
Gyaan gun araasi

Tum upkaar karat sab hi kar
Kaati jam ke phaasi
Drij chholakan pare charan manaavat
Dije ura sumati hulaasi
Gyaan gun raasi`,
  },
  {
    slug: "lije-kachhu-khabari-avadh-bihari",
    title: "Lije kachhu khabari hamaari ho Avadh Bihari",
    kind: "chowtal",
    order: 14,
    cue: "Ram — Avadh Bihari",
    roman_lyrics: `## Tek

Lije kachhu khabari hamaari ho
Avadh Bihari

## Pad

Tumaho sakal charaachar naayak
Sab laayak hitakaari
Asharan sharan din tabhajan
Ganjan jan aarat bhaari
Ho Avadh Bihari

Gyaan nidhaan sujaan shiromani
Prit karat adhikaari
Taaran taran baran sab dushan
Mahi bhushan garv prahaari
Ho Avadh Bihari

Saahib sakal bal pratipaalak
Dhaalak khal gun jhaari
Din dayaal diya ke saagar
Ati naagar ved pukaari
Ho Avadh Bihari

Pranat kalpa taru yahaa bar dije
Mohi ati din nihaari
Drijachholakan ura ayan rayandin
Karu Raghukul kamal samhaari
Ho Avadh Bihari`,
  },
  {
    slug: "dhanu-tore-hai-ram-gosain",
    title: "Dhanu tore hai Raam Gosain",
    kind: "chowtal",
    order: 15,
    cue: "Breaking Shiva’s bow — Janakpur",
    roman_lyrics: `## Tek

Dhanu tore hai Raam Gosain
Janakpur aai

## Pad

Torav suni Parashuraam ji
Aaye raaja samaajaa
Bhrigu Var kopa kihe bahu bidhi sama
Kina dhanva tori bahaai
Janakpur aai

Sab raaja byaakul bhai bhaari
Janak soch aadhikaari
Byaakul bhai Sita ati dukhit vidhi
Maano bani baat bigraai
Janakpur aai

Bolen bachan Lakhan bhrigu var se
Paani saroruh jori
Bahut dhanush toral hamra aur
Prabhu ka bahun na asa ris laai
Janakpur aai

Bahu prashanottar bhayo Lakhan se
Bhrigu Var gai van maahin
Durga Prasaad dhanush dinhe uni j
Puni Raam Jaanaki paai
Janakpur aai`,
  },
  {
    slug: "siya-raam-naam-din-rain",
    title: "Siya Raama naam din rain",
    kind: "chowtal",
    order: 16,
    cue: "Sita-Ram naam",
    roman_lyrics: `## Tek

Siya Raama naam din rain
Kahat chalo pyaare

## Pad

Ganika Giddha Ajaamil taari
Sevari kinha sukhaari
Dekh hun Dhruv Prahlaad nayan bhaye
Gaj ke jab graah pukaare
Kahat chalo pyaare

Drupad suta ke chir badhaaye
Gaanik suta tan haye
Bhaarat ne barjora machaao
Gunika tere Krishna Muraari
Kahat chalo pyaare

Jab jab gaadh pare bhaktan par
Tab tab Hari avtaare
Kahan lage kar byaan ek mukh
Shaarad nahi paavan paare
Kahat chalo pyaare

Shesh Mahesh Ganesha adi sab
Baranhi baar hi baare
Sundar Braj hi amahi bas bahu
Dasrath sut Raam dulaare
Kahat chalo pyaare`,
  },
  {
    slug: "pati-rakho-bhaktan-hitkaari",
    title: "Pati rakho bhaktan hitkaari",
    kind: "chowtal",
    order: 17,
    cue: "Protect the devotees",
    roman_lyrics: `## Tek

Pati rakho bhaktan hitkaari
Sabha mein hamaari

## Pad

Gaj aru grah lare jal bhitar
Doobat gaj ko ubaari
Narsimha rupa Prahlaad hetu ghar
Harnaakush ko vodra vidaari
Sabha mein hamaari

Indrahi kop kiyo Braj uphar
Prale kaal jal bhaari
Gwaal baal Siri Krishan pukaare ho
Iti athpar girvar Giridhaari
Sabha mein hamaari

Sabha bich Draupadi pat raakhe
Chir Dusaasan haari
Raana risaai vish di no Mira ko
Vish amrit mukh mein daari
Sabha mein hamaari

Jab jab bhir pare bhaktan par
Tab tab prabhu autaari
Pushkar Daas kahat kar jori ho
Mohi pati tane kantaari
Sabha mein hamaari`,
  },
  {
    slug: "aadi-shakti-vandau",
    title: "Aadi shakti vandau tuhai",
    kind: "chowtal",
    order: 18,
    cue: "Devi / Durga / Kali",
    roman_lyrics: `## Tek

Aadi shakti vandau tuhai
Devi namo shir naai

## Pad

Hinglaaj tum janm liyo
Devi Vindhyaa-chal puni jaai
Paalan mein asthaan kiye tum
Puni Jwaala joti kahaai
Namo shir naai

Kalkate mein bahuri baso tum
Devan gaadh chhoraai
Tan biraat Ahiravan mooreu
Tum maaya rup badhaai
Namo shir naai

Palta devi mein vaas kiye tum
Paalat naam dharaai
Gaavon hi gaavon pujaavat devi ho
Tum Kaali naam dharaai
Namo shir naai

Ko kavi varne rup tumhaaro
Kiran joti chhabi chhai
Drij Durga charan shir navat
Var dihu devi harshaai
Namo shir naai`,
  },
  {
    slug: "hansi-bolat-janak-dulaari",
    title: "Hansi bolat Janak dulaari",
    kind: "chowtal",
    order: 19,
    cue: "Sita swayamvar — with ullara",
    roman_lyrics: `## Tek

Hansi bolat Janak dulaari
Suno sakhi pyaari

## Pad

Pita hamaare svayambar lhaanyo
Jule bhoop jahaan bhaari
Jahavaan dhanush rahe Shankarji jo
Main to lhadhi hon kant nihaari
Suno sakhi pyaari

Main apne man soch karathaun
Suni Bhrigu Nandan gaari
Inko koi samjhaavat naahin ho
Baru rahi jaaun vaari kuaari
Suno sakhi pyaari

Main apne pati jaani chalyo
Sakhi vidhi ko likha bichaari
Hoi hain byaah sang Raghubar ji ke
Unake pad prem hamaari
Suno sakhi pyaare

Tore dhanush kant chhan maahi
Vidhi likhani ko taari
Bhaagirathi jamaala lihe kara
Siya Raghubar ke gar daari
Suno sakhi pyaari

## Ullara

Sie daare Raam gal jai maala
Dulahto siri Raam ban hain
Lakshman devar sahbaala
Samdhinto bani maatu Kaushalya
Dasrath samdhi mahipaala
Jinake Shambhu barati aaye
Odhe Digambar mrgachhaala`,
  },
  {
    slug: "ek-aaya-baanar-ashok",
    title: "Ek aaya baanar bhaari Ashok ujaari",
    kind: "chowtal",
    order: 20,
    cue: "Hanuman — Ashok Vatika",
    roman_lyrics: `## Tek

Ek aaya baanar bhaari
Ashok ujaari

## Pad

Phal khaaye nischarko maare
Patak palak mal daari
Daan tan kaan lan laatan maarat
Gahi taang samudra mein daari
Ashok ujaari

Raavan bole Meghnaad se
Sab dal laave sanchaari
Maare vo nahin baandh le aave ho
Kapi dekhi kahaan se bhaari
Ashok ujaari

Le dal Meghnaad tahain pahunche
Kat kalaai kapi bhaari
Meghnaad kapi larat bal
Kapi nischarko de maari
Ashok ujaari

Bare kolaahal bhaye Lanka mein
Naag phaans le daari
Bhairo Prasaad kudi gaye Hanuman
Saari Lanka bhasm kari daari
Ashok ujaari`,
  },

  // —— Kabirs (short, easy to find mid-session) ——
  {
    slug: "are-bhaai-sun-le-more-kabir",
    title: "Are bhaai sun le more kabir",
    kind: "kabir",
    order: 21,
    roman_lyrics: `Are bhaai sun le more kabir
Are bhaai sun le more kabir

Raam Lakshman Bharat Shatrughan
Aur Hanumanta bir
In paanchon ka sumiran karke
Pichhe kahe kabir

Bhala, Govinda bhajan kar more mana`,
  },
  {
    slug: "bindraban-ke-baag-mein",
    title: "Bindraaban ke baag mein bhaura",
    kind: "kabir",
    order: 22,
    roman_lyrics: `Bindraaban ke baag mein
Bhaura kare gujaar
Dulhin pyaari Radhika
Dulha Nand Kumar

Bhala, Govinda bhajan kar more mana`,
  },
  {
    slug: "pavan-tanay-sankat-haran",
    title: "Pavan tanay sankat haran",
    kind: "kabir",
    order: 23,
    cue: "Hanuman kabir",
    roman_lyrics: `Pavan tanay sankat haran
Mangal murti roop
Raam Lakhan Sita sahit
Hriday baso sur bhup

Bhala, jay bolo Mahaabir swaami ki`,
  },
  {
    slug: "chitrakut-ke-ghaat",
    title: "Chitrakut ke ghaat par",
    kind: "kabir",
    order: 24,
    roman_lyrics: `Chitrakut ke ghaat par
Bhayi santan ki bhir
Tulsidas chandan ghise
Tilak det Raghubir

Bhala, Shri Raam bhajan kar more mana`,
  },
  {
    slug: "raam-raam-sab-koi-kahen",
    title: "Raam Raam sab koi kahen",
    kind: "kabir",
    order: 25,
    roman_lyrics: `Raam Raam sab koi kahen
Thag thakur aru chor
Bina prem rijhe nahi
Tulsi Nand Kishor

Bhala, Shri Raam bhajan kar more mana`,
  },
  {
    slug: "chalo-sakhi-tahain-jaaiye",
    title: "Chalo sakhi tahain jaaiye",
    kind: "kabir",
    order: 26,
    roman_lyrics: `Chalo sakhi tahain jaaiye
Jahaan basat Brij raaj
Gaura bechat Hari mil
Ek panth do kaaj

Bhala, Govind bhajan kar more mana`,
  },

  // —— More useful pieces ——
  {
    slug: "shri-krishna-charan-ki-balihari",
    title: "Shri Krishna charan ki balihari",
    kind: "lej",
    order: 27,
    roman_lyrics: `Shri Krishna charan ki balihari

Maathe so chandan atar sugandhan
Jag bandan hain Banwaari
Topi shir sohe sab jag mohe
Mohe rahi Brij ki naari

Surati vishaal nirakhat nihaal
Gopaal Laal ki chhabi nyaari
Kanthe bich hira mukh mein biraaja
Bashiri Giridhaari

Gauvan ke paachhe kachhni kaachhe
Aachhe aavat karat aari
Shri mor mukut pitaambar sohe
Tirchhi chitvan ati pyaari

Aise prabhu taniya bare chikaniya
Paayan ghunghar jhanakaari
Motinke maala odhe dushaala
Nand Laal ki chhabi bhaari

Tehi chhan chadhe kadam ke oopar
Sab sakhiyan ko de gaari
Kar sava bilasat baans ke-murli
Tehi mein chhed bane chaari

Jab olhan par kahar kiye hai
Mohi rahi Brij ki gwaari
Ras ki khel kiye Brij bhitar
Asuran ekan ko maari`,
  },
  {
    slug: "sumiro-raam-anand-hrdai",
    title: "Sumiro Raamanand hrday",
    kind: "dhamari",
    order: 28,
    roman_lyrics: `Sumiro Raamanand hrday bhari

Avadh puri shri dhaam
Jahaan janm liye Shri Raam
Sarayu bahat jal naar
Dukh paap na rahe shariri

Santan ki bhakti pyaari
Tahain oethr hrday bichaari
Jahaan tahain santan ka dera
Mein tahain tahain prabhu hera

Hiranakusha ko maare
Prahlad hi kinhu baare
Mare Kaurav sau bhaiya
Tab Lanka ko kinh a chadhaya

Utre saagar tira ati
Baandhe setu gambhira
Taapas sen utaare
Sab nishichar laai sanhaare

Lanka pati ko maare
Dev tanti bandi chhuraaye
Raajya Vibhishaan ko dinha
Tab utaari gavan Hari kinh

Raaja Janak ki baari
Gautam ki naari pyaari
Paayan parat jajaraa hori
Gaave daas Kabir`,
  },
  {
    slug: "brij-karat-bihari-shyaam",
    title: "Brij karat Bihari Shyaam",
    kind: "belwara",
    order: 29,
    roman_lyrics: `Brij karat Bihari Shyaam
Radhika dono jane

Aanand sur pur baaje
Tabla dhundhun kaar
Kan kan kar baaje gati
Baaje sitaar

Bhari bhari jhori abir
Kesharibhari thaar
Aisi kich machaave Brij
Hoi andhiyaar

Baaje dhol manjira
Auro karataar
Ta bich naachen gopi
Kahari taahi manchaar

Gopi sabhe mili gaaven
Brij hoi gulajaar
Sur Shyaam ho swaami
Ab laavhu paar`,
  },
  {
    slug: "mohan-mohi-jaai-de-jamuna",
    title: "Mohan mohi jaai de Jamuna paani",
    kind: "dhamari",
    order: 30,
    cue: "Fetching water — short",
    roman_lyrics: `Mohan mohi jaai de Jamuna paani
Shir par gharagharapar jhaari
Taapar abharan bhaari

Hathva chuni gulel lagaaye
Gaagar mein hane nishaani
Jaahi bade tum roko toko
Saumaram ham jaani`,
  },
  {
    slug: "akeli-paniyana-jaihon",
    title: "Akeli paniyana jaihon",
    kind: "baiswara",
    order: 31,
    roman_lyrics: `Akeli paniyana jaihon
Sang leho Nand ke Laal

Kuwan paani mein na gai ho
Kuwan mein kaala naag

Kaala naag se main bachi aayo
Apne piya ki bhaag

Kaala paani mein na piyo re
Kaala mirchi na khaaun
Kaala marda ki sej na suto
Main kaali hoi jaun`,
  },
  {
    slug: "hori-khelat-janak-dulaari",
    title: "Hori khelat Janaka dulaari",
    kind: "chowtal",
    order: 32,
    cue: "Triveni — Sita plays Holi",
    roman_lyrics: `## Tek

Hori khelat Janaka dulaari
Haath pichakaari

## Pad

Roop kay thaara gulaab bharay hai
Kanchan kay pichkaari
Goray badan neelam bhara sohat
Jahaa aataran kay adhikaari

Pitambar kay kahane kaanche
Sirmay mukut sambaare
Bharat Lakshman ranga banaawat
Jahaa aataran kay adhikaari

Jaako bedha veda nahi paawat
Shesha Sharadha haari
Lakshman sangh phiray mahalan bheech
Koi laysaki ranga mukha maari

Galiyan galiyan dhoom machee hai
Phaag kalai nar naari
Bhagwan dass kahat kar jori kay
Hari charanan ki bali haari

## Ullara

Bal bije sakhiyo cheera awadhe
Hori khele Raghubeera
Raam ke haathe dholak bal sohe
Bharat Shatruhan lai bisha kaarie
Maachi phaago doe dalki bijhe
Tulsidas holse prematoor
Lakshman haathe majeera
Sita ghori rang neera
Khelat Sarju teera`,
  },
  {
    slug: "jai-jai-ho-ganesh-hamaare",
    title: "Jai jai ho Ganesh hamaare",
    kind: "chowtal",
    order: 33,
    cue: "Triveni — Ganesh opener",
    roman_lyrics: `## Tek

Jai jai ho Ganesh hamaare
Mahesh kay baaray

## Pad

Lambodhar Gowri sutra tuma ho
Bhaktana kay hita kaari
Ake dant tumhee ko kahawat
Mukh deer gajadhar kay dharay
Mahesh

Tayhee mahimaa bade anaa jaanay
Kaa ginati hai hamaray
Sab dewan may shrishti tumhee ho
Sab tum charan shir dharey
Mahesh

Ham aado nar kutil hai kaamee
Nahi bhakti hai bhi charey
Awaa goona maaph karo prabhu mooray
Sab tour bharey hita kaari
Mahesh

Tumharay bal par kaaj kaaray sab
Aaj kalama kaar dharey
Param ham kaar joi manawat
Prabhu aasa lage hai tumhaaray
Mahesh

## Ullara

Lambodhar suta jai jai Ganesha
Lambodhar suta jai jai Ganesha
Ganesh ji ki mangal kari
Lambodhar suta jai jai ho`,
  },
  {
    slug: "sadaa-anandan-rahe-yaha-dwaare",
    title: "Sadaa anandan rahe yaha dwaare",
    kind: "folk",
    order: 34,
    cue: "House visit blessing / Holi",
    roman_lyrics: `Sadaa anandan rahe yaha dwaare
Mohan khele hori ho

Jeeye gawaiyaa jiye bajawaiyaa
Jeeye gawa ke log ho

Baris baris par phagoon aayay
Mohan khelay hori ho

Desh desh kay bhoopati aayay
Mohan khelay hori ho`,
  },
  {
    slug: "holi-aaye-re-kanhaayi",
    title: "Holi aaye re kanhaayi",
    kind: "folk",
    order: 35,
    roman_lyrics: `Holi aaye re kanhaayi
Holi aayi re

Holi aaye re kanhaayi
Ranga chalke sunade zara baasuri
Holi aayi re aayi re holi aayi re

Barse gullal rang more anganawaa
Apne hi rang me rang de mohe sajanawaa
Tohe kaaran ghar se aaye kaaran ho
Nikalke sunade zara

Chhoote na rang aise rang de chunariya
Dhobaniyaa doy chaahe saaree umariyaa
Mohe bhaayee na harajaaye rang halke`,
  },
  {
    slug: "bhal-sakhiyan-ke-biche-radhe",
    title: "Bhal sakhiyan ke biche Radhe",
    kind: "bhartal",
    order: 36,
    roman_lyrics: `Bhal sakhiyan ke biche Radhe
Albeli vari haan

Sakhi das aage sakhi das pichhe
Lachkataave akeli, vari haan

Kau sakhi linhe pan kar bira
Kau linhen phul chameli, vari haan

Taahi samay prabhu aani milyo tahain
Phaagu saaji dou kheli, vari haan

Machi dhamaari Shyaam ras ke vash
Mohit sakal saheli, vari haan`,
  },
  {
    slug: "jogira-aadha-roti",
    title: "Aadha roti dher — Jogira",
    kind: "jogira",
    order: 37,
    cue: "Comic jogira",
    roman_lyrics: `Aadha roti dher karela
Sab jogi mil khaaya
Aadhi raat ko jaar laage
Baap baap chilaaya

Baaja baaje baag mein
Bajaanevaala kaun?
Dharti Maata so gaye
Jagaanevaala kaun?

Gaon gaon mein baag bagicha
Gali gali phulvaari
Ghar ghar dekho kovanaariyal
Ghar hi thakur baari`,
  },
];

export function getChowtalSong(slug: string): ChowtalSong | null {
  const song = CHOWTAL_SONGS.find((s) => s.slug === slug);
  return song ? withTranslation(song) : null;
}

export function getChowtalSorted(): ChowtalSong[] {
  return [...CHOWTAL_SONGS]
    .sort((a, b) => a.order - b.order || a.title.localeCompare(b.title))
    .map(withTranslation);
}

export function getChowtalGrouped(): {
  kind: ChowtalKind;
  label: string;
  songs: ChowtalSong[];
}[] {
  const byKind = new Map<ChowtalKind, ChowtalSong[]>();
  for (const song of getChowtalSorted()) {
    const list = byKind.get(song.kind) ?? [];
    list.push(song);
    byKind.set(song.kind, list);
  }
  return CHOWTAL_KIND_ORDER.filter((k) => byKind.has(k)).map((kind) => ({
    kind,
    label: CHOWTAL_KIND_LABELS[kind],
    songs: byKind.get(kind)!,
  }));
}

export function neighborsInChowtal(slug: string): {
  prev: ChowtalSong | null;
  next: ChowtalSong | null;
  current: ChowtalSong | null;
} {
  const all = getChowtalSorted();
  const index = all.findIndex((s) => s.slug === slug);
  if (index < 0) return { prev: null, next: null, current: null };
  return {
    current: all[index],
    prev: index > 0 ? all[index - 1] : null,
    next: index < all.length - 1 ? all[index + 1] : null,
  };
}
