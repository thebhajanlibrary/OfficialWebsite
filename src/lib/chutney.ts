/**
 * Traditional Chutney / Wedding folk pieces — separate from the bhajan catalogue.
 * Appear only under /chutney and/or /wedding (not All Bhajans / artists).
 */

import { getArtistProfile, resolveArtistSlug } from "@/lib/artists";
import type { QueueTrack } from "@/lib/play-queue";
import { matchesSearchQuery } from "@/lib/search-match";
import { slugify, youtubeEmbedUrl } from "@/lib/utils";

export type FolkSection = "chutney" | "wedding";

/** Optional alternate recordings of the same song (one list entry). */
export type ChutneyAudioVersion = {
  id: string;
  label: string;
  /** Short note under the version button */
  cue?: string;
  artist?: string;
  audio_url?: string;
  youtube_url?: string;
  thumbnail_url?: string;
  /** Used for Play all / shuffle / next — only one should be true */
  default_for_queue?: boolean;
};

export type ChutneySong = {
  slug: string;
  title: string;
  /** Lower = earlier in the list */
  order: number;
  cue?: string;
  /** Short background / cultural note on the song detail page */
  about?: string;
  artist?: string;
  /** Remix / DJ credit — shown on the track, not indexed as a chutney artist. */
  remixer?: string;
  youtube_url?: string;
  /** Local MP3 under /public (chutney-only; not All Bhajans) */
  audio_url?: string;
  /**
   * Side-by-side versions of the same song.
   * Queue / shuffle always uses the default_for_queue (or first) version.
   */
  audio_versions?: ChutneyAudioVersion[];
  /** Square / list art under /public */
  thumbnail_url?: string;
  /** Wide player art (falls back to thumbnail_url) */
  cover_url?: string;
  roman_lyrics: string;
  translation?: string;
  /** Where this piece is listed (default: chutney only) */
  sections?: FolkSection[];
  /** Extra search words (e.g. bollyney, rakhi) */
  search_tags?: string[];
};

/** Audio used in play-all / shuffle / next (never alternate versions). */
export function primaryAudioUrl(song: ChutneySong): string | null {
  const versions = song.audio_versions;
  if (versions?.length) {
    const pick =
      versions.find((v) => v.default_for_queue) ?? versions[0] ?? null;
    return pick?.audio_url ?? null;
  }
  return song.audio_url ?? null;
}

/** Default recording for queue — local MP3 or YouTube embed. */
export function primaryQueueMedia(song: ChutneySong): {
  audioUrl: string | null;
  youtubeEmbedUrl: string | null;
} {
  const versions = song.audio_versions;
  if (versions?.length) {
    const pick =
      versions.find((v) => v.default_for_queue) ?? versions[0] ?? null;
    if (!pick) return { audioUrl: null, youtubeEmbedUrl: null };
    return {
      audioUrl: pick.audio_url ?? null,
      youtubeEmbedUrl: pick.youtube_url
        ? youtubeEmbedUrl(pick.youtube_url)
        : null,
    };
  }
  return {
    audioUrl: song.audio_url ?? null,
    youtubeEmbedUrl: song.youtube_url
      ? youtubeEmbedUrl(song.youtube_url)
      : null,
  };
}

function inSection(song: ChutneySong, section: FolkSection): boolean {
  const sections = song.sections ?? (["chutney"] as FolkSection[]);
  return sections.includes(section);
}

const PARI_KARO_ROMAN = `## Refrain

Pari karo pari karo, para karo re zindagani re
Pari karo pari karo, para karo re zindagani re

## Verse 1

Ko-i dilo' ki aise milano
Jaise ranga me' pani re
Ko-i dilo' ki aise milano
Jaise ranga me' pani re
Para karo re zindagani re

Pari karo pari karo, para karo re zindagani re
Pari karo pari karo, para karo re zindagani re

## Verse 2

Goriya aye duri desha se'
Chand se mukhara dulhan bhesh me'
Goriya aye duri desha se'
Chand se mukhara dulhan bhesh me'
Nari naveli hay anameli
Chand sa yaka dila jani re
Para karo re zindagani re

Pari karo pari karo, para karo re zindagani re
Pari karo pari karo, para karo re zindagani re

## Verse 3

Ghumar ghumar dhan barse anganava
Paye payaliya kanke kanganava
Ghumar ghumar dhan barse anganava
Paye payaliya kanke kanganava
Ghungaru jo dhan ke anganva bhar ke
Chatiya na bhar ke diwani re
Para karo re zindagani re

Pari karo pari karo, para karo re zindagani re
Pari karo pari karo, para karo re zindagani re

## Verse 4

Goriya aye duri desha se'
Chand se mukhara dulhan bhesh me'
Goriya aye duri desha se'
Chand se mukhara dulhan bhesh me'
Nari naveli hay anameli
Chand sa yaka dila jani re
Para karo re zindagani re

Pari karo pari karo, para karo re zindagani re
Pari karo pari karo, para karo re zindagani re`;

const PARI_KARO_TRANSLATION = `## Refrain

Cross over, cross over — cross over, O life
Cross over, cross over — cross over, O life

## Verse 1

May someone unite hearts like this
As water mixes into colour
May someone unite hearts like this
As water mixes into colour
Cross over, O life

Cross over, cross over — cross over, O life
Cross over, cross over — cross over, O life

## Verse 2

The fair girl came from a distant land
Moon-faced, in a bride’s dress
The fair girl came from a distant land
Moon-faced, in a bride’s dress
A new bride, unmatched
One moon-like heart, beloved
Cross over, O life

Cross over, cross over — cross over, O life
Cross over, cross over — cross over, O life

## Verse 3

Wealth rains whirling in the courtyard
Anklets and bangles ring at the feet
Wealth rains whirling in the courtyard
Anklets and bangles ring at the feet
Anklets fill the courtyard with wealth
But do not fill the heart, O mad one
Cross over, O life

Cross over, cross over — cross over, O life
Cross over, cross over — cross over, O life

## Verse 4

The fair girl came from a distant land
Moon-faced, in a bride’s dress
The fair girl came from a distant land
Moon-faced, in a bride’s dress
A new bride, unmatched
One moon-like heart, beloved
Cross over, O life

Cross over, cross over — cross over, O life
Cross over, cross over — cross over, O life`;

