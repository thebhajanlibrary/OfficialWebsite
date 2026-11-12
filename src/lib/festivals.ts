export type FestivalDate = {
  year: number;
  /** Format: YYYY-MM-DD */
  startDate: string;
  /** Format: YYYY-MM-DD (optional for single day festivals) */
  endDate?: string;
};

export type Festival = {
  id: string;
  name: string;
  hindiName?: string;
  tagline: string;
  description: string;
  deity: string;
  bhagwanSlug?: string;
  categorySlug?: string;
  gradient: {
    from: string;
    via: string;
    to: string;
    border: string;
    badgeBg: string;
    badgeText: string;
    accentText: string;
  };
  /** Curated song slugs from the library for this festival */
  featuredSongSlugs: string[];
  /** Search tags or fallback deity / occasion slugs */
  fallbackCategories?: string[];
  /** Dates for each calendar year */
  dates: FestivalDate[];
};

export const FESTIVALS: Festival[] = [
  {
    id: "raksha-bandhan",
    name: "Raksha Bandhan",
    hindiName: "रक्षाबंधन",
    tagline: "Celebrating Sacred Bonds of Love & Protection",
    description:
      "A cherished festival honouring the pure bond between brothers and sisters, with sacred rakhi threads, blessings, and devotional prayers for safety and happiness.",
    deity: "Lord Krishna & Draupadi / Subhadra",
    bhagwanSlug: "krishna",
    categorySlug: "raksha-bandhan",
    gradient: {
      from: "from-rose-500/15",
      via: "via-amber-500/10",
      to: "to-surface",
      border: "border-rose-500/30",
      badgeBg: "bg-rose-500/15",
      badgeText: "text-rose-700 dark:text-rose-300",
      accentText: "text-rose-600 dark:text-rose-400",
    },
    featuredSongSlugs: [
      "bhaiya-mere-rakhi-ke-lata-mangeshkar",
      "phoolon-ka-taron-ka-kishore-kumar",
    ],
    fallbackCategories: ["raksha-bandhan"],
    dates: [
      { year: 2024, startDate: "2024-08-19" },
      { year: 2025, startDate: "2025-08-09" },
      { year: 2026, startDate: "2026-08-28" },
      { year: 2027, startDate: "2027-08-17" },
      { year: 2028, startDate: "2028-08-05" },
      { year: 2029, startDate: "2029-08-24" },
      { year: 2030, startDate: "2030-08-13" },
    ],
  },
  {
    id: "janmashtami",
    name: "Shree Krishna Janmashtami",
    hindiName: "श्री कृष्ण जन्माष्टमी",
    tagline: "Appearance Day of Bhagwan Shree Krishna · Gokulashtami",
    description:
      "Celebrating the divine birth of Lord Krishna in Mathura with joyful singing of midnight bhajans, flute melodies, kirtans, and raas leela songs.",
    deity: "Shree Krishna & Radha",
    bhagwanSlug: "krishna",
    categorySlug: "janmashtami",
    gradient: {
      from: "from-amber-500/15",
      via: "via-yellow-500/10",
      to: "to-surface",
      border: "border-amber-500/35",
      badgeBg: "bg-amber-500/15",
      badgeText: "text-amber-800 dark:text-amber-300",
      accentText: "text-amber-600 dark:text-amber-400",
    },
    featuredSongSlugs: [
      "achutam-keshavam-ankit-batra",
      "yashomati-maiyya-kedar-pandit",
      "radha-kanhaiya-babla-kanchan",
      "jai-krishna-hare-shri-prakash-gossai",
      "kanha-moerlie-bedja-ramdew-chaitoe",
      "badi-der-bhai-nandlala-kedar-pandit",
      "nanda-baba-anand-yankaran",
      "brindaban-ka-krishna-kanhaiya-kedar-pandit",
      "kanha-kanhaiya-ray-pandit-lal-singh",
      "shyam-teri-bansi-kedar-pandit",
      "krishna-krishna-acharya-arun-gossai",
      "aisi-laagi-lagan-kedar-pandit",
    ],
    fallbackCategories: ["janmashtami", "krishna", "radha"],
    dates: [
      { year: 2024, startDate: "2024-08-26" },
      { year: 2025, startDate: "2025-08-16" },
      { year: 2026, startDate: "2026-09-04" },
      { year: 2027, startDate: "2027-08-25" },
      { year: 2028, startDate: "2028-08-13" },
      { year: 2029, startDate: "2029-09-01" },
      { year: 2030, startDate: "2030-08-21" },
    ],
  },
  {
    id: "ganesh-chaturthi",
    name: "Ganesh Chaturthi",
    hindiName: "गणेश चतुर्थी",
    tagline: "Welcoming Vighnaharta Bhagwan Ganesha with Joy & Aarti",
    description:
      "Auspicious 10-day celebration invoking Shri Ganesh, the remover of obstacles, supreme Lord of wisdom, auspicious beginnings, and arts.",
    deity: "Lord Ganesha",
    bhagwanSlug: "ganesh",
    categorySlug: "ganesh",
    gradient: {
      from: "from-orange-500/15",
      via: "via-amber-500/10",
      to: "to-surface",
      border: "border-orange-500/30",
      badgeBg: "bg-orange-500/15",
      badgeText: "text-orange-800 dark:text-orange-300",
      accentText: "text-orange-600 dark:text-orange-400",
    },
    featuredSongSlugs: [
      "jai-ganesh-harry-panday",
      "jai-jai-ganapati-rajin-balgobind",
      "gaiye-ganapati-jagvandan-jagjit-singh",
      "nish-din-namoon-ganpati-hari-om-sharan",
      "jai-jai-aarti-sab-mil-gaven-hari-om-sharan",
      "he-parmeshwar-vishwa-vidhaata-hari-om-sharan",
    ],
    fallbackCategories: ["ganesh", "prarthana", "aarti"],
    dates: [
      { year: 2024, startDate: "2024-09-07", endDate: "2024-09-17" },
      { year: 2025, startDate: "2025-08-27", endDate: "2025-09-06" },
      { year: 2026, startDate: "2026-09-14", endDate: "2026-09-24" },
      { year: 2027, startDate: "2027-09-04", endDate: "2027-09-14" },
      { year: 2028, startDate: "2028-08-23", endDate: "2028-09-02" },
      { year: 2029, startDate: "2029-09-11", endDate: "2029-09-21" },
      { year: 2030, startDate: "2030-09-01", endDate: "2030-09-11" },
    ],
  },
  {
    id: "navratri",
    name: "Shardiya Navratri & Durga Puja",
    hindiName: "शारदीय नवरात्रि एवं दुर्गा पूजा",
    tagline: "Nine Sacred Nights Honoring Maa Durga & Divine Shakti",
    description:
      "Celebrating the victory of good over evil with devotional garba, dandiya, chandi paath, and soulful hymns dedicated to the nine avatars of Maa Durga.",
    deity: "Maa Durga & Devi Bhavani",
    bhagwanSlug: "durga",
    categorySlug: "navratri",
    gradient: {
      from: "from-red-500/15",
      via: "via-rose-500/10",
      to: "to-surface",
      border: "border-red-500/30",
      badgeBg: "bg-red-500/15",
      badgeText: "text-red-800 dark:text-red-300",
      accentText: "text-red-600 dark:text-red-400",
    },
    featuredSongSlugs: [
      "jay-adhyashakti-aarti-kinjal-dave",
      "jai-ambe-maa-bolo-lata-mangeshkar",
      "mari-mata-na-pagla-jya-jya-thay-geeta-rabari",
      "durga-hai-meri-maa-mahendra-kapoor",
      "jai-jai-ambe-bhavani-maa-shri-prakash-gossai",
      "jai-ambe-durge-maiya-hari-om-sharan",
      "mateshwari-jagdambike-nandini-sharan",
      "jagambay-maiya-harry-panday",
      "keertan-jayati-jai-ambe-bhawani-hari-om-sharan",
      "chalo-bulawa-aaya-hai-kedar-pandit",
      "maiya-tere-dar-pe-acharya-arun-gossai",
    ],
    fallbackCategories: ["navratri", "durga", "kali"],
    dates: [
      { year: 2024, startDate: "2024-10-03", endDate: "2024-10-12" },
      { year: 2025, startDate: "2025-09-22", endDate: "2025-10-02" },
      { year: 2026, startDate: "2026-10-11", endDate: "2026-10-20" },
      { year: 2027, startDate: "2027-09-30", endDate: "2027-10-09" },
      { year: 2028, startDate: "2028-10-18", endDate: "2028-10-27" },
      { year: 2029, startDate: "2029-10-08", endDate: "2029-10-17" },
      { year: 2030, startDate: "2030-09-27", endDate: "2030-10-06" },
    ],
  },
  {
    id: "diwali",
    name: "Diwali · Deepavali & Lakshmi Puja",
    hindiName: "दीपावली एवं श्री महालक्ष्मी पूजन",
    tagline: "Festival of Lights · Welcoming Prosperity & Devotion",
    description:
      "Illuminating homes with diyas and welcoming Maha Lakshmi, Bhagwan Ganesha, and Bhagwan Ramchandra's return to Ayodhya with sacred aartis and prayers.",
    deity: "Maa Lakshmi, Ganesha & Lord Ram",
    bhagwanSlug: "lakshmi",
    categorySlug: "diwali",
    gradient: {
      from: "from-amber-500/20",
      via: "via-yellow-500/10",
      to: "to-surface",
      border: "border-amber-500/40",
      badgeBg: "bg-amber-500/20",
      badgeText: "text-amber-800 dark:text-amber-200",
      accentText: "text-amber-600 dark:text-amber-400",
    },
    featuredSongSlugs: [
      "om-jai-lakshmi-mata-prakash-gossai",
      "lakshmi-aarti-basdeo-jaikaran",
      "jai-he-mahalaxmi-maa-usha-mangeshkar",
      "hey-maha-laxmi-maa-usha-mangeshkar",
      "jai-lakshmi-kalyanji-maiya-nandini-sharan",
      "lakshmi-maiya-utaren-teri-aarti-hari-om-sharan",
      "hay-lakshmi-mata-daya-karo-basdeo-jaikaran",
      "jai-ganesh-harry-panday",
      "om-jai-jagdish-hare-anuradha-paudwal",
      "shree-ramchandra-kripalu-bhajman-nitin-mukesh",
    ],
    fallbackCategories: ["diwali", "lakshmi", "ganesh", "ram"],
    dates: [
      { year: 2024, startDate: "2024-10-31", endDate: "2024-11-01" },
      { year: 2025, startDate: "2025-10-20", endDate: "2025-10-21" },
      { year: 2026, startDate: "2026-11-08", endDate: "2026-11-09" },
      { year: 2027, startDate: "2027-10-29", endDate: "2027-10-30" },
      { year: 2028, startDate: "2028-10-17", endDate: "2028-10-18" },
      { year: 2029, startDate: "2029-11-05", endDate: "2029-11-06" },
      { year: 2030, startDate: "2030-10-26", endDate: "2030-10-27" },
    ],
  },
  {
    id: "gita-jayanti",
    name: "Gita Jayanti",
    hindiName: "गीता जयंती",
    tagline: "Sacred Dialogue of Srimad Bhagavad Gita on Kurukshetra",
    description:
      "Commemorating the auspicious day Lord Krishna imparted the timeless wisdom of the Bhagavad Gita to Arjuna, showing the path of Bhakti and Dharma.",
    deity: "Lord Krishna",
    bhagwanSlug: "krishna",
    categorySlug: "krishna",
    gradient: {
      from: "from-blue-500/15",
      via: "via-indigo-500/10",
      to: "to-surface",
      border: "border-blue-500/30",
      badgeBg: "bg-blue-500/15",
      badgeText: "text-blue-800 dark:text-blue-300",
      accentText: "text-blue-600 dark:text-blue-400",
    },
    featuredSongSlugs: [
      "achutam-keshavam-ankit-batra",
      "adjie-naath-kaise-arjun-ke-abhie-maan-ramdew-chaitoe",
      "jai-krishna-hare-shri-prakash-gossai",
      "krishna-krishna-acharya-arun-gossai",
      "bhagwat-bhagwan-ki-hai-aarti-hemant-kumar",
    ],
    fallbackCategories: ["krishna", "wisdom", "bhajan"],
    dates: [
      { year: 2024, startDate: "2024-12-11" },
      { year: 2025, startDate: "2025-12-01" },
      { year: 2026, startDate: "2026-12-20" },
      { year: 2027, startDate: "2027-12-09" },
      { year: 2028, startDate: "2028-11-27" },
      { year: 2029, startDate: "2029-12-16" },
      { year: 2030, startDate: "2030-12-06" },
    ],
  },
  {
    id: "makar-sankranti",
    name: "Makar Sankranti & Pongal",
    hindiName: "मकर संक्रांति एवं पोंगल",
    tagline: "Sun’s Holy Transit into Capricorn · Festival of Harvest & Warmth",
    description:
      "Celebrating the sun god Surya Bhagwan's northward journey (Uttarayan) with holy dips in the Ganga, sweets, charity, and gratitude for bountiful harvests.",
    deity: "Surya Bhagwan & Ganga Maiya",
    categorySlug: "morning-prayer",
    gradient: {
      from: "from-amber-500/15",
      via: "via-orange-500/10",
      to: "to-surface",
      border: "border-amber-500/30",
      badgeBg: "bg-amber-500/15",
      badgeText: "text-amber-800 dark:text-amber-300",
      accentText: "text-amber-600 dark:text-amber-400",
    },
    featuredSongSlugs: [
      "hey-ganga-maiya-shivam-rajaram",
      "chalo-re-man-ganga-pandit-lal-singh",
      "jaise-suraj-ki-garmi-kedar-pandit",
      "he-prabhu-anand-data",
    ],
    fallbackCategories: ["gratitude", "morning-prayer", "devotion"],
    dates: [
      { year: 2024, startDate: "2024-01-15" },
      { year: 2025, startDate: "2025-01-14" },
      { year: 2026, startDate: "2026-01-14" },
      { year: 2027, startDate: "2027-01-14" },
      { year: 2028, startDate: "2028-01-15" },
      { year: 2029, startDate: "2029-01-14" },
      { year: 2030, startDate: "2030-01-14" },
    ],
  },
  {
    id: "vasant-panchami",
    name: "Vasant Panchami & Saraswati Puja",
    hindiName: "बसंत पंचमी एवं सरस्वती पूजा",
    tagline: "Arrival of Spring & Homage to Maa Saraswati",
    description:
      "Dressed in auspicious yellow, devotees worship Goddess Saraswati, patron of wisdom, learning, music, poetry, and arts at the dawn of spring.",
    deity: "Maa Saraswati",
    bhagwanSlug: "saraswati",
    categorySlug: "saraswati",
    gradient: {
      from: "from-yellow-500/15",
      via: "via-amber-500/10",
      to: "to-surface",
      border: "border-yellow-500/30",
      badgeBg: "bg-yellow-500/15",
      badgeText: "text-yellow-800 dark:text-yellow-300",
      accentText: "text-yellow-600 dark:text-yellow-400",
    },
    featuredSongSlugs: [
      "he-prabhu-anand-data",
      "hum-ko-manki-shakti-kedar-pandit",
      "jyot-se-jyot-kedar-pandit",
    ],
    fallbackCategories: ["saraswati", "wisdom", "prarthana"],
    dates: [
      { year: 2024, startDate: "2024-02-14" },
      { year: 2025, startDate: "2025-02-02" },
      { year: 2026, startDate: "2026-01-23" },
      { year: 2027, startDate: "2027-02-11" },
      { year: 2028, startDate: "2028-01-31" },
      { year: 2029, startDate: "2029-02-19" },
      { year: 2030, startDate: "2030-02-08" },
    ],
  },
  {
    id: "maha-shivratri",
    name: "Maha Shivaratri",
    hindiName: "महाशिवरात्रि",
    tagline: "The Grand Night of Lord Shiva · Chanting, Abhishek & Fasting",
    description:
      "All-night devotional vigils and abhishekam celebrating Mahadeva Shiva and Maa Parvati, chanting Om Namah Shivaya for liberation and peace.",
    deity: "Lord Shiva & Maa Parvati",
    bhagwanSlug: "shiva",
    categorySlug: "shivratri",
    gradient: {
      from: "from-teal-500/15",
      via: "via-cyan-500/10",
      to: "to-surface",
      border: "border-teal-500/30",
      badgeBg: "bg-teal-500/15",
      badgeText: "text-teal-800 dark:text-teal-300",
      accentText: "text-teal-600 dark:text-teal-400",
    },
    featuredSongSlugs: [
      "lingashtakam-taran-terence-sookbir",
      "lingashtakam-dwadasha-jyotirlinga-pandit-rajin",
      "namo-mahadeo-shri-prakash-gossai",
      "om-namah-shivaya-shiv-dhun-agam-aggarwal",
      "shiv-bhola-bhandari-he-hari-om-sharan",
      "aaya-shivratri-tyohaar-hari-om-sharan",
      "om-namah-shivaya-mix-shreya-ghoshal",
      "shiva-aarti-remix",
      "shiv-tandav-peace-prayer-priyesh-dhoolab",
      "namo-namo-amit-trivedi",
      "shambhu-nath-agam-aggarwal",
      "om-jai-jai-mahadev-harry-panday",
      "jagar-bam-bam-bhola-basdeo-jaikaran",
      "kailashwasi-devta-dinanath-hain-hari-om-sharan",
      "jai-shankar-bhole-anup-jalota",
      "andhiyare-sabhi-mit-rahe-shyama-chitar",
    ],
    fallbackCategories: ["shivratri", "shiva"],
    dates: [
      { year: 2024, startDate: "2024-03-08" },
      { year: 2025, startDate: "2025-02-26" },
      { year: 2026, startDate: "2026-02-16" },
      { year: 2027, startDate: "2027-03-06" },
      { year: 2028, startDate: "2028-02-24" },
      { year: 2029, startDate: "2029-03-13" },
      { year: 2030, startDate: "2030-03-03" },
    ],
  },
  {
    id: "holi",
    name: "Holi & Phagwah",
    hindiName: "होली एवं फाग",
    tagline: "Festival of Colours · Chowtal Singing & Spring Joy",
    description:
      "Vibrant festival of colours commemorating Bhagwan Narasimha, Bhakta Prahlad, and Radha-Krishna’s joyous Phagwah celebrations with dholak, majeera, and chowtals.",
    deity: "Shree Radha-Krishna & Lord Narasimha",
    bhagwanSlug: "krishna",
    categorySlug: "holi",
    gradient: {
      from: "from-fuchsia-500/15",
      via: "via-pink-500/10",
      to: "to-surface",
      border: "border-fuchsia-500/30",
      badgeBg: "bg-fuchsia-500/15",
      badgeText: "text-fuchsia-800 dark:text-fuchsia-300",
      accentText: "text-fuchsia-600 dark:text-fuchsia-400",
    },
    featuredSongSlugs: [
      "holi-khelai-raghuveera",
      "oh-maro-maro-pichakari-babla-kanchan",
      "rang-barse-vp-premier-lets-play-holi",
      "gokula-chowtal-mahatma-gandhi-satsang",
      "horee-khalay-mahatma-gandhi-satsang",
      "rang-barse-chunelall-jharna",
      "holi-ayee-re-chunelall-jharna",
      "holi-khele-dj-shane-lets-play-holi",
    ],
    fallbackCategories: ["holi", "krishna"],
    dates: [
      { year: 2024, startDate: "2024-03-25" },
      { year: 2025, startDate: "2025-03-14" },
      { year: 2026, startDate: "2026-03-04" },
      { year: 2027, startDate: "2027-03-23" },
      { year: 2028, startDate: "2028-03-11" },
      { year: 2029, startDate: "2029-03-01" },
      { year: 2030, startDate: "2030-03-19" },
    ],
  },
  {
    id: "ram-navami",
    name: "Shree Ram Navami",
    hindiName: "श्री राम नवमी",
    tagline: "Appearance Day of Maryada Purushottam Lord Ram",
    description:
      "Celebrating the holy birth of Bhagwan Shree Ramchandra in Ayodhya with Akhand Ramayan paath, Ram Stutis, chaupais, and devotional kirtans.",
    deity: "Bhagwan Shree Ram & Sita Mata",
    bhagwanSlug: "ram",
    categorySlug: "ram-navami",
    gradient: {
      from: "from-amber-500/15",
      via: "via-orange-500/10",
      to: "to-surface",
      border: "border-amber-500/35",
      badgeBg: "bg-amber-500/15",
      badgeText: "text-amber-800 dark:text-amber-300",
      accentText: "text-amber-600 dark:text-amber-400",
    },
    featuredSongSlugs: [
      "shree-ramchandra-kripalu-bhajman-nitin-mukesh",
      "sri-rama-stuti-mohit-mangru",
      "shri-ram-stuti-acharya-arun-gossai",
      "payo-ji-mere-ram-ratan-dhan-payo",
      "jai-raghunandan-jai-siyaram-mohammed-rafi",
      "raghupati-raghav-rajaram-kedar-pandit",
      "ram-siya-ram-sonu-nigam",
      "aarti-kije-shri-raghuvar-ki-hari-om-sharan",
      "jinke-hriday-shriram-rame-hari-om-sharan",
      "shri-ram-tumhare-mandir-mein-acharya-arun-gossai",
      "ramayan-chaupai-basdeo-jaikaran",
    ],
    fallbackCategories: ["ram-navami", "ram", "sita"],
    dates: [
      { year: 2024, startDate: "2024-04-17" },
      { year: 2025, startDate: "2025-04-06" },
      { year: 2026, startDate: "2026-03-27" },
      { year: 2027, startDate: "2027-04-15" },
      { year: 2028, startDate: "2028-04-03" },
      { year: 2029, startDate: "2029-04-22" },
      { year: 2030, startDate: "2030-04-11" },
    ],
  },
  {
    id: "hanuman-jayanti",
    name: "Hanuman Jayanti",
    hindiName: "हनुमान जयंती",
    tagline: "Honouring Sankatmochan Bajrangbali Hanuman",
    description:
      "Celebrating the birth and endless devotion, strength, and courage of Lord Hanuman with Hanuman Chalisa chanting, Bajrang Baan, and Sundarkand paath.",
    deity: "Shree Hanuman Ji",
    bhagwanSlug: "hanuman",
    categorySlug: "hanuman-jayanti",
    gradient: {
      from: "from-orange-500/15",
      via: "via-red-500/10",
      to: "to-surface",
      border: "border-orange-500/35",
      badgeBg: "bg-orange-500/15",
      badgeText: "text-orange-800 dark:text-orange-300",
      accentText: "text-orange-600 dark:text-orange-400",
    },
    featuredSongSlugs: [
      "hanuman-chalisa-hariharan",
      "hanuman-chalisa-lata-mangeshkar",
      "hanuman-chalisa-shri-prakash-gossai",
      "cheer-ke-chaati-shri-prakash-gossai",
      "hanuman-chalisa-ankit-batra",
      "hanuman-chalisa-priyesh-dhoolab",
      "hanuman-chalisa-ramayana",
      "sankatmochan-hanuman-ashtak-hariharan",
      "bajrang-baan-hariharan",
      "bolo-jai-jai-bajrangi-rakesh-yankaran",
      "jai-jai-bole-hanuman-harry-panday",
      "vera-hanuman-suresh-maraj",
      "he-bajrangbali-hanuman-hariharan",
      "shree-hanuman-ji-ki-aarti-hariharan",
    ],
    fallbackCategories: ["hanuman-jayanti", "hanuman", "chalisa"],
    dates: [
      { year: 2024, startDate: "2024-04-23" },
      { year: 2025, startDate: "2025-04-12" },
      { year: 2026, startDate: "2026-04-02" },
      { year: 2027, startDate: "2027-04-20" },
      { year: 2028, startDate: "2028-04-09" },
      { year: 2029, startDate: "2029-04-28" },
      { year: 2030, startDate: "2030-04-18" },
    ],
  },
  {
    id: "guru-purnima",
    name: "Guru Purnima",
    hindiName: "गुरु पूर्णिमा",
    tagline: "Honouring the Sacred Lineage of Spiritual Teachers",
    description:
      "Full moon day expressing heartfelt gratitude to spiritual preceptors, sages, and teachers who guide the soul from darkness to the light of truth.",
    deity: "Guru Bhagwan & Sage Ved Vyasa",
    bhagwanSlug: "guru",
    categorySlug: "guru",
    gradient: {
      from: "from-amber-500/15",
      via: "via-yellow-500/10",
      to: "to-surface",
      border: "border-amber-500/30",
      badgeBg: "bg-amber-500/15",
      badgeText: "text-amber-800 dark:text-amber-300",
      accentText: "text-amber-600 dark:text-amber-400",
    },
    featuredSongSlugs: [
      "bandow-charan-harry-panday",
      "bandow-charana-kamal-ragunandan",
      "jyot-se-jyot-kedar-pandit",
      "he-prabhu-anand-data",
    ],
    fallbackCategories: ["guru", "wisdom", "devotion"],
    dates: [
      { year: 2024, startDate: "2024-07-21" },
      { year: 2025, startDate: "2025-07-10" },
      { year: 2026, startDate: "2026-07-29" },
      { year: 2027, startDate: "2027-07-18" },
      { year: 2028, startDate: "2028-07-06" },
      { year: 2029, startDate: "2029-07-25" },
      { year: 2030, startDate: "2030-07-15" },
    ],
  },
];

