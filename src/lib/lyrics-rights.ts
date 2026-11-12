/**
 * Songs whose words are a living writer's, so the page waits for permission.
 * Shared hymns already in the library (Hanuman Chalisa, old aartis) are not listed.
 */
const LYRICS_PERMISSION_SLUGS = new Set([
  "radha-ramana-haribol-radhika-das",
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
]);

export function lyricsNeedPermission(slug: string): boolean {
  return LYRICS_PERMISSION_SLUGS.has(slug);
}
