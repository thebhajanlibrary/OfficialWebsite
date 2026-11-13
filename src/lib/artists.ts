import { slugify } from "@/lib/utils";

export type ArtistProfile = {
  /** Canonical display name — always use the full respectful form */
  name: string;
  /** Short line for lists and cards */
  bio: string;
  /** Longer profile paragraphs for the artist page */
  about?: string[];
  /** Small titled notes (e.g. a mandir) */
  notes?: {
    title: string;
    body: string;
    address?: string;
    href?: string;
    linkLabel?: string;
  }[];
  /** Profile photo path under /public */
  photo_url?: string;
  /** cover for photos; contain for padded logos; fill for circular logos that already edge the square */
  photo_fit?: "cover" | "contain" | "fill";
  /** Live footage or short clips — shown on the artist page only when set */
  live_clips?: {
    title: string;
    youtube_url?: string;
    /** Local MP4/WebM under /public */
    video_url?: string;
    /** Optional poster for local video */
    poster_url?: string;
  }[];
};

/**
 * Known artists in the library. Keys are slugify(name).
 * Always use the full name (e.g. “Shri Prakash Gossai”, never shortened).
 */
export const ARTIST_PROFILES: Record<string, ArtistProfile> = {
  "harry-panday": {
    name: "Harry Panday",
    bio: "Beloved satsang singer whose renditions of classic bhajans and prayers are sung widely in the community.",
    photo_url: "/images/harry-panday.png",
  },
  "gt-vibez-soundcrew": {
    name: "GT ViBEZ SoundCrew",
    bio: "Guyanese sound crew known for high-energy remixes of classic bhajans and festival favourites — including the Hanuman Chalisa Mix and Bhajan Mawdness.",
    photo_url: "/images/gt-vibez-soundcrew.png",
    photo_fit: "fill",
  },

  "shreya-ghoshal": {
    name: "Shreya Ghoshal",
    bio: "Indian playback singer. Original Om Namah Shivaya vocals appear on the GT ViBEZ Party Mix remix (credited to GT ViBEZ SoundCrew; cover art only).",
    photo_url: "/images/om-namah-shivaya-shreya-ghoshal.png",
  },
  "taran-terence-sookbir": {
    name: "Taran Terence Sookbir",
    bio: "Indo-Caribbean devotional singer — known for Munni Munni (Kali Yatra) and Shiva devotionals including Lingashtakam.",
    photo_url: "/images/taran-terence-sookbir.png",
  },

  "surbhi-chahal": {
    name: "Surbhi Chahal",
    bio: "Devotional singer known for warm, heartfelt Ram bhajans and prarthanas.",
  },
  "sanjay-sankat": {
    name: "Sanjay Sankat",
    bio: "Devotional singer known for Durga Mata bhajans including Tum Vintee Suno.",
  },
  "pawan-sharma": {
    name: "Pawan Sharma",
    bio: "Devotional singer known for heartfelt bhajans including tracks from Tere Dwar Khada Bhagwaan.",
  },
  "raj-barman": {
    name: "Raj Barman",
    bio: "Indian playback and bhajan singer, known for popular modern renditions of classic prayers including the Hanuman Chalisa.",
    photo_url: "/images/raj-barman.png",
  },
  "hariharan": {
    name: "Hariharan",
    bio: "Renowned Indian classical and playback singer. His 1993 T-Series album Shree Hanuman Chalisa (Hanuman Ashtak), with music by Lalit Sen, is one of the most widely heard Chalisa recordings.",
    photo_url: "/images/hariharan.png",
  },
  "hemant-kumar": {
    name: "Hemant Kumar",
    bio: "Legendary Indian singer and music director (1920–1989). Favourites here include Bhagwat Bhagwan Ki Hai Aarti from Bhagwat Mahima.",
  },
  "sonu-nigam": {
    name: "Sonu Nigam",
    photo_url: "/images/sonu-nigam.jpg",
    bio: "Indian playback singer. Favourites here include Ram Siya Ram (Mangal Bhavan / Ramayan chaupai).",
  },
  "amit-trivedi": {
    name: "Amit Trivedi",
    photo_url: "/images/amit-trivedi.jpg",
    bio: "Indian composer and singer. Favourites here include Namo Namo from Kedarnath.",
  },
  "anup-jalota": {
    name: "Anup Jalota",
    bio: "The Bhajan Samrat — legendary Indian ghazal and bhajan singer whose Shiva and Krishna devotionals are staples of satsang across the diaspora.",
    photo_url: "/images/anup-jalota.png",
  },
  "agam-aggarwal": {
    name: "Agam Aggarwal",
    bio: "Devotional singer known for Shiva bhajans including Shambhu Nath.",
    photo_url: "/images/shambhu-nath-agam-v2-square.png",
  },
  "hariom-sharad": {
    name: "Hariom Sharad",
    bio: "Devotional singer. Favourites here include Aarti Kunj Bihari Ki.",
  },
  "hari-om-sharan": {
    name: "Hari Om Sharan",
    bio: "Beloved bhajan singer (1932–2007) whose sweet, mellow voice shaped satsang singing across India and the diaspora. Known for Pushpanjali, Premanjali, Sumiran, and classic aartis with Nandini Sharan.",
    photo_url: "/images/hari-om-sharan.png",
  },
  "nandini-sharan": {
    name: "Nandini Sharan",
    bio: "Devotional singer and partner of Hari Om Sharan; together they recorded beloved aarti and vandana albums including Aarti Archan.",
    photo_url: "/images/nandini-sharan-profile.png",
  },
  "hari-om-sharan-nandini-sharan": {
    name: "Hari Om Sharan & Nandini Sharan",
    bio: "Husband-and-wife bhajan duo whose aartis and vandanás — including the 1982 HMV album Aarti Archan — remain staples of satsang across the diaspora.",
    photo_url: "/images/hari-om-sharan-nandini-sharan.png",
  },
  "payal-dev": {
    name: "Payal Dev",
    bio: "Indian playback and independent singer — known for contemporary film songs and modern Ram bhajans including Rama Rama Ratate Ratate (lyrics Manoj Muntashir).",
  },
  "jagjit-singh": {
    name: "Jagjit Singh",
    photo_url: "/images/jagjit-singh.jpg",
    bio: "Legendary ghazal and bhajan singer (1941–2011). His soft, measured voice carried classic devotionals including Jai Radha Madhav, Gaiye Ganapati Jagvandan, and many Saregama recordings into satsang and home listening alike.",
  },
  "shri-prakash-gossai": {
    name: "Shri Prakash Gossai",
    bio: "Guyanese-born Hindu leader, Pandit, and melodic bhajan singer (1953–2009), known as the Singing Pandit. He founded Bhuvaneshwar Mandir and shared Ramayana teachings through satsang across the diaspora — including his Hanuman Chalisa.",
    photo_url: "/images/shri-prakash-gossai.png",
    notes: [
      {
        title: "Bhuvaneshwar Mandir",
        body: "Founded by Shri Prakash Gossai in 1984 on the principles of bhakti and gyaan (devotion and knowledge), Bhuvaneshwar Mandir is a place of satsang, teaching, and community.",
        address: "86-06 101st Ave, Ozone Park, NY 11416, USA",
        href: "https://www.bmny.org/",
        linkLabel: "Visit bmny.org",
      },
    ],
  },
  "acharya-arun-gossai": {
    name: "Acharya Arun Gossai",
    bio: "Acharya and kirtan / bhajan singer — also listed in some catalogues as Arun Gossai. The album Kirtan Yoga gathers Krishna, Ram, and Mother devotionals for satsang.",
    photo_url: "/images/acharya-arun-gossai.png",
  },
  "pandit-lal-singh": {
    name: "Pandit Lal Singh",
    bio: "Bhajan and kirtan singer. The album Jai Shri Krishna gathers Krishna devotionals for satsang.",
    photo_url: "/images/pandit-lal-singh.png",
  },
  "pandit-rajin": {
    name: "Pandit Rajin",
    bio: "Guyanese pandit and devotional singer — known for Shiva Lingam (Lingashtakam with the Dwadasha Jyotirlinga mantra).",
    photo_url: "/images/pandit-rajin.png",
  },
  "rajin-balgobind": {
    name: "Rajin Balgobind",
    bio: "Indo-Caribbean bhajan singer — known for the Ganesh praise Jai Jai Ganapati.",
  },
  "vp-premier": {
    name: "VP Premier",
    bio: "Indo-Caribbean producer and remixer. Let's Play Holi (Zone) collects Holi remixes of favourite festival songs.",
    photo_url: "/images/vp-premier.png",
    photo_fit: "contain",
  },
  "terry-gajraj": {
    name: "Terry Gajraj",
    bio: "Guyanese chutney and Holi singer, known for festive favourites including Holi Khelai Raghuveera.",
    photo_url: "/images/terry-gajraj.png",
  },
  "pt-chunelall-narine": {
    name: "Pt. Chunelall Narine",
    bio: "Indo-Caribbean pandit and bhajan singer — Mata bhajans including Maa Ne Hamko Pyaar, and Phagwah recordings with Jharna Mukherjee.",
  },
  "kumar-vishu": {
    name: "Kumar Vishu",
    bio: "Devotional singer known for T-Series keertan, including Govind Bolo Hari Gopal Bolo.",
  },
  "babla-kanchan": {
    name: "Babla & Kanchan",
    bio: "Indo-Caribbean chutney duo. Kanchan’s voice and Babla’s arrangements made Holi and wedding favourites like Oh maro maro pichakari and Radhā Kanhaiyā staples across the West Indies.",
    photo_url: "/images/babla-kanchan.png",
  },
  "anand-yankaran": {
    name: "Anand Yankaran",
    bio: "Trinidadian chutney singer of the Yankaran family. Favourites here include the Krishna chutney-bhajan Nanda Baba.",
    photo_url: "/images/anand-yankaran-close.png",
  },
  "rakesh-yankaran": {
    name: "Rakesh Yankaran",
    bio: "Trinidadian chutney and chutney-bhajan singer of the Yankaran family — Hanuman, Ram, and Krishna devotionals for satsang, including Sona Sona Lagay and Jai Jai Bajrangi.",
    photo_url: "/images/rakesh-yankaran.png",
  },
  unknown: {
    name: "Unknown",
    bio: "Singer not credited on this recording.",
  },
  "boodram-holass": {
    name: "Boodram Holass",
    photo_url: "/images/boodram-holass.jpg",
    bio: "Indo-Trinidadian chutney and classical singer from Cedros — known for the gari classic Thar Gori Jamuna Hilore (Chutney Soca Monarch 2005), and bhajans such as Aaye Bhi Akela.",
  },
  "roshan-ji": {
    name: "Roshan Ji",
    bio: "Contemporary bhajan singer — known for the nirgun-style warning song Dagar Hai Mushkil Kathin Safar Hai.",
  },
  "vishnupant-pagnis": {
    name: "Vishnupant Pagnis",
    bio: "Indian actor-singer (1892–1943), famous as Sant Tukaram on screen — sang the classic Prabhu Ji Mere Aao from Bhakta Raj (1943).",
  },
  "neha-kakkar": {
    name: "Neha Kakkar",
    bio: "Indian playback singer; her acoustic Mother’s Day cover of Tu Kitni Achhi Hai is a favourite tribute to mothers.",
  },
  "mukesh": {
    name: "Mukesh",
    bio: "Beloved Indian playback singer (1923–1976), the voice of countless film classics and non-film bhajans — including Prabhu Ka Naam Japo (Ravindra Jain).",
    photo_url: "/images/mukesh.jpg",
  },
  "kishore-kumar": {
    name: "Kishore Kumar",
    bio: "Legendary Indian playback singer, composer, and actor (1929–1987) — whose evergreen voice gave us timeless classics like the Rakhi anthem Phoolon Ka Taron Ka (Hare Rama Hare Krishna).",
    photo_url: "/images/phoolon-ka-taron-ka-thumb.jpg",
  },
  "nitin-mukesh": {
    name: "Nitin Mukesh",
    bio: "Indian playback singer, son of Mukesh — known for devotional recordings including Shree Ramchandra Kripalu Bhajman (Pushpanjali / Nehanjali Devotional, Saregama).",
  },
  "lata-mangeshkar": {
    name: "Lata Mangeshkar",
    bio: "Legendary Indian playback singer (1929–2022). Favourites here include her Shree Hanuman Chalisa, Tu Kitni Achhi Hai, the Raksha Bandhan classic Bhaiya Mere Rakhi Ke, and O Palanhare from Lagaan.",
    photo_url: "/images/lata-mangeshkar.png",
  },
  "udit-narayan": {
    name: "Udit Narayan",
    photo_url: "/images/udit-narayan.jpg",
    bio: "Indian playback singer. Favourites here include O Palanhare from Lagaan with Lata Mangeshkar.",
  },
  "usha-mangeshkar": {
    name: "Usha Mangeshkar",
    bio: "Legendary playback singer of the Mangeshkar family. Classic Saregama and film bhajans — including Jai He Mahalaxmi Maa and Hey Maha Laxmi Maa (Aayi Sharan).",
    photo_url: "/images/jai-he-mahalaxmi-maa-usha-mangeshkar.png",
  },
  "ankit-batra": {
    name: "Ankit Batra",
    bio: "Devotional singer associated with Art of Living — known for gentle Krishna and Ram bhajans including Achutam Keshavam and Hanuman Chalisa.",
    photo_url: "/images/ankit-batra-profile.png",
  },
  "anuradha-paudwal": {
    name: "Anuradha Paudwal",
    bio: "Indian playback and bhajan singer, known for classic aartis and devotionals including Om Jai Jagadish Hare.",
    photo_url: "/images/om-jai-jagdish-hare-anuradha-paudwal-square.png",
  },
  "maanya-arora": {
    name: "Maanya Arora",
    bio: "Devotional singer. Favourites here include Om Jai Jagadish Hare and Payo Ji Maine Ram Ratan Dhan Paayo.",
    photo_url: "/images/om-jai-jagdish-hare-maanya-arora-square.png",
  },
  "priyesh-dhoolab": {
    name: "Priyesh Dhoolab",
    bio: "Composer and singer of peaceful mantra and stotram settings — including a mellow Hanuman Chalisa and a Shiv Tandav Peace Prayer for Maha Shivratri.",
    photo_url: "/images/shiv-tandav-peace-prayer-square.png",
  },
  "shivam-rajaram": {
    name: "Shivam Rajaram",
    bio: "Dutch-born Surinamese Hindustani Baithak Gana and devotional singer (The Hague, Netherlands; Baithak Gana Group Natraj) — known for bringing a fresh, modern sound to traditional baithak gana, chutney, and bhajans including Hey Ganga Maiya.",
    photo_url: "/images/shivam-rajaram.png",
  },
  "mohammed-rafi": {
    name: "Mohammed Rafi",
    bio: "Legendary Indian playback singer (1924–1980). Favourites here include Suna Suna Lage Brij Ka Dham (Neelmani), Baar Baar Din Yeh Aaye, O Nanhe Se Farishte, and Jai Raghunandan Jai Siyaram (with Asha Bhosle).",
    photo_url: "/images/mohammed-rafi-mid.png",
  },
  "manna-dey": {
    name: "Manna Dey",
    bio: "Legendary Indian classical and playback singer (1919–2013), celebrated for heartfelt melodies including the evergreen father's blessing Tujhe Suraj Kahoon Ya Chanda (Ek Phool Do Mali, 1969).",
    photo_url: "/images/tujhe-suraj-kahoon-ya-chanda-thumb.jpg",
  },
  "asha-bhosle": {
    name: "Asha Bhosle",
    bio: "Legendary Indian playback singer. Favourites here include Jai Raghunandan Jai Siyaram (with Mohammed Rafi) from Gharana (1961).",
    photo_url: "/images/asha-bhosle.png",
  },
  ashine: {
    name: "Ashine",
    bio: "Singer of the chutney-style remix Kahwase Aye.",
    photo_url: "/images/ashine.png",
  },
  "ramdew-chaitoe": {
    name: "Ramdew Chaitoe",
    bio: "Surinamese baithak gana pioneer (1942–1994), known as the King of Suriname. His Traditional Chaitoe devotionals keep Ram and Krishna bhajans alive in Indo-Caribbean satsang.",
    photo_url: "/images/ramdew-chaitoe.png",
    live_clips: [
      {
        title: "Rare video of Ramdew Chaitoe live",
        youtube_url: "https://www.youtube.com/watch?v=QMmBHZN5cGU",
      },
      {
        title: "Ramdew Chaitoe Live, Indo Carribean '91",
        youtube_url: "https://www.youtube.com/watch?v=ZTfVk6qCxLs",
      },
      {
        title: "Ramdew Chaitoe Live @ Divali Festival 1988",
        youtube_url: "https://www.youtube.com/watch?v=eEHWXpU_Beg",
      },
    ],
  },
  dropati: {
    name: "Dropati",
    bio: "Shrimati Draupadi Srikant Upadhya (1921–1997) of Suriname — wedding chutney and chutney-bhajan singer. Favourites include Gauri Puja, Manika dhar jabiya (Lawa), Moray Gari Suno Maharaj, and the album Let's Sing & Dance with Dropati.",
    photo_url: "/images/dropati-profile.png",
    live_clips: [
      {
        title: "Dropati live",
        video_url: "/videos/artists/dropati-live.mp4",
        poster_url: "/images/artists/dropati-live-poster.jpg",
      },
    ],
  },
  "sundar-popo": {
    name: "Sundar Popo",
    bio: "The father of chutney (1943–2000). Born in Monkey Town, Barrackpore, Trinidad, he brought Indo-Caribbean wedding songs and hits like Nani and Nana, Pholourie Bina Chutney, and Scorpion Sting to calypso tents and the world stage.",
    photo_url: "/images/sundar-popo.png",
    photo_fit: "fill",
  },
  "sonny-mann": {
    name: "Sonny Mann",
    bio: "Trinidadian chutney singer — known for the comic wedding favourite Lootala (Lotela, tum lotela).",
    photo_url: "/images/chutney/lotela-sonny-mann.jpg",
  },
  "devanand-gattoo": {
    name: "Devanand Gattoo",
    bio: "Trinidadian chutney and chutney soca singer — 1999 Chutney Soca Monarch winner with Payaliya, from the album The Man of the Moment.",
    photo_url: "/images/chutney/payaliya-devanand-gattoo.jpg",
  },
  "suresh-maraj": {
    name: "Suresh Maraj",
    bio: "Trinidadian baithak and chutney singer — known for Vera (Beera) Hanuman on Pawan Putra Hanuman, and other satsang and chutney favourites.",
    photo_url: "/images/vera-hanuman-suresh-maraj-thumb.jpg",
  },
  "shyama-chitar": {
    name: "Shyama Chitar",
    bio: "Brahma Kumaris singer — known for the Shiva bhajan Andhiyare Sabhi Mit Rahe (Gyan Surya / Shiv Pyara Aa Gaya), with BK Mohan and Minu Purshottam.",
    photo_url: "/images/andhiyare-sabhi-mit-rahe-shyama-chitar-thumb.jpg",
  },
  "pundit-basdeo-jaikaran": {
    name: "Pundit Basdeo Jaikaran",
    bio: "Trinidadian pandit and satsang singer. The Laxmi Vandana album gathers Lakshmi prayers, Ramayan chaupai, Kewat bhajan, and Bam Bam Bhola for temple and home satsang.",
    photo_url: "/images/pundit-basdeo-jaikaran.png",
  },
  "rasika-dindial": {
    name: "Rasika Dindial",
    bio: "Celebrated Trinidadian traditional chutney singer and cultural icon, affectionately known as D' Rani (The Queen). Favourites include Gularie Kay Phool, Jing Ah Ling, Pong D Damadol, and classic wedding folk songs.",
    photo_url: "/images/chutney/gularie-kay-phool-rasika-dindial.jpg",
  },
  "rawytee-ramroop": {
    name: "Rawytee Ramroop",
    bio: "Indo-Caribbean chutney singer. Favourites here include the Paar Karo remix with Bidjwanwatie Chaitoe.",
    photo_url: "/images/rawytee-ramroop.png",
  },
  "mahendra-kapoor": {
    name: "Mahendra Kapoor",
    bio: "Indian playback singer (1934–2008). Favourites here include Durga Hai Meri Maa from Kranti, with Minoo Purushottam.",
  },
  "minoo-purushottam": {
    name: "Minoo Purushottam",
    bio: "Playback singer known for devotional and film duets, including Durga Hai Meri Maa from Kranti with Mahendra Kapoor.",
  },
  "darshan-raval": {
    name: "Darshan Raval",
    bio: "Gujarati singer and songwriter. Favourites here include Chogada from Loveyatri, with Asees Kaur.",
  },
  "asees-kaur": {
    name: "Asees Kaur",
    bio: "Playback singer. Favourites here include Chogada from Loveyatri, with Darshan Raval.",
  },
  "mohit-mangru": {
    name: "Mohit Mangru",
    bio: "Guyanese devotional singer from West Coast Berbice. Favourites here include Shri Ram Stuti Santan from the LP Love, Truth, Respect and Adoration.",
  },
  "kamlesh-barot": {
    name: "Kamlesh Barot",
    bio: "Gujarati folk singer known for timli and garba, including Fararar Eto Fare Re.",
  },
  "krishna-das": {
    name: "Krishna Das",
    photo_url: "/images/krishna-das.jpg",
    bio: "American kirtan singer. Favourites here include Jai Shiva Omkara, Om Jai Jagdish Hare, Om Namah Shivaya, Sri Ram Jai Ram, Baba Hanuman, and the Hanuman Chalisa.",
  },
  "radhika-das": {
    name: "Radhika Das",
    bio: "Kirtan singer. Favourites here include Radha Ramana Haribol.",
  },
  "geeta-rabari": {
    name: "Geeta Rabari",
    bio: "Gujarati folk and garba singer. Favourites here include Mari Mata Na Pagla, Khelo Khelo Re Bhavani Maa, and Kanudo Zilva Hendyo.",
  },
  "kinjal-dave": {
    name: "Kinjal Dave",
    bio: "Gujarati singer known for Navratri garba and the Jay Adhyashakti aarti to Ambe Maa.",
  },
  "umesh-barot": {
    name: "Umesh Barot",
    bio: "Gujarati singer. With Ishani Dave he sings Gori Tame Manda Lidha Mohi Raj from Saiyar Mori Re.",
  },
  "ishani-dave": {
    name: "Ishani Dave",
    bio: "Gujarati singer. Favourites here include Gori Tame Manda Lidha Mohi Raj and Maar To Mele.",
  },
  "osman-mir": {
    name: "Osman Mir",
    bio: "Gujarati folk and playback singer. Favourites here include Moti Veraana and Mor Bani Thanghat Kare.",
  },
  "aditya-gadhvi": {
    name: "Aditya Gadhvi",
    bio: "Gujarati folk singer. Garba favourites here include Karshan Bhagwan Chalya, Zulan Morali Vagi Re, and Halaji Tara Hath Vakhanu.",
  },
  "falguni-pathak": {
    name: "Falguni Pathak",
    photo_url: "/images/falguni-pathak.jpg",
    bio: "Singer known for Navratri garba. Favourites here include Indhana Vinvaa Gayi Thi More Saiyan.",
  },
  "aishwarya-majmudar": {
    name: "Aishwarya Majmudar",
    bio: "Gujarati singer. Favourites here include the garba Kesariyo.",
  },
  "kirtidan-gadhvi": {
    name: "Kirtidan Gadhvi",
    bio: "Gujarati folk singer. Favourites here include Gori Radha Ne Kalo Kaan from Wrong Side Raju.",
  },
  "k-j-yesudas": {
    name: "K. J. Yesudas",
    bio: "Indian playback singer. Favourites here include Nahi Chahiye Rang Mahal from College Girl, with Chandrani Mukherjee.",
  },
  "chandrani-mukherjee": {
    name: "Chandrani Mukherjee",
    bio: "Indian playback singer. With K. J. Yesudas she sings Nahi Chahiye Rang Mahal from College Girl.",
  },
  "sukhwinder-singh": {
    name: "Sukhwinder Singh",
    bio: "Indian playback singer. He sings the Ramayana recording of the Hanuman Chalisa with Diljit Dosanjh, Mohit Chauhan, Shankar Mahadevan, and Kailash Kher.",
  },
  "diljit-dosanjh": {
    name: "Diljit Dosanjh",
    photo_url: "/images/diljit-dosanjh.jpg",
    bio: "Indian singer. He sings the Ramayana recording of the Hanuman Chalisa with Sukhwinder Singh, Mohit Chauhan, Shankar Mahadevan, and Kailash Kher.",
  },
  "mohit-chauhan": {
    name: "Mohit Chauhan",
    bio: "Indian playback singer. He sings the Ramayana recording of the Hanuman Chalisa with Sukhwinder Singh, Diljit Dosanjh, Shankar Mahadevan, and Kailash Kher.",
  },
  "shankar-mahadevan": {
    name: "Shankar Mahadevan",
    bio: "Indian playback singer. He sings the Ramayana recording of the Hanuman Chalisa with Sukhwinder Singh, Diljit Dosanjh, Mohit Chauhan, and Kailash Kher.",
  },
  "kailash-kher": {
    name: "Kailash Kher",
    bio: "Indian playback singer. He sings the Ramayana recording of the Hanuman Chalisa with Sukhwinder Singh, Diljit Dosanjh, Mohit Chauhan, and Shankar Mahadevan.",
  },
  "rishab-rikhiram-sharma": {
    name: "Rishab Rikhiram Sharma",
    bio: "Sitarist and singer. Favourites here include the Diwali bhajan Rama Rama, filmed at Kusum Sarovar.",
  },
  "dewindersingh-sewnath": {
    name: "Dewindersingh Sewnath",
    photo_url: "/images/dewindersingh-sewnath.jpg",
    bio: "Chutney bhajan singer. His February 2024 Nahi Chahiye Rang Mahal is filed under Chutney Bhajan.",
  },
  "bidjwanwatie-chaitoe": {
    name: "Bidjwanwatie Chaitoe",
    bio: "Surinamese chutney and baithak gana singer of the Chaitoe family. Favourites include Karejwa me laage, Na Manu Na Manu, and the Paar Karo remix with Rawytee Ramroop.",
    photo_url: "/images/chutney/na-manu-na-manu-bidjanwatie-chaitoe.jpg",
  },
};