export type ActiveFestivalInfo = {
  festival: Festival;
  status: "today" | "active" | "upcoming";
  startDate: string;
  endDate: string;
  formattedDate: string;
  daysRemaining: number;
};

/** Parse YYYY-MM-DD into a UTC date timestamp */
function parseDateString(str: string): Date {
  const [year, month, day] = str.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day));
}

function formatDateDisplay(startDateStr: string, endDateStr?: string): string {
  const start = parseDateString(startDateStr);
  const options: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  };

  if (!endDateStr || endDateStr === startDateStr) {
    return start.toLocaleDateString("en-US", options);
  }

  const end = parseDateString(endDateStr);
  const startMonth = start.toLocaleDateString("en-US", { month: "short", timeZone: "UTC" });
  const endMonth = end.toLocaleDateString("en-US", { month: "short", timeZone: "UTC" });

  if (startMonth === endMonth) {
    return `${startMonth} ${start.getUTCDate()} – ${end.getUTCDate()}, ${end.getUTCFullYear()}`;
  }

  return `${startMonth} ${start.getUTCDate()} – ${endMonth} ${end.getUTCDate()}, ${end.getUTCFullYear()}`;
}

/**
 * Figure out if today is during a festival celebration window
 * or get the next upcoming festival.
 */
export function getCurrentOrUpcomingFestival(
  referenceDate?: Date
): ActiveFestivalInfo | null {
  const now = referenceDate ? new Date(referenceDate) : new Date();
  const todayUtc = new Date(
    Date.UTC(now.getFullYear(), now.getMonth(), now.getDate())
  );
  const currentYear = todayUtc.getUTCFullYear();

  // Search across previous year, current year, and next year
  const candidateOccurrences: {
    festival: Festival;
    startDate: string;
    endDate: string;
    start: Date;
    end: Date;
  }[] = [];

  for (const festival of FESTIVALS) {
    for (const d of festival.dates) {
      if (d.year >= currentYear - 1 && d.year <= currentYear + 1) {
        const start = parseDateString(d.startDate);
        const end = d.endDate ? parseDateString(d.endDate) : new Date(start);
        // Include full final day
        end.setUTCHours(23, 59, 59, 999);
        candidateOccurrences.push({
          festival,
          startDate: d.startDate,
          endDate: d.endDate || d.startDate,
          start,
          end,
        });
      }
    }
  }

  if (candidateOccurrences.length === 0) return null;

  // 1. Check if TODAY falls exactly within or on the celebration window (including 2 days before & 1 day after)
  // Check exact day matches first
  const exactMatches = candidateOccurrences.filter((item) => {
    return todayUtc.getTime() >= item.start.getTime() && todayUtc.getTime() <= item.end.getTime();
  });

  if (exactMatches.length > 0) {
    const match = exactMatches[0];
    return {
      festival: match.festival,
      status: "today",
      startDate: match.startDate,
      endDate: match.endDate,
      formattedDate: formatDateDisplay(match.startDate, match.endDate),
      daysRemaining: 0,
    };
  }

  // Check active window (within 2 days before the festival or 1 day after)
  const MS_PER_DAY = 24 * 60 * 60 * 1000;
  const activeWindowMatches = candidateOccurrences.filter((item) => {
    const daysUntilStart = Math.ceil((item.start.getTime() - todayUtc.getTime()) / MS_PER_DAY);
    const daysPastEnd = Math.floor((todayUtc.getTime() - item.end.getTime()) / MS_PER_DAY);
    return (daysUntilStart <= 3 && daysUntilStart > 0) || (daysPastEnd >= 0 && daysPastEnd <= 1);
  });

  if (activeWindowMatches.length > 0) {
    const match = activeWindowMatches[0];
    const daysUntil = Math.ceil((match.start.getTime() - todayUtc.getTime()) / MS_PER_DAY);
    return {
      festival: match.festival,
      status: "active",
      startDate: match.startDate,
      endDate: match.endDate,
      formattedDate: formatDateDisplay(match.startDate, match.endDate),
      daysRemaining: Math.max(0, daysUntil),
    };
  }

  // 2. Look for the next UPCOMING festival
  const upcoming = candidateOccurrences
    .filter((item) => item.start.getTime() > todayUtc.getTime())
    .sort((a, b) => a.start.getTime() - b.start.getTime());

  if (upcoming.length > 0) {
    const next = upcoming[0];
    const daysUntil = Math.ceil((next.start.getTime() - todayUtc.getTime()) / MS_PER_DAY);
    return {
      festival: next.festival,
      status: "upcoming",
      startDate: next.startDate,
      endDate: next.endDate,
      formattedDate: formatDateDisplay(next.startDate, next.endDate),
      daysRemaining: daysUntil,
    };
  }

  return null;
}