export const CHUTNEY_SONGS: ChutneySong[] = [
  {
    slug: "ab-choliya-bheejay-paseena-banawari",
    title: "Ab choliya bheejay paseena banawari",
    order: 1,
    cue: "Traditional chutney · Ganesh Kirtan Group",
    artist: "The Ganesh Kirtan Group",
    youtube_url: "https://www.youtube.com/watch?v=QrHomb7KoBc",
    roman_lyrics: `Ab choliya bheejay paseena banawari

Kota charhat more sasru nirakhe
Utara ka phatte kinari banawari

Kota charhat more bhasru nirakhe
Utara ka phatte kinari banawari

Kota charhat more dewar nirakhe
Utara ka phatte kinari banawari

Kota charhat more balama nirakhe
Utara ka phatte kinari banawari

Ab choliya bheejay paseena banawari`,
    translation: `Now my body is drenched in sweat, beloved

My father-in-law observes as I climb up the shelf
While coming down my dress tears on the ledge, beloved

My older brother-in-law observes as I climb up the shelf
While coming down my dress tears on the ledge, beloved

My younger brother-in-law observes as I climb up the shelf
While coming down my dress tears on the ledge, beloved

My lover (husband) observes as I climb up the shelf
While coming down my dress tears on the ledge, beloved

Now my body is drenched in sweat, beloved`,
  },
  {
    slug: "wadekar-chale-aage-aage",
    title: "Wadekar chale aage aage",
    order: 2,
    cue: "West Indies vs India cricket song · Trinidad",
    artist: "Sagar Sookraj · The Bharat Sangeet Orchestra",
    youtube_url: "https://www.youtube.com/watch?v=lA2lA1eTpnE",
    roman_lyrics: `## Refrain

Wadekar chale aage aage
Sobers goes behind
Kanhai drinking white-rum
Durrani drinking wine

## Verse 1

Sobers hits the ball, bhai
Straight into Bedi's hand
Bedi shouts "How's that"
The umpire shook his hand
Bedi calls to the skipper
"Come on, you should go"
The skipper said, "Bowl bhai
You be me, then you'll know"

## Verse 2

They're bowling to the Indians
It's five for seventy-five
Sobers laughed, "Ha, ha"
He said, "This test is mine"
Wadekar told Solkar
"Beta, just hold your end"
"Sardesai will beat them
Till the game will bend"

## Verse 3

When they went to Barbados
Dowe was bowling faas
Dowe bounced to Gavaskar
Another six, alas!
Sobers nearly cried, bhai
To see his side get lick
You'd better take a rest, bhai
Before you get sick

## Verse 4

The great Indian bowler
Syed Abid Ali
He showed all the people
That he could rally
He bowled Morris Foster
When he was ninety-nine
He returned the Indians
Right back in the line

## Verse 5

When these great cricketers
Went back to their lands
I and my darling
Went and shook their hands
Some people asked the reason
They said, "You don't know the man"
But these guys defeated
The mighty West Indians
And the bowling averages
Went on to Venkataraghavan`,
    translation: `## Refrain

Wadekar walks in front
Sobers goes behind
Kanhai’s drinking white-rum
Durrani’s drinking wine

## Verse 1

Sobers hits the ball, brother
Straight into Bedi’s hand
Bedi shouts “How’s that”
The umpire shook his hand (not out)
Bedi calls to the skipper (Sobers)
“Come on, you should go”
The skipper said, “Bowl, brother
You be me, then you’ll know”

## Verse 2

They’re (W.I.) bowling to the Indians
It’s five for seventy-five
Sobers laughed, “Ha, ha”
He said, “This test is (now) mine”
Wadekar told Solkar
“Son, just hold your end (keep your wicket)”
“Sardesai will beat them (the W.I.)
Till the game will bend”

## Verse 3

When they went to Barbados
(Uton) Dowe was bowling fast
Dowe bounced to Gavaskar
(Who hit him for a six) — another six, alas!
Sobers nearly cried, brother
To see his side get licked
You’d better take a rest, brother
Before you get sick

## Verse 4

The great Indian bowler
(Syed) Abid Ali
He showed all the people
That he could rally
He bowled Morris Foster
When he was ninety-nine
He returned the Indians
Right back in the line

## Verse 5

When these great cricketers
Went back to their lands
I and my darling
Went and shook their hands
Some people asked the reason
They said, “You don’t know the man”
But these guys defeated
The mighty West Indians
And the bowling averages
Went on to Venkataraghavan`,
  },
  {
    slug: "devara-banal-re-dulaharva",
    title: "Devara banal re dulaharva",
    order: 3,
    cue: "Traditional chutney · Mrs K. Kishoendajal & Chorus",
    artist: "Mrs K. Kishoendajal & Chorus",
    youtube_url: "https://www.youtube.com/watch?v=3tWDD7TGooY",
    roman_lyrics: `## Refrain

Devara banal re dulaharva
Bagal bhauji ghar me' rove
Devara banal re dulaharva
Lagal bhauji ghar me' rove

## Verse 1

Nauvo se rove, nauvoniyo se rove
Nauvo se rove, nauvoniyo se rove
Karke bandhana re se halva
Bagal bhauji ghar me' rove

## Verse 2

Nando se rove, nandoiyo se rove
Nando se rove, nandoiyo se rove
Karke karavata halva
Bagal bhauji ghar me' rove

## Verse 3

Poto pe rove, potariyo pe rove
Poto pe rove, potariyo pe rove
Chutal ke barase sitalava
Bagal bhauji ghar me' rove

## Verse 4

Bhago me rove, bagaicho me' rove
Bhago me rove, bagaicho me' rove
Oliya uthaile chaharava
Bagal bhauji ghar me' rove

## Verse 5

Sakhiyo' se rove, saheliyo' se rove
Sakhiyo' se rove, saheliyo' se rove
Tut mere dulharu pakarava
Bagal bhauji ghar me' rove

## Verse 6

Devarvo pe rove, batarvo pe rove
Devarvo pe rove, batarvo pe rove
Okhli se chutal musarava
Bagal bhauji ghar me' rove`,
    translation: `## Refrain

The devar (husband’s younger brother) has become the bridegroom
Meanwhile the bhauji (brother’s wife) cries at home
The devar (husband’s younger brother) has become the bridegroom
And the bhauji (brother’s wife) has begun to cry at home

## Verse 1

The barber’s wife cries, the barber’s women cry
The barber’s wife cries, the barber’s women cry
Making the bond of the wedding feast
Meanwhile the bhauji (brother’s wife) cries at home

## Verse 2

The nando (husband’s sister) cries, the nandois (her husbands) cry
The nando (husband’s sister) cries, the nandois (her husbands) cry
Making the karavat feast
Meanwhile the bhauji (brother’s wife) cries at home

## Verse 3

She cries for the grandson, she cries for the granddaughter
She cries for the grandson, she cries for the granddaughter
Cool water spills and falls
Meanwhile the bhauji (brother’s wife) cries at home

## Verse 4

She cries in the garden, she cries in the orchard
She cries in the garden, she cries in the orchard
Lifting the covering of the courtyard
Meanwhile the bhauji (brother’s wife) cries at home

## Verse 5

The sakhis cry, the girlfriends cry
The sakhis cry, the girlfriends cry
My bridegroom’s hold has broken
Meanwhile the bhauji (brother’s wife) cries at home

## Verse 6

She cries over the devar (husband’s younger brother), she cries over the chatter
She cries over the devar (husband’s younger brother), she cries over the chatter
The pestle has slipped from the mortar
Meanwhile the bhauji (brother’s wife) cries at home`,
  },
  {
    slug: "shriguru-charana-saroja-raja-nagara-birha",
    title: "Shriguru charana saroja raja",
    order: 4,
    cue: "Nagara & Birha · Mala Records 1976 · Meghanath larai",
    artist: "Baba Jagessar Baktawar",
    youtube_url: "https://www.youtube.com/watch?v=KMxQ4bhUHp0",
    roman_lyrics: `## Opening · Dohas

Shriguru charana saroja raja, bhai
Ab nija mana mukura sudhar
Shriguru charana saroja raja, bhai
Ab nija mana mukura sudhar
Arre baranau' Raghubara bimala jasu, bhaiya
Utho jo dayaka phal char

He Buddhi-hina tanu Janike, bhai
Hata sumirau' Pavan Kumar
He Buddhi-hina tanu Janike, bhai
Hata sumirau' Pavan Kumar
Bala buddhi vidya dehu mohi', bhaiya
Ab harahu kalesh bikar

## Verse 1

Kalama dan sahi manavaye
Kalama dan sahi manavaye
Ura ja likhai ab banayi banayi
Ura ja likhai ab banayi banayi
Pahile nam likhe Hari apan
Pahile nam likhe Hari apan
Pachhavali ke Lachhiman ke!

## Verse 2

Ho pachhavali ke Lachhiman ke larai!
Meghanath Ravan kar beta
Meghanath Ravan kar beta
Tare dala gohara vata bhai
Tare dala gohara vata bhai
Hai ko-i joda Rama ka tala me'
Hai ko-i joda Rama ka tala me'
Dhanuva uthaye ham se, ha'!

## Verse 3

Ho jalwa uthaye hamse lekar larai
Meghanath Ravan kar beta
Tare dala gohara vata bhai
Hai ko-i joda Rama ka tala me'
Dhanuva uthaye hamse lekar larai
Mahabir jab gadda uthaye
Lachhiman chapata ravata bhai
Lachhiman chapata ravata bhai
Maharatha bhuja ghire ghar Lanka
Sita ghire, ghire ja!

## Verse 3′

Ho jalwa uthaye hamse lekar larai
Mahabir jab gadda uthaye
Mahabir jab gadda uthaye
Lachhiman chapata ravata bhai
Lachhiman chapata ravata bhai
Maharatha bhuja ghire ghar Lanka
Maharatha bhuja ghire ghar Lanka
Sita ghire, ghire ja!

## Verse 4

Aushish ghire ja baithiye Raghurai
Bhuja dekh par ro-e Silochan
Bhuja dekh par ro-e Silochan
Naina nir bara ya vata bhai
Naina nir bara ya vata bhai
Tulasidasa bajo Bhagavana
Tulasidasa bajo Bhagavana
Meghanath dujai Ram ke larai!`,
    translation: `## Opening · Dohas

With the dust of the true Guru’s lotus feet, brother
Clean the mirror of your own mind
With the dust of the true Guru’s lotus feet, brother
Clean the mirror of your own mind
I recount the pure glory of Raghubar, brother
Rise — he who grants the four fruits of life

Knowing this body to be without wisdom, brother
I remember the Wind-son (Hanuman)
Knowing this body to be without wisdom, brother
I remember the Wind-son (Hanuman)
Give me strength, wisdom and learning, brother
And take away my sorrow and faults

## Verse 1

The pen and ink are offered in prayer
The pen and ink are offered in prayer
Fly and write now, beautifully made
Fly and write now, beautifully made
First write the name of Hari himself
First write the name of Hari himself
Then of Lakshman of the rear guard!

## Verse 2

Ho — the battle of Lakshman of the rear guard!
Meghanath, son of Ravan
Meghanath, son of Ravan
His army gathers like a herd of cattle, brother
His army gathers like a herd of cattle, brother
Is there any match for Ram on this ground?
Is there any match for Ram on this ground?
We take up the bow — yes!

## Verse 3

Ho — we take up the splendour and go to war
Meghanath, son of Ravan
His army gathers like a herd of cattle, brother
Is there any match for Ram on this ground?
We take up the bow and go to war
When Mahavir lifts his club
Lakshman presses hard, O king, brother
Lakshman presses hard, O king, brother
Great chariots and arms surround Lanka’s house
Sita is surrounded — go, go!

## Verse 3′

Ho — we take up the splendour and go to war
When Mahavir lifts his club
When Mahavir lifts his club
Lakshman presses hard, O king, brother
Lakshman presses hard, O king, brother
Great chariots and arms surround Lanka’s house
Great chariots and arms surround Lanka’s house
Sita is surrounded — go, go!

## Verse 4

Blessings surround you — sit, O Raghurai
Seeing the arm, Silochan weeps
Seeing the arm, Silochan weeps
Tears fall from her eyes, brother
Tears fall from her eyes, brother
Tulsidas sounds the name of Bhagavan
Tulsidas sounds the name of Bhagavan
Meghanath fights Ram a second time!`,
  },
  {
    slug: "bhouji-gyal-pise-masala",
    title: "Bhouji gyal - pise masala",
    order: 5,
    cue: "Wedding / chutney · Mangroo Badal (Suriname 1977) · Joyce Ormela Harris (Guyana 1974)",
    artist: "Mangroo Badal / Joyce Ormela Harris",
    youtube_url: "https://www.youtube.com/watch?v=pRWKVv-NzX0",
    sections: ["chutney", "wedding"],
    roman_lyrics: `## Mangroo Badal (Suriname 1977)

### Refrain

Go 'round come down bhauji-gyal, pise masala
Go 'round come down bhauji-gyal, pise masala
Pise masala, aji pise masala
Go 'round come down Bhauji-girl, pise masala
Go 'round come down Bhauji-girl, pise masala

### Verse 1

Your hair is like silver, your body is like gol'
Your face is like an angel, you took away my soul
Aji pise masala

Go 'round come down bhauji-gyal, pise masala
Go 'round come down bhauji-gyal, pise masala
Pise masala, aji pise masala
Go 'round come down Bhauji-girl, pise masala
Go 'round come down Bhauji-girl, pise masala

### Verse 2

When you walk in the corner, I'll give you a ripe banana
When you begin to holler, I'll feed you yangana
Aji pise masala

Go 'round come down bhauji-gyal, pise masala
Go 'round come down bhauji-gyal, pise masala
Pise masala, aji pise masala
Go 'round come down Bhauji-girl, pise masala
Go 'round come down Bhauji-girl, pise masala

### Verse 3

When you go on road, you wear your shirt and pants
When you meet your saiya, you take off and you dance
Aji pise masala

Go 'round come down bhauji-gyal, pise masala
Go 'round come down bhauji-gyal, pise masala
Pise masala, aji pise masala
Go 'round come down Bhauji-girl, pise masala
Go 'round come down Bhauji-girl, pise masala

### Verse 4

Your hands are full of gold girl, you can't wash a bowl
You only have the role, girl, to torment my soul
Aji pise masala

Go 'round come down bhauji-gyal, pise masala
Go 'round come down bhauji-gyal, pise masala
Pise masala, aji pise masala
Go 'round come down Bhauji-girl, pise masala
Go 'round come down Bhauji-girl, pise masala

## Joyce Ormela Harris (Guyana 1974)

### Refrain

Go 'round, come 'round bhauji-girl; pise masala
Go 'round, come 'round bhauji-girl; pise masala
Pise masala, aji pise masala
Go 'round, come 'round bhauji-girl, pise masala
Go 'round, come 'round bhauji-girl, pise masala

### Verse 1

Bhauji had a little lamb, its fleece was white as snow
And everywhere that bhauji went, the lamb was sure to go
Aji pise masala; hayi re jin patke dulhaniya

Go 'round, come 'round bhauji-girl; pise masala
Go 'round, come 'round bhauji-girl; pise masala
Pise masala, aji pise masala
Go 'round, come 'round bhauji-girl, pise masala
Go 'round, come 'round bhauji-girl, pise masala

### Verse 2

My mami picked a flower, my mausi got a baba
If it wasn't for my chachi, the family wouldn't know
Vo hi pise masala; hayi re jin patke dulhaniya

Go 'round, come 'round bhauji-girl; pise masala
Go 'round, come 'round bhauji-girl; pise masala
Pise masala, aji pise masala
Go 'round, come 'round bhauji-girl, pise masala
Go 'round, come 'round bhauji-girl, pise masala

### Verse 3

Never kiss an old-man, bhauji, I'll tell you why
His mouth's always dribbling, his lips are never dry
They're never dry; hayi re, jin patke dulhaniya

Go 'round, come 'round bhauji-girl; pise masala
Go 'round, come 'round bhauji-girl; pise masala
Pise masala, aji pise masala
Go 'round, come 'round bhauji-girl, pise masala
Go 'round, come 'round bhauji-girl, pise masala

### Verse 4

When bhauji was a little girl, they fed her dal and rice
When she became a big girl, they married her really nice
Now she pise masala; hayi re, jin patke dulhaniya

Go 'round, come 'round bhauji-girl; pise masala
Go 'round, come 'round bhauji-girl; pise masala
Pise masala, aji pise masala
Go 'round, come 'round bhauji-girl, pise masala
Go 'round, come 'round bhauji-girl, pise masala`,
    translation: `## Mangroo Badal (Suriname 1977)

### Refrain

Go round, come down, sister-in-law (brother’s wife) — grind the spices
Go round, come down, sister-in-law (brother’s wife) — grind the spices
Grind the spices, grandmother (dad’s mother), grind the spices
Go round, come down, Bhauji-girl (brother’s wife) — grind the spices
Go round, come down, Bhauji-girl (brother’s wife) — grind the spices

### Verse 1

Your hair is like silver, your body is like gold
Your face is like an angel — you took away my soul
Grandmother (dad’s mother), grind the spices

Go round, come down, sister-in-law (brother’s wife) — grind the spices
Go round, come down, sister-in-law (brother’s wife) — grind the spices
Grind the spices, grandmother (dad’s mother), grind the spices
Go round, come down, Bhauji-girl (brother’s wife) — grind the spices
Go round, come down, Bhauji-girl (brother’s wife) — grind the spices

### Verse 2

When you walk in the corner, I'll give you a ripe banana
If you begin to holler, I'll feed you yangana
Grandmother (dad’s mother), grind the spices

Go round, come down, sister-in-law (brother’s wife) — grind the spices
Go round, come down, sister-in-law (brother’s wife) — grind the spices
Grind the spices, grandmother (dad’s mother), grind the spices
Go round, come down, Bhauji-girl (brother’s wife) — grind the spices
Go round, come down, Bhauji-girl (brother’s wife) — grind the spices

### Verse 3

When you go on the road, you wear your shirt and pants
When you meet your beloved, you take them off and you dance
Grandmother (dad’s mother), grind the spices

Go round, come down, sister-in-law (brother’s wife) — grind the spices
Go round, come down, sister-in-law (brother’s wife) — grind the spices
Grind the spices, grandmother (dad’s mother), grind the spices
Go round, come down, Bhauji-girl (brother’s wife) — grind the spices
Go round, come down, Bhauji-girl (brother’s wife) — grind the spices

### Verse 4

Your hands are full of gold, girl — you can't wash a bowl
You only have the role, girl, to torment my soul
Grandmother (dad’s mother), grind the spices

Go round, come down, sister-in-law (brother’s wife) — grind the spices
Go round, come down, sister-in-law (brother’s wife) — grind the spices
Grind the spices, grandmother (dad’s mother), grind the spices
Go round, come down, Bhauji-girl (brother’s wife) — grind the spices
Go round, come down, Bhauji-girl (brother’s wife) — grind the spices

## Joyce Ormela Harris (Guyana 1974)

### Refrain

Go round, come round, sister-in-law (brother’s wife) — grind the spices
Go round, come round, sister-in-law (brother’s wife) — grind the spices
Grind the spices, grandmother (dad’s mother), grind the spices
Go round, come round, sister-in-law (brother’s wife) — grind the spices
Go round, come round, sister-in-law (brother’s wife) — grind the spices

### Verse 1

Bhauji (brother’s wife) had a little lamb, its fleece was white as snow
And everywhere that bhauji (brother’s wife) went, the lamb was sure to go
Grandmother (dad’s mother), grind the spices; oh — the bride fell down

Go round, come round, sister-in-law (brother’s wife) — grind the spices
Go round, come round, sister-in-law (brother’s wife) — grind the spices
Grind the spices, grandmother (dad’s mother), grind the spices
Go round, come round, sister-in-law (brother’s wife) — grind the spices
Go round, come round, sister-in-law (brother’s wife) — grind the spices

### Verse 2

My mami (mother’s brother’s wife) picked a flower, my mausi (mother’s sister) got a baby
If it wasn't for my chachi (father’s brother’s wife), the family wouldn't know
She herself grinds the spices; oh — the bride fell down

Go round, come round, sister-in-law (brother’s wife) — grind the spices
Go round, come round, sister-in-law (brother’s wife) — grind the spices
Grind the spices, grandmother (dad’s mother), grind the spices
Go round, come round, sister-in-law (brother’s wife) — grind the spices
Go round, come round, sister-in-law (brother’s wife) — grind the spices

### Verse 3

Never kiss an old man, bhauji (brother’s wife) — I'll tell you why
His mouth is always dribbling, his lips are never dry
They're never dry; oh — the bride fell down

Go round, come round, sister-in-law (brother’s wife) — grind the spices
Go round, come round, sister-in-law (brother’s wife) — grind the spices
Grind the spices, grandmother (dad’s mother), grind the spices
Go round, come round, sister-in-law (brother’s wife) — grind the spices
Go round, come round, sister-in-law (brother’s wife) — grind the spices

### Verse 4

When bhauji (brother’s wife) was a little girl, they fed her dal and rice
When she became a big girl, they married her properly
Now she grinds the spices; oh — the bride fell down

Go round, come round, sister-in-law (brother’s wife) — grind the spices
Go round, come round, sister-in-law (brother’s wife) — grind the spices
Grind the spices, grandmother (dad’s mother), grind the spices
Go round, come round, sister-in-law (brother’s wife) — grind the spices
Go round, come round, sister-in-law (brother’s wife) — grind the spices`,
  },
  {
    slug: "chali-gai-ho",
    title: "Chali Gai Ho",
    order: 5.5,
    cue: "Chutney classic · Original · 1981",
    about:
      "Chali Gai Ho (1981) is a chutney classic by Indo-Trinidadian musician Sundar Popo. The lyrics focus on a family where everything has gone awry — each verse describes people doing the opposite of the cultural conventions of the time, giving an insight into the etiquette traditionally observed by Indo-Trinidadian families. Babla & Kanchan’s better-known 1983 cover is listed separately.",
    artist: "Sundar Popo",
    youtube_url: "https://www.youtube.com/watch?v=_AiBHaKBXLE",
    thumbnail_url: "/images/sundar-popo.png",
    cover_url: "/images/sundar-popo.png",
    sections: ["chutney", "wedding"],
    search_tags: [
      "chali gai ho",
      "chali gaye ho",
      "chal gaye",
      "chali gaye",
      "ulti hawa",
      "ulte zamane",
      "sundar popo",
    ],
    roman_lyrics: `## Refrain

Chali gaye ho, chali gaye, chali gaye ho
Aise ulti hawa jab main chali gaye ho

## Verse 1

Putra pita ke baaran kataawe, mata godain badlaawe
Saari baaton bigad gaye ho
Aise ulti hawa jab main chali gaye ho

## Verse 2

Bahu we sasu ke debe gaari, baaton ke umra gavali
Laaj-sharm sab bahar gaye ho
Aise ulti hawa jab main chali gaye ho

## Verse 3

Pita woh putri ke daan jhinawe, nirdaya ke sharm na aawe
Rasm gaon mani par gaye ho
Aise udati hawa jab main chali gaye ho

## Verse 4

Balhino ko nahi saka suhaawe, chetuva tab prabh paawe
Laabh bhavar sab phas gaye ho
Aise udati hawa jab main chali gaye ho`,
    translation: `## Refrain

It has gone away — it has gone, it has gone away
In this upside-down air, it has gone away

## Verse 1

The son cuts the father's hair, the mother changes the curtains
All talk has been messed up
In this upside-down air, it has gone away

## Verse 2

The bahu (daughter-in-law) insults the sasu (mother-in-law), the old ways have gone away
Modesty has been thrown out the window
In this upside-down air, it has gone away

## Verse 3

The father gives the daughter his wealth, the cruel have no shame
The gem-like village traditions have gone away (to town)
In this upside-down air, it has gone away

## Verse 4

The babies cannot fall asleep peacefully, only God can be cautious
All their profits have become stuck (they are not earning anything)
In this upside-down air, it has gone away`,
  },
  {
    slug: "chali-gai-ho-babla-kanchan",
    title: "Chali Gai Ho",
    order: 5.55,
    cue: "Cover · 1983 · perhaps better known · Chal Gaye",
    about:
      "Babla & Kanchan’s 1983 cover of Sundar Popo’s Chali Gai Ho (often titled Chal Gaye) is perhaps better known than the 1981 original. The lyrics focus on a family where everything has gone awry — each verse describes people doing the opposite of the cultural conventions of the time.",
    artist: "Babla & Kanchan",
    audio_url: "/audio/chutney/chali-gai-ho-babla-kanchan.mp3",
    youtube_url: "https://www.youtube.com/watch?v=_CKKCgmUyTg",
    thumbnail_url: "/images/chutney/chali-gai-ho-babla-kanchan.jpg",
    cover_url: "/images/chutney/chali-gai-ho-babla-kanchan.jpg",
    sections: ["chutney", "wedding"],
    search_tags: [
      "chali gai ho",
      "chali gaye ho",
      "chal gaye",
      "chali gaye",
      "chal gaye babla",
      "ulti hawa",
      "ulte zamane",
      "babla kanchan",
      "rohit jagessar",
    ],
    roman_lyrics: `## Refrain

Chali gaye ho, chali gaye, chali gaye ho
Aise ulti hawa jab main chali gaye ho

## Verse 1

Putra pita ke baaran kataawe, mata godain badlaawe
Saari baaton bigad gaye ho
Aise ulti hawa jab main chali gaye ho

## Verse 2

Bahu we sasu ke debe gaari, baaton ke umra gavali
Laaj-sharm sab bahar gaye ho
Aise ulti hawa jab main chali gaye ho

## Verse 3

Pita woh putri ke daan jhinawe, nirdaya ke sharm na aawe
Rasm gaon mani par gaye ho
Aise udati hawa jab main chali gaye ho

## Verse 4

Balhino ko nahi saka suhaawe, chetuva tab prabh paawe
Laabh bhavar sab phas gaye ho
Aise udati hawa jab main chali gaye ho`,
    translation: `## Refrain

It has gone away — it has gone, it has gone away
In this upside-down air, it has gone away

## Verse 1

The son cuts the father's hair, the mother changes the curtains
All talk has been messed up
In this upside-down air, it has gone away

## Verse 2

The bahu (daughter-in-law) insults the sasu (mother-in-law), the old ways have gone away
Modesty has been thrown out the window
In this upside-down air, it has gone away

## Verse 3

The father gives the daughter his wealth, the cruel have no shame
The gem-like village traditions have gone away (to town)
In this upside-down air, it has gone away

## Verse 4

The babies cannot fall asleep peacefully, only God can be cautious
All their profits have become stuck (they are not earning anything)
In this upside-down air, it has gone away`,
  },
  {
    slug: "pari-karo-zindagani-remix",
    title: "Paar Karo Remix (2023)",
    order: 6,
    cue: "Traditional chutney · Remix",
    artist: "Rawytee Ramroop X Bidjwanwatie Chaitoe",
    remixer: "Zaheer",
    audio_url: "/audio/chutney/paar-karo-remix.mp3",
    thumbnail_url: "/images/chutney/paar-karo-remix-player.png",
    cover_url: "/images/chutney/paar-karo-remix-player.png",
    sections: ["chutney", "wedding"],
    search_tags: ["rawytee ramroop", "bidjwanwatie chaitoe", "zaheer", "paar karo", "wedding"],
    roman_lyrics: PARI_KARO_ROMAN,
    translation: PARI_KARO_TRANSLATION,
  },
  {
    slug: "manika-dhar-jabiya-dropati",
    title: "Manika dhar jabiya - Lawa",
    order: 7,
    cue: "Lawa · Let's Sing & Dance with Dropati · Track 2",
    artist: "Dropati",
    youtube_url: "https://www.youtube.com/watch?v=WgKMpHTft-8",
    audio_url:
      "/audio/chutney/lets-sing-and-dance-with-dropati/02-manikdhar-jhabeeya.mp3",
    thumbnail_url: "/images/chutney/lets-sing-and-dance-with-dropati.png",
    cover_url: "/images/chutney/lets-sing-and-dance-with-dropati-player-v2.png",
    sections: ["chutney", "wedding"],
    search_tags: [
      "manikdhar jhabeeya",
      "manika dhar jabiya",
      "lawa",
      "dropati",
      "suriname",
      "lets sing and dance with dropati",
    ],
    roman_lyrics: `## Refrain

Kekar ke lave, manika dhar jabiya
Ke ghar ke lave, dekho, kekar ke lave, manika mora jabiya
Ke ghar ke lave re, manika dhar jabiya

Manika mora jabiya, manika dhar jabiya, manika mora jabiya
Ke ghar ke lave re, manika mora jabiya

## Verse 1

Dulaha ke maiya to bujhe lagi lava
Dulaha ke mai to bujhe lagi lava
Dulaha ke maiya to bujhe lagi lava
Dulaha ke mai to bujhe lagi lava
Pappa gire le pichhavare, manika mora chabiya

Kekar ke lave, manika dhar jabiya
Ke ghar ke lave, dekho, kekar ke lave, manika mora jabiya
Ke ghar ke lave re, manika dhar jabiya
Manika mora jabiya, manika dhar jabiya, manika mora jabiya
Ke ghar ke lave re, manika mora jabiya

## Verse 2

Dulaha ke phua to bujhe lagi lava
Dulaha ke chachi to bujhe lagi lava
Dulaha ke phua to bujhe lagi lava
Dulaha ke chachi to bujhe lagi lava
Dekho phupha gire le pichhavare, manika dhar chabiya

Kekar ke lave, manika dhar jabiya
Ke ghar ke lave, dekho, kekar ke lave, manika mora jabiya
Ke ghar ke lave re, manika dhar jabiya
Manika mora jabiya, manika dhar jabiya, manika mora jabiya
Ke ghar ke lave re, manika mora jabiya

## Verse 3

Dulaha ke mausi to bujhe lagi lava
Dulaha ke mami to bhuje lagi lava
Hya ke mehararvan to bujhe lagi lava
Hya ke mehararvan to bhuje lagi lava
Dekho mausa gire le pichhavare, manika dhar chabiya

Kekar ke lave, manika dhar jabiya
Ke ghar ke lave, dekho, kekar ke lave, manika mora jabiya
Ke ghar ke lave re, manika dhar jabiya
Manika mora jabiya, manika dhar jabiya, manika mora jabiya
Ke ghar ke lave re, manika mora jabiya`,
    translation: `## Refrain

Whose house brings the lawa? — holding the corn, chewing
Whose house brings it, look — whose house brings it — chewing my corn
Whose house brings it — holding the corn, chewing

Chewing my corn, holding and chewing, chewing my corn
Whose house brings it — chewing my corn

## Verse 1

The groom’s mother (maiya) tends the lawa so it does not burn
The groom’s mother (mai) tends the lawa so it does not burn
The groom’s mother (maiya) tends the lawa so it does not burn
The groom’s mother (mai) tends the lawa so it does not burn
Father fell in the backyard, chewing the smell of the corn

Whose house brings the lawa? — holding the corn, chewing
Whose house brings it, look — whose house brings it — chewing my corn
Whose house brings it — holding the corn, chewing
Chewing my corn, holding and chewing, chewing my corn
Whose house brings it — chewing my corn

## Verse 2

The groom’s phua (father’s sister) tends the lawa so it does not burn
The groom’s chachi (father’s brother’s wife) tends the lawa so it does not burn
The groom’s phua (father’s sister) tends the lawa so it does not burn
The groom’s chachi (father’s brother’s wife) tends the lawa so it does not burn
Look — phupha (phua’s husband) fell in the backyard, holding the corn and chewing the smell

Whose house brings the lawa? — holding the corn, chewing
Whose house brings it, look — whose house brings it — chewing my corn
Whose house brings it — holding the corn, chewing
Chewing my corn, holding and chewing, chewing my corn
Whose house brings it — chewing my corn

## Verse 3

The groom’s mausi (mother’s sister) tends the lawa so it does not burn
The groom’s mami (mother’s brother’s wife) roasts the lawa
These womenfolk tend the lawa so it does not burn
These womenfolk roast the lawa
Look — mausa (mausi’s husband) fell in the backyard, holding the corn and chewing the smell

Whose house brings the lawa? — holding the corn, chewing
Whose house brings it, look — whose house brings it — chewing my corn
Whose house brings it — holding the corn, chewing
Chewing my corn, holding and chewing, chewing my corn
Whose house brings it — chewing my corn`,
  },
  {
    slug: "moray-gari-suno-maharaj-dropati",
    title: "Moray Gari Suno Maharaj",
    order: 7.5,
    cue: "Sehrā · Let's Sing & Dance with Dropati · Track 3",
    artist: "Dropati",
    youtube_url: "https://www.youtube.com/watch?v=PT_eC0CgXF0",
    audio_url:
      "/audio/chutney/lets-sing-and-dance-with-dropati/03-moray-gari-suno.mp3",
    thumbnail_url: "/images/chutney/lets-sing-and-dance-with-dropati.png",
    cover_url: "/images/chutney/lets-sing-and-dance-with-dropati-player-v2.png",
    sections: ["chutney", "wedding"],
    search_tags: [
      "moray gari suno maharaj",
      "more gari suno maharaj",
      "sehra",
      "barat",
      "dulaha",
      "dulahe",
      "ram lalla",
      "dropati",
      "suriname",
      "wedding",
      "lets sing and dance with dropati",
    ],
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
  {
    slug: "gauri-puja-dropati",
    title: "Gauri Puja",
    order: 7.6,
    cue: "Chutney bhajan · Let's Sing & Dance with Dropati · Track 1 (Gowri Rooja)",
    artist: "Dropati",
    youtube_url: "https://www.youtube.com/watch?v=Cs995YwpO_0",
    audio_url:
      "/audio/chutney/lets-sing-and-dance-with-dropati/01-gowri-rooja.mp3",
    thumbnail_url: "/images/chutney/lets-sing-and-dance-with-dropati.png",
    cover_url: "/images/chutney/lets-sing-and-dance-with-dropati-player-v2.png",
    sections: ["chutney", "wedding"],
    search_tags: [
      "gauri puja",
      "gowri rooja",
      "gaur pujo",
      "gauri",
      "ganesh",
      "ganes",
      "dropati",
      "suriname",
      "wedding",
      "dharti",
      "bhavani",
      "deohara",
      "tilak",
      "lets sing and dance with dropati",
    ],
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
  // —— Let's Sing & Dance with Dropati (remaining album tracks; 1–3 merged above) ——
  {
    slug: "dasrathji-ayee-lay-dropati",
    title: "Dasrathji Ayee Lay",
    order: 7.61,
    cue: "Let's Sing & Dance with Dropati · Track 4",
    artist: "Dropati",
    audio_url:
      "/audio/chutney/lets-sing-and-dance-with-dropati/04-dasrathji-ayee-lay.mp3",
    thumbnail_url: "/images/chutney/lets-sing-and-dance-with-dropati.png",
    cover_url: "/images/chutney/lets-sing-and-dance-with-dropati-player-v2.png",
    sections: ["chutney", "wedding"],
    search_tags: ["dasrathji", "ram", "dropati", "lets sing and dance with dropati"],
    roman_lyrics: "[Album track]",
  },
  {
    slug: "kay-dhanwa-tora-dropati",
    title: "Kay Dhanwa Tora",
    order: 7.62,
    cue: "Let's Sing & Dance with Dropati · Track 5",
    artist: "Dropati",
    audio_url:
      "/audio/chutney/lets-sing-and-dance-with-dropati/05-kay-dhanwa-tora.mp3",
    thumbnail_url: "/images/chutney/lets-sing-and-dance-with-dropati.png",
    cover_url: "/images/chutney/lets-sing-and-dance-with-dropati-player-v2.png",
    sections: ["chutney", "wedding"],
    search_tags: [
      "kay dhanwa tora",
      "ke ye dhanava ture janak",
      "dhanush",
      "parshuram",
      "janak",
      "sita",
      "swayamvar",
      "dropati",
      "lets sing and dance with dropati",
    ],
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
  {
    slug: "kahay-raja-ramchandra-dropati",
    title: "Kahay Raja Ramchandra",
    order: 7.63,
    cue: "Let's Sing & Dance with Dropati · Track 6",
    artist: "Dropati",
    audio_url:
      "/audio/chutney/lets-sing-and-dance-with-dropati/06-kahay-raja-ramchandra.mp3",
    thumbnail_url: "/images/chutney/lets-sing-and-dance-with-dropati.png",
    cover_url: "/images/chutney/lets-sing-and-dance-with-dropati-player-v2.png",
    sections: ["chutney", "wedding"],
    search_tags: [
      "kahay raja ramchandra",
      "kahe raja ramchandra suno ho janak ji",
      "janak ji",
      "ramchandra",
      "sita",
      "ram",
      "dropati",
      "lets sing and dance with dropati",
    ],
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
  {
    slug: "sonay-kay-kharaun-dropati",
    title: "Sonay Kay Kharaun",
    order: 7.64,
    cue: "Let's Sing & Dance with Dropati · Track 7",
    artist: "Dropati",
    audio_url:
      "/audio/chutney/lets-sing-and-dance-with-dropati/07-sonay-kay-kharaun.mp3",
    thumbnail_url: "/images/chutney/lets-sing-and-dance-with-dropati.png",
    cover_url: "/images/chutney/lets-sing-and-dance-with-dropati-player-v2.png",
    sections: ["chutney", "wedding"],
    search_tags: [
      "sonay kay kharaun",
      "sone ke kherauva",
      "sone ke kharauva",
      "raja ramchandra",
      "sita",
      "ram",
      "dropati",
      "lets sing and dance with dropati",
    ],
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
  {
    slug: "karlo-nar-bahjan-dropati",
    title: "Karlo Nar Bahjan",
    order: 7.65,
    cue: "Chutney bhajan · Let's Sing & Dance with Dropati · Track 8",
    artist: "Dropati",
    audio_url:
      "/audio/chutney/lets-sing-and-dance-with-dropati/08-karlo-nar-bahjan.mp3",
    thumbnail_url: "/images/chutney/lets-sing-and-dance-with-dropati.png",
    cover_url: "/images/chutney/lets-sing-and-dance-with-dropati-player-v2.png",
    sections: ["chutney", "wedding"],
    search_tags: [
      "karlo nar bahjan",
      "bhajan",
      "dropati",
      "lets sing and dance with dropati",
    ],
    roman_lyrics: "[Album track]",
  },
  {
    slug: "sawaliya-kay-kounay-dropati",
    title: "Sawaliya Kay Kounay",
    order: 7.66,
    cue: "Let's Sing & Dance with Dropati · Track 9",
    artist: "Dropati",
    audio_url:
      "/audio/chutney/lets-sing-and-dance-with-dropati/09-sawaliya-kay-kounay.mp3",
    thumbnail_url: "/images/chutney/lets-sing-and-dance-with-dropati.png",
    cover_url: "/images/chutney/lets-sing-and-dance-with-dropati-player-v2.png",
    sections: ["chutney", "wedding"],
    search_tags: ["sawaliya", "dropati", "lets sing and dance with dropati"],
    roman_lyrics: "[Album track]",
  },
  {
    slug: "gandhi-jawahar-dropati",
    title: "Gandhi Jawahar",
    order: 7.67,
    cue: "Let's Sing & Dance with Dropati · Track 10",
    artist: "Dropati",
    audio_url:
      "/audio/chutney/lets-sing-and-dance-with-dropati/10-gandhi-jawahar.mp3",
    thumbnail_url: "/images/chutney/lets-sing-and-dance-with-dropati.png",
    cover_url: "/images/chutney/lets-sing-and-dance-with-dropati-player-v2.png",
    sections: ["chutney", "wedding"],
    search_tags: ["gandhi jawahar", "dropati", "lets sing and dance with dropati"],
    roman_lyrics: "[Album track]",
  },
  {
    slug: "samdhi-dekho-baakay-dropati",
    title: "Samdhi Dekho Baakay",
    order: 7.68,
    cue: "Wedding · Let's Sing & Dance with Dropati · Track 11",
    artist: "Dropati",
    audio_url:
      "/audio/chutney/lets-sing-and-dance-with-dropati/11-samdhi-dekho-baakay.mp3",
    thumbnail_url: "/images/chutney/lets-sing-and-dance-with-dropati.png",
    cover_url: "/images/chutney/lets-sing-and-dance-with-dropati-player-v2.png",
    sections: ["chutney", "wedding"],
    search_tags: ["samdhi", "wedding", "dropati", "lets sing and dance with dropati"],
    roman_lyrics: "[Album track]",
  },
  {
    slug: "patna-sahar-guljau-dropati",
    title: "Patna Sahar Guljau",
    order: 7.69,
    cue: "Let's Sing & Dance with Dropati · Track 12",
    artist: "Dropati",
    audio_url:
      "/audio/chutney/lets-sing-and-dance-with-dropati/12-patna-sahar-guljau.mp3",
    thumbnail_url: "/images/chutney/lets-sing-and-dance-with-dropati.png",
    cover_url: "/images/chutney/lets-sing-and-dance-with-dropati-player-v2.png",
    sections: ["chutney", "wedding"],
    search_tags: ["patna sahar", "dropati", "lets sing and dance with dropati"],
    roman_lyrics: "[Album track]",
  },
  {
    slug: "mainay-dayka-jagat-dropati",
    title: "Mainay Dayka Jagat",
    order: 7.7,
    cue: "Let's Sing & Dance with Dropati · Track 13",
    artist: "Dropati",
    audio_url:
      "/audio/chutney/lets-sing-and-dance-with-dropati/13-mainay-dayka-jagat.mp3",
    thumbnail_url: "/images/chutney/lets-sing-and-dance-with-dropati.png",
    cover_url: "/images/chutney/lets-sing-and-dance-with-dropati-player-v2.png",
    sections: ["chutney", "wedding"],
    search_tags: ["mainay dayka jagat", "dropati", "lets sing and dance with dropati"],
    roman_lyrics: "[Album track]",
  },
  {
    slug: "banaras-raja-jai-ho-dropati",
    title: "Banaras Raja Jai Ho",
    order: 7.71,
    cue: "Let's Sing & Dance with Dropati · Track 14",
    artist: "Dropati",
    audio_url:
      "/audio/chutney/lets-sing-and-dance-with-dropati/14-banaras-raja-jai-ho.mp3",
    thumbnail_url: "/images/chutney/lets-sing-and-dance-with-dropati.png",
    cover_url: "/images/chutney/lets-sing-and-dance-with-dropati-player-v2.png",
    sections: ["chutney", "wedding"],
    search_tags: ["banaras raja", "dropati", "lets sing and dance with dropati"],
    roman_lyrics: "[Album track]",
  },
  {
    slug: "paani-kay-nickalay-dropati",
    title: "Paani Kay Nickalay",
    order: 7.72,
    cue: "Let's Sing & Dance with Dropati · Track 15",
    artist: "Dropati",
    audio_url:
      "/audio/chutney/lets-sing-and-dance-with-dropati/15-paani-kay-nickalay.mp3",
    thumbnail_url: "/images/chutney/lets-sing-and-dance-with-dropati.png",
    cover_url: "/images/chutney/lets-sing-and-dance-with-dropati-player-v2.png",
    sections: ["chutney", "wedding"],
    search_tags: ["paani kay nickalay", "dropati", "lets sing and dance with dropati"],
    roman_lyrics: "[Album track]",
  },
  {
    slug: "gaya-ja-geet-milan-ke-dropati",
    title: "Gaya Ja Geet Milan Ke",
    order: 7.73,
    cue: "Let's Sing & Dance with Dropati · Track 16",
    artist: "Dropati",
    audio_url:
      "/audio/chutney/lets-sing-and-dance-with-dropati/16-gaya-ja-geet-milan-ke.mp3",
    thumbnail_url: "/images/chutney/lets-sing-and-dance-with-dropati.png",
    cover_url: "/images/chutney/lets-sing-and-dance-with-dropati-player-v2.png",
    sections: ["chutney", "wedding"],
    search_tags: [
      "gaya ja geet milan ke",
      "dropati",
      "lets sing and dance with dropati",
    ],
    roman_lyrics: "[Album track]",
  },
  {
    slug: "ya-mohammad-allah-dropati",
    title: "Ya Mohammad Allah",
    order: 7.74,
    cue: "Let's Sing & Dance with Dropati · Track 17",
    artist: "Dropati",
    audio_url:
      "/audio/chutney/lets-sing-and-dance-with-dropati/17-ya-mohammad-allah.mp3",
    thumbnail_url: "/images/chutney/lets-sing-and-dance-with-dropati.png",
    cover_url: "/images/chutney/lets-sing-and-dance-with-dropati-player-v2.png",
    sections: ["chutney", "wedding"],
    search_tags: ["ya mohammad", "allah", "dropati", "lets sing and dance with dropati"],
    roman_lyrics: "[Album track]",
  },
  {
    slug: "suhaagan-sundar-nath-dropati",
    title: "Suhaagan Sundar Nath",
    order: 7.75,
    cue: "Wedding · Let's Sing & Dance with Dropati · Track 18",
    artist: "Dropati",
    audio_url:
      "/audio/chutney/lets-sing-and-dance-with-dropati/18-suhaagan-sundar-nath.mp3",
    thumbnail_url: "/images/chutney/lets-sing-and-dance-with-dropati.png",
    cover_url: "/images/chutney/lets-sing-and-dance-with-dropati-player-v2.png",
    sections: ["chutney", "wedding"],
    search_tags: [
      "suhaagan sundar nath",
      "wedding",
      "dropati",
      "lets sing and dance with dropati",
    ],
    roman_lyrics: "[Album track]",
  },
  {
    slug: "bhaag-rahee-dropati",
    title: "Bhaag Rahee",
    order: 7.76,
    cue: "Let's Sing & Dance with Dropati · Track 19",
    artist: "Dropati",
    audio_url:
      "/audio/chutney/lets-sing-and-dance-with-dropati/19-bhaag-rahee.mp3",
    thumbnail_url: "/images/chutney/lets-sing-and-dance-with-dropati.png",
    cover_url: "/images/chutney/lets-sing-and-dance-with-dropati-player-v2.png",
    sections: ["chutney", "wedding"],
    search_tags: ["bhaag rahee", "dropati", "lets sing and dance with dropati"],
    roman_lyrics: "[Album track]",
  },
  {
    slug: "tassa-dropati",
    title: "Tassa",
    order: 7.77,
    cue: "Tassa · Let's Sing & Dance with Dropati · Track 20",
    artist: "Dropati",
    audio_url: "/audio/chutney/lets-sing-and-dance-with-dropati/20-tassa.mp3",
    thumbnail_url: "/images/chutney/lets-sing-and-dance-with-dropati.png",
    cover_url: "/images/chutney/lets-sing-and-dance-with-dropati-player-v2.png",
    sections: ["chutney", "wedding"],
    search_tags: ["tassa", "dropati", "lets sing and dance with dropati"],
    roman_lyrics: "[Album track]",
  },
  {
    slug: "karejwa-me-laage-bidjanwatie-chaitoe",
    title: "Karejwa me laage",
    order: 8,
    cue: "Traditional chutney · Baithak gana",
    artist: "Bidjwanwatie Chaitoe",
    audio_url: "/audio/chutney/karejwa-me-laage.mp3",
    thumbnail_url: "/images/chutney/karejwa-me-laage.png",
    sections: ["chutney"],
    search_tags: ["bidjwanwatie chaitoe", "bidjanwatie chaitoe", "karejwa me laage"],
    roman_lyrics: `## Verse 1

Karejwa me lagi
Karejwa me lagi
Karejwa me lagi, karejwa me lagi (2)
Tore naina ke, tore naina ke
Tore naina ke baanwa, karejwa me lagi
Tore naina ke baanwa, karejwa me lagi
Karejwa me lagi, karejwa me lagi (2)
Tore naina ke, tore naina ke
Tore naina ke baanwa, karejwa me lagi
Tore naina ke baanwa, karejwa me lagi

## Verse 2

Solah baras ki mori umariya (2)
Saiyan larawe mose najariya
Nindiya na aave mohe
Nindiya na aave more naina ke
Tore naina ke, tore naina ke
Tore naina ke baanwa, karejwa me lagi
Karejwa me lagi, karejwa me lagi (2)
Tore naina ke, tore naina ke
More naina ke baanwa, karejwa me lagi
More naina ke baanwa, karejwa me lagi

## Verse 3

Aate jaate chhede woh mohe (2)
Jhalak dekho, banwa toh sohe
Apna lage woh mohe, apna lage
More naina ke, tore naina ke
Tore naina ke, tore naina ke baanwa
Karejwa me tore naina ke baanwa, karejwa me lagi
Karejwa me lagi, karejwa me lagi (2)
Tore naina ke, tore naina ke
Tore naina ke baanwa, karejwa me lagi

## Verse 4

Khil jaaye woh toh main sharmaun (2)
Door jo jaaye, main kya karun
Jiya jalawe, mora jiya jalawe
More naina ke, tore naina ke
Tore naina ke baanwa, karejwa me lagi
Tore naina ke, tore naina ke
More naina ke baanwa, karejwa me lagi
Karejwa me lagi, karejwa me lagi (2)
Tore naina ke, tore naina ke
More naina ke baanwa, karejwa me lagi
Tore naina ke baanwa, karejwa me lagi
Karejwa me lagi, karejwa me lagi
Tore naina ke baanwa, karejwa me lagi
More naina ke baanwa, karejwa me lagi`,
    translation: `## Verse 1

It struck my heart (karejwa = the heart)
It struck my heart
It struck my heart, it struck my heart (2)
From your eyes, from your eyes
The arrow from your eyes has struck my heart
The arrow from your eyes has struck my heart
It struck my heart, it struck my heart (2)
From your eyes, from your eyes
The arrow from your eyes has struck my heart
The arrow from your eyes has struck my heart

## Verse 2

I am only sixteen years of age (2)
My beloved keeps exchanging glances with me
Sleep will not come to me
Sleep will not come to my eyes
From your eyes, from your eyes
The arrow from your eyes has struck my heart
It struck my heart, it struck my heart (2)
From your eyes, from your eyes
The arrow of those eyes has struck my heart
The arrow of those eyes has struck my heart

## Verse 3

Whenever he passes by, he teases me (2)
Just look at him — how handsome he appears
He feels like my own, he feels so close to me
My eyes, your eyes
From your eyes — from your eyes comes the arrow
The arrow from your eyes has struck my heart
It struck my heart, it struck my heart (2)
From your eyes, from your eyes
The arrow from your eyes has struck my heart

## Verse 4

When he smiles, I become shy (2)
When he goes far away, what am I to do?
He sets my heart aflame, he makes my heart burn
My eyes, your eyes
The arrow from your eyes has struck my heart
From your eyes, from your eyes
The arrow of those eyes has struck my heart
It struck my heart, it struck my heart (2)
From your eyes, from your eyes
The arrow of those eyes has struck my heart
The arrow from your eyes has struck my heart
It struck my heart, it struck my heart
The arrow from your eyes has struck my heart
The arrow of those eyes has struck my heart`,
  },
  {
    slug: "chadar-bichao-balama-babla-kanchan",
    title: "Chadar Bichao Balama",
    order: 8.5,
    cue: "Chutney · Babla & Kanchan",
    artist: "Babla & Kanchan",
    youtube_url: "https://www.youtube.com/watch?v=UhS_2Hj1Y34",
    thumbnail_url: "/images/chutney/chadar-bichao-balama-babla-kanchan.jpg",
    sections: ["chutney"],
    search_tags: [
      "chadar bichao balama",
      "chaadar bichhao balma",
      "chadar bheechawo balma",
      "chadar bheechawo balama",
      "chandariya",
      "chaundariya",
      "babla",
      "kanchan",
    ],
    roman_lyrics: `## Refrain

Chadar bichao balama
Chaundariya chadar bichao balama
Neend lage chal soye rehana

## Verse 1

Mere sasur-ji ke dui-dui mahaliya
Sab se sundar hamara mahala

## Verse 2

Mere sasur-ji ke dui-dui palangiya
Sab se sundar hamara palanga

## Verse 3

Mere sasur-ji ke dui-dui patohiya
Sab se sundar hamara balama`,
    translation: `## Refrain

Spread the sheet, my beloved
Oh beautiful one, spread the sheet, my beloved
Sleep comes — let's rest well through the night

## Verse 1

My father-in-law has two palaces
But the most beautiful is our palace

## Verse 2

My father-in-law has two beds
But the most beautiful is our bed

## Verse 3

My father-in-law has two daughters-in-law
The most beautiful one is my beloved`,
  },
  {
    slug: "chadar-bichao-balama-sundar-popo",
    title: "Chadar Bichao Balama",
    order: 8.6,
    cue: "Opening sung by Anup Jalota · then Sundar Popo · Hot & Spicy Chutneys (1980)",
    artist: "Sundar Popo · opening Anup Jalota",
    youtube_url: "https://www.youtube.com/watch?v=-9XIqpyi4yU",
    thumbnail_url: "/images/chutney/chadar-bichao-balama-sundar-popo.jpg",
    sections: ["chutney"],
    search_tags: [
      "chadar bichao balama",
      "chadar bheechawo balma",
      "chadar bheechawo balama",
      "chaadar beechawo baalma",
      "chandariya",
      "sundar popo",
      "anup jalota",
      "hot and spicy chutneys",
      "goriya maro na najariya",
    ],
    roman_lyrics: `## Opening (Anup Jalota)

Ho goriya maro na najariya
Jiyara laher loot hoi jaye

## Refrain (Sundar Popo)

Chadar bichao balama
Chaundariya chadar bichao balama
Neend lage chal soye rehana

## Verse 1

Mere sasur-ji ke dui-dui mahaliya
Sab se sundar hamara mahala

## Verse 2

Mere sasur-ji ke dui-dui palangiya
Sab se sundar hamara palanga

## Verse 3

Mere sasur-ji ke dui-dui patohiya
Sab se sundar hamara balama`,
    translation: `## Opening (Anup Jalota)

Oh fair one, don't strike with your glance
Or the heart will surge and be plundered away

## Refrain (Sundar Popo)

Spread the sheet, my beloved
Oh beautiful one, spread the sheet, my beloved
Sleep comes — let's rest well through the night

## Verse 1

My father-in-law has two palaces
But the most beautiful is our palace

## Verse 2

My father-in-law has two beds
But the most beautiful is our bed

## Verse 3

My father-in-law has two daughters-in-law
The most beautiful one is my beloved`,
  },
  {
    slug: "jing-ah-ling-rasika-dindial",

    title: "Jing ah ling",
    order: 9,
    cue: "Chutney parang · Christmas · Kazaar Chutney Music · dholak Akash Daniel",
    artist: "Rasika Dindial",
    youtube_url: "https://www.youtube.com/watch?v=qM2h0W5JY9Y",
    thumbnail_url: "/images/chutney/jing-ah-ling-rasika-dindial.png",
    sections: ["chutney"],
    roman_lyrics: `## Refrain

Jing ah ling jing ah ling jing ah ling
Jing ah ling ling ling de bell ringin
Look Santa comin

## Verse 1

Santa come home by me and he say he hungry
Santa bolē “Ham bhookh gail”
Santa come home by me and he say he hungry
Ah give him some curry and ah hot dālpurī

## Refrain

Jing ah ling jing ah ling jing ah ling
Jing ah ling ling ling de bell ringin
Look Santa eatin

## Verse 2

He say he feel dry he could do with something hard
Santa mangē dārū piye
He say he feel dry he could do with something hard
He gatkay puncheon-wa and he nearly get bad

## Refrain

Jing ah ling jing ah ling jing ah ling
Jing ah ling ling ling de bell ringin
He drinkin puncheon

## Verse 3

Santa want to dance now he tell meh “pull ah gānā”
Baila baila Santa baila
Santa want to dance now he tell meh “pull ah gānā”
Ratiyā pusur pusur batiailē dināwā kāhā gavaiyo nā

## Refrain

Jing ah ling jing ah ling jing ah ling
Jing ah ling ling ling de bell ringin
Look Santa dancin

## Verse 4

He give meh ah topī and ah tell him it too small
Arey topī bahut choti hai
He give meh ah topī and ah tell him it too small
Ah tell him what ah want and carry him in de mall

## Refrain

Jing ah ling jing ah ling jing ah ling
Jing ah ling ling ling de bell ringin
Look Santa shoppin`,
    translation: `## Refrain

Jing ah ling jing ah ling jing ah ling
Jing ah ling ling ling the bell is ringing
Look — Santa is coming

## Verse 1

Santa came to my home and said he was hungry
Santa says “I am feeling hunger”
Santa came to my home and said he was hungry
I gave him some curry and a hot dālpurī (roti)

## Refrain

Jing ah ling jing ah ling jing ah ling
Jing ah ling ling ling the bell is ringing
Look — Santa is eating

## Verse 2

He said he felt dry — he could do with something hard (a drink)
Santa wants to drink rum (dārū)
He said he felt dry — he could do with something hard (a drink)
He gulped down Puncheon rum (gatkay / gapkay) and he nearly got drunk

## Refrain

Jing ah ling jing ah ling jing ah ling
Jing ah ling ling ling the bell is ringing
He is drinking puncheon

## Verse 3

Santa wants to dance now — he tells me “pull a song” (gānā = song)
Dance dance Santa dance
Santa wants to dance now — he tells me “pull a song”
Whispering at night — where has the day been wasted?

## Refrain

Jing ah ling jing ah ling jing ah ling
Jing ah ling ling ling the bell is ringing
Look — Santa is dancing

## Verse 4

He gave me a hat (topī) and I told him it was too small
Hey the hat is too small!
He gave me a hat (topī) and I told him it was too small
I told him what I want and took him to the mall

## Refrain

Jing ah ling jing ah ling jing ah ling
Jing ah ling ling ling the bell is ringing
Look — Santa is shopping`,
  },
  {
    slug: "pong-d-damadol-rasika-dindial",
    title: "Pong D Damadol",
    order: 9.5,
    artist: "Rasika Dindial",
    youtube_url: "https://www.youtube.com/watch?v=ILxAQ4tqvlk",
    thumbnail_url: "/images/chutney/pong-d-damadol-rasika-dindial.jpg",
    sections: ["chutney"],
    search_tags: [
      "pong d damadol",
      "pound d damadol",
      "damadol",
      "tomato choka",
      "chutney soca",
      "rasika",
    ],
    roman_lyrics: `## Verse 1

Damadolwa ke choka main mange khaye

## Chorus

Pound the damadol, pound the damadol
Pound it pound it pound it, pound it in a bowl
Pound the damadol, pound the damadol
Pound it pound it pound it, pound it in a bowl

## Hook

Damadolwa ke choka
I making for my dinner
Damadolwa!
I making for my dinner

## Verse 2

I roast the damadol in the chulha, I roast the damadol...
I roast the damadol in the chulha, I have to keep turning it with a chimta

## Hook

Damadolwa ke choka
I making for my dinner
Damadolwa!
I making for my dinner

## Chorus

Pound the damadol, pound the damadol
Pound it pound it pound it, pound it in a bowl

## Verse 3

I really feel to eat it, I making a big bowl, I really feel to eat it...
I really feel to eat it, I making a big bowl, I like to eat it hot, I don't like it cold

## Hook

Damadolwa ke choka
I making for my dinner
Damadolwa!
I making for my dinner

## Chorus

Pound the damadol, pound the damadol
Pound it pound it pound it, pound it in a bowl

## Verse 4

Main banaye damadolwa ke choka
Damadolwa ke choka, damadolwa ke choka
Main banaye damadolwa ke choka

## Verse 5

I chumke the damadolwa with a little bit of tel
I chumke the damadol!
I eating it fresh, I don't want it stale

## Hook

Damadolwa ke choka
I making for my dinner

## Chorus

Pound the damadol, pound the damadol
Pound it pound it pound it, pound it in a bowl
Pound the damadol, pound the damadol
Pound it pound it pound it, pound it in a bowl`,
    translation: `## Verse 1

I ask to eat tomato (damadol) choka

## Chorus

Pound the tomato, pound the tomato
Pound it pound it pound it, pound it in a bowl
Pound the tomato, pound the tomato
Pound it pound it pound it, pound it in a bowl

## Hook

Tomato choka
I making for my dinner
Tomato!
I making for my dinner

## Verse 2

I roast the tomato in the clay stove (chulha), I roast the tomato...
I roast the tomato in the clay stove, I have to keep turning it with tongs (chimta)

## Hook

Tomato choka
I making for my dinner
Tomato!
I making for my dinner

## Chorus

Pound the tomato, pound the tomato
Pound it pound it pound it, pound it in a bowl

## Verse 3

I really feel to eat it, I making a big bowl, I really feel to eat it...
I really feel to eat it, I making a big bowl, I like to eat it hot, I don't like it cold

## Hook

Tomato choka
I making for my dinner
Tomato!
I making for my dinner

## Chorus

Pound the tomato, pound the tomato
Pound it pound it pound it, pound it in a bowl

## Verse 4

I made tomato (damadolwa) choka
Tomato choka, tomato choka
I made tomato (damadolwa) choka

## Verse 5

I briefly fry / sauté (chumke) the tomato with a little oil (tel)
I briefly fry / sauté the tomato!
I eating it fresh, I don't want it stale

## Hook

Tomato choka
I making for my dinner

## Chorus

Pound the tomato, pound the tomato
Pound it pound it pound it, pound it in a bowl
Pound the tomato, pound the tomato
Pound it pound it pound it, pound it in a bowl`,
  },
  {
    slug: "kuch-kuch-baby-babla-kanchan",
    title: "Kuch Kuch Baby",
    order: 10,
    cue: "Bollyney · 1985 · remake of Merchant’s Rock It",
    artist: "Babla & Kanchan",
    audio_url: "/audio/chutney/kuch-kuch-baby-babla-kanchan.mp3",
    thumbnail_url: "/images/chutney/kuch-kuch-baby-babla-kanchan.jpg",
    sections: ["chutney"],
    search_tags: [
      "kuch kuch baby",
      "kuchh kuchh baby",
      "bollyney",
      "merchant",
      "rock it",
      "kanchan",
    ],
    roman_lyrics: `## Verse 1

Ek party mein ladki aayi
Uska naam tha yeh kuch kuch baby
Oh naache oh gaaye

## Verse 2

Logo ne jab dekha uska chandsa chehra
Lagti thi vo pyaari har dil ka laga pahara
Vo cutie thi vo cutie thi ho gaye sab deewane

## Verse 3

Mathe pe bindiya bhi haatho mein bhi bangal
Usne pahenke sari lagti thi vo Hindi aati
Koi kahe: “Hi Darling? How you look so charming? Dekho jaldi na jaana. Gao tumko hi gaana.”

## Verse 4

Khushiyo ki yeh mehfil khushiyo ki sab baate
Mehke mehke din vo behke behke raate`,
    translation: `## Verse 1

A girl came to the party
Her name was something something baby
Oh dance oh sing

## Verse 2

When people saw her moonlike face
She looked so pretty every heart was guarded
She was so cute she was cute everyone went crazy

## Verse 3

Bindi on her forehead and bangles on her hands
She wears a sari and looks like she knows Hindi
Someone said: “Hi darling! How do you look so charming? Look do not leave so quickly. Sing, you alone must sing.”

## Verse 4

The gathering and words were of happiness
Fragrant the days and enchanted the nights`,
  },
  {
    slug: "royee-royee-akhiya-rakesh-yankaran",
    title: "Royee Royee Akhiya",
    order: 11,
    cue: "Classic chutney · Rakesh Yankaran",
    artist: "Rakesh Yankaran",
    audio_url: "/audio/chutney/royee-royee-akhiya-rakesh-yankaran.mp3",
    thumbnail_url: "/images/chutney/royee-royee-akhiya-rakesh-yankaran.png",
    sections: ["chutney"],
    search_tags: [
      "royee royee akhiya",
      "royi royi akhiya",
      "roye roye",
      "yankaran",
    ],
    roman_lyrics: `## Chorus

Royi royi akhiya royi royi akhiya
Dhana royi royi dhana royi royi
Laal bhaaye dhana royi royi akhiya

## Verse 1

Hamare sajaniya dur basate hai
Raste chalat pav pirate hai

## Verse 2

Deen diwas ke kabhi na aaye
Deen diwas ke kuch bhi na khaaye
Na sandesa kuch baat bataaye

## Verse 3

Aasu pipi pyaasa bhoojhaawo
Sajan bina main marjaawo

## Verse 4

Rowat rowat rasta na dekha
Balam ke kaaran main hoon dekha`,
    translation: `## Chorus

Crying crying eyes, crying crying eyes
The young girl is crying and crying
Her eyes have become red from crying and crying

## Verse 1

My beloved resides far far away
From walking on the road my feet are paining

## Verse 2

All day no one has come back
All day I have not eaten anything
No message has come with news

## Verse 3

Quench this thirst drinking my tears
Without my beloved I will pass away

## Verse 4

Crying and crying I cannot see the road
I only see in my husband’s lighting`,
  },
  {
    slug: "na-manu-na-manu-bidjanwatie-chaitoe",
    title: "Na Manu Na Manu",
    order: 12,
    cue: "Traditional chutney · Baithak gana",
    artist: "Bidjwanwatie Chaitoe",
    youtube_url: "https://www.youtube.com/watch?v=E7Llz4FKyJE",
    thumbnail_url: "/images/chutney/na-manu-na-manu-bidjanwatie-chaitoe.jpg",
    sections: ["chutney"],
    search_tags: ["na manu", "na manu na manu", "dagabaaj", "bidjwanwatie", "bidjanwatie"],
    roman_lyrics: `## Chorus

Na manu na manu na manu
Dagabaaj tori batiya na manu

## Verse 1

Raate kahe balama raate kahe balama
Jhulani paisai debe
Hota savere bisar chalela

## Chorus

Na manu na manu na manu
Dagabaaj tori batiya na manu

## Verse 2

Raate kahe balama raate kahe balama
Chunari paisai debe
Hota savere bisar chalela

## Chorus

Na manu na manu na manu
Dagabaaj tori batiya na manu

## Verse 3

Raate kahe balama raate kahe balama
Kangana paisai debe
Hota savere bisar chalela

## Chorus

Na manu na manu na manu
Dagabaaj tori batiya na manu`,
    translation: `## Chorus

I will not believe, I will not believe
Oh deceiver, I will not believe your words

## Verse 1

At night my lover says, at night my lover says
He will give me money for a nose-ring
Morning comes and it will be forgotten

## Chorus

I will not believe, I will not believe
Oh deceiver, I will not believe your words

## Verse 2

At night my lover says, at night my lover says
He will give me money for a veil
Morning comes and it will be forgotten

## Chorus

I will not believe, I will not believe
Oh deceiver, I will not believe your words

## Verse 3

At night my lover says, at night my lover says
He will give me money for a bracelet
Morning comes and it will be forgotten

## Chorus

I will not believe, I will not believe
Oh deceiver, I will not believe your words`,
  },
  {
    slug: "chalbo-ke-nahin-sundar-popo",
    title: "Chalbo Ke Nahin",
    order: 13,
    cue: "Classic chutney · Dance Party King",
    artist: "Sundar Popo",
    audio_url: "/audio/chutney/chalbo-ke-nahin-sundar-popo.mp3",
    thumbnail_url: "/images/chutney/chalbo-ke-nahin-sundar-popo.jpg",
    sections: ["chutney"],
    search_tags: [
      "chalbo ke nahin",
      "chalbo ki nahi",
      "chalbo kihahi",
      "sundar popo",
    ],
    roman_lyrics: `## Chorus

Chalbo ki nahi tu na chalbo ki nahi
Hamar sange tu na chalbo ki nahi

## Verse 1

Hamre village mein kohara bahut hain
Ham turab tu na bhejbe ki nahi

## Chorus

Chalbo ki nahi tu na chalbo ki nahi
Hamar sange tu na chalbo ki nahi

## Verse 2

Hamre village mein bodi bahut hain
Ham turab tu na bhejbe ki nahi

## Chorus

Chalbo ki nahi tu na chalbo ki nahi
Hamar sange tu na chalbo ki nahi

## Verse 3

Hamre village mein okro bahut hain
Ham turab tu na bhejbe ki nahi

## Chorus

Chalbo ki nahi tu na chalbo ki nahi
Hamar sange tu na chalbo ki nahi

## Verse 4

Hamre village mein baigan bahut hain
Ham turab tu na bhejbe ki nahi`,
    translation: `## Chorus

Will you come or not, will you come or not?
Will you come with me or not?

## Verse 1

In my village there is plenty of pumpkin
I will pick/harvest it, will you send/ship it or not?

## Chorus

Will you come or not, will you come or not?
Will you come with me or not?

## Verse 2

In my village there is plenty of long beans
I will pick/harvest it, will you send/ship it or not?

## Chorus

Will you come or not, will you come or not?
Will you come with me or not?

## Verse 3

In my village there is plenty of okra
I will pick/harvest it, will you send/ship it or not?

## Chorus

Will you come or not, will you come or not?
Will you come with me or not?

## Verse 4

In my village there is plenty of eggplant
I will pick/harvest it, will you send/ship it or not?`,
  },
  {
    slug: "nanda-baba-anand-yankaran",
    title: "Nanda Baba",
    order: 14,
    cue: "Chutney bhajan · Anand Yankaran",
    artist: "Anand Yankaran",
    audio_url: "/audio/folders/chutney-style-bhajan/nanda-baba-anand-yankaran.mp3",
    thumbnail_url: "/images/nanda-baba-anand-yankaran.jpg",
    sections: ["chutney"],
    search_tags: [
      "nanda baba",
      "kanhaiya",
      "nanda baba ji ko chhaiya",
      "yankaran",
    ],
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
  {
    slug: "kahawa-se-aayo-bhagwane-xstatixz",
    title: "Kahwase Aye",
    order: 14.5,
    cue: "Remix · Chutney bhajan · Ashine",
    artist: "Ashine",
    audio_url:
      "/audio/folders/chutney-style-bhajan/kahawa-se-aayo-bhagwane-xstatixz.mp3",
    thumbnail_url: "/images/kahwase-aye-xstatixz-thumb.png",
    sections: ["chutney"],
    search_tags: [
      "kahava se aaye",
      "kahawa se aayo",
      "kahwase aye",
      "kahawa se aaye kanhaiya",
      "sukhi ke lale",
      "shiv shankar",
      "mahadev",
      "ashine",
      "remix",
      "party mix",
    ],
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
Are godiya khilave teeno maiya, bari anantavat ho`,
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
Hey — the three mothers are very happy to play with him in their lap`,
  },
  {
    slug: "oh-maninga-babla-kanchan",
    title: "Oh Maninga",
    order: 15,
    cue: "Chutney · Rohit Jagessar Productions",
    artist: "Babla & Kanchan",
    youtube_url: "https://www.youtube.com/watch?v=yNrWXQppGeI",
    thumbnail_url: "/images/chutney/oh-maninga-babla-kanchan.jpg",
    sections: ["chutney"],
    search_tags: [
      "oh maninga",
      "o maninga",
      "maninga",
      "manjha",
      "cane ah cut",
      "babla",
      "kanchan",
      "rohit jagessar",
    ],
    roman_lyrics: `## Chorus

Oh maninga, oh maninga
Cane ah cut an price nah pay at all
Rice an flour dare ah shop, why you mean not da?
People people come lewwe go
Pick up yuh saucepan an cutlass an hoe

## Verse 1

Me wuk hard in de backdam til me hand get ah corn
When me get ah money he gone in de pan
Ker away me na raja me nah go stan no more

## Verse 2

De manjha left de estate he went an go away
When me fadda hear dat he cry every day
De manjha gan away de polis take over
While he was away me go hide all over
Ker away me na raja me nah go stan no more`,
    translation: `## Chorus

Oh manager, oh manager
I cut sugarcane and it does not pay at all
Rice and flour are there in the shop — why do you mean not that?
People, people, come let us go
Pick up your saucepan, cutlass, and hoe

## Verse 1

I work hard in the backdam (estate) until my hand gets a callus (corn)
When I get some money it goes away in the pan
Carry me away, king — I cannot stand it anymore

## Verse 2

The manager left the estate and went away
When my father heard that he cried every day
The manager went away and the police took over
While he was away I went and hid all over
Carry me away, king — I cannot stand it anymore`,
  },
  {
    slug: "leggo-me-na-raja-babla-kanchan",
    title: "Leggo Me Na Raja",
    order: 16,
    cue: "Chutney · well-known cover · Rohit Jagessar Productions",
    artist: "Babla & Kanchan",
    youtube_url: "https://www.youtube.com/watch?v=92n6zw6VAgc",
    thumbnail_url: "/images/chutney/leggo-me-na-raja-babla-kanchan.jpg",
    sections: ["chutney"],
    search_tags: [
      "leggo me na raja",
      "let go me na raja",
      "lego me na raja",
      "babla",
      "kanchan",
      "rohit jagessar",
    ],
    roman_lyrics: `## Chorus

Leggo me na raja, leggo me leh me go
Me na want me husband and family to know

## Verse 1

You fall from ah tree boy, you fall from above
Try and fall in anything but don't fall in love

## Chorus

Leggo me na raja, leggo me leh me go
Me na want me husband and family to know

## Verse 2

Roses are red my love and violets are blue
Sugar is sweet my love but not sweeter than you

## Chorus

Leggo me na raja, leggo me leh me go
Me na want me husband and family to know

## Verse 3

Love is ah thing boy no one should complain
It same go fuh others, it same go fuh me`,
    translation: `## Chorus

Let me go, king — let me go, let me leave
I don't want my husband and family to know

## Verse 1

You fall from a tree, boy — you fall from above
Try and fall into anything, but don't fall in love

## Chorus

Let me go, king — let me go, let me leave
I don't want my husband and family to know

## Verse 2

Roses are red my love and violets are blue
Sugar is sweet my love but not sweeter than you

## Chorus

Let me go, king — let me go, let me leave
I don't want my husband and family to know

## Verse 3

Love is a thing, boy — no one should complain
It goes the same for others, it goes the same for me`,
  },
  {
    slug: "leggo-me-na-raja-halima-bissoon",
    title: "Leggo Me Na Raja",
    order: 16.5,
    cue: "Original Guyana local · ~1973–1975",
    artist: "Halima Bissoon",
    youtube_url: "https://www.youtube.com/watch?v=r163hhOeJfc",
    thumbnail_url: "/images/chutney/leggo-me-na-raja-halima-bissoon.jpg",
    sections: ["chutney"],
    search_tags: [
      "leggo me na raja",
      "let go me na raja",
      "lego me na raja",
      "halima bissoon",
      "guyana",
      "original",
    ],
    roman_lyrics: `## Chorus

Leggo me na raja, leggo me leh me go
Me na want me husband and family to know

## Verse 1

You fall from ah tree boy, you fall from above
Try and fall in anything but don't fall in love

## Chorus

Leggo me na raja, leggo me leh me go
Me na want me husband and family to know

## Verse 2

Roses are red my love and violets are blue
Sugar is sweet my love but not sweeter than you

## Chorus

Leggo me na raja, leggo me leh me go
Me na want me husband and family to know

## Verse 3

Love is ah thing boy no one should complain
It same go fuh others, it same go fuh me`,
    translation: `## Chorus

Let me go, king — let me go, let me leave
I don't want my husband and family to know

## Verse 1

You fall from a tree, boy — you fall from above
Try and fall into anything, but don't fall in love

## Chorus

Let me go, king — let me go, let me leave
I don't want my husband and family to know

## Verse 2

Roses are red my love and violets are blue
Sugar is sweet my love but not sweeter than you

## Chorus

Let me go, king — let me go, let me leave
I don't want my husband and family to know

## Verse 3

Love is a thing, boy — no one should complain
It goes the same for others, it goes the same for me`,
  },
  {
    slug: "police-wala-kanchan",
    title: "Police Wala",
    order: 17,
    cue: "Chutney · Babla & Kanchan",
    artist: "Babla & Kanchan",
    youtube_url: "https://www.youtube.com/watch?v=fDSLvEyNMFQ",
    thumbnail_url: "/images/chutney/police-wala-kanchan.jpg",
    sections: ["chutney"],
    search_tags: [
      "police wala",
      "policewala",
      "dil ki chori",
      "kanchan",
      "babla",
    ],
    roman_lyrics: `## Chorus

Mere dil ki chori karke, vo bhaaga bhaaga
Vo police wala, tum toh zara police wala

## Verse 1

Solah baras mein kam, ek din ta bhi
Main kamseen thi, aa gaya mor kabhi

## Verse 2

Dil ki chori karke, chup gaya darti mein
Kismat uski dekho, haan vo arti mein

## Verse 3

Police mein dil liya, sab ko pata challa
Complaint kaise karu, khud hi vo chor hai`,
    translation: `## Chorus

After stealing my heart, he ran far away
That policeman — you are that policeman

## Verse 1

In less than sixteen years, there was not even one day
I was young and innocent — he never came back to me

## Verse 2

After my heart was stolen, I stayed quiet out of fear
Look at her fate — yes, she is in distress

## Verse 3

I took my heart to the police — everyone found out
How can I complain — the policeman himself is the thief`,
  },
  {
    slug: "kaise-bani-sundar-popo",
    title: "Kaise Bani",
    order: 18,
    cue: "Classic chutney · Pholourie bina chutney",
    artist: "Sundar Popo",
    audio_url: "/audio/chutney/kaise-bani-sundar-popo.mp3",
    youtube_url: "https://www.youtube.com/watch?v=GnMSmWgoupc",
    thumbnail_url: "/images/chutney/kaise-bani-sundar-popo.jpg",
    sections: ["chutney"],
    search_tags: [
      "kaise bani",
      "pholourie bina chutney",
      "pholourie",
      "phulauri",
      "sangre grande",
      "lal bihari",
      "sundar popo",
    ],
    roman_lyrics: `## Chorus

Kaise bani, kaise bani?
Pholourie bina chutney kaise bani?

## Verse 1

I went Sangre Grande to meet Lal Bihari
I pulled out my khudari and shaved out his dari

## Verse 2

Me and my darling were flying in a plane
The plane caught on fire and we fell inside the cane

## Verse 3

I am beating my drum and singing my song
The only thing I am missing is my bottle of rum

## Verse 4

Jack and Jill went up the hill to fetch a pail of water
Jack fell down and broke his crown and Jill came tumbling after

## Verse 5

Little Jack Horner sit in a corner eating his Christmas pie
He put in his thumb and pulled out a plum and said: "What a good boy am I?"`,
    translation: `## Chorus

How is it made, how is it made?
How do you make pholourie without chutney?

## Verse 1

I went to Sangre Grande to meet Lal Bihari
I pulled out my khudari (hoe) and shaved off his dari (beard)

## Verse 2

Me and my darling were flying in a plane
The plane caught on fire and we fell inside the cane

## Verse 3

I am beating my drum and singing my song
The only thing I am missing is my bottle of rum

## Verse 4

Jack and Jill went up the hill to fetch a pail (bucket) of water
Jack fell down and broke his crown and Jill came tumbling after

## Verse 5

Little Jack Horner sat in a corner eating his Christmas pie
He put in his thumb and pulled out a plum and said: "What a good boy am I?"`,
  },
  {
    slug: "nana-nani-sundar-popo",
    title: "Nana Nani",
    order: 19,
    cue: "Classic chutney · Nana & Nani",
    artist: "Sundar Popo",
    audio_url: "/audio/chutney/nana-nani-sundar-popo.mp3",
    audio_versions: [
      {
        id: "upbeat",
        label: "Upbeat / party",
        cue: "Longer · faster · default for Play all",
        audio_url: "/audio/chutney/nana-nani-sundar-popo.mp3",
        default_for_queue: true,
      },
      {
        id: "slow",
        label: "Slower / sadder",
        cue: "Dance with the Champ · pick to play",
        audio_url: "/audio/chutney/nana-nani-sundar-popo-slow.mp3",
      },
    ],
    thumbnail_url: "/images/chutney/nana-nani-sundar-popo.jpg",
    sections: ["chutney"],
    search_tags: [
      "nana nani",
      "nana & nani",
      "nana and nani",
      "puncheon",
      "madeira",
      "sundar popo",
    ],
    roman_lyrics: `## Verse 1

Nana-Nani ghar se nikle
Dheere dheere chalte hai
Madeira ke dukan mein
Dono jake baithay hain

## Verse 2

Nana keene Puncheon daru
Ujjar jaise pani
Charlie's wine aur Gilbey wine
Khareede meri Nani

## Chorus

Agay-agay Nana chale
Nani going behind
Nana drinkin white one and Nani drinkin wine

## Verse 3

Nana ridin bicycle and Nani ringin bell
Nani lock di handle dey fall inside ah well
Meh Nana so damn careless he doh care if Nani drown
And he jump in di bank boy he hold on to white one

## Verse 4

Nana smoking tobacco and Nani cigarette
The rain did started falling di both ah dem get wet
Meh Nani tell meh Nana ole man ah feelin cold
Give meh some white one to warm up meh soul

## Chorus

Agay-agay Nana chale
Nani going behind
Nana drinkin white one and Nani drinkin wine

## Verse 5

Nana and meh Nani dey went to tie ah goat
Meh Nana make ah mistake and cut meh Nani's throat
Di police hold meh Nana he couldn't get no bail
Dey took di poor old man and throw him in di jail

## Chorus

Agay-agay Nana chale
Nani going behind
Nana drinkin white one and Nani drinkin wine

## Verse 6

When I get di message I fall down in ah drain
For I know I haven't got no Nani again
Nani dead and gone, meh Nana gone to hang
So I have to get one for my companion`,
    translation: `## Verse 1

Grandparents (Nana-Nani) left home
They are going slowly
In the Madeira (rum) shop
They both went and sat

## Verse 2

Grandpa bought Puncheon rum
Clear like white water
Charlie's wine and Gilbey wine
My grandmother bought

## Chorus

Grandpa goes in front
Nani going behind
Nana drinking white rum and Nani drinking wine

## Verse 3

Nana riding bicycle and Nani ringing the bell
Nani locked the handle — they fall inside a well
My Nana is so careless he doesn't care if Nani drowns
And he jumps on the bank — boy, he holds on to the white rum

## Verse 4

Nana smoking tobacco and Nani cigarette
The rain started falling — both of them got wet
My Nani tells my Nana: old man, I'm feeling cold
Give me some white rum to warm up my soul

## Chorus

Grandpa goes in front
Nani going behind
Nana drinking white rum and Nani drinking wine

## Verse 5

Nana and my Nani went to tie a goat
My Nana made a mistake and cut my Nani's throat
The police held my Nana — he couldn't get no bail
They took the poor old man and threw him in the jail

## Chorus

Grandpa goes in front
Nani going behind
Nana drinking white rum and Nani drinking wine

## Verse 6

When I got the message I fell down in a drain
For I know I haven't got no Nani again
Nani dead and gone, my Nana gone to hang
So I have to get one for my companion`,
  },
  {
    slug: "bombay-ke-dulahin-suresh-maharaj",
    title: "Bombay Ke Dulahin",
    order: 20,
    cue: "Chutney · 2023",
    artist: "Suresh Maharaj",
    youtube_url: "https://www.youtube.com/watch?v=lPD-4VkQnTU",
    thumbnail_url: "/images/chutney/bombay-ke-dulahin-suresh-maharaj.jpg",
    sections: ["chutney"],
    search_tags: [
      "bombay ke dulahin",
      "mumbai ke dulahin",
      "dulahin",
      "dulaha",
      "suresh maharaj",
      "trinidad",
    ],
    roman_lyrics: `## Chorus

Arey Bombay ke dulahin, come to Trinidad
I want to be your dulaha
Bombay ke dulahin aaya re, Bombay ke dulahin aaya re

## Verse 1

In this land of mine gyal, we come from your line
I ask you for a kiss gyal, you tell me "never mind"

## Chorus

Arey Bombay ke dulahin, come to Trinidad
I want to be your dulaha

## Verse 2

You fall in a river, there is no boat
You fall in a well gyal, there is no rope
When you fall in love gyal, there is no hope

## Chorus

Arey Bombay ke dulahin, come to Trinidad
I want to be your dulaha

## Verse 3

I think of you often, I think of you a lot
Letters are the best way for us to keep in touch

## Chorus

Arey Bombay ke dulahin, come to Trinidad
I want to be your dulaha
Bombay ke dulahin aaya re, Bombay ke dulahin aaya re

## Verse 4

Apples grow in England, they grow in Canada too
It will take a place like Trinidad to grow a plum like you

## Chorus

Arey Bombay ke dulahin, come to Trinidad
I want to be your dulaha`,
    translation: `## Chorus

Hey, bride from Bombay — come to Trinidad
I want to be your groom (dulaha)
The bride from Bombay has come, the bride from Bombay has come

## Verse 1

In this land of mine, girl, we come from your line
I ask you for a kiss, girl — you tell me "never mind"

## Chorus

Hey, bride from Bombay — come to Trinidad
I want to be your groom

## Verse 2

You fall in a river, there is no boat
You fall in a well, girl — there is no rope
When you fall in love, girl — there is no hope

## Chorus

Hey, bride from Bombay — come to Trinidad
I want to be your groom

## Verse 3

I think of you often, I think of you a lot
Letters are the best way for us to keep in touch

## Chorus

Hey, bride from Bombay — come to Trinidad
I want to be your groom
The bride from Bombay has come, the bride from Bombay has come

  ## Verse 4

  Apples grow in England, they grow in Canada too
  It will take a place like Trinidad to grow a plum like you

  ## Chorus

  Hey, bride from Bombay — come to Trinidad
  I want to be your groom`,
  },
  {
    slug: "gularie-kay-phool-rasika-dindial",
    title: "Gularie Kay Phool",
    order: 21,
    cue: "Traditional Chutney",
    artist: "Rasika Dindial",
    youtube_url: "https://www.youtube.com/watch?v=6RrEgcbS8c4",
    thumbnail_url: "/images/chutney/gularie-kay-phool-rasika-dindial.jpg",
    cover_url: "/images/chutney/gularie-kay-phool-rasika-dindial-cover.jpg",
    sections: ["chutney"],
    search_tags: [
      "gularie kay phool",
      "gulari ke phool",
      "goolari ke phool",
      "rasika dindial",
      "d rani",
      "chutney",
      "trinidad",
      "bhojpuri",
    ],
    roman_lyrics: `## Refrain

Gūlarī ke phūl Rāmā, gūlarī ke phūl
Khetwā mė jhūle ho lahariyā, balam
Hoige gūlarī ke phūl

## Verse 1

Balwā mė gajarā sobhe, ankhiyā mė kajarā
Māthe sobhe re ṭikuliyā, balam
Khetwā mė jhūle ho lahariyā, balam
Hoige gūlarī ke phūl

## Verse 2

Tohare balam bairī devar laharī
Bichwā mė laṛ gai najariyā, balam
Khetwā mė jhūle ho lahariyā, balam
Hoige gūlarī ke phūl

## Verse 3

Goṛe mė pāyal bāje hāthon mė kanganā
Chānd se chamke jawaniyā, balam
Khetwā mė jhūle ho lahariyā, balam
Hoige gūlarī ke phūl`,
    translation: `## Refrain

The Gulari flower, O Lord Rama, the rare Gulari flower!
In the fields, my beloved, the crops rock and sway in the breeze,
Has my love blossomed like the elusive Gulari flower?

## Verse 1

My hair is decorated with fragrant flower garlands, and dark kohl beautifies my eyes,
A shimmering bindi adorns my forehead, my beloved...
In the fields, the waves sway to and fro in the wind,
Has my love blossomed like the rare Gulari flower?

## Verse 2

My handsome beloved has turned distant, while my playful brother-in-law is enticed,
Right in the middle of the field, our gazes met, my beloved...
In the fields, the waves sway to and fro in the wind,
Has my love blossomed like the rare Gulari flower?

## Verse 3

Anklets chime on my feet and bangles ring upon my hands,
My youth shines as radiantly as the moon, my beloved...
In the fields, the waves sway to and fro in the wind,
Has my love blossomed like the rare Gulari flower?`,
  },
  {
    slug: "lotela-sonny-mann",
    title: "Lotela",
    order: 22,
    cue: "Lootala · Tum Lotela",
    artist: "Sonny Mann",
    youtube_url: "https://www.youtube.com/watch?v=qW10IHBjCkU",
    thumbnail_url: "/images/chutney/lotela-sonny-mann.jpg",
    cover_url: "/images/chutney/lotela-sonny-mann-cover.jpg",
    sections: ["chutney"],
    search_tags: [
      "lotela",
      "lootala",
      "tum lotela",
      "bhauji",
      "bhaiya",
      "sonny mann",
      "trinidad",
      "bhojpuri",
    ],
    about:
      "A comic Indo-Caribbean chutney about bhauji (sister-in-law) rolling about after rum, dodging work, dancing at a baraat, and quarrelling with bhaiya — Sonny Mann’s Lootala.",
    roman_lyrics: `## Refrain

Lotela, tum lotela

## Verse 1

Lotay bhauji, lotay, tum lotela

## Verse 2

Bhauji leke saboon, tum nahaela

## Verse 3

Daru piye lagle bhauji tum lotela

## Verse 4

Bhaiya leke gari tum kaam karela

## Verse 5

Bhauji na jaane kam kare, tum sootela

## Verse 6

Bhai aur bhauji baraat mein gaile

## Verse 7

Tassa bajawe bhauji tum nachela

## Verse 8

Hamare bhauji tum dabela

## Verse 9

Hamare bhaiya na samjela

## Verse 10

Bhauji bole bhaiya gaddha na samjela

## Verse 11

Bhaiya leke lathi bhauji tum marela`,
    translation: `## Refrain

Rolling, rolling all about

## Verse 1

Roll sister-in-law, roll, rolling all about

## Verse 2

Sister-in-law takes soap and is bathing plenty

## Verse 3

Sister-in-law drank rum and starts rolling all about

## Verse 4

My big brother takes the car and works plenty

## Verse 5

Sister-in-law does not know how to work, she is sleeping plenty

## Verse 6

My brother and sister-in-law went in a wedding procession

## Verse 7

Tassa plays and sister-in-law dances plenty

## Verse 8

My sister-in-law is nagging plenty

## Verse 9

My big brother is not understanding

## Verse 10

Sister-in-law said big brother is a jackass, he is not understanding

## Verse 11

Big brother takes a stick and beats sister-in-law plenty`,
  },
  {
    slug: "payaliya-devanand-gattoo",
    title: "Payaliya",
    order: 23,
    cue: "Chutney Soca Monarch 1999 · Tassa Mix",
    artist: "Devanand Gattoo",
    audio_url: "/audio/chutney/payaliya-devanand-gattoo.mp3",
    thumbnail_url: "/images/chutney/payaliya-devanand-gattoo.jpg",
    cover_url: "/images/chutney/payaliya-devanand-gattoo-cover.jpg",
    sections: ["chutney", "wedding"],
    search_tags: [
      "payaliya",
      "payalia",
      "cham cham",
      "tassa mix",
      "devanand gattoo",
      "chutney soca monarch",
      "1999",
      "nanadiya",
      "gajra",
      "kangana",
      "chunari",
      "bindiya",
      "trinidad",
      "wedding",
    ],
    about:
      "Devanand Gattoo’s Payaliya (1999) — the ultimate chutney. Debuted at Chutney Soca Monarch with no religious theme or social commentary, just pure dance. The lyrics celebrate a nanadiya (sister-in-law, or a beautiful young woman) in wedding finery: bindi, gajra, kangana, and chunari — and the jingling payaliya (anklets). Translation adapted from Vinay Harrichan / Caribbean Hindustani.",
    roman_lyrics: `## Refrain

Payaliya payaliya payaliya re
Payaliya payaliya baje
Chuma chuma chuma re
Payaliya, ai payaliya, oh payaliya
Chuma chuma chuma re

## Verse 1

Bindiya pehenke aaye nanadiya
Lage nanadiya nache re

## Verse 2

Gajra pehenke aaye nanadiya
Lage nanadiya nache re

## Verse 3

Kangana pehenke aaye nanadiya
Lage nanadiya nache re

## Verse 4

Chunari pehenke aaye nanadiya
Lage nanadiya nache re`,
    translation: `## Refrain

The anklets, oh the anklets, oh the anklets
The anklets are making noise
Jingling and making kissing sounds
The anklets, oh the anklets, oh the anklets
Jingling and making kissing sounds

## Verse 1

Sister-in-law came wearing a bindi
And began to dance

## Verse 2

Sister-in-law came wearing a floral band
And began to dance

## Verse 3

Sister-in-law came wearing a bracelet
And began to dance

## Verse 4

Sister-in-law came wearing a veil
And began to dance`,
  },
  {
    slug: "bachpan-ki-mohabbat-rakesh-yankaran",
    title: "Bachpan Ki Mohabbat Ko",
    order: 24,
    cue: "Remix · Bachupan Kay Mohobat",
    artist: "Rakesh Yankaran",
    youtube_url: "https://www.youtube.com/watch?v=MoMWWMFYQkw",
    thumbnail_url: "/images/chutney/bachpan-ki-mohabbat-rakesh-yankaran.jpg",
    sections: ["chutney"],
    search_tags: [
      "bachpan ki mohabbat",
      "bachupan kay mohobat",
      "bachpan",
      "mohabbat",
      "rakesh yankaran",
      "yankaran",
      "remix",
    ],
    about:
      "Rakesh Yankaran remix — Bachupan Kay Mohobat. Don’t separate childhood love from the heart; when memory comes, pray that we meet again. Chutney only.",
    roman_lyrics: `## Chorus

Bachpan ki mohabbat ko, dil say na juda karna
Bachpan ki mohabbat ko, dil say na juda karna
Jab yaad mayree aaye, milnay ki dua karna
Bachpan ki mohabbat ko, dil say na juda karna
Jab yaad mayree aaye, milnay ki dua karna

## Verse 1

Ghar mayray umeedon ka, soona kee yay jaatay ho
Ho ji ho oh oh oh oh…
Duniya hi mohabbat kee, lootay liyay jaatay ho
Joh gham diye jaate ho, us gham ki dawa karna
Bachpan ki mohabbat ko, dil say na juda karna
Jab yaad mayree aaye, milnay ki dua karna

## Verse 2

Saawan mein puppyhay kaaaa, sangeet chura ungi
Ho ji ho oh oh oh oh…
Fariyad tumhe apniiii, gaa gaake suna ungi
Aawaz mayree sunikay, dil thaam liya karna
Bachpan ki mohabbat ko, dil say na juda karna
Jab yaad mayree aaye, milnay ki dua karna`,
    translation: `## Chorus

Don’t separate the love of our childhood from your heart
Don’t separate the love of our childhood from your heart
When you remember me, just pray that we meet
Don’t separate the love of our childhood from your heart
When you remember me, just pray that we meet

## Verse 1

You’re making the house of my hopes lonely
Ho ji ho oh oh oh oh…
You’re stealing the world of my love
For the sorrows you give, give the medicine for that sorrow
Don’t separate the love of our childhood from your heart
When you remember me, just pray that we meet

## Verse 2

I’ll steal the songs of the monsoon birds
Ho ji ho oh oh oh oh…
I’ll sing my plea to you again and again
When you hear my voice, hold on to your heart
Don’t separate the love of our childhood from your heart
When you remember me, just pray that we meet`,
  },
  {
    slug: "phoolabasiya-sundar-popo",
    title: "Phoolabasiya",
    order: 25,
    cue: "Classic chutney · Sundar Soca · Sundar Popo",
    about:
      "Phūlbasiyā is a name given to a woman in whom resides the essence of a flower. In Sundar Popo’s song, one such lady is the object of his desire and he invites her to see the Indian Cultural Pageant.",
    artist: "Sundar Popo",
    audio_url: "/audio/chutney/phoolabasiya-sundar-popo.mp3",
    thumbnail_url: "/images/chutney/phoolabasiya-sundar-popo-player.jpg",
    cover_url: "/images/chutney/phoolabasiya-sundar-popo-player.jpg",
    sections: ["chutney"],
    search_tags: [
      "phoolabasiya",
      "he phool basia",
      "he phoolbesia",
      "phoolbesia",
      "phoolbasia",
      "phool basia",
      "sundar soca",
      "sundar popo",
      "sunder popo",
    ],
    roman_lyrics: `## Chorus

He Phoolabasiya, bahare bhare angna
Hum tum chalenge, baja pasana
He Phoolabasiya, bahare bhare angna
Hum tum chalenge, baja pasana

## Verse 1

Bartan majo, hariya majo, bharte ho paniya
Bhojan banaye, chale baja pasana
Bartan majo, hariya majo, bharte ho paniya
Bhojan banaye, chale baja pasana

## Chorus

He Phoolabasiya, bahare bhare angna
Hum tum chalenge, baja pasana
He Phoolabasiya, bahare bhare angna
Hum tum chalenge, baja pasana

## Verse 2

Bhajan bhi, tassa bajé, ghungroo ke gana
Hindu, Muslim aur Isaai — Chin pe tu jana
Bhajan bhi, tassa bajé, ghungroo ke gana
Hindu, Muslim aur Isaai — Chin pe tu jana

## Chorus

He Phoolabasiya, bahare bhare angna
Hum tum chalenge, baja pasana
He Phoolabasiya, bahare bhare angna
Hum tum chalenge, baja pasana`,
    translation: `## Chorus

O Phoolabasiya — the courtyard is full of spring flowers
You and I will go play the drums
O Phoolabasiya — the courtyard is full of spring flowers
You and I will go play the drums

## Verse 1

Scrub the pots, scrub the greens, fill them with water
Cook the meal, then go play the drums
Scrub the pots, scrub the greens, fill them with water
Cook the meal, then go play the drums

## Chorus

O Phoolabasiya — the courtyard is full of spring flowers
You and I will go play the drums
O Phoolabasiya — the courtyard is full of spring flowers
You and I will go play the drums

## Verse 2

Bhajans too, tassa drums playing, songs of the ghungroo (ankle bells)
Hindu, Muslim and Christian — go even as far as China
Bhajans too, tassa drums playing, songs of the ghungroo (ankle bells)
Hindu, Muslim and Christian — go even as far as China

## Chorus

O Phoolabasiya — the courtyard is full of spring flowers
You and I will go play the drums
O Phoolabasiya — the courtyard is full of spring flowers
You and I will go play the drums`,
  },
  {
    slug: "thar-gori-jamuna-hilore-boodram-holass",
    title: "Thar Gori Jamuna Hilore",
    order: 26,
    cue: "Classic chutney · Gari · Chutney Soca Monarch 2005",
    about:
      "Boodram Holass premiered Thar Gori Jamuna Hilore at the 2005 Chutney Soca Monarch competition in Trinidad and Tobago. It belongs to the gari style — jokes and harmless teasing of family — here a young woman loses her earring to a thieving fish in the Jamuna, and her in-laws start searching. A favourite for the kangan / kakkan ceremony after a Hindu wedding.",
    artist: "Boodram Holass",
    audio_url: "/audio/chutney/thar-gori-jamuna-hilore-boodram-holass.mp3",
    thumbnail_url: "/images/chutney/thar-gori-jamuna-hilore-boodram-holass.jpg",
    cover_url: "/images/chutney/thar-gori-jamuna-hilore-boodram-holass.jpg",
    sections: ["chutney"],
    search_tags: [
      "thar gori",
      "thar gori jamuna hilore",
      "thar gori jummunai",
      "jummunai",
      "jamuna hilore",
      "jhulaniya",
      "machaliya",
      "boodram holass",
      "budram holass",
      "gari",
      "kangan",
      "kakkan",
    ],
    roman_lyrics: `## Refrain

Thar gori Jamuna hilore
Jhulaniya lege machaliya

## Verse 1

Saas more khoje, sasur khojawawe
Saiyan lagaawe mahajaal
Jhulaniya lege machaliya

## Verse 2

Jeth more khoje, jethani khojawawe
Saiyan lagaawe mahajaal
Jhulaniya lege machaliya

## Verse 3

Dewar more khoje, devrani khojawawe
Saiyan lagaawe mahajaal
Jhulaniya lege machaliya`,
    translation: `## Refrain

The beautiful girl went by the waves of the Jamuna
A fish came by and took her earring

## Verse 1

Her mother-in-law searches, her father-in-law searches
Her beloved casts a giant fishing net
A fish came by and took her earring

## Verse 2

Her elder brother-in-law searches, her elder sister-in-law searches
Her beloved casts a giant fishing net
A fish came by and took her earring

## Verse 3

Her younger brother-in-law searches, her younger sister-in-law searches
Her beloved casts a giant fishing net
A fish came by and took her earring`,
  },
];

export function folkQueueTracks(section: FolkSection): QueueTrack[] {
  const songs = section === "wedding" ? getWeddingSongs() : getChutneySorted();
  return songs.map((s) => {
    const { audioUrl, youtubeEmbedUrl: yt } = primaryQueueMedia(s);
    return {
      slug: s.slug,
      title: s.title,
      artist: s.artist ?? null,
      href: `/${section}/${s.slug}?autoplay=1`,
      kind: audioUrl ? "audio" : yt ? "youtube" : "audio",
      audioSrc: audioUrl,
      videoSrc: null,
      youtubeEmbedUrl: yt,
      cover: s.cover_url ?? s.thumbnail_url ?? null,
      miniCover: s.thumbnail_url ?? s.cover_url ?? null,
    };
  });
}

export function getChutneySong(slug: string): ChutneySong | null {
  return CHUTNEY_SONGS.find((s) => s.slug === slug) ?? null;
}

export function getChutneySorted(): ChutneySong[] {
  return [...CHUTNEY_SONGS]
    .filter((s) => inSection(s, "chutney"))
    .sort((a, b) => {
      const byTitle = a.title.localeCompare(b.title, undefined, {
        sensitivity: "base",
      });
      if (byTitle !== 0) return byTitle;
      return (a.artist ?? "").localeCompare(b.artist ?? "", undefined, {
        sensitivity: "base",
      });
    });
}

export function getWeddingSongs(): ChutneySong[] {
  return [...CHUTNEY_SONGS]
    .filter((s) => inSection(s, "wedding"))
    .sort((a, b) => a.order - b.order || a.title.localeCompare(b.title));
}

/** Search Traditional Chutney only (not All Bhajans / artists). */
export function searchChutney(query: string): ChutneySong[] {
  const q = query.trim();
  if (!q) return [];

  return getChutneySorted().filter((s) => {
    const haystack = [
      s.title,
      s.cue,
      s.artist,
      s.roman_lyrics,
      s.translation,
      s.slug.replace(/-/g, " "),
      ...(s.search_tags ?? []),
      "chutney",
      "traditional chutney",
    ]
      .filter(Boolean)
      .join("\n");
    return matchesSearchQuery(haystack, q);
  });
}

export function searchWedding(query: string): ChutneySong[] {
  const q = query.trim();
  if (!q) return [];

  return getWeddingSongs().filter((s) => {
    const haystack = [
      s.title,
      s.cue,
      s.artist,
      s.roman_lyrics,
      s.translation,
      s.slug.replace(/-/g, " "),
      "wedding",
      "shaadi",
      "chutney",
    ]
      .filter(Boolean)
      .join("\n");
    return matchesSearchQuery(haystack, q);
  });
}

export function neighborsInChutney(slug: string): {
  prev: ChutneySong | null;
  next: ChutneySong | null;
  current: ChutneySong | null;
} {
  const all = getChutneySorted();
  const i = all.findIndex((s) => s.slug === slug);
  if (i < 0) return { prev: null, next: null, current: null };
  return {
    current: all[i] ?? null,
    prev: i > 0 ? all[i - 1]! : null,
    next: i < all.length - 1 ? all[i + 1]! : null,
  };
}

export function neighborsInWedding(slug: string): {
  prev: ChutneySong | null;
  next: ChutneySong | null;
  current: ChutneySong | null;
} {
  const all = getWeddingSongs();
  const i = all.findIndex((s) => s.slug === slug);
  if (i < 0) {
    // Fall back to full catalogue lookup so shared detail URLs still resolve
    const current = getChutneySong(slug);
    if (!current || !inSection(current, "wedding")) {
      return { prev: null, next: null, current: null };
    }
    return { prev: null, next: null, current };
  }
  return {
    current: all[i] ?? null,
    prev: i > 0 ? all[i - 1]! : null,
    next: i < all.length - 1 ? all[i + 1]! : null,
  };
}

/** Display name for chutney artist pages (strips “ · opening …” extras). */
export function chutneyArtistDisplayName(artist: string): string {
  return artist.split(" · ")[0]!.trim();
}

/** Performer names — splits “A X B” collaborations into separate artists. */
export function chutneyPerformerNames(artist: string): string[] {
  const base = chutneyArtistDisplayName(artist);
  const parts = base
    .split(/\s+X\s+/)
    .map((p) => p.trim())
    .filter(Boolean);
  return parts.length > 0 ? parts : [base];
}

/** Full performer line (e.g. “A X B”) for lists and players. */
export function chutneyPerformerCredit(artist: string | undefined): string | null {
  if (!artist?.trim()) return null;
  return chutneyPerformerNames(artist).join(" X ");
}

/** Artist line for lists and search — performers plus optional remixer. */
export function chutneyListingCredit(
  song: Pick<ChutneySong, "artist" | "remixer" | "cue">,
  fallback: string,
): string {
  const credit = chutneyPerformerCredit(song.artist);
  const remixer = song.remixer?.trim();
  if (credit && remixer) return `${credit} · remix ${remixer}`;
  return credit ?? song.cue ?? fallback;
}

export function chutneyArtistSlug(artist: string): string {
  return resolveArtistSlug(slugify(chutneyArtistDisplayName(artist)));
}

export type ChutneyArtist = {
  name: string;
  slug: string;
  songCount: number;
  /** Profile photo when known; otherwise first song thumbnail */
  photo_url: string | null;
  photo_fit?: "cover" | "contain" | "fill";
  /** Short bio from main artist profile when available */
  bio?: string | null;
  about?: string[];
  notes?: {
    title: string;
    body: string;
    address?: string;
    href?: string;
    linkLabel?: string;
  }[];
  live_clips?: {
    title: string;
    youtube_url?: string;
    video_url?: string;
    poster_url?: string;
  }[] | null;
  songs: ChutneySong[];
};

/** Artists from Traditional Chutney only — not the main /artists catalogue. */
export function getChutneyArtists(): ChutneyArtist[] {
  const bySlug = new Map<string, ChutneyArtist>();

  for (const song of getChutneySorted()) {
    if (!song.artist?.trim()) continue;
    for (const name of chutneyPerformerNames(song.artist)) {
      if (!name) continue;
      const slug = resolveArtistSlug(slugify(name));
      const existing = bySlug.get(slug);
      if (existing) {
        if (!existing.songs.some((s) => s.slug === song.slug)) {
          existing.songs.push(song);
          existing.songCount = existing.songs.length;
        }
        if (!existing.photo_url && song.thumbnail_url) {
          existing.photo_url = song.thumbnail_url;
        }
      } else {
        const profile = getArtistProfile(slug) ?? getArtistProfile(name);
        bySlug.set(slug, {
          name: profile?.name ?? name,
          slug,
          songCount: 1,
          photo_url: profile?.photo_url ?? song.thumbnail_url ?? null,
          photo_fit: profile?.photo_fit,
          bio: profile?.bio ?? null,
          about: profile?.about,
          notes: profile?.notes,
          live_clips: profile?.live_clips ?? null,
          songs: [song],
        });
      }
    }
  }

  return [...bySlug.values()].sort((a, b) =>
    a.name.localeCompare(b.name, undefined, { sensitivity: "base" })
  );
}

export function getChutneyArtist(slug: string): ChutneyArtist | null {
  const resolved = resolveArtistSlug(slug);
  return getChutneyArtists().find((a) => a.slug === resolved) ?? null;
}
