import type { Bhajan } from "@/lib/types";

export type BhajanContent = Partial<
  Pick<
    Bhajan,
    | "title"
    | "alternate_title"
    | "audio_url"
    | "artist_version"
    | "roman_lyrics"
    | "devanagari_lyrics"
    | "translation"
    | "meaning"
    | "display_order"
  >
> & {
  /** Small list-card image */
  thumbnail_url?: string | null;
  /** Player cover only (detail page) — not shown on list cards */
  cover_url?: string | null;
  /** Corner mini-player art (falls back to cover_url / thumbnail) */
  mini_cover_url?: string | null;
  /** Player frame shape — square for 1:1 album art */
  player_cover_aspect?: "wide" | "square";
  /** Optional YouTube link kept alongside local MP3/video */
  youtube_url?: string | null;
  /** Optional local clip / video shown on the song page alongside audio */
  video_url?: string | null;
  /** Poster for video_url */
  video_poster_url?: string | null;
  /** Short credit under the song-page video clip */
  video_credit?: string | null;
  /** Category slugs (matched against DB categories) for local-only entries */
  category_slugs?: string[];
};

/**
 * Local content for known satsang versions.
 * Overrides DB fields when present, and can surface a bhajan
 * even before it has been inserted into Supabase.
 *
 * Multiple versions of the same hymn (e.g. Hanuman Chalisa) use
 * title + artist in the slug: hanuman-chalisa-<artist-slug>,
 * plus a tempo/style suffix when needed (e.g. -slow).
 */
const HANUMAN_CHALISA_CATEGORY_SLUGS = [
  "hanuman",
  "ram",
  "general",
  "satsang",
  "hanuman-jayanti",
  "evening-prayer",
  "morning-prayer",
  "chalisa",
  "devotion",
  "protection",
  "wisdom",
  "hindi",
];

const HANUMAN_CHALISA_ROMAN = `## Dohas

Shri Guru Charan Saroj Raj, Nij Manu Mukur Sudhari
Barnaun Raghuvar Bimal Jasu, Jo Dayaku Phal Chari

Buddhiheen Tanu Janike, Sumirau Pavan Kumar
Bal Buddhi Vidya Dehu Mohi, Harahu Kalesh Vikaar

## Chaupais

Jai Hanuman Gyan Gun Sagar
Jai Kapis Tihun Lok Ujagar

Ramdoot Atulit Bal Dhama
Anjani Putra Pavan Sut Nama

Mahavir Vikram Bajrangi
Kumati Nivar Sumati Ke Sangi

Kanchan Baran Biraj Subesa
Kanan Kundal Kunchit Kesa

Haath Bajra Aur Dhvaja Biraje
Kaandhe Moonj Janeu Saje

Shankar Suvan Kesari Nandan
Tej Pratap Maha Jag Bandan

Vidyavan Guni Ati Chatur
Ram Kaj Karibe Ko Atur

Prabhu Charitra Sunibe Ko Rasiya
Ram Lakhan Sita Man Basiya

Sukshma Roop Dhari Siyahin Dikhawa
Vikat Roop Dhari Lanka Jarawa

Bhim Roop Dhari Asur Sanhare
Ramchandra Ke Kaj Sanware

Laye Sanjivan Lakhan Jiyaye
Shri Raghuvir Harashi Ur Laye

Raghupati Kinhi Bahut Badai
Tum Mama Priya Bharat Hi Sam Bhai

Sahas Badan Tumharo Jas Gaaven
As Kahi Shripati Kanth Lagaaven

Sankadik Brahmadi Munisa
Narad Sarad Sahit Aheesa

Yam Kuber Digpal Jahan Te
Kavi Kovid Kahi Sake Kahan Te

Tum Upkar Sugrivahi Keenha
Ram Milaye Rajpad Deenha

Tumharo Mantra Vibhishan Mana
Lankeshwar Bhaye Sab Jag Jana

Yug Sahastra Yojan Par Bhanu
Leelyo Tahi Madhur Phal Janu

Prabhu Mudrika Meli Mukh Mahi
Jaladhi Langhi Gaye Acharaj Nahi

Durgam Kaj Jagat Ke Jete
Sugam Anugraha Tumhare Tete

Ram Duare Tum Rakhware
Hot Na Aagya Bin Paisare

Sab Sukh Lahai Tumhari Sarna
Tum Rakshak Kahu Ko Darna

Aapan Tej Samharo Aapai
Teenon Lok Hank Te Kanpai

Bhoot Pisach Nikat Nahi Aavai
Mahavir Jab Naam Sunavai

Nase Rog Harai Sab Peera
Japat Nirantar Hanumat Beera

Sankat Te Hanuman Chhudavai
Man Kram Bachan Dhyan Jo Lavai

Sab Par Ram Tapasvi Raja
Tin Ke Kaj Sakal Tum Saja

Aur Manorath Jo Koi Lavai
Soi Amit Jivan Phal Pavai

Charo Yug Partap Tumhara
Hai Parasiddha Jagat Ujiyara

Sadhu Sant Ke Tum Rakhware
Asur Nikandan Ram Dulare

Ashta Siddhi Nau Nidhi Ke Data
As Bar Din Janki Mata

Ram Rasayan Tumhare Pasa
Sada Raho Raghupati Ke Dasa

Tumhare Bhajan Ram Ko Pavai
Janam Janam Ke Dukh Bisravai

Antkaal Raghuvar Pur Jayi
Jahan Janma Hari Bhakt Kahayi

Aur Devata Chitt Na Dharayi
Hanumat Sei Sarva Sukh Karayi

Sankat Kate Mite Sab Peera
Jo Sumirai Hanumat Balbeera

Jai Jai Jai Hanuman Gosain
Kripa Karahu Gurudev Ki Nain

Jo Sat Baar Path Kar Koi
Chhutehi Bandi Maha Sukh Hoyi

Jo Yeh Padhe Hanuman Chalisa
Hoye Siddhi Sakhi Gaurisa

Tulsidas Sada Hari Chera
Keejai Nath Hriday Mah Dera

## Closing Doha

Pavan Tanay Sankat Haran, Mangal Murti Roop
Ram Lakhan Sita Sahit, Hriday Basahu Sur Bhoop`;

const HANUMAN_CHALISA_TRANSLATION = `## Dohas

With the dust of my Guru's lotus feet, I clean the mirror of my mind
and narrate the pure glory of Shri Ram, giver of life's four fruits.

Knowing myself as lacking in wisdom, I remember the Son of the Wind.
Grant me strength, wisdom and knowledge, and remove my afflictions.

## Chaupais

Glory to Hanuman, ocean of wisdom and virtue
Glory to the Lord of monkeys, enlightener of the three worlds

You are Ram's messenger, abode of unmatched strength
Anjani's son, known as Pavan Putra

O Mahavir, brave Bajrangbali
Dispeller of evil thought, companion of good wisdom

Golden-hued, splendidly dressed
With earrings and curly hair

Thunderbolt and flag shine in your hands
The sacred thread adorns your shoulder

Offspring of Shankar, Kesari's delight
Your glory is worshipped throughout the world

Wise, virtuous and most clever
Eager always to serve Ram's work

You delight in hearing the Lord's deeds
Ram, Lakshman and Sita dwell in your heart

In subtle form you appeared before Sita
In fierce form you burned Lanka

In mighty form you destroyed the demons
And fulfilled Shri Ramchandra's tasks

You brought the Sanjivani and revived Lakshman
Shri Raghuvir held you joyfully to his heart

Raghupati praised you greatly
"You are as dear to me as Bharat"

A thousand mouths sing your glory
So saying, the Lord of Shri embraced you

Sages, Brahma and the great munis
Narad, Saraswati and Shesha

Yama, Kubera and the guardians of directions
Even the greatest poets cannot fully praise you

You helped Sugriva
United him with Ram and restored his kingdom

Vibhishan heeded your counsel
And became lord of Lanka, known to all the world

The sun, thousands of yojanas away
You swallowed it, thinking it a sweet fruit

Holding the Lord's ring in your mouth
You crossed the ocean — no wonder

All hard tasks of the world
Become easy by your grace

You guard Ram's doorway
None enters without your leave

All joy is found in your refuge
With you as protector, who need fear?

You alone can restrain your radiance
The three worlds tremble at your roar

Ghosts and spirits dare not come near
When your mighty name is heard

Disease and pain are destroyed
By constant remembrance of brave Hanuman

Hanuman removes every crisis
Of those who remember him in thought, word and deed

Ram, the ascetic king, reigns over all
And you accomplish all his works

Whatever wish one brings to you
That person receives the eternal fruit of life

Your glory shines through the four ages
Famous and radiant throughout the world

You protect saints and sages
Destroyer of demons, beloved of Ram

Giver of eight siddhis and nine treasures
So Mother Janaki granted you

You hold the nectar of Ram's name
Always remain the servant of Raghupati

Through your worship one attains Ram
And forgets the sorrows of many births

At life's end one goes to Ram's city
And is born again as a devotee of Hari

Need not hold other deities in mind
Serving Hanuman brings every joy

Troubles end and all pain is removed
For those who remember mighty Hanuman

Glory, glory, glory to Hanuman Gosain
Bless us with a Guru's compassionate glance

Whoever recites this a hundred times
Is freed from bondage and finds great joy

Whoever reads this Hanuman Chalisa
Attains perfection — Lord Shiva himself is witness

Tulsidas, ever Hari's servant, prays
O Lord, make your home within my heart

## Closing Doha

Son of the Wind, remover of distress, embodiment of auspicious form
Dwell in my heart with Ram, Lakshman and Sita, O King of the gods`;

const HOLI_KHELE_ROMAN = `## Chorus

Hori khele Raghuveera
Avadh mein hori khele Raghuveera
Haan hilmil aave log lugaai
Bhai mahlan mein bheera
Avadh mein hori khele Raghuveera

## Verse 1

Taal se taal mile more babua
Baje dhol mridang
Man se man ka mel jo ho to
Rang se mil jaaye rang

Hori khele Raghuveera
Avadh mein hori khele Raghuveera

## Verse 2

Tanik sharm nahi aaye
Dekhe nahi apni umariya
Saath baras mein ishq ladaye
Mukhde pe rang lagaye
Bada rangeela saanwariya
Chunari pe daale abeer
Avadh mein hori khele Raghuveera`;

const HOLI_KHELE_TRANSLATION = `## Chorus

Raghuveera plays Holi
In Awadh, Raghuveera plays Holi
Men and women come mixing together
The palaces are packed
In Awadh, Raghuveera plays Holi

## Verse 1

Rhythm meets rhythm, my child
The dhol and mridang sound
When heart meets heart
Colour mixes with colour

Raghuveera plays Holi
In Awadh, Raghuveera plays Holi

## Verse 2

They feel no shame
They do not look at their age
At sixty they still play at love
They put colour on the face
The dark one is so full of colour
He throws abeer on the chunari
In Awadh, Raghuveera plays Holi`;

const HOLI_RE_ROMAN = `## Chorus

Holi re holi, rangon ki doli
Aayi tere ghar pe maston ki toli
Mukh na chhupa o rani, saamne aa
Holi re holi, rangon ki doli
Aayi tere ghar pe maston ki toli
Mukh na chhupa o raja, saamne aa

## Verse 1

Jaan na pehchaan, are main tera mehman
Kaahe mari pichkari tune beiman
Fagun ki bahaar, ek sharmili naar
Nahi samjhe re pyaar ki boli

Holi re holi, rangon ki doli
Aayi tere ghar pe maston ki toli

## Verse 2

Phenkun main gulal ke daalun rang laal
Aage aage Radha daure peechhe Nandlal
Kaahe kare tang, main na khelun tere sang
Bheega mera ang ang, bheegi choli

Holi re holi, rangon ki doli
Aayi tere ghar pe maston ki toli`;

const HOLI_RE_TRANSLATION = `## Chorus

Holi, Holi — a palanquin of colours
A crowd of revelers has come to your house
Do not hide your face, O queen — come forward
Holi, Holi — a palanquin of colours
A crowd of revelers has come to your house
Do not hide your face, O king — come forward

## Verse 1

You do not know me — I am your guest
Why did you spray the pichkari, you rogue
It is the spring of Phagun, a shy maiden
Does not understand the language of love

Holi, Holi — a palanquin of colours
A crowd of revelers has come to your house

## Verse 2

I throw gulal and pour red colour
Radha runs ahead, Nandlal runs behind
Why do you tease — I will not play with you
Every limb is soaked, the choli is wet

Holi, Holi — a palanquin of colours
A crowd of revelers has come to your house`;

const ANG_SE_ANGA_ROMAN = `## Chorus

Ang se ang lagana sajan
Humein aise rang lagana
Gaalon se yeh gaal laga ke
Naino se yeh nain mila ke
Holi aaj manana sajan
Humein aise rang lagana

## Verse 1

Are jo jee mein aaye
Tum aaj kar lo
Chaho jise in baahon mein bhar lo
Ang se ang lagana sajan
Humein aise rang lagana

## Verse 2

Upar upar rang lagaiyo
Na kariyo kuchh neeche
Moh se kuch na bol
Khadi reh chupse akhiyaan meeche
Ang se ang lagana sajan
Humein aise rang lagana`;

const ANG_SE_ANGA_TRANSLATION = `## Chorus

Press body to body, beloved
Colour me in just that way
Cheek against cheek
Eyes meeting eyes
Celebrate Holi today, beloved
Colour me in just that way

## Verse 1

Whatever your heart desires
Do it today
Whoever you wish, take into these arms
Press body to body, beloved
Colour me in just that way

## Verse 2

Put colour only on top
Do not do anything below
Do not speak to me
I stand quiet, eyes closed
Press body to body, beloved
Colour me in just that way`;

const SAAT_RANG_ROMAN = `## Chorus

Saat rang mein khel rahi hain
Dil waalon ki toli re
Bheege daaman choli re
Are apne hi rang mein rang le mujhko
Yaad rahegi Holi re

## Verse 1

Laal gulaabi neele peele
Rang hain duniya waalon ke
Pyaar ke rang mein doob gaye dil
Dekho ham matwaalon ke
Are ujla mukhda dekh ke tera
Rang ude hain ujaalon ke

Saat rang mein khel rahi hain
Dil waalon ki toli re

## Verse 2

Aanda hai ik baar saal wich
Phaagun da maheena
Naha ke rang mein nikhar gayi hai
Aaj hai ritu haseena
Are is mausam mein jo na bheege
Kya hai uska jeena

Saat rang mein khel rahi hain
Dil waalon ki toli re`;

const SAAT_RANG_TRANSLATION = `## Chorus

They are playing in seven colours
A band of open-hearted people
The hem and the choli are wet
Colour me in your own colour
This Holi will be remembered

## Verse 1

Red, pink, blue, yellow
These are the colours of the world
Hearts have drowned in the colour of love
Look at us, the intoxicated ones
Seeing your bright face
Even the colours of light fly away

They are playing in seven colours
A band of open-hearted people

## Verse 2

It comes once in the year
The month of Phagun
Washed in colour, she has blossomed
Today the season is beautiful
Anyone who does not get wet in this weather —
What kind of life is that?

They are playing in seven colours
A band of open-hearted people`;

const AAJ_NA_CHODDENGE_ROMAN = `## Chorus

Aaj na chhodenge bas humjoli
Khelenge hum Holi
Chahe bheege teri chunariya
Chahe bheege re choli
Khelenge hum Holi
Holi hai

## Verse 1

Apni apni kismat hai ye
Koi hanse, koi roye
Rang se koi ang bhigoye re
Koi asuwan se nain bhigoye
Rehne do ye bahana
Kya karega zamana
Tum ho kitni bholi
Khelenge hum Holi

## Verse 2

Aise naata tod gaye hain
Mujhse ye sukh saare
Jaise jalti aag kisi ban mein
Chhod gaye banjaare
Dukh hai ik chingari
Bhar ke ye pichkari
Aayi maston ki toli
Khelenge hum Holi`;

const AAJ_NA_CHODDENGE_TRANSLATION = `## Chorus

Today we will not let you go, companion
We will play Holi
Even if your chunari gets wet
Even if your choli gets wet
We will play Holi
It is Holi

## Verse 1

This is each one’s fate
Some laugh, some cry
Some soak the body in colour
Some soak the eyes with tears
Leave this excuse
What can the world do
You are so innocent
We will play Holi

## Verse 2

They have broken the bond like this
All those joys have left me
Like a burning fire left in a forest
By wandering banjaras
Sorrow is a spark
Fill this pichkari
The band of revelers has come
We will play Holi`;

const HOLI_KI_DIN_ROMAN = `## Chorus

Holi ke din dil khil jaate hain
Rangon mein rang mil jaate hain
Gile shikwe bhool ke doston
Dushman bhi gale mil jaate hain

## Verse 1

Gori tere rang jaisa
Thoda sa main rang bana loon
Aa tere gulabi gaalon se
Thoda sa gulaal chura loon
Ja re ja deewane tu
Holi ke bahane tu
Chhed na mujhe besharam
Pooch le zamane se
Aise hi bahane se
Liye aur diye dil jaate hain

Holi ke din dil khil jaate hain
Rangon mein rang mil jaate hain

## Verse 2

Yahi teri marzi hai to
Achha chal tu khush ho le
Paas aa ke chhuna na mujhe
Chahe mujhe door se bhigo le
Heere ki kani hai tu
Matti se bani hai tu
Chhune se toot jaayegi
Kaanton ke chhune se phoolon se
Naazuk naazuk badan chhil jaate hain

Holi ke din dil khil jaate hain
Rangon mein rang mil jaate hain`;

const HOLI_KI_DIN_TRANSLATION = `## Chorus

On Holi day hearts blossom
Colour mixes into colour
Forgetting complaints, friends
Even enemies embrace

## Verse 1

Fair one, a colour like yours
Let me make a little of that colour
Come, from your rosy cheeks
Let me steal a little gulaal
Go, you mad one
On the excuse of Holi
Do not tease me, shameless one
Ask the world
On just such excuses
Hearts are taken and given

On Holi day hearts blossom
Colour mixes into colour

## Verse 2

If that is your wish
Fine — be happy
Do not come close and touch me
Soak me from far away if you like
You are a shard of diamond
You are made of earth
You will break if touched
From the touch of thorns, from flowers
Delicate bodies get scraped

On Holi day hearts blossom
Colour mixes into colour`;

const HOLIYA_AAYE_ROMAN = `## Chorus

Holi aayi re Kanhai
Holi aayi re
Rang chhalke
Suna de zara bansuri
Holi aayi re Kanhai
Rang chhalke
Suna de zara bansuri

## Verse 1

Barse gulaal rang more aanganwa
Apne hi rang mein rang de mohe sajanwa
Ho dekho naache mora manwa
Tore kaaran ghar se aayi hun nikal ke
Suna de zara bansuri

Holi aayi re Kanhai
Rang chhalke

## Verse 2

Chhute na rang aisi rang de chunariya
Dhobaniya dhoye chahe saari umariya
Ho man ko rang dega saanwariya
Mohe bhaaye na harjai
Suna de zara bansuri

Holi aayi re Kanhai
Rang chhalke`;

const HOLIYA_AAYE_TRANSLATION = `## Chorus

Holi has come, O Kanhai
Holi has come
Colour is overflowing
Play the flute a little
Holi has come, O Kanhai
Colour is overflowing
Play the flute a little

## Verse 1

Gulaal rains colour in my courtyard
Colour me in your own colour, my beloved
Look — my heart is dancing
For you I have come out of the house
Play the flute a little

Holi has come, O Kanhai
Colour is overflowing

## Verse 2

Colour the chunari so the colour never leaves
Even if the washerwoman washes it a whole lifetime
The dark one will colour the heart
I do not like the unfaithful one
Play the flute a little

Holi has come, O Kanhai
Colour is overflowing`;

const MARO_BICHKAAR_ROMAN = `## Chorus

Maro bhar bharke pichkari
Holi ka matlab hai
Rang ek rang duniya saari
Holi ka yahi matlab hai
Maro bhar bharke pichkari

## Verse 1

Baras baras bhaag aati hai Holi
Aaj na karwa bolo
Humne man ke mail ko dhoya
Tum bhi krodh ko dholo

Maro bhar bharke pichkari
Holi ka yahi matlab hai

## Verse 2

Aaj ke din yu ghul mil jao
Rahe na koi naya purana
Aaj na pichhla, aaj na naya
Bhare pyaar ki saja dhari

Holi ka yahi matlab hai
Maro bhar bharke pichkari`;

const MARO_BICHKAAR_TRANSLATION = `## Chorus

Spray the pichkari full
This is the meaning of Holi
One colour for the whole world
This is the meaning of Holi
Spray the pichkari full

## Verse 1

Year after year Holi comes as fortune
Today do not speak of quarrel
We have washed the dirt of the mind
You too wash away anger

Spray the pichkari full
This is the meaning of Holi

## Verse 2

Today melt and mix together
Let no one stay new or old
Today no past, today no new
Love is the only ornament worn

This is the meaning of Holi
Spray the pichkari full`;

const HOLI_AAI_RE_ROMAN = `## Chorus

O Holi aayi, Holi aayi
Dekho Holi aayi re
Khelo khelo rang hai
Koi apne sang hai
Bheega bheega ang hai
O Holi aayi, Holi aayi
Dekho Holi aayi re

## Verse 1

Behki behki chaal hai
Chehra neela laal hai
Deewane kya haal hai
Maston par hai masti chhaayi
Dekho Holi aayi re

## Verse 2

Jo laaye rang jeewan mein
Use Holi mein paaya hai
Bataaun kya tumhe yaaron
Kise maine bulaaya hai
Ya mat bula, ya bata dil ki baatein
Na chhupa duniya se chori hai kya
Yeh ladki hai ya kaali maayi
Dekho Holi aayi re`;

const HOLI_AAI_RE_TRANSLATION = `## Chorus

O Holi has come, Holi has come
Look — Holi has come
Play, play — there is colour
Someone is with you
The body is soaked
O Holi has come, Holi has come
Look — Holi has come

## Verse 1

The walk is unsteady
The face is blue and red
What state are the mad ones in
Revelry has settled on the intoxicated
Look — Holi has come

## Verse 2

Whoever brought colour into life
Has been found in Holi
Shall I tell you, friends
Whom I have called
Either do not call, or tell the heart’s talk
Do not hide — is there a secret from the world
Is this a girl or Kali Mai
Look — Holi has come`;

const LETS_PLAY_HOLI_ROMAN = `## Mix · Chorus

Let's play Holi
Rang barse bhige chunar wali rang barse
Holi ke din dil khil jaate hain
Rangon mein rang mil jaate hain
Hori khele Raghuveera
Avadh mein hori khele Raghuveera
Holi hai`;

const LETS_PLAY_HOLI_TRANSLATION = `## Mix · Chorus

Let's play Holi
Colour rains — the woman in the wet chunar, colour rains
On Holi day hearts blossom
Colour mixes into colour
Raghuveera plays Holi
In Awadh, Raghuveera plays Holi
It is Holi`;

const HOLIYA_UDE_ROMAN = `## Chorus

Holiya mein ude re gulal
Kahiyo re mangetar se
Holiya mein ude re gulal
Kahiyo re mangetar se

## Verse 1

Mhari ye mangetar chudla wali
Ghadiya walo re nawab
Kahiyo re mangetar se

Holiya mein ude re gulal
Kahiyo re mangetar se

## Verse 2

Mhari ye mangetar nathni wali
Moochya walo re nawab
Kahiyo re mangetar se

Holiya mein ude re gulal
Kahiyo re mangetar se

## Verse 3

Mhari ye mangetar paayal wali
Dhotya walo re nawab
Kahiyo re mangetar se

Holiya mein ude re gulal
Kahiyo re mangetar se`;

const HOLIYA_UDE_TRANSLATION = `## Chorus

Gulal flies in Holi
Tell the betrothed
Gulal flies in Holi
Tell the betrothed

## Verse 1

This is my betrothed, the one with bangles
The nawab with the watches
Tell the betrothed

Gulal flies in Holi
Tell the betrothed

## Verse 2

This is my betrothed, the one with the nose-ring
The nawab with the moustache
Tell the betrothed

Gulal flies in Holi
Tell the betrothed

## Verse 3

This is my betrothed, the one with anklets
The nawab in the dhoti
Tell the betrothed

Gulal flies in Holi
Tell the betrothed`;

const OM_JAI_JAGDISH_CATEGORY_SLUGS = [
  "vishnu",
  "general",
  "satsang",
  "aarti",
  "evening-prayer",
  "bhajan",
  "devotion",
  "hindi",
];

const OM_JAI_JAGDISH_ROMAN = `## Chorus

Om Jai Jagadish Hare
Swami Jai Jagadish Hare
Bhakt jano ke sankat
Daas jano ke sankat
Kshan men door kare
Om Jai Jagadish Hare

## Verse 1

Jo dhyaave phal paave
Dukh bin se man kaa
Swami dukh bin se man kaa
Sukh sampati ghar aave
Sukh sampati ghar aave
Kasht mite tan kaa
Om Jai Jagadish Hare

## Verse 2

Maat pita tum mere
Sharan kahoon kiski
Swami sharan kahoon kiski
Tum bin aur na dooja
Tum bin aur na dooja
Aas karoon jiski
Om Jai Jagadish Hare

## Verse 3

Tum pooran Paramatma
Tum Antaryami
Swami tum Antaryami
Paar Brahm Parameshwar
Paar Brahm Parameshwar
Tum sabke Swami
Om Jai Jagadish Hare

## Verse 4

Tum karuna ke saagar
Tum paalan karta
Swami tum paalan karta
Main moorakh khal-khami
Main sevak tum Swami
Kripa karo Bharta
Om Jai Jagadish Hare

## Verse 5

Vishay vikaar mitaao
Paap haro Deva
Swami paap haro Deva
Shraddha bhakti badhao
Shraddha bhakti badhao
Santan ki seva
Om Jai Jagadish Hare

## Verse 6

Tan man dhan sab kuchh hai tera
Sab kuchh hai tera
Swami sab kuchh hai tera
Tera tujhko arpan
Tera tujhko arpan
Kya laage mera
Om Jai Jagadish Hare

## Closing

Om Jai Jagadish Hare
Swami Jai Jagadish Hare
Bhakt jano ke sankat
Bhakt jano ke sankat
Kshan men door kare
Om Jai Jagadish Hare`;

const OM_JAI_JAGDISH_TRANSLATION = `## Chorus

Glory to the Lord of the Universe
O Master, glory to the Lord of the Universe
The troubles of Your devotees
The troubles of Your servants
You remove in a moment
Glory to the Lord of the Universe

## Verse 1

Whoever meditates on You gains the fruit
The mind becomes free of sorrow
O Master, the mind becomes free of sorrow
Happiness and prosperity enter the home
Happiness and prosperity enter the home
Bodily affliction is removed
Glory to the Lord of the Universe

## Verse 2

You are my mother and father
In whom else can I take refuge?
O Master, in whom else can I take refuge?
Besides You there is no other
Besides You there is no other
In whom I can place my hope
Glory to the Lord of the Universe

## Verse 3

You are the complete Supreme Soul
You are the Inner Witness
O Master, You are the Inner Witness
You are the Absolute, the Supreme Lord
You are the Absolute, the Supreme Lord
You are Master of all
Glory to the Lord of the Universe

## Verse 4

You are an ocean of compassion
You are the Sustainer
O Master, You are the Sustainer
I am foolish and full of faults
I am the servant, You are the Master
Have mercy, O Lord
Glory to the Lord of the Universe

## Verse 5

Remove worldly passions and faults
Take away sin, O God
O Master, take away sin, O God
Increase faith and devotion
Increase faith and devotion
And service to the holy
Glory to the Lord of the Universe

## Verse 6

Body, mind, and wealth — all is Yours
Everything is Yours
O Master, everything is Yours
What is Yours, I offer back to You
What is Yours, I offer back to You
What of it was ever mine?
Glory to the Lord of the Universe

## Closing

Glory to the Lord of the Universe
O Master, glory to the Lord of the Universe
The troubles of Your devotees
The troubles of Your devotees
You remove in a moment
Glory to the Lord of the Universe`;

const OM_JAI_JAGDISH_MEANING =
  "Universal Vishnu aarti (Om Jai Jagadish Hare) — praise of the Lord of the Universe who removes devotees’ troubles in a moment, grants peace and prosperity, and receives body, mind, and wealth as offering.";

const OM_JAI_LAKSHMI_CATEGORY_SLUGS = [
  "lakshmi",
  "diwali",
  "general",
  "satsang",
  "aarti",
  "bhajan",
  "devotion",
  "hindi",
];

const OM_JAI_LAKSHMI_ROMAN = `## Chorus

Om Jai Lakshmi Mata
Maiya Jai Lakshmi Mata
Tumko nishdin sevat
Tumko nishdin sevat
Hari Vishnu Vidhata
Om Jai Lakshmi Mata

## Verse 1

Uma Rama Brahmani, tum hi jag-mata
Maiya tum hi jag-mata
Surya-chandrama dhyavat
Surya-chandrama dhyavat
Narad rishi gata
Om Jai Lakshmi Mata

## Verse 2

Durga roop Niranjani, sukh sampati data
Maiya sukh sampati data
Jo koi tumko dhyavata
Jo koi tumko dhyavata
Riddhi-siddhi pata
Om Jai Lakshmi Mata

## Verse 3

Tum patal-nivasini, tum hi shubh-data
Maiya tum hi shubh-data
Karma-prabhav-prakashini
Karma-prabhav-prakashini
Bhav-nidhi ki trata
Om Jai Lakshmi Mata

## Verse 4

Jis ghar mein tum rahti, sab sadgun aata
Maiya sab sadgun aata
Sab sambhav ho jata
Sab sambhav ho jata
Man nahin ghabrata
Om Jai Lakshmi Mata

## Verse 5

Tum bin yagya na hove, vastra na ho pata
Maiya vastra na ho pata
Khan-pana ka vaibhav
Khan-pana ka vaibhav
Sab tumse aata
Om Jai Lakshmi Mata

## Verse 6

Shubh-gun mandir sundar, kshirodadhi-jata
Maiya kshirodadhi-jata
Ratan chaturdash tum bin
Ratan chaturdash tum bin
Koi nahin pata
Om Jai Lakshmi Mata

## Verse 7

Shri Lakshmi ji ki aarti, jo koi nar gata
Maiya jo koi nar gata
Ur anand samata
Ur anand samata
Paap utar jata
Om Jai Lakshmi Mata

## Closing

Om Jai Lakshmi Mata
Maiya Jai Lakshmi Mata
Tumko nishdin sevat
Tumko nishdin sevat
Hari Vishnu Vidhata
Om Jai Lakshmi Mata`;

const OM_JAI_LAKSHMI_TRANSLATION = `## Chorus

Om, victory to Mother Lakshmi
Mother, victory to Mother Lakshmi
Day and night You are served
Day and night You are served
By Hari Vishnu Vidhata
Om, victory to Mother Lakshmi

## Verse 1

You are Uma, Rama, and Brahmani — mother of the world
Mother, you alone are mother of the world
Sun and moon meditate on you
Sun and moon meditate on you
Narad the sage sings
Om, victory to Mother Lakshmi

## Verse 2

In Durga’s pure form you give joy and prosperity
Mother, giver of joy and prosperity
Whoever meditates on you
Whoever meditates on you
Gains success and spiritual powers
Om, victory to Mother Lakshmi

## Verse 3

You dwell in the nether realms; you give auspicious gifts
Mother, you alone give auspicious gifts
You illuminate the fruit of karma
You illuminate the fruit of karma
You rescue from the ocean of worldly life
Om, victory to Mother Lakshmi

## Verse 4

In the home where you stay, all virtues come
Mother, all virtues come
Everything becomes possible
Everything becomes possible
The mind does not fear
Om, victory to Mother Lakshmi

## Verse 5

Without you no yagya is complete; clothing is not found
Mother, clothing is not found
The abundance of food and drink
The abundance of food and drink
All comes from you
Om, victory to Mother Lakshmi

## Verse 6

Beautiful temple of virtues, born of the milk-ocean
Mother, born of the milk-ocean
Without you the fourteen jewels
Without you the fourteen jewels
No one finds
Om, victory to Mother Lakshmi

## Verse 7

Whoever sings Mother Lakshmi’s aarti
Mother, whoever among people sings
Joy fills the heart
Joy fills the heart
And sins are washed away
Om, victory to Mother Lakshmi

## Closing

Om, victory to Mother Lakshmi
Mother, victory to Mother Lakshmi
Day and night You are served
Day and night You are served
By Hari Vishnu Vidhata
Om, victory to Mother Lakshmi`;

const OM_JAI_LAKSHMI_MEANING =
  "Classic Lakshmi aarti (Om Jai Lakshmi Mata) — praise of Mother Lakshmi, consort of Vishnu, source of virtue, wealth, and auspiciousness.";

const NAHI_CHAHIYE_RANG_MAHAL_ROMAN = `## Chorus

nahi chahiye rang mahal na dhan daulat ki shan
hum to mange tujhse malik ek santosh ka daan
ki ghar ghar me khushhali ho sada sukh ki haryali ho
nahi chahiye rang mahal na dhan daulat ki shan
hum to mange tujhse malik ek santosh ka daan

## Verse 1

tune humko janam diya hai tu hi palanhar
teri daya se fule fale hum sab ka ghar sansar
tune humko janam diya hai tu hi palanhar
teri daya se phule phale hum sab ka ghar sansar
nahi chahiye hire moti

## Verse 2

nahi chahiye hire moti nahi ratano ke haar
hum to mange tujhse malik ek santosh ka daan

## Verse 3

sukh ke badale dukh dene ki ager bhawana teri
dukh ko sahne ki shakti de yahi prarthana meri
sukh ke badale dukh dene ki ager bhawana teri
dukh ko sahne ki shakti de yahi prarthana meri
kisi ke age hath na failaye
apni mahnat ka sukh paye itna de vardan
hum to mange tujhse malik ek santosh ka daan
ki ghar ghar me khushhali ho sada sukh ki haryali ho
nahi chahiye rang mahal na dhan daulat ki shan
hum to mange tujhse malik ek santosh ka daan`;

const NAHI_CHAHIYE_RANG_MAHAL_DEVANAGARI = `## Chorus

नहीं चाहिये रंग महल ना धन दौलत की शान
हम तो मांगे तुझसे मालिक एक संतोष का दान
की घर घर में खुशहाली हो सदा सुख की हरयाली हो
नहीं चाहिये रंग महल ना धन दौलत की शान
हम तो मांगे तुझसे मालिक एक संतोष का दान

## Verse 1

तूने हमको जनम दिया है तू ही पालनहार
तेरी दया से फूले फलें हम सब का घर संसार
तूने हमको जनम दिया है तू ही पालनहार
तेरी दया से फूले फलें हम सब का घर संसार
नहीं चाहिये हीरे मोती

## Verse 2

नहीं चाहिये हीरे मोती नहीं रत्नों के हार
हम तो मांगे तुझसे मालिक एक संतोष का दान

## Verse 3

सुख के बदले दुःख देने की अगर भावना तेरी
दुःख को सहने की शक्ति दे यही प्रार्थना मेरी
सुख के बदले दुःख देने की अगर भावना तेरी
दुःख को सहने की शक्ति दे यही प्रार्थना मेरी
किसी के आगे हाथ ना फैलाये
अपनी मेहनत का सुख पाये इतना दे वरदान
हम तो मांगे तुझसे मालिक एक संतोष का दान
की घर घर में खुशहाली हो सदा सुख की हरयाली हो
नहीं चाहिये रंग महल ना धन दौलत की शान
हम तो मांगे तुझसे मालिक एक संतोष का दान`;

const NAHI_CHAHIYE_RANG_MAHAL_TRANSLATION = `## Chorus

I do not want a coloured palace, nor the glory of wealth
From you, Master, I ask only the gift of contentment
May every home be happy, may joy stay green forever
I do not want a coloured palace, nor the glory of wealth
From you, Master, I ask only the gift of contentment

## Verse 1

You gave us birth, you alone sustain us
By your grace may every home in the world flower and bear fruit
You gave us birth, you alone sustain us
By your grace may every home in the world flower and bear fruit
I do not want diamonds and pearls

## Verse 2

I do not want diamonds and pearls, nor a necklace of gems
From you, Master, I ask only the gift of contentment

## Verse 3

If it is your wish to give sorrow in place of joy
Give the strength to bear that sorrow — this is my prayer
If it is your wish to give sorrow in place of joy
Give the strength to bear that sorrow — this is my prayer
May I not hold out my hand before anyone
Grant this blessing: joy from the work of my own hands
From you, Master, I ask only the gift of contentment
May every home be happy, may joy stay green forever
I do not want a coloured palace, nor the glory of wealth
From you, Master, I ask only the gift of contentment`;

export const BHAJAN_CONTENT: Record<string, BhajanContent> = {
  "payo-ji-mere-ram-ratan-dhan-payo": {
    title: "Ram Ratan",
    alternate_title: "(Payoji mere Ram Ratan dhan Payo)",
    audio_url: "/audio/albums/yaad-sangeet-harry-panday/02-ram-ratan.mp3",
    video_url: "/videos/payo-ji-mere-ram-ratan-dhan-payo.mp4",
    video_poster_url: "/images/gauri-madhurie-ram-ratan-poster.jpg",
    video_credit:
      "Gauri Madhurie teaching at Trivani Mandir — the Guyanese version of the bhajan, as sung by her dad in Guyana.",
    cover_url: "/images/albums/yaad-sangeet-player-art.png",
    thumbnail_url: "/images/albums/yaad-sangeet-library.png",
    artist_version: "Harry Panday",
    display_order: 41,
    category_slugs: [
      "ram",
      "general",
      "satsang",
      "ram-navami",
      "evening-prayer",
      "bhajan",
      "devotion",
      "gratitude",
      "hindi",
      "suitable-for-funerals",
    ],
    meaning:
      "Harry Panday (Yaad Sangeet). Mirabai’s Ram ratan — the greatest wealth is devotion to Ram, given by the True Guru. Video: Gauri Madhurie teaching at Trivani Mandir, the Guyanese version of the bhajan as sung by her dad in Guyana.",
    roman_lyrics: `Ram ratan dhan payo
Guruji mere Ram ratan dhan payo

Vastu amolik di mere Satguru
Kripa kari apanayo
Guruji mere Ram ratan dhan payo

Janam janam ki punji payi
Jag mein sabhi khovayo
Guruji mere Ram ratan dhan payo

Kharch na khute, chor na lute
Din din badhat savayo
Guruji mere Ram ratan dhan payo

Sat ki naav khevatiya Satguru
Bhavsagar tar ayo
Guruji mere Ram ratan dhan payo

Mira ke Prabhu Giridhar Nagar
Harakh harakh jas gayo
Guruji mere Ram ratan dhan payo

Kripa kari apanayo
Guruji mere Ram ratan dhan payo
Ram ratan dhan payo
Guruji mere Ram ratan dhan payo`,
    devanagari_lyrics: `à¤°à¤¾à¤® à¤°à¤¤à¤¨ à¤§à¤¨ à¤ªà¤¾à¤¯à¥‹
à¤—à¥à¤°à¥à¤œà¥€ à¤®à¥‡à¤°à¥‡ à¤°à¤¾à¤® à¤°à¤¤à¤¨ à¤§à¤¨ à¤ªà¤¾à¤¯à¥‹

à¤µà¤¸à¥à¤¤à¥ à¤…à¤®à¥‹à¤²à¤¿à¤• à¤¦à¥€ à¤®à¥‡à¤°à¥‡ à¤¸à¤¤à¤—à¥à¤°à¥
à¤•à¥ƒà¤ªà¤¾ à¤•à¤°à¥€ à¤…à¤ªà¤¨à¤¾à¤¯à¥‹
à¤—à¥à¤°à¥à¤œà¥€ à¤®à¥‡à¤°à¥‡ à¤°à¤¾à¤® à¤°à¤¤à¤¨ à¤§à¤¨ à¤ªà¤¾à¤¯à¥‹

à¤œà¤¨à¤® à¤œà¤¨à¤® à¤•à¥€ à¤ªà¥‚à¤‚à¤œà¥€ à¤ªà¤¾à¤¯à¥€
à¤œà¤— à¤®à¥‡à¤‚ à¤¸à¤­à¥€ à¤–à¥‹à¤µà¤¾à¤¯à¥‹
à¤—à¥à¤°à¥à¤œà¥€ à¤®à¥‡à¤°à¥‡ à¤°à¤¾à¤® à¤°à¤¤à¤¨ à¤§à¤¨ à¤ªà¤¾à¤¯à¥‹

à¤–à¤°à¥à¤š à¤¨ à¤–à¥‚à¤Ÿà¥‡, à¤šà¥‹à¤° à¤¨ à¤²à¥‚à¤Ÿà¥‡
à¤¦à¤¿à¤¨ à¤¦à¤¿à¤¨ à¤¬à¤¢à¤¼à¤¤ à¤¸à¤µà¤¾à¤¯à¥‹
à¤—à¥à¤°à¥à¤œà¥€ à¤®à¥‡à¤°à¥‡ à¤°à¤¾à¤® à¤°à¤¤à¤¨ à¤§à¤¨ à¤ªà¤¾à¤¯à¥‹

à¤¸à¤¤ à¤•à¥€ à¤¨à¤¾à¤µ à¤–à¥‡à¤µà¤Ÿà¤¿à¤¯à¤¾ à¤¸à¤¤à¤—à¥à¤°à¥
à¤­à¤µà¤¸à¤¾à¤—à¤° à¤¤à¤° à¤†à¤¯à¥‹
à¤—à¥à¤°à¥à¤œà¥€ à¤®à¥‡à¤°à¥‡ à¤°à¤¾à¤® à¤°à¤¤à¤¨ à¤§à¤¨ à¤ªà¤¾à¤¯à¥‹

à¤®à¥€à¤°à¤¾ à¤•à¥‡ à¤ªà¥à¤°à¤­à¥ à¤—à¤¿à¤°à¤¿à¤§à¤° à¤¨à¤¾à¤—à¤°
à¤¹à¤°à¤– à¤¹à¤°à¤– à¤œà¤¸ à¤—à¤¾à¤¯à¥‹
à¤—à¥à¤°à¥à¤œà¥€ à¤®à¥‡à¤°à¥‡ à¤°à¤¾à¤® à¤°à¤¤à¤¨ à¤§à¤¨ à¤ªà¤¾à¤¯à¥‹

à¤•à¥ƒà¤ªà¤¾ à¤•à¤°à¥€ à¤…à¤ªà¤¨à¤¾à¤¯à¥‹
à¤—à¥à¤°à¥à¤œà¥€ à¤®à¥‡à¤°à¥‡ à¤°à¤¾à¤® à¤°à¤¤à¤¨ à¤§à¤¨ à¤ªà¤¾à¤¯à¥‹
à¤°à¤¾à¤® à¤°à¤¤à¤¨ à¤§à¤¨ à¤ªà¤¾à¤¯à¥‹
à¤—à¥à¤°à¥à¤œà¥€ à¤®à¥‡à¤°à¥‡ à¤°à¤¾à¤® à¤°à¤¤à¤¨ à¤§à¤¨ à¤ªà¤¾à¤¯à¥‹`,
    translation: `I have received the priceless treasure of Lord Ram.
O my Guru, I have received the priceless treasure of Lord Ram.

My True Guru gave me this priceless treasure.
Through His grace He accepted me as His own.
O my Guru, I have received the priceless treasure of Lord Ram.

I have obtained the spiritual wealth of many lifetimes.
While the world loses itself chasing temporary riches.
O my Guru, I have received the priceless treasure of Lord Ram.

This treasure never runs out when shared; no thief can steal it.
And it continues to grow every day.
O my Guru, I have received the priceless treasure of Lord Ram.

My True Guru is the boatman of the boat of Truth.
Through Him I have crossed the ocean of worldly existence.
O my Guru, I have received the priceless treasure of Lord Ram.

Mira's Lord is Giridhar Nagar.
She sings His praise with joy.
O my Guru, I have received the priceless treasure of Lord Ram.

Through His grace He accepted me as His own.
O my Guru, I have received the priceless treasure of Lord Ram.
I have received the priceless treasure of Lord Ram.
O my Guru, I have received the priceless treasure of Lord Ram.`,
  },
  "he-prabhu-anand-data": {
    title: "He Prabhu Anand Data",
    audio_url: "/audio/albums/yaad-sangeet-harry-panday/03-hay-prabhu.mp3",
    cover_url: "/images/albums/yaad-sangeet-player-art.png",
    thumbnail_url: "/images/albums/yaad-sangeet-library.png",
    artist_version: "Harry Panday",
    alternate_title:
      "He Prabhu Anand Data Gyan Humko · Gyan Hamko Dijiye · Hay Prabhu · Yaad Sangeet",
    display_order: 42,
    category_slugs: [
      "general",
      "satsang",
      "morning-prayer",
      "evening-prayer",
      "memorial",
      "prarthana",
      "peace",
      "wisdom",
      "devotion",
      "hindi",
      "suitable-for-funerals",
    ],
    meaning:
      "Harry Panday's Yaad Sangeet prayer He Prabhu Anand Data — asking Paramatma for wisdom, virtue, service to guru and motherland, and a divine life free of envy and falsehood.",
    roman_lyrics: `## Opening

Om Bhur Bhuvah Swaha
Tat Savitur Varenyam
Bhargo Devasya Dhimahi
Dhiyo Yo Nah Prachodayat

## Chorus

He Prabhu Anand Data, gyan hamko dijiye
Shighra sare durguno ko, door hamse kijiye

## Verses

Lijiye hamko sharan mein, ham sada chari bane
Brahmachari dharma rakshak, vir vrat dhari bane
He Prabhu Anand Data, gyan hamko dijiye

Ninda kisi ki ham kisi se, bhool kar bhi na kare
Irshya kabhi bhi ham kisi se, bhool kar bhi na kare
He Prabhu Anand Data, gyan hamko dijiye

Satya bole, jhooth tyage, mel aapas mein kare
Divya jivan ho hamara, tere yash gaya kare
He Prabhu Anand Data, gyan hamko dijiye

Jay hamari ayu he Prabhu, lok ke upkar mein
Haath dale ham kabhi na, bhool kar apkar mein
He Prabhu Anand Data, gyan hamko dijiye

Matribhumi matriseva, ho adhik pyari hame
Desh mein seva mile nij, desh hithakari bane
He Prabhu Anand Data, gyan hamko dijiye

Kijiye ham par kripa, aisi he Paramatma
Moh mad matsar rahit hove hamari atma
He Prabhu Anand Data, gyan hamko dijiye

Prem se ham guru jano ki, nitya hi seva kare
Prem se ham dukhijano ki, nitya hi seva kare
He Prabhu Anand Data, gyan hamko dijiye`,
    translation: `## Opening

We meditate on the divine light of the Creator who pervades earth, sky and heaven
The most worthy, radiant Lord
May that light illuminate our intellect
And guide our thoughts on the right path

## Chorus

O Lord, giver of bliss, grant us wisdom
Quickly take away from us all vices that make life difficult

## Verses

Take us into Your shelter; may we always live virtuously
Peace-makers, protectors of dharma, brave and faithful to our vows
O Lord, giver of bliss, grant us wisdom

May we never speak ill of anyone, even by mistake
And never be jealous of anyone, even by mistake
O Lord, giver of bliss, grant us wisdom

Help us speak truth, give up falsehood, and live in harmony
Make our lives divine, and always sing of Your glory
O Lord, giver of bliss, grant us wisdom

May our life be spent, O Lord, in the service of the world
And may we never lift a hand, even by mistake, toward harm
O Lord, giver of bliss, grant us wisdom

Help us love and serve our motherland above all
And fulfill our duty as well-wishers of our country
O Lord, giver of bliss, grant us wisdom

Bestow such mercy on us, O Paramatma
That attachment, pride and envy leave our soul
O Lord, giver of bliss, grant us wisdom

With love may we always serve our gurus
With love may we always serve those who suffer
O Lord, giver of bliss, grant us wisdom`,
  },
  "aaj-andhay-ray-harry-panday": {
    title: "Aaj Andhay Ray",
    alternate_title: "Aaj Andhere Mein Hai Hum Insaan · Yaad Sangeet",
    artist_version: "Harry Panday",
    audio_url: "/audio/albums/yaad-sangeet-harry-panday/01-aaj-andhay-ray.mp3",
    cover_url: "/images/albums/yaad-sangeet-player-art.png",
    thumbnail_url: "/images/albums/yaad-sangeet-library.png",
    display_order: 40,
    category_slugs: ["general", "satsang", "bhajan", "devotion", "hindi"],
    meaning:
      "Harry Panday's Yaad Sangeet rendition of Aaj Andhere Mein Hai Hum Insaan — a prayer for the sun of wisdom to light the darkness of ignorance.",
    roman_lyrics: `## Chorus

Aaj andhere mein hai hum insaan
Gyan ka suraj chamka de Bhagwan
Aaj andhere mein hai hum insaan
Gyan ka suraj chamka de Bhagwan

## Verses

Bhatak rahe hum raah dikha de
Bhagwan raah dikha de
Bhatak rahe hum raah dikha de
Bhagwan raah dikha de
Kadam kadam par kiran bichha de
Bhagwan kiran bichha de
In akhiyan ko Prabhu kara de
Jyoti se pahchaan

Aaj andhere mein hai hum insaan
Gyan ka suraj chamka de Bhagwan

Hum to hai santaan tihaari
Prabhu santaan tihaari
Hum to hai santaan tihaari
Prabhu santaan tihaari
Teri daya ke hum adhikaari
Prabhu hai hum adhikaari
Duniya hove sukhi hamaari
Aisa de vardaan

Aaj andhere mein hai hum insaan
Gyan ka suraj chamka de Bhagwan`,
    translation: `## Chorus

Today we humans are in darkness
O God, kindle the sun of wisdom
Today we humans are in darkness
O God, kindle the sun of wisdom

## Verses

We are wandering — show us the path
O God, show us the path
We are wandering — show us the path
O God, show us the path
Lay a ray of light at every step
O God, lay that ray of light
O Lord, make these eyes
Know You through that light

Today we humans are in darkness
O God, kindle the sun of wisdom

We are Your children
O Lord, we are Your children
We are Your children
O Lord, we are Your children
We are rightful of Your mercy
O Lord, we are rightful of it
May our world be happy
Grant us such a blessing

Today we humans are in darkness
O God, kindle the sun of wisdom`,
  },
  "bandow-charan-harry-panday": {
    title: "Bandow Charan",
    alternate_title: "Bandau Charan Kamal Raghunandan · Yaad Sangeet",
    artist_version: "Harry Panday",
    audio_url: "/audio/albums/yaad-sangeet-harry-panday/04-bandow-charan.mp3",
    cover_url: "/images/albums/yaad-sangeet-player-art.png",
    thumbnail_url: "/images/albums/yaad-sangeet-library.png",
    display_order: 43,
    category_slugs: [
      "ram",
      "sita",
      "general",
      "satsang",
      "ram-navami",
      "evening-prayer",
      "bhajan",
      "devotion",
      "hindi",
    ],
    meaning:
      "Harry Panday's Yaad Sangeet rendition of Bandow Charana Kamal Ragunandan — devotion to the lotus feet of Raghunandan.",
    roman_lyrics: `Bandow charana kamal Ragunandan

Jina ki kripaa sakal sukha sampati
Paawana jana bhaktana ura chandana

Awadha puri prabhu nitya biraajata
Janaka sutaa yuta dushta nikandana

Teena taapa aru janama marana bhayo
Door karata chhina may jana ranjana

Bhakta namata charan may Bhagavana
Kripaa kariya sevak bhaya bhanjana

Bandow charana kamal Ragunandan`,
    translation: `I worship the lotus feet of Shri Raghunandan.

By His divine grace comes all bliss and prosperity.
Like sandalwood, His grace rests on the hearts of pure devotees.

The Lord forever dwells in Ayodhya.
With Janaka's daughter He destroys the wicked.

He removes the three afflictions and the fear of birth and death
in a moment, delighting His devotees.

Devotees bow at the Lord's feet.
Have mercy, O destroyer of the servant's fear.

I worship the lotus feet of Shri Raghunandan.`,
  },
  "jai-ganesh-harry-panday": {
    title: "Jai Ganesh",
    alternate_title: "Jai Ganesh Jai Ganesh Deva · Yaad Sangeet",
    artist_version: "Harry Panday",
    audio_url: "/audio/albums/yaad-sangeet-harry-panday/05-jai-ganesh.mp3",
    cover_url: "/images/albums/yaad-sangeet-player-art.png",
    thumbnail_url: "/images/albums/yaad-sangeet-library.png",
    display_order: 44,
    category_slugs: ["ganesh", "general", "satsang", "aarti", "bhajan", "devotion", "hindi"],
    meaning:
      "Harry Panday's Yaad Sangeet rendition of the Ganesh aarti — Jai Ganesh Jai Ganesh Deva.",
    roman_lyrics: `## Refrain

Jai Ganesh, Jai Ganesh, Jai Ganesh Deva
Mata jaki Parvati, Pita Mahadeva

## Verses

Ek dant dayavant, char bhuja dhari
Mathe par sindoor sohe, muse ki sawari
Jai Ganesh, Jai Ganesh, Jai Ganesh Deva
Mata jaki Parvati, Pita Mahadeva

Paan chadhe, phool chadhe, aur chadhe mewa
Ladduan ka bhog lage, sant kare seva
Jai Ganesh, Jai Ganesh, Jai Ganesh Deva
Mata jaki Parvati, Pita Mahadeva

Andhan ko aankh det, kodhin ko kaya
Banjhan ko putra det, nirdhan ko maya
Jai Ganesh, Jai Ganesh, Jai Ganesh Deva
Mata jaki Parvati, Pita Mahadeva

Deenan ki laaj rakho, Shambhu sut vari
Kamna ko pura karo, jaun balihari
Jai Ganesh, Jai Ganesh, Jai Ganesh Deva
Mata jaki Parvati, Pita Mahadeva`,
    translation: `## Refrain

Glory to Ganesh, glory to Ganesh, glory to Lord Ganesh
Whose mother is Parvati, whose father is Mahadev

## Verses

One-tusked, compassionate, bearing four arms
Sindoor shines on his forehead; the mouse is his mount
Glory to Ganesh, glory to Ganesh, glory to Lord Ganesh
Whose mother is Parvati, whose father is Mahadev

Betel, flowers and dry fruits are offered
Laddus are offered as bhog; saints serve him
Glory to Ganesh, glory to Ganesh, glory to Lord Ganesh
Whose mother is Parvati, whose father is Mahadev

You give sight to the blind and a body to the afflicted
A son to the childless, and wealth to the poor
Glory to Ganesh, glory to Ganesh, glory to Lord Ganesh
Whose mother is Parvati, whose father is Mahadev

Protect the honour of the humble, O son of Shambhu
Fulfill our wishes; I offer myself to you
Glory to Ganesh, glory to Ganesh, glory to Lord Ganesh
Whose mother is Parvati, whose father is Mahadev`,
  },
  "rakh-laaj-harry-panday": {
    title: "Rakh Laaj",
    alternate_title: "Rakh Laaj Meri Sindoor Ki · Yaad Sangeet",
    artist_version: "Harry Panday",
    audio_url: "/audio/albums/yaad-sangeet-harry-panday/06-rakh-laaj.mp3",
    cover_url: "/images/albums/yaad-sangeet-player-art.png",
    thumbnail_url: "/images/albums/yaad-sangeet-library.png",
    display_order: 45,
    category_slugs: [
      "shiva",
      "general",
      "satsang",
      "bhajan",
      "devotion",
      "hindi",
    ],
    meaning:
      "Harry Panday's Yaad Sangeet rendition of Rakh Laaj Meri Sindoor Ki — a prayer to Gaura Parvati to protect a woman's honour and dignity.",
    roman_lyrics: `## Chorus

Rakh laaj meri sindoor ki, Gaura Parvati
Rakh laaj meri sindoor ki
Shiv Shankar ki pyari, Gaura Parvati
Mohe ek tera hi aasra
Tu hi taranhari, Gaura Parvati
Rakh laaj meri sindoor ki

## Verses

Hari Har ka man harne wali
Tu satiyon mein maha sati
Tujhsa kiska tap hai jispe
Dol gaye Kailashpati
Main dukhiyari hoon, main dukhiyari
Sab kuch hari, aayi sharan tihari
Gaura Parvati
Rakh laaj meri sindoor ki
Shiv Shankar ki pyari, Gaura Parvati
Rakh laaj meri sindoor ki

Aanchal mein tum dard chhipaye
Seeche jeevan ki kyari
Kya dukh sahne ko hi janmi
Janam jali Bharat nari
Ghayal ki gat ho, ghayal ki gat
Ghayal jaane, nari na dukh nari
Gaura Parvati
Rakh laaj meri sindoor ki
Shiv Shankar ki pyari, Gaura Parvati
Mohe ek tera hi aasra
Tu hi taranhari, Gaura Parvati
Rakh laaj meri sindoor ki`,
    translation: `## Chorus

Protect the honour of my sindoor, O Gaura Parvati
Protect the honour of my sindoor
Beloved of Shiv Shankar, O Gaura Parvati
You alone are my refuge
You alone are my saviour, O Gaura Parvati
Protect the honour of my sindoor

## Verses

You who steal the heart of Hari and Har
Among sati women you are the greatest sati
Whose tapa is like yours, that
Even the Lord of Kailash was moved
I am sorrowful, I am sorrowful
I have lost all; I come to your refuge
O Gaura Parvati
Protect the honour of my sindoor
Beloved of Shiv Shankar, O Gaura Parvati
Protect the honour of my sindoor

In your aanchal you hide pain
And water the garden of life
Was I born only to endure sorrow
O burned life of the Bharat woman
Only the wounded know the state of the wounded
Woman knows woman's sorrow
O Gaura Parvati
Protect the honour of my sindoor
Beloved of Shiv Shankar, O Gaura Parvati
You alone are my refuge
You alone are my saviour, O Gaura Parvati
Protect the honour of my sindoor`,
  },
  "sree-ram-harry-panday": {
    title: "Shree Ram",
    alternate_title: "Yaad Sangeet · Track 7",
    artist_version: "Harry Panday",
    audio_url: "/audio/albums/yaad-sangeet-harry-panday/07-sree-ram.mp3",
    cover_url: "/images/albums/yaad-sangeet-player-art.png",
    thumbnail_url: "/images/albums/yaad-sangeet-library.png",
    display_order: 46,
    category_slugs: ["ram", "general", "satsang", "bhajan", "devotion", "hindi"],
    meaning:
      "From Harry Panday's Yaad Sangeet (Mohabir Records). Lyrics not transcribed yet — play the track to listen.",
    roman_lyrics: "[Album track]",
  },
  "ab-soup-deeva-harry-panday": {
    title: "Ab Soup Deeva",
    alternate_title: "Ab Saup Diya Is Jeevan Ka · Yaad Sangeet",
    artist_version: "Harry Panday",
    audio_url: "/audio/albums/yaad-sangeet-harry-panday/08-ab-soup-deeva.mp3",
    cover_url: "/images/albums/yaad-sangeet-player-art.png",
    thumbnail_url: "/images/albums/yaad-sangeet-library.png",
    display_order: 47,
    category_slugs: ["general", "satsang", "bhajan", "devotion", "hindi"],
    meaning:
      "Harry Panday's Yaad Sangeet prayer of surrender — the whole burden of this life is placed in God's hands: victory and defeat, love, deeds, and the last breath.",
    roman_lyrics: `## Chorus

Ab saup diya is jeevan ka sab bhar tumhare haatho mein
Hai jeet tumhare haatho mein aur haar tumhare haatho mein

## Verse 1

Mera nishchay bas ek yahi ek baar tumhe mai pa jaaun
Ek baar tumhe mai pa jaaun
Arpan kar du duniya bhar ka sab pyar tumhare haatho mein

Ab saup diya is jeevan ka sab bhar tumhare haatho mein
Hai jeet tumhare haatho mein aur haar tumhare haatho mein

## Verse 2

Jo jag mein rahun to aise rahu jo jal mein kamal ka fool rahe
Jo jal mein kamal ka fool rahe
Mere gun dosh samrpit ho bhagwan tumhare haatho mein

Ab saup diya is jeevan ka sab bhar tumhare haatho mein
Hai jeet tumhare haatho mein aur haar tumhare haatho mein

## Verse 3

Yadi maanus ka mujhe janma mile tab charno ka mai pujai banu
Tab charno ka mai pujai banu
Is pujag ki ek ek nas ka sab taar tumhare haatho mein

Ab saup diya is jeevan ka sab bhar tumhare haatho mein
Hai jeet tumhare haatho mein aur haar tumhare haatho mein

## Verse 4

Jab jab sansar ka kaidi banu nishkam bhav se karm karoon
Nishkam bhav se karm karoon
Fir ant samay mein pran taju nirakar tumhare haatho mein

Ab saup diya is jeevan ka sab bhar tumhare haatho mein
Hai jeet tumhare haatho mein aur haar tumhare haatho mein

## Verse 5

Mujhame tujhame bas bhed yahi mai nar hun aap narayan ho
Mai nar hun aap narayan ho
Mai hun sansar ke haatho mein sansar tumhare haatho mein

Ab saup diya is jeevan ka sab bhar tumhare haatho mein
Hai jeet tumhare haatho mein aur haar tumhare haatho mein`,
    translation: `## Chorus

Now I have placed the whole burden of this life in Your hands
Victory is in Your hands, and defeat is in Your hands

## Verse 1

My only resolve is this: that once I may find You
That once I may find You
I offer the whole world’s love into Your hands

Now I have placed the whole burden of this life in Your hands
Victory is in Your hands, and defeat is in Your hands

## Verse 2

If I live in the world, let me live like a lotus in the water
Like a lotus flower in the water
Let my virtues and faults be offered, O God, into Your hands

Now I have placed the whole burden of this life in Your hands
Victory is in Your hands, and defeat is in Your hands

## Verse 3

If I am born as a human, let me be a worshipper at Your feet
Let me be a worshipper at Your feet
Every fibre of this worship is strung in Your hands

Now I have placed the whole burden of this life in Your hands
Victory is in Your hands, and defeat is in Your hands

## Verse 4

Whenever I am a prisoner of the world, let me act without desire for reward
Let me act without desire for reward
Then at the last moment let me give up my breath, formless, into Your hands

Now I have placed the whole burden of this life in Your hands
Victory is in Your hands, and defeat is in Your hands

## Verse 5

The only difference between me and You is this: I am a human, You are Narayan
I am a human, You are Narayan
I am in the world’s hands; the world is in Your hands

Now I have placed the whole burden of this life in Your hands
Victory is in Your hands, and defeat is in Your hands`,
  },
  "jai-krishna-hare-harry-panday": {
    title: "Jai Krishna Hare",
    alternate_title: "Jai Kridhna Haray · Yaad Sangeet",
    artist_version: "Harry Panday",
    audio_url: "/audio/albums/yaad-sangeet-harry-panday/09-jai-krishna-hare.mp3",
    cover_url: "/images/albums/yaad-sangeet-player-art.png",
    thumbnail_url: "/images/albums/yaad-sangeet-library.png",
    display_order: 48,
    category_slugs: ["krishna", "general", "satsang", "bhajan", "devotion", "hindi"],
    meaning:
      "Harry Panday's Yaad Sangeet rendition of Jai Krishna Hare — praise of Krishna who removes the sorrows of the afflicted.",
    roman_lyrics: `## Chorus

Jai Krishna Hare, Jai Krishna Hare
Dukhiyon ke dukh door kare
Jai Jai Jai Krishna Hare

## Verses

Jab charon taraf andhiyara ho
Asha ka door kinara ho
Jab koi na khewanhara ho
Tab Tu hi beda paar kare
Jai Jai Jai Krishna Hare

Tu chahe to sab kuchh kar de
Vish ko bhi amrit kar de
Puran kar de uski aasha
Jo bhi Tera dhyan dhare
Jai Jai Jai Krishna Hare

Jai Krishna Hare, Jai Krishna Hare
Dukhiyon ke dukh door kare
Jai Jai Jai Krishna Hare`,
    translation: `## Chorus

Glory to Krishna Hare, glory to Krishna Hare
Who removes the sorrows of the afflicted
Glory, glory, glory to Krishna Hare

## Verses

When darkness is all around
And the shore of hope is far away
When there is no one to steer the boat
Then You alone carry us across
Glory, glory, glory to Krishna Hare

If You will, You can do all things
Even turn poison into nectar
Fulfill the hope of whoever
Keeps You in meditation
Glory, glory, glory to Krishna Hare

Glory to Krishna Hare, glory to Krishna Hare
Who removes the sorrows of the afflicted
Glory, glory, glory to Krishna Hare`,
  },
  "bhajuman-hari-har-om-harry-panday": {
    title: "Bhajuman Hari Har Om",
    alternate_title: "Bhajuman Hari Hara Om · Yaad Sangeet",
    artist_version: "Harry Panday",
    audio_url: "/audio/albums/yaad-sangeet-harry-panday/10-bhajuman-hari-har-om.mp3",
    cover_url: "/images/albums/yaad-sangeet-player-art.png",
    thumbnail_url: "/images/albums/yaad-sangeet-library.png",
    display_order: 49,
    category_slugs: [
      "vishnu",
      "shiva",
      "ram",
      "krishna",
      "general",
      "satsang",
      "bhajan",
      "devotion",
      "hindi",
    ],
    meaning:
      "Harry Panday's Yaad Sangeet rendition of Bhajuman Hari Har Om — the mind is called to worship Hari, Hara, and Narayana in every form.",
    roman_lyrics: `## Chorus

Bhajuman Hari Har Om
Sumiro man Narayana
Narayana Hari, Narayana Hari

## Verses

Bhajuman suraj, bhajuman chanda
Bhajuman pawan sameer
Bhajuman Hari Har Om
Sumiro man Narayana

Bhajuman Sita, bhajuman Rama
Bhajuman Hanumat veera
Bhajuman Hari Har Om
Sumiro man Narayana

Bhajuman Gauri aur Ganesha
Bhajuman Sati sang Shiva
Bhajuman Hari Har Om
Sumiro man Narayana

Bhajuman Tulsi, bhajuman chandan
Bhajuman gauwaha ke peer
Bhajuman Hari Har Om
Sumiro man Narayana

Bhajuman Sita, bhajuman Rama
Bhajuman Radhe Ghanshyam
Bhajuman Hari Har Om
Sumiro man Narayana

Bhajuman Brahma, bhajuman Vishnu
Bhajuman Shiva Omkar
Bhajuman Hari Har Om
Sumiro man Narayana
Narayana Hari, Narayana Hari`,
    translation: `## Chorus

O mind, worship Hari Har Om
Remember Narayana in your heart
Narayana Hari, Narayana Hari

## Verses

Worship the sun, worship the moon
Worship the wind and breeze
O mind, worship Hari Har Om
Remember Narayana in your heart

Worship Sita, worship Rama
Worship brave Hanuman
O mind, worship Hari Har Om
Remember Narayana in your heart

Worship Gauri and Ganesha
Worship Shiva with Sati
O mind, worship Hari Har Om
Remember Narayana in your heart

Worship Tulsi, worship sandalwood
Worship the protector of cows
O mind, worship Hari Har Om
Remember Narayana in your heart

Worship Sita, worship Rama
Worship Radha and Ghanshyam
O mind, worship Hari Har Om
Remember Narayana in your heart

Worship Brahma, worship Vishnu
Worship Shiva, the sacred Omkar
O mind, worship Hari Har Om
Remember Narayana in your heart
Narayana Hari, Narayana Hari`,
  },
  "jagambay-maiya-harry-panday": {
    title: "Jagambay Maiya",
    alternate_title: "Yaad Sangeet · Track 11",
    artist_version: "Harry Panday",
    audio_url: "/audio/albums/yaad-sangeet-harry-panday/11-jagambay-maiya.mp3",
    cover_url: "/images/albums/yaad-sangeet-player-art.png",
    thumbnail_url: "/images/albums/yaad-sangeet-library.png",
    display_order: 50,
    category_slugs: ["durga", "general", "satsang", "bhajan", "devotion", "hindi"],
    meaning:
      "From Harry Panday's Yaad Sangeet (Mohabir Records). Lyrics not transcribed yet — play the track to listen.",
    roman_lyrics: "[Album track]",
  },
  "jai-jai-bole-hanuman-harry-panday": {
    title: "Jai Jai Bole Hanuman",
    alternate_title: "Yaad Sangeet · Track 12",
    artist_version: "Harry Panday",
    audio_url: "/audio/albums/yaad-sangeet-harry-panday/12-jai-jai-bole-hanuman.mp3",
    cover_url: "/images/albums/yaad-sangeet-player-art.png",
    thumbnail_url: "/images/albums/yaad-sangeet-library.png",
    display_order: 51,
    category_slugs: ["hanuman", "general", "satsang", "bhajan", "devotion", "hindi"],
    meaning:
      "From Harry Panday's Yaad Sangeet (Mohabir Records). Lyrics not transcribed yet — play the track to listen.",
    roman_lyrics: "[Album track]",
  },
  "om-jai-jai-mahadev-harry-panday": {
    title: "Om Jai Jai Mahadev",
    alternate_title: "Yaad Sangeet · Track 13",
    artist_version: "Harry Panday",
    audio_url: "/audio/albums/yaad-sangeet-harry-panday/13-om-jai-jai-mahadev.mp3",
    cover_url: "/images/albums/yaad-sangeet-player-art.png",
    thumbnail_url: "/images/albums/yaad-sangeet-library.png",
    display_order: 52,
    category_slugs: ["shiva", "general", "satsang", "bhajan", "devotion", "hindi"],
    meaning:
      "Harry Panday's Yaad Sangeet praise of Mahadev — white and yellow garments, Ganga in the jata, Neelkanth who drank the poison, Ardha-nareeshwar and Tripurari.",
    roman_lyrics: `## Verses

Shwetambar peetambar
Kati mein baaghambar saaje
Kati mein baaghambar saaje
Gal maala rundan ki
Gal maala rundan ki
Kar damru baaje
Om jai jai jai Mahadev

Sheesh jata bahe Ganga
Ujjwal chandraanan sohe
Ujjwal chandraanan sohe
Swami samadhi lagaaye
Swami samadhi lagaaye
Tribhuwan man mohe
Om jai jai jai Mahadev

Neelkanth bhaktan hit
Tumne vish ka paan kiya
Tumne vish ka paan kiya
Asuron ko sanhaar ke
Asuron ko sanhaar ke
Jag ka traan kiya
Om jai jai jai Mahadev

Roop alaukik Ardhnaareeshwar
Tum ho Tripuraari
Trilochan tum ho Tripuraari
Shiv Shankar pralayankar
Shiv Shankar pralayankar
Tandav nrityadhari
Om jai jai jai Mahadev
Om jai jai jai Mahadev
Om jai jai jai Mahadev`,
    translation: `## Verses

Clad in white and yellow robes
A tiger-skin adorns your waist
A tiger-skin adorns your waist
A garland of skulls around your neck
A garland of skulls around your neck
The damru sounds in your hand
Om glory, glory, glory to Mahadev

From your matted hair flows the Ganga
Your bright moon-face shines
Your bright moon-face shines
The Lord sits in samadhi
The Lord sits in samadhi
Enchanting the minds of the three worlds
Om glory, glory, glory to Mahadev

O Neelkanth, for the sake of devotees
You drank the poison
You drank the poison
Destroying the demons
Destroying the demons
You saved the world
Om glory, glory, glory to Mahadev

Wondrous form, Ardha-nareeshwar
You are Tripurari
Three-eyed one, you are Tripurari
Shiv Shankar, Lord of dissolution
Shiv Shankar, Lord of dissolution
Bearer of the tandav dance
Om glory, glory, glory to Mahadev
Om glory, glory, glory to Mahadev
Om glory, glory, glory to Mahadev`,
  },
  "hanuman-chalisa-harry-panday": {
    title: "Hanuman Chalisa",
    alternate_title: "Hanuman Chalesa · Yaad Sangeet",
    artist_version: "Harry Panday",
    audio_url: "/audio/albums/yaad-sangeet-harry-panday/15-hanuman-chalisa.mp3",
    cover_url: "/images/albums/yaad-sangeet-player-art.png",
    thumbnail_url: "/images/albums/yaad-sangeet-library.png",
    display_order: 53,
    category_slugs: [...HANUMAN_CHALISA_CATEGORY_SLUGS],
    meaning:
      "Harry Panday's Yaad Sangeet (Mohabir Records) Hanuman Chalisa — the classic prayer of forty chaupais.",
    roman_lyrics: HANUMAN_CHALISA_ROMAN,
    translation: HANUMAN_CHALISA_TRANSLATION,
  },
  "hanuman-chalisa-lata-mangeshkar": {
    title: "Hanuman Chalisa",
    alternate_title: "Shree Hanuman Chalisa · Lata Mangeshkar · T-Series · 2009",
    artist_version: "Lata Mangeshkar",
    audio_url: "https://www.youtube.com/watch?v=BKVzqClbeHo",
    youtube_url: "https://www.youtube.com/watch?v=BKVzqClbeHo",
    thumbnail_url: "/images/hanuman-chalisa-lata-mangeshkar.png",
    cover_url: "/images/hanuman-chalisa-lata-mangeshkar-player.png",
    mini_cover_url: "/images/hanuman-chalisa-lata-mangeshkar.png",
    display_order: 273,
    category_slugs: [...HANUMAN_CHALISA_CATEGORY_SLUGS],
    meaning:
      "Lata Mangeshkar’s Shree Hanuman Chalisa (T-Series, 2009; music Mayuresh Pai) — the classic Tulsidas prayer of forty chaupais seeking strength, devotion, wisdom, and protection.",
    roman_lyrics: HANUMAN_CHALISA_ROMAN,
    translation: HANUMAN_CHALISA_TRANSLATION,
  },
  "hanuman-chalisa-shri-prakash-gossai": {
    title: "Hanuman Chalisa",
    alternate_title: "Shri Hanuman Chalisa",
    artist_version: "Shri Prakash Gossai",
    audio_url: "/audio/hanuman-chalisa-shri-prakash-gossai.mp3",
    thumbnail_url: "/images/hanuman-chalisa-shri-prakash-gossai.png",
    cover_url: "/images/hanuman-chalisa-shri-prakash-gossai-player.png",
    mini_cover_url: "/images/hanuman-chalisa-shri-prakash-gossai.png",
    display_order: 274,
    category_slugs: [...HANUMAN_CHALISA_CATEGORY_SLUGS],
    meaning:
      "Shri Prakash Gossai’s melodic Hanuman Chalisa — the Singing Pandit’s satsang rendition of Tulsidas’s classic prayer of forty chaupais.",
    roman_lyrics: HANUMAN_CHALISA_ROMAN,
    translation: HANUMAN_CHALISA_TRANSLATION,
  },
  "hanuman-chalisa-ankit-batra": {
    title: "Hanuman Chalisa",
    alternate_title: "Shri Hanuman Chalisa",
    artist_version: "Ankit Batra",
    audio_url: "/audio/hanuman-chalisa-ankit-batra.mp3",
    thumbnail_url: "/images/hanuman-chalisa-ankit-batra.png",
    cover_url: "/images/hanuman-chalisa-ankit-batra-player.png",
    mini_cover_url: "/images/hanuman-chalisa-ankit-batra.png",
    display_order: 275,
    category_slugs: [...HANUMAN_CHALISA_CATEGORY_SLUGS],
    meaning:
      "Ankit Batra’s gentle Hanuman Chalisa — the classic Tulsidas prayer of forty chaupais, sung in his Art of Living devotional style.",
    roman_lyrics: HANUMAN_CHALISA_ROMAN,
    translation: HANUMAN_CHALISA_TRANSLATION,
  },
  "bandow-charana-kamal-ragunandan": {
    title: "Bandow Charana Kamal Ragunandan",
    alternate_title: "Bandau Charan Kamal Raghunandan",
    artist_version: "Surbhi Chahal",
    audio_url: "https://www.youtube.com/watch?v=3QupRJS3k6Y",
    thumbnail_url: "/images/bandow-charana-kamal-ragunandan.png",
    cover_url: "/images/bandow-charana-kamal-ragunandan-cover.png",
    mini_cover_url: "/images/bandow-charana-kamal-ragunandan.png",
    display_order: 3,
    category_slugs: [
      "ram",
      "sita",
      "general",
      "satsang",
      "ram-navami",
      "evening-prayer",
      "bhajan",
      "devotion",
      "protection",
      "hindi",
      "suitable-for-funerals",
    ],
    meaning:
      "A Ram bhajan of devotion to the lotus feet of Raghunandan. By His grace come bliss and prosperity; He dwells in Ayodhya with Sita, destroys evil, removes sorrow and fear, and shelters His devotees. Sung by Surbhi Chahal.",
    roman_lyrics: `Bandow charana kamal Ragunandan

Jina ki kripaa sakal sukha sampati
Paawana jana bhaktana ura chandana

Awadha puri prabhu nitya biraajata
Janaka sutaa yuta dushta nikandana

Teena taapa aru janama marana bhayo
Door karata chhina may jana ranjana

Bhakta namata charan may Bhagavana
Kripaa kariya sevak bhaya bhanjana

Bandow charana kamal Ragunandan`,
    devanagari_lyrics: `à¤¬à¤‚à¤¦à¥Œà¤‚ à¤šà¤°à¤£ à¤•à¤®à¤² à¤°à¤˜à¥à¤¨à¤¨à¥à¤¦à¤¨

à¤œà¤¿à¤¨à¤•à¥€ à¤•à¥ƒà¤ªà¤¾ à¤¸à¤•à¤² à¤¸à¥à¤– à¤¸à¤‚à¤ªà¤¤à¤¿
à¤ªà¤¾à¤µà¤¨ à¤œà¤¨ à¤­à¤•à¥à¤¤à¤¨ à¤‰à¤° à¤šà¤¨à¥à¤¦à¤¨

à¤…à¤µà¤§ à¤ªà¥à¤°à¥€ à¤ªà¥à¤°à¤­à¥ à¤¨à¤¿à¤¤à¥à¤¯ à¤¬à¤¿à¤°à¤¾à¤œà¤¤
à¤œà¤¨à¤• à¤¸à¥à¤¤à¤¾ à¤¯à¥à¤¤ à¤¦à¥à¤·à¥à¤Ÿ à¤¨à¤¿à¤•à¤¨à¥à¤¦à¤¨

à¤¤à¥€à¤¨ à¤¤à¤¾à¤ª à¤…à¤°à¥ à¤œà¤¨à¤® à¤®à¤°à¤£ à¤­à¤¯
à¤¦à¥‚à¤° à¤•à¤°à¤¤ à¤›à¤¿à¤¨ à¤®à¥‡à¤‚ à¤œà¤¨ à¤°à¤‚à¤œà¤¨

à¤­à¤•à¥à¤¤ à¤¨à¤®à¤¤ à¤šà¤°à¤£ à¤®à¥‡à¤‚ à¤­à¤—à¤µà¤¾à¤¨
à¤•à¥ƒà¤ªà¤¾ à¤•à¤°à¤¿à¤¯ à¤¸à¥‡à¤µà¤• à¤­à¤¯ à¤­à¤‚à¤œà¤¨

à¤¬à¤‚à¤¦à¥Œà¤‚ à¤šà¤°à¤£ à¤•à¤®à¤² à¤°à¤˜à¥à¤¨à¤¨à¥à¤¦à¤¨`,
    translation: `I worship the lotus feet of Shri Raghunandan.

By His divine grace comes all bliss and prosperity.
Like sandalwood, His grace rests on the hearts of pure devotees.

The Lord forever dwells in Ayodhya.
With Janak's daughter Sita, He destroys the wicked.

He removes the three afflictions and the fear of birth and death.
In a moment He brings joy and peace to His devotees.

Devotees bow at Your feet, O Lord.
Grant Your mercy to Your servant and dispel all fear.

I worship the lotus feet of Shri Raghunandan.`,
  },
  "hanuman-chalisa-raj-barman": {
    title: "Hanuman Chalisa",
    alternate_title: "Shri Hanuman Chalisa",
    artist_version: "Raj Barman",
    audio_url: "/audio/hanuman-chalisa-raj-barman.mp3",
    thumbnail_url: "/images/hanuman-chalisa-raj-barman-original.png",
    cover_url: "/images/hanuman-chalisa-raj-barman.png",
    mini_cover_url: "/images/hanuman-chalisa-raj-barman-original.png",
    display_order: 5,
    category_slugs: [...HANUMAN_CHALISA_CATEGORY_SLUGS],
    meaning:
      "A classic prayer by Goswami Tulsidas in praise of Lord Hanuman — seeking strength, devotion, wisdom, and protection. Structurally: two introductory dohas, forty chaupais, and a concluding doha. This library entry features the Raj Barman rendition.",
    roman_lyrics: HANUMAN_CHALISA_ROMAN,
    translation: HANUMAN_CHALISA_TRANSLATION,
  },
  "hanuman-chalisa-raj-barman-slow": {
    title: "Hanuman Chalisa",
    alternate_title: "Slow version",
    artist_version: "Raj Barman",
    audio_url: "/audio/hanuman-chalisa-raj-barman-slow.mp3",
    thumbnail_url: "/images/hanuman-chalisa-raj-barman-version-2.png",
    cover_url: "/images/hanuman-chalisa-raj-barman-slow.png",
    mini_cover_url: "/images/hanuman-chalisa-raj-barman-version-2.png",
    display_order: 6,
    category_slugs: [...HANUMAN_CHALISA_CATEGORY_SLUGS],
    meaning:
      "Slow lyrical Raj Barman rendition of the Hanuman Chalisa (Amjad Nadeem). Same prayer — two introductory dohas, forty chaupais, and a concluding doha.",
    roman_lyrics: HANUMAN_CHALISA_ROMAN,
    translation: HANUMAN_CHALISA_TRANSLATION,
  },
  "hanuman-chalisa-mix": {
    title: "Hanuman Chalisa Mix",
    alternate_title: "Remix · Party Mix · GT ViBEZ SoundCrew · not the regular Chalisa",
    artist_version: "GT ViBEZ SoundCrew",
    audio_url: "/audio/folders/bhajan-party-mix/hanuman-chalisa-mix.mp3",
    thumbnail_url: "/images/hanuman-chalisa-mix-gtvibez.png",
    cover_url: "/images/hanuman-chalisa-mix-player.png",
    mini_cover_url: "/images/hanuman-chalisa-mix-gtvibez.png",
    display_order: 7,
    category_slugs: [...HANUMAN_CHALISA_CATEGORY_SLUGS],
    meaning:
      "Remix / party mix by GT ViBEZ SoundCrew — upbeat arrangement of the Hanuman Chalisa. Not the regular satsang Chalisa; find that under other Hanuman Chalisa versions.",
    roman_lyrics: HANUMAN_CHALISA_ROMAN,
    translation: HANUMAN_CHALISA_TRANSLATION,
  },
  "bhajan-mawdness-gt-vibez": {
    title: "Bhajan Mawdness",
    alternate_title: "Remix · Bhajan Madness · Party Mix · GT ViBEZ SoundCrew",
    artist_version: "GT ViBEZ SoundCrew",
    audio_url: "/audio/folders/bhajan-party-mix/bhajan-mawdness.mp3",
    thumbnail_url: "/images/hanuman-chalisa-mix-gtvibez.png",
    cover_url: "/images/hanuman-chalisa-mix-player.png",
    mini_cover_url: "/images/hanuman-chalisa-mix-gtvibez.png",
    display_order: 8,
    category_slugs: [
      "general",
      "satsang",
      "bhajan",
      "devotion",
      "hindi",
    ],
    meaning:
      "Remix / party mix by GT ViBEZ SoundCrew — high-energy bhajan mawdness. Not a regular satsang track; open Bhajan Party Mix to play through these remixes.",
  },
  "bhajan-mawdness-2-gt-vibez": {
    title: "Bhajan Mawdness 2",
    alternate_title: "Remix · Bhajan Madness 2 · Party Mix · GT ViBEZ SoundCrew",
    artist_version: "GT ViBEZ SoundCrew",
    audio_url: "/audio/folders/bhajan-party-mix/bhajan-mawdness-2.mp3",
    thumbnail_url: "/images/hanuman-chalisa-mix-gtvibez.png",
    cover_url: "/images/hanuman-chalisa-mix-player.png",
    mini_cover_url: "/images/hanuman-chalisa-mix-gtvibez.png",
    display_order: 9,
    category_slugs: [
      "general",
      "satsang",
      "bhajan",
      "devotion",
      "hindi",
    ],
    meaning:
      "Remix / party mix by GT ViBEZ SoundCrew — part 2 of Bhajan Mawdness. Not a regular satsang track.",
  },
  "munni-munni": {
    title: "Munni Munni",
    alternate_title: "Muni Muni · Kali Yatra · Munni Munni Maiya Maiya",
    artist_version: "Taran Terence Sookbir",
    audio_url: "/audio/folders/bhajan-party-mix/munni-munni.mp3",
    thumbnail_url: "/images/munni-munni.png",
    cover_url: "/images/munni-munni-player.png",
    mini_cover_url: "/images/munni-munni.png",
    display_order: 10,
    category_slugs: [
      "kali",
      "durga",
      "general",
      "satsang",
      "bhajan",
      "devotion",
      "hindi",
    ],
    meaning:
      "Regular Kali bhajan by Taran Terence Sookbir (Kali Yatra / Munni Munni EP). Opens with the Jayanti Mangala Kali mantra, then the Munni Munni Maiya chorus and jai calls to Kali / Mahakali. Also listed in Bhajan Party Mix — not a remix. Lyrics drafted from the recording (no published sheet online).",
    roman_lyrics: `## Opening (mantra)

Jayanti Mangala Kali
Bhadrakali Kapalini
Durga Kshama Shiva Dhatri
Swaha Swadha Namostute
Namah Devi

## Chorus

Munni Munni Maiya Maiya
Munni Munni Maiya Maiya
Munni Munni Maiya Maiya
Munni Munni Maiya Maiya

## Verse / call

Kali Bhadrakali Kapalini
Durga Kshama Shiva Dhatri Kapalini
Kali Bhadrakali Kapalini
Durga Kshama Shiva Dhatri Kapalini

## Jai

Jai jai Dhatri Mata
Jai jai Dhatri Mata
Jai jai Mahakali Maiya
Jai jai Mahakali Maiya

## Chorus

Munni Munni Maiya Maiya
Munni Munni Maiya Maiya`,
    translation: `## Opening (mantra)

Victory to auspicious Kali
Bhadrakali, the skull-bearer
Durga, forgiveness, Shiva’s consort, the sustainer
Swaha, Swadha — salutations to you
Salutations, O Devi

## Chorus

Munni Munni, Mother, Mother
(affectionate call to Mother Kali)

## Verse / call

Kali, Bhadrakali, Kapalini
Durga, forgiveness, Shiva’s consort, Kapalini

## Jai

Victory, victory to Mother Dhatri
Victory, victory to Mother Mahakali

## Chorus

Munni Munni, Mother, Mother`,
  },
  "om-jai-jagdish-hare-remix": {
    title: "Om Jai Jagdish Hare (Remix)",
    alternate_title: "Remix · Party Mix · not the regular aarti",
    artist_version: "GT ViBEZ SoundCrew",
    audio_url: "/audio/folders/bhajan-party-mix/om-jai-jagdish-hare-remix.mp3",
    thumbnail_url: "/images/hanuman-chalisa-mix-gtvibez.png",
    cover_url: "/images/hanuman-chalisa-mix-player.png",
    mini_cover_url: "/images/hanuman-chalisa-mix-gtvibez.png",
    display_order: 11,
    category_slugs: [
      "general",
      "aarti",
      "satsang",
      "bhajan",
      "devotion",
      "hindi",
    ],
    meaning:
      "Remix / party mix of Om Jai Jagdish Hare — same aarti words as the regular versions; not for quiet satsang.",
    roman_lyrics: OM_JAI_JAGDISH_ROMAN,
    translation: OM_JAI_JAGDISH_TRANSLATION,
  },
  "om-jai-jagdish-hare-anuradha-paudwal": {
    title: "Om Jai Jagadish Hare",
    alternate_title: "Om Jai Jagdish Hare · Vishnu aarti",
    artist_version: "Anuradha Paudwal",
    audio_url: "/audio/om-jai-jagdish-hare/anuradha-paudwal.mp3",
    youtube_url: "https://youtu.be/Viw8D7yI0Ns",
    thumbnail_url: "/images/om-jai-jagdish-hare-anuradha-paudwal-square.png",
    cover_url: "/images/om-jai-jagdish-hare-anuradha-paudwal-player.png",
    mini_cover_url: "/images/om-jai-jagdish-hare-anuradha-paudwal-square.png",
    display_order: 20,
    category_slugs: [...OM_JAI_JAGDISH_CATEGORY_SLUGS],
    meaning: `${OM_JAI_JAGDISH_MEANING} This entry is the Anuradha Paudwal recording.`,
    roman_lyrics: OM_JAI_JAGDISH_ROMAN,
    translation: OM_JAI_JAGDISH_TRANSLATION,
  },
  "om-jai-jagdish-hare-maanya-arora": {
    title: "Om Jai Jagadish Hare",
    alternate_title: "Om Jai Jagdish Hare · Vishnu aarti",
    artist_version: "Maanya Arora",
    audio_url: "/audio/om-jai-jagdish-hare/maanya-arora.mp3",
    youtube_url: "https://youtu.be/Viw8D7yI0Ns",
    thumbnail_url: "/images/om-jai-jagdish-hare-maanya-arora-square.png",
    cover_url: "/images/om-jai-jagdish-hare-maanya-arora-player.png",
    mini_cover_url: "/images/om-jai-jagdish-hare-maanya-arora-square.png",
    display_order: 21,
    category_slugs: [...OM_JAI_JAGDISH_CATEGORY_SLUGS],
    meaning: `${OM_JAI_JAGDISH_MEANING} This entry is the Maanya Arora recording.`,
    roman_lyrics: OM_JAI_JAGDISH_ROMAN,
    translation: OM_JAI_JAGDISH_TRANSLATION,
  },
  "om-jai-jagdish-hare-hari-om-sharan": {
    title: "Om Jai Jagadish Hare",
    alternate_title: "Om Jai Jagdish Hare · Vishnu aarti · Aarti Vandan",
    artist_version: "Hari Om Sharan",
    audio_url: "https://www.youtube.com/watch?v=UxJj6ylNey4",
    youtube_url: "https://www.youtube.com/watch?v=UxJj6ylNey4",
    thumbnail_url: "/images/om-jai-jagdish-hare-hari-om-sharan.jpg",
    cover_url: "/images/albums/aarti-archan-player-cover.png",
    mini_cover_url: "/images/om-jai-jagdish-hare-hari-om-sharan.jpg",
    display_order: 22,
    category_slugs: [...OM_JAI_JAGDISH_CATEGORY_SLUGS],
    meaning: `${OM_JAI_JAGDISH_MEANING} This entry is the Hari Om Sharan recording (Aarti Vandan / Saregama).`,
    roman_lyrics: OM_JAI_JAGDISH_ROMAN,
    translation: OM_JAI_JAGDISH_TRANSLATION,
  },
  "om-namah-shivaya-mix-shreya-ghoshal": {
    title: "Om Namah Shivaya Mix (Remix)",
    alternate_title:
      "Remix · GT ViBEZ SoundCrew · vocals Shreya Ghoshal · Party Mix · not the regular chant",
    artist_version: "GT ViBEZ SoundCrew",
    audio_url:
      "/audio/folders/bhajan-party-mix/om-namah-shivaya-mix-shreya-ghoshal.mp3",
    thumbnail_url: "/images/om-namah-shivaya-shreya-ghoshal.png",
    cover_url: "/images/om-namah-shivaya-shreya-ghoshal-player.png",
    mini_cover_url: "/images/om-namah-shivaya-shreya-ghoshal.png",
    display_order: 12,
    category_slugs: [
      "shiva",
      "general",
      "satsang",
      "bhajan",
      "devotion",
      "hindi",
    ],
    meaning:
      "Remix / party mix by GT ViBEZ SoundCrew of Om Namah Shivaya (original vocals: Shreya Ghoshal). Cover art features Shreya; the mix itself is the Party Mix remix — not a regular satsang chant.",
  },
  "shiva-aarti-remix": {
    title: "Shiva Aarti (Remix)",
    alternate_title: "Remix · Party Mix · not the regular aarti",
    artist_version: "GT ViBEZ SoundCrew",
    audio_url: "/audio/folders/bhajan-party-mix/shiva-aarti-remix.mp3",
    thumbnail_url: "/images/hanuman-chalisa-mix-gtvibez.png",
    cover_url: "/images/hanuman-chalisa-mix-player.png",
    mini_cover_url: "/images/hanuman-chalisa-mix-gtvibez.png",
    display_order: 13,
    category_slugs: [
      "shiva",
      "aarti",
      "general",
      "satsang",
      "bhajan",
      "devotion",
      "hindi",
    ],
    meaning:
      "Remix / party mix of Shiva Aarti — not the regular satsang aarti.",
  },
  "bandow-charan-kamal-ragunandan-remix": {
    title: "Bandow Charan Kamal Ragunandan (Remix)",
    alternate_title:
      "Remix · Bando Charan · Party Mix · not the regular Bandow Charan",
    artist_version: "GT ViBEZ SoundCrew",
    audio_url:
      "/audio/folders/bhajan-party-mix/bandow-charan-kamal-ragunandan-remix.mp3",
    thumbnail_url: "/images/hanuman-chalisa-mix-gtvibez.png",
    cover_url: "/images/hanuman-chalisa-mix-player.png",
    mini_cover_url: "/images/hanuman-chalisa-mix-gtvibez.png",
    display_order: 14,
    category_slugs: [
      "ram",
      "general",
      "satsang",
      "bhajan",
      "devotion",
      "hindi",
    ],
    meaning:
      "Remix / party mix of Bandow Charana Kamal Ragunandan — not the regular Harry Panday / satsang version.",
  },
  "hanuman-chalisa-hariharan": {
    title: "Shree Hanuman Chalisa",
    alternate_title: "Hanuman Ashtak · T-Series (1993)",
    artist_version: "Hariharan",
    audio_url:
      "/audio/albums/shree-hanuman-chalisa-hariharan/01-shree-hanuman-chalisa.mp3",
    thumbnail_url: "/images/albums/shree-hanuman-chalisa-hariharan.png",
    cover_url: "/images/albums/shree-hanuman-chalisa-hariharan-player-cover.png",
    display_order: 20,
    category_slugs: [...HANUMAN_CHALISA_CATEGORY_SLUGS],
    meaning:
      "Hariharan's famous Shree Hanuman Chalisa from the 1993 T-Series album Shree Hanuman Chalisa (Hanuman Ashtak). Music composed by Lalit Sen.",
    roman_lyrics: HANUMAN_CHALISA_ROMAN,
    translation: HANUMAN_CHALISA_TRANSLATION,
  },
  "sankatmochan-hanuman-ashtak-hariharan": {
    title: "Sankat Mochan Hanuman Ashtak",
    alternate_title: "Hanumanashtak",
    artist_version: "Hariharan",
    audio_url:
      "/audio/albums/shree-hanuman-chalisa-hariharan/02-sankatmochan-hanuman-ashtak.mp3",
    thumbnail_url: "/images/albums/shree-hanuman-chalisa-hariharan.png",
    cover_url: "/images/albums/shree-hanuman-chalisa-hariharan-player-cover.png",
    display_order: 21,
    category_slugs: [
      "hanuman",
      "general",
      "satsang",
      "bhajan",
      "devotion",
      "protection",
      "hindi",
    ],
    meaning:
      "Eight verses (ashtak) praising Sankatmochan Hanuman — the remover of distress. Each verse recalls how Hanuman saved devotees and the world from crisis; the refrain calls on his name. From Hariharan's 1993 T-Series album.",
    roman_lyrics: `## Ashtak

Baal samay Ravi bhakshi liyo tab
Teenahu lok bhayo andhiyaro

Taahi son traas bhayo jag ko
Yah sankat kaahu son jaat na taro

Devan aani kari binati tab
Chhadi diyo Ravi kasht nivaro

Ko nahin jaanat hai jag mein Kapi
Sankatmochan naam tiharo

Bali ki traas kapees basain giri
Jaat Mahaprabhu panth niharo

Chaunki mahamuni saap diyo tab
Chahiye kaun bichaar bicharo

Kaiddwij roop livaye Mahaprabhu
So tum das ke sok nivaro

Ko nahin jaanat hai jag mein Kapi
Sankatmochan naam tiharo

Angad ke sang len gae Siy
Khoj kapees yah bain ucharo

Jeevat na bachihau ham so ju
Bina sudhi laaye ihaan pagu dharo

Haare thake tat sindhu sabe tab
Lae Siya-sudhi praan ubaro

Ko nahin jaanat hai jag mein Kapi
Sankatmochan naam tiharo

Ravan traas daee Siy ko sab
Rakshasi son kahi sok nivaro

Taahi samay Hanuman Mahaprabhu
Jae maha rajaneechar maro

Chahat Siy ashok son aagi su
Dai Prabhu mudrika sok nivaro

Ko nahin jaanat hai jag mein Kapi
Sankatmochan naam tiharo

Baan laagyo ur Lachhiman ke tab
Praan taje soot Ravan maro

Lai grih baidya Sushen samet
Tabai giri Dron su beer uparo

Aani sanjeevan haath die tab
Lachhiman ke tum praan ubaro

Ko nahin jaanat hai jag mein Kapi
Sankatmochan naam tiharo

Ravan juddh ajaan kiyo tab
Naag ki phans sabai sir daro

Shri Raghunath samet sabai dal
Moh bhayo yah sankat bharo

Aani Khagesh tabai Hanuman ju
Bandhan kaati sutraas nivaro

Ko nahin jaanat hai jag mein Kapi
Sankatmochan naam tiharo

Bandhu samet jabai Ahiravan
Lai Raghunath patal sidharo

Devinheen pooji bhali vidhi son bali
Deu sabai mili mantra vicharo

Jaaye sahay bhayo tab hi
Ahiravan sainy samet sanharo

Ko nahin jaanat hai jag mein Kapi
Sankatmochan naam tiharo

Kaaj kiye bad devan ke tum
Beer Mahaprabhu dekhi bicharo

Kaun so sankat mor gareeb ko
Jo tumse nahin jaat hai taro

Begi haro Hanuman Mahaprabhu
Jo kachhu sankat hoe hamaro

Ko nahin jaanat hai jag mein Kapi
Sankatmochan naam tiharo

## Closing

Laal deh laali lase, aru dhari laal langoor
Vajra deh danav dalan, jai jai jai Kapi soor

Pavan soot Hanuman ki jai`,
    translation: `## Ashtak

In childhood you swallowed the sun —
Then the three worlds fell into darkness.

Fear spread through the world;
That crisis no one else could remove.

The gods came and pleaded;
You released the sun and ended the distress.

Who in the world does not know you, O monkey-lord —
Sankatmochan is your name.

Bali's terror kept the monkeys on the mountain;
You watched the great Lord's path.

When the sage's curse struck,
What counsel was needed?

In a Brahmin's form you brought the Lord —
So remove your servant's sorrow.

Who in the world does not know you, O monkey-lord —
Sankatmochan is your name.

With Angad they went seeking Sita;
The monkeys spoke these words:

"We will not leave alive
Unless we return here with news of her."

Exhausted on the ocean shore,
You brought Sita's news and saved their lives.

Who in the world does not know you, O monkey-lord —
Sankatmochan is your name.

Ravan tormented Sita;
She told the rakshasis to end her grief.

Then great Lord Hanuman came
And struck down the night-ranger's kin.

When Sita would have entered the fire at Ashok,
You gave the Lord's ring and eased her pain.

Who in the world does not know you, O monkey-lord —
Sankatmochan is your name.

An arrow struck Lakshman's chest;
Ravan's son had nearly taken his life.

You brought the physician Sushen,
Then tore up Mount Drona.

You placed the Sanjivani in hand
And restored Lakshman's life.

Who in the world does not know you, O monkey-lord —
Sankatmochan is your name.

In battle Ravan cast
The serpent-noose over every head.

Shri Raghunath and the whole army
Fell into a heavy crisis of delusion.

Then Hanuman brought Garuda;
The bonds were cut and the terror removed.

Who in the world does not know you, O monkey-lord —
Sankatmochan is your name.

With his kin, Ahiravan
Carried Raghunath down to the netherworld.

Goddesses were worshipped with care;
Together they planned the sacrifice.

You went as helper then,
And destroyed Ahiravan with his army.

Who in the world does not know you, O monkey-lord —
Sankatmochan is your name.

You have done great deeds for the gods;
O mighty Lord, consider this:

What crisis of this poor one
Cannot be removed by you?

Quickly take it away, O Hanuman Mahaprabhu —
Whatever distress is ours.

Who in the world does not know you, O monkey-lord —
Sankatmochan is your name.

## Closing

Red form glowing red, with a red tail —
Thunderbolt body, crusher of demons — glory, glory, glory to the brave monkey!

Victory to Pavan Putra Hanuman!`,
  },
  "bajrang-baan-hariharan": {
    title: "Bajrang Baan",
    alternate_title: "Bajarang Baan",
    artist_version: "Hariharan",
    audio_url:
      "/audio/albums/shree-hanuman-chalisa-hariharan/03-bajrang-baan.mp3",
    thumbnail_url: "/images/albums/shree-hanuman-chalisa-hariharan.png",
    cover_url: "/images/albums/shree-hanuman-chalisa-hariharan-player-cover.png",
    display_order: 22,
    category_slugs: [
      "hanuman",
      "general",
      "satsang",
      "bhajan",
      "devotion",
      "protection",
      "hindi",
    ],
    meaning:
      "Bajrang Baan — a fierce prayer to Bajrangbali for protection and the quick removal of obstacles and enemies (outer and inner). From Hariharan's 1993 T-Series album.",
    roman_lyrics: `## Opening

Nishchaya prema pratiti te
Binaya kare sanaman
Tehi ke karaja sakala shubha
Siddha karen Hanuman

## Bajrang Baan

Jaya Hanumanta santa hitakari
Suni lijai Prabhu araja hamari
Jana ke kaja bilamba na kijai
Atura dauri maha sukha dijai

Jaise kudi sindhu wahi para
Surasa badana paithi vistara
Age jaai Lankini roka
Marehu lata gai suraloka

Jaya Vibhishan ko sukha dinha
Sita nirakhi parama pada linha
Baga ujari sindhu mahan bora
Ati atura Yamakatara tora

Akshay Kumar ko mari sanhara
Luma lapeti Lanka ko jara
Laha samana Lanka jari gai
Jaya jaya dhuni surapura manha bhai

Aba bilamba kehi karana Swami
Kripa karahu ura antarayami
Jaya jaya Lakhana prana ke data
Atura hoi dukha karahu nipata

Jai Giridhara jai jai sukha sagara
Sura samuha samaratha bhata nagara
Om hanu hanu hanu Hanumanta hatile
Bairihin maru vajra ke kile

Gada vajra lai bairihin maro
Maharaja Prabhu dasa ubaro
Omkara hunkara mahavira dhavau
Vajra gada hanu vilamba na lavo

Om hrim hrim hrim Hanumanta kapisa
Om hum hum hum hanu ari ura shisha
Satya hohu Hari shapata paya ke
Ramaduta dharu maru dhayake

Jaya jaya jaya Hanumanta agadha
Dukha pavata jana kehi aparadha
Puja japa tapa nema achara
Nahin janata hau dasa tumhara

Bana upavana maga giri griha mahin
Tumhare bala ham darapata nahin
Panya paraun kara jori manavaun
Yahi avasara aba kehi gohravaun

Jaya Anjani kumara balavanta
Shankara suvana bira Hanumanta
Badana karala kala kula ghalaka
Rama sahaya sada pratipalaka

Bhuta preta pishacha nisachara
Agni baitala kala mari mara
Inhen maru tohi shapatha Rama ki
Rakhu natha maryada nama ki

Janakasuta Hari dasa kahavo
Taki shapatha bilamba na lavo
Jaya jaya jaya dhuni hota akasha
Sumirata hota dusaha dukha nasha

Charana sharana kara jori manavaun
Yahi avasara aba kehi goharavaun
Uthu uthu chalu tohi Rama dohai
Panya paraun kara jori manai

Om cham cham cham cham chapala chalanta
Om hanu hanu hanu hanu Hanumanta
Om han han hank detakapi chanchal
Om sam sam sahami parane khaladal

Apane jana ko turata ubaro
Sumirata hoya ananda hamaro
Yahi Bajranga bana jehi mare
Tahi kaho phir kauna ubare

## Closing

Pata karai Bajranga bana ki
Hanumata raksha karen prana ki
Yaha Bajranga bana jo japai
Tehi te bhuta preta saba kampai

Dhupa dey aru japai hamesha
Take tana nahin rahai kalesha

Prema pratitihi kapi bhajai
Sada dharai ura dhyan
Tehi ke karaja sakala shubha
Siddha karen Hanuman`,
    translation: `## Opening

Those who recite with love and unwavering faith,
Honouring Him in humble prayer —
All their auspicious work
Hanuman brings to fulfilment.

## Bajrang Baan

Glory to Hanuman, benefactor of saints.
Lord, hear our prayer.
Do not delay your devotee's work;
Run to us and grant great peace.

Come as when you leapt the ocean,
Entered Surasa's vast mouth and emerged,
And when Lankini blocked your way,
You kicked her and she went to the gods' realm.

You gave joy to Vibhishan,
And by Sita's grace attained the highest place;
You wrecked the grove and cast it in the sea,
Swiftly breaking Yama's terror.

You slew Akshay Kumar,
And with your tail set Lanka ablaze;
Lanka burned like lac,
And "Jai Jai" rang through heaven.

Why delay now, my Lord?
Have mercy, knower of the heart.
Glory to the giver of Lakshman's life —
Hurry and destroy this sorrow.

Hail, mountain-bearer, ocean of bliss,
Wisest of gods, skilled warrior.
Om hanu hanu hanu — fierce Hanuman —
Strike foes as with thunderbolt nails.

Take mace and thunderbolt; strike the enemy.
Great Lord, save your servant.
With Om's roar, O Mahavir, charge —
Bring mace and bolt; do not delay.

Om hrim hrim hrim, Hanuman, lord of monkeys;
Om hum hum hum — strike foe's chest and head.
True is this oath by Hari's feet —
Ram's messenger, seize and strike at once.

Glory, glory, glory to fathomless Hanuman!
For what fault does your devotee suffer?
Worship, japa, tapa, vows and rites —
This servant of yours knows none of them.

In forest, garden, road, mountain or home,
By your strength we fear nothing.
I fall at your feet with folded hands —
Whom else shall I call at this hour?

Hail, mighty son of Anjani,
Brave Hanuman, offspring of Shankar;
Fierce of face, destroyer of Death's brood,
Always Ram's helper, eternal guardian.

Ghosts, spirits, goblins, night-demons,
Fire, vampires, and Death — destroy them.
Slay them; I swear by Ram's name —
Uphold, O Lord, the honour of the Name.

You are called servant of Janak's daughter and Hari —
By that oath, make no delay.
Jai jai jai resounds in the sky;
Remembering you, unbearable sorrow ends.

I take refuge at your feet with folded hands —
Whom else shall I call now?
Rise, rise, come — I invoke Ram's name;
I fall at your feet and plead.

Om cham cham — swift-footed one;
Om hanu hanu hanu hanu Hanuman;
Om — the restless monkey's war-cry;
Om — evil hordes flee in terror.

Save your devotee at once;
Remembering you, our bliss arises.
Who can save the one
Struck by this Bajrang Baan?

## Closing

Whoever recites Bajrang Baan —
Hanuman guards their very life.
Whoever chants this Bajrang Baan —
Ghosts and spirits all tremble.

Who offers incense and always chants —
No torment remains in their body.

Who worships the monkey-lord with love and faith,
And holds Him always in the heart —
All their auspicious work
Hanuman brings to fulfilment.`,
  },
  "shree-hanuman-stavan-hariharan": {
    title: "Shree Hanuman Stavan",
    alternate_title: "Hanumat Stavan",
    artist_version: "Hariharan",
    audio_url:
      "/audio/albums/shree-hanuman-chalisa-hariharan/04-shree-hanuman-stavan.mp3",
    thumbnail_url: "/images/albums/shree-hanuman-chalisa-hariharan.png",
    cover_url: "/images/albums/shree-hanuman-chalisa-hariharan-player-cover.png",
    display_order: 23,
    category_slugs: [
      "hanuman",
      "general",
      "satsang",
      "bhajan",
      "devotion",
      "hindi",
      "sanskrit",
    ],
    meaning:
      "Hanumat Stavan — verses of praise to Hanuman as Pavan Kumar, Raghupati's dear devotee, and terror of Lanka. From Hariharan's 1993 T-Series album.",
    roman_lyrics: `## Opening

Pranavun Pavanakumar khala bana pavaka gyan ghana
Jasu hridaya agar basahin Ram sara chapa dhara

## Stavan

Atulita bala dhamam hema shaila bhadeham
Danuja vana krishanum gyaninam agraganyam

Sakala guna nidhanam vanara namadheesham
Raghupati priya bhaktam vatajatam namami

Goshpadi krita vareesham mashaki krita rakshasam
Ramayana maha mala ratnam vande Nilatmajam

Anjana nandanam veeram Janaki shoka nashanam
Kapeesham aksha hantaram vande Lanka bhayankaram

Ulanghya sindhoh salilam saleelam
Yah shoka vahnim Janakatma jayayah
Aadaya tenaiva dadaha Lanka
Namami tam pranjalir Anjaneyam

Manojavam Maruta tulya vegam
Jitendriyam buddhimatam varishtam
Vatatmajam vanara yutha mukhyam
Shri Ramadutam sharanam prapadye

## Closing

Bolo Bajrangbali Hanuman ki jai

Anjaneya mati patalananam
Kanchanadri kamaniya vigraham
Parijata taru moola vasinam
Bhavayami pavamana nandanam

Yatra yatra Raghunatha keertanam
Tatra tatra krita mastakanjalim
Bashpa vari paripurna lochanam
Marutim namata rakshasantakam`,
    translation: `## Opening

I bow to Pavan Kumar — fire to the forest of the wicked, dense with wisdom —
In whose heart-shrine dwell Ram, bearer of bow and arrows.

## Stavan

Abode of unmatched strength, like a golden mountain in form;
Fire to the demon forest, foremost among the wise.

Treasury of all virtues, Lord of the monkey hosts;
Beloved devotee of Raghupati, son of the Wind — I bow to you.

Who made the ocean a cow's hoof-print, demons like mosquitoes;
Jewel in the great garland of the Ramayana — I praise Neela's son.

Brave son of Anjana, destroyer of Janaki's sorrow;
Lord of monkeys, slayer of Aksha — I praise the terror of Lanka.

Who lightly leapt the ocean's waters,
Took away the fire of Janaka's daughter's grief,
And with that same fire burned Lanka —
With folded hands I bow to that Anjaneya.

Swift as thought, equal to the Wind in speed,
Master of the senses, greatest among the wise;
Son of Vata, chief of the monkey army —
I take refuge in Shri Ram's messenger.

## Closing

Say: Victory to Bajrangbali Hanuman!

Anjaneya of the glowing crimson face,
Form lovely as a golden mountain,
Dwelling at the root of the Parijata tree —
I meditate on the Wind-god's son.

Wherever Raghunath's glory is sung,
There he stands with head bowed in reverence,
Eyes filled with tears of love —
Bow to Maruti, destroyer of demons.`,
  },
  "he-bajrangbali-hanuman-hariharan": {
    title: "He Bajrangbali Hanuman",
    alternate_title: "Hey Bajrang Bali Hanuman",
    artist_version: "Hariharan",
    audio_url:
      "/audio/albums/shree-hanuman-chalisa-hariharan/05-he-bajrangbali-hanuman.mp3",
    thumbnail_url: "/images/albums/shree-hanuman-chalisa-hariharan.png",
    cover_url: "/images/albums/shree-hanuman-chalisa-hariharan-player-cover.png",
    display_order: 24,
    category_slugs: [
      "hanuman",
      "general",
      "satsang",
      "bhajan",
      "devotion",
      "hindi",
    ],
    meaning:
      "A bhajan calling on Bajrangbali for welfare and protection — “we have come to your door.” From Hariharan's 1993 T-Series album.",
    roman_lyrics: `## Chorus

He Bajrangbali Hanuman
He Mahavir karo kalyan

## Verses

Teeno lok tera ujiyara
Dukhiyon ka tune kaj sanwara

Teeno lok tera ujiyara
Dukhiyon ka tune kaj sanwara

He jagvandan Kesari nandan
Kasht haro he kripa nidhan

Mangal murati Ram dulare
Aan pada ab tere dware

He Bajrangbali Hanuman
He Mahavir karo kalyan

Tere dware jo bhi aaya
Khali nahin koi laut aaya

Tere dware jo bhi aaya
Khali nahin koi laut aaya

Durgam kaj banavan hare
Mangalmay di jo vardaan

Mangal murati Ram dulare
Aan pada ab tere dware

He Bajrangbali Hanuman
He Mahavir karo kalyan

Tera sumiran Hanumat beera
Nase rog hare sab peera

Tera sumiran Hanumat beera
Nase rog hare sab peera

Ram Lakhan Sita man basiya
Sharan pade ka kije dhyan

Mangal murati Ram dulare
Aan pada ab tere dware

He Bajrangbali Hanuman
He Mahavir karo kalyan

## Closing

Karo kalyan
Karo kalyan`,
    translation: `## Chorus

O Bajrangbali Hanuman —
O Mahavir, grant us welfare.

## Verses

The three worlds shine by your light;
You have fulfilled the work of the sorrowful.

The three worlds shine by your light;
You have fulfilled the work of the sorrowful.

O Kesari's son, worshipped by the world —
Remove our pain, O ocean of mercy.

Auspicious form, beloved of Ram —
We have come now to your door.

O Bajrangbali Hanuman —
O Mahavir, grant us welfare.

Whoever has come to your door
Has never returned empty-handed.

Whoever has come to your door
Has never returned empty-handed.

You make hard tasks easy;
You give the blessing of auspicious good.

Auspicious form, beloved of Ram —
We have come now to your door.

O Bajrangbali Hanuman —
O Mahavir, grant us welfare.

Remembering you, O brave Hanuman,
Disease is destroyed and all pain is removed.

Remembering you, O brave Hanuman,
Disease is destroyed and all pain is removed.

Ram, Lakshman and Sita dwell in your heart —
Care for those who take your refuge.

Auspicious form, beloved of Ram —
We have come now to your door.

O Bajrangbali Hanuman —
O Mahavir, grant us welfare.

## Closing

Grant us welfare —
Grant us welfare.`,
  },
  "jai-jai-hanuman-gusain-hariharan": {
    title: "Jai Jai Hanuman Gusain",
    alternate_title: "Jai Jai Jai Hanuman Gosai",
    artist_version: "Hariharan",
    audio_url:
      "/audio/albums/shree-hanuman-chalisa-hariharan/06-jai-jai-hanuman-gusain.mp3",
    thumbnail_url: "/images/albums/shree-hanuman-chalisa-hariharan.png",
    cover_url: "/images/albums/shree-hanuman-chalisa-hariharan-player-cover.png",
    display_order: 25,
    category_slugs: [
      "hanuman",
      "general",
      "satsang",
      "bhajan",
      "devotion",
      "hindi",
    ],
    meaning:
      "Jai Jai Jai Hanuman Gosai — a prayer for Hanuman's grace, asking him to remove distress and carry the devotee's plea to Ram. From Hariharan's 1993 T-Series album.",
    roman_lyrics: `## Opening

Devi haro Hanuman Mahaprabhu
Jo kachhu sankat hoye hamaro

Kaun so sankat mor garib ko
Jo tumso nahin jaat hai taro

## Chorus

Jai jai jai Hanuman Gosai
Kripa karo Maharaj

Jai jai jai Hanuman Gosai
Kripa karo Maharaj

## Verses

Tan mein tumhare shakti viraje
Man bhakti se bheena

Jo jan tumhari sharan mein aaye
Dukh darad har leena

Hanumat dukh darad har leena

Mahavir Prabhu hum dukhiyana ke
Tum ho garib nivaz Hanumat

Jai jai jai Hanuman Gosai
Kripa karo Maharaj

Ram Lakhana Vaidehi tum par
Sada rahe harshaye

Hriday cheer ke Ram Siya ka
Darshan diya karai Hanumat

Do kar jodh araj Hanumanta
Kahiyo Prabhu se aaj Hanumat

Kahiyo Prabhu se aaj Hanumat

## Closing

Jai jai jai Hanuman Gosai
Kripa karo Maharaj

Jai jai jai Hanuman Gosai`,
    translation: `## Opening

O merciful Hanuman Mahaprabhu —
Remove whatever distress is ours.

What crisis of this poor one
Cannot be removed by you?

## Chorus

Glory, glory, glory to Hanuman Gosai —
Grant your grace, O Maharaj.

Glory, glory, glory to Hanuman Gosai —
Grant your grace, O Maharaj.

## Verses

Your power shines in the body;
The mind is soaked in devotion.

Whoever takes refuge in you —
You take away their sorrow and pain.

Hanuman takes away sorrow and pain.

O Mahavir, Lord of us who suffer —
You are the protector of the poor, O Hanumat.

Glory, glory, glory to Hanuman Gosai —
Grant your grace, O Maharaj.

May Ram, Lakshman and Vaidehi
Always rejoice over you.

Tearing open the heart, show us
The vision of Ram and Sita, O Hanumat.

With folded hands I pray, O Hanuman —
Tell the Lord today, O Hanumat.

Tell the Lord today, O Hanumat.

## Closing

Glory, glory, glory to Hanuman Gosai —
Grant your grace, O Maharaj.

Glory, glory, glory to Hanuman Gosai.`,
  },
  "mangalmurti-maruti-nandan-hariharan": {
    title: "Mangalmurti Maruti Nandan",
    artist_version: "Hariharan",
    audio_url:
      "/audio/albums/shree-hanuman-chalisa-hariharan/07-mangalmurti-maruti-nandan.mp3",
    thumbnail_url: "/images/albums/shree-hanuman-chalisa-hariharan.png",
    cover_url: "/images/albums/shree-hanuman-chalisa-hariharan-player-cover.png",
    display_order: 26,
    category_slugs: ["hanuman", "general", "satsang", "bhajan", "devotion", "hindi"],
    meaning:
      "Mangal Murti Maaruti Nandan — auspicious form, son of Maruti, destroyer of all inauspiciousness. Hariharan, Gulshan Kumar / T-Series album.",
    roman_lyrics: `## Chorus

Mangal Murti Maaruti Nandan
Sakal Amangal Mool Nikandan

## Verses

Pavan Tanay Santan Hitkaari
Hriday Viraajat Avadh Bihaari
Mangal Murti Maaruti Nandan
Sakal Amangal Mool Nikandan

Maat Pita Guru Ganpati Shaarad
Shivaa Samet Shambhu Shuk Naarad
Mangal Murti Maaruti Nandan
Sakal Amangal Mool Nikandan

Charan Kamal Bandau Sab Kaahu
Dehu Raampad Nehu Nibhaahu
Mangal Murti Maaruti Nandan
Sakal Amangal Mool Nikandan

Jai Jai Jai Hanuman Gosai
Kripa Karo Gurudev Ki Naai
Mangal Murti Maaruti Nandan
Sakal Amangal Mool Nikandan

Bandau Raam Lakhan Baidhehi
Yeh Tulsi Ke Param Sanehi
Mangal Murti Maaruti Nandan
Sakal Amangal Mool Nikandan`,
    translation: `## Chorus

Auspicious form, son of Maruti
Root-destroyer of all inauspiciousness

## Verses

Son of the Wind, benefactor of the saints
In your heart shines the Lord of Avadh
Auspicious form, son of Maruti
Root-destroyer of all inauspiciousness

Mother, father, Guru, Ganpati, Sharada
Along with Shiva, Shambhu, Shuk and Narad
Auspicious form, son of Maruti
Root-destroyer of all inauspiciousness

I bow to the lotus feet of them all
Grant me lasting love for Ram's feet
Auspicious form, son of Maruti
Root-destroyer of all inauspiciousness

Glory, glory, glory to Hanuman Gosai
Bless me with a Guru's compassionate glance
Auspicious form, son of Maruti
Root-destroyer of all inauspiciousness

I bow to Ram, Lakshman and Vaidehi
This is Tulsi's dearest beloved
Auspicious form, son of Maruti
Root-destroyer of all inauspiciousness`,
  },
  "pawansut-vinti-barambar-hariharan": {
    title: "Pawansut Vinti Barambar",
    alternate_title: "Hey Dukh Bhanjan Maruti Nandan",
    artist_version: "Hariharan",
    audio_url:
      "/audio/albums/shree-hanuman-chalisa-hariharan/08-pawansut-vinti-barambar.mp3",
    thumbnail_url: "/images/albums/shree-hanuman-chalisa-hariharan.png",
    cover_url: "/images/albums/shree-hanuman-chalisa-hariharan-player-cover.png",
    display_order: 27,
    category_slugs: ["hanuman", "general", "satsang", "bhajan", "devotion", "hindi"],
    meaning:
      "Hey Dukh Bhanjan Maruti Nandan — Pawansut Vinti Barambar, a repeated prayer to the Son of the Wind. Hariharan, Gulshan Kumar / T-Series album.",
    roman_lyrics: `## Chorus

Hey dukh bhanjan Maruti Nandan
Sun lo meri pukar
Pawansut vinti baarambaar
Pawansut vinti barambar

## Verses

Ast siddhi naw nidhi ke data
Dukhiyon ke tum bhagya vidhata
Siya Ram ke kaj sawaren
Mera kar uddhar
Pawansut vinti barambar

Hey dukh bhanjan Maruti Nandan
Sun lo meri pukar
Pawansut vinti baarambaar
Pawansut vinti barambar

Aprampar hai shakti tumhari
Tum par reejhe Awadh Bihari
Bhakti bhav se dhyaoo tohe
Kar dukhho se par
Pawansut vinti baarambaar

Hey dukh bhanjan Maruti Nandan
Sun lo meri pukar
Pawansut vinti baarambaar
Pawansut vinti barambar

Japu nirantar naam tihaara
Ab nahi chodun tera dwar
Ram bhakt mohe sharan me lije
Bhav saagar se taar
Pawansut vinti baarambaar

## Closing

Hey dukh bhanjan Maruti Nandan
Sun lo meri pukar
Pawansut vinti baarambaar`,
    translation: `## Chorus

O remover of sorrow, son of Maruti
Hear my call
Son of the Wind, this prayer again and again
Son of the Wind, this prayer again and again

## Verses

Giver of eight siddhis and nine treasures
You are the destiny-maker of the sorrowful
You fulfil the work of Sita and Ram
Grant me deliverance
Son of the Wind, this prayer again and again

O remover of sorrow, son of Maruti
Hear my call
Son of the Wind, this prayer again and again
Son of the Wind, this prayer again and again

Boundless is your power
The Lord of Avadh is pleased with you
With devotion I meditate on you
Carry me across from sorrow
Son of the Wind, this prayer again and again

O remover of sorrow, son of Maruti
Hear my call
Son of the Wind, this prayer again and again
Son of the Wind, this prayer again and again

I chant your name without cease
I will not leave your door now
O devotee of Ram, take me in your refuge
Ferry me across the ocean of existence
Son of the Wind, this prayer again and again

## Closing

O remover of sorrow, son of Maruti
Hear my call
Son of the Wind, this prayer again and again`,
  },
  "shree-hanuman-vandana-hariharan": {
    title: "Shree Hanuman Vandana",
    alternate_title: "Charan Sharan Mein Aayi Ke",
    artist_version: "Hariharan",
    audio_url:
      "/audio/albums/shree-hanuman-chalisa-hariharan/09-shree-hanuman-vandana.mp3",
    thumbnail_url: "/images/albums/shree-hanuman-chalisa-hariharan.png",
    cover_url: "/images/albums/shree-hanuman-chalisa-hariharan-player-cover.png",
    display_order: 28,
    category_slugs: ["hanuman", "general", "satsang", "bhajan", "devotion", "hindi"],
    meaning:
      "Shree Hanuman Vandana — salutation to Pawanputra Hanuman, asking protection from distress and the gift of Ram devotion. Hariharan, Gulshan Kumar / T-Series album.",
    roman_lyrics: `## Verses

Charan sharan mein aayi ke
Dharun tihara dhyan
Sankat se raksha karo
Sankat se raksha karo
Pawanputra Hanuman

Durgam kaaj banaye ke
Kinhen bhakt nihaal
Ab mori vinti suno
Ab mori vinti suno
He Anjani ke laal

Haath jod vinti karoon
Suno veer Hanuman
Kashton se raksha karo
Kashton se raksha karo
Ram bhakti dehun daan
Pawanputra Hanuman`,
    translation: `## Verses

Coming to the refuge of your feet
I hold your contemplation
Protect me from distress
Protect me from distress
O Pawanputra Hanuman

Making hard tasks easy
You have made devotees blissful
Now hear my prayer
Now hear my prayer
O beloved son of Anjani

With folded hands I pray
Hear me, O brave Hanuman
Protect me from sufferings
Protect me from sufferings
Grant me the gift of Ram devotion
O Pawanputra Hanuman`,
  },
  "shree-hanuman-ji-ki-aarti-hariharan": {
    title: "Shree Hanuman Ji Ki Aarti",
    alternate_title: "Aarti Kije Hanuman Lala Ki",
    artist_version: "Hariharan",
    audio_url:
      "/audio/albums/shree-hanuman-chalisa-hariharan/10-shree-hanuman-ji-ki-aarti.mp3",
    thumbnail_url: "/images/albums/shree-hanuman-chalisa-hariharan.png",
    cover_url: "/images/albums/shree-hanuman-chalisa-hariharan-player-cover.png",
    display_order: 29,
    category_slugs: ["hanuman", "general", "satsang", "aarti", "devotion", "hindi"],
    meaning:
      "Aarti Kije Hanuman Lala Ki — the aarti of Lord Hanuman. Hariharan, Gulshan Kumar / T-Series album.",
    roman_lyrics: `## Refrain

Aarti kije Hanuman lala ki
Dusht dalan Raghunath kala ki

## Verses

Ja ke bal se girivar kaanpe
Rog dosh ja ke nikat na jhaanke

Anjani putra maha baldayi
Santan ke Prabhu sada sahayi

De beera Raghunath pathaye
Lanka jaari Siya sudhi laye

Lanka so kot samudra se khai
Jaat Pavan Sut baar na laye

Lanka jaari asur sab maare
Siya Ramji ke kaaj sanvare

Lakshman moorchit pade sakare
Aan sanjeevan praan ubhare

Paith pataal tori yamkare
Ahiravan ke bhuja ukhare

Baayen bhuja asur dal mare
Daayen bhuja sab santa jana tare

Sur nar munijan aarti utare
Jai jai jai Hanuman uchare

Kanchan thaar kapoor lo chhai
Aarti karat Anjani mai

Jo Hanumanji ki aarti gaave
Basi Baikuntha amar pad pave

Lanka vidhvans kiye Raghurai
Tulsidas Swami aarti gaaiye

## Closing

Aarti kije Hanuman lala ki
Dusht dalan Raghunath kala ki

Pavan Tanay sankat haran, mangal murti roop
Ram Lakhan Sita sahit, hriday basahu Sur Bhoop`,
    translation: `## Refrain

Perform the aarti of dear Hanuman
Destroyer of the wicked, power of Raghunath

## Verses

By whose strength the great mountains tremble
Near whom disease and fault dare not peek

Son of Anjani, great giver of strength
Lord of the saints, always their helper

The brave one was sent by Raghunath
He burned Lanka and brought news of Sita

Lanka's fort with the ocean for a moat —
Son of the Wind crossed it without delay

He burned Lanka and slew all the demons
And fulfilled the work of Sita and Ram

When Lakshman lay unconscious at dawn
He brought the Sanjivani and saved his life

Entering the netherworld, he broke Death's hold
And tore off Ahiravan's arms

With the left arm he struck down demon hosts
With the right he saved all the saints

Gods, humans and sages offer aarti
Crying glory, glory, glory to Hanuman

On a golden platter, camphor flame alight
Mother Anjani performs the aarti

Whoever sings Hanuman's aarti
Dwells in Vaikuntha and attains the immortal state

Raghurai destroyed Lanka
Tulsidas Swami has sung this aarti

## Closing

Perform the aarti of dear Hanuman
Destroyer of the wicked, power of Raghunath

Son of the Wind, remover of distress, embodiment of auspicious form
Dwell in my heart with Ram, Lakshman and Sita, O King of the gods`,
  },
  "he-parmeshwar-vishwa-vidhaata-hari-om-sharan": {
    title: "He Parmeshwar Vishwa Vidhaata",
    alternate_title: "Prarthana · Aarti Archan",
    artist_version: "Hari Om Sharan",
    audio_url:
      "/audio/albums/aarti-archan-hari-om-sharan/01-he-parmeshwar-vishwa-vidhaata.mp3",
    cover_url: "/images/albums/aarti-archan-player-cover.png",
    thumbnail_url: "/images/albums/aarti-archan-library.png",
    display_order: 60,
    category_slugs: [
      "general",
      "satsang",
      "morning-prayer",
      "evening-prayer",
      "bhajan",
      "devotion",
      "hindi",
    ],
    meaning:
      "Opening prarthana from Aarti Archan — surrender to the Creator of the universe, asking for mercy, peace, and upliftment.",
    roman_lyrics: `## Chorus

He Parmeshwar Vishwa Vidhata
Mam vandan sweekar karo
He paripuran Brahma he Data
Deenan ka uddhar karo

## Verses

He karunamaya he sukhkari
Sukh shantimaya bhav bhaya hari
Tera sumiran man ko bhata
Nath kripa ek baar karo

He sarvagya sahayak Swami
Prem puneet he Antaryami
Sharan ho tera naam pukarta
Ab to daya Kartaar karo

Bhet karun kya kuchh nahi mera
Tujhe samarpit jeevan tera
Rahoon yahi anand manata
He Prabhu pavan pyar varo`,
    translation: `## Chorus

O Supreme Lord, Creator of the universe
Please accept my homage
O complete Brahman, O Giver
Uplift the lowly and helpless

## Verses

O Compassionate One, O bestower of joy
Full of peace, remover of worldly fear
Your remembrance is dear to the mind
O Lord, grant your grace just once

O all-knowing Helper, O Master
Pure love, O Inner Dweller
Taking refuge, I call your name
Now, O Creator, show mercy

What offering have I? Nothing of my own
This life of yours I surrender to you
I remain content in this joy alone
O holy Lord, bestow your pure love`,
  },
  "nish-din-namoon-ganpati-hari-om-sharan": {
    title: "Nish Din Namoon Ganpati",
    alternate_title: "Shri Ganesh Vandana · Aarti Archan",
    artist_version: "Hari Om Sharan",
    audio_url:
      "/audio/albums/aarti-archan-hari-om-sharan/02-nish-din-namoon-ganpati.mp3",
    cover_url: "/images/albums/aarti-archan-player-cover.png",
    thumbnail_url: "/images/albums/aarti-archan-library.png",
    display_order: 61,
    category_slugs: [
      "ganesh",
      "general",
      "satsang",
      "bhajan",
      "devotion",
      "hindi",
    ],
    meaning:
      "Hari Om Sharan's Ganesh vandana — day and night bowing at Ganpati's feet for strength, wisdom, and freedom from sorrow.",
    roman_lyrics: `## Chorus

Nis din namoon Ganpati charan
Nis din namoon Ganpati charan
Ganpati charan jag dukh haran
Ganpati charan jag dukh haran

## Verses

Santaap sab man ke haren
Mangal sada Ganpati karen
Man kar raha pratah smaran
Nis din namoon Ganpati charan

Bal buddhi ke tum Devata
Bhar bhakti hriday sevata
Shankar suvan taran karan
Nis din namoon Ganpati charan

Tumhari kripa beant hai
Dukhiyon pe tu dayavant hai
Hum aa gaye teri sharan
Nis din namoon Ganpati charan`,
    translation: `## Chorus

Day and night I bow at Ganpati's feet
Day and night I bow at Ganpati's feet
Ganpati's feet remove the world's sorrow
Ganpati's feet remove the world's sorrow

## Verses

He removes all anguish of the mind
Ganpati always brings auspiciousness
The mind offers morning remembrance
Day and night I bow at Ganpati's feet

You are the deity of strength and intellect
Filled with devotion, the heart serves you
Son of Shankar, savior and redeemer
Day and night I bow at Ganpati's feet

Your grace is endless
You are merciful to the suffering
We have come to your refuge
Day and night I bow at Ganpati's feet`,
  },
  "jai-jai-aarti-sab-mil-gaven-hari-om-sharan": {
    title: "Jai Jai Aarti Sab Mil Gaven",
    alternate_title: "Shri Ganeshji Ki Aarti · Aarti Archan",
    artist_version: "Hari Om Sharan",
    audio_url:
      "/audio/albums/aarti-archan-hari-om-sharan/03-jai-jai-aarti-sab-mil-gaven.mp3",
    cover_url: "/images/albums/aarti-archan-player-cover.png",
    thumbnail_url: "/images/albums/aarti-archan-library.png",
    display_order: 62,
    category_slugs: [
      "ganesh",
      "general",
      "satsang",
      "aarti",
      "bhajan",
      "devotion",
      "hindi",
    ],
    meaning:
      "Congregational Ganesh aarti from Aarti Archan — praise of Ekadant Vinayak, remover of obstacles.",
    roman_lyrics: `## Chorus

Jai jai aarti sab mil gaaven
Stuti karen Shri Ganpati ki
Mangal aarti sab mil gaaven
Vighn haran Shri Ganpati ki

## Verses

Ekadant gajvadan Vinayak
Trinayan roop siddhi sukhdayak
Devta saare sheesh jhukaaven
Stuti karen Shri Ganpati ki

Dhup deep lep phool ki mala
Modak bhog sajayo thala
Charan kamal naivedya chadhaaven
Stuti karen Shri Ganpati ki

Riddhi Siddhi chavar dulaaven
Charo Ved khade gun gaaven
Brahma Vishnu Mahesh manaaven
Stuti karen Shri Ganpati ki

Jo pujen nit Ganpati Raya
Manvanchhit phal unne paya
Om Sharan ho bali bali dhyaaven
Stuti karen Shri Ganpati ki`,
    translation: `## Chorus

Victory! Together we sing the aarti
We praise Lord Ganpati
Together we sing the auspicious aarti
Of Ganpati, remover of obstacles

## Verses

One-tusked, elephant-faced Vinayak
Three-eyed form, giver of success and joy
All the gods bow their heads
We praise Lord Ganpati

Incense, lamp, paste, and flower garland
Modak offerings arranged on the plate
We offer naivedya at his lotus feet
We praise Lord Ganpati

Riddhi and Siddhi wave the fly-whisks
The four Vedas stand and sing his virtues
Brahma, Vishnu, and Mahesh honor him
We praise Lord Ganpati

Whoever worships Lord Ganpati daily
Receives the fruit their heart desires
Om Sharan meditates, offering life again and again
We praise Lord Ganpati`,
  },
  "jai-lakshmi-kalyanji-maiya-nandini-sharan": {
    title: "Jai Lakshmi Kalyanji Maiya",
    alternate_title: "Lakshmi Vandana · Aarti Archan",
    artist_version: "Nandini Sharan",
    audio_url:
      "/audio/albums/aarti-archan-hari-om-sharan/04-jai-lakshmi-kalyanji-maiya.mp3",
    cover_url: "/images/albums/aarti-archan-player-cover.png",
    thumbnail_url: "/images/albums/aarti-archan-library.png",
    display_order: 63,
    category_slugs: [
      "lakshmi",
      "general",
      "satsang",
      "bhajan",
      "devotion",
      "hindi",
    ],
    meaning:
      "Nandini Sharan's Lakshmi vandana — praise of Mother Lakshmi who sets right broken affairs and opens the doors of joy.",
    roman_lyrics: `## Chorus

Jai Lakshmi Kalyani Maiya
Jai Lakshmi Kalyani
Jai Lakshmi Kalyani Maiya

Sab aaye sharan tihari Maiya
De darshan Maharani
De darshan Maharani

Jai Lakshmi Kalyani Maiya
Jai Lakshmi Kalyani

## Verses

Tu mangalmay pavan Maiya
Kripa sada barsave
Deen dukhi sharanagat jaan ke
Bigde kaaj banave
Tu anant mahadani Maiya
Jai Lakshmi Kalyani

Dev sabhi aradhan karte
Rishi muni dhyan lagate
Is nashwar sansar ke prani
Teri kirti gaate
Tu Devi vardani Maiya
Jai Lakshmi Kalyani

Tu raazi jispe ho jaave
Khole sukh ke dware
Man mein jagave gyan ki jyoti
Har leti andhiyare
Tu jyotirmayi Shivani Maiya
Jai Lakshmi Kalyani`,
    translation: `## Chorus

Victory to Mother Lakshmi, the auspicious one
Victory to auspicious Lakshmi
Victory to Mother Lakshmi, the auspicious one

All have come to your refuge, Mother
Grant us your darshan, O Queen
Grant us your darshan, O Queen

Victory to Mother Lakshmi, the auspicious one
Victory to auspicious Lakshmi

## Verses

You are pure and auspicious, Mother
You always shower grace
Knowing the poor and suffering as your sheltered ones
You set right affairs gone wrong
You are the infinite great giver, Mother
Victory to auspicious Lakshmi

All the gods worship you
Sages and seers fix their meditation on you
Beings of this perishable world
Sing your glory
You are the boon-giving Goddess, Mother
Victory to auspicious Lakshmi

On whom you become pleased
You open the doors of happiness
In the mind you awaken the light of wisdom
And take away the darkness
You are radiant Shivani, Mother
Victory to auspicious Lakshmi`,
  },
  "lakshmi-maiya-utaren-teri-aarti-hari-om-sharan": {
    title: "Lakshmi Maiya Utaren Teri Aarti",
    alternate_title: "Lakshmi Ji Ki Aarti · Aarti Archan",
    artist_version: "Hari Om Sharan & Nandini Sharan",
    audio_url:
      "/audio/albums/aarti-archan-hari-om-sharan/05-lakshmi-maiya-utaren-teri-aarti.mp3",
    cover_url: "/images/albums/aarti-archan-player-cover.png",
    thumbnail_url: "/images/albums/aarti-archan-library.png",
    display_order: 64,
    category_slugs: [
      "lakshmi",
      "general",
      "satsang",
      "aarti",
      "bhajan",
      "devotion",
      "hindi",
    ],
    meaning:
      "Lakshmi aarti from Aarti Archan — offering the lamp and asking Mother to shower grace and ferry the boat of sorrow.",
    roman_lyrics: `## Chorus

Lakshmi Maiya utaren teri aarti
Barsa do Maa kripa
Sabki naiya dukhon se tu hi taarti
Barsa do Maa kripa

## Verses

Ann dhan dene wali tuhi
Tuhi jag ko paale
Daya se teri hum sab jeeven
Sabko tu sambhaale

Teri bhakti jaagi dil mein
Nishdin karte vandan
Tu hai Shakti Parmeshwar ki
Kaato bhav ke bandhan

Prem ka deep jala ke Maiya
Aarti teri utaren
He jag jyoti kasht nivarini
Har lena andhiyari

Sharan tihari aaye Maiya
Mangal keerat gaayen
Haath jod hum vinti karte
Charan sheesh jhukaayen`,
    translation: `## Chorus

Mother Lakshmi, we offer your aarti
Shower your grace, Mother
You alone ferry everyone's boat from sorrow
Shower your grace, Mother

## Verses

You alone give food and wealth
You alone nurture the world
By your mercy we all live
You sustain everyone

Devotion to you has awakened in the heart
Day and night we offer homage
You are the power of the Supreme Lord
Cut the bonds of worldly existence

Lighting the lamp of love, Mother
We offer your aarti
O light of the world, remover of suffering
Take away the darkness

We have come to your refuge, Mother
We sing auspicious praise
With folded hands we make our plea
And bow our heads at your feet`,
  },
  "jinke-hriday-shriram-rame-hari-om-sharan": {
    title: "Jinke Hriday Shriram Rame",
    alternate_title: "Shriram Mahima · Aarti Archan",
    artist_version: "Hari Om Sharan",
    audio_url:
      "/audio/albums/aarti-archan-hari-om-sharan/06-jinke-hriday-shriram-rame.mp3",
    cover_url: "/images/albums/aarti-archan-player-cover.png",
    thumbnail_url: "/images/albums/aarti-archan-library.png",
    display_order: 65,
    category_slugs: [
      "ram",
      "general",
      "satsang",
      "ram-navami",
      "bhajan",
      "devotion",
      "hindi",
    ],
    meaning:
      "Shriram Mahima — those who keep Ram in the heart lack nothing; his name liberates saints and devotees.",
    roman_lyrics: `## Chorus

Jinke hriday Ram rame
Unhen kahe ki kami
Unko kahe ki kami
Unko kahe ki kami

Japle Ram Siya Ram
Bolo Ram Siya Ram
Jai jai Ram Siya Ram

## Verses

Ram ki mahima jo nit gaaye
Unke bhagya hain bhari
Ramayan ka path jo karte
Unki main balihari
Jinke hriday Ram laganiya
Aathon yaam lagi
Unko kahe ki kami

Ram naam Tulsi ne gaaya
Bhavsagar bhay paara
Ram naam nit jape Kabira
Bhaya Ram deedara
Ram chunariya odh ke Meera
Joganiya bani
Usko kahe ki kami

Ram rachaiya saare jag ka
Sabka jeevan data
Wohi bandhu pran atma
Guru pita aur mata
Unki sharan mein lago bhaiya
Unsa koi nahi
Phir to kahe ki kami`,
    translation: `## Chorus

Those in whose hearts Ram dwells
What lack do they have?
What lack do they have?
What lack do they have?

Chant Ram Siya Ram
Say Ram Siya Ram
Glory, glory to Ram Siya Ram

## Verses

Those who sing Ram's glory daily
Their fortune is abundant
Those who recite the Ramayan
I am devoted to them
Those with Ram's love in the heart
Through all eight watches of the day
What lack do they have?

Tulsi sang the name of Ram
And crossed the fearful ocean of existence
Kabir chanted Ram's name daily
And beheld Ram's vision
Meera, wrapping herself in Ram's veil
Became a yogini
What lack did she have?

Ram is the maker of the whole world
Giver of life to all
He alone is friend, life-breath, soul
Guru, father, and mother
Take refuge in him, brother
There is none like him
Then what lack can there be?`,
  },
  "aarti-kije-shri-raghuvar-ki-hari-om-sharan": {
    title: "Aarti Kije Shri Raghuvar Ki",
    alternate_title: "Shriramji Ki Aarti · Aarti Archan",
    artist_version: "Hari Om Sharan & Nandini Sharan",
    audio_url:
      "/audio/albums/aarti-archan-hari-om-sharan/07-aarti-kije-shri-raghuvar-ki.mp3",
    cover_url: "/images/albums/aarti-archan-player-cover.png",
    thumbnail_url: "/images/albums/aarti-archan-library.png",
    display_order: 66,
    category_slugs: [
      "ram",
      "general",
      "satsang",
      "aarti",
      "ram-navami",
      "bhajan",
      "devotion",
      "hindi",
    ],
    meaning:
      "Ram aarti from Aarti Archan — praise of Raghuvar, Dasharath's son and Sita's lord, Maryada Purushottam.",
    roman_lyrics: `## Chorus

Aarti kije Shri Raghuvar ki
Dashrath nandan Sitavar ki
Aarti kije Shri Raghuvar ki
Dashrath nandan Sitavar ki

## Verses

Aarti kije Ram Ramaiya
Antaryami Maryada Purushottam Swami
Ram namami, Ram namami
Ram namami, Ram namami
Sur muni rakshak karuna karki
Aarti kije

Jagpati Surpati deen dayala
Dukh bhaya bhanjan hey sukhpala
Hey jag vandit Raghuvar lala
Hey jag vandit Raghuvar lala
Sat chit anand Shiv sundar ki
Aarti kije

Sang viraje Janaki Mai
Aaye sang mein teenho bhai
Adbhut shobha varni na jayi
Adbhut shobha varni na jayi
Vishwa Vidhata Prabhu sukhavar ki
Aarti kije

Sagun roop prakate Avinashi
Mangalmay Prabhu shubh sukha raashi
Kar darshan kate lakh chaurasi
Kar darshan kate lakh chaurasi
Sharanagat vatsalay Ishwar ki
Aarti kije

Aisi aarti ki Hanumana
Sharan hoike aap bulana
Siya Ram mai jag pehchana
Siya Ram mai jag pehchana
Raghupati Raghav Hari hit kariki
Aarti kije`,
    translation: `## Chorus

Perform the aarti of Shri Raghuvar
Of Dasharath's son, lord of Sita
Perform the aarti of Shri Raghuvar
Of Dasharath's son, lord of Sita

## Verses

Perform the aarti of dear Ram
The Inner Dweller, Maryada Purushottam, the Master
I bow to Ram, I bow to Ram
I bow to Ram, I bow to Ram
Protector of gods and sages, full of compassion
Perform the aarti

Lord of the world, lord of the gods, merciful to the lowly
Remover of sorrow and fear, guardian of joy
O Raghuvar Lala, praised by the world
O Raghuvar Lala, praised by the world
Of Truth-Consciousness-Bliss, auspicious and beautiful
Perform the aarti

Beside him sits Mother Janaki
With him come all three brothers
Such wondrous beauty cannot be described
Such wondrous beauty cannot be described
Of the Creator of the universe, giver of bliss
Perform the aarti

The Imperishable appears in form with attributes
Auspicious Lord, treasure of sacred joy
His darshan cuts eighty-four lakh births
His darshan cuts eighty-four lakh births
Of the Lord tender to those who take refuge
Perform the aarti

Such an aarti Hanuman performed
Taking refuge, he called You near
Through Sita-Ram I came to know the world
Through Sita-Ram I came to know the world
For the good of Raghupati Raghav Hari
Perform the aarti`,
  },
  "mateshwari-jagdambike-nandini-sharan": {
    title: "Mateshwari Jagdambike",
    alternate_title: "Jagdamba Vandana · Aarti Archan",
    artist_version: "Nandini Sharan",
    audio_url:
      "/audio/albums/aarti-archan-hari-om-sharan/08-mateshwari-jagdambike.mp3",
    cover_url: "/images/albums/aarti-archan-player-cover.png",
    thumbnail_url: "/images/albums/aarti-archan-library.png",
    display_order: 67,
    category_slugs: [
      "durga",
      "general",
      "satsang",
      "bhajan",
      "devotion",
      "hindi",
    ],
    meaning:
      "Nandini Sharan's Jagdamba vandana — surrender to Jagat Janani, Mother as Adi Shakti in all forms.",
    roman_lyrics: `## Opening

Saras supavan Shakti he
Tejomayi apaar
He anand swarupini
Mam hriday kar ujiyar

## Chorus

Jagdambike jai jai Jag Janani Maa

Kya manhar naam suhaya hai
Varun sab kuchh Maa charnon par
Mere man ko ye bhaya hai

## Verses

He prempunj he karunamayi
He Adi Shakti Jag Janani Maa
Tera varad hast mere sheesh rahe
Balak tere charnon mein aaya hai

Gurudev ke andar baith ke Maa
Tumne khelon ko khela tha
Us manjul vesh mein aa karke
Patiton ko gale lagaya hai
Dukhiyon ko gale lagaya hai

Shri Ram tuhi Shri Krishna tuhi
Durga Kali Shri Radha tu
Brahma Vishnu Shiv Shankar mein
Tera hi tej samaya hai

Ho namaskar mera baar baar
He Shakti tihare charnon mein
Mujh adham patit dukhiyare ko
Karuna kar hriday lagaya hai

Maa jo paaun tumse paaun
Jo deve usmein harshaaun
Kuchh rahe na mera apnapan
Maine sarvasva chadaya hai

Jai jai Maa jai jai Maa`,
    translation: `## Opening

O sweet, sacred Power
Radiant beyond measure
O embodiment of bliss
Illuminate my heart

## Chorus

Victory, victory to Jagadambika, Mother of the world

How pleasing is your heart-captivating name
I offer everything at Mother's feet
This is dear to my mind

## Verses

O mass of love, O compassionate one
O primal Power, Mother of the world
May your blessing hand rest on my head
This child has come to your feet

Sitting within the Guru, Mother
You played your divine play
Coming in that graceful form
You embraced the fallen
You embraced the sorrowful

You alone are Shri Ram, you alone Shri Krishna
You are Durga, Kali, and Shri Radha
In Brahma, Vishnu, and Shiv Shankar
Your own radiance abides

My salutations again and again
O Power, at your feet
To me, lowly, fallen, and sorrowful
You compassionately drew me to your heart

Mother, whatever I receive, may I receive from you
Whatever you give, may I rejoice in it
Let no sense of "mine" remain
I have offered my all

Victory, victory, Mother`,
  },
  "jai-ambe-durge-maiya-hari-om-sharan": {
    title: "Jai Ambe Durge Maiya",
    alternate_title: "Ambe Maiya Ki Aarti · Aarti Archan",
    artist_version: "Hari Om Sharan & Nandini Sharan",
    audio_url:
      "/audio/albums/aarti-archan-hari-om-sharan/09-jai-ambe-durge-maiya.mp3",
    cover_url: "/images/albums/aarti-archan-player-cover.png",
    thumbnail_url: "/images/albums/aarti-archan-library.png",
    display_order: 68,
    category_slugs: [
      "durga",
      "general",
      "satsang",
      "aarti",
      "bhajan",
      "devotion",
      "hindi",
    ],
    meaning:
      "Ambe Maiya aarti from Aarti Archan — classic praise of Mother Durga's form, victories, and maternal grace.",
    roman_lyrics: `## Chorus

Jai Ambe Gauri
Maiya jai Shyama Gauri
Tumko nishdin dhyavat
Hari Brahma Shivri
Om jai Ambe Gauri

## Verses

Maang sindoor virajat
Tiko mrigmad ko
Ujjwal se dou naina
Chandravadan niko
Om jai Ambe Gauri

Kanak saman kalevar
Raktambar raje
Rakt pushp gal mala
Kanthan par saje
Om jai Ambe Gauri

Kehari vahan rajat
Khadag khappar dhari
Sur nar muni jan sevat
Tinake dukh hari
Om jai Ambe Gauri

Kanak kundal shobhit
Nasagre moti
Kotik chandra divakar
Rajat sam jyoti
Om jai Ambe Gauri

Shumbh Nishumbh bidare
Mahishasur ghati
Dhumr vilochan naina
Nishdin madmati
Om jai Ambe Gauri

Chand Mund sanhare
Shonit bij hare
Madhu Kaitabh dou mare
Sur bhayahin kare
Om jai Ambe Gauri

Brahmani Rudrani
Tum Kamala Rani
Agam nigam bakhani
Tum Shiv patarani
Om jai Ambe Gauri

Tum hi jag ki Mata
Tum hi ho Bharata
Bhaktan ki dukh harta
Sukh sampati karta
Om jai Ambe Gauri

Kanchan thal virajat
Agar kapur bati
Shri Malketu mein rajat
Koti ratan jyoti
Om jai Ambe Gauri

Shri Ambeji ki aarti
Jo koi nar gaave
Kahat Shivanand Swami
Sukh sampatti paave
Om jai Ambe Gauri`,
    translation: `## Chorus

Victory to Ambe Gauri
Victory to dark-complexioned Gauri, Mother
Day and night Hari, Brahma, and Shiva
Meditate upon you
Om, victory to Ambe Gauri

## Verses

Vermilion adorns your hair-parting
A musk tilak on your brow
Both eyes brightly shining
Your moon-face is most lovely
Om, victory to Ambe Gauri

Your body is like gold
Red garments grace you
A garland of red flowers
Adorns your neck
Om, victory to Ambe Gauri

Mounted on the lion you shine
Holding sword and skull-cup
Gods, humans, and sages serve you
You remove their sorrows
Om, victory to Ambe Gauri

Earrings adorn your ears
A pearl at the tip of your nose
Your radiance equals
Millions of moons and suns
Om, victory to Ambe Gauri

You tore apart Shumbh and Nishumbh
Slayer of Mahishasura
Smoke-eyed, ever
Intoxicated with divine fury
Om, victory to Ambe Gauri

You destroyed Chand and Mund
Ended Shonit Bija
Slew Madhu and Kaitabh
And freed the gods from fear
Om, victory to Ambe Gauri

You are Brahmani and Rudrani
You are Kamala, the queen
Praised by Agama and Nigama
You are Shiva's consort-queen
Om, victory to Ambe Gauri

You alone are Mother of the world
You alone are the sustainer
Remover of devotees' sorrow
Giver of joy and prosperity
Om, victory to Ambe Gauri

A golden plate shines
With agar and camphor wick
Upon Shri Malketu it gleams
With the light of countless jewels
Om, victory to Ambe Gauri

Whoever sings Mother Ambe's aarti
Says Swami Shivananda
Attains happiness and prosperity
Om, victory to Ambe Gauri`,
  },
  "shiv-bhola-bhandari-he-hari-om-sharan": {
    title: "Shiv Bhola Bhandari He",
    alternate_title: "Shiv Vandan · Aarti Archan",
    artist_version: "Hari Om Sharan",
    audio_url:
      "/audio/albums/aarti-archan-hari-om-sharan/10-shiv-bhola-bhandari-he.mp3",
    cover_url: "/images/albums/aarti-archan-player-cover.png",
    thumbnail_url: "/images/albums/aarti-archan-library.png",
    display_order: 69,
    category_slugs: [
      "shiva",
      "general",
      "satsang",
      "bhajan",
      "devotion",
      "hindi",
    ],
    meaning:
      "Shiv vandana — victory to simple, generous Bhola Bhandari who awakens the mantra and opens the door of liberation.",
    roman_lyrics: `## Chorus

Jai Bhola Bhandari Shivhar
Jai Bhola Bhandari
Jai Kailashpati Shiv Shankar
Sab jag ke hitkari
Jai Bhola Bhandari Shivhar
Jai Bhola Bhandari

## Verses

Nishdin tera dhyan karen hum
Sumiren mantra tihara
He Shiv Shankar mantra jagao
Hove ghat ujiyara
Namami Shankar namami Shankar
Kripa karo Tripurari

Shankhnaad se shabd jagaakar
Swar sangeet bahaya
Yug yug se yeh srishti naache
Aisa damaru bajaya
Teri yaad bhula ke jag mein
Dukh paaven sansari

Teeno taap haran kar leta
Yeh trishul tihara
Tera naam jape se jag mein
Milta mukti dwara
Mahadev Parabrahma Vidhata
Aaye sharan tihari`,
    translation: `## Chorus

Victory to Bhola Bhandari, Shivhar
Victory to Bhola Bhandari
Victory to Kailash's lord, Shiv Shankar
Benefactor of the whole world
Victory to Bhola Bhandari, Shivhar
Victory to Bhola Bhandari

## Verses

Day and night we meditate on you
We remember your mantra
O Shiv Shankar, awaken the mantra
Let the inner self be illuminated
I bow to Shankar, I bow to Shankar
Grant grace, O Tripurari

With the conch's roar you awoke sound
And poured forth melody
Age after age this creation dances
To such a damaru as you play
Forgetting your remembrance in the world
Worldly beings suffer

It removes the three afflictions
This trident of yours
By chanting your name in the world
One finds the door of liberation
Mahadev, Supreme Brahman, Creator
We have come to your refuge`,
  },
  "om-jai-shiv-shakti-hare-hari-om-sharan": {
    title: "Om Jai Shiv Shakti Hare",
    alternate_title: "Shivji Ki Aarti · Aarti Archan",
    artist_version: "Hari Om Sharan",
    audio_url:
      "/audio/albums/aarti-archan-hari-om-sharan/11-om-jai-shiv-shakti-hare.mp3",
    cover_url: "/images/albums/aarti-archan-player-cover.png",
    thumbnail_url: "/images/albums/aarti-archan-library.png",
    display_order: 70,
    category_slugs: [
      "shiva",
      "general",
      "satsang",
      "aarti",
      "bhajan",
      "devotion",
      "hindi",
    ],
    meaning:
      "Shiva-Shakti aarti from Aarti Archan — Omkara, Ganga-bearer, Girija beside him, liberator from worldly bonds.",
    roman_lyrics: `## Chorus

Om jai Shiv Shakti Hare
Swami jai Shiv Shakti Hare
Mangalmay sukhkari
Aarti teri karen
Om jai Shiv Shakti Hare

## Verses

Omkareshwar he Gangeshwar
Shambho dukhahari
Swami Shambho dukhahari
Tumhari kripa paave
Nishdin sansari
Om jai Shiv Shakti Hare

Rajni nayak mastak chamke
Jatajoot bhari
Swami jatajoot bhari
Shravan sohe kundal
Shobhe Tripurari
Om jai Shiv Shakti Hare

Shool haran trishool liye kar
He damrudhari
Swami he damrudhari
Shankh bajaye jagate
Shiv srishti saari
Om jai Shiv Shakti Hare

Sarp mund ki mala dhare
Vibhuti sarvange
Swami vibhuti sarvange
Sheesh jata se behti
Dukh taarini Gange
Om jai Shiv Shakti Hare

Vaamange Shri Girija sohe
Shakti Jag Mata
Swami Shakti Jag Mata
Ganpati sang viraje
Mangal sukhdata
Om jai Shiv Shakti Hare

Baghambar pitambar dhare
Baithen Mahadeva
Swami baithen Mahadeva
Rishi muni yogi dhyaaven
Dev karen seva
Om jai Shiv Shakti Hare

Amritmay hai naam tihara
Shiv bhav bhay haranam
Swami Shiv bhav bhay haranam
Siddheshwar Mukteshwar
Devatuv sharanam
Om jai Shiv Shakti Hare

Jyotit hove gyan tihara
Toote jag bandhan
Swami toote jag bandhan
Om Sharan balihari
Gaave Shiv vandan
Om jai Shiv Shakti Hare`,
    translation: `## Chorus

Om, victory to Shiva-Shakti Hare
O Master, victory to Shiva-Shakti Hare
Auspicious and joy-giving
We perform your aarti
Om, victory to Shiva-Shakti Hare

## Verses

O Lord of Om, O Lord of Ganga
Shambhu, remover of sorrow
O Master Shambhu, remover of sorrow
May the worldly
Receive your grace day and night
Om, victory to Shiva-Shakti Hare

The moon, lord of night, shines on your brow
Your matted locks are heavy
O Master of the heavy matted locks
Earrings grace your ears
Tripurari shines in beauty
Om, victory to Shiva-Shakti Hare

Remover of pain, trident in hand
O holder of the damaru
O Master, holder of the damaru
Blowing the conch, you awaken
All of Shiva's creation
Om, victory to Shiva-Shakti Hare

You wear a garland of serpents and skulls
Sacred ash on every limb
O Master, ash on every limb
From your matted hair flows
Ganga, who ferries away sorrow
Om, victory to Shiva-Shakti Hare

On your left shines Shri Girija
Shakti, Mother of the world
O Master, Shakti, Mother of the world
With Ganpati you are enthroned
Giver of auspicious joy
Om, victory to Shiva-Shakti Hare

Wearing tiger-skin and yellow cloth
Mahadev is seated
O Master, Mahadev is seated
Sages, seers, and yogis meditate
The gods offer service
Om, victory to Shiva-Shakti Hare

Your name is nectar-filled
Shiva, remover of worldly fear
O Master, remover of worldly fear
Lord of siddhis, Lord of liberation
We take refuge in the Divine
Om, victory to Shiva-Shakti Hare

May your knowledge shine forth
May worldly bonds break
O Master, may worldly bonds break
Om Sharan offers himself completely
And sings this praise of Shiva
Om, victory to Shiva-Shakti Hare`,
  },
  "mere-ke-panchi-pawan-sharma": {
    title: "Mere Ke Panchi",
    alternate_title: "Pinjare Ke Panchhi Re",
    artist_version: "Pawan Sharma",
    audio_url: "https://www.youtube.com/watch?v=FxCZUT00vHM",
    thumbnail_url: "/images/mere-ke-panchi-pawan-sharma.png",
    display_order: 8,
    category_slugs: [
      "general",
      "satsang",
      "funeral",
      "memorial",
      "bhajan",
      "devotion",
      "hindi",
      "funeral-specific",
      "suitable-for-funerals",
    ],
    roman_lyrics: `## Chorus

Pinjare ke panchhi re
Tera dard na jaane koi
Tera dard na jaane koi

Bahar se to khamosh rahe tu
Bahar se to khamosh rahe tu
Bhitar bhitar roye re
Hay e bhitar bhitar roye
Tera dard na jaane koi

## Verses

Kah na sake tu
Apni kahani
Teri bhi panchhi
Kya zindgani re

Kah na sake tu
Apni kahani
Teri bhi panchhi
Kya zindgani re
Vidhi ne teri katha likhi
Aansu mein kalam duboe
Tera dard na jaane koi
Tera dard na jaane koi

Chupake chupake rone wale
Rakhna chhipaake
Dil ke chhale re
Chupake chupake rone wale
Rakhna chhipaake
Dil ke chhale re
Ye patthar ka desh hain pagale
Koi na tera hoy
Tera dard na jaane koi

Pinjare ke panchhi re
Tera dard na jaane koi
Tera dard na jaane koi
Pinjare ke panchhi re`,
    translation: `## Chorus

O bird in the cage
No one knows your pain
No one knows your pain

Outwardly you remain silent
Outwardly you remain silent
Inside you weep and weep
Alas — inside you weep
No one knows your pain

## Verses

You could not tell
Your own story
What kind of life is yours too
O bird

You could not tell
Your own story
What kind of life is yours too
O bird
Destiny wrote your tale
Dipping the pen in tears
No one knows your pain
No one knows your pain

You who weep in secret
Keep hidden
The wounds of the heart
You who weep in secret
Keep hidden
The wounds of the heart
This is a land of stone, O foolish one
No one here is yours
No one knows your pain

O bird in the cage
No one knows your pain
No one knows your pain
O bird in the cage`,
  },
  "melodious-bhajans-10-the-final-edition": {
    title: "Tribute to Shri Prakash Gossai - GTViBEZSC",
    alternate_title: "Melodious Bhajans 10: The Final Edition",
    artist_version: "Shri Prakash Gossai & GT ViBEZ SoundCrew",
    audio_url: "/videos/shri-prakash-gossai-melodious-bhajans-10.mp4",
    thumbnail_url: "/images/shri-prakash-gossai-melodious-bhajans-10.png",
    cover_url: "/images/shri-prakash-gossai-melodious-bhajans-10.png",
    display_order: 4,
    category_slugs: [
      "general",
      "satsang",
      "evening-prayer",
      "bhajan",
      "devotion",
      "hindi",
    ],
    roman_lyrics: "[Video only]",
    meaning:
      "Full CD video — GT ViBEZ SoundCrew (GTViBEZSC) Melodious Bhajans 10: The Final Edition, a tribute to Shri Prakash Gossai. Lyrics are not transcribed; play the video to listen.",
  },
  "holi-khelai-raghuveera": {
    title: "Holi Khelai Raghuveera",
    alternate_title: "Holi Khelai Raghubeer",
    artist_version: "Terry Gajraj",
    audio_url: "https://www.youtube.com/watch?v=nX_XpVUGh2s",
    thumbnail_url: "/images/holi-khelai-raghuveera-terry-gajraj.png",
    display_order: 40,
    category_slugs: [
      "ram",
      "sita",
      "general",
      "holi",
      "satsang",
      "bhajan",
      "devotion",
      "hindi",
    ],
    meaning:
      "A Holi song of Lord Ram playing Phagwah in Ayodhya with his brothers Lakshman, Bharat and Shatrughan, and Sita, on the banks of the Sarju. Sung by Terry Gajraj.",
    roman_lyrics: `## Chorus

Holi khelai Raghuveera awadh mein
Holi khelai Raghubeer

## Verses

Raama ke haath dholak bal sohai
Latchiman haath majeera
Bhaarat Shatruhan lai pichkaaree
Seeta goree rang neeraa

Machee phaagu do-u dal ke beeche
Khelat Sarjoo teraa
Tulasee daas hulse premaatur
Mohi lagan charan kee bheeraa`,
    translation: `## Chorus

Lord Ram (Raghuveera) plays Holi in Awadh (Ayodhya)
Lord Ram (Raghubeer) plays Holi

## Verses

The drum (dholak) looks beautiful in Ram's hands
Lakshman (Ram's brother) holds the majeera (small hand cymbals)
Bharat and Shatrughan (Ram's other two brothers) take the pichkari (colour spray)
Fair Sita is soaked in coloured Holi water

Holi (Phagwah) rises between both sides of the family
They play on the bank of the Sarju river
Tulsidas overflows with love
Longing only for the crowd at the Lord's feet`,
  },
  "oh-maro-maro-pichakari-babla-kanchan": {
    title: "Oh maro maro pichakari",
    alternate_title: "Maro Maro",
    artist_version: "Babla & Kanchan",
    audio_url: "https://www.youtube.com/watch?v=OO79E3BklkU",
    thumbnail_url: "/images/oh-maro-maro-pichakari-babla-kanchan.jpg",
    display_order: 41,
    category_slugs: [
      "krishna",
      "general",
      "holi",
      "satsang",
      "bhajan",
      "devotion",
      "hindi",
    ],
    meaning:
      "Indo-Caribbean Holi / Phagwah chutney by Babla & Kanchan. The pichakari (pichkari) is the colour-spray pump used at Holi — spray so the colour covers a whole lifetime of love.",
    roman_lyrics: `## Refrain

Oh maro maro pichakari
Ke rang jaiye sari umariya hamari
Oh maro maro oh maro maro pichakari

## Verse 1

Bheegi mori sari choli mori bheegi
Ang ang bheego tune vo rama

## Verse 2

Main hoon tori gori chanda ki chakori
Aaja aaja piya ab khelenge Holi

## Verse 3

Din ho ya raat ho haatho mein haatho ho
Raja main toh chaaho jeevan bhar ka saath ho`,
    translation: `## Refrain

Oh spray spray the pump (pichakari = Holi colour spray)
So the colour covers my whole life
Oh spray spray, oh spray spray the pump

## Verse 1

You soaked my dress, you soaked my blouse
You have soaked every part of my body, oh Rama

## Verse 2

I am your beautiful maiden, a bird in love with the moon (chakori)
Come come my love now let us play Holi

## Verse 3

Whether it is day or night, we will be hand in hand
Oh king I want to spend my whole life with you`,
  },
  "radha-kanhaiya-babla-kanchan": {
    title: "Radhā Kanhaiyā",
    alternate_title: "Radha Kaniya",
    artist_version: "Babla & Kanchan",
    audio_url:
      "/audio/folders/chutney-style-bhajan/radha-kanhaiya-babla-kanchan.mp3",
    thumbnail_url: "/images/radha-kanhaiya-babla-kanchan.png",
    cover_url: "/images/radha-kanhaiya-babla-kanchan-player.png",
    mini_cover_url: "/images/radha-kanhaiya-babla-kanchan.png",
    display_order: 42,
    category_slugs: [
      "krishna",
      "radha",
      "general",
      "holi",
      "satsang",
      "bhajan",
      "devotion",
      "hindi",
    ],
    meaning:
      "A popular 1990s chutney by Babla & Kanchan. For Phagwah / Holi and the arrival of spring, it recalls how central the love of Radhā and Krishna is to the season. Kanhaiyā (or Kanhai) is Krishna as a mischievous child and naughty young man — teasing Radhā, troubling friends and neighbours. The song is from Radhā’s side: she asks him to stop messing with her and the gopīs, and still professes her love. It names Brindaban (Vrindavan in Uttar Pradesh), where Krishna spent his childhood, and his muralī / bānsurī (flute).",
    roman_lyrics: `## Refrain

Bansī sajai kē kāhā chupāyo?
Kartī hai tumsē pyār Rādhā Kanhaiyā

## Verse 1

Brindaban kā muralī wālā
Sab kehte hain Nanda Gopālā
Chup chup kē tu na sātā
Oh natkhat orē Kanhaiyā
Kartī hai tumsē pyār Rādhā Kanhaiyā

## Verse 2

Gopīyo ko tu kyu satāwē?
Handīyo sē mākhan churāwē
Matkīyā phorī hazār
Bār bār tu na muralī bajānā
Ab tum hī ho mērā thīkānā
Ghāyal jīyārā hamār`,
    translation: `## Refrain

Where have you hidden your flute after decorating it?
Radha loves you Krishna

## Verse 1

The flute-player of Vrindavan (Brindaban)
Everyone calls you the son of Nanda, the cow-herder (Nanda Gopālā)
Hiding quietly you do not trouble me
Being naughty all over Krishna
Radha loves you Krishna

## Verse 2

Why do you trouble the young milkmaids (gopīs)?
Stealing butter from their baskets
Breaking thousands of butter pots
Again and again you do not play the flute
Now you are my settlement and refuge
My soul and heart are hurt`,
  },
  "chalo-re-sabhi-ram-se-mile-babla-kanchan": {
    title: "Chalo Re Sabhi Ram Se Mile",
    alternate_title: "Hey Siya Ram · Raghu Ram Ayodhya Mein Aaye",
    artist_version: "Babla & Kanchan",
    audio_url: "https://www.youtube.com/watch?v=1wGIgDUk4Xo",
    youtube_url: "https://www.youtube.com/watch?v=1wGIgDUk4Xo",
    thumbnail_url: "/images/chalo-re-sabhi-ram-se-mile-babla-kanchan.jpg",
    cover_url: "/images/chalo-re-sabhi-ram-se-mile-babla-kanchan.jpg",
    mini_cover_url: "/images/chalo-re-sabhi-ram-se-mile-babla-kanchan.jpg",
    display_order: 43,
    category_slugs: [
      "ram",
      "sita",
      "general",
      "satsang",
      "bhajan",
      "devotion",
      "hindi",
    ],
    meaning:
      "Babla & Kanchan chutney-style Ram bhajan — Ram and Sita return to Ayodhya; all go to meet Ram. Bharat weeps and falls at His feet; Lakshman and Mother Kaushalya join the welcome; Kaikeyi regrets; lamps are lit in joy.",
    roman_lyrics: `## Opening

Hey Siya Ram
Hey Ram Ram

## Chorus

Prabhu Ram Ayodhya mein aaye
Chalo re sabhi Ram se mile
Chalo re sabhi Ram se mile
Ram se mile, Siya Ram se mile
Ram se mile, Siya Ram se mile
Raghu Ram Ayodhya mein aaye
Chalo re sabhi Ram se mile
Chalo re sabhi Ram se mile

## Verse 1

Sun ke Bharat ye, mahaliya se nikle
Sun ke Bharat ye, mahaliya se nikle
Nayan neer bahaye
Chalo re sabhi Ram se mile
Chalo re sabhi Ram se mile

## Verse 2

Charanon mein gir gaye, jab re Bharat ji
Charanon mein gir gaye, jab re Bharat ji
Seene se Ram lagaye
Chalo re sabhi Ram se mile
Chalo re sabhi Ram se mile

## Verse 3

Lakhan Laal ji, ro-an laage
Lakhan Laal ji, ro-an laage
Sab ke jee bhar aaye
Chalo re sabhi Ram se mile
Chalo re sabhi Ram se mile

## Verse 4

Mata Kaushalya, aarti utaare
Mata Kaushalya, aarti utaare
Dono ko tilak lagaye
Chalo re sabhi Ram se mile
Chalo re sabhi Ram se mile

## Verse 5

Dukh se bhari, Mata Kaikayi kari thi
Dukh se bhari, Mata Kaikayi kari thi
Baar baar pachhitaye
Chalo re sabhi Ram se mile

## Verse 6

Khushi khushi, sab aur khushi mein
Khushi khushi, sab aur khushi mein
Sab mein deep jalayein
Chalo re sabhi Ram se mile
Chalo re sabhi Ram se mile

## Closing

Ram se mile, Siya Ram se mile
Ram se mile, Siya Ram se mile
Raghu Ram Ayodhya mein aaye
Chalo re sabhi Ram se mile
Chalo re sabhi Ram se mile

Hey Siya Ram
Hey Ram Ram`,
    translation: `## Opening

O Sita-Ram
O Ram, Ram

## Chorus

Lord Ram has come to Ayodhya
Come, everyone — meet Ram
Come, everyone — meet Ram
Meet Ram, meet Sita-Ram
Meet Ram, meet Sita-Ram
Raghu Ram has come to Ayodhya
Come, everyone — meet Ram
Come, everyone — meet Ram

## Verse 1

Hearing this, Bharat came out of the palace
Hearing this, Bharat came out of the palace
Tears flowing from his eyes
Come, everyone — meet Ram
Come, everyone — meet Ram

## Verse 2

When Bharat fell at His feet
When Bharat fell at His feet
Ram held him to His chest
Come, everyone — meet Ram
Come, everyone — meet Ram

## Verse 3

Dear Lakshman began to weep
Dear Lakshman began to weep
Everyone’s heart filled up
Come, everyone — meet Ram
Come, everyone — meet Ram

## Verse 4

Mother Kaushalya offers aarti
Mother Kaushalya offers aarti
She places tilak on both
Come, everyone — meet Ram
Come, everyone — meet Ram

## Verse 5

Filled with sorrow, Mother Kaikeyi who had caused this
Filled with sorrow, Mother Kaikeyi who had caused this
Repents again and again
Come, everyone — meet Ram

## Verse 6

In happiness, everyone in happiness
In happiness, everyone in happiness
Lamps are lit in every home
Come, everyone — meet Ram
Come, everyone — meet Ram

## Closing

Meet Ram, meet Sita-Ram
Meet Ram, meet Sita-Ram
Raghu Ram has come to Ayodhya
Come, everyone — meet Ram
Come, everyone — meet Ram

O Sita-Ram
O Ram, Ram`,
  },
  "aaye-bhi-akela-boodram-holass": {
    title: "Aaye Bhi Akela",
    alternate_title: "Do Din Ki Zindagi Hai · Do Din Ka Mela",
    artist_version: "Boodram Holass",
    audio_url: "https://www.youtube.com/watch?v=LJxGvvdCwAs",
    thumbnail_url: "https://i.ytimg.com/vi/LJxGvvdCwAs/hqdefault.jpg",
    display_order: 55,
    category_slugs: [
      "general",
      "satsang",
      "funeral",
      "memorial",
      "bhajan",
      "devotion",
      "hindi",
      "suitable-for-funerals",
    ],
    meaning:
      "Boodram Holass (Bhajan Bhakti 2023, with Tobago Channa). Life is a short fair of a few days — we come alone and leave alone. A classic Hindi song also known as Do Din Ka Mela.",
    roman_lyrics: `## Chorus

Aaye bhi akela
Jaaye bhi akela
Do din ki zindagi hai
Do din ka mela
Do din ka mela

Aaye bhi akela
Jaaye bhi akela
Do din ki zindagi hai
Do din ka mela
Do din ka mela

## Verses

Teri zindagi mauj hai do ghadi ki
Ye baaten hain naadaa sab jeete ji ki
Sab jeete ji ki

Ye duniya hui hai na hogi kisi ki
Wohi ek manzil hai har aadmi ki
Har aadmi ki

Jahaan sab ko jaana padega akela
Do din ki zindagi hai
Do din ka mela
Do din ka mela

## Chorus

Aaye bhi akela
Jaaye bhi akela
Do din ki zindagi hai
Do din ka mela
Do din ka mela

## Verses

Ek baar saath deke saath na chhorna
Jaan jaaye to jaaye dosti na todna
Dosti na todna

Nazren na pher lena muh ko na modna
Duniya ko chhor dena yaar ko na chhorna
Yaar ko na chhorna

Dekho Mansoor kaise jaan pe khela
Do din ki zindagi hai
Do din ka mela
Do din ka mela

## Chorus

Aaye bhi akela
Jaaye bhi akela
Do din ki zindagi hai
Do din ka mela`,
    translation: `## Chorus

We come alone
We leave alone
Life is only a few days
A fair of two days
A fair of two days

We come alone
We leave alone
Life is only a few days
A fair of two days
A fair of two days

## Verses

Your life's joy lasts only a moment
These are the empty talks of the living
Of the living

This world has belonged to no one, and never will
There is one destination for every person
For every person

Where everyone must go alone
Life is only a few days
A fair of two days
A fair of two days

## Chorus

We come alone
We leave alone
Life is only a few days
A fair of two days
A fair of two days

## Verses

Once you give companionship, do not abandon it
Even if life goes, do not break friendship
Do not break friendship

Do not turn your eyes away; do not turn your face
Leave the world if you must — do not leave your friend
Do not leave your friend

See how Mansoor staked his life
Life is only a few days
A fair of two days
A fair of two days

## Chorus

We come alone
We leave alone
Life is only a few days
A fair of two days`,
  },
  "aaj-suno-hum-geet-shri-prakash-gossai": {
    title: "Aaj Suno Hum Geet",
    alternate_title: "",
    artist_version: "Shri Prakash Gossai",
    audio_url: "/audio/aaj-suno-hum-geet-shri-prakash-gossai.mp3",
    thumbnail_url: "/images/aaj-suno-hum-geet-shri-prakash-gossai-thumb.jpg",
    cover_url: "/images/aaj-suno-hum-geet-shri-prakash-gossai-player.jpg",
    mini_cover_url: "/images/aaj-suno-hum-geet-shri-prakash-gossai-thumb.jpg",
    display_order: 56,
    category_slugs: [
      "general",
      "satsang",
      "funeral",
      "memorial",
      "bhajan",
      "devotion",
      "hindi",
      "suitable-for-funerals",
    ],
    meaning:
      "Shri Prakash Gossai's farewell song — two sorrowful birds parting ways.",
    roman_lyrics: `## Verses

Aaj suni ham geet vidaa kaa gaa rahay
Do dukhiyaa-ree panchhee bichhuray jaa rahay

Bahut dino kay saathee aaj judaa hongay
Gum sum aakhariyon may aansoon aa rahay

Aaj suni ham geet vidaa kaa gaa rahay
Do dukhiyaa-ree panchhee bichhuray jaa rahay

Alag alag raahin par chal diye do praanee
Nirdai jag ne in kee peer nahee jaanee
Aaj puraanee sukh ke din yaad aa rahay

Aaj suni ham geet vidaa kaa gaa rahay
Do dukhiyaa-ree panchhee bichhuray jaa rahay

Koyee mat poochho kown hai ye kyoon rotay hai
Is jag me aise bhee abhaagay hote hai
Lut gaye phir bhee dil kaa dard chhipaa rahay

Aaj suni ham geet vidaa kaa gaa rahay
Do dukhiyaa-ree panchhee bichhuray jaa rahay`,
    translation: `## Verses

Today hear us sing a farewell song
Two sorrowful birds are parting ways

Companions of many days will be separated today
Silent tears come to their eyes

Today hear us sing a farewell song
Two sorrowful birds are parting ways

Two souls have set out on separate roads
This heartless world did not know their pain
Today the old days of happiness come to mind

Today hear us sing a farewell song
Two sorrowful birds are parting ways

Do not ask who they are or why they cry
In this world some are born so unfortunate
Robbed of everything, still they hide the pain of the heart

Today hear us sing a farewell song
Two sorrowful birds are parting ways`,
  },

  "bhagwan-meri-naiya-shri-prakash-gossai": {
    title: "Bhagwan Meri Naiya",
    alternate_title: "Us Paar Laga Dena",
    artist_version: "Shri Prakash Gossai",
    audio_url: "/audio/bhagwan-meri-naiya-shri-prakash-gossai.mp3",
    thumbnail_url: "/images/bhagwan-meri-naiya-shri-prakash-gossai-thumb.jpg",
    cover_url: "/images/bhagwan-meri-naiya-shri-prakash-gossai-player.jpg",
    mini_cover_url: "/images/bhagwan-meri-naiya-shri-prakash-gossai-thumb.jpg",
    display_order: 59,
    category_slugs: ["general", "satsang", "bhajan", "devotion", "hindi", "ram"],
    meaning:
      "Shri Prakash Gossai — Lord, ferry my boat across; You have sustained me so far, sustain me still. A prayer for safe crossing of the world’s ocean.",
    roman_lyrics: `## Verses

Bhagwan meri naiya
Us paar laga dena
Ab tak to nibhaya hai
Aage bhi nibha dena

Ham deen dukhi nirbal
Nit naam rahe pratipal
Yah soch darash doge
Prabhu aaj nahi to kal
Jo baag lagaya hai
Phulon se saja dena

Bhagwan meri naiya
Us paar laga dena
Ab tak to nibhaya hai
Aage bhi nibha dena

Tum shanti sudhakar ho
Tum gyan divakar ho
Mam hans chuge moti
Tum maan sarovar ho
Do bund sudharas ki
Hamko bhi pila dena

Bhagwan meri naiya
Us paar laga dena
Ab tak to nibhaya hai
Aage bhi nibha dena

Rokoge bhala kabtak
Darshan ko mujhe tumse
Charnon se lipat jaoon
Vrikshon se lata jaise
Ab dwar khadi tere
Mujhe raah dikha dena

Bhagwan meri naiya
Us paar laga dena
Ab tak to nibhaya hai
Aage bhi nibha dena

Majhdhaar padi naiya
Dagmag dole bhav mein
Aao Trishla Nandan
Ham dhyan dhare man mein
Ab Tanvar kare vinti
Mujhe apna bana lena

Bhagwan meri naiya
Us paar laga dena
Ab tak to nibhaya hai
Aage bhi nibha dena`,
    translation: `## Verses

Lord, my boat
Take it across to the other shore
So far You have sustained me
Sustain me still ahead

We are poor, sorrowful, and weak
May Your name always protect us
Thinking thus, grant Your darshan
Lord — if not today, then tomorrow
The garden You have planted
Adorn it with flowers

Lord, my boat
Take it across to the other shore
So far You have sustained me
Sustain me still ahead

You are the moon of peace
You are the sun of knowledge
My swan pecks pearls
You are the lake of Manasarovar
Two drops of nectar
Give us also to drink

Lord, my boat
Take it across to the other shore
So far You have sustained me
Sustain me still ahead

How long will You withhold
Your darshan from me
I would cling to Your feet
Like a vine to a tree
Now I stand at Your door
Show me the path

Lord, my boat
Take it across to the other shore
So far You have sustained me
Sustain me still ahead

My boat is midstream
Rocking in the world’s ocean
Come, son of Trishala
We hold You in meditation
Now Tanvar makes this prayer
Make me Your own

Lord, my boat
Take it across to the other shore
So far You have sustained me
Sustain me still ahead`,
  },

  "uddhar-karo-bhagawan-shri-prakash-gossai": {
    title: "Uddhar Karo Bhagawan",
    alternate_title: "Tumhari Sharan Pade",
    artist_version: "Shri Prakash Gossai",
    audio_url: "/audio/uddhar-karo-bhagawan-shri-prakash-gossai.mp3",
    thumbnail_url: "/images/uddhar-karo-bhagawan-shri-prakash-gossai-thumb.jpg",
    cover_url: "/images/uddhar-karo-bhagawan-shri-prakash-gossai-player.jpg",
    mini_cover_url: "/images/uddhar-karo-bhagawan-shri-prakash-gossai-thumb.jpg",
    display_order: 60,
    category_slugs: ["general", "satsang", "bhajan", "devotion", "hindi"],
    meaning:
      "Shri Prakash Gossai — redeem us, O Lord; we have taken Your shelter. Carry us across the ocean of this world.",
    roman_lyrics: `## Verses

Kaise tera naam dhyaye
Kaise tumhari lagan lagaye
Hriday jagado gyan
Tumhari sharan pade

Uddhar karo Bhagawan
Tumhari sharan pade
Uddhar karo Bhagawan
Tumhari sharan pade

Panth maton ki sun sun baaten
Dwar tere tak pahunch na paate
Bhatke beech jahan
Tumhari sharan pade

Uddhar karo Bhagawan
Tumhari sharan pade
Uddhar karo Bhagawan
Tumhari sharan pade

Tu hi shyamal, Krishna Murari
Ram tuhi, Ganapati Tripurari
Tum hi bane Hanuman
Tumhari sharan pade

Uddhar karo Bhagawan
Tumhari sharan pade
Uddhar karo Bhagawan
Tumhari sharan pade

Aisi antar jyot jagana
Ham deeno ko sharan lagana
He Prabhu daya nidhan
Tumhari sharan pade

Uddhar karo Bhagawan
Tumhari sharan pade
Uddhar karo Bhagawan
Tumhari sharan pade`,
    translation: `## Verses

How shall we meditate on Your name
How shall we fix our devotion on You
Awaken knowledge in the heart
We have taken Your shelter

Redeem us, O Lord
We have taken Your shelter
Redeem us, O Lord
We have taken Your shelter

Hearing talk of paths and doctrines
We cannot reach Your door
Wandering in the midst of the world
We have taken Your shelter

Redeem us, O Lord
We have taken Your shelter
Redeem us, O Lord
We have taken Your shelter

You alone are Shyamal, Krishna Murari
You alone are Ram, Ganapati Tripurari
You alone became Hanuman
We have taken Your shelter

Redeem us, O Lord
We have taken Your shelter
Redeem us, O Lord
We have taken Your shelter

Kindle such an inner light
That we, the lowly, take Your shelter
O Lord, treasure of compassion
We have taken Your shelter

Redeem us, O Lord
We have taken Your shelter
Redeem us, O Lord
We have taken Your shelter`,
  },

  "mailee-chaadar-hari-om-sharan": {
    title: "Mailee Chaadar",
    alternate_title: "Pushpanjali (1972)",
    artist_version: "Hari Om Sharan",
    audio_url:
      "/audio/albums/premanjali-pushpanjali-hari-om-sharan/01-maili-chadar-odh-ke-kaise.m4a",
    youtube_url: "https://www.youtube.com/watch?v=ecScvFN1gIQ",
    cover_url: "/images/albums/premanjali-pushpanjali-hari-om-sharan-player.png",
    thumbnail_url: "/images/albums/premanjali-pushpanjali-hari-om-sharan.png",
    mini_cover_url: "/images/albums/premanjali-pushpanjali-hari-om-sharan.png",
    display_order: 61,
    category_slugs: ["general", "satsang", "bhajan", "devotion", "hindi"],
    meaning:
      "Hari Om Sharan — from Pushpanjali (1972). How can I present myself at Your door with a dirty shawl? You sent me into the world with a spotless body; I stained it across births. You gave me a pure voice and I never sang Your name; the heart’s veena is broken. My feet never entered Your temple; old and ruined, what offering can I bring now?",
    roman_lyrics: `## Chorus

Mailee chaadar odhakay kaisay
Dwaar tumhaaree aaawooo
Hey Pawaan, Parameshwar mayray
Man hee mana sharmaawoo

## Verse 1

Too nay mujhko jaga mein bayja
Nirmal dekar kaayaa
Aakara kay sansaar mein maynay
Issi ko daag lagaayaa
Janama janama kee mailee chaadar
Kaisay daag churaawoo

## Chorus

Mailee chaadar odhakay kaisay

## Verse 2

Niramala vaanee paakara maynay
Naam na tayra gaayaa
Naina moonda kar, hey Parameshwar
Kabhi na tujhko dhyaayaa
Mana veena kee taaray tootee
Abba kya geeta sunaawoo

## Chorus

Mailee chaadar odhakay kaisay

## Verse 3

Inna pairo say chalakar tayray
Mandirra kabhee na aaya
Jaha jaha ho pooja tayree
Kabhi na sheesh jhukaayaa
Hey Hari Harr, mein haar kay aaya
Abba kya haar charhaawoo

## Chorus

Mailee chaadar odhakay kaisay

## Closing

Mailee chaadar odhakay kaisay
Dwaar tumhaaree aaawooo
Hey Pawaan, Parameshwar mayray
Man hee mana sharmaawoo`,
    translation: `## Chorus

How can I present myself at Your door
With a dirty shawl
O Lord of Purity, my Lord
I am completely ashamed in my own mind

## Verse 1

You sent me into this world
With a spotlessly clean body
Coming into the world, I myself
Stained it with the dirt of evil
A soiled shawl of birth after birth
How can I scrub these stains away

## Chorus

How can I come wrapped in a soiled shawl

## Verse 2

Receiving a pure, sweet voice
I never sang Your name
Closing my eyes, O Lord
I never meditated on You
The strings of the heart’s veena are broken
What song can I sing now

## Chorus

How can I come wrapped in a soiled shawl

## Verse 3

With these feet I never walked
To Your temple
Wherever Your worship was happening
I never bowed my head
O Hari Har, I come defeated
What offering can I place now

## Chorus

How can I come wrapped in a soiled shawl

## Closing

How can I present myself at Your door
With a dirty shawl
O Lord of Purity, my Lord
I am completely ashamed in my own mind`,
  },

  "jai-krishna-hare-shri-prakash-gossai": {
    title: "Jai Krishna Hare",
    alternate_title: "Jai Krishna Shri Krishna Hare · Dukhiyo Ke Dukh Door Kare",
    artist_version: "Shri Prakash Gossai",
    audio_url: "https://www.youtube.com/watch?v=UjaT03xQmoY",
    youtube_url: "https://www.youtube.com/watch?v=UjaT03xQmoY",
    thumbnail_url: "/images/jai-krishna-hare-shri-prakash-gossai-thumb.jpg",
    cover_url: "/images/jai-krishna-hare-shri-prakash-gossai-player.jpg",
    mini_cover_url: "/images/jai-krishna-hare-shri-prakash-gossai-thumb.jpg",
    display_order: 63,
    category_slugs: ["krishna", "general", "satsang", "bhajan", "devotion", "hindi"],
    meaning:
      "Shri Prakash Gossai — opens with the Sanskrit vandana of Krishna as Jagadguru, then the bhajan: glory to Krishna Hare, who removes the sorrows of the afflicted. When darkness surrounds us and no one steers the boat, He alone carries us across; He can turn poison to nectar and fulfill the hope of whoever meditates on Him.",
    roman_lyrics: `## Opening prayer

Vasudev sutam devam
Kansh charu mardanam
Devki parmanandam
Krishnam vande Jagadguru

## Chorus

Jai Krishna Shri Krishna Hare
Dukhiyo ke dukh door kare
Jai jai jai Krishna Hare
Jai jai jai Krishna Hare

## Verse 1

Jab charo taraf andhiyara ho
Aasha ka door kinara ho
Jab charo taraf andhiyara ho
Aasha ka door kinara ho
Aur koi naa khewan hara ho
Aur koi naa khewan hara ho
Phir Tu hi beda paar karo
Phir Tu hi beda paar karo

## Chorus

Jai jai jai Krishna Hare
Jai Krishna Shri Krishna Hare
Dukhiyo ke dukh door kare
Jai jai jai jai Krishna Hare

## Verse 2

Tu chahe to sabkuchh karde
Vish ko bhi amrat kar de
Tu chahe to sabkuchh karde
Vish ko bhi amrat kar de
Pooran karde unki aasha
Pooran karde unki aasha
Jo bhi Tera dhyan dhare
Prabhu jo bhi Tera dhyan dhare

## Chorus

Jai jai jai Krishna Hare`,
    translation: `## Opening prayer

I bow to the divine son of Vasudeva
Slayer of the demon Kans
Supreme bliss of Devaki
Krishna, world-teacher — I salute You

## Chorus

Victory to Krishna, Shri Krishna Hare
Who removes the sorrows of the afflicted
Glory, glory, glory to Krishna Hare
Glory, glory, glory to Krishna Hare

## Verse 1

When darkness is on every side
And the shore of hope is far away
When darkness is on every side
And the shore of hope is far away
And there is no one to steer the boat
And there is no one to steer the boat
Then You alone ferry us across
Then You alone ferry us across

## Chorus

Glory, glory, glory to Krishna Hare
Victory to Krishna, Shri Krishna Hare
Who removes the sorrows of the afflicted
Glory, glory, glory, glory to Krishna Hare

## Verse 2

If You will, You can do all things
Even turn poison into nectar
If You will, You can do all things
Even turn poison into nectar
Fulfill their hopes
Fulfill their hopes
Whoever keeps You in meditation
O Lord, whoever keeps You in meditation

## Chorus

Glory, glory, glory to Krishna Hare`,
  },

  "achutam-keshavam-ankit-batra": {
    title: "Achutam Keshavam",
    alternate_title: "Achyutam Keshavam Krishna Damodaram · Art of Living",
    artist_version: "Ankit Batra",
    audio_url:
      "/audio/albums/art-of-living-ankit-batra/01-achutam-keshavam.mp3",
    thumbnail_url: "/images/achutam-keshavam-ankit-batra-square.png",
    cover_url: "/images/achutam-keshavam-ankit-batra-player.png",
    mini_cover_url: "/images/achutam-keshavam-ankit-batra-square.png",
    display_order: 64,
    category_slugs: [
      "krishna",
      "ram",
      "general",
      "satsang",
      "bhajan",
      "devotion",
      "hindi",
    ],
    meaning:
      "Ankit Batra (Art of Living). The Sanskrit refrain names Vishnu as Achyuta, Keshava, Krishna Damodara, Rama-Narayana, and Janaki’s beloved. The Hindi verses are not a line-by-line gloss of that Sanskrit — they answer the doubt that God is distant: He comes, eats, sleeps, and dances for those who love Him as Meera, Shabri, Yashoda, and the gopis did. Keep His name while you work; darshan comes in time.",
    roman_lyrics: `## Chorus

Achyutam Keshavam Krishna Damodaram
Ram Narayanam Janki Vallabham

## Verses

Kaun kehte hai Bhagwan aate nahi
Tum Meera ke jaise bulate nahi

Achyutam Keshavam Krishna Damodaram
Ram Narayanam Janki Vallabham

Kaun kehte hai Bhagwan khate nahi
Ber Shabri ke jaise khilate nahi

Achyutam Keshavam Krishna Damodaram
Ram Narayanam Janki Vallabham

Kaun kehte hai Bhagwan sote nahi
Maa Yashoda ke jaise sulate nahi

Achyutam Keshavam Krishna Damodaram
Ram Narayanam Janki Vallabham

Kaun kehte hai Bhagwan nachte nahi
Gopiyo ke jaise tum nachate nahi

Achyutam Keshavam Krishna Damodaram
Ram Narayanam Janki Vallabham

Naam japte chalo, kaam karte chalo
Har samay Krishna ka naam dharte chalo

Achyutam Keshavam Krishna Damodaram
Ram Narayanam Janki Vallabham

Yaad aayegi unko kabhi na kabhi
Krishna darshan to denge kabhi na kabhi

Achyutam Keshavam Krishna Damodaram
Ram Narayanam Janki Vallabham`,
    devanagari_lyrics: `## Chorus

अच्युतं केशवं कृष्ण दामोदरं
राम नारायणं जानकी वल्लभम्

## Verses

कौन कहते हैं भगवान आते नहीं
तुम मीरा के जैसे बुलाते नहीं

अच्युतं केशवं कृष्ण दामोदरं
राम नारायणं जानकी वल्लभम्

कौन कहते हैं भगवान खाते नहीं
बेर शबरी के जैसे खिलाते नहीं

अच्युतं केशवं कृष्ण दामोदरं
राम नारायणं जानकी वल्लभम्

कौन कहते हैं भगवान सोते नहीं
माँ यशोदा के जैसे सुलाते नहीं

अच्युतं केशवं कृष्ण दामोदरं
राम नारायणं जानकी वल्लभम्

कौन कहते हैं भगवान नाचते नहीं
गोपियों के जैसे तुम नचाते नहीं

अच्युतं केशवं कृष्ण दामोदरं
राम नारायणं जानकी वल्लभम्

नाम जपते चलो, काम करते चलो
हर समय कृष्ण का नाम धरते चलो

अच्युतं केशवं कृष्ण दामोदरं
राम नारायणं जानकी वल्लभम्

याद आएगी उनको कभी न कभी
कृष्ण दर्शन तो देंगे कभी न कभी

अच्युतं केशवं कृष्ण दामोदरं
राम नारायणं जानकी वल्लभम्`,
    translation: `## Chorus

O Imperishable One, Lord with beautiful hair, Krishna whose waist was bound with a rope
Rama who is Narayana, beloved of Janaki (Sita)

## Verses

Who says God never comes?
— It’s that you don’t call Him the way Meera did

O Imperishable One, Lord with beautiful hair, Krishna whose waist was bound with a rope
Rama who is Narayana, beloved of Janaki (Sita)

Who says God never eats?
— It’s that you don’t feed Him berries the way Shabri did

O Imperishable One, Lord with beautiful hair, Krishna whose waist was bound with a rope
Rama who is Narayana, beloved of Janaki (Sita)

Who says God never sleeps?
— It’s that you don’t lull Him the way Mother Yashoda did

O Imperishable One, Lord with beautiful hair, Krishna whose waist was bound with a rope
Rama who is Narayana, beloved of Janaki (Sita)

Who says God never dances?
— It’s that you don’t make Him dance the way the gopis did

O Imperishable One, Lord with beautiful hair, Krishna whose waist was bound with a rope
Rama who is Narayana, beloved of Janaki (Sita)

Keep chanting the Name as you work
Hold Krishna’s name at every moment

O Imperishable One, Lord with beautiful hair, Krishna whose waist was bound with a rope
Rama who is Narayana, beloved of Janaki (Sita)

He will remember you someday
And Krishna will give darshan someday

O Imperishable One, Lord with beautiful hair, Krishna whose waist was bound with a rope
Rama who is Narayana, beloved of Janaki (Sita)`,
  },

  "mai-ek-nanha-sa-lata-mangeshkar": {
    title: "Mai Ek Nanha Sa",
    alternate_title: "Mai Ek Chota Sa Bacha Hoon · Prabhujee Mayray Laaj Rakho",
    artist_version: "Lata Mangeshkar",
    audio_url: "/audio/mai-ek-nanha-sa-lata-mangeshkar.mp3",
    thumbnail_url: "/images/mai-ek-nanha-sa-thumb.jpg",
    cover_url: "/images/mai-ek-nanha-sa-player.jpg",
    mini_cover_url: "/images/mai-ek-nanha-sa-thumb.jpg",
    display_order: 62,
    category_slugs: ["general", "satsang", "bhajan", "devotion", "hindi"],
    meaning:
      "Lata Mangeshkar — a child’s prayer to the Lord: I am small and weak, You are mighty; protect my honour, take away my suffering, hold my hand, and mend what is broken.",
    roman_lyrics: `## Verses

Mai ek nanha sa, mai ek chota sa, bacha hoon
Tuma ho barray balawaan
Prabhujee mayray laaj rakho

May-nay suhna hey, tumanay yahaa pay
Laako kay dukha taalay
Mayra dukka bhee, taala to jaanu
Chakara su darashana waale
Mai ek nanha sa, mai ek chota sa, bacha hoon
Mujh pay dharo kucha dhyaan
Prabhujee mayray laaj rakho

Mai ek nanha sa, mai ek chota sa, bacha hoon

Tuma ko dayalu, apana samaja kay
Mai nay aaj pukaara
Mujh nira bala ka, haath pakara lo
Daydo Naath sahaara
Mai ek nanha sa, mai ek chota sa, bacha hoon
Mai bhee tumhaaree santaan
Prabhujee mayray laaj rakho

Mai ek nanha sa, mai ek chota sa, bacha hoon

Mai aayaa hoon, aaj tumhaaray
Dwaar pay aas lagaayay
Aisa koyee, jatana karo Prabhu
Saacha ko aacha na aaye
Mai ek nanha sa, mai ek chota sa, bacha hoon
Bigaree banado Bhagawaan
Prabhujee mayray laaj rakho
Prabhujee mayray laaj rakho
Prabhujee mayray laaj rakho`,
    translation: `## Verses

I am a little child, so tiny and small
You are very powerful and strong
O Lord, protect my honour

I have heard that here You have
Taken away the sufferings of millions
So take away my pain too, I know
O one who wields the chakra and Sudarshan
I am a little child, so tiny and small
Place a little attention on me
O Lord, protect my honour

I am a little child, so tiny and small

Considering You merciful as my own
I have called out to You today
Take the hand of this weak one
Give me Your support, O Lord
I am a little child, so tiny and small
I too am Your child
O Lord, protect my honour

I am a little child, so tiny and small

Today I have come to Your door
With hope placed in You
Find a way, O Lord
So that the true one is not put to shame
I am a little child, so tiny and small
Mend what is broken, O God
O Lord, protect my honour
O Lord, protect my honour
O Lord, protect my honour`,
  },

  "tu-kitni-achhi-hai-lata-mangeshkar": {
    title: "Tu Kitni Achhi Hai",
    alternate_title: "",
    artist_version: "Lata Mangeshkar",
    audio_url: "/audio/tu-kitni-achhi-hai-lata-mangeshkar.mp3",
    thumbnail_url: "/images/tu-kitni-achhi-hai-thumb.jpg",
    cover_url: "/images/tu-kitni-achhi-hai-player.jpg",
    mini_cover_url: "/images/tu-kitni-achhi-hai-thumb.jpg",
    display_order: 57,
    category_slugs: ["general", "satsang", "memorial", "bhajan", "devotion", "hindi"],
    meaning:
      "Classic mother's song from Raja Aur Runk (1968), sung by Lata Mangeshkar — lyrics Anand Bakshi, music Laxmikant–Pyarelal. A child's love for mother: she is a garden in a thorny world, and those who still have their mother are blessed.",
    roman_lyrics: `## Chorus

Tu kitni achhi hai
Tu kitni bholi hai
Pyaari pyaari hai
O maa, o maa

Ke yeh jo duniya hai
Yeh ban hai kaanton ka
Tu phulwaari hai
O maa, o maa

## Verses

Dukhne laagi hain maa teri aankhiyaan
Mere liye jaagi hai tu saari saari ratiyaan
Meri nindiya pe apni nindiya bhi tune vaari hai
O maa, o maa

## Chorus

Tu kitni achhi hai
Tu kitni bholi hai
Pyaari pyaari hai
O maa, o maa

## Verses

Apna nahin tujhe sukh dukh koi
Main muskaya tu muskaayi
Main roya tu royi
Mere hansne pe, mere rone pe tu balihaari hai
O maa, o maa

## Verses

Maa bachchon ki jaan hoti hai
Woh hote hain kismat waale jinke maa hoti hai
Kitni sundar hai, kitni sheetal hai
Nyaari nyaari hai
O maa, o maa

## Chorus

Tu kitni achhi hai
Tu kitni bholi hai
Pyaari pyaari hai
O maa, o maa`,
    translation: `## Chorus

How good you are
How innocent you are
So dear, so lovely
O mother, o mother

This world is a forest of thorns
You are a garden of flowers
O mother, o mother

## Verses

Mother, your eyes look tired and sad
For me you stayed awake night after night
For my sleep you even gave up your own sleep
O mother, o mother

## Chorus

How good you are
How innocent you are
So dear, so lovely
O mother, o mother

## Verses

You have no joy or sorrow of your own
When I smiled, you smiled
When I cried, you cried
For my laughter and my tears you give up everything
O mother, o mother

## Verses

A mother is the life of her children
Those who still have their mother are truly blessed
How beautiful you are, how gentle you are
How unique you are
O mother, o mother

## Chorus

How good you are
How innocent you are
So dear, so lovely
O mother, o mother`,
  },
  "bhaiya-mere-rakhi-ke-lata-mangeshkar": {
    title: "Bhaiya Mere Rakhi Ke",
    alternate_title:
      "Rakhi · Raksha Bandhan · Raakhi · Rakshabandhan · Rakhi Ke Bandhan Ko Nibhana · Chhoti Behan",
    artist_version: "Lata Mangeshkar",
    audio_url: "https://www.youtube.com/watch?v=cRxiPR4O6-4",
    thumbnail_url: "/images/bhaiya-mere-rakhi-ke-lata-mangeshkar.jpg",
    display_order: 59,
    category_slugs: [
      "raksha-bandhan",
      "hindi",
    ],
    meaning:
      "Classic Raksha Bandhan song from Chhoti Behan (1959), sung by Lata Mangeshkar — lyrics Shailendra, music Shankar–Jaikishan. Picturised on Nanda and Balraj Sahni. A sister asks her brother to honour the rakhi thread: do not forget your little sister, even if she lives far away.",
    roman_lyrics: `## Chorus

Bhaiya mere, rakhi ke bandhan ko nibhana
Bhaiya mere, chhoti behan ko na bhulana
Dekho ye nata nibhana

## Verse 1

Ye din ye tyohar khushi ka
Pavan jaise neer nadi ka
Bhai ke ujle mathe pe
Behan lagaye mangal teeka
Jhoome ye saawan suhaana

## Verse 2

Baandh ke humne resham dori
Tumse wo ummeed hai jodi
Naazuk hai jo saans ke jaise
Par jeevan bhar jaaye na todi
Jaane ye saara zamana

## Verse 3

Shayad wo saawan bhi aaye
Jo pehla sa rang na laaye
Behan paraaye desh basi ho
Agar wo tum tak pahunch na paaye
Yaad ka deepak jalaana`,
    translation: `## Chorus

Brother mine, honour the bond of the rakhi
Brother mine, do not forget your little sister
See that this relationship is kept

## Verse 1

This day, this festival of joy
Sacred like the water of a river
On her brother’s bright forehead
The sister places an auspicious tilak
This beautiful monsoon dances with joy

## Verse 2

We have tied a silk thread
And joined that hope to you
It is as delicate as a breath
But may it never break for a lifetime
Let the whole world know

## Verse 3

Perhaps a monsoon will come
That does not bring the first colour
The sister may live in a distant land
If she cannot reach you
Light the lamp of remembrance`,
  },

  "phoolon-ka-taron-ka-kishore-kumar": {
    title: "Phoolon Ka Taron Ka",
    alternate_title:
      "Phoolon Ka Taron Ka Sabka Kehna Hai · Ek Hazaron Mein Meri Behna Hai · Raksha Bandhan · Hare Rama Hare Krishna",
    artist_version: "Kishore Kumar",
    audio_url: "/audio/phoolon-ka-taron-ka-kishore-kumar.mp3",
    thumbnail_url: "/images/phoolon-ka-taron-ka-thumb.jpg",
    cover_url: "/images/phoolon-ka-taron-ka-cover.jpg",
    mini_cover_url: "/images/phoolon-ka-taron-ka-thumb.jpg",
    display_order: 60,
    category_slugs: [
      "raksha-bandhan",
      "hindi",
    ],
    meaning:
      "Immortal Rakhi celebration anthem from Dev Anand's Hare Rama Hare Krishna (1971), sung by Kishore Kumar — music by R.D. Burman, lyrics by Anand Bakshi. Celebrating the irreplaceable bond of a brother's love and lifelong devotion to his sister.",
    roman_lyrics: `## Chorus

Phūloñ kā tāroñ kā sabkā kahnā hai
Ek hazāroñ meñ merī behnā hai
Sārī umar hameñ sañg rahnā hai
Phūloñ kā tāroñ kā sabkā kahnā hai
Ek hazāroñ meñ merī behnā hai
Sārī umar hameñ sañg rahnā hai

## Verse 1

Ye na jānā duniyā ne, tū hai kyūñ udās
Terī pyāsī āṅkhoñ meñ, pyār kī hai pyās
Aa mere pās aa, kah jo kahnā hai
Ek hazāroñ meñ merī behnā hai
Sārī umar hameñ sañg rahnā hai
Phūloñ kā tāroñ kā sabkā kahnā hai

## Verse 2

Jabse merī āṅkhoñ se ho gaī tū dūr
Tabse sārī duniyā ke sadme haiñ manzūr
Aa mere pās aa, kah jo kahnā hai
Ek hazāroñ meñ merī behnā hai
Sārī umar hameñ sañg rahnā hai
Phūloñ kā tāroñ kā sabkā kahnā hai

## Verse 3

Dekho ham tum donoñ haiñ ek dālī ke phūl
Maiñ na bhūlā tū kaise mujhko gaī bhūl
Aa mere pās aa, kah jo kahnā hai
Ek hazāroñ meñ merī behnā hai
Sārī umar hameñ sañg rahnā hai
Phūloñ kā tāroñ kā sabkā kahnā hai
Ek hazāroñ meñ merī behnā hai
Sārī umar hameñ sañg rahnā hai`,
    devanagari_lyrics: `## Chorus

फूलों का तारों का सबका कहना है
एक हज़ारों में मेरी बहना है
सारी उमर हमें संग रहना है
फूलों का तारों का सबका कहना है
एक हज़ारों में मेरी बहना है
सारी उमर हमें संग रहना है

## Verse 1

ये ना जाना दुनिया ने, तू है क्यों उदास
तेरी प्यासी आँखों में, प्यार की है प्यास
आ मेरे पास आ, कह जो कहना है
एक हज़ारों में मेरी बहना है
सारी उमर हमें संग रहना है
फूलों का तारों का सबका कहना है

## Verse 2

जबसे मेरी आँखों से हो गई तू दूर
तबसे सारी दुनिया के सदमे हैं मंज़ूर
आ मेरे पास आ, कह जो कहना है
एक हज़ारों में मेरी बहना है
सारी उमर हमें संग रहना है
फूलों का तारों का सबका कहना है

## Verse 3

देखो हम तुम दोनों हैं एक डाली के फूल
मैं ना भूला तू कैसे मुझको गई भूल
आ मेरे पास आ, कह जो कहना है
एक हज़ारों में मेरी बहना है
सारी उमर हमें संग रहना है
फूलों का तारों का सबका कहना है
एक हज़ारों में मेरी बहना है
सारी उमर हमें संग रहना है`,
    translation: `## Chorus

The flowers, the stars, everyone says:
My sister is one in thousands!
We have to live together our whole lives.
The flowers, the stars, everyone says:
My sister is one in thousands!
We have to live together our whole lives.

## Verse 1

The world did not understand why you are sad,
In your thirsty eyes, there is a thirst for love.
Come close to me, say whatever you wish to say,
My sister is one in thousands!
We have to live together our whole lives.
The flowers, the stars, everyone says...

## Verse 2

Ever since you went far away from my eyes,
I have borne all the grief and sorrow of the world.
Come close to me, say whatever you wish to say,
My sister is one in thousands!
We have to live together our whole lives.
The flowers, the stars, everyone says...

## Verse 3

Look, you and I are both flowers of the same branch,
I did not forget you, how could you have forgotten me?
Come close to me, say whatever you wish to say,
My sister is one in thousands!
We have to live together our whole lives.
The flowers, the stars, everyone says:
My sister is one in thousands!
We have to live together our whole lives.`,
  },

  "jai-raghunandan-jai-siyaram-mohammed-rafi": {
    title: "Jai Raghunandan Jai Siyaram",
    alternate_title: "",
    artist_version: "Mohammed Rafi & Asha Bhosle",
    audio_url: "/audio/jai-raghunandan-jai-siyaram-mohammed-rafi.mp3",
    thumbnail_url: "/images/jai-raghunandan-jai-siyaram-thumb.jpg",
    cover_url: "/images/jai-raghunandan-jai-siyaram-player.jpg",
    mini_cover_url: "/images/jai-raghunandan-jai-siyaram-thumb.jpg",
    display_order: 58,
    category_slugs: ["ram", "general", "satsang", "bhajan", "devotion", "hindi"],
    meaning:
      "Classic Ram bhajan from Gharana (1961), sung by Mohammed Rafi and Asha Bhosle — lyrics Shakeel Badayuni, music Ravi. Opens with a Ram ashraya verse, then glory to Raghunandan and Sita-Ram, destroyer of sorrow, steersman of the boat, ocean of compassion.",
    roman_lyrics: `## Opening

Shri Rama-Chandra aasritha pari jaa taha
Samast kalyaan guna viraamaha
Sita mukham guruhu chan-chari kaha
Nirantaram mangala, maat tanothi…Aah…

## Chorus

Jai Raghunandan, jai Siyaram
Jai Raghunandan, jai Siyaram
Hey dukh bhanjan, tumhay pranam
Hey dukh bhanjan, tumhay parnam
Jai Raghunandan, jai Siyaram
Jai Raghunandan, jai Siyaram

## Verse 1

Ghat ghat ko, hey Parameshwara
Snayha tumhee sikhalaatay, Aaaah…
Ghat ghat ko, hey Parameshwara
Snayha tumhee sikhalaatay
Nar nari kay prem kee jyoti
Jaga may tumhee jalaatay
Oh naiya kay, khaywana haaray
Japu mai tumharo naam
Jai Raghunandan, jai Siyaram
Jai Raghunandan, jai Siyaram

## Verse 2

Tumahee daya kay, saagara Prabhuji
Tumahee paalana haaray
Chaina tumhee say, paayay baykala
Manwa sanjh sakaaray
Jo bhee tumharee, aas lagaayay
Jo bhee tumharee, aas lagaayay
Banee ousee kay kaam
Jai Raghunandan jai Siyaram
Jai Raghunandan jai Siyaram

## Closing

Hey dukh bhanjan, tumhay pranam
Hey dukh bhanjan, tumhay parnam
Jai Raghunandan, jai Siyaram
Jai Raghunandan, jai Siyaram`,
    translation: `## Opening

O supporter of those who take refuge in Shri Ramachandra
Abode of every auspicious virtue
The bee forever at Sita’s lotus face
Always spreading auspicious bliss…Aah…

## Chorus

Victory to Raghunandan, glory to Sita-Ram
Victory to Raghunandan, glory to Sita-Ram
O destroyer of sorrow, I bow to You
O destroyer of sorrow, I bow to You
Victory to Raghunandan, glory to Sita-Ram
Victory to Raghunandan, glory to Sita-Ram

## Verse 1

In every heart, O Lord
You alone teach love…Aah…
In every heart, O Lord
You alone teach love
The light of love between man and woman
You alone kindle in the world
O captain of my boat
I chant Your name
Victory to Raghunandan, glory to Sita-Ram
Victory to Raghunandan, glory to Sita-Ram

## Verse 2

You alone are the ocean of compassion, O Lord
You alone are the sustainer
From You the restless heart finds peace
Morning and evening
Whoever places their hope in You
Whoever places their hope in You
Finds their work fulfilled
Victory to Raghunandan, glory to Sita-Ram
Victory to Raghunandan, glory to Sita-Ram

## Closing

O destroyer of sorrow, I bow to You
O destroyer of sorrow, I bow to You
Victory to Raghunandan, glory to Sita-Ram
Victory to Raghunandan, glory to Sita-Ram`,
  },

  // —— Chutney Style Bhajan (Ramdew Chaitoe · Traditional Chaitoe) ——
  "ho-dja-ram-nam-ramdew-chaitoe": {
    title: "Ho Dja Ram Nam",
    alternate_title: "Ram Nam Ka Pakka",
    artist_version: "Ramdew Chaitoe",
    audio_url: "/audio/folders/chutney-style-bhajan/ho-dja-ram-nam-ramdew-chaitoe.mp3",
    thumbnail_url: "/images/albums/star-melodies-ramdew-chaitoe.jpg",
    cover_url: "/images/albums/star-melodies-ramdew-chaitoe-player.jpg",
    mini_cover_url: "/images/albums/star-melodies-ramdew-chaitoe.jpg",
    display_order: 70,
    category_slugs: ["ram", "general", "satsang", "bhajan", "devotion", "hindi"],
    meaning:
      "Ramdew Chaitoe baithak classic — hold firm to Ram's name in this world of maya. From The Star Melodies of Ramdew Chaitoe (Traditional Chaitoe).",
    roman_lyrics: `## Verses

Ho dja Ram nam ka pakka lobhi
Kya maya me rakha

Duniya daulat mallika jana
Baniya baila ladai
Woh jane maya sangh jaiye
Sab yahi raha jai

Ho dja Ram nam ka pakka lobhi
Kya maya me rakha

Dhruv Prahalad, Bhabhikan, Pandav
Hanuman ne bahu bati
Vid Jatayu Sampathi sar gai
Sar gai Shabari sujati

Ho dja Ram nam ka pakka lobhi
Kya maya me rakha

Ram charan me jo koi aavat
Sakal pap kat jati
Jin charanan se svarsari nikari
Shankar jata samati

Ho dja Ram nam ka pakka lobhi
Kya maya me rakha`,
    translation: `## Verses

Become firmly devoted to Ram's name
What is there in illusion?

Know the world and wealth as fleeting
Like a merchant's ox-cart quarrel
Maya goes with those who leave
All of this remains here

Become firmly devoted to Ram's name
What is there in illusion?

Dhruv, Prahlad, Vibhishan, the Pandavas
Hanuman spoke many truths
Jatayu and Sampati passed on
Wise Shabari passed on too

Become firmly devoted to Ram's name
What is there in illusion?

Whoever comes to Ram's feet
All sins are cut away
From those feet the celestial river flowed
And rested in Shankar's locks

Become firmly devoted to Ram's name
What is there in illusion?`,
  },
  "kanha-moerlie-bedja-ramdew-chaitoe": {
    title: "Kanha Moerlie Bedja",
    alternate_title: "Kanha Murli Baja",
    artist_version: "Ramdew Chaitoe",
    audio_url: "/audio/folders/chutney-style-bhajan/kanha-moerlie-bedja-ramdew-chaitoe.mp3",
    thumbnail_url: "/images/albums/star-melodies-ramdew-chaitoe.jpg",
    cover_url: "/images/albums/star-melodies-ramdew-chaitoe-player.jpg",
    mini_cover_url: "/images/albums/star-melodies-ramdew-chaitoe.jpg",
    display_order: 71,
    category_slugs: ["krishna", "general", "satsang", "bhajan", "devotion", "hindi"],
    meaning:
      "Krishna (Kanha) plays the flute — Ramdew Chaitoe Traditional Chaitoe devotion.",
    roman_lyrics: `## Chorus

Kanha moerlie bedja
Kanha moerlie bedja`,
    translation: `## Chorus

Kanha plays the flute
Kanha plays the flute`,
  },
  "mai-ramta-jogi-raam-ramdew-chaitoe": {
    title: "Mai Ramta Jogi Raam",
    alternate_title: "Ramta Jogi Ram",
    artist_version: "Ramdew Chaitoe",
    audio_url: "/audio/folders/chutney-style-bhajan/mai-ramta-jogi-raam-ramdew-chaitoe.mp3",
    thumbnail_url: "/images/albums/star-melodies-ramdew-chaitoe.jpg",
    cover_url: "/images/albums/star-melodies-ramdew-chaitoe-player.jpg",
    mini_cover_url: "/images/albums/star-melodies-ramdew-chaitoe.jpg",
    display_order: 72,
    category_slugs: ["ram", "general", "satsang", "bhajan", "devotion", "hindi"],
    meaning:
      "The wandering yogi's Ram — baithak devotion from Ramdew Chaitoe · The Star Melodies (Traditional Chaitoe). The world holds nothing for one whose Lord is Ram.",
    roman_lyrics: `## Verses

La la la la la la la, la la la la

Mein Ramta Jogi Raam
Mein Ramta Jogi Raam
Mohe dunia say hay kya kaam
Mohe dunia say hay kya kaam

Ramta Jogi Ram bhayo mein, Ramta Jogi Raam
Ramta Jogi Ram bhayo mein, Ramta Jogi Raam

Mein Ramta Jogi Raam
Mein Ramta Jogi Raam
Mohe dunia say hay kya kaam
Mohe dunia say hay kya kaam

Haad mas ki bani ye dehiya
Haad mas ki bani ye dehiya
Upar latkata chaam
Upar latkata chaam

Mohe dunia say hay kya kaam
Mohe dunia say hay kya kaam

Mein Ramta Jogi Raam
Mohe dunia say hay kya kaam
Mohe dunia say hay kya kaam

Dekh dekh sab log rijhaye log rijhaye
Dekh dekh sab log rijhaye log rijhaye
Mera to Prabhu Raam
Mera to Prabhu Raam

Mohe dunia say hay kya kaam
Mohe dunia say hay kya kaam

Dunia dolat maal khazana, awega kon kaam
Dunia dolat maal khazana, awega kon kaam

Mein Ramta Jogi Raam
Mein Ramta Jogi Raam
Mohe dunia say hay kya kaam
Mohe dunia say hay kya kaam

Mein Ramta Jogi Raam
Mein Ramta Jogi Raam
Mohe dunia say hay kya kaam
Mohe dunia say hay kya kaam`,
    translation: `## Verses

La la la la la la la, la la la la

I am a devotee of Lord Ram
I am a devotee of Lord Ram
I don't care about the world
I don't care about the world

I became a devotee of Ram
I became a devotee of Ram

I am a devotee of Lord Ram
I am a devotee of Lord Ram
I don't care about the world
I don't care about the world

This body is made of bone and muscle
This body is made of bone and muscle
It looks good from outside
It looks good from outside

I don't care about the world
I don't care about the world

I am a devotee of Lord Ram
I don't care about the world
I don't care about the world

People are jealous after seeing me
People are jealous after seeing me
My Lord is Ram
My Lord is Ram

I don't care about the world
I don't care about the world

World, money, wealth, treasury — what use will they be?
World, money, wealth, treasury — what use will they be?

I am a devotee of Lord Ram
I am a devotee of Lord Ram
I don't care about the world
I don't care about the world

I am a devotee of Lord Ram
I am a devotee of Lord Ram
I don't care about the world
I don't care about the world`,
  },
  "djagernath-poeri-ramdew-chaitoe": {
    title: "Djagernath Poeri",
    alternate_title: "Jagannath Puri",
    artist_version: "Ramdew Chaitoe",
    audio_url: "/audio/folders/chutney-style-bhajan/djagernath-poeri-ramdew-chaitoe.mp3",
    thumbnail_url: "/images/albums/star-melodies-ramdew-chaitoe.jpg",
    cover_url: "/images/albums/star-melodies-ramdew-chaitoe-player.jpg",
    mini_cover_url: "/images/albums/star-melodies-ramdew-chaitoe.jpg",
    display_order: 73,
    category_slugs: ["krishna", "general", "satsang", "bhajan", "devotion", "hindi"],
    meaning:
      "A baithak classic praising Lord Jagannath (Krishna) in his great temple at Puri, on India's east coast. The song recalls how the Lord left his old homes — Mathura (birthplace), Kashi (Varanasi), and Vrindavan (childhood groves) — and now dwells beautifully in Jagannath Puri. Ramdew Chaitoe · The Star Melodies (Traditional Chaitoe).",
    roman_lyrics: `## Verses

Jagannathpuri me Thakur bhale biraje
Jagannathpuri me Thakur bhale biraje

Thakur bhale biraje
Thakur bhale biraje
Jagannathpuri me Thakur bhale biraje
Jagannathpuri me Thakur bhale biraje

Kahe chodi Mathura nagari
Kahe chodi Kashi

Kahe chodi Mathura nagari
Kahe chodi Kashi
Kahe chodi Kashi

Vrindavan me jaye biraje
Vrindavan me jaye biraje
Vrindavan ke basi

Jagannathpuri me Thakur bhale biraje
Jagannathpuri me Thakur bhale biraje

Satyug chodi Mathura nagri
Dwapur chodi Kashi

Satyug chodi Mathura nagri
Dwapur chodi Kashi

Satyug chodi Mathura nagri
Dwapur chodi Kashi
Dwapur chodi Kashi

Jharkhand me jaye biraje
Vrindavan ke basi

Jagannathpuri me Thakur bhale biraje
Jagannathpuri me Thakur bhale biraje

Thakur bhale biraje
Thakur bhale biraje
Thakur bhale biraje
Thakur bhale biraje

Jagannathpuri me Thakur bhale biraje
Jagannathpuri me Thakur bhale biraje`,
    translation: `## Verses

In Jagannath Puri, the Lord dwells beautifully
In Jagannath Puri, the Lord dwells beautifully

The Lord dwells beautifully
The Lord dwells beautifully
In Jagannath Puri, the Lord dwells beautifully
In Jagannath Puri, the Lord dwells beautifully

Why did You leave Mathura (Krishna's birth city)
Why did You leave Kashi (Varanasi, holy city on the Ganges)

Why did You leave Mathura (Krishna's birth city)
Why did You leave Kashi (Varanasi, holy city on the Ganges)
Why did You leave Kashi (Varanasi, holy city on the Ganges)

You went and settled in Vrindavan (Krishna's childhood home)
You went and settled in Vrindavan (Krishna's childhood home)
Resident of Vrindavan

In Jagannath Puri, the Lord dwells beautifully
In Jagannath Puri, the Lord dwells beautifully

In Satya Yuga You left Mathura
In Dwapar Yuga You left Kashi

In Satya Yuga You left Mathura
In Dwapar Yuga You left Kashi

In Satya Yuga You left Mathura
In Dwapar Yuga You left Kashi
In Dwapar Yuga You left Kashi

You went and settled in Jharkhand (eastern forest land)
Resident of Vrindavan

In Jagannath Puri, the Lord dwells beautifully
In Jagannath Puri, the Lord dwells beautifully

The Lord dwells beautifully
The Lord dwells beautifully
The Lord dwells beautifully
The Lord dwells beautifully

In Jagannath Puri, the Lord dwells beautifully
In Jagannath Puri, the Lord dwells beautifully`,
  },
  "bhaija-bharat-ghar-djawo-ramdew-chaitoe": {
    title: "Bhaija Bharat Ghar Djawo",
    alternate_title: "Bharat Ghar Jao",
    artist_version: "Ramdew Chaitoe",
    audio_url: "/audio/folders/chutney-style-bhajan/bhaija-bharat-ghar-djawo-ramdew-chaitoe.mp3",
    thumbnail_url: "/images/albums/star-melodies-ramdew-chaitoe.jpg",
    cover_url: "/images/albums/star-melodies-ramdew-chaitoe-player.jpg",
    mini_cover_url: "/images/albums/star-melodies-ramdew-chaitoe.jpg",
    display_order: 74,
    category_slugs: ["ram", "general", "satsang", "bhajan", "devotion", "hindi"],
    meaning:
      "Ramayan devotion — brother Bharat, go home. Ramdew Chaitoe · The Star Melodies (Traditional Chaitoe).",
    roman_lyrics: `## Chorus

Bhaija Bharat ghar djawo
Bhaija Bharat ghar djawo`,
    translation: `## Chorus

Brother Bharat, go home
Brother Bharat, go home`,
  },
  "rako-ladj-hamarie-ramdew-chaitoe": {
    title: "Rako Ladj Hamarie",
    alternate_title: "Rakh Laaj Hamari",
    artist_version: "Ramdew Chaitoe",
    audio_url: "/audio/folders/chutney-style-bhajan/rako-ladj-hamarie-ramdew-chaitoe.mp3",
    thumbnail_url: "/images/albums/star-melodies-ramdew-chaitoe.jpg",
    cover_url: "/images/albums/star-melodies-ramdew-chaitoe-player.jpg",
    mini_cover_url: "/images/albums/star-melodies-ramdew-chaitoe.jpg",
    display_order: 75,
    category_slugs: ["ram", "general", "satsang", "bhajan", "devotion", "hindi"],
    meaning:
      "Protect my honour, O Lord — classic prayer in baithak style. Ramdew Chaitoe · The Star Melodies (Traditional Chaitoe).",
    roman_lyrics: `## Chorus

Rako ladj hamarie
Rako ladj hamarie`,
    translation: `## Chorus

Protect my honour
Protect my honour`,
  },
  "adjie-naath-kaise-arjun-ke-abhie-maan-ramdew-chaitoe": {
    title: "Adjie Naath Kaise Arjun Ke Abhie Maan",
    alternate_title: "Adi Nath · Arjun Ke Abhiman",
    artist_version: "Ramdew Chaitoe",
    audio_url:
      "/audio/folders/chutney-style-bhajan/adjie-naath-kaise-arjun-ke-abhie-maan-ramdew-chaitoe.mp3",
    thumbnail_url: "/images/albums/star-melodies-ramdew-chaitoe.jpg",
    cover_url: "/images/albums/star-melodies-ramdew-chaitoe-player.jpg",
    mini_cover_url: "/images/albums/star-melodies-ramdew-chaitoe.jpg",
    display_order: 76,
    category_slugs: ["general", "satsang", "bhajan", "devotion", "hindi"],
    meaning:
      "Adi Nath and Arjun's pride — religious narrative in baithak style. Ramdew Chaitoe · The Star Melodies (Traditional Chaitoe).",
    roman_lyrics: `## Chorus

Adjie Naath kaise Arjun ke abhie maan
Adjie Naath kaise Arjun ke abhie maan`,
    translation: `## Chorus

Adi Nath — how is Arjun's pride
Adi Nath — how is Arjun's pride`,
  },
  "bhoel-bisar-mati-ramdew-chaitoe": {
    title: "Bhoel Bisar Mati",
    alternate_title: "Bhul Bisar Mat Jana · Bhūl bisar mat",
    artist_version: "Ramdew Chaitoe",
    audio_url: "/audio/folders/chutney-style-bhajan/bhoel-bisar-mati-ramdew-chaitoe.mp3",
    thumbnail_url: "/images/albums/star-melodies-ramdew-chaitoe.jpg",
    cover_url: "/images/albums/star-melodies-ramdew-chaitoe-player.jpg",
    mini_cover_url: "/images/albums/star-melodies-ramdew-chaitoe.jpg",
    display_order: 77,
    category_slugs: ["krishna", "general", "satsang", "bhajan", "devotion", "hindi"],
    meaning:
      "Don't forget to come down my lane, Kanhaiya — a gopi's longing for Krishna. Ramdew Chaitoe · The Star Melodies (Traditional Chaitoe).",
    roman_lyrics: `## Chorus

Bhūl bisar mat jānā Kanhaiyā more galion mė ānā

## Verses

Nām hamār jab tum na jānā
Nām hamārā dīwānā

Suraj jaisā bhaur hamārā
Chandan Chauk nishā

Jab sasure mė bhanak more likhī
Tab se jiyā ghabarānā`,
    translation: `## Chorus

Don't forget to pass by my street, oh Kanhaiya

## Verses

If you don't know my name
Ask for the one madly in love

It is as if the sun illuminates the way to my room
And the moon gives a sign my courtyard

When you hear my humming coming from my in-laws'
Know that heart longs for you`,
  },

  "koi-na-banai-ramdew-chaitoe": {
    title: "Koi Na Banai",
    alternate_title: "Koie Na Benajie · Ab Ram Ke Bigadan",
    artist_version: "Ramdew Chaitoe",
    audio_url: "/audio/folders/chutney-style-bhajan/koi-na-banai-ramdew-chaitoe.mp3",
    thumbnail_url: "/images/albums/star-melodies-ramdew-chaitoe.jpg",
    cover_url: "/images/albums/star-melodies-ramdew-chaitoe-player.jpg",
    mini_cover_url: "/images/albums/star-melodies-ramdew-chaitoe.jpg",
    display_order: 78,
    category_slugs: [
      "ram",
      "hanuman",
      "general",
      "satsang",
      "bhajan",
      "devotion",
      "hindi",
    ],
    meaning:
      "Ramdew Chaitoe · The Star Melodies (Traditional Chaitoe). When Ram is angry — with Lakshman, Janaki, Hanuman, the sacred rivers, Angad — nobody can undo it; Lanka burns, and even Tulsidas cannot fully tell it.",
    roman_lyrics: `## Chorus

Koi na banai
Koi na banai
Koi na banai
Koi na banai

Ab Ram ke bigadan, bat koi na banai
Ab Ram ke bigadan, bat koi na banai
Ab Ram ke bigadan, bat koi na banai

## Verse 1

Ram bigad gaye, Laxman bigada
Bigadi Januki Maai
Ram bigad gaye, Laxman bigada
Bigadi Januki Maai

Mahaveer Randheer bigad gaye
Kshan hi mein Lanka jalai

## Chorus

Koi na banai

Ab Ram ke bigadan, bat koi na banai
Ab Ram ke bigadan, bat koi na banai

## Verse 2

Ganga bigadi, Jamuna bigadi, bigadi Sursa Mai
Anjani ke putra Hanuman bigad gaye, jai ke Lanka jarai

## Chorus

Koi na banai

Ab Ram ke bigadan, bat koi na banai
Ab Ram ke bigadan, bat koi na banai

Koi na banai Rama
Koi na banai Rama

Ab Ram ke bigadan, bat koi na banai

Koi na banai Rama
Koi na banai Rama
Koi na banai Rama
Koi na banai Rama

Ab Ram ke bigadan, bat koi na banai
Ab Ram ke bigadan, bat koi na banai
Ab Ram ke bigadan, bat koi na banai

## Verse 3

Ram bigad gaye, Laxman bigada
Bigadi Januki Maai
Mahaveer Randheer bigad gaye
Kshan hi mein Lanka jalai

Ganga bigadi, Jamuna bigadi, bigadi Sursa Mai
Anjani ke putra Hanuman bigad gaye, jai ke Lanka jarai
Bali ke sut Angad bigad gaye Lanka per jamaye
Tulsidaas shabdon mein ye baat nahi kar paaye

## Closing

Ab Ram ke bigadan, koi na banai
Ab Ram ke bigadan, koi na banai
Ab Ram ke bigadan, koi na banai

Ab Ram ke bigadan, koi na banai
Ab Ram ke bigadan, koi na banai
Ab Ram ke bigadan, koi na banai

Koi na banai
Koi na banai
Koi na banai Rama
Koi na banai Rama
Koi na banai Rama

Ab Ram ke bigadan, koi na banai
Ab Ram ke bigadan, koi na banai
Ab Ram ke bigadan, koi na banai`,
    translation: `## Chorus

Nobody can do anything
Nobody can do anything
Nobody can do anything
Nobody can do anything

Ram is angry now, nobody can do anything
Ram is angry now, nobody can do anything
Ram is angry now, nobody can do anything

## Verse 1

Ram is angry, Lakshman is angry
Sita Mata is angry
Ram is angry, Lakshman is angry
Sita Mata is angry

Mahaveer Randheer is angry
In a moment he burned Lanka

## Chorus

Nobody can do anything

Ram is angry now, nobody can do anything
Ram is angry now, nobody can do anything

## Verse 2

Ganga is angry, Yamuna is angry, Sursa Mai is angry
Anjani’s son Hanuman is angry — he burned Lanka

## Chorus

Nobody can do anything

Ram is angry now, nobody can do anything
Ram is angry now, nobody can do anything

Nobody can do anything, Rama
Nobody can do anything, Rama

Ram is angry now, nobody can do anything

Nobody can do anything, Rama
Nobody can do anything, Rama
Nobody can do anything, Rama
Nobody can do anything, Rama

Ram is angry now, nobody can do anything
Ram is angry now, nobody can do anything
Ram is angry now, nobody can do anything

## Verse 3

Ram is angry, Lakshman is angry
Sita Mata is angry
Mahaveer Randheer is angry
In a moment he burned Lanka

Ganga is angry, Yamuna is angry, Sursa Mai is angry
Anjani’s son Hanuman is angry — he burned Lanka
Bali’s son Angad is angry — he planted his foot in Lanka
Even Tulsidas could not put this in words

## Closing

Ram is angry now, nobody can do anything
Ram is angry now, nobody can do anything
Ram is angry now, nobody can do anything

Ram is angry now, nobody can do anything
Ram is angry now, nobody can do anything
Ram is angry now, nobody can do anything

Nobody can do anything
Nobody can do anything
Nobody can do anything, Rama
Nobody can do anything, Rama
Nobody can do anything, Rama

Ram is angry now, nobody can do anything
Ram is angry now, nobody can do anything
Ram is angry now, nobody can do anything`,
  },

  // —— Let's Play Holi (Zone / VP Premier) — Holi remixes ——
  "rang-barse-vp-premier-lets-play-holi": {
    title: "Rang Barse",
    alternate_title: "Let's Play Holi · Track 1 · Holi remix",
    artist_version: "VP Premier",
    audio_url: "/audio/albums/lets-play-holi/01-rang-barse-vp-premier.mp3",
    thumbnail_url: "/images/albums/lets-play-holi.png",
    cover_url: "/images/albums/lets-play-holi-player-cover.png",
    mini_cover_url: "/images/albums/lets-play-holi-mini-cover.png",
    display_order: 200,
    category_slugs: ["krishna", "general", "holi", "satsang", "bhajan", "hindi"],
    meaning:
      "Holi remix from Let's Play Holi (Zone / VP Premier). Colour rains on Holi — the pichkari soaks the chunar and angiya, while Gauri’s beloved is served, offered paan, and laid to rest on a bed of jasmine.",
    roman_lyrics: `## Chorus

Are kaine mari pichkari
Tori bhigee angiya
O rangrasia rangrasia ho

Rang barse bhige chunar wali rang barse

## Verse 1

Sone kee thali mai jona parosa
Are sone kee thali mai jona parosa
Are khaye gauri kaa yar
Balam tarse
Holi hai

Rang barse bhige chunar wali rang barse

## Verse 2

Launga ilaichi kaa bida lagaya
Are launga ilaichi kaa bida lagaya
Are chabe gauri kaa yar
Balam tarse
Holi hai

Rang barse bhige chunar wali rang barse

## Verse 3

Are bela chameli kaa sej bhichhaya
Are bela chameli kaa sej bhichhaya
Soye gauri kaa yar
Balam tarse
Holi hai

Rang barse bhige chunar wali rang barse`,
    translation: `## Chorus

Someone sprayed the pichkari
Your blouse is soaked
O lover of colour, O lover of colour

Colour rains — the woman in the wet chunar, colour rains

## Verse 1

On a golden plate the meal is served
On a golden plate the meal is served
Gauri’s beloved will eat
The lover longs
It is Holi

Colour rains — the woman in the wet chunar, colour rains

## Verse 2

A paan of clove and cardamom is prepared
A paan of clove and cardamom is prepared
Gauri’s beloved will chew it
The lover longs
It is Holi

Colour rains — the woman in the wet chunar, colour rains

## Verse 3

A bed of bela and jasmine is spread
A bed of bela and jasmine is spread
Gauri’s beloved will sleep
The lover longs
It is Holi

Colour rains — the woman in the wet chunar, colour rains`,
  },
  "holi-khele-dj-shane-lets-play-holi": {
    title: "Holi Khele",
    alternate_title: "Let's Play Holi · Track 2 · Holi remix",
    artist_version: "DJ Shane",
    audio_url: "/audio/albums/lets-play-holi/02-holi-khele-dj-shane.mp3",
    thumbnail_url: "/images/albums/lets-play-holi.png",
    cover_url: "/images/albums/lets-play-holi-player-cover.png",
    mini_cover_url: "/images/albums/lets-play-holi-mini-cover.png",
    display_order: 201,
    category_slugs: ["krishna", "general", "holi", "satsang", "bhajan", "hindi"],
    meaning:
      "Holi remix from Let's Play Holi (Zone / VP Premier). Holi Khele Raghuveera — Rama plays Holi in Awadh while dhol and colour bring everyone together.",
    roman_lyrics: HOLI_KHELE_ROMAN,
    translation: HOLI_KHELE_TRANSLATION,
  },
  "holi-re-holi-mistah-studz-lets-play-holi": {
    title: "Holi Re Holi",
    alternate_title: "Let's Play Holi · Track 3 · Holi remix",
    artist_version: "Mistah Studz",
    audio_url: "/audio/albums/lets-play-holi/03-holi-re-holi-mistah-studz.mp3",
    thumbnail_url: "/images/albums/lets-play-holi.png",
    cover_url: "/images/albums/lets-play-holi-player-cover.png",
    mini_cover_url: "/images/albums/lets-play-holi-mini-cover.png",
    display_order: 202,
    category_slugs: ["krishna", "general", "holi", "satsang", "bhajan", "hindi"],
    meaning:
      "Holi remix from Let's Play Holi (Zone / VP Premier). Holi Re Holi — a palanquin of colour arrives at the door, pichkari sprays, Radha runs and Nandlal follows.",
    roman_lyrics: HOLI_RE_ROMAN,
    translation: HOLI_RE_TRANSLATION,
  },
  "ang-se-anga-dj-tone-lets-play-holi": {
    title: "Ang Se Anga",
    alternate_title: "Let's Play Holi · Track 4 · Holi remix",
    artist_version: "DJ Tone",
    audio_url: "/audio/albums/lets-play-holi/04-ang-se-anga-dj-tone.mp3",
    thumbnail_url: "/images/albums/lets-play-holi.png",
    cover_url: "/images/albums/lets-play-holi-player-cover.png",
    mini_cover_url: "/images/albums/lets-play-holi-mini-cover.png",
    display_order: 203,
    category_slugs: ["krishna", "general", "holi", "satsang", "bhajan", "hindi"],
    meaning:
      "Holi remix from Let's Play Holi (Zone / VP Premier). Ang Se Ang Lagana — Holi as close colour-play: cheek to cheek, eyes meeting, body coloured by the beloved.",
    roman_lyrics: ANG_SE_ANGA_ROMAN,
    translation: ANG_SE_ANGA_TRANSLATION,
  },
  "saat-range-mein-mistah-mixup-lets-play-holi": {
    title: "Saat Range Mein",
    alternate_title: "Let's Play Holi · Track 5 · Holi remix",
    artist_version: "Mistah Mixup",
    audio_url: "/audio/albums/lets-play-holi/05-saat-range-mein-mistah-mixup.mp3",
    thumbnail_url: "/images/albums/lets-play-holi.png",
    cover_url: "/images/albums/lets-play-holi-player-cover.png",
    mini_cover_url: "/images/albums/lets-play-holi-mini-cover.png",
    display_order: 204,
    category_slugs: ["krishna", "general", "holi", "satsang", "bhajan", "hindi"],
    meaning:
      "Holi remix from Let's Play Holi (Zone / VP Premier). Saat Rang Mein — playing in seven colours until the daaman and choli are wet, and this Holi is remembered.",
    roman_lyrics: SAAT_RANG_ROMAN,
    translation: SAAT_RANG_TRANSLATION,
  },
  "aaj-na-choddenge-dj-xquizit-lets-play-holi": {
    title: "Aaj Na Choddenge",
    alternate_title: "Let's Play Holi · Track 6 · Holi remix",
    artist_version: "DJ Xquizit",
    audio_url: "/audio/albums/lets-play-holi/06-aaj-na-choddenge-dj-xquizit.mp3",
    thumbnail_url: "/images/albums/lets-play-holi.png",
    cover_url: "/images/albums/lets-play-holi-player-cover.png",
    mini_cover_url: "/images/albums/lets-play-holi-mini-cover.png",
    display_order: 205,
    category_slugs: ["krishna", "general", "holi", "satsang", "bhajan", "hindi"],
    meaning:
      "Holi remix from Let's Play Holi (Zone / VP Premier). Aaj Na Chhodenge — companions will not let go today; chunari and choli may get wet, but Holi will be played.",
    roman_lyrics: AAJ_NA_CHODDENGE_ROMAN,
    translation: AAJ_NA_CHODDENGE_TRANSLATION,
  },
  "holi-ki-din-dj-ryan-jhingree-lets-play-holi": {
    title: "Holi Ki Din",
    alternate_title: "Let's Play Holi · Track 7 · Holi remix",
    artist_version: "DJ Ryan Jhingree",
    audio_url: "/audio/albums/lets-play-holi/07-holi-ki-din-dj-ryan-jhingree.mp3",
    thumbnail_url: "/images/albums/lets-play-holi.png",
    cover_url: "/images/albums/lets-play-holi-player-cover.png",
    mini_cover_url: "/images/albums/lets-play-holi-mini-cover.png",
    display_order: 206,
    category_slugs: ["krishna", "general", "holi", "satsang", "bhajan", "hindi"],
    meaning:
      "Holi remix from Let's Play Holi (Zone / VP Premier). Holi Ke Din — hearts blossom, colours mix, and even enemies embrace.",
    roman_lyrics: HOLI_KI_DIN_ROMAN,
    translation: HOLI_KI_DIN_TRANSLATION,
  },
  "holiya-aaye-re-dj-snypa-lets-play-holi": {
    title: "Holiya Aaye Re",
    alternate_title: "Let's Play Holi · Track 8 · Holi remix",
    artist_version: "DJ Snypa",
    audio_url: "/audio/albums/lets-play-holi/08-holiya-aaye-re-dj-snypa.mp3",
    thumbnail_url: "/images/albums/lets-play-holi.png",
    cover_url: "/images/albums/lets-play-holi-player-cover.png",
    mini_cover_url: "/images/albums/lets-play-holi-mini-cover.png",
    display_order: 207,
    category_slugs: ["krishna", "general", "holi", "satsang", "bhajan", "hindi"],
    meaning:
      "Holi remix from Let's Play Holi (Zone / VP Premier). Holi Aayi Re Kanhai — colour overflows, gulaal rains in the courtyard, and Radha asks Kanhai to play the flute.",
    roman_lyrics: HOLIYA_AAYE_ROMAN,
    translation: HOLIYA_AAYE_TRANSLATION,
  },
  "maro-bichkaar-dj-ryan-jhingree-lets-play-holi": {
    title: "Maro Bichkaar",
    alternate_title: "Let's Play Holi · Track 9 · Holi remix",
    artist_version: "DJ Ryan Jhingree",
    audio_url: "/audio/albums/lets-play-holi/09-maro-bichkaar-dj-ryan-jhingree.mp3",
    thumbnail_url: "/images/albums/lets-play-holi.png",
    cover_url: "/images/albums/lets-play-holi-player-cover.png",
    mini_cover_url: "/images/albums/lets-play-holi-mini-cover.png",
    display_order: 208,
    category_slugs: ["krishna", "general", "holi", "satsang", "bhajan", "hindi"],
    meaning:
      "Holi remix from Let's Play Holi (Zone / VP Premier). Maro Bichkaar / pichkari — spray the pump full; Holi’s meaning is one colour for the whole world.",
    roman_lyrics: MARO_BICHKAAR_ROMAN,
    translation: MARO_BICHKAAR_TRANSLATION,
  },
  "holi-aai-re-dj-snypa-lets-play-holi": {
    title: "Holi Aai Re",
    alternate_title: "Let's Play Holi · Track 10 · Holi remix",
    artist_version: "DJ Snypa",
    audio_url: "/audio/albums/lets-play-holi/10-holi-aai-re-dj-snypa.mp3",
    thumbnail_url: "/images/albums/lets-play-holi.png",
    cover_url: "/images/albums/lets-play-holi-player-cover.png",
    mini_cover_url: "/images/albums/lets-play-holi-mini-cover.png",
    display_order: 209,
    category_slugs: ["krishna", "general", "holi", "satsang", "bhajan", "hindi"],
    meaning:
      "Holi remix from Let's Play Holi (Zone / VP Premier). Holi Aayi Re — Holi has come, bodies soaked in colour, faces blue and red.",
    roman_lyrics: HOLI_AAI_RE_ROMAN,
    translation: HOLI_AAI_RE_TRANSLATION,
  },
  "lets-play-holi-dj-hozz": {
    title: "Let's Play Holi",
    alternate_title: "Let's Play Holi · Track 11 · Holi remix",
    artist_version: "DJ Hozz",
    audio_url: "/audio/albums/lets-play-holi/11-lets-play-holi-dj-hozz.mp3",
    thumbnail_url: "/images/albums/lets-play-holi.png",
    cover_url: "/images/albums/lets-play-holi-player-cover.png",
    mini_cover_url: "/images/albums/lets-play-holi-mini-cover.png",
    display_order: 210,
    category_slugs: ["krishna", "general", "holi", "satsang", "bhajan", "hindi"],
    meaning:
      "Holi remix mix from Let's Play Holi (Zone / VP Premier). Title track — choruses of Rang Barse, Holi Ke Din, and Hori Khele Raghuveera.",
    roman_lyrics: LETS_PLAY_HOLI_ROMAN,
    translation: LETS_PLAY_HOLI_TRANSLATION,
  },
  "holi-re-dj-tone-dj-snypa-lets-play-holi": {
    title: "Holi Re",
    alternate_title: "Let's Play Holi · Track 12 · Holi remix",
    artist_version: "DJ Tone & DJ Snypa",
    audio_url: "/audio/albums/lets-play-holi/12-holi-re-dj-tone-dj-snypa.mp3",
    thumbnail_url: "/images/albums/lets-play-holi.png",
    cover_url: "/images/albums/lets-play-holi-player-cover.png",
    mini_cover_url: "/images/albums/lets-play-holi-mini-cover.png",
    display_order: 211,
    category_slugs: ["krishna", "general", "holi", "satsang", "bhajan", "hindi"],
    meaning:
      "Holi remix from Let's Play Holi (Zone / VP Premier). Holi Re Holi — a palanquin of colour arrives at the door, pichkari sprays, Radha runs and Nandlal follows.",
    roman_lyrics: HOLI_RE_ROMAN,
    translation: HOLI_RE_TRANSLATION,
  },
  "holiya-main-ude-dj-rye-lets-play-holi": {
    title: "Holiya Main Ude",
    alternate_title: "Let's Play Holi · Track 13 · Holi remix",
    artist_version: "DJ Rye",
    audio_url: "/audio/albums/lets-play-holi/13-holiya-main-ude-dj-rye.mp3",
    thumbnail_url: "/images/albums/lets-play-holi.png",
    cover_url: "/images/albums/lets-play-holi-player-cover.png",
    mini_cover_url: "/images/albums/lets-play-holi-mini-cover.png",
    display_order: 212,
    category_slugs: ["krishna", "general", "holi", "satsang", "bhajan", "hindi"],
    meaning:
      "Holi remix from Let's Play Holi (Zone / VP Premier). Holiya Mein Ude Re Gulal — gulal flies on Holi; tell the betrothed.",
    roman_lyrics: HOLIYA_UDE_ROMAN,
    translation: HOLIYA_UDE_TRANSLATION,
  },
  "ang-se-anga-mistah-studz-lets-play-holi": {
    title: "Ang Se Anga",
    alternate_title: "Let's Play Holi · Track 14 · Holi remix",
    artist_version: "Mistah Studz",
    audio_url: "/audio/albums/lets-play-holi/14-ang-se-anga-mistah-studz.mp3",
    thumbnail_url: "/images/albums/lets-play-holi.png",
    cover_url: "/images/albums/lets-play-holi-player-cover.png",
    mini_cover_url: "/images/albums/lets-play-holi-mini-cover.png",
    display_order: 213,
    category_slugs: ["krishna", "general", "holi", "satsang", "bhajan", "hindi"],
    meaning:
      "Holi remix from Let's Play Holi (Zone / VP Premier). Ang Se Ang Lagana — Holi as close colour-play: cheek to cheek, eyes meeting, body coloured by the beloved.",
    roman_lyrics: ANG_SE_ANGA_ROMAN,
    translation: ANG_SE_ANGA_TRANSLATION,
  },
  "saat-rang-mein-dj-tone-lets-play-holi": {
    title: "Saat Rang Mein",
    alternate_title: "Let's Play Holi · Track 15 · Holi remix",
    artist_version: "DJ Tone",
    audio_url: "/audio/albums/lets-play-holi/15-saat-rang-mein-dj-tone.mp3",
    thumbnail_url: "/images/albums/lets-play-holi.png",
    cover_url: "/images/albums/lets-play-holi-player-cover.png",
    mini_cover_url: "/images/albums/lets-play-holi-mini-cover.png",
    display_order: 214,
    category_slugs: ["krishna", "general", "holi", "satsang", "bhajan", "hindi"],
    meaning:
      "Holi remix from Let's Play Holi (Zone / VP Premier). Saat Rang Mein — playing in seven colours until the daaman and choli are wet, and this Holi is remembered.",
    roman_lyrics: SAAT_RANG_ROMAN,
    translation: SAAT_RANG_TRANSLATION,
  },
  "holi-khele-dj-static-flow-lets-play-holi": {
    title: "Holi Khele",
    alternate_title: "Let's Play Holi · Track 16 · Holi remix",
    artist_version: "DJ Static Flow",
    audio_url: "/audio/albums/lets-play-holi/16-holi-khele-dj-static-flow.mp3",
    thumbnail_url: "/images/albums/lets-play-holi.png",
    cover_url: "/images/albums/lets-play-holi-player-cover.png",
    mini_cover_url: "/images/albums/lets-play-holi-mini-cover.png",
    display_order: 215,
    category_slugs: ["krishna", "general", "holi", "satsang", "bhajan", "hindi"],
    meaning:
      "Holi remix from Let's Play Holi (Zone / VP Premier). Holi Khele Raghuveera — Rama plays Holi in Awadh while dhol and colour bring everyone together.",
    roman_lyrics: HOLI_KHELE_ROMAN,
    translation: HOLI_KHELE_TRANSLATION,
  },

  "shiv-tandav-peace-prayer-priyesh-dhoolab": {
    title: "Shiv Tandav",
    alternate_title: "Shiv Tandav Stotram · Peace Prayer · Maha Shivratri",
    artist_version: "Priyesh Dhoolab",
    audio_url: "/audio/shiv-tandav-peace-prayer.mp3",
    thumbnail_url: "/images/shiv-tandav-peace-prayer-square.png",
    cover_url: "/images/shiv-tandav-peace-prayer-square.png",
    mini_cover_url: "/images/shiv-tandav-peace-prayer-square.png",
    display_order: 216,
    category_slugs: [
      "shiva",
      "shivratri",
      "general",
      "satsang",
      "bhajan",
      "devotion",
      "sanskrit",
    ],
    meaning:
      "Priyesh Dhoolab’s Peace Prayer setting of the Shiv Tandav Stotram — Ravana’s Sanskrit hymn to Shiva’s tandav. A mellow, melodic take that emphasises the calm love of Shiva and Parvati. Roman lines are broken for pronunciation.",
    roman_lyrics: `## Stotram · Pronunciation

Ja-taa-ta-vee-ga-laj-ja-la pra-vaa-ha-pa-vi-ta-stha-le
Ga-le-a-va-lam-bya lam-bi-taam bhu-jan-ga-tun-ga-maa-li-kaam
Da-mad da-mad da-mad-da-ma ni-naa-da-vad-da-mar-va-yam
Cha-ka-ra chan-da-taan-da-vam ta-no-tu nah shi-vah shi-vam

Ja-taa-ka-taa-ha-sam-bhra-ma bhra-ma-ni-lim-pa-nir-jha-ree
Vi-lo-la-vee-chi-val-la-ree vi-raa-ja-maa-na-moor-dha-nee
Dha-gad-dha-gad-dhi-gaj-jva-la la-laa-ta-pat-ta-paa-va-ke
Ki-sho-ra-chan-dra-she-kha-re ra-tih pra-ti-ksha-nam ma-ma

Dha-raa-dha-ren-dra-nan-di-nee vi-laa-sa-ban-dhu-ban-dhu-ra
Sphu-ra-di-gan-ta-san-ta-ti pra-mo-da-maa-na-maa-na-se
Kri-paa-ka-taak-sha-dho-ra-nee ni-rud-dha-dur-dha-raa-pa-di
Kva-chid di-gam-ba-re ma-no vi-no-da-me-tu vas-tu-ni

Ja-taa-bhu-jan-ga-pin-ga-la sphu-rat-pha-naa-ma-ni-pra-bhaa
Ka-dam-ba-kun-ku-ma-dra-va pra-lup-ta-dig-va-dhoo-mu-khe
Ma-dan-dha-sin-dhu-ras-phu-rat vu-gu-ta-ree-ya-bhu-jan-ga-te
Ji-ro-dhi-yaa-ta-naa-ma-te ja-yat-ka-taa-ha-bhe-da-ne

La-laa-ta-cha-twa-ra-jwa-lad dha-nan-ja-ya-sphu-lin-ga-bhaah
Ni-pee-ta-pan-cha-saa-ya-kam na-man-ni-lim-pa-naa-ya-kam
Su-dhaa-ma-yook-ha-le-kha-yaa vi-raa-ja-maa-na-she-kha-ram
Ma-haa-ka-paa-li-sam-pa-de shi-ro-ja-taa-la-mas-tu nah

Sa-has-ra-lo-cha-na-pra-bhri-tya-she-sha-le-kha-she-kha-rah
Pra-soo-na-dhoo-li-dho-ra-nee vi-dhoo-sa-raang-hri-pee-tha-bhooh
Bhu-jan-ga-raa-ja-maa-la-yaa ni-bad-dha-jaa-ta-joo-ta-kah
Shri-yai chi-raa-ya jaa-ya-taam cha-ko-ra-ban-dhu-she-kha-rah

Ka-raa-la-bhaa-la-pat-ti-kaa-dha-gad-dha-gad-dhi-gaj-jwa-la
Dhan-an-ja-yaa-hu-tee-kri-ta-pra-chan-da-pan-cha-saa-ya-ke
Dha-raa-dha-ren-dra-nan-di-nee-ku-chaa-gra-chi-tra-pat-ra-ka
Pra-kal-pa-nai-ka-shil-pi-ni tri-lo-cha-ne ra-tir ma-ma

Na-vee-na-me-gha-man-da-lee ni-rud-dha-dur-dha-ras-phu-rat
Ku-hoo-ni-shee-thi-nee-ta-mah pra-ban-dha-bad-dha-kan-dha-rah
Ni-lim-pa-nir-jha-ree-dha-ras ta-no-tu kri-tti-sin-dhu-rah
Ka-laa-ni-dhaa-na-ban-dhu-rah shri-yam ja-gad-dhu-ran-dha-rah

Pra-phul-la-nee-la-pan-ka-ja pra-pan-cha-kaa-li-ma-pra-bhaa
Va-lam-bi-kan-tha-kan-da-lee ru-chi-pra-ban-dha-kan-dha-ram
Sma-rach-chhi-dam pu-rach-chhi-dam bha-vach-chhi-dam ma-khach-chhi-dam
Ga-jach-chhi-dan-dha-kach-chhi-dam ta-man-ta-kach-chhi-dam bha-je

A-khar-va-sar-va-man-ga-laa-ka-laa-ka-dam-ba-man-ja-ree
Ra-sa-pra-vaa-ha-maa-dhu-ree vi-jrim-bha-naa-ma-dhu-vra-tam
Sma-ran-ta-kam pu-ran-ta-kam bha-van-ta-kam ma-khan-ta-kam
Ga-jan-ta-kan-dha-kan-ta-kam ta-man-ta-kan-ta-kam bha-je

Ja-yat-va-dab-hra-vi-bhra-ma bhra-mad-bhu-jan-ga-mash-va-sa
Dvi-nir-ga-mat-kra-ma-sphu-rat ka-raa-la-bhaa-la-hav-ya-vat
Dhi-mid dhi-mid dhi-mid-dhva-nan mri-dan-ga-tun-ga-man-ga-la
Dhva-ni-kra-ma-pra-var-ti-ta pra-chan-da-taan-da-vah shi-vah

Dri-shad-vi-chi-tra-tal-pa-yor bhu-jan-ga-mauk-ti-kas-ra-jor
Ga-rish-tha-rat-na-losh-tha-yoh su-hrid-vi-pak-sha-pak-sha-yoh
Tri-shnaa-ra-vin-da-chak-shu-shoh pra-jaa-ma-hee-ma-hen-dra-yoh
Sa-ma-pra-vrit-ti-kah ka-daa sa-daa-shi-vam bha-jaa-my-a-ham

Ka-daa ni-lim-pa-nir-jha-ree-ni-kun-ja-ko-ta-re va-san
Vi-muk-ta-dur-ma-tih sa-daa shi-rah-stha-man-ja-lim va-han
Vi-muk-ta-lo-la-lo-cha-no la-laa-ta-phaa-la-lag-na-kah
Shi-ve-ti man-tram uch-cha-ran ka-daa su-khee bha-vaa-my-a-ham

I-mam hi nit-yam e-va muk-tam ut-ta-mot-ta-mam sta-vam
Pa-than sma-ran bru-van na-ro vi-shud-dhim e-ti san-ta-tam
Ha-re gu-rau su-bhak-tim aa-shu yaa-ti naan-ya-thaa ga-tim
Vi-mo-ha-nam hi de-hi-naam su-shan-ka-ras-ya chin-ta-nam

Poo-jaa-va-saa-na-sa-ma-ye da-sha-vak-tra-gee-tam
Yah sham-bhu-poo-ja-na-pa-ram pa-tha-ti pra-do-she
Tas-ya sthi-ram ra-tha-ga-jen-dra-tu-ran-ga-yuk-tam
Laksh-meem sa-dai-va su-mu-kheem pra-da-daa-ti sham-bhuh`,
    translation: `## Stotram · Meaning

May Shiva, who bears the sacred Ganga in his matted locks,
A serpent garland around his neck,
And whose damaru sounds damad-damad,
Grant us auspiciousness through his fierce tandav dance.

May I find delight forever in the Lord whose head
Is adorned by the young crescent moon,
Whose forehead fire blazes,
And around whom the heavenly Ganga whirls.

May my mind find joy in that form —
Companion of the mountain’s daughter,
Merciful glance that stills every hardship,
The sky-clad Lord of infinite delight.

May victory be to the Lord who breaks the skull-bowl —
Serpent jewels flashing from his locks,
Saffron paste marking the directions,
Glory of Shiva and Shivaa together.

May we obtain the wealth of the great Kapalin —
Whose forehead fire drank up Kama’s five arrows,
Whom the gods bow before,
Whose crest is lit by rays of nectar.

Victory forever to the moon-crested Lord —
Whose feet are dusted by blossoms from countless crowns,
Whose matted hair is bound with the serpent-king’s garland,
Beloved of the chakora bird.

May my love rest in the three-eyed Lord —
Artist who paints on Parvati’s form,
Whose fierce forehead fire consumes Desire,
Companion of the mountain king’s daughter.

May he who bears the world grant us fortune —
Throat dark as a night of new clouds,
Who holds the heavenly stream,
Treasure-house of time and beauty.

I worship him who destroys Desire, the triple city, worldly bonds, sacrifice’s foes,
The elephant-demon and Andhaka —
And who ends Death himself —
Whose dark throat gleams like a blue lotus.

I worship him who ends Desire, the cities, becoming, sacrifice’s foes,
The elephant and Andhaka, and Death —
Around whom bees of devotion swarm
At the nectar-flow of all auspicious arts.

Victory to Shiva whose tandav is fierce —
Serpents whirling as he dances,
Fire blazing from his brow,
Drum sounding dhimid-dhimid in sacred rhythm.

When shall I always worship Sadashiva,
Who looks equally on grass and couch,
Gems and clods, friend and foe,
A beggar and an emperor?

When shall I, dwelling in a cave by the heavenly stream,
Freed of wicked thought, hands joined upon my head,
Eyes still, brow marked with sacred ash,
Find bliss forever chanting “Shiva”?

Whoever recites this supreme hymn daily
Attains lasting purity;
Devotion to the Guru and Hari comes swiftly —
For contemplation of Shankara removes delusion.

Whoever at dusk, after worship, recites this song of the ten-headed one
Dedicated to Shambhu’s praise —
Shambhu forever grants them firm fortune:
Wealth, elephants, horses, and a gracious Lakshmi.
`,
  },
  "nanda-baba-anand-yankaran": {
    title: "Nanda Baba",
    alternate_title: "Nanda Baba Ji Ko Chhaiya · Kanhaiya",
    artist_version: "Anand Yankaran",
    audio_url: "/audio/folders/chutney-style-bhajan/nanda-baba-anand-yankaran.mp3",
    thumbnail_url: "/images/nanda-baba-anand-yankaran.jpg",
    display_order: 60,
    category_slugs: [
      "krishna",
      "general",
      "janmashtami",
      "satsang",
      "bhajan",
      "devotion",
      "hindi",
    ],
    meaning:
      "Classic Krishna chutney-bhajan. Nanda Baba (Krishna’s foster father in Gokul) is blessed with a baby boy and names him Kanhaiyā. The cowherd boys (gwaal) come to play with marigolds (genda) by the Yamuna under the blue sky — Krishna as the blue (neela) child.",
    roman_lyrics: `## Chorus

Nanda baba ji ko chhaiya
Rakho naam hai Kanhaiya
Babu naam hai Kanhaiya
Kanhaiya, Kanhaiya, re

## Verse 1

Karo gend ko pilaiya
Ai ai re bhi laiya
Kahe ke gende hai
Kahe ka baala
Gende mein kahe ko laage ho challa

## Verse 2

Gwaal baal sab khelan aaye
Var ke datta chhaiya, Kanhaiya, o gora

## Verse 3

Sone ke gende hai
Sone ka baala
Gende mein sone ko laage ho challa

## Verse 4

Le le Jamuna neela gagan hai
Neela Kanhaiya, neela gagan hai
Subah re shaam ye khelan aaye
Subah re shaam yeh nila gagan hai`,
    translation: `## Chorus

Father Nanda was blessed with a baby boy
He kept his name Kanhaiya
The baby boy’s name is Kanhaiya
Oh Kanhaiya, oh Kanhaiya

## Verse 1

The marigold blooms yellow
Oh come bring them too
What kind of marigold?
What kind of offering?
What will be in the marigold?

## Verse 2

The shepherd boys all come to play
The blessed offering, oh Kanhaiya, oh beautiful one

## Verse 3

The marigold is gold
The offerings are gold
There will be gold in the marigold

## Verse 4

The Jamuna River flows underneath the blue sky
Kanhaiya is blue, the sky is blue
Morning and afternoon they come to play
Morning and afternoon the sky is blue`,
  },
  "gauri-puja-dropati": {
    title: "Gauri Puja",
    artist_version: "Dropati",
    youtube_url: "https://www.youtube.com/watch?v=Cs995YwpO_0",
    audio_url:
      "/audio/chutney/lets-sing-and-dance-with-dropati/01-gowri-rooja.mp3",
    thumbnail_url: "/images/chutney/lets-sing-and-dance-with-dropati.png",
    cover_url: "/images/chutney/lets-sing-and-dance-with-dropati-player-v2.png",
    mini_cover_url: "/images/chutney/lets-sing-and-dance-with-dropati.png",
    display_order: 61,
    category_slugs: [
      "ganesh",
      "shiva",
      "ram",
      "wedding",
      "general",
      "satsang",
      "bhajan",
      "devotion",
      "hindi",
    ],
    meaning:
      "Surinamese chutney-bhajan by Dropati (1921–1997). Gauri puja — worship Gauri-Ma and Lord Ganesh; apply tilak and call on Dharti-Ma, Bhavani-Ma, and Deohara (Shiv-baba). Verses place faith in Mother and Father; the whole world is devoted to Ram.",
    roman_lyrics: `## Refrain

Gauri puja, Gauri puja, Gauri Ganesh ho
Tikahu' Dharti maiya matha tumhara
Gauri puja, Gauri puja, Gauri Ganesh ho
Tikahu' Dharti maiya nam ka pukara

## Verse 1

Tohare bharose maiya mai' jag ropeva (2)
More jag puran ho-i su/more Rama (2)

Gauri puja, Gauri puja, Gauri Ganesh ho
Tikahu' Bhavani maiya matha tumhara
Gauri puja, Gauri puja, Gauri Ganesh ho
Tikahu' hamare maiya nam ka pukara

## Verse 2

Tohare bharose maiya mai' jag thaneva (2)
More jag puran ho-i su/ho Rama (2)

Ala Gauri puja, Gauri puja, Gauri Ganesh ho
Tikahu' Deohara baba matha tumhara
Gauri puja, Gauri puja, Gauri Ganesh ho
Tikahu' Deohara baba nam ka pukara

## Verse 3

Tohare bharose maiya mai' jag thaneva
Tohare bharose maiya mai' jag ropeva
Ai more jag puran hota ho Rama
More jag puran ho-i more Rama (2)

Gauri puja, Gauri puja, Gauri Ganesh ho
Tikahu' hamare/Dharti maiya matha tumharo (2)

## Verse 4

Tohare bharose baba mai' jag thaneva
Tohare bharose baba mai' jag ropeva
More jag puran ho-i ho Rama (2)
Arre, more jag puran ho-i ho Rama (2)

## Relā (slow)

More jag puran ho-i ho Rama
More jag puran ho-i su Rama
More jag puran ho-i su Rama
More jag puran ho-i ho Rama`,
    translation: `## Refrain

Glorify Gauri-Ma and Lord Ganesh — Gauri puja, Gauri puja
Place the auspicious mark of Dharti-Ma on your forehead
Glorify Gauri-Ma and Lord Ganesh — Gauri puja, Gauri puja
Place the mark and call on the name of Dharti-Ma (Earth-mother)

## Verse 1

I place my faith in this world in you, Mother (2)
My whole world was devoted to Lord Ram (2)

Gauri puja, Gauri puja — glorify Gauri-Ma and Lord Ganesh
Place the auspicious mark of Bhavani-Ma on your forehead
Gauri puja, Gauri puja — glorify Gauri-Ma and Lord Ganesh
Place the mark and call on the name of our Mother

## Verse 2

I place my confidence in this world in you, Mother (2)
My whole world was devoted to Lord Ram (2)

Look — Gauri puja, Gauri puja — glorify Gauri-Ma and Lord Ganesh
Place the auspicious mark of Shiv-baba (Deohara) on your forehead
Gauri puja, Gauri puja — glorify Gauri-Ma and Lord Ganesh
Place the auspicious mark and call on the name of Shiv-baba

## Verse 3

I place my confidence in this world in you, Mother
I place my faith in this world in you, Mother
Ah — my whole world was devoted to Lord Ram
My whole world was devoted to my Ram (2)

Gauri puja, Gauri puja — glorify Gauri-Ma and Lord Ganesh
Place the mark of our / Dharti-Ma on your forehead (2)

## Verse 4

I place my confidence in this world in you, Father
I place my faith in this world in you, Father
My whole world was devoted to Lord Ram (2)
Ah — my whole world was devoted to Lord Ram (2)

## Relā (slow)

My whole world was devoted to Lord Ram
My whole world was devoted to Lord Ram
My whole world was devoted to Lord Ram
My whole world was devoted to Lord Ram`,
  },
  "manika-dhar-jabiya-dropati": {
    title: "Manika dhar jabiya - Lawa",
    alternate_title: "Let's Sing & Dance with Dropati · Track 2",
    artist_version: "Dropati",
    youtube_url: "https://www.youtube.com/watch?v=WgKMpHTft-8",
    audio_url:
      "/audio/chutney/lets-sing-and-dance-with-dropati/02-manikdhar-jhabeeya.mp3",
    thumbnail_url: "/images/chutney/lets-sing-and-dance-with-dropati.png",
    cover_url: "/images/chutney/lets-sing-and-dance-with-dropati-player-v2.png",
    mini_cover_url: "/images/chutney/lets-sing-and-dance-with-dropati.png",
    display_order: 61.5,
    category_slugs: ["wedding", "general", "bhajan", "hindi"],
    meaning:
      "Surinamese lawa song by Dropati (1921–1997) — sung when the groom's family brings the roasted corn (lawa). Full lyrics under Wedding Songs.",
    roman_lyrics: "[Album track — see Wedding Songs for full lyrics]",
  },
  "moray-gari-suno-maharaj-dropati": {
    title: "Moray Gari Suno Maharaj",
    alternate_title:
      "More Gari Suno Maharaj · Dulahe Ram lalla · Sehra · Moray gari suno maharaj",
    artist_version: "Dropati",
    youtube_url: "https://www.youtube.com/watch?v=PT_eC0CgXF0",
    audio_url:
      "/audio/chutney/lets-sing-and-dance-with-dropati/03-moray-gari-suno.mp3",
    thumbnail_url: "/images/chutney/lets-sing-and-dance-with-dropati.png",
    cover_url: "/images/chutney/lets-sing-and-dance-with-dropati-player-v2.png",
    mini_cover_url: "/images/chutney/lets-sing-and-dance-with-dropati.png",
    display_order: 62,
    category_slugs: [
      "ram",
      "wedding",
      "general",
      "devotion",
      "hindi",
    ],
    meaning:
      "Surinamese wedding sehrā by Dropati (1921–1997) — sung when the bārāt arrives. Teasing verses praise how the groom’s father, grandfathers, and mother are adorned; the refrain calls the Ram-like groom to hear the gārī (playful words): Moray gari suno maharaj.",
    roman_lyrics: `## Refrain

Dulahe Ram lalla, dulahe Ram lalla
Moray gari suno maharaj, ai dulahe Ram lalla (2)

## Verse 1

Ai! Dulahe ke pappa dekho ajab saje hai
Dulahe ke pappa dekho ajab saje hai (2)
Dulahe ke pappa...
Bhala jaise raja maharaj, dulahe Ram lalla
Dekho jaise raja maharaj, dulahe Ram lalla
Moray gari suno maharaj, dulahe Ram lalla

Dulahe Ram lalla, dulahe Ram lalla
Moray gari suno maharaj, ai dulahe Ram lalla (2)

## Verse 2

Ai! Dulahe ke aja dekho ajab saje hai
Dulahe ke nana dekho ajab saje hai (2)
Bhala jaise ginike parachar, dulahe Ram lalla
Dekho jaise ginike parachar, dulahe Ram lalla

Dulahe Ram lalla, dulahe Ram lalla
Moray gari suno maharaj, ai dulahe Ram lalla (2)

## Verse 3

Ai! Dulahe ke maiya dekho ajab saji hai
Dulahe ke maiya dekho ajab saji hai
Dulahe ke mata...
Bhala jaise rani ho maharani, aj more dulahe bane (2)
Dekho khuve saji hai barat, aj...

Dulahe Ram lalla, dulahe Ram lalla
Moray gari suno maharaj, ai dulahe Ram lalla (2)

## Verse 4 (Relā, slow)

Arre, khuve saji re, dekho khuve re saji
Dekho ajab bare saji hai barat, hai aj more dulahe re saje
Dekho khuve re saji hai barat, aj more dulahe saje`,
    translation: `## Refrain

O Shri Ram–like groom, O Shri Ram–like groom
Sir, listen to my teasing words, O Shri Ram–like groom (2)

## Verse 1

Look at how the groom’s father (pappa) is dressed — wonderfully adorned
Look at how the groom’s father is dressed — wonderfully adorned (2)
The groom’s father...
He looks just like a king, O Shri Ram–like groom
Look — just like a king, O Shri Ram–like groom
Sir, listen to my teasing words, O Shri Ram–like groom

(Refrain)

## Verse 2

Look at how the groom’s paternal grandfather (aja) is adorned
Look at how the groom’s maternal grandfather (nana) is wonderfully dressed (2)
Look at all the pomp and ceremony, O Shri Ram–like groom
Look — all the pomp and ceremony, O Shri Ram–like groom

(Refrain)

## Verse 3

Look at how the groom’s mother (maiya) is adorned
Look at how the groom’s mother is wonderfully dressed
The groom’s mother (mata)...
Like a great queen, Madam — today my dear groom is well made-up (2)
Look how well all the blood relatives in the groom’s party are adorned today...

(Refrain)

## Verse 4 (Relā, slow)

Look how well all the blood relatives in the groom’s party are adorned
Look how wonderfully the whole barāt is dressed — today my dear groom looks pretty amazing
Look how well the barāt is adorned — today my dear groom is dressed up`,
  },
  "ao-baitho-japo-hari-nam": {
    title: "Āo baitho japo Hari nām",
    alternate_title:
      "Awo Baito Japo Hari Naam · Shiva ji ki mandir me · Ao baitho japo Hari naam",
    artist_version: "Unknown",
    audio_url: "https://www.youtube.com/watch?v=79KuL22VCEI",
    thumbnail_url: "/images/ao-baitho-japo-hari-nam.jpg",
    display_order: 78,
    category_slugs: [
      "shiva",
      "ram",
      "sita",
      "krishna",
      "radha",
      "hanuman",
      "general",
      "satsang",
      "bhajan",
      "devotion",
      "hindi",
    ],
    meaning:
      "Satsang bhajan inviting everyone to sit in Shiva’s mandir and jap the name of Hari. The verses name the murtis of Sītā and Rām in gold, Rādhā and Shyām, and Tulsidās singing of Lakshman and Hanumān — all gathered in Shiv ji’s temple.",
    roman_lyrics: `## Refrain

Āo baitho japo Hari nām
Shiva jī kī mandir me'
Āo baitho japo Hari nām
Shiva jī kī mandir me'

Shiva jī kī mandir
Shiva jī kī mandir
Shiva jī kī mandir me'
Āo baitho japo Hari nām
Shiva jī kī mandir me'

## Verse 1

Sonā ke aṛū mūratī bane hai
Sonā ke aṛū mūratī bane hai
Sonā ke aṛū mūratī bane hai
Sītā aur Sirī Rām
Shiva jī kī mandir me'

## Verse 2

Mandir banāo kā tumhāre muratiyā'
Mandir banāo kā tumhāre muratiyā'
Mandir banāo kā tumhāre muratiyā'
Eka Rādhā eka Shyām
Shiva jī kī mandir me'

## Verse 3

Tulasidāsa bajo Bhagavanta
Tulasidāsa bajo Bhagavanta
Tulasidāsa bajo Bhagavanta
Lakshman aur Hanumān
Shiva jī kī mandir me'`,
    translation: `## Refrain

Come, sit and contemplate (repeat) the name of the Lord Hari
In this mandir of Shiv ji
Come, sit and contemplate the name of the Lord Hari
In this mandir of Shiv ji

Shiv ji’s mandir
Shiv ji’s mandir
In this mandir of Shiv ji
Come, sit and contemplate the name of the Lord Hari
In this mandir of Shiv ji

## Verse 1

There are lovely murtis of gold
There are lovely murtis of gold
There are lovely murtis of gold
Of Sita and Shri Ram
In this mandir of Shiv ji

## Verse 2

Be like a temple of your murtis
Be like a temple of your murtis
Be like a temple of your murtis
A Radha and a Shyam
In this mandir of Shiv ji

## Verse 3

Tulsidas chants the name of the Lord
Tulsidas chants the name of the Lord
Tulsidas chants the name of the Lord
Lakshman and Hanuman
In this mandir of Shiv ji`,
  },

  // —— Laxmi Vandana (Pundit Basdeo Jaikaran) ——
  "prayers-introduction-basdeo-jaikaran": {
    title: "Prayers - Introduction",
    alternate_title: "Laxmi Vandana · Opening prayers",
    artist_version: "Pundit Basdeo Jaikaran",
    audio_url: "/audio/albums/laxmi-vandana/01-prayers-introduction.mp3",
    cover_url: "/images/albums/laxmi-vandana-player-art.png",
    thumbnail_url: "/images/albums/laxmi-vandana-square.png",
    mini_cover_url: "/images/albums/laxmi-vandana-square.png",
    display_order: 80,
    category_slugs: [
      "lakshmi",
      "general",
      "satsang",
      "morning-prayer",
      "devotion",
      "hindi",
    ],
    meaning:
      "Opening prayers from Pundit Basdeo Jaikaran’s Laxmi Vandana album — the spoken and sung introduction before the Lakshmi and Ram tracks.",
  },
  "invocation-basdeo-jaikaran": {
    title: "Invocation",
    alternate_title: "Laxmi Vandana · Invocation",
    artist_version: "Pundit Basdeo Jaikaran",
    audio_url: "/audio/albums/laxmi-vandana/02-invocation.mp3",
    cover_url: "/images/albums/laxmi-vandana-player-art.png",
    thumbnail_url: "/images/albums/laxmi-vandana-square.png",
    mini_cover_url: "/images/albums/laxmi-vandana-square.png",
    display_order: 81,
    category_slugs: [
      "lakshmi",
      "ganesh",
      "general",
      "satsang",
      "devotion",
      "hindi",
    ],
    meaning:
      "Invocation from Laxmi Vandana — calling the deities before the main bhajans begin.",
  },
  "hay-lakshmi-mata-daya-karo-basdeo-jaikaran": {
    title: "Hay Lakshmi Mata Daya Karo",
    alternate_title: "Hey Lakshmi Mata Daya Karo · Laxmi Vandana",
    artist_version: "Pundit Basdeo Jaikaran",
    audio_url: "/audio/albums/laxmi-vandana/03-hay-lakshmi-mata-daya-karo.mp3",
    cover_url: "/images/albums/laxmi-vandana-player-art.png",
    thumbnail_url: "/images/albums/laxmi-vandana-square.png",
    mini_cover_url: "/images/albums/laxmi-vandana-square.png",
    display_order: 82,
    category_slugs: [
      "lakshmi",
      "diwali",
      "general",
      "satsang",
      "bhajan",
      "devotion",
      "hindi",
    ],
    meaning:
      "Prayer to Mother Lakshmi — have mercy, remove the world’s sorrow, ferry us across the ocean of existence, and grant wealth, knowledge, and blessings.",
    roman_lyrics: `## Chorus

Hay Lakshmi Mata daya karo
Dharti par sab ke dukha haro
Tuhi jaga ki Mata
Bhavsagar nadiya paar karo

## Verses

Dhan daulat tum dene wali
Tuhi paap hatane wali
Har gyan barhao, vardaan dewo
Aavo tumhara darshan do

Yuga yuga tum dharti par aayi
Bhakto ke liye sukh dham karayi
Kalyan karo, sab sukhi rahe
Yahi tere laal pukare`,
    translation: `## Chorus

O Mother Lakshmi, have mercy
Remove everyone’s sorrow on earth
You alone are the mother of the world
Ferry us across the river of this worldly ocean

## Verses

You are the giver of wealth and riches
You alone remove sin
Increase our wisdom, grant your boon
Come and give us your darshan

Age after age you come to earth
Making a home of joy for devotees
Grant welfare — may all remain happy
This is what your children cry out`,
  },
  "jai-jai-lakshmi-basdeo-jaikaran": {
    title: "Jai Jai Lakshmi",
    alternate_title: "Jai Jai Lakshmi Mata · Laxmi Vandana",
    artist_version: "Pundit Basdeo Jaikaran",
    audio_url: "/audio/albums/laxmi-vandana/04-jai-jai-lakshmi.mp3",
    cover_url: "/images/albums/laxmi-vandana-player-art.png",
    thumbnail_url: "/images/albums/laxmi-vandana-square.png",
    mini_cover_url: "/images/albums/laxmi-vandana-square.png",
    display_order: 83,
    category_slugs: [
      "lakshmi",
      "diwali",
      "general",
      "satsang",
      "bhajan",
      "devotion",
      "hindi",
    ],
    meaning:
      "Praise of Mother Lakshmi — victory to Lakshmi who brings auspiciousness and prosperity.",
    roman_lyrics: `## Chorus

Jai jai Lakshmi, jai jai Mata
Jai jai Lakshmi, jai jai Mata

## Verses

Mangal karini, sukh sampati data
Jai jai Lakshmi, jai jai Mata
Sharan tihari aaye sab bhakta
Jai jai Lakshmi, jai jai Mata`,
    translation: `## Chorus

Victory to Lakshmi, victory to Mother
Victory to Lakshmi, victory to Mother

## Verses

Doer of auspicious deeds, giver of joy and wealth
Victory to Lakshmi, victory to Mother
All devotees have come to your shelter
Victory to Lakshmi, victory to Mother`,
  },
  "lakshmi-vandana-basdeo-jaikaran": {
    title: "Lakshmi Vandana",
    alternate_title: "Lakshmi Vanadana · Laxmi Vandana album",
    artist_version: "Pundit Basdeo Jaikaran",
    audio_url: "/audio/albums/laxmi-vandana/05-lakshmi-vandana.mp3",
    cover_url: "/images/albums/laxmi-vandana-player-art.png",
    thumbnail_url: "/images/albums/laxmi-vandana-square.png",
    mini_cover_url: "/images/albums/laxmi-vandana-square.png",
    display_order: 84,
    category_slugs: [
      "lakshmi",
      "diwali",
      "general",
      "satsang",
      "bhajan",
      "devotion",
      "hindi",
    ],
    meaning:
      "Title vandana from the album — homage to Mother Lakshmi, giver of grace and prosperity.",
    roman_lyrics: `## Chorus

Jai Lakshmi Maiya, jai Lakshmi Mata
Sab aaye sharan tihari
De darshan Maharani

## Verses

Tu mangalmay pavan Maiya
Kripa sada barsave
Deen dukhi sharanagat jaan ke
Bigde kaaj banave`,
    translation: `## Chorus

Victory to Mother Lakshmi, victory to Mother Lakshmi
All have come to your shelter
Give darshan, O great queen

## Verses

You are the pure, auspicious Mother
Always shower your grace
Knowing the poor and sorrowful who take refuge
You set right broken affairs`,
  },
  "lakshmi-aarti-basdeo-jaikaran": {
    title: "Lakshmi Ji Ki Aarti",
    alternate_title: "Jai Lakshmi Ki Aarti · Laxmi Vandana",
    artist_version: "Pundit Basdeo Jaikaran",
    audio_url: "/audio/albums/laxmi-vandana/06-lakshmi-aarti.mp3",
    cover_url: "/images/albums/laxmi-vandana-player-art.png",
    thumbnail_url: "/images/albums/laxmi-vandana-square.png",
    mini_cover_url: "/images/albums/laxmi-vandana-square.png",
    display_order: 85,
    category_slugs: [
      "lakshmi",
      "diwali",
      "general",
      "satsang",
      "aarti",
      "bhajan",
      "devotion",
      "hindi",
    ],
    meaning:
      "Pundit Basdeo Jaikaran’s Lakshmi aarti from the Laxmi Vandana album — catalogued as Lakshmi Ji Ki Aarti, not the same listing as the classic Om Jai Lakshmi Mata versions (e.g. Shri Prakash Gossai).",
    roman_lyrics: `## Chorus

Om jai Lakshmi Mata
Maiya jai Lakshmi Mata
Tumko nishdin sevat
Hari Vishnu Vidhata
Om jai Lakshmi Mata

## Verses

Uma Rama Brahmani, tum hi jag-mata
Surya-chandrama dhyavat, Narad rishi gata
Om jai Lakshmi Mata

Durga roop Niranjani, sukh sampatti data
Jo koi tumko dhyavat, riddhi-siddhi dhan pata
Om jai Lakshmi Mata

Tum patal-nivasini, tum hi shubhdata
Karma-prabhav-prakashini, bhavanidhi ki trata
Om jai Lakshmi Mata

Jis ghar mein tum rahti, sab sadgun aata
Sab sambhav ho jata, man nahin ghabrata
Om jai Lakshmi Mata

Tum bin yagya na hote, vastra na koi pata
Khan-paan ka vaibhav, sab tumse aata
Om jai Lakshmi Mata

Shubh-gun mandir sundar, kshirodadhi-jata
Ratna chaturdash tum bin, koi nahin pata
Om jai Lakshmi Mata

Mahalakshmi ji ki aarti, jo koi jan gata
Ur anand samata, paap utar jata
Om jai Lakshmi Mata`,
    translation: `## Chorus

Om, victory to Mother Lakshmi
Mother, victory to Mother Lakshmi
Day and night Hari Vishnu Vidhata serves you
Om, victory to Mother Lakshmi

## Verses

You are Uma, Rama, and Brahmani — mother of the world
Sun and moon meditate on you; Narad the sage sings
Om, victory to Mother Lakshmi

In Durga’s pure form you give joy and wealth
Whoever meditates on you gains prosperity and success
Om, victory to Mother Lakshmi

You dwell in the nether world; you give auspicious gifts
You illuminate karma’s fruit; you rescue from the worldly ocean
Om, victory to Mother Lakshmi

In the home where you stay, all virtues come
Everything becomes possible; the mind does not fear
Om, victory to Mother Lakshmi

Without you no yagya is complete; no one finds clothing
All abundance of food and drink comes from you
Om, victory to Mother Lakshmi

Beautiful temple of virtues, born of the milk-ocean
Without you no one finds the fourteen jewels
Om, victory to Mother Lakshmi

Whoever sings Mahalakshmi’s aarti
Joy fills the heart and sins are washed away
Om, victory to Mother Lakshmi`,
  },
  "bhagwat-bhagwan-ki-hai-aarti-hemant-kumar": {
    title: "Bhagwat Bhagwan Ki Hai Aarti",
    alternate_title: "Bhaagwat Aarti · Bhagwat Mahima",
    artist_version: "Hemant Kumar",
    audio_url: "/audio/aarti/bhagwat-bhagwan-ki-hai-aarti-hemant-kumar.mp3",
    thumbnail_url: "/images/bhagwat-bhagwan-ki-hai-aarti-hemant-kumar-square.png",
    cover_url: "/images/bhagwat-bhagwan-ki-hai-aarti-hemant-kumar-player.png",
    mini_cover_url: "/images/bhagwat-bhagwan-ki-hai-aarti-hemant-kumar-square.png",
    display_order: 86,
    category_slugs: [
      "vishnu",
      "krishna",
      "ram",
      "general",
      "satsang",
      "aarti",
      "bhajan",
      "devotion",
      "hindi",
    ],
    meaning:
      "Hemant Kumar — Bhaagwat Aarti from Bhagwat Mahima (Saregama). Aarti of the Bhagavat: the immortal scripture as the fifth Veda, lamp of peace and Madhusudan’s aarti that frees sinners from sin.",
    roman_lyrics: `## Chorus

Shri Bhagwat Bhagwan ki hai aarti
Papiyon ko paap se hai tarti

## Verse 1

Ye amar granth ye, mukti panth ye
Pancham Ved nirala
Nav jyoti jalane wala
Hari gyan yahi, vardan yahi
Hari gyan yahi, vardan yahi
Yahi jagakay-mangalaki, aarti
Papiyon ko paap se hai tarti

## Chorus

Shri Bhagwat Bhagwan ki hai aarti
Papiyon ko paap se hai tarti

## Verse 2

Ye shanti geet, pavan puneet
Papon ko mitane wala
Hari darash dikhane wala
Hai sukh karani, hai duhkh harini
Hai sukh karani, hai duhkh harini
Shri Madhu Soodana ki aarti
Papiyon ko paap se hai tarti

## Chorus

Shri Bhagwat Bhagwan ki hai aarti
Papiyon ko paap se hai tarti

## Verse 3

Ye madhur bol, jag phand khol
Sanamarga dikhane wala
Bigadee ko banane wala
Shri Ram yahi, Ghanashyam yahi
Shri Ram yahi, Ghanashyam yahi
Jag kee mahima kee aarti
Papiyon ko paap se hai tarti

## Chorus

Shri Bhagwat Bhagwan ki hai aarti
Papiyon ko paap se hai tarti`,
    translation: `## Chorus

This is the aarti of Shri Bhagwat Bhagwan
It frees sinners from sin

## Verse 1

This immortal scripture — this path to liberation
The unique fifth Veda
That lights the nine flames
This is Hari’s knowledge, this is the boon
This is Hari’s knowledge, this is the boon
This is the aarti of the world’s auspiciousness
It frees sinners from sin

## Chorus

This is the aarti of Shri Bhagwat Bhagwan
It frees sinners from sin

## Verse 2

This holy song of peace, pure and sacred
That destroys sins
That shows Hari’s darshan
It brings happiness; it removes sorrow
It brings happiness; it removes sorrow
This is Shri Madhusudan’s aarti
It frees sinners from sin

## Chorus

This is the aarti of Shri Bhagwat Bhagwan
It frees sinners from sin

## Verse 3

These sweet words open the world’s snare
That show the right path
That set right what is broken
This is Shri Ram; this is Ghanshyam
This is Shri Ram; this is Ghanshyam
This is the aarti of the world’s glory
It frees sinners from sin

## Chorus

This is the aarti of Shri Bhagwat Bhagwan
It frees sinners from sin`,
  },
  "om-jai-lakshmi-mata-prakash-gossai": {
    title: "Om Jai Lakshmi Mata",
    alternate_title: "Jai Lakshmi Mata · Lakshmi aarti",
    artist_version: "Shri Prakash Gossai",
    audio_url: "https://www.youtube.com/watch?v=NYcytDjxLq8",
    youtube_url: "https://www.youtube.com/watch?v=NYcytDjxLq8",
    thumbnail_url: "/images/om-jai-lakshmi-mata-prakash-gossai.jpg",
    cover_url: "/images/om-jai-lakshmi-mata-prakash-gossai.jpg",
    mini_cover_url: "/images/om-jai-lakshmi-mata-prakash-gossai.jpg",
    display_order: 84,
    category_slugs: [...OM_JAI_LAKSHMI_CATEGORY_SLUGS],
    meaning: `${OM_JAI_LAKSHMI_MEANING} Shri Prakash Gossai’s recording is short: chorus, verses 1–2, chorus again, then “Om Jai Lakshmi Mata” twice — then it ends. Full aarti verses below are kept for satsang; only the top section is what he sings here.`,
    roman_lyrics: `## Chorus

Om Jai Lakshmi Mata
Maiya Jai Lakshmi Mata
Tumko nishdin sevat
Tumko nishdin sevat
Hari Vishnu Vidhata
Om Jai Lakshmi Mata

## Verse 1

Uma Rama Brahmani, tum hi jag-mata
Maiya tum hi jag-mata
Surya-chandrama dhyavat
Surya-chandrama dhyavat
Narad rishi gata
Om Jai Lakshmi Mata

## Verse 2

Durga roop Niranjani, sukh sampati data
Maiya sukh sampati data
Jo koi tumko dhyavata
Jo koi tumko dhyavata
Riddhi-siddhi pata
Om Jai Lakshmi Mata

## End of this recording

Om Jai Lakshmi Mata
Maiya Jai Lakshmi Mata
Tumko nishdin sevat
Tumko nishdin sevat
Hari Vishnu Vidhata
Om Jai Lakshmi Mata

Om Jai Lakshmi Mata
Om Jai Lakshmi Mata

## Not on this recording · full aarti

## Verse 3

Tum patal-nivasini, tum hi shubh-data
Maiya tum hi shubh-data
Karma-prabhav-prakashini
Karma-prabhav-prakashini
Bhav-nidhi ki trata
Om Jai Lakshmi Mata

## Verse 4

Jis ghar mein tum rahti, sab sadgun aata
Maiya sab sadgun aata
Sab sambhav ho jata
Sab sambhav ho jata
Man nahin ghabrata
Om Jai Lakshmi Mata

## Verse 5

Tum bin yagya na hove, vastra na ho pata
Maiya vastra na ho pata
Khan-pana ka vaibhav
Khan-pana ka vaibhav
Sab tumse aata
Om Jai Lakshmi Mata

## Verse 6

Shubh-gun mandir sundar, kshirodadhi-jata
Maiya kshirodadhi-jata
Ratan chaturdash tum bin
Ratan chaturdash tum bin
Koi nahin pata
Om Jai Lakshmi Mata

## Verse 7

Shri Lakshmi ji ki aarti, jo koi nar gata
Maiya jo koi nar gata
Ur anand samata
Ur anand samata
Paap utar jata
Om Jai Lakshmi Mata

## Closing

Om Jai Lakshmi Mata
Maiya Jai Lakshmi Mata
Tumko nishdin sevat
Tumko nishdin sevat
Hari Vishnu Vidhata
Om Jai Lakshmi Mata`,
    translation: `## Chorus

Om, victory to Mother Lakshmi
Mother, victory to Mother Lakshmi
Day and night You are served
Day and night You are served
By Hari Vishnu Vidhata
Om, victory to Mother Lakshmi

## Verse 1

You are Uma, Rama, and Brahmani — mother of the world
Mother, you alone are mother of the world
Sun and moon meditate on you
Sun and moon meditate on you
Narad the sage sings
Om, victory to Mother Lakshmi

## Verse 2

In Durga’s pure form you give joy and prosperity
Mother, giver of joy and prosperity
Whoever meditates on you
Whoever meditates on you
Gains success and spiritual powers
Om, victory to Mother Lakshmi

## End of this recording

Om, victory to Mother Lakshmi
Mother, victory to Mother Lakshmi
Day and night You are served
Day and night You are served
By Hari Vishnu Vidhata
Om, victory to Mother Lakshmi

Om, victory to Mother Lakshmi
Om, victory to Mother Lakshmi

## Not on this recording · full aarti

## Verse 3

You dwell in the nether realms; you give auspicious gifts
Mother, you alone give auspicious gifts
You illuminate the fruit of karma
You illuminate the fruit of karma
You rescue from the ocean of worldly life
Om, victory to Mother Lakshmi

## Verse 4

In the home where you stay, all virtues come
Mother, all virtues come
Everything becomes possible
Everything becomes possible
The mind does not fear
Om, victory to Mother Lakshmi

## Verse 5

Without you no yagya is complete; clothing is not found
Mother, clothing is not found
The abundance of food and drink
The abundance of food and drink
All comes from you
Om, victory to Mother Lakshmi

## Verse 6

Beautiful temple of virtues, born of the milk-ocean
Mother, born of the milk-ocean
Without you the fourteen jewels
Without you the fourteen jewels
No one finds
Om, victory to Mother Lakshmi

## Verse 7

Whoever sings Mother Lakshmi’s aarti
Mother, whoever among people sings
Joy fills the heart
Joy fills the heart
And sins are washed away
Om, victory to Mother Lakshmi

## Closing

Om, victory to Mother Lakshmi
Mother, victory to Mother Lakshmi
Day and night You are served
Day and night You are served
By Hari Vishnu Vidhata
Om, victory to Mother Lakshmi`,
  },
  "ramayan-chaupai-basdeo-jaikaran": {
    title: "Ramayan Chaupai",
    alternate_title: "Ramayan Choupai · Tulsidas chaupai · Laxmi Vandana",
    artist_version: "Pundit Basdeo Jaikaran",
    audio_url: "/audio/albums/laxmi-vandana/07-ramayan-chaupai.mp3",
    cover_url: "/images/albums/laxmi-vandana-player-art.png",
    thumbnail_url: "/images/albums/laxmi-vandana-square.png",
    mini_cover_url: "/images/albums/laxmi-vandana-square.png",
    display_order: 86,
    category_slugs: [
      "ram",
      "sita",
      "general",
      "satsang",
      "bhajan",
      "devotion",
      "hindi",
    ],
    meaning:
      "Ramayan chaupai from Laxmi Vandana — Tulsidas-style couplets in praise of Shri Ram. Classic opening lines often used in satsang.",
    roman_lyrics: `## Chaupai

Mangal bhavan amangal hari
Dravahu so Dasarath ajir bihari

Ram siya ram siya ram jay jay ram
Ram siya ram siya ram jay jay ram

## Closing

Jai jai jai anand nidhan
Sakala mangala mula
Jai jai jai Raghunandan
Sakala kalusha kula`,
    translation: `## Chaupai

Abode of auspiciousness, remover of inauspiciousness —
May that Ram who plays in Dasharath’s courtyard be gracious

Ram-Sita, Ram-Sita, Ram — glory, glory to Ram
Ram-Sita, Ram-Sita, Ram — glory, glory to Ram

## Closing

Glory, glory, glory — treasure of bliss
Root of all auspiciousness
Glory, glory, glory — Raghunandan
Destroyer of all impurity`,
  },
  "ram-siya-ram-sonu-nigam": {
    title: "Ram Siya Ram",
    alternate_title: "Mangal Bhavan Amangal Haari · Ramayan Chaupai",
    artist_version: "Sonu Nigam",
    audio_url: "https://www.youtube.com/watch?v=kzKNZGOrG_8",
    youtube_url: "https://www.youtube.com/watch?v=kzKNZGOrG_8",
    thumbnail_url: "/images/ram-siya-ram-sonu-nigam.jpg",
    cover_url: "/images/ram-siya-ram-sonu-nigam.jpg",
    mini_cover_url: "/images/ram-siya-ram-sonu-nigam.jpg",
    display_order: 91,
    category_slugs: [
      "ram",
      "sita",
      "general",
      "satsang",
      "bhajan",
      "devotion",
      "hindi",
    ],
    meaning:
      "Sonu Nigam — Ramayan chaupais of Tulsidas with the refrain Ram Siya Ram, jai jai Ram. Opens with Mangal bhavan amangal haari.",
    roman_lyrics: `## Opening

Mangal bhavan amangal haari
Dravahu so Dasharath ajir bihari

## Chorus

Ram Siya Ram Siya Ram jai jai Ram
Ram Siya Ram Siya Ram jai jai Ram

## Chaupai 1

Hoi hai wohi jo Ram rachi raakha
Ko kari tarak badhaave saakha

Ram Siya Ram Siya Ram jai jai Ram
Ram Siya Ram Siya Ram jai jai Ram

## Chaupai 2

Dheeraj dharam mitr aru naari
Aapad kaal parakhiye chaari

Ram Siya Ram Siya Ram jai jai Ram
Ram Siya Ram Siya Ram jai jai Ram

## Chaupai 3

Jehi ke jehi par satya sanehu
So tehi milai na kachhu sandehu

Ram Siya Ram Siya Ram jai jai Ram
Ram Siya Ram Siya Ram jai jai Ram

## Chaupai 4

Jaaki rahi bhavana jaisi
Prabhu murati dekhi tin taisi

Ram Siya Ram Siya Ram jai jai Ram
Ram Siya Ram Siya Ram jai jai Ram

## Chaupai 5

Raghukul reet sada chali aayi
Praan jaaye par vachan na jaayi

Ram Siya Ram Siya Ram jai jai Ram
Ram Siya Ram Siya Ram jai jai Ram

## Chaupai 6

Hari anant Hari katha ananta
Kahahi sunahi bahuvidhi sab santa
Kahahi sunahi bahuvidhi sab santa

## Closing

Ram Siya Ram Siya Ram jai jai Ram
Ram Siya Ram Siya Ram jai jai Ram
Ram Siya Ram Siya Ram jai jai Ram
Ram Siya Ram Siya Ram jai jai Ram`,
    translation: `## Opening

Abode of auspiciousness, remover of misfortune —
Be gracious, O one who plays in Dasharath’s courtyard

## Chorus

Ram-Sita, Ram-Sita, Ram — glory, glory to Ram
Ram-Sita, Ram-Sita, Ram — glory, glory to Ram

## Chaupai 1

What Ram has ordained will come to pass
Who can argue and make the branches grow?

Ram-Sita, Ram-Sita, Ram — glory, glory to Ram
Ram-Sita, Ram-Sita, Ram — glory, glory to Ram

## Chaupai 2

Patience, dharma, a friend, and a wife —
These four are tested in times of trouble

Ram-Sita, Ram-Sita, Ram — glory, glory to Ram
Ram-Sita, Ram-Sita, Ram — glory, glory to Ram

## Chaupai 3

Whoever holds true love for whom
Will surely meet them — there is no doubt

Ram-Sita, Ram-Sita, Ram — glory, glory to Ram
Ram-Sita, Ram-Sita, Ram — glory, glory to Ram

## Chaupai 4

As is the feeling in one’s heart
So does one behold the Lord’s form

Ram-Sita, Ram-Sita, Ram — glory, glory to Ram
Ram-Sita, Ram-Sita, Ram — glory, glory to Ram

## Chaupai 5

The custom of Raghu’s line has always been —
Life may go, but the word does not

Ram-Sita, Ram-Sita, Ram — glory, glory to Ram
Ram-Sita, Ram-Sita, Ram — glory, glory to Ram

## Chaupai 6

Hari is endless; Hari’s story is endless
Saints tell and hear it in many ways
Saints tell and hear it in many ways

## Closing

Ram-Sita, Ram-Sita, Ram — glory, glory to Ram
Ram-Sita, Ram-Sita, Ram — glory, glory to Ram
Ram-Sita, Ram-Sita, Ram — glory, glory to Ram
Ram-Sita, Ram-Sita, Ram — glory, glory to Ram`,
  },
  "namo-namo-amit-trivedi": {
    title: "Namo Namo",
    alternate_title: "Namo Namo Ji Shankara · Kedarnath",
    artist_version: "Amit Trivedi",
    audio_url: "/audio/namo-namo-kedarnath.mp3",
    thumbnail_url: "/images/namo-namo-kedarnath-square.png",
    cover_url: "/images/namo-namo-kedarnath-player.png",
    mini_cover_url: "/images/namo-namo-kedarnath-square.png",
    display_order: 92,
    category_slugs: [
      "shiva",
      "general",
      "satsang",
      "bhajan",
      "devotion",
      "hindi",
    ],
    meaning:
      "Amit Trivedi — Shiva bhajan from the film Kedarnath. Praise of Bholenath / Shankara: without His name, how can breath go on?",
    roman_lyrics: `## Intro

Jai ho, jai ho Shankara
(Bholenath Shankara)
Aadi Dev Shankara
(Hey Shivay Shankara)
Tere jaap ke bina
(Bholenath Shankara)
Chale ye saans kis tarah?
(Hey Shivay Shankara)

## Verse 1

Mera karm tu hi jaane, kya bura hai kya bhala
(Kya bura hai kya bhala, kya bura hai kya bhala)
Tere raaste pe main to aankh moond ke chala
(Aankh moond ke chala, aankh moond ke chala)
Tere naam ki jot ne, saara har liya tamas mera

## Chorus

Namo namo ji Shankara
Bholenath Shankara
Hey Triloknath Shambhu
Hey Shivay Shankara
Namo namo ji Shankara
Bholenath Shankara
Rudradev hey Maheshvara

## Bridge

Srishti ke janam se bhi, pehle tera vaas tha
Ye jag rahe ya na rahe, rahegi teri aastha
Kya samay? kya pralay?
Dono mein teri mahaanta, mahaanta, mahaanta`,
    translation: `## Intro

Victory, victory to Shankara
(Bholenath Shankara)
Primordial Lord Shankara
(O Shiva, Shankara)
Without chanting Your name
(Bholenath Shankara)
How can this breath go on?
(O Shiva, Shankara)

## Verse 1

You alone know my karma — what is wrong, what is right
(What is wrong, what is right; what is wrong, what is right)
On Your path I walk with eyes closed
(With eyes closed, with eyes closed)
The flame of Your name has taken away all my darkness

## Chorus

Salutations, salutations to Shankara
Bholenath Shankara
O Lord of the three worlds, Shambhu
O Shiva, Shankara
Salutations, salutations to Shankara
Bholenath Shankara
Rudradev, O Maheshvara

## Bridge

Even before creation was born, You already dwelt
Whether this world remains or not, faith in You remains
What is time? What is dissolution?
In both is Your greatness, greatness, greatness`,
  },
  "shambhu-nath-agam-aggarwal": {
    title: "Shambhu Nath",
    alternate_title: "Jai Jai Bholenath Shambhu · MahaShivRatri",
    artist_version: "Agam Aggarwal",
    audio_url: "/audio/shambhu-nath-agam-aggarwal.mp3",
    thumbnail_url: "/images/shambhu-nath-agam-v2-square.png",
    cover_url: "/images/shambhu-nath-agam-v2-player.png",
    mini_cover_url: "/images/shambhu-nath-agam-v2-square.png",
    display_order: 93,
    category_slugs: [
      "shiva",
      "general",
      "satsang",
      "bhajan",
      "devotion",
      "hindi",
    ],
    meaning:
      "Agam Aggarwal — Shiva bhajan opening with the Karpura Gauram stotra, then praise of Shambhu Nath: Ganga in His hair, the moon on His brow, Bholenath who drank poison and gave nectar to the world.",
    roman_lyrics: `## Stotra

Karpura gauram karunaavataram
Samsara saaram bhujagendra haaram
Sada vasantam hridayaravinde
Bhavam Bhavani sahitam namami

## Chorus

Tere sar pe Ganga ki dhara
Mathe pe chaand chakora
Ghoonje hai naad Shambhu Nath re

Tere sar pe Ganga ki dhara
Mathe pe chaand chakora
Ghoonje hai naad Shambhu Nath re

## Refrain

Jai jai Bholenath Shambhu
Mahadev Shiv Shankar
Jai jai Bholenath Shambhu
Mahadev Shiv Shankar

## Verse 1

Man mein basa hai roop tera
Kitna sundar hai, kitna sundar hai
Aadi na ant hai, sabke andar hai
Sabke andar hai

Peekar khud hi vish ka pyala
Duniya ko amrit de dala
Mera Shiv hai bhola bhala Bholenath ji

## Chorus

Tere sar pe Ganga ki dhara
Mathe pe chaand chakora
Ghoonje hai naad Shambhu Nath re

## Refrain

Jai jai Bholenath Shambhu
Mahadev Shiv Shankar
Jai jai Bholenath Shambhu
Mahadev Shiv Shankar

## Verse 2

Dwaar daya ke kholo
Hamko tera sahara hai
Tera sahara hai
Bhav sagar ho paar
Dil ne tumhe pukara hai
Tumhe pukara hai

Karo kripa Trishul-dhari, tum bhakton ke kaivari
Tumko pooje duniya saari Bholenath ji

## Chorus

Tere sar pe Ganga ki dhara
Mathe pe chaand chakora
Ghoonje hai naad Shambhu Nath re

## Closing

Jai jai Bholenath Shambhu
Mahadev Shiv Shankar
Jai jai Bholenath Shambhu
Mahadev Shiv Shankar
Jai jai Bholenath Shambhu
Mahadev Shiv Shankar
Jai jai Bholenath Shambhu
Mahadev Shiv Shankar`,
    translation: `## Stotra

White as camphor, incarnation of compassion
Essence of the world, wearing the serpent-king as a garland
Always dwelling in the lotus of the heart
I bow to Bhava together with Bhavani

## Chorus

On Your head, the stream of the Ganga
On Your brow, the moon like a chakora
The sound resounds — Shambhu Nath

On Your head, the stream of the Ganga
On Your brow, the moon like a chakora
The sound resounds — Shambhu Nath

## Refrain

Glory, glory to Bholenath Shambhu
Mahadev, Shiv Shankar
Glory, glory to Bholenath Shambhu
Mahadev, Shiv Shankar

## Verse 1

Your form lives in the mind
How beautiful it is, how beautiful it is
Without beginning or end — You are within all
You are within all

Drinking the cup of poison Yourself
You gave nectar to the world
My Shiva is simple and kind — Bholenath ji

## Chorus

On Your head, the stream of the Ganga
On Your brow, the moon like a chakora
The sound resounds — Shambhu Nath

## Refrain

Glory, glory to Bholenath Shambhu
Mahadev, Shiv Shankar
Glory, glory to Bholenath Shambhu
Mahadev, Shiv Shankar

## Verse 2

Open the door of compassion
We have Your support
We have Your support
Carry us across the ocean of worldly life
The heart has called out to You
Has called out to You

Have mercy, Bearer of the trident, protector of devotees
The whole world worships You, Bholenath ji

## Chorus

On Your head, the stream of the Ganga
On Your brow, the moon like a chakora
The sound resounds — Shambhu Nath

## Closing

Glory, glory to Bholenath Shambhu
Mahadev, Shiv Shankar
Glory, glory to Bholenath Shambhu
Mahadev, Shiv Shankar
Glory, glory to Bholenath Shambhu
Mahadev, Shiv Shankar
Glory, glory to Bholenath Shambhu
Mahadev, Shiv Shankar`,
  },
  "naman-karo-sri-ram-basdeo-jaikaran": {
    title: "Naman Karo Sri Ram",
    alternate_title: "Naman Karo Shri Ram · Laxmi Vandana",
    artist_version: "Pundit Basdeo Jaikaran",
    audio_url: "/audio/albums/laxmi-vandana/08-naman-karo-sri-ram.mp3",
    cover_url: "/images/albums/laxmi-vandana-player-art.png",
    thumbnail_url: "/images/albums/laxmi-vandana-square.png",
    mini_cover_url: "/images/albums/laxmi-vandana-square.png",
    display_order: 87,
    category_slugs: [
      "ram",
      "sita",
      "general",
      "satsang",
      "bhajan",
      "devotion",
      "hindi",
    ],
    meaning:
      "Bow to Shri Ram — Dasharath’s son, Raghupati, ocean of compassion, remover of sorrow and giver of joy.",
    roman_lyrics: `## Chorus

Naman karo Shri Ram
Jai Ram Ram Ram
Sita Ram Ram Ram

## Verses

Dasharath nandana Ram
Raghupati Raghava Ram
Prema swaroopam Ram
Jagat pita Shri Ram
Prema Hari Hari Ram

Daya nidhi wala Ram
Sita pati Shri Ram
Dukh harne wala Ram
Sukh dene wala Ram
Amar rahe Hari Ram`,
    translation: `## Chorus

Bow to Shri Ram
Glory to Ram, Ram, Ram
Sita-Ram, Ram, Ram

## Verses

Ram, son of Dasharath
Raghupati Raghava Ram
Ram, the form of love
Father of the world, Shri Ram
Love — Hari Hari Ram

Ram, ocean of compassion
Husband of Sita, Shri Ram
Ram who removes sorrow
Ram who gives joy
May Hari Ram live forever`,
  },
  "khawat-bhajan-basdeo-jaikaran": {
    title: "Khawat Bhajan",
    alternate_title: "Kewat Bhajan · Kewat Ne Kaha Raghurai Se · Laxmi Vandana",
    artist_version: "Pundit Basdeo Jaikaran",
    audio_url: "/audio/albums/laxmi-vandana/09-khawat-bhajan.mp3",
    cover_url: "/images/albums/laxmi-vandana-player-art.png",
    thumbnail_url: "/images/albums/laxmi-vandana-square.png",
    mini_cover_url: "/images/albums/laxmi-vandana-square.png",
    display_order: 88,
    category_slugs: [
      "ram",
      "sita",
      "general",
      "satsang",
      "bhajan",
      "devotion",
      "hindi",
    ],
    meaning:
      "Kewat (Khawat) bhajan — the boatman who ferried Ram across the river asks no fare, only that Ram ferry him across the ocean of the world.",
    roman_lyrics: `## Chorus

Kewat ne kaha Raghurai se
Utarai na lunga he Bhagavan
Utarai na lunga he Bhagavan

## Verses

Main nadi naal ka sevak hun
Tum bhavsagar ke swami ho
Main yahan pe paar lagata hun
Tum wahan pe paar laga dena

Tune Ahilya ko paar lagaya hai
Mujhako bhi paar laga dena
Main yahan pe paar lagata hun
Tum wahan pe paar laga dena`,
    translation: `## Chorus

The boatman said to Raghurai
I will not take the ferry fare, O Lord
I will not take the ferry fare, O Lord

## Verses

I am a servant of river and canal
You are the master of the worldly ocean
Here I ferry people across
There, ferry me across

You ferried Ahalya across
Ferry me across too
Here I ferry people across
There, ferry me across`,
  },
  "aaj-aayan-ban-say-basdeo-jaikaran": {
    title: "Aaj Aayan Ban Say",
    alternate_title: "Aaj Aaye Ban Se · Aaj Aayan Ban Se · Laxmi Vandana",
    artist_version: "Pundit Basdeo Jaikaran",
    audio_url: "/audio/albums/laxmi-vandana/10-aaj-aayan-ban-say.mp3",
    cover_url: "/images/albums/laxmi-vandana-player-art.png",
    thumbnail_url: "/images/albums/laxmi-vandana-square.png",
    mini_cover_url: "/images/albums/laxmi-vandana-square.png",
    display_order: 89,
    category_slugs: [
      "ram",
      "sita",
      "general",
      "satsang",
      "bhajan",
      "devotion",
      "hindi",
    ],
    meaning:
      "Ramayan-themed bhajan — today they have come from the forest (ban). Often sung of Ram, Sita, and Lakshman’s return.",
    roman_lyrics: `## Chorus

Aaj aaye ban se
Aaj aaye ban se
Ram Lakshan Janaki
Aaj aaye ban se

## Verses

Chalo re sakhi Ram se milay
Ram Lakshan Janaki
Hanuman sang mein aaye
Aaj aaye ban se`,
    translation: `## Chorus

Today they have come from the forest
Today they have come from the forest
Ram, Lakshman, and Janaki
Today they have come from the forest

## Verses

Come, sakhi — let us meet Ram
Ram, Lakshman, and Janaki
Hanuman has come with them
Today they have come from the forest`,
  },
  "jagar-bam-bam-bhola-basdeo-jaikaran": {
    title: "Jagar Bam Bam Bhola",
    alternate_title: "Jagao Bam Bam Bhola · Bam Bam Bhola · Laxmi Vandana",
    artist_version: "Pundit Basdeo Jaikaran",
    audio_url: "/audio/albums/laxmi-vandana/11-jagar-bam-bam-bhola.mp3",
    cover_url: "/images/albums/laxmi-vandana-player-art.png",
    thumbnail_url: "/images/albums/laxmi-vandana-square.png",
    mini_cover_url: "/images/albums/laxmi-vandana-square.png",
    display_order: 90,
    category_slugs: [
      "shiva",
      "general",
      "satsang",
      "bhajan",
      "devotion",
      "hindi",
    ],
    meaning:
      "Awaken Bam Bam Bhola — praise of Shiva as Bhola, the damaru-player with Ganga flowing from his locks.",
    roman_lyrics: `## Chorus

Jagar Bam Bam Bhola
Bam Bam Bhola Bhola
Mera Bhola bada damru wala
Sar se behti hai Ganga ki dhara
Bam Bam Bhola Bhola

## Verses

Apne trishul par ek nagari banayi
Pyare bhakton ke liye Kashi banayi
Sang rahta hai sabse nirala
Mera Bhola bada damru wala

Aaya jo dar par uske
Dukh dard lekar ke
Hare wo kasht pal bhar mein
Apne bhakton ke
Sun leta hai damru wala
Mera Bhola bada damru wala`,
    translation: `## Chorus

Awaken Bam Bam Bhola
Bam Bam Bhola Bhola
My Bhola is the great damaru-player
From his head flows the stream of Ganga
Bam Bam Bhola Bhola

## Verses

On his trident he built a city
For dear devotees he made Kashi
He stays with them, unique among all
My Bhola is the great damaru-player

Whoever comes to his door
Bringing sorrow and pain
He removes that suffering in a moment
For his devotees
The damaru-player hears them
My Bhola is the great damaru-player`,
  },
  "tum-vintee-suno-sanjay-sankat": {
    title: "Tum Vintee Suno",
    alternate_title: "Tum Vinti Suno Sabki · Tum Vintee Suno Sab Kee",
    artist_version: "Sanjay Sankat",
    audio_url: "/audio/tum-vintee-suno-sanjay-sankat.mp3",
    youtube_url: "https://www.youtube.com/watch?v=3hmzaT4fsOU",
    thumbnail_url: "/images/tum-vintee-suno-sanjay-sankat.jpg",
    cover_url: "/images/tum-vintee-suno-sanjay-sankat.jpg",
    mini_cover_url: "/images/tum-vintee-suno-sanjay-sankat.jpg",
    display_order: 62,
    category_slugs: [
      "durga",
      "general",
      "satsang",
      "bhajan",
      "devotion",
      "hindi",
    ],
    meaning:
      "A Durga Mata bhajan of prayer and surrender — listen to every plea, show the path, grant liberation, and light the world. Lyrics from a printed satsang sheet.",
    roman_lyrics: `## Refrain

Tum vintee suno sab kee, kalyaan karo jag kaa
Saha raaha dikha kar kay, udhaar karo Durga (2)

## Verse 1

Darshan ho Maa tere, sab kee abhilaasha hai
Man me raho tum sab kee, tum se yeh aashaa hai
Kya mera kya uska, yeh apna paraya kya,
Sab jyoti jala karke, roshan karo jag saaraa
Tum vintee suno sab kee...

## Verse 2

Sansaar to maayaa hai, kabhi dhoop kabhi chaaya hai
Ek din use jaanaa hai, jo bhi yaha aayaa hai
Kya rang hai jeewan kaa, kya roop hai maanav kaa
Tum gyaan barhakar ke, upkaar karo Durga
Tum vintee suno sab kee...`,
    translation: `## Refrain

Hear everyone's prayer (vintee) — bring welfare (kalyaan) to the world
Showing the true path, grant liberation (udhaar), O Durga (2)

## Verse 1

May we have Your darshan, Mother — that is everyone's desire
Dwell in everyone's heart — this hope we place in You
What is mine, what is theirs — what is one's own or a stranger's?
Lighting every lamp (jyoti), make the whole world shine
Hear everyone's prayer...

## Verse 2

The world is illusion (maayaa) — sometimes sunshine, sometimes shade
One day they must leave — whoever has come here
What is the colour of life, what is the form of humankind?
Increasing our wisdom (gyaan), grant Your favour (upkaar), O Durga
Hear everyone's prayer...`,
  },
  "baar-baar-din-yeh-aaye": {
    title: "Baar Baar Din Yeh Aaye",
    alternate_title: "Happy Birthday",
    artist_version: "Mohammed Rafi",
    audio_url: "https://www.youtube.com/watch?v=Jn9_6yINCy4",
    thumbnail_url: "/images/baar-baar-din-yeh-aaye.jpg",
    display_order: 90,
    category_slugs: ["birthday", "general", "hindi"],
    meaning:
      "Classic Hindi birthday song (Mohammed Rafi). Wish someone a long life — tu jiye hazāron sāl — and sing Happy Birthday with their name in the English refrain.",
    roman_lyrics: `## Chorus

Baar baar din yeh aaye
Baar baar dil yeh gaaye
Tu jiye hazaaro saal
Yeh meri hai aarzoo

Happy birthday to you
Happy birthday to you
Happy birthday to (name)
Happy birthday to you

## Verse 1

Beqaraar hoke daaman thaam loon main kiska
Kya misal doon main teri naam loon main kiska
Nahi nahi, aisa haseen, koi nahi hai
Jispe yeh nazar ruuk jaaye
Bemisal jo kehlaaye

## Verse 2

Auron ki taraah kuch main bhi tohfa aaj laata
Main teri haseen mehfil mein phool leke aata
Jinhe kaha, use kyaa hai, phoolo ki zaroorat
Jo bahaar khud kehlaaye
Har kali ka dil dhadakaaye

## Verse 3

Phoolo ne chaman se tujhko hai salaam bheja
Taaro ne gagan se tujhko yeh payaam bheja
Dua hai yeh, khuda kare, ai shokh tujhko
Chand ki umar lag jaaye
Aaye toh qayamat aaye`,
    translation: `## Chorus

This day will come again and again
This heart will sing again and again
May you live for a thousand years
This is my wish (for you)

Happy birthday to you
Happy birthday to you
Happy birthday to (name)
Happy birthday to you

## Verse 1

Being impatient, whose refuge should I take?
Whose name should I compare you to?
No no — there is no one as beautiful (as you)
Who would catch my eyesight
Who is without comparison

## Verse 2

Like others I also could have brought you a gift today
I could have brought flowers to your beautiful gathering
The one I speak of — what need do they have for flowers?
The one who calls themself the spring
Making every flowerbud’s heart beat

## Verse 3

The flowers have sent you greetings from the garden
The stars have sent you this message from the sky
My prayer is this, God willing, oh mischievous one
May you live as long as the moon
Until judgment day comes`,
  },

  "tujhe-suraj-kahoon-ya-chanda-manna-dey": {
    title: "Tujhe Suraj Kahoon Ya Chanda",
    alternate_title:
      "Mera Naam Karega Roshan · Jag Mein Mera Raj Dulara · Ek Phool Do Mali · Birthday & Family Blessing",
    artist_version: "Manna Dey",
    audio_url: "/audio/tujhe-suraj-kahoon-ya-chanda-manna-dey.mp3",
    thumbnail_url: "/images/tujhe-suraj-kahoon-ya-chanda-thumb.jpg",
    cover_url: "/images/tujhe-suraj-kahoon-ya-chanda-cover.jpg",
    mini_cover_url: "/images/tujhe-suraj-kahoon-ya-chanda-thumb.jpg",
    display_order: 91,
    category_slugs: ["birthday", "general", "hindi"],
    meaning:
      "A classic father's blessing and ode to a child from the film Ek Phool Do Mali (1969), sung by Manna Dey — lyrics Prem Dhawan, music Ravi. Picturised on Balraj Sahni. An evergreen favourite for birthdays, naming ceremonies (namkaran), and family blessings.",
    roman_lyrics: `## Chorus

Tujhe sūraj kahūñ yā chandā, tujhe dīp kahūñ yā tārā
Merā nām karegā roshan, jag meñ merā rāj dulārā
Tujhe sūraj kahūñ yā chandā, tujhe dīp kahūñ yā tārā
Merā nām karegā roshan, jag meñ merā rāj dulārā

## Verse 1

Maiñ kab se taras rahā thā, mere āñgan meñ koī khele
Nanhī sī hañsī ke badle, merī sārī duniyā le le
Tere sañg jhūl rahā hai, merī bāhoñ meñ jag sārā
Merā nām karegā roshan, jag meñ merā rāj dulārā
Tujhe sūraj kahūñ yā chandā, tujhe dīp kahūñ yā tārā
Merā nām karegā roshan, jag meñ merā rāj dulārā

## Verse 2

Āj uñglī thām ke terī, tujhe maiñ chalnā sikhlāūñ
Kal hāth pakaṛnā merā, jab maiñ būṛhā ho jāūñ
Tū milā to maiñne pāyā, jīne kā nayā sahārā
Merā nām karegā roshan, jag meñ merā rāj dulārā
Tujhe sūraj kahūñ yā chandā, tujhe dīp kahūñ yā tārā
Merā nām karegā roshan, jag meñ merā rāj dulārā

## Verse 3

Mere bād bhī is duniyā meñ, zindā merā nām rahegā
Jo bhī tujhko dekhegā, tujhe merā lāl kahegā
Tere rūp meñ mil jāegā, mujhko jīvan dobārā
Merā nām karegā roshan, jag meñ merā rāj dulārā
Tujhe sūraj kahūñ yā chandā, tujhe dīp kahūñ yā tārā
Merā nām karegā roshan, jag meñ merā rāj dulārā`,
    devanagari_lyrics: `## Chorus

तुझे सूरज कहूँ या चंदा, तुझे दीप कहूँ या तारा
मेरा नाम करेगा रोशन, जग में मेरा राज दुलारा
तुझे सूरज कहूँ या चंदा, तुझे दीप कहूँ या तारा
मेरा नाम करेगा रोशन, जग में मेरा राज दुलारा

## Verse 1

मैं कब से तरस रहा था, मेरे आँगन में कोई खेले
नन्ही सी हँसी के बदले, मेरी सारी दुनिया ले ले
तेरे संग झूल रहा है, मेरी बाहों में जग सारा
मेरा नाम करेगा रोशन, जग में मेरा राज दुलारा
तुझे सूरज कहूँ या चंदा, तुझे दीप कहूँ या तारा
मेरा नाम करेगा रोशन, जग में मेरा राज दुलारा

## Verse 2

आज उंगली थाम के तेरी, तुझे मैं चलना सिखलाऊँ
कल हाथ पकड़ना मेरा, जब मैं बूढ़ा हो जाऊँ
तू मिला तो मैंने पाया, जीने का नया सहारा
मेरा नाम करेगा रोशन, जग में मेरा राज दुलारा
तुझे सूरज कहूँ या चंदा, तुझे दीप कहूँ या तारा
मेरा नाम करेगा रोशन, जग में मेरा राज दुलारा

## Verse 3

मेरे बाद भी इस दुनिया में, ज़िंदा मेरा नाम रहेगा
जो भी तुझको देखेगा, तुझे मेरा लाल कहेगा
तेरे रूप में मिल जाएगा, मुझको जीवन दोबारा
मेरा नाम करेगा रोशन, जग में मेरा राज दुलारा
तुझे सूरज कहूँ या चंदा, तुझे दीप कहूँ या तारा
मेरा नाम करेगा रोशन, जग में मेरा राज दुलारा`,
    translation: `## Chorus

Should I call you the sun or the moon? Should I call you a lamp or a star?
My precious beloved child will illuminate my name across the world.
Should I call you the sun or the moon? Should I call you a lamp or a star?
My precious beloved child will illuminate my name across the world.

## Verse 1

How long I had yearned for someone to play in my courtyard!
In return for your tiny laughter, take away my entire world.
Along with you, the entire world swings gently in my embrace.
My precious beloved child will illuminate my name across the world.
Should I call you the sun or the moon...

## Verse 2

Today I hold your little finger and teach you how to walk;
Tomorrow, hold my hand when I grow old.
Having found you, I have found a brand new reason and support to live.
My precious beloved child will illuminate my name across the world.
Should I call you the sun or the moon...

## Verse 3

Even after I am gone, my name will live on in this world;
Whoever looks upon you will call you my beloved child.
In your form, I will have received a second life.
My precious beloved child will illuminate my name across the world.
Should I call you the sun or the moon? Should I call you a lamp or a star?
My precious beloved child will illuminate my name across the world.`,
  },

  "o-nanhe-se-farishte-mohammed-rafi": {
    title: "O Nanhe Se Farishte",
    alternate_title:
      "O Nanhe Se Farishte Tujhse Yeh Kaisa Nata · Happy Birthday To You · Ek Phool Do Mali",
    artist_version: "Mohammed Rafi",
    audio_url: "/audio/o-nanhe-se-farishte-mohammed-rafi.mp3",
    thumbnail_url: "/images/o-nanhe-se-farishte-thumb.jpg",
    cover_url: "/images/o-nanhe-se-farishte-cover.jpg",
    mini_cover_url: "/images/o-nanhe-se-farishte-thumb.jpg",
    display_order: 92,
    category_slugs: ["birthday", "general", "hindi"],
    meaning:
      "Classic Bollywood birthday celebration song from Ek Phool Do Mali (1969), sung by Mohammed Rafi — lyrics Prem Dhawan, music Ravi. Picturised on Sanjay Khan and Master Bobby. Filled with tender birthday greetings and lifelong wishes for an innocent little angel.",
    roman_lyrics: `## Chorus

O nanhe se farishte
Tujhse ye kaisā nātā, kaise ye dil ke rishte
O nanhe se farishte
Tujhse ye kaisā nātā, kaise ye dil ke rishte
O nanhe se farishte

Happy birthday to you
Happy birthday to you

## Verse 1

Tujhe dekhne ko tarseñ, kyoñ har ghaṛī nigāheñ
Tujhe dekhne ko tarseñ, kyoñ har ghaṛī nigāheñ
Bechain sī rahtī haiñ, tere liye ye bāheñ
Mujhe khud patā nahīñ hai, mujhe tujhse pyār kyoñ hai
O nanhe se farishte
Tujhse ye kaisā nātā, kaise ye dil ke rishte
O nanhe se farishte

Happy birthday to you
Happy birthday to you

## Verse 2

Nāzuk sā phūl hai tū, kisī aur ke chaman kā
Nāzuk sā phūl hai tū, kisī aur ke chaman kā
Khushbū se terī mahke, kyoñ bāġh mere man kā
Merī zindagī meñ chhāī, tujhse bahār kyoñ hai
O nanhe se farishte
Tujhse ye kaisā nātā, kaise ye dil ke rishte
O nanhe se farishte

Happy birthday to you
Happy birthday to you

## Verse 3

Tū kuchh nahīñ hai merā, phir bhī ye taṛap kaisī
Tujhe dekhte hī khūn meñ, uṭhtī hai ik lahar sī
Har vaqt mujhko rahtā, terā intezār kyoñ hai
O nanhe se farishte
Tujhse ye kaisā nātā, kaise ye dil ke rishte
O nanhe se farishte

Happy birthday to you
Happy birthday to you
Happy birthday to you
Happy birthday to you`,
    devanagari_lyrics: `## Chorus

ओ नन्हे से फ़रिश्ते
तुझसे ये कैसा नाता, कैसे ये दिल के रिश्ते
ओ नन्हे से फ़रिश्ते
तुझसे ये कैसा नाता, कैसे ये दिल के रिश्ते
ओ नन्हे से फ़रिश्ते

हैप्पी बर्थडे टू यू
हैप्पी बर्थडे टू यू

## Verse 1

तुझे देखने को तरसें, क्यों हर घड़ी निगाहें
तुझे देखने को तरसें, क्यों हर घड़ी निगाहें
बेचैन सी रहती हैं, तेरे लिए ये बाहें
मुझे खुद पता नहीं है, मुझे तुझसे प्यार क्यों है
ओ नन्हे से फ़रिश्ते
तुझसे ये कैसा नाता, कैसे ये दिल के रिश्ते
ओ नन्हे से फ़रिश्ते

हैप्पी बर्थडे टू यू
हैप्पी बर्थडे टू यू

## Verse 2

नाज़ुक सा फूल है तू, किसी और के चमन का
नाज़ुक सा फूल है तू, किसी और के चमन का
खुशबू से तेरी महके, क्यों बाग़ मेरे मन का
मेरी ज़िंदगी में छाई, तुझसे बहार क्यों है
ओ नन्हे से फ़रिश्ते
तुझसे ये कैसा नाता, कैसे ये दिल के रिश्ते
ओ नन्हे से फ़रिश्ते

हैप्पी बर्थडे टू यू
हैप्पी बर्थडे टू यू

## Verse 3

तू कुछ नहीं है मेरा, फिर भी ये तड़प कैसी
तुझे देखते ही ख़ून में, उठती है इक लहर सी
हर वक़्त मुझको रहता, तेरा इंतज़ार क्यों है
ओ नन्हे से फ़रिश्ते
तुझसे ये कैसा नाता, कैसे ये दिल के रिश्ते
ओ नन्हे से फ़रिश्ते

हैप्पी बर्थडे टू यू
हैप्पी बर्थडे टू यू
हैप्पी बर्थडे टू यू
हैप्पी बर्थडे टू यू`,
    translation: `## Chorus

O little angel!
What is this connection with you, what are these bonds of the heart?
O little angel!
What is this connection with you, what are these bonds of the heart?
O little angel!

Happy birthday to you!
Happy birthday to you!

## Verse 1

Why do my eyes yearn to see you at every moment?
Why do my eyes yearn to see you at every moment?
My arms stay restless just to embrace you.
I myself do not know why I love you so much.
O little angel!
What is this connection with you, what are these bonds of the heart?
O little angel!

Happy birthday to you!
Happy birthday to you!

## Verse 2

You are a delicate flower belonging to someone else's garden.
You are a delicate flower belonging to someone else's garden.
Yet why does the garden of my heart blossom with your fragrance?
Why has spring filled my life because of you?
O little angel!
What is this connection with you, what are these bonds of the heart?
O little angel!

Happy birthday to you!
Happy birthday to you!

## Verse 3

You are not mine by relation, yet why is there this yearning?
The moment I see you, a wave rises within my blood.
Why am I always waiting for you at every hour?
O little angel!
What is this connection with you, what are these bonds of the heart?
O little angel!

Happy birthday to you!
Happy birthday to you!
Happy birthday to you!
Happy birthday to you!`,
  },

  "badhai-ho-badhai-janamdin-ki-lata-mangeshkar": {
    title: "Badhai Ho Badhai Janamdin Ki",
    alternate_title:
      "Badhaai Ho Badhaai Janam Din Ki Tumko · Janam Din Tumhara Milenge Laddu Humko · Mera Munna · Birthday Special",
    artist_version: "Lata Mangeshkar",
    audio_url: "https://www.youtube.com/watch?v=LWKJ47VIATU",
    thumbnail_url: "/images/badhai-ho-badhai-janamdin-ki-thumb.jpg",
    cover_url: "/images/badhai-ho-badhai-janamdin-ki-cover.jpg",
    mini_cover_url: "/images/badhai-ho-badhai-janamdin-ki-thumb.jpg",
    display_order: 93,
    category_slugs: ["birthday", "hindi"],
    meaning:
      "Delightful, joyful classic Hindi birthday celebration song from the film Mera Munna (1967), sung by Lata Mangeshkar — composed by Kalyanji–Anandji, with lyrics by Qamar Jalalabadi. Sung with love and teasing for a child's birthday: 'Badhai ho badhai janamdin ki tumko, janamdin tumhara milenge laddu hamko!' Wishing them high success in studies, a happy marriage in youth, and grandchildren in old age.",
    roman_lyrics: `## Chorus

Badhāī ho badhāī, janamdin kī tumko
Badhāī ho badhāī, janamdin kī tumko
Janamdin tumhārā, mileñge laḍḍū hamko
Janamdin tumhārā, mileñge laḍḍū hamko
Badhāī ho badhāī, janamdin kī tumko
Badhāī ho badhāī, janamdin kī tumko

## Verse 1

Sadā dil lagā ke tū mehanat se paṛhnā
Mehanat se paṛhnā
Paṛhāī meñ aage se aage hī baṛhnā
Aage hī baṛhnā
Achhā jī batāo maiñne aisā kyoñ kahā?
Jo tum paas hoge, mileñge laḍḍū hamko
Jo tum paas hoge, mileñge laḍḍū hamko
Badhāī ho badhāī, janamdin kī tumko
Badhāī ho badhāī, janamdin kī tumko

## Verse 2

Baṛe ho ke lānā hamārī tū bhābhī
Hamārī tū bhābhī
Ke jiskī ho rañgat gulābī-gulābī
Gulābī-gulābī
Achhā jī batāo maiñne aisā kyoñ kahā?
Tumhārī hogī shādī, mileñge laḍḍū hamko
Tumhārī hogī shādī, mileñge laḍḍū hamko
Badhāī ho badhāī, janamdin kī tumko
Badhāī ho badhāī, janamdin kī tumko

## Verse 3

Buṛhāpe meñ hoñge idhar bāl pakke
Idhar bāl pakke
Udhar hoñge ghar meñ jī bachchoñ ke bachche
Jī bachchoñ ke bachche
Achhā jī batāo maiñne aisā kyoñ kahā?
Tumhāre hogā potā, mileñge laḍḍū hamko
Tumhāre hogā potā, mileñge laḍḍū hamko
Badhāī ho badhāī, janamdin kī tumko
Badhāī ho badhāī, janamdin kī tumko`,
    devanagari_lyrics: `## Chorus

बधाई हो बधाई, जनमदिन की तुमको
बधाई हो बधाई, जनमदिन की तुमको
जनमदिन तुम्हारा, मिलेंगे लड्डू हमको
जनमदिन तुम्हारा, मिलेंगे लड्डू हमको
बधाई हो बधाई, जनमदिन की तुमको
बधाई हो बधाई, जनमदिन की तुमको

## Verse 1

सदा दिल लगा के तू मेहनत से पढ़ना
मेहनत से पढ़ना
पढ़ाई में आगे से आगे ही बढ़ना
आगे ही बढ़ना
अच्छा जी बताओ मैंने ऐसा क्यों कहा?
जो तुम पास होगे, मिलेंगे लड्डू हमको
जो तुम पास होगे, मिलेंगे लड्डू हमको
बधाई हो बधाई, जनमदिन की तुमको
बधाई हो बधाई, जनमदिन की तुमको

## Verse 2

बड़े हो के लाना हमारी तू भाभी
हमारी तू भाभी
के जिसकी हो रंगत गुलाबी-गुलाबी
गुलाबी-गुलाबी
अच्छा जी बताओ मैंने ऐसा क्यों कहा?
तुम्हारी होगी शादी, मिलेंगे लड्डू हमको
तुम्हारी होगी शादी, मिलेंगे लड्डू हमको
बधाई हो बधाई, जनमदिन की तुमको
बधाई हो बधाई, जनमदिन की तुमको

## Verse 3

बुढ़ापे में होंगे इधर बाल पक्के
इधर बाल पक्के
उधर होंगे घर में जी बच्चों के बच्चे
जी बच्चों के बच्चे
अच्छा जी बताओ मैंने ऐसा क्यों कहा?
तुम्हारे होगा पोता, मिलेंगे लड्डू हमको
तुम्हारे होगा पोता, मिलेंगे लड्डू हमको
बधाई हो बधाई, जनमदिन की तुमको
बधाई हो बधाई, जनमदिन की तुमको`,
    translation: `## Chorus

Congratulations and warmest greetings on your birthday!
Congratulations and warmest greetings on your birthday!
It is your birthday, and we get to enjoy sweet laddus!
It is your birthday, and we get to enjoy sweet laddus!
Congratulations and best wishes on your birthday!
Congratulations and best wishes on your birthday!

## Verse 1

Always study with wholehearted dedication and hard work,
With hard work!
Progress higher and higher in your studies,
Higher and higher!
Tell me, why did I say this?
When you pass your exams, we get to feast on laddus!
When you pass your exams, we get to feast on laddus!
Congratulations and best wishes on your birthday!

## Verse 2

When you grow up, bring home a sweet bride for us,
A bride for us!
One whose radiant cheeks bloom rosy pink,
Rosy pink!
Tell me, why did I say this?
When you get married, we get to celebrate with laddus!
When you get married, we get to celebrate with laddus!
Congratulations and best wishes on your birthday!

## Verse 3

In old age, when hair turns grey and white,
Turns grey and white,
There will be lovely children of your children playing at home,
Children playing at home!
Tell me, why did I say this?
When you are blessed with a grandson, we get to celebrate with laddus!
When you are blessed with a grandson, we get to celebrate with laddus!
Congratulations and warmest greetings on your birthday!
Congratulations and warmest greetings on your birthday!`,
  },
  "kahawa-se-aayo-bhagwane-xstatixz": {
    title: "Kahwase Aye",
    alternate_title: "Remix · Kahava Se Aaye Bhagavane · Party Mix",
    artist_version: "Ashine",
    audio_url:
      "/audio/folders/chutney-style-bhajan/kahawa-se-aayo-bhagwane-xstatixz.mp3",
    thumbnail_url: "/images/kahwase-aye-xstatixz-thumb.png",
    cover_url: "/images/kahwase-aye-xstatixz-cover.png",
    mini_cover_url: "/images/kahwase-aye-xstatixz-thumb.png",
    display_order: 61,
    category_slugs: [
      "krishna",
      "ram",
      "shiva",
      "general",
      "janmashtami",
      "satsang",
      "bhajan",
      "devotion",
      "hindi",
    ],
    meaning:
      "Remix / party mix — chutney-style Krishna / Ram / Shiva bhajan sung by Ashine. Asks where Bhagavan, Shiv-Shankar, and Mahadev came from — Radha swings the child in her lap while dancing with the cowherds; sisters sing for the little one; Kanhaiya, Lakshman, and Ram delight the three mothers. Also listed under Chutney Style Bhajan, Traditional Chutney, and Bhajan Party Mix.",
    roman_lyrics: `## Verse 1

Kahava se aaye Bhagavane, kaha se Shiva Shankar, kaha se Mahadeva
Are kaune sukhi ke lale, khile tore angana ho
Are kaune sukhi ke lale, khile tore angana ho
Are kaune sukhi ke lale, khile tore angana ho

## Verse 2

Kurbe se aaye Bhagavan, kurbe se Shiva Shankar, kurbe se Mahadeva ho
Are Radha jhulave apun godiya, guvara sange nachaka ho
Are Radha jhulave apun godiya, guvara sange nachaka ho
Are Radha jhulave apun godiya, guvara sange nachaka ho

## Verse 3

Nache nache gao re, baheniya lalan ko khilavat, lalan ko jhulavat ho
Are jhatava dauri dauri aave, jhataniya god uthavat ho
Are jhatava dauri dauri aave, jhataniya god uthavat ho
Are jhatava dauri dauri aave, jhataniya god uthavat ho

## Verse 4

Kahava se aaye Kanhaiya, kaha se bhaiya Lakshman, kaha se Prabhu Ram ho
Are godiya khilave teeno maiya, bari anantavat ho
Are godiya khilave teeno maiya, bari anantavat ho
Are godiya khilave teeno maiya, bari anantavat ho

## Closing

Kahava se aaye Bhagavane, kaha se Shiva Shankar, kaha se Mahadeva
Are kaune sukhi ke lale, khile tore angana ho
Are kaune sukhi ke lale, khile tore angana ho
Are kaune sukhi ke lale, khile tore angana ho`,
    translation: `## Verse 1

From where did the Lord come, where did Shiv Shankar come from, where did Mahadev come from?
Hey — whose friend’s son blossomed in your courtyard?
Hey — whose friend’s son blossomed in your courtyard?
Hey — whose friend’s son blossomed in your courtyard?

## Verse 2

The Lord came from nearby, Shiv Shankar came from nearby, Mahadev came from nearby
Hey — Radha is swinging him in her lap, dancing with the cowherd
Hey — Radha is swinging him in her lap, dancing with the cowherd
Hey — Radha is swinging him in her lap, dancing with the cowherd

## Verse 3

Dance, dance — sing, sisters; you are playing with the child, you are swinging him
Hey — he came running, running; you lifted him onto your lap
Hey — he came running, running; you lifted him onto your lap
Hey — he came running, running; you lifted him onto your lap

## Verse 4

Where did Kanhaiya come from, where did brother Lakshman come from, where did Lord Ram come from?
Hey — the three mothers are very happy to play with him in their lap
Hey — the three mothers are very happy to play with him in their lap
Hey — the three mothers are very happy to play with him in their lap

## Closing

From where did the Lord come, where did Shiv Shankar come from, where did Mahadev come from?
Hey — whose friend’s son blossomed in your courtyard?
Hey — whose friend’s son blossomed in your courtyard?
Hey — whose friend’s son blossomed in your courtyard?`,
  },
  "jai-he-mahalaxmi-maa-usha-mangeshkar": {
    title: "Jai He Mahalaxmi Maa",
    alternate_title: "Jai Hey Mahalaxmi Maa · Naiya Meri Paar Karo",
    artist_version: "Usha Mangeshkar",
    audio_url: "https://www.youtube.com/watch?v=ccABPfc-q80",
    youtube_url: "https://www.youtube.com/watch?v=ccABPfc-q80",
    thumbnail_url: "/images/jai-he-mahalaxmi-maa-usha-mangeshkar.png",
    cover_url: "/images/jai-he-mahalaxmi-maa-usha-mangeshkar-player.png",
    mini_cover_url: "/images/jai-he-mahalaxmi-maa-usha-mangeshkar.png",
    display_order: 94,
    category_slugs: [
      "lakshmi",
      "diwali",
      "general",
      "satsang",
      "aarti",
      "bhajan",
      "devotion",
      "hindi",
    ],
    meaning:
      "Classic Saregama Lakshmi bhajan (Usha Mangeshkar) — praise of Mother Mahalaxmi: take our boat across, fill the devotee’s empty jholi, remove sorrow, and on Diwali fill the home with light, grace, and prosperity.",
    roman_lyrics: `## Chorus

Jai he Mahalaxmi Maa
Jai he Mahalaxmi Maa
Naiya meri paar karo
Jai he Mahalaxmi Maa
Naiya meri paar karo
Jholi failaye khadi
Jholi failaye khadi
Maiya bhandar bharo
Jai he Mahalaxmi Maa
Naiya meri paar karo
Jai he Mahalaxmi Maa
Naiya meri paar karo

## Verse 1

Tu dayalu maiya, mamta bhari
Lakho dukhiyon ki tune vipda hari
Tu dayalu maiya, mamta bhari
Lakho dukhiyon ki tune vipda hari
Ham bhi aaye sharan tihari
Ham bhi aaye sharan tihari
Ham pe daya karo, dhyan dharo
Jai he Mahalaxmi Maa
Naiya meri paar karo
Jai he Mahalaxmi Maa
Naiya meri paar karo

## Verse 2

Aayi Diwali, aayi deepak jale
Teri kripa ho to sabhi phule phale
Aayi Diwali, aayi deepak jale
Teri kripa ho to sabhi phule phale
Sukh sampati se ghar bhar jaaye
Sukh sampati se ghar bhar jaaye
Itna sa upkar karo
Jai he Mahalaxmi Maa
Naiya meri paar karo
Jai he Mahalaxmi Maa
Naiya meri paar karo

## Closing

Jholi failaye khadi
Maiya bhandar bharo
Jai he Mahalaxmi Maa
Naiya meri paar karo
Jai he Mahalaxmi Maa
Naiya meri paar karo`,
    translation: `## Chorus

Glory to Mother Mahalaxmi
Glory to Mother Mahalaxmi
Carry my boat safely across
Glory to Mother Mahalaxmi
Carry my boat safely across
I stand with my jholi held open
I stand with my jholi held open
Mother, fill the storehouse
Glory to Mother Mahalaxmi
Carry my boat safely across
Glory to Mother Mahalaxmi
Carry my boat safely across

## Verse 1

You are merciful Mother, full of motherly love
You have removed the troubles of lakhs who were suffering
You are merciful Mother, full of motherly love
You have removed the troubles of lakhs who were suffering
We too have come to your shelter
We too have come to your shelter
Have mercy on us — keep us in your care
Glory to Mother Mahalaxmi
Carry my boat safely across
Glory to Mother Mahalaxmi
Carry my boat safely across

## Verse 2

Diwali has come — the lamps are lit
If your grace is there, all will blossom and flourish
Diwali has come — the lamps are lit
If your grace is there, all will blossom and flourish
May the home fill with happiness and prosperity
May the home fill with happiness and prosperity
Do this small favour for us
Glory to Mother Mahalaxmi
Carry my boat safely across
Glory to Mother Mahalaxmi
Carry my boat safely across

## Closing

I stand with my jholi held open
Mother, fill the storehouse
Glory to Mother Mahalaxmi
Carry my boat safely across
Glory to Mother Mahalaxmi
Carry my boat safely across`,
  },
  "bolo-jai-jai-bajrangi-rakesh-yankaran": {
    title: "Jai Jai Bajrangi",
    alternate_title: "Jai Jai Bajrangbali · Hanuman bharo' Balavan bolo",
    artist_version: "Rakesh Yankaran",
    audio_url: "https://www.youtube.com/watch?v=kwh55l3MRCU",
    youtube_url: "https://www.youtube.com/watch?v=kwh55l3MRCU",
    thumbnail_url: "/images/bolo-jai-jai-bajrangi-rakesh-yankaran.jpg",
    cover_url: "/images/bolo-jai-jai-bajrangi-rakesh-yankaran.jpg",
    mini_cover_url: "/images/bolo-jai-jai-bajrangi-rakesh-yankaran.jpg",
    display_order: 95,
    category_slugs: [
      "hanuman",
      "ram",
      "general",
      "satsang",
      "bhajan",
      "devotion",
      "hindi",
    ],
    meaning:
      "Indo-Caribbean chutney-style Hanuman bhajan (Rakesh Yankaran) — glory to Bajrang Bali, Ram’s eternal devotee who led the way, crossed the ocean, found Sita, and helped defeat Ravan and Ahiravan.",
    roman_lyrics: `## Opening

Bolo jai jai Bajarangi
Bolo jai jai Bajarangi

## Refrain

Hanuman bharo' Balavan bolo
Jai jai Bajarangi
Jai jai Bajarangi

Bolo jai jai Bajarangi
Bolo jai jai Bajarangi

Hanuman bharo' Balavan bolo
Jai jai Bajarangi
Jai jai Bajarangi

## Verse 1

Hanuman payak Ramchandra ke
Sadā rahe aguvān
Rishiyo' mukh Sugriv milāye
Tū rakh liyo pehachān

Hanuman bharo' Balavan bolo
Jai jai Bajarangi
Jai jai Bajarangi

## Verse 2

Sauvyo' janam liyā ne sindhu kī
Khud gaye katu kan
Phal khaye karu ho Raghuraye
Rudra kiye vamān

Hanuman bharo' Balavan bolo
Jai jai Bajarangi
Jai jai Bajarangi

## Verse 3

Chhorā muni ghar Sita ke āge
Bolatā hās sab ā
Lāyā khabar ko dīnhā au'
Lankā āye jā

Hanuman bharo' Balavan bolo
Jai jai Bajarangi
Jai jai Bajarangi

## Verse 4

Ravan aur Ahiravan māre
Tulasīdāsa bakhān kar
Dās Bhabhishan ko rāj kiyo
Jana apno' Prabhu gyān

Hanuman bharo' Balavan bolo
Jai jai Bajarangi
Jai jai Bajarangi

## Closing

Bolo jai jai Bajarangi
Bolo jai jai Bajarangi

Hanuman bharo' Balavan bolo
Jai jai Bajarangi
Jai jai Bajarangi`,
    translation: `## Opening

Sing glory, glory to Bajarangi
Sing glory, glory to Bajarangi

## Refrain

Hanuman is filled with strength — sing
Glory, glory to Bajarangi
Glory, glory to Bajarangi

Sing glory, glory to Bajarangi
Sing glory, glory to Bajarangi

Hanuman is filled with strength — sing
Glory, glory to Bajarangi
Glory, glory to Bajarangi

## Verse 1

Hanuman-ji is the eternal devotee of moon-like Ramchandra
He always goes ahead as guide
When Sugriv met Ram at Rishimukh
You kept your recognition of your Lord

Hanuman is filled with strength — sing
Glory, glory to Bajarangi
Glory, glory to Bajarangi

## Verse 2

For the hundredth birth at the ocean
He himself went across
Ram ate the fruit
Rudra took a small form

Hanuman is filled with strength — sing
Glory, glory to Bajarangi
Glory, glory to Bajarangi

## Verse 3

At the small hermit’s hut before Sita
Everyone came laughing
He brought news and gave it
And went back and forth to Lanka

Hanuman is filled with strength — sing
Glory, glory to Bajarangi
Glory, glory to Bajarangi

## Verse 4

Ravan and Ahiravan were slain
Tulsidas sings the praise
The kingdom was given to humble Vibhishan
Who knows our Lord as his own

Hanuman is filled with strength — sing
Glory, glory to Bajarangi
Glory, glory to Bajarangi

## Closing

Sing glory, glory to Bajarangi
Sing glory, glory to Bajarangi

Hanuman is filled with strength — sing
Glory, glory to Bajarangi
Glory, glory to Bajarangi`,
  },
  "introduction-acharya-arun-gossai": {
    title: "Introduction",
    alternate_title: "Kirtan Yoga · Track 1",
    artist_version: "Acharya Arun Gossai",
    audio_url:
      "/audio/albums/kirtan-yoga-acharya-arun-gossai/01-introduction.mp3",
    cover_url: "/images/albums/kirtan-yoga-acharya-arun-gossai-player-fit.png",
    thumbnail_url: "/images/albums/kirtan-yoga-acharya-arun-gossai-square.png",
    mini_cover_url: "/images/albums/kirtan-yoga-acharya-arun-gossai-square.png",
    display_order: 96,
    category_slugs: ["general", "satsang", "bhajan", "devotion", "hindi"],
    meaning:
      "Opening introduction from Acharya Arun Gossai’s Kirtan Yoga album.",
    roman_lyrics: "[Album track]",
  },
  "krishna-krishna-acharya-arun-gossai": {
    title: "Krishna Krishna",
    alternate_title: "Kirtan Yoga · Track 2",
    artist_version: "Acharya Arun Gossai",
    audio_url:
      "/audio/albums/kirtan-yoga-acharya-arun-gossai/02-krishna-krishna.mp3",
    cover_url: "/images/albums/kirtan-yoga-acharya-arun-gossai-player-fit.png",
    thumbnail_url: "/images/albums/kirtan-yoga-acharya-arun-gossai-square.png",
    mini_cover_url: "/images/albums/kirtan-yoga-acharya-arun-gossai-square.png",
    display_order: 97,
    category_slugs: [
      "krishna",
      "general",
      "satsang",
      "bhajan",
      "devotion",
      "hindi",
    ],
    meaning:
      "From Kirtan Yoga (Acharya Arun Gossai). Lyrics not transcribed yet — play the track to listen.",
    roman_lyrics: "[Album track]",
  },
  "shri-ram-stuti-acharya-arun-gossai": {
    title: "Shri Ram Stuti",
    alternate_title: "Kirtan Yoga · Track 3",
    artist_version: "Acharya Arun Gossai",
    audio_url:
      "/audio/albums/kirtan-yoga-acharya-arun-gossai/03-shri-ram-stuti.mp3",
    cover_url: "/images/albums/kirtan-yoga-acharya-arun-gossai-player-fit.png",
    thumbnail_url: "/images/albums/kirtan-yoga-acharya-arun-gossai-square.png",
    mini_cover_url: "/images/albums/kirtan-yoga-acharya-arun-gossai-square.png",
    display_order: 98,
    category_slugs: [
      "ram",
      "general",
      "satsang",
      "bhajan",
      "devotion",
      "hindi",
    ],
    meaning:
      "From Kirtan Yoga (Acharya Arun Gossai). Lyrics not transcribed yet — play the track to listen.",
    roman_lyrics: "[Album track]",
  },
  "dwar-se-tere-acharya-arun-gossai": {
    title: "Dwar Se Tere",
    alternate_title: "Kirtan Yoga · Track 4",
    artist_version: "Acharya Arun Gossai",
    audio_url:
      "/audio/albums/kirtan-yoga-acharya-arun-gossai/04-dwar-se-tere.mp3",
    cover_url: "/images/albums/kirtan-yoga-acharya-arun-gossai-player-fit.png",
    thumbnail_url: "/images/albums/kirtan-yoga-acharya-arun-gossai-square.png",
    mini_cover_url: "/images/albums/kirtan-yoga-acharya-arun-gossai-square.png",
    display_order: 99,
    category_slugs: ["general", "satsang", "bhajan", "devotion", "hindi"],
    meaning:
      "From Kirtan Yoga (Acharya Arun Gossai). Lyrics not transcribed yet — play the track to listen.",
    roman_lyrics: "[Album track]",
  },
  "baaje-re-muraliya-acharya-arun-gossai": {
    title: "Baaje Re Muraliya",
    alternate_title: "Kirtan Yoga · Track 5",
    artist_version: "Acharya Arun Gossai",
    audio_url:
      "/audio/albums/kirtan-yoga-acharya-arun-gossai/05-baaje-re-muraliya.mp3",
    cover_url: "/images/albums/kirtan-yoga-acharya-arun-gossai-player-fit.png",
    thumbnail_url: "/images/albums/kirtan-yoga-acharya-arun-gossai-square.png",
    mini_cover_url: "/images/albums/kirtan-yoga-acharya-arun-gossai-square.png",
    display_order: 100,
    category_slugs: [
      "krishna",
      "general",
      "satsang",
      "bhajan",
      "devotion",
      "hindi",
    ],
    meaning:
      "From Kirtan Yoga (Acharya Arun Gossai) — Krishna’s flute. Lyrics not transcribed yet — play the track to listen.",
    roman_lyrics: "[Album track]",
  },
  "shri-ram-tumhare-mandir-mein-acharya-arun-gossai": {
    title: "Shri Ram Tumhare Mandir Mein",
    alternate_title: "Kirtan Yoga · Track 6",
    artist_version: "Acharya Arun Gossai",
    audio_url:
      "/audio/albums/kirtan-yoga-acharya-arun-gossai/06-shri-ram-tumhare-mandir-mein.mp3",
    cover_url: "/images/albums/kirtan-yoga-acharya-arun-gossai-player-fit.png",
    thumbnail_url: "/images/albums/kirtan-yoga-acharya-arun-gossai-square.png",
    mini_cover_url: "/images/albums/kirtan-yoga-acharya-arun-gossai-square.png",
    display_order: 101,
    category_slugs: [
      "ram",
      "general",
      "satsang",
      "bhajan",
      "devotion",
      "hindi",
    ],
    meaning:
      "From Kirtan Yoga (Acharya Arun Gossai). Lyrics not transcribed yet — play the track to listen.",
    roman_lyrics: "[Album track]",
  },
  "bruhi-mukundeti-acharya-arun-gossai": {
    title: "Bruhi Mukundeti",
    alternate_title: "Kirtan Yoga · Track 8",
    artist_version: "Acharya Arun Gossai",
    audio_url:
      "/audio/albums/kirtan-yoga-acharya-arun-gossai/08-bruhi-mukundeti.mp3",
    cover_url: "/images/albums/kirtan-yoga-acharya-arun-gossai-player-fit.png",
    thumbnail_url: "/images/albums/kirtan-yoga-acharya-arun-gossai-square.png",
    mini_cover_url: "/images/albums/kirtan-yoga-acharya-arun-gossai-square.png",
    display_order: 102,
    category_slugs: [
      "krishna",
      "general",
      "satsang",
      "bhajan",
      "devotion",
      "hindi",
    ],
    meaning:
      "From Kirtan Yoga (Acharya Arun Gossai) — Sanskrit kirtan of Mukunda (Krishna). Lyrics not transcribed yet — play the track to listen.",
    roman_lyrics: "[Album track]",
  },
  "kripa-ki-ek-najar-acharya-arun-gossai": {
    title: "Kripa Ki Ek Najar",
    alternate_title: "Kirtan Yoga · Track 9",
    artist_version: "Acharya Arun Gossai",
    audio_url:
      "/audio/albums/kirtan-yoga-acharya-arun-gossai/09-kripa-ki-ek-najar.mp3",
    cover_url: "/images/albums/kirtan-yoga-acharya-arun-gossai-player-fit.png",
    thumbnail_url: "/images/albums/kirtan-yoga-acharya-arun-gossai-square.png",
    mini_cover_url: "/images/albums/kirtan-yoga-acharya-arun-gossai-square.png",
    display_order: 103,
    category_slugs: ["general", "satsang", "bhajan", "devotion", "hindi"],
    meaning:
      "From Kirtan Yoga (Acharya Arun Gossai). Lyrics not transcribed yet — play the track to listen.",
    roman_lyrics: "[Album track]",
  },
  "maiya-tere-dar-pe-acharya-arun-gossai": {
    title: "Maiya Tere Dar Pe",
    alternate_title: "Kirtan Yoga · Track 10",
    artist_version: "Acharya Arun Gossai",
    audio_url:
      "/audio/albums/kirtan-yoga-acharya-arun-gossai/10-maiya-tere-dar-pe.mp3",
    cover_url: "/images/albums/kirtan-yoga-acharya-arun-gossai-player-fit.png",
    thumbnail_url: "/images/albums/kirtan-yoga-acharya-arun-gossai-square.png",
    mini_cover_url: "/images/albums/kirtan-yoga-acharya-arun-gossai-square.png",
    display_order: 104,
    category_slugs: [
      "durga",
      "general",
      "satsang",
      "bhajan",
      "devotion",
      "hindi",
    ],
    meaning:
      "From Kirtan Yoga (Acharya Arun Gossai) — at Mother’s door. Lyrics not transcribed yet — play the track to listen.",
    roman_lyrics: "[Album track]",
  },
  "raghupati-raghav-rajaram-kedar-pandit": {
    title: "Raghupati Raghav Rajaram",
    alternate_title: "Bhakti Instrumentals & Karaoke · Track 1",
    artist_version: "Kedar Pandit",
    audio_url:
      "/audio/albums/bhakti-instrumentals-kedar-pandit/01-raghupati-raghav-rajaram.mp3",
    cover_url: "/images/albums/bhakti-instrumentals-kedar-pandit-player.png",
    thumbnail_url: "/images/albums/bhakti-instrumentals-kedar-pandit.png",
    mini_cover_url: "/images/albums/bhakti-instrumentals-kedar-pandit.png",
    display_order: 105,
    category_slugs: [
      "ram",
      "general",
      "satsang",
      "bhajan",
      "devotion",
      "hindi",
    ],
    meaning:
      "Instrumental / karaoke (Exotic India · Kedar Pandit). Classic Ram dhun — lyrics below for singing along.",
    roman_lyrics: `## Chorus

Raghupati Raghav Raja Ram
Patit pavan Sita Ram

## Verses

Ishwar Allah tero naam
Sabko sanmati de Bhagwan

Raghupati Raghav Raja Ram
Patit pavan Sita Ram`,
    translation: `## Chorus

Raghupati Raghav, King Ram
Purifier of the fallen — Sita Ram

## Verses

Ishwar and Allah are Your names
Give everyone good understanding, O God

Raghupati Raghav, King Ram
Purifier of the fallen — Sita Ram`,
  },
  "shyam-teri-bansi-kedar-pandit": {
    title: "Shyam Teri Bansi",
    alternate_title: "Bhakti Instrumentals & Karaoke · Track 2",
    artist_version: "Kedar Pandit",
    audio_url:
      "/audio/albums/bhakti-instrumentals-kedar-pandit/02-shyam-teri-bansi.mp3",
    cover_url: "/images/albums/bhakti-instrumentals-kedar-pandit-player.png",
    thumbnail_url: "/images/albums/bhakti-instrumentals-kedar-pandit.png",
    mini_cover_url: "/images/albums/bhakti-instrumentals-kedar-pandit.png",
    display_order: 106,
    category_slugs: [
      "krishna",
      "general",
      "satsang",
      "bhajan",
      "devotion",
      "hindi",
    ],
    meaning:
      "Instrumental / karaoke (Exotic India · Kedar Pandit). Krishna’s flute — lyrics below for singing along.",
    roman_lyrics: `## Chorus

Shyam teri bansi Pukare Radha naam
Shyam teri bansi Pukare Radha naam

## Verses

Brindavan ke kunj galin mein
Goonje Tera naam
Shyam teri bansi Pukare Radha naam

Jamuna tat pe gope gopiyan
Nachen madhur taal
Shyam teri bansi Pukare Radha naam`,
    translation: `## Chorus

Shyam, your flute calls Radha’s name
Shyam, your flute calls Radha’s name

## Verses

In the groves and lanes of Vrindavan
Your name resounds
Shyam, your flute calls Radha’s name

On the Yamuna bank the cowherds and gopis
Dance to a sweet beat
Shyam, your flute calls Radha’s name`,
  },
  "payoji-maine-ram-ratan-kedar-pandit": {
    title: "Payoji Maine Ram Ratan",
    alternate_title: "Ram Ratan Dhan Payo · Bhakti Instrumentals · Track 3",
    artist_version: "Kedar Pandit",
    audio_url:
      "/audio/albums/bhakti-instrumentals-kedar-pandit/03-payoji-maine-ram-ratan.mp3",
    cover_url: "/images/albums/bhakti-instrumentals-kedar-pandit-player.png",
    thumbnail_url: "/images/albums/bhakti-instrumentals-kedar-pandit.png",
    mini_cover_url: "/images/albums/bhakti-instrumentals-kedar-pandit.png",
    display_order: 107,
    category_slugs: [
      "ram",
      "general",
      "satsang",
      "bhajan",
      "devotion",
      "hindi",
    ],
    meaning:
      "Instrumental / karaoke (Exotic India · Kedar Pandit). Mirabai’s Ram ratan — lyrics below for singing along.",
    roman_lyrics: `## Chorus

Payo ji maine Ram ratan dhan payo
Payo ji maine Ram ratan dhan payo

## Verses

Vastu amolik di mere Satguru
Kripa kari apnayo
Payo ji maine Ram ratan dhan payo

Janam janam ki punji payi
Jag mein sabhi khovayo
Payo ji maine Ram ratan dhan payo

Kharch na khute chor na lute
Din din badhat savayo
Payo ji maine Ram ratan dhan payo

Sat ki nav khevatiya Satguru
Bhavsagar tar aayo
Payo ji maine Ram ratan dhan payo

Mira ke Prabhu Giridhar Nagar
Harakh harakh jas gayo
Payo ji maine Ram ratan dhan payo`,
    translation: `## Chorus

I have received the treasure of Ram
I have received the treasure of Ram

## Verses

My True Guru gave me this priceless treasure
Through grace He made me His own
I have received the treasure of Ram

I gained the wealth of many births
And lost everything else in the world
I have received the treasure of Ram

It is not spent, thieves cannot steal it
Day by day it grows
I have received the treasure of Ram

The True Guru rows the boat of truth
I have crossed the ocean of the world
I have received the treasure of Ram

Mira’s Lord, Giridhar Nagar —
Joyfully I sing His glory
I have received the treasure of Ram`,
  },
  "yashomati-maiyya-kedar-pandit": {
    title: "Yashomati Maiyya",
    alternate_title: "Yashomati Maiya Se Bole Nandlala · Track 4",
    artist_version: "Kedar Pandit",
    audio_url:
      "/audio/albums/bhakti-instrumentals-kedar-pandit/04-yashomati-maiyya.mp3",
    cover_url: "/images/albums/bhakti-instrumentals-kedar-pandit-player.png",
    thumbnail_url: "/images/albums/bhakti-instrumentals-kedar-pandit.png",
    mini_cover_url: "/images/albums/bhakti-instrumentals-kedar-pandit.png",
    display_order: 108,
    category_slugs: [
      "krishna",
      "general",
      "satsang",
      "bhajan",
      "devotion",
      "hindi",
    ],
    meaning:
      "Instrumental / karaoke (Exotic India · Kedar Pandit). Nandlala speaks to Mother Yashoda — lyrics below for singing along.",
    roman_lyrics: `## Chorus

Yashomati maiya se bole Nandlala
Radha kyun gori, main kyun kala
Yashomati maiya se bole Nandlala

## Verses

Suni ri Radhika, suni ri Radhika
Braj ki bala
Yashomati maiya se bole Nandlala

Radha kyun gori, main kyun kala
Yashomati maiya se bole Nandlala`,
    translation: `## Chorus

Nandlala says to Mother Yashoda
Why is Radha fair, and why am I dark?
Nandlala says to Mother Yashoda

## Verses

Listen, Radhika — listen, Radhika
Girl of Braj
Nandlala says to Mother Yashoda

Why is Radha fair, and why am I dark?
Nandlala says to Mother Yashoda`,
  },
  "allah-tero-naam-kedar-pandit": {
    title: "Allah Tero Naam",
    alternate_title: "Ishwar Allah Tero Naam · Track 5",
    artist_version: "Kedar Pandit",
    audio_url:
      "/audio/albums/bhakti-instrumentals-kedar-pandit/05-allah-tero-naam.mp3",
    cover_url: "/images/albums/bhakti-instrumentals-kedar-pandit-player.png",
    thumbnail_url: "/images/albums/bhakti-instrumentals-kedar-pandit.png",
    mini_cover_url: "/images/albums/bhakti-instrumentals-kedar-pandit.png",
    display_order: 109,
    category_slugs: ["general", "satsang", "bhajan", "devotion", "hindi"],
    meaning:
      "Instrumental / karaoke (Exotic India · Kedar Pandit). Film prayer of one God by many names — lyrics below for singing along.",
    roman_lyrics: `## Chorus

Allah tero naam, Ishwar tero naam
Sabko sanmati de Bhagwan
Allah tero naam, Ishwar tero naam

## Verses

Maango magan bhaye, maango magan bhaye
Sabko sanmati de Bhagwan

Jo bhi mangta, jo bhi mangta
Sabko sanmati de Bhagwan

Allah tero naam, Ishwar tero naam
Sabko sanmati de Bhagwan`,
    translation: `## Chorus

Allah is Your name, Ishwar is Your name
Give everyone good understanding, O God
Allah is Your name, Ishwar is Your name

## Verses

Ask in joy, ask in joy
Give everyone good understanding, O God

Whoever asks, whoever asks
Give everyone good understanding, O God

Allah is Your name, Ishwar is Your name
Give everyone good understanding, O God`,
  },
  "om-jai-jagdish-hare-kedar-pandit": {
    title: "Om Jai Jagadish Hare",
    alternate_title: "Bhakti Instrumentals & Karaoke · Track 6",
    artist_version: "Kedar Pandit",
    audio_url:
      "/audio/albums/bhakti-instrumentals-kedar-pandit/06-om-jai-jagdish-hare.mp3",
    cover_url: "/images/albums/bhakti-instrumentals-kedar-pandit-player.png",
    thumbnail_url: "/images/albums/bhakti-instrumentals-kedar-pandit.png",
    mini_cover_url: "/images/albums/bhakti-instrumentals-kedar-pandit.png",
    display_order: 110,
    category_slugs: [...OM_JAI_JAGDISH_CATEGORY_SLUGS],
    meaning: `${OM_JAI_JAGDISH_MEANING} Instrumental / karaoke (Exotic India · Kedar Pandit) — lyrics below for singing along.`,
    roman_lyrics: OM_JAI_JAGDISH_ROMAN,
    translation: OM_JAI_JAGDISH_TRANSLATION,
  },
  "jyot-se-jyot-kedar-pandit": {
    title: "Jyot Se Jyot",
    alternate_title: "Jyot Se Jyot Jagate Chalo · Track 7",
    artist_version: "Kedar Pandit",
    audio_url:
      "/audio/albums/bhakti-instrumentals-kedar-pandit/07-jyot-se-jyot.mp3",
    cover_url: "/images/albums/bhakti-instrumentals-kedar-pandit-player.png",
    thumbnail_url: "/images/albums/bhakti-instrumentals-kedar-pandit.png",
    mini_cover_url: "/images/albums/bhakti-instrumentals-kedar-pandit.png",
    display_order: 111,
    category_slugs: ["general", "satsang", "bhajan", "devotion", "hindi"],
    meaning:
      "Instrumental / karaoke (Exotic India · Kedar Pandit). Keep lighting lamp from lamp — lyrics below for singing along.",
    roman_lyrics: `## Chorus

Jyot se jyot jagate chalo
Prem ki Ganga bahate chalo
Raah mein aaye jo din dukhiyaare
Unko gale se lagate chalo

## Verses

Prem ki Ganga bahate chalo
Jyot se jyot jagate chalo`,
    translation: `## Chorus

Keep lighting lamp from lamp
Keep the Ganga of love flowing
Whoever comes on the path sad and suffering
Keep embracing them

## Verses

Keep the Ganga of love flowing
Keep lighting lamp from lamp`,
  },
  "jaise-suraj-ki-garmi-kedar-pandit": {
    title: "Jaise Suraj Ki Garmi",
    alternate_title: "Jaise Suraj Ki Garmi Mein · Track 8",
    artist_version: "Kedar Pandit",
    audio_url:
      "/audio/albums/bhakti-instrumentals-kedar-pandit/08-jaise-suraj-ki-garmi.mp3",
    cover_url: "/images/albums/bhakti-instrumentals-kedar-pandit-player.png",
    thumbnail_url: "/images/albums/bhakti-instrumentals-kedar-pandit.png",
    mini_cover_url: "/images/albums/bhakti-instrumentals-kedar-pandit.png",
    display_order: 112,
    category_slugs: [
      "krishna",
      "general",
      "satsang",
      "bhajan",
      "devotion",
      "hindi",
    ],
    meaning:
      "Instrumental / karaoke (Exotic India · Kedar Pandit). Classic film bhajan of longing for Krishna — lyrics below for singing along.",
    roman_lyrics: `## Chorus

Jaise suraj ki garmi se jalte hue tan ko
Mil jaye re chhaya kisi vriksh ki
Waise hi prabhu, ek din tum mile
Mere dukhiye man ko

## Verses

Man tarpat hari darshan ko aaj
More man ko, more man ko
Jaise suraj ki garmi se…`,
    translation: `## Chorus

As a body burning in the sun’s heat
Finds the shade of some tree
Just so, O Lord, one day You met
My sorrowful heart

## Verses

The mind longs for the Lord’s darshan today
My mind, my mind
As in the sun’s heat…`,
  },
  "hum-ko-manki-shakti-kedar-pandit": {
    title: "Hum Ko Man Ki Shakti",
    alternate_title: "Humko Man Ki Shakti Dena · Track 9",
    artist_version: "Kedar Pandit",
    audio_url:
      "/audio/albums/bhakti-instrumentals-kedar-pandit/09-hum-ko-manki-shakti.mp3",
    cover_url: "/images/albums/bhakti-instrumentals-kedar-pandit-player.png",
    thumbnail_url: "/images/albums/bhakti-instrumentals-kedar-pandit.png",
    mini_cover_url: "/images/albums/bhakti-instrumentals-kedar-pandit.png",
    display_order: 113,
    category_slugs: [
      "general",
      "satsang",
      "morning-prayer",
      "bhajan",
      "devotion",
      "hindi",
    ],
    meaning:
      "Instrumental / karaoke (Exotic India · Kedar Pandit). School / satsang prayer for strength of mind — lyrics below for singing along.",
    roman_lyrics: `## Chorus

Humko man ki shakti dena
Man vijay kare
Dusron ki jai se pehle
Khud ko jai kare

## Verses

Bhedbhav apne man se
Saaf kar sakain
Dusron se bhool ho to
Kshama kar sakain

Satya hum mein base rahe
Jhooth se dare
Dusron ki jai se pehle
Khud ko jai kare

Humko man ki shakti dena
Man vijay kare`,
    translation: `## Chorus

Give us strength of mind
So the mind may win
Before celebrating others’ victory
Let us first conquer ourselves

## Verses

May we clear from our own minds
Prejudice and division
If others make a mistake
May we be able to forgive

May truth dwell in us
May we fear falsehood
Before celebrating others’ victory
Let us first conquer ourselves

Give us strength of mind
So the mind may win`,
  },
  "man-tarpat-hari-darshan-ko-aaj-kedar-pandit": {
    title: "Man Tarpat Hari Darshan Ko Aaj",
    alternate_title: "Bhakti Instrumentals & Karaoke · Track 10",
    artist_version: "Kedar Pandit",
    audio_url:
      "/audio/albums/bhakti-instrumentals-kedar-pandit/10-man-tarpat-hari-darshan-ko-aaj.mp3",
    cover_url: "/images/albums/bhakti-instrumentals-kedar-pandit-player.png",
    thumbnail_url: "/images/albums/bhakti-instrumentals-kedar-pandit.png",
    mini_cover_url: "/images/albums/bhakti-instrumentals-kedar-pandit.png",
    display_order: 114,
    category_slugs: [
      "krishna",
      "general",
      "satsang",
      "bhajan",
      "devotion",
      "hindi",
    ],
    meaning:
      "Instrumental / karaoke (Exotic India · Kedar Pandit). Classic longing for Hari’s darshan — lyrics below for singing along.",
    roman_lyrics: `## Chorus

Man tarpat Hari darshan ko aaj
More man ko, more man ko
Man tarpat Hari darshan ko aaj

## Verses

Tum bin meri kaun khabar le
Jag mein, jag mein
Man tarpat Hari darshan ko aaj

Tum hi ho maa, pita tum hi ho
Bandhu sakha tumhi
Man tarpat Hari darshan ko aaj`,
    translation: `## Chorus

The mind longs for Hari’s darshan today
My mind, my mind
The mind longs for Hari’s darshan today

## Verses

Without You, who will care for me
In this world, in this world
The mind longs for Hari’s darshan today

You alone are mother, You alone are father
Friend and companion — You alone
The mind longs for Hari’s darshan today`,
  },
  "jaise-radha-ne-mala-japi-kedar-pandit": {
    title: "Jaise Radha Ne Mala Japi",
    alternate_title: "Bhakti Instrumentals & Karaoke · Track 11",
    artist_version: "Kedar Pandit",
    audio_url:
      "/audio/albums/bhakti-instrumentals-kedar-pandit/11-jaise-radha-ne-mala-japi.mp3",
    cover_url: "/images/albums/bhakti-instrumentals-kedar-pandit-player.png",
    thumbnail_url: "/images/albums/bhakti-instrumentals-kedar-pandit.png",
    mini_cover_url: "/images/albums/bhakti-instrumentals-kedar-pandit.png",
    display_order: 115,
    category_slugs: [
      "krishna",
      "radha",
      "general",
      "satsang",
      "bhajan",
      "devotion",
      "hindi",
    ],
    meaning:
      "Instrumental / karaoke (Exotic India · Kedar Pandit). As Radha chanted the mala — lyrics below for singing along.",
    roman_lyrics: `## Chorus

Jaise Radha ne mala japi
Shyam naam ki
Waise hi main bhi japoon
Shyam naam ki

## Verses

Brindavan mein kunj galin
Shyam naam ki
Jaise Radha ne mala japi
Shyam naam ki`,
    translation: `## Chorus

As Radha chanted the mala
Of Shyam’s name
Just so may I also chant
Of Shyam’s name

## Verses

In the groves and lanes of Vrindavan
Of Shyam’s name
As Radha chanted the mala
Of Shyam’s name`,
  },
  "o-palanhare-kedar-pandit": {
    title: "O Palanhare",
    alternate_title: "Bhakti Instrumentals & Karaoke · Track 12",
    artist_version: "Kedar Pandit",
    audio_url:
      "/audio/albums/bhakti-instrumentals-kedar-pandit/12-o-palanhare.mp3",
    cover_url: "/images/albums/bhakti-instrumentals-kedar-pandit-player.png",
    thumbnail_url: "/images/albums/bhakti-instrumentals-kedar-pandit.png",
    mini_cover_url: "/images/albums/bhakti-instrumentals-kedar-pandit.png",
    display_order: 116,
    category_slugs: ["general", "satsang", "bhajan", "devotion", "hindi"],
    meaning:
      "Instrumental / karaoke (Exotic India · Kedar Pandit). O Nurturer — lyrics below for singing along.",
    roman_lyrics: `## Chorus

O palanhare, nirgun aur nyare
Tumse lage more nainaa, o palanhare

## Verses

Bina sahare kaise jiyun main
Tumse lage more nainaa
O palanhare, nirgun aur nyare
Tumse lage more nainaa, o palanhare`,
    translation: `## Chorus

O Nurturer, formless and unique
My eyes are fixed on You, O Nurturer

## Verses

How can I live without Your support
My eyes are fixed on You
O Nurturer, formless and unique
My eyes are fixed on You, O Nurturer`,
  },
  "rang-barse-chunelall-jharna": {
    title: "Rang Barse",
    alternate_title: "Sweet Phagwah Songs · Track 1",
    artist_version: "Pt. Chunelall Narine & Jharna Mukherjee",
    audio_url:
      "/audio/albums/sweet-phagwah-songs-and-chowtal/01-rang-barse.mp3",
    cover_url: "/images/albums/sweet-phagwah-songs-and-chowtal-player.png",
    thumbnail_url: "/images/albums/sweet-phagwah-songs-and-chowtal.png",
    mini_cover_url: "/images/albums/sweet-phagwah-songs-and-chowtal.png",
    display_order: 120,
    category_slugs: ["general", "holi", "bhajan", "devotion", "hindi"],
    meaning:
      "From Mohabeer Records MO-191 Sweet Phagwah Songs and Chowtal (1998). Phagwah colour song — Pt. Chunelall Narine & Jharna Mukherjee.",
    roman_lyrics: "[Album track]",
  },
  "holi-ayee-re-chunelall-jharna": {
    title: "Holi Ayee Re",
    alternate_title: "Sweet Phagwah Songs · Track 2",
    artist_version: "Pt. Chunelall Narine & Jharna Mukherjee",
    audio_url:
      "/audio/albums/sweet-phagwah-songs-and-chowtal/02-holi-ayee-re.mp3",
    cover_url: "/images/albums/sweet-phagwah-songs-and-chowtal-player.png",
    thumbnail_url: "/images/albums/sweet-phagwah-songs-and-chowtal.png",
    mini_cover_url: "/images/albums/sweet-phagwah-songs-and-chowtal.png",
    display_order: 121,
    category_slugs: ["general", "holi", "bhajan", "devotion", "hindi"],
    meaning:
      "From Mohabeer MO-191 (1998). Holi has come — Pt. Chunelall Narine & Jharna Mukherjee.",
    roman_lyrics: "[Album track]",
  },
  "aaj-na-chorange-chunelall-jharna": {
    title: "Aaj Na Chorange",
    alternate_title: "Aaj Na Chhodenge · Sweet Phagwah · Track 3",
    artist_version: "Pt. Chunelall Narine & Jharna Mukherjee",
    audio_url:
      "/audio/albums/sweet-phagwah-songs-and-chowtal/03-aaj-na-chorange.mp3",
    cover_url: "/images/albums/sweet-phagwah-songs-and-chowtal-player.png",
    thumbnail_url: "/images/albums/sweet-phagwah-songs-and-chowtal.png",
    mini_cover_url: "/images/albums/sweet-phagwah-songs-and-chowtal.png",
    display_order: 122,
    category_slugs: ["general", "holi", "bhajan", "devotion", "hindi"],
    meaning:
      "From Mohabeer MO-191 (1998). Classic Holi “won’t let go today” — Pt. Chunelall Narine & Jharna Mukherjee.",
    roman_lyrics: "[Album track]",
  },
  "holi-ke-din-chunelall-jharna": {
    title: "Holi Ke Din",
    alternate_title: "Sweet Phagwah Songs · Track 4",
    artist_version: "Pt. Chunelall Narine & Jharna Mukherjee",
    audio_url:
      "/audio/albums/sweet-phagwah-songs-and-chowtal/04-holi-ke-din.mp3",
    cover_url: "/images/albums/sweet-phagwah-songs-and-chowtal-player.png",
    thumbnail_url: "/images/albums/sweet-phagwah-songs-and-chowtal.png",
    mini_cover_url: "/images/albums/sweet-phagwah-songs-and-chowtal.png",
    display_order: 123,
    category_slugs: ["general", "holi", "bhajan", "devotion", "hindi"],
    meaning:
      "From Mohabeer MO-191 (1998). On the day of Holi — Pt. Chunelall Narine & Jharna Mukherjee.",
    roman_lyrics: "[Album track]",
  },
  "holi-re-holi-chunelall-jharna": {
    title: "Holi Re Holi",
    alternate_title: "Sweet Phagwah Songs · Track 5",
    artist_version: "Pt. Chunelall Narine & Jharna Mukherjee",
    audio_url:
      "/audio/albums/sweet-phagwah-songs-and-chowtal/05-holi-re-holi.mp3",
    cover_url: "/images/albums/sweet-phagwah-songs-and-chowtal-player.png",
    thumbnail_url: "/images/albums/sweet-phagwah-songs-and-chowtal.png",
    mini_cover_url: "/images/albums/sweet-phagwah-songs-and-chowtal.png",
    display_order: 124,
    category_slugs: ["general", "holi", "bhajan", "devotion", "hindi"],
    meaning:
      "From Mohabeer MO-191 (1998). Holi re Holi — Pt. Chunelall Narine & Jharna Mukherjee.",
    roman_lyrics: "[Album track]",
  },
  "mere-pehle-chunelall-jharna": {
    title: "Mere Pehle",
    alternate_title: "Sweet Phagwah Songs · Track 6",
    artist_version: "Pt. Chunelall Narine & Jharna Mukherjee",
    audio_url:
      "/audio/albums/sweet-phagwah-songs-and-chowtal/06-mere-pehle.mp3",
    cover_url: "/images/albums/sweet-phagwah-songs-and-chowtal-player.png",
    thumbnail_url: "/images/albums/sweet-phagwah-songs-and-chowtal.png",
    mini_cover_url: "/images/albums/sweet-phagwah-songs-and-chowtal.png",
    display_order: 125,
    category_slugs: ["general", "holi", "bhajan", "devotion", "hindi"],
    meaning:
      "From Mohabeer MO-191 (1998). Mere Pehle — Pt. Chunelall Narine & Jharna Mukherjee.",
    roman_lyrics: "[Album track]",
  },
  "rang-holi-ka-chunelall-jharna": {
    title: "Rang Holi Ka",
    alternate_title: "Sweet Phagwah Songs · Track 7",
    artist_version: "Pt. Chunelall Narine & Jharna Mukherjee",
    audio_url:
      "/audio/albums/sweet-phagwah-songs-and-chowtal/07-rang-holi-ka.mp3",
    cover_url: "/images/albums/sweet-phagwah-songs-and-chowtal-player.png",
    thumbnail_url: "/images/albums/sweet-phagwah-songs-and-chowtal.png",
    mini_cover_url: "/images/albums/sweet-phagwah-songs-and-chowtal.png",
    display_order: 126,
    category_slugs: ["general", "holi", "bhajan", "devotion", "hindi"],
    meaning:
      "From Mohabeer MO-191 (1998). The colour of Holi — Pt. Chunelall Narine & Jharna Mukherjee.",
    roman_lyrics: "[Album track]",
  },
  "rang-ah-basanti-chunelall-jharna": {
    title: "Rang Ah Basanti",
    alternate_title: "Sweet Phagwah Songs · Track 8",
    artist_version: "Pt. Chunelall Narine & Jharna Mukherjee",
    audio_url:
      "/audio/albums/sweet-phagwah-songs-and-chowtal/08-rang-ah-basanti.mp3",
    cover_url: "/images/albums/sweet-phagwah-songs-and-chowtal-player.png",
    thumbnail_url: "/images/albums/sweet-phagwah-songs-and-chowtal.png",
    mini_cover_url: "/images/albums/sweet-phagwah-songs-and-chowtal.png",
    display_order: 127,
    category_slugs: ["general", "holi", "bhajan", "devotion", "hindi"],
    meaning:
      "From Mohabeer MO-191 (1998). Basanti colour — Pt. Chunelall Narine & Jharna Mukherjee.",
    roman_lyrics: "[Album track]",
  },
  "holi-ka-nandall-chunelall-jharna": {
    title: "Holi Ka Nandall",
    alternate_title: "Holi Ka Nandalal · Sweet Phagwah · Track 9",
    artist_version: "Pt. Chunelall Narine & Jharna Mukherjee",
    audio_url:
      "/audio/albums/sweet-phagwah-songs-and-chowtal/09-holi-ka-nandall.mp3",
    cover_url: "/images/albums/sweet-phagwah-songs-and-chowtal-player.png",
    thumbnail_url: "/images/albums/sweet-phagwah-songs-and-chowtal.png",
    mini_cover_url: "/images/albums/sweet-phagwah-songs-and-chowtal.png",
    display_order: 128,
    category_slugs: [
      "krishna",
      "general",
      "holi",
      "bhajan",
      "devotion",
      "hindi",
    ],
    meaning:
      "From Mohabeer MO-191 (1998). Holi’s Nandalal — Pt. Chunelall Narine & Jharna Mukherjee.",
    roman_lyrics: "[Album track]",
  },
  "holi-kheai-raghu-chunelall-jharna": {
    title: "Holi Kheai Raghu",
    alternate_title: "Holi Khelai Raghu · Sweet Phagwah · Track 10",
    artist_version: "Pt. Chunelall Narine & Jharna Mukherjee",
    audio_url:
      "/audio/albums/sweet-phagwah-songs-and-chowtal/10-holi-kheai-raghu.mp3",
    cover_url: "/images/albums/sweet-phagwah-songs-and-chowtal-player.png",
    thumbnail_url: "/images/albums/sweet-phagwah-songs-and-chowtal.png",
    mini_cover_url: "/images/albums/sweet-phagwah-songs-and-chowtal.png",
    display_order: 129,
    category_slugs: [
      "ram",
      "general",
      "holi",
      "bhajan",
      "devotion",
      "hindi",
    ],
    meaning:
      "From Mohabeer MO-191 (1998). Raghu plays Holi — Pt. Chunelall Narine & Jharna Mukherjee.",
    roman_lyrics: "[Album track]",
  },
  "gokula-chowtal-mahatma-gandhi-satsang": {
    title: "Gokula Chowtal",
    alternate_title: "Gokula-Chowtal · Sweet Phagwah · Track 11",
    artist_version: "Mahatma Gandhi Satsang Society",
    audio_url:
      "/audio/albums/sweet-phagwah-songs-and-chowtal/11-gokula-chowtal.mp3",
    cover_url: "/images/albums/sweet-phagwah-songs-and-chowtal-player.png",
    thumbnail_url: "/images/albums/sweet-phagwah-songs-and-chowtal.png",
    mini_cover_url: "/images/albums/sweet-phagwah-songs-and-chowtal.png",
    display_order: 130,
    category_slugs: [
      "krishna",
      "general",
      "holi",
      "bhajan",
      "devotion",
      "hindi",
    ],
    meaning:
      "From Mohabeer MO-191 (1998). Chowtal by members of the Mahatma Gandhi Satsang Society (Queens). Disc title: Gokula-Chowtal — may match the published Gokula / Kanhaayi chowtal with ullāra.",
    roman_lyrics: "[Album track]",
  },
  "horee-khalay-mahatma-gandhi-satsang": {
    title: "Horee Khalay",
    alternate_title: "Holi Khelai · Sweet Phagwah · Track 12",
    artist_version: "Mahatma Gandhi Satsang Society",
    audio_url:
      "/audio/albums/sweet-phagwah-songs-and-chowtal/12-horee-khalay.mp3",
    cover_url: "/images/albums/sweet-phagwah-songs-and-chowtal-player.png",
    thumbnail_url: "/images/albums/sweet-phagwah-songs-and-chowtal.png",
    mini_cover_url: "/images/albums/sweet-phagwah-songs-and-chowtal.png",
    display_order: 131,
    category_slugs: ["general", "holi", "bhajan", "devotion", "hindi"],
    meaning:
      "From Mohabeer MO-191 (1998). Closing Holi / chowtal piece by members of the Mahatma Gandhi Satsang Society (Queens).",
    roman_lyrics: "[Album track]",
  },
  "aisi-laagi-lagan-kedar-pandit": {
    title: "Aisi Laagi Lagan",
    alternate_title: "Bhakti 3 Instrumentals & Karaoke · Track 1",
    artist_version: "Kedar Pandit",
    audio_url:
      "/audio/albums/bhakti-3-instrumentals-kedar-pandit/01-aisi-laagi-lagan.mp3",
    cover_url: "/images/albums/bhakti-3-instrumentals-kedar-pandit-player-v2.png",
    thumbnail_url: "/images/albums/bhakti-3-instrumentals-kedar-pandit.png",
    mini_cover_url: "/images/albums/bhakti-3-instrumentals-kedar-pandit.png",
    display_order: 217,
    category_slugs: ["general", "satsang", "bhajan", "devotion", "hindi"],
    meaning:
      "Instrumental / karaoke (Exotic India · Bhakti 3 · Kedar Pandit). Such devotion / lagan — lyrics not filled in yet; play to sing along.",
    roman_lyrics: "[Album track]",
  },
  "badi-der-bhai-nandlala-kedar-pandit": {
    title: "Badi Der Bhai Nandlala",
    alternate_title: "Bhakti 3 Instrumentals & Karaoke · Track 2",
    artist_version: "Kedar Pandit",
    audio_url:
      "/audio/albums/bhakti-3-instrumentals-kedar-pandit/02-badi-der-bhai-nandlala.mp3",
    cover_url: "/images/albums/bhakti-3-instrumentals-kedar-pandit-player-v2.png",
    thumbnail_url: "/images/albums/bhakti-3-instrumentals-kedar-pandit.png",
    mini_cover_url: "/images/albums/bhakti-3-instrumentals-kedar-pandit.png",
    display_order: 218,
    category_slugs: ["krishna", "general", "satsang", "bhajan", "devotion", "hindi"],
    meaning:
      "Instrumental / karaoke (Exotic India · Bhakti 3 · Kedar Pandit). Nandlala, you are late — lyrics not filled in yet; play to sing along.",
    roman_lyrics: "[Album track]",
  },
  "ek-tu-hi-bharosa-kedar-pandit": {
    title: "Ek Tu Hi Bharosa",
    alternate_title: "Bhakti 3 Instrumentals & Karaoke · Track 3",
    artist_version: "Kedar Pandit",
    audio_url:
      "/audio/albums/bhakti-3-instrumentals-kedar-pandit/03-ek-tu-hi-bharosa.mp3",
    cover_url: "/images/albums/bhakti-3-instrumentals-kedar-pandit-player-v2.png",
    thumbnail_url: "/images/albums/bhakti-3-instrumentals-kedar-pandit.png",
    mini_cover_url: "/images/albums/bhakti-3-instrumentals-kedar-pandit.png",
    display_order: 219,
    category_slugs: ["general", "satsang", "bhajan", "devotion", "hindi"],
    meaning:
      "Instrumental / karaoke (Exotic India · Bhakti 3 · Kedar Pandit). You alone are my trust — lyrics not filled in yet; play to sing along.",
    roman_lyrics: "[Album track]",
  },
  "darshan-do-ghanshyam-kedar-pandit": {
    title: "Darshan Do Ghanshyam",
    alternate_title: "Bhakti 3 Instrumentals & Karaoke · Track 4",
    artist_version: "Kedar Pandit",
    audio_url:
      "/audio/albums/bhakti-3-instrumentals-kedar-pandit/04-darshan-do-ghanshyam.mp3",
    cover_url: "/images/albums/bhakti-3-instrumentals-kedar-pandit-player-v2.png",
    thumbnail_url: "/images/albums/bhakti-3-instrumentals-kedar-pandit.png",
    mini_cover_url: "/images/albums/bhakti-3-instrumentals-kedar-pandit.png",
    display_order: 220,
    category_slugs: ["krishna", "general", "satsang", "bhajan", "devotion", "hindi"],
    meaning:
      "Instrumental / karaoke (Exotic India · Bhakti 3 · Kedar Pandit). Grant darshan, Ghanshyam — lyrics not filled in yet; play to sing along.",
    roman_lyrics: "[Album track]",
  },
  "hey-ram-hey-ram-kedar-pandit": {
    title: "Hey Ram Hey Ram",
    alternate_title: "Bhakti 3 Instrumentals & Karaoke · Track 5",
    artist_version: "Kedar Pandit",
    audio_url:
      "/audio/albums/bhakti-3-instrumentals-kedar-pandit/05-hey-ram-hey-ram.mp3",
    cover_url: "/images/albums/bhakti-3-instrumentals-kedar-pandit-player-v2.png",
    thumbnail_url: "/images/albums/bhakti-3-instrumentals-kedar-pandit.png",
    mini_cover_url: "/images/albums/bhakti-3-instrumentals-kedar-pandit.png",
    display_order: 221,
    category_slugs: ["ram", "general", "satsang", "bhajan", "devotion", "hindi"],
    meaning:
      "Instrumental / karaoke (Exotic India · Bhakti 3 · Kedar Pandit). Hey Ram — lyrics not filled in yet; play to sing along.",
    roman_lyrics: "[Album track]",
  },
  "jago-mohan-pyare-kedar-pandit": {
    title: "Jago Mohan Pyare",
    alternate_title: "Bhakti 3 Instrumentals & Karaoke · Track 6",
    artist_version: "Kedar Pandit",
    audio_url:
      "/audio/albums/bhakti-3-instrumentals-kedar-pandit/06-jago-mohan-pyare.mp3",
    cover_url: "/images/albums/bhakti-3-instrumentals-kedar-pandit-player-v2.png",
    thumbnail_url: "/images/albums/bhakti-3-instrumentals-kedar-pandit.png",
    mini_cover_url: "/images/albums/bhakti-3-instrumentals-kedar-pandit.png",
    display_order: 222,
    category_slugs: ["krishna", "general", "satsang", "bhajan", "devotion", "hindi"],
    meaning:
      "Instrumental / karaoke (Exotic India · Bhakti 3 · Kedar Pandit). Wake, beloved Mohan — lyrics not filled in yet; play to sing along.",
    roman_lyrics: "[Album track]",
  },
  "main-to-aarti-utaroon-kedar-pandit": {
    title: "Main To Aarti Utaroon",
    alternate_title: "Bhakti 3 Instrumentals & Karaoke · Track 7",
    artist_version: "Kedar Pandit",
    audio_url:
      "/audio/albums/bhakti-3-instrumentals-kedar-pandit/07-main-to-aarti-utaroon.mp3",
    cover_url: "/images/albums/bhakti-3-instrumentals-kedar-pandit-player-v2.png",
    thumbnail_url: "/images/albums/bhakti-3-instrumentals-kedar-pandit.png",
    mini_cover_url: "/images/albums/bhakti-3-instrumentals-kedar-pandit.png",
    display_order: 223,
    category_slugs: ["general", "satsang", "bhajan", "devotion", "hindi", "aarti"],
    meaning:
      "Instrumental / karaoke (Exotic India · Bhakti 3 · Kedar Pandit). I offer aarti — lyrics not filled in yet; play to sing along.",
    roman_lyrics: "[Album track]",
  },
  "o-duniya-ke-rakhwale-kedar-pandit": {
    title: "O Duniya Ke Rakhwale",
    alternate_title: "Bhakti 3 Instrumentals & Karaoke · Track 8",
    artist_version: "Kedar Pandit",
    audio_url:
      "/audio/albums/bhakti-3-instrumentals-kedar-pandit/08-o-duniya-ke-rakhwale.mp3",
    cover_url: "/images/albums/bhakti-3-instrumentals-kedar-pandit-player-v2.png",
    thumbnail_url: "/images/albums/bhakti-3-instrumentals-kedar-pandit.png",
    mini_cover_url: "/images/albums/bhakti-3-instrumentals-kedar-pandit.png",
    display_order: 224,
    category_slugs: ["general", "satsang", "bhajan", "devotion", "hindi"],
    meaning:
      "Instrumental / karaoke (Exotic India · Bhakti 3 · Kedar Pandit). Protector of the world — lyrics not filled in yet; play to sing along.",
    roman_lyrics: "[Album track]",
  },
  "teri-hai-zameen-tera-aasman-kedar-pandit": {
    title: "Teri Hai Zameen Tera Aasman",
    alternate_title: "Bhakti 3 Instrumentals & Karaoke · Track 9",
    artist_version: "Kedar Pandit",
    audio_url:
      "/audio/albums/bhakti-3-instrumentals-kedar-pandit/09-teri-hai-zameen-tera-aasman.mp3",
    cover_url: "/images/albums/bhakti-3-instrumentals-kedar-pandit-player-v2.png",
    thumbnail_url: "/images/albums/bhakti-3-instrumentals-kedar-pandit.png",
    mini_cover_url: "/images/albums/bhakti-3-instrumentals-kedar-pandit.png",
    display_order: 225,
    category_slugs: ["general", "satsang", "bhajan", "devotion", "hindi"],
    meaning:
      "Instrumental / karaoke (Exotic India · Bhakti 3 · Kedar Pandit). Yours is the earth and sky — lyrics not filled in yet; play to sing along.",
    roman_lyrics: "[Album track]",
  },
  "brindaban-ka-krishna-kanhaiya-kedar-pandit": {
    title: "Brindaban Ka Krishna Kanhaiya",
    alternate_title: "Bhakti 3 Instrumentals & Karaoke · Track 10",
    artist_version: "Kedar Pandit",
    audio_url:
      "/audio/albums/bhakti-3-instrumentals-kedar-pandit/10-brindaban-ka-krishna-kanhaiya.mp3",
    cover_url: "/images/albums/bhakti-3-instrumentals-kedar-pandit-player-v2.png",
    thumbnail_url: "/images/albums/bhakti-3-instrumentals-kedar-pandit.png",
    mini_cover_url: "/images/albums/bhakti-3-instrumentals-kedar-pandit.png",
    display_order: 226,
    category_slugs: ["krishna", "general", "satsang", "bhajan", "devotion", "hindi"],
    meaning:
      "Instrumental / karaoke (Exotic India · Bhakti 3 · Kedar Pandit). Krishna of Vrindavan — lyrics not filled in yet; play to sing along.",
    roman_lyrics: "[Album track]",
  },
  "yashoda-ka-nandlala-kedar-pandit": {
    title: "Yashoda Ka Nandlala",
    alternate_title: "Bhakti 3 Instrumentals & Karaoke · Track 11",
    artist_version: "Kedar Pandit",
    audio_url:
      "/audio/albums/bhakti-3-instrumentals-kedar-pandit/11-yashoda-ka-nandlala.mp3",
    cover_url: "/images/albums/bhakti-3-instrumentals-kedar-pandit-player-v2.png",
    thumbnail_url: "/images/albums/bhakti-3-instrumentals-kedar-pandit.png",
    mini_cover_url: "/images/albums/bhakti-3-instrumentals-kedar-pandit.png",
    display_order: 227,
    category_slugs: ["krishna", "general", "satsang", "bhajan", "devotion", "hindi"],
    meaning:
      "Instrumental / karaoke (Exotic India · Bhakti 3 · Kedar Pandit). Yashoda’s Nandlala — lyrics not filled in yet; play to sing along.",
    roman_lyrics: "[Album track]",
  },
  "chalo-bulawa-aaya-hai-kedar-pandit": {
    title: "Chalo Bulawa Aaya Hai",
    alternate_title: "Bhakti 3 Instrumentals & Karaoke · Track 12",
    artist_version: "Kedar Pandit",
    audio_url:
      "/audio/albums/bhakti-3-instrumentals-kedar-pandit/12-chalo-bulawa-aaya-hai.mp3",
    cover_url: "/images/albums/bhakti-3-instrumentals-kedar-pandit-player-v2.png",
    thumbnail_url: "/images/albums/bhakti-3-instrumentals-kedar-pandit.png",
    mini_cover_url: "/images/albums/bhakti-3-instrumentals-kedar-pandit.png",
    display_order: 228,
    category_slugs: ["general", "satsang", "bhajan", "devotion", "hindi"],
    meaning:
      "Instrumental / karaoke (Exotic India · Bhakti 3 · Kedar Pandit). The call has come — lyrics not filled in yet; play to sing along.",
    roman_lyrics: "[Album track]",
  },
  "invocational-prayer-pandit-lal-singh": {
    title: "Invocational Prayer",
    alternate_title: "Jai Shri Krishna · Track 1",
    artist_version: "Pandit Lal Singh",
    audio_url:
      "/audio/albums/jai-shri-krishna-pandit-lal-singh/01-invocational-prayer.mp3",
    cover_url: "/images/albums/jai-shri-krishna-pandit-lal-singh-player.png",
    thumbnail_url: "/images/albums/jai-shri-krishna-pandit-lal-singh.png",
    mini_cover_url: "/images/albums/jai-shri-krishna-pandit-lal-singh.png",
    display_order: 229,
    category_slugs: ["krishna", "general", "satsang", "bhajan", "devotion", "hindi"],
    meaning:
      "From Jai Shri Krishna (Pandit Lal Singh) — opening invocational prayer. Lyrics not transcribed yet.",
    roman_lyrics: "[Album track]",
  },
  "krishna-jinka-pandit-lal-singh": {
    title: "Krishna Jinka",
    alternate_title: "Jai Shri Krishna · Track 2",
    artist_version: "Pandit Lal Singh",
    audio_url:
      "/audio/albums/jai-shri-krishna-pandit-lal-singh/02-krishna-jinka.mp3",
    cover_url: "/images/albums/jai-shri-krishna-pandit-lal-singh-player.png",
    thumbnail_url: "/images/albums/jai-shri-krishna-pandit-lal-singh.png",
    mini_cover_url: "/images/albums/jai-shri-krishna-pandit-lal-singh.png",
    display_order: 230,
    category_slugs: ["krishna", "general", "satsang", "bhajan", "devotion", "hindi"],
    meaning:
      "From Jai Shri Krishna (Pandit Lal Singh). Lyrics not transcribed yet.",
    roman_lyrics: "[Album track]",
  },
  "krishna-kripalu-pandit-lal-singh": {
    title: "Krishna Kripalu",
    alternate_title: "Ho Krishna Kripalu · Deen Bandhu Dayal · Jai Shri Krishna · Track 3",
    artist_version: "Pandit Lal Singh",
    audio_url:
      "/audio/albums/jai-shri-krishna-pandit-lal-singh/03-krishna-kripalu.mp3",
    cover_url: "/images/albums/jai-shri-krishna-pandit-lal-singh-player.png",
    thumbnail_url: "/images/albums/jai-shri-krishna-pandit-lal-singh.png",
    mini_cover_url: "/images/albums/jai-shri-krishna-pandit-lal-singh.png",
    display_order: 231,
    category_slugs: ["krishna", "radha", "general", "satsang", "bhajan", "devotion", "hindi"],
    meaning:
      "Praise of Krishna as Kripalu — ocean of grace, Keshava, friend of the poor and merciful. Names Damodar, Banwari, Mohan, Gopinath, Gopal, Radha Raman, Murlidhar, Giridhar, Nandlal; Chiti Swami will appear now in Kali as the child.",
    roman_lyrics: `## Chorus

Ho Krishna Kripalu, Krishna Kripalu
Kripa Nidhi Keshava, Deen Bandhu Dayal

Krishna Kripalu Kripa Nidhi Keshava, Deen Bandhu Dayal

Deen Bandhu Dayal, Nidhi Keshava
Deen Bandhu Dayal, Nidhi Keshava
Deen Bandhu Dayal, Ho Deen Bandhu Dayal

Krishna Kripalu, Krishna Kripalu
Kripa Nidhi Keshava, Deen Bandhu Dayal

## Verse 1

Damodar Banwari Mohan, Gopinath Gopal
Damodar Banwari Mohan, Gopinath Gopal

Radha Raman Bihari Natwar
Radha Raman Bihari Natwar
Sundar Jasomati Bal, Ho Deen Bandhu Dayal

## Chorus

Krishna Kripalu, Krishna Kripalu
Kripa Nidhi Keshava, Deen Bandhu Dayal

## Verse 2

Murlidhar Girdhara Manhari, Suchakari Nandlal
Gocharan Govinda Gopati, Bhaawana Manchulagwaal

Chiti Swami Soi Ab Pragatenge
Chiti Swami Soi Ab Pragatenge
Koli Me Baalavalaa, Ho Deen Bandhu Dayal

## Chorus

Krishna Kripalu, Krishna Kripalu
Kripa Nidhi Keshava, Deen Bandhu Dayal

Krishna Kripalu, Krishna Kripalu
Kripa Nidhi Keshava, Deen Bandhu Dayal

Deen Bandhu Dayal
Deen Bandhu Dayal
Deen Bandhu Dayal`,
    translation: `## Chorus

O Krishna, ocean of grace — Krishna, ocean of grace
Treasure of mercy, Keshava — friend of the poor, the merciful

Krishna, ocean of grace, treasure of mercy, Keshava — friend of the poor, the merciful

Friend of the poor, the merciful — treasure, Keshava
Friend of the poor, the merciful — treasure, Keshava
Friend of the poor, the merciful — O friend of the poor, the merciful

Krishna, ocean of grace — Krishna, ocean of grace
Treasure of mercy, Keshava — friend of the poor, the merciful

## Verse 1

Damodar, Banwari, Mohan, Gopinath, Gopal
Damodar, Banwari, Mohan, Gopinath, Gopal

Radha’s beloved, Bihari, Natwar
Radha’s beloved, Bihari, Natwar
Beautiful child of Yashoda — O friend of the poor, the merciful

## Chorus

Krishna, ocean of grace — Krishna, ocean of grace
Treasure of mercy, Keshava — friend of the poor, the merciful

## Verse 2

Flute-bearer, Giridhar, captivator of the mind — joy-giver Nandlal
Cowherd Govinda, lord of the gopis — charming herdsman of the heart

That same Chiti Swami will appear now
That same Chiti Swami will appear now
As the child in Kali Yuga — O friend of the poor, the merciful

## Chorus

Krishna, ocean of grace — Krishna, ocean of grace
Treasure of mercy, Keshava — friend of the poor, the merciful

Krishna, ocean of grace — Krishna, ocean of grace
Treasure of mercy, Keshava — friend of the poor, the merciful

Friend of the poor, the merciful
Friend of the poor, the merciful
Friend of the poor, the merciful`,
  },
  "kanha-kanhaiya-ray-pandit-lal-singh": {
    title: "Kanha Kanhaiya Ray",
    alternate_title: "Jai Shri Krishna · Track 4",
    artist_version: "Pandit Lal Singh",
    audio_url:
      "/audio/albums/jai-shri-krishna-pandit-lal-singh/04-kanha-kanhaiya-ray.mp3",
    cover_url: "/images/albums/jai-shri-krishna-pandit-lal-singh-player.png",
    thumbnail_url: "/images/albums/jai-shri-krishna-pandit-lal-singh.png",
    mini_cover_url: "/images/albums/jai-shri-krishna-pandit-lal-singh.png",
    display_order: 232,
    category_slugs: ["krishna", "general", "satsang", "bhajan", "devotion", "hindi"],
    meaning:
      "From Jai Shri Krishna (Pandit Lal Singh). Lyrics not transcribed yet.",
    roman_lyrics: "[Album track]",
  },
  "om-namo-shree-pandit-lal-singh": {
    title: "Om Namo Shree",
    alternate_title: "Jai Shri Krishna · Track 5",
    artist_version: "Pandit Lal Singh",
    audio_url:
      "/audio/albums/jai-shri-krishna-pandit-lal-singh/05-om-namo-shree.mp3",
    cover_url: "/images/albums/jai-shri-krishna-pandit-lal-singh-player.png",
    thumbnail_url: "/images/albums/jai-shri-krishna-pandit-lal-singh.png",
    mini_cover_url: "/images/albums/jai-shri-krishna-pandit-lal-singh.png",
    display_order: 233,
    category_slugs: ["krishna", "general", "satsang", "bhajan", "devotion", "hindi"],
    meaning:
      "From Jai Shri Krishna (Pandit Lal Singh). Lyrics not transcribed yet.",
    roman_lyrics: "[Album track]",
  },
  "jai-govinda-gopala-pandit-lal-singh": {
    title: "Jai Govinda Gopala",
    alternate_title: "Jai Shri Krishna · Track 6",
    artist_version: "Pandit Lal Singh",
    audio_url:
      "/audio/albums/jai-shri-krishna-pandit-lal-singh/06-jai-govinda-gopala.mp3",
    cover_url: "/images/albums/jai-shri-krishna-pandit-lal-singh-player.png",
    thumbnail_url: "/images/albums/jai-shri-krishna-pandit-lal-singh.png",
    mini_cover_url: "/images/albums/jai-shri-krishna-pandit-lal-singh.png",
    display_order: 234,
    category_slugs: ["krishna", "general", "satsang", "bhajan", "devotion", "hindi"],
    meaning:
      "From Jai Shri Krishna (Pandit Lal Singh). Lyrics not transcribed yet.",
    roman_lyrics: "[Album track]",
  },
  "mohan-hamaare-madhuban-pandit-lal-singh": {
    title: "Mohan Hamaare Madhuban",
    alternate_title: "Jai Shri Krishna · Track 7",
    artist_version: "Pandit Lal Singh",
    audio_url:
      "/audio/albums/jai-shri-krishna-pandit-lal-singh/07-mohan-hamaare-madhuban.mp3",
    cover_url: "/images/albums/jai-shri-krishna-pandit-lal-singh-player.png",
    thumbnail_url: "/images/albums/jai-shri-krishna-pandit-lal-singh.png",
    mini_cover_url: "/images/albums/jai-shri-krishna-pandit-lal-singh.png",
    display_order: 235,
    category_slugs: ["krishna", "general", "satsang", "bhajan", "devotion", "hindi"],
    meaning:
      "From Jai Shri Krishna (Pandit Lal Singh). Lyrics not transcribed yet.",
    roman_lyrics: "[Album track]",
  },
  "chalo-re-man-ganga-pandit-lal-singh": {
    title: "Chalo Re Man Ganga",
    alternate_title: "Jai Shri Krishna · Track 8",
    artist_version: "Pandit Lal Singh",
    audio_url:
      "/audio/albums/jai-shri-krishna-pandit-lal-singh/08-chalo-re-man-ganga.mp3",
    cover_url: "/images/albums/jai-shri-krishna-pandit-lal-singh-player.png",
    thumbnail_url: "/images/albums/jai-shri-krishna-pandit-lal-singh.png",
    mini_cover_url: "/images/albums/jai-shri-krishna-pandit-lal-singh.png",
    display_order: 236,
    category_slugs: ["krishna", "general", "satsang", "bhajan", "devotion", "hindi"],
    meaning:
      "From Jai Shri Krishna (Pandit Lal Singh). Lyrics not transcribed yet.",
    roman_lyrics: "[Album track]",
  },
  "baat-nihare-ghanshyam-pandit-lal-singh": {
    title: "Baat Nihare Ghanshyam",
    alternate_title: "Jai Shri Krishna · Track 9",
    artist_version: "Pandit Lal Singh",
    audio_url:
      "/audio/albums/jai-shri-krishna-pandit-lal-singh/09-baat-nihare-ghanshyam.mp3",
    cover_url: "/images/albums/jai-shri-krishna-pandit-lal-singh-player.png",
    thumbnail_url: "/images/albums/jai-shri-krishna-pandit-lal-singh.png",
    mini_cover_url: "/images/albums/jai-shri-krishna-pandit-lal-singh.png",
    display_order: 237,
    category_slugs: ["krishna", "general", "satsang", "bhajan", "devotion", "hindi"],
    meaning:
      "From Jai Shri Krishna (Pandit Lal Singh). Lyrics not transcribed yet.",
    roman_lyrics: "[Album track]",
  },
  "kanha-kanhaiya-mandala-pandit-lal-singh": {
    title: "Kanha Kanhaiya Mandala",
    alternate_title: "Jai Shri Krishna · Track 10",
    artist_version: "Pandit Lal Singh",
    audio_url:
      "/audio/albums/jai-shri-krishna-pandit-lal-singh/10-kanha-kanhaiya-mandala.mp3",
    cover_url: "/images/albums/jai-shri-krishna-pandit-lal-singh-player.png",
    thumbnail_url: "/images/albums/jai-shri-krishna-pandit-lal-singh.png",
    mini_cover_url: "/images/albums/jai-shri-krishna-pandit-lal-singh.png",
    display_order: 238,
    category_slugs: ["krishna", "general", "satsang", "bhajan", "devotion", "hindi"],
    meaning:
      "From Jai Shri Krishna (Pandit Lal Singh). Lyrics not transcribed yet.",
    roman_lyrics: "[Album track]",
  },
  "duniya-ke-sau-roop-pandit-lal-singh": {
    title: "Duniya Ke Sau Roop",
    alternate_title: "Jai Shri Krishna · Track 11",
    artist_version: "Pandit Lal Singh",
    audio_url:
      "/audio/albums/jai-shri-krishna-pandit-lal-singh/11-duniya-ke-sau-roop.mp3",
    cover_url: "/images/albums/jai-shri-krishna-pandit-lal-singh-player.png",
    thumbnail_url: "/images/albums/jai-shri-krishna-pandit-lal-singh.png",
    mini_cover_url: "/images/albums/jai-shri-krishna-pandit-lal-singh.png",
    display_order: 239,
    category_slugs: ["krishna", "general", "satsang", "bhajan", "devotion", "hindi"],
    meaning:
      "From Jai Shri Krishna (Pandit Lal Singh). Lyrics not transcribed yet.",
    roman_lyrics: "[Album track]",
  },
  "track-12-pandit-lal-singh": {
    title: "Track 12",
    alternate_title: "Jai Shri Krishna · Track 12 (title not on cover)",
    artist_version: "Pandit Lal Singh",
    audio_url:
      "/audio/albums/jai-shri-krishna-pandit-lal-singh/12-track-12.mp3",
    cover_url: "/images/albums/jai-shri-krishna-pandit-lal-singh-player.png",
    thumbnail_url: "/images/albums/jai-shri-krishna-pandit-lal-singh.png",
    mini_cover_url: "/images/albums/jai-shri-krishna-pandit-lal-singh.png",
    display_order: 240,
    category_slugs: ["krishna", "general", "satsang", "bhajan", "devotion", "hindi"],
    meaning:
      "From Jai Shri Krishna (Pandit Lal Singh) — twelfth track on this copy; title not printed on the CD cover. Lyrics not transcribed yet.",
    roman_lyrics: "[Album track]",
  },
  "dasrathji-ayee-lay-dropati": {
    title: "Dasrathji Ayee Lay",
    alternate_title: "Let's Sing & Dance with Dropati · Track 4",
    artist_version: "Dropati",
    audio_url:
      "/audio/chutney/lets-sing-and-dance-with-dropati/04-dasrathji-ayee-lay.mp3",
    cover_url: "/images/albums/lets-sing-and-dance-with-dropati-player.png",
    thumbnail_url: "/images/albums/lets-sing-and-dance-with-dropati.png",
    mini_cover_url: "/images/albums/lets-sing-and-dance-with-dropati.png",
    display_order: 242,
    category_slugs: ["ram", "general", "bhajan", "hindi"],
    meaning: "From Let's Sing & Dance with Dropati. Lyrics under Traditional Chutney.",
    roman_lyrics: "[Album track]",
  },
  "kay-dhanwa-tora-dropati": {
    title: "Kay Dhanwa Tora",
    alternate_title: "Let's Sing & Dance with Dropati · Track 5",
    artist_version: "Dropati",
    audio_url:
      "/audio/chutney/lets-sing-and-dance-with-dropati/05-kay-dhanwa-tora.mp3",
    cover_url: "/images/albums/lets-sing-and-dance-with-dropati-player.png",
    thumbnail_url: "/images/albums/lets-sing-and-dance-with-dropati.png",
    mini_cover_url: "/images/albums/lets-sing-and-dance-with-dropati.png",
    display_order: 243,
    category_slugs: ["general", "bhajan", "hindi"],
    meaning:
      "Dropati (Let's Sing & Dance with Dropati, Track 5) — Sita Swayamvar folk song: Lord Parshuram arrives in anger demanding to know who broke Shiva's bow, while King Janak seeks to give Sita's hand in marriage.",
    roman_lyrics: `## Intro & Refrain (Āṛāūī)

Ke ye dhanavā tūre Janak tora dvār par bhīr bhae bhārī
Ke ye dhanavā tūrā Janak tere dvār par bhīr bhae bhārī

Bhīr bhae bhārī, dekho, bhīr bhae bhārī
Vīr bhaiye bhārī, ho, bhīr bhae bhārī
Ke ye dhanavā tūre Janak tere dvār par bhīr bhae bhārī

## Verse 1

Ai! He Parsurāma pharsā laike āye, he Parsurāma pharsā laike āye (2)
Sab bīch lallakāre Janak tere dvār par vīr bhaiye bhārī

Bhīr bhae bhārī, dekho, bhīr bhae bhārī
Vīr bhaiye bhārī, ho, bhīr bhae bhārī
Ke ye dhanavā tūre Janak tere dvār par bhīr bhae bhārī

## Verse 2

Ai! More ghar bātin, dekho, Sītā ku'vārī, more ghar bātī, nā, Sītā ku'vārī (2)
Ham deve kanyādān Janak tere dvār par bhīr bhae bhārī

Bhīr bhae bhārī, dekho, bhīr bhae bhārī
Vīr bhaiye bhārī, ho, bhīr bhae bhārī
Ke ye dhanavā tūre Janak tere dvār par bhīr bhae bhārī

## Verse 3

Ai! Koī girāve, Rājā Janak ke, koī ghar āve, dekho, Rājā Janak ke (2)
Koī Rām mahātārī Janak tere dvār par vīr bhaiye bhārī

Bhīr bhae bhārī, dekho, bhīr bhae bhārī
Vīr bhaiye bhārī, ho, bhīr bhae bhārī
Ke ye dhanavā tūre Janak tere dvār par bhīr bhae bhārī

## Verse 4 (Relā, slow)

Ke ye dhanavā tūre Janak tere dvār par vīr bhaiye bhārī
Ke ye dhanavā tūre Janak tere dvār par vīr bhaiye bhārī`,
    translation: `## Intro & Refrain (Āṛāūī)

O King Janak, who in this crowded assembly broke the bow?
O King Janak, who in this crowded assembly broke the bow?

A mighty crowd has gathered, look — a great crowd has gathered!
Mighty warriors have assembled in this vast gathering
O King Janak, who in this crowded assembly broke the bow of Lord Shiva?

## Verse 1

Lord Parshuram arrived wielding his axe, indeed he arrived with his axe (2)
Challenging everyone in the midst of the assembly before King Janak’s royal court

(Refrain)
A mighty crowd has gathered, look — a great crowd has gathered!
Mighty warriors have assembled in this vast gathering
O King Janak, who in this crowded assembly broke the bow of Lord Shiva?

## Verse 2

(Janak says:) "In my household, Princess Sita is still an unmarried maiden (2)
I wish to give away my daughter's hand in marriage before this crowded assembly."

(Refrain)
A mighty crowd has gathered, look — a great crowd has gathered!
Mighty warriors have assembled in this vast gathering
O King Janak, who in this crowded assembly broke the bow of Lord Shiva?

## Verse 3

Someone has insulted King Janak; someone challenged him in his own court (2)
And someone from this crowded assembly even insulted the noble mother of Shri Ram

(Refrain)
A mighty crowd has gathered, look — a great crowd has gathered!
Mighty warriors have assembled in this vast gathering
O King Janak, who in this crowded assembly broke the bow of Lord Shiva?

## Verse 4 (Relā, slow)

O King Janak, who in this crowded assembly had the daring strength to break the bow?
O King Janak, who in this crowded assembly broke the bow?`,
  },
  "kahay-raja-ramchandra-dropati": {
    title: "Kahay Raja Ramchandra",
    alternate_title: "Let's Sing & Dance with Dropati · Track 6",
    artist_version: "Dropati",
    audio_url:
      "/audio/chutney/lets-sing-and-dance-with-dropati/06-kahay-raja-ramchandra.mp3",
    cover_url: "/images/albums/lets-sing-and-dance-with-dropati-player.png",
    thumbnail_url: "/images/albums/lets-sing-and-dance-with-dropati.png",
    mini_cover_url: "/images/albums/lets-sing-and-dance-with-dropati.png",
    display_order: 244,
    category_slugs: ["ram", "general", "bhajan", "hindi"],
    meaning:
      "Dropati (Let's Sing & Dance with Dropati, Track 6) — Traditional vivah / bidai folk song: King Ramchandra addresses Janak-ji as beloved Sita is prepared in a palanquin for the journey to Awadh.",
    roman_lyrics: `## Verses

Kahe raja Ramchandra suno ho Janak ji, aaj jaadu karleyo dulari se
Dholiya banaike awadh le jaiyo, ham kaise jiyabe bechaari ke

Ke hamre Ram ji ke pujan karibe, ke hamre phoolwa lorrhe phulwaari se
Ke hamre girja ke pujan karibe, ke hamre chauta poore chauraari se`,
    translation: `## Verses

King Ramchandra says, "Listen, O Janak-ji — today magic has been woven by your beloved daughter!"
Placing her in a palanquin you carry her off to Awadh; how shall we live without our dear girl?

Who will now perform the sacred worship of our Shri Ram, who will gather flowers from the garden?
Who will perform the worship of Mother Girija (Gauri), who will draw the sacred courtyard patterns at the shrine?`,
  },
  "sonay-kay-kharaun-dropati": {
    title: "Sonay Kay Kharaun",
    alternate_title: "Let's Sing & Dance with Dropati · Track 7",
    artist_version: "Dropati",
    audio_url:
      "/audio/chutney/lets-sing-and-dance-with-dropati/07-sonay-kay-kharaun.mp3",
    cover_url: "/images/albums/lets-sing-and-dance-with-dropati-player.png",
    thumbnail_url: "/images/albums/lets-sing-and-dance-with-dropati.png",
    mini_cover_url: "/images/albums/lets-sing-and-dance-with-dropati.png",
    display_order: 245,
    category_slugs: ["general", "bhajan", "hindi"],
    meaning:
      "Dropati (Let's Sing & Dance with Dropati) — Prince Ram asks his mother how he should look after Sita in the forest, keeping her meals and comfort close to the heart.",
    roman_lyrics: `## Refrain (Āṛāūī)

Sone ke kherauvā rājā Rāmchandra maiyyā se, araja kar maiyyā se, araja kar ho
Maiyyā ham to jāye madhu ban ke Sītal kaise rakhi’ hāu ho (2)

## Verse 1

Bhalā khārā chiravrī Sītā bhojan hridayā bīche rakh de, hridayā bīche rakh vahī ho
Uthayamne ne khūvanā ko daive Sītal nāhā vahī vahī ho (2)

## Verse 2

Bhalā Rāma rasoīyā hai Sītā to auro, Sītal rānī auro, Sītal rānī ho
Sītā jagare giruvā mukh dhove to Rām ke gohanā lāge ho (2)

## Verse 3

Arre lauta āo vo Prabhu lauta āo lauta ghar, lauta āo lautha ghar, chālāu ho
Prabhu mar jae ke bhuktiyā piyasiyā\` dupena ko milāy hāu ho (2)

## Verse 4

Bhalā suīkār ye rājā vahī din javan din, gavan lāī javan din, gavan lāī ho
Rājā phūle ke sejiyā bichāyā, hridayā bīche, rākh dehu ho (2)

## Verse 5 (Slow)

Prabhu phūle ke sejiyā re bichāyā, hridayā bīche, rakh dehu re
Prabhu phūle ke sejiyā re bichhāyā, hridayā bīche, rakh de`,
    translation: `## Refrain (Āṛāūī)

Wearing gold ornaments Prince Ram asks his mother, he requested of his mother
"Mother, I am going to the sweet jungle, how should I take care of Sita?" (2)

## Verse 1

Keep Princess Sita’s tasty meal close to your heart, close within your heart
Dig a pond (well) so that princess Sita can have a fresh, cool bath daily (2)

## Verse 2

In the kitchen of Prince Ram, Princess Sita will be much more agreeable and pleasant
Sita teases Ram and embraces him after washing her saffron-colored face (2)

## Verse 3

"O Lord, please return home, come back home!"
Please quench our thirst and hunger for a vision of You, O Lord (2)

## Verse 4

King Ram remembered his vow on the day he married Sita in their youth
I will lay flowers to adorn the Lord's path, from the heart with love (2)

## Verse 5 (Slow)

I will lay flowers to adorn the Lord's path, from the heart with love
O Lord, I have spread a bed of flowers, keep it close to Your heart`,
  },
  "karlo-nar-bahjan-dropati": {
    title: "Karlo Nar Bahjan",
    alternate_title: "Let's Sing & Dance with Dropati · Track 8",
    artist_version: "Dropati",
    audio_url:
      "/audio/chutney/lets-sing-and-dance-with-dropati/08-karlo-nar-bahjan.mp3",
    cover_url: "/images/albums/lets-sing-and-dance-with-dropati-player.png",
    thumbnail_url: "/images/albums/lets-sing-and-dance-with-dropati.png",
    mini_cover_url: "/images/albums/lets-sing-and-dance-with-dropati.png",
    display_order: 246,
    category_slugs: ["general", "satsang", "bhajan", "hindi"],
    meaning: "From Let's Sing & Dance with Dropati. Lyrics under Traditional Chutney.",
    roman_lyrics: "[Album track]",
  },
  "sawaliya-kay-kounay-dropati": {
    title: "Sawaliya Kay Kounay",
    alternate_title: "Let's Sing & Dance with Dropati · Track 9",
    artist_version: "Dropati",
    audio_url:
      "/audio/chutney/lets-sing-and-dance-with-dropati/09-sawaliya-kay-kounay.mp3",
    cover_url: "/images/albums/lets-sing-and-dance-with-dropati-player.png",
    thumbnail_url: "/images/albums/lets-sing-and-dance-with-dropati.png",
    mini_cover_url: "/images/albums/lets-sing-and-dance-with-dropati.png",
    display_order: 247,
    category_slugs: ["general", "bhajan", "hindi"],
    meaning: "From Let's Sing & Dance with Dropati. Lyrics under Traditional Chutney.",
    roman_lyrics: "[Album track]",
  },
  "gandhi-jawahar-dropati": {
    title: "Gandhi Jawahar",
    alternate_title: "Let's Sing & Dance with Dropati · Track 10",
    artist_version: "Dropati",
    audio_url:
      "/audio/chutney/lets-sing-and-dance-with-dropati/10-gandhi-jawahar.mp3",
    cover_url: "/images/albums/lets-sing-and-dance-with-dropati-player.png",
    thumbnail_url: "/images/albums/lets-sing-and-dance-with-dropati.png",
    mini_cover_url: "/images/albums/lets-sing-and-dance-with-dropati.png",
    display_order: 248,
    category_slugs: ["general", "bhajan", "hindi"],
    meaning: "From Let's Sing & Dance with Dropati. Lyrics under Traditional Chutney.",
    roman_lyrics: "[Album track]",
  },
  "samdhi-dekho-baakay-dropati": {
    title: "Samdhi Dekho Baakay",
    alternate_title: "Let's Sing & Dance with Dropati · Track 11",
    artist_version: "Dropati",
    audio_url:
      "/audio/chutney/lets-sing-and-dance-with-dropati/11-samdhi-dekho-baakay.mp3",
    cover_url: "/images/albums/lets-sing-and-dance-with-dropati-player.png",
    thumbnail_url: "/images/albums/lets-sing-and-dance-with-dropati.png",
    mini_cover_url: "/images/albums/lets-sing-and-dance-with-dropati.png",
    display_order: 249,
    category_slugs: ["wedding", "general", "bhajan", "hindi"],
    meaning: "From Let's Sing & Dance with Dropati. Lyrics under Traditional Chutney.",
    roman_lyrics: "[Album track]",
  },
  "patna-sahar-guljau-dropati": {
    title: "Patna Sahar Guljau",
    alternate_title: "Let's Sing & Dance with Dropati · Track 12",
    artist_version: "Dropati",
    audio_url:
      "/audio/chutney/lets-sing-and-dance-with-dropati/12-patna-sahar-guljau.mp3",
    cover_url: "/images/albums/lets-sing-and-dance-with-dropati-player.png",
    thumbnail_url: "/images/albums/lets-sing-and-dance-with-dropati.png",
    mini_cover_url: "/images/albums/lets-sing-and-dance-with-dropati.png",
    display_order: 250,
    category_slugs: ["general", "bhajan", "hindi"],
    meaning: "From Let's Sing & Dance with Dropati. Lyrics under Traditional Chutney.",
    roman_lyrics: "[Album track]",
  },
  "mainay-dayka-jagat-dropati": {
    title: "Mainay Dayka Jagat",
    alternate_title: "Let's Sing & Dance with Dropati · Track 13",
    artist_version: "Dropati",
    audio_url:
      "/audio/chutney/lets-sing-and-dance-with-dropati/13-mainay-dayka-jagat.mp3",
    cover_url: "/images/albums/lets-sing-and-dance-with-dropati-player.png",
    thumbnail_url: "/images/albums/lets-sing-and-dance-with-dropati.png",
    mini_cover_url: "/images/albums/lets-sing-and-dance-with-dropati.png",
    display_order: 251,
    category_slugs: ["general", "bhajan", "hindi"],
    meaning: "From Let's Sing & Dance with Dropati. Lyrics under Traditional Chutney.",
    roman_lyrics: "[Album track]",
  },
  "banaras-raja-jai-ho-dropati": {
    title: "Banaras Raja Jai Ho",
    alternate_title: "Let's Sing & Dance with Dropati · Track 14",
    artist_version: "Dropati",
    audio_url:
      "/audio/chutney/lets-sing-and-dance-with-dropati/14-banaras-raja-jai-ho.mp3",
    cover_url: "/images/albums/lets-sing-and-dance-with-dropati-player.png",
    thumbnail_url: "/images/albums/lets-sing-and-dance-with-dropati.png",
    mini_cover_url: "/images/albums/lets-sing-and-dance-with-dropati.png",
    display_order: 252,
    category_slugs: ["general", "bhajan", "hindi"],
    meaning: "From Let's Sing & Dance with Dropati. Lyrics under Traditional Chutney.",
    roman_lyrics: "[Album track]",
  },
  "paani-kay-nickalay-dropati": {
    title: "Paani Kay Nickalay",
    alternate_title: "Let's Sing & Dance with Dropati · Track 15",
    artist_version: "Dropati",
    audio_url:
      "/audio/chutney/lets-sing-and-dance-with-dropati/15-paani-kay-nickalay.mp3",
    cover_url: "/images/albums/lets-sing-and-dance-with-dropati-player.png",
    thumbnail_url: "/images/albums/lets-sing-and-dance-with-dropati.png",
    mini_cover_url: "/images/albums/lets-sing-and-dance-with-dropati.png",
    display_order: 253,
    category_slugs: ["general", "bhajan", "hindi"],
    meaning: "From Let's Sing & Dance with Dropati. Lyrics under Traditional Chutney.",
    roman_lyrics: "[Album track]",
  },
  "gaya-ja-geet-milan-ke-dropati": {
    title: "Gaya Ja Geet Milan Ke",
    alternate_title: "Let's Sing & Dance with Dropati · Track 16",
    artist_version: "Dropati",
    audio_url:
      "/audio/chutney/lets-sing-and-dance-with-dropati/16-gaya-ja-geet-milan-ke.mp3",
    cover_url: "/images/albums/lets-sing-and-dance-with-dropati-player.png",
    thumbnail_url: "/images/albums/lets-sing-and-dance-with-dropati.png",
    mini_cover_url: "/images/albums/lets-sing-and-dance-with-dropati.png",
    display_order: 254,
    category_slugs: ["general", "bhajan", "hindi"],
    meaning: "From Let's Sing & Dance with Dropati. Lyrics under Traditional Chutney.",
    roman_lyrics: "[Album track]",
  },
  "ya-mohammad-allah-dropati": {
    title: "Ya Mohammad Allah",
    alternate_title: "Let's Sing & Dance with Dropati · Track 17",
    artist_version: "Dropati",
    audio_url:
      "/audio/chutney/lets-sing-and-dance-with-dropati/17-ya-mohammad-allah.mp3",
    cover_url: "/images/albums/lets-sing-and-dance-with-dropati-player.png",
    thumbnail_url: "/images/albums/lets-sing-and-dance-with-dropati.png",
    mini_cover_url: "/images/albums/lets-sing-and-dance-with-dropati.png",
    display_order: 255,
    category_slugs: ["general", "bhajan", "hindi"],
    meaning: "From Let's Sing & Dance with Dropati. Lyrics under Traditional Chutney.",
    roman_lyrics: "[Album track]",
  },
  "suhaagan-sundar-nath-dropati": {
    title: "Suhaagan Sundar Nath",
    alternate_title: "Let's Sing & Dance with Dropati · Track 18",
    artist_version: "Dropati",
    audio_url:
      "/audio/chutney/lets-sing-and-dance-with-dropati/18-suhaagan-sundar-nath.mp3",
    cover_url: "/images/albums/lets-sing-and-dance-with-dropati-player.png",
    thumbnail_url: "/images/albums/lets-sing-and-dance-with-dropati.png",
    mini_cover_url: "/images/albums/lets-sing-and-dance-with-dropati.png",
    display_order: 256,
    category_slugs: ["wedding", "general", "bhajan", "hindi"],
    meaning: "From Let's Sing & Dance with Dropati. Lyrics under Traditional Chutney.",
    roman_lyrics: "[Album track]",
  },
  "bhaag-rahee-dropati": {
    title: "Bhaag Rahee",
    alternate_title: "Let's Sing & Dance with Dropati · Track 19",
    artist_version: "Dropati",
    audio_url:
      "/audio/chutney/lets-sing-and-dance-with-dropati/19-bhaag-rahee.mp3",
    cover_url: "/images/albums/lets-sing-and-dance-with-dropati-player.png",
    thumbnail_url: "/images/albums/lets-sing-and-dance-with-dropati.png",
    mini_cover_url: "/images/albums/lets-sing-and-dance-with-dropati.png",
    display_order: 257,
    category_slugs: ["general", "bhajan", "hindi"],
    meaning: "From Let's Sing & Dance with Dropati. Lyrics under Traditional Chutney.",
    roman_lyrics: "[Album track]",
  },
  "tassa-dropati": {
    title: "Tassa",
    alternate_title: "Let's Sing & Dance with Dropati · Track 20",
    artist_version: "Dropati",
    audio_url:
      "/audio/chutney/lets-sing-and-dance-with-dropati/20-tassa.mp3",
    cover_url: "/images/albums/lets-sing-and-dance-with-dropati-player.png",
    thumbnail_url: "/images/albums/lets-sing-and-dance-with-dropati.png",
    mini_cover_url: "/images/albums/lets-sing-and-dance-with-dropati.png",
    display_order: 258,
    category_slugs: ["general", "bhajan", "hindi"],
    meaning: "From Let's Sing & Dance with Dropati. Lyrics under Traditional Chutney.",
    roman_lyrics: "[Album track]",
  },
  "kailashwasi-devta-dinanath-hain-hari-om-sharan": {
    title: "Kailashwasi Devta Dinanath Hain",
    alternate_title: "Shiv Archana · Track 1",
    artist_version: "Hari Om Sharan & Nandini Sharan",
    audio_url:
      "/audio/albums/shiv-archana-hari-om-sharan/01-kailashwasi-devta-dinanath-hain.mp3",
    cover_url: "/images/albums/shiv-archana-hari-om-sharan-player.png",
    thumbnail_url: "/images/albums/shiv-archana-hari-om-sharan.png",
    mini_cover_url: "/images/albums/shiv-archana-hari-om-sharan.png",
    display_order: 259,
    category_slugs: ["shiva", "general", "satsang", "bhajan", "devotion", "hindi"],
    meaning:
      "Opening Shiva bhajan from Shiv Archana — the Kailash-dwelling Lord is protector of the helpless and Lord of the universe; Ambika shines at his left.",
    roman_lyrics: `## Chorus

Kailashvasi dewata deenanath hai vishwanath hai
Vaamang sohe Ambika deenanath hai vishwanath hain

## Verses

Jayati jaya Ambe Bhawani
Jayati jaya Shiv Pashupati
Shiv bhaal sohe chandrama
Sohe jata Bhagirathi
Prabhu Neelkanth Digambara
Shobha kul chhavi raj ki
Naareesh jan gan keerti ka
Deenanath hai vishwanath

Shiv se hi sohe jeev van
Sohe sakal ye vasundhara
Parvat salil sagar nadi mein
Vyapt Shiv Parmeshwara
Shrishti mein jinse bhavyata
Deenanath hai vishwanath hai

Prabhu Ashutosh tridosh har
Kalyaan karte sarvada
Damru ke dim dim taal par
Karte hai taandav Shiv sada
Bholi hai jinki udaarata
Deenanath hain vishwanath hain`,
    translation: `## Chorus

The deity who dwells on Kailash is Lord of the helpless, Lord of the universe
Ambika shines at his left side

## Verses

Victory to Mother Ambe Bhawani
Victory to Shiva, lord of beings
The moon adorns Shiva's forehead
Bhagirathi (Ganga) shines in his matted hair
Blue-throated Digambara — matchless beauty
Lord of the helpless, Lord of the universe

From Shiva alone the living world is fair
And all this earth is beautiful
In mountain, water, ocean, and river
Shiva the Supreme Lord pervades
From whom creation gains its grandeur
Lord of the helpless, Lord of the universe

Quick to please, remover of the three afflictions
He always works for our welfare
To the dim-dim beat of the damaru
Shiva forever dances the tandava
Simple is his generosity
Lord of the helpless, Lord of the universe`,
  },
  "jahan-shivji-vichran-karte-hain-hari-om-sharan": {
    title: "Jahan Shivji Vichran Karte Hain",
    alternate_title: "Shiv Archana · Track 2",
    artist_version: "Hari Om Sharan & Nandini Sharan",
    audio_url:
      "/audio/albums/shiv-archana-hari-om-sharan/02-jahan-shivji-vichran-karte-hain.mp3",
    cover_url: "/images/albums/shiv-archana-hari-om-sharan-player.png",
    thumbnail_url: "/images/albums/shiv-archana-hari-om-sharan.png",
    mini_cover_url: "/images/albums/shiv-archana-hari-om-sharan.png",
    display_order: 260,
    category_slugs: ["shiva", "general", "satsang", "bhajan", "devotion", "hindi"],
    meaning:
      "Praise of Kashi / Varanasi — the land where Shivji wanders, giver of moksha, city of Vishwanath on the Ganga.",
    roman_lyrics: `## Chorus

Jai Vishwanath Om Namah Shivaye
Jahan Shiv ji vicharan karte hain
Us bhoomi ko Kashi kehte hain
Ye moksha dayini Kashi
Ye patitpawini Kashi hai

## Verses

Mathura Ayodhya Haridwar
Dwarka Avantika Kashi
Puri saat hain moksha daayini
Sabse badh kar hai Kashi

Hum Kashi ke pawan raj kan ko
Nij apne sheesh pe rakhte
Anandvan Rudravas ye
Shiv Kashi Varanasi
Maha shmashaan hai tapasthali
Mukta bhumi Varanasi

Tripurari ki nagari hai yeh
Shiv Shambhoo ki hai yeh nagari
Jagvipada hari nagari
Ganga tat bhari nagari
Jahan paap sabhi ke mitate hain
Us bhoomi ko Kashi kehte

Shiv trishool pe thehri hui hai
Param pawini yeh Kashi
Param bhakti ki khaan hai ye
Jan man bhaawan ye Kashi
Sakal dewata angin roop se
Nitya hi poojan karte
Jyotirling Vishweshwar ji ka
Nit darshan karte rehte
Jahan Vishwanath ji baste hain
Us bhoomi ko Kashi kehte hain`,
    translation: `## Chorus

Victory to Vishwanath — Om Namah Shivaya
Where Shivji wanders
That land is called Kashi
This Kashi grants liberation
This Kashi purifies the fallen

## Verses

Mathura, Ayodhya, Haridwar
Dwarka, Avantika, Kashi
Seven cities grant liberation
And Kashi stands above them all

We place the sacred dust of Kashi
Upon our own heads
Anandvan, Rudra's abode —
Shiva's Kashi, Varanasi
Great cremation ground and place of austerity
The free land of Varanasi

This is Tripurari's city
This is Shambhu's city
City that removes the world's afflictions
City filled along the Ganga's bank
Where all sins are destroyed
That land is called Kashi

Resting on Shiva's trident
Is this supremely pure Kashi
A mine of highest devotion
Beloved to every heart
All the gods in countless forms
Worship here forever
And take daily darshan
Of the Jyotirlinga Vishweshwar
Where Vishwanath dwells
That land is called Kashi`,
  },
  "shambh-sadashiv-japle-re-hari-om-sharan": {
    title: "Shambh Sadashiv Japle Re",
    alternate_title: "Shambhu Sadashiv · Shiv Archana · Track 3",
    artist_version: "Hari Om Sharan & Nandini Sharan",
    audio_url:
      "/audio/albums/shiv-archana-hari-om-sharan/03-shambh-sadashiv-japle-re.mp3",
    cover_url: "/images/albums/shiv-archana-hari-om-sharan-player.png",
    thumbnail_url: "/images/albums/shiv-archana-hari-om-sharan.png",
    mini_cover_url: "/images/albums/shiv-archana-hari-om-sharan.png",
    display_order: 261,
    category_slugs: ["shiva", "general", "satsang", "bhajan", "devotion", "hindi"],
    meaning:
      "Call to chant Shambhu Sadashiv — for the kanwariya on the path to Baidyanath; wrap yourself in Shiva's name.",
    roman_lyrics: `## Chorus

Shambhu Sadashiv japle re
Teri sab bigadi ban jaaye

## Verses

Chal kaanwariya Shiv ke dham
Shiv Shankar ka le ke naam
Adidev hain Shiv Mahadev
Shiv Bholenath Digambar
Apne tan saza le bande
Shiv ke naam ki chadar
Tan man usise dhak le re
Teri sab bigadi ban jaaye

Shiv ji deepak Shiv ji baati
Shiv ji hain ujiyaara
Nain ki jyoti Shiv ji mere
Har lenge andhiyaara
Jyotirmaya man kar le re
Teri sab bigadi ban jaaye

Kaanwar ke kalash mein apne
Shraddha ka jal bhar le
Baidyanath ke jyotirling pe
Use samarpit kar de
Charnon mein sir rakh de re
Teri sab bigadi ban jaaye`,
    translation: `## Chorus

Keep chanting Shambhu Sadashiv
All that is broken in you will be made whole

## Verses

Go, kanwariya, to Shiva's abode
Taking the name of Shiv Shankar
Shiva Mahadev is the first of gods
Bholenath Digambar
Adorn your body, O devotee
With the shawl of Shiva's name
Cover body and mind with it
All that is broken will be made whole

Shiva is the lamp, Shiva the wick
Shiva is the light
Shiva is the light of my eyes
He will take away the darkness
Make the mind full of light
All that is broken will be made whole

In the kalash of your kanwar
Fill the water of faith
At the Jyotirlinga of Baidyanath
Offer it in surrender
Lay your head at his feet
All that is broken will be made whole`,
  },
  "jata-joot-mein-shivji-ke-hari-om-sharan": {
    title: "Jata Joot Mein Shivji Ke",
    alternate_title: "Shiv Archana · Track 4",
    artist_version: "Hari Om Sharan & Nandini Sharan",
    audio_url:
      "/audio/albums/shiv-archana-hari-om-sharan/04-jata-joot-mein-shivji-ke.mp3",
    cover_url: "/images/albums/shiv-archana-hari-om-sharan-player.png",
    thumbnail_url: "/images/albums/shiv-archana-hari-om-sharan.png",
    mini_cover_url: "/images/albums/shiv-archana-hari-om-sharan.png",
    display_order: 262,
    category_slugs: ["shiva", "general", "satsang", "bhajan", "devotion", "hindi"],
    meaning:
      "How Ganga came to earth through Bhagirath's tapasya and was caught in Shiva's jata — then flowed to liberate devotees.",
    roman_lyrics: `## Chorus

Jata joot mein Shiv ji ke Ganga ji lehrayi
Bhakton ko taaran ke liye dharti pe ye chali aayi

## Verses

Bhagirath ki dekh tapasya
Maan gayi thi Ganga ji
Dharti par aane ke liye
Taiyaar hui thi Ganga ji
Prashna utha Ganga ki veg ko
Roke kaun bhu par
Bhagirath ne kaha mujhe vishwas
Shiv Shambhu par
Shiv ne jata lehrayi
Ganga Maiya aake samayi
Bhakton ko taran ke liye
Dharti par chali aayi

Pitaron ke uddhar ke liye
Dekho Bhagirath Raja ji
Ganga ji ko dhara pe laaye
Siddh kiye sab kaaj ji
Ganga se Shiv Shankar ka
Shringaar ho gaya pyara
Unke sheesh bhae nirantar
Ganga ji ki dhara
Ganga ji mein jo bhi nahaye
Paawan use banaye
Bhakton ke taaran ke liye
Dharti pe chali aayi`,
    translation: `## Chorus

In Shivji's matted locks Mother Ganga waved and flowed
She came to earth to liberate devotees

## Verses

Seeing Bhagirath's austerity
Ganga was moved
Ready to come down to earth
A question rose — who on earth
Could stop Ganga's force?
Bhagirath said, my trust
Is in Shiv Shambhu
Shiva shook his jata
Mother Ganga came and settled there
Then flowed to earth
To liberate devotees

For the uplift of the ancestors
See King Bhagirath
He brought Ganga to earth
And fulfilled every task
With Ganga, Shiv Shankar's adornment
Became so dear
Forever upon his head
Flows Mother Ganga's stream
Whoever bathes in Ganga
Is made pure
She came to earth
To liberate devotees`,
  },
  "keertan-jai-vishwa-nath-hari-om-sharan": {
    title: "Keertan — Jai Vishwa Nath",
    alternate_title: "Jai Vishwanath · Shiv Archana · Track 5",
    artist_version: "Hari Om Sharan & Nandini Sharan",
    audio_url:
      "/audio/albums/shiv-archana-hari-om-sharan/05-keertan-jai-vishwa-nath.mp3",
    cover_url: "/images/albums/shiv-archana-hari-om-sharan-player.png",
    thumbnail_url: "/images/albums/shiv-archana-hari-om-sharan.png",
    mini_cover_url: "/images/albums/shiv-archana-hari-om-sharan.png",
    display_order: 263,
    category_slugs: ["shiva", "general", "satsang", "bhajan", "devotion", "hindi"],
    meaning:
      "Short keertan from Shiv Archana — victory to Vishwanath; Om Namah Shivaya.",
    roman_lyrics: `## Chorus

Jai Vishwanath
Om Namah Shivaye
Jai Vishwanath
Om Namah Shivaye`,
    translation: `## Chorus

Victory to Vishwanath
Om Namah Shivaya`,
  },
  "aaya-shivratri-tyohaar-hari-om-sharan": {
    title: "Aaya Shivratri Tyohaar",
    alternate_title: "Shiv Archana · Track 6",
    artist_version: "Hari Om Sharan & Nandini Sharan",
    audio_url:
      "/audio/albums/shiv-archana-hari-om-sharan/06-aaya-shivratri-tyohaar.mp3",
    cover_url: "/images/albums/shiv-archana-hari-om-sharan-player.png",
    thumbnail_url: "/images/albums/shiv-archana-hari-om-sharan.png",
    mini_cover_url: "/images/albums/shiv-archana-hari-om-sharan.png",
    display_order: 264,
    category_slugs: [
      "shiva",
      "shivratri",
      "general",
      "satsang",
      "bhajan",
      "devotion",
      "hindi",
    ],
    meaning:
      "Mahashivratri festival bhajan — Gauri–Shankar milan, abhishek with gangajal, and call to keep the fast.",
    roman_lyrics: `## Chorus

Aaya Shivratri tyohaar
Chalo re Shiv vandan kare
Vandan kare abhinandan kare
Aaya Shivratri tyohaar
Chalo re Shiv vandan kare

## Verses

Aaj hai Gauri Shiv ka milan
Shivratri parv manao sabhi
Shree Gauri Shankar ka darshan
Karne shivalaya aao sabhi
Aao kar de Shiv shingaar
Chalo re Shiv poojan kare

Shiv Shiv japta manwa humara
Dhyan mein Shiv sakaar
Baraat aayi Shiv Shankar ki
Bhoot pret nach karte jaikaar
Shiv dulha bane kartaar
Chalo re Shiv poojan kare

Thali mein chandan phoolon ka haar
Haathon mein le lo Ganga jali
Abhishek Shankar ji ka karo
Pushpanjali karo deepanjali
Vrat kar lo tyag ahaar
Chalo re Shiv poojan kare

Shiv ji ko pooje Vishnu aur Brahma
Shiv ka hai ye sansaar
Shiv ke bina nahi shrishti ki rachana
Bhakton karo maan se jaijai kaar
Taar denge taaranhaar
Chalo re Shiv poojan kare`,
    translation: `## Chorus

Shivratri festival has come
Come, let us offer homage to Shiva
Homage and joyful welcome
Shivratri festival has come

## Verses

Today is Gauri and Shiva's union
Celebrate the Shivratri festival, everyone
Come to the shivalaya
For darshan of Gauri Shankar
Come, adorn Shiva
Come, let us worship Shiva

Our mind chants Shiv Shiv
Shiva appears in meditation
Shiv Shankar's wedding procession has come
Spirits dance and raise victory cries
Shiva the Creator becomes the bridegroom
Come, let us worship Shiva

In the thali — sandal and a garland of flowers
Take Ganga water in your hands
Do Shankar's abhishek
Offer flowers and lamps
Keep the fast, give up food
Come, let us worship Shiva

Vishnu and Brahma worship Shiva
This world belongs to Shiva
Without Shiva there is no creation
Devotees, raise a heartfelt victory cry
The Liberator will carry us across
Come, let us worship Shiva`,
  },
  "shiv-shiv-japle-prani-hari-om-sharan": {
    title: "Shiv Shiv Japle Prani",
    alternate_title: "Shiv Archana · Track 7",
    artist_version: "Hari Om Sharan & Nandini Sharan",
    audio_url:
      "/audio/albums/shiv-archana-hari-om-sharan/07-shiv-shiv-japle-prani.mp3",
    cover_url: "/images/albums/shiv-archana-hari-om-sharan-player.png",
    thumbnail_url: "/images/albums/shiv-archana-hari-om-sharan.png",
    mini_cover_url: "/images/albums/shiv-archana-hari-om-sharan.png",
    display_order: 265,
    category_slugs: ["shiva", "general", "satsang", "bhajan", "devotion", "hindi"],
    meaning:
      "Urge every soul to chant Shiv Shiv — become Shiva's servant; Mahakaal protects those who meditate on Onkareshwar.",
    roman_lyrics: `## Chorus

Shiv Shiv japle prani
Teri amrit maya ho gi vaani

## Verses

Bhola ban kar Bholenath ki
Bhakti jo karega
Shiv ji uspar kripa karenge
Shiv ka das banega
Ban jayega gyani

Kaal nahi kuchh kar payega
Mahakaal hain Shiv Kaaleshwar
Unka trishool hai sabka rakshak
Jap man mere Onkareshwar
Dhyan laga le dhyani

Parmanand Nateshwar Shiv ji
Adi anadi ananta
Baamang sohe nit bhari
Ardhangi Bhagwanta
Shiv ki shakti Bhawani`,
    translation: `## Chorus

O living being, keep chanting Shiv Shiv
Your speech will become nectar-filled

## Verses

Whoever simply devoted
Worships Bholenath
Shiva will grant them grace
They will become Shiva's servant
And become wise

Death can do nothing
Shiva is Mahakaal, Kaaleshwar
His trident protects all
O my mind, chant Onkareshwar
Meditate, O meditator

Blissful Nateshwar Shiva
Beginningless, endless, infinite
Forever at his left shines
His half, the Blessed One
Shiva's Shakti is Bhawani`,
  },
  "lagan-tose-laagi-re-damruwale-hari-om-sharan": {
    title: "Lagan Tose Laagi Re Damruwale",
    alternate_title: "Shiv Archana · Track 8",
    artist_version: "Hari Om Sharan & Nandini Sharan",
    audio_url:
      "/audio/albums/shiv-archana-hari-om-sharan/08-lagan-tose-laagi-re-damruwale.mp3",
    cover_url: "/images/albums/shiv-archana-hari-om-sharan-player.png",
    thumbnail_url: "/images/albums/shiv-archana-hari-om-sharan.png",
    mini_cover_url: "/images/albums/shiv-archana-hari-om-sharan.png",
    display_order: 266,
    category_slugs: ["shiva", "general", "satsang", "bhajan", "devotion", "hindi"],
    meaning:
      "Love for Damruwale — Bhola Bhale Shivshankar; the night Parvati garlanded him became Shivratri.",
    roman_lyrics: `## Chorus

Lagan tose laagi re Damruwale
Damruwale bhole bhale
Shivshankar matwale

## Verses

Jai Nageshwar jayati Chandradhar
Jaya Shiv Gangadhari
Haath trishool hai damru aala
Ang bhasma Tripurari
Darshan kar le moorakh manwa
Bigadi apni bana le

Dhyan mein mere Shiv ki murat
Dhyan mein Shiv ka shivaala
Shiv par hi mere man ko bharosa
Shiv hai deendayala
Jiska nahi hai koi jag mein
Uske Shiv rakhwale

Shiv se ho kalyaan jagat ka
Shiv se shrishti saari
Shiv bhakton ke Mahadev hain
Jan jan ke hitkaari
Bhavsagar mein dagmag naiya
Shiv ji use sambhale

Damru baja ke Shiv ji ne jab
Apni jata lehrayi thi
Parvati ne Shiv ke gale mein
Var maala pehnayi thi
Wah ratri Shivratri ban gayi
Manwa Shiv gun gaa le`,
    translation: `## Chorus

My heart is attached to you, O Damru-player
Simple, innocent Damru-player
Intoxicated Shivshankar

## Verses

Victory to Nageshwar, moon-bearer
Victory to Ganga-bearing Shiva
Trident in hand, damaru sounding
Ash-smeared Tripurari
Take darshan, O foolish mind
And mend what you have spoiled

In meditation — Shiva's form
In meditation — Shiva's temple
My mind trusts only Shiva
Shiva is kind to the lowly
Whoever has no one in the world
Has Shiva as guardian

From Shiva comes the world's welfare
From Shiva all creation
Mahadev of Shiva's devotees
Benefactor of every soul
When the boat rocks in the ocean of becoming
Shivji steadies it

When Shivji played the damaru
And shook his matted locks
Parvati placed the wedding garland
Around Shiva's neck
That night became Shivratri
O mind, sing Shiva's glory`,
  },
  "shiv-ke-charanwa-mein-hari-om-sharan": {
    title: "Shiv Ke Charanwa Mein",
    alternate_title: "Shiv Archana · Track 9",
    artist_version: "Hari Om Sharan & Nandini Sharan",
    audio_url:
      "/audio/albums/shiv-archana-hari-om-sharan/09-shiv-ke-charanwa-mein.mp3",
    cover_url: "/images/albums/shiv-archana-hari-om-sharan-player.png",
    thumbnail_url: "/images/albums/shiv-archana-hari-om-sharan.png",
    mini_cover_url: "/images/albums/shiv-archana-hari-om-sharan.png",
    display_order: 267,
    category_slugs: ["shiva", "general", "satsang", "bhajan", "devotion", "hindi"],
    meaning:
      "The mind fixed at Shiva's feet — invite the Inner Lord into the heart's temple; protect the thread of devotion.",
    roman_lyrics: `## Chorus

Shiv ke charanwa mein man mora laga
Bhagati ka diyana manwa mein jaaga

## Verses

Damru trishool leke Antaryami
Man ke mandirwa mein aavo Swami
Bhagati ki laaj rakho
Toote na dhaga

Sunte hai Bholenath
Jaisa koi na dooja
Uspe kripa kare
Jisne bhi pooja
Use vardaan dete
Shiv muh maanga

Shiv abhishek Gangajal se karenge
Ganga ka dhyan Shiv ke sang hi karenge
Ganga ki pooja Shiv sang
Sone mein suhaaga`,
    translation: `## Chorus

My mind is fixed at Shiva's feet
The lamp of devotion has woken in the heart

## Verses

O Inner Lord with damaru and trident
Come into the temple of the mind
Protect the honour of devotion
Let the thread not break

We hear there is none other
Like Bholenath
He grants grace
To whoever worships
And gives the boon they ask
Whatever the mouth requests

We will bathe Shiva with Gangajal
And remember Ganga together with Shiva
Worship of Ganga with Shiva
Is like gold with suhaaga`,
  },
  "keertan-jayati-jai-ambe-bhawani-hari-om-sharan": {
    title: "Keertan — Jayati Jai Ambe Bhawani",
    alternate_title: "Jayati Jai Ambe · Shiv Archana · Track 10",
    artist_version: "Hari Om Sharan & Nandini Sharan",
    audio_url:
      "/audio/albums/shiv-archana-hari-om-sharan/10-keertan-jayati-jai-ambe-bhawani.mp3",
    cover_url: "/images/albums/shiv-archana-hari-om-sharan-player.png",
    thumbnail_url: "/images/albums/shiv-archana-hari-om-sharan.png",
    mini_cover_url: "/images/albums/shiv-archana-hari-om-sharan.png",
    display_order: 268,
    category_slugs: [
      "durga",
      "shiva",
      "general",
      "satsang",
      "bhajan",
      "devotion",
      "hindi",
    ],
    meaning:
      "Closing keertan from Shiv Archana — victory to Ambe Bhawani and to Shiv Pashupati.",
    roman_lyrics: `## Chorus

Jayati jaya Ambe Bhawani
Jayati jaya Shiv Pashupati
Jayati jaya Ambe Bhawani
Jayati jaya Shiv Pashupati`,
    translation: `## Chorus

Victory to Mother Ambe Bhawani
Victory to Shiva Pashupati`,
  },
  "jai-shankar-bhole-anup-jalota": {
    title: "Jai Shankar Bhole",
    alternate_title: "Jai Jai Bhole · Bam Bam Bhole · Jai Shiv Shankar",
    artist_version: "Anup Jalota",
    audio_url: "/videos/jai-shankar-bhole-anup-jalota.mp4",
    cover_url: "/images/jai-shankar-bhole-anup-jalota-player.png",
    thumbnail_url: "/images/jai-shankar-bhole-anup-jalota.png",
    mini_cover_url: "/images/jai-shankar-bhole-anup-jalota.png",
    display_order: 269,
    category_slugs: ["shiva", "general", "satsang", "bhajan", "devotion", "hindi"],
    meaning:
      "Anup Jalota’s lively Shiva bhajan (SSA Music) — victory to Shankar Bhole, the unique Lord among the gods; Neelkanth who drank the poison, Kailashpati with Ganga in his jata.",
    roman_lyrics: `## Opening

Jai Shankar Bhole
Jai Shankar Bhole
Jai Shankar Bhole

## Chorus

Jai Shiv Shankar Jai Shiv Shankar
Jai Shankar Bhole
Sab devon mein Dev Nirale
Jai Bam Bam Bhole

## Verse 1

Mahadev tune hi to sab
Devo ka santaap hara
Sagar manthan mein nikla vish
Tune apne kant dhara
Isiliye har prani tujhko
Neelkanth bole
Sab devon mein Dev Nirale
Jai Bam Bam Bhole

## Verse 2

Tere naam aneko Baba
Teri mahima nyari
Tere bhed anokhe sabse
Kya jaane sansari
Tuhi hai Kailashpati
Tu Parvat par dole
Sab devon mein Dev Nirale
Jai Bam Bam Bhole

## Verse 3

Shish tumhari Ganga Maiya
Chandra shikar pe sohe
Tan pe sarp vicharte rahte
Bhakton ke man mohe
Usko kaisa kasht jagat mein
Naam tera jo le
Sab devon mein Dev Nirale
Jai Bam Bam Bhole

## Closing

Jai Shiv Shankar Jai Shiv Shankar
Jai Shankar Bhole
Sab devon mein Dev Nirale
Jai Bam Bam Bhole
Jai Bam Bam Bhole
Jai Bam Bam Bhole`,
    translation: `## Opening

Victory to Shankar Bhole
Victory to Shankar Bhole
Victory to Shankar Bhole

## Chorus

Victory to Shiv Shankar, victory to Shiv Shankar
Victory to Shankar Bhole
Unique Lord among all the gods
Victory — Bam Bam Bhole

## Verse 1

Mahadev, it was you who
Removed the gods' distress
When poison rose from the ocean churning
You held it in your throat
That is why every living being
Calls you Neelkanth
Unique Lord among all the gods
Victory — Bam Bam Bhole

## Verse 2

You have countless names, Baba
Your glory is unique
Your mysteries are wondrous beyond all
What can the worldly know?
You alone are Lord of Kailash
You sway upon the mountain
Unique Lord among all the gods
Victory — Bam Bam Bhole

## Verse 3

On your head rests Mother Ganga
The moon shines on your crest
Snakes wander upon your body
And captivate devotees' hearts
What worldly suffering can touch
Whoever takes your name?
Unique Lord among all the gods
Victory — Bam Bam Bhole

## Closing

Victory to Shiv Shankar, victory to Shiv Shankar
Victory to Shankar Bhole
Unique Lord among all the gods
Victory — Bam Bam Bhole`,
  },
  "tera-ramji-karenge-beda-paar-hari-om-sharan": {
    title: "Tera Ramji Karenge Beda Paar",
    alternate_title: "Premanjali Pushpanjali",
    artist_version: "Hari Om Sharan",
    audio_url:
      "/audio/albums/premanjali-pushpanjali-hari-om-sharan/tera-ramji-karenge-beda-paar.mp3",
    cover_url: "/images/albums/premanjali-pushpanjali-hari-om-sharan-player.png",
    thumbnail_url: "/images/albums/premanjali-pushpanjali-hari-om-sharan.png",
    mini_cover_url: "/images/albums/premanjali-pushpanjali-hari-om-sharan.png",
    display_order: 270,
    category_slugs: ["ram", "general", "satsang", "bhajan", "devotion", "hindi"],
    meaning:
      "From Premanjali Pushpanjali — do not fear or stay sad; Ram himself will take your boat across. Your boat is in Ram’s care; He holds the oar even in midstream.",
    roman_lyrics: `## Doha

Ram naam sohi jaaniye
Jo ramta sakal jahaan
Ghat ghat mein jo Ram raha
Usko Ram pehchaan

## Chorus

Tera Ram ji karenge beda paar re
Beda paar re, beda paar
Tera Ram ji karenge beda paar
Udasi man kahe ko kare
Tera Ram ji karenge beda paar
Udasi man kahe ko kare
Kahe ko dare re, kahe ko dare
Kahe ko dare

## Verse 1

Naiya teri Ram hawaale
Leher leher Hari aap sambhale
Naiya teri Ram hawaale
Leher leher Hari aap sambhale
Hari aap hi uthawe tera bhaar
Udasi man kahe ko kare

## Verse 2

Kaabu mein majdhaar usike
Haathon mein pathwaar usike
Kaabu mein majdhaar usike
Haathon mein pathwaar usike
Teri haar bhi nahin hai teri haar
Udasi man kahe ko kare

## Verse 3

Sahaj kinaara mil jaega
Mil jaega, mil jaega
Param sahara mil jaega
Sahaj kinaara mil jaega
Param sahara mil jaega
Dori saup ke tu dekh ek baar
Udasi man kahe ko kare

## Closing

Tera Ram ji karenge beda paar
Udasi man kahe ko kare
Kahe ko dare re, kahe ko dare
Kahe ko dare`,
    translation: `## Doha

Know this as Ram's name —
The one who wanders the whole world
Who dwells in every heart
Recognise that one as Ram

## Chorus

Your Ram will take the boat across
Across, across
Your Ram will take the boat across
Why does the mind stay sad?
Your Ram will take the boat across
Why does the mind stay sad?
Why fear, why fear?
Why fear?

## Verse 1

Your boat is entrusted to Ram
Wave by wave, Hari himself steadies it
Your boat is entrusted to Ram
Wave by wave, Hari himself steadies it
Hari himself lifts your burden
Why does the mind stay sad?

## Verse 2

In midstream, control is his
The oar is in his hands
In midstream, control is his
The oar is in his hands
Even your defeat is not your defeat
Why does the mind stay sad?

## Verse 3

The easy shore will be found
It will be found, it will be found
The supreme refuge will be found
The easy shore will be found
The supreme refuge will be found
Hand over the rope and look once
Why does the mind stay sad?

## Closing

Your Ram will take the boat across
Why does the mind stay sad?
Why fear, why fear?
Why fear?`,
  },
  "o-palanhare-lata-mangeshkar": {
    title: "O Palanhare",
    alternate_title: "O Paalanhaare · Lagaan · Lata Mangeshkar, Udit Narayan & Sadhana Sargam",
    artist_version: "Lata Mangeshkar & Udit Narayan",
    audio_url: "https://www.youtube.com/watch?v=kbMinfmC3E0",
    youtube_url: "https://www.youtube.com/watch?v=kbMinfmC3E0",
    cover_url: "/images/o-palanhare-lagaan-player.png",
    thumbnail_url: "/images/o-palanhare-lagaan.png",
    mini_cover_url: "/images/o-palanhare-lagaan.png",
    display_order: 271,
    category_slugs: [
      "krishna",
      "general",
      "satsang",
      "bhajan",
      "devotion",
      "hindi",
    ],
    meaning:
      "From Lagaan (2001) — prayer to the divine Nurturer (A.R. Rahman / Javed Akhtar). Without You we have no one; unravel our troubles, protect the weak, and give light on a dark path.",
    roman_lyrics: `## Chorus

O palanhaare, nirgun aur nyaare
O palanhaare, nirgun aur nyaare
Tumre bin hamra kauno naahin
Hamri uljhan suljhao Bhagwan
Tumre bin hamra kauno naahin

Tumhi hamka ho sambhale
Tumhi hamre rakhwale
Tumre bin hamra kauno naahin

## Verse 1

Chanda mein tumhi to bhare ho chaandni
Sooraj mein ujala tumhi se
Yeh gagan hai magan
Tumhi to diye ho ise taare
Bhagwan, yeh jeevan
Tumhi na sanwaroge
To kya koi sanware
O palanhaare, nirgun aur nyaare
Tumre bin hamra kauno naahin

## Verse 2

Jo suno to kahe, Prabhuji hamri hai binti
Dukhi jan ko dheeraj do
Haare nahin woh kabhi dukh se
Tum nirbal ko raksha do
Reh paaye nirbal sukh se
Bhakti ko shakti do

Jag ke jo Swami ho
Itni to araj suno
Hain path mein andhiyaare
De do vardaan mein ujiyaare

## Closing

O palanhaare, nirgun aur nyaare
Tumre bin hamra kauno naahin
Hamri uljhan suljhao Bhagwan
Tumre bin hamra kauno naahin
O palanhaare`,
    translation: `## Chorus

O Nurturer, formless and unique
O Nurturer, formless and unique
Without You we have no one
Unravel our troubles, O God
Without You we have no one

You alone take care of us
You alone are our guardian
Without You we have no one

## Verse 1

In the moon You fill the moonlight
In the sun the brightness is from You
This sky is blissful —
You gave it its stars
O God, if You do not shape this life
Then who will shape it?
O Nurturer, formless and unique
Without You we have no one

## Verse 2

If You will listen, Lord — this is our plea
Give patience to those who suffer
Let them never be defeated by sorrow
Protect the weak
So the weak may live in peace
Give strength to devotion

O Master of the world
Hear this small request
There is darkness on the path
Grant light as Your blessing

## Closing

O Nurturer, formless and unique
Without You we have no one
Unravel our troubles, O God
Without You we have no one
O Nurturer`,
  },
  "prabhu-ka-naam-japo-mukesh": {
    title: "Prabhu Ka Naam Japo",
    alternate_title: "Prabhu Ka Naam Japo Man Mere · Ram Kare So Hoye · 1971",
    artist_version: "Mukesh",
    audio_url: "/audio/prabhu-ka-naam-japo-mukesh.mp3",
    cover_url: "/images/prabhu-ka-naam-japo-mukesh-player-v2.png",
    thumbnail_url: "/images/prabhu-ka-naam-japo-mukesh-v2.png",
    mini_cover_url: "/images/prabhu-ka-naam-japo-mukesh-v2.png",
    display_order: 272,
    category_slugs: [
      "ram",
      "krishna",
      "general",
      "satsang",
      "bhajan",
      "devotion",
      "hindi",
    ],
    meaning:
      "Mukesh’s classic non-film bhajan (Ravindra Jain, from Ram Kare So Hoye, 1971) — chant the Lord’s name, O mind; He alone removes your troubles. Life is a night’s stay; when the cage opens, the bird does not remain.",
    roman_lyrics: `## Chorus

Prabhu ka naam japo man mere
Prabhu ka naam japo man mere
Door kare wohi sankat tere
Door kare wohi sankat tere

Hare Ram Hare Ram
Ram Ram Hare Hare
Hare Krishna Hare Krishna
Krishna Krishna Hare Hare
Prabhu ka naam japo man mere

## Verse 1

Jeevan rain basera hai
Kya tera kya mera hai
Yeh jeevan rain basera hai
Kya tera kya mera hai
Kyun naino se neer jhare re
Door kare wohi sankat tere

Hare Ram Hare Ram
Ram Ram Hare Hare
Hare Krishna Hare Krishna
Krishna Krishna Hare Hare
Prabhu ka naam japo man mere

## Verse 2

Pinjra jab khul jaata hai
Panchhi kab ruk paata hai
Yeh pinjra jab khul jaata hai
Panchhi kab ruk paata hai
Kyun iska afsos kare re
Door kare wohi sankat tere

Hare Ram Hare Ram
Ram Ram Hare Hare
Hare Krishna Hare Krishna
Krishna Krishna Hare Hare

## Closing

Prabhu ka naam
Prabhu ka naam
Prabhu ka naam japo man mere`,
    translation: `## Chorus

Chant the Lord's name, O my mind
Chant the Lord's name, O my mind
He alone will remove your troubles
He alone will remove your troubles

Hare Ram Hare Ram
Ram Ram Hare Hare
Hare Krishna Hare Krishna
Krishna Krishna Hare Hare
Chant the Lord's name, O my mind

## Verse 1

Life is only a night's lodging
What is yours, what is mine?
This life is only a night's lodging
What is yours, what is mine?
Why do tears fall from the eyes?
He alone will remove your troubles

## Verse 2

When the cage opens
Does the bird ever stay?
When the cage opens
Does the bird ever stay?
Why grieve over this?
He alone will remove your troubles

## Closing

The Lord's name
The Lord's name
Chant the Lord's name, O my mind`,
  },
  "shree-ramchandra-kripalu-bhajman-nitin-mukesh": {
    title: "Shree Ramchandra Kripalu Bhajman",
    alternate_title: "Ram Aarti · Nehanjali Devotional · Pushpanjali · Nitin Mukesh · Saregama",
    artist_version: "Nitin Mukesh",
    audio_url: "https://www.youtube.com/watch?v=HczVv9Pt9zk",
    youtube_url: "https://www.youtube.com/watch?v=HczVv9Pt9zk",
    thumbnail_url: "/images/shree-ramchandra-kripalu-bhajman-nitin-mukesh.png",
    cover_url: "/images/shree-ramchandra-kripalu-bhajman-nitin-mukesh-player.png",
    mini_cover_url: "/images/shree-ramchandra-kripalu-bhajman-nitin-mukesh.png",
    display_order: 276,
    category_slugs: [
      "ram",
      "general",
      "satsang",
      "aarti",
      "ram-navami",
      "evening-prayer",
      "bhajan",
      "devotion",
      "hindi",
    ],
    meaning:
      "Nitin Mukesh’s Saregama recording of Tulsidas’s beloved Ram stuti (Pushpanjali / Nehanjali Devotional) — praise of Shri Ram’s lotus form, and prayer for His grace to dwell in the heart and destroy the roots of desire.",
    roman_lyrics: `## Refrain

Shri Ramchandra kripalu bhaj man
Haran bhav bhay darunam
Nav kanj lochan, kanj mukh
Kar kanj, pad kanjarunam

## Verse 1

Kandarp aganit amit chhavi
Nav neel nirad sundaram
Pat peet manahu tadit ruchi shuchi
Naumi Janak sutavaram

Shri Ramchandra kripalu bhaj man
Haran bhav bhay darunam

## Verse 2

Bhaju din bandhu dinesh danav
Daitya vansh nikandanam
Raghunand anand kand kaushal chand
Dashrath nandanam

Shri Ramchandra kripalu bhaj man
Haran bhav bhay darunam

## Verse 3

Shir mukut kundal tilak charu
Udar ang vibhushanam
Aajan bhuj shar chaap dhar
Sangram jit khar dhushanam

Shri Ramchandra kripalu bhaj man
Haran bhav bhay darunam

## Verse 4

Iti vadati Tulsidas Shankar
Shesh muni man ranjanam
Mam hriday kanj nivas kuru
Kamadi khal dal ganjanam

Shri Ramchandra kripalu bhaj man
Haran bhav bhay darunam

## Verse 5

Man jaahi raach milahi so baru
Sahaj sundar saanvaro
Karuna nidhan sujan silu
Sanehu jaanat raavaro

Shri Ramchandra kripalu bhaj man
Haran bhav bhay darunam

## Verse 6

Ehi bhanti Gauri asis suni
Siya sahit hiy harshi ali
Tulsi bhawani pooji puni puni
Mudit man mandir chali

Shri Ramchandra kripalu bhaj man
Haran bhav bhay darunam

## Doha

Jaani Gauri anukool
Siya hiy harshu na jaai kahi
Manjul mangal mool
Baam ang pharkan lage

Siyapati Ramchandra ki jai`,
    translation: `O mind, sing praises of gracious Shri Ramchandra,
Who removes the terrible fear of birth and death,
Whose eyes, face, hands, and feet are like fresh red lotus blooms.

His beauty surpasses countless Kamadevas;
He is lovely as a fresh cloud against blue sky.
His golden garments shine like lightning — I bow to Janak's daughter's Lord.

I worship the friend of the poor, Lord of the sun,
Destroyer of the race of demons and fiends,
Joy of Raghu's line, moon of Kosala, son of Dasharatha.

His crown, earrings, and tilak are charming;
His limbs are richly adorned.
With arms to His knees He holds bow and arrow,
Victor in battle over Khara and Dushana.

Thus sings Tulsidas — delight of Shiva and sages —
Dwell in the lotus of my heart, O Lord,
And crush the wicked host of lust and vice.

Whoever the mind loves, such a bridegroom is found —
Naturally handsome, dark-complexioned,
Ocean of mercy, wise and gentle,
Ravana knew His love well.

Hearing Gauri's blessing thus,
Sita and her companions rejoiced in heart.
Tulsidas worshipped Bhavani again and again,
And went gladly to the temple.

Knowing Gauri was pleased,
Sita's heart could not contain its joy —
The root of all auspiciousness;
Her left limbs began to throb.

Victory to Sita's Lord Ramchandra!`,
  },
  "hey-ganga-maiya-shivam-rajaram": {
    title: "Hey Ganga Maiya",
    alternate_title: "Poojan Ham Aayi Re Ganga Maiya · Shivam Rajaram · 2025",
    artist_version: "Shivam Rajaram",
    audio_url: "https://www.youtube.com/watch?v=Wg-hQOuNbfQ",
    youtube_url: "https://www.youtube.com/watch?v=Wg-hQOuNbfQ",
    thumbnail_url: "/images/hey-ganga-maiya-shivam-rajaram.png",
    cover_url: "/images/hey-ganga-maiya-shivam-rajaram-player.png",
    mini_cover_url: "/images/hey-ganga-maiya-shivam-rajaram.png",
    display_order: 277,
    category_slugs: [
      "general",
      "satsang",
      "bhajan",
      "kirtan",
      "devotion",
      "gratitude",
      "hindi",
    ],
    meaning:
      "A joyful devotional ode to Mother Ganga by Surinamese-Dutch Baithak Gana artist Shivam Rajaram (filmed on location in Durban, South Africa). Devotees gather by the water with flowers, dholak, and aarti lamps, singing and dancing in celebration of Ganga Maiya’s holy flow and asking for Her forgiving grace.",
    roman_lyrics: `## Introductory Call

Re Maa, mere Maa, re Maa

## Chorus

He Ganga Maiya, he Ganga Maiya
Poojan ham aayi re, Ganga Maiya
Lehar lehar aao re, Ganga Maiya
Poojan ham aayi re, Ganga Maiya

## Verse 1

Sab jaane milkar pooja kare Maa
Sab jaane milkar pooja karenge
Tum lahar lahar aao re, Ganga Maiya
Poojan ham aayi re, Ganga Maiya

## Verse 2

Phool chadhao maiya maala pehnao
Phool chadhao maiya maala pehnao
Main aarti utaaro re, Ganga Maiya
Adbhut baat hole hole, Ganga Maiya

## Verse 3

Jo kuch main bhool kiya maafi karo Maa
Jo kuch main bhool kiya maafi karo Maa
Tu hi ho maata, main hi hoon baala
Daya karte aao re, Ganga Maiya

## Verse 4

Geet main gaao maiya, dholak bajao
Geet main gaao maiya, dholak bajao
Main ghoom ke naacho re, Ganga Maiya
Main ghoom ke naacho, main jhum jhum ke naacho
Daya karke aao re, Ganga Maiya
Poojan ham aayi re, Ganga Maiya

## Rela (Fast Tempo)

He Ganga Maiya, he Ganga Maiya
Poojan ham aayi re, Ganga Maiya
Lehar lehar aao re, Ganga Maiya
Main aarti utaaro re, Ganga Maiya!`,
    translation: `## Introductory Call

O Mother, my Mother, O Mother!

## Chorus

O Mother Ganga, O Mother Ganga!
We have come to worship You, O Mother Ganga.
Come dancing upon the waves, O Mother Ganga.
We have come to worship You, O Mother Ganga.

## Verse 1

Together everyone will offer worship, O Mother.
All of us together shall perform Your puja.
Come gliding upon the waves, O Mother Ganga.
We have come to worship You, O Mother Ganga.

## Verse 2

Offer flowers and adorn Mother with garlands;
Offer flowers and adorn Mother with garlands.
I shall perform Your aarti, O Mother Ganga.
Wondrous melodies whisper softly, O Mother Ganga.

## Verse 3

Forgive whatever mistakes and faults I have made, O Mother.
Forgive whatever mistakes and faults I have made, O Mother.
You alone are my mother, and I am Your child.
Come showering Your compassionate grace, O Mother Ganga.

## Verse 4

I sing songs to You, Mother, and play the dholak;
I sing songs to You, Mother, and play the dholak.
I spin and dance with joy, O Mother Ganga!
I spin and dance, swaying in bliss.
Come showering Your compassionate grace, O Mother Ganga!
We have come to worship You, O Mother Ganga.

## Rela (Fast Tempo)

O Mother Ganga, O Mother Ganga!
We have come to worship You, O Mother Ganga.
Come dancing upon the waves, O Mother Ganga.
I raise the sacred flame of aarti to You, Mother Ganga!`,
  },
  "lingashtakam-taran-terence-sookbir": {
    title: "Lingashtakam",
    alternate_title: "Shiva Lingashtakam Stotram · Mere Mahadeva · Taran Terence Sookbir",
    artist_version: "Taran Terence Sookbir",
    audio_url: "https://www.youtube.com/watch?v=WhyAH4ZHkgU",
    youtube_url: "https://www.youtube.com/watch?v=WhyAH4ZHkgU",
    thumbnail_url: "/images/lingashtakam-taran-terence-sookbir.png",
    cover_url: "/images/lingashtakam-taran-terence-sookbir-player.png",
    mini_cover_url: "/images/lingashtakam-taran-terence-sookbir.png",
    display_order: 278,
    category_slugs: [
      "shiva",
      "general",
      "satsang",
      "bhajan",
      "mantra",
      "devotion",
      "protection",
      "peace",
      "shivratri",
      "morning-prayer",
      "evening-prayer",
      "sanskrit",
    ],
    meaning:
      "Adi Shankaracharya’s sacred eight-verse Shiva Lingashtakam stotram sung by Taran Terence Sookbir, alternating each verse with the soul-stirring chorus: Mere Mahadeva Bholenath Shiva Shambhu. The hymn praises the divine Shiva Linga worshipped by Brahma, Vishnu, and all sages, which purifies sins, destroys suffering, and bestows supreme liberation.",
    roman_lyrics: `## Verse 1

Brahma Murari surarchita lingam
Nirmala bhasita shobhita lingam
Janmaja duhkha vinashaka lingam
Tat pranamami Sadashiva lingam

Mere Mahadeva, Bholenath Shiva Shambhu
Mere Mahadeva, Bholenath Shiva Shambhu
Mere Mahadeva, Bholenath Shiva Shambhu
Shambhu, Shambhu, Shambhu

## Verse 2

Deva muni pravararchita lingam
Kama dahana karunakara lingam
Ravana darpa vinashana lingam
Tat pranamami Sadashiva lingam

Mere Mahadeva, Bholenath Shiva Shambhu
Mere Mahadeva, Bholenath Shiva Shambhu
Mere Mahadeva, Bholenath Shiva Shambhu
Shambhu, Shambhu, Shambhu

## Verse 3

Sarva sugandha sulepita lingam
Buddhi vivardhana karana lingam
Siddha surasura vandita lingam
Tat pranamami Sadashiva lingam

Mere Mahadeva, Bholenath Shiva Shambhu
Mere Mahadeva, Bholenath Shiva Shambhu
Mere Mahadeva, Bholenath Shiva Shambhu
Shambhu, Shambhu, Shambhu

## Verse 4

Kanaka mahamani bhushita lingam
Phanipati veshtita shobhita lingam
Daksha suyajna vinashana lingam
Tat pranamami Sadashiva lingam

Mere Mahadeva, Bholenath Shiva Shambhu
Mere Mahadeva, Bholenath Shiva Shambhu
Mere Mahadeva, Bholenath Shiva Shambhu
Shambhu, Shambhu, Shambhu

## Verse 5

Kunkuma chandana lepita lingam
Pankaja haara sushobhita lingam
Sanchita paapa vinashana lingam
Tat pranamami Sadashiva lingam

Mere Mahadeva, Bholenath Shiva Shambhu
Mere Mahadeva, Bholenath Shiva Shambhu
Mere Mahadeva, Bholenath Shiva Shambhu
Shambhu, Shambhu, Shambhu

## Verse 6

Devaganarchita sevita lingam
Bhavair bhaktibhireva cha lingam
Dinakara koti prabhakara lingam
Tat pranamami Sadashiva lingam

Mere Mahadeva, Bholenath Shiva Shambhu
Mere Mahadeva, Bholenath Shiva Shambhu
Mere Mahadeva, Bholenath Shiva Shambhu
Shambhu, Shambhu, Shambhu

## Verse 7

Ashta dalopari veshtita lingam
Sarva samudbhava karana lingam
Ashta daridra vinashana lingam
Tat pranamami Sadashiva lingam

Mere Mahadeva, Bholenath Shiva Shambhu
Mere Mahadeva, Bholenath Shiva Shambhu
Mere Mahadeva, Bholenath Shiva Shambhu
Shambhu, Shambhu, Shambhu

## Verse 8

Suraguru suravara poojita lingam
Suravana pushpa sadarchita lingam
Paratparam paramatmaka lingam
Tat pranamami Sadashiva lingam

Mere Mahadeva, Bholenath Shiva Shambhu
Mere Mahadeva, Bholenath Shiva Shambhu
Mere Mahadeva, Bholenath Shiva Shambhu
Shambhu, Shambhu, Shambhu

## Phalasruti (Concluding Blessing)

Lingashtakam idam punyam
Yah pathet Shiva sannidhau
Shivalokam avapnoti
Shivena saha modate`,
    translation: `## Verse 1

Brahma Murari surarchita lingam — The Shiva Linga worshipped by Brahma, Vishnu, and all the devas,
Nirmala bhasita shobhita lingam — Resplendent with pure and spotless radiant light,
Janmaja duhkha vinashaka lingam — The Linga that destroys all sorrow born of worldly existence,
Tat pranamami Sadashiva lingam — To that sacred Sadashiva Linga, I humbly bow.

Mere Mahadeva, Bholenath Shiva Shambhu — My Mahadeva, innocent Lord Shiva Shambhu,
Mere Mahadeva, Bholenath Shiva Shambhu — My Mahadeva, innocent Lord Shiva Shambhu,
Mere Mahadeva, Bholenath Shiva Shambhu — My Mahadeva, innocent Lord Shiva Shambhu,
Shambhu, Shambhu, Shambhu — O Shambhu, Shambhu, Shambhu!

## Verse 2

Deva muni pravararchita lingam — Worshipped by sages and the foremost among celestial beings,
Kama dahana karunakara lingam — The burner of lust (Kama) and compassionate ocean of mercy,
Ravana darpa vinashana lingam — The destroyer of the arrogant pride of Ravana,
Tat pranamami Sadashiva lingam — To that sacred Sadashiva Linga, I humbly bow.

Mere Mahadeva, Bholenath Shiva Shambhu — My Mahadeva, innocent Lord Shiva Shambhu,
Mere Mahadeva, Bholenath Shiva Shambhu — My Mahadeva, innocent Lord Shiva Shambhu,
Mere Mahadeva, Bholenath Shiva Shambhu — My Mahadeva, innocent Lord Shiva Shambhu,
Shambhu, Shambhu, Shambhu — O Shambhu, Shambhu, Shambhu!

## Verse 3

Sarva sugandha sulepita lingam — Anointed with all kinds of fragrant, sweet-scented pastes,
Buddhi vivardhana karana lingam — The cause for the awakening and expansion of higher intellect,
Siddha surasura vandita lingam — Revered and worshipped by Siddhas, devas, and asuras,
Tat pranamami Sadashiva lingam — To that sacred Sadashiva Linga, I humbly bow.

Mere Mahadeva, Bholenath Shiva Shambhu — My Mahadeva, innocent Lord Shiva Shambhu,
Mere Mahadeva, Bholenath Shiva Shambhu — My Mahadeva, innocent Lord Shiva Shambhu,
Mere Mahadeva, Bholenath Shiva Shambhu — My Mahadeva, innocent Lord Shiva Shambhu,
Shambhu, Shambhu, Shambhu — O Shambhu, Shambhu, Shambhu!

## Verse 4

Kanaka mahamani bhushita lingam — Beautifully adorned with gold and precious gems,
Phanipati veshtita shobhita lingam — Encircled and glorified by the King of Serpents,
Daksha suyajna vinashana lingam — The destroyer of the sacrificial rite of King Daksha,
Tat pranamami Sadashiva lingam — To that sacred Sadashiva Linga, I humbly bow.

Mere Mahadeva, Bholenath Shiva Shambhu — My Mahadeva, innocent Lord Shiva Shambhu,
Mere Mahadeva, Bholenath Shiva Shambhu — My Mahadeva, innocent Lord Shiva Shambhu,
Mere Mahadeva, Bholenath Shiva Shambhu — My Mahadeva, innocent Lord Shiva Shambhu,
Shambhu, Shambhu, Shambhu — O Shambhu, Shambhu, Shambhu!

## Verse 5

Kunkuma chandana lepita lingam — Anointed with sacred red kunkuma and sandalwood paste,
Pankaja haara sushobhita lingam — Elegantly garlanded with necklaces of fresh lotus flowers,
Sanchita paapa vinashana lingam — The destroyer of all accumulated sins across lifetimes,
Tat pranamami Sadashiva lingam — To that sacred Sadashiva Linga, I humbly bow.

Mere Mahadeva, Bholenath Shiva Shambhu — My Mahadeva, innocent Lord Shiva Shambhu,
Mere Mahadeva, Bholenath Shiva Shambhu — My Mahadeva, innocent Lord Shiva Shambhu,
Mere Mahadeva, Bholenath Shiva Shambhu — My Mahadeva, innocent Lord Shiva Shambhu,
Shambhu, Shambhu, Shambhu — O Shambhu, Shambhu, Shambhu!

## Verse 6

Devaganarchita sevita lingam — Revered and served by the entire host of celestial beings,
Bhavair bhaktibhireva cha lingam — Worshipped with genuine emotion and unwavering devotion,
Dinakara koti prabhakara lingam — Radiant with the brilliant light of ten million suns,
Tat pranamami Sadashiva lingam — To that sacred Sadashiva Linga, I humbly bow.

Mere Mahadeva, Bholenath Shiva Shambhu — My Mahadeva, innocent Lord Shiva Shambhu,
Mere Mahadeva, Bholenath Shiva Shambhu — My Mahadeva, innocent Lord Shiva Shambhu,
Mere Mahadeva, Bholenath Shiva Shambhu — My Mahadeva, innocent Lord Shiva Shambhu,
Shambhu, Shambhu, Shambhu — O Shambhu, Shambhu, Shambhu!

## Verse 7

Ashta dalopari veshtita lingam — Resting seated upon an eight-petaled lotus pedestal,
Sarva samudbhava karana lingam — The prime cause from which all creation arises,
Ashta daridra vinashana lingam — The destroyer of all eight forms of poverty and sorrow,
Tat pranamami Sadashiva lingam — To that sacred Sadashiva Linga, I humbly bow.

Mere Mahadeva, Bholenath Shiva Shambhu — My Mahadeva, innocent Lord Shiva Shambhu,
Mere Mahadeva, Bholenath Shiva Shambhu — My Mahadeva, innocent Lord Shiva Shambhu,
Mere Mahadeva, Bholenath Shiva Shambhu — My Mahadeva, innocent Lord Shiva Shambhu,
Shambhu, Shambhu, Shambhu — O Shambhu, Shambhu, Shambhu!

## Verse 8

Suraguru suravara poojita lingam — Worshipped by Brihaspati (Guru of the gods) and the highest devas,
Suravana pushpa sadarchita lingam — Ever worshipped with celestial blossoms from divine gardens,
Paratparam paramatmaka lingam — The supreme Transcendence beyond all, the highest Self,
Tat pranamami Sadashiva lingam — To that sacred Sadashiva Linga, I humbly bow.

Mere Mahadeva, Bholenath Shiva Shambhu — My Mahadeva, innocent Lord Shiva Shambhu,
Mere Mahadeva, Bholenath Shiva Shambhu — My Mahadeva, innocent Lord Shiva Shambhu,
Mere Mahadeva, Bholenath Shiva Shambhu — My Mahadeva, innocent Lord Shiva Shambhu,
Shambhu, Shambhu, Shambhu — O Shambhu, Shambhu, Shambhu!

## Phalasruti (Concluding Blessing)

Lingashtakam idam punyam — Whoever recites this sacred Lingashtakam hymn,
Yah pathet Shiva sannidhau — In the presence and sanctuary of Lord Shiva,
Shivalokam avapnoti — Attains the divine abode of Lord Shiva,
Shivena saha modate — And rejoices eternally in communion with Lord Shiva.`,
  },

  "aise-lagi-lagan-anup-jalota": {
    title: "Aise Lagi Lagan",
    alternate_title: "Aisi Lagi Lagan · Meera Ho Gayi Magan",
    artist_version: "Anup Jalota",
    audio_url: "https://www.youtube.com/watch?v=vttjBp1jUm0",
    youtube_url: "https://www.youtube.com/watch?v=vttjBp1jUm0",
    thumbnail_url: "/images/aise-lagi-lagan-anup-jalota-thumb.jpg",
    cover_url: "/images/aise-lagi-lagan-anup-jalota-player.jpg",
    mini_cover_url: "/images/aise-lagi-lagan-anup-jalota-thumb.jpg",
    display_order: 279,
    category_slugs: [
      "krishna",
      "general",
      "satsang",
      "janmashtami",
      "bhajan",
      "devotion",
      "hindi",
    ],
    meaning:
      "Anup Jalota’s beloved Meera bhajan — such was the attachment that Meera became lost in Krishna; she wandered lane to lane singing Hari’s glories, undeterred by palace or poison cup.",
    roman_lyrics: `## Chorus

Aisi lagi lagan, Meera ho gayi magan
Woh to gali-gali Hari gun gaane lagi
Aisi lagi lagan, Meera ho gayi magan
Woh to gali-gali Hari gun gaane lagi

## Verse 1

Hai aankh woh jo Shyam ka darshan kiya kare
Hai sheesh jo Prabhu charan mein vandan kiya kare
Bekaar woh mukh hai jo rahe vyarth baaton mein
Mukh woh hai jo Hari naam ka sumiran kiya kare

Heere motiyon se nahi shobha hai haath ki
Hai haath woh jo Bhagwan ka poojan kiya kare
Heere mar kar bhi amar naam hai us jeev ka jag mein
Prabhu prem mein balidaan jo jeevan kiya kare

## Chorus

Aisi lagi lagan, Meera ho gayi magan
Woh to gali-gali Hari gun gaane lagi
Mahalon mein pali, ban ke jogan chali
Meera rani deewani kahane lagi
Aisi lagi lagan, Meera ho gayi magan

## Verse 2

Koi roke nahi, koi toke nahi
Meera Govind-Gopal gaane lagi
Baithi santom ke sang, rangi Mohan ke rang
Meera premi-pritam ko manane lagi
Woh to gali-gali Hari gun gaane lagi

## Verse 3

Rana ne vish diya, maano amrit piya
Meera sagar mein sarita samane lagi
Dukh laakhon sahe, mukh se Govind kahe
Meera Govind-Gopal gaane lagi
Woh to gali-gali Hari gun gaane lagi

## Chorus

Aisi lagi lagan, Meera ho gayi magan
Woh to gali-gali Hari gun gaane lagi
Mahalon mein pali, ban ke jogan chali
Meera rani deewani kahane lagi
Aisi lagi lagan, Meera ho gayi magan`,
    translation: `## Chorus

Such was the attachment — Meera became lost in bliss
She began singing Hari’s glories through every lane
Such was the attachment — Meera became lost in bliss
She began singing Hari’s glories through every lane

## Verse 1

Blessed is the eye that beholds Shyam
Blessed is the head that bows at the Lord’s feet
Useless is the mouth given to idle talk
Blessed is the mouth that remembers Hari’s name

Jewels do not adorn the hand — the hand that worships God does
Even dying, that soul lives on in immortal name
Who offers life itself in love for the Lord

## Chorus

Such was the attachment — Meera became lost in bliss
She began singing Hari’s glories through every lane
Raised in palaces, she went forth as a yogini
Queen Meera was called mad with love
Such was the attachment — Meera became lost in bliss

## Verse 2

None could stop her, none could hold her back
Meera sang Govind-Gopal
Seated with saints, dyed in Mohan’s colour
Meera won over her Beloved
She began singing Hari’s glories through every lane

## Verse 3

When Rana gave poison, she drank it as nectar
Meera merged into the ocean like a river
She bore countless sorrows, yet her lips said Govind
Meera sang Govind-Gopal
She began singing Hari’s glories through every lane

## Chorus

Such was the attachment — Meera became lost in bliss
She began singing Hari’s glories through every lane
Raised in palaces, she went forth as a yogini
Queen Meera was called mad with love
Such was the attachment — Meera became lost in bliss`,
  },

  "shree-radhe-govinda-shri-prakash-gossai": {
    title: "Shree Radhe Govinda Man Bhaj Le",
    alternate_title: "Shri Radhey Govinda",
    artist_version: "Shri Prakash Gossai",
    audio_url: "/audio/shree-radhe-govinda-shri-prakash-gossai.mp3",
    thumbnail_url: "/images/shree-radhe-govinda-shri-prakash-gossai-thumb.jpg",
    cover_url: "/images/shree-radhe-govinda-shri-prakash-gossai-player.jpg",
    mini_cover_url: "/images/shree-radhe-govinda-shri-prakash-gossai-thumb.jpg",
    player_cover_aspect: "square",
    display_order: 280,
    category_slugs: [
      "krishna",
      "radha",
      "general",
      "satsang",
      "janmashtami",
      "bhajan",
      "devotion",
      "hindi",
    ],
    meaning:
      "Shri Prakash Gossai — O mind, sing Radhe Govinda, Hari’s beloved name; Gopala, Nandalala. Krishna with peacock crown and kesar tilak dances every lane of Vrindavan; without Radha’s grace none may behold Shyam.",
    roman_lyrics: `## Chorus

Shri Radhe Govinda, man bhaj le Hari ka pyara naam hai
Gopala Hari ka pyara naam hai
Nandalala Hari ka pyara naam hai
Shri Radhe Govinda, man bhaj le Hari ka pyara naam hai

## Verse 1

Mor mukut sir, galban maala
Kesar tilak lagaye, kesar tilak lagaye
Mor mukut sir, galban maala
Kesar tilak lagaye, kesar tilak lagaye
Vrindavan ki kunj galin mein sabko naach nachaye
Oho sabko naach nachaye

## Chorus

Shri Radhe Govinda, man bhaj le Hari ka pyara naam hai
Gopala Hari ka pyara naam hai
Nandalala Hari ka pyara naam hai

## Verse 2

Yamuna kinare dhenu charave
Madhav madan murari, madhav madan murari
Yamuna kinare dhenu charave
Madhav madan murari, madhav madan murari
Madhur muraliya jabhi bajave
Har le sud budh saari, oho har le sud budh saari

## Chorus

Shri Radhe Govinda, man bhaj le Hari ka pyara naam hai
Gopala Hari ka pyara naam hai
Nandalala Hari ka pyara naam hai

## Verse 3

Giridhar nagar kehti Meera
Sur ko Shyamal bhaya, sur ko Shyamal bhaya
Giridhar nagar kehti Meera
Sur ko Shyamal bhaya, sur ko Shyamal bhaya
Tukaram aur Namdev ne Vitthal Vitthal gaaya
Oho Vitthal Vitthal gaaya

## Chorus

Shri Radhe Govinda, man bhaj le Hari ka pyara naam hai
Gopala Hari ka pyara naam hai
Nandalala Hari ka pyara naam hai

## Verse 4

Radha shakti bina na koi Shyamal darshan paave
Shyamal darshan paave
Radha shakti bina na koi Shyamal darshan paave
Shyamal darshan paave
Aaradhan kar Radhe Radhe, Kanha bhaage aavein
Oho Kanha bhaage aavein

## Chorus

Shri Radhe Govinda, man bhaj le Hari ka pyara naam hai
Shri Radhe Govinda, man bhaj le Hari ka pyara naam hai`,
    translation: `## Chorus

O mind, sing Radhe Govinda — Hari’s beloved name
Gopala is Hari’s beloved name
Nandalala is Hari’s beloved name
O mind, sing Radhe Govinda — Hari’s beloved name

## Verse 1

Peacock crown on His head, garland at His throat
Kesar tilak applied, kesar tilak applied
Peacock crown on His head, garland at His throat
Kesar tilak applied, kesar tilak applied
In every bower-lane of Vrindavan He makes all dance
Oh, He makes all dance

## Chorus

O mind, sing Radhe Govinda — Hari’s beloved name
Gopala is Hari’s beloved name
Nandalala is Hari’s beloved name

## Verse 2

On the Yamuna bank He grazes the cows
Madhav, Madan Murari, Madhav, Madan Murari
On the Yamuna bank He grazes the cows
Madhav, Madan Murari, Madhav, Madan Murari
When He plays the sweet flute
All worldly wisdom is swept away, oh all worldly wisdom is swept away

## Chorus

O mind, sing Radhe Govinda — Hari’s beloved name
Gopala is Hari’s beloved name
Nandalala is Hari’s beloved name

## Verse 3

Meera of Giridhar says
Sur was won over by Shyam, Sur was won over by Shyam
Meera of Giridhar says
Sur was won over by Shyam, Sur was won over by Shyam
Tukaram and Namdev sang Vitthal Vitthal
Oh Vitthal Vitthal they sang

## Chorus

O mind, sing Radhe Govinda — Hari’s beloved name
Gopala is Hari’s beloved name
Nandalala is Hari’s beloved name

## Verse 4

Without Radha’s grace none may behold Shyam
None may behold Shyam
Without Radha’s grace none may behold Shyam
None may behold Shyam
Worship Radhe Radhe — and Kanha comes running
Oh Kanha comes running

## Chorus

O mind, sing Radhe Govinda — Hari’s beloved name
O mind, sing Radhe Govinda — Hari’s beloved name`,
  },

  "lingashtakam-dwadasha-jyotirlinga-pandit-rajin": {
    title: "Shiva Lingam",
    alternate_title: "",
    artist_version: "Pandit Rajin",
    audio_url: "https://www.youtube.com/watch?v=hcNxM7fSMAA",
    youtube_url: "https://www.youtube.com/watch?v=hcNxM7fSMAA",
    thumbnail_url: "/images/lingashtakam-pandit-rajin-thumb.jpg",
    cover_url: "/images/lingashtakam-pandit-rajin-player.jpg",
    mini_cover_url: "/images/lingashtakam-pandit-rajin-thumb.jpg",
    display_order: 281,
    category_slugs: [
      "shiva",
      "general",
      "satsang",
      "bhajan",
      "mantra",
      "devotion",
      "protection",
      "peace",
      "shivratri",
      "morning-prayer",
      "evening-prayer",
      "sanskrit",
    ],
    meaning:
      "Opens with the Dwadasha Jyotirlinga mantra naming all twelve sacred Shiva shrines, then Adi Shankaracharya’s Lingashtakam — each verse followed by Om Namah Shivaya. Pandit Rajin’s Shiva Lingam recording.",
    roman_lyrics: `## Opening — Dwadasha Jyotirlinga Mantra

Saurashtre Somanatham cha Srisaile Mallikarjunam
Ujjainyam Mahakalam Omkaretvam Amaleshvaram
Paralyam Vaidyanatham cha Dakinyam Bhimashankaram
Setubandhe tu Ramesham Nagesham Darukavane
Varanasyam tu Vishvesham Trayambakam Gautamitate
Himalaye tu Kedaram Ghrishnesham cha Vishalake

Om Namah Shivaya
Om Namah Shivaya
Om Namah Shivaya

## Verse 1

Brahma Muraari Surarchita Lingam
Nirmala Bhaashita Sobhitha Lingam
Janmaja Dhukha Vinaasaha Lingam
Tatpranamaami Sadaashiva Lingam

Om Namah Shivaya
Om Namah Shivaya
Om Namah Shivaya

## Verse 2

Devamuni Pravaraarchita Lingam
Kaama Dahana Karunaakara Lingam
Ravana Darpa Vinaasaha Lingam
Tatpranamaami Sadaashiva Lingam

Om Namah Shivaya
Om Namah Shivaya
Om Namah Shivaya

## Verse 3

Sarva Sugandha Sulepitha Lingam
Buddhi Vivaardhana Kaarana Lingam
Siddha Suraasura Vandhitha Lingam
Tatpranamaami Sadaashiva Lingam

Om Namah Shivaya
Om Namah Shivaya
Om Namah Shivaya

## Verse 4

Kanaga Mahaamani Bhooshitha Lingam
Panipati Veshthitha Sobitha Lingam
Daksha Suyajna Vinaasana Lingam
Tatpranamaami Sadaashiva Lingam

Om Namah Shivaya
Om Namah Shivaya
Om Namah Shivaya

## Verse 5

Kunkuma Chandhana Lehpitha Lingam
Pankaja Haara Susobhitha Lingam
Sanchitha Paapa Vinaashana Lingam
Tatpranamaami Sadaashiva Lingam

Om Namah Shivaya
Om Namah Shivaya
Om Namah Shivaya

## Verse 6

Deva Ganaarchita Sevitha Lingam
Bhavair Bhakhi Bhirevacha Lingam
Dinakara Koti Prabhaakara Lingam
Tatpranamaami Sadaashiva Lingam

Om Namah Shivaya
Om Namah Shivaya
Om Namah Shivaya

## Verse 7

Ahshta Dalopari Veshthitha Lingam
Sarva Samudbhava Kaarana Lingam
Ahshta Daridra Vinaasana Lingam
Tatpranamaami Sadaashiva Lingam

Om Namah Shivaya
Om Namah Shivaya
Om Namah Shivaya

## Verse 8

Suraguru Suravara Poojitha Lingam
Suravana Pushpa Sadarchitha Lingam
Paraath Param Paramatmaka Lingam
Tatpranamaami Sadaashiva Lingam

Om Namah Shivaya
Om Namah Shivaya
Om Namah Shivaya

## Phalasruti (Concluding Blessing)

Lingashtaka Midam Punyam
Yah Pathet Sivasannidhau
Sivaloka Mahaapnoti
Sivehna Saha Modatheh`,
    translation: `## Opening — Dwadasha Jyotirlinga Mantra

In Saurashtra, Somnath — Lord of the Moon; on holy Srisailam, Mallikarjuna crowned with jasmine
In Ujjain, Mahakal — master of time; where Om resounds, Amaleshwar — the eternal Lord
At Parali, Vaidyanath — divine healer; in the Dakini forest, Bhimashankar
At the sea-bridge, Rameshwar — worshipped by Rama; Nageshwar, Lord of serpents, in Daruka's woods
In Kashi, Vishwanath — sovereign of the universe; Trimbakeshwar on the sacred Gautami bank
In the Himalayas, Kedarnath; Ghrishneshwar — Lord of the radiant shrine, O infinite One

Om — salutations to Shiva
Om — salutations to Shiva
Om — salutations to Shiva

## Verse 1

The Linga worshipped by Brahma, Vishnu, and all the devas
Resplendent with pure and spotless radiant light
The Linga that destroys all sorrow born of worldly existence
To that sacred Sadashiva Linga, I humbly bow

Om — salutations to Shiva
Om — salutations to Shiva
Om — salutations to Shiva

## Verse 2

Worshipped by sages and the foremost among celestial beings
The burner of lust and compassionate ocean of mercy
The destroyer of the arrogant pride of Ravana
To that sacred Sadashiva Linga, I humbly bow

Om — salutations to Shiva
Om — salutations to Shiva
Om — salutations to Shiva

## Verse 3

Anointed with all kinds of fragrant, sweet-scented pastes
The cause for the awakening and expansion of higher intellect
Revered and worshipped by Siddhas, devas, and asuras
To that sacred Sadashiva Linga, I humbly bow

Om — salutations to Shiva
Om — salutations to Shiva
Om — salutations to Shiva

## Verse 4

Beautifully adorned with gold and precious gems
Encircled and glorified by the King of Serpents
The destroyer of the sacrificial rite of King Daksha
To that sacred Sadashiva Linga, I humbly bow

Om — salutations to Shiva
Om — salutations to Shiva
Om — salutations to Shiva

## Verse 5

Anointed with sacred red kunkuma and sandalwood paste
Elegantly garlanded with necklaces of fresh lotus flowers
The destroyer of all accumulated sins across lifetimes
To that sacred Sadashiva Linga, I humbly bow

Om — salutations to Shiva
Om — salutations to Shiva
Om — salutations to Shiva

## Verse 6

Revered and served by the entire host of celestial beings
Worshipped with genuine emotion and unwavering devotion
Radiant with the brilliant light of ten million suns
To that sacred Sadashiva Linga, I humbly bow

Om — salutations to Shiva
Om — salutations to Shiva
Om — salutations to Shiva

## Verse 7

Resting seated upon an eight-petaled lotus pedestal
The prime cause from which all creation arises
The destroyer of all eight forms of poverty and sorrow
To that sacred Sadashiva Linga, I humbly bow

Om — salutations to Shiva
Om — salutations to Shiva
Om — salutations to Shiva

## Verse 8

Worshipped by Brihaspati and the highest devas
Ever worshipped with celestial blossoms from divine gardens
The supreme Transcendence beyond all, the highest Self
To that sacred Sadashiva Linga, I humbly bow

Om — salutations to Shiva
Om — salutations to Shiva
Om — salutations to Shiva

## Phalasruti (Concluding Blessing)

This sacred Lingashtakam hymn is meritorious
Whoever recites it in Shiva’s presence
Attains the great realm of Shiva
And rejoices together with Shiva`,
  },

  "om-namah-shivaya-shiv-dhun-agam-aggarwal": {
    title: "Om Namah Shivaya",
    alternate_title: "Shiv Dhun · Hara Hara Bole Namah Shivaya",
    artist_version: "Agam Aggarwal",
    audio_url: "https://www.youtube.com/watch?v=WBzeTz_UpQ4",
    youtube_url: "https://www.youtube.com/watch?v=WBzeTz_UpQ4",
    thumbnail_url:
      "/images/om-namah-shivaya-shiv-dhun-agam-aggarwal-thumb.jpg",
    cover_url: "/images/om-namah-shivaya-shiv-dhun-agam-aggarwal-player.jpg",
    mini_cover_url:
      "/images/om-namah-shivaya-shiv-dhun-agam-aggarwal-thumb.jpg",
    display_order: 282,
    category_slugs: [
      "shiva",
      "general",
      "satsang",
      "bhajan",
      "mantra",
      "devotion",
      "protection",
      "peace",
      "shivratri",
      "morning-prayer",
      "evening-prayer",
      "hindi",
    ],
    meaning:
      "Agam Aggarwal’s Shiv dhun — Om Namah Shivaya with Hara Hara Bole, praising Shiva’s qualities and the Jyotirlingas at Rameshwaram, Somnath, Kashi, and Ujjain. A prayer for strength in difficult times, especially at prarthana when someone passes away.",
    roman_lyrics: `## Opening

Om Namah Shivaya Om Namah Shivaya, Hara Hara Bole Namah Shivaya

## Verse 1 — Rameshwara

Rameshwara Shiva Rameshwara, Hara Hara Bole Namah Shivaya
Rameshwara Shiva Rameshwara, Hara Hara Bole Namah Shivaya
Om Namah Shivaya Om Namah Shivaya, Hara Hara Bole Namah Shivaya

## Verse 2 — Ganga Dhara

Ganga Dhara Shiva Ganga Dhara, Hara Hara Bole Namah Shivaya
Jatadhara Shiva Jatadhara, Hara Hara Bole Namah Shivaya
Om Namah Shivaya Om Namah Shivaya, Hara Hara Bole Namah Shivaya

## Verse 3 — Someshwara

Someshwara Shiva Someshwara, Hara Hara Bole Namah Shivaya
Vishweshvara Shiva Vishweshvara, Hara Hara Bole Namah Shivaya
Om Namah Shivaya Om Namah Shivaya, Hara Hara Bole Namah Shivaya

## Verse 4 — Koteshwara

Koteshwara Shiva Koteshwara, Hara Hara Bole Namah Shivaya
Mahakaleshvara Mahakaleshvara, Hara Hara Bole Namah Shivaya
Om Namah Shivaya Om Namah Shivaya, Hara Hara Bole Namah Shivaya`,
    translation: `## Opening

I bow to the supreme Lord Shiva, the one who destroys all miseries in the world

## Verse 1 — Rameshwara

I bow to the One worshipped by Sri Rama to attain victory over evil
I bow to the One worshipped by Sri Rama to attain victory over evil
Manifested as a Jyotirlinga in the holy city of Rameshwaram

## Verse 2 — Ganga Dhara

He who bears the Ganga upon his head — Hara Hara, salutations to Shiva
He whose hair is matted with sacred locks — Hara Hara, salutations to Shiva
I bow to the One who holds the river Ganga in his long dreadlock hair

## Verse 3 — Someshwara

Someshwara — Lord who wears the crescent moon — Hara Hara, salutations to Shiva
Vishwanath — Lord of the universe, Jyotirlinga of Kashi — Hara Hara, salutations to Shiva
I bow to the Master of the entire cosmos — Om, salutations to Shiva

## Verse 4 — Koteshwara

Koteshwara — the One who has everything — Hara Hara, salutations to Shiva
Mahakaleshwar — greater than time itself, with no beginning nor end — Hara Hara, salutations to Shiva
Om — salutations to Shiva; Hara Hara — chant the name of Shiva`,
  },

  "mere-man-mein-bhi-ram-bajao-bhakti": {
    title: "Mere Man Mein Bhi Ram",
    alternate_title: "Mere Tan Mein Bhi Ram · Ram Dhun",
    artist_version: "Unknown",
    audio_url: "https://www.youtube.com/watch?v=szQpDafLUJQ",
    youtube_url: "https://www.youtube.com/watch?v=szQpDafLUJQ",
    thumbnail_url: "/images/mere-man-mein-bhi-ram-bajao-bhakti-thumb.jpg",
    cover_url: "/images/mere-man-mein-bhi-ram-bajao-bhakti-player.jpg",
    mini_cover_url: "/images/mere-man-mein-bhi-ram-bajao-bhakti-thumb.jpg",
    display_order: 283,
    category_slugs: [
      "ram",
      "general",
      "satsang",
      "bhajan",
      "devotion",
      "hindi",
      "ram-navami",
      "morning-prayer",
      "evening-prayer",
    ],
    meaning:
      "A Ram dhun celebrating that the Lord dwells in body, mind, breath, moon, sun, stars, and every heart — from Bhilni and Meera to Sita and Radha. Kirtan recording from Bajao Bhakti.",
    roman_lyrics: `## Chorus

Mere man mein bhi Ram, mere tan mein bhi Ram
Rom rom mein samaya tera naam re
Meri saanso mein tera hi naam re

## Verse 1

Jaise chanda mein Ram, jaise suraj mein Ram
Ambar taaron mein samaya tera naam re
Meri saanso mein tera hi naam re

## Verse 2

Jaise Bhilni ke Ram, jaise Meera ke Shyam
Nar nari mein samaya tera naam re
Meri saanso mein tera hi naam re

## Verse 3

Jaise Sita ke Ram, jaise Radha ke Shyam
Patte patte mein samaya tera naam re
Meri saanso mein tera hi naam re

## Chorus

Mere man mein bhi Ram, mere tan mein bhi Ram
Rom rom mein samaya tera naam re
Meri saanso mein tera hi naam re`,
    translation: `## Chorus

In my mind too is Ram, in my body too is Ram
In every pore is woven your name
In my every breath is only your name

## Verse 1

As in the moon is Ram, as in the sun is Ram
In the sky and stars is woven your name
In my every breath is only your name

## Verse 2

As Bhilni's Ram, as Meera's Shyam
In every man and woman is woven your name
In my every breath is only your name

## Verse 3

As Sita's Ram, as Radha's Shyam
In every leaf is woven your name
In my every breath is only your name

## Chorus

In my mind too is Ram, in my body too is Ram
In every pore is woven your name
In my every breath is only your name`,
  },

  "namo-mahadeo-shri-prakash-gossai": {
    title: "Namo Mahadeo",
    alternate_title: "Namo Mahadev Shambhu · Jai Shiv Shankar Om",
    artist_version: "Shri Prakash Gossai",
    audio_url: "/videos/namo-mahadeo-shri-prakash-gossai.mp4",
    thumbnail_url: "/images/namo-mahadeo-shri-prakash-gossai-thumb.jpg",
    cover_url: "/images/namo-mahadeo-shri-prakash-gossai-player.jpg",
    mini_cover_url: "/images/namo-mahadeo-shri-prakash-gossai-thumb.jpg",
    display_order: 284,
    category_slugs: [
      "shiva",
      "general",
      "satsang",
      "bhajan",
      "mantra",
      "devotion",
      "hindi",
      "shivratri",
      "morning-prayer",
      "evening-prayer",
    ],
    meaning:
      "Shri Prakash Gossai’s Shiva kirtan — salutations to Mahadev Shambhu, Uma Maheshwar, Gauri Manohar, Ganga-dhari Neelkanth, Nataraj, and Kailashwar. Opening 30 seconds trimmed so the bhajan starts at once.",
    roman_lyrics: `## Chorus

Namo Mahadev Shambhu Om
Namo sada Shiv Om
Jai Parmeshwar Jai Bhuvaneshwar
Jai Shiv Shankar Om

## Verse 1

Bhavani Shankar uma Maheshwar
Girija Shankar Om
Jai Pralayankar Jai Pitamber
Jai Shiv Shankar Om

## Chorus

Namo Mahadev Shambhu Om
Namo sada Shiv Om
Jai Parmeshwar Jai Bhuvaneshwar
Jai Shiv Shankar Om

## Verse 2

Har Har Mahadev Gauree Manohar
Har Shiv Shankar Om
Dukh Har Lekar Sukh Bhar Dekar
Jai Shiv Shankar Om

## Chorus

Namo Mahadev Shambhu Om
Namo sada Shiv Om
Jai Parmeshwar Jai Bhuvaneshwar
Jai Shiv Shankar Om

## Verse 3

Parvati Shankar Ganga Jata Dhar
Karuna Shankar Om
Neel Kanth Dhar Akhileshwar Dhar
Jai Shiv Shankar Om

## Chorus

Namo Mahadev Shambhu Om
Namo sada Shiv Om
Jai Parmeshwar Jai Bhuvaneshwar
Jai Shiv Shankar Om

## Verse 4

Jai Shiv Shankar Natraj Sundar
Har Har Shankar Om
Jai Damaru Var Jai Kailashwar
Jai Shiv Shankar Om

## Chorus

Namo Mahadev Shambhu Om
Namo sada Shiv Om
Jai Parmeshwar Jai Bhuvaneshwar
Jai Shiv Shankar Om

## Closing

Jai Shiv Shankar Om
Jai Shiv Shankar Om
Jai Shiv Shankar Om
Jai Shiv Shankar Om`,
    translation: `## Chorus

I bow to the great Lord, innocent Shiva — Om
I bow to Shiva forever and always — Om
Glory to the Supreme Lord, glory to the Lord of all the worlds
Glory to Shiva, the doer of good — Om

## Verse 1

Lord united with Bhavani and Uma, the great God among gods
Lord of Girija, she who was born of the mountain — Om
Glory to the destroyer at the end of time, glory to him robed in yellow
Glory to Shiva, the doer of good — Om

## Chorus

I bow to the great Lord, innocent Shiva — Om
I bow to Shiva forever and always — Om
Glory to the Supreme Lord, glory to the Lord of all the worlds
Glory to Shiva, the doer of good — Om

## Verse 2

Hail Mahadev again and again, beloved enchanter of fair Gauri
Hail Shiva, the doer of good — Om
Taking away every pain and filling life with joy
Glory to Shiva, the doer of good — Om

## Chorus

I bow to the great Lord, innocent Shiva — Om
I bow to Shiva forever and always — Om
Glory to the Supreme Lord, glory to the Lord of all the worlds
Glory to Shiva, the doer of good — Om

## Verse 3

Parvati’s Lord, with the Ganga flowing through his matted locks
Compassionate Lord — Om
Blue-throated Lord, sovereign of all creation
Glory to Shiva, the doer of good — Om

## Chorus

I bow to the great Lord, innocent Shiva — Om
I bow to Shiva forever and always — Om
Glory to the Supreme Lord, glory to the Lord of all the worlds
Glory to Shiva, the doer of good — Om

## Verse 4

Glory to Shiva the dancer, beautiful king of dance
Hail, hail Shankar — Om
Glory to the Lord of the hand-drum, glory to Lord of Mount Kailash
Glory to Shiva, the doer of good — Om

## Chorus

I bow to the great Lord, innocent Shiva — Om
I bow to Shiva forever and always — Om
Glory to the Supreme Lord, glory to the Lord of all the worlds
Glory to Shiva, the doer of good — Om

## Closing

Glory to Shiva, the doer of good — Om
Glory to Shiva, the doer of good — Om
Glory to Shiva, the doer of good — Om
Glory to Shiva, the doer of good — Om`,
  },

  "cheer-ke-chaati-shri-prakash-gossai": {
    title: "Cheer Ke Chaati",
    alternate_title: "",
    artist_version: "Shri Prakash Gossai",
    audio_url: "/audio/cheer-ke-chaati-shri-prakash-gossai.mp3",
    thumbnail_url: "/images/cheer-ke-chaati-shri-prakash-gossai-thumb.jpg",
    cover_url: "/images/cheer-ke-chaati-shri-prakash-gossai-player.jpg",
    mini_cover_url: "/images/cheer-ke-chaati-shri-prakash-gossai-thumb.jpg",
    display_order: 285,
    category_slugs: [
      "hanuman",
      "ram",
      "sita",
      "general",
      "satsang",
      "bhajan",
      "devotion",
      "hindi",
      "hanuman-jayanti",
    ],
    meaning:
      "From Shri Prakash Gossai’s Bhiksha Ya Dhaan — Hanuman tears open his chest and shows Ram dwelling in mind and body. A beloved kirtan also recorded by Anup Jalota, telling how Hanuman carried Ram’s message to Sita, brought the mountain for Lakshman, and burned Lanka.",
    roman_lyrics: `## Opening

Cheer ke chhatee bole apnee
Bole Pawan putra Hanumaan
Mere man me basay hai Raam, mere tan me basay hai Raam

## Verse 1

Seeta haran kiya Ravan ne, Prabhujee the akulaye
Hanumaan ne Sitajee ko, prabhu sandesh sunaye
Hanumaan ji karte aye, Prabhu ji ke gungaan
Bole Pawan putra Hanumaan
Mere man me basay hai Raam, mere tan me basay hai Raam

## Verse 2

Lagee Lakshman ji ko shakti, dekh prabhu ghabraye
Bhor se pehale Hanumaanji, daulaa girle aye
Uth baithe Lakshman ji lekar, Shri Ram ka naam
Bole Pawan putra Hanumaan
Mere man me basay hai Raam, mere tan me basay hai Raam

## Verse 3

Vaanar sena dekh ke Ravan, ki sena ghabraye
Palak jhapakte Hanumat ne, Lanka me aag lagaaeee
Bole prabhu ke saath mitaakar, Ravan ka abhimaan
Bole Pawan putra Hanumaan
Mere man me basay hai Raam, mere tan me basay hai Raam`,
    translation: `## Opening

Tearing open his chest, he declares
Hanuman, son of the wind, proclaims
Ram dwells in my mind, Ram dwells in my body

## Verse 1

When Ravan kidnapped Sita, the Lord was restless with grief
Hanuman brought the Lord’s message to Sitaji
Hanuman came singing the glories of the Lord
Hanuman, son of the wind, proclaims
Ram dwells in my mind, Ram dwells in my body

## Verse 2

When Lakshman was struck down, the Lord was deeply troubled
Before dawn Hanuman brought the whole mountain
Lakshman rose again, taking Shri Ram’s name
Hanuman, son of the wind, proclaims
Ram dwells in my mind, Ram dwells in my body

## Verse 3

Seeing the army of monkeys, Ravan’s army was seized with fear
In the blink of an eye Hanuman set Lanka ablaze
With the Lord beside him he destroyed Ravan’s pride
Hanuman, son of the wind, proclaims
Ram dwells in my mind, Ram dwells in my body`,
  },

  "prem-ki-ganga-mukesh": {
    title: "Prem Ki Ganga",
    alternate_title: "Jyot Se Jyot Jagate Chalo · Sant Gyaneshwar (1964)",
    artist_version: "Mukesh",
    audio_url: "/audio/prem-ki-ganga-mukesh.mp3",
    thumbnail_url: "/images/prem-ki-ganga-mukesh-thumb.jpg",
    cover_url: "/images/prem-ki-ganga-mukesh-player.jpg",
    mini_cover_url: "/images/prem-ki-ganga-mukesh-thumb.jpg",
    display_order: 286,
    category_slugs: [
      "general",
      "satsang",
      "bhajan",
      "devotion",
      "peace",
      "hindi",
      "morning-prayer",
    ],
    meaning:
      "Mukesh’s beloved song from Sant Gyaneshwar (1964, Laxmikant–Pyarelal, Bharat Vyas) — keep lighting lamp from lamp, let the river of love flow, embrace the poor and suffering, and turn this earth into paradise.",
    roman_lyrics: `## Chorus

Jyot se jyot jagate chalo
Prem ki ganga bahate chalo
Raah me aaye jo deen dukhi
Sabako gale se lagate chalo

## Verse 1

Kaun hai ucha kaun hai neecha
Sab me wohi samaya
Bhed bhav ke jhuthe bharam me
Ye maanav bharmaya
Dharam dhwaja dharam dhwaja fehraate chalo
Prem ki ganga bahate chalo

## Chorus

Jyot se jyot jagate chalo
Prem ki ganga bahate chalo
Raah me aaye jo deen dukhi
Sabako gale se lagate chalo

## Verse 2

Sare jag ke kan kan me hai
Divy amar ek aatma
Ek brahm hai ek satya hai
Ek hi hai parmatma
Prano se pran prano se pran milate chalo
Prem ki ganga bahate chalo

## Chorus

Jyot se jyot jagate chalo
Prem ki ganga bahate chalo
Raah me aaye jo deen dukhi
Sabako gale se lagate chalo

## Verse 3

Jiska na koi sangi sathi
Ishvar hai rakhavala
Jo nirdhan hai jo nirbal hai
Vah hai prabhu ka pyara
Pyar ke moti pyar ke moti lutate chalo
Prem ki ganga bahate chalo

## Chorus

Jyot se jyot jagate chalo
Prem ki ganga bahate chalo
Raah me aaye jo deen dukhi
Sabako gale se lagate chalo

## Verse 4

Asha tuti mamata ruthi
Chhut gaya hai kinara
Band karo mat dwar daya ka
De do kuchh to sahara
Deep daya ka deep daya ka jalate chalo
Prem ki ganga bahate chalo

## Chorus

Jyot se jyot jagate chalo
Prem ki ganga bahate chalo
Raah me aaye jo deen dukhi
Sabako gale se lagate chalo

## Verse 5

Chhaya hai charo aur andhera
Bhatak gai hai dishaye
Manav ban baitha hai danav
Kisko vyatha sunae
Dharati ko svarg dharati ko svarg banate chalo
Prem ki ganga bahate chalo

## Closing

Jyot se jyot jagate chalo
Prem ki ganga bahate chalo
Jyot se jyot jagate chalo
Prem ki ganga bahate chalo`,
    translation: `## Chorus

Keep lighting lamp from lamp
Keep the river of love flowing
Whoever on the path is poor and suffering
Embrace them all

## Verse 1

Who is high and who is low
In all, that same One dwells
Lost in false division and prejudice
Humanity has gone astray
Raise the banner of dharma, raise it high
Keep the river of love flowing

## Chorus

Keep lighting lamp from lamp
Keep the river of love flowing
Whoever on the path is poor and suffering
Embrace them all

## Verse 2

In every particle of the world
Lives one divine immortal soul
One Brahman, one Truth
One God alone is the Supreme
Let breath mingle with breath
Keep the river of love flowing

## Chorus

Keep lighting lamp from lamp
Keep the river of love flowing
Whoever on the path is poor and suffering
Embrace them all

## Verse 3

Who has no companion or friend
God is their protector
Who is poor, who is weak
They are beloved of the Lord
Scatter pearls of love, scatter pearls of love
Keep the river of love flowing

## Chorus

Keep lighting lamp from lamp
Keep the river of love flowing
Whoever on the path is poor and suffering
Embrace them all

## Verse 4

Hope is broken, affection turned away
The shore has slipped away
Do not close the door of mercy
Give some shelter at least
Light the lamp of compassion, light the lamp of compassion
Keep the river of love flowing

## Chorus

Keep lighting lamp from lamp
Keep the river of love flowing
Whoever on the path is poor and suffering
Embrace them all

## Verse 5

Darkness surrounds on every side
Directions have lost their way
Man has become a demon
To whom can he tell his pain
Make this earth a paradise, make this earth a paradise
Keep the river of love flowing

## Closing

Keep lighting lamp from lamp
Keep the river of love flowing
Keep lighting lamp from lamp
Keep the river of love flowing`,
  },

  "vera-hanuman-suresh-maraj": {
    title: "Vera Hanuman",
    alternate_title: "Beera Hanuman · Veera Hanumana Ati Balwana",
    artist_version: "Suresh Maraj",
    audio_url: "https://www.youtube.com/watch?v=dG21VijMWY0",
    youtube_url: "https://www.youtube.com/watch?v=dG21VijMWY0",
    thumbnail_url: "/images/vera-hanuman-suresh-maraj-thumb.jpg",
    cover_url: "/images/vera-hanuman-suresh-maraj-player.jpg",
    mini_cover_url: "/images/vera-hanuman-suresh-maraj-thumb.jpg",
    display_order: 288,
    category_slugs: [
      "hanuman",
      "hanuman-jayanti",
      "general",
      "satsang",
      "bhajan",
      "devotion",
      "hindi",
    ],
    meaning:
      "Suresh Maraj — from Pawan Putra Hanuman. Opens with the satsang jai (Siyapati Ramchandra…), then praise of brave, mighty Hanuman: absorbed in Ram’s name, dwelling in the Lord’s heart, he hears every plea, removes distress and scarcity, and answers with grace — Ram’s beloved, Siya’s dear one.",
    roman_lyrics: `## Opening

Bolo Siyapati Ramchandra Ki Jai
Bolo Pavan Suta Hanuman Ki Jai

## Chorus

Vera Hanumana ati balwana
Ram naam rasio re
Prabhu man basio re

## Verse 1

Jo koi aave, araj lagaave
Sabki sunio re
Prabhu man basio re

## Chorus

Vera Hanumana ati balwana
Ram naam rasio re
Prabhu man basio re

## Verse 2

Bajrang bala pheru thari mala
Sankat hario re
Prabhu man basio re

## Chorus

Vera Hanumana ati balwana
Ram naam rasio re
Prabhu man basio re

## Verse 3

Na koi sangi, haath ki tangi
Jaldi hario re
Prabhu man basio re

## Chorus

Vera Hanumana ati balwana
Ram naam rasio re
Prabhu man basio re

## Verse 4

Arji hamari, marzi tumhari
Kripa kario re
Prabhu man basio re

## Chorus

Vera Hanumana ati balwana
Ram naam rasio re
Prabhu man basio re

## Verse 5

Ramji ka pyara, Siya ka dulara
Sankat hario re
Prabhu man basio re

## Chorus

Vera Hanumana ati balwana
Ram naam rasio re
Prabhu man basio re`,
    translation: `## Opening

Glory to Siyapati Ramchandra
Glory to Pavan Suta Hanuman

## Chorus

Brave Hanuman, mighty in strength
Absorbed in the nectar of Ram’s name
Dwelling in the Lord’s heart

## Verse 1

Whoever comes and lays a plea
You hear them all
Dwelling in the Lord’s heart

## Chorus

Brave Hanuman, mighty in strength
Absorbed in the nectar of Ram’s name
Dwelling in the Lord’s heart

## Verse 2

O Bajrangbala, I turn Your mala
Remove my troubles
Dwelling in the Lord’s heart

## Chorus

Brave Hanuman, mighty in strength
Absorbed in the nectar of Ram’s name
Dwelling in the Lord’s heart

## Verse 3

I have no companion, my hands are empty
Quickly remove this hardship
Dwelling in the Lord’s heart

## Chorus

Brave Hanuman, mighty in strength
Absorbed in the nectar of Ram’s name
Dwelling in the Lord’s heart

## Verse 4

Our plea is ours, Your will is Yours
Grant Your grace
Dwelling in the Lord’s heart

## Chorus

Brave Hanuman, mighty in strength
Absorbed in the nectar of Ram’s name
Dwelling in the Lord’s heart

## Verse 5

Ram’s beloved, Siya’s dear one
Remove my troubles
Dwelling in the Lord’s heart

## Chorus

Brave Hanuman, mighty in strength
Absorbed in the nectar of Ram’s name
Dwelling in the Lord’s heart`,
  },

  "jai-jai-ambe-bhavani-maa-shri-prakash-gossai": {
    title: "Jai Jai Ambe Bhavani Maa",
    alternate_title: "Durga Bhajans",
    artist_version: "Shri Prakash Gossai",
    audio_url: "https://www.youtube.com/watch?v=n1ZWguIZWN8",
    thumbnail_url: "/images/albums/durga-bhajans-shri-prakash-gossai.png",
    cover_url: "/images/albums/durga-bhajans-shri-prakash-gossai-player.png",
    mini_cover_url: "/images/albums/durga-bhajans-shri-prakash-gossai.png",
    display_order: 287,
    category_slugs: [
      "durga",
      "navratri",
      "general",
      "satsang",
      "bhajan",
      "devotion",
      "hindi",
    ],
    meaning:
      "Shri Prakash Gossai — from Durga Bhajans. A simple Navratri kirtan: the whole bhajan is the refrain “Jai Jai Ambe Bhavani”, sung again and again.",
    roman_lyrics: `## Refrain

Jai Jai Ambe Bhavani
Jai Jai Ambe Bhavani
Jai Jai Ambe Bhavani
Jai Jai Ambe Bhavani
Jai Jai Ambe Bhavani
Jai Jai Ambe Bhavani
Jai Jai Ambe Bhavani
Jai Jai Ambe Bhavani`,
    translation: `## Refrain

Victory, victory to Ambe Bhavani
Victory, victory to Ambe Bhavani
Victory, victory to Ambe Bhavani
Victory, victory to Ambe Bhavani
Victory, victory to Ambe Bhavani
Victory, victory to Ambe Bhavani
Victory, victory to Ambe Bhavani
Victory, victory to Ambe Bhavani`,
  },

  "andhiyare-sabhi-mit-rahe-shyama-chitar": {
    title: "Andhiyare Sabhi Mit Rahe",
    alternate_title: "Gyan Surya Phir Se · Shiv Pyara Aa Gaya",
    artist_version: "Shyama Chitar",
    audio_url: "https://www.youtube.com/watch?v=VLckCl0TUik",
    youtube_url: "https://www.youtube.com/watch?v=VLckCl0TUik",
    thumbnail_url: "/images/andhiyare-sabhi-mit-rahe-shyama-chitar-thumb.jpg",
    cover_url: "/images/andhiyare-sabhi-mit-rahe-shyama-chitar-player.jpg",
    mini_cover_url: "/images/andhiyare-sabhi-mit-rahe-shyama-chitar-thumb.jpg",
    display_order: 289,
    category_slugs: [
      "shiva",
      "shivratri",
      "general",
      "satsang",
      "bhajan",
      "devotion",
      "hindi",
    ],
    meaning:
      "Brahma Kumaris bhajan sung by Shyama Chitar (with BK Mohan and Minu Purshottam). Darkness lifts as the sun of knowledge rises again — beloved Shiv comes as helper, shore, and light for every lost soul.",
    roman_lyrics: `## Chorus

Andhiyare sabhi mit rahe
Ujiyara aa gaya
Gyan surya phir se
Shiv pyara aa gaya

## Verse 1

Sansaar fasaa huwaa thaa
Vikaaro ke jaal main
Har manav bandha huwa tha
Dukh ke janjaal main
Har aatmaa kaa phir-se
Har aatmaa kaa phir-se
Vo sahara aa gaya
Gyan surya phir se
Shiv pyara aa gaya

## Chorus

Andhiyare sabhi mit rahe

## Verse 2

Vikaaro ke sagar main
Is jaga ki-naav thi
Iswar, bachawo aakar
Ati aa-waaz thi
Har nav ko bachaane
Har nav ko bachaane
Vo kinara aa gaya
Gyan surya phir se
Shiv pyara aa gaya

## Chorus

Andhiyare sabhi mit rahe

## Verse 3

Andhakar main-thay bhatake
Millathi na raa-ha thi
Param-aatma ko paaye
Sab ki yeh chaa-ha thi
Har jyoti, ko jagaane
Har jyoti, ko jagaane
Vo dubaara aa gaya
Gyan surya phir se
Shiv pyara aa gaya

## Closing

Andhiyare sabhi mit rahe
Ujiyara aa gaya
Gyan surya phir se
Shiv pyara aa gaya
Shiv pyara aa gaya
Shiv pyara aa gaya`,
    translation: `## Chorus

Darkness is going away
Light is coming
Sun of knowledge again
Loved one Shiv came

## Verse 1

The whole world was stuck
In the web of vices
Every human being was bound
In the tangle of sorrow
For every soul again
For every soul again
That helper has come
Sun of knowledge again
Loved one Shiv came

## Chorus

Darkness is going away

## Verse 2

In the ocean of vices
The boat of this world was
God, come and save us
That was the cry
To save every boat
To save every boat
That shore has come
Sun of knowledge again
Loved one Shiv came

## Chorus

Darkness is going away

## Verse 3

We were lost in darkness
There was no way to go
To find the Supreme Soul
Was everyone’s desire
To awaken every light
To awaken every light
He came again
Sun of knowledge again
Loved one Shiv came

## Closing

Darkness is going away
Light is coming
Sun of knowledge again
Loved one Shiv came
Loved one Shiv came
Loved one Shiv came`,
  },

  "utha-jaag-musaaphir-shri-prakash-gossai": {
    title: "Utha Jaag Musaaphir",
    alternate_title: "Uth Jaag Musafir Bhor Bhayee · Abba Rayna Kaha Jo Sowatta Hai",
    artist_version: "Shri Prakash Gossai",
    audio_url: "https://www.youtube.com/watch?v=UY7ljDqSvV0",
    youtube_url: "https://www.youtube.com/watch?v=UY7ljDqSvV0",
    thumbnail_url: "/images/utha-jaag-musaaphir-shri-prakash-gossai-thumb.jpg",
    cover_url: "/images/utha-jaag-musaaphir-shri-prakash-gossai-player.jpg",
    mini_cover_url: "/images/utha-jaag-musaaphir-shri-prakash-gossai-thumb.jpg",
    display_order: 290,
    category_slugs: [
      "general",
      "satsang",
      "morning-prayer",
      "bhajan",
      "devotion",
      "hindi",
    ],
    meaning:
      "Shri Prakash Gossai — wake, O traveler: dawn has come; who stays awake gains, who sleeps loses. Do tomorrow’s work today, today’s work now — before the birds eat the harvest; the sinner finds no peace in sin, so why cry when its knot grips the head?",
    roman_lyrics: `## Chorus

Utha jaag musaaphir bhor bhayee, abba rayna kaha jo sowatta hai
Utha jaag musaaphir bhor bhayee, abba rayna kaha jo sowatta hai
Utha jaag musaaphir bhor bhayee

## Verse 1

Jo jaaghata hai, so paawhata hai, jo sowatta hai, so khowatta hai
Jo jaaghata hai, so paawhata hai, jo sowatta hai, so khowatta hai
Jo sowatta hai, so khowatta hai
Tukh neend say aakhay khola zaaraa, aura aapnay Prabhu say dhyaan lagaa

## Chorus

Utha jaag musaaphir bhor bhayee, abba rayna kaha jo sowatta hai
Utha jaag musaaphir bhor bhayee

## Verse 2

Jo khala karana hai aajih kharlay, jo aajih karana hai abba kharalay
Jo khala karana hai aajih kharlay, jo aajih karana hai abba kharalay
Jo aajih karana hai abba kharalay
Jabba chiri-yana mein chugga khayt ta-leeya, phira pacha-ta yay, kya-ho watta hai

## Chorus

Utha jaag musaaphir bhor bhayee, abba rayna kaha jo sowatta hai
Utha jaag musaaphir bhor bhayee

## Verse 3

Naah-dhana bhughata karanee aapanee, voh paa-pee paap mein chayn na-kaha
Naah-dhana bhughata karanee aapanee, voh paa-pee paap mein chayn na-kaha
Voh paa-pee paap mein chayn na-kaha
Jabba paap kee ghatha-ree sheesha dharee, phira-sheesha pakarra kyo ro-watta hai

## Chorus

Utha jaag musaaphir bhor bhayee, abba rayna kaha jo sowatta hai
Utha jaag musaaphir bhor bhayee`,
    translation: `## Chorus

Rise, awake O traveler — dawn has come; the night is gone — why still sleep?
Rise, awake O traveler — dawn has come; the night is gone — why still sleep?
Rise, awake O traveler — dawn has come

## Verse 1

Who stays awake, gains; who sleeps, loses
Who stays awake, gains; who sleeps, loses
Who sleeps, loses
Open your eyes a little from this sleep, and fix your mind on your Lord

## Chorus

Rise, awake O traveler — dawn has come; the night is gone — why still sleep?
Rise, awake O traveler — dawn has come

## Verse 2

Whatever is for tomorrow, do today; whatever is for today, do it now
Whatever is for tomorrow, do today; whatever is for today, do it now
Whatever is for today, do it now
When the birds have eaten the harvest in the field, what use is regret then?

## Chorus

Rise, awake O traveler — dawn has come; the night is gone — why still sleep?
Rise, awake O traveler — dawn has come

## Verse 3

One must reap one’s own deeds — O sinner, there is no peace in sin
One must reap one’s own deeds — O sinner, there is no peace in sin
O sinner, there is no peace in sin
When the knot of sin is tied on the head, why then clutch the head and cry?

## Chorus

Rise, awake O traveler — dawn has come; the night is gone — why still sleep?
Rise, awake O traveler — dawn has come`,
  },

  "rama-rama-ratate-ratate-payal-dev": {
    title: "Rama Rama Ratate Ratate",
    alternate_title: "Beetee Re Umariya · Raghukul Nandan · Shabari",
    artist_version: "Payal Dev",
    audio_url: "https://www.youtube.com/watch?v=Y4iSSFr98Gc",
    youtube_url: "https://www.youtube.com/watch?v=Y4iSSFr98Gc",
    thumbnail_url: "/images/rama-rama-ratate-ratate-payal-dev-thumb.jpg",
    cover_url: "/images/rama-rama-ratate-ratate-payal-dev-player.jpg",
    mini_cover_url: "/images/rama-rama-ratate-ratate-payal-dev-thumb.jpg",
    display_order: 291,
    category_slugs: [
      "ram",
      "general",
      "satsang",
      "bhajan",
      "devotion",
      "hindi",
    ],
    meaning:
      "Payal Dev (lyrics Manoj Muntashir, T-Series). Shabari of the Bhil path waits her whole life chanting Ram’s name — clearing the forest road, gathering sweet ber — longing for Raghukul Nandan’s darshan at her hut.",
    roman_lyrics: `## Chorus

Raama Raama ratate ratate, beetee re umariya
Raghukul Nandan kab aaoge, bhilanee kee dagariya
Raama Raama ratate ratate, beetee re umariya

## Verse 1

Main Shabaree bhilanee kee jaee, bhajan bhaav nahin jaanu re
Raam tumhaare darshan ke hit, van mein jeevan paaloon re
Charan kamal se nirmal kar do, daasee kee jhopadiya

## Chorus

Raama Raama ratate ratate, beetee re umariya
Raama Raama ratate ratate, beetee re umariya
Raghukul Nandan kab aaoge, bhilanee kee dagariya
Raama Raama ratate ratate, beetee re umariya
Raama Raama ratate ratate, beetee re umariya

## Verse 2

Roj savere van mein jaakar, rasta saaf main karatee hoon
Apane Prabhu ke khaatir van se, chun chun ke phal laatee hoon
Meethe meethe beran kee main, bhar laee chhabariya

## Chorus

Raama Raama ratate ratate, beetee re umariya
Raama Raama ratate ratate, beetee re umariya
Raghukul Nandan kab aaoge, bhilanee kee dagariya
Raama Raama ratate ratate, beetee re umariya

## Verse 3

Sundar shyaam salonee surat, naina bich basaoongee
Pad pankaj raj dhar mastak mein, charanon mein sheesh navaungee
Prabhu jee mujhako bhool gae, lo daasee kee khabariya

## Chorus

Raama Raama ratate ratate, beetee re umariya
Raghukul Nandan kab aaoge, bhilanee kee dagariya
Raama Raama ratate ratate, beetee re umariya
Raama Raama ratate ratate, beetee re umariya

## Verse 4

Raam tumhaare darshan ke hit, main awla ek nari hu
Darshan bin dow nena tarse, dil ki badi dukhiyari hu
Mujhko darshan deu dayalu

## Chorus

Raama Raama ratate ratate, beetee re umariya
Raghukul Nandan kab aaoge, bhilanee kee dagariya
Raama Raama ratate ratate, beetee re umariya`,
    translation: `## Chorus

Chanting Ram Ram, my life is passing by
O joy of Raghu’s line, when will you come on the Bhilani’s path?
Chanting Ram Ram, my life is passing by

## Verse 1

I am Shabari, daughter of the Bhil — I do not know the ways of bhajan
For the sake of your darshan, Ram, I live out my life in the forest
With your lotus feet, make pure this servant’s little hut

## Chorus

Chanting Ram Ram, my life is passing by
Chanting Ram Ram, my life is passing by
O joy of Raghu’s line, when will you come on the Bhilani’s path?
Chanting Ram Ram, my life is passing by
Chanting Ram Ram, my life is passing by

## Verse 2

Every morning I go into the forest and clear the road
For my Lord’s sake I pick fruits one by one from the woods
I have filled my basket with sweet ber berries

## Chorus

Chanting Ram Ram, my life is passing by
Chanting Ram Ram, my life is passing by
O joy of Raghu’s line, when will you come on the Bhilani’s path?
Chanting Ram Ram, my life is passing by

## Verse 3

Your beautiful dark, lovely face — I will seat it within my eyes
I will place the dust of your lotus feet on my brow, and bow my head at your feet
O Lord, you have forgotten me — take news of this servant

## Chorus

Chanting Ram Ram, my life is passing by
O joy of Raghu’s line, when will you come on the Bhilani’s path?
Chanting Ram Ram, my life is passing by
Chanting Ram Ram, my life is passing by

## Verse 4

For your darshan, Ram — I am a helpless woman alone
Without darshan both eyes thirst; my heart is deeply sorrowful
Grant me darshan, O merciful one

## Chorus

Chanting Ram Ram, my life is passing by
O joy of Raghu’s line, when will you come on the Bhilani’s path?
Chanting Ram Ram, my life is passing by`,
  },

  "jai-radha-madhav-jagjit-singh": {
    title: "Jai Radha Madhav",
    alternate_title: "Jaya Radha Madhava · Kunja Bihari · Mahamantra",
    artist_version: "Jagjit Singh",
    audio_url: "/videos/jai-radha-madhav-jagjit-singh.mp4",
    youtube_url: "https://www.youtube.com/watch?v=qShEs5fOFTo",
    thumbnail_url: "/images/jai-radha-madhav-jagjit-singh-thumb.jpg",
    cover_url: "/images/jai-radha-madhav-jagjit-singh-player.jpg",
    mini_cover_url: "/images/jai-radha-madhav-jagjit-singh-thumb.jpg",
    display_order: 292,
    category_slugs: [
      "krishna",
      "radha",
      "general",
      "satsang",
      "janmashtami",
      "bhajan",
      "devotion",
      "hindi",
    ],
    meaning:
      "Jagjit Singh — hail Madhava beloved of Radha, Kunja Bihari, beloved of the gopis, Girivaradhari; Yashoda’s son who delights Vraja and wanders Yamuna’s forest banks; Murli Manohar, ocean of compassion; closes with the Hare Krishna mahamantra.",
    roman_lyrics: `## Chorus

Jai Radha Madhav, Jai Kunja Bihari
Jai Gopi Jan Vallabh, Jai Girivaradhari
Jai Radha Madhav, Jai Kunja Bihari
Jai Gopi Jan Vallabh, Jai Girivaradhari

## Verse 1

Yashoda Nandan, Braj Jan Ranjana
Jamuna Teer Van Chari

## Chorus

Jai Radha Madhav, Jai Kunja Bihari
Jai Gopi Jan Vallabh, Jai Girivaradhari
Jai Radha Madhav, Jai Kunja Bihari
Jai Gopi Jan Vallabh, Jai Girivaradhari

## Verse 2

Murli Manohar, Karuna Sagar
Murli Manohar, Karuna Sagar
Murli Manohar, Karuna Sagar
Jai Govar Dhan Dhari, Jai Radha Madhav

## Closing

Hare Krishna, Hare Krishna
Krishna Krishna, Hare Hare
Hare Rama, Hare Rama
Rama Rama, Hare Hare`,
    devanagari_lyrics: `## Chorus

जय राधा माधव, जय कुंज बिहारी
जय गोपी जन वल्लभ, जय गिरिवरधारी
जय राधा माधव, जय कुंज बिहारी
जय गोपी जन वल्लभ, जय गिरिवरधारी

## Verse 1

यशोदा नंदन, ब्रज जन रंजन
जमुना तीर वन चारी

## Chorus

जय राधा माधव, जय कुंज बिहारी
जय गोपी जन वल्लभ, जय गिरिवरधारी
जय राधा माधव, जय कुंज बिहारी
जय गोपी जन वल्लभ, जय गिरिवरधारी

## Verse 2

मुरली मनोहर, करुणा सागर
मुरली मनोहर, करुणा सागर
मुरली मनोहर, करुणा सागर
जय गोवर्धन धारी, जय राधा माधव

## Closing

हरे कृष्ण, हरे कृष्ण
कृष्ण कृष्ण, हरे हरे
हरे राम, हरे राम
राम राम, हरे हरे`,
    translation: `## Chorus

Hail Radha’s Madhava, hail Kunja Bihari
Hail beloved of the gopis, hail lifter of the great hill
Hail Radha’s Madhava, hail Kunja Bihari
Hail beloved of the gopis, hail lifter of the great hill

## Verse 1

Son of Yashoda, delighter of the people of Vraja
Wanderer of the forests along Yamuna’s banks

## Chorus

Hail Radha’s Madhava, hail Kunja Bihari
Hail beloved of the gopis, hail lifter of the great hill
Hail Radha’s Madhava, hail Kunja Bihari
Hail beloved of the gopis, hail lifter of the great hill

## Verse 2

Flute-player who captivates the mind, ocean of compassion
Flute-player who captivates the mind, ocean of compassion
Flute-player who captivates the mind, ocean of compassion
Hail lifter of Govardhan, hail Radha’s Madhava

## Closing

Hare Krishna, Hare Krishna
Krishna Krishna, Hare Hare
Hare Rama, Hare Rama
Rama Rama, Hare Hare`,
  },

  "payoji-maine-ram-ratana-maanya-arora": {
    title: "Payoji Maine Ram Ratana Dhan Payo",
    alternate_title: "Payo Ji Maine Ram Ratan Dhan Paayo · Meera Bai",
    artist_version: "Maanya Arora",
    audio_url: "https://www.youtube.com/watch?v=hK_IOVgze3o",
    youtube_url: "https://www.youtube.com/watch?v=hK_IOVgze3o",
    thumbnail_url: "/images/payoji-maine-ram-ratana-maanya-arora-thumb.jpg",
    cover_url: "/images/payoji-maine-ram-ratana-maanya-arora-player.jpg",
    mini_cover_url: "/images/payoji-maine-ram-ratana-maanya-arora-thumb.jpg",
    display_order: 293,
    category_slugs: [
      "krishna",
      "ram",
      "general",
      "satsang",
      "bhajan",
      "devotion",
      "hindi",
    ],
    meaning:
      "Maanya Arora — Meera Bai’s classic: I have found the priceless gem of Ram, given by the Satguru; it cannot be spent or stolen, and grows day by day as Mira sings Giridhar’s glory.",
    roman_lyrics: `## Chorus

Payoji, maine ram ratana dhana payo
Payoji, maine ram ratana dhana payo

## Verse 1

Vastu amolaka di mere satguru
Kirpa kari apanayo

## Verse 2

Janma janma ki punji pai
Jaga mein sabai khovayo

## Verse 3

Kharcai nahin koi, cora na levai
Dina dina badhata savayo

## Verse 4

Sat ki nava khevatiya satguru
Bhavasagara tara ayo

## Verse 5

Mira ke prabhu Giridhara nagara
Harakha harakha jasa gayo`,
    translation: `## Chorus

I have found, yes — the wealth of the gem of Ram
I have found, yes — the wealth of the gem of Ram

## Verse 1

My true guru gave me a priceless treasure
With his grace, I accepted it

## Verse 2

I gained the accumulated wealth of many births
And lost all else in the world

## Verse 3

No one can spend it, no thief can take it
Day by day it increases one and a quarter fold

## Verse 4

On the boat of truth, the boatman was my true guru
I have crossed the ocean of existence

## Verse 5

Mira’s Lord is the courtly Giridhar
Joyfully, joyfully I sing His glory`,
  },

  "dam-dam-damru-hari-om-sharan": {
    title: "Dam Dam Damru",
    alternate_title: "Dam Dam Dam Dam Damru Bajaye · Shiv Shankar Kailash Pati · Om Namah Shivaya",
    artist_version: "Hari Om Sharan & Nandini Sharan",
    audio_url: "https://www.youtube.com/watch?v=X_Q8fynVe-w",
    youtube_url: "https://www.youtube.com/watch?v=X_Q8fynVe-w",
    thumbnail_url: "/images/dam-dam-damru-hari-om-sharan-thumb.jpg",
    cover_url: "/images/dam-dam-damru-hari-om-sharan-player.jpg",
    mini_cover_url: "/images/dam-dam-damru-hari-om-sharan-thumb.jpg",
    display_order: 294,
    category_slugs: [
      "shiva",
      "shivratri",
      "general",
      "satsang",
      "bhajan",
      "devotion",
      "hindi",
    ],
    meaning:
      "Hari Om Sharan & Nandini Sharan (Shiv Mahima / T-Series Bhakti Sagar). Damru of Shiv Shankar, lord of Kailash — Om Namah Shivaya; moon and serpent, Ganga from jata, Mangal Gauri’s shakti; those who sing Shiv’s name cross the ocean of becoming.",
    roman_lyrics: `## Chorus

Dam dam dam dam damru bajaye, Shiv Sankar Kailash Pati
Yug yug soya deep jalaaye, Shiv Shankar Kailash Pati

Om Namah Shivaya, Om Namah Shivaya
Om Namah Shivaya, bolo Om Namah Shivaya

Dam dam dam dam damru bajaye, Shiv Sankar Kailash Pati
Yug yug soya deep jalaaye, Shiv Shankar Kailash Pati

Om Namah Shivaya, Om Namah Shivaya
Om Namah Shivaya, bolo Om Namah Shivaya
Om Namah Shivaya, Om Namah Shivaya
Om Namah Shivaya, bolo Om Namah Shivaya

## Verse 1

Mathe uupar tilak chandrama, pehare naag ki mala
Mathe uupar tilak chandrama, pehare naag ki mala
Damru ki dhar tan pe naache, shristi ka rakhwaala
Damru ki dhar tan pe naache, shristi ka rakhwaala
Nij bhaktan kee kasht mitaye, Shiv Shankar Kailash Pati
Yug yug soya deep jalaaye, Shiv Shankar Kailash Pati

## Chorus

Om Namah Shivaya, Om Namah Shivaya
Om Namah Shivaya, bolo Om Namah Shivaya
Om Namah Shivaya, Om Namah Shivaya
Om Namah Shivaya, bolo Om Namah Shivaya

## Verse 2

Jata joot se jharati Ganga, bhav ki taap mitati
Jata joot se jharati Ganga, bhav ki taap mitati
Dharati aur pyase jeevan ke, maiyya pyas bujhaati
Dharati aur pyase jeevan ke, maiyya pyas bujhaati
Nij kirpa jag se barsaayee, Shiv Shankar Kailash Pati
Yug yug soya deep jalaaye, Shiv Shankar Kailash Pati

## Chorus

Om Namah Shivaya, Om Namah Shivaya
Om Namah Shivaya, bolo Om Namah Shivaya
Om Namah Shivaya, Om Namah Shivaya
Om Namah Shivaya, bolo Om Namah Shivaya

## Verse 3

Mangal Gowrie naam hai unka, woh hai shakti daata
Mangal Gowrie naam hai unka, woh hai shakti daata
Bhav sagar se tar jaaye wo, jo Shiv naam hai gaata
Bhav sagar se tar jaaye wo, jo Shiv naam hai gaata
Moh maya se mann ko chhudaye, Shiv Shankar Kailash Pati
Yug yug soya deep jalaaye, Shiv Shankar Kailash Pati

## Chorus

Om Namah Shivaya, Om Namah Shivaya
Om Namah Shivaya, bolo Om Namah Shivaya
Om Namah Shivaya, Om Namah Shivaya
Om Namah Shivaya, bolo Om Namah Shivaya

## Closing

Dam dam dam dam damru bajaye, Shiv Sankar Kailash Pati
Yug yug soya deep jalaaye, Shiv Shankar Kailash Pati

Om Namah Shivaya, Om Namah Shivaya
Om Namah Shivaya, bolo Om Namah Shivaya
Om Namah Shivaya, Om Namah Shivaya
Om Namah Shivaya, bolo Om Namah Shivaya`,
    translation: `## Chorus

Dam dam dam dam — the damru plays; Shiv Shankar, lord of Kailash
Age after age the divine lamp is lit; Shiv Shankar, lord of Kailash

Om Namah Shivaya, Om Namah Shivaya
Om Namah Shivaya — say Om Namah Shivaya

Dam dam dam dam — the damru plays; Shiv Shankar, lord of Kailash
Age after age the divine lamp is lit; Shiv Shankar, lord of Kailash

Om Namah Shivaya, Om Namah Shivaya
Om Namah Shivaya — say Om Namah Shivaya
Om Namah Shivaya, Om Namah Shivaya
Om Namah Shivaya — say Om Namah Shivaya

## Verse 1

On His forehead, the moon as tilak; He wears a garland of snakes
On His forehead, the moon as tilak; He wears a garland of snakes
To the beat of the damru His body dances — guardian of creation
To the beat of the damru His body dances — guardian of creation
He removes the suffering of His own devotees; Shiv Shankar, lord of Kailash
Age after age the divine lamp is lit; Shiv Shankar, lord of Kailash

## Chorus

Om Namah Shivaya, Om Namah Shivaya
Om Namah Shivaya — say Om Namah Shivaya
Om Namah Shivaya, Om Namah Shivaya
Om Namah Shivaya — say Om Namah Shivaya

## Verse 2

From His matted locks Ganga streams, cooling the heat of worldly life
From His matted locks Ganga streams, cooling the heat of worldly life
For the earth and thirsty living beings, Mother quenches the thirst
For the earth and thirsty living beings, Mother quenches the thirst
His grace rains upon the world; Shiv Shankar, lord of Kailash
Age after age the divine lamp is lit; Shiv Shankar, lord of Kailash

## Chorus

Om Namah Shivaya, Om Namah Shivaya
Om Namah Shivaya — say Om Namah Shivaya
Om Namah Shivaya, Om Namah Shivaya
Om Namah Shivaya — say Om Namah Shivaya

## Verse 3

Mangal Gauri is Her name — She is the giver of shakti
Mangal Gauri is Her name — She is the giver of shakti
Whoever sings Shiv’s name crosses the ocean of becoming
Whoever sings Shiv’s name crosses the ocean of becoming
He frees the mind from delusion and maya; Shiv Shankar, lord of Kailash
Age after age the divine lamp is lit; Shiv Shankar, lord of Kailash

## Chorus

Om Namah Shivaya, Om Namah Shivaya
Om Namah Shivaya — say Om Namah Shivaya
Om Namah Shivaya, Om Namah Shivaya
Om Namah Shivaya — say Om Namah Shivaya

## Closing

Dam dam dam dam — the damru plays; Shiv Shankar, lord of Kailash
Age after age the divine lamp is lit; Shiv Shankar, lord of Kailash

Om Namah Shivaya, Om Namah Shivaya
Om Namah Shivaya — say Om Namah Shivaya
Om Namah Shivaya, Om Namah Shivaya
Om Namah Shivaya — say Om Namah Shivaya`,
  },

  "jai-govinda-gopala-anup-jalota": {
    title: "Jai Govinda Gopala",
    alternate_title: "Mann Mohan Shyam Kanhaiya · Murli Dhar Gopala · Ghanshyam Nandke Laalaa",
    artist_version: "Anup Jalota",
    audio_url: "https://www.youtube.com/watch?v=KP095UUUOfw",
    youtube_url: "https://www.youtube.com/watch?v=KP095UUUOfw",
    thumbnail_url: "/images/jai-govinda-gopala-anup-jalota-thumb.jpg",
    cover_url: "/images/jai-govinda-gopala-anup-jalota-player.jpg",
    mini_cover_url: "/images/jai-govinda-gopala-anup-jalota-thumb.jpg",
    display_order: 295,
    category_slugs: [
      "krishna",
      "general",
      "satsang",
      "janmashtami",
      "bhajan",
      "devotion",
      "hindi",
    ],
    meaning:
      "Anup Jalota — glory to Govinda Gopala, Murli-dhar, Ghanshyam son of Nanda; raas and Govardhan Giridhari; friend of the lonely, flute-player, subduer of Kaliya — protector of king and pauper alike.",
    roman_lyrics: `## Chorus

Jai Govinda Gopala, mann Mohan Shyam Kanhaiya
Murli dhar Gopala, Ghanshyam Nandke Laalaa

## Verse 1

Jag palak tu raas rachaiya, Govardhan Giridhaari
Kitne naam tere Natwar tu Saawal Krishna Muraari
Mor mukut manhar lewat balihaari har Brij Baalaa
Murli dhar Gopala, Ghanshyam Nandke Laalaa

## Verse 2

Tuhi sagar me ramtaa tuhi dharti pataal
Jalme nabhme aur jagatme teri Jai Jai kaar
Mere man mandir me Swami, tujhse hi ujiala
Murli dhar Gopala, Ghanshyam Nandke Laalaa

## Verse 3

Jiska koyi nahi is jagme, uskaa meeth Kanhaiya
Bansi bajaiya raas rachaiya, kale naag nathaiya
Raja ho ya deen bikhari sabka tu rakhwala
Murli dhar Gopala, Ghanshyam Nandke Laalaa`,
    translation: `## Chorus

Glory to Govinda Gopala — mind-enchanting Shyam Kanhaiya
Flute-bearer Gopala — Ghanshyam, Nanda’s beloved child

## Verse 1

In a blink You compose the raas — Govardhan Giridhari
How many names You have, Natwar — dark Krishna Murari
Peacock crown captivating — I offer myself to every child of Braj
Flute-bearer Gopala — Ghanshyam, Nanda’s beloved child

## Verse 2

You play in the ocean, on the earth, and in the nether worlds
In water, sky, and world Your glory is sung — jai jai
In the temple of my mind, O Swami, light comes only from You
Flute-bearer Gopala — Ghanshyam, Nanda’s beloved child

## Verse 3

Whoever has no one in this world — You are their sweet Kanhaiya
Flute-player, composer of the raas, subduer of the black serpent
Whether king or poor beggar — You are everyone’s protector
Flute-bearer Gopala — Ghanshyam, Nanda’s beloved child`,
  },

  "mohe-lagi-lagan-hari-om-sharan": {
    title: "Mohe Lagi Lagan",
    alternate_title: "Mohi Lagi Lagan · Hari Darshan Ki · Hari Om",
    artist_version: "Hari Om Sharan",
    audio_url: "https://www.youtube.com/watch?v=1tJVO1LhGlM",
    youtube_url: "https://www.youtube.com/watch?v=1tJVO1LhGlM",
    thumbnail_url: "/images/mohe-lagi-lagan-hari-om-sharan-thumb.jpg",
    cover_url: "/images/mohe-lagi-lagan-hari-om-sharan-player.jpg",
    mini_cover_url: "/images/mohe-lagi-lagan-hari-om-sharan-thumb.jpg",
    display_order: 296,
    category_slugs: [
      "krishna",
      "vishnu",
      "general",
      "satsang",
      "bhajan",
      "devotion",
      "hindi",
    ],
    meaning:
      "Hari Om Sharan — longing for Hari’s darshan; He is giver of the world and of auspiciousness, joy of the world who grants strength to cross delusion; surrender all, grant vision, accept this life’s offering at His lotus feet.",
    roman_lyrics: `## Chorus

Mohi lagi lagan
Mohi lagi lagan
Hari darshan ki
Hari darshan ki

Hari Ommm
Hari Ommm
Hari Om, Hari Om, Hari Om, Hari Om

## Verse 1

Vishwa bhi daata
Mangal data
Mangal data
Bina ya suno ab bhi nana ki
Ohhhh
Bina ya suno ab bhi nana ki

## Chorus

Mohe lagi lagan
Mohi lagi lagan
Hari darshan ki
Hari darshan ki

Hari Ommm
Hari Ommm
Hari Om, Hari Om, Hari Om, Hari Om

## Verse 2

Hey sukh kari
Jag hitakari
Jag hitakari
Do shakti bhow tara nana ki
Ohhh
Do shakti bhow tara nana ki

## Chorus

Mohe lagi lagan
Mohi lagi lagan
Hari darshan ki
Hari darshan ki

Hari Ommm
Hari Ommm
Hari Om, Hari Om, Hari Om, Hari Om

## Verse 3

Sarbas lelo
Darshan dedo
Darshan dedo
Bali leelo isa jeevan ki
Ohhh
Bali leelo isa jeevan ki

## Chorus

Mohe lagi lagan
Mohi lagi lagan
Hari darshan ki
Hari darshan ki

Hari Ommm
Hari Ommm
Hari Om, Hari Om, Hari Om, Hari Om

## Verse 4

Aaya sharan meh
Aasha yeh man me
Aasha yeh man me
Charan kamal sab par pan ki
Ohhh
Charan kamal sab par pan ki

## Closing

Mohe lagi lagan
Mohi lagi lagan
Hari darshan ki
Hari darshan ki

Hari Omm
Hari Omm
Hari Om, Hari Om, Hari Om, Hari Om
Hari Omm
Hari Omm
Hari Om, Hari Om, Hari Om, Hari Om`,
    translation: `## Chorus

I am seized with longing
I am seized with longing
For Hari’s darshan
For Hari’s darshan

Hari Om
Hari Om
Hari Om, Hari Om, Hari Om, Hari Om

## Verse 1

Giver of the world
Giver of auspiciousness
Giver of auspiciousness
Listen even now to this child’s cry
Ohhhh
Listen even now to this child’s cry

## Chorus

I am seized with longing
I am seized with longing
For Hari’s darshan
For Hari’s darshan

Hari Om
Hari Om
Hari Om, Hari Om, Hari Om, Hari Om

## Verse 2

O giver of joy
Benefactor of the world
Benefactor of the world
Grant strength to cross this ocean of becoming, O dear one
Ohhh
Grant strength to cross this ocean of becoming, O dear one

## Chorus

I am seized with longing
I am seized with longing
For Hari’s darshan
For Hari’s darshan

Hari Om
Hari Om
Hari Om, Hari Om, Hari Om, Hari Om

## Verse 3

Take all that I have
Grant me darshan
Grant me darshan
Accept the offering of this life
Ohhh
Accept the offering of this life

## Chorus

I am seized with longing
I am seized with longing
For Hari’s darshan
For Hari’s darshan

Hari Om
Hari Om
Hari Om, Hari Om, Hari Om, Hari Om

## Verse 4

I have come to Your shelter
This hope is in my heart
This hope is in my heart
All is offered at Your lotus feet
Ohhh
All is offered at Your lotus feet

## Closing

I am seized with longing
I am seized with longing
For Hari’s darshan
For Hari’s darshan

Hari Om
Hari Om
Hari Om, Hari Om, Hari Om, Hari Om
Hari Om
Hari Om
Hari Om, Hari Om, Hari Om, Hari Om`,
  },
  "dagar-hai-mushkil-roshan-ji": {
    title: "Dagar Hai Mushkil Kathin Safar Hai",
    alternate_title: "डगर है मुश्किल कठिन सफ़र है",
    artist_version: "Roshan Ji",
    youtube_url: "https://www.youtube.com/watch?v=Fc8MGuWg5Vk",
    thumbnail_url: "/images/dagar-hai-mushkil-roshan-ji.jpg",
    cover_url: "/images/dagar-hai-mushkil-roshan-ji.jpg",
    mini_cover_url: "/images/dagar-hai-mushkil-roshan-ji.jpg",
    display_order: 297,
    category_slugs: [
      "general",
      "satsang",
      "bhajan",
      "devotion",
      "wisdom",
      "hindi",
    ],
    meaning:
      "Nirgun-style bhajan of warning and humility (Roshan Ji). The path is hard and the journey difficult, yet the traveller stays asleep — whoever sleeps loses. Newly gained wealth and fame make people proud; trees bend when fruit comes, and true nobility keeps a soft temperament. Stay awake on the spiritual path.",
    roman_lyrics: `## Chorus

Dagar hai mushkil, kathin safar hai
Magar musafir jaga nahin hai
Jo soyega, bas wahi khoyega
Jo soyega, bas wahi khoyega
Ye baat usko pata nahin hai

Dagar hai mushkil, kathin safar hai
Magar musafir jaga nahin hai

## Verse 1

Lagenge phal jab kisi vriksh mein
Wo ped jhuk jayenge swatah hi
Akad tane ki bata rahi hai
Akad tane ki bata rahi hai
Abhi phal ismein laga nahin hai

## Chorus

Dagar hai mushkil, kathin safar hai
Magar musafir jaga nahin hai

## Verse 2

Jo khandani rais hote
Mizaaj rakhte hain narm apna
Tumhara lehja bata raha hai
Tumhara lehja bata raha hai
Tumhari daulat nai-nai hai

## Chorus

Dagar hai mushkil, kathin safar hai
Magar musafir jaga nahin hai

## Verse 3

Zara si kudrat ne kya nawaza
Ki aa ke baithe ho pehli saf mein
Abhi se udne lage hawa mein
Abhi se udne lage hawa mein
Abhi ye shohrat nai-nai hai

## Chorus

Dagar hai mushkil, kathin safar hai
Magar musafir jaga nahin hai

Dagar hai mushkil, kathin safar hai
Magar musafir jaga nahin hai
Jo soyega, bas wahi khoyega
Jo soyega, bas wahi khoyega
Ye baat usko pata nahin hai

Dagar hai mushkil, kathin safar hai
Magar musafir jaga nahin hai`,
    translation: `## Chorus

The path is difficult, the journey is hard
But the traveller is still not awake
Whoever sleeps — that one alone will lose
Whoever sleeps — that one alone will lose
This truth they do not yet know

The path is difficult, the journey is hard
But the traveller is still not awake

## Verse 1

When fruit comes on a tree
Those trees bend of their own accord
The stiffness of the trunk is telling you
The stiffness of the trunk is telling you
Fruit has not yet grown on it

## Chorus

The path is difficult, the journey is hard
But the traveller is still not awake

## Verse 2

Those who are noble by lineage
Keep a soft and gentle temperament
Your tone of voice is telling
Your tone of voice is telling
Your wealth is new — freshly come

## Chorus

The path is difficult, the journey is hard
But the traveller is still not awake

## Verse 3

Nature has barely favoured you a little
And already you sit in the front row
Already you have begun to fly in the air
Already you have begun to fly in the air
This fame of yours is still brand new

## Chorus

The path is difficult, the journey is hard
But the traveller is still not awake

The path is difficult, the journey is hard
But the traveller is still not awake
Whoever sleeps — that one alone will lose
Whoever sleeps — that one alone will lose
This truth they do not yet know

The path is difficult, the journey is hard
But the traveller is still not awake`,
  },
  "prabhu-ji-mere-aao-vishnupant-pagnis": {
    title: "Prabhu Ji Mere Aao",
    alternate_title: "Prabhu Ji More Aao · Bhakta Raj (1943)",
    artist_version: "Vishnupant Pagnis",
    youtube_url: "https://www.youtube.com/watch?v=1zuE6uqqldo",
    thumbnail_url: "/images/prabhu-ji-mere-aao-vishnupant-pagnis.jpg",
    cover_url: "/images/prabhu-ji-mere-aao-vishnupant-pagnis.jpg",
    mini_cover_url: "/images/prabhu-ji-mere-aao-vishnupant-pagnis.jpg",
    display_order: 298,
    category_slugs: [
      "krishna",
      "general",
      "satsang",
      "bhajan",
      "devotion",
      "hindi",
    ],
    meaning:
      "Classic film bhajan from Bhakta Raj (1943), sung by Vishnupant Pagnis; music C. Ramchandra, lyrics D. N. Madhok. A plea for the Lord to come — eyes thirst for darshan, bhakti is scarce, and the devotee asks Him to dwell in the heart, wipe away sin, and answer with Govinda’s name.",
    roman_lyrics: `## Chorus

Prabhu ji mere aao, prabhu ji mere aao
Prabhu ji mere aao, prabhu ji mere aao
Charon or chhai hai udaasi
Charon or chhai hai udaasi
Ankhiya darshan bin hai pyasi
Ankhiya darshan bin hai pyasi
Prabhu ji mere aao, prabhu ji mere aao
Prabhu ji mere aao, prabhu ji mere aao
Prabhu ji mere aao

## Verse 1

Bhakti mein ab koi na maane
Bhakti mein ab koi na maane
Prabhu tujhe koi prabhu jane
Prabhu tujhe koi prabhu jane
Hriday mein tum bas jaao, murliya bajao
Prabhu ji mere aao, prabhu ji mere aao
Prabhu ji mere aao, prabhu ji mere aao
Prabhu ji mere aao

## Verse 2

Kis sadi se naam japu main tera
Dharm nagar mein paap ka dera
Aake paap mitao, vinati suno
Prabhu ji mere aao, prabhu ji mere aao
Prabhu ji mere aao, prabhu ji mere aao
Prabhu ji mere aao, prabhu ji mere aao
Prabhu ji mere aao, prabhu ji mere aao
Prabhu ji mere aao, prabhu ji mere aao
Prabhu ji mere aao, prabhu ji mere aao

## Verse 3

Ab naam jape aur kare kinara
Paap ki duniya mein hai fir kaun hamara
Kaun hamara — aao ji chale aao
Warna ye kahunga, paap kiya tha
Jo japa naam tumhara
Govind govind govind govind govind
Govind govind govind govind govind`,
    translation: `## Chorus

My Lord, come to me — my Lord, come to me
My Lord, come to me — my Lord, come to me
On every side, sorrow has settled
On every side, sorrow has settled
These eyes thirst without Your darshan
These eyes thirst without Your darshan
My Lord, come to me — my Lord, come to me
My Lord, come to me — my Lord, come to me
My Lord, come to me

## Verse 1

In devotion now, no one believes
In devotion now, no one believes
Lord, hardly anyone knows You as Lord
Lord, hardly anyone knows You as Lord
Come dwell in my heart — play Your flute
My Lord, come to me — my Lord, come to me
My Lord, come to me — my Lord, come to me
My Lord, come to me

## Verse 2

For how many ages have I chanted Your name
In the city of dharma, sin has made its camp
Come, wipe away the sin — hear this prayer
My Lord, come to me — my Lord, come to me
My Lord, come to me — my Lord, come to me
My Lord, come to me — my Lord, come to me
My Lord, come to me — my Lord, come to me
My Lord, come to me — my Lord, come to me
My Lord, come to me — my Lord, come to me

## Verse 3

Now we chant the Name and seek the shore
In this world of sin, who else is ours?
Who is ours? Come — please come
Or I will say: I sinned —
And still I chanted Your name
Govind, Govind, Govind, Govind, Govind
Govind, Govind, Govind, Govind, Govind`,
  },
  "hey-maha-laxmi-maa-usha-mangeshkar": {
    title: "Hey Maha Laxmi Maa",
    alternate_title: "He Mahaa Laxmi Maa Aayi Sharan · Jai Mahaalaxmi Ma (1976)",
    artist_version: "Usha Mangeshkar",
    youtube_url: "https://www.youtube.com/watch?v=pgCICcU3NrM",
    thumbnail_url: "/images/hey-maha-laxmi-maa-usha-mangeshkar.jpg",
    cover_url: "/images/hey-maha-laxmi-maa-usha-mangeshkar.jpg",
    mini_cover_url: "/images/hey-maha-laxmi-maa-usha-mangeshkar.jpg",
    display_order: 299,
    category_slugs: [
      "lakshmi",
      "diwali",
      "general",
      "satsang",
      "bhajan",
      "devotion",
      "hindi",
    ],
    meaning:
      "Film bhajan from Jai Mahaalaxmi Ma (1976), sung by Usha Mangeshkar; music Chitragupt, lyrics Bharat Vyas. The devotee takes shelter at Mother Mahalaxmi’s feet — protect my honour, show Your glory today, wipe the stain of blame, and let punya rise while paap bows.",
    roman_lyrics: `## Chorus

Hey Maha Laxmi Maa
Hey Maha Laxmi Maa
Hey Maha Laxmi Maa, aayi sharan teri
Rakh laaj meri
Hey Maha Laxmi Maa, aayi sharan teri
Rakh laaj meri
Tu aaj dikha de mahima
Hey Maha Laxmi Maa

## Verse 1

Tu antaryami dukh jane mere ji ka
Mere maathe laga ke aaj kalank ka tika
Tu antaryami dukh jane mere ji ka
Mere maathe laga ke aaj kalank ka tika
Main teri pujaran, meri bhakti nirali
Main teri pujaran, meri bhakti nirali
Maa aaj meri ye pukar na jaye khali
Kar jode khadi, teri shakti badi
Kar jode khadi, teri shakti badi
Tu aaj dikha de mahima
Hey Maha Laxmi Maa

## Verse 2

Mere bhagya pe maiya, duniya aaj jali hai
Mere punay pe paapi, paap ne chaal chali hai
Mere bhagya pe maiya, duniya aaj jali hai
Mere punay pe paapi, paap ne chaal chali hai
Sansaar ke aage meri aaj pariksha
Sansaar ke aage meri aaj pariksha
Ab tu hi kar sakti hai raksha
Maa paap jhuke aur punay uthe
Maa paap jhuke aur punay uthe
Tu aaj dikha de mahima
Hey Maha Laxmi Maa`,
    translation: `## Chorus

O Great Mother Lakshmi
O Great Mother Lakshmi
O Great Mother Lakshmi — I have come to Your shelter
Protect my honour
O Great Mother Lakshmi — I have come to Your shelter
Protect my honour
Show Your glory today
O Great Mother Lakshmi

## Verse 1

You who know the heart — You know the sorrow of my soul
Today a mark of blame has been placed on my forehead
You who know the heart — You know the sorrow of my soul
Today a mark of blame has been placed on my forehead
I am Your worshipper — my devotion is rare and true
I am Your worshipper — my devotion is rare and true
Mother, let this cry of mine not go unanswered today
I stand with folded hands — Your power is great
I stand with folded hands — Your power is great
Show Your glory today
O Great Mother Lakshmi

## Verse 2

Mother, the world is burning with envy at my fortune today
Against my merit, sinners have set sin’s plot in motion
Mother, the world is burning with envy at my fortune today
Against my merit, sinners have set sin’s plot in motion
Before the world, this is my trial today
Before the world, this is my trial today
Now only You can give protection
Mother — let sin bow down, and let merit rise
Mother — let sin bow down, and let merit rise
Show Your glory today
O Great Mother Lakshmi`,
  },
  "jai-jai-ganapati-rajin-balgobind": {
    title: "Jai Jai Ganapati",
    alternate_title: "Jai Jai Ganapati Jai Ganapati · Vighna Vinaashana Haare",
    artist_version: "Rajin Balgobind",
    youtube_url: "https://www.youtube.com/watch?v=3Ml6RqLQQLs",
    thumbnail_url: "/images/jai-jai-ganapati-rajin-balgobind.jpg",
    cover_url: "/images/jai-jai-ganapati-rajin-balgobind.jpg",
    mini_cover_url: "/images/jai-jai-ganapati-rajin-balgobind.jpg",
    display_order: 300,
    category_slugs: [
      "ganesh",
      "general",
      "satsang",
      "bhajan",
      "devotion",
      "hindi",
    ],
    meaning:
      "Rajin Balgobind’s satsang Ganesh bhajan — victory to Ganapati, remover of obstacles. Praises Lambodara in yellow silk, the jewelled crown and elephant-garland, Mother’s modak, and Riddhi–Siddhi fanning Him with joy.",
    roman_lyrics: `## Chorus

Jai Jai Ganapati, Jai Ganapati
Jai Ganesh, Jai Ganapati, Jai Jai
Ganapati Vighna Vinaashana Haare
Ganapati Vighna Vinaashana Haare

## Verse 1

Lambodhara Peetaambara Sohe
Phani Mani Mukuta Naayana Rata Naare
Gaja Mani Maala Gale Bija Sohe
Bhaala Laala Me Chandra Kalaave

## Chorus

Jai Jai Ganapati, Jai Ganapati
Jai Ganesh, Jai Ganapati, Jai Jai
Ganapati Vighna Vinaashana Haare
Ganapati Vighna Vinaashana Haare

## Verse 2

Modaka Leta Deta Janani Jaba
Thumaka Chalata Noopura Jhanakaare
Riddhi Siddhi Do Chavar Dulaavata
Sura Samoha Lati Hota Sukhaaray

## Chorus

Jai Jai Ganapati, Jai Ganapati
Jai Ganesh, Jai Ganapati, Jai Jai
Ganapati Vighna Vinaashana Haare
Ganapati Vighna Vinaashana Haare`,
    translation: `## Chorus

Victory, victory to Ganapati — victory to Ganapati
Victory to Ganesh, victory to Ganapati — victory, victory
Ganapati, remover of obstacles — hail!
Ganapati, remover of obstacles — hail!

## Verse 1

Lambodara shines in yellow silk
With a serpent-jewel crown and eyes red with devotion
An elephant-jewel garland adorns His neck
On His forehead a red tilak and the crescent moon

## Chorus

Victory, victory to Ganapati — victory to Ganapati
Victory to Ganesh, victory to Ganapati — victory, victory
Ganapati, remover of obstacles — hail!
Ganapati, remover of obstacles — hail!

## Verse 2

When Mother gives Him a modak
He toddles along, ankle-bells ringing
Riddhi and Siddhi fan Him with chamara whisks
The throng of gods is filled with joy

## Chorus

Victory, victory to Ganapati — victory to Ganapati
Victory to Ganesh, victory to Ganapati — victory, victory
Ganapati, remover of obstacles — hail!
Ganapati, remover of obstacles — hail!`,
  },
  "gaiye-ganapati-jagvandan-jagjit-singh": {
    title: "Gaiye Ganapati Jagvandan",
    alternate_title: "Gaiye Ganpati Jagvandan · Tulsidas · Ganesh Vandana",
    artist_version: "Jagjit Singh",
    youtube_url: "https://www.youtube.com/watch?v=aASYnk-eaXI",
    thumbnail_url: "/images/gaiye-ganapati-jagvandan-jagjit-singh.jpg",
    cover_url: "/images/gaiye-ganapati-jagvandan-jagjit-singh.jpg",
    mini_cover_url: "/images/gaiye-ganapati-jagvandan-jagjit-singh.jpg",
    display_order: 301,
    category_slugs: [
      "ganesh",
      "ram",
      "general",
      "satsang",
      "bhajan",
      "devotion",
      "hindi",
    ],
    meaning:
      "Jagjit Singh’s Times Music Spiritual recording of Tulsidas’s Ganesh vandana — sing praise of Ganapati, son of Shankar and Bhavani. Home of siddhi, elephant-faced Vinayak, ocean of grace; lover of modaks, giver of joy and wisdom. With folded hands Tulsidas asks: dwell, Ram and Sita, in my heart.",
    roman_lyrics: `## Chorus

Gaiye Ganapati Jagvandan
Shankar suvan Bhavani ke nandan

## Verse 1

Siddhi sadan gajvadan Vinayak
Kripa sindhu sundar sab laayak

## Chorus

Gaiye Ganapati Jagvandan
Shankar suvan Bhavani ke nandan

## Verse 2

Modak priya mud mangal data
Vidya varidhi buddhi vidhata

## Chorus

Gaiye Ganapati Jagvandan
Shankar suvan Bhavani ke nandan

## Verse 3

Maangat Tulsidas kar jore
Basahu Ram Siya manas more

## Chorus

Gaiye Ganapati Jagvandan
Shankar suvan Bhavani ke nandan`,
    translation: `## Chorus

Sing the world’s praise of Ganapati
Son of Shankar, child of Bhavani

## Verse 1

Abode of siddhi, elephant-faced Vinayak
Ocean of grace — beautiful, worthy of all

## Chorus

Sing the world’s praise of Ganapati
Son of Shankar, child of Bhavani

## Verse 2

Lover of modaks, giver of joy and auspiciousness
Ocean of learning, bestower of intellect

## Chorus

Sing the world’s praise of Ganapati
Son of Shankar, child of Bhavani

## Verse 3

With folded hands, Tulsidas asks
Dwell, Ram and Sita, in my heart

## Chorus

Sing the world’s praise of Ganapati
Son of Shankar, child of Bhavani`,
  },
  "maa-ne-hamko-pyaar-chunelall-narine": {
    title: "Maa Ne Hamko Pyaar",
    alternate_title:
      "Maa Ne Hamko Pyaar Kiya Hai Jitna · also Mataa Putra Se Pyaar",
    artist_version: "Pt. Chunelall Narine",
    youtube_url: "https://www.youtube.com/watch?v=IOKny_OPako",
    thumbnail_url: "/images/maa-ne-hamko-pyaar-chunelall-narine.jpg",
    cover_url: "/images/maa-ne-hamko-pyaar-chunelall-narine.jpg",
    mini_cover_url: "/images/maa-ne-hamko-pyaar-chunelall-narine.jpg",
    display_order: 302,
    category_slugs: [
      "general",
      "satsang",
      "bhajan",
      "devotion",
      "gratitude",
      "hindi",
    ],
    meaning:
      "Indo-Caribbean Mata bhajan on a mother’s unmatched love — nine months of care, milk and warmth, lullabies and medicine, love that does not leave even after marriage, greater than the ocean. This recording opens “Maa ne hamko pyaar…”; other satsang versions open “Mataa putra se pyaar…”.",
    roman_lyrics: `## Chorus

Maa ne hamko pyaar kiya hai jitna
Kaun karega itna

## Verse 1

Nau maheenee udar me raakhaa
Jab duniya me aaya
Sardee lagegee chaadar orhaa-kar
Stan doodh pilaayaa
Kaun…

## Chorus

Maa ne hamko pyaar kiya hai jitna
Kaun karega itna

## Verse 2

Thapak thapak kar sukh se sulaayaa
Gaakar surlaa bhajanaa
Beemaar pare jab vaidya bulaakar
Aushadh paan kaaraaya
Kaun…

## Chorus

Maa ne hamko pyaar kiya hai jitna
Kaun karega itna

## Verse 3

Javaan bhaye jab shaadee karnaa
Tab tak prem na chhoote
Maata ki mamta aisee baree hai
Saagar bara hai jitna
Kaun…

## Chorus

Maa ne hamko pyaar kiya hai jitna
Kaun karega itna

## Alternate opening (other versions)

Mataa putra se pyaar kiyaa hai jitnaa
Kaun karegaa itnaa`,
    translation: `## Chorus

As much as Mother has loved us
Who else would love so much?

## Verse 1

She kept us nine months in the womb
When we came into the world
When cold would come, she wrapped us in a shawl
And fed us milk from her breast
Who else…?

## Chorus

As much as Mother has loved us
Who else would love so much?

## Verse 2

Patting gently, she laid us to sleep in comfort
Singing sweet lullaby bhajans
When we fell ill, she called the doctor
And had medicine given
Who else…?

## Chorus

As much as Mother has loved us
Who else would love so much?

## Verse 3

When we grew up and it was time to marry
Even then her love did not leave us
A mother’s affection is so great
As great as the ocean is wide
Who else…?

## Chorus

As much as Mother has loved us
Who else would love so much?

## Alternate opening (other versions)

As much as a mother has loved her child
Who else would love so much?`,
  },
  "shiva-hare-shri-prakash-gossai": {
    title: "Shiva Hare",
    alternate_title:
      "Shiva Hare Shiva Rama Sakhe Prabho · Shivarama Ashtakam",
    artist_version: "Shri Prakash Gossai",
    audio_url: "https://www.youtube.com/watch?v=FN6gZpqh6NY",
    youtube_url: "https://www.youtube.com/watch?v=FN6gZpqh6NY",
    thumbnail_url: "/images/shiva-hare-shri-prakash-gossai.jpg",
    cover_url: "/images/shiva-hare-shri-prakash-gossai.jpg",
    mini_cover_url: "/images/shiva-hare-shri-prakash-gossai.jpg",
    display_order: 303,
    category_slugs: [
      "shiva",
      "ram",
      "krishna",
      "hanuman",
      "general",
      "satsang",
      "shivratri",
      "birthday",
      "bhajan",
      "devotion",
      "protection",
      "sanskrit",
    ],
    meaning:
      "Shri Prakash Gossai’s Shiva Hare — the Shivarama Ashtakam, a Sanskrit stotra to Shiva and Rama as one (traditionally attributed to Ramananda). Each verse asks Shiva-Hari for the boon of victory: remover of the three sufferings, lotus-eyed Rama, protector of Gajendra, Krishna beloved of Yudhishthira, and the Lord who delights Hanuman. Whoever recites it is said to reach the lotus feet of Rama and Ramaa.",
    roman_lyrics: `## Verse 1

Shiva hare Shiva Rama sakhe Prabho
Trividha tapa nivarana he Vibho
Aja Janeshvara Yadava paahi maam
Shiva hare vijayam kuru me varam

## Verse 2

Kamala lochana Rama daya nidhe
Hara guro gaja rakshaka gopate
Shiva tano bhava Shankara paahi maam
Shiva hare vijayam kuru me varam

## Verse 3

Svajana ranjana mangala mandiram
Bhajati te purushah paramam padam
Bhavati tasya sukham paramadbhutam
Shiva hare vijayam kuru me varam

## Verse 4

Jaya Yudhishthira vallabha bhupate
Jaya jayarjita punya payo nidhe
Jaya kripamaya Krishna namo'stu te
Shiva hare vijayam kuru me varam

## Verse 5

Bhava vimochana Madhava mapate
Sukavi manasa hamsa Shivarate
Janaka jaarata Raghava raksha maam
Shiva hare vijayam kuru me varam

## Verse 6

Avani mandala mangala mapate
Jalada sundara Rama Ramapate
Nigama kirti gunarnava gopate
Shiva hare vijayam kuru me varam

## Verse 7

Patita pavana namamayi lata
Tava yasho vimalam parigiyate
Tadapi Madhava maam kim upekshase
Shiva hare vijayam kuru me varam

## Verse 8

Amarata para deva Ramapate
Vijayas tava nama ghanopame
Mayi katham karunarnava jayate
Shiva hare vijayam kuru me varam

## Verse 9

Hanumatah priya toshakara Prabho
Surasarid dhrita shekhara he Guro
Mama vibho kimu vismaranam kritam
Shiva hare vijayam kuru me varam

## Verse 10

Narahare rati ranjana sundaram
Pathati yah Shiva Rama krita stavam
Vishati Rama Ramaa charanambuje
Shiva hare vijayam kuru me varam`,
    devanagari_lyrics: `## Verse 1

शिव हरे शिवराम सखे प्रभो
त्रिविध ताप निवारण हे विभो
अज जनेश्वर यादव पाहि माम्
शिव हरे विजयं कुरु मे वरम्

## Verse 2

कमल लोचन राम दयानिधे
हर गुरो गजरक्षक गोपते
शिव तनो भव शङ्कर पाहि माम्
शिव हरे विजयं कुरु मे वरम्

## Verse 3

स्वजन रञ्जन मङ्गल मन्दिरम्
भजति ते पुरुषः परमं पदम्
भवति तस्य सुखं परमाद्भुतम्
शिव हरे विजयं कुरु मे वरम्

## Verse 4

जय युधिष्ठिर वल्लभ भूपते
जय जयार्जित पुण्य पयोनिधे
जय कृपामय कृष्ण नमोऽस्तु ते
शिव हरे विजयं कुरु मे वरम्

## Verse 5

भव विमोचन माधव मापते
सुकवि मानस हंस शिवारते
जनकजारत राघव रक्ष माम्
शिव हरे विजयं कुरु मे वरम्

## Verse 6

अवनि मण्डल मङ्गल मापते
जलद सुन्दर राम रमापते
निगम कीर्ति गुणार्णव गोपते
शिव हरे विजयं कुरु मे वरम्

## Verse 7

पतित पावन नाममयी लता
तव यशो विमलं परिगीयते
तदपि माधव मां किमुपेक्षसे
शिव हरे विजयं कुरु मे वरम्

## Verse 8

अमरतापर देव रमापते
विजयस्तव नाम घनोपमे
मयि कथं करुणार्णव जायते
शिव हरे विजयं कुरु मे वरम्

## Verse 9

हनुमतः प्रिय तोषकर प्रभो
सुरसरिद्धृत शेखर हे गुरो
मम विभो किमु विस्मरणं कृतम्
शिव हरे विजयं कुरु मे वरम्

## Verse 10

नरहरे रति रञ्जन सुन्दरम्
पठति यः शिवराम कृतस्तवम्
विशति रामरमा चरणाम्बुजे
शिव हरे विजयं कुरु मे वरम्`,
    translation: `## Verse 1

O Shiva, O Hari — friend of Rama, O Lord
O all-pervading One, remover of the threefold suffering
O unborn Lord of beings, O Yadava — protect me
O Shiva, O Hari, grant me the boon of victory

## Verse 2

O lotus-eyed Rama, treasure of compassion
O Hara, O Guru, protector of Gajendra, lord of the cows
O Shiva in form, O Shankara — protect me
O Shiva, O Hari, grant me the boon of victory

## Verse 3

Temple of auspiciousness, joy of Your own people
Whoever worships You attains the supreme abode
For that one there comes a bliss most wonderful
O Shiva, O Hari, grant me the boon of victory

## Verse 4

Victory, O king beloved of Yudhishthira
Victory, O ocean of merit won through victory
Victory, compassionate Krishna — salutations to You
O Shiva, O Hari, grant me the boon of victory

## Verse 5

O Madhava, lord of Lakshmi, who frees us from worldly bondage
Swan of the good poets’ minds, You who delight in the auspicious
O Raghava, beloved of Janaka’s daughter — protect me
O Shiva, O Hari, grant me the boon of victory

## Verse 6

O lord of Lakshmi, auspiciousness of the whole earth
O Rama, beautiful as a rain-cloud, lord of Ramaa
O Gopala, ocean of virtues praised in the Vedas
O Shiva, O Hari, grant me the boon of victory

## Verse 7

A creeper of Your name, which purifies the fallen
Your spotless glory is sung on every side
Even so, O Madhava, why do You neglect me?
O Shiva, O Hari, grant me the boon of victory

## Verse 8

O God who grants immortality, lord of Ramaa
Victory is Yours — You whose Name is like a rain-cloud
How does the ocean of compassion arise for me?
O Shiva, O Hari, grant me the boon of victory

## Verse 9

O Lord who gives joy to Hanuman
O Guru whose crown bears the celestial river
O my Lord, why have You forgotten me?
O Shiva, O Hari, grant me the boon of victory

## Verse 10

O Narahari — whoever recites this beautiful hymn
Composed in praise of Shiva and Rama, delight of the heart
Enters the lotus feet of Rama and Ramaa
O Shiva, O Hari, grant me the boon of victory`,
  },
  "mukund-madhav-govind-bole-hari-om-sharan": {
    title: "Mukund Madhav Govind Bole",
    alternate_title: "Keshav Madhav Hari Hari Bol · Krishna Bhajan",
    artist_version: "Hari Om Sharan",
    audio_url: "https://www.youtube.com/watch?v=MVnR-UVlXnA",
    youtube_url: "https://www.youtube.com/watch?v=MVnR-UVlXnA",
    thumbnail_url: "/images/mukund-madhav-govind-bole-hari-om-sharan.jpg",
    cover_url: "/images/mukund-madhav-govind-bole-hari-om-sharan.jpg",
    mini_cover_url: "/images/mukund-madhav-govind-bole-hari-om-sharan.jpg",
    display_order: 304,
    category_slugs: [
      "krishna",
      "ram",
      "shiva",
      "vishnu",
      "general",
      "satsang",
      "janmashtami",
      "bhajan",
      "kirtan",
      "devotion",
      "hindi",
    ],
    meaning:
      "Hari Om Sharan’s name-kirtan — chant Mukund, Madhav, Govind, then Ram, Shiv, and Narayan, and return to Keshav Madhav Hari Hari. The names circle until the close: Hari Hari bol.",
    roman_lyrics: `## Chorus

Mukund Madhav Govind bol
Keshav Madhav Hari Hari bol
Mukund Madhav Govind bol
Keshav Madhav Hari Hari bol

## Verse

Ram Ram bol, Ram Ram bol
Shiv Shiv bol, Shiv Shiv bol
Narayan bol, Narayan bol
Keshav Madhav Hari Hari bol

## Chorus

Mukund Madhav Govind bol
Keshav Madhav Hari Hari bol
Mukund Madhav Govind bol
Keshav Madhav Hari Hari bol

## Closing

Hari Hari bol, Hari Hari bol
Hari Hari bol, Hari Hari bol`,
    devanagari_lyrics: `## Chorus

मुकुन्द माधव गोविन्द बोल
केशव माधव हरि हरि बोल
मुकुन्द माधव गोविन्द बोल
केशव माधव हरि हरि बोल

## Verse

राम राम बोल, राम राम बोल
शिव शिव बोल, शिव शिव बोल
नारायण बोल, नारायण बोल
केशव माधव हरि हरि बोल

## Chorus

मुकुन्द माधव गोविन्द बोल
केशव माधव हरि हरि बोल
मुकुन्द माधव गोविन्द बोल
केशव माधव हरि हरि बोल

## Closing

हरि हरि बोल, हरि हरि बोल
हरि हरि बोल, हरि हरि बोल`,
    translation: `## Chorus

Chant Mukund, Madhav, Govind
Chant Keshav, Madhav — Hari, Hari
Chant Mukund, Madhav, Govind
Chant Keshav, Madhav — Hari, Hari

## Verse

Chant Ram, chant Ram
Chant Shiv, chant Shiv
Chant Narayan, chant Narayan
Chant Keshav, Madhav — Hari, Hari

## Chorus

Chant Mukund, Madhav, Govind
Chant Keshav, Madhav — Hari, Hari
Chant Mukund, Madhav, Govind
Chant Keshav, Madhav — Hari, Hari

## Closing

Chant Hari, Hari — chant Hari, Hari
Chant Hari, Hari — chant Hari, Hari`,
  },
  "govind-bolo-hari-gopal-bolo-kumar-vishu": {
    title: "Govind Bolo Hari Gopal Bolo",
    alternate_title: "Radha Raman Hari Gopal Bolo · Jai Jai Shyam Radhe Shyam",
    artist_version: "Kumar Vishu",
    audio_url: "https://www.youtube.com/watch?v=zy9MtutiJaY",
    youtube_url: "https://www.youtube.com/watch?v=zy9MtutiJaY",
    thumbnail_url: "/images/govind-bolo-hari-gopal-bolo-kumar-vishu-thumb.jpg",
    cover_url: "/images/govind-bolo-hari-gopal-bolo-kumar-vishu-player.jpg",
    mini_cover_url: "/images/govind-bolo-hari-gopal-bolo-kumar-vishu-thumb.jpg",
    display_order: 305,
    category_slugs: [
      "krishna",
      "radha",
      "general",
      "satsang",
      "janmashtami",
      "bhajan",
      "kirtan",
      "devotion",
      "hindi",
    ],
    meaning:
      "Kumar Vishu’s T-Series keertan — chant Govind, Hari Gopal, Radha Raman. Meera’s lament follows: Shyam has turned away, she weeps where no one sees, drinks the cup of poison, and still lives after meeting Giridhar’s eyes.",
    roman_lyrics: `## Chorus

Govind bolo Hari Gopal bolo
Radha Raman Hari Gopal bolo
Govind bolo Hari Gopal bolo
Jai jai Shyam Radhe Shyam
Radhe Shyam, Radhe Shyam

## Verse 1

O ri o, mose mora Shyam rootha
Kahe mora bhaag phoota
Kahe maine paap dhoye
Aansuvan beej boye
Chhup-chhup Meera roye
Dard na jaane koi

## Chorus

Jai jai Shyam Radhe Shyam
Radhe Shyam, Radhe Shyam

## Verse 2

Vish ka pyaala peena pada hai
Maar kar bhi mohe jeena pada hai
Nain milaye Giridhar se
Gir gayi jo apni hi nazar se
Ro-ro naina khoye
Chhup-chhup Meera roye
Dard na jaane koi

## Chorus

Govind bolo Hari Gopal bolo
Radha Raman Hari Gopal bolo
Govind bolo Hari Gopal bolo
Jai jai Shyam Radhe Shyam
Radhe Shyam, Radhe Shyam`,
    devanagari_lyrics: `## Chorus

गोविन्द बोलो हरि गोपाल बोलो
राधा रमण हरि गोपाल बोलो
गोविन्द बोलो हरि गोपाल बोलो
जय जय श्याम राधेश्याम
राधेश्याम, राधेश्याम

## Verse 1

ओ री ओ, मोसे मोरा श्याम रूठा
कहे मोरा भाग फूटा
कहे मैंने पाप धोए
आँसुवन बीज बोए
छुप-छुप मीरा रोए
दर्द ना जाने कोई

## Chorus

जय जय श्याम राधेश्याम
राधेश्याम, राधेश्याम

## Verse 2

विष का प्याला पीना पड़ा है
मारकर भी मोहे जीना पड़ा है
नैन मिलाए गिरधर से
गिर गई जो अपनी ही नज़र से
रो-रो नैना खोए
छुप-छुप मीरा रोए
दर्द ना जाने कोई

## Chorus

गोविन्द बोलो हरि गोपाल बोलो
राधा रमण हरि गोपाल बोलो
गोविन्द बोलो हरि गोपाल बोलो
जय जय श्याम राधेश्याम
राधेश्याम, राधेश्याम`,
    translation: `## Chorus

Chant Govind, chant Hari Gopal
Chant Radha’s beloved, Hari Gopal
Chant Govind, chant Hari Gopal
Victory to Shyam, Radha’s Shyam
Radha’s Shyam, Radha’s Shyam

## Verse 1

O friend — my Shyam has turned away from me
Why has my fate been shattered
Why did I wash my sins away
And sow a crop of tears
Meera weeps in secret
No one knows this pain

## Chorus

Victory to Shyam, Radha’s Shyam
Radha’s Shyam, Radha’s Shyam

## Verse 2

I had to drink the cup of poison
Struck down, I still had to live
When my eyes met Giridhar’s
I fell from my own gaze
Weeping, these eyes are lost
Meera weeps in secret
No one knows this pain

## Chorus

Chant Govind, chant Hari Gopal
Chant Radha’s beloved, Hari Gopal
Chant Govind, chant Hari Gopal
Victory to Shyam, Radha’s Shyam
Radha’s Shyam, Radha’s Shyam`,
  },
  "jay-adhyashakti-aarti-kinjal-dave": {
    title: "Jay Adhyashakti",
    alternate_title: "Jay Adhyashakti Aarti · Om Jayo Jayo Maa Jagdambe · Ambe Maa Aarti",
    artist_version: "Kinjal Dave",
    audio_url: "https://www.youtube.com/watch?v=SU8aghkgeCQ",
    youtube_url: "https://www.youtube.com/watch?v=SU8aghkgeCQ",
    thumbnail_url: "/images/jay-adhyashakti-aarti-kinjal-dave.jpg",
    cover_url: "/images/jay-adhyashakti-aarti-kinjal-dave.jpg",
    mini_cover_url: "/images/jay-adhyashakti-aarti-kinjal-dave.jpg",
    display_order: 306,
    category_slugs: [
      "durga",
      "navratri",
      "general",
      "satsang",
      "aarti",
      "devotion",
      "gujarati",
    ],
    meaning:
      "Kinjal Dave’s Navratri aarti to Adhyashakti, Mother Amba — composed by Shivanand Swami. Each night of the bright fortnight names a form of the Mother, from Padva through Poonam, and closes with the promise that whoever sings Shakti’s aarti finds joy and has sorrow taken away.",
    roman_lyrics: `## Chorus

Om jayo jayo Maa Jagdambe

## Padva

Jay Adhyashakti, Maa Jay Adhyashakti
Akhand brahmand dipavya, padve pragatya Maa

Om jayo jayo Maa Jagdambe

## Beej

Dvitiya bey swaroop, Shiv Shakti jaanu
Brahma gun tav gaye, Hari gaye Har Maa

Om jayo jayo Maa Jagdambe

## Trij

Trutiya tran swaroop, tribhuvanma betha
Traya thaki tarveni, tu tarini Maa

Om jayo jayo Maa Jagdambe

## Choth

Chothe chatura Mahalakshmi Maa, sacharachar vyapya
Char bhuja chau disha, pragatya dakshinma

Om jayo jayo Maa Jagdambe

## Pancham

Panchme panch rishi, panchmi gun padma
Panch sahastra tya sohiye, panche tatvoma

Om jayo jayo Maa Jagdambe

## Chhath

Shashthi tu Narayani, Mahishasur maryo
Nar narina rupe, vyapya saghale Maa

Om jayo jayo Maa Jagdambe

## Satam

Saptami sapt patal, Savitri Sandhya
Gau Ganga Gayatri, Gauri Gita Maa

Om jayo jayo Maa Jagdambe

## Aatham

Ashtami asht bhuja, aai aananda
Sur nar muni var janmya, dev daityoma

Om jayo jayo Maa Jagdambe

## Nom

Navmi navkul naag, seve Navdurga
Navratrina pujan, Shivratrina archan, kidha Har Brahma

Om jayo jayo Maa Jagdambe

## Dasham

Dashmi dash avatar, jai Vijaya Dashmi
Rame Ram ramadya, Ravan rolyo Maa

Om jayo jayo Maa Jagdambe

## Agiyaras

Ekadashi agiyaras, Katyayani Kama
Kamdurga Kalika, Shyama ne Rama

Om jayo jayo Maa Jagdambe

## Baras

Barse bala roop, Bahuchari Amba Maa
Batuk Bhairav sohe, Kal Bhairav sohe, tara chhe tuj Maa

Om jayo jayo Maa Jagdambe

## Teras

Terse Tulja roop, tu taruni Mata
Brahma Vishnu Sadashiv, gun tara gata

Om jayo jayo Maa Jagdambe

## Chaudas

Chaudashe chaud swaroop, Chandi Chamunda
Bhav bhakti kai aapo, chaturai kai aapo, sinhavahini Maa

Om jayo jayo Maa Jagdambe

## Poonam

Pooname kumbh bharyo, sambhaljo karuna
Vashishtha deve vakhanya, gayi shubh kavita

Om jayo jayo Maa Jagdambe

## Pragatya

Sanvat sol sattavan, solshe bavishma
Sanvat sole pragatya, Revane tire, Maa Gangane tire

Om jayo jayo Maa Jagdambe

## Nagri

Trambavati nagri, Maa rupavati nagri
Sol sahastra tya sohiye, kshama karo Gauri, Maa daya karo Gauri

Om jayo jayo Maa Jagdambe

## Aarti

Shivshaktini aarti je koi gashe, je bhave gashe
Bhane Shivanand Swami, sukh sampatti thashe
Har Kailase jashe, Maa Amba dukh harashe

Om jayo jayo Maa Jagdambe

## Closing

E be ek swaroop, antar nav ganaso
Bhola Bhavanine bhajta, bhavsagar tarso

Om jayo jayo Maa Jagdambe`,
    devanagari_lyrics: `## Chorus

ૐ જયો જયો મા જગદંબે

## Padva

જય આદ્યા શક્તિ, મા જય આદ્યા શક્તિ
અખંડ બ્રહ્માંડ દિપાવ્યા, પડવે પ્રગટ્યા મા

ૐ જયો જયો મા જગદંબે

## Beej

દ્વિતીયા બેય સ્વરૂપ, શિવ શક્તિ જાણું
બ્રહ્મા ગુણ તવ ગાયે, હરિ ગાયે હર મા

ૐ જયો જયો મા જગદંબે

## Trij

તૃતીયા ત્રણ સ્વરૂપ, ત્રિભુવનમાં બેઠા
ત્રયા થકી તરવેણી, તું તારિણી મા

ૐ જયો જયો મા જગદંબે

## Choth

ચોથે ચતુરા મહાલક્ષ્મી મા, સચરાચર વ્યાપ્યા
ચાર ભૂજા ચૌ દિશા, પ્રગટ્યા દક્ષિણમાં

ૐ જયો જયો મા જગદંબે

## Pancham

પંચમે પંચ ઋષિ, પંચમી ગુણ પદ્મા
પંચ સહસ્ત્ર ત્યાં સોહિયે, પંચે તત્વોમાં

ૐ જયો જયો મા જગદંબે

## Chhath

ષષ્ઠી તું નારાયણી, મહિષાસુર માર્યો
નર નારીના રૂપે, વ્યાપ્યાં સઘળે મા

ૐ જયો જયો મા જગદંબે

## Satam

સપ્તમી સપ્ત પાતાલ, સાવિત્રી સંધ્યા
ગૌ ગંગા ગાયત્રી, ગૌરી ગીતા મા

ૐ જયો જયો મા જગદંબે

## Aatham

અષ્ટમી અષ્ટ ભુજા, આઈ આનંદા
સુર નર મુનિ વર જનમ્યા, દેવ દૈત્યોમાં

ૐ જયો જયો મા જગદંબે

## Nom

નવમી નવકુળ નાગ, સેવે નવદુર્ગા
નવરાત્રીના પૂજન, શિવરાત્રીના અર્ચન, કીધા હર બ્રહ્મા

ૐ જયો જયો મા જગદંબે

## Dasham

દશમી દશ અવતાર, જય વિજયા દશમી
રામે રામ રમાડ્યા, રાવણ રોળ્યો મા

ૐ જયો જયો મા જગદંબે

## Agiyaras

એકાદશી અગિયારસ, કાત્યાયની કામા
કામદુર્ગા કાલિકા, શ્યામા ને રામા

ૐ જયો જયો મા જગદંબે

## Baras

બારસે બાળા રૂપ, બહુચરી અંબા મા
બટુક ભૈરવ સોહે, કાળ ભૈરવ સોહે, તારા છે તુજ મા

ૐ જયો જયો મા જગદંબે

## Teras

તેરસે તુળજા રૂપ, તું તારુણી માતા
બ્રહ્મા વિષ્ણુ સદાશિવ, ગુણ તારા ગાતાં

ૐ જયો જયો મા જગદંબે

## Chaudas

ચૌદશે ચૌદ સ્વરૂપ, ચંડી ચામુંડા
ભાવ ભક્તિ કંઈ આપો, ચતુરાઈ કંઈ આપો, સિંહવાહિની મા

ૐ જયો જયો મા જગદંબે

## Poonam

પૂનમે કુંભ ભર્યો, સાંભળજો કરુણા
વશિષ્ઠ દેવે વખાણ્યા, ગાઈ શુભ કવિતા

ૐ જયો જયો મા જગદંબે

## Pragatya

સંવત સોળ સત્તાવન, સોળસે બાવીસમાં
સંવત સોળે પ્રગટ્યા, રેવાને તીરે, મા ગંગાને તીરે

ૐ જયો જયો મા જગદંબે

## Nagri

ત્રંબાવટી નગરી, મા રૂપાવતી નગરી
સોળ સહસ્ત્ર ત્યાં સોહીએ, ક્ષમા કરો ગૌરી, મા દયા કરો ગૌરી

ૐ જયો જયો મા જગદંબે

## Aarti

શિવશક્તિની આરતી જે કોઈ ગાશે, જે ભાવે ગાશે
ભણે શિવાનંદ સ્વામી, સુખ સંપત્તિ થાશે
હર કૈલાસે જાશે, મા અંબા દુઃખ હરશે

ૐ જયો જયો મા જગદંબે

## Closing

એ બે એક સ્વરૂપ, અંતર નવ ગણશો
ભોળા ભવાનીને ભજતાં, ભવસાગર તરશો

ૐ જયો જયો મા જગદંબે`,
    translation: `## Chorus

Om — victory, victory, Mother of the world

## Padva

Victory to the primal Shakti, Mother, victory to the primal Shakti
You lit the whole universe; on Padva You appeared, Mother

Om — victory, victory, Mother of the world

## Beej

On the second, both forms — I know You as Shiva and Shakti
Brahma sings Your glory, Hari sings, Hara sings, Mother

Om — victory, victory, Mother of the world

## Trij

On the third, three forms, seated in the three worlds
You are the confluence of the three, You who carry us across, Mother

Om — victory, victory, Mother of the world

## Choth

On the fourth, clever Mahalakshmi, present in all that moves and is still
Four arms, the four directions — You appeared in the south

Om — victory, victory, Mother of the world

## Pancham

On the fifth, the five sages, the lotus of Your qualities
Five thousand shine there, in the five elements

Om — victory, victory, Mother of the world

## Chhath

On the sixth You are Narayani, who slew Mahishasur
In the form of man and woman You fill everything, Mother

Om — victory, victory, Mother of the world

## Satam

On the seventh, the seven underworlds, Savitri and Sandhya
Cow, Ganga, Gayatri, Gauri, and Gita, Mother

Om — victory, victory, Mother of the world

## Aatham

On the eighth, eight-armed, You come in joy
Gods, humans, and sages are born — among devas and daityas

Om — victory, victory, Mother of the world

## Nom

On the ninth, the nine lines of nagas serve the nine Durgas
Navratri’s worship and Shivratri’s offering were made by Hara and Brahma

Om — victory, victory, Mother of the world

## Dasham

On the tenth, the ten avatars — victory, Vijaya Dashami
Ram played Ram’s play and crushed Ravana, Mother

Om — victory, victory, Mother of the world

## Agiyaras

On Ekadashi, Katyayani who fulfils desire
Kamadurga, Kalika, Shyama and Rama

Om — victory, victory, Mother of the world

## Baras

On the twelfth, a child’s form, Bahuchari Amba, Mother
Batuk Bhairav adorns You, Kal Bhairav adorns You — they are Yours, Mother

Om — victory, victory, Mother of the world

## Teras

On the thirteenth, the form of Tulja, You are the Mother who saves
Brahma, Vishnu, and Sadashiv sing Your qualities

Om — victory, victory, Mother of the world

## Chaudas

On the fourteenth, fourteen forms, Chandi and Chamunda
Give us a little devotion, give us a little wisdom, lion-riding Mother

Om — victory, victory, Mother of the world

## Poonam

On the full moon the pot is filled — hear us with compassion
The sage Vashishtha praised You, and an auspicious poem was sung

Om — victory, victory, Mother of the world

## Pragatya

In Samvat sixteen fifty-seven, in sixteen twenty-two
In Samvat sixteen You appeared on Reva’s bank, on Ganga’s bank, Mother

Om — victory, victory, Mother of the world

## Nagri

Trambavati town, Mother, the beautiful town
Sixteen thousand shine there — forgive us, Gauri; have mercy, Gauri, Mother

Om — victory, victory, Mother of the world

## Aarti

Whoever sings this aarti of Shiva-Shakti, whoever sings it with love
So says Shivanand Swami — happiness and wealth will come
They will go to Hara’s Kailash; Mother Amba will take sorrow away

Om — victory, victory, Mother of the world

## Closing

Those two are one form — do not count them apart
Worshipping Bhola and Bhavani, you will cross the ocean of becoming

Om — victory, victory, Mother of the world`,
  },
  "jai-ambe-maa-bolo-lata-mangeshkar": {
    title: "Jai Ambe Maa Bolo",
    alternate_title: "Jai Ambe Maa · Jai Durge Maa · Khoon Ki Pukaar",
    artist_version: "Mohammed Rafi & Lata Mangeshkar",
    audio_url: "https://www.youtube.com/watch?v=ZMty9cXmLNU",
    youtube_url: "https://www.youtube.com/watch?v=ZMty9cXmLNU",
    thumbnail_url: "/images/jai-ambe-maa-bolo-lata-mangeshkar.jpg",
    cover_url: "/images/jai-ambe-maa-bolo-lata-mangeshkar.jpg",
    mini_cover_url: "/images/jai-ambe-maa-bolo-lata-mangeshkar.jpg",
    display_order: 307,
    category_slugs: [
      "durga",
      "navratri",
      "general",
      "satsang",
      "bhajan",
      "devotion",
      "hindi",
    ],
    meaning:
      "Navratri bhajan from Khoon Ki Pukaar (1978), sung by Mohammed Rafi and Lata Mangeshkar. Hasrat Jaipuri’s words, Bappi Lahiri’s tune: call Jai Ambe, Jai Durge, then ask the Mother for her shade, her gaze, and the treasure of love at her feet.",
    roman_lyrics: `## Chorus

Jai Ambe Maa bolo
Jai Durge Maa bolo
Jai Ambe Maa bolo
Jai Durge Maa

## Verse 1

Tere dwaare, tere dwaare
Jo bhi aaya, jeewan paaya
Maa, sabse nyaari, aprampaari
Teri chhaaya
Maa, hum pe rahe teri nazar
Teri dagar, sachchi dagar
Tu hai Maa, sabki Maa

## Chorus

Jai Ambe Maa bolo
Jai Durge Maa bolo
Jai Ambe Maa bolo
Jai Durge Maa

## Verse 2

Jai jai Maa, jai jai Maa, jai Maa
Tere bina kuch bhi nahi
Jo bhi hai, sab yahan
Jai jai Maa, jai jai Maa, jai Maa
Upar wala, upar wala
Khol chuka hai tera yeh thikana
Tere charnon mein pada hua hai
Kab se prem khazana
Maya teri jisko mile
Usko sada chain mile
Meri Maa, Devi Maa

## Chorus

Jai Ambe Maa bolo
Jai Durge Maa bolo
Jai Ambe Maa bolo
Jai Durge Maa

## Verse 3

Jai jai Maa, jai jai Maa, jai Maa
Teri leela tu hi jaane
Tu hai Devi Maa
Jai jai Maa, jai jai Maa, jai Maa
Tere bande kitne sundar
Jinko tune banaya
Un bandon se pyaar kare wo
Usne tujhko paya
Mera jeevan tere charan
De de mujhe pyaar ka dhan
Sun le Maa, meri Maa

## Chorus

Jai Ambe Maa bolo
Jai Durge Maa bolo
Jai Ambe Maa bolo
Jai Durge Maa

## Closing

Jai Maa, jai Maa
Jai Maa, jai Maa

## Chorus

Jai Ambe Maa bolo
Jai Durge Maa bolo
Jai Ambe Maa bolo
Jai Durge Maa`,
    devanagari_lyrics: `## Chorus

जय अम्बे माँ बोलो
जय दुर्गे माँ बोलो
जय अम्बे माँ बोलो
जय दुर्गे माँ

## Verse 1

तेरे द्वारे, तेरे द्वारे
जो भी आया, जीवन पाया
माँ, सबसे न्यारी, अपरम्पार
तेरी छाया
माँ, हम पे रहे तेरी नज़र
तेरी डगर, सच्ची डगर
तू है माँ, सबकी माँ

## Chorus

जय अम्बे माँ बोलो
जय दुर्गे माँ बोलो
जय अम्बे माँ बोलो
जय दुर्गे माँ

## Verse 2

जय जय माँ, जय जय माँ, जय माँ
तेरे बिना कुछ भी नहीं
जो भी है, सब यहाँ
जय जय माँ, जय जय माँ, जय माँ
ऊपर वाला, ऊपर वाला
खोल चुका है तेरा ये ठिकाना
तेरे चरणों में पड़ा हुआ है
कब से प्रेम खज़ाना
माया तेरी जिसको मिले
उसको सदा चैन मिले
मेरी माँ, देवी माँ

## Chorus

जय अम्बे माँ बोलो
जय दुर्गे माँ बोलो
जय अम्बे माँ बोलो
जय दुर्गे माँ

## Verse 3

जय जय माँ, जय जय माँ, जय माँ
तेरी लीला तू ही जाने
तू है देवी माँ
जय जय माँ, जय जय माँ, जय माँ
तेरे बंदे कितने सुंदर
जिनको तूने बनाया
उन बंदों से प्यार करे वो
उसने तुझको पाया
मेरा जीवन तेरे चरण
दे दे मुझे प्यार का धन
सुन ले माँ, मेरी माँ

## Chorus

जय अम्बे माँ बोलो
जय दुर्गे माँ बोलो
जय अम्बे माँ बोलो
जय दुर्गे माँ

## Closing

जय माँ, जय माँ
जय माँ, जय माँ

## Chorus

जय अम्बे माँ बोलो
जय दुर्गे माँ बोलो
जय अम्बे माँ बोलो
जय दुर्गे माँ`,
    translation: `## Chorus

Say victory to Mother Ambe
Say victory to Mother Durga
Say victory to Mother Ambe
Victory to Mother Durga

## Verse 1

At Your door, at Your door
Whoever came found life
Mother, most wondrous, beyond measure
Is Your shade
Mother, keep Your gaze on us
Your path is the true path
You are the Mother of everyone

## Chorus

Say victory to Mother Ambe
Say victory to Mother Durga
Say victory to Mother Ambe
Victory to Mother Durga

## Verse 2

Victory to the Mother, victory to the Mother
Without You, nothing is
Whatever is, is all here
Victory to the Mother, victory to the Mother
The One above, the One above
Has opened this dwelling of Yours
At Your feet has lain
The treasure of love, for so long
Whoever receives Your grace
Finds peace forever
My Mother, Goddess Mother

## Chorus

Say victory to Mother Ambe
Say victory to Mother Durga
Say victory to Mother Ambe
Victory to Mother Durga

## Verse 3

Victory to the Mother, victory to the Mother
Only You know Your play
You are the Goddess Mother
Victory to the Mother, victory to the Mother
How beautiful are the people You made
The ones You created
Whoever loves those people
Has found You
My life is at Your feet
Give me the wealth of love
Hear me, Mother, my Mother

## Chorus

Say victory to Mother Ambe
Say victory to Mother Durga
Say victory to Mother Ambe
Victory to Mother Durga

## Closing

Victory to the Mother, victory to the Mother
Victory to the Mother, victory to the Mother

## Chorus

Say victory to Mother Ambe
Say victory to Mother Durga
Say victory to Mother Ambe
Victory to Mother Durga`,
  },
  "mari-mata-na-pagla-jya-jya-thay-geeta-rabari": {
    title: "Mari Mata Na Pagla",
    alternate_title: "Mari Mata Na Pagla Jya Jya Thay · Ramzat Mashup",
    artist_version: "Geeta Rabari",
    audio_url: "https://www.youtube.com/watch?v=5xgNmBbq55w",
    youtube_url: "https://www.youtube.com/watch?v=5xgNmBbq55w",
    thumbnail_url: "/images/mari-mata-na-pagla-jya-jya-thay-geeta-rabari.jpg",
    cover_url: "/images/mari-mata-na-pagla-jya-jya-thay-geeta-rabari.jpg",
    mini_cover_url: "/images/mari-mata-na-pagla-jya-jya-thay-geeta-rabari.jpg",
    display_order: 308,
    category_slugs: [
      "durga",
      "navratri",
      "general",
      "satsang",
      "bhajan",
      "devotion",
      "gujarati",
    ],
    meaning:
      "Geeta Rabari’s Gujarati Mata song from Ramzat Mashup. Wherever the Mother’s footprints fall, good follows — a word of hers opens a locked fate, and whoever meets her finds the path even through water.",
    roman_lyrics: `## Chorus

He mari Mata na pagla jya jya thay
Tya tya sahunu saru thay
He mari Mata na pagla jya jya thay
Tya tya sahunu saru thay

## Verse 1

He mari Mata ni koidi vaat na thay
Bandh kismat na tala khuli jay
Madhale Maa na diva thay
Jeevan ma anjvala thay

## Chorus

He mari Mata na pagla jya jya thay
Tya tya sahunu saru thay

## Verse 2

He aashish Maa na khole jay
Avli baji havli thay
Maa ni re man ma charcha thay
Pani ma rasta thai jay
Kadiye vaal eno vanko na thay
Mari Mata jene mali jay

## Chorus

He mari Mata na pagla jya jya thay
Tya tya sahunu saru thay`,
    devanagari_lyrics: `## Chorus

હે મારી માતાના પગલા જ્યાં જ્યાં થાય
ત્યાં ત્યાં સહુનું સારું થાય
હે મારી માતાના પગલા જ્યાં જ્યાં થાય
ત્યાં ત્યાં સહુનું સારું થાય

## Verse 1

હે મારી માતાની કોઈદી વાતના થાય
બંધ કિસ્મતના તાળા ખુલી જાય
મઢળે માંના દીવા થાય
જીવનમાં અંજવાળા થાય

## Chorus

હે મારી માતાના પગલા જ્યાં જ્યાં થાય
ત્યાં ત્યાં સહુનું સારું થાય

## Verse 2

હે આશિષ માંના ખોળે જાય
અવળી બાજી હવળી થાય
માંની રે મનમાં ચર્ચા થાય
પાણીમાં રસ્તા થઈ જાય
કદીયે વાળ એનો વાંકો ના થાય
મારી માતા જેને મળી જાય

## Chorus

હે મારી માતાના પગલા જ્યાં જ્યાં થાય
ત્યાં ત્યાં સહુનું સારું થાય`,
    translation: `## Chorus

Wherever my Mother’s footprints fall
There, everyone’s good comes to be
Wherever my Mother’s footprints fall
There, everyone’s good comes to be

## Verse 1

When even a word of my Mother is spoken
The locks of a closed fate swing open
The Mother’s lamps are lit in the courtyard
Light comes into life

## Chorus

Wherever my Mother’s footprints fall
There, everyone’s good comes to be

## Verse 2

Blessings come to rest in the Mother’s lap
A losing game turns and is won
When the Mother is spoken of in the heart
A path appears even through water
Nothing of hers is ever bent out of place
For whoever meets my Mother

## Chorus

Wherever my Mother’s footprints fall
There, everyone’s good comes to be`,
  },
  "durga-hai-meri-maa-mahendra-kapoor": {
    title: "Durga Hai Meri Maa",
    alternate_title: "Durga Hai Meri Maa · Ambe Hai Meri Maa · Kranti",
    artist_version: "Mahendra Kapoor & Minoo Purushottam",
    audio_url: "https://www.youtube.com/watch?v=6_OmPB8h2vU",
    youtube_url: "https://www.youtube.com/watch?v=6_OmPB8h2vU",
    thumbnail_url: "/images/durga-hai-meri-maa-mahendra-kapoor.jpg",
    cover_url: "/images/durga-hai-meri-maa-mahendra-kapoor.jpg",
    mini_cover_url: "/images/durga-hai-meri-maa-mahendra-kapoor.jpg",
    display_order: 309,
    category_slugs: [
      "durga",
      "navratri",
      "general",
      "satsang",
      "bhajan",
      "devotion",
      "hindi",
    ],
    meaning:
      "Navratri bhajan from Kranti (1981), sung by Mahendra Kapoor and Minoo Purushottam. Music by Laxmikant–Pyarelal. The jaikara of Sheronwali: Durga is my Mother, Ambe is my Mother, and no one who comes to her door leaves empty-handed.",
    roman_lyrics: `## Opening

Jaikara Sheronwali ka
Bol sanche darbar ki jai

## Chorus

Durga hai meri Maa
Ambe hai meri Maa
Durga hai meri Maa
Ambe hai meri Maa

## Verse 1

O bolo jai Mata ki, jai ho
O bolo jai Mata ki, jai ho
Jo bhi dar pe aaye, jai ho
Woh khali na jaye, jai ho
Sabke kaam hain karti, jai ho
Sabke dukh yeh harti, jai ho
O Maiya Sheronwali, jai ho
Bhar do jholi khali, jai ho

## Chorus

Durga hai meri Maa
Ambe hai meri Maa
Durga hai meri Maa
Ambe hai meri Maa

## Verse 2

Meri Maa Sheronwali
Poore kare armaan jo saare
Deti hai vardan jo saare
Ambe Jyotanwaliye
Deti hai vardan jo saare

## Chorus

Durga hai meri Maa
Ambe hai meri Maa
Durga hai meri Maa
Ambe hai meri Maa

## Verse 3

Latanwaliye, Mehranwaliye
Saare jag ko khel khilaye
Bichhdon ko jo khub milaye
Durge Mehranwaliye
Bichhdon ko jo khub milaye

## Names

Sheronwaliye
Durga hai meri Maa
Ambe hai meri Maa
Jyotanwaliye
Durga hai meri Maa
Ambe hai meri Maa
Oonche mandiranwaliye
Durga hai meri Maa
Ambe hai meri Maa
Sheronwaliye`,
    devanagari_lyrics: `## Opening

जयकारा शेरोवाली का
बोल सांचे दरबार की जय

## Chorus

दुर्गा है मेरी माँ
अम्बे है मेरी माँ
दुर्गा है मेरी माँ
अम्बे है मेरी माँ

## Verse 1

ओ बोलो जय माता की, जय हो
ओ बोलो जय माता की, जय हो
जो भी दर पे आए, जय हो
वो खाली न जाए, जय हो
सबके काम हैं करती, जय हो
सबके दुख ये हरती, जय हो
ओ मैया शेरोवाली, जय हो
भर दो झोली खाली, जय हो

## Chorus

दुर्गा है मेरी माँ
अम्बे है मेरी माँ
दुर्गा है मेरी माँ
अम्बे है मेरी माँ

## Verse 2

मेरी माँ शेरोवाली
पूरे करे अरमान जो सारे
देती है वरदान जो सारे
अम्बे ज्योतनवालिये
देती है वरदान जो सारे

## Chorus

दुर्गा है मेरी माँ
अम्बे है मेरी माँ
दुर्गा है मेरी माँ
अम्बे है मेरी माँ

## Verse 3

लतावालीये, मेहरानवालिये
सारे जग को खेल खिलाए
बिछड़ों को जो खूब मिलाए
दुर्गे मेहरानवालिये
बिछड़ों को जो खूब मिलाए

## Names

शेरोवालिये
दुर्गा है मेरी माँ
अम्बे है मेरी माँ
ज्योतनवालिये
दुर्गा है मेरी माँ
अम्बे है मेरी माँ
ऊँचे मंदिरनवालीये
दुर्गा है मेरी माँ
अम्बे है मेरी माँ
शेरोवालिये`,
    translation: `## Opening

The victory cry of the lion-riding Mother
Say victory to the true court

## Chorus

Durga is my Mother
Ambe is my Mother
Durga is my Mother
Ambe is my Mother

## Verse 1

Say victory to the Mother, victory
Say victory to the Mother, victory
Whoever comes to the door, victory
Does not leave empty, victory
She does everyone’s work, victory
She takes away everyone’s sorrow, victory
O Mother who rides the lion, victory
Fill the empty cloth, victory

## Chorus

Durga is my Mother
Ambe is my Mother
Durga is my Mother
Ambe is my Mother

## Verse 2

My Mother, rider of the lion
She fulfils every wish
She gives every blessing
Ambe, Mother of light
She gives every blessing

## Chorus

Durga is my Mother
Ambe is my Mother
Durga is my Mother
Ambe is my Mother

## Verse 3

Mother of the vines, Mother of grace
She sets the whole world to play
She brings the separated together
Durga, Mother of grace
She brings the separated together

## Names

Rider of the lion
Durga is my Mother
Ambe is my Mother
Mother of light
Durga is my Mother
Ambe is my Mother
Mother of the high temples
Durga is my Mother
Ambe is my Mother
Rider of the lion`,
  },
  "fararar-eto-fare-re-kamlesh-barot": {
    title: "Fararar Eto Fare Re",
    alternate_title: "Fararar Eto Fare Re · Ghumariyalo Ghaghro · Zheelan",
    artist_version: "Kamlesh Barot",
    audio_url: "https://www.youtube.com/watch?v=Nm-NU0XrDk0",
    youtube_url: "https://www.youtube.com/watch?v=Nm-NU0XrDk0",
    thumbnail_url: "/images/fararar-eto-fare-re-kamlesh-barot.jpg",
    cover_url: "/images/fararar-eto-fare-re-kamlesh-barot.jpg",
    mini_cover_url: "/images/fararar-eto-fare-re-kamlesh-barot.jpg",
    display_order: 310,
    category_slugs: ["navratri", "durga", "gujarati"],
    meaning:
      "Kamlesh Barot’s Navratri timli from Zheelan. The skirt spins and spins — pom-poms, a painted peacock, diamonds and pearls, and a pattern in her name.",
    roman_lyrics: `## Chorus

He fararar eto fare re
Fararar eto fare re
He gori taro ghumariyalo ghaghro
He chhori taro ghumariyalo ghaghro

## Verse

Ae gori tara, gori tara, gori tara
Ghaghrama fumta melavu
He ae re fumtama gori mor chitravu
Ghaghrama tara hira moti re madhavu
Gori tara naamni bhaat chitravu

## Chorus

Fararar eto fare re
Fararar eto fare re
Gori taro ghumariyalo ghaghro
Gori taro ghumariyalo ghaghro`,
    devanagari_lyrics: `## Chorus

હે ફરરર એતો ફરે રે
ફરરર એતો ફરે રે
હે ગોરી તારો ઘૂમરીયાળો ઘાઘરો
હે છોરી તારો ઘૂમરીયાળો ઘાઘરો

## Verse

એ ગોરી તારા, ગોરી તારા, ગોરી તારા
ઘાઘરામાં ફૂમતા મેલાવું
હે એ રે ફૂમતામાં ગોરી મોર ચીતરાવું
ઘાઘરામાં તારા હીરા મોતી રે મઢાવું
ગોરી તારા નામની ભાત ચીતરાવું

## Chorus

ફરરર એતો ફરે રે
ફરરર એતો ફરે રે
ગોરી તારો ઘૂમરીયાળો ઘાઘરો
ગોરી તારો ઘૂમરીયાળો ઘાઘરો`,
    translation: `## Chorus

Oh, it spins and spins
It spins and spins
Fair one, your swirling skirt
Girl, your swirling skirt

## Verse

O fair one, fair one, fair one
In the skirt I will set the pom-poms
In those pom-poms I will paint a peacock
In the skirt I will set diamonds and pearls
I will paint a pattern of your name

## Chorus

It spins and spins
It spins and spins
Fair one, your swirling skirt
Fair one, your swirling skirt`,
  },
  "mithe-ras-se-bharyo-kinjal-dave": {
    title: "Mithe Ras Se Bharyo",
    alternate_title: "Mithe Ras Se Bharyo · Radha Rani Lage · Killol",
    artist_version: "Kinjal Dave",
    audio_url: "https://www.youtube.com/watch?v=XQPh_zsvFmA",
    youtube_url: "https://www.youtube.com/watch?v=XQPh_zsvFmA",
    thumbnail_url: "/images/mithe-ras-se-bharyo-kinjal-dave.jpg",
    cover_url: "/images/mithe-ras-se-bharyo-kinjal-dave.jpg",
    mini_cover_url: "/images/mithe-ras-se-bharyo-kinjal-dave.jpg",
    display_order: 311,
    category_slugs: ["krishna", "radha", "navratri", "gujarati"],
    meaning:
      "Kinjal Dave’s garba from Killol. The dark water of the Yamuna feels sweet because Radha is in it — fair Radha of Barsana, raising a stir in Vrindavan.",
    roman_lyrics: `## Chorus

Mithe ras se bharyo re
Radha rani lage, Radha rani lage
Mane karo karo Yamunaji no pani lage

## Verse 1

Jamuna maiya kari kari
Radha gori gori
Vrindavan ma dhum machave
Barsane ki chhori
Vrajdham Radhaji ki rajdhani lage

## Chorus

Mithe ras se bharyo re
Radha rani lage, Radha rani lage
Mane karo karo Yamunaji no pani lage

## Verse 2

Kana nit murali ma
Tere sumire barambar
Koti roop dhare Manmohan
Kahun na pave paar
He roop rang ki chhabili patrani lage

## Chorus

Mithe ras se bharyo re
Radha rani lage, Radha rani lage
Mane karo karo Yamunaji no pani lage`,
    devanagari_lyrics: `## Chorus

મીઠે રસ સે ભર્યો રે
રાધા રાણી લાગે, રાધા રાણી લાગે
મને કારો કારો યમુનાજીનો પાણી લાગે

## Verse 1

જમુના મૈયા કારી કારી
રાધા ગૌરી ગૌરી
વૃંદાવનમાં ધૂમ મચાવે
બરસાને કી છોરી
વ્રજધામ રાધાજી કી રાજધાની લાગે

## Chorus

મીઠે રસ સે ભર્યો રે
રાધા રાણી લાગે, રાધા રાણી લાગે
મને કારો કારો યમુનાજીનો પાણી લાગે

## Verse 2

કાના નિત મુરલીમાં
તેરે સુમીરે બારંબાર
કોટી રૂપ ધરે મનમોહન
કહું ન પાવે પાર
હે રૂપરંગ કી છબીલી પટરાણી લાગે

## Chorus

મીઠે રસ સે ભર્યો રે
રાધા રાણી લાગે, રાધા રાણી લાગે
મને કારો કારો યમુનાજીનો પાણી લાગે`,
    translation: `## Chorus

Filled with sweet nectar
Radha the queen feels so, Radha the queen feels so
The dark, dark water of the Yamuna feels so to me

## Verse 1

Mother Yamuna is dark, dark
Radha is fair, fair
She raises a stir in Vrindavan
The girl of Barsana
Vraj feels like Radha’s own capital

## Chorus

Filled with sweet nectar
Radha the queen feels so, Radha the queen feels so
The dark, dark water of the Yamuna feels so to me

## Verse 2

Kanha, in the flute each day
Remembers you again and again
Manmohan takes countless forms
No one can reach the end of them
The beautiful queen of colour and form feels so

## Chorus

Filled with sweet nectar
Radha the queen feels so, Radha the queen feels so
The dark, dark water of the Yamuna feels so to me`,
  },
  "chogada-unplugged-darshan-raval": {
    title: "Chogada (Unplugged)",
    alternate_title: "Chogada Tara · Loveyatri",
    artist_version: "Darshan Raval",
    audio_url: "https://www.youtube.com/watch?v=dOLyA3MJEmw",
    youtube_url: "https://www.youtube.com/watch?v=dOLyA3MJEmw",
    thumbnail_url: "/images/chogada-unplugged-darshan-raval.jpg",
    cover_url: "/images/chogada-unplugged-darshan-raval.jpg",
    mini_cover_url: "/images/chogada-unplugged-darshan-raval.jpg",
    display_order: 312,
    category_slugs: ["navratri", "gujarati"],
    meaning:
      "Unplugged Chogada from Loveyatri. Darshan Raval’s Navratri garba: the night has come, this is the season of love, and the colourful star keeps watching for you.",
    roman_lyrics: `## Verse 1

Ho aavi gayi raat
Ane bhulo badhi vaat
Prem ni aa mausam chhe
Ab aao mere paas
Reh jaao mere saath
Prem ni aa mausam chhe

Mil jaaye mujhko agar saath tera
Toh bhoolun main saara jahaan

## Chorus

Chogada tara
Chabeela tara
Rangeela tara
Rangbheru jue tari vaat re

Chogada tara
O re chhabila tara
O re rangeela tara
Rangbheru jue tari vaat re

## Verse 2

Chup chup ke tumhe
Dekha main karun
Saari saari raat
Saari saari raat

Chup chup ke mujhe
Dekha tu kare
Saari saari raat
Saari saari raat

Mil jaaye mujhko agar saath tera
Toh bhoolun main saara jahaan

## Chorus

Chogada tara
Chabeela tara
Rangeela tara
Rangbheru jue tari vaat re

Chogada tara
O re chhabila tara
O re rangeela tara
Rangbheru jue tari vaat re`,
    devanagari_lyrics: `## Verse 1

હો આવી ગઈ રાત
અને ભૂલો બધી વાત
પ્રેમ ની આ મોસમ છે
अब आओ मेरे पास
रह जाओ मेरे साथ
પ્રેમ ની આ મોસમ છે

मिल जाए मुझको अगर साथ तेरा
तो भूलूँ मैं सारा जहाँ

## Chorus

ચોગાડા તારા
છબીલા તારા
રંગીલા તારા
રંગભેરૂ જુએ તારી વાટ રે

ચોગાડા તારા
ઓ રે છબીલા તારા
ઓ રે રંગીલા તારા
રંગભેરૂ જુએ તારી વાટ રે

## Verse 2

छुप छुप के तुम्हें
देखा मैं करूँ
सारी सारी रात
सारी सारी रात

छुप छुप के मुझे
देखा तू करे
सारी सारी रात
सारी सारी रात

मिल जाए मुझको अगर साथ तेरा
तो भूलूँ मैं सारा जहाँ

## Chorus

ચોગાડા તારા
છબીલા તારા
રંગીલા તારા
રંગભેરૂ જુએ તારી વાટ રે

ચોગાડા તારા
ઓ રે છબીલા તારા
ઓ રે રંગીલા તારા
રંગભેરૂ જુએ તારી વાટ રે`,
    translation: `## Verse 1

The night has come
Forget every other matter
This is the season of love
Now come close to me
Stay here with me
This is the season of love

If I get to be with you
I would forget the whole world

## Chorus

Beloved star
Charming star
Colourful star
Dressed in colour, watching your path

Beloved star
O charming star
O colourful star
Dressed in colour, watching your path

## Verse 2

Quietly, at you
I keep looking
All night long
All night long

Quietly, at me
You keep looking
All night long
All night long

If I get to be with you
I would forget the whole world

## Chorus

Beloved star
Charming star
Colourful star
Dressed in colour, watching your path

Beloved star
O charming star
O colourful star
Dressed in colour, watching your path`,
  },
  "chogada-darshan-raval": {
    title: "Chogada",
    alternate_title: "Chogada Tara · Loveyatri",
    artist_version: "Darshan Raval & Asees Kaur",
    audio_url: "https://www.youtube.com/watch?v=yr7JFNsz5dU",
    youtube_url: "https://www.youtube.com/watch?v=yr7JFNsz5dU",
    thumbnail_url: "/images/chogada-darshan-raval.jpg",
    cover_url: "/images/chogada-darshan-raval.jpg",
    mini_cover_url: "/images/chogada-darshan-raval.jpg",
    display_order: 313,
    category_slugs: ["navratri", "gujarati"],
    meaning:
      "Chogada from Loveyatri, sung by Darshan Raval and Asees Kaur. A Navratri garba: the night has come, this is the season of love, and the colourful star keeps watching for you.",
    roman_lyrics: `## Verse 1

Ho aavi gayi raat
Ane bhulo badhi vaat
Prem ni aa mausam chhe
Ab aao mere paas
Reh jaao mere saath
Prem ni aa mausam chhe

Mil jaaye mujhko agar saath tera
Toh bhoolun main saara jahaan

## Chorus

Chogada tara
Chabeela tara
Rangeela tara
Rangbheru jue tari vaat re

Chogada tara
O re chhabila tara
O re rangeela tara
Rangbheru jue tari vaat re

## Verse 2

Chup chup ke tumhe
Dekha main karun
Saari saari raat
Saari saari raat

Chup chup ke mujhe
Dekha tu kare
Saari saari raat
Saari saari raat

Mil jaaye mujhko agar saath tera
Toh bhoolun main saara jahaan

## Chorus

Chogada tara
Chabeela tara
Rangeela tara
Rangbheru jue tari vaat re

Chogada tara
O re chhabila tara
O re rangeela tara
Rangbheru jue tari vaat re`,
    devanagari_lyrics: `## Verse 1

હો આવી ગઈ રાત
અને ભૂલો બધી વાત
પ્રેમ ની આ મોસમ છે
अब आओ मेरे पास
रह जाओ मेरे साथ
પ્રેમ ની આ મોસમ છે

मिल जाए मुझको अगर साथ तेरा
तो भूलूँ मैं सारा जहाँ

## Chorus

ચોગાડા તારા
છબીલા તારા
રંગીલા તારા
રંગભેરૂ જુએ તારી વાટ રે

ચોગાડા તારા
ઓ રે છબીલા તારા
ઓ રે રંગીલા તારા
રંગભેરૂ જુએ તારી વાટ રે

## Verse 2

छुप छुप के तुम्हें
देखा मैं करूँ
सारी सारी रात
सारी सारी रात

छुप छुप के मुझे
देखा तू करे
सारी सारी रात
सारी सारी रात

मिल जाए मुझको अगर साथ तेरा
तो भूलूँ मैं सारा जहाँ

## Chorus

ચોગાડા તારા
છબીલા તારા
રંગીલા તારા
રંગભેરૂ જુએ તારી વાટ રે

ચોગાડા તારા
ઓ રે છબીલા તારા
ઓ રે રંગીલા તારા
રંગભેરૂ જુએ તારી વાટ રે`,
    translation: `## Verse 1

The night has come
Forget every other matter
This is the season of love
Now come close to me
Stay here with me
This is the season of love

If I get to be with you
I would forget the whole world

## Chorus

Beloved star
Charming star
Colourful star
Dressed in colour, watching your path

Beloved star
O charming star
O colourful star
Dressed in colour, watching your path

## Verse 2

Quietly, at you
I keep looking
All night long
All night long

Quietly, at me
You keep looking
All night long
All night long

If I get to be with you
I would forget the whole world

## Chorus

Beloved star
Charming star
Colourful star
Dressed in colour, watching your path

Beloved star
O charming star
O colourful star
Dressed in colour, watching your path`,
  },
  "kanudo-zilva-hendyo-geeta-rabari": {
    title: "Kanudo Zilva Hendyo",
    alternate_title: "Kanudo Zilva Hendyo Re · Gopiyo Chhede Padi · Rangtaali",
    artist_version: "Geeta Rabari",
    audio_url: "https://www.youtube.com/watch?v=1suCqjpIOOU",
    youtube_url: "https://www.youtube.com/watch?v=1suCqjpIOOU",
    thumbnail_url: "/images/kanudo-zilva-hendyo-geeta-rabari.jpg",
    cover_url: "/images/kanudo-zilva-hendyo-geeta-rabari.jpg",
    mini_cover_url: "/images/kanudo-zilva-hendyo-geeta-rabari.jpg",
    display_order: 314,
    category_slugs: ["krishna", "radha", "navratri", "gujarati"],
    meaning:
      "Geeta Rabari’s short Navratri garba from Rangtaali. Kanudo sets out to swing, the gopis start teasing him, and the singer asks that he not be scolded — let this day stay.",
    roman_lyrics: `## Chorus

Kanudo zilva hendyo re
Gopiyo chhede padi re

## Verse

Ona mara dahya thajo re
Aajno di rehva dejo re

## Chorus

Kanudo zilva hendyo re
Gopiyo chhede padi re`,
    devanagari_lyrics: `## Chorus

કાનુડો ઝીલવા હેંડ્યો રે
ગોપીઓ છેડે પડી રે

## Verse

ઓના મારા દહ્યા થાજો રે
આજનો દી રેવા દેજો રે

## Chorus

કાનુડો ઝીલવા હેંડ્યો રે
ગોપીઓ છેડે પડી રે`,
    translation: `## Chorus

Kanudo set out to swing
The gopis fell to teasing him

## Verse

Don’t burn with anger at my Kanudo
Let this day remain

## Chorus

Kanudo set out to swing
The gopis fell to teasing him`,
  },
  "hanuman-chalisa-priyesh-dhoolab": {
    title: "Hanuman Chalisa",
    alternate_title: "Most Peaceful Hanuman Chalisa · Priyesh Dhoolab",
    artist_version: "Priyesh Dhoolab",
    audio_url: "https://www.youtube.com/watch?v=FJxB00eKUR8",
    youtube_url: "https://www.youtube.com/watch?v=FJxB00eKUR8",
    thumbnail_url: "/images/hanuman-chalisa-priyesh-dhoolab.jpg",
    cover_url: "/images/hanuman-chalisa-priyesh-dhoolab.jpg",
    mini_cover_url: "/images/hanuman-chalisa-priyesh-dhoolab.jpg",
    display_order: 315,
    category_slugs: [...HANUMAN_CHALISA_CATEGORY_SLUGS],
    meaning:
      "Priyesh Dhoolab’s quiet Hanuman Chalisa — Tulsidas’s prayer of forty chaupais, sung slowly for satsang.",
    roman_lyrics: HANUMAN_CHALISA_ROMAN,
    translation: HANUMAN_CHALISA_TRANSLATION,
  },
  "sri-rama-stuti-mohit-mangru": {
    title: "Shri Ram Stuti Santan",
    alternate_title: "Seeri Ram A Struti Santa · Love, Truth, Respect and Adoration",
    artist_version: "Mohit Mangru",
    audio_url: "https://www.youtube.com/watch?v=it_h_tDhhy4",
    youtube_url: "https://www.youtube.com/watch?v=it_h_tDhhy4",
    thumbnail_url: "/images/sri-rama-stuti-mohit-mangru.jpg",
    cover_url: "/images/sri-rama-stuti-mohit-mangru.jpg",
    mini_cover_url: "/images/sri-rama-stuti-mohit-mangru.jpg",
    display_order: 316,
    category_slugs: [
      "ram",
      "general",
      "satsang",
      "bhajan",
      "devotion",
      "ram-navami",
      "hindi",
    ],
    meaning:
      "Mohit Mangru’s track from the Guyana LP Love, Truth, Respect and Adoration. Shri Ram sits at the window of the world, takes everyone’s greeting, and gives each one according to their service. The refrain calls the children to Ram’s praise.",
    roman_lyrics: `## Doha

Ram jharokhe baithe ke
Ki sabke mujra lete
Jaise unki chakari
Ki taise unki dete

## Chorus

Shri Ram stuti santan
Varna muni vrini
Are Shri Ram stuti santan
Varna muni vrini, varna muni vrini
E ji Shri Ram stuti santan

## Verse 1

Shri Ramchandra, anand kanda
Dasharath ke nandan
Shri Ramchandra, anand kanda
Dasharath ke nandan
Haro dukh door, Treta pe harana
Dukh nath sharan

## Chorus

E ji Ram stuti santan

## Verse 2

Jo karat jap, lena main aap
Santap jap sake, jagat ka bane
Jo karat jap, lena main aap
Are santap jap sake, jagat ka bane
Tum naam hi ke, ghar ke anek
Bhoge anek rahe, pahunche mane

## Chorus

E ji Ram stuti santan

## Verse 3

Varna muni vrini, varna muni vrini
Varna muni vrini
E ji Ram stuti santan, varna muni vrini
Are jo karat jap, lena main aap
Santap jap sake, jagat ka bane
Tum naam hi ke, ghar ke anek
Bhoge anek rahe, pahunche mane

## Chorus

E ji Ram stuti santan

## Verse 4

Kahe Ram naam, are Das Sankadas
Sankadas
Yeh baani hamare aashir
Raghuvans se chali

## Chorus

E ji Shri Ram stuti santap
Varna muni vrini

## Verse 5

Are varna, are varna muni vrini
Varna muni vrini
E ji Shri Ram stuti santap, varna muni vrini
E ji Shri Ram stuti santan
Shri Ramchandra, anand kanda
Dasharath ke nandan
Haro dukh door, Treta pe harana
Dukh nath sharan

## Chorus

E ji Ram stuti santan`,
    devanagari_lyrics: `## Doha

राम झरोखे बैठे के
कि सबके मुजरा लेते
जैसे उनकी चाकरी
कि तैसे उनकी देते

## Chorus

श्री राम स्तुति संतान
वर्ण मुनि वृणी
अरे श्री राम स्तुति संतान
वर्ण मुनि वृणी, वर्ण मुनि वृणी
ई जी श्री राम स्तुति संतान

## Verse 1

श्री रामचन्द्र, आनन्द कन्दा
दशरथ के नन्दन
श्री रामचन्द्र, आनन्द कन्दा
दशरथ के नन्दन
हरो दुख दूर, त्रेता पे हराना
दुख नाथ शरण

## Chorus

ई जी राम स्तुति संतान

## Verse 2

जो करत जाप, लेना मैं आप
संताप जाप सके, जगत का बने
जो करत जाप, लेना मैं आप
अरे संताप जाप सके, जगत का बने
तुम नाम ही के, घर के अनेक
भोगे अनेक रहे, पहुँचे मने

## Chorus

ई जी राम स्तुति संतान

## Verse 3

वर्ण मुनि वृणी, वर्ण मुनि वृणी
वर्ण मुनि वृणी
ई जी राम स्तुति संतान, वर्ण मुनि वृणी
अरे जो करत जाप, लेना मैं आप
संताप जाप सके, जगत का बने
तुम नाम ही के, घर के अनेक
भोगे अनेक रहे, पहुँचे मने

## Chorus

ई जी राम स्तुति संतान

## Verse 4

कहे राम नाम, अरे दास संकदास
संकदास
यह वाणी हमारे आशीर
रघुवंश से चली

## Chorus

ई जी श्री राम स्तुति संताप
वर्ण मुनि वृणी

## Verse 5

अरे वर्ण, अरे वर्ण मुनि वृणी
वर्ण मुनि वृणी
ई जी श्री राम स्तुति संताप, वर्ण मुनि वृणी
ई जी श्री राम स्तुति संतान
श्री रामचन्द्र, आनन्द कन्दा
दशरथ के नन्दन
हरो दुख दूर, त्रेता पे हराना
दुख नाथ शरण

## Chorus

ई जी राम स्तुति संतान`,
    translation: `## Doha

Ram sits at the window
And takes everyone’s greeting
As is their service
So he gives them theirs

## Chorus

Praise of Shri Ram, O children
The sage’s company I choose
O, praise of Shri Ram, O children
The sage’s company I choose, the sage’s company I choose
O yes, praise of Shri Ram, O children

## Verse 1

Shri Ramchandra, root of joy
Son of Dasharath
Shri Ramchandra, root of joy
Son of Dasharath
Take sorrow far away, victor in the Treta age
In distress, Lord, your refuge

## Chorus

O yes, the praise of Ram, O children

## Verse 2

Whoever does the japa, I myself take it up
By that japa affliction can go, and the world can be made whole
Whoever does the japa, I myself take it up
O, by that japa affliction can go, and the world can be made whole
By your name alone, the many of the household
Many enjoyments have remained and reached the heart

## Chorus

O yes, the praise of Ram, O children

## Verse 3

The sage’s company I choose, the sage’s company I choose
The sage’s company I choose
O yes, the praise of Ram, O children, the sage’s company I choose
O, whoever does the japa, I myself take it up
By that japa affliction can go, and the world can be made whole
By your name alone, the many of the household
Many enjoyments have remained and reached the heart

## Chorus

O yes, the praise of Ram, O children

## Verse 4

Taking Ram’s name, so says the servant Sankadas
Sankadas
This utterance, our blessing
Has come down from the Raghu line

## Chorus

O yes, the praise of Shri Ram, the affliction
The sage’s company I choose

## Verse 5

O tell it, O the sage’s company I choose
The sage’s company I choose
O yes, the praise of Shri Ram, the affliction, the sage’s company I choose
O yes, the praise of Shri Ram, O children
Shri Ramchandra, root of joy
Son of Dasharath
Take sorrow far away, victor in the Treta age
In distress, Lord, your refuge

## Chorus

O yes, the praise of Ram, O children`,
  },
  "nahi-chahiye-rang-mahal-kj-yesudas": {
    title: "Nahi Chahiye Rang Mahal",
    alternate_title: "Nahin Chahiye Rang Mahal · College Girl",
    artist_version: "K. J. Yesudas & Chandrani Mukherjee",
    audio_url: "https://www.youtube.com/watch?v=LzfTYYp4H2I",
    youtube_url: "https://www.youtube.com/watch?v=LzfTYYp4H2I",
    thumbnail_url: "/images/nahi-chahiye-rang-mahal-kj-yesudas.jpg",
    cover_url: "/images/nahi-chahiye-rang-mahal-kj-yesudas.jpg",
    mini_cover_url: "/images/nahi-chahiye-rang-mahal-kj-yesudas.jpg",
    display_order: 317,
    category_slugs: ["general", "satsang", "bhajan", "devotion", "hindi"],
    meaning:
      "K. J. Yesudas and Chandrani Mukherjee sing Bharat Vyas’s prayer from College Girl (1978), music by Bappi Lahiri. The singer asks the Lord for contentment, not a palace or wealth.",
    roman_lyrics: NAHI_CHAHIYE_RANG_MAHAL_ROMAN,
    devanagari_lyrics: NAHI_CHAHIYE_RANG_MAHAL_DEVANAGARI,
    translation: NAHI_CHAHIYE_RANG_MAHAL_TRANSLATION,
  },
  "nahi-chahiye-rang-mahal-dewindersingh-sewnath": {
    title: "Nahi Chahiye Rang Mahal",
    alternate_title: "Nahin Chahiye Rang Mahal · Chutney Bhajan · February 2024",
    artist_version: "Dewindersingh Sewnath",
    audio_url: "https://www.youtube.com/watch?v=_PBtOUUDqV0",
    youtube_url: "https://www.youtube.com/watch?v=_PBtOUUDqV0",
    thumbnail_url: "/images/nahi-chahiye-rang-mahal-dewindersingh-sewnath.jpg",
    cover_url: "/images/nahi-chahiye-rang-mahal-dewindersingh-sewnath.jpg",
    mini_cover_url: "/images/nahi-chahiye-rang-mahal-dewindersingh-sewnath.jpg",
    display_order: 318,
    category_slugs: ["general", "satsang", "bhajan", "devotion", "hindi"],
    meaning:
      "Dewindersingh Sewnath’s February 2024 chutney bhajan of Nahi Chahiye Rang Mahal. This recording stays in Chutney Bhajan.",
    roman_lyrics: NAHI_CHAHIYE_RANG_MAHAL_ROMAN,
    devanagari_lyrics: NAHI_CHAHIYE_RANG_MAHAL_DEVANAGARI,
    translation: NAHI_CHAHIYE_RANG_MAHAL_TRANSLATION,
  },
  "gori-tame-manda-lidha-mohi-raj-umesh-barot": {
    title: "Gori Tame Manda Lidha Mohi Raj",
    alternate_title: "Gori Tame Manda Lidha · Saiyar Mori Re",
    artist_version: "Umesh Barot & Ishani Dave",
    audio_url: "https://www.youtube.com/watch?v=pGG_Zosn-qo",
    youtube_url: "https://www.youtube.com/watch?v=pGG_Zosn-qo",
    thumbnail_url: "/images/gori-tame-manda-lidha-mohi-raj-umesh-barot.jpg",
    cover_url: "/images/gori-tame-manda-lidha-mohi-raj-umesh-barot.jpg",
    mini_cover_url: "/images/gori-tame-manda-lidha-mohi-raj-umesh-barot.jpg",
    display_order: 319,
    category_slugs: ["navratri", "gujarati"],
    meaning:
      "A night garba from Saiyar Mori Re. The moon slips behind a cloud and the singer grows shy, then calls the fair one who has taken his heart and turned her face away. He asks her back as she circles the courtyard, anklets sounding.",
  },
  "dakla-bandish-projekt": {
    title: "Dakla",
    alternate_title: "Dakla · Bandish Projekt",
    artist_version: "Bandish Projekt & Aishwarya Joshi & MC Todfod",
    audio_url: "https://www.youtube.com/watch?v=gBeBK9QQtv8",
    youtube_url: "https://www.youtube.com/watch?v=gBeBK9QQtv8",
    thumbnail_url: "/images/dakla-bandish-projekt.jpg",
    cover_url: "/images/dakla-bandish-projekt.jpg",
    mini_cover_url: "/images/dakla-bandish-projekt.jpg",
    display_order: 320,
    category_slugs: ["navratri", "gujarati"],
    meaning:
      "A Navratri track built on the dakla, the sharp folk drum that drives a Gujarati circle. Bandish Projekt set Aishwarya Joshi’s singing against that beat, with MC Todfod joining the rhythm. The drum leads, and the circle answers.",
  },
  "moti-veraana-osman-mir": {
    title: "Moti Veraana",
    alternate_title: "Moti Veraana · Songs of Faith · Navratri 2020",
    artist_version: "Osman Mir",
    audio_url: "https://www.youtube.com/watch?v=Jv8KRwF1zQs",
    youtube_url: "https://www.youtube.com/watch?v=Jv8KRwF1zQs",
    thumbnail_url: "/images/moti-veraana-osman-mir.jpg",
    cover_url: "/images/moti-veraana-osman-mir.jpg",
    mini_cover_url: "/images/moti-veraana-osman-mir.jpg",
    display_order: 321,
    category_slugs: ["navratri", "gujarati"],
    meaning:
      "Osman Mir’s night song from Amit Trivedi’s Songs of Faith, Navratri 2020. It is quieter than a dhol garba. A lover speaks into the empty dark, toward someone who has gone far.",
  },
  "dholida-gangubai-kathiawadi": {
    title: "Dholida",
    alternate_title: "Dholida · Gangubai Kathiawadi",
    artist_version: "Jahnvi Shrimankar & Shailesh Singh",
    audio_url: "https://www.youtube.com/watch?v=Jh_VKJAEnUY",
    youtube_url: "https://www.youtube.com/watch?v=Jh_VKJAEnUY",
    thumbnail_url: "/images/dholida-gangubai-kathiawadi.jpg",
    cover_url: "/images/dholida-gangubai-kathiawadi.jpg",
    mini_cover_url: "/images/dholida-gangubai-kathiawadi.jpg",
    display_order: 322,
    category_slugs: ["navratri", "hindi"],
    meaning:
      "The garba from Gangubai Kathiawadi. Someone calls the dhol player, the beat starts, and the street fills. Once the dhol speaks, everyone is pulled into the circle.",
  },
  "mor-bani-thanghat-kare": {
    title: "Mor Bani Thanghat Kare",
    alternate_title: "Mor Bani Thanghat Kare · Goliyon Ki Raasleela Ram-Leela",
    artist_version: "Osman Mir & Aditi Paul",
    audio_url: "https://www.youtube.com/watch?v=lfm-NIrZyV0",
    youtube_url: "https://www.youtube.com/watch?v=lfm-NIrZyV0",
    thumbnail_url: "/images/mor-bani-thanghat-kare.jpg",
    cover_url: "/images/mor-bani-thanghat-kare.jpg",
    mini_cover_url: "/images/mor-bani-thanghat-kare.jpg",
    display_order: 323,
    category_slugs: ["navratri", "gujarati"],
    meaning:
      "A traditional garba used in Ram-Leela. The dancer’s skirt is the colour of a peacock, and it flares and rustles as she turns. The song stays on that picture: the cloth, the spin, and the circle moving around her.",
  },
  "radha-ne-shyam-mali-jashe": {
    title: "Radha Ne Shyam Mali Jashe",
    alternate_title: "Radha Ne Shyam Mali Jashe",
    artist_version: "Sachin Sanghvi & Shruti Pathak",
    audio_url: "https://www.youtube.com/watch?v=tTfF5klskmo",
    youtube_url: "https://www.youtube.com/watch?v=tTfF5klskmo",
    thumbnail_url: "/images/radha-ne-shyam-mali-jashe.jpg",
    cover_url: "/images/radha-ne-shyam-mali-jashe.jpg",
    mini_cover_url: "/images/radha-ne-shyam-mali-jashe.jpg",
    display_order: 324,
    category_slugs: ["navratri", "krishna", "radha", "gujarati"],
    meaning:
      "Sachin Sanghvi and Shruti Pathak’s garba of Radha going to meet Shyam. The garden is the meeting place. The song follows her on the way there, in the season when Krishna’s name is sung in the circle.",
  },
  "vaagyo-re-dhol-hellaro": {
    title: "Vaagyo Re Dhol",
    alternate_title: "Vaagyo Re Dhol · Hellaro",
    artist_version: "Bhoomi Trivedi",
    audio_url: "https://www.youtube.com/watch?v=sDZA54sTqwQ",
    youtube_url: "https://www.youtube.com/watch?v=sDZA54sTqwQ",
    thumbnail_url: "/images/vaagyo-re-dhol-hellaro.jpg",
    cover_url: "/images/vaagyo-re-dhol-hellaro.jpg",
    mini_cover_url: "/images/vaagyo-re-dhol-hellaro.jpg",
    display_order: 325,
    category_slugs: ["navratri", "gujarati"],
    meaning:
      "From Hellaro. In the film, women who have been kept from the garba hear the dhol and answer it. The drum is the signal that the circle can begin, and the dance itself is the freedom the song is about.",
  },
  "garbe-ki-raat-rahul-vaidya": {
    title: "Garbe Ki Raat",
    alternate_title: "Garbe Ki Raat",
    artist_version: "Rahul Vaidya & Yashita Sharma",
    audio_url: "https://www.youtube.com/watch?v=OPWik6jypxs",
    youtube_url: "https://www.youtube.com/watch?v=OPWik6jypxs",
    thumbnail_url: "/images/garbe-ki-raat-rahul-vaidya.jpg",
    cover_url: "/images/garbe-ki-raat-rahul-vaidya.jpg",
    mini_cover_url: "/images/garbe-ki-raat-rahul-vaidya.jpg",
    display_order: 326,
    category_slugs: ["navratri", "hindi"],
    meaning:
      "Rahul Vaidya and Yashita Sharma’s Hindi garba about one whole night in the circle. The lights stay up, the beat keeps going, and the night itself is the celebration.",
  },
  "nagada-sang-dhol-baaje": {
    title: "Nagada Sang Dhol Baaje",
    alternate_title: "Nagada Sang Dhol · Goliyon Ki Raasleela Ram-Leela",
    artist_version: "Shreya Ghoshal & Osman Mir",
    audio_url: "https://www.youtube.com/watch?v=BmWkUAU1ktk",
    youtube_url: "https://www.youtube.com/watch?v=BmWkUAU1ktk",
    thumbnail_url: "/images/nagada-sang-dhol-baaje.jpg",
    cover_url: "/images/nagada-sang-dhol-baaje.jpg",
    mini_cover_url: "/images/nagada-sang-dhol-baaje.jpg",
    display_order: 327,
    category_slugs: ["navratri", "hindi"],
    meaning:
      "From Ram-Leela, the raas where the nagada and the dhol are played together. A dancer waits for someone who has not yet come, and the circle opens anyway. An older Gujarati garba is folded in, the one in which Sita watches the road for Ram.",
  },
  "shubhaarambh-kai-po-che": {
    title: "Shubhaarambh",
    alternate_title: "Shubhaarambh · Kai Po Che",
    artist_version: "Divya Kumar & Shruti Pathak",
    audio_url: "https://www.youtube.com/watch?v=dlz09a-pyPE",
    youtube_url: "https://www.youtube.com/watch?v=dlz09a-pyPE",
    thumbnail_url: "/images/shubhaarambh-kai-po-che.jpg",
    cover_url: "/images/shubhaarambh-kai-po-che.jpg",
    mini_cover_url: "/images/shubhaarambh-kai-po-che.jpg",
    display_order: 328,
    category_slugs: ["navratri", "gujarati"],
    meaning:
      "From Kai Po Che. The title means an auspicious beginning, and the song is sung like the first step of a garba night. It blesses the start: the circle forming, the night opening, friends stepping in together.",
  },
  "kesariyo-aishwarya-majmudar": {
    title: "Kesariyo",
    alternate_title: "Kesariyo · Aishwarya Majmudar",
    artist_version: "Aishwarya Majmudar",
    audio_url: "https://www.youtube.com/watch?v=GZwvya3eFG0",
    youtube_url: "https://www.youtube.com/watch?v=GZwvya3eFG0",
    thumbnail_url: "/images/kesariyo-aishwarya-majmudar.jpg",
    cover_url: "/images/kesariyo-aishwarya-majmudar.jpg",
    mini_cover_url: "/images/kesariyo-aishwarya-majmudar.jpg",
    display_order: 329,
    category_slugs: ["navratri", "gujarati"],
    meaning:
      "Aishwarya Majmudar’s Navratri garba in praise of saffron, the colour of the festival. That colour is the joy of the night, worn and sung as the circle turns.",
  },
  "gori-radha-ne-kalo-kaan-kirtidan-gadhvi": {
    title: "Gori Radha Ne Kalo Kaan",
    alternate_title: "Gori Radha Ne Kalo Kaan · Wrong Side Raju",
    artist_version: "Kirtidan Gadhvi",
    audio_url: "https://www.youtube.com/watch?v=ccqg6e2rfLU",
    youtube_url: "https://www.youtube.com/watch?v=ccqg6e2rfLU",
    thumbnail_url: "/images/gori-radha-ne-kalo-kaan-kirtidan-gadhvi.jpg",
    cover_url: "/images/gori-radha-ne-kalo-kaan-kirtidan-gadhvi.jpg",
    mini_cover_url: "/images/gori-radha-ne-kalo-kaan-kirtidan-gadhvi.jpg",
    display_order: 330,
    category_slugs: ["navratri", "krishna", "radha", "gujarati"],
    meaning:
      "From Wrong Side Raju. Kirtidan Gadhvi sings the old contrast of fair Radha and dark Kanha. It is a playful garba about that pair, her brightness set against his darkness.",
  },
  "karshan-bhagwan-chalya-aditya-gadhvi": {
    title: "Karshan Bhagwan Chalya",
    alternate_title: "Karshan Bhagwan Chalya · Jiyo Maniyara",
    artist_version: "Aditya Gadhvi",
    audio_url: "https://www.youtube.com/watch?v=YMrVf4O65Ss",
    youtube_url: "https://www.youtube.com/watch?v=YMrVf4O65Ss",
    thumbnail_url: "/images/karshan-bhagwan-chalya-aditya-gadhvi.jpg",
    cover_url: "/images/karshan-bhagwan-chalya-aditya-gadhvi.jpg",
    mini_cover_url: "/images/karshan-bhagwan-chalya-aditya-gadhvi.jpg",
    display_order: 331,
    category_slugs: ["navratri", "krishna", "gujarati"],
    meaning:
      "Aditya Gadhvi’s garba from Jiyo Maniyara. Lord Krishna has set out, and the song follows him as he walks. The village and the circle move because he has stepped out among them.",
  },
  "indhana-vinvaa-gayi-falguni-pathak": {
    title: "Indhana Vinvaa Gayi Thi More Saiyan",
    alternate_title: "Indhana Vinvaa Gayi · Falguni Pathak",
    artist_version: "Falguni Pathak",
    audio_url: "https://www.youtube.com/watch?v=Q_ZXz9Omq4k",
    youtube_url: "https://www.youtube.com/watch?v=Q_ZXz9Omq4k",
    thumbnail_url: "/images/indhana-vinvaa-gayi-falguni-pathak.jpg",
    cover_url: "/images/indhana-vinvaa-gayi-falguni-pathak.jpg",
    mini_cover_url: "/images/indhana-vinvaa-gayi-falguni-pathak.jpg",
    display_order: 332,
    category_slugs: ["navratri", "gujarati"],
    meaning:
      "Falguni Pathak’s garba of a woman who went out to gather firewood and met her beloved on the way. An ordinary errand becomes the meeting the song keeps returning to.",
  },
  "zulan-morali-vagi-re-aditya-gadhvi": {
    title: "Zulan Morali Vagi Re",
    alternate_title: "Zulan Morali Vagi Re",
    artist_version: "Aditya Gadhvi",
    audio_url: "https://www.youtube.com/watch?v=P4OlI-ksWMM",
    youtube_url: "https://www.youtube.com/watch?v=P4OlI-ksWMM",
    thumbnail_url: "/images/zulan-morali-vagi-re-aditya-gadhvi.jpg",
    cover_url: "/images/zulan-morali-vagi-re-aditya-gadhvi.jpg",
    mini_cover_url: "/images/zulan-morali-vagi-re-aditya-gadhvi.jpg",
    display_order: 333,
    category_slugs: ["navratri", "krishna", "gujarati"],
    meaning:
      "Aditya Gadhvi’s garba of the swing and Krishna’s flute. The swing moves, the flute sounds, and the circle turns toward that call.",
  },
  "halaji-tara-hath-vakhanu-aditya-gadhvi": {
    title: "Halaji Tara Hath Vakhanu",
    alternate_title: "Halaji Tara Hath Vakhanu",
    artist_version: "Aditya Gadhvi",
    audio_url: "https://www.youtube.com/watch?v=46f6aPSXN7Y",
    youtube_url: "https://www.youtube.com/watch?v=46f6aPSXN7Y",
    thumbnail_url: "/images/halaji-tara-hath-vakhanu-aditya-gadhvi.jpg",
    cover_url: "/images/halaji-tara-hath-vakhanu-aditya-gadhvi.jpg",
    mini_cover_url: "/images/halaji-tara-hath-vakhanu-aditya-gadhvi.jpg",
    display_order: 334,
    category_slugs: ["navratri", "gujarati"],
    meaning:
      "Aditya Gadhvi’s garba of praise for the beloved’s hand. The singer keeps returning to that hand, the one that meets another hand in the circle.",
  },
  "maar-to-mele-ishani-dave": {
    title: "Maar To Mele",
    alternate_title: "Maar To Mele",
    artist_version: "Ishani Dave",
    audio_url: "https://www.youtube.com/watch?v=vFORQ0vbadQ",
    youtube_url: "https://www.youtube.com/watch?v=vFORQ0vbadQ",
    thumbnail_url: "/images/maar-to-mele-ishani-dave.jpg",
    cover_url: "/images/maar-to-mele-ishani-dave.jpg",
    mini_cover_url: "/images/maar-to-mele-ishani-dave.jpg",
    display_order: 335,
    category_slugs: ["navratri", "gujarati"],
    meaning:
      "Ishani Dave’s garba, a direct call to come and meet. The title is the invitation. The song keeps asking for that meeting, sung to the beat of the circle.",
  },
  "odhani-made-in-china": {
    title: "Odhani",
    alternate_title: "Odhani · Made In China",
    artist_version: "Neha Kakkar & Darshan Raval",
    audio_url: "https://www.youtube.com/watch?v=C7u6rtswjCU",
    youtube_url: "https://www.youtube.com/watch?v=C7u6rtswjCU",
    thumbnail_url: "/images/odhani-made-in-china.jpg",
    cover_url: "/images/odhani-made-in-china.jpg",
    mini_cover_url: "/images/odhani-made-in-china.jpg",
    display_order: 336,
    category_slugs: ["navratri", "hindi"],
    meaning:
      "From Made In China. A playful garba about the odhani, the scarf that slips and gets caught as people dance. The scarf is the flirtation: it moves, someone notices, and the circle keeps turning.",
  },
  "sanedo-made-in-china": {
    title: "Sanedo",
    alternate_title: "Sanedo · Made In China",
    artist_version: "Mika Singh & Nikhita Gandhi & Benny Dayal",
    audio_url: "https://www.youtube.com/watch?v=KwUIzf3eM9I",
    youtube_url: "https://www.youtube.com/watch?v=KwUIzf3eM9I",
    thumbnail_url: "/images/sanedo-made-in-china.jpg",
    cover_url: "/images/sanedo-made-in-china.jpg",
    mini_cover_url: "/images/sanedo-made-in-china.jpg",
    display_order: 337,
    category_slugs: ["navratri", "gujarati"],
    meaning:
      "From Made In China, set to the sanedo, the fast folk beat of a Gujarati celebration. It is a teasing night song. The beat carries the teasing, and the garba rides on it.",
  },
  "khelo-khelo-re-bhavani-maa-geeta-rabari": {
    title: "Khelo Khelo Re Bhavani Maa",
    alternate_title: "Khel Khel Re Bhavani Maa · ખેલ ખેલ રે ભાવની મા",
    artist_version: "Geeta Rabari",
    audio_url: "https://www.youtube.com/watch?v=Vm0vGnl9mKs",
    youtube_url: "https://www.youtube.com/watch?v=Vm0vGnl9mKs",
    thumbnail_url: "/images/khelo-khelo-re-bhavani-maa-geeta-rabari.jpg",
    cover_url: "/images/khelo-khelo-re-bhavani-maa-geeta-rabari.jpg",
    mini_cover_url: "/images/khelo-khelo-re-bhavani-maa-geeta-rabari.jpg",
    display_order: 338,
    category_slugs: ["navratri", "durga", "gujarati"],
    meaning:
      "Geeta Rabari’s garba for Mother Bhavani and Ambe, and for Bahuchar, Deut, and Kalka Maa. The circle turns, the anklets sound, and whoever sings is blessed.",
    roman_lyrics: `## Chorus

Khelo khelo re bhavani maa jai jai ambey maa
Jai jai ambey maa mari jai jai ambey maa

## Verse

Mari bauchar maa ne kaje re jai jai ambey maa
Mari deut maa ne kaje re jai jai ambey maa
Mari kalka maa ne kaje re jai jai ambey maa

## Chorus

Jai jai ambey maa mari jai jai ambey maa
Khelo khelo re bhavani maa jai jai ambey maa

## Verse

Ger ger garba gaye re jai jai ambey maa
Ghanghar sundaryo bandhaye re hai jai ambey maa
Ae maa shobha ghani thai re jai jai ambey maa

## Chorus

Jai jai ambey maa mari jai jai ambey maa
Khelo khelo re bhavani maa jai jai ambey maa

## Verse

Mane sewak ghanghar gaje re jai jai ambey maa
Madi ghanghar ramwa aawe re jai jai ambey maa
Madi sundar saji aawe re jai jai ambey maa
Madi rum jhumta aawe re jai jai ambey maa

## Chorus

Jai jai ambey maa mari jai jai ambey maa
Khelo khelo re bhavani maa jai jai ambey maa

## Verse

Madi garbo layi ne aawe re jai jai ambey maa
Haato garba ma je gave re jai jai ambey maa
Madi tena prasang thave re jai jai ambey maa
Tena papo parley thaye re jai jai ambey maa

## Chorus

Jai jai ambey maa mari jai jai ambey maa
Khelo khelo re bhavani maa jai jai ambey maa

## Verse

Tena sukh sampati aape re jai jai ambey maa
Tena usmawa bhi rakhe re jai jai ambey maa
Tena sukh shanti aape re jai jai ambey maa
Tena vaikunth vass rakhe re jai jai ambey maa

## Chorus

Jai jai ambey maa mari jai jai ambey maa
Khelo khelo re bhavani maa jai jai ambey maa`,
    devanagari_lyrics: `## Chorus

ખેલો ખેલો રે ભવાની મા જય જય અંબે મા
જય જય અંબે મા મારી જય જય અંબે મા

## Verse

મારી બહુચર મા ને કાજે રે જય જય અંબે મા
મારી દેઉત મા ને કાજે રે જય જય અંબે મા
મારી કાળકા મા ને કાજે રે જય જય અંબે મા

## Chorus

જય જય અંબે મા મારી જય જય અંબે મા
ખેલો ખેલો રે ભવાની મા જય જય અંબે મા

## Verse

ગેર ગેર ગરબા ગાયે રે જય જય અંબે મા
ઘૂઘરાં સુંદરિયો બાંધે રે હે જય અંબે મા
એ મા શોભા ઘણી થાય રે જય જય અંબે મા

## Chorus

જય જય અંબે મા મારી જય જય અંબે મા
ખેલો ખેલો રે ભવાની મા જય જય અંબે મા

## Verse

મને સેવક ઘૂઘરાં ગાજે રે જય જય અંબે મા
માડી ઘૂઘરાં રમવા આવે રે જય જય અંબે મા
માડી સુંદર સજી આવે રે જય જય અંબે મા
માડી રમઝૂમતાં આવે રે જય જય અંબે મા

## Chorus

જય જય અંબે મા મારી જય જય અંબે મા
ખેલો ખેલો રે ભવાની મા જય જય અંબે મા

## Verse

માડી ગરબો લઈને આવે રે જય જય અંબે મા
હાથો ગરબામાં જે ગાવે રે જય જય અંબે મા
માડી તેના પ્રસન્ન થાય રે જય જય અંબે મા
તેના પાપો પરલય થાય રે જય જય અંબે મા

## Chorus

જય જય અંબે મા મારી જય જય અંબે મા
ખેલો ખેલો રે ભવાની મા જય જય અંબે મા

## Verse

તેને સુખ સંપત્તિ આપે રે જય જય અંબે મા
તેના ઉશ્મા પણ રાખે રે જય જય અંબે મા
તેને સુખ શાંતિ આપે રે જય જય અંબે મા
તેને વૈકુંઠ વાસ રાખે રે જય જય અંબે મા

## Chorus

જય જય અંબે મા મારી જય જય અંબે મા
ખેલો ખેલો રે ભવાની મા જય જય અંબે મા`,
    translation: `## Chorus

Play, play, O Mother Bhavani, victory, victory to Mother Ambe
Victory to Mother Ambe, my victory to Mother Ambe

## Verse

For my Bahuchar Mother's sake, victory to Mother Ambe
For my Deut Mother's sake, victory to Mother Ambe
For my Kalka Mother's sake, victory to Mother Ambe

## Chorus

Victory to Mother Ambe, my victory to Mother Ambe
Play, play, O Mother Bhavani, victory, victory to Mother Ambe

## Verse

They sing the garba in the circle, victory to Mother Ambe
The beauties tie on anklets, O victory to Mother Ambe
O Mother, such splendour comes, victory to Mother Ambe

## Chorus

Victory to Mother Ambe, my victory to Mother Ambe
Play, play, O Mother Bhavani, victory, victory to Mother Ambe

## Verse

My servant's anklets sound, victory to Mother Ambe
The girl comes to play the anklets, victory to Mother Ambe
The girl comes dressed in beauty, victory to Mother Ambe
The girl comes jingling, victory to Mother Ambe

## Chorus

Victory to Mother Ambe, my victory to Mother Ambe
Play, play, O Mother Bhavani, victory, victory to Mother Ambe

## Verse

The girl comes carrying the garba, victory to Mother Ambe
Whoever sings the garba with their hands, victory to Mother Ambe
Mother is pleased with them, victory to Mother Ambe
Their sins are destroyed, victory to Mother Ambe

## Chorus

Victory to Mother Ambe, my victory to Mother Ambe
Play, play, O Mother Bhavani, victory, victory to Mother Ambe

## Verse

She gives them happiness and wealth, victory to Mother Ambe
She keeps their spirit too, victory to Mother Ambe
She gives them peace and happiness, victory to Mother Ambe
She keeps a place for them in Vaikunth, victory to Mother Ambe

## Chorus

Victory to Mother Ambe, my victory to Mother Ambe
Play, play, O Mother Bhavani, victory, victory to Mother Ambe`,
  },
  "rama-rama-rishab-rikhiram-sharma": {
    title: "Rama Rama",
    alternate_title: "Rama Rama · Sitar for Mental Health · Diwali 2026",
    artist_version: "Rishab Rikhiram Sharma",
    audio_url: "https://www.youtube.com/watch?v=-eQEFtrOpNw",
    youtube_url: "https://www.youtube.com/watch?v=-eQEFtrOpNw",
    thumbnail_url: "/images/rama-rama-rishab-rikhiram-sharma.png",
    cover_url: "/images/rama-rama-rishab-rikhiram-sharma.png",
    mini_cover_url: "/images/rama-rama-rishab-rikhiram-sharma.png",
    display_order: 339,
    category_slugs: ["ram", "diwali", "general", "satsang", "bhajan", "devotion", "hindi"],
    meaning:
      "Rishab Rikhiram Sharma’s sitar setting, filmed at Kusum Sarovar for Diwali 2026. Tabla, dholak, flute, and shehnai sit with the sitar. The refrain on this page is the old Shabari call. The further verses, as on the T-Series recording, are credited to Manoj Muntashir and are not printed here.",
    roman_lyrics: `## Chorus

Rama rama ratte ratte, beeti re umariya
Raghukul nandan kab aaoge bhilani ki dagariya`,
    translation: `## Chorus

Chanting Rama Rama, a whole life has gone by
Joy of Raghu’s line, when will you come along the Bhil woman’s path?`,
  },
  "hanuman-chalisa-ramayana": {
    title: "Hanuman Chalisa",
    alternate_title: "Shree Hanuman Chalisa · Ramayana",
    artist_version:
      "Sukhwinder Singh & Diljit Dosanjh & Mohit Chauhan & Shankar Mahadevan & Kailash Kher",
    audio_url: "https://www.youtube.com/watch?v=XWAeTGff5jE",
    youtube_url: "https://www.youtube.com/watch?v=XWAeTGff5jE",
    thumbnail_url: "/images/hanuman-chalisa-ramayana.png",
    cover_url: "/images/hanuman-chalisa-ramayana.png",
    mini_cover_url: "/images/hanuman-chalisa-ramayana.png",
    display_order: 340,
    category_slugs: [...HANUMAN_CHALISA_CATEGORY_SLUGS],
    meaning:
      "The Ramayana recording of Tulsidas’s Hanuman Chalisa. A.R. Rahman sets the forty chaupais, sung by Sukhwinder Singh, Diljit Dosanjh, Mohit Chauhan, Shankar Mahadevan, and Kailash Kher.",
    roman_lyrics: HANUMAN_CHALISA_ROMAN,
    translation: HANUMAN_CHALISA_TRANSLATION,
  },
  "radha-ramana-haribol-radhika-das": {
    title: "Radha Ramana Haribol",
    alternate_title: "Radha Ramana Hari Bol",
    artist_version: "Radhika Das",
    audio_url: "https://www.youtube.com/watch?v=cwWzjdOuM0I",
    youtube_url: "https://www.youtube.com/watch?v=cwWzjdOuM0I",
    thumbnail_url: "/images/radha-ramana-haribol-radhika-das.jpg",
    cover_url: "/images/radha-ramana-haribol-radhika-das.jpg",
    mini_cover_url: "/images/radha-ramana-haribol-radhika-das.jpg",
    display_order: 341,
    category_slugs: ["krishna", "radha", "kirtan", "general", "satsang", "bhajan", "devotion"],
    meaning:
      "Radhika Das’s kirtan for Radha and Krishna. The call is to chant Radha Ramana, the beloved of Radha.",
    roman_lyrics: `## Chorus

Jai Jai Radha Raman Hari Bol.`,
    translation: `## Chorus

Victory, victory — chant Radha Ramana, Hari.`,
  },
  "aarti-kunj-bihari-ki-hariom-sharad": {
    title: "Aarti Kunj Bihari Ki",
    alternate_title: "Shri Girdhar Krishna Murari Ki",
    artist_version: "Hariom Sharad",
    audio_url: "https://www.youtube.com/watch?v=bYu-PrJvq6o",
    youtube_url: "https://www.youtube.com/watch?v=bYu-PrJvq6o",
    thumbnail_url: "/images/aarti-kunj-bihari-ki-hariom-sharad.jpg",
    cover_url: "/images/aarti-kunj-bihari-ki-hariom-sharad.jpg",
    mini_cover_url: "/images/aarti-kunj-bihari-ki-hariom-sharad.jpg",
    display_order: 342,
    category_slugs: ["krishna", "radha", "aarti", "general", "satsang", "bhajan", "devotion", "hindi"],
    meaning:
      "The traditional aarti of Kunj Bihari, Krishna of the grove. The lamp is offered to the flute, the peacock crown, Radha beside him, and the bank of the Yamuna. Hariom Sharad sings it.",
    roman_lyrics: `## Opening

Vasudev sutam devam, Kamsa Chanura mardanam
Devaki paramanandam, Krishnam vande jagadgurum

## Chorus

Aarti Kunj Bihari ki
Shri Girdhar Krishna Murari ki

## Verse

Gale mein vaijayanti mala
Bajave murali madhur bala
Shravan mein kundal jhalakala
Nand ke nand, Shri Anand kand
Mohan Brij chandra, Radhika Raman Bihari ki

## Chorus

Shri Girdhar Krishna Murari ki
Aarti Kunj Bihari ki

## Verse

Gagan sam ang kanti kali
Radhika chamak rahi aali
Latan mein thade Banmali
Bhramar si alak, kasturi tilak, chandra si jhalak
Lalit chhavi Shyama pyari ki

## Chorus

Shri Girdhar Krishna Murari ki
Aarti Kunj Bihari ki

## Verse

Kanakmay mor mukut bilse
Devta darshan ko tarse
Gagan son suman rasi barse
Baje murchang, madhur mridang, gwalin sang
Atul rati Gop kumari ki

## Chorus

Shri Girdhar Krishna Murari ki
Aarti Kunj Bihari ki

## Verse

Jahan te pragat bhai Ganga
Kalush kali harini Shri Ganga
Smaran te hot moh bhanga
Basi Shiv sheesh, jata ke beech, hare agh keech
Charan chhavi Shri Banwari ki

## Chorus

Shri Girdhar Krishna Murari ki
Aarti Kunj Bihari ki

## Verse

Chamakti ujjwal tat renu
Baj rahi Vrindavan benu
Chahun disi gopi, gwal, dhenu
Hansat mridu mand, chandni chand, katat bhav phand
Ter sun deen bhikhari ki

## Chorus

Shri Girdhar Krishna Murari ki
Aarti Kunj Bihari ki`,
    translation: `## Opening

I bow to Krishna, son of Vasudev, who felled Kamsa and Chanura
Bliss of Devaki, teacher of the world

## Chorus

Aarti of Kunj Bihari
Of Shri Girdhar, Krishna Murari

## Verse

A garland of wildflowers at his throat
The young one plays a sweet flute
Earrings gleam at his ears
Nanda’s joy, the moon of Braj
Radha’s beloved, the beautiful one of the grove

## Chorus

Of Shri Girdhar, Krishna Murari
Aarti of Kunj Bihari

## Verse

A dark radiance like the sky
Radha shines beside him, dear friend
Banmali stands among the vines
Bee-black locks, a musk tilak, a moonlike gleam
The lovely form of beloved Shyama

## Chorus

Of Shri Girdhar, Krishna Murari
Aarti of Kunj Bihari

## Verse

A golden peacock crown glitters
The gods long for a sight of him
A wealth of flowers rains from the sky
Jaw’s harp sounds, the mridang is sweet, the gopis are with him
Matchless love of the cowherd girls

## Chorus

Of Shri Girdhar, Krishna Murari
Aarti of Kunj Bihari

## Verse

From where the Ganga appeared
Shri Ganga, who wears away the stain of this age
Remembrance of her breaks attachment
She rests on Shiva’s head, in the midst of his locks, and carries off the mire of sin
The beauty of Shri Banwari’s feet

## Chorus

Of Shri Girdhar, Krishna Murari
Aarti of Kunj Bihari

## Verse

Bright dust glitters on the bank
Vrindavan’s flute is sounding
Gopis, cowherds, and cows on every side
A soft smile, moonlight, the snare of the world cut through
The cry of the poor one who asks is heard

## Chorus

Of Shri Girdhar, Krishna Murari
Aarti of Kunj Bihari`,
  },
  "om-namah-shivaya-krishna-das": {
    title: "Om Namah Shivaya",
    artist_version: "Krishna Das",
    audio_url: "https://www.youtube.com/watch?v=PTc8X37oJBE",
    youtube_url: "https://www.youtube.com/watch?v=PTc8X37oJBE",
    thumbnail_url: "/images/om-namah-shivaya-krishna-das.jpg",
    cover_url: "/images/om-namah-shivaya-krishna-das.jpg",
    mini_cover_url: "/images/om-namah-shivaya-krishna-das.jpg",
    display_order: 343,
    category_slugs: ["shiva", "shivratri", "mantra", "kirtan", "general", "satsang", "bhajan", "devotion", "sanskrit"],
    meaning:
      "Krishna Das’s live kirtan of the five-syllable mantra. The words are the old bow to Shiva.",
    roman_lyrics: `## Chorus

Om namah Shivaya`,
    translation: `## Chorus

I bow to Shiva`,
  },
  "hanuman-chalisa-krishna-das": {
    title: "Hanuman Chalisa",
    alternate_title: "Hanuman Chaleesa",
    artist_version: "Krishna Das",
    audio_url: "https://www.youtube.com/watch?v=PcuI-eMGla4",
    youtube_url: "https://www.youtube.com/watch?v=PcuI-eMGla4",
    thumbnail_url: "/images/hanuman-chalisa-krishna-das.jpg",
    cover_url: "/images/hanuman-chalisa-krishna-das.jpg",
    mini_cover_url: "/images/hanuman-chalisa-krishna-das.jpg",
    display_order: 344,
    category_slugs: [...HANUMAN_CHALISA_CATEGORY_SLUGS],
    meaning:
      "Krishna Das’s kirtan of Tulsidas’s Hanuman Chalisa, from Live on Earth.",
    roman_lyrics: HANUMAN_CHALISA_ROMAN,
    translation: HANUMAN_CHALISA_TRANSLATION,
  },
  "sri-ram-jai-ram-krishna-das": {
    title: "Sri Ram Jai Ram",
    alternate_title: "Heart as Wide as the World",
    artist_version: "Krishna Das",
    audio_url: "https://www.youtube.com/watch?v=lT1UI54YUZc",
    youtube_url: "https://www.youtube.com/watch?v=lT1UI54YUZc",
    thumbnail_url: "/images/sri-ram-jai-ram-krishna-das.jpg",
    cover_url: "/images/sri-ram-jai-ram-krishna-das.jpg",
    mini_cover_url: "/images/sri-ram-jai-ram-krishna-das.jpg",
    display_order: 345,
    category_slugs: ["ram", "kirtan", "general", "satsang", "bhajan", "devotion", "hindi"],
    meaning:
      "Krishna Das sings the old Ram mantra. The same video opens with Heart as Wide as the World. Those verses are his, and they are not printed here.",
    roman_lyrics: `## Chorus

Sri Ram jai Ram, jai jai Ram`,
    translation: `## Chorus

Victory to Ram, victory, victory to Ram`,
  },
  "baba-hanuman-krishna-das": {
    title: "Baba Hanuman",
    artist_version: "Krishna Das",
    audio_url: "https://www.youtube.com/watch?v=ZdjEgaND0n8",
    youtube_url: "https://www.youtube.com/watch?v=ZdjEgaND0n8",
    thumbnail_url: "/images/baba-hanuman-krishna-das.jpg",
    cover_url: "/images/baba-hanuman-krishna-das.jpg",
    mini_cover_url: "/images/baba-hanuman-krishna-das.jpg",
    display_order: 346,
    category_slugs: ["hanuman", "ram", "kirtan", "hanuman-jayanti", "general", "satsang", "bhajan", "devotion", "hindi"],
    meaning:
      "Krishna Das’s kirtan calling Hanuman by name. The line here is that call. Further verses on the recording are his and are not printed here.",
    roman_lyrics: `## Chorus

Baba Hanuman, jai jai Hanuman`,
    translation: `## Chorus

Father Hanuman, victory to Hanuman`,
  },
};


