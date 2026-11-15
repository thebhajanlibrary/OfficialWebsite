/**
 * A film recording is still listed, with its player and details.
 * Only a film-original lyric sheet waits for an authorised text.
 * Traditional and public-domain hymns are not listed here, even when a
 * film or a living singer has recorded them.
 */
const FILM_ORIGINAL_LYRIC_SLUGS = new Set([
  "gori-tame-manda-lidha-mohi-raj-umesh-barot",
  "dakla-bandish-projekt",
  "moti-veraana-osman-mir",
  "dholida-gangubai-kathiawadi",
  "mor-bani-thanghat-kare",
  "radha-ne-shyam-mali-jashe",
  "vaagyo-re-dhol-hellaro",
  "garbe-ki-raat-rahul-vaidya",
  "nagada-sang-dhol-baaje",
  "shubhaarambh-kai-po-che",
  "kesariyo-aishwarya-majmudar",
  "gori-radha-ne-kalo-kaan-kirtidan-gadhvi",
  "karshan-bhagwan-chalya-aditya-gadhvi",
  "indhana-vinvaa-gayi-falguni-pathak",
  "zulan-morali-vagi-re-aditya-gadhvi",
  "halaji-tara-hath-vakhanu-aditya-gadhvi",
  "maar-to-mele-ishani-dave",
  "odhani-made-in-china",
  "sanedo-made-in-china",
  "setum-bandhya-ramayana",
  "nadiya-na-piye-mohammed-rafi",
  "jai-shri-ram-do-akshar-mohammed-rafi",
  "chal-ud-ja-re-panchhi-mohammed-rafi",
  "ek-pyar-ka-nagma-sanam",
  "ek-pyar-ka-nagma-lofi-sachin-gupta",
  "kya-hua-tera-wada-pranav-chandran",
  "yeh-dosti-rahul-jain",
  "tu-kitni-achhi-hai-neha-kakkar",
  "bada-natkhat-hai-lata-mangeshkar",
  "tere-jaisa-yaar-kahan-kishore-kumar",
  "zindagi-ka-safar-kishore-kumar",
  "ae-malik-tere-bande-hum-lata-mangeshkar",
  "tujhe-sooraj-kahoon-ami-patel",
  "shyam-teri-bansi-pukare-arati-mukherjee",
]);

export function filmOriginalLyrics(slug: string): boolean {
  return FILM_ORIGINAL_LYRIC_SLUGS.has(slug);
}

/** True when the public page should wait for an authorised lyric text. */
export function lyricsNeedPermission(slug: string): boolean {
  return filmOriginalLyrics(slug);
}