/** Get list of upcoming festivals for browse or calendar display */
export function getUpcomingFestivals(
  referenceDate?: Date,
  limit = 4
): ActiveFestivalInfo[] {
  const now = referenceDate ? new Date(referenceDate) : new Date();
  const todayUtc = new Date(
    Date.UTC(now.getFullYear(), now.getMonth(), now.getDate())
  );
  const currentYear = todayUtc.getUTCFullYear();
  const MS_PER_DAY = 24 * 60 * 60 * 1000;

  const list: ActiveFestivalInfo[] = [];

  for (const festival of FESTIVALS) {
    for (const d of festival.dates) {
      if (d.year >= currentYear && d.year <= currentYear + 1) {
        const start = parseDateString(d.startDate);
        const end = d.endDate ? parseDateString(d.endDate) : new Date(start);
        end.setUTCHours(23, 59, 59, 999);

        if (end.getTime() >= todayUtc.getTime()) {
          const daysUntil = Math.ceil((start.getTime() - todayUtc.getTime()) / MS_PER_DAY);
          let status: "today" | "active" | "upcoming" = "upcoming";
          if (todayUtc.getTime() >= start.getTime() && todayUtc.getTime() <= end.getTime()) {
            status = "today";
          } else if (daysUntil <= 3 && daysUntil > 0) {
            status = "active";
          }

          list.push({
            festival,
            status,
            startDate: d.startDate,
            endDate: d.endDate || d.startDate,
            formattedDate: formatDateDisplay(d.startDate, d.endDate),
            daysRemaining: Math.max(0, daysUntil),
          });
        }
      }
    }
  }

  return list
    .sort((a, b) => parseDateString(a.startDate).getTime() - parseDateString(b.startDate).getTime())
    .slice(0, limit);
}

export function getFestivalById(id: string): Festival | undefined {
  return FESTIVALS.find((f) => f.id === id);
}