export function artistSlug(name: string): string {
  return slugify(name);
}

/** Alternate spellings / short forms → canonical ARTIST_PROFILES key */
const ARTIST_ALIASES: Record<string, string> = {
  "arun-gossai": "acharya-arun-gossai",
  "bidjanwatie-chaitoe": "bidjwanwatie-chaitoe",
};

export function resolveArtistSlug(slug: string): string {
  const key = slug.toLowerCase();
  return ARTIST_ALIASES[key] ?? key;
}

export function getArtistProfile(nameOrSlug: string): ArtistProfile | null {
  const slug = nameOrSlug.includes(" ")
    ? artistSlug(nameOrSlug)
    : nameOrSlug.toLowerCase();
  const resolved = resolveArtistSlug(slug);
  return ARTIST_PROFILES[resolved] ?? null;
}

export function canonicalArtistName(name: string): string {
  return getArtistProfile(name)?.name ?? name.trim();
}

/**
 * Real duos that stay one artist only (no member split).
 */
const DUO_ONLY_SLUGS = new Set(["babla-kanchan"]);

/**
 * Duo credits that also index under each member + the shared duo tag.
 * Shared songs appear on all three artist pages.
 */
const DUO_PLUS_MEMBERS: Record<string, string[]> = {
  "hari-om-sharan-nandini-sharan": [
    "Hari Om Sharan",
    "Nandini Sharan",
    "Hari Om Sharan & Nandini Sharan",
  ],
};

