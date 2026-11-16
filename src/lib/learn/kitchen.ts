import type { VocabEntry } from "@/lib/learn/types";

/** Dictionary names are additional accepted names; the image sheet supplies the main labels. */
const DICTIONARY: Record<string, { page: number; names: string[]; english?: string; explanation?: string }> = {
  thariya: { page: 8, names: ["tari", "thali"] },
  lota: { page: 5, names: [], english: "Drinking vessel", explanation: "A rounded brass drinking vessel with a narrow neck and flared mouth." },
  kalchhul: { page: 3, names: ["daboo"] },
  simta: { page: 2, names: ["chimta"] },
  "dal-ghotani": { page: 4, names: ["ghotni"], explanation: "A wooden swizzle stick used when cooking dal, with small crossed prongs at one end." },
  tawa: { page: 8, names: [], english: "Roti griddle", explanation: "A flat, circular utensil for cooking roti. This reference shows two small side handles." },
  belna: { page: 1, names: [] },
  "sil-aur-lorha": { page: 5, names: ["lohra & sil"], explanation: "A stone grinding slab and roller used together to grind seasonings and make chokha." },
};

const ITEMS = [
  ["thariya", "Thariyā", "Brass plate", "A shallow brass plate with a broad rim."],
  ["lota", "Lotā", "Water vessel", "A rounded brass water vessel with a narrow neck and flared mouth."],
  ["chimmach", "Chīmmach", "Spoon", "A brass spoon with an oval bowl and a decorative flat handle."],
  ["hanriya", "Hanriyā", "Cooking pot", "A deep, open metal cooking pot without handles, as shown in the reference."],
  ["kalchhul", "Kalchhul", "Ladle", "A long-handled metal ladle with a round bowl."],
  ["simta", "Simtā", "Tongs", "A pair of long, narrow metal cooking tongs."],
  ["dal-ghotani", "Dāl ghotanī", "Dhal stirring stick", "A long wooden stirring stick with small crossed prongs at one end."],
  ["dabla", "Dablā", "Wooden paddle", "A narrow, flat wooden paddle that tapers towards one end."],
  ["tawa", "Tāwā", "Flat griddle", "A flat, dark cooking griddle with two small side handles, as shown in the reference."],
  ["belna", "Belnā", "Rolling pin", "A wooden rolling pin with a thick middle and a small handle at each end."],
  ["sil-aur-lorha", "Sil aur loṛhā", "Grinding slab and roller", "A rough stone grinding slab with a short, heavy stone roller."],
  ["okhri", "Okhṛī", "Mortar", "A wooden mortar shown with a pestle. The rest of this reference label is cut off; its full name is awaiting confirmation."],
] as const;

export const KITCHEN_UTENSILS: VocabEntry[] = ITEMS.map(([id, word, english, explanation]) => ({
  id, word,
  english: DICTIONARY[id]?.english ?? english,
  explanation: DICTIONARY[id]?.explanation ?? explanation,
  alternativeSpellings: [],
  acceptedNames: DICTIONARY[id]?.names ?? [],
  references: DICTIONARY[id] ? [{
    title: "Guyanese Hindi Dictionary — Kaveeta Sharma",
    page: `p. ${DICTIONARY[id].page}`,
    status: "verified",
  }] : [],
  category: "Traditional kitchen utensils",
  tags: ["kitchen", "utensil"],
  level: "beginner",
  language: "Caribistani (Caribbean Hindustani)",
  region: "Caribbean",
  image: { src: `/images/learn/kitchen/${id}.png`, alt: explanation },
  audioSrc: null,
  source: { title: "Kitchen vocabulary sheet supplied by the project owner", page: "/images/learn/kitchen/reference.jpg", status: "verified" },
}));