/**
 * Artist names for indexing and profile links.
 * - Babla & Kanchan → duo only
 * - Hari Om & Nandini → both individuals + shared duo tag
 * - Other “A & B” (e.g. Rafi & Asha) → two separate artists
 */
export function creditedArtistNames(
  artistVersion: string | null | undefined
): string[] {
  const raw = artistVersion?.trim();
  if (!raw) return [];

  const fullSlug = artistSlug(raw);

  if (DUO_ONLY_SLUGS.has(fullSlug)) {
    return [canonicalArtistName(raw)];
  }

  const shared = DUO_PLUS_MEMBERS[fullSlug];
  if (shared) {
    return uniqueArtistNames(shared);
  }

  const parts = raw
    .split(/\s+(?:&|and)\s+/i)
    .map((p) => p.trim())
    .filter(Boolean);

  if (parts.length <= 1) {
    return [canonicalArtistName(raw)];
  }

  return uniqueArtistNames(parts);
}

function uniqueArtistNames(parts: string[]): string[] {
  const seen = new Set<string>();
  const names: string[] = [];
  for (const part of parts) {
    const name = canonicalArtistName(part);
    const slug = artistSlug(name);
    if (!slug || seen.has(slug)) continue;
    seen.add(slug);
    names.push(name);
  }
  return names;
}
